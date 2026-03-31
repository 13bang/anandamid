import { useEffect, useState } from "react";
import {
  createGrouping,
  getGroupings,
  deleteGrouping,
  getUngroupedCategories,
  removeCategoryFromGrouping,
  updateGrouping,
} from "../../services/groupingService";

import React from "react";

import { TrashIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

import Swal from "sweetalert2";

export default function GroupingSection({
    refreshCategories,
}: {
    refreshCategories: () => void;
}) {
    const [groupings, setGroupings] = useState<any[]>([]);
    const [ungrouped, setUngrouped] = useState<any[]>([]);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [groupingName, setGroupingName] = useState("");
    const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) =>
            prev.includes(id)
            ? prev.filter((i) => i !== id)
            : [...prev, id]
        );
    };

    const getImageUrl = (url: string) => {
            if (!url) return "";
            if (url.startsWith("http")) return url;
            return `${import.meta.env.VITE_API_BASE}${url}`;
    };

    const fetchGroupings = async () => {
            const data = await getGroupings();
            setGroupings(data);
    };

    const fetchUngrouped = async () => {
        const data = await getUngroupedCategories();
        console.log("UNGROUPED:", data);
        setUngrouped(data);
    };

    useEffect(() => {
        fetchGroupings();
        fetchUngrouped();
    }, []);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingGrouping, setEditingGrouping] = useState<any>(null);

    const openEditModal = (g: any) => {
        setEditingGrouping(g);
        setGroupingName(g.name);
        setSelectedChildren(g.children.map((c: any) => c.id));
        setIsEditOpen(true);
    };

    return (
    <div className="mb-6">

            {/* HEADER LUAR TABEL */}
            <div className="flex justify-end mb-3">
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg font-semibold"
                >
                    + Tambah Grouping
                </button>
            </div>

            {/* TABLE WRAPPER */}
            <div className="border rounded-xl overflow-x-auto">
                <table className="min-w-full text-xs table-fixed">
                    <thead className="text-gray-600 bg-gray-50">
                        <tr>
                            <th className="px-3 py-2 w-[80px]">Logo</th>
                            <th className="px-3 py-2 text-left">Nama</th>
                            <th className="px-3 py-2 text-center">Jumlah Kategori</th>
                            <th className="px-3 py-2 text-center">Aksi</th>
                        </tr>
                    </thead>

                        <tbody>
                            {groupings.map((g) => (
                                <React.Fragment key={g.id}>

                                {/* ===== PARENT ===== */}
                                <tr
                                    className="bg-white border-t cursor-pointer hover:bg-gray-50 transition"
                                    onClick={() => toggleExpand(g.id)}
                                >
                                    <td className="px-3 py-2">
                                    {g.image_url ? (
                                        <img
                                        src={getImageUrl(g.image_url)}
                                        className="w-10 h-10 object-contain rounded bg-white border p-1"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-10 h-10 text-xs text-gray-400 bg-gray-100 rounded border">
                                        N/A
                                        </div>
                                    )}
                                    </td>

                                    <td className="px-3 py-2 font-medium text-gray-800">
                                    {g.name}
                                    </td>

                                    <td className="px-3 py-2 text-center">
                                    {g.total_children}
                                    </td>

                                    <td className="px-3 py-2">
                                    <div className="flex justify-center gap-4">
                                        <button
                                        onClick={() => openEditModal(g)}
                                        className="flex items-center gap-1 font-semibold text-primary"
                                        >
                                        <ArrowTopRightOnSquareIcon className="w-4 h-4" strokeWidth={2.5} />
                                        <span>Edit</span>
                                        </button>

                                        <button
                                        onClick={async () => {
                                            const result = await Swal.fire({
                                                title: "Hapus Grouping?",
                                                text: `Grouping "${g.name}" akan dihapus`,
                                                icon: "warning",
                                                showCancelButton: true,
                                                confirmButtonColor: "#d33",
                                                cancelButtonColor: "#6b7280",
                                                confirmButtonText: "Ya, hapus",
                                                cancelButtonText: "Batal",
                                            });

                                            if (result.isConfirmed) {
                                                try {
                                                    await deleteGrouping(g.id);

                                                    await Swal.fire({
                                                        title: "Berhasil",
                                                        text: "Grouping berhasil dihapus",
                                                        icon: "success",
                                                        timer: 1500,
                                                        showConfirmButton: false,
                                                    });

                                                    fetchGroupings();
                                                    fetchUngrouped();
                                                    refreshCategories();
                                                } catch (err) {
                                                    Swal.fire("Error", "Gagal menghapus grouping", "error");
                                                }
                                            }
                                        }}
                                        className="flex items-center gap-1 font-semibold text-red-600"
                                        >
                                        <TrashIcon className="w-4 h-4" strokeWidth={2.5} />
                                        <span>Hapus</span>
                                        </button>
                                    </div>
                                    </td>
                                </tr>

                                {/* ===== CHILD ===== */}
                                <tr>
                                    <td colSpan={4} className="p-0">
                                        <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                            expandedIds.includes(g.id) ? "max-h-96" : "max-h-0"
                                        }`}
                                        >
                                        <table className="w-full">
                                            <tbody>
                                            {g.children?.map((child: any) => (
                                                <tr key={child.id} className="bg-white border-t">
                                                <td className="w-[80px]"></td>

                                                <td className="px-3 py-2 pl-8 text-gray-600">
                                                    └ {child.name}
                                                </td>

                                                <td className="px-3 py-2 text-center text-gray-400 text-xs">
                                                    kategori
                                                </td>

                                                <td className="px-3 py-2 text-center">
                                                    <button
                                                    onClick={async (e) => {
                                                        e.stopPropagation();

                                                        const result = await Swal.fire({
                                                        title: "Hapus dari grouping?",
                                                        text: `Kategori "${child.name}" akan dikeluarkan`,
                                                        icon: "warning",
                                                        showCancelButton: true,
                                                        confirmButtonColor: "#d33",
                                                        cancelButtonColor: "#6b7280",
                                                        confirmButtonText: "Ya, hapus",
                                                        cancelButtonText: "Batal",
                                                        });

                                                        if (result.isConfirmed) {
                                                        try {
                                                            await removeCategoryFromGrouping(child.id);

                                                            await Swal.fire({
                                                            title: "Berhasil",
                                                            text: "Kategori berhasil dikeluarkan",
                                                            icon: "success",
                                                            timer: 1500,
                                                            showConfirmButton: false,
                                                            });

                                                            fetchGroupings();
                                                            fetchUngrouped();
                                                            refreshCategories();
                                                        } catch (err) {
                                                            Swal.fire("Error", "Gagal menghapus kategori", "error");
                                                        }
                                                        }
                                                    }}
                                                    className="flex items-center justify-center gap-1 text-red-600 text-xs font-semibold"
                                                    >
                                                    <TrashIcon className="w-3 h-3" strokeWidth={2.5} />
                                                    <span>Hapus</span>
                                                    </button>
                                                </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                        </div>
                                    </td>
                                </tr>

                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>

            {/* MODAL CREATE */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-[500px] bg-white p-6 rounded-xl">

                        <h2 className="mb-4 text-lg font-semibold">
                            Tambah Grouping
                        </h2>

                        <input
                            placeholder="Nama grouping"
                            value={groupingName}
                            onChange={(e) => setGroupingName(e.target.value)}
                            className="w-full px-3 py-2 mb-4 border rounded"
                        />

                        <div className="max-h-60 overflow-y-auto border rounded p-2">

                            {ungrouped.length === 0 && (
                                <p className="text-xs text-gray-400 text-center py-4">
                                Semua kategori sudah masuk grouping
                                </p>
                            )}

                            {ungrouped.map((cat) => (
                                <label key={cat.id} className="flex gap-2 p-1">
                                <input
                                    type="checkbox"
                                    checked={selectedChildren.includes(cat.id)}
                                    onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedChildren([...selectedChildren, cat.id]);
                                    } else {
                                        setSelectedChildren(
                                        selectedChildren.filter((id) => id !== cat.id)
                                        );
                                    }
                                    }}
                                />
                                {cat.name}
                                </label>
                            ))}
                        </div>

                        <div className="flex justify-end mt-4 gap-2">
                            <button onClick={() => setIsCreateOpen(false)}>
                                Batal
                            </button>

                            <button
                                disabled={!groupingName}
                                onClick={async () => {
                                    try {
                                        await createGrouping({
                                            name: groupingName,
                                            child_ids: selectedChildren,
                                        });

                                        await Swal.fire({
                                            title: "Berhasil",
                                            text: "Grouping berhasil ditambahkan",
                                            icon: "success",
                                            timer: 1500,
                                            showConfirmButton: false,
                                        });

                                        setIsCreateOpen(false);
                                        setGroupingName("");
                                        setSelectedChildren([]);

                                        fetchGroupings();
                                        fetchUngrouped();
                                        refreshCategories();
                                    } catch (err) {
                                        Swal.fire("Error", "Gagal menambahkan grouping", "error");
                                    }
                                }}
                                className="px-4 py-2 text-white bg-green-600 rounded"
                            >
                                Simpan
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-[500px] bg-white p-6 rounded-xl">

                    <h2 className="mb-4 text-lg font-semibold">
                        Edit Grouping
                    </h2>

                    <input
                        placeholder="Nama grouping"
                        value={groupingName}
                        onChange={(e) => setGroupingName(e.target.value)}
                        className="w-full px-3 py-2 mb-4 border rounded"
                    />

                    <div className="max-h-60 overflow-y-auto border rounded p-2">

                        {ungrouped.map((cat) => (
                        <label key={cat.id} className="flex gap-2 p-1">
                            <input
                            type="checkbox"
                            checked={selectedChildren.includes(cat.id)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                setSelectedChildren([...selectedChildren, cat.id]);
                                } else {
                                setSelectedChildren(
                                    selectedChildren.filter((id) => id !== cat.id)
                                );
                                }
                            }}
                            />
                            {cat.name}
                        </label>
                        ))}

                    </div>

                    <div className="flex justify-end mt-4 gap-2">
                        <button onClick={() => setIsEditOpen(false)}>
                        Batal
                        </button>

                        <button
                        onClick={async () => {
                            await updateGrouping(editingGrouping.id, {
                                name: groupingName,
                                child_ids: selectedChildren,
                            });

                            setIsEditOpen(false);
                            setGroupingName("");
                            setSelectedChildren([]);

                            fetchGroupings();
                            fetchUngrouped();
                            refreshCategories();
                        }}
                        className="px-4 py-2 text-white bg-blue-600 rounded"
                        >
                        Update
                        </button>
                    </div>

                    </div>
                </div>
            )}

        </div>
    </div>
  );
}