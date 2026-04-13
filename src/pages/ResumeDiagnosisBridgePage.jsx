import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import ConversionIntakeForm from "../components/ConversionIntakeForm.jsx";
import SectionCard from "../components/SectionCard.jsx";
import { getConversionSourceLabel, readConversionContext } from "../lib/conversion.js";
import { getActiveProfile } from "../services/mockDatabase.js";

export default function ResumeDiagnosisBridgePage() {
  const location = useLocation();
  const activeProfile = getActiveProfile();
  const context = useMemo(
    () => readConversionContext(location.search, activeProfile),
    [location.search, activeProfile],
  );
  const sourceLabel = getConversionSourceLabel(context.source);

  return (
    <AppShell
      title="进入简历诊断"
      subtitle={`当前评估已经帮你判断了 ${context.roleName} 的准备方向，简历诊断会继续把这些判断落到“材料怎么改、证据怎么排、表达怎么收口”这一层。`}
    >
      <div className="page-grid page-grid-wide">
        <SectionCard title="当前评估已经解决了什么" kicker="上一步已完成">
          <ul className="plain-list">
            <li>你和目标岗位当前更接近“匹配度较高 / 潜力明显 / 需要补足”的哪一档。</li>
            <li>你当前的优势维度和优先补足方向分别是什么。</li>
            <li>本学期更适合先补课程、项目、实习还是进一步做岗位方向收口。</li>
          </ul>
        </SectionCard>

        <ConversionIntakeForm
          title="提交诊断意向，进入下一步"
          kicker="诊断承接"
          formType="diagnosis"
          submitLabel="进入简历诊断承接"
          successTitle="简历诊断意向已提交"
          successDescription={`我们已收到你的 ${context.roleName} 简历诊断承接需求。下一步会根据你当前的简历状态和问题，说明后续诊断与提交方式。`}
          successNextSteps={[
            "这一步先确认你的岗位方向、简历状态和最想解决的问题。",
            "当前页面暂不需要真实上传文件，后续会通过你填写的联系方式说明简历提交方式。",
            "诊断重点会继续承接这次评估结论，把“当前差距”翻译成“简历里该怎么改”。",
          ]}
          sourcePage={context.source || "/report"}
          sourceLabel={sourceLabel}
          defaultRoleId={context.roleId}
          showOverseasIntent
          showResumeStatus
          showCompanyType
          questionLabel="你最希望我们优先看简历中的哪类问题"
          questionPlaceholder="例如：我不知道现有项目该怎么改写成更像目标岗位会认可的表达。"
        />
      </div>

      <SectionCard title="简历诊断会继续解决什么" kicker="下一层承接">
        <ul className="plain-list">
          <li>哪些经历应该前置，哪些经历应该弱化，材料主线怎么收口更像目标岗位。</li>
          <li>课程、项目、实习和竞赛经历里，哪些能真正支撑 {context.roleName}，哪些只是看起来热闹。</li>
          <li>你现在最适合先做“简历结构调整”、“经历改写”还是“补证据后再改”。</li>
        </ul>
      </SectionCard>
    </AppShell>
  );
}
