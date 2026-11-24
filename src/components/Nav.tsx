import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { LogoMark } from './ui'
import { toggleTheme, useTheme } from '../lib/theme'

function SunIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-4">
      <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 1.2v1.6M8 13.2v1.6M1.2 8h1.6M13.2 8h1.6M3.2 3.2l1.1 1.1M11.7 11.7l1.1 1.1M12.8 3.2l-1.1 1.1M4.3 11.7l-1.1 1.1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-4">
      <path
        d="M13.6 9.6A6 6 0 0 1 6.4 2.4a6 6 0 1 0 7.2 7.2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export const NAV_LINKS = [
  { id: 'product', label: 'Product' },
  { id: 'why', label: 'Why' },
  { id: 'workflow', label: 'Workflow' },
  { id: 'policy', label: 'Policy' },
  { id: 'compare', label: 'Compare' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'faq', label: 'FAQ' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const theme = useTheme()
  const listRef = useRef<HTMLUListElement>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Track which chapter crosses the middle band of the viewport.
  useEffect(() => {
    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        setActive(NAV_LINKS.find((link) => visible.has(link.id))?.id ?? null)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    for (const link of NAV_LINKS) {
      const section = document.getElementById(link.id)
      if (section) observer.observe(section)
    }
    return () => observer.disconnect()
  }, [])

  const target = hovered ?? active

  useLayoutEffect(() => {
    const measure = () => {
      const list = listRef.current
      const link = target ? list?.querySelector<HTMLElement>(`[data-id="${target}"]`) : null
      if (!list || !link) {
        setIndicator((current) => ({ ...current, visible: false }))
        return
      }
      setIndicator({ left: link.offsetLeft, width: link.offsetWidth, visible: true })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [target, scrolled])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    const onScroll = () => setOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
    }
  }, [open])

  return (
    <header className="pointer-events-none fixed inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] z-50 flex flex-col items-center pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] md:top-4">
      <nav
        aria-label="Primary"
        className={`pointer-events-auto relative flex w-full max-w-max items-center justify-between gap-1 rounded-full border border-white/10 bg-ink/85 text-paper shadow-[0_18px_50px_-20px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-[padding,background-color] duration-300 ease-out-quart max-lg:max-w-[440px] ${
          scrolled ? 'bg-ink/92 py-1.5 pl-3 pr-1.5' : 'py-2 pl-4 pr-2'
        }`}
      >
        <a href="#top" className="flex items-center gap-2 rounded-full pr-3" aria-label="Refweir, back to top">
          <LogoMark className="size-[18px]" />
          <span className="text-[15px] font-semibold tracking-[-0.02em]">refweir</span>
        </a>

        <ul ref={listRef} className="relative hidden items-center lg:flex" onMouseLeave={() => setHovered(null)}>
          <span
            aria-hidden="true"
            className="absolute inset-y-0 rounded-full bg-white/10 transition-[left,width,opacity] duration-300 ease-out-expo"
            style={{ left: indicator.left, width: indicator.width, opacity: indicator.visible ? 1 : 0 }}
          />
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id
            return (
              <li key={link.id}>
                <a
                  data-id={link.id}
                  href={`#${link.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  onMouseEnter={() => setHovered(link.id)}
                  onFocus={() => setHovered(link.id)}
                  onBlur={() => setHovered(null)}
                  className={`relative z-10 block rounded-full px-3 py-1.5 text-[13px] transition-colors duration-200 ${
                    isActive || hovered === link.id ? 'text-paper' : 'text-paper/55'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-1">
          <a
            href="/docs"
            className="hidden sm:inline-flex items-center rounded-full px-3 py-1.5 text-[13px] text-paper/70 transition-colors duration-200 hover:text-paper"
          >
            Docs
          </a>
          <a
            href="https://github.com/RavaniRoshan/refweir"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center rounded-full px-3 py-1.5 text-[13px] text-paper/70 transition-colors duration-200 hover:text-paper"
          >
            Source
          </a>
          <button
            type="button"
            onClick={toggleTheme}
            className="relative grid size-9 place-items-center rounded-full transition-colors duration-200 hover:bg-white/10 before:absolute before:-inset-1.5 before:rounded-full before:content-['']"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <a
            href="#start"
            className="ml-2 inline-flex h-9 items-center rounded-full bg-signal px-4 text-[13px] font-semibold text-on-signal transition-colors duration-200 hover:bg-paper hover:text-ink"
          >
            Self-host
          </a>
          <button
            type="button"
            className="relative grid size-9 place-items-center rounded-full transition-colors duration-200 hover:bg-white/10 before:absolute before:-inset-1.5 before:rounded-full before:content-[''] lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            <span aria-hidden="true" className="relative block h-3 w-4">
              <span
                className={`absolute left-0 h-px w-4 bg-current transition-transform duration-300 ease-out-expo ${
                  open ? 'top-1.5 rotate-45' : 'top-0.5'
                }`}
              />
              <span
                className={`absolute left-0 h-px w-4 bg-current transition-transform duration-300 ease-out-expo ${
                  open ? 'top-1.5 -rotate-45' : 'top-2.5'
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        inert={!open}
        className={`pointer-events-auto mt-2 w-full max-w-[440px] origin-top overscroll-contain rounded-[26px] border border-white/10 bg-ink/95 p-2 text-paper backdrop-blur-xl transition-[opacity,transform] duration-300 ease-out-expo lg:hidden ${
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        <ul>
          {NAV_LINKS.map((link, index) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between rounded-2xl px-4 py-3 text-[22px] font-semibold tracking-[-0.03em] transition-colors duration-200 hover:bg-white/[0.06]"
              >
                {link.label}
                <span className="type-label text-smoke">{String(index + 2).padStart(2, '0')}</span>
              </a>
            </li>
          ))}
          <li>
            <a
              href="/docs"
              onClick={() => setOpen(false)}
              className="flex items-baseline justify-between rounded-2xl px-4 py-3 text-[22px] font-semibold tracking-[-0.03em] transition-colors duration-200 hover:bg-white/[0.06]"
            >
              Docs
              <span className="type-label text-smoke">{String(NAV_LINKS.length + 2).padStart(2, '0')}</span>
            </a>
          </li>
          <li>
            <a
              href="https://github.com/RavaniRoshan/refweir"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-baseline justify-between rounded-2xl px-4 py-3 text-[22px] font-semibold tracking-[-0.03em] transition-colors duration-200 hover:bg-white/[0.06]"
            >
              Source
              <span className="type-label text-smoke">{String(NAV_LINKS.length + 3).padStart(2, '0')}</span>
            </a>
          </li>
          <li className="pt-2 px-2 pb-1">
            <a
              href="#start"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center rounded-full bg-signal py-3 text-center text-[15px] font-semibold text-on-signal transition-colors duration-200 hover:bg-paper hover:text-ink"
            >
              Self-host
            </a>
          </li>
        </ul>
      </div>
      {open && (
        <div
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden pointer-events-auto"
        />
      )}
    </header>
  )
}
