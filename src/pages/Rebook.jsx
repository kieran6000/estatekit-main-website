import { useCallback, useMemo } from "react";
import ApplicationWidget from "../components/booking/ApplicationWidget";
import { usePageMeta } from "../hooks/usePageMeta";
import { postActivity } from "../lib/discordCards";
import { submitFunnelLead } from "../lib/dashboard";
import { recallLead } from "../lib/rememberedLead";
import logo from "../../assets/primary.svg";

/**
 * Calendar-only rebooking page.
 *
 * A lead who already applied and already passed the score should not be sent
 * back through the pitch page and the questions to move a time. This is the
 * calendar and nothing else.
 *
 * Send leads estatekit.co/r/<lead id>: it looks them up and lands here with
 * their original details as query params, so there is no form at all.
 */
const Rebook = () => {
  const lead = useMemo(() => {
    const q = new URLSearchParams(window.location.search);
    // A personal link (estatekit.co/r/<lead id>) arrives with their details
    // in the URL. A bare /rebook falls back to what this device saved when
    // they first booked.
    const saved = q.get("name") ? null : recallLead();
    const full = (q.get("name") || saved?.name || "").trim();
    const [firstName, ...rest] = full.split(/\s+/);

    return {
      firstName: firstName || "",
      lastName: rest.join(" "),
      email: (q.get("email") || saved?.email || "").trim(),
      phone: (q.get("phone") || saved?.phone || "").trim(),
    };
  }, []);

  const handleBooked = useCallback(({ start, form }) => {
    const card = postActivity("booked", {
      who: form.fullName.trim() || "Rebooked lead",
      fields: {
        When: new Date(start).toLocaleString(undefined, {
          weekday: "long",
          day: "numeric",
          month: "short",
          hour: "numeric",
          minute: "2-digit",
        }),
        Phone: form.phone,
        Email: form.email,
        Type: "Rebooked an existing call",
      },
      link: form.phone ? `https://wa.me/${form.phone.replace(/\D/g, "")}` : "",
    });

    // Matches the existing dashboard row on phone number, so moving a time
    // updates the lead rather than creating a duplicate card.
    const lead = submitFunnelLead({
      name: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      startsAt: new Date(start).toISOString(),
      keepalive: true,
    });

    // Returned so the widget waits for both before it redirects; otherwise
    // the new time reaches the calendar but dies on its way to the dashboard.
    return Promise.all([card, lead]);
  }, []);

  usePageMeta({
    title: "Pick a new time | EstateKit",
    description: "Choose a new time for your EstateKit discovery call.",
    path: "/rebook",
    noindex: true,
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 antialiased">
      <header className="px-4 pt-10 pb-2 text-center">
        <img src={logo} alt="EstateKit" className="mx-auto h-8" />
        <h1 className="mx-auto mt-6 max-w-lg text-2xl font-black uppercase leading-tight sm:text-3xl">
          Pick a new time
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-600">
          {lead.firstName
            ? `No problem ${lead.firstName}. Choose whatever suits you below and we'll send a fresh invite.`
            : "Choose whatever suits you below and we'll send a fresh invite."}
        </p>
      </header>

      <ApplicationWidget
        title="EstateKit Discovery Call"
        // Nobody to prefill: ask for their details rather than booking a
        // blank call nobody can match to a lead.
        rebookFor={lead.firstName || lead.phone ? lead : null}
        onBook={handleBooked}
      />

      <footer className="px-4 pb-10 text-center text-xs text-slate-500">
        Nothing on the calendar that works?{" "}
        <a
          href="https://wa.me/264852878236"
          className="font-semibold text-brand underline"
        >
          WhatsApp us on +264 85 287 8236
        </a>
      </footer>
    </div>
  );
};

export default Rebook;
