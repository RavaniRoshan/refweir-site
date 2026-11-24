import { Reveal, RevealLines } from '../lib/motion'
import { CheckIcon, SectionLabel } from '../components/ui'
import { AgentMark } from '../components/logos'

const CLIENTS = ['Claude Code', 'Codex', 'Cline', 'Cursor', 'Any MCP client', 'Your own agent']

const NOTES = [
  {
    quote: 'remote: refweir: lease scope denies ref refs/heads/main (allowed: refs/heads/agent/*)',
    who: 'git receive-pack',
    where: 'pre-receive hook · demo/agent-lab',
  },
  {
    quote: '{"agentId": "claude-code", "allowedRefPrefixes": ["refs/heads/agent/*"], "expiresAt": "2026-11-23T16:34:52Z"}',
    who: 'agent lease API',
    where: 'POST /api/v1/agent/leases',
  },
  {
    quote: 'Autonomous review completed: score 100/100, 0 errors, 0 warnings. PR #1 (agent/retry-budget → main) approved.',
    who: 'agentreviewer',
    where: 'PR #1 · demo/agent-lab',
  },
]

type Cell = { text: string; good?: boolean }
const COMPARISON: { row: string; refweir: Cell; proprietary: Cell; legacy: Cell }[] = [
  {
    row: 'Designed for',
    refweir: { text: 'Autonomous agents and human teams', good: true },
    proprietary: { text: 'Proprietary vendor agents' },
    legacy: { text: 'People in a web browser' },
  },
  {
    row: 'Where it runs',
    refweir: { text: 'Your hardware, self-hosted', good: true },
    proprietary: { text: 'Proprietary cloud infrastructure' },
    legacy: { text: 'Vendor cloud, or a heavy self-host' },
  },
  {
    row: 'Account required',
    refweir: { text: 'None', good: true },
    proprietary: { text: 'Vendor subscription account' },
    legacy: { text: 'One per seat' },
  },
  {
    row: 'Works with',
    refweir: { text: 'Any MCP or Git client', good: true },
    proprietary: { text: 'Single vendor ecosystem' },
    legacy: { text: 'Through tokens and integrations' },
  },
  {
    row: 'Agent credentials',
    refweir: { text: 'One-hour HMAC capability leases', good: true },
    proprietary: { text: 'Managed by closed platform' },
    legacy: { text: 'User or app tokens' },
  },
  {
    row: 'Source',
    refweir: { text: 'Open source', good: true },
    proprietary: { text: 'Proprietary closed source' },
    legacy: { text: 'Varies' },
  },
]

export function Proof() {
  return (
    <section id="compare" aria-labelledby="compare-title" className="py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal>
          <SectionLabel index="08">Any agent</SectionLabel>
        </Reveal>
      </div>

      <Reveal delay={100} className="marquee-host mt-10 overflow-hidden border-y border-ink/15 py-6 md:py-8">
        <ul className="marquee flex w-max items-center" style={{ ['--marquee-duration' as string]: '38s' }}>
          {[...CLIENTS, ...CLIENTS].map((name, index) => (
            <li
              key={index}
              aria-hidden={index >= CLIENTS.length ? true : undefined}
              className="flex shrink-0 items-center gap-8 pr-8 text-[56px] font-semibold leading-none tracking-[-0.05em] [font-stretch:82%] md:gap-12 md:pr-12 md:text-[112px]"
            >
              <AgentMark name={name} className="size-[0.55em] shrink-0" />
              <span className={index % 2 === 1 ? 'text-outline' : ''}>{name}</span>
              <span aria-hidden="true" className="inline-block size-3 rounded-full bg-signal md:size-5" />
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="mt-14 grid gap-6 md:mt-20 md:grid-cols-12">
          <Reveal as="p" className="text-[22px] leading-[1.2] tracking-[-0.02em] md:col-span-6 md:col-start-4 md:text-[30px]">
            Refweir doesn&rsquo;t care which model wrote the diff. It cares whether the diff stayed{' '}
            <span className="type-serif">inside its lease.</span>
          </Reveal>
        </div>

        <div className="mt-20 md:mt-28">
          <Reveal className="flex items-baseline justify-between gap-6 border-b border-ink/15 pb-4">
            <p className="type-label text-ink">From a recorded session</p>
            <p className="type-label text-mute">verbatim output, demo/agent-lab, 23 Nov 2026</p>
          </Reveal>
          <div className="grid md:grid-cols-3">
            {NOTES.map((note, index) => (
              <Reveal
                as="figure"
                key={note.who}
                delay={index * 100}
                className="group border-b border-ink/15 py-8 md:border-b-0 md:border-r md:px-8 md:py-10 md:first:pl-0 md:last:border-r-0"
              >
                <blockquote className="text-[20px] leading-[1.3] tracking-[-0.015em] transition-transform duration-300 ease-out-quart group-hover:-translate-y-0.5 md:text-[23px]">
                  &ldquo;{note.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 font-mono text-[12px]">
                  <span className="grid size-7 place-items-center rounded-full bg-ink text-[11px] text-signal">
                    {note.who.slice(0, 2)}
                  </span>
                  <span>
                    <span className="block">{note.who}</span>
                    <span className="block text-mute">{note.where}</span>
                  </span>
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-24 md:mt-36">
          <div className="grid gap-6 md:grid-cols-12">
            <RevealLines
              id="compare-title"
              className="type-md md:col-span-7"
              lines={['Same Git.', <>Different <span className="type-serif">allegiance.</span></>]}
            />
            <Reveal as="p" delay={150} className="text-[16px] leading-[1.55] text-mute md:col-span-4 md:col-start-9 md:pt-2 md:text-[17px]">
              Proprietary agent platforms are tied to closed vendor accounts and hosted infrastructure. Refweir is vendor-neutral,
              open source and runs on your own hardware — for any agent.
            </Reveal>
          </div>

          <p className="type-label mt-10 text-mute md:hidden">Swipe to compare →</p>
          <Reveal delay={100} className="mt-4 overflow-x-auto md:mt-12">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <caption className="sr-only">Refweir compared with proprietary cloud platforms and traditional forges</caption>
              <thead>
                <tr className="type-label">
                  <th scope="col" className="w-[20%] pb-4 font-normal text-mute">
                    <span className="sr-only">Feature</span>
                  </th>
                  <th scope="col" className="w-[28%] rounded-t-2xl bg-ink px-5 pb-4 pt-5 font-normal text-signal">
                    Refweir
                  </th>
                  <th scope="col" className="w-[26%] px-5 pb-4 font-normal text-mute">
                    Proprietary platforms
                  </th>
                  <th scope="col" className="w-[26%] px-5 pb-4 font-normal text-mute">
                    Traditional forges
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((item, index) => {
                  const last = index === COMPARISON.length - 1
                  return (
                    <tr key={item.row} className="group">
                      <th scope="row" className="border-t border-ink/15 py-5 pr-4 text-[14px] font-medium">
                        {item.row}
                      </th>
                      <td
                        className={`border-t border-white/10 bg-ink px-5 py-5 text-[15px] text-paper transition-colors duration-200 group-hover:bg-ink-3 ${
                          last ? 'rounded-b-2xl' : ''
                        }`}
                      >
                        <span className="flex items-start gap-2.5">
                          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-signal text-on-signal">
                            <CheckIcon className="size-3" />
                          </span>
                          {item.refweir.text}
                        </span>
                      </td>
                      <td className="border-t border-ink/15 px-5 py-5 text-[15px] text-mute">{item.proprietary.text}</td>
                      <td className="border-t border-ink/15 px-5 py-5 text-[15px] text-mute">{item.legacy.text}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
