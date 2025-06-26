"use client";

import { useState, useTransition, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, Cog6ToothIcon } from "@heroicons/react/20/solid";
import { segmentCustomers } from "./actions";

// --- Tipe Data ---
type Customer = {
  id: number;
  name: string;
  total_spent: number;
  last_purchase_days_ago: number;
};

type SegmentResult = {
  id: number;
  segment: string;
};

type ColumnConfig = {
  key: keyof Customer | "segment";
  label: string;
  visible: boolean;
};

// --- Data Awal ---
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

export default function HomePage() {
  // --- State ---
  const [segments, setSegments] = useState<SegmentResult[]>([]);
  const [columns, setColumns] = useState<ColumnConfig[]>(initialColumns);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // --- Handlers ---
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

  const handleColumnVisibilityChange = (key: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col,
      ),
    );
  };

  // --- Data untuk Render ---
  const visibleColumns = columns.filter((col) => col.visible);
  const customerWithSegments = dummyCustomers.map((customer) => {
    const segmentInfo = segments.find((s) => s.id === customer.id);
    return {
      ...customer,
      segment: segmentInfo ? segmentInfo.segment : "...",
    };
  });

  // --- Fungsi Bantuan Render ---
  const renderCellContent = (customer: any, columnKey: string) => {
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

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 p-8 sm:p-12 md:p-24 font-sans">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          CRM AI Segmentation
        </h1>
        <p className="text-gray-600 mb-6">
          Gunakan tombol di bawah untuk analisis dan mengatur tampilan kolom
          tabel.
        </p>

        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleSegmentClick}
            disabled={isPending}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isPending ? "Menganalisis..." : "Mulai Segmentasi Pelanggan"}
          </button>

          {/* --- Tombol Atur Kolom --- */}
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex w-full justify-center gap-x-2 rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                <Cog6ToothIcon
                  className="h-5 w-5 text-gray-500"
                  aria-hidden="true"
                />
                Atur Kolom
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
                  {columns.map((col) => (
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
                              checked={col.visible}
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

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {visibleColumns.map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
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
  );
}
