import LandingHeader from "../components/LandingHeader.jsx";
import LandingFeatures from "../components/LandingFeatures.jsx";
import LandingFooter from "../components/LandingFooter.jsx";

function LandingPage() {
  return (
    <div className="font-sans bg-black">
      <LandingHeader />
      <LandingFeatures />
      <LandingFooter />
    </div>
  );
}

export default LandingPage;
