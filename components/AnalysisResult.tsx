
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FileDown, RotateCcw } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface AnalysisResultProps {
  result: string;
  palmImage: string | null;
  backImage: string | null;
  onReset: () => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, palmImage, backImage, onReset }) => {
  
  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Set standard font
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    // --- 1. Images Section (Top) ---
    // We position images first, then start text below them.
    let currentY = 20;
    const imgWidth = 50; // mm
    const imgHeight = 50; // mm
    const margin = 15;
    
    // Title inside PDF
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("LAPORAN DIAGNOSA TELAPAK TANGAN", 105, currentY, { align: "center" });
    currentY += 10;

    // Draw Images
    if (palmImage || backImage) {
        // Center the images block
        // Total width calculation to center properly
        // If 1 image: width is 50. If 2: width is 105 (50 + 5 gap + 50)
        let startX = margin;
        if (palmImage && backImage) {
             startX = (210 - (imgWidth * 2 + 5)) / 2;
        } else {
             startX = (210 - imgWidth) / 2;
        }

        if (palmImage) {
            try {
                doc.addImage(palmImage, 'JPEG', startX, currentY, imgWidth, imgHeight, undefined, 'FAST');
                doc.setFontSize(8);
                doc.setFont("helvetica", "italic");
                doc.text("Telapak Tangan", startX + (imgWidth/2), currentY + imgHeight + 4, { align: "center" });
            } catch (e) {
                console.error("PDF Image Error", e);
            }
        }

        if (backImage) {
            try {
                const backX = palmImage ? startX + imgWidth + 5 : startX;
                doc.addImage(backImage, 'JPEG', backX, currentY, imgWidth, imgHeight, undefined, 'FAST');
                doc.setFontSize(8);
                doc.setFont("helvetica", "italic");
                doc.text("Punggung Tangan", backX + (imgWidth/2), currentY + imgHeight + 4, { align: "center" });
            } catch (e) {
                console.error("PDF Image Error", e);
            }
        }
        
        currentY += imgHeight + 10; // Move Y down after images
    }

    // --- 2. Text Content ---
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0);

    const splitText = doc.splitTextToSize(result, 180);
    
    // List of exact headers to style bold
    const headers = [
      "RINGKASAN",
      "IDENTITAS PASIEN",
      "OBSERVASI VISUAL",
      "INTERPRETASI TRADISIONAL",
      "KORELASI KLINIS MODERN",
      "PENJELASAN SAINTIFIK",
      "KESIMPULAN",
      "REKOMENDASI LANJUTAN",
      "REKOMENDASI HERBAL",
      "REKOMENDASI TITIK BEKAM SUNNAH",
      "REKOMENDASI TITIK AKUPRESUR",
      "CATATAN"
    ];

    splitText.forEach((line: string) => {
      // Check for page break
      if (currentY > 280) {
        doc.addPage();
        currentY = 20;
      }

      const trimmedLine = line.trim();

      // Styling specific lines based on content
      if (line.includes("===") || line.includes("---")) {
         // Do not print separator lines in PDF to keep it clean, 
         // or print them very lightly if needed. Here we skip or make them minimal.
         // doc.setTextColor(150); 
         // doc.text(line, 105, currentY, { align: "center" });
         // currentY += 5;
      } 
      else if (headers.includes(trimmedLine)) {
         // Section Headers
         currentY += 5; // Add extra space before header
         doc.setFont("helvetica", "bold");
         doc.setFontSize(11);
         doc.setTextColor(4, 120, 87); // Emerald color
         doc.text(line, margin, currentY);
         doc.setFont("helvetica", "normal");
         doc.setFontSize(10);
         doc.setTextColor(0);
         currentY += 6;
      }
      else if (trimmedLine.includes("Laporan ini berbasis interpretasi pola")) {
         // Specific centering for the Disclaimer Note
         currentY += 5;
         doc.setFont("helvetica", "italic");
         doc.setFontSize(9);
         doc.setTextColor(80);
         doc.text(line, 105, currentY, { align: "center" });
         doc.setFont("helvetica", "normal");
         doc.setFontSize(10);
         doc.setTextColor(0);
         currentY += 5;
      }
      else {
         // Normal text
         doc.text(line, margin, currentY);
         currentY += 5;
      }
    });

    // Add footer to pages
    const pageCount = doc.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Halaman ${i} dari ${pageCount}`, 195, 290, { align: "right" });
    }

    doc.save(`Laporan_Diagnostik_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="flex flex-col items-center animate-fade-in pb-10">
      
      {/* Control Panel */}
      <div className="w-full max-w-[210mm] flex justify-between items-center mb-6 px-4 md:px-0">
        <h2 className="text-lg font-semibold text-slate-700">Hasil Analisis</h2>
        <div className="flex space-x-3">
          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-md"
          >
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
        </div>
      </div>

      {/* A4 Paper View */}
      <div className="bg-white shadow-2xl w-full max-w-[210mm] min-h-[297mm] p-8 md:p-[20mm] text-slate-900 mx-auto relative border border-slate-200">
        
        {/* Thumbnails Section Display */}
        {(palmImage || backImage) && (
          <div className="mb-8 flex flex-row gap-6 justify-center border-b border-slate-200 pb-6">
             {palmImage && (
               <div className="flex flex-col items-center gap-2">
                 <div className="h-40 w-40 border border-slate-200 bg-slate-50 rounded-md overflow-hidden shadow-sm">
                   <img src={palmImage} alt="Telapak" className="w-full h-full object-contain" />
                 </div>
                 <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Telapak Tangan</span>
               </div>
             )}
             {backImage && (
               <div className="flex flex-col items-center gap-2">
                 <div className="h-40 w-40 border border-slate-200 bg-slate-50 rounded-md overflow-hidden shadow-sm">
                   <img src={backImage} alt="Punggung" className="w-full h-full object-contain" />
                 </div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Punggung Tangan</span>
               </div>
             )}
          </div>
        )}

        {/* Text Content */}
        <div className="prose prose-slate max-w-none text-slate-800">
          <ReactMarkdown
             components={{
                // Title
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-center text-slate-900 mb-8" {...props} />,
                
                // Section Headers (generated as H2 by markdown '---' underline)
                h2: ({node, ...props}) => <h2 className="text-lg font-bold text-emerald-800 mt-10 mb-4 border-b border-emerald-100 pb-2 uppercase tracking-wide" {...props} />,
                
                // Sub-headers
                h3: ({node, ...props}) => <h3 className="text-md font-semibold text-slate-700 mt-6 mb-2" {...props} />,
                
                // Lists - Styled for vertical (block) and justified text
                ul: ({node, ...props}) => <ul className="list-disc list-outside ml-6 mb-6 space-y-2 marker:text-emerald-600" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-6 mb-6 space-y-2 marker:text-emerald-600" {...props} />,
                li: ({node, ...props}) => <li className="pl-2 leading-relaxed text-justify text-slate-700" {...props} />,
                
                // Paragraphs
                p: ({node, ...props}) => {
                  const text = String(props.children);
                  // Disclaimer special styling
                  if (text.includes("Laporan ini berbasis interpretasi pola")) {
                    return <p className="mt-12 text-center italic text-sm text-slate-500 bg-slate-50 p-4 rounded-lg border border-slate-100" {...props} />;
                  }
                  return <p className="mb-3 leading-relaxed text-justify text-slate-700" {...props} />;
                },

                // Separators
                hr: ({node, ...props}) => <hr className="border-t border-slate-200 my-8" {...props} />,
                
                // Bold text
                strong: ({node, ...props}) => <strong className="font-semibold text-slate-900" {...props} />,
                
                // Blockquotes
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-emerald-200 pl-4 italic my-4 text-slate-600 bg-emerald-50 py-2 pr-2 rounded-r" {...props} />,
             }}
          >
            {result}
          </ReactMarkdown>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t-2 border-slate-100 text-center">
          <p className="text-[10px] text-slate-400">
            Digenerate oleh HandDiagnosis AI System • {new Date().toLocaleDateString()}
          </p>
        </div>

      </div>
    </div>
  );
};
