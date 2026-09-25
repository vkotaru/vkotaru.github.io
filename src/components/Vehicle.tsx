/**
 * Little vehicle marks for the Experience list -- a robotaxi, a car, a tractor.
 *
 * Drawn here rather than using company logos on purpose: these are generic
 * silhouettes of the kind of machine each job was about, not anybody's
 * trademark. They are decorative, so they carry no accessible name; the
 * company is right next to them in text.
 *
 * Kept deliberately blunt. A first pass had wheel hubs and a small roof
 * sensor, and at 20px the detail turned to mush and the robotaxi was
 * indistinguishable from the car. Big shapes only: the dome has to be obvious
 * and the tractor's rear wheel has to be huge, or they all read the same.
 */
export type VehicleKind = 'robotaxi' | 'car' | 'tractor'

const CAR_BODY =
  'M3 15.6v-2.4c0-.6.4-1.1 1-1.3l1.3-.4 1.7-3c.4-.7 1.1-1.1 1.9-1.1h6.2c.8 0 1.5.4 1.9 1.1l1.7 3 1.3.4c.6.2 1 .7 1 1.3v2.4a.7.7 0 0 1-.7.7H3.7a.7.7 0 0 1-.7-.7z'

export default function Vehicle({ kind, className = '' }: { kind: VehicleKind, className?: string })
{
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" className={className}>
      {kind === 'tractor'
        ? (
          <>
            <rect x="9.2" y="4.6" width="4.4" height="4.6" rx="0.8" />
            <path d="M3.2 16.4v-3.6c0-.4.3-.7.7-.7h2.4l1-3.3c.12-.4.48-.68.9-.68h3.6c.5 0 .9.4.9.9v7.4z" />
            <circle cx="5.8" cy="17.2" r="2.8" />
            <circle cx="16.5" cy="15.2" r="4.6" />
          </>
        )
        : (
          <>
            {kind === 'robotaxi' && (
              <>
                <rect x="11.4" y="5.2" width="1.2" height="2.6" />
                <rect x="10.2" y="2.8" width="3.6" height="2.8" rx="1.4" />
              </>
            )}
            <path d={CAR_BODY} />
            <circle cx="7.2" cy="16.6" r="2.1" />
            <circle cx="16.8" cy="16.6" r="2.1" />
          </>
        )}
    </svg>
  )
}
