'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { month: 'Jan', revenue: 4200 },
  { month: 'Feb', revenue: 3800 },
  { month: 'Mar', revenue: 5100 },
  { month: 'Apr', revenue: 6200 },
  { month: 'May', revenue: 7800 },
  { month: 'Jun', revenue: 9200 },
  { month: 'Jul', revenue: 10500 },
  { month: 'Aug', revenue: 10200 },
  { month: 'Sep', revenue: 8600 },
  { month: 'Oct', revenue: 6900 },
  { month: 'Nov', revenue: 5400 },
  { month: 'Dec', revenue: 6100 },
];

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(v) => `€${v}`} />
        <Tooltip
          formatter={(value) => [`€${typeof value === 'number' ? value.toLocaleString() : '0'}`, 'Revenue']}
          contentStyle={{ borderRadius: '0.5rem' }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="hsl(var(--primary))"
          fillOpacity={1}
          fill="url(#colorRevenue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
