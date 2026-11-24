import { useEffect, useState, type CSSProperties } from 'react'
import { Reveal, RevealLines, formatClock, useInView, usePrefersReducedMotion, useSequence } from '../lib/motion'
import { CheckIcon, CrossIcon, LogoMark, SectionLabel, StatusDot } from '../components/ui'
import { AgentMark } from '../components/logos'

type Step = {
  label: string
  title: string
  detail: string
  time: string
  blocked?: boolean
}

const STEPS: Step[] = [
  { label: 'Connect', title: 'MCP session opened', detail: 'POST /mcp · initialize → tools/list', time: '09:41:02' },
  {
    label: 'Lease',
    title: 'Capability lease issued',
    detail: 'HMAC-SHA256 · refs/heads/agent/claude/* · ttl 1h',
    time: '09:41:03',
  },
  { label: 'Push', title: 'Pushed 3 commits', detail: 'ssh :2222 → agent/claude/fix-retry-backoff', time: '09:41:19' },
  {
    label: 'Guard',
    title: 'Push to main rejected',
    detail: 'refs/heads/main is outside the lease scope',
    time: '09:41:21',
    blocked: true,
  },
  { label: 'Open PR', title: 'Opened pull request #142', detail: 'tools/call · pull_request.create', time: '09:41:34' },
  { label: 'Review', title: 'Review agent passed 4 of 4 gates', detail: 'internal/agentreviewer', time: '09:42:10' },
  { label: 'Merge', title: 'Three-way merge into main', detail: 'merge 9c1e04a · lease revoked', time: '09:42:12' },
]
const DURATIONS = [2300, 2400, 2500, 2700, 2300, 3400, 3800] as const
const GATES = ['AST analysis', 'Secret scan', 'Coverage 87%', 'Policy']
const LEASE_SECONDS = 3600

const SIDEBAR = [
  { label: 'Code', meta: '' },
  { label: 'Pull requests', meta: '3' },
  { label: 'Agents', meta: '1 live', active: true },
  { label: 'Leases', meta: '1' },
  { label: 'Review', meta: '' },
  { label: 'Settings', meta: '' },
]

const AGENTS: { name: string; state: string; tone: 'ok' | 'idle' }[] = [
  { name: 'claude-code', state: 'live', tone: 'ok' },
  { name: 'codex', state: 'idle', tone: 'idle' },
  { name: 'cline', state: 'read-only', tone: 'idle' },
  { name: 'swe-agent', state: 'idle', tone: 'idle' },
]

export function ProductDemo() {
  const reduced = usePrefersReducedMotion()
  const [frameRef, inView] = useInView<HTMLDivElement>({ threshold: 0.2 })
  const [paused, setPaused] = useState(false)
  const playing = inView && !paused && !reduced
  const [step, setStep] = useSequence(STEPS.length, DURATIONS, playing)

  useEffect(() => {
    if (reduced) setStep(STEPS.length - 1)
  }, [reduced, setStep])

  // Simulated lease clock: four lease-seconds pass per real second.
  const [ttl, setTtl] = useState(LEASE_SECONDS)
  const leaseLive = step >= 1 && step < STEPS.length - 1
  useEffect(() => {
    if (step <= 1) setTtl(LEASE_SECONDS)
  }, [step])
  useEffect(() => {
    if (!playing || !leaseLive) return
    const timer = window.setInterval(() => setTtl((value) => value - 1), 250)
    return () => window.clearInterval(timer)
  }, [playing, leaseLive])

  return (
    <section id="product" aria-labelledby="product-title" className="px-2 md:px-3">
      <div className="overflow-hidden rounded-[28px] bg-ink text-paper md:rounded-[40px]">
        <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-20 md:px-10 md:pb-10 md:pt-28">
          <div className="grid gap-6 md:grid-cols-12">
            <Reveal className="md:col-span-3">
              <SectionLabel index="02" tone="dark">
                Live session
              </SectionLabel>
            </Reveal>
            <div className="md:col-span-9">
              <RevealLines
                id="product-title"
                className="type-lg"
                lines={[
                  'Watch an agent work',
                  <>
                    inside <span className="type-serif text-signal">the lines.</span>
                  </>,
                ]}
              />
              <Reveal
                as="p"
                delay={220}
                className="mt-8 max-w-[52ch] text-[17px] leading-[1.55] text-smoke md:text-[18px]"
              >
                One session, start to finish. Claude Code connects over MCP, receives an expiring lease, pushes to its
                own namespace, is turned away from main, and lands its work through the review agent.
              </Reveal>
            </div>
          </div>

          <Reveal delay={160} as="figure" className="mt-14 md:mt-20">
            <div
              ref={frameRef}
              className="overflow-hidden rounded-[18px] border border-white/10 bg-ink-2 shadow-[0_50px_140px_-60px_rgba(0,0,0,0.55)] md:rounded-[22px]"
            >
              <TopBar paused={paused} onToggle={() => setPaused((value) => !value)} reduced={reduced} />

              <div
                className="grid md:grid-cols-[minmax(0,1fr)_320px] lg:grid-cols-[208px_minmax(0,1fr)_356px]"
                aria-hidden="true"
              >
                <Sidebar />
                <Timeline step={step} />
                <div className="space-y-3 border-t border-white/10 p-4 md:border-l md:border-t-0 md:p-5">
                  <LeaseCard step={step} ttl={ttl} />
                  <RefGraph step={step} />
                </div>
              </div>

              <Scrubber step={step} playing={playing} onSelect={setStep} />
            </div>
            <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-3 text-[13px] text-smoke">
              <span>
                <span className="type-label mr-2 text-paper">Fig. 2</span>A complete agent session — connect, lease,
                push, guard, review, merge.
              </span>
              <span className="type-label">
                Step {step + 1}: {STEPS[step].title}
              </span>
            </figcaption>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function TopBar({ paused, onToggle, reduced }: { paused: boolean; onToggle: () => void; reduced: boolean }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-3 text-[13px]">
      <LogoMark className="size-4" />
      <span className="text-smoke">acme</span>
      <span className="text-white/25">/</span>
      <span className="font-medium">payments-api</span>
      <span className="ml-1 hidden rounded-full border border-white/10 px-2 py-0.5 font-mono text-[11px] text-smoke sm:inline">
        main
      </span>
      <div className="ml-auto flex items-center gap-2">
        <span className="hidden items-center gap-2 rounded-full bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-smoke md:inline-flex">
          <StatusDot live /> http :8080
        </span>
        <span className="hidden items-center gap-2 rounded-full bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-smoke md:inline-flex">
          <StatusDot live /> ssh :2222
        </span>
        {!reduced && (
          <button
            type="button"
            onClick={onToggle}
            aria-pressed={paused}
            className="rounded-full border border-white/15 px-3 py-1 text-[12px] transition-colors duration-200 hover:bg-paper hover:text-ink"
          >
            {paused ? 'Play demo' : 'Pause demo'}
          </button>
        )}
      </div>
    </div>
  )
}

function Sidebar() {
  return (
    <aside className="hidden border-r border-white/10 p-3 lg:block">
      <ul className="space-y-0.5 text-[13px]">
        {SIDEBAR.map((item) => (
          <li
            key={item.label}
            className={`flex items-center justify-between rounded-lg px-3 py-2 ${
              item.active ? 'bg-white/[0.07] text-paper' : 'text-smoke'
            }`}
          >
            {item.label}
            {item.meta && <span className="font-mono text-[11px] text-smoke">{item.meta}</span>}
          </li>
        ))}
      </ul>
      <p className="type-label mt-6 px-3 text-smoke">Agents</p>
      <ul className="mt-2 space-y-0.5 font-mono text-[12px]">
        {AGENTS.map((agent) => (
          <li key={agent.name} className="flex items-center gap-2.5 px-3 py-1.5">
            <AgentMark name={agent.name} className="size-3.5 shrink-0" />
            <span className={agent.state === 'live' ? 'text-paper' : 'text-smoke'}>{agent.name}</span>
            <span className="ml-auto text-[11px] text-smoke">{agent.state}</span>
          </li>
        ))}
      </ul>
    </aside>
  )
}

function Timeline({ step }: { step: number }) {
  return (
    <div className="min-w-0 p-4 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="type-label text-smoke">Session s_8f21 · claude-code</p>
          <p className="mt-1.5 truncate text-[17px] font-semibold tracking-[-0.02em] md:text-[19px]">
            fix(retry): bounded exponential backoff
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-white/[0.05] px-2.5 py-1 font-mono text-[11px] tabular-nums text-smoke">
          {String(step + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
        </span>
      </div>
      <ol className="mt-5 space-y-1.5">
        {STEPS.map((item, index) => (
          <EventRow
            key={item.label}
            item={item}
            state={index < step ? 'done' : index === step ? 'current' : 'future'}
            isReview={item.label === 'Review'}
          />
        ))}
      </ol>
    </div>
  )
}

type RowState = 'done' | 'current' | 'future'

function EventRow({ item, state, isReview }: { item: Step; state: RowState; isReview: boolean }) {
  const surface =
    state === 'future'
      ? 'translate-y-1 border-transparent opacity-[0.18]'
      : state === 'current'
        ? item.blocked
          ? 'border-bad/40 bg-bad/[0.07]'
          : 'border-signal/40 bg-white/[0.04]'
        : 'border-transparent opacity-60'

  return (
    <li
      className={`flex gap-3 rounded-xl border px-3 py-2.5 transition-[opacity,transform,background-color,border-color] duration-500 ease-out-expo ${surface}`}
    >
      <StepIcon state={state} blocked={!!item.blocked} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className={`truncate text-[14px] font-medium ${item.blocked && state !== 'future' ? 'text-bad' : ''}`}>
            {item.title}
          </p>
          <time className="shrink-0 font-mono text-[11px] tabular-nums text-smoke">{item.time}</time>
        </div>
        <p className="mt-0.5 truncate font-mono text-[12px] text-smoke">{item.detail}</p>
        {isReview && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {GATES.map((gate, index) => (
              <span
                key={`${gate}-${state}`}
                className="rise-in inline-flex items-center gap-1 rounded-full bg-ok/10 px-2 py-0.5 font-mono text-[11px] text-ok"
                style={{ '--d': state === 'current' ? `${300 + index * 420}ms` : '0ms' } as CSSProperties}
              >
                <CheckIcon className="size-3" />
                {gate}
              </span>
            ))}
          </div>
        )}
      </div>
    </li>
  )
}

function StepIcon({ state, blocked }: { state: RowState; blocked: boolean }) {
  if (blocked && state !== 'future') {
    return (
      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-bad/15 text-bad">
        <CrossIcon className="size-3" />
      </span>
    )
  }
  if (state === 'future') {
    return <span className="mt-0.5 size-5 shrink-0 rounded-full border border-dashed border-white/40" />
  }
  if (state === 'current') {
    return (
      <span key="current" className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
        <span className="spin fade-out-late absolute inset-0 rounded-full border-2 border-signal border-t-transparent" />
        <span className="rise-in-late grid size-5 place-items-center rounded-full bg-signal text-on-signal">
          <CheckIcon className="size-3" />
        </span>
      </span>
    )
  }
  return (
    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ok/15 text-ok">
      <CheckIcon className="size-3" />
    </span>
  )
}

function LeaseCard({ step, ttl }: { step: number; ttl: number }) {
  const state = step < 1 ? 'pending' : step >= STEPS.length - 1 ? 'revoked' : 'active'
  const badge = {
    pending: 'bg-white/[0.06] text-smoke',
    active: 'bg-ok/15 text-ok',
    revoked: 'bg-white/[0.06] text-smoke',
  }[state]
  const progress = state === 'active' ? ttl / LEASE_SECONDS : state === 'pending' ? 1 : 0

  return (
    <div
      className={`rounded-xl border border-white/10 bg-ink-3/70 p-4 transition-opacity duration-500 ${
        state === 'pending' ? 'opacity-45' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="type-label text-smoke">Capability lease</p>
        <span className={`rounded-full px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider ${badge}`}>{state}</span>
      </div>
      <p
        className={`mt-3 font-mono text-[15px] transition-colors duration-500 ${
          state === 'revoked' ? 'text-smoke line-through decoration-smoke/60' : 'text-paper'
        }`}
      >
        lease_7f3a·c21e
      </p>
      <dl className="mt-3 grid grid-cols-[64px_minmax(0,1fr)] gap-y-1.5 font-mono text-[12px]">
        <dt className="text-smoke">scope</dt>
        <dd className="truncate">refs/heads/agent/claude/*</dd>
        <dt className="text-smoke">algo</dt>
        <dd>HMAC-SHA256</dd>
        <dt className="text-smoke">caps</dt>
        <dd>read · push · pr.create</dd>
        <dt className="text-smoke">expires</dt>
        <dd className="tabular-nums">
          {state === 'pending' ? 'awaiting request' : state === 'revoked' ? 'revoked at merge' : `${formatClock(ttl)} left`}
        </dd>
      </dl>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full origin-left bg-signal transition-transform duration-300 ease-linear"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </div>
  )
}

const draw = (visible: boolean, delay = 0): CSSProperties => ({
  strokeDasharray: 1,
  strokeDashoffset: visible ? 0 : 1,
  transition: `stroke-dashoffset 900ms var(--ease-out-expo) ${delay}ms`,
})

const pop = (visible: boolean, delay = 0): CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? 'none' : 'scale(0.4)',
  transformBox: 'fill-box',
  transformOrigin: 'center',
  transition: `opacity 400ms ease ${delay}ms, transform 600ms var(--ease-out-expo) ${delay}ms`,
})

function RefGraph({ step }: { step: number }) {
  const pushed = step >= 2
  const rejected = step >= 3
  const opened = step >= 4
  const reviewing = step === 5
  const merged = step >= 6

  return (
    <div className="rounded-xl border border-white/10 bg-ink-3/70 p-4">
      <div className="flex items-center justify-between">
        <p className="type-label text-smoke">Refs</p>
        <span className="font-mono text-[11px] text-smoke">
          {merged ? 'main ← 9c1e04a' : opened ? 'PR #142 open' : pushed ? '+3 commits' : 'main @ 4be1d20'}
        </span>
      </div>
      <svg viewBox="0 0 320 150" className="mt-3 w-full font-mono" fill="none" aria-hidden="true">
        <path d="M8 112H312" stroke="rgb(236 235 229 / 0.3)" strokeWidth="1.5" />
        <circle cx="30" cy="112" r="4" fill="currentColor" />
        <circle cx="70" cy="112" r="4" fill="currentColor" />
        <text x="8" y="136" fill="currentColor" opacity="0.62" fontSize="10">
          main
        </text>

        <path d="M70 112C92 112 92 52 118 52H232" pathLength={1} stroke="#ff5b1f" strokeWidth="1.5" style={draw(pushed)} />
        <text x="118" y="36" fill="currentColor" opacity="0.62" fontSize="10" style={pop(pushed, 200)}>
          agent/claude/fix-retry-backoff
        </text>
        {[144, 176, 208].map((x, index) => (
          <circle
            key={x}
            cx={x}
            cy="52"
            r="4"
            fill="#161614"
            stroke="#ff5b1f"
            strokeWidth="1.5"
            style={pop(pushed, 350 + index * 140)}
          />
        ))}

        <g style={{ opacity: rejected ? (step === 3 ? 1 : 0.35) : 0, transition: 'opacity 400ms ease' }}>
          <path d="M208 60V102" stroke="#ff6b57" strokeWidth="1.5" strokeDasharray="3 4" />
          <circle cx="208" cy="112" r="7" fill="#161614" stroke="#ff6b57" strokeWidth="1.5" />
          <path d="m204.5 108.5 7 7m0-7-7 7" stroke="#ff6b57" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        <g style={pop(opened)}>
          <rect x="240" y="43" width="44" height="18" rx="9" fill="rgb(255 91 31 / 0.15)" />
          <text x="262" y="55.5" fill="#ff5b1f" fontSize="10" textAnchor="middle">
            #142
          </text>
        </g>
        {reviewing && (
          <circle
            className="ping"
            cx="232"
            cy="52"
            r="5"
            fill="#ff5b1f"
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          />
        )}

        <path d="M232 52C256 52 258 112 284 112" pathLength={1} stroke="#ff5b1f" strokeWidth="1.5" style={draw(merged)} />
        <circle cx="284" cy="112" r="6" fill="#ff5b1f" style={pop(merged, 500)} />
        <text x="284" y="136" fill="#ff5b1f" fontSize="10" textAnchor="middle" style={pop(merged, 600)}>
          merge
        </text>
      </svg>
    </div>
  )
}

function Scrubber({ step, playing, onSelect }: { step: number; playing: boolean; onSelect: (index: number) => void }) {
  return (
    <div className="grid grid-cols-7 border-t border-white/10" role="group" aria-label="Demo steps">
      {STEPS.map((item, index) => (
        <button
          key={item.label}
          type="button"
          onClick={() => onSelect(index)}
          aria-label={`Show step ${index + 1}: ${item.label}`}
          aria-current={index === step ? 'step' : undefined}
          className="relative px-2 pb-3 pt-4 text-left transition-colors duration-200 hover:bg-white/[0.03] md:px-4"
        >
          <span className="absolute inset-x-1 top-0 h-[2px] overflow-hidden bg-white/10 md:inset-x-2">
            {index < step && <span className="absolute inset-0 bg-paper/50" />}
            {index === step && (
              <span
                key={`${step}-${playing}`}
                className={`absolute inset-0 bg-signal ${playing ? 'fill-x' : ''}`}
                style={{ '--fill-duration': `${DURATIONS[index]}ms` } as CSSProperties}
              />
            )}
          </span>
          <span className="font-mono text-[11px] text-smoke">{String(index + 1).padStart(2, '0')}</span>
          <span
            className={`ml-2 hidden text-[12px] transition-colors duration-200 sm:inline ${
              index === step ? 'text-paper' : 'text-smoke'
            }`}
          >
            {item.label}
          </span>
        </button>
      ))}
    </div>
  )
}
