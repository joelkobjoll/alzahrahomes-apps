'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { month: 'Jan', occupancy: 62 },
  { month: 'Feb', occupancy: 55 },
  { month: 'Mar', occupancy: 70 },
  { month: 'Apr', occupancy: 78 },
  { month: 'May', occupancy: 85 },
  { month: 'Jun', occupancy: 92 },
  { month: 'Jul', occupancy: 95 },
  { month: 'Aug', occupancy: 94 },
  { month: 'Sep', occupancy: 88 },
  { month: 'Oct', occupancy: 76 },
  { month: 'Nov', occupancy: 65 },
  { month: 'Dec', occupancy: 72 },
];

export function OccupancyChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis unit="%" domain={[0, 100]} />
        <Tooltip
          formatter={(value: number) => [`${value}%`, 'Occupancy']}
          contentStyle={{ borderRadius: '0.5rem' }}
        />
        <Bar dataKey="occupancy" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
