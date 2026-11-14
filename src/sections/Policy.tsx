import { useEffect, useRef, useState } from 'react'
import { Reveal, RevealLines } from '../lib/motion'
import { SectionLabel } from '../components/ui'

type Ttl = '15m' | '30m' | '1h' | '4h'
type Namespace = 'agent' | 'per-agent' | 'bots'
type Surface = 'full' | 'readonly'

type Policy = {
  ttl: Ttl
  namespace: Namespace
  surface: Surface
  http: boolean
  ssh: boolean
  ast: boolean
  secrets: boolean
  coverage: number
  human: boolean
  autoMerge: boolean
}

const DEFAULT_POLICY: Policy = {
  ttl: '1h',
  namespace: 'agent',
  surface: 'full',
  http: true,
  ssh: true,
  ast: true,
  secrets: true,
  coverage: 80,
  human: false,
  autoMerge: true,
}

const TTL_LABEL: Record<Ttl, string> = { '15m': '15 minutes', '30m': '30 minutes', '1h': 'one hour', '4h': 'four hours' }
const NAMESPACE_REF: Record<Namespace, string> = {
  agent: 'refs/heads/agent/*',
  'per-agent': 'refs/heads/agent/{agent}/*',
  bots: 'refs/heads/bots/*',
}

type ConfigLine = { id: string; text: string }

function buildConfig(policy: Policy): ConfigLine[] {
  const lines: ConfigLine[] = [
    { id: 'h-transport', text: '[transport]' },
    { id: 'http', text: policy.http ? 'http = ":8080"' : '# http disabled' },
    { id: 'ssh', text: policy.ssh ? 'ssh  = ":2222"' : '# ssh disabled' },
    { id: 'gap-1', text: '' },
    { id: 'h-lease', text: '[agentlease]' },
    { id: 'alg', text: 'algorithm = "HMAC-SHA256"' },
    { id: 'ttl', text: `ttl       = "${policy.ttl}"` },
    { id: 'refs', text: `refs      = ["${NAMESPACE_REF[policy.namespace]}"]` },
    { id: 'gap-2', text: '' },
    { id: 'h-mcp', text: '[mcp]' },
    {
      id: 'endpoint',
      text: policy.surface === 'full' ? 'endpoint  = "/mcp"          # full tool set' : 'endpoint  = "/mcp/readonly" # sandbox',
    },
    { id: 'gap-3', text: '' },
    { id: 'h-review', text: '[agentreviewer]' },
    { id: 'ast', text: `ast_analysis   = ${policy.ast}` },
    { id: 'secrets', text: `secret_scan    = ${policy.secrets}` },
    { id: 'coverage', text: `min_coverage   = ${(policy.coverage / 100).toFixed(2)}` },
    { id: 'human', text: `human_approval = ${policy.human}` },
    { id: 'merge', text: `merge          = "${policy.autoMerge ? 'three-way' : 'manual'}"` },
  ]
  return lines
}

function highlight(text: string) {
  if (!text) return '\u00a0'
  if (text.startsWith('#')) return <span className="text-smoke">{text}</span>
  if (text.startsWith('[')) return <span className="text-signal">{text}</span>
  const match = text.match(/^(\S+)(\s*=\s*)(.*?)(\s+#.*)?$/)
  if (!match) return text
  const [, key, eq, value, comment] = match
  const valueClass = value.startsWith('"') || value.startsWith('[') ? 'text-sand' : 'text-ok'
  return (
    <>
      <span className="text-paper">{key}</span>
      <span className="text-smoke">{eq}</span>
      <span className={valueClass}>{value}</span>
      {comment && <span className="text-smoke">{comment}</span>}
    </>
  )
}

function describe(policy: Policy) {
  const gates = [
    policy.ast && 'AST analysis',
    policy.secrets && 'secret scanning',
    policy.coverage > 0 && `${policy.coverage}% coverage`,
    policy.human && 'a human approval',
  ].filter(Boolean) as string[]
  const gateText =
    gates.length === 0
      ? 'with no review gates at all'
      : gates.length === 1
        ? `after ${gates[0]}`
        : `after ${gates.slice(0, -1).join(', ')} and ${gates[gates.length - 1]}`
  const transports = [policy.http && 'HTTP', policy.ssh && 'SSH'].filter(Boolean).join(' and ')

  if (policy.surface === 'readonly') {
    return {
      lead: 'Agents may read and reason over every repository through /mcp/readonly,',
      tail: `but cannot push, branch or open pull requests. Humans still merge ${gateText}.`,
    }
  }
  return {
    lead: `Agents may push to ${NAMESPACE_REF[policy.namespace]} over ${transports} for ${TTL_LABEL[policy.ttl]} at a time.`,
    tail: `Work reaches main ${gateText}${policy.autoMerge ? ', merged three-way automatically.' : ', merged by hand.'}`,
  }
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  const labelId = `policy-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  return (
    <div>
      <p className="type-label text-smoke" id={labelId}>
        {label}
      </p>
      <div role="radiogroup" aria-labelledby={labelId} className="mt-2.5 flex flex-wrap gap-1 border-b border-white/10 pb-4">
        {options.map((option) => {
          const checked = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() => onChange(option.value)}
              className={`flex-1 rounded-xl px-3 py-2 font-mono text-[12px] whitespace-nowrap transition-colors duration-200 ${
                checked ? 'bg-paper text-ink' : 'text-smoke hover:bg-white/[0.06] hover:text-paper'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Toggle({
  label,
  hint,
  checked,
  disabled = false,
  onChange,
}: {
  label: string
  hint: string
  checked: boolean
  disabled?: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="group flex w-full items-center justify-between gap-4 rounded-xl px-1 py-2.5 text-left disabled:cursor-not-allowed"
    >
      <span>
        <span className="block text-[14px] font-medium">{label}</span>
        <span className="block font-mono text-[11px] text-smoke">{hint}</span>
      </span>
      <span
        aria-hidden="true"
        className={`relative h-6 w-10 shrink-0 rounded-full transition-colors duration-250 ${
          checked ? 'bg-signal' : 'bg-white/15 group-hover:bg-white/25'
        } ${disabled ? 'opacity-50' : ''}`}
      >
        <span
          className={`absolute top-1 left-1 size-4 rounded-full bg-paper shadow transition-transform duration-300 ease-out-expo ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </span>
    </button>
  )
}

export function Policy() {
  const [policy, setPolicy] = useState<Policy>(DEFAULT_POLICY)
  const update = <K extends keyof Policy>(key: K, value: Policy[K]) => setPolicy((current) => ({ ...current, [key]: value }))

  const lines = buildConfig(policy)
  const previous = useRef<Map<string, string>>(new Map())
  const changed = new Set(
    lines.filter((line) => previous.current.has(line.id) && previous.current.get(line.id) !== line.text).map((line) => line.id),
  )
  useEffect(() => {
    previous.current = new Map(lines.map((line) => [line.id, line.text]))
  })

  const summary = describe(policy)
  const readonly = policy.surface === 'readonly'
  const refMap = [
    { ref: 'refs/heads/main', state: 'protected', note: policy.human ? 'review + human' : 'review gates' },
    { ref: 'refs/heads/release/*', state: 'protected', note: 'humans only' },
    { ref: NAMESPACE_REF[policy.namespace], state: readonly ? 'read-only' : 'agent-writable', note: readonly ? 'sandbox' : `lease · ${policy.ttl}` },
    { ref: 'refs/tags/*', state: 'protected', note: 'humans only' },
  ]

  return (
    <section id="policy" aria-labelledby="policy-title" className="px-2 md:px-3">
      <div className="rounded-[28px] bg-ink text-paper md:rounded-[40px]">
        <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
          <div className="grid gap-6 md:grid-cols-12">
            <Reveal className="md:col-span-3">
              <SectionLabel index="07" tone="dark">
                Policy
              </SectionLabel>
            </Reveal>
            <div className="md:col-span-9">
              <RevealLines
                id="policy-title"
                className="type-lg"
                lines={[
                  'Tune the weir,',
                  <>
                    <span className="type-serif text-signal">not</span> the agent.
                  </>,
                ]}
              />
              <Reveal as="p" delay={200} className="mt-8 max-w-[50ch] text-[17px] leading-[1.55] text-smoke md:text-[18px]">
                Every boundary is a setting you own. Change one here and watch the forge configuration, the policy and the
                ref map respond.
              </Reveal>
            </div>
          </div>

          <div className="mt-14 grid gap-4 md:mt-20 lg:grid-cols-12">
            <Reveal className="space-y-6 rounded-[22px] border border-white/10 bg-ink-2 p-5 md:p-7 lg:col-span-5">
              <div className="flex items-center justify-between">
                <p className="text-[18px] font-semibold tracking-[-0.02em]">Forge policy</p>
                <button
                  type="button"
                  onClick={() => setPolicy(DEFAULT_POLICY)}
                  className="rounded-full border border-white/15 px-3 py-1 text-[12px] text-smoke transition-colors duration-200 hover:bg-paper hover:text-ink"
                >
                  Reset
                </button>
              </div>

              <Segmented
                label="Lease lifetime"
                value={policy.ttl}
                onChange={(value) => update('ttl', value)}
                options={[
                  { value: '15m', label: '15m' },
                  { value: '30m', label: '30m' },
                  { value: '1h', label: '1h' },
                  { value: '4h', label: '4h' },
                ]}
              />
              <Segmented
                label="Agent namespace"
                value={policy.namespace}
                onChange={(value) => update('namespace', value)}
                options={[
                  { value: 'agent', label: 'agent/*' },
                  { value: 'per-agent', label: 'agent/{name}/*' },
                  { value: 'bots', label: 'bots/*' },
                ]}
              />
              <Segmented
                label="MCP surface"
                value={policy.surface}
                onChange={(value) => update('surface', value)}
                options={[
                  { value: 'full', label: '/mcp · full' },
                  { value: 'readonly', label: '/mcp/readonly' },
                ]}
              />

              <div>
                <p className="type-label text-smoke">Transports</p>
                <div className="mt-1 divide-y divide-white/10">
                  <Toggle
                    label="Smart-HTTP"
                    hint=":8080 · pure Go"
                    checked={policy.http}
                    disabled={policy.http && !policy.ssh}
                    onChange={(value) => update('http', value)}
                  />
                  <Toggle
                    label="SSH"
                    hint=":2222 · embedded, no OpenSSH"
                    checked={policy.ssh}
                    disabled={policy.ssh && !policy.http}
                    onChange={(value) => update('ssh', value)}
                  />
                </div>
              </div>

              <div>
                <p className="type-label text-smoke">Review gates</p>
                <div className="mt-1 divide-y divide-white/10">
                  <Toggle label="AST analysis" hint="static, per changed file" checked={policy.ast} onChange={(value) => update('ast', value)} />
                  <Toggle label="Secret scan" hint="blocks leaked credentials" checked={policy.secrets} onChange={(value) => update('secrets', value)} />
                  <Toggle label="Human approval" hint="a person signs off last" checked={policy.human} onChange={(value) => update('human', value)} />
                  <Toggle
                    label="Auto-merge"
                    hint="three-way, when every gate passes"
                    checked={policy.autoMerge}
                    onChange={(value) => update('autoMerge', value)}
                  />
                </div>
                <label className="mt-4 block">
                  <span className="flex items-baseline justify-between">
                    <span className="text-[14px] font-medium">Minimum coverage</span>
                    <span className="font-mono text-[13px] tabular-nums text-signal">{policy.coverage}%</span>
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={policy.coverage}
                    onChange={(event) => update('coverage', Number(event.target.value))}
                    className="mt-3 w-full cursor-pointer accent-[#ff5b1f]"
                  />
                </label>
              </div>
            </Reveal>

            <div className="grid gap-4 lg:col-span-7">
              <Reveal delay={100} className="rounded-[22px] bg-signal p-6 text-on-signal md:p-8">
                <p className="type-label">Policy, in plain words</p>
                <p className="mt-4 text-[22px] font-semibold leading-[1.15] tracking-[-0.03em] md:text-[30px]" aria-live="polite">
                  {summary.lead} <span className="text-on-signal/60">{summary.tail}</span>
                </p>
              </Reveal>

              <div className="grid gap-4 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
                <Reveal delay={180} className="overflow-hidden rounded-[22px] border border-white/10 bg-ink-2">
                  <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                    <span className="font-mono text-[12px] text-smoke">refweir.toml</span>
                    <span className="font-mono text-[11px] text-smoke">{lines.length} lines</span>
                  </div>
                  <pre className="overflow-x-auto py-3 font-mono text-[12px] leading-[1.75]">
                    {lines.map((line, index) => (
                      <span
                        key={`${line.id}:${line.text}`}
                        className={`flex gap-4 px-5 ${changed.has(line.id) ? 'cfg-flash' : ''}`}
                      >
                        <span className="w-4 shrink-0 text-right text-smoke select-none">{index + 1}</span>
                        <span>{highlight(line.text)}</span>
                      </span>
                    ))}
                  </pre>
                </Reveal>

                <Reveal delay={260} className="flex flex-col rounded-[22px] border border-white/10 bg-ink-2 p-5">
                  <p className="type-label text-smoke">Ref map</p>
                  <ul className="mt-4 space-y-2">
                    {refMap.map((item) => {
                      const writable = item.state === 'agent-writable'
                      const sandbox = item.state === 'read-only'
                      return (
                        <li
                          key={item.ref}
                          className={`rounded-xl border px-3 py-3 transition-colors duration-300 ${
                            writable ? 'border-signal/50 bg-signal/[0.08]' : sandbox ? 'border-white/20' : 'border-white/10'
                          }`}
                        >
                          <p className={`truncate font-mono text-[12px] ${writable ? 'text-signal' : 'text-paper'}`}>{item.ref}</p>
                          <p className="mt-1 flex justify-between gap-2 font-mono text-[11px] text-smoke">
                            <span>{item.state}</span>
                            <span>{item.note}</span>
                          </p>
                        </li>
                      )
                    })}
                  </ul>
                  <p className="mt-auto pt-5 text-[13px] leading-[1.5] text-smoke">
                    Agents never see a production ref as writable — whatever you choose above.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
