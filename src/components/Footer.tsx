import { Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* ================= BRAND ================= */}
          <div>
            <h2 className="text-2xl font-bold text-white">
              ANANDAM ID
            </h2>

            <p className="mt-2 text-sm text-primary1 font-semibold">
              Toko Nomor 1 Di Universe Jogja
            </p>

            <div className="w-[200px] h-[2px] bg-gray-400 my-6" />

            <p className="text-sm leading-relaxed text-gray-300">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Distinctio iure quibusdam aliquam vero neque similique nisi dolore natus, illum veniam, repellat corporis adipisci? Consectetur, amet?
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mt-6">

                {/* TikTok */}
                <div className="p-2 bg-black border border-gray-600 rounded-full text-white hover:bg-gray-800">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                    >
                    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-1.88v8.42a5.032 5.032 0 1 1-4.373-4.983v2.06a2.974 2.974 0 1 0 2.315 2.902V2h2.058a4.79 4.79 0 0 0 3.77 2.687v2z"/>
                    </svg>
                </div>

                {/* Facebook */}
                <div className="p-2 border border-gray-600 rounded-full hover:bg-gray-800">
                    <Facebook size={16} />
                </div>

                {/* Instagram */}
                <div className="p-2 border border-gray-600 rounded-full hover:bg-gray-800">
                    <Instagram size={16} />
                </div>

                {/* Youtube */}
                <div className="p-2 border border-gray-600 rounded-full hover:bg-gray-800">
                    <Youtube size={16} />
                </div>

            </div>
          </div>

          {/* ================= ABOUT ================= */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Perusahaan Kami
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Tentang Kami</li>
              <li className="hover:text-white cursor-pointer">Layanan</li>
              <li className="hover:text-white cursor-pointer">Portofolio</li>
            </ul>
          </div>

          {/* ================= MENU ================= */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Menu
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Beranda</li>
              <li className="hover:text-white cursor-pointer">Product Katalog</li>
            </ul>
          </div>

          {/* ================= CONTACT ================= */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Kontak
            </h3>
            <div className="text-sm space-y-3">
              <div>
                <p className="text-gray-300">Sales :</p>
                <p className="text-white">+0123 456 789 00</p>
              </div>
              <div>
                <p className="text-gray-300">Customer Service :</p>
                <p className="text-white">+0123 456 789 00</p>
              </div>
              <div>
                <p className="text-gray-300">Email :</p>
                <p className="text-white">user@example.com</p>
              </div>
            </div>
          </div>

            {/* ================= MAP ================= */}
            <div>
            <h3 className="text-white font-semibold mb-4">
                Lokasi Kami
            </h3>

            <div className="w-full h-[200px] overflow-hidden border border-gray-700">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4107.707472937732!2d110.3953248!3d-7.7598474999999985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x51aab3a4de9990f%3A0x6122cbf0b82f64d9!2sAnandam.id%20(Toko%20Notebook%20%26%20Komputer%20Yogyakarta)!5e1!3m2!1sid!2sid!4v1772180250012!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
            </div>

            <p className="text-sm text-gray-300 mt-3">
                Jl. Affandi No.17, Soropadan, Condongcatur, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55283
            </p>
            </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
            © Copyright {new Date().getFullYear()} by <span className="text-white font-semibold">Anandam ID</span>, All Right Reserved.
        </div>
      </div>
    </footer>
  );
}