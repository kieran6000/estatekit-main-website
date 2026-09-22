/**
 * Qualifying quiz shown before the booking embed on /pitch.
 *
 * Tuned for volume: the only answer that blocks the calendar outright is the
 * one that makes a lead genuinely unserviceable — a practitioner who is not
 * PPRA-registered cannot legally earn commission, so the offer can't help them
 * no matter how motivated they are. Everything else only moves the score,
 * which rides along to Discord so the sales team knows who to call first.
 */

export const QUALIFYING_QUESTIONS = [
  {
    id: "ppra_status",
    question: "Your PPRA status?",
    options: [
      { value: "principal_ffc", label: "Principal", points: 30 },
      { value: "full_ffc", label: "Full Status", points: 30 },
      { value: "ffc_pending", label: "FFC expired or renewing", points: 18 },
      { value: "candidate", label: "Candidate", points: 10 },
      {
        value: "not_registered",
        label: "Not registered",
        points: 0,
        disqualifies: true,
      },
    ],
  },
  {
    id: "area",
    type: "text",
    question: "Which city do you operate in?",
    placeholder: "e.g. Sandton, Fourways",
    points: 15,
  },
  {
    id: "transactions",
    question: "Deals closed in the last 12 months?",
    options: [
      { value: "0_5", label: "0 – 5", points: 8 },
      { value: "6_10", label: "6 – 10", points: 18 },
      { value: "10_plus", label: "10+", points: 25 },
    ],
  },
  {
    id: "timeline",
    question: "How soon do you want more leads?",
    options: [
      { value: "immediate", label: "Right away", points: 25 },
      { value: "30_days", label: "Within 30 days", points: 15 },
      { value: "later", label: "Just browsing", points: 4 },
    ],
  },
];

export const MAX_RAW_SCORE = QUALIFYING_QUESTIONS.reduce(
  (total, q) =>
    total + (q.type === "text" ? q.points : Math.max(...q.options.map((o) => o.points))),
  0,
);

/**
 * Floor for reaching the calendar. Deliberately low — it exists only to catch
 * the bottom of the barrel (an unsupervised candidate, no deals, no timeline).
 * A licensed agent clears it even with weak answers elsewhere.
 */
export const QUALIFY_THRESHOLD = 45;

/**
 * Scores a full or partial answer map.
 * @param {Record<string, string>} answers - question id -> option value, or
 *   the typed string for a text question
 */
export function scoreAnswers(answers) {
  let raw = 0;
  let disqualified = false;
  const breakdown = [];

  for (const question of QUALIFYING_QUESTIONS) {
    const value = answers[question.id];
    if (!value) continue;

    if (question.type === "text") {
      raw += question.points;
      breakdown.push({ question: question.question, answer: value });
      continue;
    }

    const option = question.options.find((o) => o.value === value);
    if (!option) continue;

    raw += option.points;
    if (option.disqualifies) disqualified = true;
    breakdown.push({ question: question.question, answer: option.label });
  }

  const score = Math.round((raw / MAX_RAW_SCORE) * 100);

  return {
    raw,
    score,
    disqualified,
    qualified: !disqualified && score >= QUALIFY_THRESHOLD,
    breakdown,
    band: disqualified
      ? "DISQUALIFIED"
      : score >= 80
        ? "HOT"
        : score >= 60
          ? "WARM"
          : score >= QUALIFY_THRESHOLD
            ? "QUALIFIED"
            : "LOW",
  };
}
