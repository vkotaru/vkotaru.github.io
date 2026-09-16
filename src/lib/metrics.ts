import React from 'react'

/**
 * The shared shape behind <Metric>, and the helper every container uses to read
 * a block of them.
 *
 * This lives outside the component file on purpose: <Metric> has to be a client
 * component (see Metric.tsx), and a server component cannot call a function
 * imported across a 'use client' boundary.
 */
export interface MetricProps
{
  icon: string
  name: string
  /** One short line, used as the subtitle wherever there is room for one. */
  short?: string
  /** Optional per-series rating, 0-5. Only <MetricRadar> reads these. */
  scores?: Record<string, number>
  children: React.ReactNode
}

/** Pull the <Metric> children out of a container's children, ignoring the
 *  whitespace text nodes MDX leaves between them. */
export function collectMetrics(children: React.ReactNode): React.ReactElement<MetricProps>[]
{
  return React.Children.toArray(children).filter(
    (child): child is React.ReactElement<MetricProps> =>
      React.isValidElement(child) && typeof (child.props as MetricProps)?.name === 'string',
  )
}
