// functions/api/bitable.js
// Cloudflare Pages Function — 飞书多维表格写入 + 群机器人通知

const GRADE_MAP = {
  freshman: "大一", sophomore: "大二", junior: "大三", senior: "大四",
  graduate: "研究生", graduated: "已毕业",
};
const OVERSEAS_MAP = { yes: "有明确意向", maybe: "考虑中", no: "暂无" };
const TYPE_MAP = { consultation: "预约咨询", case: "领取案例", diagnosis: "简历诊断" };
const TIME_PREF_MAP = {
  weekday_evening: "工作日晚上", weekday_daytime: "工作日白天",
  weekend: "周末", flexible: "灵活",
};
const RESUME_STAGE_MAP = {
  no_resume: "还没有简历", draft_resume: "已有简历初稿", applied_resume: "已经投递过",
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

// 提交时间用于群通知展示（格式化字符串）
function formatSubmittedAt(iso) {
  try {
    return new Date(iso).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
  } catch {
    return iso;
  }
}

// 来源页面：提取路径短标签，适合 SingleSelect 列
const SOURCE_LABEL_MAP = {
  "/consultation": "咨询承接页",
  "/resume-cases": "案例领取页",
  "/resume-diagnosis-bridge": "诊断入口页",
  "/result": "结果页",
  "/report": "报告页",
  "/start": "导航页",
  "/": "首页",
};

function resolveSourceLabel(sourceUrl) {
  try {
    const pathname = new URL(sourceUrl).pathname;
    return SOURCE_LABEL_MAP[pathname] ?? (pathname || "未知页面");
  } catch {
    return sourceUrl || "未知页面";
  }
}

function buildBitableFields(payload) {
  const extra = payload.extra ?? {};
  const fields = {};

  function set(key, value) {
    const v = value == null ? "" : String(value).trim();
    if (v) fields[key] = v;
  }

  set("线索类型", TYPE_MAP[payload.type] ?? payload.type);
  set("姓名", payload.name);
  set("联系方式", payload.wechat);
  set("目标岗位", payload.role_name);
  set("当前年级", GRADE_MAP[payload.grade] ?? payload.grade);
  set("留学意向", OVERSEAS_MAP[payload.overseas_intent] ?? payload.overseas_intent);
  if (payload.assessment_score != null) {
    fields["评估得分"] = Number(payload.assessment_score) || 0;
  }
  set("匹配度标签", payload.assessment_label);
  set("当前问题", payload.note);
  // 提交时间：DateTime 列要求 Unix ms 时间戳
  try {
    fields["提交时间"] = new Date(payload.submitted_at).getTime();
  } catch { /* skip */ }
  // 来源页面：SingleSelect 列，写短标签
  set("来源页面", resolveSourceLabel(payload.source_url));

  if (payload.type === "consultation") {
    set("空档时间", TIME_PREF_MAP[extra.time_preference] ?? extra.time_preference);
    set("咨询主题", extra.consult_topic);
  } else if (payload.type === "case") {
    set("案例匹配", extra.case_matched);
  } else if (payload.type === "diagnosis") {
    set("目标公司类型", extra.company_type);
    set("简历阶段", RESUME_STAGE_MAP[extra.resume_stage] ?? extra.resume_stage);
    set("诊断重点", extra.diagnosis_focus);
    set("简历文件", extra.resume_file_url);
  }

  fields["跟进状态"] = "未跟进";
  return fields;
}

function buildNotificationCard(payload) {
  const type = TYPE_MAP[payload.type] ?? payload.type;
  const grade = GRADE_MAP[payload.grade] ?? payload.grade;
  const overseas = OVERSEAS_MAP[payload.overseas_intent] ?? payload.overseas_intent;
  const extra = payload.extra ?? {};

  let extraLine = "";
  if (payload.type === "consultation") {
    extraLine = `咨询主题：${extra.consult_topic || "未填写"}\n空档时间：${TIME_PREF_MAP[extra.time_preference] || extra.time_preference || "未填写"}`;
  } else if (payload.type === "case") {
    extraLine = `案例匹配：${extra.case_matched || "未填写"}`;
  } else {
    extraLine = `简历阶段：${RESUME_STAGE_MAP[extra.resume_stage] || extra.resume_stage || "未填写"}\n诊断重点：${extra.diagnosis_focus || "未填写"}`;
  }

  const content = [
    `**类型：** ${type}`,
    `**姓名：** ${payload.name || "未填写"}`,
    `**联系方式：** ${payload.wechat || "未填写"}`,
    `**目标岗位：** ${payload.role_name || "未指定"}`,
    `**年级：** ${grade}`,
    `**留学意向：** ${overseas}`,
    `**评估得分：** ${payload.assessment_score ?? "—"} · ${payload.assessment_label || "—"}`,
    `**当前问题：** ${payload.note || "未填写"}`,
    extraLine,
    `**提交时间：** ${formatSubmittedAt(payload.submitted_at)}`,
  ].filter(Boolean).join("\n");

  return {
    msg_type: "interactive",
    card: {
      header: {
        title: { tag: "plain_text", content: `📋 新线索 · ${type}` },
        template: "blue",
      },
      elements: [{ tag: "div", text: { tag: "lark_md", content } }],
    },
  };
}

export async function onRequestPost(context) {
  const env = context.env;
  const APP_ID = env.FEISHU_APP_ID;
  const APP_SECRET = env.FEISHU_APP_SECRET;
  const APP_TOKEN = env.FEISHU_BITABLE_APP_TOKEN;
  const TABLE_ID = env.FEISHU_BITABLE_TABLE_ID;
  const BOT_WEBHOOK = env.FEISHU_BOT_WEBHOOK_URL || "";

  // 未配置飞书凭证时，返回 200 让前端视为成功（本地存储已保存）
  if (!APP_ID || !APP_SECRET || !APP_TOKEN || !TABLE_ID) {
    return new Response(
      JSON.stringify({ success: true, mode: "unconfigured", message: "飞书配置未设置，本次提交已保存到前端本地存储。" }),
      { headers: CORS_HEADERS }
    );
  }

  try {
    const payload = await context.request.json();

    // 1. 获取飞书 tenant_access_token
    const tokenRes = await fetch(
      "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET }),
      }
    );
    const tokenData = await tokenRes.json();
    if (tokenData.code !== 0) {
      return new Response(
        JSON.stringify({ error: "获取飞书令牌失败", detail: tokenData }),
        { status: 500, headers: CORS_HEADERS }
      );
    }
    const token = tokenData.tenant_access_token;

    // 2. 写入多维表格
    const fields = buildBitableFields(payload);
    const recordRes = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ fields }),
      }
    );
    const recordData = await recordRes.json();
    if (recordData.code !== 0) {
      return new Response(
        JSON.stringify({ error: "写入多维表格失败", detail: recordData }),
        { status: 500, headers: CORS_HEADERS }
      );
    }

    // 3. 异步推送群机器人通知（失败不影响主流程）
    if (BOT_WEBHOOK) {
      context.waitUntil(
        fetch(BOT_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildNotificationCard(payload)),
        }).catch(() => {})
      );
    }

    return new Response(
      JSON.stringify({ success: true, mode: "feishu", record_id: recordData.data?.record?.record_id }),
      { headers: CORS_HEADERS }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "服务器错误", detail: err.message }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

// CORS 预检
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
