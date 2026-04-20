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
  const startPath = profile?.intent === "study_abroad_resume" ? "/study-abroad/start" : "/start";
  const questionSet = profile ? getQuestionSetForRole(profile.targetRole) : null;
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!profile) return;
    const latestAnswers = getLatestAnswerRecord(profile.id);
    setAnswers(filterAnswersForQuestionSet(questionSet, latestAnswers?.answers ?? {}));
  }, [profile?.id, questionSet?.id]);

  if (!profile || !questionSet) {
    return (
      <div className="page-container" style={{ textAlign: "center", paddingTop: 80 }}>
        <p>请先完成信息填写</p>
        <button className="btn btn-ghost mt-4" onClick={() => navigate(startPath)}>返回信息页</button>
      </div>
    );
  }

  const questions = questionSet.questions;
  const total = questions.length;
  const answered = countAnsweredQuestions(questionSet, answers);
  const current = questions[currentIndex];
  const isLast = currentIndex === total - 1;
  const isFirst = currentIndex === 0;

  function pick(questionId, value) {
    setAnswers((a) => ({ ...a, [questionId]: value }));
    // Auto-advance to next question after short delay — skip on last question
    if (!isLast) {
      setTimeout(() => {
        setCurrentIndex((i) => Math.min(i + 1, total - 1));
      }, 650);
    }
  }

  function handleNext() {
    if (isLast) return;
    setCurrentIndex((i) => i + 1);
  }

  function handlePrev() {
    if (isFirst) return;
    setCurrentIndex((i) => i - 1);
  }

  function handleSubmit() {
    if (answered < total) return;
    const normalizedAnswers = filterAnswersForQuestionSet(questionSet, answers);
    const answerRecord = saveAnswerRecord({ profileId: profile.id, roleId: profile.targetRole, answers: normalizedAnswers });
    const result = buildAssessmentResult({ profile, answers: normalizedAnswers });
    const saved = saveAssessmentResult({ profileId: profile.id, answerRecordId: answerRecord.id, result });
    const destination = profile.intent === "study_abroad_resume" ? "/study-abroad/report" : "/result";
    navigate(destination, { state: { result: saved, profile } });
  }

  const progressPercent = Math.round((answered / total) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <nav className="nav">
        <span className="nav-brand">职业测评</span>
        <div className="nav-steps">
          <span className="nav-step">① 基本信息</span>
          <span className="nav-step active">② 题目作答</span>
          <span className="nav-step">③ 查看结果</span>
        </div>
      </nav>

      <div className="page-container question-shell">
        <div className="question-progress-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <div style={{ fontSize: 13, color: "var(--text-2)" }}>
              第 <strong style={{ color: "var(--text-1)", fontSize: 16 }}>{currentIndex + 1}</strong> 题 / {total}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-3)" }}>
              {answered > 0 ? `已答 ${answered} 题，还差 ${total - answered} 题` : "选择即自动跳下一题"}
            </div>
          </div>
          <div style={{ height: 6, background: "#ECE7DE", borderRadius: 999, overflow: "hidden", marginBottom: 14 }}>
            <div style={{
              height: "100%",
              width: `${progressPercent}%`,
              background: "var(--accent)",
              borderRadius: 999,
              transition: "width .4s ease",
            }} />
          </div>
          <div className="question-dot-nav">
            {questions.map((q, idx) => {
              const isAnswered = !!answers[q.id];
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  type="button"
                  title={isAnswered ? `第 ${idx + 1} 题（已答）` : `第 ${idx + 1} 题（未答）`}
                  onClick={() => setCurrentIndex(idx)}
                  className={`question-dot${isCurrent ? " is-current" : ""}${isAnswered ? " is-answered" : ""}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        <div className="question-card">
          <div className="question-card__eyebrow">一题一屏 · 选择即自动跳转</div>
          <p className="question-card__prompt">{current.prompt}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {current.options.map((o) => {
              const selected = answers[current.id] === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => pick(current.id, o.value)}
                  className={`question-option${selected ? " is-selected" : ""}`}
                >
                  <span className="question-option__dot">
                    {selected && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3 5.5L8 1" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  <span>{o.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="question-footer">
          <button
            className="btn btn-ghost"
            onClick={handlePrev}
            disabled={isFirst}
            style={{ opacity: isFirst ? 0.3 : 1, fontSize: 13 }}
          >
            ← 上一题
          </button>

          {isLast ? (
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={answered < total}
              style={{ opacity: answered < total ? 0.45 : 1 }}
            >
              {answered < total ? `还差 ${total - answered} 题` : "提交，查看结果 →"}
            </button>
          ) : (
            <button
              className="btn btn-ghost"
              onClick={handleNext}
              style={{ fontSize: 13 }}
            >
              下一题 →
            </button>
          )}
        </div>

        {answered === total && !isLast && (
          <p style={{ fontSize: 12, color: "var(--text-3)", textAlign: "center", marginTop: 12 }}>
            全部已答完，翻到最后一题点击提交
          </p>
        )}
        {answered < total && (
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ fontSize: 12, color: "var(--text-3)", padding: "4px 12px" }}
              onClick={() => {
                const idx = questions.findIndex((q) => !answers[q.id]);
                if (idx !== -1) setCurrentIndex(idx);
              }}
            >
              跳到第一道未答题 ↓
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
