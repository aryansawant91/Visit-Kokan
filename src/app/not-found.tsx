import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-kokan-cream px-4 text-center">
      <h1 className="text-6xl font-display font-black text-kokan-green mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-kokan-green text-white font-medium rounded-full hover:bg-kokan-teal transition-colors shadow-sm"
      >
        Go Home
      </Link>
    </div>
  );
}
