import { useId, useLayoutEffect, useRef, useState } from 'react'
import { Reveal, RevealLines } from '../lib/motion'
import { ButtonLink, CopyCommand, LogoMark, PlusIcon, SectionLabel } from '../components/ui'
import { NAV_LINKS } from '../components/Nav'

const FAQS = [
  {
    q: 'Which agents work with Refweir?',
    a: 'Any agent that speaks MCP or plain Git. Claude Code, Codex, Cline and Cursor connect to /mcp for the full tool set, or to /mcp/readonly for a read-only sandbox. Refweir has no opinion about which model is behind the agent.',
  },
  {
    q: 'What exactly is a capability lease?',
    a: 'A short-lived token minted by pkg/agentlease and signed with HMAC-SHA256. Each lease is scoped to refs under refs/heads/agent/* and expires automatically after one hour, so there are no long-lived credentials sitting in agent configuration files.',
  },
  {
    q: 'Can an agent ever push to main?',
    a: 'Not directly. Every ref update over Smart-HTTP or SSH is checked against the lease, and anything outside its scope is rejected. Work reaches main only through a pull request that passes the review gates you configure.',
  },
  {
    q: 'What does the review agent actually check?',
    a: 'internal/agentreviewer runs static AST analysis, leaked-secret detection and coverage inspection on every pull request, then performs a policy-gated three-way merge. You decide which gates apply and whether a human signs off last.',
  },
  {
    q: 'Do I need OpenSSH, Docker or a database server?',
    a: 'No. Refweir is a single hermetic binary compiled with CGO_ENABLED=0. It embeds the React 19 product UI, a pure-Go SSH server on :2222, Smart-HTTP on :8080, SQLite in WAL mode via modernc.org/sqlite, and a bare Git object store on disk.',
  },
  {
    q: 'How is this different from Cursor Origin?',
    a: 'Cursor Origin is tied to Cursor accounts and proprietary cloud infrastructure. Refweir is vendor-neutral and open source, runs on hardware you own, and works with whichever agents your team prefers.',
  },
  {
    q: 'Is Refweir only for agents?',
    a: 'No. Humans clone, push, review and merge through the same forge and the embedded web UI. Agents are first-class citizens — not the only citizens.',
  },
]

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId()
  return (
    <li className="border-b border-ink/15">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span className="text-[19px] font-medium tracking-[-0.02em] transition-transform duration-300 ease-out-quart group-hover:translate-x-1 md:text-[23px]">
            {q}
          </span>
          <span
            className={`grid size-9 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color,color] duration-300 ease-out-expo ${
              open ? 'rotate-45 border-ink bg-ink text-paper' : 'border-ink/20 group-hover:border-ink'
            }`}
          >
            <PlusIcon />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        className={`grid transition-[grid-template-rows] duration-500 ease-out-expo ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden" inert={!open}>
          <p className="max-w-[62ch] pb-7 text-[16px] leading-[1.6] text-mute md:text-[17px]">{a}</p>
        </div>
      </div>
    </li>
  )
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" aria-labelledby="faq-title" className="mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-40">
      <div className="grid gap-12 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-4">
          <Reveal>
            <SectionLabel index="10">Questions</SectionLabel>
          </Reveal>
          <RevealLines
            id="faq-title"
            className="type-md mt-6 md:sticky md:top-28"
            lines={['Asked,', <span className="type-serif">answered.</span>]}
          />
        </div>
        <Reveal as="ul" delay={120} className="border-t border-ink/15 md:col-span-8">
          {FAQS.map((item, index) => (
            <FaqItem
              key={item.q}
              q={item.q}
              a={item.a}
              open={open === index}
              onToggle={() => setOpen((current) => (current === index ? null : index))}
            />
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export function FinalCta() {
  return (
    <section id="start" aria-labelledby="start-title" className="px-2 pb-2 md:px-3 md:pb-3">
      <div className="overflow-hidden rounded-[28px] bg-ink text-paper md:rounded-[40px]">
        <div className="mx-auto max-w-[1440px] px-5 pt-20 md:px-10 md:pt-28">
          <Reveal>
            <SectionLabel index="11" tone="dark">
              Start
            </SectionLabel>
          </Reveal>
          <RevealLines
            id="start-title"
            className="type-xl mt-10"
            stagger={110}
            lineClassNames={['', 'md:pl-[10vw]', '']}
            lines={['Give your agents', 'a forge of', <>their <span className="type-serif text-signal">own.</span></>]}
          />

          <div className="mt-16 grid gap-10 md:mt-20 md:grid-cols-12 md:gap-6">
            <Reveal as="p" className="max-w-[40ch] text-[17px] leading-[1.55] text-smoke md:col-span-4 md:text-[18px]">
              One binary. Two ports. No accounts. Download it, run it, and point your first agent at /mcp.
            </Reveal>
            <Reveal delay={120} className="flex flex-col gap-3 md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
              <CopyCommand
                lines={[
                  'curl -fsSL https://raw.githubusercontent.com/RavaniRoshan/refweir/main/scripts/install.sh | bash',
                  'refweird bootstrap --email you@example.com --namespace acme --data-dir ./data',
                  'refweird',
                ]}
                tone="dark"
              />
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 font-mono text-[12px] sm:grid-cols-4">
                {[
                  [':8080', 'smart-http'],
                  [':2222', 'ssh'],
                  ['/mcp', 'full tools'],
                  ['/mcp/readonly', 'sandbox'],
                ].map(([value, label]) => (
                  <div key={value} className="bg-ink px-3 py-3">
                    <p className="truncate text-paper">{value}</p>
                    <p className="text-smoke">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <ButtonLink href="https://demo.refweir.dev" variant="signal">
                  Try the live demo
                </ButtonLink>
                <ButtonLink href="/docs" variant="outline-dark">
                  Read the docs
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <Footer />
        </div>
      </div>
    </section>
  )
}

/** Scales a single word so it spans its container exactly. */
function Wordmark() {
  const hostRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLSpanElement>(null)
  const [size, setSize] = useState(200)

  useLayoutEffect(() => {
    const host = hostRef.current
    const word = wordRef.current
    if (!host || !word) return
    const fit = () => {
      const base = 200
      const previous = word.style.fontSize
      word.style.fontSize = `${base}px`
      const natural = word.getBoundingClientRect().width
      word.style.fontSize = previous
      if (natural > 0) setSize((host.clientWidth / natural) * base)
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(host)
    document.fonts?.ready.then(fit)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={hostRef} aria-hidden="true" className="overflow-hidden select-none" style={{ height: size * 0.78 }}>
      <span
        ref={wordRef}
        className="inline-block whitespace-nowrap font-semibold leading-[0.9] tracking-[-0.065em] text-paper [font-stretch:82%]"
        style={{ fontSize: size }}
      >
        refweir
      </span>
    </div>
  )
}

function Footer() {
  return (
    <footer className="mt-24 md:mt-36">
      <Reveal>
        <Wordmark />
      </Reveal>
      <div className="flex flex-col gap-6 border-t border-white/10 py-6 text-[13px] text-smoke md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2.5 text-paper">
          <LogoMark className="size-4" />
          <span className="font-semibold tracking-[-0.02em]">refweir</span>
          <span className="text-smoke">— a Git forge for agents, kept by humans.</span>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <a
                href="https://github.com/RavaniRoshan/refweir"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-paper"
              >
                GitHub
              </a>
            </li>
            <li>
              <a href="/docs" className="transition-colors duration-200 hover:text-paper">
                Docs
              </a>
            </li>
            <li>
              <a
                href="https://github.com/RavaniRoshan/refweir/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-paper"
              >
                Licence (Apache-2.0)
              </a>
            </li>
          </ul>
        </nav>
        <p className="font-mono text-[12px]">Pure Go · CGO_ENABLED=0</p>
      </div>
    </footer>
  )
}
