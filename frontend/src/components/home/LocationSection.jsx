import { FaMapMarkerAlt, FaDirections } from "react-icons/fa";

function LocationSection() {
  const mapUrl =
    "https://www.google.com/maps?q=538J+385+Snack+Hub,+Mangalwari+Bazar+Rd,+Sadar,+Nagpur,+Maharashtra+440001&output=embed";

  const directionsUrl =
    "https://www.google.com/maps/search/?api=1&query=538J+385+Snack+Hub,+Mangalwari+Bazar+Rd,+Sadar,+Nagpur,+Maharashtra+440001";

  return (
    <section className="px-5 py-10">
      <div className="bg-[#121212] border border-gray-800 rounded-3xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-3">
            Find Us
          </h2>

          <p className="text-gray-400 flex items-start gap-3 leading-relaxed">
            <FaMapMarkerAlt className="text-yellow-400 mt-1 shrink-0" />
            538J+385 Snack Hub, Mangalwari Bazar Rd,
            Sadar, Nagpur, Maharashtra 440001
          </p>
        </div>

        <iframe
          src={mapUrl}
          width="100%"
          height="300"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="border-0"
          title="SnackHub Location"
        />

        <div className="p-6">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-yellow-400 text-black font-bold py-3 rounded-2xl hover:scale-[1.02] transition"
          >
            <FaDirections />
            Get Directions
          </a>
        </div>
      </div>
    </section>
  );
}

export default LocationSection;