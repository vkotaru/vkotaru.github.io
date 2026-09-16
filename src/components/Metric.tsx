'use client'

import type { MetricProps } from '@/lib/metrics'

/**
 * One metric: the payload behind every way of showing a set of them.
 *
 *   <Metric icon="🎯" name="Region of attraction" short="how far can you push it"
 *           scores={{ LQR: 2, MPC: 4 }}>
 *     How far from the setpoint can you take the system ...
 *   </Metric>
 *
 * It never renders on its own -- the container reads its props and body. It has
 * to be a *client* component even though it renders nothing: a server component
 * here would be rendered away by MDX before the container ever sees it, leaving
 * the container a list of bare <p> elements with no icon, name or scores.
 */
export function Metric({ children }: MetricProps)
{
  return <>{children}</>
}

export default Metric
