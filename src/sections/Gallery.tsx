import type { ReactNode } from 'react'
import { Reveal, RevealLines } from '../lib/motion'
import { CheckIcon, SectionLabel } from '../components/ui'

function Artifact({
  fig,
  caption,
  pkg,
  surface,
  className = '',
  delay = 0,
  children,
}: {
  fig: string
  caption: string
  pkg: string
  surface: string
  className?: string
  delay?: number
  children: ReactNode
}) {
  return (
    <Reveal as="figure" delay={delay} className={`group flex min-w-0 flex-col ${className}`}>
      <div
        className={`relative flex-1 overflow-hidden rounded-[20px] transition-transform duration-500 ease-out-expo group-hover:-translate-y-1 ${surface}`}
      >
        <div className="h-full origin-center transition-transform duration-700 ease-out-expo group-hover:scale-[1.012]">
          {children}
        </div>
      </div>
      <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-[13px]">
        <span>
          <span className="type-label mr-2 text-ink">Fig. {fig}</span>
          <span className="text-mute">{caption}</span>
        </span>
        <code className="hidden shrink-0 font-mono text-[11px] text-mute sm:block">{pkg}</code>
      </figcaption>
    </Reveal>
  )
}

const REVIEW_GATES = [
  { name: 'AST analysis', detail: '14 files parsed · no unsafe patterns', result: 'pass' },
  { name: 'Secret scan', detail: '0 findings in diff', result: 'pass' },
  { name: 'Coverage', detail: '87.2% · minimum 80%', result: 'pass' },
  { name: 'Policy', detail: 'agent/* → main · three-way merge', result: 'pass' },
]

function ReviewReport() {
  return (
    <div className="flex h-full flex-col p-5 text-paper md:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="type-label text-smoke">agentreviewer · report</p>
        <span className="rounded-full bg-ok/15 px-2.5 py-1 font-mono text-[11px] text-ok">ready to merge</span>
      </div>
      <p className="mt-6 max-w-[22ch] text-[24px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[34px]">
        PR #142 — bounded exponential backoff
      </p>
      <p className="mt-2 font-mono text-[12px] text-smoke">
        agent/claude/fix-retry-backoff → main · 3 commits · +84 −21
      </p>
      <ul className="mt-7 border-t border-white/10">
        {REVIEW_GATES.map((gate) => (
          <li
            key={gate.name}
            className="grid grid-cols-[20px_minmax(0,1fr)_auto] items-center gap-3 border-b border-white/10 py-3 text-[13px] md:grid-cols-[20px_130px_minmax(0,1fr)_auto]"
          >
            <span className="grid size-5 place-items-center rounded-full bg-ok/15 text-ok">
              <CheckIcon className="size-3" />
            </span>
            <span className="font-medium">{gate.name}</span>
            <span className="hidden truncate font-mono text-[12px] text-smoke md:block">{gate.detail}</span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-ok">{gate.result}</span>
          </li>
        ))}
      </ul>
      <blockquote className="mt-auto pt-7 text-[15px] leading-[1.55] text-paper/80">
        <span className="type-label mb-2 block text-smoke">Summary</span>
        Replaces the unbounded retry loop in <code className="font-mono text-[13px] text-paper">client.go</code> with
        capped exponential backoff (max 30s). Adds six table-driven tests. No public API changes.
      </blockquote>
    </div>
  )
}

function LeaseToken() {
  return (
    <div className="flex h-full flex-col p-5 text-ink md:p-8">
      <p className="type-label">Capability token · pkg/agentlease</p>
      <p className="mt-6 break-all font-mono text-[13px] leading-[1.7] md:text-[14px]">
        <span className="rounded-[3px] bg-ink px-1 py-0.5 text-signal">rwl1</span>
        <span>.</span>
        <span className="underline decoration-ink/40 decoration-1 underline-offset-4">
          eyJzdWIiOiJjbGF1ZGUtY29kZSIsInNjb3BlIjoicmVmcy9oZWFkcy9hZ2VudC9jbGF1ZGUvKiIsImV4cCI6MzYwMH0
        </span>
        <span>.</span>
        <span className="rounded-[3px] bg-ink/12 px-1 py-0.5">9f2c4a1e7b03d58c</span>
      </p>
      <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-ink/20 text-[13px]">
        {[
          ['sub', 'claude-code'],
          ['scope', 'refs/heads/agent/claude/*'],
          ['exp', 'issued + 3600s'],
          ['sig', 'HMAC-SHA256'],
        ].map(([key, value]) => (
          <div key={key} className="bg-signal p-3 text-on-signal">
            <dt className="type-label text-on-signal">{key}</dt>
            <dd className="mt-1 break-all font-mono text-[12px]">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-auto flex items-end justify-between gap-4 pt-8">
        <p className="text-[72px] font-semibold leading-[0.8] tracking-[-0.06em] tabular-nums [font-stretch:80%] md:text-[104px]">
          60:00
        </p>
        <p className="type-label pb-1 text-right">
          Lifetime
          <br />
          then gone
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-ink/25 pt-4 font-mono text-[11px]">
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-[2px] bg-ink" /> version
        </span>
        <span className="flex items-center gap-2">
          <span className="h-px w-3 bg-ink" /> claims
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-[2px] bg-ink/20" /> signature
        </span>
      </div>
    </div>
  )
}

function RejectedPush() {
  return (
    <div className="flex h-full flex-col">
      <pre className="overflow-hidden p-5 font-mono text-[12px] leading-[1.75] text-paper/85 md:p-6">
        <span className="text-smoke">$ </span>git push refweir HEAD:main{'\n'}
        <span className="text-smoke">remote: refweir ▸ lease lease_7f3a{'\n'}</span>
        <span className="text-smoke">remote: scope refs/heads/agent/claude/*{'\n'}</span>
        <span className="text-bad">remote: refs/heads/main is outside{'\n'}remote: your lease{'\n'}</span>
        <span className="text-bad"> ! [remote rejected] HEAD -&gt; main{'\n'}</span>
        <span className="text-smoke">error: failed to push some refs{'\n'}</span>
        <span className="text-smoke">$ </span>
        <span className="caret inline-block h-3.5 w-[7px] translate-y-0.5 bg-paper/70" />
      </pre>
      <div className="mt-auto flex items-center justify-between border-t border-white/10 px-5 py-3 font-mono text-[12px] text-smoke md:px-6">
        <span>exit 1</span>
        <span>checked at the transport</span>
      </div>
    </div>
  )
}

function JsonRpc() {
  const key = 'text-mute'
  const str = 'text-literal'
  return (
    <pre className="h-full overflow-hidden p-5 font-mono text-[12px] leading-[1.7] text-ink md:p-6">
      <span className="type-label text-mute">→ request · /mcp</span>
      {'\n'}
      {'{ '}
      <span className={key}>"method"</span>: <span className={str}>"tools/call"</span>,{'\n'}
      {'  '}
      <span className={key}>"params"</span>: {'{\n    '}
      <span className={key}>"name"</span>: <span className={str}>"pull_request.create"</span>,{'\n    '}
      <span className={key}>"arguments"</span>: {'{\n      '}
      <span className={key}>"head"</span>: <span className={str}>"agent/claude/fix-retry"</span>,{'\n      '}
      <span className={key}>"base"</span>: <span className={str}>"main"</span>
      {'\n  } } }\n\n'}
      <span className="type-label text-mute">← result</span>
      {'\n'}
      {'{ '}
      <span className={key}>"number"</span>: 142, <span className={key}>"state"</span>: <span className={str}>"open"</span>
      {' }'}
    </pre>
  )
}

// Deterministic pseudo-random coverage values per block.
const COVERAGE = Array.from({ length: 60 }, (_, index) => {
  const value = Math.abs(Math.sin((index + 3) * 12.9898) * 43758.5453) % 1
  return index % 13 === 7 ? 0.18 : 0.45 + value * 0.55
})

function CoverageMap() {
  return (
    <div className="flex h-full flex-col p-5 md:p-6">
      <div className="flex items-baseline justify-between">
        <p className="type-label text-mute">Coverage</p>
        <p className="text-[28px] font-semibold leading-none tracking-[-0.04em]">87.2%</p>
      </div>
      <div className="mt-5 grid grid-cols-12 gap-1" aria-hidden="true">
        {COVERAGE.map((value, index) => (
          <span
            key={index}
            className="aspect-square rounded-[3px]"
            style={{
              backgroundColor: value < 0.3 ? '#ff5b1f' : `color-mix(in srgb, currentColor ${(value * 85).toFixed(0)}%, transparent)`,
            }}
          />
        ))}
      </div>
      <ul className="mt-auto space-y-1.5 pt-5 font-mono text-[11px]">
        {[
          ['retry/backoff.go', '96%'],
          ['retry/client.go', '91%'],
          ['retry/jitter.go', '62%'],
        ].map(([file, pct]) => (
          <li key={file} className="flex justify-between gap-3 border-t border-ink/10 pt-1.5">
            <span>{file}</span>
            <span className="text-mute">{pct}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SecretFinding() {
  return (
    <div className="flex h-full flex-col p-5 font-mono text-[12px] text-paper md:p-7">
      <div className="flex items-center justify-between gap-3">
        <span className="text-smoke">config/dev.env</span>
        <span className="rounded-full bg-bad/15 px-2.5 py-1 text-[11px] text-bad">merge held</span>
      </div>
      <div className="mt-5 overflow-hidden rounded-lg leading-[2]">
        <div className="flex gap-4 px-3 text-smoke">
          <span className="w-5 text-right">11</span>
          <span>REGION=eu-west-1</span>
        </div>
        <div className="flex gap-4 bg-bad/15 px-3 text-bad">
          <span className="w-5 text-right">+12</span>
          <span className="truncate">AWS_SECRET_ACCESS_KEY=wJalr••••••••••••EXAMPLE</span>
        </div>
        <div className="flex gap-4 px-3 text-smoke">
          <span className="w-5 text-right">13</span>
          <span>LOG_LEVEL=debug</span>
        </div>
      </div>
      <dl className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-lg bg-white/10 text-[11px]">
        {[
          ['rule', 'aws-secret-key'],
          ['commit', '3f2a9c1'],
          ['author', 'claude-code'],
        ].map(([key, value]) => (
          <div key={key} className="bg-ink px-3 py-2.5">
            <dt className="text-smoke">{key}</dt>
            <dd className="mt-0.5 truncate">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-auto pt-6 font-sans text-[15px] leading-[1.5] text-paper/80">
        Secret detected on line 12. The merge stays held until the key is removed — and rotated.
      </p>
    </div>
  )
}

const LAYERS = [
  { name: 'Product UI', detail: 'React 19 · embedded', width: 0.92 },
  { name: 'MCP', detail: 'JSON-RPC 2.0 · /mcp · /mcp/readonly', width: 0.7 },
  { name: 'Leases', detail: 'pkg/agentlease', width: 0.42 },
  { name: 'Review', detail: 'internal/agentreviewer', width: 0.64 },
  { name: 'Transports', detail: 'Smart-HTTP :8080 · SSH :2222', width: 0.78 },
  { name: 'Metadata', detail: 'SQLite WAL · modernc.org/sqlite', width: 0.56 },
  { name: 'Objects', detail: 'bare Git object store', width: 0.86 },
]

function BinaryAnatomy() {
  return (
    <div className="flex h-full flex-col p-5 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-[26px] font-semibold tracking-[-0.04em] md:text-[32px]">refweir</p>
        <code className="font-mono text-[12px] text-mute">CGO_ENABLED=0 go build ./cmd/refweird</code>
      </div>
      <ul className="mt-6 space-y-1.5">
        {LAYERS.map((layer, index) => (
          <li
            key={layer.name}
            className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-3 md:grid-cols-[110px_minmax(0,1fr)_230px]"
          >
            <span className="type-label text-mute">{layer.name}</span>
            <span className="relative h-7 overflow-hidden rounded-md bg-ink/[0.06]">
              <span
                className="absolute inset-y-0 left-0 origin-left scale-x-0 rounded-md bg-ink transition-transform duration-1000 ease-out-expo group-data-in:scale-x-100"
                style={{ width: `${layer.width * 100}%`, transitionDelay: `${400 + index * 90}ms` }}
              />
              <span className="absolute inset-y-0 left-3 flex items-center font-mono text-[11px] text-paper md:hidden">
                {layer.detail}
              </span>
            </span>
            <span className="hidden truncate font-mono text-[12px] md:block">{layer.detail}</span>
          </li>
        ))}
      </ul>
      <p className="mt-auto pt-6 text-[14px] text-mute">
        One static executable. Copy it to a machine, run it, and the whole forge is there.
      </p>
    </div>
  )
}

export function Gallery() {
  return (
    <section aria-labelledby="gallery-title" className="mx-auto max-w-[1440px] px-5 pb-12 pt-28 md:px-10 md:pt-40">
      <div className="grid gap-6 md:grid-cols-12">
        <Reveal className="md:col-span-3">
          <SectionLabel index="03">Output</SectionLabel>
        </Reveal>
        <div className="md:col-span-9">
          <RevealLines
            id="gallery-title"
            className="type-lg"
            lines={[
              'Everything an agent',
              <>
                leaves behind is <span className="type-serif">legible.</span>
              </>,
            ]}
          />
          <Reveal as="p" delay={200} className="mt-8 max-w-[50ch] text-[17px] leading-[1.55] text-mute md:text-[18px]">
            Leases, rejections, tool calls, review reports. Refweir turns every agent action into an artifact a human
            can read in seconds — and audit later.
          </Reveal>
        </div>
      </div>

      <div className="mt-16 grid gap-x-5 gap-y-10 md:mt-24 md:grid-cols-12">
        <Artifact
          fig="3.1"
          caption="Review report for PR #142"
          pkg="internal/agentreviewer"
          surface="bg-ink"
          className="md:col-span-7 md:min-h-[520px]"
        >
          <ReviewReport />
        </Artifact>
        <Artifact
          fig="3.2"
          caption="Anatomy of a capability lease"
          pkg="pkg/agentlease"
          surface="bg-signal"
          className="md:col-span-5"
          delay={100}
        >
          <LeaseToken />
        </Artifact>

        <Artifact
          fig="3.3"
          caption="A push to main, turned away"
          pkg="ssh :2222"
          surface="bg-ink"
          className="md:col-span-4 md:min-h-[300px]"
        >
          <RejectedPush />
        </Artifact>
        <Artifact
          fig="3.4"
          caption="A tool call over MCP"
          pkg="JSON-RPC 2.0"
          surface="bg-sheet border border-ink/10"
          className="md:col-span-4"
          delay={90}
        >
          <JsonRpc />
        </Artifact>
        <Artifact
          fig="3.5"
          caption="Coverage, inspected per block"
          pkg="coverage gate"
          surface="bg-sheet border border-ink/10"
          className="md:col-span-4"
          delay={180}
        >
          <CoverageMap />
        </Artifact>

        <Artifact
          fig="3.6"
          caption="A leaked key, caught before merge"
          pkg="secret scan"
          surface="bg-ink"
          className="md:col-span-5"
        >
          <SecretFinding />
        </Artifact>
        <Artifact
          fig="3.7"
          caption="Inside the single binary"
          pkg="CGO_ENABLED=0"
          surface="bg-paper-2"
          className="md:col-span-7"
          delay={100}
        >
          <BinaryAnatomy />
        </Artifact>
      </div>
    </section>
  )
}
