import { useMemo, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { usePageMeta } from "../hooks/usePageMeta";
import logo from "../../assets/primary.svg";

const SITE = "https://estatekit.co";

/** SA numbers however they were typed (083…, +27 083…, 83…) as 27831234567. */
function toDigits(raw) {
  let d = String(raw || "").replace(/\D/g, "");
  if (d.length === 10 && d.startsWith("0")) d = "27" + d.slice(1);
  else if (d.length === 12 && d.startsWith("270")) d = "27" + d.slice(3);
  else if (d.length === 9 && /^[6-8]/.test(d)) d = "27" + d;
  return d;
}

/** Reads "Name: …", "Phone: …", "Email: …" lines, as in a calendar event. */
function parsePasted(text) {
  const grab = (label) =>
    (text.match(new RegExp(`^\\s*${label}\\s*:\\s*(.+)$`, "im"))?.[1] || "").trim();
  const email = grab("Email") || (text.match(/[^\s@]+@[^\s@]+\.[^\s@]+/)?.[0] ?? "");
  return { name: grab("Name"), phone: grab("Phone"), email };
}

const field =
  "w-full rounded-lg h-10 px-3 border-2 border-[#d1d5db] bg-[#F9FAFB] text-sm text-gray-900 outline-none focus:border-[#1C64F2]";

/**
 * Internal tool: makes the personal /rebook link for a lead, with their
 * details in it so the page is just the calendar, plus the message to send.
 */
const RebookLink = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState("");

  usePageMeta({
    title: "Reschedule link | EstateKit",
    description: "Make a reschedule link for a lead.",
    path: "/rebook/link",
    noindex: true,
  });

  const digits = toDigits(phone);
  const first = name.trim().split(/\s+/)[0] || "";

  const link = useMemo(() => {
    const q = new URLSearchParams();
    if (name.trim()) q.set("name", name.trim());
    if (email.trim()) q.set("email", email.trim());
    if (digits) q.set("phone", `+${digits}`);
    return `${SITE}/rebook?${q}`;
  }, [name, email, digits]);

  const message = `Hi ${first || "there"}, no stress if your time doesn't work anymore. Pick a new one here and you'll get a fresh invite: ${link}`;

  const ready = Boolean(name.trim() && digits && email.trim());

  const copy = async (what, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      window.prompt("Copy this:", text);
    }
  };

  const onPaste = (e) => {
    const text = e.clipboardData.getData("text");
    if (!/(name|phone|email)\s*:/i.test(text)) return;
    e.preventDefault();
    const p = parsePasted(text);
    if (p.name) setName(p.name);
    if (p.phone) setPhone(p.phone);
    if (p.email) setEmail(p.email);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-4 py-10 text-slate-900 antialiased">
      <div className="mx-auto max-w-md">
        <img src={logo} alt="EstateKit" className="mx-auto h-7" />
        <h1 className="mt-6 text-center text-2xl font-black uppercase">
          Reschedule link
        </h1>
        <p className="mt-2 text-center text-sm text-slate-600">
          Fill in the lead, or paste a calendar event's details into any box.
          They land straight on the calendar with everything filled in.
        </p>

        <div
          className="mt-6 space-y-3 rounded-xl border border-[#e5e7eb] bg-white p-5"
          onPaste={onPaste}
        >
          <label className="block text-sm font-medium">
            Name
            <input className={`${field} mt-1`} value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="block text-sm font-medium">
            WhatsApp number
            <input className={`${field} mt-1`} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="082 123 4567" />
          </label>
          <label className="block text-sm font-medium">
            Email
            <input className={`${field} mt-1`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          {!ready && (
            <p className="text-xs text-slate-500">
              All three are needed: the email gets the new invite and replaces
              their old one, and the number matches them in the dashboard.
            </p>
          )}
        </div>

        {ready && (
          <div className="mt-4 space-y-3 rounded-xl border border-[#e5e7eb] bg-white p-5">
            <p className="break-all rounded-lg bg-[#F3F4F6] p-3 text-xs text-slate-700">{link}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => copy("link", link)}
                className="flex-1 rounded-lg border-2 border-[#1C64F2] px-3 py-2 text-sm font-semibold text-[#1C64F2]"
              >
                {copied === "link" ? "Copied" : "Copy link"}
              </button>
              <button
                type="button"
                onClick={() => copy("msg", message)}
                className="flex-1 rounded-lg border-2 border-[#1C64F2] px-3 py-2 text-sm font-semibold text-[#1C64F2]"
              >
                {copied === "msg" ? "Copied" : "Copy message"}
              </button>
            </div>
            <a
              href={`https://wa.me/${digits}?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-3 py-2.5 text-sm font-bold text-white"
            >
              <FaWhatsapp className="text-lg" /> Send on WhatsApp
            </a>
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="block text-center text-xs text-slate-500 underline"
            >
              Preview what they'll see
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default RebookLink;
