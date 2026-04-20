const scaleOptions = [
  { value: "rarely", label: "很少符合", score: 1 },
  { value: "sometimes", label: "偶尔符合", score: 2 },
  { value: "often", label: "经常符合", score: 3 },
  { value: "always", label: "非常符合", score: 4 },
];

const scenarioChoiceOptions = [
  { value: "rarely", label: "A. 我多半会先按自己的直觉直接处理，做到一半再看哪里不对", score: 1 },
  { value: "sometimes", label: "B. 我会先补一个最关键的信息点，但整体还是边做边试", score: 2 },
  { value: "often", label: "C. 我会先把目标、限制条件和交付标准理清，再开始推进", score: 3 },
  { value: "always", label: "D. 我会先把背景、风险和下一步动作都梳理清楚，并和相关人对齐后再推进", score: 4 },
];

const coordinationChoiceOptions = [
  { value: "rarely", label: "A. 我容易先带着情绪回应，或者直接去找上级/别人替我解决", score: 1 },
  { value: "sometimes", label: "B. 我会先表达不满或催进度，但不一定先弄清真正卡点", score: 2 },
  { value: "often", label: "C. 我会先了解对方卡在哪里，再一起商量怎么往前推", score: 3 },
  { value: "always", label: "D. 我会先梳理影响范围、卡点和可用资源，再私下沟通对齐，必要时才升级处理", score: 4 },
];

const HARD_TERM_REPLACEMENTS = [
  [/竞品/u, "竞品（和你们对标的同类产品）"],
  [/边界/u, "边界（这件事做到哪里、哪些不做）"],
  [/优先级/u, "优先级（眼下先做哪件事更重要）"],
  [/资源问题/u, "资源问题（人手、时间或支持不够）"],
  [/\bPRD\b/u, "PRD（需求文档）"],
  [/\bBug\b/u, "Bug（程序问题）"],
  [/\bSQL\b/u, "SQL（查数据的语言）"],
  [/\bCTA\b/u, "CTA（引导用户点击或行动的话术）"],
  [/\bROI\b/u, "ROI（投入产出回报）"],
  [/\bGMV\b/u, "GMV（成交总额）"],
  [/\bMCU\b/u, "MCU（微控制器）"],
  [/\bSoC\b/u, "SoC（系统级芯片）"],
  [/\bJTAG\b/u, "JTAG（硬件调试接口）"],
  [/\bGDB\b/u, "GDB（调试工具）"],
  [/\bSDK\b/u, "SDK（开发工具包）"],
  [/\bSPI\b/u, "SPI（串行通信协议）"],
  [/\bI2C\b/u, "I2C（串行通信协议）"],
  [/\bUART\b/u, "UART（串口通信方式）"],
  [/\bCAN\b/u, "CAN（常见总线通信方式）"],
  [/\bMECE\b/u, "MECE（拆分时不重复、不遗漏）"],
  [/口径/u, "口径（统计定义）"],
  [/内控/u, "内控（内部控制流程）"],
  [/A\/B 测试/u, "A/B 测试（两版对比实验）"],
];

const dimensionScenarioContext = {
  experiment_protocol: "你接到一个需要验证的测试或实验任务，得先把方案想清楚再动手",
  record_documentation: "你在收尾一个测试或研发任务，需要确保过程和结果有完整记录",
  quality_compliance: "你在执行一项有明确规范要求的任务，时间有点紧但步骤不能漏",
  cross_role_collab: "你的工作涉及多个团队，需要把信息同步清楚、推动问题闭环",
  detail_troubleshooting: "测试或实验出现了异常结果，你需要系统地找出真正原因",
  job_requirements: "你接到一个新任务，别人只给了很简短的要求，需要你自己先想清楚怎么推进",
  professionalism: "你开始和不同同事协作，很多信息要靠你自己补记录、补确认",
  core_skills: "你第一次接触这个岗位常用的工具或基础工作，需要自己补方法再把事情做出来",
  daily_operations: "项目推进到中途，多个同事的诉求撞到一起，你得在很短时间里做判断",
  career_growth: "你已经做完手头工作，但面前出现了一个更难、也更能拉开差距的机会",
  workplace_relations: "你在和上级或平级同事合作时出现分歧，需要你自己先处理关系和推进节奏",
  personality_traits: "事情突然变多、压力变大，团队也在看你会怎么回应",
  audience_insight: "你接到一个传播或内容任务，得先判断到底是讲给谁听的",
  content_strategy: "你要为一个品牌或活动想内容方向，不能只凭感觉发",
  channel_execution: "你已经有内容或活动方案了，接下来要决定放在哪些渠道、怎么跑",
  conversion_review: "一轮传播结束后，你要回头判断到底哪里做得好、哪里没转起来",
  trust_building: "你第一次和陌生客户或合作方沟通，对方还不确定要不要继续聊",
  needs_discovery: "对方的问题说得很模糊，你需要追问到真正关键的需求",
  solution_alignment: "对方有自己的预算和顾虑，你得把方案讲到他愿意继续推进",
  relationship_followthrough: "沟通或交付之后，对方不会一直主动找你，你需要自己把关系和节奏接住",
  customer_needs_id: "你接触了一个新的潜在客户，对方还没说清楚自己真正想要什么",
  pipeline_followthrough: "你在跟进一个意向客户，但推进节奏一直被对方拖着或模糊化",
  value_presentation: "你要向客户说清楚为什么选你，而不只是把产品功能列出来",
  objection_handling: "客户对价格、时机或方案提出了异议，你需要找到突破口继续往前推",
  result_orientation: "你手里同时管着多个线索，需要判断哪里值得重点跟进、哪里应该暂时调整策略",
  mathematical_modeling: "你接到一个算法任务，第一步不是直接调库，而是先想清楚问题怎么建模",
  experiment_design: "你准备验证一个算法想法，实验怎么设计会直接决定结论是否可信",
  reproduction_iteration: "你在复现论文或调模型，效果和预期不完全一致，需要继续迭代排查",
  engineering_deployment: "模型不只要离线效果好，还得真的能接进业务里跑起来",
  hardware_foundation: "你接手一块新开发板或底层任务，写代码前得先把硬件链路看明白",
  debugging_trace: "联调时设备没有按预期工作，大家都在等你先把问题定位出来",
  stability_verification: "功能刚跑通还不够，你还得确认它在异常和长时间运行下也稳",
  documentation_absorption: "你碰到陌生芯片、模块或协议，需要先啃文档再动手",
  structured_problem_solving: "你接到一个复杂商业问题，信息很多但时间很少，得先把问题拆开",
  industry_research: "你要快速研究一个行业，不能只堆资料，还得形成判断",
  business_synthesis: "你手里有数据、访谈和行业信息，需要把它们整合成一个业务结论",
  executive_communication: "你把分析做完了，但领导只给你几分钟听结论",
  metric_decomposition: "老板只给了一个大目标，你需要把它拆成能跟踪的关键指标",
  business_diagnosis: "你看到业务结果异常，但还不知道真正卡点在哪",
  cross_function_push: "一个项目同时牵扯多个团队，需要你把节奏和责任边界往前推",
  strategy_iteration: "一轮策略执行完后，你得判断要继续、调整，还是及时停掉",
  evidence_tracing: "你在核查一笔业务或一份材料，不能只看表面，要把证据链追完整",
  control_risk_sense: "你在看一个流程或项目时，需要先判断哪里最可能出风险",
  accounting_judgment: "你拿到一笔账或一种会计处理方式，需要判断它到底合不合理",
  compliance_discipline: "工作要求规范、记录完整、流程不能漏步，你得在时间压力下也守住标准",
  report_analysis: "你拿到一份财务报表，不只是要读数字，还要判断背后发生了什么",
  business_finance_linking: "业务团队提出动作时，你需要把业务动作和财务影响连起来看",
  cost_management: "你在看预算、费用或资源投入，得判断钱花得值不值",
  financial_communication: "你要把财务结论讲给不懂财务的人听，让他们也能做判断",
  problem_definition: "别人丢给你一个分析问题，但问题本身还没定义清楚",
  metric_calibration: "不同人拿着同一个指标说事，但统计定义未必一样",
  quantitative_analysis: "你已经拿到数据，接下来要用更严谨的方法把结论做实",
  insight_communication: "分析做完后，你还得把结论讲成别人能立刻听懂的业务建议",
  content_judgment: "你接到一个内容任务，还没动笔之前需要先判断这个内容值不值得做、该做给谁看",
  content_expression: "你需要把一些零散的信息或想法整理成一篇可读、可传播的内容",
  content_execution: "你在推进一个内容项目，需要协调多方并按节点交付",
  feedback_iteration: "你刚发出去的内容反应不如预期，需要判断是哪里出了问题",
  output_responsibility: "你在持续产出内容的过程中，面临周期性的压力和细节要求",
  candidate_employee_insight: "你在接触一个候选人或员工，对方还没有说清楚自己真正的诉求或状态",
  multi_party_communication: "你需要协调业务部门、候选人或员工多方关系，各方预期并不完全一致",
  process_detail_execution: "你在执行一个 HR 流程，时间有压力但标准不能打折",
  hr_judgment_problem_solving: "你面对的 HR 判断没有标准答案，需要结合信息和判断做出处理决策",
  organizational_awareness: "你在处理某个具体 HR 事务，同时需要考虑它对组织更长期的影响",
};

function question(id, prompt, dimension) {
  return { id, prompt, dimension, options: scaleOptions };
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function explainHardTerms(prompt) {
  return HARD_TERM_REPLACEMENTS.reduce((current, [pattern, replacement]) => {
    const matcher = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`);
    return current.replace(matcher, (matched) => (
      matched.includes("（") || matched.includes("(") ? matched : replacement
    ));
  }, prompt);
}

function rewriteLeadingStatement(prompt) {
  return prompt
    .replace(/^我对(.+?)会/u, "你是否会对$1")
    .replace(/^我仍然能/u, "你是否仍然能")
    .replace(/^我仍然/u, "你是否仍然")
    .replace(/^我愿意/u, "你是否愿意")
    .replace(/^我能接受/u, "你是否能接受")
    .replace(/^我能/u, "你通常能")
    .replace(/^我会/u, "你会")
    .replace(/^我习惯/u, "你是否习惯")
    .replace(/^我通常/u, "你通常")
    .replace(/^我有/u, "你是否有")
    .replace(/^我对/u, "你是否会对")
    .replace(/^我理解/u, "你是否理解")
    .replace(/^我认为/u, "你是否认为")
    .replace(/^我始终/u, "你是否会始终");
}

function shiftInnerFirstPerson(prompt) {
  return prompt
    .replace(/，我对(.+?)会/u, "，你是否会对$1")
    .replace(/，我仍然能/u, "，你是否仍然能")
    .replace(/，我仍然/u, "，你是否仍然")
    .replace(/，我愿意/u, "，你是否愿意")
    .replace(/，我能接受/u, "，你是否能接受")
    .replace(/，我能/u, "，你通常能")
    .replace(/，我会/u, "，你会")
    .replace(/，我习惯/u, "，你是否习惯")
    .replace(/，我通常/u, "，你通常")
    .replace(/，我有/u, "，你是否有")
    .replace(/，我对/u, "，你是否会对")
    .replace(/，我理解/u, "，你是否理解")
    .replace(/，我认为/u, "，你是否认为")
    .replace(/，我始终/u, "，你是否会始终")
    .replace(/。我对(.+?)会/u, "。这时候，你是否会对$1")
    .replace(/。我仍然能/u, "。这时候，你是否仍然能")
    .replace(/。我仍然/u, "。这时候，你是否仍然")
    .replace(/。我愿意/u, "。这时候，你是否愿意")
    .replace(/。我能接受/u, "。这时候，你是否能接受")
    .replace(/。我能/u, "。这时候，你通常能")
    .replace(/。我会/u, "。这时候，你会")
    .replace(/。我习惯/u, "。这时候，你是否习惯")
    .replace(/。我通常/u, "。这时候，你通常")
    .replace(/。我有/u, "。这时候，你是否有")
    .replace(/。我对/u, "。这时候，你是否会对")
    .replace(/。我理解/u, "。这时候，你是否理解")
    .replace(/。我认为/u, "。这时候，你是否认为")
    .replace(/。我始终/u, "。这时候，你是否会始终");
}

function isExplicitScenarioPrompt(prompt) {
  return /这时候|老板|客户|项目|联调|排查|汇报|遇到|面对|看到|关键节点|第一次|做完/u.test(prompt);
}

function ensureScenarioPrompt(prompt, dimension) {
  const explained = shiftInnerFirstPerson(explainHardTerms(prompt.trim()));
  const rewrittenLeading = rewriteLeadingStatement(explained);

  // Strip manual 场景： prefix if present — we'll re-add it consistently at the end
  const base = explained.startsWith("场景：")
    ? rewriteLeadingStatement(shiftInnerFirstPerson(explained.replace(/^场景：/, "").trim()))
    : rewrittenLeading;

  let body;
  if (isExplicitScenarioPrompt(base)) {
    body = base;
  } else {
    const context = dimensionScenarioContext[dimension] ?? "你接到一个真实工作任务，需要先判断该怎么推进";
    const connector = /^(你|即使|当|面对|看到|做|读|汇报|排查|联调)/u.test(base) ? "这时候，" : "";
    body = `${context}。${connector}${base}`;
  }

  return `场景：${body}`;
}

function getDimensionOrder(questions) {
  const order = [];
  questions.forEach((item) => {
    if (!order.includes(item.dimension)) {
      order.push(item.dimension);
    }
  });
  return order;
}

function getChoiceDimensionSet(questions) {
  const order = getDimensionOrder(questions);
  return new Set([order[0], order[1], order[2], order[5]].filter(Boolean));
}

function buildQuestionOptions(questionItem, questions) {
  const order = getDimensionOrder(questions);
  const choiceDimensions = getChoiceDimensionSet(questions);
  const relationDimension = order[5] ?? null;

  if (!choiceDimensions.has(questionItem.dimension)) {
    return scaleOptions;
  }

  return questionItem.dimension === relationDimension
    ? coordinationChoiceOptions
    : scenarioChoiceOptions;
}

function enhanceQuestionSet(questionSet) {
  return {
    ...questionSet,
    questions: questionSet.questions.map((item) => ({
      ...item,
      prompt: ensureScenarioPrompt(item.prompt, item.dimension),
      type: getChoiceDimensionSet(questionSet.questions).has(item.dimension) ? "scenario-choice" : "scale",
      options: buildQuestionOptions(item, questionSet.questions),
    })),
  };
}

const rawQuestionSets = [
  // ── 产品经理 ──────────────────────────────────────────────────────────────
  {
    id: "qs-product-manager-v3",
    roleId: "product-manager",
    title: "产品经理职场场景测评题组",
    questions: [
      // 岗位要求
      question("pm-jr1", "老板扔给你一份竞品 App 的截图说「分析一下」，但没给任何模板或说明。这时候，我会先自己想清楚要从哪几个角度分析，整理成文档后再发给老板，而不是直接发一段零散的文字消息。", "job_requirements"),
      question("pm-jr2", "产品评审会上，研发问你「这个需求的边界是什么」，你之前没想到这个细节。这时候，我会直接承认当下没考虑清楚，会后补一版边界说明，而不是随口给一个没把握的答案。", "job_requirements"),
      question("pm-jr3", "老板让你写一份新功能的需求文档（PRD），你是第一次写，完全没有模板。这时候，我会先找公司内部的历史文档参考格式或搜一个标准模板，而不是从零开始凭感觉写。", "job_requirements"),
      // 职业素养
      question("pm-pr1", "你用飞书和设计同事口头确认了一个改动，但没在文档里留记录，第二周对方说「我没说过这个」。遇到这种情况后，我会养成习惯：每次口头确认完，立刻在文档里补一行记录并 @对方。", "professionalism"),
      question("pm-pr2", "你下班前发现一个紧急 Bug，但负责修复的研发同事已经打卡离开了。这时候，我会先判断这个 Bug 影响多大，再决定要不要发消息——如果不影响核心功能，我会记录下来等明天跟进，而不是在晚上 9 点催人。", "professionalism"),
      question("pm-pr3", "你加入了一个新项目群，里面有十几个你不认识的同事。这时候，我会主动发一条自我介绍，说清楚我在这个项目里负责什么，而不是在群里潜水等别人来找我。", "professionalism"),
      // 基本技能
      question("pm-sk1", "老板让你在周五前做一份用户调研报告，你手头有 200 条用户评论，但没有现成的分析工具。这时候，我会用 Excel 或飞书表格手动给评论打标签分类，整理出高频问题，而不是因为没有专业工具就卡住。", "core_skills"),
      question("pm-sk2", "你需要给一个新功能画原型图，但公司用的是 Figma，你之前只用过 Axure。这时候，我会先花半天时间自学 Figma 基础操作，再开始画，不会因为不熟悉就直接说「我不会」。", "core_skills"),
      question("pm-sk3", "你要向老板汇报上个月的数据，但发现 DAU（日活）下降了，原因还没完全查清楚。这时候，我不会等原因全查清才汇报，而是先说清楚数据现象和初步判断，再列出接下来要核查的方向。", "core_skills"),
      // 日常事务
      question("pm-do1", "运营同事在项目快结束时突然加了一个「小需求」，说「就改一个按钮颜色」，但研发说改这个需要动底层逻辑，至少两天。这时候，我会帮研发把技术成本解释清楚给运营听，再一起评估值不值得这个版本做，不会直接答应也不会直接拒绝。", "daily_operations"),
      question("pm-do2", "你负责跟进的功能上线后出现了 Bug，研发同事在群里说「当初就说这个方案有问题」。这时候，我会先承认这次上线没充分验证，不会在群里争谁的责任——私下复盘，公开解决问题。", "daily_operations"),
      question("pm-do3", "你整理了一份会议纪要发给大家，结果有人回复说「我说的不是这个意思」。这时候，我不会觉得对方在挑剔，而是会重新确认他的原话是什么，修改后重新发一版。", "daily_operations"),
      // 晋升空间
      question("pm-cg1", "你在一家公司做了一年，手头的项目比较稳定但没什么新挑战。有个压力很大但能接触核心业务的机会，同事问你要不要争取。这时候，比起待在舒适区，我更愿意主动争取那个有挑战的机会，即使会更累。", "career_growth"),
      question("pm-cg2", "你做的一个方案被老板采纳了，但最终汇报时老板直接用了你的内容，却没有提到你的名字。这时候，我不会立刻去找老板对线，而是会思考下次如何让自己的贡献更可见，比如提前在文档里署名或在会议里主动讲。", "career_growth"),
      // 职场关系
      question("pm-wr1", "你的直属上级给你的反馈是「这个方向不对」，但没说哪里不对，让你重做。这时候，我会主动约他 15 分钟，带着我的逻辑去问清楚他觉得哪里偏了，而不是自己猜着改。", "workplace_relations"),
      question("pm-wr2", "你和一个平级同事负责同一个项目的不同模块，他的进度一直拖着你，但他不是你的下属，你没法直接要求他。这时候，我会先弄清楚他卡在哪里、是资源问题还是优先级冲突，而不是直接去老板那里告状。", "workplace_relations"),
      question("pm-wr3", "公司有个老员工，资历比你深，但经常在会议上否定你的想法，语气也不太好。这时候，我不会当场硬刚，而是会会后私下找他聊，了解他的顾虑，并在下次提案时把他的关切纳入进去。", "workplace_relations"),
      // 性格特征
      question("pm-pt1", "连续两周高强度赶项目，周末也在回消息，你明显感觉快撑不住了。这时候，我会在还能撑住的时候主动和老板说一声「当前节奏我需要稍微缓一缓」，而不是等到彻底崩掉才开口。", "personality_traits"),
      question("pm-pt2", "新来的实习生做了一份分析，结论和你之前的判断完全相反，他在会议上当着所有人展示出来了。这时候，我会认真看他的数据和逻辑，如果他的分析更扎实，我会公开说「你这个角度我之前没考虑到，有道理」。", "personality_traits"),
      question("pm-pt3", "你参与了一个新项目，但团队里的人你一个都不认识，工作方式和你之前的公司完全不同。这时候，我会花第一周主动观察这个团队怎么运转，先适应再提建议，而不是一进来就说「我们以前不是这么做的」。", "personality_traits"),
    ],
  },

  // ── 市场营销 ──────────────────────────────────────────────────────────────
  {
    id: "qs-marketing-v2",
    roleId: "marketing",
    title: "市场营销职业准备度评估题组",
    questions: [
      // 受众洞察
      question("mk-a1", "看到一个传播案例时，我会先判断它打动的是哪类人、触发了什么情绪。", "audience_insight"),
      question("mk-a2", "做内容或活动时，我会先想目标受众是谁，再决定文案和形式。", "audience_insight"),
      question("mk-a3", "我愿意去了解目标人群在哪里获取信息、什么时候更容易被打动。", "audience_insight"),
      question("mk-a4", "看到一条爆款内容，我会分析背后吸引了哪类人的哪种情绪。", "audience_insight"),
      question("mk-a5", "我能区分不同年龄段或圈层受众的语言习惯和内容偏好。", "audience_insight"),
      // 内容策略
      question("mk-c1", "我愿意根据品牌目标设计传播主线，而不是只追热点。", "content_strategy"),
      question("mk-c2", "我能把一次活动策划拆成主题、节奏、素材和转化目标。", "content_strategy"),
      question("mk-c3", "我会在内容上线前思考传播逻辑和用户行动路径，而不是准备好就发布。", "content_strategy"),
      question("mk-c4", "面对同一个品牌目标，我能想出 3 种以上不同风格的内容表达方案。", "content_strategy"),
      question("mk-c5", "我能根据不同传播阶段调整内容重心，比如破圈期和留存期的内容明显不同。", "content_strategy"),
      // 渠道执行
      question("mk-x1", "面对不同渠道时，我会区分平台调性、投放逻辑和适合的内容形式。", "channel_execution"),
      question("mk-x2", "在资源有限的情况下，我仍会优先考虑最可能带来触达和转化的动作。", "channel_execution"),
      question("mk-x3", "做投放时，我会先设定假设，再根据数据判断哪个方向值得继续加注。", "channel_execution"),
      question("mk-x4", "我能根据不同渠道的用户行为习惯，调整素材风格和 CTA 形式。", "channel_execution"),
      question("mk-x5", "执行传播时，我会记录每个渠道的效果，而不是统一发完就等结果。", "channel_execution"),
      // 转化复盘
      question("mk-v1", "做完一次传播后，我会复盘曝光、互动、转化和成本，而不是只看热闹。", "conversion_review"),
      question("mk-v2", "如果结果不理想，我愿意回头检查受众判断、内容策略还是渠道选择出了问题。", "conversion_review"),
      question("mk-v3", "我能把转化数据拆解到用户路径层面，判断哪一步流失最严重。", "conversion_review"),
      question("mk-v4", "做完活动后，我会整理成\"目标-结果-原因-下次改进\"结构，不只写一句总结。", "conversion_review"),
      question("mk-v5", "我愿意定期回顾历史数据，判断哪类内容方向有长期增长潜力。", "conversion_review"),
    ],
  },

  // ── 客户经理 ──────────────────────────────────────────────────────────────
  {
    id: "qs-account-manager-v2",
    roleId: "account-manager",
    title: "客户经理职业准备度评估题组",
    questions: [
      // 信任建立
      question("am-t1", "在陌生沟通场景里，我通常能先建立基本信任，再推进具体话题。", "trust_building"),
      question("am-t2", "当对方表达保留或顾虑时，我会先理解原因，而不是急着继续说服。", "trust_building"),
      question("am-t3", "第一次见面或通话时，我习惯先了解对方关注什么，再推进业务内容。", "trust_building"),
      question("am-t4", "遇到沉默或不回应时，我会判断是内容问题还是时机不对，而不是加量发送。", "trust_building"),
      question("am-t5", "我能在表达意见时保持自信，同时不让对方感到被否定。", "trust_building"),
      // 需求挖掘
      question("am-n1", "客户需求说得不清时，我会继续追问业务背景、目标和限制条件。", "needs_discovery"),
      question("am-n2", "我能把零散信息整理成相对清楚的客户需求摘要。", "needs_discovery"),
      question("am-n3", "我会区分客户说出来的\"表层需求\"和他们真正在意的\"深层目标\"。", "needs_discovery"),
      question("am-n4", "了解需求时，我会主动问当前是否已有其他方案，以及为什么没能满足。", "needs_discovery"),
      question("am-n5", "我能在短暂交流中快速找到对方最在意的 1 到 2 个核心诉求。", "needs_discovery"),
      // 方案对齐
      question("am-s1", "面对客户和内部团队诉求不完全一致时，我会主动找可以对齐的方案。", "solution_alignment"),
      question("am-s2", "我能根据客户重点重新组织表达方式，而不是直接复述标准话术。", "solution_alignment"),
      question("am-s3", "介绍方案时，我会先说明如何解决他们最关心的问题，再讲具体细节。", "solution_alignment"),
      question("am-s4", "当客户不确定是否需要时，我会帮他们梳理利弊，而不是直接给结论。", "solution_alignment"),
      question("am-s5", "我能根据客户的预算约束，调整方案的优先级和实施节奏。", "solution_alignment"),
      // 关系持续推进
      question("am-r1", "沟通之后，我会持续跟进节奏、节点和反馈，而不是只在关键时点出现。", "relationship_followthrough"),
      question("am-r2", "即使客户推进慢或反复变化，我也能保持耐心并持续维护关系。", "relationship_followthrough"),
      question("am-r3", "我会定期回顾每个客户的需求变化，主动更新跟进策略。", "relationship_followthrough"),
      question("am-r4", "关键节点快到时，我会提前确认双方准备情况，而不是到时间再催。", "relationship_followthrough"),
      question("am-r5", "客户遇到内部问题时，我会帮他们预估影响范围，而不是等对方解决完再说。", "relationship_followthrough"),
    ],
  },

  // ── AI 算法工程师 ─────────────────────────────────────────────────────────
  {
    id: "qs-ai-algorithm-engineer-v2",
    roleId: "ai-algorithm-engineer",
    title: "AI算法工程师职业准备度评估题组",
    questions: [
      // 数学与建模
      question("ai-m1", "看到一个模型效果不理想时，我会先判断是数据、特征还是模型设计的问题。", "mathematical_modeling"),
      question("ai-m2", "我能理解评价指标背后代表的业务含义，而不是只看分数高低。", "mathematical_modeling"),
      question("ai-m3", "面对一个新任务时，我会先思考问题的数学形式，再选择合适的模型类型。", "mathematical_modeling"),
      question("ai-m4", "我能解释为什么某个模型在这个场景下比另一个更合适，而不是只凭经验挑。", "mathematical_modeling"),
      question("ai-m5", "我能说清楚某种损失函数或评估方式背后的数学含义。", "mathematical_modeling"),
      // 实验设计
      question("ai-e1", "做实验时，我会记录变量、基线和结果，避免只凭印象判断。", "experiment_design"),
      question("ai-e2", "为了验证一个想法，我愿意设计对照实验而不是一次性改很多参数。", "experiment_design"),
      question("ai-e3", "我会在实验启动前就想清楚验证标准和结束条件，而不是实验过了才定。", "experiment_design"),
      question("ai-e4", "遇到实验结果有歧义时，我会分析是随机噪声还是真实信号，再决定怎么进展。", "experiment_design"),
      question("ai-e5", "我能识别实验中可能影响结论的混淆变量，并设计控制方法。", "experiment_design"),
      // 复现与迭代
      question("ai-r1", "读论文或开源项目时，我愿意自己复现关键环节，确认我真的理解了方法。", "reproduction_iteration"),
      question("ai-r2", "面对长时间调参和排查时，我能保持耐心并逐步缩小问题范围。", "reproduction_iteration"),
      question("ai-r3", "复现他人代码时，我会先理解原作者的设计意图，再判断哪里可以改进。", "reproduction_iteration"),
      question("ai-r4", "遇到效果偏差时，我会从数据预处理、超参设置和实现细节逐一排查。", "reproduction_iteration"),
      question("ai-r5", "我愿意在同一个任务上持续迭代，而不是遇到瓶颈就换方向。", "reproduction_iteration"),
      // 工程落地
      question("ai-d1", "我会考虑模型上线后的延迟、资源消耗和业务接入成本，而不是只看离线结果。", "engineering_deployment"),
      question("ai-d2", "做项目时，我会思考如何把算法能力包装成可被产品或业务使用的方案。", "engineering_deployment"),
      question("ai-d3", "我能将模型封装成接口或服务，让非算法团队能够使用它。", "engineering_deployment"),
      question("ai-d4", "我会在模型上线后持续监控性能指标，发现退化时能快速诊断原因。", "engineering_deployment"),
      question("ai-d5", "面对推理速度要求高的场景，我了解常用的加速和压缩手段。", "engineering_deployment"),
    ],
  },

  // ── 嵌入式开发工程师 ──────────────────────────────────────────────────────
  {
    id: "qs-embedded-engineer-v2",
    roleId: "embedded-engineer",
    title: "嵌入式开发工程师职业准备度评估题组",
    questions: [
      // 硬件基础
      question("ee-h1", "我愿意花时间理解芯片、接口、寄存器和系统链路是如何配合工作的。", "hardware_foundation"),
      question("ee-h2", "面对底层开发任务时，我会先确认硬件约束和资源限制。", "hardware_foundation"),
      question("ee-h3", "我能根据项目需求判断选用哪类 MCU 或 SoC，并说明理由。", "hardware_foundation"),
      question("ee-h4", "阅读数据手册时，我能快速找到与当前任务相关的寄存器定义和时序要求。", "hardware_foundation"),
      question("ee-h5", "面对硬件接口异常时，我会先用工具确认信号层情况。", "hardware_foundation"),
      // 调试排查
      question("ee-db1", "排查异常时，我习惯按现象、日志、链路逐层定位，而不是凭感觉修改。", "debugging_trace"),
      question("ee-db2", "联调出现问题时，我能把问题切成更小的环节逐步验证。", "debugging_trace"),
      question("ee-db3", "我能通过日志、断点或波形捕捉到问题发生的精确时刻和上下文。", "debugging_trace"),
      question("ee-db4", "面对偶发性 bug 时，我有方法复现问题并收集足够信息。", "debugging_trace"),
      question("ee-db5", "解决一个复杂 bug 后，我会记录根因和处理方式，防止同类问题再现。", "debugging_trace"),
      // 稳定性验证
      question("ee-sv1", "我能接受重复测试、版本验证和边界条件检查这类工作。", "stability_verification"),
      question("ee-sv2", "做完功能后，我会主动考虑异常输入、时序问题和系统稳定性。", "stability_verification"),
      question("ee-sv3", "我会对新加的功能设计简单的测试用例，覆盖正常流程和边界情况。", "stability_verification"),
      question("ee-sv4", "系统压力测试或长时间运行后，我会主动检查资源占用和日志有无异常。", "stability_verification"),
      question("ee-sv5", "遇到随机崩溃或异常重启时，我有方法系统地找到触发条件。", "stability_verification"),
      // 文档吸收
      question("ee-da1", "遇到陌生设备或协议时，我愿意先啃文档，再动手调试。", "documentation_absorption"),
      question("ee-da2", "我能从数据手册、协议说明或开发板文档里提取关键约束。", "documentation_absorption"),
      question("ee-da3", "我会在项目开始时整理一份主要接口和依赖文档的索引，方便后续查找。", "documentation_absorption"),
      question("ee-da4", "阅读文档时，我会标记关键约束、警告和典型配置，而不是只是从头读完。", "documentation_absorption"),
      question("ee-da5", "使用第三方库或 SDK 时，我会先看 API 说明，而不是直接拷贝示例代码。", "documentation_absorption"),
    ],
  },

  // ── 战略咨询 ──────────────────────────────────────────────────────────────
  {
    id: "qs-strategy-consulting-v2",
    roleId: "strategy-consulting",
    title: "战略咨询职业准备度评估题组",
    questions: [
      // 结构化问题解决
      question("sc-sp1", "遇到复杂商业问题时，我习惯先搭分析框架，再补信息和数据。", "structured_problem_solving"),
      question("sc-sp2", "我能把一个大问题拆成几个可验证的小问题来推进。", "structured_problem_solving"),
      question("sc-sp3", "面对一个新命题，我会先判断核心矛盾在哪里，而不是什么都想搞清楚。", "structured_problem_solving"),
      question("sc-sp4", "我能用 MECE 原则拆分问题，避免关键维度遗漏或重复。", "structured_problem_solving"),
      question("sc-sp5", "面对信息不完整时，我仍然能给出有依据的初步判断和假设。", "structured_problem_solving"),
      // 行业研究
      question("sc-ir1", "为了形成判断，我愿意主动查行业资料、公司动态和竞争格局。", "industry_research"),
      question("sc-ir2", "读材料时，我会区分哪些信息是背景，哪些信息真正影响商业判断。", "industry_research"),
      question("sc-ir3", "我能在大量行业信息中找到真正影响商业决策的几个关键驱动因素。", "industry_research"),
      question("sc-ir4", "我愿意主动建立对特定行业的知识体系，而不是只在需要时临时搜索。", "industry_research"),
      question("sc-ir5", "读财报或行业报告时，我会在关键数字旁边注释背后的战略含义，而不是只记录数据。", "industry_research"),
      // 商业综合判断
      question("sc-bs1", "我会尝试把数据、事实和访谈信息整合成一个清楚的业务结论。", "business_synthesis"),
      question("sc-bs2", "当不同信息彼此冲突时，我能先解释矛盾来源，再形成初步判断。", "business_synthesis"),
      question("sc-bs3", "我能从不同维度的信息中提炼出 1 到 2 个最核心的策略建议。", "business_synthesis"),
      question("sc-bs4", "我习惯在得出结论前，主动寻找可能反驳当前判断的信息或视角。", "business_synthesis"),
      question("sc-bs5", "整合多来源信息时，我能说清楚为什么选择某种解读，而不是另一种。", "business_synthesis"),
      // 高层表达
      question("sc-ec1", "在高要求场景下，我愿意反复修改表达结构，直到结论更有说服力。", "executive_communication"),
      question("sc-ec2", "我能把复杂分析压缩成几条高层也能快速理解的重点。", "executive_communication"),
      question("sc-ec3", "我能用\"结论先行\"的方式呈现分析，而不是把所有推导过程全部罗列出来。", "executive_communication"),
      question("sc-ec4", "面对高标准的受众，我会提前准备可能被追问的问题和应对方式。", "executive_communication"),
      question("sc-ec5", "我能根据不同汇报对象的背景调整表达层级，而不是每次都用同一套话。", "executive_communication"),
    ],
  },

  // ── 策略运营 ──────────────────────────────────────────────────────────────
  {
    id: "qs-strategy-operations-v2",
    roleId: "strategy-operations",
    title: "策略运营职业准备度评估题组",
    questions: [
      // 指标拆解
      question("so-md1", "面对业务目标时，我会先拆成关键指标，再看动作该怎么设计。", "metric_decomposition"),
      question("so-md2", "看到业务波动时，我会先判断要看哪些核心指标和分层切片。", "metric_decomposition"),
      question("so-md3", "我能把一个模糊的业务目标拆解成可以追踪的量化指标体系。", "metric_decomposition"),
      question("so-md4", "面对同一个结果，我能列出至少 3 种可能导致它的指标路径。", "metric_decomposition"),
      question("so-md5", "我能区分过程指标和结果指标，并说明它们之间的因果关系。", "metric_decomposition"),
      // 业务诊断
      question("so-bd1", "我更愿意用数据和事实解释业务问题，而不是只凭经验下结论。", "business_diagnosis"),
      question("so-bd2", "当数据异常时，我会先核对口径，再分析真正的业务原因。", "business_diagnosis"),
      question("so-bd3", "我能从数据的变化形态中快速识别值得深入的信号。", "business_diagnosis"),
      question("so-bd4", "我会在假设原因之前先检验基本的口径和统计方式是否一致。", "business_diagnosis"),
      question("so-bd5", "遇到\"看起来不对\"的数据，我不会第一时间质疑数据，而是先排查自己的理解是否有偏差。", "business_diagnosis"),
      // 跨团队推动
      question("so-cf1", "推动一个策略动作落地时，我会主动和产品、销售、技术对齐目标。", "cross_function_push"),
      question("so-cf2", "遇到推进阻力时，我会重新拆分责任和节奏，而不是等别人来推动。", "cross_function_push"),
      question("so-cf3", "跨团队协作时，我会提前识别哪些人是真正的决策者，而不是只找执行层。", "cross_function_push"),
      question("so-cf4", "遇到不同团队理解不一致时，我会主动拉齐定义，而不是各做各的。", "cross_function_push"),
      question("so-cf5", "推动落地时，我会追踪关键节点的完成情况，而不是只在启动时对齐一次。", "cross_function_push"),
      // 策略迭代
      question("so-si1", "做完一次策略动作后，我会复盘哪些动作有效、哪些不该继续投入。", "strategy_iteration"),
      question("so-si2", "我愿意把一次成功或失败的执行经验沉淀成下次可复用的策略。", "strategy_iteration"),
      question("so-si3", "面对新策略，我会先做小规模验证，确认方向可行后再全量推进。", "strategy_iteration"),
      question("so-si4", "我能从一次执行中提炼出可以复用的方法论，而不是只记住结论。", "strategy_iteration"),
      question("so-si5", "我愿意在策略失效时及时停止并切换，而不是坚持等结果自然改善。", "strategy_iteration"),
    ],
  },

  // ── 审计 ──────────────────────────────────────────────────────────────────
  {
    id: "qs-audit-v2",
    roleId: "audit",
    title: "审计职业准备度评估题组",
    questions: [
      // 证据追踪
      question("au-et1", "面对资料或凭证时，我会顺着证据链往前后追，而不是只看表面是否完整。", "evidence_tracing"),
      question("au-et2", "看到流程描述时，我会自然去想有哪些环节可能出现遗漏或失真。", "evidence_tracing"),
      question("au-et3", "在核查工作中，我会主动确认来源和关联文件，而不是只依赖对方提供的材料。", "evidence_tracing"),
      question("au-et4", "看到数字或结论时，我会想这个数据从哪来、谁生成的、有没有可能被干扰。", "evidence_tracing"),
      question("au-et5", "我能通过交叉比对多个来源，判断是否存在逻辑上的不一致。", "evidence_tracing"),
      // 风险控制感知
      question("au-cr1", "我对流程漏洞、异常波动和控制缺口会比较敏感。", "control_risk_sense"),
      question("au-cr2", "即使信息不多，我也会先判断哪里最可能是高风险点。", "control_risk_sense"),
      question("au-cr3", "设计流程时，我会想到哪些环节如果失控会影响最大，应该设置哪些检查点。", "control_risk_sense"),
      question("au-cr4", "面对一个内控体系，我能快速判断哪些控制点是名存实亡的，哪些是真正有效的。", "control_risk_sense"),
      question("au-cr5", "我愿意对\"看起来正常\"的流程保持一定程度的质疑，而不是因为没人提出来就认为没问题。", "control_risk_sense"),
      // 会计判断
      question("au-aj1", "遇到会计处理或业务描述时，我会关注背后的核算逻辑是否成立。", "accounting_judgment"),
      question("au-aj2", "我愿意花时间确认口径、规则和细节，不会轻易默认\"差不多\"。", "accounting_judgment"),
      question("au-aj3", "我能识别一笔交易是否符合相关会计准则，而不是只看数字是否平衡。", "accounting_judgment"),
      question("au-aj4", "面对会计政策选择时，我会判断其是否合理，而不是只核对是否与过去一致。", "accounting_judgment"),
      question("au-aj5", "我会在报表分析中识别异常的会计处理方式，并判断其对利润或资产的影响。", "accounting_judgment"),
      // 规范纪律
      question("au-cd1", "面对规范、重复、时间紧的工作时，我仍能保持稳定输出。", "compliance_discipline"),
      question("au-cd2", "我能在高强度检查中保持记录完整、结论谨慎和表达清楚。", "compliance_discipline"),
      question("au-cd3", "即使在任务量大的情况下，我也会完整走完规范要求的每一步，不跳过检查节点。", "compliance_discipline"),
      question("au-cd4", "我会在工作开始前确认适用的标准和流程，而不是按照\"应该是这样\"来操作。", "compliance_discipline"),
      question("au-cd5", "遇到行业或法规更新时，我会及时更新自己的工作标准，而不是继续沿用旧规则。", "compliance_discipline"),
    ],
  },

  // ── 财务 ──────────────────────────────────────────────────────────────────
  {
    id: "qs-finance-v2",
    roleId: "finance",
    title: "财务职业准备度评估题组",
    questions: [
      // 报表分析
      question("fi-ra1", "看到报表或经营数据时，我会先关注收入、成本和利润之间的变化关系。", "report_analysis"),
      question("fi-ra2", "我对数字变化背后的业务原因会持续追问，而不是只记录结果。", "report_analysis"),
      question("fi-ra3", "我能从三张表的联动关系中发现异常，而不是逐个分析独立数字。", "report_analysis"),
      question("fi-ra4", "面对期间波动，我会先排除季节性和口径变化，再判断真正的业务变化。", "report_analysis"),
      question("fi-ra5", "我能对比历史数据和行业基准，找到当前数据中值得关注的偏差点。", "report_analysis"),
      // 业财联动
      question("fi-bf1", "我能把财务指标和具体业务动作联系起来，而不是把数字孤立地看。", "business_finance_linking"),
      question("fi-bf2", "和非财务同学沟通时，我会尝试把财务结论翻译成业务能理解的话。", "business_finance_linking"),
      question("fi-bf3", "我能从某一项费用的变化推断出背后可能发生了什么业务变化。", "business_finance_linking"),
      question("fi-bf4", "面对业务团队的新提案，我能快速判断它的财务影响，而不是等他们提供完整数据。", "business_finance_linking"),
      question("fi-bf5", "我愿意主动参与业务决策讨论，而不只是在事后做财务分析和汇报。", "business_finance_linking"),
      // 成本管理
      question("fi-cm1", "面对预算、费用或资源配置时，我会先判断优先级和投入产出。", "cost_management"),
      question("fi-cm2", "我愿意在准确性和业务效率之间找到更合理的处理方式。", "cost_management"),
      question("fi-cm3", "做预算时，我会结合业务增长假设，而不是只在历史数字上机械调整比例。", "cost_management"),
      question("fi-cm4", "面对超预算请求，我会先理解业务逻辑再决定是否支持，而不是一律按比例削减。", "cost_management"),
      question("fi-cm5", "我能从成本结构变化中识别出哪些是一次性事项，哪些会持续影响利润。", "cost_management"),
      // 财务沟通
      question("fi-fc1", "做分析或汇报时，我能把关键数字、原因和建议组织成清楚的结论。", "financial_communication"),
      question("fi-fc2", "当别人质疑数字结论时，我能解释口径、依据和业务影响。", "financial_communication"),
      question("fi-fc3", "我能把财务分析做成一页纸的简洁摘要，而不是只有完整的明细表。", "financial_communication"),
      question("fi-fc4", "汇报时，我会先说结论和影响，再补数据和方法，而不是从数据往结论一步一步推。", "financial_communication"),
      question("fi-fc5", "面对不同层级的听众，我能调整财务信息的呈现粒度，而不是每次都给同一份模板。", "financial_communication"),
    ],
  },

  // ── 数据分析 ──────────────────────────────────────────────────────────────
  {
    id: "qs-data-analyst-v2",
    roleId: "data-analyst",
    title: "数据分析职业准备度评估题组",
    questions: [
      // 问题定义
      question("da-pd1", "面对业务问题时，我会先定义清楚要回答什么，再开始取数。", "problem_definition"),
      question("da-pd2", "我会先区分是描述现象、定位原因，还是评估动作效果。", "problem_definition"),
      question("da-pd3", "遇到模糊的分析需求时，我会先追问业务背景和决策场景，再确认分析方向。", "problem_definition"),
      question("da-pd4", "我能判断当前问题是数据能回答的，还是需要其他方式验证的。", "problem_definition"),
      question("da-pd5", "在分析开始前，我会先说明核心假设和分析边界，而不是拿到数据就跑。", "problem_definition"),
      // 指标口径
      question("da-mc1", "做分析前，我会先确认关键指标、分层方式和口径是否一致。", "metric_calibration"),
      question("da-mc2", "当不同报表结果不一致时，我会先排查指标定义和统计口径。", "metric_calibration"),
      question("da-mc3", "我能识别同一个业务场景中不同部门使用的指标口径差异，并说明影响。", "metric_calibration"),
      question("da-mc4", "遇到\"数字对不上\"时，我的第一反应是确认来源和时间范围，而不是直接说数据有问题。", "metric_calibration"),
      question("da-mc5", "我能提前识别指标口径变更对历史数据可比性的影响，并在分析中标注说明。", "metric_calibration"),
      // 量化分析
      question("da-qa1", "我愿意通过 SQL、表格或脚本把数据清洗到可分析状态，而不是跳过脏数据问题。", "quantitative_analysis"),
      question("da-qa2", "做分析时，我会尝试验证多个假设，而不是只找一个看起来合理的解释。", "quantitative_analysis"),
      question("da-qa3", "遇到样本量不足或数据偏差问题，我能正确描述分析的局限性，而不是忽略它。", "quantitative_analysis"),
      question("da-qa4", "我愿意花时间做数据清洗和质量检查，而不是假设原始数据是完整准确的。", "quantitative_analysis"),
      question("da-qa5", "我能识别数据中的异常值，并判断该保留、处理还是单独分析。", "quantitative_analysis"),
      // 洞察表达
      question("da-ic1", "我能把数据结论转成业务能理解的建议，而不是停留在图表层面。", "insight_communication"),
      question("da-ic2", "汇报分析结果时，我会先讲结论和影响，再补分析过程。", "insight_communication"),
      question("da-ic3", "我能根据受众调整分析报告的深度和表达方式，而不是每次都给同一个完整版。", "insight_communication"),
      question("da-ic4", "做可视化时，我会优先用能直接传递结论的图表，而不是用复杂展示方式显示专业感。", "insight_communication"),
      question("da-ic5", "我能把数据发现翻译成具体的业务建议，而不是停留在\"这个指标下降了\"。", "insight_communication"),
    ],
  },

  // ── 销售 / 商务拓展 ──────────────────────────────────────────────────────────
  {
    id: "qs-sales-bd-v1",
    roleId: "sales-bd",
    title: "销售 / 商务拓展职业准备度评估题组",
    questions: [
      // 客户需求识别
      question("sb-ni1", "一个潜在客户主动联系你，说想了解你们的方案，但没说任何背景或具体问题。面对客户，我会先问清楚他们当前面临什么业务场景和具体目标，再开始介绍，而不是直接上产品介绍。", "customer_needs_id"),
      question("sb-ni2", "和客户聊了十几分钟，对方说了很多，但你感觉他说的需求和真正想达到的目标可能不完全一致。这时候，我会主动说出自己对他目标的理解，和他确认有没有偏差，再讨论方案。", "customer_needs_id"),
      question("sb-ni3", "客户在电话里说'我们对价格很敏感'，但你不确定这是真正的顾虑还是谈判策略。面对客户，我会追问他们的预算范围和最看重的结果，判断核心阻力在哪里，而不是直接开始讲价格。", "customer_needs_id"),
      question("sb-ni4", "你第一次拜访一个大客户，对方安排了两个人接待你，但你还不确定谁是真正的决策者。这时候，我会通过问题和观察判断决策链，而不是随机选一个人重点公关。", "customer_needs_id"),
      // 关系推进与跟进节奏
      question("sb-pf1", "你跟进一个意向客户已经两周，上次沟通后对方一直没有回复你的消息。面对这种情况，我会主动联系，带着新的信息或下一步动作再推进，而不是干等对方回复。", "pipeline_followthrough"),
      question("sb-pf2", "客户已经表示有意向，但一直说'再等等''时机不成熟'，已经拖了三周。这时候，我会直接和客户确认是什么在阻碍推进，而不是继续发资料等对方自己想通。", "pipeline_followthrough"),
      question("sb-pf3", "你管理的线索里有十几个，有些最近反应热，有些一个月没动静。关键节点到了，需要重新排优先级。这时候，我会按成单概率和时间成本重新分配跟进力度，而不是平均分配时间给所有线索。", "pipeline_followthrough"),
      question("sb-pf4", "你推进的一笔合作快到关键决策节点了，但客户内部好像还没有统一意见。这时候，我会主动了解他们内部的分歧点，帮助推动对方内部对齐，而不是等他们自己协商好再来找我。", "pipeline_followthrough"),
      // 方案表达与价值呈现
      question("sb-vp1", "你要向一个从没听说过你们公司的新客户介绍方案，对方很忙，只给你五分钟。这时候，我会先用一句话说清楚你们能帮他解决什么问题，再根据他的反应决定接下来说什么。", "value_presentation"),
      question("sb-vp2", "客户说'你们的产品功能和竞品差不多，凭什么选你们'。面对这种情况，我会先了解他们最看重的是什么，再针对他们的重点说明差异，而不是泛泛地列功能清单。", "value_presentation"),
      question("sb-vp3", "你准备了一份详细的方案，但在介绍过程中发现客户的真实关注点和你的方案重点不完全一致。这时候，我会当场调整讲解重点，而不是把已经准备好的内容照本宣科讲完。", "value_presentation"),
      question("sb-vp4", "你要向一个技术背景的客户介绍为什么他们的业务团队需要你的产品，但他对业务场景不熟悉。这时候，我会先把产品价值翻译成对他们业务指标的具体影响，再讲功能细节。", "value_presentation"),
      // 异议处理与谈判推进
      question("sb-oh1", "客户提出价格异议时，我会先了解他的预算和期望结果，再讨论调整方案，而不是直接打折或僵在价格上。", "objection_handling"),
      question("sb-oh2", "面对'我们还在对比竞品，等等再说'这类回应，我能判断真正的阻力在哪里，并针对性地跟进，而不是只是催促对方尽快决定。", "objection_handling"),
      question("sb-oh3", "当客户内部有不同意见导致推进卡住时，我会主动帮助推动他们内部对齐，而不是只等单一联系人给出最终答案。", "objection_handling"),
      question("sb-oh4", "谈判陷入僵局时，我能找到双方都能接受的切入点重新推进，而不是只反复重申自己的立场或直接让步。", "objection_handling"),
      // 结果导向与漏斗管理
      question("sb-ro1", "我会主动追踪每个线索的当前阶段和最近进展，而不是只在客户主动联系时才想起来去跟进。", "result_orientation"),
      question("sb-ro2", "每次跟进结束后，我会明确记录下一步动作和时间节点，不把推进节奏完全交给客户来主导。", "result_orientation"),
      question("sb-ro3", "遇到客户拒绝或这笔单没拿下时，我会认真复盘是哪个环节出了问题，而不是只归因到'时机不对'或'价格问题'。", "result_orientation"),
      question("sb-ro4", "面对多个线索同时推进时，我能根据成单概率和资源成本，主动调整每个线索的跟进策略，而不是平均分配精力。", "result_orientation"),
    ],
  },

  // ── 通用研发 / 质量工程 ─────────────────────────────────────────────────────
  {
    id: "qs-general-rd-quality-v1",
    roleId: "general-rd-quality",
    title: "通用研发 / 质量工程职业准备度评估题组",
    questions: [
      // 实验 / 方案设计
      question("rq-ep1", "接到一个验证任务时，我会先想清楚要验证什么、怎么判断结果算通过，而不是直接开始执行。", "experiment_protocol"),
      question("rq-ep2", "开始测试或实验前，我会主动排查可能遗漏的边界条件或风险点。", "experiment_protocol"),
      question("rq-ep3", "面对多个并行任务时，我会先排好优先级，而不是随手先做最容易的那个。", "experiment_protocol"),
      question("rq-ep4", "完成测试后，我能对结果做出有依据的解读，而不是只报数字。", "experiment_protocol"),
      // 文档记录与留痕
      question("rq-rd1", "执行过程中我有主动记录的习惯，不依赖事后凭记忆重建过程。", "record_documentation"),
      question("rq-rd2", "我整理的测试或实验记录能保证数据可追溯，别人拿到记录也能复现过程。", "record_documentation"),
      question("rq-rd3", "我能把自己的操作步骤和结论整理成团队其他人看得懂的格式。", "record_documentation"),
      question("rq-rd4", "发现数据缺失或记录不全，我会主动补全，而不是直接用模糊的结论。", "record_documentation"),
      // 质量意识与规范执行
      question("rq-qc1", '执行任务时我会严格遵守标准流程，不会因为觉得"差不多"就跳步骤。', "quality_compliance"),
      question("rq-qc2", '遇到测量偏差或异常结果，我会主动追查原因，而不是接受"误差范围内"的说法。', "quality_compliance"),
      question("rq-qc3", "对重复性工作我能保持稳定的注意力，不会因为太熟悉就降低标准。", "quality_compliance"),
      question("rq-qc4", "在规范要求和效率压力同时存在时，我能找到合理的平衡，不会为了快而漏掉关键步骤。", "quality_compliance"),
      // 跨职能协作
      question("rq-cc1", "向不同背景的同事同步结果时，我会根据对方的角色调整表达方式，而不是所有人都发同一份报告。", "cross_role_collab"),
      question("rq-cc2", "遇到跨团队的分歧（比如研发和质量意见不同），我会主动帮助推动对齐，而不是等上级来处理。", "cross_role_collab"),
      question("rq-cc3", "自己的工作和其他团队有交叉时，我会提前沟通清楚边界和依赖关系。", "cross_role_collab"),
      question("rq-cc4", '收到其他团队的质疑或问题时，我能清楚表达自己的判断，而不是一直说"我再查查"。', "cross_role_collab"),
      // 细节与问题排查
      question("rq-dt1", "遇到异常结果时，我会用系统的方法逐步缩小范围，而不是靠直觉猜测原因。", "detail_troubleshooting"),
      question("rq-dt2", '处理重复性工作中的细节差异，我愿意认真核对，而不是假设"应该一样"。', "detail_troubleshooting"),
      question("rq-dt3", "对已修复的问题，我会主动回测周边功能，而不是只验证修改点本身。", "detail_troubleshooting"),
      question("rq-dt4", '面对难以复现的问题，我能有方法地收集现象、条件和上下文，而不是说"偶发、不好排查"。', "detail_troubleshooting"),
    ],
  },

  // ── 内容创作 / 运营 ───────────────────────────────────────────────────────
  {
    id: "qs-content-operations-v1",
    roleId: "content-operations",
    title: "内容创作 / 运营职业准备度评估题组",
    questions: [
      // 内容理解与选题判断
      question("co-cj1", "编辑发来消息说平台最近有个话题很火，建议你们也做一期，但你不确定和账号现有定位是否契合。这时候，你会怎么判断？", "content_judgment"),
      question("co-cj2", "你手头有三个选题方向，时间只够做其中一个，但没有明确数据支撑哪个更好。面对这种情况，你会怎么推进？", "content_judgment"),
      question("co-cj3", "你接到一个任务：同一个内容核心，需要分别写给专业读者和普通用户两版。这时候，你会怎么开始？", "content_judgment"),
      question("co-cj4", "老板说要做一个'既要有深度、又要好传播'的内容，但没给更多说明。遇到这种情况，你会怎么推进？", "content_judgment"),
      // 内容表达与信息组织
      question("co-ce1", "你拿到了大量采访记录和背景资料，需要把它们整理成一篇有结构的文章。这时候，你会怎么开始？", "content_expression"),
      question("co-ce2", "你要用一篇推文同时达成品牌宣传和引导用户行动两个目标，但这两个目标的语气和优先级有时候会冲突。面对这种情况，你会怎么处理？", "content_expression"),
      question("co-ce3", "你写完一篇内容，编辑反馈说'信息量太大，普通读者看不下去'。遇到这种情况，你会怎么改？", "content_expression"),
      question("co-ce4", "你需要把一个技术复杂、难以简单说明的产品，写成一篇普通用户也能看懂的推广内容。这时候，你会怎么做？", "content_expression"),
      // 执行节奏与协同推进
      question("co-ex1", "内容项目的拍摄已经完成，但设计同事说修图还要三天，而你承诺的上线时间是后天。这时候，你会怎么处理？", "content_execution"),
      question("co-ex2", "你正在推进一个多人协作的内容项目，有一个合作方一直没有按时交稿，导致后续环节全部卡住。遇到这种情况，你会怎么处理？", "content_execution"),
      question("co-ex3", "临发布前一天，品牌方突然要求改整体文案风格，但整个内容已经全部做完了。这时候，你会怎么处理？", "content_execution"),
      question("co-ex4", "你同时在推进三条内容，优先级不清楚，每个相关方都说自己的最急。面对这种情况，你会怎么安排？", "content_execution"),
      // 反馈感知与内容优化
      question("co-fi1", "做完一篇内容发出之后，我会先看数据判断是标题、内容结构还是发布时机的问题，而不是只归因到'这次选题不好'。", "feedback_iteration"),
      question("co-fi2", "遇到用户评论或反馈，我会认真判断有没有对内容方向有帮助的信号，而不是只关注正面评价。", "feedback_iteration"),
      question("co-fi3", "我能根据不同平台的数据反馈（完播率、互动率、点击率等）调整内容形式和重点，而不是所有平台都发同一版内容。", "feedback_iteration"),
      question("co-fi4", "面对一个持续跑出好数据的内容方向，我会主动总结背后的规律，而不是只复制形式。", "feedback_iteration"),
      // 稳定输出与内容责任感
      question("co-or1", "我能在没有明确要求的情况下，自己核查内容里的事实、数字和引用是否准确，而不是等别人来挑错。", "output_responsibility"),
      question("co-or2", "遇到内容任务比平时多、节奏很快的情况，我仍然能保持基本的发布标准，而不是为了赶进度就降低质量。", "output_responsibility"),
      question("co-or3", "我会在每次内容发布前再过一遍排版、措辞和逻辑，而不是改完就直接发出去。", "output_responsibility"),
      question("co-or4", "面对长期需要稳定输出的内容节奏，我能找到自己持续产出的方法，而不是只在有灵感时才能写出好内容。", "output_responsibility"),
    ],
  },

  // ── 人力资源 ─────────────────────────────────────────────────────────────
  {
    id: "qs-hr-organization-v1",
    roleId: "hr-organization",
    title: "人力资源职业准备度评估题组",
    questions: [
      // 候选人 / 员工需求判断
      question("hr-ci1", "一个候选人在面试中说自己'很有上进心、想快速成长'，但在具体问题上回答比较模糊。这时候你需要对他的岗位适配度做出判断，你会怎么推进？", "candidate_employee_insight"),
      question("hr-ci2", "一个表现一直稳定的老员工最近找你说'感觉当前工作没什么意思'，但说不清楚具体是哪里出了问题。遇到这种情况，你需要判断背后的真正原因，你会怎么做？", "candidate_employee_insight"),
      question("hr-ci3", "你在审一批简历，有一位候选人经历和岗位要求不完全匹配，但有几个亮点让你觉得他可能值得约谈。这时候你需要在资源有限的情况下决定是否安排面试，你会怎么判断？", "candidate_employee_insight"),
      question("hr-ci4", "你面试了三个背景都不错的候选人，业务负责人说'都挺好，你们定'，但最终需要你给出一个录用推荐。面对这种判断难题，你会怎么推进？", "candidate_employee_insight"),
      // 沟通协调与关系处理
      question("hr-mc1", "业务负责人要求你在两周内补两个岗位，但目前候选人数量不足，你评估在这个时间内很难找到合适人选。面对这种情况，你会怎么处理？", "multi_party_communication"),
      question("hr-mc2", "候选人已经拿到你们的 offer，但临签约前提出了调薪要求，业务负责人不愿突破预算，候选人的期望又高出一截。这时候，你会怎么推进？", "multi_party_communication"),
      question("hr-mc3", "一个员工找你反映与直属上司的关系问题，但那位上司是业务核心骨干，你既不能置之不理，也不想轻易激化矛盾。遇到这种情况，你会怎么处理？", "multi_party_communication"),
      question("hr-mc4", "两个业务部门同时提交了紧急招聘需求，但你只有一个招聘专员的资源，没办法同时高强度跟进两个岗位。面对这种情况，你会怎么安排？", "multi_party_communication"),
      // 流程执行与细节规范
      question("hr-pe1", "一个候选人的 offer 需要明天发出，但你发现合同模板上有一个条款和实际谈定的条件有出入，法务今天又联系不上。这时候，你会怎么处理？", "process_detail_execution"),
      question("hr-pe2", "新员工入职流程正在推进，但他说学历证书还没寄到，需要等几周，业务部门催得比较急。遇到这种情况，你会怎么处理？", "process_detail_execution"),
      question("hr-pe3", "年度绩效考核截止日期到了，有三个部门的考核表单还没有提交，你已经发过两次提醒但仍没有回应。这时候，你会怎么处理？", "process_detail_execution"),
      question("hr-pe4", "你在整理面试评分记录时，发现两位面试官对同一个候选人的打分差异极大，双方都认为自己的判断正确。遇到这种情况，你会怎么处理？", "process_detail_execution"),
      // 判断力与问题处理
      question("hr-jp1", "遇到候选人简历看起来很好但面试表现明显落差时，我会追问具体场景，而不是简单按综合印象做决定。", "hr_judgment_problem_solving"),
      question("hr-jp2", "面对需要推进员工离职的情况，我能保持专业和平稳，做好合规步骤，同时兼顾对方的情绪和处境。", "hr_judgment_problem_solving"),
      question("hr-jp3", "遇到某个岗位长期招不到合适候选人的情况，我会先回顾渠道来源和 JD 描述是否有问题，而不是只催招聘专员加快节奏。", "hr_judgment_problem_solving"),
      question("hr-jp4", "遇到员工因政策或决定不满来找 HR 反映诉求时，我能先把对方的核心关切听清楚，再判断该怎么回应，而不是直接照搬规则答复。", "hr_judgment_problem_solving"),
      // 组织意识与长期视角
      question("hr-oa1", "我会在日常招聘中考虑候选人的长期发展潜力，而不只是看他能否满足当前岗位的短期需求。", "organizational_awareness"),
      question("hr-oa2", "遇到某个 HR 流程或政策在执行中出现阻力时，我会先判断是流程本身的问题还是沟通方式的问题，而不是直接要求业务部门强行配合。", "organizational_awareness"),
      question("hr-oa3", "我能把人才数据（离职率、招聘周期、内部晋升比）和业务健康度联系起来看，而不只是把它们当作 HR 内部指标。", "organizational_awareness"),
      question("hr-oa4", "面对不同职能部门对 HR 服务的不同期待，我能主动了解他们的真实业务需求，而不是以统一流程回复所有诉求。", "organizational_awareness"),
    ],
  },
];

export const questionSets = rawQuestionSets.map((item) => enhanceQuestionSet(item));

export function findQuestionSetByRole(roleId) {
  return questionSets.find((item) => item.roleId === roleId) ?? null;
}
