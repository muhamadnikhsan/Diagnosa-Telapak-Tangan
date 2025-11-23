import React from 'react';
import { Activity, Leaf } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-emerald-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-700 p-2 rounded-lg">
            <Leaf className="w-8 h-8 text-emerald-100" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">HandDiagnosis AI</h1>
            <p className="text-emerald-200 text-sm">Sistem Analisis Pola Diagnostik Terintegrasi</p>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-2 text-emerald-200 text-sm bg-emerald-800 px-4 py-2 rounded-full">
          <Activity className="w-4 h-4" />
          <span>Jawi • Unani • TCM • Sujok</span>
        </div>
      </div>
    </header>
  );
};