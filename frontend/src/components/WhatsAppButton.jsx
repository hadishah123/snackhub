function WhatsAppButton() {

  const phone = "919545267216";
  const message = `Hi! I'm interested in SnackHub. Can you help me with the menu or my orders ??`;

  return (
    <a
      href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
      target="_blank"
      className="fixed bottom-10 right-4 bg-green-500 text-white px-4 py-3 rounded-full shadow-lg"
    >
      💬 Chat
    </a>
  );
}

export default WhatsAppButton;