import { AboutStrip } from '../components/home/AboutStrip.tsx'
import { AdmissionsBanner } from '../components/home/AdmissionsBanner.tsx'
import { CampusLifeSection } from '../components/home/CampusLifeSection.tsx'
import { CoursesShowcase } from '../components/home/CoursesShowcase.tsx'
import { FoundersSection } from '../components/home/FoundersSection.tsx'
import { HeroSection } from '../components/home/HeroSection.tsx'
import { RecruitersSection } from '../components/home/RecruitersSection.tsx'
import { TestimonialsSection } from '../components/home/TestimonialsSection.tsx'
import { WhyChooseSection } from '../components/home/WhyChooseSection.tsx'

export function Home() {
  return (
    <>
      <HeroSection />
      <AboutStrip />
      <CoursesShowcase />
      <WhyChooseSection />
      <RecruitersSection />
      <CampusLifeSection />
      <FoundersSection />
      <TestimonialsSection />
      <AdmissionsBanner />
    </>
  )
}
