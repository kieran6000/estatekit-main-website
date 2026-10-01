import TestimonialResultsPage from "./TestimonialResultsPage";
import { usePageMeta } from "../hooks/usePageMeta";
import { JUANI_YOUTUBE_ID } from "../config/trainingConfig";

export default function JuaniResults() {
  usePageMeta({
    title: "Juani's Results: 11 Listings & 1 Closed Deal in 6 Weeks | EstateKit",
    description:
      "See how Juani, a real estate agent in Boksburg, got 30 booked appointments, 11 listings, and 1 closed deal in just 6 weeks using EstateKit's seller-attraction system — without a single cold call.",
    path: "/juani-results",
  });

  return (
    <TestimonialResultsPage
      youtubeId={JUANI_YOUTUBE_ID}
      headline={
        <>
          The Exact System That Got Juani{" "}
          <span className="text-brand font-black">11 Listings</span> &{" "}
          <span className="text-brand font-black">1 Closed Deal</span> in
          Just 6 Weeks
        </>
      }
    />
  );
}
