import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import ConversionIntakeForm from "../components/ConversionIntakeForm.jsx";
import SectionCard from "../components/SectionCard.jsx";
import { readConversionContext, getConversionSourceLabel } from "../lib/conversion.js";
import { getActiveProfile } from "../services/mockDatabase.js";

export default function ConsultationPage() {
  const location = useLocation();
  const activeProfile = getActiveProfile();
  const context = useMemo(
    () => readConversionContext(location.search, activeProfile),
    [location.search, activeProfile],
  );
  const sourceLabel = getConversionSourceLabel(context.source);

  return (
    <AppShell
      title="预约一对一咨询"
      subtitle={`围绕 ${context.roleName} 方向，把刚完成的评估继续往前推进。这里更关注下一步该怎么做，而不是只停留在结果判断上。`}
    >
      <div className="stats-grid">
        <div className="summary-pill">
          <span>承接当前结论</span>
          <strong>{context.roleName}</strong>
        </div>
        <div className="summary-pill">
          <span>进入来源</span>
          <strong>{sourceLabel}</strong>
        </div>
        <div className="summary-pill">
          <span>咨询重点</span>
          <strong>岗位准备顺序</strong>
        </div>
        <div className="summary-pill">
          <span>适合解决</span>
          <strong>方向不清 / 节奏混乱</strong>
        </div>
      </div>

      <div className="page-grid page-grid-wide">
        <SectionCard title="这次咨询会继续解决什么" kicker="承接当前评估">
          <ul className="plain-list">
            <li>把当前评估结论翻译成更具体的下一步动作：课程、实习、项目、留学或投递顺序。</li>
            <li>围绕 {context.roleName} 岗位，判断现在最该先补哪一条能力短板，而不是所有事情同时做。</li>
            <li>如果你有留学意向，也会一起看这条路径如何和求职准备衔接，避免“读了项目但求职还是断层”。</li>
          </ul>
        </SectionCard>

        <ConversionIntakeForm
          title="留下信息，安排咨询承接"
          kicker="预约表单"
          formType="consultation"
          submitLabel="提交咨询需求"
          successTitle="咨询需求已提交"
          successDescription={`我们已收到你的 ${context.roleName} 咨询需求。后续会根据你填写的问题，把评估结果继续翻成更细的准备建议。`}
          successNextSteps={[
            "我们会优先查看你当前的岗位方向、年级和最想解决的问题。",
            "后续会通过你留下的联系方式和你确认更适合的沟通方式与时间。",
            "如果你已经有目标公司或留学意向，沟通时会一起纳入建议范围。",
          ]}
          sourcePage={context.source || "/result"}
          sourceLabel={sourceLabel}
          defaultRoleId={context.roleId}
          showOverseasIntent
          showTimePreference
          questionLabel="当前最想解决的问题"
          questionPlaceholder="例如：我现在更应该优先补实习，还是先把留学方向和岗位方向先对齐？"
        />
      </div>

      <SectionCard title="什么情况下值得现在就约" kicker="适用场景">
        <ul className="plain-list">
          <li>你已经做完评估，但还不知道本学期最该先补什么。</li>
          <li>你在岗位准备、留学路径、实习节奏之间来回摇摆，缺少优先级判断。</li>
          <li>你担心自己在准备上投入很多，但动作和目标岗位并没有真正对齐。</li>
        </ul>
      </SectionCard>
    </AppShell>
  );
}
