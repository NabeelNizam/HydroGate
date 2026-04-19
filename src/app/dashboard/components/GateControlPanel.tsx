'use client';

import { useState } from 'react';
import { Power, Lock } from 'lucide-react';

interface Gate {
  id: string;
  name: string;
  status: 'open' | 'closed' | 'maintenance';
  percentage: number;
  flowRate: number;
}

const initialGates: Gate[] = [
  { id: 'a', name: 'Gate A', status: 'open', percentage: 75, flowRate: 1250 },
  { id: 'b', name: 'Gate B', status: 'closed', percentage: 0, flowRate: 0 },
  { id: 'c', name: 'Gate C', status: 'open', percentage: 45, flowRate: 680 },
  { id: 'd', name: 'Gate D', status: 'maintenance', percentage: 25, flowRate: 200 },
];

export default function GateControlPanel() {
  const [gates, setGates] = useState<Gate[]>(initialGates);

  const toggleGate = (id: string) => {
    setGates(
      gates.map((gate) => {
        if (gate.id === id && gate.status !== 'maintenance') {
          return {
            ...gate,
            status: gate.status === 'open' ? 'closed' : 'open',
            percentage: gate.status === 'open' ? 0 : 75,
            flowRate: gate.status === 'open' ? 0 : 1250,
          };
        }
        return gate;
      })
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'closed':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'maintenance':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      default:
        return '';
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-500';
      case 'closed':
        return 'bg-slate-400';
      case 'maintenance':
        return 'bg-orange-500';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">Gate Control Panel</h3>
        <p className="text-sm text-slate-500 mt-1">Manage and monitor individual gate status</p>
      </div>

      {/* Gates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gates.map((gate) => (
          <div
            key={gate.id}
            className="border-2 border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-300"
          >
            {/* Gate Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusDotColor(gate.status)} animate-pulse`}></div>
                <h4 className="text-sm font-bold text-slate-900">{gate.name}</h4>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(gate.status)}`}>
                {gate.status.charAt(0).toUpperCase() + gate.status.slice(1)}
              </span>
            </div>

            {/* Opening Percentage */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-slate-600">Opening</p>
                <p className="text-sm font-bold text-slate-900">{gate.percentage}%</p>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                  style={{ width: `${gate.percentage}%` }}
                ></div>
              </div>
            </div>

            {/* Flow Rate */}
            <div className="mb-4 pb-4 border-b border-slate-200">
              <p className="text-xs font-semibold text-slate-600">Flow Rate</p>
              <p className="text-lg font-bold text-slate-900 mt-1">{gate.flowRate} m³/s</p>
            </div>

            {/* Control Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => toggleGate(gate.id)}
                disabled={gate.status === 'maintenance'}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  gate.status === 'maintenance'
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : gate.status === 'open'
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                <Power size={16} />
                {gate.status === 'open' ? 'Close' : 'Open'}
              </button>
              <button className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-all duration-200">
                <Lock size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* System Status */}
      <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-xs font-semibold text-slate-500 uppercase">Gates Open</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{gates.filter((g) => g.status === 'open').length}</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Flow</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {gates.reduce((sum, g) => sum + g.flowRate, 0)} m³/s
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs font-semibold text-slate-500 uppercase">Maintenance</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">
            {gates.filter((g) => g.status === 'maintenance').length}
          </p>
        </div>
      </div>
    </div>
  );
}
