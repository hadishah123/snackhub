import WhatsAppButton from "./../components/WhatsAppButton";

function Home() {
  return (
  <>
    <WhatsAppButton />
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl md:text-6xl font-extrabold text-orange-600 mb-4 text-center">
        Welcome to SnackHub 🥟
      </h1>
      <p className="text-lg md:text-2xl text-gray-700 text-center">
        Best Momos in Town
      </p>
    </div>
  </>
  );
}

export default Home;