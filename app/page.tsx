import Navbar from "@/components/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import HackathonSection from "@/components/sections/HackathonSection";
import SignupSection from "@/components/sections/SignupSection";
import JoinTeamSection from "@/components/sections/JoinTeamSection";
import Footer from "@/components/sections/Footer";
import { GlowDivider } from "@/components/ui/glow-divider";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <GlowDivider variant="cyan" />
      <AboutSection />
      <GlowDivider variant="violet" />
      <HackathonSection />
      <GlowDivider variant="dual" />
      <SignupSection />
      <GlowDivider variant="violet" />
      <JoinTeamSection />
      <GlowDivider variant="cyan" />
      <Footer />
    </>
  );
}
