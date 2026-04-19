'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const chartData = [
  { time: '00:00', level: 45, threshold: 75 },
  { time: '02:00', level: 52, threshold: 75 },
  { time: '04:00', level: 48, threshold: 75 },
  { time: '06:00', level: 65, threshold: 75 },
  { time: '08:00', level: 72, threshold: 75 },
  { time: '10:00', level: 78, threshold: 75 },
  { time: '12:00', level: 82, threshold: 75 },
  { time: '14:00', level: 75, threshold: 75 },
  { time: '16:00', level: 68, threshold: 75 },
  { time: '18:00', level: 62, threshold: 75 },
  { time: '20:00', level: 55, threshold: 75 },
  { time: '22:00', level: 50, threshold: 75 },
];

export default function WaterLevelChart() {
  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">Water Level Trend (24h)</h3>
        <p className="text-sm text-slate-500 mt-1">Real-time monitoring over the last 24 hours</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="time"
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            label={{ value: 'Level (m)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value) => `${value}m`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="level"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
            name="Current Level"
          />
          <Line
            type="monotone"
            dataKey="threshold"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Critical Threshold"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Info Bar */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase">Min Level</p>
          <p className="text-lg font-bold text-blue-600 mt-1">45m</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase">Max Level</p>
          <p className="text-lg font-bold text-red-600 mt-1">82m</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase">Avg Level</p>
          <p className="text-lg font-bold text-green-600 mt-1">64m</p>
        </div>
      </div>
    </div>
  );
}
