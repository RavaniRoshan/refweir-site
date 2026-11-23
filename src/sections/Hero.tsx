import { Reveal, RevealLines } from '../lib/motion'
import { ButtonLink, CopyCommand, StatusDot } from '../components/ui'
import { AgentMark } from '../components/logos'
import { GlyphBackground } from '../components/ui/backgrounds-glyph'

const STREAM: { ref: string; note: string; tone: 'ok' | 'bad' | 'signal' | 'idle' }[] = [
  { ref: 'refs/heads/agent/claude/fix-retry-backoff', note: 'accepted · ssh :2222', tone: 'ok' },
  { ref: 'refs/heads/main', note: 'rejected · outside lease', tone: 'bad' },
  { ref: 'refs/heads/agent/codex/bump-go-toolchain', note: 'accepted · http :8080', tone: 'ok' },
  { ref: '/mcp/readonly · cline', note: 'read-only sandbox', tone: 'idle' },
  { ref: 'refs/heads/agent/cursor/split-ledger', note: 'review · 4/4 gates', tone: 'ok' },
  { ref: 'lease_91bd', note: 'expired after 60:00', tone: 'idle' },
  { ref: 'PR #142', note: 'merged · three-way', tone: 'signal' },
]

const AGENTS = ['Claude Code', 'Codex', 'Cline', 'Cursor', 'Any MCP client']

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden pt-28 md:pt-36">
      <GlyphBackground
        shapeColor="#ff5b1f"
        fontSize={10}
        className="absolute inset-0"
      />
      <div className="pointer-events-none relative mx-auto max-w-[1440px] px-5 md:px-10">
        <RevealLines
          as="h1"
          id="hero-title"
          className="type-xl mt-10 md:mt-16"
          delay={120}
          stagger={110}
          lineClassNames={['', 'md:pl-[14vw]', 'md:text-right']}
          lines={[
            'The Git forge',
            <>
              built for <span className="type-serif pr-[0.06em]">agents,</span>
            </>,
            'kept by humans.',
          ]}
        />

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:gap-6">
          <Reveal delay={420} className="md:col-span-6 lg:col-span-4">
            <p className="max-w-[34ch] text-[17px] leading-[1.5] text-ink/80 md:text-[19px]">
              Refweir is a self-hosted forge engineered from first principles for Claude Code, Codex, Cline and
              Cursor — and for the engineering teams that ship alongside them.
            </p>
          </Reveal>

          <Reveal delay={500} className="md:col-span-4 md:col-start-9 lg:col-span-2 lg:col-start-6">
            <p className="type-label text-mute">Works with</p>
            <ul className="mt-3 space-y-1.5 text-[15px]">
              {AGENTS.map((agent) => (
                <li key={agent} className="flex items-center gap-2">
                  <AgentMark name={agent} className="size-4 shrink-0 text-ink/70" />
                  <span className="truncate">{agent}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={580} className="pointer-events-auto flex min-w-0 flex-col gap-3 md:col-span-8 lg:col-span-4 lg:col-start-9">
            <div className="flex flex-wrap gap-2">
              <ButtonLink href="https://demo.refweir.dev" variant="ink">
                Try the live demo
              </ButtonLink>
              <ButtonLink href="/docs" variant="outline">
                Read the docs
              </ButtonLink>
            </div>
            <CopyCommand
              lines={[
                'curl -fsSL https://raw.githubusercontent.com/RavaniRoshan/refweir/main/scripts/install.sh | bash',
                'refweird bootstrap --email you@example.com --namespace acme --data-dir ./data',
                'refweird',
              ]}
            />
            <p className="type-label text-mute">One binary · :8080 http · :2222 ssh</p>
          </Reveal>
        </div>
      </div>

      <Reveal delay={650} className="marquee-host relative mt-16 border-y border-ink/15 py-4 md:mt-24">
        <div className="overflow-hidden">
          <ul aria-label="Recent ref activity" className="marquee flex w-max items-center" style={{ ['--marquee-duration' as string]: '60s' }}>
            {[...STREAM, ...STREAM].map((item, index) => (
              <li
                key={index}
                aria-hidden={index >= STREAM.length ? true : undefined}
                className="flex shrink-0 items-center gap-3 px-6 font-mono text-[13px]"
              >
                <StatusDot tone={item.tone} />
                <span>{item.ref}</span>
                <span className="text-mute">{item.note}</span>
                <span aria-hidden="true" className="ml-3 text-ink/25">
                  /
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  )
}
