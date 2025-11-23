import React from 'react';
import { User, Briefcase, FileText, Calendar, Users } from 'lucide-react';
import { PatientData, Gender } from '../types';

interface PatientFormProps {
  data: PatientData;
  onChange: (key: keyof PatientData, value: string) => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({ data, onChange }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-emerald-600" />
        Identitas Pasien
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-600">Nama Lengkap</label>
          <div className="relative">
            <input 
              type="text"
              value={data.name}
              onChange={(e) => onChange('name', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="Masukkan nama..."
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        {/* Age */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-600">Usia (Tahun)</label>
          <div className="relative">
             <input 
              type="number"
              value={data.age}
              onChange={(e) => onChange('age', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="Contoh: 35"
            />
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        {/* Gender */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-600">Jenis Kelamin</label>
          <div className="relative">
            <select
              value={data.gender}
              onChange={(e) => onChange('gender', e.target.value as Gender)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white appearance-none"
            >
              <option value={Gender.MALE}>Laki-laki</option>
              <option value={Gender.FEMALE}>Perempuan</option>
            </select>
            <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        {/* Job */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-600">Pekerjaan</label>
          <div className="relative">
            <input 
              type="text"
              value={data.job}
              onChange={(e) => onChange('job', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="Contoh: Guru, Petani..."
            />
            <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>
      </div>

      {/* Complaint */}
      <div className="mt-4 space-y-1">
        <label className="text-sm font-medium text-slate-600">Keluhan Utama</label>
        <div className="relative">
          <textarea 
            value={data.complaint}
            onChange={(e) => onChange('complaint', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors h-24 resize-none"
            placeholder="Jelaskan gejala utama yang dirasakan..."
          />
          <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>
    </div>
  );
};