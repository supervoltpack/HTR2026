'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-24 text-white">
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="flex items-center gap-4">
          <Shield className="w-16 h-16 text-blue-500" />
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Sentinel-9
          </h1>
        </div>
        <p className="text-xl text-gray-400 max-w-2xl">
          Advanced Real-Time Fraud Detection System. Protecting vulnerable populations from voice phishing and social engineering attacks.
        </p>

        <div className="flex gap-8 mt-12">
          <Link
            href="/scammer"
            className="px-8 py-4 rounded-full bg-gray-800 hover:bg-gray-700 transition-all border border-gray-700 text-xl font-medium"
          >
            Launch Scammer Interface
          </Link>
          <Link
            href="/victim"
            className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/30 text-xl font-medium"
          >
            Launch Victim Interface
          </Link>
        </div>

        <button
          onClick={() => fetch('/api/conversation', { method: 'DELETE' }).then(() => alert('Simulation Reset'))}
          className="mt-8 text-sm text-gray-500 hover:text-white transition-colors"
        >
          Reset Simulation
        </button>
      </div>
    </main>
  );
}
