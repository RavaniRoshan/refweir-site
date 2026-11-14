import { useRef, useState, type ReactNode, type SVGProps } from 'react'

export function LogoMark({ className = 'size-5', ...props }: SVGProps<SVGSVGElement>) {
  // Three agent refs flow into the weir; one reviewed ref continues to main.
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...props}>
      <path d="M2 6.5h8M2 12h8M2 17.5h8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="12" y="3" width="3.2" height="18" rx="1" fill="#FF5B1F" />
      <path d="M17.6 12H22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

export function ArrowIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CheckIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CrossIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="m4.5 4.5 7 7m0-7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function PlusIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

type Tone = 'light' | 'dark'

export function SectionLabel({
  index,
  children,
  tone = 'light',
}: {
  index: string
  children: ReactNode
  tone?: Tone | 'photo'
}) {
  const text = { light: 'text-mute', dark: 'text-smoke', photo: 'text-paper' }[tone]
  return (
    <p className={`type-label flex items-center gap-3 ${text}`}>
      <span className={tone === 'light' ? 'text-ink' : 'text-signal'}>[{index}]</span>
      <span aria-hidden="true" className={`h-px w-8 ${tone === 'light' ? 'bg-ink/25' : 'bg-white/30'}`} />
      <span>{children}</span>
    </p>
  )
}

type ButtonVariant = 'ink' | 'signal' | 'paper' | 'outline' | 'outline-dark'

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  ink: 'bg-ink text-paper hover:bg-signal hover:text-on-signal',
  signal: 'bg-signal text-on-signal hover:bg-paper hover:text-ink',
  paper: 'bg-paper text-ink hover:bg-signal hover:text-on-signal',
  outline: 'border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-paper',
  'outline-dark': 'border border-white/20 text-paper hover:border-paper hover:bg-paper hover:text-ink',
}

export function ButtonLink({
  href,
  children,
  variant = 'ink',
  className = '',
}: {
  href: string
  children: string
  variant?: ButtonVariant
  className?: string
}) {
  return (
    <a
      href={href}
      className={`group inline-flex h-12 items-center gap-3 rounded-full pl-5 pr-1.5 text-[15px] font-medium tracking-[-0.01em] transition-[background-color,color,border-color] duration-300 ease-out-quart ${BUTTON_VARIANTS[variant]} ${className}`}
    >
      <span className="relative block overflow-hidden leading-[1.25]">
        <span className="block transition-transform duration-300 ease-out-expo group-hover:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-full transition-transform duration-300 ease-out-expo group-hover:translate-y-0"
        >
          {children}
        </span>
      </span>
      <span className="grid size-9 place-items-center overflow-hidden rounded-full bg-current/10">
        <ArrowIcon className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5" />
      </span>
    </a>
  )
}

export function CopyCommand({ command, tone = 'light', className = '' }: { command: string; tone?: Tone; className?: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const codeRef = useRef<HTMLElement>(null)

  async function copy() {
    let ok = false
    try {
      await navigator.clipboard.writeText(command)
      ok = true
    } catch {
      const area = document.createElement('textarea')
      area.value = command
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      ok = document.execCommand('copy')
      area.remove()
    }
    if (!ok && codeRef.current) {
      // Clipboard unavailable (e.g. sandboxed iframe): select the text for a manual copy.
      const range = document.createRange()
      range.selectNodeContents(codeRef.current)
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
    setState(ok ? 'copied' : 'failed')
    window.setTimeout(() => setState('idle'), ok ? 1800 : 3200)
  }

  const dark = tone === 'dark'
  return (
    <div
      className={`flex h-12 min-w-0 items-center gap-3 rounded-full border pl-5 pr-1.5 font-mono text-[13px] ${
        dark ? 'border-white/15 bg-white/[0.03] text-paper' : 'border-ink/15 bg-sheet/60 text-ink'
      } ${className}`}
    >
      <span aria-hidden="true" className={dark ? 'text-signal' : 'text-mute'}>
        $
      </span>
      <code ref={codeRef} className="min-w-0 flex-1 truncate">
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy command: ${command}`}
        className={`h-9 shrink-0 rounded-full px-4 text-[12px] font-medium transition-colors duration-200 ${
          dark ? 'bg-white/10 hover:bg-paper hover:text-ink' : 'bg-ink/[0.07] hover:bg-ink hover:text-paper'
        }`}
      >
        {state === 'copied' ? 'Copied' : state === 'failed' ? 'Press ⌘C' : 'Copy'}
      </button>
      <span className="sr-only" aria-live="polite">
        {state === 'copied' ? 'Command copied to clipboard' : state === 'failed' ? 'Command selected, copy it manually' : ''}
      </span>
    </div>
  )
}

export function StatusDot({ tone = 'ok', live = false }: { tone?: 'ok' | 'bad' | 'signal' | 'idle'; live?: boolean }) {
  const color = { ok: 'bg-ok', bad: 'bg-bad', signal: 'bg-signal', idle: 'bg-smoke/60' }[tone]
  return (
    <span aria-hidden="true" className="relative inline-flex size-2 shrink-0">
      {live && <span className={`ping absolute inset-0 rounded-full ${color}`} />}
      <span className={`relative size-2 rounded-full ${color}`} />
    </span>
  )
}
