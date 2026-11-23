import { useEffect, useRef, useState, type ComponentType } from 'react'
import { Reveal, RevealLines, useInView } from '../lib/motion'
import { SectionLabel } from '../components/ui'
import { ConnectDemo, LeaseDemo, PushDemo, ReviewDemo } from './workflow-demos'

type Chapter = {
  n: string
  kicker: string
  title: string
  body: string
  specs: string[]
  Demo: ComponentType<{ active: boolean }>
}

const CHAPTERS: Chapter[] = [
  {
    n: '01',
    kicker: 'Connect',
    title: 'Point any agent at /mcp.',
    body: 'Refweir speaks the Model Context Protocol natively. JSON-RPC 2.0 at /mcp exposes the full tool set; /mcp/readonly gives untrusted agents a sandbox they can read but never change.',
    specs: ['POST /mcp', 'POST /mcp/readonly', 'JSON-RPC 2.0'],
    Demo: ConnectDemo,
  },
  {
    n: '02',
    kicker: 'Lease',
    title: 'Hand out an hour, not a key.',
    body: 'pkg/agentlease mints HMAC-SHA256 capability tokens scoped to refs/heads/agent/*. They expire on their own after sixty minutes — nothing to rotate, nothing that stays dangerous for long.',
    specs: ['HMAC-SHA256', 'ttl 1h', 'refs/heads/agent/*'],
    Demo: LeaseDemo,
  },
  {
    n: '03',
    kicker: 'Push',
    title: 'Push under lease. Never to main.',
    body: 'Smart-HTTP on :8080 checks every ref update against the agent\'s capability lease, while the embedded SSH server on :2222 provides key-based developer access. Zero cgo, no external database — and production branches stay out of reach.',
    specs: ['smart-http :8080', 'ssh :2222', 'lease guard'],
    Demo: PushDemo,
  },
  {
    n: '04',
    kicker: 'Review',
    title: 'Merge what survives review.',
    body: 'internal/agentreviewer parses the AST, hunts for leaked secrets and inspects coverage, then performs a policy-gated three-way merge — or hands the decision to a human.',
    specs: ['static AST', 'secret scan', 'coverage gate'],
    Demo: ReviewDemo,
  },
]

function InlineDemo({ Demo }: { Demo: Chapter['Demo'] }) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.35 })
  return (
    <div ref={ref} className="mt-8 flex min-h-[480px] flex-col lg:hidden [&>*]:flex-1">
      <Demo active={inView} />
    </div>
  )
}

export function Workflow() {
  const [active, setActive] = useState(0)
  const stepRefs = useRef<(HTMLElement | null)[]>([])
  const [panelRef, panelInView] = useInView<HTMLDivElement>({ threshold: 0.2 })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step))
        }
      },
      { rootMargin: '-48% 0px -48% 0px' },
    )
    for (const element of stepRefs.current) if (element) observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="workflow" aria-labelledby="workflow-title" className="mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-40">
      <div className="grid gap-6 md:grid-cols-12">
        <Reveal className="md:col-span-3">
          <SectionLabel index="06">Workflow</SectionLabel>
        </Reveal>
        <RevealLines
          id="workflow-title"
          className="type-lg md:col-span-9"
          lines={[
            'Four moves from',
            <>
              prompt to <span className="type-serif">production.</span>
            </>,
          ]}
        />
      </div>

      <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12 lg:gap-6">
        <ol className="lg:col-span-5">
          {CHAPTERS.map((chapter, index) => (
            <li
              key={chapter.n}
              ref={(element) => {
                stepRefs.current[index] = element
              }}
              data-step={index}
              className={`border-t border-ink/15 py-10 transition-opacity duration-500 ease-out-quart lg:flex lg:min-h-[72vh] lg:flex-col lg:justify-center lg:py-16 ${
                active === index ? 'lg:opacity-100' : 'lg:opacity-30'
              }`}
            >
              <Reveal>
                <p className="flex items-baseline gap-4">
                  <span className="text-[64px] font-semibold leading-[0.8] tracking-[-0.06em] [font-stretch:80%] md:text-[88px]">
                    {chapter.n}
                  </span>
                  <span className="type-label text-mute">{chapter.kicker}</span>
                </p>
                <h3 className="mt-6 max-w-[16ch] text-[30px] font-semibold leading-[1] tracking-[-0.035em] md:text-[40px]">
                  {chapter.title}
                </h3>
                <p className="mt-5 max-w-[44ch] text-[16px] leading-[1.55] text-mute md:text-[17px]">{chapter.body}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {chapter.specs.map((spec) => (
                    <li key={spec} className="rounded-full border border-ink/15 px-3 py-1 font-mono text-[12px]">
                      {spec}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <InlineDemo Demo={chapter.Demo} />
            </li>
          ))}
        </ol>

        <div className="hidden lg:col-span-7 lg:block">
          <div ref={panelRef} className="sticky top-24 h-[calc(100vh-8rem)] max-h-[640px] min-h-[520px]">
            <div data-flat-panel className="relative h-full rounded-[26px] bg-ink p-3">
              <div className="absolute left-6 top-[-14px] z-10 flex gap-1.5">
                {CHAPTERS.map((chapter, index) => (
                  <span
                    key={chapter.n}
                    className={`rounded-full px-3 py-1 font-mono text-[11px] transition-colors duration-300 ${
                      active === index ? 'bg-signal text-on-signal' : 'bg-paper-2 text-mute'
                    }`}
                  >
                    {chapter.n} {chapter.kicker}
                  </span>
                ))}
              </div>
              {CHAPTERS.map(({ n, Demo }, index) => (
                <div
                  key={n}
                  aria-hidden={active !== index}
                  inert={active !== index}
                  className={`absolute inset-3 transition-[opacity,transform] duration-500 ease-out-expo ${
                    active === index ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
                  }`}
                >
                  <Demo active={panelInView && active === index} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
