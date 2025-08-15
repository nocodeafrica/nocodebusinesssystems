import CustomSoftwareSection from '@/components/CustomSoftwareSection'
import SystemsNavigationComplete from '@/components/SystemsNavigationComplete'
import TheProblem from '@/components/TheProblem'
import TheSolution from '@/components/TheSolution'
import HowWeWork from '@/components/HowWeWork'
import InvestmentTiers from '@/components/InvestmentTiers'
import FAQ from '@/components/FAQ'
import OurTeam from '@/components/OurTeam'
import GetStarted from '@/components/GetStarted'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <CustomSoftwareSection />
      <SystemsNavigationComplete />
      <TheProblem />
      <TheSolution />
      <HowWeWork />
      <InvestmentTiers />
      <FAQ />
      <OurTeam />
      <GetStarted />
      <Footer />
    </>
  )
}