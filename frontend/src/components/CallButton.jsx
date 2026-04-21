import { FaPhone } from "react-icons/fa";

function CallButton() {
  const phoneNumber = "919545267216"; // Owner's number

  return (
    <a
      href={`tel:${phoneNumber}`} // Opens dialer on mobile
      className="fixed bottom-20 mb-8 right-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 hover:scale-105 text-black px-4 py-3 rounded-full shadow-lg z-50 transition-all"
    >
      {/* Mobile text */}
      <span className="sm:hidden font-semibold">Call</span>

      {/* Phone icon */}
      <FaPhone className="text-xl" />

      {/* Desktop text */}
      <span className="hidden sm:inline font-semibold">Call Owner</span>
    </a>
  );
}

export default CallButton;