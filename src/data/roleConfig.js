import { roles } from "./roles.js";
import { getRoleProfile } from "./roleProfiles.js";
import { getResultTemplate } from "./resultTemplates.js";

const defaultYearPlan = {
  "2029": {
    priority: "先探索方向，同时建立岗位感知与方法论基础",
    studyPlan: ["先把课程、项目和岗位认知打通，不急着同时做很多低质量尝试。"],
    internshipPlan: ["优先从校内项目、社团、小型实践开始，先积累第一批可讲证据。"],
  },
  "2028": {
    priority: "开始形成第一批可展示证据",
    studyPlan: ["把课程项目、比赛或校园实践做成能放进简历和面试里的案例。"],
    internshipPlan: ["优先争取第一段相关实习或至少一个接近真实业务的项目。"],
  },
  "2027": {
    priority: "把经历升级成可投递版本",
    studyPlan: ["围绕目标岗位只补最关键的短板，减少泛学和重复努力。"],
    internshipPlan: ["优先争取更贴近目标岗位的一段实习，开始对齐秋招要求。"],
  },
  "2026": {
    priority: "准备冲刺投递和面试",
    studyPlan: ["按目标公司 JD 反推缺口，围绕高频要求集中打磨主线案例。"],
    internshipPlan: ["优先把现有实习或项目打磨成 2 到 3 个主力案例。"],
  },
  graduated: {
    priority: "尽快重组材料并恢复投递节奏",
    studyPlan: ["把过往经历全部翻译成目标岗位能理解的语言和结果表达。"],
    internshipPlan: ["优先补最短路径的项目或实习证据，减少空档叙事。"],
  },
  other: {
    priority: "先明确时间窗口，再决定补齐顺序",
    studyPlan: ["把学习动作按重要度排序，避免所有事情同时推进。"],
    internshipPlan: ["优先补最能证明岗位匹配度的经历，而不是只看公司名气。"],
  },
};

const defaultCareerStagePlan = {
  lost: {
    firstStep: "先看 3 个真实岗位案例，把“想象中的岗位”和“真实工作方式”区分开。",
    keyQuestion: "你真正愿意长期投入的工作方式是什么？",
  },
  direction_no_target: {
    firstStep: "先列出目标岗位的高频要求，再盘点你手里哪些证据最薄弱。",
    keyQuestion: "如果本学期只能补一项，你最该先补哪一条差距？",
  },
  clear_goal_no_action: {
    firstStep: "本周就选一件能直接提升岗位证据的动作开始，而不是继续搜更多信息。",
    keyQuestion: "你下周就能执行的第一个补足动作是什么？",
  },
};

const roleSpecificContent = {
  "product-manager": {
    positiveHighlights: [
      "如果你在用户洞察和需求结构化上得分更高，说明你已经有成为产品岗“问题定义者”的潜力。",
      "产品岗位很看重你是否能在信息不完整时仍然做出清楚判断。",
      "只要把方案取舍和数据复盘讲清楚，你的案例说服力会明显提升。",
    ],
    growthHints: [
      "优先补用户洞察和数据迭代，避免方案停留在“我觉得应该这样”。",
      "把每个项目都练成“问题-方案-取舍-验证”的完整闭环，而不是只展示产出物。",
      "接下来重点训练跨团队对齐，让你的项目表达更像真实产品工作。 ",
    ],
    byResumeStage: {
      no_resume: { urgency: "high", immediateAction: "先整理 2 个最像产品项目的问题定义案例，哪怕来源是课程或校园流程改造。" },
      draft_resume: { urgency: "medium", immediateAction: "把现有项目改写成“用户问题 / 方案取舍 / 验证结果”结构，先打磨最强 1 条。 " },
      applied_resume: { urgency: "medium", immediateAction: "挑 3 条目标产品 JD，对照你的案例补用户洞察和数据验证关键词。" },
    },
    closingMessages: {
      "匹配度较高": {
        lost: "你对产品岗其实已经有不小优势，现在别继续横向看太多方向，先把最强案例做成能投递的证据。",
        direction_no_target: "你的基础已经不差，下一步重点不是再确认方向，而是把案例做深、把表达做硬。",
        clear_goal_no_action: "你离产品岗已经很近了，最该做的是立刻把方案和复盘沉淀下来，别让优势停留在感觉上。",
      },
      "潜力明显": {
        lost: "这说明你对产品岗并不排斥，但还需要用真实项目验证自己是否愿意长期做这类判断与协同工作。",
        direction_no_target: "你有潜力，但还缺能说服招聘方的硬证据。下一步别再泛看信息，先补最关键的一条案例线。",
        clear_goal_no_action: "你已经知道自己想做产品了，现在更重要的是把问题定义和数据验证做成真正可讲的结果。",
      },
      "需要补足": {
        lost: "现在还不用急着否定自己，先拿一个真实场景练问题定义，再判断产品岗是不是你的长期方向。",
        direction_no_target: "不是不能走产品，而是你现在的证据还太薄。先补用户理解和方案结构，再看是否继续深走。",
        clear_goal_no_action: "产品岗不是靠兴趣感就能拿下的。先补最弱的那一维，再决定要不要继续押注这个方向。",
      },
    },
  },
  marketing: {
    positiveHighlights: [
      "如果你在受众洞察和内容策略上分数更高，说明你已经具备做营销判断的底子。",
      "营销岗真正加分的是你能否把创意和转化链路放在一起理解。",
      "只要补上渠道复盘和结果表达，你的经历会更像真实市场项目。",
    ],
    growthHints: [
      "优先补传播结果复盘，不要只展示“做过什么活动”。",
      "让每条经历都带上目标受众、渠道逻辑和转化结果。",
      "继续训练渠道判断，让不同平台的策略差异说得更清楚。",
    ],
    byResumeStage: {
      no_resume: { urgency: "high", immediateAction: "先从内容运营、活动组织或品牌案例里挑 2 条，整理成有目标和结果的传播案例。" },
      draft_resume: { urgency: "medium", immediateAction: "把简历里的市场经历补上受众、渠道和复盘数据，先修掉“只写执行”的问题。" },
      applied_resume: { urgency: "medium", immediateAction: "按品牌 / 增长 / 内容方向拆分案例版本，别再用一份泛市场简历覆盖所有岗位。" },
    },
    closingMessages: {
      "匹配度较高": {
        lost: "你在营销方向上已经有明显基础，先别被岗位名字分散注意力，优先把最强传播案例做成标准化作品。",
        direction_no_target: "你很适合营销，但还需要尽快收敛方向，明确自己更偏品牌、内容还是增长。",
        clear_goal_no_action: "你的基础已经能支撑营销方向了，下一步重点是把案例和结果表达变成真正的投递武器。",
      },
      "潜力明显": {
        lost: "你对营销有潜力，但要用真实传播案例验证自己是不是愿意长期做这类工作。",
        direction_no_target: "你不是缺兴趣，而是缺更像真的项目证据。先补一条完整 campaign 案例。",
        clear_goal_no_action: "你已经站在营销门口了，差的不是热情，是把受众、内容、渠道和结果讲清楚的能力。",
      },
      "需要补足": {
        lost: "先别急着把自己放进营销岗，先做一个真实内容或活动项目，看看你是否真的适应这种工作节奏。",
        direction_no_target: "你目前更像做过一些营销相关动作，但还没建立岗位级别的思考框架。",
        clear_goal_no_action: "如果想继续冲营销岗，优先补传播策略和结果复盘，不然经历会一直显得偏执行。",
      },
    },
  },
  "account-manager": {
    positiveHighlights: [
      "如果你在信任建立和需求发现上得分更高，说明你具备客户岗的关键起点。",
      "客户岗位很看重你是否能在沟通里持续判断，而不是只会表达。",
      "把推进过程和关系维护讲清楚，比单点成交更能体现成熟度。",
    ],
    growthHints: [
      "优先补需求提炼和方案对齐，避免沟通只停留在“关系不错”。",
      "把每次合作都复盘成“对方诉求-你的动作-推进结果”的闭环。",
      "继续训练长期跟进能力，让别人愿意持续和你合作。",
    ],
    byResumeStage: {
      no_resume: { urgency: "high", immediateAction: "先整理 2 个最能体现对外推进的案例，把沟通对象、诉求和推进结果写清楚。" },
      draft_resume: { urgency: "medium", immediateAction: "把现有经历补成“需求发现-方案调整-长期跟进”的结构，弱化空泛的“负责沟通”。" },
      applied_resume: { urgency: "medium", immediateAction: "根据目标行业重写案例版本，让银行、互联网广告、企业服务的表达差异更明显。" },
    },
    closingMessages: {
      "匹配度较高": {
        lost: "你在客户岗上已经有不错的基础，现在最重要的是确认行业方向，而不是继续泛泛地尝试所有岗位。",
        direction_no_target: "你的客户岗位潜质已经比较明显，下一步就是把场景收敛到具体行业并深挖案例。",
        clear_goal_no_action: "你离客户岗并不远了，优先把最强的需求梳理和跟进案例打磨成面试主线。",
      },
      "潜力明显": {
        lost: "你有客户沟通潜力，但还需要更多真实推进场景来验证自己是否适合长期做关系经营。",
        direction_no_target: "你已经具备雏形，真正要补的是需求提炼和方案表达的专业度。",
        clear_goal_no_action: "想冲客户岗，下一步就别再只说“我会沟通”，而要拿出可验证的推进案例。",
      },
      "需要补足": {
        lost: "先别急着把自己放进客户岗，先做一段真实对外合作，再看自己是否适应长周期推进。",
        direction_no_target: "你现在和客户岗的主要差距不在性格，而在专业沟通和持续跟进证据还不够。",
        clear_goal_no_action: "如果还想继续冲客户岗，优先补需求访谈和方案跟进案例，否则很难建立可信度。",
      },
    },
  },
  "ai-algorithm-engineer": {
    positiveHighlights: [
      "如果你在建模理解和实验设计上得分较高，说明你不是只会跑代码，而是真的在做技术判断。",
      "算法岗位很看重你是否有规范实验和解释结果的习惯。",
      "只要把复现过程和工程意识讲得更完整，项目质量会明显上一个层级。",
    ],
    growthHints: [
      "优先补实验设计和工程落地，让项目不再停留在离线效果截图。",
      "把每个算法项目都补上基线、误差分析和上线约束说明。",
      "继续强化复现和迭代能力，让你面对技术难题时更像真正的工程师。",
    ],
    byResumeStage: {
      no_resume: { urgency: "high", immediateAction: "先挑 1 个最完整的算法项目，把任务定义、实验过程和结果解释写成第一版项目说明。" },
      draft_resume: { urgency: "medium", immediateAction: "把项目描述改成“问题-方法-实验-结果-误差分析”，去掉只罗列模型和框架的写法。" },
      applied_resume: { urgency: "medium", immediateAction: "根据目标方向补专门案例，比如推荐、CV、NLP 各自需要不同的评估与落地叙事。" },
    },
    closingMessages: {
      "匹配度较高": {
        lost: "你在算法岗上已经有较强基础，现在真正要做的是确认更具体的技术方向，而不是再泛泛学更多内容。",
        direction_no_target: "你的能力已经能支撑算法岗，只差更明确的方向和更硬的项目呈现。",
        clear_goal_no_action: "你和算法岗的距离已经不远，下一步重点是把项目做成别人能复现、能相信的证据。",
      },
      "潜力明显": {
        lost: "你对算法岗有明显潜力，但还需要通过更完整的实验与项目来确认自己是否愿意长期深做。",
        direction_no_target: "你不是没基础，而是项目完整性还不足以支撑高门槛算法岗位判断。",
        clear_goal_no_action: "想冲算法岗，下一步就把实验设计和工程落地补起来，别让项目停在“跑通过”。",
      },
      "需要补足": {
        lost: "先不要急着把自己放进高门槛算法岗，先用一个完整项目验证你是否真的适应这种工作方式。",
        direction_no_target: "你当前的短板主要在实验规范和项目深度，继续堆关键词意义不大。",
        clear_goal_no_action: "如果继续冲算法岗，优先补一个完整可复现项目，否则简历很难撑住面试追问。",
      },
    },
  },
  "embedded-engineer": {
    positiveHighlights: [
      "如果你在底层基础和排障定位上得分较高，说明你对嵌入式工作方式有不错适配度。",
      "嵌入式岗位非常看重稳定性意识，这类优势一旦形成会很有辨识度。",
      "只要把联调和验证过程讲清楚，你的项目就会比泛开发经历更有说服力。",
    ],
    growthHints: [
      "优先补稳定性验证和文档吸收，让你更像能在真实硬件环境里工作的工程师。",
      "把项目沉淀成“现象-定位-修复-验证”的链路，不要只讲实现了什么功能。",
      "继续训练底层约束意识，让你的表达更符合设备与系统场景。",
    ],
    byResumeStage: {
      no_resume: { urgency: "high", immediateAction: "先把最能体现联调和排障的项目整理成案例，重点写清异常是怎么一步步定位的。" },
      draft_resume: { urgency: "medium", immediateAction: "把简历里的底层项目改成“系统链路 / 问题定位 / 回归验证”结构，减少只写模块开发。" },
      applied_resume: { urgency: "medium", immediateAction: "按目标行业重排案例，车载、IoT、消费电子对稳定性和规范要求不同。" },
    },
    closingMessages: {
      "匹配度较高": {
        lost: "你已经具备嵌入式岗位的不少基础，下一步重点是收敛到更具体的底层方向。",
        direction_no_target: "你的适配度不错，继续往下走时要尽快确认自己更偏固件、驱动还是系统平台。",
        clear_goal_no_action: "你离嵌入式岗位已经不远了，优先把排障案例和验证过程做成简历主线。",
      },
      "潜力明显": {
        lost: "你有明显潜力，但最好再做一个真实联调项目，确认自己是否真的适应这类慢而细的工作方式。",
        direction_no_target: "你现在的基础够用，但稳定性验证和文档能力还需要继续加强。",
        clear_goal_no_action: "如果继续冲嵌入式岗，优先补排障和回归验证案例，别只强化功能开发。 ",
      },
      "需要补足": {
        lost: "先不要急着把自己锁定成嵌入式工程师，先做一个更完整的底层项目再判断。",
        direction_no_target: "你目前和嵌入式岗的距离主要在底层基础和排障方法，还不是只靠兴趣能补平的。",
        clear_goal_no_action: "想继续冲这个方向，就先补一段完整的联调和验证案例，否则岗位说服力不够。",
      },
    },
  },
  "strategy-consulting": {
    positiveHighlights: [
      "如果你在结构化拆解和商业综合上得分更高，说明你具备咨询岗位最稀缺的分析雏形。",
      "咨询岗真正有辨识度的是你能否把复杂问题压缩成清楚判断。",
      "只要把行业研究和表达质量做深，你的案例会更接近真实咨询输出。",
    ],
    growthHints: [
      "优先补行业研究和高层表达，避免材料只有信息量却没有判断力。",
      "把每个案例都练成“框架-关键事实-核心判断-建议动作”的清晰结构。",
      "继续做高压下的表达训练，让你的输出更像咨询而不是课程作业。",
    ],
    byResumeStage: {
      no_resume: { urgency: "high", immediateAction: "先整理 2 个最能体现结构化分析的案例，哪怕来自比赛、课程或行业研究报告。" },
      draft_resume: { urgency: "medium", immediateAction: "把经历改成“问题-分析框架-关键判断-结果”结构，去掉泛泛而谈的调研描述。" },
      applied_resume: { urgency: "medium", immediateAction: "按目标 firm 风格微调案例，强化英文资料处理、高压输出或行业研究等不同侧重。" },
    },
    closingMessages: {
      "匹配度较高": {
        lost: "你已经有不错的咨询适配度，接下来别继续停留在看岗位信息，先把最强 case 做成可投递材料。",
        direction_no_target: "你的基础已经能支撑咨询方向，下一步重点是收敛目标 firm 和行业兴趣。",
        clear_goal_no_action: "你离咨询岗已经很近，接下来最值钱的是持续练 case 和高质量表达，而不是继续搜更多资料。",
      },
      "潜力明显": {
        lost: "你对咨询岗有明显潜力，但还需要通过更高质量的案例输出来验证自己能否适应高标准节奏。",
        direction_no_target: "你不是没能力，而是分析和表达的成品还不够硬，先补最薄弱那一环。",
        clear_goal_no_action: "想冲咨询岗，就从今天开始把行业研究和框架表达练成标准动作。",
      },
      "需要补足": {
        lost: "先别急着把自己定义成咨询人，先拿一两个真实商业问题练结构化输出，再决定要不要深走。",
        direction_no_target: "你目前更像有兴趣，但分析闭环和高质量表达还没到咨询岗位级别。",
        clear_goal_no_action: "如果还想冲咨询岗，优先补结构化分析和高压表达，否则投递很容易被快速筛掉。",
      },
    },
  },
  "strategy-operations": {
    positiveHighlights: [
      "如果你在指标拆解和业务诊断上得分较高，说明你很有机会成长成真正的策略运营而不是执行型运营。",
      "策略运营特别看重你能否用数据驱动动作，而不是只把动作做完。",
      "把跨团队推进和复盘沉淀讲清楚，会让你的项目更像真实业务工作。",
    ],
    growthHints: [
      "优先补策略复盘和跨团队推进，不要让经历停留在“执行了什么”。",
      "把每个项目沉淀成“目标-指标-动作-结果-复盘”的闭环。",
      "继续训练业务诊断能力，让你能更快找到真正该动的那一个杠杆。",
    ],
    byResumeStage: {
      no_resume: { urgency: "high", immediateAction: "先挑 2 个最能体现数据驱动动作的校园或项目经历，整理成策略运营案例。" },
      draft_resume: { urgency: "medium", immediateAction: "把简历经历改成“问题-指标-策略-结果”的格式，补足复盘和协同部分。" },
      applied_resume: { urgency: "medium", immediateAction: "按目标业务场景重排案例，内容平台、本地生活、交易平台的策略逻辑差别很大。" },
    },
    closingMessages: {
      "匹配度较高": {
        lost: "你已经很有策略运营潜质，接下来要做的是收敛业务方向，而不是继续泛做各种运营动作。",
        direction_no_target: "你的能力基础已经不错，下一步重点是把案例尽快贴近具体业务场景。",
        clear_goal_no_action: "你离策略运营不远了，现在最该做的是把“数据到动作”的闭环做成标准案例。 ",
      },
      "潜力明显": {
        lost: "你对策略运营有潜力，但最好通过一段真实业务项目确认自己是否真的喜欢这种高频复盘和协同方式。",
        direction_no_target: "你已经有雏形，真正要补的是策略沉淀和跨团队推进的硬证据。",
        clear_goal_no_action: "想冲策略运营，就先把最弱的一条闭环补上，别让自己一直停在执行层。",
      },
      "需要补足": {
        lost: "先不要急着押注策略运营，先做一个带指标和复盘的真实项目，再判断是否适合。 ",
        direction_no_target: "你当前和策略运营的主要距离，不在热情，而在数据诊断和策略化表达仍然偏弱。",
        clear_goal_no_action: "如果继续冲这个方向，优先补“指标拆解 + 复盘沉淀”，否则会一直像泛运营简历。",
      },
    },
  },
  audit: {
    positiveHighlights: [
      "如果你在证据追踪和风险识别上得分较高，说明你有审计岗位很稀缺的谨慎和追踪能力。",
      "审计岗位真正值钱的是你对控制点和异常的敏感度，而不是简单细心。",
      "把核查逻辑和流程理解讲清楚，会让你的经历比“认真负责”更有职业感。",
    ],
    growthHints: [
      "优先补会计判断和规范执行，让你的严谨性更像审计而不是普通资料整理。",
      "把每次核查经历都沉淀成“风险点-核查动作-结论依据”的表达。",
      "继续训练高强度下的稳定输出，这会直接影响岗位可信度。",
    ],
    byResumeStage: {
      no_resume: { urgency: "high", immediateAction: "先把课程作业、流程梳理、案例核查等经历整理成第一版审计案例。" },
      draft_resume: { urgency: "medium", immediateAction: "把简历里的经历改成“风险点 / 核查逻辑 / 结论”结构，避免只写协助或整理资料。" },
      applied_resume: { urgency: "medium", immediateAction: "如果目标是事务所，优先强化高强度规范场景；如果目标是内审，优先补业务流程理解。" },
    },
    closingMessages: {
      "匹配度较高": {
        lost: "你在审计岗上已经有不错基础，接下来别再泛看岗位，先把最强核查案例做实。",
        direction_no_target: "你的适配度已经较高，下一步重点是确认自己更偏事务所还是企业内审路径。",
        clear_goal_no_action: "你离审计岗已经不远，最该做的是把核查逻辑和稳定性优势做成可被验证的证据。",
      },
      "潜力明显": {
        lost: "你对审计岗有潜力，但还需要通过更真实的核查场景确认自己是否适应这种高规范节奏。",
        direction_no_target: "你已经具备基础，继续往下走时要重点补会计判断和证据链表达。",
        clear_goal_no_action: "想冲审计岗，就把“风险点-核查逻辑-结论”练熟，不要只讲自己认真。 ",
      },
      "需要补足": {
        lost: "先别急着把自己锁定在审计，先做一次更完整的核查或流程梳理项目，再判断是否适合。 ",
        direction_no_target: "你当前的主要差距不在态度，而在审计式思维和规范表达还不够。 ",
        clear_goal_no_action: "如果还想继续冲审计岗，优先补证据链和会计判断案例，否则很难建立可信度。",
      },
    },
  },
  finance: {
    positiveHighlights: [
      "如果你在报表分析和业财联动上得分较高，说明你已经有财务分析型岗位的基础。",
      "财务岗位最值钱的是能把数字读成经营变化，这类能力会让你比单纯做账更有上升空间。",
      "只要把预算、分析和沟通链路说清楚，你的经历会更像真实财务岗位输出。",
    ],
    growthHints: [
      "优先补成本管理和财务表达，避免经历只剩“做了报表”。",
      "把每段经历都沉淀成“数字变化-原因解释-业务建议”的结构。",
      "继续训练业财联动思维，让你的结论更贴近经营场景。",
    ],
    byResumeStage: {
      no_resume: { urgency: "high", immediateAction: "先整理 2 个最能体现数字分析和经营解释的案例，哪怕来源是课程或财报分析。" },
      draft_resume: { urgency: "medium", immediateAction: "把简历里的经历改成“指标变化 / 原因归因 / 建议动作”结构，减少单纯列账务工作。" },
      applied_resume: { urgency: "medium", immediateAction: "按目标岗位微调案例，FP&A 强调经营分析，会计岗强调准确性和规范。 " },
    },
    closingMessages: {
      "匹配度较高": {
        lost: "你在财务方向上已经有明显优势，接下来要尽快收敛是走分析型还是核算型路径。",
        direction_no_target: "你的基础已经比较适合财务岗，下一步重点是把案例更贴近具体岗位方向。",
        clear_goal_no_action: "你离财务岗位已经不远，最该做的是把数字和业务连接起来，形成更成熟的案例表达。",
      },
      "潜力明显": {
        lost: "你有财务岗潜力，但最好再做一段真实分析或预算场景，确认自己是否适应这类工作方式。",
        direction_no_target: "你已经有雏形，继续往下走时要重点补经营解释和沟通表达。",
        clear_goal_no_action: "想冲财务岗，就别再停在表格层，把数字翻译成业务判断才是下一步关键。",
      },
      "需要补足": {
        lost: "先不要急着把自己完全锁定到财务岗，先做一个更完整的分析案例再判断是否适合。 ",
        direction_no_target: "你当前的主要差距不在努力程度，而在数字和业务之间的连接还不够。 ",
        clear_goal_no_action: "如果继续冲财务岗，优先补财务表达和经营分析，不然经历会显得偏基础执行。",
      },
    },
  },
  "data-analyst": {
    positiveHighlights: [
      "如果你在问题定义和量化分析上得分较高，说明你已经有成为分析岗的基本框架。",
      "数据分析岗位很看重口径意识和表达闭环，这类优势会直接影响你的岗位成熟度判断。",
      "只要把业务建议和分析路径讲清楚，你的项目会比单纯展示工具更有说服力。",
    ],
    growthHints: [
      "优先补指标口径和洞察表达，避免分析只停留在图表展示层。",
      "把每个项目都沉淀成“问题-口径-分析-结论-动作”的完整链路。",
      "继续强化业务理解，让你的分析更像在服务决策而不是单纯做报表。",
    ],
    byResumeStage: {
      no_resume: { urgency: "high", immediateAction: "先整理 2 个最完整的数据分析项目，把问题定义、口径和建议写成案例页面。" },
      draft_resume: { urgency: "medium", immediateAction: "把简历项目改成“业务问题 / 指标口径 / 分析过程 / 建议动作”结构，去掉纯工具罗列。" },
      applied_resume: { urgency: "medium", immediateAction: "按目标行业细化案例版本，让电商、内容、金融等场景的分析逻辑更像真的岗位输出。" },
    },
    closingMessages: {
      "匹配度较高": {
        lost: "你在数据分析岗上已经有较强基础，接下来重点是收敛到更具体的行业和分析方向。",
        direction_no_target: "你的适配度已经不错，下一步是把分析能力更明确地贴到目标业务场景上。",
        clear_goal_no_action: "你离分析岗已经不远，最该做的是把完整分析闭环做成标准化案例。 ",
      },
      "潜力明显": {
        lost: "你对分析岗有明显潜力，但还需要通过更真实的业务分析案例确认自己是否适合长期做这类工作。",
        direction_no_target: "你已经有雏形，真正要补的是指标口径和建议落地的硬证据。",
        clear_goal_no_action: "想冲分析岗，优先把业务问题和分析结论讲得更完整，别让自己只像一个会工具的人。",
      },
      "需要补足": {
        lost: "先不要急着完全押注数据分析，先做一个更完整的分析项目再判断是否适合。 ",
        direction_no_target: "你当前和分析岗的主要距离，在于问题定义和口径意识还不够稳定。 ",
        clear_goal_no_action: "如果继续冲这个方向，优先补完整分析闭环和业务表达，不然项目会一直显得像模板作业。",
      },
    },
  },
};

function buildResultTemplate(roleId, roleProfile, template, specificContent) {
  return {
    selfAwareness: {
      title: "自我认知",
      positiveHighlights: specificContent.positiveHighlights,
      growthHints: specificContent.growthHints,
    },
    marketReality: {
      title: "外界认知",
      content: template.reality,
    },
    actionGuide: {
      title: "行动指引",
      studyPlan: template.studyPlan,
      internshipPlan: template.internshipPlan,
      skillPlan: {
        hardSkills: template.hardSkills,
        softSkills: template.softSkills,
      },
    },
    closingMessage: {
      title: "结尾寄语",
      byFitLabelCareerStage: specificContent.closingMessages,
    },
    roleId,
    roleProfile,
  };
}

export const ROLE_CONFIG = Object.fromEntries(
  roles.map((role) => {
    const roleProfile = getRoleProfile(role.id);
    const template = getResultTemplate(role.id);
    const specificContent = roleSpecificContent[role.id];

    return [
      role.id,
      {
        id: role.id,
        name: role.name,
        emoji: role.emoji,
        definition: role.definition,
        realWorldInterpretation: role.realWorldInterpretation,
        commonMisconceptions: role.commonMisconceptions,
        topCompanies: roleProfile?.topCompanies ?? [],
        avgSalary: roleProfile?.avgSalary ?? "",
        careerPath: roleProfile?.careerPath ?? "",
        coreCompetencies: roleProfile?.coreCompetencies ?? [],
        resultTemplate: buildResultTemplate(role.id, roleProfile, template, specificContent),
        actionPlanTemplate: {
          byGraduationYear: defaultYearPlan,
          byCareerStage: defaultCareerStagePlan,
          byResumeStage: specificContent.byResumeStage,
        },
      },
    ];
  }),
);

export function getRoleConfig(roleId) {
  return ROLE_CONFIG[roleId] ?? null;
}

export function getContextualActionPlan(roleId, profile = {}) {
  const config = getRoleConfig(roleId);

  if (!config) {
    return null;
  }

  return {
    byYear: config.actionPlanTemplate.byGraduationYear[profile.graduationYear] ?? config.actionPlanTemplate.byGraduationYear.other,
    byCareerStage: config.actionPlanTemplate.byCareerStage[profile.careerStage] ?? config.actionPlanTemplate.byCareerStage.lost,
    byResumeStage: config.actionPlanTemplate.byResumeStage[profile.resumeStage] ?? config.actionPlanTemplate.byResumeStage.no_resume,
  };
}
