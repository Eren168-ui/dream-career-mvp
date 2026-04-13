/**
 * 职业阶段文案配置
 * 三个阶段 × 三种风格（youth / professional / casual）
 *
 * 阶段：
 *   lost               — 迷茫没方向
 *   direction_no_target — 有方向，没目标
 *   clear_goal_no_action — 有明确目标，不知道怎么行动
 *
 * 风格：
 *   youth        — 年轻化、有共鸣感
 *   professional — 专业、严谨、直接
 *   casual       — 轻松、不说教
 */

export const CAREER_STAGE_COPY = {
  lost: {
    label: "迷茫没方向",
    badge: "探索期",
    color: "#F59E0B",
    variants: {
      youth: {
        headline: "不知道想做什么，很正常",
        body: "很多大三大四的同学，依然不知道自己\"真正想做什么\"。这不是你的问题，而是因为没有人真的告诉过你那些岗位实际是什么样的。迷茫本身不是终点，开始认真搞清楚才是起点。",
        cta: "先看看你感兴趣的岗位实际是什么",
      },
      professional: {
        headline: "方向未定，核心是收窄范围",
        body: "职业迷茫的本质是信息不足，而不是意志力不足。当前最有效的动作是：把你排除掉的岗位列出来，剩下的就是值得探索的范围。用排除法比用\"找到热爱\"快得多。",
        cta: "开始评估，缩小选项范围",
      },
      casual: {
        headline: "不知道干什么？先别焦虑，先来摸一摸",
        body: "大多数人选方向都是靠感觉+别人推荐。先了解清楚这 10 个岗位实际在干什么，再说喜不喜欢，别一上来就问自己\"你的passion是什么\"——那是个很难回答的问题。",
        cta: "随便先看看，不用做决定",
      },
    },
  },

  direction_no_target: {
    label: "有方向，没目标",
    badge: "聚焦期",
    color: "#3B82F6",
    variants: {
      youth: {
        headline: "知道大方向，但不知道自己该做到什么程度",
        body: "你知道自己想做产品/咨询/数据类的工作，但你不知道要进哪个公司、差什么能力、简历该怎么写。这一步，是从\"我觉得我适合\"到\"我有证据证明我能做\"的关键跳跃。",
        cta: "找到你和目标岗位之间的差距",
      },
      professional: {
        headline: "方向明确，差距分析是当前核心任务",
        body: "有了方向意味着你完成了最难的部分。现在需要的是：明确目标公司的招聘标准、把标准拆成当前具体的能力缺口、设计下一步可执行的补齐计划。",
        cta: "开始做你的差距分析",
      },
      casual: {
        headline: "方向有了，接下来得说清楚\"我凭什么去\"",
        body: "喜欢某个岗位是起点，但面试官要的是证据，不是感觉。现在该做的事情是：把你已有的经历翻出来，找那些能支撑\"我适合这个岗位\"的材料，然后补上缺的那块。",
        cta: "帮你找缺口，你来填",
      },
    },
  },

  clear_goal_no_action: {
    label: "有明确目标，不知道怎么行动",
    badge: "执行期",
    color: "#10B981",
    variants: {
      youth: {
        headline: "目标很清晰，现在卡在\"不知道从哪开始\"",
        body: "你知道你要做什么、想去哪里，但是面对一堆\"应该学这个\"\"应该做那个\"，你不知道优先顺序是什么。这时候最需要的不是更多信息，而是一份给你专属的、你现在就能执行的计划。",
        cta: "生成你的专属行动计划",
      },
      professional: {
        headline: "目标明确，执行路径需要优先级排序",
        body: "目标清晰是最好的起点。当前的核心工作是：把\"目标岗位需要什么\"拆成可量化的里程碑，结合你的当前资源（时间/经历/学历），给每个行动项标注优先级，而不是同时推进所有事情。",
        cta: "查看你的优先级行动清单",
      },
      casual: {
        headline: "目标有了，差一个能执行的计划",
        body: "知道目标但不动，是因为不知道第一步是什么。先把大目标拆成这学期、这个月、这周要做的事，然后从最小的一步开始——不是等一切准备好了再开始。",
        cta: "拆一个你下周就能开始的计划",
      },
    },
  },
};

/**
 * 获取某阶段的某种风格文案
 * @param {string} stage - "lost\" | \"direction_no_target\" | \"clear_goal_no_action"
 * @param {string} [variant] - "youth\" | \"professional\" | \"casual\"，默认 \"youth"
 */
export function getStageCopy(stage, variant = "youth") {
  const stageData = CAREER_STAGE_COPY[stage];
  if (!stageData) return null;
  return {
    label: stageData.label,
    badge: stageData.badge,
    color: stageData.color,
    ...stageData.variants[variant],
  };
}

/** 获取所有阶段的标签列表（用于下拉/选择器） */
export function getCareerStageOptions() {
  return Object.entries(CAREER_STAGE_COPY).map(([value, data]) => ({
    value,
    label: data.label,
    badge: data.badge,
    color: data.color,
  }));
}
