import { SiteHeader } from '@/components/landing/site-header'
import { HeroSection } from '@/components/landing/hero-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { RatesSection } from '@/components/landing/rates-section'
import { FaqSection } from '@/components/landing/faq-section'
import { SiteFooter } from '@/components/landing/site-footer'

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <RatesSection />
        <FaqSection />
      </main>
      <SiteFooter />
    </div>
  )
}
