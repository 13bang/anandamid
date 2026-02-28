import { useEffect, useState } from "react";
import {
  getCategories,
  deleteCategory,
  updateCategory,
} from "../../services/adminCategoryService";
import { ArrowTopRightOnSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function CategoryPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [total,setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");

  const [nameError, setNameError] = useState(false);
  const [codeError, setCodeError] = useState(false);

  const [formImage, setFormImage] = useState("");
  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `http://localhost:3000${url}`;
  };

  const openEditModal = (cat: any) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormCode(cat.code);
    setFormImage(cat.image_url || "");
    setNameError(false);
    setCodeError(false);
    setIsEditOpen(true);
  };
  useEffect(() => {
    if (!editingCategory) return;

    const duplicateName = categories.some(
      (c) =>
        c.name.toLowerCase() === formName.toLowerCase() &&
        c.id !== editingCategory.id
    );

    const duplicateCode = categories.some(
      (c) =>
        c.code.toLowerCase() === formCode.toLowerCase() &&
        c.id !== editingCategory.id
    );

    setNameError(duplicateName);
    setCodeError(duplicateCode);
  }, [formName, formCode]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    handleSearch(search);
  }, [search, categories]);

  useEffect(() => {
    setLastPage(Math.ceil(filtered.length / limit));
    if (page > Math.ceil(filtered.length / limit)) {
      setPage(1);
    }
  }, [filtered, limit]);

  const handleSave = async () => {
    if (nameError || codeError) return;

    await updateCategory(editingCategory.id, {
      name: formName,
      code: formCode,
      image_url: formImage,
    });

    setIsEditOpen(false);
    fetchCategories();
  };

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
    setTotal(data.length);
    setFiltered(data);
    setLastPage(Math.ceil(data.length / limit));
  };

  const handleSearch = (value: string) => {
    const filteredData = categories.filter((cat) =>
      cat.name.toLowerCase().includes(value.toLowerCase()) ||
      cat.code.toLowerCase().includes(value.toLowerCase())
    );

    setFiltered(filteredData);
    setPage(1);
    setLastPage(Math.ceil(filteredData.length / limit));
  };

  const getPaginatedData = () => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  };

  const handleDelete = async (category: any) => {
    if (category.total_products > 0) {
      alert(
        `Tidak bisa menghapus kategori "${category.name}" karena masih memiliki ${category.total_products} produk.`
      );
      return;
    }

    const confirmDelete = window.confirm(
      `Apakah anda ingin menghapus kategori "${category.name}" ?`
    );

    if (!confirmDelete) return;

    await deleteCategory(category.id);
    fetchCategories();
  };

  return (
    <div className="p-6 text-sm">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-bold text-black">
          Total Category: {filtered.length}
        </p>
      </div>

      <div className="overflow-x-auto border rounded-xl">
        <table className="min-w-full text-xs table-fixed">
          <thead className="text-gray-600 bg-gray-50">

            {/* SEARCH ROW */}
            <tr>
              <th
                colSpan={5}
                className="px-4 py-3 bg-white border-b border-gray-200"
              >
                <div className="flex justify-end">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-64 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute w-4 h-4 text-gray-400 right-3 top-2.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35m1.85-4.65a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </th>
            </tr>

            {/* HEADER KOLOM */}
            <tr>
              <th className="px-3 py-2 text-left w-[80px]">Image</th>
              <th className="px-3 py-2 text-left w-[35%]">Name</th>
              <th className="px-3 py-2 text-left">Code</th>
              <th className="px-3 py-2 text-center">Total Products</th>
              <th className="px-3 py-2 text-center">Action</th>
            </tr>

          </thead>

          <tbody>
            {getPaginatedData().map((cat) => (
              <tr key={cat.id} className="bg-white border-t">

                {/* IMAGE */}
                <td className="px-3 py-2">
                  {cat.image_url ? (
                  <img
                    src={getImageUrl(cat.image_url)}
                    className="w-10 h-10 object-contain rounded bg-gray-100 p-1"
                  />
                  ) : (
                    <div className="flex items-center justify-center w-10 h-10 text-xs text-gray-400 bg-gray-100 rounded">
                      N/A
                    </div>
                  )}
                </td>

                <td className="px-3 py-2 font-medium">{cat.name}</td>
                <td className="px-3 py-2">{cat.code}</td>
                <td className="px-3 py-2 text-center">{cat.total_products}</td>

                <td className="px-3 py-2">
                  <div className="flex justify-center gap-4">

                    {/* UBAH */}
                    <button
                      onClick={() => openEditModal(cat)}
                      className="flex items-center gap-1 font-semibold text-blue-600 transition hover:text-blue-800"
                    >
                      <ArrowTopRightOnSquareIcon
                        className="w-4 h-4"
                        strokeWidth={2.5}
                      />
                      <span>Ubah</span>
                    </button>

                    {/* HAPUS */}
                    <button
                      onClick={() => handleDelete(cat)}
                      className="flex items-center gap-1 font-semibold text-red-600 transition hover:text-red-800"
                    >
                      <TrashIcon
                        className="w-4 h-4"
                        strokeWidth={2.5}
                      />
                      <span>Hapus</span>
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          {filtered.length > limit && (
            <tfoot>
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-4 bg-white border-t border-gray-200"
                >
                  <div className="flex items-center justify-between text-sm">

                  {/* KIRI — SHOW ENTRIES */}
                  <div className="flex items-center gap-2">
                    <span>Show</span>

                    <select
                      value={limit}
                      onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                      }}
                      className="px-2 py-1 border border-gray-300 rounded focus:outline-none"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={30}>30</option>
                      <option value={40}>40</option>
                      <option value={50}>50</option>
                    </select>

                    <span>entries</span>
                  </div>

                  {/* KANAN — PAGINATION */}
                  <div className="flex items-center gap-2">

                    <button
                      disabled={page === 1}
                      onClick={() => setPage(1)}
                      className="px-2 disabled:opacity-30"
                    >
                      {"<<"}
                    </button>

                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="px-2 disabled:opacity-30"
                    >
                      {"<"}
                    </button>

                    {[...Array(lastPage)].map((_, i) => {
                      const num = i + 1;
                      return (
                        <button
                          key={num}
                          onClick={() => setPage(num)}
                          className={`px-2 ${
                            page === num
                              ? "font-semibold text-blue-600"
                              : "text-gray-600"
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}

                    <button
                      disabled={page === lastPage}
                      onClick={() => setPage(page + 1)}
                      className="px-2 disabled:opacity-30"
                    >
                      {">"}
                    </button>

                    <button
                      disabled={page === lastPage}
                      onClick={() => setPage(lastPage)}
                      className="px-2 disabled:opacity-30"
                    >
                      {">>"}
                    </button>

                  </div>
                </div>
                </td>
              </tr>
            </tfoot>
          )}
        </table>

        {filtered.length === 0 && (
          <p className="mt-4">Tidak ada kategori</p>
        )}
      </div>
      {/* ================= MODAL EDIT ================= */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[500px] bg-white rounded-xl shadow-lg p-6">

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Edit Category</h2>
              <button onClick={() => setIsEditOpen(false)}>✕</button>
            </div>

            {/* NAME */}
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">
                Nama Category*
              </label>
              <input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-md outline-none ${
                  nameError
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-1 focus:ring-blue-500"
                }`}
              />
              {nameError && (
                <p className="mt-1 text-xs text-red-500">
                  Nama category sudah digunakan
                </p>
              )}
            </div>

            {/* CODE */}
            <div className="mb-6">
              <label className="block mb-1 text-sm font-medium">
                Code Category*
              </label>
              <input
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-md outline-none ${
                  codeError
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-1 focus:ring-blue-500"
                }`}
              />
              {codeError && (
                <p className="mt-1 text-xs text-red-500">
                  Code category sudah digunakan
                </p>
              )}
            </div>

            {/* IMAGE URL */}
            <div className="mb-6">
              <label className="block mb-1 text-sm font-medium">
                Logo Category (URL)
              </label>
              <input
                value={formImage}
                onChange={(e) => setFormImage(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md outline-none focus:ring-1 focus:ring-blue-500"
              />

              {formImage && (
                <div className="mt-3">
                <img
                  src={getImageUrl(formImage)}
                  className="w-16 h-16 object-contain rounded bg-gray-100 p-2"
                />
                </div>
              )}
            </div>

            {/* BUTTON */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Batal
              </button>

              <button
                disabled={nameError || codeError}
                onClick={handleSave}
                className={`px-4 py-2 text-sm text-white rounded-md ${
                  nameError || codeError
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Simpan
              </button>
            </div>

          </div>
        </div>
      )}
      {/* ================= END MODAL ================= */}

    </div>
  );
}

