import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { formatClock, usePrefersReducedMotion, useTick } from '../lib/motion'
import { CheckIcon, CrossIcon, StatusDot } from '../components/ui'
import { AgentMark } from '../components/logos'

type DemoProps = { active: boolean }

function Window({ title, meta, children }: { title: string; meta?: ReactNode; children: ReactNode }) {
  return (
    <div className="demo-window flex h-full flex-col overflow-hidden rounded-[18px] border border-white/10 bg-ink-2 text-paper">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <span className="truncate font-mono text-[12px] text-smoke">{title}</span>
        {meta}
      </div>
      <div className="min-h-0 flex-1 p-4 md:p-6">{children}</div>
    </div>
  )
}

/* 01 — Connect any MCP client */

type ClientConfig = { name: string; file: string; endpoint: '/mcp' | '/mcp/readonly'; code: string[] }

const CLIENTS: ClientConfig[] = [
  {
    name: 'Claude Code',
    file: 'terminal',
    endpoint: '/mcp',
    code: ['$ claude mcp add --transport http refweir \\', '    https://forge.internal/mcp'],
  },
  {
    name: 'Codex',
    file: '~/.codex/config.toml',
    endpoint: '/mcp',
    code: ['[mcp_servers.refweir]', 'url = "https://forge.internal/mcp"'],
  },
  {
    name: 'Cline',
    file: 'cline_mcp_settings.json',
    endpoint: '/mcp/readonly',
    code: ['{ "mcpServers": {', '    "refweir": {', '      "url": "https://forge.internal/mcp/readonly"', '} } }'],
  },
  {
    name: 'Cursor',
    file: '.cursor/mcp.json',
    endpoint: '/mcp',
    code: ['{ "mcpServers": {', '    "refweir": {', '      "url": "https://forge.internal/mcp"', '} } }'],
  },
]

export function ConnectDemo({ active }: DemoProps) {
  const reduced = usePrefersReducedMotion()
  const [selected, setSelected] = useState(0)
  const [manual, setManual] = useState(false)

  useEffect(() => {
    if (!active || manual || reduced) return
    const timer = window.setInterval(() => setSelected((value) => (value + 1) % CLIENTS.length), 3000)
    return () => window.clearInterval(timer)
  }, [active, manual, reduced])

  const client = CLIENTS[selected]
  const readonly = client.endpoint === '/mcp/readonly'

  return (
    <Window title={client.file} meta={<span className="font-mono text-[11px] text-smoke">JSON-RPC 2.0</span>}>
      <div className="flex h-full flex-col">
        <div role="tablist" aria-label="Agent configuration examples" className="flex flex-wrap gap-1.5">
          {CLIENTS.map((item, index) => (
            <button
              key={item.name}
              role="tab"
              type="button"
              aria-selected={index === selected}
              onClick={() => {
                setSelected(index)
                setManual(true)
              }}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] transition-colors duration-200 ${
                index === selected ? 'bg-paper text-ink' : 'bg-white/[0.05] text-smoke hover:bg-white/10 hover:text-paper'
              }`}
            >
              <AgentMark name={item.name} className="size-3.5 shrink-0" />
              {item.name}
            </button>
          ))}
        </div>

        <pre key={client.name} className="mt-5 min-h-[124px] overflow-x-auto rounded-xl bg-ink p-4 font-mono text-[12px] leading-[1.8]">
          {client.code.map((line, index) => (
            <span key={index} className="rise-in block" style={{ '--d': `${index * 80}ms` } as CSSProperties}>
              {line}
            </span>
          ))}
        </pre>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {(['/mcp', '/mcp/readonly'] as const).map((endpoint) => {
            const on = endpoint === client.endpoint
            return (
              <div
                key={endpoint}
                className={`rounded-xl border px-3 py-2.5 transition-colors duration-300 ${
                  on ? 'border-signal/50 bg-signal/[0.08]' : 'border-white/10'
                }`}
              >
                <p className={`font-mono text-[13px] ${on ? 'text-signal' : 'text-smoke'}`}>{endpoint}</p>
                <p className="mt-0.5 text-[12px] text-smoke">
                  {endpoint === '/mcp' ? 'Full tool set' : 'Read-only sandbox'}
                </p>
              </div>
            )
          })}
        </div>

        <ul key={`log-${client.name}`} className="mt-auto space-y-1 pt-5 font-mono text-[12px]">
          {[
            ['→', 'initialize'],
            ['←', 'serverInfo { name: "refweir" }'],
            ['→', 'tools/list'],
            ['←', readonly ? 'repo.read · repo.search · diff.view' : 'repo.* · branch.* · pull_request.* · review.*'],
          ].map(([dir, text], index) => (
            <li
              key={index}
              className="rise-in flex gap-3"
              style={{ '--d': `${300 + index * 220}ms` } as CSSProperties}
            >
              <span className={dir === '→' ? 'text-smoke' : 'text-ok'}>{dir}</span>
              <span className="truncate text-paper/85">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </Window>
  )
}

/* 02 — Lease issuance */

const TOKEN = 'rwl1.eyJzdWIiOiJjbGF1ZGUtY29kZSIsInNjb3BlIjoicmVmcy9oZWFkcy9hZ2VudC9jbGF1ZGUvKiJ9.9f2c4a1e7b03d58c'
const SCOPE = [
  { ref: 'refs/heads/agent/claude/*', allowed: true },
  { ref: 'refs/heads/main', allowed: false },
  { ref: 'refs/heads/release/*', allowed: false },
  { ref: 'refs/tags/*', allowed: false },
]

export function LeaseDemo({ active }: DemoProps) {
  const reduced = usePrefersReducedMotion()
  const [typed, setTyped] = useState(reduced ? TOKEN.length : 0)
  const [ttl, setTtl] = useState(3600)

  useEffect(() => {
    if (reduced) {
      setTyped(TOKEN.length)
      return
    }
    if (!active) return
    setTyped(0)
    setTtl(3600)
    const typer = window.setInterval(() => {
      setTyped((value) => {
        if (value >= TOKEN.length) {
          window.clearInterval(typer)
          return value
        }
        return value + 2
      })
    }, 22)
    const clock = window.setInterval(() => setTtl((value) => (value > 0 ? value - 1 : 3600)), 1000)
    return () => {
      window.clearInterval(typer)
      window.clearInterval(clock)
    }
  }, [active, reduced])

  const radius = 46
  const circumference = 2 * Math.PI * radius
  const done = typed >= TOKEN.length

  return (
    <Window
      title="POST /api/v1/agent/leases"
      meta={
        <span className={`font-mono text-[11px] transition-colors duration-300 ${done ? 'text-ok' : 'text-smoke'}`}>
          {done ? '201 Created' : 'signing…'}
        </span>
      }
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-5">
          <div className="relative size-[112px] shrink-0">
            <svg viewBox="0 0 112 112" className="size-full -rotate-90" aria-hidden="true">
              <circle cx="56" cy="56" r={radius} stroke="rgb(255 255 255 / 0.08)" strokeWidth="6" fill="none" />
              <circle
                cx="56"
                cy="56"
                r={radius}
                stroke="#ff5b1f"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - ttl / 3600)}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="font-mono text-[19px] tabular-nums">{formatClock(ttl)}</p>
                <p className="type-label text-[9px] text-smoke">remaining</p>
              </div>
            </div>
          </div>
          <dl className="grid min-w-0 flex-1 grid-cols-[56px_minmax(0,1fr)] gap-y-1.5 font-mono text-[12px]">
            <dt className="text-smoke">sub</dt>
            <dd className="truncate">claude-code</dd>
            <dt className="text-smoke">alg</dt>
            <dd>HMAC-SHA256</dd>
            <dt className="text-smoke">ttl</dt>
            <dd>3600s · auto-expire</dd>
            <dt className="text-smoke">caps</dt>
            <dd className="truncate">read · push · pr.create</dd>
          </dl>
        </div>

        <div className="mt-5 rounded-xl bg-ink p-4">
          <p className="type-label text-smoke">Token</p>
          <p className="mt-2 min-h-[54px] break-all font-mono text-[12px] leading-[1.6] text-paper/90">
            {TOKEN.slice(0, typed)}
            {!done && <span className="caret ml-px inline-block h-3.5 w-[7px] translate-y-0.5 bg-signal" />}
          </p>
        </div>

        <ul className="mt-5 space-y-1.5">
          {SCOPE.map((item, index) => (
            <li
              key={item.ref}
              className="flex items-center justify-between gap-3 border-t border-white/10 pt-1.5 font-mono text-[12px] transition-opacity duration-500"
              style={{ opacity: done ? 1 : 0.25, transitionDelay: `${index * 110}ms` }}
            >
              <span className={item.allowed ? 'text-paper' : 'text-smoke'}>{item.ref}</span>
              <span className={`flex items-center gap-1.5 ${item.allowed ? 'text-ok' : 'text-bad'}`}>
                {item.allowed ? <CheckIcon className="size-3" /> : <CrossIcon className="size-3" />}
                {item.allowed ? 'write' : 'denied'}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-auto pt-5 font-mono text-[11px] text-smoke">
          Verified on every ref update · over HTTP and SSH alike
        </p>
      </div>
    </Window>
  )
}

/* 03 — Push over either transport */

type Line = { text: string; tone: 'cmd' | 'out' | 'ok' | 'bad' }

function pushLines(transport: 'ssh' | 'http'): Line[] {
  const remote =
    transport === 'ssh'
      ? 'ssh://git@forge.internal:2222/acme/payments-api.git'
      : 'https://forge.internal:8080/acme/payments-api.git'
  return [
    { text: '$ git remote get-url agent', tone: 'cmd' },
    { text: remote, tone: 'out' },
    { text: '$ git push agent HEAD:refs/heads/agent/claude/fix-retry', tone: 'cmd' },
    { text: 'remote: refweir ▸ lease lease_7f3a verified · HMAC-SHA256', tone: 'out' },
    { text: 'remote: refweir ▸ scope ok · refs/heads/agent/claude/*', tone: 'out' },
    { text: ' * [new branch]  HEAD -> agent/claude/fix-retry', tone: 'ok' },
    { text: '$ git push agent HEAD:main', tone: 'cmd' },
    { text: 'remote: refweir ▸ refs/heads/main is outside lease scope', tone: 'bad' },
    { text: ' ! [remote rejected]  HEAD -> main (lease scope)', tone: 'bad' },
  ]
}

const PUSH_LENGTH = 9
const PUSH_TICKS = PUSH_LENGTH + 6

export function PushDemo({ active }: DemoProps) {
  const tick = useTick(active, 480, PUSH_TICKS)
  const [loop, setLoop] = useState(0)
  useEffect(() => {
    if (tick === 0 && active) setLoop((value) => value + 1)
  }, [tick, active])

  const transport = loop % 2 === 0 ? 'http' : 'ssh'
  const lines = pushLines(transport)
  const visible = Math.min(tick + 1, lines.length)
  const tones = { cmd: 'text-paper', out: 'text-smoke', ok: 'text-ok', bad: 'text-bad' }

  return (
    <Window
      title="~/payments-api — zsh"
      meta={
        <span className="flex gap-1.5 font-mono text-[11px]">
          {(['http', 'ssh'] as const).map((item) => (
            <span
              key={item}
              className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 transition-colors duration-300 ${
                item === transport ? 'bg-white/10 text-paper' : 'text-smoke'
              }`}
            >
              {item === transport && <StatusDot live />}
              {item === 'http' ? 'http :8080' : 'ssh :2222'}
            </span>
          ))}
        </span>
      }
    >
      <pre className="h-full overflow-hidden font-mono text-[12px] leading-[1.85]">
        {lines.slice(0, visible).map((line, index) => (
          <span key={`${loop}-${index}`} className={`rise-in block truncate ${tones[line.tone]}`}>
            {line.text}
          </span>
        ))}
        {visible < lines.length && <span className="caret inline-block h-3.5 w-[7px] bg-paper/70" />}
      </pre>
    </Window>
  )
}

/* 04 — Review and merge */

const REVIEW = [
  { name: 'AST analysis', detail: 'go/ast · 14 files' },
  { name: 'Secret scan', detail: '0 findings' },
  { name: 'Coverage', detail: '87.2% ≥ 80%' },
  { name: 'Policy', detail: 'agent/* → main' },
]
const REVIEW_TICKS = 26

export function ReviewDemo({ active }: DemoProps) {
  const tick = useTick(active, 260, REVIEW_TICKS)
  const merged = tick >= 15
  const revoked = tick >= 18

  return (
    <Window
      title="internal/agentreviewer · PR #142"
      meta={
        <span className={`font-mono text-[11px] transition-colors duration-300 ${merged ? 'text-ok' : 'text-smoke'}`}>
          {merged ? 'merged' : 'reviewing…'}
        </span>
      }
    >
      <div className="flex h-full flex-col">
        <ul className="space-y-3">
          {REVIEW.map((gate, index) => {
            const progress = Math.max(0, Math.min(1, (tick - index * 3) / 3))
            const passed = progress >= 1
            return (
              <li key={gate.name}>
                <div className="flex items-center justify-between gap-3 text-[13px]">
                  <span className="flex items-center gap-2.5">
                    <span
                      className={`grid size-5 place-items-center rounded-full transition-colors duration-300 ${
                        passed ? 'bg-ok/15 text-ok' : 'bg-white/[0.06] text-smoke'
                      }`}
                    >
                      {passed ? <CheckIcon className="size-3" /> : <span className="size-1.5 rounded-full bg-current" />}
                    </span>
                    {gate.name}
                  </span>
                  <span className="font-mono text-[11px] text-smoke">{progress > 0 ? gate.detail : 'queued'}</span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className={`h-full origin-left rounded-full transition-transform duration-300 ease-linear ${
                      passed ? 'bg-ok' : 'bg-signal'
                    }`}
                    style={{ transform: `scaleX(${progress})` }}
                  />
                </div>
              </li>
            )
          })}
        </ul>

        <div
          className="mt-6 rounded-xl border border-white/10 bg-ink p-4 transition-[opacity,transform] duration-500 ease-out-expo"
          style={{ opacity: tick >= 13 ? 1 : 0, transform: tick >= 13 ? 'none' : 'translateY(10px)' }}
        >
          <p className="type-label text-smoke">Three-way merge</p>
          <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 font-mono text-[11px] sm:grid-cols-[1fr_1fr_1fr_auto_1fr]">
            {[
              ['base', '4be1d20'],
              ['ours', '3f2a9c1'],
              ['theirs', '7c90e5b'],
            ].map(([label, sha], index) => (
              <span
                key={label}
                className={`rounded-lg bg-white/[0.05] px-2.5 py-2 ${index > 0 ? 'hidden sm:block' : ''}`}
              >
                <span className="block text-smoke">{label}</span>
                {sha}
              </span>
            ))}
            <span className="text-signal">→</span>
            <span
              className="rounded-lg px-2.5 py-2 transition-colors duration-500"
              style={{ backgroundColor: merged ? 'rgb(255 91 31 / 0.18)' : 'rgb(255 255 255 / 0.05)' }}
            >
              <span className="block text-smoke">main</span>
              <span className={merged ? 'text-signal' : ''}>{merged ? '9c1e04a' : '·······'}</span>
            </span>
          </div>
        </div>

        <p
          className="mt-auto flex items-center gap-2 pt-5 font-mono text-[12px] transition-opacity duration-500"
          style={{ opacity: revoked ? 1 : 0 }}
        >
          <StatusDot tone="idle" /> lease_7f3a revoked · agent/claude/fix-retry archived
        </p>
      </div>
    </Window>
  )
}
