export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-xl text-center">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4">Welcome to FinSage 💸</h1>
        <p className="text-gray-700 text-lg mb-6">
          Your smart personal finance assistant — track, categorize, and understand your spending with ease.
        </p>
        <a
          href="/transactions"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-700 transition"
        >
          Get Started
        </a>
      </div>
    </div>
  );
}
