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
    title:
      "EstateKit — Guaranteed Listing Appointments for SA Real Estate Agents",
    description:
      "Real estate specialised marketing for South African agents. Lead generation, ISA services, CRM & nurturing — all done in-house, with guaranteed results.",
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
