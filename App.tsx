import React, { useState } from 'react';
import { Header } from './components/Header';
import { PatientForm } from './components/PatientForm';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { PatientData, Gender } from './types';
import { analyzeImages } from './services/geminiService';
import { Search, Loader2 } from 'lucide-react';

function App() {
  const [patientData, setPatientData] = useState<PatientData>({
    name: '',
    age: '',
    gender: Gender.MALE,
    job: '',
    complaint: ''
  });

  const [palmImage, setPalmImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDataChange = (key: keyof PatientData, value: string) => {
    setPatientData(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setResult(null);
    setPalmImage(null);
    setBackImage(null);
    setPatientData({
      name: '',
      age: '',
      gender: Gender.MALE,
      job: '',
      complaint: ''
    });
    setError(null);
  };

  const handleAnalyze = async () => {
    // Basic Validation
    if (!patientData.name || !patientData.complaint) {
      setError("Mohon lengkapi Nama dan Keluhan Utama.");
      return;
    }
    if (!palmImage && !backImage) {
      setError("Mohon upload minimal satu foto tangan.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const analysis = await analyzeImages({
        patientData,
        palmImage,
        backImage
      });
      setResult(analysis);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memproses data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-sans">
      <Header />

      <main className="container mx-auto px-4 mt-8 max-w-5xl">
        
        {/* Intro */}
        {!result && (
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Diagnostik Telapak Tangan</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Analisis kesehatan holistik menggunakan pendekatan sistem analisis pola diagnostik terintegrasi. Silakan isi data pasien dan unggah foto untuk memulai.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg shadow-sm">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-lg border border-slate-200">
            <Loader2 className="w-16 h-16 text-emerald-600 animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-slate-700">Menganalisis Pola Tangan...</h3>
            <p className="text-slate-500 mt-2">AI sedang memeriksa tanda-tanda visual dan korelasi medis.</p>
          </div>
        ) : result ? (
          <AnalysisResult result={result} onReset={handleReset} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Data Input */}
            <div className="lg:col-span-2 space-y-6">
              <PatientForm data={patientData} onChange={handleDataChange} />
            </div>

            {/* Right Column: Images & Action Button */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-md">Wajib</span>
                  Foto Diagnostik
                </h3>
                <div className="space-y-6">
                  <ImageUploader 
                    id="palm"
                    label="1. Telapak Tangan (Palm)" 
                    imageSrc={palmImage} 
                    onImageSelect={setPalmImage} 
                  />
                  <ImageUploader 
                    id="back"
                    label="2. Punggung Tangan (Dorsal)" 
                    imageSrc={backImage} 
                    onImageSelect={setBackImage} 
                  />
                </div>
                <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                  *Pastikan pencahayaan cukup dan foto fokus untuk hasil akurasi maksimal. Hindari bayangan gelap pada area telapak.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <button 
                  onClick={handleAnalyze}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
                >
                  <Search className="w-6 h-6" />
                  Proses Analisa Diagnostik
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;