import ContactFormSection from '@/components/ContactFormSection';
import CustomSoftwareSection from '@/components/CustomSoftwareSection';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import GetStarted from '@/components/GetStarted';
import HowWeWork from '@/components/HowWeWork';
import InvestmentTiers from '@/components/InvestmentTiers';
import SystemsNavigationComplete from '@/components/SystemsNavigationComplete';
import TheProblem from '@/components/TheProblem';
import TheSolution from '@/components/TheSolution';

export default function Home() {
  return (
    <>
      <div data-theme="dark">
        <CustomSoftwareSection />
      </div>
      <section id="our-work" data-theme="light">
        <SystemsNavigationComplete />
      </section>
      <section id="problem" data-theme="dark">
        <TheProblem />
      </section>
      <section id="solution" data-theme="dark">
        <TheSolution />
      </section>
      <section id="how-we-work" data-theme="dark">
        <HowWeWork />
      </section>
      <section id="pricing" data-theme="light">
        <InvestmentTiers />
      </section>
      <div data-theme="dark">
        <ContactFormSection />
      </div>
      <section id="faq" data-theme="light">
        <FAQ />
      </section>
      <div data-theme="dark">
        <GetStarted />
      </div>
      <footer data-theme="dark">
        <Footer />
      </footer>
    </>
  );
}
