import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FileDown, RotateCcw } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface AnalysisResultProps {
  result: string;
  onReset: () => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onReset }) => {
  
  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Set font for better compatibility
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    // Header
    doc.setTextColor(4, 120, 87); // Emerald 700
    doc.setFontSize(18);
    doc.text("Laporan Diagnostik HandDiagnosis AI", 15, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Tanggal: ${new Date().toLocaleDateString()}`, 15, 28);
    
    doc.setLineWidth(0.5);
    doc.setDrawColor(200);
    doc.line(15, 32, 195, 32);

    // Content
    doc.setTextColor(0);
    doc.setFontSize(10);
    
    // Split text to fit page
    const splitText = doc.splitTextToSize(result, 180);
    let y = 40;
    
    splitText.forEach((line: string) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 15, y);
      y += 5; // Line height
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Halaman ${i} dari ${pageCount} - Dokumen ini adalah interpretasi visual, bukan diagnosis medis final.`, 15, 290);
    }

    doc.save("Laporan-Diagnostik.pdf");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in">
      <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-emerald-800">Hasil Analisis Diagnostik</h2>
        <div className="flex space-x-2">
          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Analisis Baru</span>
          </button>
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>
      
      <div className="p-8 prose prose-emerald max-w-none 
        prose-headings:font-bold 
        prose-h2:text-emerald-800 prose-h2:border-b prose-h2:border-emerald-200 prose-h2:pb-4 prose-h2:mt-12 prose-h2:mb-6
        prose-h3:text-emerald-700 prose-h3:mt-10 prose-h3:mb-4
        prose-strong:text-slate-900 prose-strong:font-bold
        prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6
        prose-li:text-slate-700 prose-li:my-2
        prose-ul:my-6 prose-ol:my-6
        prose-hr:my-12 prose-hr:border-slate-200 prose-hr:border-t-2">
        <ReactMarkdown>{result}</ReactMarkdown>
      </div>

      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-500 italic">
          Disclaimer: Sistem ini menggunakan AI untuk mengenali pola visual. Hasil ini tidak menggantikan konsultasi dokter profesional.
        </p>
      </div>
    </div>
  );
};