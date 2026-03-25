import { motion, AnimatePresence } from "framer-motion"
import type { Variants } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import {
  BadgeCheck,
  Truck,
  Wallet,
  Boxes,
  ShieldCheck,
  Users,
  ShoppingCart,
  Award
} from "lucide-react"
import Breadcrumb from "../../../components/Breadcrumb"

const items = [1,2,3,4,5,6]

export default function CompanyProfile() {

const komponenIcons = [
  "/icons/cpu1.svg",
  "/icons/pc-rakitan.svg",
  "/icons/ssd-ram.svg",
  "/icons/printer.svg",
]

const laptopIcons = [
  "/icons/laptop1.svg",
  "/icons/laptop2.svg",
  "/icons/laptop3.svg",
  "/icons/laptop4.svg",
]

const serviceIcons = [
  "/icons/customer-service.png",
  "/icons/software-application.png",
  "/icons/warranty-card.png"
]

const [openIndex, setOpenIndex] = useState<number | null>(0)
const faqs = [
  {
    question: "Bagaimana?",
    answer:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit."
  },
  {
    question: "Kenapa?",
    answer:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit."
  },
  {
    question: "Kok bisa?",
    answer:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit."
  },
  {
    question: "Mengapa",
    answer:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit."
  },
  {
    question: "Owalah?",
    answer:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit."
  },
  {
    question: "Yayayaya?",
    answer:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit."
  }
]

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.12
    }
  }
}

const item: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.98
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut"
    }
  }
}

    return (
        <div className="bg-white overflow-x-hidden md:overflow-visible">
            {/* ================= BREADCRUMB BAR ================= */}
            <div className="w-full bg-white">
                <div className="h-14 flex items-center px-4 md:px-8">
                    <div className="w-ful items-center">
                        <Breadcrumb
                        items={[
                            { label: "Home", path: "/" },
                            { label: "Profile Perusahaan" },
                        ]}
                        />
                    </div>
                </div>
            </div>

            {/* HERO */}
            <section className="relative w-full min-h-[420px] md:min-h-[500px] flex items-center">

                {/* BACKGROUND IMAGE */}
                <div className="absolute inset-0">
                    <img
                        src="/anandam_depan.svg"
                        alt="Background"
                        className="w-full h-full object-cover max-w-full object-center md:object-right"
                    />
                </div>

                {/* OVERLAY GRADIENT HITAM */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent md:from-black/80 md:via-black/50"></div>

                {/* CONTENT */}
                <div className="relative px-4 sm:px-6 md:px-8 lg:px-10 w-full grid md:grid-cols-2 items-center gap-6 md:gap-10">

                    {/* TEXT */}
                    <div className="text-left text-white">

                        <h1 className="
                            text-2xl sm:text-3xl md:text-5xl
                            font-bold leading-snug md:leading-tight
                        ">
                            Apapun Setup-nya,{" "}
                            <span className="text-primary">Anandam</span> Andalannya
                        </h1>

                        <p className="
                            mt-4 md:mt-6
                            text-sm sm:text-base md:text-lg
                            text-gray-200
                            max-w-full md:max-w-xl
                        ">
                            Mulai dari komponen PC, laptop, hingga layanan servis — semua kebutuhan teknologi tersedia dalam satu tempat. Cepat, aman, dan terpercaya sejak 2014.
                        </p>

                    </div>

                </div>
            </section>

            {/* TENTANG */}
            <section
                id="tentang"
                className="border-gray-300 border-b-2 mt-10 md:mt-6 pt-8 md:pt-0 pb-12"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

                        {/* TEXT */}
                        <div data-aos="fade-up" className="order-2 md:order-1">
                            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-primary">
                            Tentang Kami
                            </h2>

                            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary2">
                            Anandam Id
                            </h3>

                            <p className="text-gray-600 leading-relaxed text-sm sm:text-base text-justify">
                            Anandam adalah perusahaan yang bergerak di bidang penjualan perangkat
                            elektronik dan perlengkapan teknologi, seperti komputer, notebook,
                            printer, server, proyektor, serta berbagai perangkat pendukung
                            lainnya. Berdiri sejak tahun 2014, kami berkomitmen menyediakan produk
                            dari merek terpercaya dengan kualitas terbaik serta memberikan
                            pengalaman belanja yang mudah, cepat, dan terpercaya.
                            </p>
                        </div>

                        {/* IMAGE */}
                        <div
                            data-aos="fade-left"
                            className="flex justify-center order-1 md:order-2 mt-4 md:mt-0"
                        >
                            <img
                            src="/struktur_anandam.svg"
                            alt="Struktur Anandam"
                            className="w-[250px] sm:w-[280px] md:w-[360px] lg:w-[440px]"
                            />
                        </div>

                    </div>
                </div>

                {/* ================= KEUNGGULAN ================= */}
                <div className="mt-10 md:mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">

                    <div className="mb-10 text-left md:text-left">
                        <h3
                            data-aos="fade-up"
                            className="text-xl sm:text-3xl md:text-4xl font-bold text-primary2 mb-4"
                        >
                            Mengapa Memilih Anandam?
                        </h3>

                        <p data-aos="fade-up" className="text-gray-600 max-w-2xl text-justify">
                            Kami berkomitmen memberikan pengalaman berbelanja perangkat teknologi
                            yang mudah, aman, dan terpercaya dengan dukungan produk berkualitas
                            serta layanan profesional.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">

                    {/* ITEM */}
                    <div data-aos="fade-up" className="flex flex-col items-center text-center gap-3">
                        <Award className="w-7 h-7 md:w-8 md:h-8 text-blue-600"/>
                        <h4 className="font-semibold text-sm md:text-base">Produk Berkualitas</h4>
                        <p className="text-gray-500 text-xs md:text-sm">
                        Menyediakan produk dari brand terpercaya dengan kualitas terbaik.
                        </p>
                    </div>

                    <div data-aos="fade-up" data-aos-delay="150" className="flex flex-col items-center text-center gap-3">
                        <Wallet className="w-7 h-7 md:w-8 md:h-8 text-blue-600"/>
                        <h4 className="font-semibold text-sm md:text-base">Harga Kompetitif</h4>
                        <p className="text-gray-500 text-xs md:text-sm">
                        Harga selalu diperbarui dan bersaing sesuai kondisi pasar.
                        </p>
                    </div>

                    <div data-aos="fade-up" data-aos-delay="300" className="flex flex-col items-center text-center gap-3">
                        <Boxes className="w-7 h-7 md:w-8 md:h-8 text-blue-600"/>
                        <h4 className="font-semibold text-sm md:text-base">Beragam Brand</h4>
                        <p className="text-gray-500 text-xs md:text-sm">
                        Berbagai merek ternama tersedia untuk memenuhi kebutuhan Anda.
                        </p>
                    </div>

                    <div data-aos="fade-up" data-aos-delay="450" className="flex flex-col items-center text-center gap-3">
                        <ShieldCheck className="w-7 h-7 md:w-8 md:h-8 text-blue-600"/>
                        <h4 className="font-semibold text-sm md:text-base">Terpercaya</h4>
                        <p className="text-gray-500 text-xs md:text-sm">
                        Kami menjaga kepercayaan pelanggan dengan layanan transparan.
                        </p>
                    </div>

                    <div data-aos="fade-up" className="flex flex-col items-center text-center gap-3">
                        <Truck className="w-7 h-7 md:w-8 md:h-8 text-blue-600"/>
                        <h4 className="font-semibold text-sm md:text-base">Pengiriman Cepat</h4>
                        <p className="text-gray-500 text-xs md:text-sm">
                        Pesanan diproses dan dikirim secepat mungkin.
                        </p>
                    </div>

                    <div data-aos="fade-up" data-aos-delay="150" className="flex flex-col items-center text-center gap-3">
                        <Users className="w-7 h-7 md:w-8 md:h-8 text-blue-600"/>
                        <h4 className="font-semibold text-sm md:text-base">Tim Profesional</h4>
                        <p className="text-gray-500 text-xs md:text-sm">
                        Didukung staf berpengalaman yang siap membantu.
                        </p>
                    </div>

                    <div data-aos="fade-up" data-aos-delay="300" className="flex flex-col items-center text-center gap-3">
                        <ShoppingCart className="w-7 h-7 md:w-8 md:h-8 text-blue-600"/>
                        <h4 className="font-semibold text-sm md:text-base">Belanja Mudah</h4>
                        <p className="text-gray-500 text-xs md:text-sm">
                        Sistem pembelian dirancang praktis dan nyaman.
                        </p>
                    </div>

                    <div data-aos="fade-up" data-aos-delay="450" className="flex flex-col items-center text-center gap-3">
                        <BadgeCheck className="w-7 h-7 md:w-8 md:h-8 text-blue-600"/>
                        <h4 className="font-semibold text-sm md:text-base">Garansi Produk</h4>
                        <p className="text-gray-500 text-xs md:text-sm">
                        Produk dilengkapi garansi resmi dari masing-masing brand.
                        </p>
                    </div>

                    </div>

                </div>
            </section>

            {/* LAYANAN */}
            <section id="layanan" className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">

                    {/* TITLE */}
                    <h2
                    data-aos="fade-up"
                    className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 text-primary"
                    >
                    Layanan
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* ================= LEFT CONTENT ================= */}
                    <div className="space-y-20 md:space-y-32">

                        {/* LANTAI 1 */}
                        <div>
                        <h2 data-aos="fade-up" className="text-2xl md:text-4xl font-bold mb-2">
                            Lantai 1
                        </h2>

                        <h3 data-aos="fade-up" className="text-xl md:text-3xl font-semibold mb-6">
                            Komponen & Printer
                        </h3>

                        <div className="flex gap-6 flex-wrap mb-6">
                            {komponenIcons.map((icon, i) => (
                            <img
                                key={i}
                                src={icon}
                                alt="service icon"
                                data-aos="fade-right"
                                data-aos-delay={i * 150}
                                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain"
                            />
                            ))}
                        </div>

                        <p data-aos="fade-up" className="text-gray-600 text-justify">
                            Lantai 1 melayani penjualan berbagai komponen komputer seperti RAM,
                            SSD, motherboard, processor, casing, serta printer dan berbagai
                            perangkat pendukung lainnya.
                        </p>
                        </div>

                        {/* LANTAI 2 */}
                        <div>
                        <h2 data-aos="fade-up" className="text-2xl md:text-4xl font-bold mb-2">
                            Lantai 2
                        </h2>

                        <h3 data-aos="fade-up" className="text-xl md:text-3xl font-semibold mb-6">
                            Notebook
                        </h3>

                        <div className="flex gap-6 flex-wrap mb-6">
                            {laptopIcons.map((icon, i) => (
                            <img
                                key={i}
                                src={icon}
                                alt="laptop icon"
                                data-aos="fade-right"
                                data-aos-delay={i * 150}
                                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain"
                            />
                            ))}
                        </div>

                        <p data-aos="fade-up" className="text-gray-600 text-justify">
                            Lantai 2 menyediakan berbagai pilihan notebook dari berbagai
                            merek ternama dengan spesifikasi yang beragam sesuai kebutuhan
                            kerja, pendidikan, maupun gaming.
                        </p>
                        </div>

                        {/* LANTAI 3 */}
                        <div>
                        <h2 data-aos="fade-up" className="text-2xl md:text-4xl font-bold mb-2">
                            Lantai 3
                        </h2>

                        <h3 data-aos="fade-up" className="text-xl md:text-3xl font-semibold mb-6">
                            Service Center
                        </h3>

                        <div className="flex gap-6 flex-wrap mb-6">
                            {serviceIcons.map((icon, i) => (
                            <img
                                key={i}
                                src={icon}
                                alt="service icon"
                                data-aos="fade-right"
                                data-aos-delay={i * 150}
                                className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
                            />
                            ))}
                        </div>

                        <p data-aos="fade-up" className="text-gray-600 text-justify">
                            Lantai 3 merupakan pusat layanan servis untuk berbagai perangkat
                            komputer dan notebook. Kami menyediakan layanan klaim garansi yang
                            diproses melalui RMA, konsultasi langsung dengan customer service,
                            serta perbaikan perangkat oleh teknisi yang berpengalaman.
                        </p>
                        </div>

                        {/* PENGIRIMAN */}
                        <div className="flex flex-col items-center text-center md:text-left md:items-start">

                        <h3 data-aos="fade-up" className="text-xl md:text-3xl font-bold mb-4">
                            Pengiriman Gratis Seluruh Jogja
                        </h3>

                        <img
                            src="/icons/map-jogja.svg"
                            className="w-[160px] sm:w-[200px] md:w-[220px] mb-4"
                            data-aos="zoom-in"
                        />

                        <p data-aos="fade-up" className="text-gray-600 max-w-xl text-justify">
                            Kami menyediakan layanan pengiriman gratis untuk seluruh wilayah
                            Yogyakarta sehingga pelanggan dapat berbelanja dengan lebih nyaman
                            dan praktis.
                        </p>

                        </div>

                    </div>

                    {/* ================= RIGHT STICKY IMAGE ================= */}
                    <div
                        data-aos="fade-left"
                        className="relative hidden lg:block"
                    >
                        <div className="sticky top-32">
                        <img
                            src="/talent_anandam3.svg"
                            alt="Talent"
                            className="rounded-xl"
                        />
                        </div>
                    </div>

                    </div>
                </div>
            </section>
            
            {/* GALERI */}
            <section id="galeri" className="py-12 md:py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16">
                    Galeri Anandam
                    </h2>

                    <div className="columns-2 md:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">

                    {[
                        "/gallery/toko1.jpg",
                        "/gallery/toko5.jpg",
                        "/gallery/toko3.jpg",
                        "/gallery/toko4.jpg",
                        "/gallery/toko2.jpg",
                        "/gallery/toko7.jpg",
                        "/gallery/toko6.jpg",
                        "/gallery/toko9.jpg",
                        "/gallery/toko9.jpg",
                        "/gallery/toko8.jpg",
                    ].map((src, i) => {

                        const randomDelay = Math.floor(Math.random() * 600);

                        return (
                        <div
                            key={i}
                            data-aos="zoom-in"
                            data-aos-delay={randomDelay}
                            className="overflow-hidden rounded-md group break-inside-avoid"
                        >
                            <img
                            src={src}
                            className="w-full object-cover transition duration-500 group-hover:scale-110"
                            loading="lazy"
                            />
                        </div>
                        );
                    })}

                    </div>

                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="pt-16 md:pt-24 pb-12 md:pb-14 border-gray-300 border-t-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">

                    {/* Title */}
                    <div className="text-center mb-10 md:mb-14">
                        <h2
                            data-aos="fade-up"
                            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3"
                        >
                            Frequently Asked Questions
                        </h2>

                        <p
                            data-aos="fade-up"
                            data-aos-delay="100"
                            className="text-gray-600 text-sm sm:text-base"
                        >
                            Pertanyaan yang sering ditanyakan pelanggan kami
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">

                        {/* ================= LEFT - FAQ ================= */}
                        <motion.div
                            className="space-y-3 md:space-y-4"
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                variants={item}
                                layout
                                className={`border rounded-lg p-4 md:p-5 cursor-pointer transition ${
                                openIndex === i
                                    ? "bg-blue-100 border-blue-300"
                                    : "bg-white"
                                }`}
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            >

                                <div className="flex justify-between items-center gap-4">
                                <h4 className="font-semibold text-sm sm:text-base">
                                    {faq.question}
                                </h4>

                                <span className="text-blue-500 text-lg md:text-xl">
                                    {openIndex === i ? "−" : "+"}
                                </span>
                                </div>

                                <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{
                                        duration: 0.35,
                                        ease: "easeInOut"
                                    }}
                                    className="overflow-hidden"
                                    >
                                    <p className="text-gray-600 mt-3 text-sm leading-relaxed text-justify">
                                        {faq.answer}
                                    </p>
                                    </motion.div>
                                )}
                                </AnimatePresence>

                            </motion.div>
                            ))}
                        </motion.div>

                        {/* ================= RIGHT - FORM ================= */}
                        <div
                            data-aos="fade-left"
                            data-aos-delay="600"
                            className="bg-white rounded-xl shadow-sm p-5 sm:p-6 md:p-8 border"
                        >
                            <h3 className="text-lg md:text-xl font-semibold mb-2">
                            Ada pertanyaan lain?
                            </h3>

                            <p className="text-gray-500 mb-6 text-sm">
                            Silakan kirim pertanyaan Anda melalui form berikut.
                            </p>

                            <form className="space-y-4">

                            <div>
                                <label className="text-sm text-gray-500">Nama</label>
                                <input
                                type="text"
                                placeholder="User"
                                className="w-full border rounded-md px-4 py-2 mt-1 text-sm"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-500">Email</label>
                                <input
                                type="email"
                                placeholder="email@gmail.com"
                                className="w-full border rounded-md px-4 py-2 mt-1 text-sm"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-500">
                                Pertanyaan
                                </label>
                                <textarea
                                rows={4}
                                placeholder="Tulis pertanyaan disini..."
                                className="w-full border rounded-md px-4 py-2 mt-1 text-sm"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                            >
                                Kirim Pertanyaan
                            </button>

                            </form>
                        </div>

                    </div>
                </div>
            </section>

            {/* DIREKTUR */}
            <section id="direktur" className="pb-12 md:pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">

                    {/* FOTO DIREKTUR */}
                    <div
                        data-aos="fade-right"
                        className="flex justify-center order-1 md:order-none"
                    >
                        <img
                        src="/direktur.svg"
                        alt="Direktur Anandam"
                        className="w-[200px] sm:w-[240px] md:w-[320px] object-cover"
                        />
                    </div>

                    {/* UCAPAN */}
                    <div
                        data-aos="fade-left"
                        className="text-gray-700 leading-relaxed space-y-4 md:space-y-5 order-2 md:order-none"
                    >

                        {/* TITLE */}
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-left md:text-left mb-4 md:mb-6">
                        Apresiasi dan Harapan
                        </h2>

                        <p className="text-justify text-sm sm:text-base">
                        Terima kasih kepada seluruh pelanggan, mitra, dan tim Anandam atas
                        kepercayaan serta kerja sama yang telah terjalin selama ini.
                        </p>

                        <p className="text-justify text-sm sm:text-base">
                        Dukungan dan kepercayaan dari para pelanggan menjadi motivasi bagi
                        Anandam untuk terus menghadirkan produk teknologi berkualitas serta
                        pelayanan terbaik.
                        </p>

                        <p className="text-justify text-sm sm:text-base">
                        Apresiasi juga disampaikan kepada seluruh karyawan Anandam atas
                        dedikasi dan kerja sama yang telah diberikan dalam melayani setiap
                        pelanggan dengan profesional.
                        </p>

                        <p className="text-justify text-sm sm:text-base">
                        Semoga Anandam dapat terus berkembang dan memberikan manfaat bagi
                        lebih banyak pelanggan di masa mendatang.
                        </p>

                        {/* Nama */}
                        <div className="pt-4 md:pt-6">
                        <p className="font-semibold text-base md:text-lg">
                            Muhammad Febrihono
                        </p>
                        <p className="text-primary font-bold text-sm md:text-base">
                            Direktur Utama | Anandam Computer
                        </p>
                        </div>

                    </div>

                    </div>
                </div>
            </section>

        </div>
    );
}