import AOS from "aos"
import "aos/dist/aos.css"
import { motion, AnimatePresence } from "framer-motion"
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

useEffect(() => {
  AOS.init({
    duration: 800,
    easing: "ease-out-cubic",
    once: true,
    offset: 80
  })
}, [])

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

    return (
        <div className="bg-white">
            {/* ================= BREADCRUMB BAR ================= */}
            <div className="w-full bg-blue-100">
                <div className="h-14 flex items-center px-8">
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
            <section className="w-full pt-10">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold">
                        Anandam <span className="text-blue-600">ID</span>
                    </h1>

                    <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>

                    <div className="mt-12 h-[320px] flex justify-center items-center">
                        <img
                            src="/talent_anandam2.svg"
                            alt="Anandam"
                            loading="eager"
                            onLoad={() => AOS.refresh()}
                            className="w-[420px]"
                        />
                    </div>
                </div>
            </section>

            {/* TENTANG */}
            <section
            id="tentang"
            className="border-gray-300 border-b-2 border-t-2 mt-16"
            >
                <div className="max-w-7xl mx-auto px-20">
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                    
                    <div data-aos="fade-up">
                        <h2 className="text-2xl font-bold mb-4 text-primary">Tentang Kami</h2>
                        <h3 className="text-5xl font-bold mb-4 text-primary2">Anandam Id</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Anandam adalah perusahaan yang bergerak di bidang penjualan perangkat
                            elektronik dan perlengkapan teknologi, seperti komputer, notebook,
                            printer, server, proyektor, serta berbagai perangkat pendukung
                            lainnya. Berdiri sejak tahun 2014, kami berkomitmen menyediakan produk
                            dari merek terpercaya dengan kualitas terbaik serta memberikan
                            pengalaman belanja yang mudah, cepat, dan terpercaya.
                        </p>
                    </div>

                    <div data-aos="fade-left" className="flex justify-center">
                        <img
                        src="/hero-tentangkami.svg"
                        alt="Tentang Anandam"
                        className="object-cover w-[400px] h-auto"
                        />
                    </div>

                    </div>
                </div>

                {/* KEUNGGULAN */}
                <div className="mt-2 max-w-7xl mx-auto px-20">

                    <div className="text-mb-14">
                        <h3 data-aos="fade-up" className="text-4xl font-bold text-primary2 mb-4">
                        Mengapa Memilih Anandam?
                        </h3>

                        <p data-aos="fade-up" className="text-gray-600 mx-auto mb-10">
                        Kami berkomitmen memberikan pengalaman berbelanja perangkat teknologi
                        yang mudah, aman, dan terpercaya dengan dukungan produk berkualitas
                        serta layanan profesional.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-10 mb-10">

                        {/* item */}
                        <div data-aos="fade-up" data-aos-delay="0"
                            className="flex flex-col items-center text-center gap-3">
                            <Award className="w-8 h-8 text-blue-600"/>
                            <h4 className="font-semibold">Produk Berkualitas</h4>
                            <p className="text-gray-500 text-sm">
                                Menyediakan produk dari brand terpercaya dengan kualitas terbaik.
                            </p>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="150" 
                            className="flex flex-col items-center text-center gap-3">
                            <Wallet className="w-8 h-8 text-blue-600"/>
                            <h4 className="font-semibold">Harga Kompetitif</h4>
                            <p className="text-gray-500 text-sm">
                                Harga selalu diperbarui dan bersaing sesuai dengan kondisi pasar.
                            </p>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="300"
                            className="flex flex-col items-center text-center gap-3">
                            <Boxes className="w-8 h-8 text-blue-600"/>
                            <h4 className="font-semibold">Beragam Brand</h4>
                            <p className="text-gray-500 text-sm">
                                Berbagai merek ternama tersedia untuk memenuhi kebutuhan Anda.
                            </p>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="450" 
                            className="flex flex-col items-center text-center gap-3">
                            <ShieldCheck className="w-8 h-8 text-blue-600"/>
                            <h4 className="font-semibold">Terpercaya</h4>
                            <p className="text-gray-500 text-sm">
                                Kami menjaga kepercayaan pelanggan dengan layanan yang transparan.
                            </p>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="0" 
                            className="flex flex-col items-center text-center gap-3">
                            <Truck className="w-8 h-8 text-blue-600"/>
                            <h4 className="font-semibold">Pengiriman Cepat</h4>
                            <p className="text-gray-500 text-sm">
                                Pesanan diproses dan dikirim secepat mungkin.
                            </p>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="150" 
                            className="flex flex-col items-center text-center gap-3">
                            <Users className="w-8 h-8 text-blue-600"/>
                            <h4 className="font-semibold">Tim Profesional</h4>
                            <p className="text-gray-500 text-sm">
                                Didukung staf berpengalaman yang siap membantu kebutuhan Anda.
                            </p>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="300" 
                            className="flex flex-col items-center text-center gap-3">
                            <ShoppingCart className="w-8 h-8 text-blue-600"/>
                            <h4 className="font-semibold">Belanja Mudah</h4>
                            <p className="text-gray-500 text-sm">
                                Sistem pembelian dirancang praktis dan nyaman.
                            </p>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="450" 
                            className="flex flex-col items-center text-center gap-3">
                            <BadgeCheck className="w-8 h-8 text-blue-600"/>
                            <h4 className="font-semibold">Garansi Produk</h4>
                            <p className="text-gray-500 text-sm">
                                Produk dilengkapi garansi resmi sesuai ketentuan masing-masing brand.
                            </p>
                        </div>

                    </div>

                </div>
            </section>

            {/* LAYANAN */}
            <section id="layanan" className="py-24">
                <div className="max-w-7xl mx-auto px-20">

                    <h2 data-aos="fade-up" data-aos-delay="0" className="text-5xl font-bold mb-6 text-primary">Layanan</h2>

                    <div className="grid grid-cols-2 gap-20">

                    {/* KIRI - SCROLL CONTENT */}
                    <div className="space-y-40">

                        {/* LANTAI 1 */}
                        <div>
                            <h2 data-aos="fade-up" data-aos-delay="100" className="text-4xl font-bold mb-4">Lantai 1</h2>
                            <h3 data-aos="fade-up" data-aos-delay="200" className="text-3xl font-semibold mb-10">Komponen & Printer</h3>

                            <div className="flex gap-8 flex-wrap mb-10">
                                {komponenIcons.map((icon, i) => (
                                <div
                                    key={i}
                                    data-aos="fade-right"
                                    data-aos-delay={i * 150}
                                >
                                    <img
                                    src={icon}
                                    alt="service icon"
                                    className="w-24 h-24 object-contain"
                                    />
                                </div>
                                ))}
                            </div>

                            <p data-aos="fade-up" className="text-gray-600">
                            Lantai 1 melayani penjualan berbagai komponen komputer seperti RAM,
                            SSD, motherboard, processor, casing, serta printer dan berbagai
                            perangkat pendukung lainnya.
                            </p>
                        </div>

                        {/* LANTAI 2 */}
                        <div>
                            <h3 data-aos="fade-up" data-aos-delay="100" className="text-4xl font-bold mb-4">Lantai 2</h3>
                            <h2 data-aos="fade-up" data-aos-delay="200" className="text-3xl font-semibold mb-10">Notebook</h2>

                            <div className="flex gap-8 flex-wrap mb-10">
                                {laptopIcons.map((icon, i) => (
                                <div
                                    key={i}
                                    data-aos="fade-right"
                                    data-aos-delay={i * 150}
                                >
                                    <img
                                    src={icon}
                                    alt="laptop icon"
                                    className="w-24 h-24 object-contain"
                                    />
                                </div>
                                ))}
                            </div>

                            <p data-aos="fade-up" className="text-gray-600">
                                Lantai 2 menyediakan berbagai pilihan notebook dari berbagai
                                merek ternama dengan spesifikasi yang beragam sesuai kebutuhan
                                kerja, pendidikan, maupun gaming.
                            </p>
                        </div>

                        {/* LANTAI 3 */}
                        <div data-aos-delay="100">
                            <h3 data-aos="fade-up" data-aos-delay="100" className="text-4xl font-bold mb-4">Lantai 3</h3>
                            <h2 data-aos="fade-up" data-aos-delay="200" className="text-3xl font-semibold mb-10">Service Center</h2>

                            <div className="flex gap-8 flex-wrap mb-10">
                                {serviceIcons.map((icon, i) => (
                                <div
                                    key={i}
                                    data-aos="fade-right"
                                    data-aos-delay={i * 150}
                                >
                                    <img
                                    src={icon}
                                    alt="service icon"
                                    className="w-16 h-16 object-contain"
                                    />
                                </div>
                                ))}
                            </div>

                            <p data-aos="fade-up" className="text-gray-600">
                                Lantai 3 merupakan pusat layanan servis untuk berbagai perangkat komputer dan notebook. Kami menyediakan layanan klaim garansi yang diproses melalui RMA, konsultasi langsung dengan customer service, serta perbaikan perangkat oleh teknisi yang berpengalaman.
                            </p>
                        </div>

                        {/* PENGIRIMAN */}
                        <div className="flex flex-col">

                            {/* TITLE */}
                            <h3 data-aos="fade-up" data-aos-delay="0" className="text-3xl font-bold">
                                Pengiriman Gratis Seluruh Jogja
                            </h3>

                            {/* MAP */}
                            <img
                                src="/icons/map-jogja.svg"
                                className="w-[220px] object-center mx-auto"
                                data-aos="zoom-in"
                            />

                            {/* TEXT */}
                            <p data-aos="fade-up" data-aos-delay="100" className="text-gray-600">
                                Kami menyediakan layanan pengiriman gratis untuk seluruh wilayah
                                Yogyakarta sehingga pelanggan dapat berbelanja dengan lebih nyaman
                                dan praktis.
                            </p>

                        </div>
                    </div>

                    {/* KANAN - STICKY */}
                    <div  data-aos="fade-left" className="relative">
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

            {/* FAQ */}
            <section id="faq" className="pt-24 pb-14 border-gray-300 border-t-2">
                <div className="max-w-7xl mx-auto px-20">

                    {/* Title */}
                    <div className="text-center mb-14">
                        <h2 data-aos="fade-up" data-aos-delay="0" className="text-4xl font-bold mb-3">
                            Frequently Asked Questions
                        </h2>
                        <p data-aos="fade-up" data-aos-delay="100" className="text-gray-600">
                            Pertanyaan yang sering ditanyakan pelanggan kami
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-16">

                        {/* LEFT - FAQ */}
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <div
                                key={i}
                                data-aos="fade-up"
                                data-aos-delay={i * 100}
                                className={`border rounded-lg p-5 cursor-pointer transition ${
                                    openIndex === i
                                    ? "bg-blue-100 border-blue-300"
                                    : "bg-white"
                                }`}
                                onClick={() =>
                                    setOpenIndex(openIndex === i ? null : i)
                                }
                                >
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold">
                                    {faq.question}
                                    </h4>

                                    <span className="text-blue-500 text-xl">
                                    {openIndex === i ? "−" : "+"}
                                    </span>
                                </div>

                                <AnimatePresence>
                                    {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="text-gray-600 mt-3 text-sm">
                                        {faq.answer}
                                        </p>
                                    </motion.div>
                                    )}
                                </AnimatePresence>
                                </div>
                            ))}
                        </div>

                        {/* RIGHT - FORM */}
                        <div  data-aos="fade-left" data-aos-delay="800" className="bg-white rounded-xl shadow-sm p-8 border">
                            <h3 className="text-xl font-semibold mb-2">
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
                                className="w-full border rounded-md px-4 py-2 mt-1"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-500">Email</label>
                                <input
                                type="email"
                                placeholder="email@gmail.com"
                                className="w-full border rounded-md px-4 py-2 mt-1"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-500">
                                Pertanyaan
                                </label>
                                <textarea
                                rows={4}
                                placeholder="Tulis pertanyaan disini..."
                                className="w-full border rounded-md px-4 py-2 mt-1"
                                />
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                            >
                                Kirim Pertanyaan
                            </button>

                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* DIREKTUR */}
            <section id="direktur" className="pb-16">
                <div className="max-w-7xl mx-auto px-20">

                    <h2 data-aos="fade-up" className="text-4xl font-bold mb-12 text-center">
                        Apresiasi dan Harapan
                    </h2>

                    <div className="grid md:grid-cols-2 gap-14 items-center">

                    {/* FOTO DIREKTUR */}
                    <div data-aos="fade-right" data-aos-delay="0" className="flex justify-center">
                        <img
                        src="/direktur.svg"
                        alt="Direktur Anandam"
                        className="w-[320px] object-cover"
                        />
                    </div>

                    {/* UCAPAN */}
                    <div data-aos="fade-left" data-aos-delay="0" className="text-gray-700 leading-relaxed space-y-5">

                        <p>
                        Terima kasih kepada seluruh pelanggan, mitra, dan tim Anandam atas
                        kepercayaan serta kerja sama yang telah terjalin selama ini.
                        </p>

                        <p>
                        Dukungan dan kepercayaan dari para pelanggan menjadi motivasi bagi
                        Anandam untuk terus menghadirkan produk teknologi berkualitas serta
                        pelayanan terbaik.
                        </p>

                        <p>
                        Apresiasi juga disampaikan kepada seluruh karyawan Anandam atas
                        dedikasi dan kerja sama yang telah diberikan dalam melayani setiap
                        pelanggan dengan profesional.
                        </p>

                        <p>
                        Semoga Anandam dapat terus berkembang dan memberikan manfaat bagi
                        lebih banyak pelanggan di masa mendatang.
                        </p>

                        {/* Nama */}
                        <div className="pt-6">
                        <p className="font-semibold text-lg">Muhammad Febrihono</p>
                        <p className="text-primary font-bold">Direktur Utama | Anandam Computer</p>
                        </div>

                    </div>

                    </div>
                </div>
            </section>

        </div>
    );
}
