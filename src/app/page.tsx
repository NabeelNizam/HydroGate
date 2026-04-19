import "./globals.css"
import Hero from "./sections/Hero"
import About from "./sections/About"
import HowItWorks from "./sections/HowItWorks"
import Features from "./sections/Features"
import LiveStatus from "./sections/LiveStatus"


export default function Home() {

  return (
    <main className="cursor-default">
        <Hero />
        <About />
        <HowItWorks />
        <Features />
        <LiveStatus />
    </main>
  )

}