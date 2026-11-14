import type { CSSProperties } from 'react'
import { Reveal, RevealLines, useInView } from '../lib/motion'
import { ButtonLink } from '../components/ui'

const LINE_ITEMS = [
  { qty: '1 ×', item: 'refweir binary', price: '0.00' },
  { qty: '∞ ×', item: 'human seats', price: '0.00' },
  { qty: '∞ ×', item: 'agent seats', price: '0.00' },
  { qty: '2 ×', item: 'MCP endpoints', price: '0.00' },
  { qty: '1 ×', item: 'review agent', price: '0.00' },
  { qty: '∞ ×', item: 'capability leases', price: '0.00' },
  { qty: '', item: 'vendor lock-in', price: '0.00' },
  { qty: '', item: 'hardware', price: 'yours' },
]

const INCLUDED = [
  'Every feature, no tiers',
  'Smart-HTTP and SSH',
  'MCP · full and read-only',
  'Capability leases',
  'Autonomous PR review',
  'Embedded product UI',
]

// Bar widths for the receipt barcode, in px.
const BARS = [2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 4, 2, 1, 3, 1, 2, 2, 1, 4, 1, 1, 3, 2, 1, 2, 3, 1, 1, 2, 4, 1, 2]

function Receipt() {
  const [ref, inView] = useInView<HTMLDivElement>({ once: true, threshold: 0.3 })
  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[400px]">
      <div aria-hidden="true" className="relative z-10 mx-[-14px] h-5 rounded-full bg-ink shadow-[0_8px_18px_-6px_rgba(0,0,0,0.5)]" />
      <div className="-mt-2.5 overflow-hidden px-1 pb-6">
        <div
          className="transition-transform duration-[1600ms] ease-out-expo motion-reduce:transition-none"
          style={{ transform: inView ? 'translateY(0) rotate(-1.2deg)' : 'translateY(-100%) rotate(-1.2deg)' }}
        >
          <div className="bg-sheet px-6 pb-6 pt-8 font-mono text-[12px] text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] md:px-8">
            <p className="text-center text-[13px] font-semibold tracking-[0.2em]">REFWEIR FORGE</p>
            <p className="mt-1 text-center text-[12px] text-mute">SELF-HOSTED · TERMINAL :2222</p>
            <p className="mt-4 text-center text-[12px] text-mute">ORDER #000142 · QTY ∞</p>
            <div className="my-4 border-t border-dashed border-ink/30" />
            <ul className="space-y-1.5">
              {LINE_ITEMS.map((line, index) => (
                <li
                  key={line.item}
                  className="flex items-baseline gap-2 transition-opacity duration-500"
                  style={{ opacity: inView ? 1 : 0, transitionDelay: `${700 + index * 90}ms` } as CSSProperties}
                >
                  <span className="w-7 shrink-0 text-mute">{line.qty}</span>
                  <span>{line.item}</span>
                  <span aria-hidden="true" className="flex-1 translate-y-[-3px] border-b border-dotted border-ink/30" />
                  <span>{line.price}</span>
                </li>
              ))}
            </ul>
            <div className="my-4 border-t border-dashed border-ink/30" />
            <p className="flex items-baseline justify-between text-[15px] font-semibold">
              <span>TOTAL</span>
              <span className="text-[30px] font-semibold tracking-[-0.04em]">$0.00</span>
            </p>
            <p className="mt-1 flex justify-between text-[12px] text-mute">
              <span>PAID WITH</span>
              <span>go build · CGO_ENABLED=0</span>
            </p>
            <div className="my-4 border-t border-dashed border-ink/30" />
            <div aria-hidden="true" className="flex h-12 items-stretch justify-center gap-[2px]">
              {BARS.map((width, index) => (
                <span key={index} className="bg-ink" style={{ width }} />
              ))}
            </div>
            <p className="mt-3 text-center text-[11px] tracking-[0.18em]">THANK YOU FOR SELF-HOSTING</p>
          </div>
          <div aria-hidden="true" className="receipt-teeth" />
        </div>
      </div>
    </div>
  )
}

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="px-2 md:px-3">
      <div className="overflow-hidden rounded-[28px] bg-signal text-on-signal md:rounded-[40px]">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="type-label flex items-center gap-3">
                <span>[09]</span>
                <span aria-hidden="true" className="h-px w-8 bg-ink/40" />
                <span>Pricing</span>
              </p>
            </Reveal>
            <RevealLines
              id="pricing-title"
              className="type-xl mt-8"
              lines={['Free.', <>On <span className="type-serif">your</span> metal.</>]}
            />
            <Reveal as="p" delay={200} className="mt-10 max-w-[44ch] text-[18px] leading-[1.5] md:text-[20px]">
              Refweir is open source and self-hosted. There is no seat count to negotiate, no agent meter running and no
              cloud bill at the end of the month.
            </Reveal>
            <Reveal delay={280} className="mt-10 grid max-w-[560px] grid-cols-2 gap-x-6 border-t border-ink/25">
              {INCLUDED.map((item) => (
                <p key={item} className="flex items-center gap-2.5 border-b border-ink/25 py-3 text-[15px]">
                  <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-ink" />
                  {item}
                </p>
              ))}
            </Reveal>
            <Reveal delay={340} className="mt-10 flex flex-wrap gap-2">
              <ButtonLink href="#start" variant="ink">
                Get the binary
              </ButtonLink>
              <ButtonLink href="#faq" variant="outline">
                Read the FAQ
              </ButtonLink>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:pt-6">
            <Receipt />
          </div>
        </div>
      </div>
    </section>
  )
}
