"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import {
  LISTING_CATEGORIES,
  LISTING_REGIONS,
  PRICE_UNITS,
  STAY_TYPES,
  BEACH_DISTANCES,
  MEAL_OPTIONS,
  AMENITY_CATEGORIES,
} from "@/constants/listingConstants";
import {
  Upload,
  X,
  Plus,
  Check,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Building2,
  Bed,
  Utensils,
  Sparkles,
  Camera,
  IndianRupee,
  ShieldCheck,
  Clock,
  Info,
  CheckCircle2,
  AlertCircle,
  Eye,
  Loader2,
  Star,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "@/lib/firebase";

const STEPS = [
  { id: 1, title: "Property Type", short: "Basics", icon: Building2 },
  { id: 2, title: "Location & Proximity", short: "Location", icon: MapPin },
  { id: 3, title: "Rooms, Capacity & Food", short: "Rooms & Dining", icon: Bed },
  { id: 4, title: "Amenities & Features", short: "Amenities", icon: Sparkles },
  { id: 5, title: "Photos, Rates & Policies", short: "Rates & Photos", icon: IndianRupee },
];

export default function VendorNewListingPage() {
  const { user, profile } = useAuth();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [customAmenity, setCustomAmenity] = useState("");
  const [validationError, setValidationError] = useState("");

  const [form, setForm] = useState({
    name: "",
    tagline: "",
    description: "",
    category: "homestay",
    stayType: "entire_place",
    region: "Sindhudurg",
    destinationArea: "Malvan & Tarkarli",
    address: "",
    landmark: "",
    distanceToBeach: "2-3 min walk (Under 200m)",
    nearestStation: "",
    bedrooms: "2",
    bathrooms: "2",
    maxGuests: "6",
    mealsAvailable: ["Complimentary Konkani Breakfast (Ghavane, Poha, Chai)", "Authentic Malvani Fish & Chicken Thali on Request"] as string[],
    amenities: [
      "Air Conditioning (AC)",
      "24/7 Power Backup (Inverter/DG)",
      "High-Speed Wi-Fi",
      "Hot Water Geyser",
      "Attached Western Washroom",
      "Free Car & Bus Parking on Premises",
      "Family & Children Friendly",
    ] as string[],
    price: "",
    weekendPrice: "",
    extraGuestPrice: "350",
    priceUnit: "per night",
    cancellationPolicy: "moderate",
    checkInTime: "12:00 PM",
    checkOutTime: "10:30 AM",
    phone: profile?.phone ?? "",
    whatsapp: profile?.whatsapp ?? profile?.phone ?? "",
    houseRules: [
      "Valid Government ID required for all adult guests at check-in",
      "Quiet hours after 10:30 PM to respect neighboring village tranquility",
    ] as string[],
  });

  const setField = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setValidationError("");
  };

  const toggleAmenity = (item: string) => {
    setForm((prev) => {
      const exists = prev.amenities.includes(item);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== item)
          : [...prev.amenities, item],
      };
    });
  };

  const addCustomAmenity = () => {
    const val = customAmenity.trim();
    if (!val || form.amenities.includes(val)) return;
    setForm((prev) => ({ ...prev, amenities: [...prev.amenities, val] }));
    setCustomAmenity("");
  };

  const toggleMealOption = (meal: string) => {
    setForm((prev) => {
      const exists = prev.mealsAvailable.includes(meal);
      return {
        ...prev,
        mealsAvailable: exists
          ? prev.mealsAvailable.filter((m) => m !== meal)
          : [...prev.mealsAvailable, meal],
      };
    });
  };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    // Agoda/MMT allow up to 10 rich photos
    const combinedFiles = [...imageFiles, ...files].slice(0, 10);
    setImageFiles(combinedFiles);

    const newPreviews = [...imagePreviews];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result && newPreviews.length < 10) {
          newPreviews.push(ev.target.result as string);
          setImagePreviews([...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (i: number) => {
    setImageFiles((prev) => prev.filter((_, idx) => idx !== i));
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const makeCoverImage = (index: number) => {
    if (index === 0) return;
    setImageFiles((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      return [item, ...copy];
    });
    setImagePreviews((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      return [item, ...copy];
    });
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= imagePreviews.length) return;
    setImageFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
    setImagePreviews((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!form.name.trim()) return "Please enter a property name.";
      if (form.name.length < 3) return "Property name must be at least 3 characters.";
      if (!form.description.trim()) return "Please provide a description of your property.";
    }
    if (step === 2) {
      if (!form.address.trim()) return "Please enter the physical property address.";
      if (!form.landmark.trim()) return "Please enter a prominent nearby landmark.";
    }
    if (step === 5) {
      if (!form.price || Number(form.price) <= 0) return "Please enter a valid base nightly price.";
      if (imageFiles.length === 0) return "Please upload at least 1 photo of your property.";
    }
    return "";
  };

  const handleNext = () => {
    const err = validateStep(currentStep);
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError("");
    setCurrentStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setValidationError("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!user) return;
    const err = validateStep(5);
    if (err) {
      setValidationError(err);
      return;
    }

    setSubmitting(true);
    setValidationError("");

    try {
      const storage = getStorage(app);
      const imageUrls: string[] = [];

      for (const file of imageFiles) {
        const storageRef = ref(storage, `listings/vendor/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }

      const slug =
        form.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "") +
        "-" +
        Date.now();

      await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          weekendPrice: form.weekendPrice ? Number(form.weekendPrice) : Number(form.price),
          extraGuestPrice: form.extraGuestPrice ? Number(form.extraGuestPrice) : 0,
          bedrooms: Number(form.bedrooms) || 1,
          bathrooms: Number(form.bathrooms) || 1,
          maxGuests: Number(form.maxGuests) || 4,
          images: imageUrls,
          coverImage: imageUrls[0] || "",
          slug,
          vendorId: user.uid,
          vendorName: profile?.businessName || user.displayName || "Host Partner",
        }),
      });

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setValidationError("Submission failed. Please check your network and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="py-16 text-center max-w-lg mx-auto px-4 space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-[#2ecc71]/15 text-[#2ecc71] flex items-center justify-center mx-auto text-4xl shadow-xl shadow-[#2ecc71]/10">
          🎉
        </div>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Property Submitted for Verification!
          </h1>
          <p className="text-white/60 text-xs sm:text-sm mt-2 leading-relaxed">
            Your listing <strong>&ldquo;{form.name}&rdquo;</strong> has been received by the Visit Kokan Destination Team. Our local concierge will review your photos and approve it within 4 to 12 hours.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-white/60 space-y-1.5 text-left">
          <div className="flex items-center gap-2 text-[#2ecc71] font-bold">
            <CheckCircle2 size={16} />
            <span>Next steps for host partner:</span>
          </div>
          <p>• We verify that bedroom and bathroom photos are clear and authentic.</p>
          <p>• Your WhatsApp contact is connected for direct, zero-commission guest inquiries.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setSuccess(false);
              setCurrentStep(1);
              setImageFiles([]);
              setImagePreviews([]);
            }}
            className="flex-1 py-3 px-4 rounded-xl border border-white/15 text-xs font-bold text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            Add Another Property
          </button>
          <button
            type="button"
            onClick={() => router.push("/vendor/listings")}
            className="flex-1 py-3 px-4 rounded-xl bg-[#2ecc71] hover:bg-[#27ae60] text-black text-xs font-black shadow-md transition-colors cursor-pointer"
          >
            Go to My Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* ── Wizard Header ── */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#2ecc71] uppercase tracking-wider mb-1">
          <Building2 size={14} />
          <span>MakeMyTrip / Agoda Partner Onboarding Standard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          List Your Property on Visit Kokan
        </h1>
        <p className="text-xs text-white/50 mt-1">
          Complete the 5 quick sections below to showcase your homestay, beach villa, or cottage to thousands of Maharashtra travelers.
        </p>
      </div>

      {/* ── Step Progress Indicator Bar ── */}
      <div className="bg-[#141414] p-3 rounded-2xl border border-white/5 shadow-md">
        <div className="grid grid-cols-5 gap-2">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isDone = currentStep > s.id;
            const isCurrent = currentStep === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  if (s.id < currentStep) setCurrentStep(s.id);
                }}
                disabled={s.id > currentStep}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-1 sm:px-2.5 rounded-xl transition-all text-center sm:text-left ${
                  isCurrent
                    ? "bg-[#2ecc71] text-black font-extrabold shadow-sm"
                    : isDone
                    ? "bg-[#2ecc71]/15 text-[#2ecc71] font-semibold cursor-pointer"
                    : "text-white/30 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-1.5 shrink-0">
                  {isDone ? (
                    <Check size={14} className="stroke-[3]" />
                  ) : (
                    <Icon size={14} />
                  )}
                  <span className="text-[11px] hidden sm:inline">
                    {s.id}. {s.short}
                  </span>
                </div>
                <span className="text-[10px] sm:hidden font-bold">
                  {s.id}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Error Banner ── */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <AlertCircle size={16} className="shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 1: PROPERTY TYPE & BASICS
         ══════════════════════════════════════════════════════════════════ */}
      {currentStep === 1 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="bg-[#141414] rounded-3xl p-6 sm:p-7 border border-white/5 space-y-5">
            <div className="border-b border-white/5 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 size={18} className="text-[#2ecc71]" />
                <span>1. Property Basics &amp; Hosting Style</span>
              </h2>
              <p className="text-xs text-white/40 mt-0.5">
                Tell travelers what type of stay you offer and give it a memorable title
              </p>
            </div>

            {/* Hosting Style Selection (Like Airbnb & Agoda) */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">
                Property Architecture / Stay Style *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STAY_TYPES.map((st) => (
                  <div
                    key={st.value}
                    onClick={() => setField("stayType", st.value)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      form.stayType === st.value
                        ? "bg-[#2ecc71]/10 border-[#2ecc71] shadow-xs"
                        : "bg-white/[0.02] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">
                          {st.label}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            form.stayType === st.value
                              ? "border-[#2ecc71] bg-[#2ecc71]"
                              : "border-white/30"
                          }`}
                        >
                          {form.stayType === st.value && (
                            <Check size={10} className="text-black stroke-[3]" />
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-white/50 mt-1 leading-normal">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Property Name */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">
                Property Title / Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="e.g. Samant Sea Breeze Villa &amp; Malvani Homestay"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2ecc71] placeholder:text-white/30"
              />
              <p className="text-[11px] text-white/40 mt-1">
                Tip: Properties with terms like &ldquo;Beach Touch&rdquo;, &ldquo;Wada&rdquo;, or &ldquo;Homestay&rdquo; receive 40% higher clicks.
              </p>
            </div>

            {/* Category + Tagline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">
                  Main Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setField("category", e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                >
                  {LISTING_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.emoji} {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">
                  Short Tagline / Catchphrase (Optional)
                </label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setField("tagline", e.target.value)}
                  placeholder="e.g. 50m from Tarkarli beach with authentic fish curry"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-[#2ecc71] placeholder:text-white/30"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">
                Full Description &amp; Guest Experience *
              </label>
              <textarea
                rows={4}
                required
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Describe your property: proximity to the beach, garden surroundings, bedroom comfort, homecooked Konkani food prepared by family, and warm local hospitality..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-[#2ecc71] leading-relaxed placeholder:text-white/30"
              />
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 2: LOCATION & PROXIMITY
         ══════════════════════════════════════════════════════════════════ */}
      {currentStep === 2 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="bg-[#141414] rounded-3xl p-6 sm:p-7 border border-white/5 space-y-5">
            <div className="border-b border-white/5 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin size={18} className="text-[#2ecc71]" />
                <span>2. Location &amp; Beach Proximity</span>
              </h2>
              <p className="text-xs text-white/40 mt-0.5">
                Konkan travelers prioritize walking distance to beaches and accessible landmarks
              </p>
            </div>

            {/* Region / District & Destination Hub */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">
                  District *
                </label>
                <select
                  value={form.region}
                  onChange={(e) => setField("region", e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                >
                  {LISTING_REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">
                  Tourist Hub / Destination Area
                </label>
                <input
                  type="text"
                  value={form.destinationArea}
                  onChange={(e) => setField("destinationArea", e.target.value)}
                  placeholder="e.g. Malvan / Tarkarli / Alibaug / Dapoli / Guhagar"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-[#2ecc71] placeholder:text-white/30"
                />
              </div>
            </div>

            {/* Distance to Beach (MMT & Agoda signature filter) */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">
                Distance to Nearest Beach *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {BEACH_DISTANCES.map((d) => (
                  <div
                    key={d}
                    onClick={() => setField("distanceToBeach", d)}
                    className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 ${
                      form.distanceToBeach === d
                        ? "bg-[#2ecc71]/15 text-[#2ecc71] border-[#2ecc71]"
                        : "bg-white/[0.02] border-white/10 text-white/70 hover:border-white/20"
                    }`}
                  >
                    <span>🏖️</span>
                    <span className="truncate">{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Landmark & Detailed Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">
                  Prominent Landmark *
                </label>
                <input
                  type="text"
                  required
                  value={form.landmark}
                  onChange={(e) => setField("landmark", e.target.value)}
                  placeholder="e.g. Behind Rameshwar Temple / Near Dandi Beach"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-[#2ecc71] placeholder:text-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">
                  Nearest Railway Station / Bus Stand
                </label>
                <input
                  type="text"
                  value={form.nearestStation}
                  onChange={(e) => setField("nearestStation", e.target.value)}
                  placeholder="e.g. Kudal Railway Station (28 km) / NH66"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-[#2ecc71] placeholder:text-white/30"
                />
              </div>
            </div>

            {/* Full Street Address */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">
                Full Physical Address *
              </label>
              <textarea
                rows={2}
                required
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
                placeholder="House / Plot Number, Village / Wadi, Post Office, Taluka, District, Pincode"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#2ecc71] placeholder:text-white/30"
              />
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 3: ROOMS, CAPACITY & FOOD
         ══════════════════════════════════════════════════════════════════ */}
      {currentStep === 3 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="bg-[#141414] rounded-3xl p-6 sm:p-7 border border-white/5 space-y-5">
            <div className="border-b border-white/5 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Bed size={18} className="text-[#2ecc71]" />
                <span>3. Rooms, Guest Capacity &amp; Konkani Food</span>
              </h2>
              <p className="text-xs text-white/40 mt-0.5">
                Specify your room inventory and signature local dining experiences
              </p>
            </div>

            {/* Room Inventory Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                <label className="block text-xs font-bold text-white mb-2">
                  🛏️ Total Bedrooms
                </label>
                <div className="flex items-center gap-2">
                  {["1", "2", "3", "4", "5+"].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setField("bedrooms", num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                        form.bedrooms === num
                          ? "bg-[#2ecc71] text-black"
                          : "bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                <label className="block text-xs font-bold text-white mb-2">
                  🚿 Bathrooms
                </label>
                <div className="flex items-center gap-2">
                  {["1", "2", "3", "4+"].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setField("bathrooms", num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                        form.bathrooms === num
                          ? "bg-[#2ecc71] text-black"
                          : "bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                <label className="block text-xs font-bold text-white mb-2">
                  👥 Max Guests Allowed
                </label>
                <div className="flex items-center gap-2">
                  {["2", "4", "6", "8", "12+"].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setField("maxGuests", num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                        form.maxGuests === num
                          ? "bg-[#2ecc71] text-black"
                          : "bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Konkani Dining & Food Options */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-white/90 mb-1 flex items-center gap-1.5">
                <Utensils size={14} className="text-amber-400" />
                <span>Food &amp; Dining Facilities Available for Guests</span>
              </label>
              <p className="text-[11px] text-white/40 mb-3">
                Authentic food is the #1 reason travelers choose Konkan homestays over hotels.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MEAL_OPTIONS.map((meal) => {
                  const isChecked = form.mealsAvailable.includes(meal);
                  return (
                    <div
                      key={meal}
                      onClick={() => toggleMealOption(meal)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 text-xs ${
                        isChecked
                          ? "bg-amber-500/10 text-amber-200 border-amber-500/40 font-semibold"
                          : "bg-white/[0.02] border-white/5 text-white/60 hover:border-white/15"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                          isChecked
                            ? "bg-amber-400 border-amber-400 text-black"
                            : "border-white/20"
                        }`}
                      >
                        {isChecked && <Check size={11} className="stroke-[3]" />}
                      </div>
                      <span className="leading-tight">{meal}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 4: AMENITIES & FEATURES
         ══════════════════════════════════════════════════════════════════ */}
      {currentStep === 4 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="bg-[#141414] rounded-3xl p-6 sm:p-7 border border-white/5 space-y-6">
            <div className="border-b border-white/5 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles size={18} className="text-[#2ecc71]" />
                <span>4. Amenities &amp; Konkan Comforts</span>
              </h2>
              <p className="text-xs text-white/40 mt-0.5">
                Select all features available on your premises (categorized like MakeMyTrip &amp; Agoda)
              </p>
            </div>

            {/* Categorized Amenity Groups */}
            <div className="space-y-5">
              {AMENITY_CATEGORIES.map((grp) => (
                <div key={grp.category} className="space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2ecc71]">
                    {grp.category}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {grp.items.map((item) => {
                      const selected = form.amenities.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleAmenity(item)}
                          className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-left flex items-center gap-2 cursor-pointer ${
                            selected
                              ? "bg-[#2ecc71]/15 text-[#2ecc71] border-[#2ecc71] font-bold"
                              : "bg-white/[0.02] border-white/10 text-white/60 hover:border-white/20"
                          }`}
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                              selected
                                ? "bg-[#2ecc71] border-[#2ecc71] text-black"
                                : "border-white/30"
                            }`}
                          >
                            {selected && <Check size={10} className="stroke-[3]" />}
                          </div>
                          <span className="truncate">{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Extra Amenity */}
            <div className="pt-2 border-t border-white/5">
              <label className="block text-xs font-bold text-white/80 mb-1.5">
                Have a unique specialty feature?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customAmenity}
                  onChange={(e) => setCustomAmenity(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomAmenity();
                    }
                  }}
                  placeholder="e.g. Scuba diving booking assistance, Hammocks under coconut trees..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                />
                <button
                  type="button"
                  onClick={addCustomAmenity}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Add Feature
                </button>
              </div>

              {/* Badges of selected custom items */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {form.amenities.map((a) => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 text-white/80 text-[11px] border border-white/10"
                  >
                    <span>{a}</span>
                    <button
                      type="button"
                      onClick={() => toggleAmenity(a)}
                      className="text-white/40 hover:text-red-400"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 5: PHOTOS, TARIFFS & POLICIES
         ══════════════════════════════════════════════════════════════════ */}
      {currentStep === 5 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Tariffs & Yield Management */}
          <div className="bg-[#141414] rounded-3xl p-6 sm:p-7 border border-white/5 space-y-5">
            <div className="border-b border-white/5 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <IndianRupee size={18} className="text-[#2ecc71]" />
                <span>5. Tariffs &amp; Nightly Pricing</span>
              </h2>
              <p className="text-xs text-white/40 mt-0.5">
                MMT &amp; Agoda dynamic pricing standards for weekday vs weekend occupancy
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">
                  Weekday Tariff (Mon–Thu) (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setField("price", e.target.value)}
                    placeholder="e.g. 2000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#2ecc71]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">
                  Weekend Tariff (Fri–Sun) (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 font-bold">₹</span>
                  <input
                    type="number"
                    value={form.weekendPrice}
                    onChange={(e) => setField("weekendPrice", e.target.value)}
                    placeholder="e.g. 2800"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#2ecc71]"
                  />
                </div>
                <p className="text-[10px] text-white/40 mt-1">Leave blank to keep same as weekday</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">
                  Extra Guest Mattress (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 font-bold">₹</span>
                  <input
                    type="number"
                    value={form.extraGuestPrice}
                    onChange={(e) => setField("extraGuestPrice", e.target.value)}
                    placeholder="e.g. 350"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#2ecc71]"
                  />
                </div>
                <p className="text-[10px] text-white/40 mt-1">Per extra person per night</p>
              </div>
            </div>

            {/* Checkin / Checkout and Policy */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">
                  Check-in Time
                </label>
                <select
                  value={form.checkInTime}
                  onChange={(e) => setField("checkInTime", e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                >
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM (Standard)</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">
                  Check-out Time
                </label>
                <select
                  value={form.checkOutTime}
                  onChange={(e) => setField("checkOutTime", e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                >
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="10:30 AM">10:30 AM (Standard)</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">
                  Cancellation Policy
                </label>
                <select
                  value={form.cancellationPolicy}
                  onChange={(e) => setField("cancellationPolicy", e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                >
                  <option value="flexible">Flexible (100% refund up to 48h prior)</option>
                  <option value="moderate">Moderate (100% refund 5+ days prior)</option>
                  <option value="strict">Strict (Non-refundable within 7 days)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Photo Upload Section */}
          <div className="bg-[#141414] rounded-3xl p-6 sm:p-7 border border-white/5 space-y-4">
            <div className="border-b border-white/5 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Camera size={18} className="text-[#2ecc71]" />
                <span>Property Photos &amp; Visual Gallery *</span>
              </h2>
              <p className="text-xs text-white/40 mt-0.5">
                Upload up to 10 photos. Listings with clean bedroom and bathroom photos receive 3x more confirmed stays.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {imagePreviews.map((src, i) => (
                <div
                  key={i}
                  className={`relative h-32 rounded-2xl overflow-hidden border bg-black/40 group transition-all ${
                    i === 0 ? "border-[#2ecc71] ring-2 ring-[#2ecc71]/30 shadow-md" : "border-white/10"
                  }`}
                >
                  <Image src={src} alt={`Property preview ${i + 1}`} fill className="object-cover" />

                  {/* Corner Badge */}
                  {i === 0 ? (
                    <span className="absolute top-2 left-2 z-10 bg-[#2ecc71] text-black text-[9px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                      <Star size={10} className="fill-black" /> Primary Cover
                    </span>
                  ) : (
                    <span className="absolute top-2 left-2 z-10 bg-black/60 text-white/80 text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                      #{i + 1}
                    </span>
                  )}

                  {/* Hover Controls */}
                  <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 z-20">
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="p-1 rounded-full bg-red-600/90 text-white cursor-pointer hover:bg-red-700 transition-colors shadow-xs"
                        title="Remove Photo"
                      >
                        <X size={12} />
                      </button>
                    </div>

                    <div className="space-y-1">
                      {i !== 0 && (
                        <button
                          type="button"
                          onClick={() => makeCoverImage(i)}
                          className="w-full py-1 px-1 bg-[#2ecc71] text-black text-[9px] font-black rounded hover:bg-[#27ae60] transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Star size={10} className="fill-black" />
                          <span>Make Cover</span>
                        </button>
                      )}

                      <div className="flex items-center justify-between gap-1">
                        <button
                          type="button"
                          onClick={() => moveImage(i, -1)}
                          disabled={i === 0}
                          className="flex-1 py-1 bg-white/20 hover:bg-white/30 text-white text-[9px] font-bold rounded disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
                          title="Move left"
                        >
                          <ArrowLeft size={10} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(i, 1)}
                          disabled={i === imagePreviews.length - 1}
                          className="flex-1 py-1 bg-white/20 hover:bg-white/30 text-white text-[9px] font-bold rounded disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
                          title="Move right"
                        >
                          <ArrowRight size={10} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {imagePreviews.length < 10 && (
                <label className="h-28 rounded-2xl border-2 border-dashed border-white/15 hover:border-[#2ecc71] bg-white/[0.02] flex flex-col items-center justify-center cursor-pointer transition-colors p-2 text-center">
                  <div className="w-8 h-8 rounded-full bg-white/5 text-[#2ecc71] flex items-center justify-center mb-1">
                    <Plus size={16} />
                  </div>
                  <span className="text-xs font-bold text-white/80">Add Photo</span>
                  <span className="text-[10px] text-white/40">{imagePreviews.length}/10</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImages}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Direct WhatsApp Contact Details */}
          <div className="bg-[#141414] rounded-3xl p-6 sm:p-7 border border-white/5 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <ShieldCheck size={18} className="text-[#2ecc71]" />
              <span>Direct Booking Contact &amp; WhatsApp Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">
                  Guest Calling Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">
                  Guest WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={form.whatsapp}
                  onChange={(e) => setField("whatsapp", e.target.value)}
                  placeholder="WhatsApp number to receive instant inquiries"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Sticky Bottom Action Bar ── */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#141414]/95 backdrop-blur-md border-t border-white/10 py-3.5 px-4 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-white/50 block">
              Step {currentStep} of 5: {STEPS[currentStep - 1].title}
            </span>
            <span className="text-xs font-bold text-[#2ecc71] hidden sm:block">
              0% Commission Partner Policy
            </span>
          </div>

          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={submitting}
                className="px-4 py-2.5 rounded-xl border border-white/15 text-xs font-bold text-white hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ChevronLeft size={15} />
                <span>Previous</span>
              </button>
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-[#2ecc71] hover:bg-[#27ae60] text-black font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue: {STEPS[currentStep].short}</span>
                <ChevronRight size={15} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-[#2ecc71] hover:bg-[#27ae60] text-black font-black text-xs shadow-lg shadow-[#2ecc71]/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Uploading Photos &amp; Submitting…</span>
                  </>
                ) : (
                  <>
                    <Upload size={15} />
                    <span>Submit Property for Review</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
