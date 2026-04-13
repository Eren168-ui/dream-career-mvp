import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import ConversionIntakeForm from "../components/ConversionIntakeForm.jsx";
import SectionCard from "../components/SectionCard.jsx";
import { getConversionSourceLabel, readConversionContext } from "../lib/conversion.js";
import { getActiveProfile } from "../services/mockDatabase.js";

export default function ResumeCasesPage() {
  const location = useLocation();
  const activeProfile = getActiveProfile();
  const context = useMemo(
    () => readConversionContext(location.search, activeProfile),
    [location.search, activeProfile],
  );
  const sourceLabel = getConversionSourceLabel(context.source);

  return (
    <AppShell
      title="领取同岗位案例"
      subtitle={`如果你想把 ${context.roleName} 的准备路径看得更具体，这里承接的是“别人怎么准备、简历怎么写、重点该怎么排”的那一层。`}
    >
      <div className="page-grid page-grid-wide">
        <SectionCard title="你会拿到什么" kicker="案例包内容">
          <ul className="plain-list">
            <li>同岗位案例参考：帮助你快速理解该岗位常见的项目表达方式和经历结构。</li>
            <li>简历结构参考：知道哪些内容应该前置，哪些内容更适合当补充。</li>
            <li>准备方向提示：把课程、项目、实习和表达方式串成更像招聘方能看懂的版本。</li>
          </ul>
        </SectionCard>

        <ConversionIntakeForm
          title="提交信息，领取案例参考"
          kicker="资料领取"
          formType="case"
          submitLabel="领取同岗位案例"
          successTitle="案例领取需求已提交"
          successDescription={`我们已收到你的 ${context.roleName} 案例领取需求。后续会按这个岗位方向整理更贴近的案例和结构参考。`}
          successNextSteps={[
            "你将获得同岗位案例参考、简历结构参考和准备方向提示。",
            "资料会优先按你填写的目标岗位整理，不会只给一份泛模板。",
            "如果你后续还要继续做简历诊断，也可以直接衔接到下一步。",
          ]}
          sourcePage={context.source || "/report"}
          sourceLabel={sourceLabel}
          defaultRoleId={context.roleId}
          questionLabel="你最想参考哪一类内容"
          questionPlaceholder="例如：我最想看同岗位的人是怎么写项目经历和实习经历的。"
        />
      </div>

      <SectionCard title="这份案例包适合怎么用" kicker="使用建议">
        <ul className="plain-list">
          <li>不要把案例当成直接照抄模板，更适合拿来对照自己的经历缺了什么结构。</li>
          <li>优先学习“别人是怎么讲清楚问题、动作、结果和岗位相关性”的，而不是只看排版。</li>
          <li>如果你已经有简历，最好在对照案例后再继续进入简历诊断页面做下一步承接。</li>
        </ul>
      </SectionCard>
    </AppShell>
  );
}
