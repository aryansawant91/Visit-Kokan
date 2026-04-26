import { TrekItineraryDay } from "@/types/trek";
import { MapPin } from "lucide-react";

interface Props {
  itinerary: TrekItineraryDay[];
}

export default function TrekItinerary({ itinerary }: Props) {
  if (!itinerary || itinerary.length === 0) return null;

  return (
    <div className="space-y-4">
      {itinerary.map((day, i) => (
        <div key={i} className="flex gap-4">
          {/* Timeline */}
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-kokan-green text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              {day.day}
            </div>
            {i < itinerary.length - 1 && (
              <div className="w-0.5 bg-kokan-green/20 flex-1 mt-2" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-6">
            <h4 className="font-semibold text-kokan-earth mb-1">{day.title}</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{day.description}</p>
            {(day.distance || day.duration) && (
              <div className="flex gap-4 mt-2">
                {day.distance && (
                  <span className="text-xs text-kokan-green font-medium bg-kokan-green/10 px-2 py-0.5 rounded-full">
                    📍 {day.distance}
                  </span>
                )}
                {day.duration && (
                  <span className="text-xs text-kokan-green font-medium bg-kokan-green/10 px-2 py-0.5 rounded-full">
                    ⏱ {day.duration}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}