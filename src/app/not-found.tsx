export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-kokan-cream">
      <h1 className="text-6xl font-display text-kokan-green mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      
        href="/"
        className="px-6 py-2 bg-kokan-green text-white rounded-lg hover:bg-kokan-teal transition-colors"
      <a>
        Go Home
      </a>
    </div>
  )
}