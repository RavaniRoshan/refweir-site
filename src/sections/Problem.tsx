import type { CSSProperties } from 'react'
import { Reveal, RevealLines, useInView, useParallax } from '../lib/motion'
import { SectionLabel } from '../components/ui'
import { brandPathFor } from '../components/logos'

const WEIR_PHOTO =
  'https://images.unsplash.com/photo-1601894097392-9ad3d8c95bc5?q=80&w=2400&h=1400&auto=format&fit=crop'

const CONTRAST = [
  { aspect: 'Interface', then: 'Buttons in a browser', now: 'MCP over JSON-RPC 2.0' },
  { aspect: 'Credential', then: "A human's token, borrowed", now: 'A lease that expires in an hour' },
  { aspect: 'Reach', then: 'Everything that human can touch', now: 'refs/heads/agent/* — nothing else' },
  { aspect: 'Review', then: 'Whoever has time', now: 'An agent first, then a human' },
]

const SOURCES = [
  { name: 'Claude Code', y: 70 },
  { name: 'Codex', y: 150 },
  { name: 'Cline', y: 230 },
  { name: 'Cursor', y: 310 },
]
const GATES = [130, 170, 210, 250]

const NOTES = [
  { n: '01', title: 'A lease, not a key', text: 'Each agent receives an HMAC-signed capability that lapses after an hour.' },
  { n: '02', title: 'A namespace, not a repo', text: 'Leases only reach refs/heads/agent/*. Main is simply out of scope.' },
  { n: '03', title: 'A review, not a hope', text: 'Only work that passes the review agent crosses into production.' },
]

function drawStyle(visible: boolean, delay: number): CSSProperties {
  return {
    strokeDasharray: 1,
    strokeDashoffset: visible ? 0 : 1,
    transition: `stroke-dashoffset 1400ms var(--ease-out-expo) ${delay}ms`,
  }
}

function fadeStyle(visible: boolean, delay: number): CSSProperties {
  return { opacity: visible ? 1 : 0, transition: `opacity 700ms ease ${delay}ms` }
}

function FlowDiagram() {
  const [ref, inView] = useInView<HTMLDivElement>({ once: true, threshold: 0.3 })
  return (
    <div ref={ref} className="-mx-5 overflow-x-auto px-5 md:mx-0 md:overflow-visible md:px-0">
      <svg
        viewBox="0 0 860 400"
        className="w-full min-w-[680px] font-mono"
        fill="none"
        role="img"
        aria-label="Four agents — Claude Code, Codex, Cline and Cursor — flow into the agentlease weir, which only admits refs under refs/heads/agent/*. A direct push to main is rejected. Admitted work passes through the review agent before reaching refs/heads/main."
      >
        {SOURCES.map((source, index) => {
          const gate = GATES[index]
          const path = `M162 ${source.y}C300 ${source.y} 310 ${gate} 440 ${gate}`
          return (
            <g key={source.name}>
              <g style={fadeStyle(inView, index * 90)}>
                <rect x="10" y={source.y - 18} width="152" height="36" rx="18" fill="#20201c" stroke="rgb(255 255 255 / 0.12)" />
                {(() => {
                  const d = brandPathFor(source.name)
                  return d ? (
                    <g transform={`translate(23 ${source.y - 8.5}) scale(0.72)`}>
                      <path d={d} fill="#ecebe5" />
                    </g>
                  ) : (
                    <circle cx="32" cy={source.y} r="4" fill="#8fdc91" />
                  )
                })()}
                <text x="46" y={source.y + 4.5} fill="#ecebe5" fontSize="13">
                  {source.name}
                </text>
              </g>
              <path d={path} pathLength={1} stroke="currentColor" strokeOpacity="0.18" strokeWidth="1.5" style={drawStyle(inView, 200 + index * 110)} />
              <path
                d={path}
                className="flow"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="2 14"
                style={fadeStyle(inView, 1200 + index * 110)}
              />
            </g>
          )
        })}

        {/* Rejected attempt to bypass the weir */}
        <g style={fadeStyle(inView, 1500)}>
          <path d="M162 70C290 70 330 34 436 34" stroke="#ff6b57" strokeWidth="1.5" strokeDasharray="4 5" />
          <circle cx="448" cy="34" r="10" fill="#161614" stroke="#ff6b57" strokeWidth="1.5" />
          <path d="m443.5 29.5 9 9m0-9-9 9" stroke="#ff6b57" strokeWidth="1.6" strokeLinecap="round" />
          <text x="468" y="38.5" fill="#ff6b57" fontSize="12">
            push → main · rejected
          </text>
        </g>

        {/* The weir */}
        <g style={fadeStyle(inView, 500)}>
          <rect x="440" y="80" width="20" height="220" rx="4" fill="#ff5b1f" />
          <text x="450" y="330" fill="#ff5b1f" fontSize="12" textAnchor="middle">
            agentlease
          </text>
          <text x="450" y="350" fill="currentColor" opacity="0.62" fontSize="11" textAnchor="middle">
            refs/heads/agent/*
          </text>
        </g>

        {GATES.map((gate, index) => {
          const path = `M460 ${gate}C520 ${gate} 520 190 566 190`
          return (
            <g key={gate}>
              <path d={path} pathLength={1} stroke="rgb(255 91 31 / 0.35)" strokeWidth="1.5" style={drawStyle(inView, 900 + index * 90)} />
              <path
                d={path}
                className="flow"
                stroke="#ff5b1f"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="2 14"
                style={fadeStyle(inView, 1700 + index * 90)}
              />
            </g>
          )
        })}

        <g style={fadeStyle(inView, 1100)}>
          <circle cx="600" cy="190" r="34" fill="#161614" stroke="rgb(236 235 229 / 0.35)" strokeWidth="1.5" />
          <text x="600" y="194.5" fill="#ecebe5" fontSize="12" textAnchor="middle">
            review
          </text>
          <text x="600" y="250" fill="currentColor" opacity="0.62" fontSize="11" textAnchor="middle">
            agentreviewer
          </text>
        </g>

        <path d="M634 190H836" pathLength={1} stroke="currentColor" strokeWidth="2" style={drawStyle(inView, 1400)} />
        <path
          d="M634 190H836"
          className="flow"
          stroke="#ff5b1f"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="2 14"
          style={fadeStyle(inView, 2000)}
        />
        <g style={fadeStyle(inView, 1700)}>
          <path d="m828 183 9 7-9 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {[690, 750].map((x) => (
            <circle key={x} cx={x} cy="190" r="5" fill="currentColor" />
          ))}
          <text x="836" y="168" fill="currentColor" fontSize="13" textAnchor="end">
            refs/heads/main
          </text>
          <text x="836" y="220" fill="currentColor" opacity="0.62" fontSize="11" textAnchor="end">
            three-way merge
          </text>
        </g>
      </svg>
    </div>
  )
}

export function Problem() {
  const photoRef = useParallax<HTMLImageElement>(50)

  return (
    <section id="why" aria-labelledby="why-title" className="px-2 md:px-3">
      <div className="relative h-[78vh] min-h-[520px] overflow-hidden rounded-t-[28px] bg-ink md:rounded-t-[40px]">
        <img
          ref={photoRef}
          src={WEIR_PHOTO}
          alt="Ballpoint pen crosshatch drawing of storm clouds on cream paper"
          width={2200}
          height={1400}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full scale-[1.14] object-cover"
        />
        <div className="relative flex h-full flex-col justify-between p-5 text-paper md:p-10">
          <div className="flex items-start justify-between gap-6">
            <span className="rounded-full bg-ink px-3 py-1.5">
              <SectionLabel index="05" tone="photo">
                Why Refweir
              </SectionLabel>
            </span>
            <span className="type-label rounded-full bg-ink px-3 py-1.5 text-paper">
              Fig. 5 — A weir
            </span>
          </div>
          <Reveal className="max-w-[660px] rounded-[18px] bg-sheet p-6 text-ink shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)] md:p-8">
            <p className="flex items-baseline gap-4">
              <span className="type-serif text-[56px] leading-none md:text-[88px]">weir</span>
              <span className="font-mono text-[13px] text-mute">/wɪə/ · noun</span>
            </p>
            <p className="mt-4 text-[21px] leading-[1.3] tracking-[-0.02em] md:text-[28px]">
              A low barrier built across a river to regulate its flow — without stopping it.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="rounded-b-[28px] bg-ink text-paper md:rounded-b-[40px]">
        <div className="mx-auto max-w-[1440px] px-5 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24">
          <RevealLines
            id="why-title"
            className="type-lg"
            lines={[
              'Forges were built for',
              'people clicking buttons.',
              'Your newest contributors',
              <>
                don&rsquo;t have <span className="type-serif text-signal">hands.</span>
              </>,
            ]}
            lineClassNames={['', '', 'text-smoke', 'text-smoke']}
          />

          <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-6">
            <Reveal as="p" className="text-[17px] leading-[1.55] text-paper/75 md:col-span-4 md:text-[18px]">
              Traditional Git platforms were designed more than fifteen years ago for developers in a web browser. Agents
              arrive with borrowed tokens, unlimited reach and no notion of a boundary. Refweir starts from the opposite
              premise: the agent is a first-class citizen, and the boundary is the product.
            </Reveal>

            <div className="md:col-span-8 md:col-start-5" role="table" aria-label="Traditional forges compared with Refweir">
              <div role="row" className="type-label grid grid-cols-2 gap-4 border-b border-white/15 pb-3 text-smoke md:grid-cols-[140px_1fr_1fr]">
                <span role="columnheader" className="hidden md:block">
                  <span className="sr-only">Aspect</span>
                </span>
                <span role="columnheader">Then — the forge for people</span>
                <span role="columnheader" className="text-signal">
                  Now — Refweir
                </span>
              </div>
              {CONTRAST.map((row, index) => (
                <Reveal
                  key={row.aspect}
                  role="row"
                  delay={index * 90}
                  className="grid grid-cols-2 items-baseline gap-x-4 gap-y-2 border-b border-white/10 py-5 md:grid-cols-[140px_1fr_1fr]"
                >
                  <span role="rowheader" className="type-label col-span-2 text-smoke md:col-span-1">
                    {row.aspect}
                  </span>
                  <span role="cell" className="text-[16px] text-smoke line-through decoration-white/20 md:text-[20px]">
                    {row.then}
                  </span>
                  <span role="cell" className="text-[16px] font-medium tracking-[-0.01em] md:text-[20px]">
                    {row.now}
                  </span>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal className="mt-20 border-t border-white/10 pt-12 md:mt-28 md:pt-16">
            <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
              <p className="type-label text-smoke">Fig. 6 — How refs flow through Refweir</p>
              <p className="type-label text-smoke md:hidden">Scroll →</p>
            </div>
            <FlowDiagram />
            <div className="mt-10 grid gap-6 border-t border-white/10 pt-8 md:grid-cols-3">
              {NOTES.map((note, index) => (
                <Reveal key={note.n} delay={index * 100}>
                  <p className="font-mono text-[12px] text-signal">{note.n}</p>
                  <p className="mt-2 text-[20px] font-semibold tracking-[-0.02em]">{note.title}</p>
                  <p className="mt-2 max-w-[34ch] text-[15px] leading-[1.5] text-smoke">{note.text}</p>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
