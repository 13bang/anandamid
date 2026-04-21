import { useEffect, useState, useRef } from "react";
import { getCompatibility, getProducts } from "../../services/productService";
import type { Product } from "../../types/product";
import Breadcrumb from "../../components/Breadcrumb";

const Row = ({ label, value, onChange, options, price, qtyKey, qty, setQty }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options?.filter((p: Product) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

    return (
        <div className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center py-4 border-b border-gray-100 last:border-0">
            {/* LABEL */}
            <div className="md:col-span-3 text-sm font-medium text-gray-700 w-full">
                {label}
            </div>

            {/* CUSTOM SEARCHABLE DROPDOWN */}
            <div className={`md:col-span-5 w-full relative ${isOpen ? 'z-50' : 'z-10'}`} ref={dropdownRef}>
                <div
                    className="w-full flex items-center justify-between border border-gray-200 p-2.5 md:p-2 rounded-lg text-sm bg-gray-50 hover:bg-white transition-all cursor-pointer outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="truncate pr-4 text-gray-700 font-medium">
                        {value ? value.name : `Pilih ${label}`}
                    </span>
                    {/* Icon Chevron */}
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>

                {/* AREA DROPDOWN */}
                {isOpen && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden flex flex-col">
                        {/* SEARCH INPUT */}
                        <div className="p-2 border-b border-gray-100 bg-gray-50 sticky top-0">
                            <input
                                type="text"
                                autoFocus
                                className="w-full text-sm p-2 bg-white border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                placeholder={`Cari ${label}...`}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onClick={(e) => e.stopPropagation()} // Mencegah dropdown tertutup saat mengetik
                            />
                        </div>

                        {/* LIST PRODUK (FIXED HEIGHT) */}
                        <div className="max-h-60 overflow-y-auto">
                            <div
                                className="px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 cursor-pointer border-b border-gray-50"
                                onClick={() => { onChange(null); setIsOpen(false); setSearch(""); }}
                            >
                                -- Kosongkan Pilihan --
                            </div>
                            
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((p: Product) => (
                                    <div
                                        key={p.id}
                                        className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${value?.id === p.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                                        onClick={() => {
                                            onChange(p);
                                            setIsOpen(false);
                                            setSearch("");
                                        }}
                                    >
                                        {p.name}
                                    </div>
                                ))
                            ) : (
                                <div className="px-3 py-6 text-sm text-center text-gray-400 font-medium">
                                    Produk tidak ditemukan
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* QTY & PRICE */}
            <div className="flex items-center justify-between w-full md:col-span-4 gap-4 relative z-0">
                <div className="flex items-center gap-3 md:justify-center md:w-full">
                    <span className="text-xs text-gray-400 font-bold uppercase md:hidden">Qty</span>
                    <input
                        type="number"
                        min={1}
                        className="w-16 border border-gray-200 p-2 rounded-lg text-sm text-center bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        value={qty[qtyKey]}
                        onChange={(e) =>
                            setQty((prev: any) => ({
                                ...prev,
                                [qtyKey]: Math.max(1, Number(e.target.value))
                            }))
                        }
                    />
                </div>
                <div className="text-right text-sm font-bold text-gray-800 md:w-full whitespace-nowrap">
                    Rp {price.toLocaleString("id-ID")}
                </div>
            </div>
        </div>
    );
};

export default function PCBuilderPage() {
    // --- State Komponen Utama ---
    const [selectedCPU, setSelectedCPU] = useState<Product | null>(null);
    const [selectedMobo, setSelectedMobo] = useState<Product | null>(null);
    const [selectedRAM, setSelectedRAM] = useState<Product | null>(null);

    // --- State Komponen Pendukung ---
    const [selectedVGA1, setSelectedVGA1] = useState<Product | null>(null);
    const [selectedVGA2, setSelectedVGA2] = useState<Product | null>(null);
    const [selectedPSU, setSelectedPSU] = useState<Product | null>(null);
    const [selectedCoolerCPU, setSelectedCoolerCPU] = useState<Product | null>(null);
    const [selectedCoolerFan1, setSelectedCoolerFan1] = useState<Product | null>(null);
    const [selectedCoolerFan2, setSelectedCoolerFan2] = useState<Product | null>(null);
    const [selectedCoolerFan3, setSelectedCoolerFan3] = useState<Product | null>(null);
    const [selectedCasing, setSelectedCasing] = useState<Product | null>(null);
    const [selectedSSD1, setSelectedSSD1] = useState<Product | null>(null);
    const [selectedSSD2, setSelectedSSD2] = useState<Product | null>(null);
    const [selectedHDD1, setSelectedHDD1] = useState<Product | null>(null);
    const [selectedHDD2, setSelectedHDD2] = useState<Product | null>(null);
    const [selectedMonitor1, setSelectedMonitor1] = useState<Product | null>(null);
    const [selectedMonitor2, setSelectedMonitor2] = useState<Product | null>(null);
    const [selectedMonitor3, setSelectedMonitor3] = useState<Product | null>(null);
    const [selectedOS, setSelectedOS] = useState<Product | null>(null);

    // --- State List Produk per Kategori ---
    const [list, setList] = useState<{ [key: string]: Product[] }>({
        processors: [], motherboards: [], rams: [],
        vgas: [], psus: [], 
        coolerCPU: [], coolerFan: [],
        casings: [], ssds: [], hdds: [], monitors: [], oss: []
    });

    const [constraints, setConstraints] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // 1. Fetch Komponen Utama (Berdasarkan Kompatibilitas)
    const fetchCoreParts = async () => {
        setLoading(true);
        try {
            const res = await getCompatibility({
                processor_id: selectedCPU?.id,
                motherboard_id: selectedMobo?.id,
                ram_id: selectedRAM?.id,
            });

            const processors = res.available_processors || [];
            const motherboards = res.available_motherboards || [];
            const rams = res.available_rams || [];

            setList(prev => ({
                ...prev,
                processors,
                motherboards,
                rams
            }));

            setConstraints(res.active_constraints);

            if (res.active_constraints) {
                const { socket, ram_type } = res.active_constraints;

                if (selectedCPU && motherboards.length === 0) {
                    console.warn(`❌ Tidak ada motherboard yang cocok dengan CPU (${socket})`);
                }
                if (selectedMobo && processors.length === 0) {
                    console.warn(`❌ Tidak ada CPU yang cocok dengan motherboard (${socket})`);
                }
                if (selectedMobo && rams.length === 0) {
                    console.warn(`❌ Tidak ada RAM ${ram_type} yang cocok dengan motherboard`);
                }
                if (selectedRAM && motherboards.length === 0) {
                    console.warn(`❌ Tidak ada motherboard yang support RAM ${ram_type}`);
                }
            }
        } catch (err) {
            console.error("Gagal load komponen utama", err);
        } finally { 
            setLoading(false); 
        }
    };

    // 2. Fetch Komponen Pendukung menggunakan getProducts
    const fetchSupportParts = async () => {
        const categories = [
            { key: 'vgas', name: 'VGA' },
            { key: 'psus', name: 'Power Supply' },
            { key: 'coolerCPU', name: 'Cooler CPU' },
            { key: 'coolerFan', name: 'Cooler Fan' },
            { key: 'casings', name: 'Casing PC' },
            { key: 'ssds', name: 'SSD' },
            { key: 'hdds', name: 'HDD' },
            { key: 'oss', name: 'Operating System' }
        ];

        const monitorCategories = [
            "Monitor LED",
            "Monitor Gaming",
            "Monitor Professional"
        ];

        try {
            const results = await Promise.all(
                categories.map(cat => getProducts({ category: cat.name, limit: 100 }))
            );

            const newList: any = {};
            categories.forEach((cat, index) => {
                newList[cat.key] = results[index].data || [];
            });

            const monitorResults = await Promise.all(
                monitorCategories.map(name => getProducts({ category: name, limit: 100 }))
            );

            const mergedMonitors = Array.from(
                new Map(
                    monitorResults
                        .flatMap(res => res.data || [])
                        .map(item => [item.id, item])
                ).values()
            );

            newList["monitors"] = mergedMonitors;
            setList(prev => ({ ...prev, ...newList }));

        } catch (err) {
            console.error("Gagal load komponen pendukung", err);
        }
    };

    useEffect(() => { fetchSupportParts(); }, []);
    useEffect(() => { fetchCoreParts(); }, [selectedCPU, selectedMobo, selectedRAM]);

    const handleReset = () => {
        setSelectedCPU(null); setSelectedMobo(null); setSelectedRAM(null);
        setSelectedVGA1(null); setSelectedVGA2(null); setSelectedPSU(null);
        setSelectedCoolerCPU(null); setSelectedCoolerFan1(null); setSelectedCoolerFan2(null); setSelectedCoolerFan3(null);
        setSelectedCasing(null); setSelectedSSD1(null); setSelectedSSD2(null); setSelectedHDD1(null); setSelectedHDD2(null);
        setSelectedMonitor1(null); setSelectedMonitor2(null); setSelectedMonitor3(null); setSelectedOS(null);
    };

    const [qty, setQty] = useState<{ [key: string]: number }>({
        cpu: 1, mobo: 1, ram: 1, vga1: 1, vga2: 1, psu: 1,
        coolerCPU: 1, fan1: 1, fan2: 1, fan3: 1,
        casing: 1, ssd1: 1, ssd2: 1, hdd1: 1, hdd2: 1,
        monitor1: 1, monitor2: 1, monitor3: 1, os: 1
    });

    const getPrice = (p: Product | null, key: string) => {
        return (p?.final_price || 0) * (qty[key] || 1);
    };

    const grandTotal = 
        getPrice(selectedCPU, "cpu") + getPrice(selectedMobo, "mobo") + getPrice(selectedRAM, "ram") +
        getPrice(selectedVGA1, "vga1") + getPrice(selectedVGA2, "vga2") + getPrice(selectedPSU, "psu") +
        getPrice(selectedCoolerCPU, "coolerCPU") + getPrice(selectedCoolerFan1, "fan1") +
        getPrice(selectedCoolerFan2, "fan2") + getPrice(selectedCoolerFan3, "fan3") +
        getPrice(selectedCasing, "casing") + getPrice(selectedSSD1, "ssd1") + getPrice(selectedSSD2, "ssd2") +
        getPrice(selectedHDD1, "hdd1") + getPrice(selectedHDD2, "hdd2") + getPrice(selectedMonitor1, "monitor1") +
        getPrice(selectedMonitor2, "monitor2") + getPrice(selectedMonitor3, "monitor3") + getPrice(selectedOS, "os");

    const isCoreComplete = selectedCPU && selectedMobo && selectedRAM;

    const filterValidProducts = (products: Product[], type: "cpu" | "mobo" | "ram") => {
        return products.filter(p => {
            if (type === "cpu") return p.socket_type && p.socket_type !== "";
            if (type === "mobo") return p.socket_type && p.ram_type;
            if (type === "ram") return p.ram_type && p.ram_type !== "";
            return true;
        });
    };

    const WHATSAPP_NUMBER = "6281228134747";

    const handleCheckout = () => {
        const items = [
            { item: selectedCPU, key: "cpu" }, { item: selectedMobo, key: "mobo" }, { item: selectedRAM, key: "ram" },
            { item: selectedVGA1, key: "vga1" }, { item: selectedVGA2, key: "vga2" }, { item: selectedPSU, key: "psu" },
            { item: selectedCoolerCPU, key: "coolerCPU" }, { item: selectedCoolerFan1, key: "fan1" },
            { item: selectedCoolerFan2, key: "fan2" }, { item: selectedCoolerFan3, key: "fan3" },
            { item: selectedCasing, key: "casing" }, { item: selectedSSD1, key: "ssd1" },
            { item: selectedSSD2, key: "ssd2" }, { item: selectedHDD1, key: "hdd1" },
            { item: selectedHDD2, key: "hdd2" }, { item: selectedMonitor1, key: "monitor1" },
            { item: selectedMonitor2, key: "monitor2" }, { item: selectedMonitor3, key: "monitor3" },
            { item: selectedOS, key: "os" },
        ];

        const selectedItems = items.filter(i => i.item);
        const detailText = selectedItems.map(i => {
            const qtyVal = qty[i.key] || 1;
            const price = i.item?.final_price || 0;
            return `- |x${qtyVal}| ${i.item?.name} *@ ${price.toLocaleString("id-ID")}*`;
        }).join("\n");

        const message = `Halo kak, saya mau order rakitan PC:\n\n${detailText}\n\nTOTAL : Rp ${grandTotal.toLocaleString("id-ID")}\n\nMohon info ketersediaan ya, terima kasih!`;
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    return (
    <div>
        {/* ================= BREADCRUMB BAR ================= */}
        <div className="w-full bg-white">
            <div className="max-w-7xl w-full mx-auto h-14 flex items-center px-4 sm:px-6 lg:px-8">
                <Breadcrumb
                    items={[
                        { label: "Home", path: "/" },
                        { label: "Rakit PC" },
                    ]}
                />
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-8 py-8 md:py-2 min-h-screen">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                        PC Builder
                    </h1>
                    <p className="text-sm md:text-base text-gray-500 mt-1">
                        Rancang dan sesuaikan PC sesuai kebutuhan Anda
                    </p>
                </div>
                <button onClick={handleReset} className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors py-2 px-4 bg-red-50 hover:bg-red-100 rounded-lg sm:bg-transparent sm:p-0">
                    Reset Konfigurasi
                </button>
            </div>

            {/* MAIN LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* BAGIAN KIRI (KOMPONEN) */}
                <div className="lg:col-span-3 space-y-6">
                    {/* SECTION 1: CORE */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4 md:mb-6">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Komponen Utama</h2>
                            <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-bold">WAJIB</span>
                        </div>
                        <Row label="Processor" value={selectedCPU} onChange={setSelectedCPU} options={filterValidProducts(list.processors, "cpu")} price={getPrice(selectedCPU, "cpu")} qtyKey="cpu" qty={qty} setQty={setQty} />
                        <Row label="Motherboard" value={selectedMobo} onChange={setSelectedMobo} options={filterValidProducts(list.motherboards, "mobo")} price={getPrice(selectedMobo, "mobo")} qtyKey="mobo" qty={qty} setQty={setQty} />
                        <Row label="RAM" value={selectedRAM} onChange={setSelectedRAM} options={filterValidProducts(list.rams, "ram")} price={getPrice(selectedRAM, "ram")} qtyKey="ram" qty={qty} setQty={setQty} />
                    </div>

                    {/* SECTION 2: HARDWARE */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 md:mb-6">Hardware Tambahan</h2>
                        <Row label="VGA 1" value={selectedVGA1} onChange={setSelectedVGA1} options={list.vgas} price={getPrice(selectedVGA1, "vga1")} qtyKey="vga1" qty={qty} setQty={setQty} />
                        <Row label="VGA 2" value={selectedVGA2} onChange={setSelectedVGA2} options={list.vgas} price={getPrice(selectedVGA2, "vga2")} qtyKey="vga2" qty={qty} setQty={setQty} />
                        <Row label="Power Supply" value={selectedPSU} onChange={setSelectedPSU} options={list.psus} price={getPrice(selectedPSU, "psu")} qtyKey="psu" qty={qty} setQty={setQty} />
                        <Row label="Cooler CPU" value={selectedCoolerCPU} onChange={setSelectedCoolerCPU} options={list.coolerCPU} price={getPrice(selectedCoolerCPU, "coolerCPU")} qtyKey="coolerCPU" qty={qty} setQty={setQty} />
                        <Row label="Cooler Fan 1" value={selectedCoolerFan1} onChange={setSelectedCoolerFan1} options={list.coolerFan} price={getPrice(selectedCoolerFan1, "fan1")} qtyKey="fan1" qty={qty} setQty={setQty} />
                        <Row label="Cooler Fan 2" value={selectedCoolerFan2} onChange={setSelectedCoolerFan2} options={list.coolerFan} price={getPrice(selectedCoolerFan2, "fan2")} qtyKey="fan2" qty={qty} setQty={setQty} />
                        <Row label="Cooler Fan 3" value={selectedCoolerFan3} onChange={setSelectedCoolerFan3} options={list.coolerFan} price={getPrice(selectedCoolerFan3, "fan3")} qtyKey="fan3" qty={qty} setQty={setQty} />
                        <Row label="Casing PC" value={selectedCasing} onChange={setSelectedCasing} options={list.casings} price={getPrice(selectedCasing, "casing")} qtyKey="casing" qty={qty} setQty={setQty} />
                    </div>

                    {/* SECTION 3: STORAGE & DISPLAY */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 md:mb-6">Penyimpanan & Layar</h2>
                        <Row label="SSD 1" value={selectedSSD1} onChange={setSelectedSSD1} options={list.ssds} price={getPrice(selectedSSD1, "ssd1")} qtyKey="ssd1" qty={qty} setQty={setQty} />
                        <Row label="SSD 2" value={selectedSSD2} onChange={setSelectedSSD2} options={list.ssds} price={getPrice(selectedSSD2, "ssd2")} qtyKey="ssd2" qty={qty} setQty={setQty} />
                        <Row label="HDD 1" value={selectedHDD1} onChange={setSelectedHDD1} options={list.hdds} price={getPrice(selectedHDD1, "hdd1")} qtyKey="hdd1" qty={qty} setQty={setQty} />
                        <Row label="HDD 2" value={selectedHDD2} onChange={setSelectedHDD2} options={list.hdds} price={getPrice(selectedHDD2, "hdd2")} qtyKey="hdd2" qty={qty} setQty={setQty} />
                        <Row label="Monitor 1" value={selectedMonitor1} onChange={setSelectedMonitor1} options={list.monitors} price={getPrice(selectedMonitor1, "monitor1")} qtyKey="monitor1" qty={qty} setQty={setQty} />
                        <Row label="Monitor 2" value={selectedMonitor2} onChange={setSelectedMonitor2} options={list.monitors} price={getPrice(selectedMonitor2, "monitor2")} qtyKey="monitor2" qty={qty} setQty={setQty} />
                        <Row label="Monitor 3" value={selectedMonitor3} onChange={setSelectedMonitor3} options={list.monitors} price={getPrice(selectedMonitor3, "monitor3")} qtyKey="monitor3" qty={qty} setQty={setQty} />
                        <Row label="Operating System" value={selectedOS} onChange={setSelectedOS} options={list.oss} price={getPrice(selectedOS, "os")} qtyKey="os" qty={qty} setQty={setQty} />
                    </div>
                </div>

                {/* BAGIAN KANAN (SIDEBAR SUMMARY) */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:sticky lg:top-36">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Ringkasan Biaya</h2>
                        
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">Socket</span>
                                <span className={`font-semibold ${isCoreComplete ? "text-green-600" : "text-gray-800"}`}>
                                    {constraints?.socket || "-"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">Tipe RAM</span>
                                <span className={`font-semibold ${isCoreComplete ? "text-green-600" : "text-gray-800"}`}>
                                    {constraints?.ram_type || "-"}
                                </span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Total Estimasi</span>
                            <div className="text-2xl md:text-3xl font-bold text-gray-900">
                                Rp {grandTotal.toLocaleString("id-ID")}
                            </div>
                        </div>

                        <button 
                            disabled={!isCoreComplete}
                            onClick={handleCheckout}
                            className="w-full mt-8 bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-gray-200"
                        >
                            Checkout Rakitan
                        </button>
                    </div>
                </div>
            </div>

            {/* {loading && (
                <div className="fixed bottom-8 right-8 bg-black/80 text-white px-5 py-2.5 rounded-full shadow-2xl text-[11px] font-bold tracking-widest uppercase z-50">
                    Syncing...
                </div>
            )} */}
        </div>
    </div>
    );
}