import {
  FaMapMarkerAlt,
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";

function ContactSection() {
  return (
    <section className="px-5 py-10">
      <div className="bg-[#121212] border border-gray-800 rounded-3xl p-6">
        <h2 className="text-2xl font-bold mb-4">Visit or Contact Us</h2>

        <div className="space-y-3 text-gray-300">
          <p className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-yellow-400" />
            538J+385 Snack Hub, Mangalwari Bazar Rd, Sadar, Nagpur, Maharashtra
            440001
          </p>

          <p className="flex items-center gap-3">
            <FaWhatsapp className="text-green-500" />
            +91 89992 12149
          </p>
        </div>

        <div className="flex gap-4 mt-6">
          <a
            href="https://wa.me/918999212149"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-black text-xl hover:scale-110 transition"
          >
            <FaWhatsapp />
          </a>

          <a
            href="https://instagram.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white text-xl hover:scale-110 transition"
          >
            <FaInstagram />
          </a>

          <a
            href="https://facebook.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl hover:scale-110 transition"
          >
            <FaFacebookF />
          </a>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
