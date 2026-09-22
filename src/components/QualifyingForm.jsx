import { useCallback, useEffect, useRef, useState } from "react";
import {
  QUALIFYING_QUESTIONS,
  QUALIFY_THRESHOLD,
  scoreAnswers,
} from "../config/qualifyingQuestions";
import { beaconDiscordEmbed, postDiscordEmbed } from "../lib/discord";
import { beaconToSheet, postToSheet } from "../lib/sheets";
import zaFlag from "../../assets/za-flag.svg";

const TOTAL_STEPS = QUALIFYING_QUESTIONS.length + 1; // + contact step

/** Share of the bar already filled before the first answer. */
const PROGRESS_FLOOR = 0.4;

const BAND_COLORS = {
  HOT: 0xef4444,
  WARM: 0xf97316,
  QUALIFIED: 0x22c55e,
  LOW: 0xf59e0b,
  DISQUALIFIED: 0x6b7280,
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** SA mobile, national part only: 9 digits starting 6, 7 or 8. */
const SA_MOBILE = /^[6-8]\d{8}$/;

const normalisePhone = (input) => input.replace(/\D/g, "").replace(/^0+/, "");

/** Labels for the answers, in question order, e.g. "Full Status · 6 – 10". */
function answerTrail(result) {
  return result.breakdown.map((b) => b.answer).join(" · ");
}

/** Human label for a stored answer value, for the sheet's columns. */
function labelFor(questionId, value) {
  const question = QUALIFYING_QUESTIONS.find((q) => q.id === questionId);
  const option = question?.options?.find((o) => o.value === value);
  return option?.label || value || "";
}

/**
 * One dense embed instead of a column of fields. Discord stacks inline fields
 * three-wide and pads each one, so a description packed with separators is
 * dramatically shorter on screen while carrying the same data.
 */
function compactEmbed({ title, color, lines, footer }) {
  return {
    title,
    color,
    description: lines.filter(Boolean).join("\n"),
    footer: footer ? { text: footer } : undefined,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Multi-step qualifying quiz. Calls `onComplete(result)` once the contact step
 * is submitted; the parent decides what to render next (calendar or rejection).
 *
 * Layout mirrors the reference registration modal exactly (card width, padding,
 * progress track, input and button sizing); only the accent colour differs.
 *
 * @param {(result: object) => void} props.onComplete
 * @param {number} [props.highlightKey] - bump to flash the card; the page uses
 *   this when a CTA sends someone here, in place of opening a second copy
 * @param {(questionId: string, value: string) => void} [props.onAnswer] - fired
 *   as each step is committed, so the page can act on partial answers
 * @param {() => Record<string, string>} [props.getEngagement] - extra Discord
 *   fields owned by the page (time on page, videos played)
 */
export default function QualifyingForm({
  onComplete,
  highlightKey = 0,
  onAnswer,
  getEngagement,
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const cardRef = useRef(null);
  const headingRef = useRef(null);
  const submittedRef = useRef(false);
  const reportedRef = useRef(false);
  const advanceRef = useRef(null);
  const stateRef = useRef({ step, answers, form });
  const engagementRef = useRef(getEngagement);
  useEffect(() => {
    stateRef.current = { step, answers, form };
    engagementRef.current = getEngagement;
  });

  const isContactStep = step === QUALIFYING_QUESTIONS.length;
  const question = QUALIFYING_QUESTIONS[step];
  const completed = step + 1;
  // Endowed progress: the bar opens already part-filled rather than at zero.
  // A task shown as part-done gets finished more often than the same task
  // shown as untouched, so step one reads as ~52% instead of 20%.
  const progress = Math.round(
    (PROGRESS_FLOOR + (1 - PROGRESS_FLOOR) * (completed / TOTAL_STEPS)) * 100,
  );

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  // Report partial answers when they bail — either by closing the tab or by
  // dismissing the modal, which unmounts this component.
  useEffect(() => {
    const reportAbandon = () => {
      const { step, answers, form } = stateRef.current;
      if (reportedRef.current || submittedRef.current) return;
      if (!Object.keys(answers).length) return;
      reportedRef.current = true;

      const result = scoreAnswers(answers);
      const contact = {
        ...form,
        phone: form.phone ? `+27${normalisePhone(form.phone)}` : "",
      };

      const engagement = engagementRef.current?.() || {};

      beaconDiscordEmbed(
        compactEmbed({
          title: `🚪 Drop-off at step ${step + 1}/${TOTAL_STEPS} · ${result.score} so far`,
          color: 0xe74c3c,
          lines: [
            contact.name || contact.email
              ? `${contact.name || "—"} · \`${contact.email || "no email"}\` · \`${contact.phone || "no phone"}\``
              : "_No contact details reached_",
            answerTrail(result) ? `🎫 ${answerTrail(result)}` : null,
            `⌛ ${engagement["⏱️ Time on Page"] || "—"} · 🎬 ${engagement["🎬 Videos Played"] || "None"}`,
          ],
          footer: "Pitch funnel • abandoned",
        }),
      );

      beaconToSheet("dropoff", { step: step + 1 });
    };

    window.addEventListener("pagehide", reportAbandon);
    return () => {
      window.removeEventListener("pagehide", reportAbandon);
      reportAbandon();
    };
  }, []);

  const goBack = () => {
    if (step === 0) return;
    const prev = step - 1;
    setStep(prev);
    setSelected(answers[QUALIFYING_QUESTIONS[prev].id] ?? null);
  };

  const commit = (value) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    setSelected(null);
    setStep(step + 1);
    if (step === 0) postToSheet("form_start", {});
    onAnswer?.(question.id, value);
  };

  const confirmAnswer = () => {
    const value = typeof selected === "string" ? selected.trim() : selected;
    if (value) commit(value);
  };

  // Single-choice steps advance on their own — the highlight is held briefly
  // so the tap registers visually before the question swaps out.
  const selectOption = (value) => {
    if (advanceRef.current) return;
    setSelected(value);
    advanceRef.current = window.setTimeout(() => {
      advanceRef.current = null;
      commit(value);
    }, 180);
  };

  useEffect(() => () => window.clearTimeout(advanceRef.current), []);

  // Toggled on the node rather than through state: removing the class and
  // forcing a reflow is what lets the same animation replay on repeat clicks.
  useEffect(() => {
    const card = cardRef.current;
    if (!highlightKey || !card) return;

    card.classList.remove("ek-qf--pulse");
    void card.offsetWidth;
    card.classList.add("ek-qf--pulse");

    const clear = () => card.classList.remove("ek-qf--pulse");
    card.addEventListener("animationend", clear, { once: true });
    return () => card.removeEventListener("animationend", clear);
  }, [highlightKey]);

  const submit = useCallback(async () => {
    const nextErrors = {};
    if (form.name.trim().length < 2)
      nextErrors.name = "Please enter your full name.";
    if (!EMAIL.test(form.email.trim()))
      nextErrors.email = "Please enter a valid email address.";
    if (!SA_MOBILE.test(normalisePhone(form.phone)))
      nextErrors.phone = "Enter a valid SA mobile number, e.g. 82 123 4567.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    const result = scoreAnswers(answers);
    const contact = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: `+27${normalisePhone(form.phone)}`,
    };
    submittedRef.current = true;

    const engagement = getEngagement?.() || {};

    await postDiscordEmbed(
      compactEmbed({
        title: `${result.qualified ? "✅" : "🚫"} ${contact.name} · ${result.score} ${result.band}`,
        color: BAND_COLORS[result.band],
        lines: [
          `\`${contact.phone}\` · \`${contact.email}\``,
          `📍 ${answers.area || "—"}`,
          `🎫 ${answerTrail(result)}`,
          `⌛ ${engagement["⏱️ Time on Page"] || "—"} · 🎬 ${engagement["🎬 Videos Played"] || "None"}`,
        ],
        footer: `Pitch funnel • pass mark ${QUALIFY_THRESHOLD}`,
      }),
    );

    postToSheet("submission", {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      area: answers.area || "",
      ppra: labelFor("ppra_status", answers.ppra_status),
      deals: labelFor("transactions", answers.transactions),
      timeline: labelFor("timeline", answers.timeline),
      score: result.score,
      band: result.band,
      qualified: result.qualified,
    });

    setSubmitting(false);
    onComplete({ ...result, contact });
  }, [answers, form, getEngagement, onComplete]);

  return (
    <div ref={cardRef} className="ek-qf">
      <div className="ek-qf__top">
        <div className="ek-qf__progress-container ek-qf__progress-container--full">
          <div
            className="ek-qf__progress-bar"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Step ${completed} of ${TOTAL_STEPS}`}
          >
            <div
              className="ek-qf__progress-fill"
              style={{ width: `${progress}%` }}
            >
              <span className="ek-qf__progress-value">{progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {isContactStep ? (
        <>
          <h3 ref={headingRef} tabIndex={-1} className="ek-qf__heading">
            Last Step
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <div className="ek-qf__field">
              <input
                type="text"
                autoComplete="name"
                placeholder="Full name"
                aria-label="Full name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                aria-invalid={Boolean(errors.name)}
                className={`ek-qf__input${errors.name ? " ek-qf__input--error" : ""}`}
              />
              {errors.name && <p className="ek-qf__error">{errors.name}</p>}
            </div>

            <div className="ek-qf__field">
              <input
                type="email"
                autoComplete="email"
                placeholder="Your best email"
                aria-label="Email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                aria-invalid={Boolean(errors.email)}
                className={`ek-qf__input${errors.email ? " ek-qf__input--error" : ""}`}
              />
              {errors.email && <p className="ek-qf__error">{errors.email}</p>}
            </div>

            <div className="ek-qf__field">
              <div
                className={`ek-qf__phone${errors.phone ? " ek-qf__input--error" : ""}`}
              >
                <span className="ek-qf__phone-prefix">
                  <img src={zaFlag} alt="South Africa" />
                  +27
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="82 123 4567"
                  aria-label="Phone number, South Africa"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  aria-invalid={Boolean(errors.phone)}
                />
              </div>
              {errors.phone && <p className="ek-qf__error">{errors.phone}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="ek-qf__submit !text-3xl !font-extrabold"
            >
              {submitting ? "Checking…" : "Yes! Book My Call"}
            </button>
          </form>
        </>
      ) : (
        <>
          <h3 ref={headingRef} tabIndex={-1} className="ek-qf__heading">
            {question.question}
          </h3>

          {question.type === "text" ? (
            <form
              className="ek-qf__options"
              onSubmit={(e) => {
                e.preventDefault();
                confirmAnswer();
              }}
            >
              <input
                type="text"
                placeholder={question.placeholder}
                aria-label={question.question}
                value={selected ?? ""}
                onChange={(e) => setSelected(e.target.value)}
                className="ek-qf__input"
              />
            </form>
          ) : (
            <div className="ek-qf__options">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => selectOption(option.value)}
                  aria-pressed={selected === option.value}
                  className={`ek-qf__option${selected === option.value ? " ek-qf__option--active" : ""}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          {question.type === "text" && (
            <button
              type="button"
              onClick={confirmAnswer}
              disabled={!selected?.trim()}
              className="ek-qf__submit"
            >
              OK
            </button>
          )}

          {step > 0 && (
            <button type="button" onClick={goBack} className="ek-qf__back">
              ← Back
            </button>
          )}
        </>
      )}

      <style>{`
        .ek-qf {
          width: 100%;
          max-width: 480px;
          box-sizing: border-box;
          box-shadow: 0px 4px 60px 0px #0000004D;
          padding: 18px 28px 16px;
          background: #1F223C;
          border-radius: 9px;
          margin: 0 auto;
          text-align: center;
        }
        .ek-qf *, .ek-qf *::before, .ek-qf *::after { box-sizing: border-box; }
        .ek-qf--pulse { animation: ekQfPulse 1.1s cubic-bezier(.22,1,.36,1) 2; }
        @keyframes ekQfPulse {
          0% {
            transform: scale(1);
            box-shadow: 0 4px 60px 0 #0000004D, 0 0 0 0 rgba(0,134,255,.9);
          }
          30% {
            transform: scale(1.03);
            box-shadow: 0 4px 60px 0 #0000004D, 0 0 0 8px rgba(0,134,255,.55);
          }
          60% {
            transform: scale(1.005);
            box-shadow: 0 4px 60px 0 #0000004D, 0 0 0 18px rgba(0,134,255,.22);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 4px 60px 0 #0000004D, 0 0 0 30px rgba(0,134,255,0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ek-qf--pulse { animation: none; outline: 3px solid #0086ff; outline-offset: 5px; }
          .ek-qf__progress-fill { animation: none; }
        }
        .ek-qf__top {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 14px;
        }
        .ek-qf__progress-container { flex: 1; min-width: 0; }
        .ek-qf__progress-container--full { width: 100%; }
        .ek-qf__progress-bar {
          background-color: #373B5D;
          border-radius: 30px;
          padding: 5px;
        }
        .ek-qf__progress-fill {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          height: 20px;
          padding-right: 9px;
          border-radius: 30px;
          background: repeating-linear-gradient(125deg, #0086ff, #0086ff 20px, #0072db 20px, #0072db 40px);
          animation: ekQfLoading 8s linear infinite;
          transition: width .35s cubic-bezier(.22,1,.36,1);
        }
        .ek-qf__progress-value {
          font-size: 11px;
          font-weight: 800;
          color: #fff;
          letter-spacing: .02em;
          line-height: 1;
        }
        @keyframes ekQfLoading {
          0%   { background-position: 0 0; }
          100% { background-position: 700px 0; }
        }
        .ek-qf__close {
          color: #fff;
          font-size: 26px;
          line-height: 1;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        .ek-qf__heading {
          padding: 0;
          margin: 0;
          font-weight: 800;
          font-size: 22px;
          line-height: 1.2;
          color: #fff;
        }
        .ek-qf__options {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin: 14px 0;
        }
        .ek-qf__option {
          min-height: 48px;
          border: solid 1px #fff;
          padding: 12px 14px;
          border-radius: 6px;
          background: #fff;
          width: 100%;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.25;
          color: #1F223C;
          cursor: pointer;
          text-align: center;
        }
        .ek-qf__option--active {
          border-color: #0086ff;
          background: #0086ff;
          color: #fff;
        }
        .ek-qf form {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 14px;
          margin: 14px 0;
        }
        .ek-qf__field { text-align: left; }
        .ek-qf__input {
          height: 48px;
          border: solid 1px #fff;
          padding: 0 12px;
          border-radius: 6px;
          background: #fff;
          width: 100%;
          font-size: 14px;
          font-weight: 600;
          color: #1F223C;
        }
        .ek-qf__input::placeholder,
        .ek-qf__phone input::placeholder { font-weight: 500; color: #8b93bd; }
        .ek-qf__input--error { border-color: #ef4444; }
        .ek-qf__phone {
          display: flex;
          align-items: stretch;
          height: 48px;
          border: solid 1px #fff;
          border-radius: 6px;
          background: #fff;
          overflow: hidden;
        }
        .ek-qf__phone-prefix {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 10px;
          border-right: 1px solid #d8dae5;
          font-weight: 700;
          color: #1F223C;
          user-select: none;
          font-size: 14px;
        }
        .ek-qf__phone-prefix img {
          width: 21px;
          height: 14px;
          border-radius: 2px;
          object-fit: cover;
        }
        .ek-qf__phone input {
          flex: 1;
          min-width: 0;
          border: none;
          outline: none;
          padding: 0 12px;
          font-size: 14px;
          font-weight: 600;
          color: #1F223C;
          background: transparent;
        }
        .ek-qf__error {
          color: #ff8080;
          font-size: 11px;
          margin: 5px 0 0;
          text-align: left;
        }
        .ek-qf__submit {
          background: #0086ff;
          border: none;
          color: white;
          font-size: 19px;
          font-weight: 700;
          border-radius: 6px;
          padding: 13px 15px;
          align-self: center;
          width: 100%;
          line-height: 1;
          text-transform: uppercase;
          cursor: pointer;
        }
        .ek-qf__submit:disabled { opacity: .4; cursor: not-allowed; }
        .ek-qf__back {
          background: none;
          border: none;
          color: #B6BCDA;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .08em;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 12px;
        }
        .ek-qf__back:hover { color: #fff; }
        @media (max-width: 768px) {
          .ek-qf { padding: 14px 16px 12px; border-radius: 8px; }
          .ek-qf__top { gap: 12px; margin-bottom: 12px; }
          .ek-qf__progress-fill { height: 18px; padding-right: 8px; }
          .ek-qf__progress-value { font-size: 10px; }
          .ek-qf__close { font-size: 24px; }
          .ek-qf__heading { font-size: 18px; }
          .ek-qf form, .ek-qf__options { margin: 12px 0; }
          .ek-qf__option { font-size: 13px; min-height: 44px; padding: 11px 12px; }
          .ek-qf__submit { font-size: 17px; padding: 12px 15px; }
        }
      `}</style>
    </div>
  );
}
