import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-kokan-cream/20 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-kokan-green text-sm hover:underline mb-6 block">← Back to Home</Link>
        <h1 className="font-playfair text-3xl font-bold text-kokan-earth mb-2">Privacy Policy</h1>
        <p className="text-kokan-earth/50 text-sm mb-8">Last updated: May 2026</p>
        <div className="bg-white rounded-2xl p-8 border border-kokan-sand/30 space-y-6 text-sm text-kokan-earth/70 leading-relaxed">
          {[
            { title: "Information We Collect", content: "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This includes name, email address, phone number, and payment information." },
            { title: "How We Use Your Information", content: "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions." },
            { title: "Information Sharing", content: "We do not sell, trade, or otherwise transfer your personally identifiable information to third parties without your consent, except to provide our services or as required by law." },
            { title: "Data Security", content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction." },
            { title: "Cookies", content: "We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent." },
            { title: "Contact Us", content: "If you have any questions about this Privacy Policy, please contact us at privacy@visitkokan.in" },
          ].map((section) => (
            <div key={section.title}>
              <h2 className="font-semibold text-kokan-earth text-base mb-2">{section.title}</h2>
              <p>{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}