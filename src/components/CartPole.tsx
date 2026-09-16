'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/* ------------------------------------------------------------------ *
 *  Cart-pole simulator
 *
 *  Simple pendulum on a cart: massless rod of length l with the mass m
 *  lumped at the tip, pivoting at the cart's centre of mass.
 *
 *  State  z = [x, xdot, theta, thetadot],  theta measured from the DOWNWARD
 *  vertical, positive counter-clockwise (toward +x), so theta = 0 is hanging
 *  and theta = pi is upright.
 *
 *  (M+m) xdd + m l cos(t) tdd - m l sin(t) td^2 = u - b xd
 *  m l^2 tdd + m l cos(t) xdd + m g l sin(t) = -c td
 *
 *  (p.L is the pole length l, pivot to tip mass.)
 * ------------------------------------------------------------------ */

export type CartPoleMode = 'passive' | 'lqr' | 'swingup'

export interface CartPoleProps
{
  mode?: CartPoleMode
  caption?: string
  /** Initial angle in degrees from hanging (0 = down, 180 = upright). */
  theta0?: number
  cartMass?: number
  poleMass?: number
  poleLength?: number
  gravity?: number
  cartDamping?: number
  pivotDamping?: number
  /** Effort penalty R in the LQR cost. */
  effort?: number
  /** Energy-shaping gain for swing-up. */
  swingGain?: number
  /** Max actuator force, N. */
  forceLimit?: number
  showSliders?: boolean
  /** Expose the viscous friction coefficients b and c as inputs. */
  showFriction?: boolean
  /** Expose the controller's assumed parameters, so they can be detuned
   *  away from the true plant. */
  showModel?: boolean
  showReadout?: boolean
  height?: number
  /** Width as a percentage when floated beside article text. */
  width?: number
  /** Float the simulator beside the following article text. */
  align?: 'left' | 'right' | 'center'
}

interface Params
{
  M: number
  m: number
  L: number
  g: number
  b: number
  c: number
  R: number
  kE: number
  umax: number
  /** Start angle in degrees from hanging; drives Reset. Not a plant param. */
  th0: number
  /** What the CONTROLLER believes the plant is. Only used to design the gain,
   *  never to integrate, so these can be deliberately wrong. */
  Mh: number
  mh: number
  Lh: number
}

type State = [number, number, number, number]

const TWO_PI = Math.PI * 2

function wrap(a: number): number
{
  let r = (a + Math.PI) % TWO_PI
  if (r < 0) r += TWO_PI
  return r - Math.PI
}

function clamp(v: number, lo: number, hi: number): number
{
  return v < lo ? lo : v > hi ? hi : v
}

/* ----------------------------- layout ----------------------------- *
 *  The pole must stay on screen at BOTH extremes -- straight up and
 *  hanging straight down -- so the pixels-per-metre scale is the tightest
 *  of the horizontal track fit and the two vertical fits. The pivot sits
 *  at mid-height to give the hanging pole somewhere to go.
 * ------------------------------------------------------------------ */

const PAD_TOP = 28      // leaves room for the mode badge
const PAD_BOTTOM = 16   // leaves room below the hatching
const TRACK_M = 5.2     // metres of track to aim for across the canvas

// Cart body and wheels, in metres, so the whole rig scales together.
const CART_W = 0.5
const CART_H = 0.22
const WHEEL_R = 0.05
// The pivot is the cart's centre, so only half the body sits below it.
const RIG_DEPTH = CART_H / 2 + 2 * WHEEL_R

/**
 * The pivot is the world origin and sits at the TOP of the cart; the body,
 * wheels and rail hang below it. The scale is the tightest of the horizontal
 * track fit and the two vertical fits, so the pole stays on screen both
 * straight up and straight down, at any length.
 */
function layout(W: number, H: number, L: number)
{
  const pivotY = H * 0.5
  // Below the pivot we must fit whichever is deeper: the hanging pole, or
  // the cart rig plus its hatching.
  const below = Math.max(L, RIG_DEPTH + 0.12)
  const scale = Math.max(
    1,
    Math.min(W / TRACK_M, (pivotY - PAD_TOP) / L, (H - PAD_BOTTOM - pivotY) / below)
  )
  return { scale, pivotY }
}

/** Screen geometry of the cart rig, derived from the pivot so nothing drifts. */
function rig(pivotY: number, scale: number)
{
  const bodyH = CART_H * scale
  const wheelR = Math.max(2.5, WHEEL_R * scale)
  const bodyTop = pivotY - bodyH / 2
  const bodyBottom = pivotY + bodyH / 2
  const wheelCY = bodyBottom + wheelR
  return {
    bodyW: CART_W * scale,
    bodyH,
    wheelR,
    bodyTop,
    bodyBottom,
    wheelCY,
    railY: wheelCY + wheelR,   // wheels rest exactly on the rail
  }
}

/* ---------------------------- dynamics ---------------------------- */

/** Continuous-time derivative of the state given an applied force. */
function deriv(z: State, F: number, p: Params): State
{
  const [, xd, th, td] = z
  const l = p.L
  const s = Math.sin(th)
  const cth = Math.cos(th)

  const A = F - p.b * xd + p.m * l * s * td * td
  const B = -p.m * p.g * l * s - p.c * td
  const D = (p.M + p.m) * (p.m * l * l) - p.m * p.m * l * l * cth * cth

  const xdd = (p.m * l * l * A - p.m * l * cth * B) / D
  const tdd = ((p.M + p.m) * B - p.m * l * cth * A) / D
  return [xd, xdd, td, tdd]
}

function rk4(z: State, F: number, p: Params, dt: number): State
{
  const k1 = deriv(z, F, p)
  const z2: State = [z[0] + dt / 2 * k1[0], z[1] + dt / 2 * k1[1], z[2] + dt / 2 * k1[2], z[3] + dt / 2 * k1[3]]
  const k2 = deriv(z2, F, p)
  const z3: State = [z[0] + dt / 2 * k2[0], z[1] + dt / 2 * k2[1], z[2] + dt / 2 * k2[2], z[3] + dt / 2 * k2[3]]
  const k3 = deriv(z3, F, p)
  const z4: State = [z[0] + dt * k3[0], z[1] + dt * k3[1], z[2] + dt * k3[2], z[3] + dt * k3[3]]
  const k4 = deriv(z4, F, p)
  return [
    z[0] + dt / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
    z[1] + dt / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
    z[2] + dt / 6 * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]),
    z[3] + dt / 6 * (k1[3] + 2 * k2[3] + 2 * k3[3] + k4[3]),
  ]
}

/** Pendulum energy, zeroed on orbits that reach the upright equilibrium. */
function energy(z: State, p: Params): number
{
  const l = p.L
  return 0.5 * p.m * l * l * z[3] * z[3] - p.m * p.g * l * (1 + Math.cos(z[2]))
}

/* ------------------------------ LQR ------------------------------- *
 *  Solved in the browser by iterating the discrete Riccati recursion
 *  on a finely-sampled discretisation of the linearised plant. With a
 *  small step this converges to the continuous-time LQR gain.
 * ------------------------------------------------------------------ */

function lqrGain(p: Params, q: number[]): number[]
{
  const l = p.L

  // zdot = A z + B u with z = [x, xdot, phi, phidot], phi = theta - pi,
  // i.e. linearised about the UPRIGHT equilibrium.
  const A = [
    [0, 1, 0, 0],
    [0, 0, (p.m * p.g) / p.M, 0],
    [0, 0, 0, 1],
    [0, 0, (p.g * (p.M + p.m)) / (l * p.M), 0],
  ]
  const B = [0, 1 / p.M, 0, 1 / (l * p.M)]

  const h = 0.002
  // Euler discretisation is enough at this step size
  const Ad = A.map((row, i) => row.map((v, j) => (i === j ? 1 : 0) + v * h))
  const Bd = B.map((v) => v * h)
  const Qd = q.map((v) => v * h)
  const Rd = p.R * h

  let P = [
    [Qd[0], 0, 0, 0],
    [0, Qd[1], 0, 0],
    [0, 0, Qd[2], 0],
    [0, 0, 0, Qd[3]],
  ]
  let K = [0, 0, 0, 0]

  for (let iter = 0; iter < 20000; iter++)
  {
    // PA (4x4), PB (4x1)
    const PA: number[][] = []
    for (let i = 0; i < 4; i++)
    {
      PA.push([0, 0, 0, 0])
      for (let j = 0; j < 4; j++)
      {
        let s = 0
        for (let k = 0; k < 4; k++) s += P[i][k] * Ad[k][j]
        PA[i][j] = s
      }
    }
    const PB = [0, 0, 0, 0]
    for (let i = 0; i < 4; i++)
    {
      let s = 0
      for (let k = 0; k < 4; k++) s += P[i][k] * Bd[k]
      PB[i] = s
    }

    let BPB = 0
    for (let k = 0; k < 4; k++) BPB += Bd[k] * PB[k]
    const inv = 1 / (Rd + BPB)

    // K = inv * B' P A   (1x4)
    const Knew = [0, 0, 0, 0]
    for (let j = 0; j < 4; j++)
    {
      let s = 0
      for (let k = 0; k < 4; k++) s += Bd[k] * PA[k][j]
      Knew[j] = inv * s
    }

    // Pnew = Q + A'PA - (A'PB) K
    const Pnew: number[][] = []
    let delta = 0
    for (let i = 0; i < 4; i++)
    {
      Pnew.push([0, 0, 0, 0])
      let APBi = 0
      for (let k = 0; k < 4; k++) APBi += Ad[k][i] * PB[k]
      for (let j = 0; j < 4; j++)
      {
        let APAij = 0
        for (let k = 0; k < 4; k++) APAij += Ad[k][i] * PA[k][j]
        const v = (i === j ? Qd[i] : 0) + APAij - APBi * Knew[j]
        Pnew[i][j] = v
        delta = Math.max(delta, Math.abs(v - P[i][j]))
      }
    }

    P = Pnew
    K = Knew
    if (delta < 1e-10 && iter > 50) break
    if (!isFinite(delta)) return [0, 0, 0, 0]
  }

  // u = -K z is the same control law for the discrete and the continuous
  // problem, so the gain needs no rescaling by the step size.
  return K
}

/* ---------------------------- controllers -------------------------- */

/** Pole tip position relative to the pivot, in metres. */
function tipX_rel(z: State, p: Params): number { return p.L * Math.sin(z[2]) }
function tipY_rel(z: State, p: Params): number { return -p.L * Math.cos(z[2]) }

/** Force that produces a commanded cart acceleration (exact, not linearised). */
function forceForAccel(z: State, aDes: number, p: Params): number
{
  const [, xd, th, td] = z
  const l = p.L
  const s = Math.sin(th)
  const cth = Math.cos(th)
  const tdd = (-p.m * l * cth * aDes - p.m * p.g * l * s - p.c * td) / (p.m * l * l)
  return (p.M + p.m) * aDes + p.m * l * cth * tdd - p.m * l * s * td * td + p.b * xd
}

function swingUpForce(z: State, p: Params): number
{
  const l = p.L
  const Escale = p.m * p.g * l                 // natural energy scale
  const w0 = Math.sqrt(p.g / l)                // natural frequency
  const aMax = (0.8 * p.umax) / (p.M + p.m)

  // Pumping term. a = k g (E/mgl) sat(thetadot cos(theta) / w0) gives
  // dV/dt <= 0 for V = E^2/2, and leaves k dimensionless so one gain works
  // across the whole parameter range.
  let aEnergy = p.kE * p.g * (energy(z, p) / Escale) * clamp((z[3] * Math.cos(z[2])) / w0, -1, 1)

  // Hanging straight down at rest is a fixed point of the pumping law, so
  // break out of it deliberately. Hanging is theta = 0 in this convention.
  if (Math.abs(z[3]) < 0.08 && Math.abs(wrap(z[2])) < 0.5) aEnergy = 0.4 * aMax

  // Recentre the cart, but never with more authority than the pumping has --
  // otherwise it starves the swing-up for light poles.
  const aCap = Math.min(0.3 * p.kE * p.g, 0.35 * aMax)
  const aCentre = clamp(-1.2 * z[0] - 1.8 * z[1], -aCap, aCap)

  return forceForAccel(z, clamp(aEnergy + aCentre, -aMax, aMax), p)
}

/* ----------------------------- component --------------------------- */

/** Decimal places implied by a step, so 0.05 shows as "1.00" and 1 as "25". */
function decimalsFor(step: number): number
{
  return Math.max(0, -Math.floor(Math.log10(step)))
}

/**
 * Numeric entry for one plant parameter.
 *
 * The typed text is held locally and only mirrored back from `value` while
 * unfocused: clamping the text as you type fights you (typing "0" on the way
 * to "0.8" would snap to the minimum). The committed number is clamped, the
 * text is not, and blur reconciles the two.
 */
function NumberField({ label, value, min, max, step, unit, onCommit }: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onCommit: (v: number) => void
})
{
  const digits = decimalsFor(step)
  const [text, setText] = useState(() => value.toFixed(digits))
  const [focused, setFocused] = useState(false)

  useEffect(() =>
  {
    if (!focused) setText(value.toFixed(digits))
  }, [value, digits, focused])

  return (
    <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
      <span className="flex-1 min-w-0 truncate">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={text}
        onFocus={() => setFocused(true)}
        onBlur={() =>
        {
          setFocused(false)
          setText(value.toFixed(digits))
        }}
        onChange={(e) =>
        {
          setText(e.target.value)
          const v = parseFloat(e.target.value)
          if (Number.isFinite(v)) onCommit(clamp(v, min, max))
        }}
        className="w-[4.5rem] flex-shrink-0 rounded border border-gray-300 dark:border-slate-600
                   bg-white dark:bg-slate-900 px-1.5 py-0.5 text-right font-mono
                   tabular-nums text-gray-800 dark:text-gray-200
                   focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <span className="flex-shrink-0 text-[10px] text-gray-400">{unit}</span>
    </label>
  )
}

const SLIDER_META: Record<string, { label: string; min: number; max: number; step: number; unit: string }> = {
  M: { label: 'Cart mass', min: 0.2, max: 4, step: 0.05, unit: 'kg' },
  m: { label: 'Pole mass', min: 0.1, max: 1, step: 0.05, unit: 'kg' },
  L: { label: 'Pole length', min: 0.4, max: 2, step: 0.05, unit: 'm' },
  g: { label: 'Gravity', min: 1.6, max: 20, step: 0.1, unit: 'm/s²' },
  R: { label: 'Effort penalty R', min: 0.01, max: 100, step: 0.01, unit: '' },
  kE: { label: 'Swing-up gain', min: 2, max: 20, step: 0.5, unit: '' },
  umax: { label: 'Max force', min: 1, max: 200, step: 1, unit: 'N' },
  th0: { label: 'Start angle', min: -180, max: 180, step: 1, unit: '°' },
  b: { label: 'Cart friction', min: 0, max: 2, step: 0.05, unit: 'Ns/m' },
  c: { label: 'Pivot friction', min: 0, max: 0.1, step: 0.005, unit: 'Nms' },
  Mh: { label: 'Assumed M', min: 0.2, max: 4, step: 0.05, unit: 'kg' },
  mh: { label: 'Assumed m', min: 0.1, max: 1, step: 0.05, unit: 'kg' },
  Lh: { label: 'Assumed l', min: 0.4, max: 2, step: 0.05, unit: 'm' },
}

export default function CartPole({
  mode = 'lqr',
  caption,
  theta0,
  cartMass = 1,
  poleMass = 0.25,
  poleLength = 1,
  gravity = 9.81,
  cartDamping = 0,
  pivotDamping = 0,
  effort = 0.05,
  swingGain = 6,
  forceLimit = 25,
  showSliders = true,
  showFriction = false,
  showModel = false,
  showReadout = true,
  height = 380,
  width = 100,
  align = 'center',
}: CartPoleProps)
{
  // Degrees from hanging: 0 is down, 180 is upright.
  const defaultTheta0Deg = theta0 !== undefined
    ? theta0
    : mode === 'lqr' ? 170 : mode === 'swingup' ? 0 : 25

  const [params, setParams] = useState<Params>({
    M: cartMass,
    m: poleMass,
    L: poleLength,
    g: gravity,
    b: cartDamping,
    c: pivotDamping,
    R: effort,
    kE: swingGain,
    umax: forceLimit,
    th0: defaultTheta0Deg,
    Mh: cartMass,
    mh: poleMass,
    Lh: poleLength,
  })
  const [running, setRunning] = useState(true)
  const [readout, setReadout] = useState({ th: 0, td: 0, x: 0, F: 0, E: 0, balancing: false })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<State>([0, 0, (defaultTheta0Deg * Math.PI) / 180, 0])
  const paramsRef = useRef(params)
  const runningRef = useRef(running)
  const trailRef = useRef<{ x: number; y: number }[]>([])
  const forceRef = useRef(0)
  const balancingRef = useRef(mode === 'lqr')
  const dragRef = useRef<{ kind: 'pole' | 'cart'; last: number; lastT: number } | null>(null)
  const gainRef = useRef<number[]>([0, 0, 0, 0])

  paramsRef.current = params
  runningRef.current = running

  // Cost weights: [x, xdot, theta, thetadot]
  const Q = useMemo(() => [1.2, 0.6, 22, 2.2], [])
  // The gain is designed on what the controller BELIEVES the plant is, which
  // is not necessarily the plant it is driving. th0 is excluded because it is
  // UI state, not a parameter -- otherwise editing it re-runs Riccati.
  const { Mh, mh, Lh, g, R } = params
  const model = useMemo<Params>(
    () => ({
      M: Mh, m: mh, L: Lh, g, b: 0, c: 0, R,
      kE: 0, umax: 0, th0: 0, Mh, mh, Lh,
    }),
    [Mh, mh, Lh, g, R]
  )
  const gain = useMemo(() => lqrGain(model, Q), [model, Q])
  gainRef.current = gain

  const reset = useCallback(() =>
  {
    stateRef.current = [0, 0, (paramsRef.current.th0 * Math.PI) / 180, 0]
    trailRef.current = []
    forceRef.current = 0
    balancingRef.current = mode === 'lqr'
    setRunning(true)
  }, [mode])

  /* ---- pointer interaction: grab the pole, or shove the cart ---- */

  const toWorld = useCallback((e: React.PointerEvent<HTMLCanvasElement>) =>
  {
    const cv = canvasRef.current!
    const rect = cv.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    const { scale, pivotY } = layout(rect.width, rect.height, paramsRef.current.L)
    return { x: (px - rect.width / 2) / scale, y: (pivotY - py) / scale, scale }
  }, [])

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) =>
  {
    const w = toWorld(e)
    const z = stateRef.current
    const p = paramsRef.current
    const tipX = z[0] + p.L * Math.sin(z[2])
    const tipY = -p.L * Math.cos(z[2])
    const dTip = Math.hypot(w.x - tipX, w.y - tipY)
    // The cart body hangs below the pivot (world y in [-RIG_DEPTH, 0]).
    const overCart = Math.abs(w.x - z[0]) < CART_W * 0.6
      && w.y < CART_H / 2 + 0.04 && w.y > -RIG_DEPTH - 0.06

    // Distance from the pointer to the pole segment, so grabbing works at any
    // angle including hanging.
    const t = clamp(((w.x - z[0]) * tipX_rel(z, p) + w.y * tipY_rel(z, p)) / (p.L * p.L), 0, 1)
    const dPole = Math.hypot(w.x - z[0] - t * tipX_rel(z, p), w.y - t * tipY_rel(z, p))

    if (dTip < 0.35 || (!overCart && dPole < 0.16))
    {
      dragRef.current = { kind: 'pole', last: z[2], lastT: performance.now() }
    } else if (overCart)
    {
      dragRef.current = { kind: 'cart', last: z[0], lastT: performance.now() }
    } else
    {
      return
    }
    balancingRef.current = mode === 'lqr'
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [mode, toWorld])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) =>
  {
    const drag = dragRef.current
    if (!drag) return
    const w = toWorld(e)
    const z = stateRef.current
    const now = performance.now()
    const dt = Math.max((now - drag.lastT) / 1000, 1 / 240)

    if (drag.kind === 'pole')
    {
      // theta = 0 is straight down, so measure against -y.
      const raw = Math.atan2(w.x - z[0], -w.y)
      // keep theta continuous across the +/-pi seam
      const th = z[2] + wrap(raw - z[2])
      z[3] = clamp((th - drag.last) / dt, -18, 18)
      z[2] = th
      drag.last = th
    } else
    {
      const x = clamp(w.x, -2.3, 2.3)
      z[1] = clamp((x - drag.last) / dt, -12, 12)
      z[0] = x
      drag.last = x
    }
    drag.lastT = now
  }, [toWorld])

  const onPointerUp = useCallback(() => { dragRef.current = null }, [])

  /* ------------------------ simulation loop ------------------------ */

  useEffect(() =>
  {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let prev = performance.now()
    let acc = 0
    let uiClock = 0
    const H = 1 / 480

    const root = document.documentElement
    let isDark = root.classList.contains('dark')
    const themeObserver = new MutationObserver(() =>
    {
      isDark = root.classList.contains('dark')
    })
    themeObserver.observe(root, { attributes: true, attributeFilter: ['class'] })

    let W = 0
    let Hh = 0
    const resize = () =>
    {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      W = rect.width
      Hh = rect.height
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(Hh * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const control = (z: State, p: Params): number =>
    {
      if (mode === 'passive') return 0
      const K = gainRef.current
      // phi: displacement from UPRIGHT, which is theta = pi here.
      const thErr = wrap(z[2] - Math.PI)

      if (mode === 'lqr')
      {
        return clamp(-(K[0] * z[0] + K[1] * z[1] + K[2] * thErr + K[3] * z[3]), -p.umax, p.umax)
      }

      // Swing-up: pump energy until the linear controller could hold the pole
      // without saturating, then hand over to it.
      const Flin = -(K[0] * z[0] + K[1] * z[1] + K[2] * thErr + K[3] * z[3])
      if (balancingRef.current)
      {
        if (Math.abs(thErr) > 0.9) balancingRef.current = false
      } else if (Math.abs(thErr) < 0.6 && Math.abs(Flin) < 0.9 * p.umax)
      {
        balancingRef.current = true
      }
      return clamp(balancingRef.current ? Flin : swingUpForce(z, p), -p.umax, p.umax)
    }

    const draw = () =>
    {
      if (W === 0) return
      const p = paramsRef.current
      const z = stateRef.current

      const { scale, pivotY } = layout(W, Hh, p.L)
      const g = rig(pivotY, scale)
      const wx = (m: number) => W / 2 + m * scale
      const wy = (m: number) => pivotY - m * scale

      const bg = isDark ? '#0f172a' : '#ffffff'
      const rail = isDark ? '#334155' : '#cbd5e1'
      const cartFill = isDark ? '#3b82f6' : '#2563eb'
      const poleCol = isDark ? '#e2e8f0' : '#1e293b'
      const bobCol = isDark ? '#f472b6' : '#ea4aaa'
      const faint = isDark ? '#1e293b' : '#f1f5f9'

      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, Hh)

      // track + hatching
      ctx.strokeStyle = rail
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, g.railY)
      ctx.lineTo(W, g.railY)
      ctx.stroke()
      ctx.strokeStyle = faint
      ctx.lineWidth = 1
      for (let i = -12; i <= 12; i++)
      {
        const gx = wx(i * 0.25)
        ctx.beginPath()
        ctx.moveTo(gx, g.railY)
        ctx.lineTo(gx - 8, g.railY + 12)
        ctx.stroke()
      }
      // origin tick
      ctx.strokeStyle = rail
      ctx.setLineDash([4, 5])
      ctx.beginPath()
      ctx.moveTo(W / 2, g.railY)
      ctx.lineTo(W / 2, Hh * 0.06)
      ctx.stroke()
      ctx.setLineDash([])

      // pole-tip trail
      const trail = trailRef.current
      if (trail.length > 1)
      {
        ctx.lineWidth = 2
        for (let i = 1; i < trail.length; i++)
        {
          const a = i / trail.length
          ctx.strokeStyle = isDark
            ? `rgba(244,114,182,${(a * 0.5).toFixed(3)})`
            : `rgba(234,74,170,${(a * 0.45).toFixed(3)})`
          ctx.beginPath()
          ctx.moveTo(wx(trail[i - 1].x), wy(trail[i - 1].y))
          ctx.lineTo(wx(trail[i].x), wy(trail[i].y))
          ctx.stroke()
        }
      }

      const cx = wx(z[0])

      // applied force arrow
      const F = forceRef.current
      if (Math.abs(F) > 0.4)
      {
        const len = clamp(F / p.umax, -1, 1) * 1.0 * scale
        const ay = pivotY
        ctx.strokeStyle = isDark ? '#fbbf24' : '#d97706'
        ctx.fillStyle = ctx.strokeStyle
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(cx, ay)
        ctx.lineTo(cx + len, ay)
        ctx.stroke()
        const dir = Math.sign(len)
        ctx.beginPath()
        ctx.moveTo(cx + len + dir * 10, ay)
        ctx.lineTo(cx + len, ay - 7)
        ctx.lineTo(cx + len, ay + 7)
        ctx.closePath()
        ctx.fill()
      }

      // Wheels first, so the body overlaps their tops.
      ctx.fillStyle = isDark ? '#0f172a' : '#1e293b'
      for (const off of [-g.bodyW / 3.2, g.bodyW / 3.2])
      {
        ctx.beginPath()
        ctx.arc(cx + off, g.wheelCY, g.wheelR, 0, TWO_PI)
        ctx.fill()
      }

      // Cart body: the pivot is its top edge, so it hangs below world y = 0.
      ctx.fillStyle = cartFill
      ctx.beginPath()
      ctx.roundRect(cx - g.bodyW / 2, g.bodyTop, g.bodyW, g.bodyH, Math.min(6, g.bodyH / 3))
      ctx.fill()

      // Pole, drawn from the pivot itself so its length really is L.
      const tipX = wx(z[0] + p.L * Math.sin(z[2]))
      const tipY = wy(-p.L * Math.cos(z[2]))
      ctx.strokeStyle = poleCol
      ctx.lineWidth = Math.max(3, 0.045 * scale)
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(cx, pivotY)
      ctx.lineTo(tipX, tipY)
      ctx.stroke()

      ctx.fillStyle = bobCol
      ctx.beginPath()
      ctx.arc(tipX, tipY, Math.max(5, 0.075 * scale), 0, TWO_PI)
      ctx.fill()
      ctx.fillStyle = isDark ? '#94a3b8' : '#475569'
      ctx.beginPath()
      ctx.arc(cx, pivotY, Math.max(2.5, 0.03 * scale), 0, TWO_PI)
      ctx.fill()

      // mode badge
      ctx.font = '600 12px ui-sans-serif, system-ui, sans-serif'
      ctx.fillStyle = isDark ? '#64748b' : '#94a3b8'
      const badge = mode === 'passive'
        ? 'no control'
        : mode === 'lqr'
          ? 'LQR'
          : balancingRef.current ? 'swing-up → LQR catch' : 'swing-up (energy shaping)'
      ctx.fillText(badge, 12, 20)
    }

    const frame = (now: number) =>
    {
      let dt = (now - prev) / 1000
      prev = now
      if (dt > 0.1) dt = 0.1

      if (runningRef.current)
      {
        acc += dt
        const p = paramsRef.current
        while (acc >= H)
        {
          const z = stateRef.current
          if (dragRef.current)
          {
            forceRef.current = 0
          } else
          {
            forceRef.current = control(z, p)
            stateRef.current = rk4(z, forceRef.current, p, H)
          }
          acc -= H
        }
        const z = stateRef.current
        // keep the cart on the visible track
        if (z[0] > 2.3) { z[0] = 2.3; z[1] = Math.min(z[1], 0) }
        if (z[0] < -2.3) { z[0] = -2.3; z[1] = Math.max(z[1], 0) }

        const p2 = paramsRef.current
        trailRef.current.push({ x: z[0] + p2.L * Math.sin(z[2]), y: -p2.L * Math.cos(z[2]) })
        if (trailRef.current.length > 140) trailRef.current.shift()
      }

      draw()

      uiClock += dt
      if (uiClock > 0.1)
      {
        uiClock = 0
        const z = stateRef.current
        setReadout({
          th: (wrap(z[2]) * 180) / Math.PI,
          td: z[3],
          x: z[0],
          F: forceRef.current,
          E: energy(z, paramsRef.current),
          balancing: balancingRef.current,
        })
      }
      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () =>
    {
      cancelAnimationFrame(raf)
      ro.disconnect()
      themeObserver.disconnect()
    }
  }, [mode])

  // g is fixed at 9.81; not worth an input.
  const baseKeys = mode === 'passive'
    ? ['M', 'm', 'L', 'th0']
    : mode === 'lqr'
      ? ['M', 'm', 'L', 'R', 'umax', 'th0']
      : ['M', 'm', 'L', 'kE', 'umax', 'th0']
  const sliderKeys = [
    ...baseKeys,
    ...(showFriction ? ['b', 'c'] : []),
    ...(showModel ? ['Mh', 'mh', 'Lh'] : []),
  ]

  return (
    <figure
      className={`float-figure float-figure--${align} not-prose my-8`}
      style={{
        '--figure-width': `${Math.min(100, Math.max(25, width))}%`,
        float: align === 'center' ? 'none' : align,
      } as React.CSSProperties}
    >
      <div className="rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
        <canvas
          ref={canvasRef}
          style={{ height, width: '100%', display: 'block', touchAction: 'none', cursor: 'grab' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />

        <div className="cart-pole-controls border-t border-gray-200 dark:border-slate-700 px-4 py-3 bg-gray-50 dark:bg-slate-800/60">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setRunning((r) => !r)}
              className="px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-white hover:bg-primary-dark transition-colors"
            >
              {running ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={reset}
              className="px-3 py-1.5 text-sm font-medium rounded-md bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() =>
              {
                stateRef.current[3] += (Math.random() > 0.5 ? 1 : -1) * (1.6 + Math.random())
                if (mode === 'lqr') balancingRef.current = true
              }}
              className="px-3 py-1.5 text-sm font-medium rounded-md bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
            >
              Nudge
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              drag the pole or the cart
            </span>
          </div>

          {showReadout && (
            /* Equal grid columns broke the longest state ("rad/s" wrapped on
               its own). Flex instead: each state is nowrap and sizes to its
               content, so they wrap as whole units only when genuinely out of
               room. */
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] tabular-nums text-gray-600 dark:text-gray-400">
              <span className="whitespace-nowrap">θ = {readout.th.toFixed(1)}°</span>
              <span className="whitespace-nowrap">θ̇ = {readout.td.toFixed(2)} rad/s</span>
              <span className="whitespace-nowrap">x = {readout.x.toFixed(2)} m</span>
              <span className="whitespace-nowrap">F = {readout.F.toFixed(1)} N</span>
              <span className="whitespace-nowrap">E = {readout.E.toFixed(2)} J</span>
            </div>
          )}

          {showSliders && (
            <div className="cart-pole-field-grid mt-3">
              {sliderKeys.map((key) =>
              {
                const meta = SLIDER_META[key]
                return (
                  <NumberField
                    key={key}
                    label={meta.label}
                    value={(params as any)[key] as number}
                    min={meta.min}
                    max={meta.max}
                    step={meta.step}
                    unit={meta.unit}
                    onCommit={(v) =>
                    {
                      setParams((p) => ({ ...p, [key]: v }))
                      if (key === 'th0')
                      {
                        // Move the pole there immediately, so the field reads
                        // as "set the start angle", not "queue it for Reset".
                        stateRef.current = [0, 0, (v * Math.PI) / 180, 0]
                        trailRef.current = []
                        forceRef.current = 0
                        balancingRef.current = mode === 'lqr'
                      }
                    }}
                  />
                )
              })}
            </div>
          )}

          {mode !== 'passive' && (
            <div className="mt-2 font-mono text-[11px] text-gray-500 dark:text-gray-500">
              K = [{gain.map((k) => k.toFixed(2)).join(', ')}]
            </div>
          )}
        </div>
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-center text-gray-500 dark:text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

