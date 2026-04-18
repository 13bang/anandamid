import { CircleQuestionMark } from "lucide-react";

interface TopInfoBarProps {
  onOpenOrderModal: () => void;
}

export default function TopInfoBar({ onOpenOrderModal }: TopInfoBarProps) {
  return (
    <div className="w-full bg-blue-700 text-xs border-b border-gray-300 overflow-hidden">
      <style>{`
        .animate-info-desktop { animation: infoBarLoop 12s ease-in-out infinite; }
        @keyframes infoBarLoop {
          0% { opacity: 0; transform: translateX(-40px); }
          10% { opacity: 1; transform: translateX(0); }
          13% { transform: scale(1.02); }
          16% { transform: scale(1); }
          85% { opacity: 1; transform: translateX(0); }
          95% { opacity: 0; transform: translateX(40px); }
          100% { opacity: 0; transform: translateX(40px); }
        }
        .marquee { display: flex; width: max-content; animation: marquee 18s linear infinite; }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div className="w-full mx-auto px-3 md:px-6 py-2 text-gray-700">
        {/* MOBILE VERSION */}
        <div className="md:hidden overflow-hidden text-[11px]">
          <div className="marquee flex gap-8">
            <div className="flex items-center gap-6 whitespace-nowrap">
              <span className="font-medium text-gray-50">Jam Operasional:</span>
              <span className="text-gray-50">Senin–Sabtu 08.00–21.00 | Minggu / Libur Nasional 10.00–19.00</span>
            </div>
            <div className="flex items-center gap-6 whitespace-nowrap">
              <span className="font-medium text-gray-50">Jam Operasional:</span>
              <span className="text-gray-50">Senin–Sabtu 08.00–21.00 | Minggu / Libur Nasional 10.00–19.00</span>
            </div>
          </div>
        </div>

        {/* DESKTOP VERSION */}
        <div className="hidden md:flex items-center justify-between animate-info-desktop">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-50">Jam Operasional:</span>
            <span className="text-gray-50">Senin–Sabtu 08.00–21.00 | Minggu / Libur Nasional 10.00–19.00</span>
          </div>
          <div className="flex items-center gap-6">
            <div 
              onClick={onOpenOrderModal}
              className="flex items-center gap-2 cursor-pointer transition group"
            >
              <CircleQuestionMark className="text-gray-50 group-hover:text-blue-200" size={14} />
              <span className="font-medium text-gray-50 group-hover:text-blue-200">
                Cara Pemesanan
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}