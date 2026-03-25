import Breadcrumb from "../../../components/Breadcrumb";

export default function TermsPage() {
  const sections = [
    {
      title: "Informasi Produk",
      content:
        "Anandam ID menyediakan berbagai informasi produk seperti deskripsi, gambar, spesifikasi, dan perkiraan harga sebagai referensi bagi pengguna. Kami berusaha menampilkan informasi produk seakurat mungkin. Namun demikian, dalam kondisi tertentu dapat terjadi perbedaan informasi yang disebabkan oleh pembaruan data, perubahan dari pemasok, atau kesalahan teknis. Oleh karena itu, pengguna disarankan untuk melakukan konfirmasi kembali melalui WhatsApp atau langsung ke toko sebelum melakukan pembelian.",
    },
    {
      title: "Proses Pemesanan",
      content:
        "Website Anandam ID tidak menyediakan sistem transaksi atau pembayaran secara langsung. Apabila pengguna berminat untuk membeli produk, pengguna dapat melakukan pemesanan melalui tombol WhatsApp yang tersedia pada halaman produk, menghubungi kontak yang tersedia pada website, atau mengunjungi toko Anandam secara langsung. Seluruh proses transaksi termasuk konfirmasi harga, ketersediaan barang, serta metode pembayaran akan diinformasikan melalui komunikasi langsung dengan pihak Anandam ID.",
    },
    {
      title: "Harga Produk",
      content:
        "Harga yang ditampilkan pada website berfungsi sebagai informasi atau estimasi harga dan dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya. Harga final produk akan dikonfirmasi kembali saat pengguna melakukan pemesanan melalui WhatsApp atau saat bertransaksi langsung di toko. Anandam ID berhak melakukan penyesuaian harga apabila ditemukan kesalahan informasi harga yang disebabkan oleh kesalahan sistem, kesalahan penulisan, atau perubahan dari pihak pemasok.",
    },
    {
      title: "Ketersediaan Produk",
      content:
        "Ketersediaan produk yang ditampilkan pada website tidak selalu mencerminkan stok aktual di toko. Beberapa produk dapat mengalami perubahan stok sewaktu-waktu. Oleh karena itu, pengguna dianjurkan untuk melakukan konfirmasi ketersediaan barang sebelum melakukan pemesanan.",
    },
    {
      title: "Hak dan Tanggung Jawab Pengguna",
      content:
        "Pengguna bertanggung jawab atas penggunaan website serta informasi yang diberikan ketika melakukan komunikasi atau pemesanan melalui WhatsApp. Pengguna juga diharapkan menggunakan situs ini secara wajar dan tidak melakukan aktivitas yang dapat merugikan pihak Anandam ID maupun pihak lainnya.",
    },
    {
      title: "Kebijakan Pembelian",
      content:
        "Setiap transaksi pembelian yang dilakukan melalui komunikasi langsung dengan Anandam ID akan mengikuti kebijakan toko yang berlaku, termasuk terkait metode pembayaran, pengiriman, atau pengambilan barang. Detail transaksi akan diinformasikan secara langsung oleh pihak kami saat proses pemesanan berlangsung.",
    },
    {
      title: "Garansi dan Layanan Purna Jual",
      content:
        "Produk yang dijual oleh Anandam ID dapat memiliki garansi resmi dari masing-masing merek atau distributor. Ketentuan garansi mengikuti kebijakan dari produsen atau distributor produk tersebut. Pengguna dapat menghubungi layanan pelanggan dari merek terkait sesuai dengan informasi yang tersedia pada kartu garansi.",
    },
    {
      title: "Keadaan di Luar Kendali (Force Majeure)",
      content:
        "Anandam ID tidak bertanggung jawab atas keterlambatan atau gangguan layanan yang disebabkan oleh keadaan di luar kendali kami, seperti bencana alam, gangguan jaringan komunikasi, kebijakan pemerintah, gangguan transportasi atau logistik, serta kondisi darurat lainnya.",
    },
    {
      title: "Hak Kekayaan Intelektual",
      content:
        "Seluruh konten yang terdapat pada website Anandam ID, termasuk namun tidak terbatas pada teks, gambar, logo, desain, dan materi lainnya merupakan milik Anandam ID atau pihak yang memberikan lisensi kepada kami. Pengguna tidak diperkenankan menyalin, mendistribusikan, atau menggunakan konten tersebut untuk tujuan komersial tanpa izin tertulis dari pihak Anandam ID.",
    },
    {
      title: "Perubahan Ketentuan",
      content:
        "Anandam ID berhak untuk memperbarui atau mengubah syarat dan ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya. Perubahan akan berlaku sejak dipublikasikan pada halaman ini. Pengguna disarankan untuk secara berkala meninjau halaman syarat dan ketentuan guna mengetahui pembaruan yang mungkin terjadi.",
    },
  ];

  return (
    <>
      {/* ================= BREADCRUMB BAR ================= */}
      <div className="w-full bg-white">
          <div className="h-14 flex items-center px-8">
              <div className="w-ful items-center">
                  <Breadcrumb
                  items={[
                      { label: "Home", path: "/" },
                      { label: "Syarat & Ketentuan" },
                  ]}
                  />
              </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">
          Syarat & Ketentuan Penggunaan
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed">
          Selamat datang di Anandam ID. Halaman ini berisi ketentuan penggunaan
          situs Anandam ID yang mengatur cara pengguna mengakses informasi produk
          serta layanan yang tersedia pada website ini.
        </p>

        <p className="text-gray-600 mb-10 leading-relaxed">
          Dengan mengakses dan menggunakan situs Anandam ID, pengguna dianggap
          telah membaca, memahami, dan menyetujui seluruh isi dari syarat dan
          ketentuan yang berlaku pada halaman ini. Apabila pengguna tidak
          menyetujui sebagian atau seluruh ketentuan yang tercantum, maka pengguna
          disarankan untuk tidak melanjutkan penggunaan situs ini.
        </p>

        <p className="text-gray-700 bg-gray-100 border border-gray-200 p-4 rounded-lg mb-10">
          Website ini berfungsi sebagai katalog produk. Seluruh transaksi
          pembelian dilakukan melalui komunikasi langsung dengan pihak Anandam
          ID, seperti melalui WhatsApp atau dengan mengunjungi toko secara
          langsung.
        </p>

        <div className="space-y-8">
          {sections.map((item, index) => (
            <div key={index}>
              <h2 className="text-xl font-semibold mb-2">
                {index + 1}. {item.title}
              </h2>

              <p className="text-gray-600 leading-relaxed">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}