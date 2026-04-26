import { MapPin, ExternalLink } from "lucide-react";

interface Props {
  name: string;
  region: string;
}

export default function DestinationMap({ name, region }: Props) {
  const query = encodeURIComponent(`${name}, ${region}, Maharashtra, India`);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
      <div className="relative">
        <iframe
          width="100%"
          height="300"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${query}&output=embed`}
        />
      </div>

      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 py-3 bg-white border-t border-gray-100 text-kokan-green font-medium text-sm hover:bg-kokan-green/5 transition-colors"
      >
        <MapPin size={15} />
        Open in Google Maps
        <ExternalLink size={13} />
      </a>
    </div>
  );
}