'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartBarProps {
  data: Record<string, unknown>[]
  xKey: string
  bars: { key: string; color: string; label: string }[]
  height?: number
}

export function ChartBar({ data, xKey, bars, height = 280 }: ChartBarProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        {bars.map(b => (
          <Bar key={b.key} dataKey={b.key} fill={b.color} name={b.label} radius={[3, 3, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
