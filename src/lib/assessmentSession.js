export function filterAnswersForQuestionSet(questionSet, answers = {}) {
  const validQuestionIds = new Set((questionSet?.questions ?? []).map((item) => item.id));

  return Object.fromEntries(
    Object.entries(answers).filter(([questionId, value]) => validQuestionIds.has(questionId) && typeof value === "string" && value.length > 0),
  );
}

export function countAnsweredQuestions(questionSet, answers = {}) {
  return Object.keys(filterAnswersForQuestionSet(questionSet, answers)).length;
}
