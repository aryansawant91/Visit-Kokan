import { Metadata } from "next";
import FerryClientView from "./FerryClientView";

export const metadata: Metadata = {
  title: "Konkan Ferry & Ro-Ro Timetables 2026 — Vehicle Fares, Routes & Schedules | Visit Kokan",
  description:
    "Official schedules, vehicle fares and real-time guidance for coastal ferries across Maharashtra: Mumbai-Mandwa Ro-Ro, Bagmandla-Bankot (Velas), Dighi-Agardanda, Dabhol-Dhopave, and Jaigad-Tavsal.",
  keywords: [
    "Konkan ferry timings",
    "Mumbai Mandwa Ro-Ro fares",
    "Bagmandla Bankot ferry",
    "Dabhol Dhopave ferry timings",
    "Jaigad Tavsal vehicle ferry",
    "Konkan coastal highway ferry",
    "Velas turtle festival ferry",
    "Harihareshwar to Velas ferry",
  ],
  openGraph: {
    title: "Konkan Coastal Ferry & Ro-Ro Directory 2026 | Visit Kokan",
    description:
      "Save hours on your Konkan coastal road trip. Vehicle fares, live timings, and jetty locations for cars, bikes & passengers across coastal Maharashtra.",
    url: "https://visitkokan.in/ferry",
    type: "website",
  },
};

export default function FerryPage() {
  return <FerryClientView />;
}
