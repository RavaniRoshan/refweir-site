import { Nav } from './components/Nav'
import { Hero } from './sections/Hero'
import { ProductDemo } from './sections/ProductDemo'
import { Gallery } from './sections/Gallery'
import { Benefits } from './sections/Benefits'
import { Problem } from './sections/Problem'
import { Workflow } from './sections/Workflow'
import { Policy } from './sections/Policy'
import { Proof } from './sections/Proof'
import { Pricing } from './sections/Pricing'
import { Faq, FinalCta } from './sections/Faq'

export default function App() {
  return (
    <>
      <Nav />
      <a
        href="#content"
        className="type-label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <main id="content" className="overflow-x-clip">
        <Hero />
        <ProductDemo />
        <Gallery />
        <Benefits />
        <Problem />
        <Workflow />
        <Policy />
        <Proof />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
    </>
  )
}
