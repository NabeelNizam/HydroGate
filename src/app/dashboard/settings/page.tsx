'use client';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Settings as SettingsIcon, Bell, Shield, User, Clock, Globe, Moon } from 'lucide-react';
import { useState } from 'react';

interface Settings {
  threshold: number;
  notifications: boolean;
  email: string;
  timezone: string;
  language: string;
  darkMode: boolean;
  twoFactor: boolean;
}

export default function Settings() {
  const [settings, setSettings] = useState<Settings>({
    threshold: 3.5,
    notifications: true,
    email: 'admin@hydrogate.local',
    timezone: 'Asia/Jakarta',
    language: 'id',
    darkMode: false,
    twoFactor: false,
  });

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, threshold: parseFloat(e.target.value) });
  };

  const handleToggle = (key: keyof Settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="flex bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64">
        <Navbar />
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pengaturan Sistem</h1>
            <p className="text-gray-600">Kelola konfigurasi dan preferensi aplikasi</p>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            {/* Threshold Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <SettingsIcon className="w-6 h-6 text-cyan-600" />
                <h2 className="text-xl font-semibold text-gray-900">Konfigurasi Sistem</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batas Aman Ketinggian Air (meter)
                  </label>
                  <input
                    type="number"
                    value={settings.threshold}
                    onChange={handleThresholdChange}
                    step="0.1"
                    className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    Sistem akan memberi alert jika ketinggian air melampaui batas ini
                  </p>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-6 h-6 text-cyan-600" />
                <h2 className="text-xl font-semibold text-gray-900">Notifikasi</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Aktifkan Notifikasi</p>
                    <p className="text-sm text-gray-600">Terima alert untuk perubahan sistem penting</p>
                  </div>
                  <button
                    onClick={() => handleToggle('notifications')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.notifications ? 'bg-cyan-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email untuk Notifikasi</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* User Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-cyan-600" />
                <h2 className="text-xl font-semibold text-gray-900">Preferensi Pengguna</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zona Waktu</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                    className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option>Asia/Jakarta</option>
                    <option>Asia/Bangkok</option>
                    <option>UTC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bahasa</label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Moon className="w-6 h-6 text-cyan-600" />
                <h2 className="text-xl font-semibold text-gray-900">Tampilan</h2>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Mode Gelap</p>
                  <p className="text-sm text-gray-600">Gunakan tema gelap untuk antarmuka aplikasi</p>
                </div>
                <button
                  onClick={() => handleToggle('darkMode')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.darkMode ? 'bg-cyan-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-cyan-600" />
                <h2 className="text-xl font-semibold text-gray-900">Keamanan</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Autentikasi Dua Faktor</p>
                    <p className="text-sm text-gray-600">Tingkatkan keamanan akun Anda</p>
                  </div>
                  <button
                    onClick={() => handleToggle('twoFactor')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.twoFactor ? 'bg-cyan-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.twoFactor ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors font-medium">
                Simpan Perubahan
              </button>
              <button className="bg-gray-200 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                Reset ke Default
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
