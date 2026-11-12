import { Link } from "react-router-dom";
import logo from "../../../assets/primary.svg";
import { firstRenderNow } from "../../lib/renderClock";

/** Header and footer for /resources, the same plain frame as /results. */
export default function ResourceLayout({ children }) {
  return (
    <div className="bg-white text-slate-900 antialiased">
      <header className="border-b border-slate-100">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" aria-label="EstateKit home">
            <img src={logo} alt="EstateKit" className="h-7" />
          </Link>
          <Link
            to="/pitch"
            className="rounded bg-brand px-4 py-2 text-sm font-black uppercase tracking-wide text-white"
          >
            Book a call
          </Link>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-slate-100 px-4 py-8 text-center sm:px-6">
        <img src={logo} alt="EstateKit" className="mx-auto h-7 opacity-60" />
        <nav aria-label="Footer" className="mt-4 flex justify-center gap-5 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-brand">Home</Link>
          <Link to="/resources" className="hover:text-brand">Resources</Link>
          <Link to="/results" className="hover:text-brand">Results</Link>
        </nav>
        <p className="mt-4 text-xs text-slate-400">
          © {firstRenderNow().getFullYear()} EstateKit. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function CtaBlock({ title, text, button, to }) {
  return (
    <section className="border-t border-slate-100 bg-slate-50 px-4 py-14 text-center sm:px-6">
      <h2 className="mx-auto max-w-xl text-2xl font-black leading-tight sm:text-3xl">{title}</h2>
      {text ? (
        <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-slate-600">{text}</p>
      ) : null}
      <Link
        to={to}
        className="mt-7 inline-block rounded bg-brand px-8 py-4 text-base font-black uppercase tracking-wide text-white transition-opacity hover:opacity-90"
      >
        {button}
      </Link>
    </section>
  );
}

/** The "book a call" block: the default end of a guide, and of the index. */
export function BookCallCta() {
  return (
    <CtaBlock
      title="Want this running for you?"
      text="Book a call and we'll show you what Meta ads and a seller lead funnel would look like in your area."
      button="Book a call"
      to="/pitch"
    />
  );
}

/**
 * The block that ends a guide, picked by its `cta` frontmatter: "call"
 * (the default), "training", or "tool" with its own title, text, button and
 * link.
 */
export function ArticleCta({ article }) {
  if (article.cta === "training") {
    return (
      <CtaBlock
        title="Want to see the whole system first?"
        text="Free training on the seller attraction system South African agents are using to book listing appointments without cold calling."
        button="Get the free training"
        to="/training"
      />
    );
  }
  if (article.cta === "tool") {
    return (
      <CtaBlock
        title={article.ctaTitle}
        text={article.ctaText}
        button={article.ctaButton}
        to={article.ctaHref}
      />
    );
  }
  return <BookCallCta />;
}
