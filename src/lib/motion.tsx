import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react'

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(REDUCED_QUERY).matches,
  )
  useEffect(() => {
    const query = window.matchMedia(REDUCED_QUERY)
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return reduced
}

type InViewOptions = { once?: boolean; threshold?: number; rootMargin?: string }

export function useInView<T extends Element = HTMLDivElement>({
  once = false,
  threshold = 0,
  rootMargin = '0px',
}: InViewOptions = {}) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [once, threshold, rootMargin])
  return [ref, inView] as const
}

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType
  delay?: number
  children?: ReactNode
}

/** Viewport-triggered entrance: fades in while rising a short distance. */
export function Reveal({ as = 'div', delay = 0, className = '', style, children, ...rest }: RevealProps) {
  const Tag = as
  const [ref, inView] = useInView<HTMLElement>({ once: true, threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
  return (
    <Tag
      ref={ref}
      data-in={inView ? '' : undefined}
      className={`reveal ${className}`}
      style={{ ...style, '--d': `${delay}ms` } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  )
}

type RevealLinesProps = {
  as?: ElementType
  lines: ReactNode[]
  lineClassNames?: string[]
  className?: string
  delay?: number
  stagger?: number
  id?: string
}

/** Headline reveal: each line slides up from behind its own mask. */
export function RevealLines({
  as = 'h2',
  lines,
  lineClassNames = [],
  className = '',
  delay = 0,
  stagger = 90,
  id,
}: RevealLinesProps) {
  const Tag = as
  const [ref, inView] = useInView<HTMLElement>({ once: true, threshold: 0.2 })
  return (
    <Tag ref={ref} id={id} data-in={inView ? '' : undefined} className={className}>
      {lines.map((line, index) => (
        <span key={index} className={`mask-line ${lineClassNames[index] ?? ''}`}>
          <span style={{ '--d': `${delay + index * stagger}ms` } as CSSProperties}>
            {line}{' '}
          </span>
        </span>
      ))}
    </Tag>
  )
}

/** Advances through a looping sequence while `playing` is true. */
export function useSequence(length: number, durations: readonly number[], playing: boolean) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(
      () => setIndex((current) => (current + 1) % length),
      durations[index % durations.length],
    )
    return () => window.clearTimeout(timer)
  }, [index, playing, length, durations])
  return [index, setIndex] as const
}

/**
 * Looping tick counter for product demonstrations. Restarts from zero whenever
 * it becomes active; with reduced motion it rests on the final, complete state.
 */
export function useTick(active: boolean, interval: number, length: number) {
  const reduced = usePrefersReducedMotion()
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (!active || reduced) return
    setTick(0)
    const timer = window.setInterval(() => setTick((current) => (current + 1) % length), interval)
    return () => window.clearInterval(timer)
  }, [active, reduced, interval, length])
  return reduced ? length - 1 : tick
}

/** Subtle scroll-linked vertical drift for full-bleed media. */
export function useParallax<T extends HTMLElement>(strength = 60) {
  const ref = useRef<T>(null)
  const reduced = usePrefersReducedMotion()
  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (reduced) {
      element.style.transform = ''
      return
    }
    let frame = 0
    const update = () => {
      frame = 0
      const host = element.parentElement
      if (!host) return
      const rect = host.getBoundingClientRect()
      const viewport = window.innerHeight
      const progress = (rect.top + rect.height / 2 - viewport / 2) / (viewport / 2 + rect.height / 2)
      const clamped = Math.max(-1, Math.min(1, progress))
      element.style.transform = `translate3d(0, ${(clamped * -strength).toFixed(1)}px, 0) scale(1.14)`
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [reduced, strength])
  return ref
}

export function formatClock(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds)
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
