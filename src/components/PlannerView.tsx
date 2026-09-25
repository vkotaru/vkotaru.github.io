/**
 * The autonomous-driving tile: a planner's-eye view, drawn rather than filmed.
 *
 * Everything on screen is something the job actually involves -- centre paint
 * that has worn away to nothing, a stopped vehicle blocking the lane, the fan
 * of candidate trajectories, the one that gets chosen, its discretisation
 * nodes, and the corridor the solution has to stay inside.
 *
 * Top-down rather than through a windscreen, because that is how a planner is
 * actually looked at. Laid out along 16:9 to match the panels beside it: the
 * tiles crop with `slice`, and a portrait scene lost the ego vehicle off the
 * bottom edge.
 *
 * Pure SVG: sharp at any density, no network request, no licence. Nodes are
 * evaluated on the same cubic that draws the path, so they cannot drift off
 * it when the curve is tuned.
 */

type P = readonly [number, number]

/** Point on the cubic Bezier through p0,p1,p2,p3 at parameter t. */
function bezier(t: number, p0: P, p1: P, p2: P, p3: P): P
{
  const u = 1 - t
  const [a, b, c, d] = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t]
  return [
    a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
    a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
  ]
}

const d = (p0: P, p1: P, p2: P, p3: P) =>
  `M ${p0[0]} ${p0[1]} C ${p1[0]} ${p1[1]}, ${p2[0]} ${p2[1]}, ${p3[0]} ${p3[1]}`

// Road runs left to right: near lane centred on y=158, far lane on y=84,
// worn centre paint along y=121.
const EGO: P = [58, 158]
const START: P = [84, 158]
const PLAN: [P, P, P, P] = [START, [168, 158], [186, 84], [398, 84]]

// What the solver also tried: too timid (clips the stopped vehicle), too
// aggressive (leaves the carriageway), and near misses either side.
const CANDIDATES: [P, P, P, P][] = [
  [START, [190, 158], [214, 140], [398, 138]],
  [START, [180, 158], [200, 112], [398, 108]],
  [START, [156, 158], [176, 74], [398, 66]],
  [START, [140, 158], [162, 52], [398, 44]],
  [START, [128, 156], [150, 36], [398, 26]],
]

// Two stretches of the centre line have gone entirely; the rest is faint.
// This is the degraded-road case, where the paint is not a usable lane cue.
const DASHES = Array.from({ length: 13 }, (_, i) => ({
  x: 14 + i * 31,
  gone: [3, 4, 9].includes(i),
  opacity: 0.2 + 0.32 * ((i * 7) % 5) / 4,
})).filter(x => !x.gone)

export default function PlannerView({ className = '' }: { className?: string })
{
  return (
    <svg
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="A planner's view of a road: candidate trajectories fanning out around a stopped vehicle, one chosen path with its discretisation nodes, and worn-away lane paint"
      className={className}
    >
      <defs>
        <linearGradient id="pv-asphalt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#252f3e" />
          <stop offset="100%" stopColor="#1a2330" />
        </linearGradient>
        <linearGradient id="pv-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="pv-corridor" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      <rect width="400" height="225" fill="#0c131d" />

      {/* Cost-map grid on the verge */}
      <g stroke="#38bdf8" strokeOpacity="0.09" strokeWidth="1">
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1="0" y1={i * 20} x2="400" y2={i * 20} />
        ))}
        {Array.from({ length: 21 }, (_, i) => (
          <line key={i} x1={i * 20} y1="0" x2={i * 20} y2="225" />
        ))}
      </g>

      {/* Carriageway */}
      <rect x="0" y="46" width="400" height="150" fill="url(#pv-asphalt)" />
      <line x1="0" y1="196" x2="400" y2="196" stroke="#e2e8f0" strokeOpacity="0.3" strokeWidth="2.5" />
      <line
        x1="0" y1="46" x2="400" y2="46"
        stroke="#e2e8f0" strokeOpacity="0.16" strokeWidth="2.5"
        strokeDasharray="70 30 130 44"
      />

      {/* Worn centre line */}
      {DASHES.map(x => (
        <rect key={x.x} x={x.x} y="119" width="20" height="4.5" rx="2.2" fill="#facc15" opacity={x.opacity} />
      ))}

      {/* Corridor the solution has to stay inside */}
      <path d={`${d(...PLAN)} L 398 56 C 186 56, 168 130, 84 130 Z`} fill="url(#pv-corridor)" />

      {/* Rejected candidates */}
      <g fill="none" stroke="url(#pv-fade)" strokeWidth="1.5" strokeLinecap="round">
        {CANDIDATES.map((c, i) => <path key={i} d={d(...c)} />)}
      </g>

      {/* Stopped vehicle blocking the near lane */}
      <g>
        <rect x="248" y="141" width="58" height="34" rx="9" fill="#f59e0b" opacity="0.18" />
        <rect x="248" y="141" width="58" height="34" rx="9" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6 5" />
      </g>

      {/* The chosen plan */}
      <path d={d(...PLAN)} fill="none" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" />
      <path
        d={d(...PLAN)}
        fill="none"
        stroke="#ecfeff"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeDasharray="8 12"
        className="plan-sweep"
      />

      {/* Discretisation nodes, evaluated on the plan itself */}
      {Array.from({ length: 8 }, (_, i) =>
      {
        const t = (i + 1) / 8
        const [x, y] = bezier(t, ...PLAN)
        return <circle key={i} cx={x} cy={y} r={3.4 - 1.3 * t} fill="#ecfeff" opacity={0.95 - 0.4 * t} />
      })}

      {/* Ego */}
      <g>
        <rect x={EGO[0] - 29} y={EGO[1] - 17} width="58" height="34" rx="9" fill="#e2e8f0" />
        <rect x={EGO[0] - 21} y={EGO[1] - 9} width="20" height="18" rx="5" fill="#64748b" />
        <rect x={EGO[0] + 23} y={EGO[1] - 7} width="7" height="14" rx="3" fill="#38bdf8" />
      </g>
    </svg>
  )
}
