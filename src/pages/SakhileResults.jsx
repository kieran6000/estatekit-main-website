import TestimonialResultsPage from "./TestimonialResultsPage";
import { usePageMeta } from "../hooks/usePageMeta";
import { SAKHILE_YOUTUBE_ID } from "../config/trainingConfig";

export default function SakhileResults() {
  usePageMeta({
    title: "Sakhile's Results: 3 Sole Mandates in 3 Weeks | EstateKit",
    description:
      "See how Sakhile, a South African real estate agent, secured 3 sole mandates in just 3 weeks using EstateKit's seller-attraction system — without a single cold call.",
    path: "/sakhile-results",
  });

  return (
    <TestimonialResultsPage
      agentName="Sakhile"
      stat="3 Sole Mandates in 3 Weeks"
      detail=""
      youtubeId={SAKHILE_YOUTUBE_ID}
      headline={
        <>
          The Exact System That Got Sakhile{" "}
          <span className="text-brand font-black">3 Sole Mandates</span> in
          Just 3 Weeks
        </>
      }
    />
  );
}
