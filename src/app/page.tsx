"use client";

import { useState, useTransition } from "react";
import { segmentCustomers } from "./actions"; // Import Server Action kita

// Data pelanggan dummy
const dummyCustomers = [
  {
    id: 1,
    name: "Andi Wijaya",
    total_spent: 5500000,
    last_purchase_days_ago: 15,
  },
  {
    id: 2,
    name: "Budi Santoso",
    total_spent: 250000,
    last_purchase_days_ago: 95,
  },
  {
    id: 3,
    name: "Citra Lestari",
    total_spent: 750000,
    last_purchase_days_ago: 35,
  },
  {
    id: 4,
    name: "Dewi Anggraini",
    total_spent: 1200000,
    last_purchase_days_ago: 28,
  },
  { id: 5, name: "Eka Putra", total_spent: 50000, last_purchase_days_ago: 150 },
  { id: 6, name: "Fitriani", total_spent: 950000, last_purchase_days_ago: 60 },
];

// Tipe data untuk hasil segmentasi
type SegmentResult = {
  id: number;
  segment: string;
};

export default function HomePage() {
  // State untuk menyimpan hasil dari AI
  const [segments, setSegments] = useState<SegmentResult[]>([]);
  // State untuk menangani loading
  const [isPending, startTransition] = useTransition();
  // State untuk pesan error
  const [error, setError] = useState<string | null>(null);

  const handleSegmentClick = () => {
    setError(null);
    startTransition(async () => {
      const result = await segmentCustomers(dummyCustomers);
      if (result.success) {
        setSegments(result.data);
      } else {
        setError(result.error || "Terjadi kesalahan yang tidak diketahui.");
      }
    });
  };

  // Menggabungkan data asli dengan hasil segmentasi untuk ditampilkan
  const customerWithSegments = dummyCustomers.map((customer) => {
    const segmentInfo = segments.find((s) => s.id === customer.id);
    return {
      ...customer,
      segment: segmentInfo ? segmentInfo.segment : "...",
    };
  });

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 p-8 sm:p-12 md:p-24 font-sans">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          CRM AI Segmentation
        </h1>
        <p className="text-gray-600 mb-6">
          Klik tombol di bawah untuk menganalisis dan melakukan segmentasi data
          pelanggan menggunakan Google Gemini.
        </p>

        <button
          onClick={handleSegmentClick}
          disabled={isPending}
          className="mb-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isPending ? "Menganalisis..." : "Mulai Segmentasi Pelanggan"}
        </button>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Total Belanja
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Terakhir Beli (Hari lalu)
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Hasil Segmentasi AI
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customerWithSegments.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    Rp{customer.total_spent.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {customer.last_purchase_days_ago}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        customer.segment === "VIP"
                          ? "bg-green-100 text-green-800"
                          : customer.segment === "Beresiko"
                          ? "bg-red-100 text-red-800"
                          : customer.segment === "Reguler"
                          ? "bg-yellow-100 text-yellow-800"
                          : "text-gray-500"
                      }`}
                    >
                      {customer.segment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
