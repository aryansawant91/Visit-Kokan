import { Phone, Globe, MapPin, ShieldCheck } from "lucide-react";

interface Props {
  vendorName?: string;
  phone?: string;
  website?: string;
  region: string;
  addedByAdmin?: boolean;
}

export default function VendorInfo({ vendorName, phone, website, region, addedByAdmin }: Props) {
  return (
    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-full bg-kokan-green/10 flex items-center justify-center">
          {addedByAdmin ? (
            <ShieldCheck size={18} className="text-kokan-green" />
          ) : (
            <span className="text-kokan-green font-bold text-sm">
              {vendorName?.[0]?.toUpperCase() ?? "V"}
            </span>
          )}
        </div>
        <div>
          <p className="font-semibold text-kokan-earth text-sm">
            {addedByAdmin ? "Visit Kokan Team" : vendorName ?? "Vendor"}
          </p>
          {addedByAdmin && (
            <span className="text-xs text-kokan-green font-medium">✓ Official Listing</span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin size={14} className="text-kokan-green" />
          {region}, Maharashtra
        </div>
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-kokan-green transition-colors"
          >
            <Phone size={14} className="text-kokan-green" /> {phone}
          </a>
        )}
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-kokan-green transition-colors truncate"
          >
            <Globe size={14} className="text-kokan-green" />
            {website.replace("https://", "").replace("http://", "")}
          </a>
        )}
      </div>
    </div>
  );
}