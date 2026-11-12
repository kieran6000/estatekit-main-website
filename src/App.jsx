import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import PageActivity from "./components/PageActivity";
import ScrollToTop from "./components/ScrollToTop";
import { useJsonLd } from "./hooks/useJsonLd";
import { clearRenderTime } from "./lib/renderClock";
import { ORGANIZATION_SCHEMA } from "./config/schema";
import Home from "./pages/Home";
import PitchVSL from "./pages/PitchVSL";
import NotFound from "./pages/NotFound";
import Thanks from "./pages/Thanks";
import PitchRES from "./pages/PitchRES";
import Webinar from "./pages/Webinar";
import Training from "./pages/Training";
import TrainingThanks from "./pages/TrainingThanks";
import JuaniResults from "./pages/JuaniResults";
import SakhileResults from "./pages/SakhileResults";
import Results from "./pages/Results";
import Rebook from "./pages/Rebook";
import RebookLink from "./pages/RebookLink";
import Resources from "./pages/Resources";
import ResourceArticle from "./pages/ResourceArticle";
import Author from "./pages/Author";
import { AUTHOR } from "./config/schema";

export default function App() {
  // Who EstateKit is, on every page, so a crawler landing anywhere can tie
  // the page to the business.
  useJsonLd(ORGANIZATION_SCHEMA, "ek-org-jsonld");

  // Runs after every page component has mounted, so anything that rendered
  // the build's date to match the static HTML has already moved on to today.
  useEffect(() => clearRenderTime(), []);

  return (
    <>
      {/* One view card per page, for every route. */}
      <PageActivity />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/webinar" element={<Webinar />} />
        <Route path="/pitch-vsl" element={<PitchVSL />} />
        <Route path="/pitch/res" element={<PitchRES />} />
        <Route path="/pitch" element={<PitchVSL />} />
        <Route path="/results" element={<Results />} />
        <Route path="/thank-you" element={<Thanks />} />
        <Route path="/rebook" element={<Rebook />} />
        <Route path="/rebook/link" element={<RebookLink />} />
        <Route path="/training" element={<Training />} />
        <Route path="/training-vsl" element={<Training />} />
        <Route path="/training/thank-you" element={<TrainingThanks />} />
        <Route path="/juani-results" element={<JuaniResults />} />
        <Route path="/sakhile-results" element={<SakhileResults />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/:slug" element={<ResourceArticle />} />
        <Route path={AUTHOR.path} element={<Author />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
