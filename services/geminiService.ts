import { GoogleGenAI } from "@google/genai";
import { AnalysisRequest } from "../types";
import { SYSTEM_INSTRUCTION, BASE_PROMPT_TEMPLATE } from "../constants";

// Helper to strip the "data:image/png;base64," prefix
const stripBase64Prefix = (base64Str: string): string => {
  return base64Str.split(',')[1] || base64Str;
};

// Helper to resize image to reduce payload size
const resizeImage = async (base64Str: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      const MAX_SIZE = 1024; // Limit max dimension to 1024px

      if (width > MAX_SIZE || height > MAX_SIZE) {
        if (width > height) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        } else {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        // Compress to JPEG with 0.7 quality to ensure small payload
        resolve(canvas.toDataURL('image/jpeg', 0.7)); 
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str); // Fallback to original if loading fails
    };
  });
};

export const analyzeImages = async (request: AnalysisRequest): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please configure process.env.API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const { patientData, palmImage, backImage } = request;

  // Construct the prompt with patient data
  const userPrompt = BASE_PROMPT_TEMPLATE
    .replace('{name}', patientData.name)
    .replace('{gender}', patientData.gender)
    .replace('{age}', patientData.age)
    .replace('{job}', patientData.job)
    .replace('{complaint}', patientData.complaint);

  const parts: any[] = [
    { text: userPrompt }
  ];

  if (palmImage) {
    // Resize and optimize image
    const resizedPalm = await resizeImage(palmImage);
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg', // Resized image is always JPEG
        data: stripBase64Prefix(resizedPalm)
      }
    });
  }

  if (backImage) {
    // Resize and optimize image
    const resizedBack = await resizeImage(backImage);
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg', // Resized image is always JPEG
        data: stripBase64Prefix(resizedBack)
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4,
      }
    });

    return response.text || "Gagal mendapatkan analisis. Silakan coba lagi.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Provide more specific error messages for common issues
    let msg = "Terjadi kesalahan saat menghubungi layanan AI.";
    const errString = error.toString();
    
    if (errString.includes("413") || errString.includes("too large") || errString.includes("xhr")) {
        msg = "Ukuran foto terlalu besar atau koneksi tidak stabil. Sistem telah mencoba mengkompresi foto, namun masih gagal. Silakan coba gunakan foto dengan resolusi lebih rendah.";
    } else if (errString.includes("403") || errString.includes("API key")) {
        msg = "Masalah autentikasi API Key. Pastikan konfigurasi benar.";
    } else if (errString.includes("500") || errString.includes("internal")) {
        msg = "Gangguan sementara pada server AI. Silakan coba lagi dalam beberapa saat.";
    }

    throw new Error(msg);
  }
};