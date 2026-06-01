import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-kokan-cream/20 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-kokan-green text-sm hover:underline mb-6 block">← Back to Home</Link>
        <h1 className="font-playfair text-3xl font-bold text-kokan-earth mb-2">Terms of Service</h1>
        <p className="text-kokan-earth/50 text-sm mb-8">Last updated: May 2026</p>
        <div className="bg-white rounded-2xl p-8 border border-kokan-sand/30 space-y-6 text-sm text-kokan-earth/70 leading-relaxed">
          {[
            { title: "Acceptance of Terms", content: "By accessing and using Visit Kokan, you accept and agree to be bound by the terms and provision of this agreement." },
            { title: "Use of Service", content: "You may use our service only for lawful purposes and in accordance with these Terms. You agree not to use our service in any way that violates applicable laws or regulations." },
            { title: "User Accounts", content: "When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding your password and for all activities that occur under your account." },
            { title: "Vendor Terms", content: "Vendors listing on Visit Kokan must provide accurate information about their products and services. Visit Kokan reserves the right to remove listings that violate our guidelines." },
            { title: "Payment Terms", content: "All payments are processed securely through Razorpay. Visit Kokan does not store your payment card details. Refund policies are subject to individual vendor terms." },
            { title: "Limitation of Liability", content: "Visit Kokan shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service." },
            { title: "Contact", content: "For questions about these Terms, please contact us at legal@visitkokan.in" },
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