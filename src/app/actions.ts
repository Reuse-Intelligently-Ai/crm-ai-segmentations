"use server";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

type Customer = {
  id: number;
  name: string;
  total_spent: number;
  last_purchase_days_ago: number;
};

// --- FUNGSI 1: SEGMENTASI (Tidak Berubah) ---
export async function segmentCustomers(customerData: Customer[]) {
  // ... (kode dari fungsi ini sama persis seperti sebelumnya)
  const jsonDataString = JSON.stringify(customerData, null, 2);
  const finalPrompt = `
    Anda adalah seorang analis data CRM yang ahli dari Indonesia.
    Tugas Anda adalah melakukan segmentasi pelanggan berdasarkan data JSON berikut.
    Aturan Segmentasi:
    - 'VIP': jika total_spent > 1.000.000 DAN last_purchase_days_ago < 30.
    - 'Beresiko' (At-Risk): jika last_purchase_days_ago > 90.
    - 'Reguler': untuk sisanya.
    DATA PELANGGAN:
    ${jsonDataString}
    Tolong kembalikan hasilnya HANYA dalam format JSON array of objects yang valid, di mana setiap object berisi "id" pelanggan dan "segment".
    Contoh: [{ "id": 1, "segment": "VIP" }]
  `;
  try {
    const { text } = await generateText({
      model: google("models/gemini-1.5-flash-latest"),
      prompt: finalPrompt,
    });
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = text.match(jsonRegex);
    const jsonString = match ? match[1] : text;
    const segments = JSON.parse(jsonString);
    return { success: true, data: segments };
  } catch (error) {
    console.error("Error saat segmentasi:", error);
    return {
      success: false,
      error: "Gagal memproses data. Cek konsol server.",
    };
  }
}

// --- FUNGSI 2: ANALISIS KUSTOM (Baru) ---
export async function getCustomAnalysis({
  fields,
  instruction,
  customerData,
}: {
  fields: string[];
  instruction: string;
  customerData: Customer[];
}) {
  if (fields.length === 0 || !instruction.trim()) {
    return {
      success: false,
      error: "Mohon drop setidaknya satu kolom dan berikan instruksi analisis.",
    };
  }

  // Ambil hanya field yang relevan dari data pelanggan
  const relevantData = customerData.map((customer) => {
    const data: { [key: string]: string | number } = {};
    fields.forEach((field) => {
      data[field] = customer[field as keyof Customer];
    });
    return data;
  });

  const finalPrompt = `
    Anda adalah seorang analis bisnis dan data yang sangat cerdas.
    Tugas Anda adalah menganalisis data pelanggan berdasarkan kolom dan instruksi yang diberikan.

    Data yang perlu dianalisis adalah dari kolom: ${fields.join(", ")}.

    Instruksi dari pengguna: "${instruction}"

    Gunakan sampel data berikut sebagai konteks analisis Anda:
    ${JSON.stringify(relevantData.slice(0, 10), null, 2)}

    Berikan jawaban Anda dalam format paragraf yang jelas, ringkas, dan mudah dimengerti. Fokus pada insight bisnis yang bisa diambil.
  `;

  try {
    const { text } = await generateText({
      model: google("models/gemini-1.5-flash-latest"),
      prompt: finalPrompt,
    });
    return { success: true, analysis: text };
  } catch (error) {
    console.error("Error saat analisis kustom:", error);
    return { success: false, error: "Gagal mendapatkan analisis dari AI." };
  }
}
