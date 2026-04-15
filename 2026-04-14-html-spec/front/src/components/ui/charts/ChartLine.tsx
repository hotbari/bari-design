'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartLineProps {
  data: Record<string, unknown>[]
  xKey: string
  lines: { key: string; color: string; label: string }[]
  height?: number
}

export function ChartLine({ data, xKey, lines, height = 280 }: ChartLineProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        {lines.map(l => (
          <Line key={l.key} type="monotone" dataKey={l.key} stroke={l.color} name={l.label} dot={false} strokeWidth={2} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
