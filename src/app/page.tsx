import "./globals.css"
import Hero from "./sections/Hero"
import About from "./sections/About"
import Features from "./sections/Features"
import LiveStatus from "./sections/LiveStatus"
import SystemStats from "./sections/SystemStats"
import HowItWorks from "./sections/HowItWorks"
import { LandingMonitoringProvider } from "./sections/landing-monitoring"


export default function Home() {

  return (
    <main className="cursor-default bg-white">
      <LandingMonitoringProvider>
        <Hero />
        <About />
        <Features />
        <SystemStats />
        <LiveStatus />
        <HowItWorks />
      </LandingMonitoringProvider>
    </main>
  )

}
