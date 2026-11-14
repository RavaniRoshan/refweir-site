import { Reveal, RevealLines } from '../lib/motion'
import { SectionLabel } from '../components/ui'

const BENEFITS = [
  { value: '1', unit: 'binary', text: 'UI, database and Git object store in one hermetic executable.' },
  { value: '0', unit: 'cgo', text: 'Compiled with CGO_ENABLED=0. No host OpenSSH, no system libraries.' },
  { value: '60', unit: 'minutes', text: 'Default lease lifetime. Agent credentials expire on their own.' },
  { value: '2', unit: 'transports', text: 'Smart-HTTP on :8080 and SSH on :2222, both in pure Go.' },
  { value: '0', unit: 'vendors', text: 'No account to create, no cloud to trust. Any agent, any model.' },
]

const SERVER_PHOTO =
  'https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?q=80&w=1200&h=1500&auto=format&fit=crop'

export function Benefits() {
  return (
    <section aria-labelledby="benefits-title" className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
      <div className="grid gap-12 md:grid-cols-12 md:gap-6">
        <Reveal className="md:col-span-5 lg:col-span-4">
          <figure className="group relative aspect-[4/5] overflow-hidden rounded-[20px] bg-ink md:sticky md:top-28">
            <img
              src={SERVER_PHOTO}
              alt="Sunlight diffusing through turquoise water"
              width={1200}
              height={1500}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.04]"
            />
            <figcaption className="absolute inset-x-3 bottom-3 rounded-[16px] bg-sheet p-5 text-ink shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)] md:inset-x-4 md:bottom-4 md:p-6">
              <p className="type-label text-mute">Fig. 4 — On your metal</p>
              <p className="mt-2 text-[24px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[28px]">
                Your hardware.
                <br />
                Your keys. <span className="type-serif text-signal">Your refs.</span>
              </p>
            </figcaption>
          </figure>
        </Reveal>

        <div className="md:col-span-7 md:col-start-6 lg:col-span-7 lg:col-start-6">
          <Reveal>
            <SectionLabel index="04">In short</SectionLabel>
          </Reveal>
          <RevealLines
            id="benefits-title"
            className="type-md mt-6"
            lines={[
              'Small enough to trust.',
              <>
                Strict enough to <span className="type-serif">delegate.</span>
              </>,
            ]}
          />
          <ul className="mt-12 border-t border-ink/15">
            {BENEFITS.map((benefit, index) => (
              <Reveal
                as="li"
                key={benefit.unit}
                delay={index * 90}
                className="group grid grid-cols-[minmax(0,128px)_minmax(0,1fr)] items-baseline gap-5 border-b border-ink/15 py-6 md:grid-cols-[200px_minmax(0,1fr)]"
              >
                <p className="flex items-baseline gap-2">
                  <span className="text-[56px] font-semibold leading-[0.85] tracking-[-0.06em] [font-stretch:80%] md:text-[84px]">
                    {benefit.value}
                  </span>
                  <span className="type-serif text-[20px] text-mute md:text-[24px]">{benefit.unit}</span>
                </p>
                <p className="max-w-[38ch] text-[16px] leading-[1.45] transition-transform duration-300 ease-out-quart group-hover:translate-x-1 md:text-[19px]">
                  {benefit.text}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
