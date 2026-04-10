import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Research from '@/components/Research'
import Packages from '@/components/Packages'
import Publications from '@/components/Publications'
import Footer from '@/components/Footer'

export default function Home()
{
  return (
    <main id="main-content" className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      <Hero />
      <Research />
      <Packages />
      <Publications />
      <Footer />
    </main>
  )
}
