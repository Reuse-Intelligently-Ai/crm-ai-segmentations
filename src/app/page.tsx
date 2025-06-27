"use client";

import { useState, useTransition, Fragment, useMemo } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  Cog6ToothIcon,
  XMarkIcon,
  SparklesIcon,
} from "@heroicons/react/20/solid";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { segmentCustomers, getCustomAnalysis } from "./actions";

// --- Tipe Data ---
type Customer = {
  id: number;
  name: string;
  total_spent: number;
  last_purchase_days_ago: number;
};
type SegmentResult = { id: number; segment: string };
// PERBAIKAN: Tipe baru untuk data yang akan ditampilkan di tabel
type DisplayCustomer = Customer & { segment: string };
type ColumnKey = keyof Customer | "segment";
type ColumnConfig = { key: ColumnKey; label: string; visible: boolean };

// --- Data & Konfigurasi Awal ---
const dummyCustomers: Customer[] = [
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

const initialColumns: ColumnConfig[] = [
  { key: "name", label: "Nama", visible: true },
  { key: "total_spent", label: "Total Belanja", visible: true },
  {
    key: "last_purchase_days_ago",
    label: "Terakhir Beli (Hari lalu)",
    visible: true,
  },
  { key: "segment", label: "Hasil Segmentasi AI", visible: true },
];

// --- Komponen Kecil untuk DND ---
function DraggableColumnHeader({ col }: { col: ColumnConfig }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: col.key });

  return (
    <th
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-grab active:cursor-grabbing"
    >
      {col.label}
    </th>
  );
}

export default function HomePage() {
  // --- State ---
  const [segments, setSegments] = useState<SegmentResult[]>([]);
  const [columns, setColumns] = useState<ColumnConfig[]>(initialColumns);
  const [isSegPending, startSegTransition] = useTransition();
  const [isAnalysisPending, startAnalysisTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // State untuk Analisis Kustom & DND
  const [analysisFields, setAnalysisFields] = useState<ColumnConfig[]>([]);
  const [customInstruction, setCustomInstruction] = useState("");
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null); // State untuk item yang di-drag
  const { isOver, setNodeRef } = useDroppable({ id: "analysis-drop-area" });

  // --- Handlers ---
  const handleSegmentClick = () => {
    setError(null);
    startSegTransition(async () => {
      const result = await segmentCustomers(dummyCustomers);
      if (result.success) setSegments(result.data as SegmentResult[]);
      else setError(result.error || "Terjadi kesalahan.");
    });
  };
  const handleCustomAnalysis = () => {
    setError(null);
    setAnalysisResult(null);
    startAnalysisTransition(async () => {
      const result = await getCustomAnalysis({
        fields: analysisFields.map((f) => f.key),
        instruction: customInstruction,
        customerData: dummyCustomers,
      });
      if (result.success) setAnalysisResult(result.analysis as string);
      else setError(result.error || "Terjadi kesalahan.");
    });
  };
  const handleColumnVisibilityChange = (key: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col,
      ),
    );
  };

  // Handlers untuk DND yang diperbarui
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log("handleDragEnd", event);
    setActiveId(null); // Selalu reset activeId setelah drag selesai
    if (event.over && event.over.id === "analysis-drop-area") {
      const droppedKey = event.active.id as ColumnKey;
      if (!analysisFields.some((f) => f.key === droppedKey)) {
        const columnToAdd = initialColumns.find((c) => c.key === droppedKey);
        if (columnToAdd) {
          setAnalysisFields((prev) => [...prev, columnToAdd]);
        }
      }
    }
  };

  // --- Data untuk Render & Fungsi Bantuan ---
  const visibleColumns = useMemo(
    () => columns.filter((col) => col.visible),
    [columns],
  );
  const customerWithSegments = useMemo(
    () =>
      dummyCustomers.map((customer) => ({
        ...customer,
        segment: segments.find((s) => s.id === customer.id)?.segment || "...",
      })),
    [segments],
  );
  // --- Fungsi Bantuan Render (Penting!) ---
  const renderCellContent = (
    customer: DisplayCustomer,
    columnKey: ColumnKey,
  ) => {
    const value = customer[columnKey];
    if (columnKey === "total_spent") {
      return `Rp${(value as number).toLocaleString("id-ID")}`;
    }
    if (columnKey === "segment") {
      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            value === "VIP"
              ? "bg-green-100 text-green-800"
              : value === "Beresiko"
              ? "bg-red-100 text-red-800"
              : value === "Reguler"
              ? "bg-yellow-100 text-yellow-800"
              : "text-gray-500"
          }`}
        >
          {value}
        </span>
      );
    }
    return value;
  };

  // --- Render ---
  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main className="flex min-h-screen flex-col items-center bg-gray-50 p-8 sm:p-12 font-sans">
        <div className="w-full max-w-5xl">
          {/* ... (Header dan tombol-tombol) ... */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            CRM AI Segmentation
          </h1>
          <p className="text-gray-600 mb-6">
            Drag-and-drop header kolom ke area analisis untuk mendapatkan
            insight kustom dari AI.
          </p>

          <div className="flex items-center gap-4 mb-8">
            {/* Tombol Segmentasi */}
            <button
              onClick={handleSegmentClick}
              disabled={isSegPending}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSegPending ? "Menganalisis..." : "Mulai Segmentasi Awal"}
            </button>

            {/* Tombol Atur Kolom */}
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex w-full justify-center gap-x-2 rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                  <Cog6ToothIcon
                    className="h-5 w-5 text-gray-500"
                    aria-hidden="true"
                  />{" "}
                  Atur Kolom{" "}
                  <ChevronDownIcon
                    className="-mr-1 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {initialColumns.map((col) => (
                      <Menu.Item key={col.key}>
                        {({ active }) => (
                          <div
                            className={`${
                              active ? "bg-gray-100" : ""
                            } px-4 py-2 text-sm`}
                          >
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={
                                  columns.find((c) => c.key === col.key)
                                    ?.visible
                                }
                                onChange={() =>
                                  handleColumnVisibilityChange(col.key)
                                }
                              />
                              <span className="text-gray-700">{col.label}</span>
                            </label>
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          {/* Area Analisis Kustom */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <SparklesIcon className="h-6 w-6 text-purple-500" /> Area Analisis
              AI Kustom
            </h2>
            <div
              ref={setNodeRef}
              className={`p-4 min-h-[80px] border-2 border-dashed rounded-lg flex flex-wrap items-center gap-2 transition-colors ${
                isOver ? "border-purple-500 bg-purple-50" : "border-gray-300"
              }`}
            >
              {analysisFields.length === 0 && (
                <p className="text-gray-500">
                  Jatuhkan (drop) header kolom di sini...
                </p>
              )}
              {analysisFields.map((field) => (
                <span
                  key={field.key}
                  className="flex items-center gap-2 bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full"
                >
                  {field.label}
                  <button
                    onClick={() =>
                      setAnalysisFields((prev) =>
                        prev.filter((f) => f.key !== field.key),
                      )
                    }
                    className="text-purple-500 hover:text-purple-700"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
            <textarea
              value={customInstruction}
              onChange={(e) => setCustomInstruction(e.target.value)}
              placeholder="Contoh: Berikan ringkasan pelanggan berdasarkan Total Belanja. Siapa top 3 spender?"
              className="mt-4 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              rows={3}
            />
            <button
              onClick={handleCustomAnalysis}
              disabled={isAnalysisPending || analysisFields.length === 0}
              className="mt-4 w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isAnalysisPending
                ? "AI sedang berpikir..."
                : "Dapatkan Analisis Kustom"}
            </button>
            {analysisResult && (
              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">
                  Hasil Analisis AI:
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {analysisResult}
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Tabel Dinamis */}
          <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {visibleColumns.map((col) => (
                    <DraggableColumnHeader key={col.key} col={col} />
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customerWithSegments.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    {visibleColumns.map((col) => (
                      <td
                        key={col.key}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                      >
                        {renderCellContent(customer, col.key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- INI BAGIAN PENTING YANG BARU --- */}
      <DragOverlay>
        {activeId ? (
          <div className="bg-purple-600 text-white font-semibold px-4 py-2 rounded-lg shadow-xl cursor-grabbing">
            {initialColumns.find((c) => c.key === activeId)?.label}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
