'use client';

import { useState, useEffect } from 'react';
import { Power, Zap } from 'lucide-react';

interface Gate {
  id: string;
  name: string;
  status: 'open' | 'closed' | 'maintenance';
  percentage: number;
  flowRate: number;
  isAutoControlled: boolean;
}

const WATER_LEVEL_THRESHOLD = 75; // Critical water level (meters)
const MAX_WATER_LEVEL = 100; // Maximum safe level

export default function GateControlPanel() {
  const [gate, setGate] = useState<Gate>({
    id: 'main',
    name: 'Main Gate',
    status: 'closed',
    percentage: 0,
    flowRate: 0,
    isAutoControlled: true,
  });

  const [currentWaterLevel, setCurrentWaterLevel] = useState(65);

  // Simulate water level sensor data
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWaterLevel((prev) => {
        // Simulate realistic water level changes
        const change = (Math.random() - 0.5) * 3;
        const newLevel = Math.max(30, Math.min(100, prev + change));
        return parseFloat(newLevel.toFixed(1));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Auto-control logic based on water level
  useEffect(() => {
    if (gate.isAutoControlled && gate.status !== 'maintenance') {
      if (currentWaterLevel >= WATER_LEVEL_THRESHOLD && gate.status === 'closed') {
        // Water level critical - auto open gate
        setGate((prev) => ({
          ...prev,
          status: 'open',
          percentage: 85,
          flowRate: 1500,
        }));
      } else if (currentWaterLevel < WATER_LEVEL_THRESHOLD - 5 && gate.status === 'open') {
        // Water level normal - auto close gate
        setGate((prev) => ({
          ...prev,
          status: 'closed',
          percentage: 0,
          flowRate: 0,
        }));
      }
    }
  }, [currentWaterLevel, gate.isAutoControlled, gate.status]);

  const toggleAutoControl = () => {
    setGate((prev) => ({
      ...prev,
      isAutoControlled: !prev.isAutoControlled,
    }));
  };

  const toggleGate = () => {
    if (!gate.isAutoControlled && gate.status !== 'maintenance') {
      setGate((prev) => ({
        ...prev,
        status: prev.status === 'open' ? 'closed' : 'open',
        percentage: prev.status === 'open' ? 0 : 85,
        flowRate: prev.status === 'open' ? 0 : 1500,
      }));
    }
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

  const getWaterLevelStatus = () => {
    if (currentWaterLevel >= WATER_LEVEL_THRESHOLD) return 'critical';
    if (currentWaterLevel >= WATER_LEVEL_THRESHOLD - 10) return 'warning';
    return 'normal';
  };

  const getWaterLevelColor = () => {
    const status = getWaterLevelStatus();
    switch (status) {
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-green-600 bg-green-50';
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">Gate Control System</h3>
        <p className="text-sm text-slate-500 mt-1">Automatic gate control triggered by water level sensor</p>
      </div>

      {/* Water Level Monitor */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-slate-900">Current Water Level</h4>
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${getWaterLevelColor()}`}>
            {currentWaterLevel}m / {MAX_WATER_LEVEL}m
          </span>
        </div>
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              getWaterLevelStatus() === 'critical'
                ? 'bg-red-500'
                : getWaterLevelStatus() === 'warning'
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${(currentWaterLevel / MAX_WATER_LEVEL) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-600">
          <span>Normal (&lt;65m)</span>
          <span>Warning (65-75m)</span>
          <span className="font-semibold">Critical (&gt;75m)</span>
        </div>
      </div>

      {/* Main Gate Control */}
      <div className="border-2 border-slate-200 rounded-lg p-5 mb-6">
        {/* Gate Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${getStatusDotColor(gate.status)} animate-pulse`}></div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">{gate.name}</h4>
              <p className="text-xs text-slate-500">
                {gate.isAutoControlled ? '🤖 Auto-Controlled' : '👤 Manual Mode'}
              </p>
            </div>
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
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
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
            onClick={toggleGate}
            disabled={gate.isAutoControlled || gate.status === 'maintenance'}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
              gate.isAutoControlled || gate.status === 'maintenance'
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : gate.status === 'open'
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            <Power size={16} />
            {gate.status === 'open' ? 'Close' : 'Open'}
          </button>
          <button
            onClick={toggleAutoControl}
            className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${
              gate.isAutoControlled
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <Zap size={16} />
            Auto
          </button>
        </div>
      </div>

      {/* System Info */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
        <div className="text-center">
          <p className="text-xs font-semibold text-slate-500 uppercase">Gate Status</p>
          <p className="text-lg font-bold text-slate-900 mt-1 capitalize">{gate.status}</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-semibold text-slate-500 uppercase">Control Mode</p>
          <p className="text-lg font-bold text-slate-900 mt-1">{gate.isAutoControlled ? 'Auto' : 'Manual'}</p>
        </div>
      </div>

      {/* Status Message */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>ℹ️ Info:</strong> Gate automatically opens when water level exceeds {WATER_LEVEL_THRESHOLD}m and closes
          when it drops below {WATER_LEVEL_THRESHOLD - 5}m. Switch to Manual mode for emergency control.
        </p>
      </div>
    </div>
  );
}
