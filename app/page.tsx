import HeroSection from "@/components/hero/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import HackathonSection from "@/components/sections/HackathonSection";
import SignupSection from "@/components/sections/SignupSection";
import JoinTeamSection from "@/components/sections/JoinTeamSection";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <HackathonSection />
      <SignupSection />
      <JoinTeamSection />
      <Footer />
    </>
  );
}
