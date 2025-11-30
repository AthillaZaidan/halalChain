import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { IndonesiaMap } from "@/components/indonesia-map"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorks } from "@/components/how-it-works"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <IndonesiaMap />
      <FeaturesSection />
      <HowItWorks />
      <Footer />
    </main>
  )
}
