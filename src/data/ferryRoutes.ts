export interface FerryFareItem {
  type: string;
  price: number;
  note?: string;
}

export interface FerryRoute {
  id: string;
  name: string;
  tagline: string;
  district: "Raigad" | "Ratnagiri" | "Mumbai";
  waterBody: string;
  fromPort: {
    name: string;
    location: string;
    mapsUrl: string;
    nearbyDestinations: { name: string; slug: string }[];
  };
  toPort: {
    name: string;
    location: string;
    mapsUrl: string;
    nearbyDestinations: { name: string; slug: string }[];
  };
  durationMins: number;
  detourTimeSaved: string;
  detourKmSaved: number;
  frequencyText: string;
  firstFerry: string;
  lastFerry: string;
  operator: string;
  helpline: string;
  vehicleTypes: string[]; // "Cars & SUVs", "Bikes & Scooters", "Passengers", "Bicycles", "Buses"
  fares: {
    passengerAdult: number;
    passengerChild?: number;
    twoWheeler: number;
    carSmall: number;
    carSuv: number;
    bicycle?: number;
  };
  schedule: {
    departureFromA: string[];
    departureFromB: string[];
  };
  boardingTips: string[];
  operationalNotice: string;
}

export const KONKAN_FERRY_ROUTES: FerryRoute[] = [
  {
    id: "mumbai-mandwa-roro",
    name: "Mumbai ⇄ Mandwa (Alibaug) Ro-Pax Ferry",
    tagline: "Drive your car or bike straight onto the ship & cruise across Mumbai Harbour in 50 minutes",
    district: "Raigad",
    waterBody: "Mumbai Harbour / Arabian Sea",
    fromPort: {
      name: "Bhaucha Dhakka (Ferry Wharf)",
      location: "Mazgaon, South Mumbai",
      mapsUrl: "https://maps.google.com/?q=Bhaucha+Dhakka+Ferry+Wharf+Mumbai",
      nearbyDestinations: [
        { name: "South Mumbai", slug: "alibaug-beach" }
      ],
    },
    toPort: {
      name: "Mandwa Jetty",
      location: "Mandwa, Alibaug, Raigad",
      mapsUrl: "https://maps.google.com/?q=Mandwa+Jetty+Alibaug",
      nearbyDestinations: [
        { name: "Alibaug Beach", slug: "alibaug-beach" },
        { name: "Kashid Beach", slug: "kashid" },
        { name: "Kolaba Fort", slug: "kolaba-fort" }
      ],
    },
    durationMins: 55,
    detourTimeSaved: "2.5 to 3.5 Hours",
    detourKmSaved: 105,
    frequencyText: "Every 1.5 to 2 Hours (Daily)",
    firstFerry: "07:00 AM",
    lastFerry: "08:00 PM",
    operator: "M2M Ferries & Maharashtra Maritime Board (MMB)",
    helpline: "+91 84325 87706",
    vehicleTypes: ["Cars & SUVs", "Bikes & Scooters", "Passengers", "Bicycles", "Pets"],
    fares: {
      passengerAdult: 420,
      passengerChild: 250,
      twoWheeler: 240,
      carSmall: 1020,
      carSuv: 1250,
      bicycle: 110,
    },
    schedule: {
      departureFromA: ["07:00 AM", "09:00 AM", "11:30 AM", "01:30 PM", "04:00 PM", "06:30 PM", "08:00 PM"],
      departureFromB: ["07:45 AM", "10:15 AM", "12:30 PM", "02:45 PM", "05:15 PM", "07:15 PM", "09:00 PM"],
    },
    boardingTips: [
      "Arrive at least 30 minutes before sailing for smooth vehicle check-in and scan.",
      "Advance booking recommended for cars on Saturday & Sunday peak departures.",
      "Air-conditioned passenger lounges and open-air sundecks available on board.",
      "Pets (dogs/cats) are welcome on the upper sundeck with a pet pass."
    ],
    operationalNotice: "Runs all year round including monsoon (weather permitting). Speedboats suspend operations during heavy monsoon swells, but the M2M Ro-Pax ship sails smoothly.",
  },
  {
    id: "bagmandla-bankot",
    name: "Bagmandla ⇄ Bankot Coastal Creek Ferry",
    tagline: "Cross the scenic Savitri River estuary linking Harihareshwar directly to Velas Turtle Beach",
    district: "Ratnagiri",
    waterBody: "Savitri River Estuary",
    fromPort: {
      name: "Bagmandla Jetty",
      location: "Near Harihareshwar, Raigad District",
      mapsUrl: "https://maps.google.com/?q=Bagmandla+Ferry+Boat+Point",
      nearbyDestinations: [
        { name: "Harihareshwar Beach & Temple", slug: "harihareshwar" },
        { name: "Shrivardhan Beach", slug: "shrivardhan" }
      ],
    },
    toPort: {
      name: "Bankot Jetty",
      location: "Bankot, Mandangad / Ratnagiri District",
      mapsUrl: "https://maps.google.com/?q=Bankot+Ferry+Point",
      nearbyDestinations: [
        { name: "Velas Beach (Turtle Sanctuary)", slug: "velas-beach" },
        { name: "Bankot Fort", slug: "bankot-fort" },
        { name: "Kelshi Beach", slug: "kelshi-beach" }
      ],
    },
    durationMins: 15,
    detourTimeSaved: "2.5 Hours",
    detourKmSaved: 85,
    frequencyText: "Every 30 to 45 Minutes (Continuous Service)",
    firstFerry: "06:30 AM",
    lastFerry: "09:30 PM",
    operator: "Suvarnadurga Shipping & Marine Services",
    helpline: "+91 84325 87706",
    vehicleTypes: ["Cars & SUVs", "Bikes & Scooters", "Passengers", "Bicycles", "Light Tempos"],
    fares: {
      passengerAdult: 25,
      passengerChild: 15,
      twoWheeler: 60,
      carSmall: 180,
      carSuv: 220,
      bicycle: 25,
    },
    schedule: {
      departureFromA: ["06:30 AM", "07:15 AM", "08:00 AM", "08:45 AM", "09:30 AM", "10:15 AM", "11:00 AM", "11:45 AM", "12:30 PM", "01:30 PM", "02:15 PM", "03:00 PM", "03:45 PM", "04:30 PM", "05:15 PM", "06:00 PM", "06:45 PM", "07:30 PM", "08:15 PM", "09:00 PM"],
      departureFromB: ["06:50 AM", "07:35 AM", "08:20 AM", "09:05 AM", "09:50 AM", "10:35 AM", "11:20 AM", "12:05 PM", "01:00 PM", "01:50 PM", "02:35 PM", "03:20 PM", "04:05 PM", "04:50 PM", "05:35 PM", "06:20 PM", "07:05 PM", "07:50 PM", "08:35 PM", "09:20 PM"],
    },
    boardingTips: [
      "No advance booking required — tickets are issued on the spot via Cash or UPI at the jetty booth.",
      "Stay inside or close to your car and keep the handbrake engaged once parked on the deck ramp.",
      "Saves a huge detour via Mangaon and Mahad ghats when traveling between Harihareshwar and Velas.",
      "During peak Velas Turtle Festival weekends (Feb to April), arrive 15-20 mins earlier to beat vehicle queues."
    ],
    operationalNotice: "Operational throughout the year. Services may briefly hold for 20-30 minutes during extreme spring low tides or heavy squalls.",
  },
  {
    id: "dighi-agardanda",
    name: "Agardanda ⇄ Dighi Vehicle Ferry",
    tagline: "The fastest sea shortcut linking Murud-Janjira Fort to Diveagar and Shrivardhan",
    district: "Raigad",
    waterBody: "Rajpuri Creek",
    fromPort: {
      name: "Agardanda Jetty",
      location: "Near Murud-Janjira, Raigad District",
      mapsUrl: "https://maps.google.com/?q=Agardanda+Jetty",
      nearbyDestinations: [
        { name: "Murud-Janjira Fort", slug: "murud-janjira" },
        { name: "Kashid Beach", slug: "kashid" }
      ],
    },
    toPort: {
      name: "Dighi Port Jetty",
      location: "Dighi, Shrivardhan Taluka, Raigad",
      mapsUrl: "https://maps.google.com/?q=Dighi+Jetty",
      nearbyDestinations: [
        { name: "Diveagar Beach", slug: "diveagar" },
        { name: "Shrivardhan Beach", slug: "shrivardhan" }
      ],
    },
    durationMins: 20,
    detourTimeSaved: "1.5 Hours",
    detourKmSaved: 55,
    frequencyText: "Every 45 Minutes",
    firstFerry: "06:00 AM",
    lastFerry: "09:00 PM",
    operator: "Suvarnadurga Shipping & Marine Services",
    helpline: "+91 84325 87706",
    vehicleTypes: ["Cars & SUVs", "Bikes & Scooters", "Passengers", "Bicycles"],
    fares: {
      passengerAdult: 25,
      twoWheeler: 60,
      carSmall: 180,
      carSuv: 220,
      bicycle: 25,
    },
    schedule: {
      departureFromA: ["06:00 AM", "06:45 AM", "07:30 AM", "08:15 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"],
      departureFromB: ["06:25 AM", "07:10 AM", "07:55 AM", "08:40 AM", "09:30 AM", "10:30 AM", "11:30 AM", "12:30 PM", "01:30 PM", "02:30 PM", "03:30 PM", "04:30 PM", "05:30 PM", "06:30 PM", "07:30 PM", "08:30 PM", "09:20 PM"],
    },
    boardingTips: [
      "Crucial route for travelers visiting Murud-Janjira before heading south towards Diveagar.",
      "Tickets are bought at the ramp entrance; QR / UPI payment supported.",
      "Check tide status during midday summer low tides as heavy ramp angles can occur."
    ],
    operationalNotice: "Active regular departures daily. Avoids the long detour around Roha and Tala inland highways.",
  },
  {
    id: "dabhol-dhopave",
    name: "Dabhol ⇄ Dhopave Vehicle Ferry",
    tagline: "Connects Dapoli, Harnai & Anjarle directly to Guhagar & Velneshwar across the Vashishti river",
    district: "Ratnagiri",
    waterBody: "Vashishti River Estuary",
    fromPort: {
      name: "Dabhol Jetty",
      location: "Dabhol, Dapoli Taluka, Ratnagiri",
      mapsUrl: "https://maps.google.com/?q=Dabhol+Ferry+Boat+Point",
      nearbyDestinations: [
        { name: "Dapoli", slug: "dapoli" },
        { name: "Harnai Beach & Harbour", slug: "harnai" },
        { name: "Anjarle Beach", slug: "anjarle" }
      ],
    },
    toPort: {
      name: "Dhopave Jetty",
      location: "Dhopave, Guhagar Taluka, Ratnagiri",
      mapsUrl: "https://maps.google.com/?q=Dhopave+Ferry+Boat+Point",
      nearbyDestinations: [
        { name: "Guhagar Beach", slug: "guhagar" },
        { name: "Velneshwar Beach", slug: "velneshwar" }
      ],
    },
    durationMins: 15,
    detourTimeSaved: "2.5 Hours",
    detourKmSaved: 80,
    frequencyText: "Every 35 to 45 Minutes",
    firstFerry: "06:15 AM",
    lastFerry: "09:45 PM",
    operator: "Suvarnadurga Shipping & Marine Services",
    helpline: "+91 84325 87706",
    vehicleTypes: ["Cars & SUVs", "Bikes & Scooters", "Passengers", "Bicycles", "Tempos"],
    fares: {
      passengerAdult: 25,
      twoWheeler: 60,
      carSmall: 180,
      carSuv: 230,
      bicycle: 25,
    },
    schedule: {
      departureFromA: ["06:15 AM", "07:00 AM", "07:45 AM", "08:30 AM", "09:15 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "03:45 PM", "04:30 PM", "05:15 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "09:45 PM"],
      departureFromB: ["06:35 AM", "07:20 AM", "08:05 AM", "08:50 AM", "09:35 AM", "10:30 AM", "11:30 AM", "12:30 PM", "01:30 PM", "02:30 PM", "03:20 PM", "04:05 PM", "04:50 PM", "05:35 PM", "06:30 PM", "07:30 PM", "08:30 PM", "09:20 PM", "10:00 PM"],
    },
    boardingTips: [
      "Avoids the tedious inland drive through Khed, Chiplun, and the NH66 traffic bottleneck.",
      "Keep headlights switched on during sunset and night crossings.",
      "Local fishermen and dolphin pods are frequently spotted in the estuary waters near Dabhol."
    ],
    operationalNotice: "Year-round daily service. In case of rare night delays, contact the jetty master helpline.",
  },
  {
    id: "jaigad-tavsal",
    name: "Jaigad ⇄ Tavsal Vehicle Ferry",
    tagline: "Direct sea bridge linking Guhagar & Hedvi to Ganpatipule Temple and Ratnagiri city",
    district: "Ratnagiri",
    waterBody: "Shastri River Estuary",
    fromPort: {
      name: "Tavsal Jetty",
      location: "Tavsal, Guhagar Taluka, Ratnagiri",
      mapsUrl: "https://maps.google.com/?q=Tavsal+Ferry+Boat+Point",
      nearbyDestinations: [
        { name: "Guhagar Beach", slug: "guhagar" },
        { name: "Velneshwar Beach", slug: "velneshwar" }
      ],
    },
    toPort: {
      name: "Jaigad Jetty",
      location: "Jaigad, Ratnagiri Taluka",
      mapsUrl: "https://maps.google.com/?q=Jaigad+Ferry+Point",
      nearbyDestinations: [
        { name: "Jaigad Fort", slug: "jaigad-fort" },
        { name: "Ganpatipule Beach", slug: "ganpatipule-beach" },
        { name: "Ratnagiri", slug: "ratnagiri" }
      ],
    },
    durationMins: 15,
    detourTimeSaved: "2.0 Hours",
    detourKmSaved: 65,
    frequencyText: "Every 45 Minutes",
    firstFerry: "06:30 AM",
    lastFerry: "09:30 PM",
    operator: "Suvarnadurga Shipping & Marine Services",
    helpline: "+91 84325 87706",
    vehicleTypes: ["Cars & SUVs", "Bikes & Scooters", "Passengers", "Bicycles"],
    fares: {
      passengerAdult: 25,
      twoWheeler: 60,
      carSmall: 180,
      carSuv: 230,
      bicycle: 25,
    },
    schedule: {
      departureFromA: ["06:30 AM", "07:15 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"],
      departureFromB: ["06:50 AM", "07:35 AM", "08:30 AM", "09:30 AM", "10:30 AM", "11:30 AM", "12:30 PM", "01:30 PM", "02:30 PM", "03:30 PM", "04:30 PM", "05:30 PM", "06:30 PM", "07:30 PM", "08:30 PM", "09:30 PM"],
    },
    boardingTips: [
      "The premier route for tourists doing the coastal Maharashtra road trip from Guhagar to Ganpatipule.",
      "Provides stunning views of Jaigad Sea Fort and the historic lighthouse as you approach Jaigad bay.",
      "Fuel pumps and village tea stalls are located right beside the Tavsal ramp entrance."
    ],
    operationalNotice: "Smooth continuous service throughout the year.",
  },
];

