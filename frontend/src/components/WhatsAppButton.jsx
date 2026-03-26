import { FaWhatsapp } from "react-icons/fa";

function WhatsAppButton() {
  const phone = "919545267216";
  const message = `Hi! I'm interested in SnackHub. Can you help me with the menu or my orders ??`;

  return (
    <a
      href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-5 py-3 rounded-full shadow-lg z-50 transition-all"
    >
      {/* Mobile text */}
      <span className="sm:hidden font-semibold">Chat on</span>

      {/* Icon */}
      <FaWhatsapp className="text-xl" />

      {/* Desktop text */}
      <span className="hidden sm:inline font-semibold">WhatsApp</span>
    </a>
  );
}

export default WhatsAppButton;