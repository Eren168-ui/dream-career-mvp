import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import SectionCard from "../components/SectionCard.jsx";
import { buildAssessmentResult, getQuestionSetForRole } from "../lib/assessment.js";
import { buildResumeDiagnosisReport } from "../lib/reporting.js";
import {
  getActiveProfile,
  getLatestAnswerRecord,
  saveAnswerRecord,
  saveAssessmentResult,
  saveResumeDiagnosisReport,
} from "../services/mockDatabase.js";

export default function AssessmentQuestionsPage() {
  const navigate = useNavigate();
  const [profile] = useState(getActiveProfile());
  const [answers, setAnswers] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!profile) return;
    const latestAnswers = getLatestAnswerRecord(profile.id);
    setAnswers(latestAnswers?.answers ?? {});
  }, [profile]);

  if (!profile) {
    return <Navigate to="/assessment/setup" replace />;
  }

  const questionSet = getQuestionSetForRole(profile.targetRole);
  const answeredCount = questionSet.questions.filter((item) => answers[item.id]).length;

  function updateAnswer(questionId, value) {
    setAnswers((current) => ({
      ...current,
      [questionId]: value,
    }));
    setSubmitError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const hasUnanswered = questionSet.questions.some((item) => !answers[item.id]);
    if (hasUnanswered) {
      setSubmitError("请先完成全部题目，再生成结果。");
      return;
    }

    const answerRecord = saveAnswerRecord({
      profileId: profile.id,
      roleId: profile.targetRole,
      answers,
    });

    const assessmentResult = saveAssessmentResult({
      profileId: profile.id,
      answerRecordId: answerRecord.id,
      result: buildAssessmentResult({ profile, answers }),
    });

    saveResumeDiagnosisReport({
      profileId: profile.id,
      assessmentId: assessmentResult.id,
      report: buildResumeDiagnosisReport({
        profile,
        assessmentResult,
      }),
    });

    navigate("/assessment/result");
  }

  return (
    <AppShell
      title="题目页"
      subtitle={`当前岗位：${questionSet.title}。已完成 ${answeredCount} / ${questionSet.questions.length} 题。每次只测 1 个岗位。`}
      actions={<button className="primary-button" form="question-form" type="submit">生成结果</button>}
    >
      <SectionCard title="答题说明" kicker="岗位专属题库">
        <p className="muted-text">
          当前答题记录会保存到本地 mock 的 <code>answer_records</code>，并同步生成
          <code>assessment_results</code> 与 <code>resume_diagnosis_reports</code>。
        </p>
      </SectionCard>

      <SectionCard title={questionSet.title} kicker="单选题">
        <form id="question-form" className="question-list" onSubmit={handleSubmit}>
          {questionSet.questions.map((item, index) => (
            <article key={item.id} className="question-card">
              <div className="question-head">
                <span className="question-index">Q{index + 1}</span>
                <h3>{item.prompt}</h3>
              </div>
              <div className="option-list">
                {item.options.map((option) => (
                  <label key={option.value} className={`option-item ${answers[item.id] === option.value ? "is-selected" : ""}`}>
                    <input
                      type="radio"
                      name={item.id}
                      value={option.value}
                      checked={answers[item.id] === option.value}
                      onChange={(event) => updateAnswer(item.id, event.target.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </article>
          ))}
          {submitError ? <p className="field-error">{submitError}</p> : null}
        </form>
      </SectionCard>

      <div className="footer-actions">
        <button className="ghost-button" onClick={() => navigate("/assessment/setup")}>
          返回导航页
        </button>
      </div>
    </AppShell>
  );
}
