import { getRoleById } from "../data/roles.js";
import { findQuestionSetByRole } from "../data/questionSets.js";
import { getResultTemplate } from "../data/resultTemplates.js";
import { getRoleProfile } from "../data/roleProfiles.js";
import { getRoleConfig, getContextualActionPlan } from "../data/roleConfig.js";
import { buildActionPlan } from "../data/actionPlanTemplates.js";
import { resolveRoleSelection } from "../data/roleSystem.js";
import { getDimensionDevelopmentCard } from "../data/dimensionActionPlaybooks.js";
import { isEliteSchool, mapCareerStageToGuidanceStage } from "./profileSignals.js";

const answerScoreMap = {
  rarely: 1,
  sometimes: 2,
  often: 3,
  always: 4,
};

const dimensionLabels = {
  problem_solving:           "看懂问题",
  communication:             "讲清想法",
  ownership:                 "主动推进",
  analysis:                  "看懂数据",
  market_sense:              "理解市场",
  execution:                 "把事做完",
  relationship:              "维护关系",
  resilience:                "抗压能力",
  learning:                  "学得够快",
  detail:                    "顾到细节",
  structure:                 "讲得有条理",
  discipline:                "遵守规范",
  user_insight:              "理解用户",
  requirement_structuring:   "拆清需求",
  stakeholder_alignment:     "协同推进",
  data_iteration:            "数据复盘",
  audience_insight:          "理解读者",
  content_strategy:          "内容规划",
  channel_execution:         "跑通渠道",
  conversion_review:         "效果复盘",
  trust_building:            "建立信任",
  needs_discovery:           "看懂需求",
  solution_alignment:        "讲清方案",
  relationship_followthrough:"持续跟进",
  mathematical_modeling:     "数学建模",
  experiment_design:         "设计实验",
  reproduction_iteration:    "复现调试",
  engineering_deployment:    "工程部署",
  hardware_foundation:       "硬件基础",
  debugging_trace:           "排查问题",
  stability_verification:    "稳定验证",
  documentation_absorption:  "读懂文档",
  structured_problem_solving:"拆解问题",
  industry_research:         "研究行业",
  business_synthesis:        "商业判断",
  executive_communication:   "向上汇报",
  metric_decomposition:      "拆解数据",
  business_diagnosis:        "读懂业务",
  cross_function_push:       "跨部门推进",
  strategy_iteration:        "持续优化",
  evidence_tracing:          "找到证据",
  control_risk_sense:        "识别风险",
  accounting_judgment:       "会计判断",
  compliance_discipline:     "合规执行",
  report_analysis:           "看懂报表",
  business_finance_linking:  "业财结合",
  cost_management:           "成本管控",
  financial_communication:   "讲清数字",
  problem_definition:        "定义问题",
  metric_calibration:        "口径对齐",
  quantitative_analysis:     "量化分析",
  insight_communication:     "讲清洞察",
  job_requirements:          "岗位要求",
  professionalism:           "职业素养",
  core_skills:               "基本技能",
  daily_operations:          "日常事务",
  career_growth:             "晋升空间",
  workplace_relations:       "职场关系",
  personality_traits:        "性格特征",
};

export const dimensionTraitCopy = {
  problem_solving:           { strength: "你更容易先抓住问题核心，再决定怎么拆。", growth: "先把现象、原因和目标拆开，别急着直接下结论。", scenario: "业务场景：某指标连续下滑 3 周，能「看懂问题」的人会先列假设——是外部竞争、内部缺陷还是营销节奏——再逐一验证，而不是没有判断就直接给解法。" },
  communication:             { strength: "你能把自己的判断讲得更清楚，不容易越说越乱。", growth: "先练习一句话讲清重点，减少表达里的绕弯子。", scenario: "业务场景：周会汇报时你说了 10 分钟背景，老板打断说「结论是什么」。能讲清想法的人会把结论放最前，用一句话让对方先知道你要说什么，再展开依据。" },
  ownership:                 { strength: "你会主动把事情往前推，而不是等别人提醒。", growth: "先把下一步动作说清楚，别让推进停在想法阶段。", scenario: "业务场景：一个协作项目卡在另一个部门迟迟没进展，弱势做法是等或汇报「他们还没给」；强势做法是主动找到对方、确认卡点、提出帮助，把任务推进到有结果。" },
  analysis:                  { strength: "你更愿意用信息和证据支持判断。", growth: "先补数据和事实依据，别只靠直觉判断。", scenario: "业务场景：负责一个渠道，想证明它有效，弱势做法是说「效果不错」；强势做法是把转化漏斗拆开，找到哪一步转化率最低，用数据说清楚问题在哪。" },
  market_sense:              { strength: "你对市场变化和岗位环境更有感觉。", growth: "多看真实行业案例，先把外部变化和岗位要求连起来。", scenario: "业务场景：做校园招聘时，你清楚这个岗位目前竞争有多激烈、大厂最看重哪两三个能力、哪类背景匹配度最高——这种市场感知能帮你精准定位竞争策略。" },
  execution:                 { strength: "你能把计划落到动作上，不容易只停在概念里。", growth: "先把动作拆细并执行到位，别让计划停在纸面上。", scenario: "业务场景：接到一个两周交付的项目，执行力强的人会在第三天就识别到依赖风险并提前沟通，而不是等到第十天才说来不及了。" },
  relationship:              { strength: "你更懂得在合作里维护关系和推进节奏。", growth: "先练习持续跟进，让合作不只停在一次沟通。", scenario: "业务场景：项目结束后发一条总结感谢，偶尔转发相关内容保持联系——这种持续维护关系的意识在职场里会不断复利，而不是等有需要才想起对方。" },
  resilience:                { strength: "遇到压力时你更能稳住节奏。", growth: "先建立复盘习惯，别让压力直接打断行动。", scenario: "业务场景：你花两周做的方案在评审会上被全盘否定，会议室里还有其他同事。强势的反应是接受反馈、快速判断哪些批评可用、当天内更新方案思路，这是抗压能力的真实考验。" },
  learning:                  { strength: "你吸收新方法和新任务的速度更快。", growth: "先固定一套学习节奏，别总是学了又散。", scenario: "业务场景：入职第一周发现公司用了一套你从没见过的内部工具，能快速学习的人三天内问清核心逻辑、两周内独立上手、一个月内发现改进点，而不是等别人手把手教完每一步。" },
  detail:                    { strength: "你对关键细节更敏感，不容易漏掉硬伤。", growth: "先把检查动作做完整，避免小失误拖累整体表现。", scenario: "业务场景：一份发给客户的合同里有个日期写错了，弱势情况是发出去后被对方指出；强势情况是你有「发出前必须检查关键数字」的习惯，让这类低级错误不出现在你手里。" },
  structure:                 { strength: "你能把复杂信息讲得更有层次。", growth: "先按背景、问题、动作、结果去组织表达。", scenario: "业务场景：老板让你讲一个复杂竞品分析，弱势的是从头流水账；强势的是先说「我从三个维度来看：用户定位、产品策略和商业模式」，让对方在你开口 30 秒内就能跟上。" },
  discipline:                { strength: "你在规则和流程里执行得更稳。", growth: "先把规范要求记清楚，避免边做边补漏洞。", scenario: "业务场景：公司规定「客户报价需 48 小时内提交审批」，你觉得自己判断更准直接口头承诺，后来出了问题，发现没有书面审批记录，任何承诺都不算数——这就是遵守规范的代价。" },
  user_insight:              { strength: "你更容易先抓到用户真正卡住的点。", growth: "先把反馈翻译成真实需求，别只看表面描述。", scenario: "业务场景：用户说「功能太麻烦」，背后可能是找不到入口，或完成一步就跳出来了。能洞察用户的 PM 不会转述反馈，而是通过访谈和操作录屏还原真实卡点，再定义问题。" },
  requirement_structuring:   { strength: "你能把零散信息整理成清楚需求。", growth: "先把目标、约束和优先级拆清楚，再进入方案。", scenario: "业务场景：老板说「加个提醒功能」，弱势 PM 直接写 PRD，结果研发在评审时问「提醒谁、什么条件触发、和现有通知冲不冲突」——答不上就被打回。强势 PM 先把目标和约束拆清楚再下笔。" },
  stakeholder_alignment:     { strength: "你能更自然地把不同人的想法拉到同一页。", growth: "先练习在分歧里讲清取舍，而不是只重复各方意见。", scenario: "业务场景：研发说排期不够、运营说这版必须上、设计说方案没定，你的角色不是任何一方代言人，而是找到「削减版本先上、下一版补齐」这条大家都能接受的路径。" },
  data_iteration:            { strength: "你会用数据判断方案该不该继续。", growth: "先补指标意识，别只凭感觉判断效果。", scenario: "业务场景：新功能上线两周，老板问「效果怎么样」。你能说出「核心路径完成率提升 12%，但 D7 留存没动，卡点在首次体验」，还是只能说「用户反馈还不错」。" },
  audience_insight:          { strength: "你更容易抓住内容真正要打动的人。", growth: "先把受众画像说清楚，再决定内容怎么写。", scenario: "业务场景：「女大学生都喜欢护肤」不是洞察，「大三考研期压力大的女生更需要能快速完成的极简护肤步骤」才是能指导内容选题的真实洞察。" },
  content_strategy:          { strength: "你更能把内容方向和目标连起来。", growth: "先明确内容目标，别只追求形式好看。", scenario: "业务场景：内容团队问「这周发什么」，弱势是「随便发条产品介绍」；强势是「这周配合秋招季，发三条强调成长感的内容，周五发一条 CTA 引导留资」。" },
  channel_execution:         { strength: "你对不同渠道的节奏和打法更有感觉。", growth: "先区分平台差异，别用一套方法跑所有渠道。", scenario: "业务场景：同一条内容，微信公众号适合长文讲逻辑，抖音需要前三秒钩子，小红书要图文双强。不区分平台打法，就会在所有渠道效果都差。" },
  conversion_review:         { strength: "你会回头看动作有没有真正带来结果。", growth: "先把曝光、互动和转化拆开复盘，别只看热闹数据。", scenario: "业务场景：活动复盘报告不是「曝光量 50 万」，而是「曝光 50 万，点击率 2.3%，留资 480 人，对比上期成本下降 15%，判断是标题优化带来的」。" },
  trust_building:            { strength: "你更容易在合作里建立让人放心的感觉。", growth: "先把承诺和跟进做扎实，信任才会慢慢形成。", scenario: "业务场景：第一次拜访客户只有 20 分钟，能不能让他对下次会面感兴趣，比这次说了多少更重要。建立信任的核心是「让对方感觉你懂他的问题，而不只是在卖东西」。" },
  needs_discovery:           { strength: "你能更快听出对方真正想解决的问题。", growth: "先多追问需求背景，别急着给答案。", scenario: "业务场景：客户说「我们想提升员工满意度」。弱势销售直接推方案；强势销售会问「满意度问题主要在哪个层级？是沟通还是发展通道？你们内部怎么量的？」然后从答案里找真需求。" },
  solution_alignment:        { strength: "你能把方案讲到对方愿意继续往下聊。", growth: "先把方案和对方目标对齐，再谈你的想法。", scenario: "业务场景：你的方案超了客户预算，弱势做法是打折；强势做法是拆分方案——「核心模块先上，进阶功能明年续费再加」，让客户觉得今天签是性价比最高的选择。" },
  relationship_followthrough:{ strength: "你会持续跟进，不容易把合作放丢。", growth: "先把跟进节奏固定下来，别总靠临时想起。", scenario: "业务场景：签完合同的客户需要定期 check-in，不是等对方出问题才联系，而是主动每月发一次使用数据加下季度优化建议，让对方续签时感觉你一直在。" },
  mathematical_modeling:     { strength: "你有把问题抽象成模型的能力。", growth: "先把变量、假设和目标理顺，再开始建模。", scenario: "业务场景：业务说「用户流失了很多」，你需要把它转化成「用 N 天留存率作为目标变量，用行为特征建分类模型，找出哪类用户最易流失、共同特征是什么」，而不是直接上模型。" },
  experiment_design:         { strength: "你更懂得怎么把实验做得可比较、可解释。", growth: "先补基线和变量控制，别让实验结论站不住。", scenario: "业务场景：设计推荐算法 A/B 测试时，需要考虑：流量怎么分、实验组和对照组是否可比、实验周期多长、用哪个指标判断显著性——每一步都影响结论可靠性。" },
  reproduction_iteration:    { strength: "你愿意反复复现和调参，把问题做实。", growth: "先把每次迭代记录清楚，别只留最后结果。", scenario: "业务场景：复现一篇论文时指标和原文差 5%，弱势做法是「可能数据集版本不同」，强势做法是逐层检查预处理、超参、随机种子，把误差来源说清楚才能继续迭代。" },
  engineering_deployment:    { strength: "你会把技术方案往可落地的方向推进。", growth: "先补部署和工程约束，别只停在离线效果里。", scenario: "业务场景：离线指标很好的模型上线后效果打折，原因可能是特征在线计算延迟、数据分布偏移或内存限制。工程部署能力决定你能不能把实验结果真正带上线。" },
  hardware_foundation:       { strength: "你的底层基础更能支撑后续排障和联调。", growth: "先把底层原理补稳，别只会照着接线和改代码。", scenario: "业务场景：新板子上电后串口没有输出，弱势工程师打开搜索引擎；强势工程师先用万用表量 VCC 和 GND 是否正常，再看晶振有没有起振，从物理层往软件层排查。" },
  debugging_trace:           { strength: "你更擅长沿着链路一步步找到问题。", growth: "先练习按现象、日志、接口顺序排查，别跳步猜测。", scenario: "业务场景：MCU 跑着跑着复位了，弱势做法是随机改代码重烧录；强势做法是先看 Watch Dog 有没有触发、堆栈有没有溢出，再从复位前日志里找最后一条记录是什么。" },
  stability_verification:    { strength: "你会主动考虑稳定性，而不只追求跑通。", growth: "先把异常场景也测进去，别只验证正常流程。", scenario: "业务场景：在实验台上跑通了不算完，要在高低温、振动、连续运行 48 小时后结果仍然稳定才算验证。漏测一个异常场景可能导致量产后大规模返修。" },
  documentation_absorption:  { strength: "你能更快从文档里抓到关键约束。", growth: "先练习读文档找重点，减少边试边猜。", scenario: "业务场景：拿到一颗新芯片，弱势工程师直接抄例程；强势工程师先翻 Datasheet 的 Electrical Characteristics 和 Application Notes，搞清楚 timing 要求再上手——能减少一半以上调试时间。" },
  structured_problem_solving:{ strength: "你能把复杂问题拆成有顺序的步骤。", growth: "先把问题框住，再分层拆解，不要一上来就发散。", scenario: "业务场景：客户说「市场份额在下降」，弱势顾问给出「需要提升品牌力」；强势顾问先把问题框住——是份额下降还是市场萎缩、是全品类还是单品类——再决定从哪条线深挖。" },
  industry_research:         { strength: "你更容易把行业信息整理成有用判断。", growth: "先从行业事实出发，别只堆信息不下判断。", scenario: "业务场景：一小时行业研究，弱势做法是把搜到的信息堆在幻灯片里；强势做法是提炼出「这个行业的核心驱动力是什么、未来 3 年谁能赢」，能对判断下结论才是真正做过研究。" },
  business_synthesis:        { strength: "你能把业务信息合成更完整的结论。", growth: "先把市场、财务和竞争关系串起来，再下结论。", scenario: "业务场景：同一份财报，弱势顾问读出「收入增长 12%」；强势顾问能说「毛利率下降表明定价权在削弱，结合市占率增长，可能是为抢份额牺牲盈利，需要看竞对是否同步降价」。" },
  executive_communication:   { strength: "你更能把复杂内容压缩成领导听得懂的话。", growth: "先练习短句结论和重点前置，减少铺垫。", scenario: "业务场景：你做了 40 页分析，CEO 只给 5 分钟。能不能先说「结论是 X，主要原因 A、B、C，建议优先做 1，原因是……」，而不是从第一页开始铺垫背景。" },
  metric_decomposition:      { strength: "你能把大目标拆成可跟踪的指标。", growth: "先把核心目标和关键指标对应起来，别只看总结果。", scenario: "业务场景：老板说「GMV 没达标」。弱势运营说「可能流量不够」；强势运营把 GMV 拆成「访客数 × 转化率 × 客单价」，再逐层看哪个指标偏离，才能定位问题。" },
  business_diagnosis:        { strength: "你更容易看出业务问题真正卡在哪。", growth: "先分清现象和根因，再决定往哪条线深挖。", scenario: "业务场景：看到某指标异常，不是马上给方案，而是先判断「这是偶发还是持续、是全渠道还是局部、是前端表现还是后端数据问题」，诊断清楚了才知道该找谁、做什么。" },
  cross_function_push:       { strength: "你能把跨团队协作往结果上推进。", growth: "先把责任边界和节点讲明白，减少推进中的反复。", scenario: "业务场景：一个增长项目同时需要产品改页面、技术改接口、供应链备货、市场同步内容，你的工作是识别关键路径、在每个节点前提前预警，而不是等延误发生再追人。" },
  strategy_iteration:        { strength: "你会边做边调，不容易固守第一版方案。", growth: "先建立复盘节点，别等结果不好才回头看。", scenario: "业务场景：活动结束后不只汇报战果，而是提炼「哪个渠道 ROI 最高、哪个策略失效了、下次要提前两周启动什么动作」，把经验变成下一次的执行手册。" },
  evidence_tracing:          { strength: "你更擅长从证据里找到可靠判断。", growth: "先把证据链补完整，别急着凭印象下结论。", scenario: "业务场景：审计一笔大额应付账款时，不是看账户余额，而是追溯发票、合同、收货记录、银行流水是否一一对应，任何一个链条断掉都需要进一步核查。" },
  control_risk_sense:        { strength: "你对风险点更敏感，能提前发现问题。", growth: "先把关键风险列出来，再决定动作顺序。", scenario: "业务场景：走内控流程时发现某合同审批只需要一个人签字就可以超百万付款，这是典型控制薄弱点，需要识别并写进风险报告，而不是走过场。" },
  accounting_judgment:       { strength: "你对数字背后的业务含义更有判断。", growth: "先把会计口径和业务场景对上，避免只背概念。", scenario: "业务场景：客户把一笔研发支出资本化，你需要判断它是否符合准则——是真的达到了开发阶段的确定性，还是为了平滑利润人为定性，这需要结合业务实质做判断。" },
  compliance_discipline:     { strength: "你能在规则要求下把动作做得更稳。", growth: "先把合规边界记牢，别做完才发现踩线。", scenario: "业务场景：底稿需要按准则要求完整归档，任何一份支持文件的缺失都可能在质检或监管检查时被提出，合规执行不是选做题而是行业基准线。" },
  report_analysis:           { strength: "你能从报表里更快看出重点变化。", growth: "先练习按指标和原因拆读报表，别只看结果高低。", scenario: "业务场景：拿到三张表，弱势财务数出利润；强势财务同时看经营性现金流和利润的差异，判断有没有应收款积压或存货异常，这才是报表真正有价值的地方。" },
  business_finance_linking:  { strength: "你更能把业务动作和财务结果联系起来。", growth: "先把业务变化和财务影响连起来理解。", scenario: "业务场景：销售说「这个客户打了折，但量大」，财务需要计算这个折扣是否让毛利率低于盈亏平衡点，把业务决策翻译成财务影响，才能给出有用建议而不只是记账。" },
  cost_management:           { strength: "你有控制成本和评估投入产出的意识。", growth: "先建立成本视角，别只看要做什么不看代价。", scenario: "业务场景：某产品线成本一直偏高，弱势财务汇报「材料成本占比 68%」；强势财务会拆分固定成本和变动成本，判断是规模不经济还是采购价格问题，再提出削减方向。" },
  financial_communication:   { strength: "你能把复杂数字讲成别人听得懂的话。", growth: "先把结论和数字对应起来，避免只堆报表术语。", scenario: "业务场景：你做了财务分析，需要给业务负责人讲，对方不懂 EBITDA，你需要用「去掉折旧摊销之后公司实际赚了多少现金」这样的方式翻译，让对方听懂再做决策。" },
  problem_definition:        { strength: "你能先把题目定义清楚，再开始分析。", growth: "先明确要回答什么问题，别一开始就散着做。", scenario: "业务场景：老板说「看一下为什么用户留存下降了」，弱势分析师直接跑数；强势分析师先问「是所有用户还是某个渠道、是整体 D7 还是某个核心行为的频次、时间范围要多长」，边界清楚结论才有效。" },
  metric_calibration:        { strength: "你更懂得先把指标口径对齐。", growth: "先确认口径一致，再比较数据和得出判断。", scenario: "业务场景：两个人都用「活跃用户」说事，一个指「7 天内登录」，另一个指「30 天内有核心行为」，口径不一致的情况下数据对比毫无意义，必须先对齐定义。" },
  quantitative_analysis:     { strength: "你能用量化方式把判断讲得更稳。", growth: "先补数据分析基本功，别只给方向不给依据。", scenario: "业务场景：判断一个功能改动是否有效，弱势做法是看绝对数字；强势做法是做 A/B 实验，控制变量、计算置信区间、排除节假日干扰因素，才能说「这个改动真的带来了提升」。" },
  insight_communication:     { strength: "你能把洞察压缩成更有说服力的表达。", growth: "先把洞察讲成一句结论，再补支撑依据。", scenario: "业务场景：做了一周数据分析，弱势的是贴一堆图表；强势的是先给结论「我们在北方城市的拉新 ROI 比南方低 40%，核心原因是本地竞品在做补贴战，建议先撤出再观察」，再展开支撑。" },
  job_requirements:          { strength: "你更能快速识别岗位要求并转化为可执行动作。", growth: "先把岗位 JD 的硬性要求逐条对照，找到自己还没覆盖的部分。", scenario: "业务场景：你看了 10 条产品经理 JD，能拆出「平台/商业化/增长/工具」四个方向各自不同的要求，并对照自己经历找出覆盖了多少——这才是真正理解岗位要求，而不只是看懂字面。" },
  professionalism:           { strength: "你有更强的职场规范意识，沟通留痕、边界感清晰。", growth: "先把「口头确认必须留书面记录」变成习惯，减少信息失真带来的摩擦。", scenario: "业务场景：和研发对需求时口头说了「这块可以改成这样」，但没有更新文档。版本上线功能和预期不符，研发说「你当时不是说可以的」——口头承诺不算数，留痕才是职场规范的核心。" },
  core_skills:               { strength: "你遇到陌生工具或任务时更愿意主动上手解决，不容易被技能盲区卡住。", growth: "先把最高频用到的工具练熟，再拓展周边技能。", scenario: "业务场景：产品经理被问「你会用 SQL 吗」，不是要你成为数据工程师，而是能不能独立写基本查询，不用每次都等数据同学帮你取数——这就是核心技能的底线。" },
  daily_operations:          { strength: "你对职场里「没写在 JD 上的隐性工作」有更强的感知和处理能力。", growth: "先练习在多方诉求冲突时找到最小摩擦的推进方式，而不是只站一边。", scenario: "业务场景：某天上午研发说某功能有技术风险，下午运营说推广已经排期，你需要在两小时内判断是否降级需求、通知哪些人、同步什么方案——这就是日常事务的真实密度。" },
  career_growth:             { strength: "你有更清晰的职业成长意识，不容易被短期舒适区困住。", growth: "先想清楚自己 2 年后想成为什么样的人，再倒推现在该主动争取什么机会。", scenario: "业务场景：你刚入职当助理 PM，看到高级 PM 的工作是「决定这个需求做不做」，想缩短这段距离，就需要主动在每个项目里问「为什么做这个」，而不是只执行任务。" },
  workplace_relations:       { strength: "你更善于处理上下级和平级之间的复杂关系，不容易把职场关系搞僵。", growth: "先练习「私下沟通，公开解决」的节奏，减少在公开场合产生不必要的对立。", scenario: "业务场景：你发现研发在代码评审里悄悄缩减了需求的功能范围，但没有主动告诉你。弱势 PM 直接升级冲突；强势 PM 先私下了解原因，再在文档里明确约定「任何范围变更需书面确认」。" },
  personality_traits:        { strength: "你的团队融合度和抗压能力更强，更容易在新环境里快速站稳。", growth: "先建立自我觉察的习惯，在状态下滑前主动说出来，而不是扛到崩溃。", scenario: "业务场景：版本延误后老板追责，需求方在群里说「当初 PM 理解有偏差」。你需要在公开压力下先稳住、再内部确认事实、再在合适场合澄清，而不是当场反击或沉默到底。" },
};

function getFitLabel(score) {
  if (score >= 80) return "匹配度较高";
  if (score >= 65) return "潜力明显";
  return "需要补足";
}

function getDimensionLevel(average) {
  if (average >= 3.25) return "优势项";
  if (average >= 2.5) return "可发展";
  return "待补足";
}

function averageByDimension(questionSet, answers) {
  const buckets = new Map();

  questionSet.questions.forEach((item) => {
    const score = answerScoreMap[answers[item.id]] ?? 0;
    const current = buckets.get(item.dimension) ?? { total: 0, count: 0 };
    current.total += score;
    current.count += 1;
    buckets.set(item.dimension, current);
  });

  return Array.from(buckets.entries())
    .map(([dimension, value]) => {
      const average = value.count === 0 ? 0 : Number((value.total / value.count).toFixed(2));
      return {
        dimension,
        label: dimensionLabels[dimension] ?? dimension,
        average,
        score: Math.round((average / 4) * 100),
        level: getDimensionLevel(average),
      };
    })
    .sort((left, right) => right.average - left.average);
}

function getTraitCopy(dimension, label, kind) {
  const scopedCopy = dimensionTraitCopy[dimension]?.[kind];
  if (scopedCopy) {
    return scopedCopy;
  }

  return kind === "strength"
    ? `你在「${label}」上更容易形成稳定发挥。`
    : `先把「${label}」练成稳定动作，别继续靠感觉处理。`;
}

function buildTraitCards(dimensionRanking, kind, limit = 3) {
  const source =
    kind === "strength"
      ? dimensionRanking.slice(0, limit)
      : [...dimensionRanking].slice(-limit).reverse();

  return source.map((item) => ({
    dimension: item.dimension,
    keyword: item.label,
    explanation: getTraitCopy(item.dimension, item.label, kind),
    score: item.score,
    ...getDimensionDevelopmentCard({
      dimension: item.dimension,
      label: item.label,
      score: item.score,
    }),
  }));
}

function buildWarmClosingMessage(baseContent, roleName) {
  return `${baseContent} 你不用一下子把所有差距都补完，先把最关键的一步走稳，就已经在往 ${roleName} 靠近了。后面的准备过程里，这份结果会更像一张同行地图，帮你一点点把方向看清、把动作落下去。`;
}

function resolvePlanByResumeStage(plan, resumeStage) {
  if (Array.isArray(plan)) {
    return plan;
  }

  if (plan && typeof plan === "object") {
    return plan[resumeStage] ?? plan.default ?? [];
  }

  return [];
}

function buildOverseasHooks(template) {
  return (template.overseas ?? []).map((item) => `${item.path}：${item.focus}`);
}

function buildNextSteps(template, roleName, targetCompany, weakestFocus, internshipPlan) {
  return [
    `先完成 1 个和 ${roleName} 强相关的案例沉淀，确保能讲清楚场景、动作、结果和复盘。`,
    weakestFocus
      ? `把「${weakestFocus}」设成接下来 4 周的专项补足主题，避免继续模糊带过。`
      : template.studyPlan[0],
    targetCompany
      ? `整理 ${targetCompany} 或同类公司的 5 条岗位 JD，对照现有材料补关键词和证据。`
      : internshipPlan[0] ?? template.studyPlan[0],
  ];
}

function trimEndingPunctuation(text = "") {
  return String(text).trim().replace(/[。！？；，、]+$/u, "");
}

function buildStrengthInsight(label, explanation) {
  const cleaned = trimEndingPunctuation(explanation);

  if (!cleaned) {
    return `说明你在「${label}」相关场景里更容易形成稳定发挥`;
  }

  if (cleaned.startsWith("你")) {
    return `说明${cleaned.slice(1)}`;
  }

  return `说明${cleaned}`;
}

function buildWeaknessAction(explanation) {
  const cleaned = trimEndingPunctuation(explanation);

  if (!cleaned) {
    return "对应的提升重点是尽快把这项能力练成稳定动作";
  }

  return `对应的提升重点是：${cleaned}`;
}

function buildRequirementDetail(category, text, roleName) {
  if (/案例|项目/.test(text)) {
    return `换句话说，面试里你至少要能拿出 1 到 2 段完整经历，按“背景是什么、你判断了什么、具体做了什么、结果怎么验证、下次会怎么改”讲成闭环；如果只能停留在“我参与过”，招聘方通常会默认你还没有真正达到 ${roleName} 的入场标准。`;
  }

  if (/数据|指标/.test(text)) {
    return `这类要求在面试追问里非常常见。你至少要说清楚：为什么选这几个指标、这些指标分别代表什么、结果好坏怎么判断；否则你做过的事情很容易被看成“有动作但没有验证”，岗位适配度会明显打折。`;
  }

  if (/用户|需求|反馈/.test(text)) {
    return `招聘方真正想确认的，不是你有没有听过用户声音，而是你能不能把零散反馈翻译成清楚的问题定义，再进一步做取舍和判断。很多人卡在这里，就是因为会复述现象，却讲不清背后的真实需求。`;
  }

  if (/A\/B|实验|访谈|跨团队/.test(text)) {
    return `这类经历之所以加分，不是因为名词听起来高级，而是因为它能证明你已经进入过真实业务场景：你面对过不确定性、做过验证、和别人协同推进过，而不是只在纸面上做分析。`;
  }

  if (category === "硬性准入") {
    return `这是招聘方筛简历和初面时最先看的内容。没有这类证据，通常不是“以后再学就行”，而是很可能连进入深入评估的机会都拿不到。`;
  }

  if (category === "核心看重") {
    return `这类能力往往决定你是不是“看起来相关”，还是“真的能上手做事”。面试官通常会通过连续追问来判断你是否只是记住了概念，还是能把它落到真实场景里。`;
  }

  if (category === "加分项") {
    return `这部分不会决定你能不能入场，但会决定你和同批候选人相比是不是更有辨识度。尤其当大家基础差不多时，真正做过、复盘过、讲得清的人会明显更占优势。`;
  }

  return `这条要求最终都会回到一个判断：你是否已经在真实场景里证明过自己，而不是只停留在“知道这个词、理解这个概念”的层面。`;
}

function buildDetailedRequirements(requirements = [], roleName) {
  return requirements.map((item) => {
    const requirement = typeof item === "string" ? item : item.requirement;
    const category = typeof item === "string" ? "核心看重" : (item.category ?? "核心看重");

    return {
      category,
      requirement,
      detail: buildRequirementDetail(category, requirement, roleName),
    };
  });
}

const CAREER_STAGE_LABELS = {
  just_entered_university: "刚入大学，还没考虑实习",
  heard_internship_important: "听说过实习重要，但没渠道了解",
  considering_internship_no_direction: "正在考虑实习，但还没确定方向",
  direction_set_seeking_first_internship: "已经确定方向，在找第1段实习中",
  currently_interning_1st: "正在实习中（第1段）",
  currently_interning_2nd: "正在实习中（第2段）",
  currently_interning_3rd_plus: "正在实习中（第3段及以上）",
  experienced_staying_direction: "目前无实习，已有1段+实习经验（持续深耕同方向）",
  experienced_changing_direction: "目前无实习，已有1段+实习经验（准备转向/换方向）",
};

const INTERN_STAGE_DETAIL_MAP = {
  just_entered_university: {
    diagnosis: "你现在最重要的不是马上冲一段看起来很厉害的实习，而是先把岗位认知、项目体验和第一批可展示证据搭起来。这个阶段做对了，后面每一次投递都会更顺；做错了，就容易在低质量尝试里消耗时间。",
    nextTwoWeeks: [
      "先集中看 5 到 8 条目标岗位 JD，把高频要求拆成一张“能力-证据”对照表，弄清这个岗位到底在招什么人。",
      "把课程项目、社团、比赛、校园流程优化等经历都盘一遍，挑出最有机会被改造成岗位案例的 2 条。",
    ],
    nextFourWeeks: [
      "围绕目标岗位做一个微型项目或深度复盘，把经历写成“问题-动作-结果-复盘”的完整页面。",
      "找 1 位学长学姐或从业者做信息访谈，确认你理解的岗位工作内容和真实要求是否一致。",
    ],
    deliverables: [
      "一份岗位能力-个人证据对照表",
      "1 个可讲清楚的项目案例初稿",
      "1 版更接近目标岗位的简历草稿",
    ],
  },
  heard_internship_important: {
    diagnosis: "你已经知道实习重要，但还缺少有效输入和行动路径。这个阶段最大的风险不是慢，而是一直在听别人说重要，却没有把信息转成自己的动作，最后知道很多概念，却没有任何成型证据。",
    nextTwoWeeks: [
      "补最基础的岗位认知：至少研究 3 家目标公司、5 条 JD、2 篇真实面经，先知道招聘方在看什么。",
      "把你现有经历按“能证明什么能力”重新分类，先找出离目标岗位最近的切入口。",
    ],
    nextFourWeeks: [
      "优先做一个最接近真实岗位流程的实践，不要求大，但必须能讲清背景、任务、动作、结果。",
      "开始建立行业信息输入节奏，每周固定一次看岗位、一次看案例、一次写复盘，避免信息只进不出。",
    ],
    deliverables: [
      "一页岗位信息调研摘要",
      "1 个能投递前使用的案例台账",
      "一份明确下一步方向的行动清单",
    ],
  },
  considering_internship_no_direction: {
    diagnosis: "你已经进入想找实习的状态，但方向还没真正收敛。这个阶段最怕的是同时投很多不相干岗位，最后拿到的经历也无法形成主线，所以要先完成方向收敛，再提高投递命中率。",
    nextTwoWeeks: [
      "从目标岗位里挑 2 个最可能方向，对比它们的核心要求、典型案例和你当前证据差距。",
      "用一次简历重写来验证方向：如果某个方向很难把经历写顺，往往说明它还不是你当前最合适的入口。",
    ],
    nextFourWeeks: [
      "围绕最终确定方向，补 1 条最关键的短板证据，比如项目、访谈、分析、流程设计或数据复盘。",
      "开始做定向投递，宁可少投但每份都更贴近目标方向，不要再混投稀释材料。",
    ],
    deliverables: [
      "一个明确收敛后的目标方向",
      "1 条围绕目标方向补强的案例",
      "1 版定向投递简历",
    ],
  },
  direction_set_seeking_first_internship: {
    diagnosis: "你已经比很多人更进一步，因为方向明确了。现在真正决定你能不能拿到第1段实习的，不是继续搜信息，而是有没有把材料做成“看起来已经能上手”的样子。",
    nextTwoWeeks: [
      "把最接近目标岗位的 2 条经历重写成可追问案例，重点补清楚你做了什么判断、为什么这么做、结果如何验证。",
      "按目标公司或同类公司 JD 调整简历关键词和经历顺序，先把最强证据放到前面。",
    ],
    nextFourWeeks: [
      "做一轮集中投递，同时同步准备高频面试追问，确保每条经历都能扛住深入追问。",
      "如果还没有足够强的正式经历，就补一段短周期、接近真实业务的项目或协作案例，填上最薄的一环。",
    ],
    deliverables: [
      "2 个可直接用于面试回答的主力案例",
      "1 版针对目标岗位优化后的简历",
      "1 份常见追问题及回答提纲",
    ],
  },
  currently_interning_1st: {
    diagnosis: "你已经拿到了第1段实习，接下来重点不再是“有没有经历”，而是这段经历能不能沉淀成高质量证据。很多人第1段实习做完只是多了一行公司名，但没有留下可讲成果，这是最可惜的地方。",
    nextTwoWeeks: [
      "把当前实习负责的事项拆成“场景-目标-你的动作-结果-复盘”记录表，每周更新一次，别等结束后靠回忆补。",
      "主动争取一个更完整的任务切片，哪怕只是需求跟进、数据复盘、流程优化中的一段，也要有完整闭环。",
    ],
    nextFourWeeks: [
      "挑 1 个最有代表性的任务，补足数据、反馈或协作证据，把它打磨成后续求职主力案例。",
      "和直属带教或合作同事确认一次反馈，弄清对方眼里你真正做得好和还不够的地方，为下一段实习升级做准备。",
    ],
    deliverables: [
      "1 份持续更新的实习复盘台账",
      "1 个能完整讲清楚的代表性案例",
      "1 版写进简历后的项目成果描述",
    ],
  },
  currently_interning_2nd: {
    diagnosis: "做到第2段实习后，招聘方已经不会只看你有没有经历，而会看你的经历是否在升级。你现在最该证明的是：你不是重复做过两次类似工作，而是在任务复杂度、判断质量和结果表达上都更进一步。",
    nextTwoWeeks: [
      "对比第1段和第2段实习，找出能力升级最明显的一点，比如更独立、协作更复杂、结果更可量化，把它提炼出来。",
      "挑当前实习里最能代表你成长的一项任务，补齐关键数据、协作记录和复盘结论。",
    ],
    nextFourWeeks: [
      "把两段经历串成一条成长主线，让面试官能看见你为什么更适合更高要求的岗位。",
      "根据目标秋招岗位，决定下一步是继续冲更强平台，还是补更贴近目标方向的专项经历。",
    ],
    deliverables: [
      "一条清晰的实习成长主线",
      "2 个层次不同的核心案例",
      "一版更能体现升级感的简历表达",
    ],
  },
  currently_interning_3rd_plus: {
    diagnosis: "你已经不缺经历数量，接下来决定上限的是经历质量和叙事策略。这个阶段最怕的是经历很多，但每段都讲得很散，面试官听完不知道你最强的竞争力到底是什么。",
    nextTwoWeeks: [
      "把所有实习重新筛一遍，只保留最能证明目标岗位匹配度的 2 到 3 段，不要平均发力。",
      "检查每段经历是不是都能回答“为什么选你、不是别人也能做”的问题，把个人判断和关键贡献写出来。",
    ],
    nextFourWeeks: [
      "把多段经历整合成“能力升级 + 方向稳定 + 结果更硬”的叙事，而不是公司名堆砌。",
      "开始为高质量面试做准备，尤其是对比题、追问题和深挖复盘题，避免经历多却讲不深。",
    ],
    deliverables: [
      "2 到 3 个高密度核心案例",
      "一份有取舍的高质量简历",
      "一套覆盖深挖追问的面试提纲",
    ],
  },
  experienced_staying_direction: {
    diagnosis: "你已经有过实习经验，而且准备继续深耕同方向。现在关键不是重新从零开始，而是把已有经验升级成更强平台也认可的证据，证明你不是碰巧做过，而是真的能持续在这个方向里成长。",
    nextTwoWeeks: [
      "复盘过去所有实习，明确哪一段最能代表你在这个方向上的核心竞争力，并优先强化它。",
      "根据目标岗位要求，找出已有经验里还缺的那一环，是结果不够硬、场景不够深，还是表达不够专业。",
    ],
    nextFourWeeks: [
      "围绕短板补一段更高质量的经历，或者把已有经历补成更完整案例，提升下一次投递的层级。",
      "同步准备更高要求岗位的面试素材，确保你能讲清楚自己为什么值得拿到更强机会。",
    ],
    deliverables: [
      "一版深耕同方向的升级型简历",
      "1 个最强案例的深度复盘版本",
      "下一段更高质量机会的补足清单",
    ],
  },
  experienced_changing_direction: {
    diagnosis: "你已经有实习经验，但现在准备转向，这意味着你不能把过去经历原样搬过去，而要先完成“可迁移能力翻译”。这个阶段最重要的不是抹掉过去，而是讲清楚为什么过去经历能支撑你进入新方向。",
    nextTwoWeeks: [
      "拆解新方向 JD，把你旧经历里可迁移的能力逐条对应出来，先建立“旧经历如何服务新岗位”的桥梁。",
      "补一个最能证明转向合理性的专项案例，避免转行故事只停留在兴趣层面。",
    ],
    nextFourWeeks: [
      "重写简历和自我介绍，让它们围绕“转向原因-可迁移证据-已补动作-下一步目标”这条线展开。",
      "提前准备转向类高频追问，比如为什么换方向、过去经历如何相关、你已经补了什么。",
    ],
    deliverables: [
      "一版转方向逻辑清楚的简历",
      "1 个专门用于证明转向合理性的补充案例",
      "一套转方向面试回答框架",
    ],
  },
};

const HARD_SKILL_DETAIL_MAP = {
  "PRD / 流程图": {
    reason: "这是产品岗最基础的表达能力之一。你不是为了写一份好看的文档，而是要证明自己能把模糊需求翻译成别人能执行的方案。",
    practicePath: "先挑一个你熟悉的真实场景，连续 3 次练“背景-目标-用户路径-功能范围-异常情况”。第一轮只写主流程，第二轮补边界条件，第三轮让同学或带教按你的文档挑刺并修改。",
    output: "至少产出 1 份完整 PRD 和 1 张能解释关键路径的流程图，能直接作为面试附件或作品集素材。",
  },
  "PRD 写作与流程图": {
    reason: "它直接决定你能不能把需求讲清楚，而不是停留在“我脑子里知道”。",
    practicePath: "围绕一个具体功能连续做三版：先写用户故事，再补流程与异常，最后补优先级和版本边界。",
    output: "1 份结构完整的需求文档 + 1 张流程图 + 1 段你自己录的讲解说明。",
  },
  "基础 SQL": {
    reason: "它不是为了让你当数据工程师，而是为了让你能独立验证判断，不必每次都等别人帮你取数。",
    practicePath: "先把筛选、分组、聚合、JOIN 练熟，再用一个真实业务题反复练，比如留存、转化漏斗、活跃用户拆分。每周至少完成 3 道查询，并把结果翻译成一句业务结论。",
    output: "一份常用 SQL 题型笔记 + 3 到 5 条可复用查询语句 + 1 个带业务结论的数据分析小案例。",
  },
  "基础 SQL / 数据看板": {
    reason: "你需要的不只是会查数据，还要能把结果变成别人看得懂的判断和图表。",
    practicePath: "先用 SQL 取到基础数据，再用 Metabase 或 Tableau Public 做一个核心指标面板，练习把图表和口头结论对应起来。",
    output: "1 个基础看板链接或截图 + 1 份指标口径说明 + 1 段分析结论。",
  },
  "用户访谈": {
    reason: "很多人会记反馈，却不会做洞察。访谈能力决定你能不能把“用户说了什么”变成“真正的问题是什么”。",
    practicePath: "先写访谈提纲，再完成 3 次访谈，每次访谈后都整理成“原话-现象-真实需求-可行动点”四列笔记。第三次开始训练追问，不满足于表面回答。",
    output: "1 份访谈提纲 + 3 份结构化访谈记录 + 1 页洞察总结，能证明你不是只会聊天。",
  },
  "用户访谈与需求文档": {
    reason: "招聘方想看到的不是你做过访谈，而是你能把访谈结果转成可执行需求。",
    practicePath: "先做访谈，再把需求拆成目标、痛点、优先级和方案范围，最后写成一版可评审文档。",
    output: "访谈纪要 + 需求拆解表 + 1 份需求文档。",
  },
  "指标拆解": {
    reason: "这决定你会不会验证方案有效。不会拆指标的人，做了很多动作也很难证明结果。",
    practicePath: "每次看到一个业务目标，都强制自己画出指标树，先拆一级指标，再追到可执行动作。每周至少用 1 个真实案例练一次，比如留存下降、转化偏低、投放回本慢。",
    output: "2 到 3 张指标树 + 1 份针对真实业务问题的指标拆解说明。",
  },
  "竞品分析": {
    reason: "竞品分析不是罗列功能，而是训练你看懂市场选择、用户心智和策略差异。",
    practicePath: "每周固定拆 1 个竞品，从目标用户、核心场景、关键功能、商业模式和增长动作五个维度做一页分析，最后补一句“如果我是这家公司的 PM，我下一步会怎么做”。",
    output: "至少 2 份结构化竞品分析简报，可直接放进作品集或面试材料。",
  },
  "竞品分析框架": {
    reason: "框架化能力能让你的分析不再像流水账，而是更像真正的商业判断。",
    practicePath: "用同一套框架连续分析 2 个同类产品，再做一次横向对比，练习从信息整理过渡到判断输出。",
    output: "一套可复用的竞品分析模板 + 2 份框架化分析样本。",
  },
  "内容策划": {
    reason: "它决定你是不是只会发内容，还是能围绕目标受众和转化目的设计内容动作。",
    practicePath: "先明确受众、平台和目标，再连续策划 2 周内容，边做边看数据反馈，复盘标题、角度和内容结构。",
    output: "一份 2 周内容排期表 + 2 到 4 条成稿内容 + 1 份数据复盘。",
  },
  "活动方案": {
    reason: "活动方案能力的核心不是创意，而是目标设定、资源组织和结果复盘。",
    practicePath: "围绕一个真实活动场景写方案，从目标、受众、节奏、预算、分工到风险预案全部走一遍，结束后做一次复盘。",
    output: "1 份活动方案 + 1 份执行排期表 + 1 份复盘总结。",
  },
  "基础投放认知": {
    reason: "有了投放认知，你做增长或营销时才知道动作和结果之间怎么连接。",
    practicePath: "先理解曝光、点击、转化、ROI 的链路，再看 2 个真实投放案例，尝试倒推它们为什么这么配预算和素材。",
    output: "1 份投放漏斗笔记 + 1 份案例拆解 + 1 段你自己的预算分配判断。",
  },
  "数据复盘": {
    reason: "复盘能力决定你做完一件事后，是只知道结果，还是能知道为什么会这样、下次怎么改。",
    practicePath: "每次项目或活动结束后，按“目标-结果-原因-改进”四段式写复盘，至少补清楚一个关键指标为什么达成或未达成。",
    output: "2 份结构化复盘文档，能体现你不是只会执行。",
  },
  "社媒平台理解": {
    reason: "不同平台的推荐逻辑、用户心态和内容节奏不同，不理解平台就很难做出有效动作。",
    practicePath: "连续观察 2 个平台 1 周，记录爆款内容的题材、结构和互动机制，再尝试自己做一次模仿和复盘。",
    output: "1 份平台差异对照表 + 1 份内容模仿实验记录。",
  },
  "需求访谈": {
    reason: "客户或用户说出来的往往只是表层诉求，访谈能力决定你能不能挖到真正需求。",
    practicePath: "先设计问题框架，再做 3 次模拟或真实访谈，每次访谈后总结需求、约束和潜在异议。",
    output: "1 套访谈提纲 + 3 份访谈纪要 + 1 份需求摘要。",
  },
  "方案纪要": {
    reason: "纪要能力会直接影响协作效率，它决定一次沟通能不能变成可执行动作。",
    practicePath: "每次讨论后都练习用 5 分钟写清“结论、待办、负责人、时间点、风险”，并让别人能直接接着执行。",
    output: "3 份结构清楚的会议/方案纪要模板或样本。",
  },
  "CRM 基础": {
    reason: "它决定你是不是只会跟人沟通，还是能把商机和客户状态真正管理起来。",
    practicePath: "用一个 CRM 模拟线索到成交的流程，练习记录客户状态、推进节点和下一步动作。",
    output: "1 套 CRM 线索跟进样本记录 + 1 份客户推进流程说明。",
  },
  "商务邮件写作": {
    reason: "邮件写作体现的是职业化表达，而不是礼貌本身。",
    practicePath: "练习写邀约、跟进、确认、异议处理四类邮件，每类至少写 2 封，并找人帮你改一次。",
    output: "1 份常用商务邮件模板包。",
  },
  "项目跟进": {
    reason: "跟进能力决定项目会不会停在“沟通过”，而是真的持续往前走。",
    practicePath: "为一个真实或模拟项目建立跟进表，记录每次动作、待办、阻塞点和下次推进时间。",
    output: "1 份项目推进表 + 1 次完整跟进复盘。",
  },
};

const SOFT_SKILL_DETAIL_MAP = {
  "跨团队对齐": {
    scenario: "当研发、设计、运营目标不一致时，你要做的不是转述每个人的话，而是帮团队收敛出一个可执行版本。",
    practiceAction: "每次遇到分歧时，强制自己先写下三件事：各方诉求、不可退让点、当前最小可行方案，再去组织沟通。",
    reviewQuestion: "这次分歧里，我到底是在转述冲突，还是在主动推动达成共识？",
  },
  "取舍判断": {
    scenario: "当资源不够、时间不够、需求很多时，真正拉开差距的是你敢不敢做有依据的取舍。",
    practiceAction: "每次做方案都补一段“为什么先做这个、为什么暂时不做那个”的说明，训练自己把判断说清楚。",
    reviewQuestion: "我这次的取舍依据是目标和约束，还是只是谁声音更大？",
  },
  "复盘表达": {
    scenario: "做完一件事后，如果你只能说“效果还行”，别人很难判断你到底成长了什么。",
    practiceAction: "每次项目结束后用固定模板复盘：目标、结果、关键原因、下次调整，练到 3 分钟内能口头讲清。",
    reviewQuestion: "如果面试官追问‘你从这件事里学到了什么’，我能不能讲出具体结论？",
  },
  "同理心": {
    scenario: "不管是做用户、做客户还是做跨团队协作，同理心都不是情绪价值，而是理解对方为什么会这样想。",
    practiceAction: "每次听到反馈时，先别急着反驳，先复述对方真实担心的点，再决定怎么回应。",
    reviewQuestion: "我这次是真的理解了对方的处境，还是只是表面上礼貌地点头？",
  },
  "用户共情": {
    scenario: "内容和营销工作里，真正有效的表达往往来自你能不能站进目标用户当下的情绪和决策场景。",
    practiceAction: "每次写内容或方案前，先补一句“对方此刻最关心什么、最怕什么、为什么会停下来”。",
    reviewQuestion: "我的表达到底是从品牌视角出发，还是从用户感受出发？",
  },
  "审美表达": {
    scenario: "营销和内容岗位里，审美不是好看两个字，而是你能否让信息更容易被接受和记住。",
    practiceAction: "固定拆 2 个你认可的内容作品，记录它们在标题、结构、节奏和视觉上的处理方式，再尝试模仿一次。",
    reviewQuestion: "这次表达是只是堆信息，还是有节奏、有重点、让人愿意看完？",
  },
  "多方协同": {
    scenario: "活动、项目、商务推进里最常见的问题不是没人做，而是各方都做了一点但没有人对整体结果负责。",
    practiceAction: "每次协作都明确目标、负责人、时间点和风险提示，避免任务悬空。",
    reviewQuestion: "这次协作里，我有没有把信息、节奏和责任真正对齐？",
  },
  "节奏管理": {
    scenario: "节奏管理差的人不是不努力，而是总在关键节点来不及。",
    practiceAction: "把任务拆成关键里程碑，并提前设置自检点，别等临近截止才第一次看整体进度。",
    reviewQuestion: "我这次是按节奏推进，还是一直在被截止日期推着走？",
  },
  "信任建立": {
    scenario: "客户或合作场景里，别人愿不愿意继续把事情交给你，往往不是因为你最会说，而是你稳定、靠谱、留痕清楚。",
    practiceAction: "每次沟通后都及时确认结论和下一步，让对方感受到你能接住事情。",
    reviewQuestion: "这次合作结束后，对方会不会更愿意下次继续找我？",
  },
  "耐心跟进": {
    scenario: "很多推进不是一次沟通就能完成，真正有效的人会持续跟，而不是发完消息就算做过。",
    practiceAction: "对每个待推进事项都设一个跟进时间点，形成自己的跟进节奏。",
    reviewQuestion: "我是在等待别人回复，还是在主动推进下一步？",
  },
  "预期管理": {
    scenario: "当资源、时间或方案受限时，预期管理差会让合作双方都不满意。",
    practiceAction: "有风险时提前说清可能影响、备选方案和需要对方配合的部分，而不是等出问题后再解释。",
    reviewQuestion: "我这次有没有在问题发生前就把边界说清楚？",
  },
  "情绪稳定": {
    scenario: "高压、异议、返工和被追问是常态，情绪稳定会直接影响你在团队里的可信度。",
    practiceAction: "遇到压力时先复述事实、拆问题、定下一步，再表达感受，避免被情绪牵着走。",
    reviewQuestion: "高压时我是在解决问题，还是让情绪先接管了表达？",
  },
};

function buildGenericHardSkillDetail(skill, roleName, weakestFocus) {
  return {
    skill,
    reason: `${skill} 是 ${roleName} 招聘里反复会被追问的基础能力之一。如果这项能力只停留在“听过”或“学过”，却没有真实场景证据，就很难支撑你的岗位适配判断。`,
    practicePath: `先围绕一个真实场景练 ${skill}，再把过程写成“场景-动作-结果-复盘”。如果你当前最弱的是「${weakestFocus ?? "关键短板"}」，优先让这项技能服务于补短板，而不是独立零散学习。`,
    output: `至少沉淀 1 份能展示 ${skill} 的产出物，比如文档、分析、方案、项目页面或复盘记录。`,
  };
}

function buildGenericSoftSkillDetail(skill) {
  return {
    skill,
    scenario: `${skill} 这类能力通常不会单独出现在课程里，而是会在协作、推进、被质疑和复盘时暴露出来。`,
    practiceAction: `把 ${skill} 放进一次真实协作场景里刻意练习，事后把自己做得好的地方和失误点都写下来，别让成长停留在感受层。`,
    reviewQuestion: `这次经历里，我在「${skill}」上最明显的进步和短板分别是什么？`,
  };
}

function buildHardSkillDetails(hardSkills = [], roleName, weakestFocus) {
  return hardSkills.map((skill) => ({
    skill,
    ...(HARD_SKILL_DETAIL_MAP[skill] ?? buildGenericHardSkillDetail(skill, roleName, weakestFocus)),
  }));
}

function buildSoftSkillDetails(softSkills = []) {
  return softSkills.map((skill) => ({
    skill,
    ...(SOFT_SKILL_DETAIL_MAP[skill] ?? buildGenericSoftSkillDetail(skill)),
  }));
}

function buildInternshipRoadmap({
  roleName,
  profile,
  internshipPlan = [],
  hardSkills = [],
  weakestFocus,
  immediateAction,
  targetCompany,
}) {
  const stageKey = profile.careerStage ?? "just_entered_university";
  const stageDetail = INTERN_STAGE_DETAIL_MAP[stageKey] ?? INTERN_STAGE_DETAIL_MAP.just_entered_university;
  const stageLabel = CAREER_STAGE_LABELS[stageKey] ?? stageKey;
  const priorityRoles = internshipPlan.slice(0, 2);
  const resumeKeywords = internshipPlan.slice(2);
  const fallbackPriority = targetCompany
    ? [`优先投递和 ${targetCompany} 同类型业务场景接近的 ${roleName} 岗位，先提高材料匹配度。`]
    : [`优先投递与你的目标方向最接近、能补足真实业务证据的 ${roleName} 岗位。`];
  const fallbackKeywords = [
    `把「${weakestFocus ?? "关键短板"}」写进项目动作和结果，不要只写参与了什么。`,
    hardSkills.length > 0
      ? `把 ${hardSkills.slice(0, 2).join("、")} 这类硬技能变成真实产出，再写进简历和面试案例。`
      : `把项目里的判断、动作、结果和复盘写清楚，让招聘方看见你的岗位适配度。`,
  ];

  return {
    stageLabel,
    stageDiagnosis: `${stageDetail.diagnosis} 对 ${roleName} 方向来说，现阶段最值钱的不是再看更多信息，而是尽快把经历转成可验证的岗位证据。`,
    priorityRoles: priorityRoles.length > 0 ? priorityRoles : fallbackPriority,
    resumeKeywords: resumeKeywords.length > 0 ? resumeKeywords : fallbackKeywords,
    nextTwoWeeks: [immediateAction, ...stageDetail.nextTwoWeeks].slice(0, 3),
    nextFourWeeks: stageDetail.nextFourWeeks,
    deliverables: stageDetail.deliverables,
  };
}

export function buildDynamicResultSummary({
  roleName,
  dimensionRanking = [],
  strengthCards = [],
  growthCards = [],
}) {
  const highest = dimensionRanking[0];
  const lowest = dimensionRanking.at(-1);

  if (!highest && !lowest) {
    return `你现在不是方向错了，而是准备还不够充分。先把最弱的地方补上来，再把已有优势讲成更有说服力的岗位证据。`;
  }

  if (!lowest || !highest || highest.dimension === lowest.dimension) {
    return `当前你在【${highest?.label ?? "核心能力"}】方面已经有一定基础，下一步更重要的不是再泛看信息，而是把这项能力沉淀成能被岗位和面试都看得见的真实证据。`;
  }

  const scoreGap = (highest.score ?? 0) - (lowest.score ?? 0);
  const lowestScore = lowest.score ?? 0;

  const topExplanation =
    strengthCards.find((item) => item.dimension === highest.dimension)?.explanation
    ?? dimensionTraitCopy[highest.dimension]?.strength
    ?? "";
  const lowestExplanation =
    growthCards.find((item) => item.dimension === lowest.dimension)?.explanation
    ?? dimensionTraitCopy[lowest.dimension]?.growth
    ?? "";

  if (lowestScore >= 85 || (lowestScore >= 80 && scoreGap <= 8)) {
    return `当前你的整体表现已经很稳，尤其在【${highest.label}】方面优势更明显，${buildStrengthInsight(highest.label, topExplanation)}。更重要的是，你目前各项维度都处在高位，而且整体发挥很均衡；接下来最值得做的，不是继续放大某个“相对最低项”，而是把已有优势沉淀成更完整的案例、作品和结果表达，让你的 ${roleName} 岗位竞争力真正稳定落地。`;
  }

  return `当前你在【${highest.label}】方面具备更明显的岗位潜力，${buildStrengthInsight(highest.label, topExplanation)}。但【${lowest.label}】仍是你当前最需要优先补足的短板，${buildWeaknessAction(lowestExplanation)}；如果这一项长期偏弱，你在 ${roleName} 岗位里就更难把经历沉淀成可信成果，也更容易在案例表达、岗位适配和后续成长速度上被卡住。`;
}

function appendAdvice(content, advice) {
  if (!content) {
    return advice;
  }

  if (Array.isArray(content)) {
    return [...content, advice];
  }

  return `${content} ${advice}`.trim();
}

function dedupe(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

function buildCareerGrowthAdvice(baseCareerGrowth, schoolName, roleName) {
  const eliteAdvice = `名校背景会在 ${roleName} 的校招初筛和高势能平台曝光里提供更高起点，但后续晋升依然更看项目深度、实习质量和结果表达。`;
  const regularAdvice = `如果你是非名校背景，前两年更要靠高质量项目、实习密度和可量化结果把证据做厚；把证据补硬后，晋升速度一样能追上来。`;

  return appendAdvice(baseCareerGrowth, isEliteSchool(schoolName) ? eliteAdvice : regularAdvice);
}

function buildCareerPathAdvice(baseCareerPath, schoolName, roleName) {
  const eliteAdvice = `名校背景在 ${roleName} 校招起点和大厂早期机会里通常更占优，但真正决定后续成长速度的还是你能不能持续拿结果。`;
  const regularAdvice = `非名校背景更需要尽早用项目、实习和业务结果补齐证据密度，先拿到入场券，再去拉齐后续成长节奏。`;

  return appendAdvice(baseCareerPath, isEliteSchool(schoolName) ? eliteAdvice : regularAdvice);
}

function getClosingContent(roleConfig, fitLabel, careerStage, fallback) {
  const closingMap = roleConfig?.resultTemplate?.closingMessage?.byFitLabelCareerStage;
  const mappedCareerStage = mapCareerStageToGuidanceStage(careerStage);

  return (
    closingMap?.[fitLabel]?.[mappedCareerStage]
    ?? closingMap?.[fitLabel]?.clear_goal_no_action
    ?? fallback
  );
}

const QUESTION_LIMIT = 20;

export function getQuestionSetForRole(roleId) {
  const questionSet = findQuestionSetByRole(roleId);
  if (!questionSet) {
    throw new Error(`Question set not found for role: ${roleId}`);
  }
  return {
    ...questionSet,
    questions: questionSet.questions.slice(0, QUESTION_LIMIT),
  };
}

export function buildAssessmentResult({ profile, answers }) {
  const selection = resolveRoleSelection(profile);
  const templateRoleId = selection.templateRoleId || profile.targetRole;
  const role = getRoleById(templateRoleId);
  const questionSet = getQuestionSetForRole(templateRoleId);
  const template = getResultTemplate(templateRoleId);
  const roleConfig = getRoleConfig(templateRoleId);
  const roleProfile = getRoleProfile(templateRoleId);
  const roleDisplayName = selection.displayName || role?.name || templateRoleId;

  if (!role || !template) {
    throw new Error(`Role template not found for role: ${templateRoleId}`);
  }

  const topCompanies = dedupe([
    ...(selection.recommendedCompanies ?? []),
    ...(roleConfig?.topCompanies ?? []),
    ...(roleProfile?.topCompanies ?? []),
  ]);
  const avgSalary = roleConfig?.avgSalary ?? roleProfile?.avgSalary ?? "–";
  const careerPath = roleConfig?.careerPath ?? roleProfile?.careerPath ?? "–";
  const coreCompetencies = roleConfig?.coreCompetencies ?? roleProfile?.coreCompetencies ?? [];

  const studyPlan =
    (roleConfig?.resultTemplate?.actionGuide?.studyPlan?.length > 0
      ? roleConfig.resultTemplate.actionGuide.studyPlan
      : null)
    ?? template.studyPlan;

  const internshipPlan =
    resolvePlanByResumeStage(
      roleConfig?.resultTemplate?.actionGuide?.internshipPlan ?? template.internshipPlan,
      profile.resumeStage,
    );

  const hardSkills =
    (roleConfig?.resultTemplate?.actionGuide?.skillPlan?.hardSkills?.length > 0
      ? roleConfig.resultTemplate.actionGuide.skillPlan.hardSkills
      : null)
    ?? template.hardSkills;

  const softSkills =
    (roleConfig?.resultTemplate?.actionGuide?.skillPlan?.softSkills?.length > 0
      ? roleConfig.resultTemplate.actionGuide.skillPlan.softSkills
      : null)
    ?? template.softSkills;

  const marketContent = roleConfig?.resultTemplate?.marketReality?.content ?? template.reality;
  const requirements = buildDetailedRequirements(
    roleProfile?.keyRequirements ?? template.requirements ?? [],
    roleDisplayName,
  );
  const workplaceReality = roleProfile?.workplaceReality
    ? {
        ...roleProfile.workplaceReality,
        careerGrowth: buildCareerGrowthAdvice(roleProfile.workplaceReality.careerGrowth, profile.schoolName, roleDisplayName),
      }
    : null;

  const totalScore = questionSet.questions.reduce(
    (sum, item) => sum + (answerScoreMap[answers[item.id]] ?? 0),
    0,
  );
  const maxScore = questionSet.questions.length * 4;
  const score = Math.round((totalScore / maxScore) * 100);
  const fitLabel = getFitLabel(score);
  const dimensionRanking = averageByDimension(questionSet, answers);
  const strengths = dimensionRanking.slice(0, 2).map((item) => `${item.label}（${item.level}）`);
  const blindSpots = dimensionRanking.slice(-2).map((item) => `${item.label}（${item.level}）`);
  const strongestFocus = dimensionRanking[0]?.label ?? coreCompetencies[0] ?? "核心能力";
  const weakestFocus = dimensionRanking.at(-1)?.label;

  const strengthCards = buildTraitCards(dimensionRanking, "strength");
  const growthCards = buildTraitCards(dimensionRanking, "growth");
  const positiveHighlights = strengthCards.map((item) => `${item.keyword}，${item.explanation}`);
  const growthHints = growthCards.map((item) => `${item.keyword}，${item.explanation}`);
  const dynamicSummary = buildDynamicResultSummary({
    roleName: roleDisplayName,
    dimensionRanking,
    strengthCards,
    growthCards,
  });

  const profileHighlights = [
    `你的专业是 ${profile.majorName || "未填写"}，下一步要做的是把课程、项目和实习翻译成 ${roleDisplayName} 看得懂的岗位语言。`,
    `当前简历阶段是「${profile.resumeStage}」，这意味着问题不只是能力本身，还包括证据组织方式是否够职业化。`,
    profile.targetCompany
      ? `既然你已经锁定 ${profile.targetCompany}，后续项目、实习和简历表达都应该尽量贴近这类公司的真实招聘要求。`
      : topCompanies.length > 0
      ? `如果还没锁定具体公司，建议优先研究 ${topCompanies.slice(0, 3).join("、")} 这类代表性公司。`
      : `尽快锁定目标公司，用 JD 反推你需要补足的能力缺口。`,
  ];

  const contextualPlan = roleConfig
    ? getContextualActionPlan(templateRoleId, profile)
    : null;
  const structuredActionPlan = buildActionPlan(templateRoleId, profile, score);

  const immediateAction =
    contextualPlan?.byResumeStage?.immediateAction
    ?? "把过往经历整理进简历，明确最强的 1 到 2 条主线案例。";

  const firstQuestion =
    contextualPlan?.byCareerStage?.keyQuestion ?? null;

  const internshipRoadmap = buildInternshipRoadmap({
    roleName: roleDisplayName,
    profile,
    internshipPlan,
    hardSkills,
    weakestFocus,
    immediateAction,
    targetCompany: profile.targetCompany,
  });

  const hardSkillDetails = buildHardSkillDetails(hardSkills, roleDisplayName, weakestFocus);
  const softSkillDetails = buildSoftSkillDetails(softSkills);

  const closingContent = buildWarmClosingMessage(
    getClosingContent(roleConfig, fitLabel, profile.careerStage, template.closing),
    roleDisplayName,
  );
  const overseasHooks = buildOverseasHooks(template);

  return {
    roleId: role.id,
    roleName: roleDisplayName,
    questionSetId: questionSet.id,
    score,
    fitScore: score,
    fitLabel,
    dimensionRanking,
    strongestTraits: strengths,
    weakestTraits: blindSpots,
    targetCompany: profile.targetCompany ?? "",
    immediateAction,
    firstQuestion,
    modules: {
      selfAwareness: {
        title: "自我认知",
        fitScore: score,
        fitLabel,
        description: `你当前对 ${roleDisplayName} 的整体判断为「${fitLabel}」，优势更集中在 ${strengths.join("、")}。`,
        summary: dynamicSummary,
        highlights: profileHighlights,
        positiveHighlights,
        growthHints,
        strengthCards,
        growthCards,
        coreCompetencies,
        strengths,
        blindSpots,
        dimensionScores: dimensionRanking,
      },
      marketReality: {
        title: "外界认知",
        content: marketContent,
        topCompanies,
        avgSalary,
        careerPath: buildCareerPathAdvice(careerPath, profile.schoolName, roleDisplayName),
        careerGrowth: workplaceReality?.careerGrowth ?? null,
        workplaceReality,
        requirements,
      },
      actionGuide: {
        title: "行动指引",
        studyPlan,
        internshipAdvice: internshipPlan[0],
        internshipPlan,
        academicPlan: structuredActionPlan
          ? {
              urgencyLabel: structuredActionPlan.urgencyLabel,
              urgencyBadge: structuredActionPlan.urgencyBadge,
              contextSummary: structuredActionPlan.contextSummary,
              educationEdge: structuredActionPlan.educationEdge,
              educationTarget: structuredActionPlan.educationTarget,
              regionTip: structuredActionPlan.regionTip,
              coreTask: structuredActionPlan.coreTask,
              nextStep: structuredActionPlan.nextStep,
              studyPlan: structuredActionPlan.studyPlan,
              yearContext: structuredActionPlan.yearContext,
              threeSemesterRoadmap: structuredActionPlan.threeSemesterRoadmap,
            }
          : null,
        skillPlan: {
          hardSkills,
          softSkills,
          hardSkillDetails,
          softSkillDetails,
        },
        internshipRoadmap,
        overseasHooks,
        overseas: template.overseas ?? [],
        immediateAction,
        firstQuestion,
        nextSteps: buildNextSteps(template, roleDisplayName, profile.targetCompany, weakestFocus, internshipPlan),
      },
      closingMessage: {
        title: "结尾寄语",
        content: closingContent,
      },
    },
  };
}
