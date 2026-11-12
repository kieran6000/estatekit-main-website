import { usePageMeta } from "../hooks/usePageMeta";
import Nav from "../components/home/Nav";
import Hero from "../components/home/Hero";
import Brokerages from "../components/home/Brokerages";
import SocialProof from "../components/SocialProof";
import Services from "../components/home/Services";
import FeaturedTestimonial from "../components/home/FeaturedTestimonial";
import Team from "../components/home/Team";
import Stats from "../components/home/Stats";
import TestimonialsGrid from "../components/home/TestimonialsGrid";
import VideoResults from "../components/home/VideoResults";
import Guarantee from "../components/home/Guarantee";
import Faq from "../components/home/Faq";
import Booking from "../components/home/Booking";
import HomeFooter from "../components/home/HomeFooter";

export default function Home() {
  usePageMeta({
    title: "EstateKit | Meta Ads & Seller Funnels for SA Estate Agents",
    description:
      "Since 2022 we've helped 70+ South African estate agents get seller leads with done-for-you Meta ads, lead funnels and CRM follow-up. You get the lead, you call.",
    path: "/",
  });

  return (
    <div className="font-[Montserrat,sans-serif] antialiased bg-white text-slate-900">
      <Nav />
      <Hero />
      <SocialProof />
      <Services />
      <FeaturedTestimonial />
      <Team />
      <Stats />
      <TestimonialsGrid />
      <VideoResults />
      <Guarantee />
      <Faq />
      <Booking />
      <HomeFooter />
    </div>
  );
}
