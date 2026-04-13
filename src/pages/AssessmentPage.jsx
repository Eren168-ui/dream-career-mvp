import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getQuestionSetForRole, buildAssessmentResult } from "../lib/assessment.js";
import { countAnsweredQuestions, filterAnswersForQuestionSet } from "../lib/assessmentSession.js";
import {
  getActiveProfile,
  getLatestAnswerRecord,
  saveAnswerRecord,
  saveAssessmentResult,
} from "../services/mockDatabase.js";

export default function AssessmentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const profile = state?.profile ?? getActiveProfile();
  const questionSet = profile ? getQuestionSetForRole(profile.targetRole) : null;
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (!profile) return;
    const latestAnswers = getLatestAnswerRecord(profile.id);
    setAnswers(filterAnswersForQuestionSet(questionSet, latestAnswers?.answers ?? {}));
  }, [profile?.id, questionSet?.id]);

  if (!profile || !questionSet) {
    return (
      <div className="page-container" style={{ textAlign: "center", paddingTop: 80 }}>
        <p>请先完成信息填写</p>
        <button className="btn btn-ghost mt-4" onClick={() => navigate("/start")}>返回首页</button>
      </div>
    );
  }

  const answered = countAnsweredQuestions(questionSet, answers);
  const total = questionSet.questions.length;
  const progress = Math.round((answered / total) * 100);

  function pick(questionId, value) {
    setAnswers((a) => ({ ...a, [questionId]: value }));
  }

  function handleSubmit() {
    if (answered < total) return;
    const normalizedAnswers = filterAnswersForQuestionSet(questionSet, answers);
    const answerRecord = saveAnswerRecord({ profileId: profile.id, roleId: profile.targetRole, answers: normalizedAnswers });
    const result = buildAssessmentResult({ profile, answers: normalizedAnswers });
    const saved = saveAssessmentResult({ profileId: profile.id, answerRecordId: answerRecord.id, result });
    navigate("/result", { state: { result: saved, profile } });
  }

  return (
    <div>
      <nav className="nav">
        <span className="nav-brand">梦想职业评估</span>
        <div className="nav-steps">
          <span className="nav-step">① 信息建档</span>
          <span className="nav-step active">② 题目作答</span>
          <span className="nav-step">③ 结果查看</span>
        </div>
      </nav>
      <div className="page-container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>职业准备度评估 · {questionSet.title}</h2>
            <p className="text-muted text-sm" style={{ marginTop: 4 }}>
              请结合你的实际学习和实践经验，选择最符合你当前状态的选项。
            </p>
          </div>
          <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>
            {answered}/{total} 已作答
          </div>
        </div>

        {/* 进度条 */}
        <div style={{ marginBottom: 28 }}>
          <div className="score-bar-track" style={{ height: 4 }}>
            <div className="score-bar-fill" style={{ width: `${progress}%`, background: "var(--accent)" }} />
          </div>
        </div>

        {questionSet.questions.map((q, idx) => (
          <div key={q.id} className="question-block">
            <div className="question-prompt">
              <span style={{ color: "var(--accent)", fontWeight: 700, marginRight: 8 }}>Q{idx + 1}</span>
              {q.prompt}
            </div>
            <div className="option-row">
              {q.options.map((o) => (
                <button
                  key={o.value}
                  className={`option-btn${answers[q.id] === o.value ? " selected" : ""}`}
                  type="button"
                  aria-pressed={answers[q.id] === o.value}
                  onClick={() => pick(q.id, o.value)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>← 返回修改</button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={answered < total}
            style={{ opacity: answered < total ? 0.5 : 1 }}
          >
            提交并查看岗位匹配度分析 →
          </button>
        </div>
      </div>
    </div>
  );
}
