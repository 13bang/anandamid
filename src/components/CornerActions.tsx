import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronUp } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function FloatingActionButtons() {
  const location = useLocation()

  const hideWhatsapp =
    location.pathname.startsWith("/ayamgoreng") ||
    location.pathname === "/company-profile"

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const whatsappNumber = "62895375706990";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <>
      <>
        {/* WhatsApp Button */}
        {!hideWhatsapp && (
          <div
            className={`
              fixed right-10
              ${visible ? "bottom-24" : "bottom-10"}
              z-[9999]
            `}
          >
            <span className="absolute inset-0 rounded-full bg-green-400 opacity-40 animate-ping"></span>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                relative
                flex items-center justify-center
                bg-green-500 text-white
                p-3 rounded-full shadow-lg
                hover:scale-110
                transition-transform duration-300
              "
            >
              <FaWhatsapp size={22} />
            </a>
          </div>
        )}

        {/* Scroll To Top */}
        <button
          onClick={scrollToTop}
          className={`
            fixed bottom-10 right-10
            z-[9999]
            bg-primary text-white
            p-3 rounded-full shadow-lg
            transition-all duration-300
            hover:scale-110
            ${visible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-4 pointer-events-none"
            }
          `}
        >
          <ChevronUp size={20} />
        </button>
      </>
    </>
  );
}