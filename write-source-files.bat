@echo off
setlocal enabledelayedexpansion
title Visit Kokan - Writing Source Files
color 0B

echo.
echo  ================================================
echo   VISIT KOKAN - Source Files Writer
echo   Run this INSIDE the visit-kokan folder
echo  ================================================
echo.

set "PROJECT_PATH=%USERPROFILE%\Desktop\visit-kokan"

if not exist "%PROJECT_PATH%" (
    echo  ERROR: visit-kokan folder not found on Desktop.
    echo  Run setup-visit-kokan.bat first.
    pause
    exit /b 1
)

cd /d "%PROJECT_PATH%"
echo  Writing source files into: %PROJECT_PATH%
echo.

:: ================================================
:: src/context/AuthContext.tsx
:: ================================================
> "src\context\AuthContext.tsx" (
echo 'use client'
echo import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
echo import {
echo   onAuthStateChanged,
echo   signInWithEmailAndPassword,
echo   createUserWithEmailAndPassword,
echo   signInWithPopup,
echo   GoogleAuthProvider,
echo   signOut,
echo   User
echo } from 'firebase/auth'
echo import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
echo import { auth, db } from '@/lib/firebase/client'
echo import { UserProfile } from '@/types'
echo.
echo interface AuthContextType {
echo   user: User ^| null
echo   profile: UserProfile ^| null
echo   loading: boolean
echo   signIn: (email: string, password: string) =^> Promise^<void^>
echo   signUp: (email: string, password: string, name: string) =^> Promise^<void^>
echo   signInGoogle: () =^> Promise^<void^>
echo   logout: () =^> Promise^<void^>
echo }
echo.
echo const AuthContext = createContext^<AuthContextType^>({} as AuthContextType)
echo.
echo export function AuthProvider({ children }: { children: ReactNode }) {
echo   const [user, setUser] = useState^<User ^| null^>(null)
echo   const [profile, setProfile] = useState^<UserProfile ^| null^>(null)
echo   const [loading, setLoading] = useState(true)
echo.
echo   useEffect(() =^> {
echo     const unsub = onAuthStateChanged(auth, async (firebaseUser) =^> {
echo       setUser(firebaseUser)
echo       if (firebaseUser) {
echo         const ref = doc(db, 'users', firebaseUser.uid)
echo         const snap = await getDoc(ref)
echo         if (snap.exists()) setProfile(snap.data() as UserProfile)
echo       } else {
echo         setProfile(null)
echo       }
echo       setLoading(false)
echo     })
echo     return () =^> unsub()
echo   }, [])
echo.
echo   const signIn = async (email: string, password: string) =^> {
echo     await signInWithEmailAndPassword(auth, email, password)
echo   }
echo.
echo   const signUp = async (email: string, password: string, name: string) =^> {
echo     const cred = await createUserWithEmailAndPassword(auth, email, password)
echo     await setDoc(doc(db, 'users', cred.user.uid), {
echo       uid: cred.user.uid,
echo       email,
echo       displayName: name,
echo       role: 'user',
echo       createdAt: serverTimestamp(),
echo       updatedAt: serverTimestamp(),
echo     })
echo   }
echo.
echo   const signInGoogle = async () =^> {
echo     const provider = new GoogleAuthProvider()
echo     const cred = await signInWithPopup(auth, provider)
echo     const ref = doc(db, 'users', cred.user.uid)
echo     const snap = await getDoc(ref)
echo     if (!snap.exists()) {
echo       await setDoc(ref, {
echo         uid: cred.user.uid,
echo         email: cred.user.email,
echo         displayName: cred.user.displayName,
echo         photoURL: cred.user.photoURL,
echo         role: 'user',
echo         createdAt: serverTimestamp(),
echo         updatedAt: serverTimestamp(),
echo       })
echo     }
echo   }
echo.
echo   const logout = async () =^> {
echo     await signOut(auth)
echo   }
echo.
echo   return (
echo     ^<AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signInGoogle, logout }}^>
echo       {children}
echo     ^</AuthContext.Provider^>
echo   )
echo }
echo.
echo export const useAuth = () =^> useContext(AuthContext)
)

:: ================================================
:: src/hooks/useAuth.ts
:: ================================================
> "src\hooks\useAuth.ts" (
echo export { useAuth } from '@/context/AuthContext'
)

:: ================================================
:: src/hooks/useFirestore.ts
:: ================================================
> "src\hooks\useFirestore.ts" (
echo import { useState, useEffect } from 'react'
echo import { collection, query, where, orderBy, limit, getDocs, QueryConstraint } from 'firebase/firestore'
echo import { db } from '@/lib/firebase/client'
echo.
echo export function useCollection^<T^>(
echo   collectionName: string,
echo   constraints: QueryConstraint[] = []
echo ) {
echo   const [data, setData] = useState^<T[]^>([])
echo   const [loading, setLoading] = useState(true)
echo   const [error, setError] = useState^<string ^| null^>(null)
echo.
echo   useEffect(() =^> {
echo     const fetch = async () =^> {
echo       try {
echo         const ref = collection(db, collectionName)
echo         const q = query(ref, ...constraints)
echo         const snap = await getDocs(q)
echo         setData(snap.docs.map(d =^> ({ id: d.id, ...d.data() } as T)))
echo       } catch (e: any) {
echo         setError(e.message)
echo       } finally {
echo         setLoading(false)
echo       }
echo     }
echo     fetch()
echo   }, [collectionName])
echo.
echo   return { data, loading, error }
echo }
)

:: ================================================
:: src/lib/firebase/admin.ts
:: ================================================
> "src\lib\firebase\admin.ts" (
echo import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
echo import { getFirestore } from 'firebase-admin/firestore'
echo import { getAuth } from 'firebase-admin/auth'
echo import { getStorage } from 'firebase-admin/storage'
echo.
echo let adminApp: App
echo.
echo if (!getApps().length) {
echo   adminApp = initializeApp({
echo     credential: cert({
echo       projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID,
echo       clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
echo       privateKey:  process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
echo     }),
echo     storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
echo   }, 'admin')
echo } else {
echo   adminApp = getApps()[0]
echo }
echo.
echo export const adminDb      = getFirestore(adminApp)
echo export const adminAuth    = getAuth(adminApp)
echo export const adminStorage = getStorage(adminApp)
)

:: ================================================
:: src/lib/utils/index.ts
:: ================================================
> "src\lib\utils\index.ts" (
echo import { clsx, type ClassValue } from 'clsx'
echo.
echo export function cn(...inputs: ClassValue[]) {
echo   return clsx(inputs)
echo }
echo.
echo export function slugify(text: string): string {
echo   return text
echo     .toLowerCase()
echo     .replace(/[^\w\s-]/g, '')
echo     .replace(/\s+/g, '-')
echo     .trim()
echo }
echo.
echo export function formatPrice(amount: number): string {
echo   return new Intl.NumberFormat('en-IN', {
echo     style: 'currency',
echo     currency: 'INR',
echo     maximumFractionDigits: 0,
echo   }).format(amount)
echo }
echo.
echo export function formatDate(date: Date ^| string): string {
echo   return new Intl.DateTimeFormat('en-IN', {
echo     day: 'numeric', month: 'long', year: 'numeric'
echo   }).format(new Date(date))
echo }
echo.
echo export function readTime(content: string): number {
echo   const words = content.trim().split(/\s+/).length
echo   return Math.ceil(words / 200)
echo }
)

:: ================================================
:: src/lib/seo/metadata.ts
:: ================================================
> "src\lib\seo\metadata.ts" (
echo import { Metadata } from 'next'
echo.
echo interface SEOProps {
echo   title: string
echo   description: string
echo   image?: string
echo   url?: string
echo   type?: 'website' ^| 'article'
echo   keywords?: string[]
echo }
echo.
echo export function generateMetadata({
echo   title,
echo   description,
echo   image,
echo   url,
echo   type = 'website',
echo   keywords = [],
echo }: SEOProps): Metadata {
echo   const baseUrl = process.env.NEXT_PUBLIC_APP_URL ^|^| 'https://visitkokan.in'
echo   const ogImage = image ^|^| `${baseUrl}/images/ui/og-default.jpg`
echo.
echo   return {
echo     title,
echo     description,
echo     keywords: ['Visit Kokan', 'Konkan', 'Maharashtra tourism', ...keywords],
echo     openGraph: {
echo       title,
echo       description,
echo       type,
echo       url: url ? `${baseUrl}${url}` : baseUrl,
echo       images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
echo       siteName: 'Visit Kokan',
echo     },
echo     twitter: {
echo       card: 'summary_large_image',
echo       title,
echo       description,
echo       images: [ogImage],
echo     },
echo   }
echo }
echo.
echo export function destinationJsonLd(destination: any) {
echo   return {
echo     '@context': 'https://schema.org',
echo     '@type': 'TouristAttraction',
echo     name: destination.name,
echo     description: destination.description,
echo     image: destination.heroImage,
echo     geo: {
echo       '@type': 'GeoCoordinates',
echo       latitude: destination.lat,
echo       longitude: destination.lng,
echo     },
echo     aggregateRating: destination.reviewCount ^> 0 ? {
echo       '@type': 'AggregateRating',
echo       ratingValue: destination.rating,
echo       reviewCount: destination.reviewCount,
echo     } : undefined,
echo   }
echo }
echo.
echo export function listingJsonLd(listing: any) {
echo   return {
echo     '@context': 'https://schema.org',
echo     '@type': 'LocalBusiness',
echo     name: listing.title,
echo     description: listing.description,
echo     image: listing.heroImage,
echo     priceRange: `INR ${listing.price}`,
echo     aggregateRating: listing.reviewCount ^> 0 ? {
echo       '@type': 'AggregateRating',
echo       ratingValue: listing.rating,
echo       reviewCount: listing.reviewCount,
echo     } : undefined,
echo   }
echo }
)

:: ================================================
:: src/lib/ai/tripPlanner.ts
:: ================================================
> "src\lib\ai\tripPlanner.ts" (
echo import { TripPlan } from '@/types'
echo.
echo interface TripResult {
echo   title: string
echo   summary: string
echo   days: DayPlan[]
echo   estimatedCost: number
echo   tips: string[]
echo   bestSeason: string
echo }
echo.
echo interface DayPlan {
echo   day: number
echo   title: string
echo   morning: string
echo   afternoon: string
echo   evening: string
echo   stay: string
echo   meals: string
echo }
echo.
echo const DESTINATION_DATA = {
echo   beaches: ['Ganpatipule', 'Tarkarli', 'Vengurla', 'Malvan', 'Dapoli', 'Harnai', 'Guhagar'],
echo   treks: ['Vijaydurg Fort', 'Sindhudurg Fort', 'Amboli Ghats', 'Sahyadri trails'],
echo   food: ['Malvani fish curry', 'Solkadhi', 'Kombdi vade', 'Ukadiche modak', 'Cashew feni'],
echo   homestays: ['Malvan Homestay', 'Tarkarli Beach Stay', 'Ganpatipule Cottage', 'Dapoli Farm Stay'],
echo   experiences: ['Scuba diving Tarkarli', 'Dolphin watching', 'Cashew plantation tour', 'Konkani cooking class'],
echo }
echo.
echo const BUDGET_MULTIPLIER = { budget: 1, mid: 2.2, luxury: 4 }
echo const BASE_COST_PER_DAY = 1500
echo.
echo export function generateTripPlan(input: TripPlan): TripResult {
echo   const { days, budget, interests, season, groupSize } = input
echo   const costMultiplier = BUDGET_MULTIPLIER[budget]
echo   const estimatedCost = Math.round(BASE_COST_PER_DAY * costMultiplier * days * groupSize)
echo.
echo   const plans: DayPlan[] = Array.from({ length: days }, (_, i) =^> {
echo     const day = i + 1
echo     const dest = DESTINATION_DATA.beaches[i % DESTINATION_DATA.beaches.length]
echo     const trek = DESTINATION_DATA.treks[i % DESTINATION_DATA.treks.length]
echo     const food = DESTINATION_DATA.food[i % DESTINATION_DATA.food.length]
echo     const stay = budget === 'luxury'
echo       ? `Premium resort near ${dest}`
echo       : budget === 'mid'
echo       ? `Comfortable homestay in ${dest}`
echo       : `Budget guesthouse near ${dest}`
echo.
echo     const hasBeach = interests.includes('beach') ^|^| interests.includes('water')
echo     const hasTrek = interests.includes('trek') ^|^| interests.includes('adventure')
echo     const hasCulture = interests.includes('culture') ^|^| interests.includes('food')
echo.
echo     return {
echo       day,
echo       title: day === 1 ? `Arrive in Kokan - ${dest}` : `Explore ${dest}`,
echo       morning: hasBeach
echo         ? `Morning walk on ${dest} beach, watch sunrise, light breakfast`
echo         : hasTrek
echo         ? `Start early - trek to ${trek}, carry water and snacks`
echo         : `Visit local temple or village market in ${dest}`,
echo       afternoon: hasTrek
echo         ? `Complete trek, rest at viewpoint, local lunch`
echo         : hasBeach
echo         ? `Swimming, water sports (scuba at Tarkarli if available), beachside lunch`
echo         : `${food} cooking class or local food trail`,
echo       evening: hasCulture
echo         ? `Sunset at beach, try ${food}, local folk music if available`
echo         : `Sunset cruise or beach bonfire, fresh seafood dinner`,
echo       stay,
echo       meals: budget === 'budget'
echo         ? `Local dhabas - ${food}, avg INR 200-400/meal`
echo         : budget === 'mid'
echo         ? `Local restaurants + homestay meals - ${food}, avg INR 400-800/meal`
echo         : `Resort dining + fine Malvani cuisine, avg INR 1000+/meal`,
echo     }
echo   })
echo.
echo   const tips = [
echo     'Carry cash - ATMs can be scarce near beaches',
echo     'Best road connectivity via Mumbai-Goa Highway (NH66)',
echo     'Konkan Railway is scenic and recommended over road in monsoon',
echo     season === 'monsoon'
echo       ? 'Monsoon (Jun-Sep): lush green, waterfalls active, but sea rough - avoid water sports'
echo       : season === 'summer'
echo       ? 'Summer (Mar-May): hot and humid, go early morning, carry sunscreen'
echo       : 'Winter (Oct-Feb): ideal season, cool breeze, all activities available',
echo     'Book homestays at least 2 weeks ahead for weekends',
echo     'Try local cashew wine and kokum juice - regional specialties',
echo   ]
echo.
echo   return {
echo     title: `${days}-Day Kokan ${budget === 'luxury' ? 'Luxury' : budget === 'mid' ? 'Comfort' : 'Budget'} Trip`,
echo     summary: `A carefully crafted ${days}-day itinerary for ${groupSize} traveller${groupSize ^> 1 ? 's' : ''} exploring the best of the Konkan coast.`,
echo     days: plans,
echo     estimatedCost,
echo     tips,
echo     bestSeason: 'October to February',
echo   }
echo }
)

:: ================================================
:: src/components/layout/Navbar/index.tsx
:: ================================================
> "src\components\layout\Navbar\index.tsx" (
echo 'use client'
echo import Link from 'next/link'
echo import { useState } from 'react'
echo import { Menu, X, MapPin, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react'
echo import { useAuth } from '@/context/AuthContext'
echo.
echo const navLinks = [
echo   { label: 'Destinations', href: '/destinations' },
echo   { label: 'Experiences', href: '/listings' },
echo   { label: 'Treks', href: '/listings?category=trek' },
echo   { label: 'Blogs', href: '/blogs' },
echo   { label: 'AI Planner', href: '/ai-planner' },
echo ]
echo.
echo export default function Navbar() {
echo   const [open, setOpen] = useState(false)
echo   const [userMenu, setUserMenu] = useState(false)
echo   const { user, profile, logout } = useAuth()
echo.
echo   return (
echo     ^<header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm"^>
echo       ^<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"^>
echo         ^<div className="flex items-center justify-between h-16"^>
echo.
echo           ^<Link href="/" className="flex items-center gap-2 font-bold text-xl text-kokan-green"^>
echo             ^<MapPin className="w-5 h-5 text-kokan-coral" fill="currentColor" /^>
echo             ^<span className="font-display"^>Visit^</span^>
echo             ^<span className="text-kokan-earth font-display"^>Kokan^</span^>
echo           ^</Link^>
echo.
echo           ^<nav className="hidden md:flex items-center gap-6"^>
echo             {navLinks.map((link) =^> (
echo               ^<Link
echo                 key={link.href}
echo                 href={link.href}
echo                 className="text-sm font-medium text-gray-700 hover:text-kokan-green transition-colors"
echo               ^>
echo                 {link.label}
echo               ^</Link^>
echo             ))}
echo           ^</nav^>
echo.
echo           ^<div className="hidden md:flex items-center gap-3"^>
echo             {user ? (
echo               ^<div className="relative"^>
echo                 ^<button
echo                   onClick={() =^> setUserMenu(!userMenu)}
echo                   className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-kokan-green"
echo                 ^>
echo                   ^<div className="w-8 h-8 rounded-full bg-kokan-green text-white flex items-center justify-center text-xs font-bold"^>
echo                     {profile?.displayName?.[0]?.toUpperCase() ^|^| 'U'}
echo                   ^</div^>
echo                   ^<ChevronDown className="w-4 h-4" /^>
echo                 ^</button^>
echo                 {userMenu ^&^& (
echo                   ^<div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2"^>
echo                     ^<Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() =^> setUserMenu(false)}^>
echo                       ^<LayoutDashboard className="w-4 h-4" /^> Dashboard
echo                     ^</Link^>
echo                     {profile?.role === 'vendor' ^&^& (
echo                       ^<Link href="/vendor/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() =^> setUserMenu(false)}^>
echo                         ^<User className="w-4 h-4" /^> Vendor Panel
echo                       ^</Link^>
echo                     )}
echo                     {profile?.role === 'admin' ^&^& (
echo                       ^<Link href="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() =^> setUserMenu(false)}^>
echo                         ^<LayoutDashboard className="w-4 h-4" /^> Admin Panel
echo                       ^</Link^>
echo                     )}
echo                     ^<button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"^>
echo                       ^<LogOut className="w-4 h-4" /^> Sign Out
echo                     ^</button^>
echo                   ^</div^>
echo                 )}
echo               ^</div^>
echo             ) : (
echo               ^<^>
echo                 ^<Link href="/login" className="text-sm font-medium text-gray-700 hover:text-kokan-green"^>Sign In^</Link^>
echo                 ^<Link href="/register" className="btn-primary text-sm py-2 px-4"^>Get Started^</Link^>
echo               ^</^>
echo             )}
echo           ^</div^>
echo.
echo           ^<button className="md:hidden" onClick={() =^> setOpen(!open)}^>
echo             {open ? ^<X className="w-6 h-6" /^> : ^<Menu className="w-6 h-6" /^>}
echo           ^</button^>
echo         ^</div^>
echo       ^</div^>
echo.
echo       {open ^&^& (
echo         ^<div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3"^>
echo           {navLinks.map((link) =^> (
echo             ^<Link key={link.href} href={link.href} className="block text-sm font-medium text-gray-700 py-2" onClick={() =^> setOpen(false)}^>
echo               {link.label}
echo             ^</Link^>
echo           ))}
echo           {!user ^&^& (
echo             ^<div className="flex gap-3 pt-2"^>
echo               ^<Link href="/login" className="btn-outline text-sm py-2 flex-1 justify-center" onClick={() =^> setOpen(false)}^>Sign In^</Link^>
echo               ^<Link href="/register" className="btn-primary text-sm py-2 flex-1 justify-center" onClick={() =^> setOpen(false)}^>Register^</Link^>
echo             ^</div^>
echo           )}
echo         ^</div^>
echo       )}
echo     ^</header^>
echo   )
echo }
)

:: ================================================
:: src/components/layout/Footer/index.tsx
:: ================================================
> "src\components\layout\Footer\index.tsx" (
echo import Link from 'next/link'
echo import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from 'lucide-react'
echo.
echo export default function Footer() {
echo   return (
echo     ^<footer className="bg-kokan-dark text-gray-300"^>
echo       ^<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"^>
echo         ^<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"^>
echo.
echo           ^<div^>
echo             ^<div className="flex items-center gap-2 mb-4"^>
echo               ^<MapPin className="w-5 h-5 text-kokan-coral" /^>
echo               ^<span className="text-white font-display text-xl font-bold"^>Visit Kokan^</span^>
echo             ^</div^>
echo             ^<p className="text-sm leading-relaxed text-gray-400"^>
echo               Your gateway to the pristine Konkan coast. Discover hidden beaches,
echo               ancient forts, lush ghats, and the warmth of Malvani hospitality.
echo             ^</p^>
echo             ^<div className="flex gap-3 mt-5"^>
echo               ^<a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-kokan-coral transition-colors"^>^<Instagram className="w-4 h-4" /^>^</a^>
echo               ^<a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-kokan-coral transition-colors"^>^<Facebook className="w-4 h-4" /^>^</a^>
echo               ^<a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-kokan-coral transition-colors"^>^<Youtube className="w-4 h-4" /^>^</a^>
echo             ^</div^>
echo           ^</div^>
echo.
echo           ^<div^>
echo             ^<h4 className="text-white font-semibold mb-4"^>Explore^</h4^>
echo             ^<ul className="space-y-2 text-sm"^>
echo               {['Destinations', 'Treks', 'Homestays', 'Food Experiences', 'Blogs', 'AI Trip Planner'].map(item =^> (
echo                 ^<li key={item}^>^<Link href="#" className="hover:text-kokan-coral transition-colors"^>{item}^</Link^>^</li^>
echo               ))}
echo             ^</ul^>
echo           ^</div^>
echo.
echo           ^<div^>
echo             ^<h4 className="text-white font-semibold mb-4"^>For Vendors^</h4^>
echo             ^<ul className="space-y-2 text-sm"^>
echo               {['List Your Property', 'Vendor Dashboard', 'Pricing', 'Support', 'Vendor Guidelines'].map(item =^> (
echo                 ^<li key={item}^>^<Link href="#" className="hover:text-kokan-coral transition-colors"^>{item}^</Link^>^</li^>
echo               ))}
echo             ^</ul^>
echo           ^</div^>
echo.
echo           ^<div^>
echo             ^<h4 className="text-white font-semibold mb-4"^>Contact^</h4^>
echo             ^<ul className="space-y-3 text-sm"^>
echo               ^<li className="flex items-start gap-2"^>^<MapPin className="w-4 h-4 text-kokan-coral mt-0.5 shrink-0" /^>Sindhudurg, Maharashtra, India^</li^>
echo               ^<li className="flex items-center gap-2"^>^<Phone className="w-4 h-4 text-kokan-coral shrink-0" /^>+91 98765 43210^</li^>
echo               ^<li className="flex items-center gap-2"^>^<Mail className="w-4 h-4 text-kokan-coral shrink-0" /^>hello@visitkokan.in^</li^>
echo             ^</ul^>
echo           ^</div^>
echo.
echo         ^</div^>
echo         ^<div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500"^>
echo           ^<p^>^&copy; 2025 Visit Kokan. All rights reserved.^</p^>
echo           ^<div className="flex gap-6"^>
echo             ^<Link href="/privacy" className="hover:text-kokan-coral"^>Privacy^</Link^>
echo             ^<Link href="/terms" className="hover:text-kokan-coral"^>Terms^</Link^>
echo             ^<Link href="/sitemap.xml" className="hover:text-kokan-coral"^>Sitemap^</Link^>
echo           ^</div^>
echo         ^</div^>
echo       ^</div^>
echo     ^</footer^>
echo   )
echo }
)

:: ================================================
:: src/components/home/HeroSection/index.tsx
:: ================================================
> "src\components\home\HeroSection\index.tsx" (
echo 'use client'
echo import { useState } from 'react'
echo import { useRouter } from 'next/navigation'
echo import { Search, MapPin, Calendar, Users } from 'lucide-react'
echo.
echo export default function HeroSection() {
echo   const router = useRouter()
echo   const [searchQuery, setSearchQuery] = useState('')
echo.
echo   const handleSearch = (e: React.FormEvent) =^> {
echo     e.preventDefault()
echo     if (searchQuery.trim()) router.push(`/destinations?q=${encodeURIComponent(searchQuery)}`)
echo   }
echo.
echo   return (
echo     ^<section className="relative min-h-screen flex items-center justify-center overflow-hidden"^>
echo       ^<div
echo         className="absolute inset-0 bg-cover bg-center bg-no-repeat"
echo         style={{ backgroundImage: "url('/images/ui/hero-bg.jpg')" }}
echo       ^>
echo         ^<div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" /^>
echo       ^</div^>
echo.
echo       ^<div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto"^>
echo         ^<div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6"^>
echo           ^<MapPin className="w-3.5 h-3.5 text-kokan-coral" /^>
echo           ^<span^>Maharashtra, India^</span^>
echo         ^</div^>
echo.
echo         ^<h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-4"^>
echo           Discover the Soul of^<br /^>
echo           ^<span className="text-kokan-gold"^>Konkan Coast^</span^>
echo         ^</h1^>
echo.
echo         ^<p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed"^>
echo           Hidden beaches, ancient forts, misty ghats, and the warmth of Malvani hospitality.
echo           Your journey begins here.
echo         ^</p^>
echo.
echo         ^<form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-2 max-w-3xl mx-auto"^>
echo           ^<div className="flex flex-col md:flex-row gap-2"^>
echo             ^<div className="flex items-center gap-2 flex-1 px-4 py-2"^>
echo               ^<Search className="w-4 h-4 text-gray-400 shrink-0" /^>
echo               ^<input
echo                 type="text"
echo                 placeholder="Search destinations, treks, homestays..."
echo                 value={searchQuery}
echo                 onChange={(e) =^> setSearchQuery(e.target.value)}
echo                 className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent text-sm"
echo               /^>
echo             ^</div^>
echo             ^<button type="submit" className="btn-primary rounded-xl whitespace-nowrap"^>
echo               Explore Now
echo             ^</button^>
echo           ^</div^>
echo         ^</form^>
echo.
echo         ^<div className="flex flex-wrap justify-center gap-3 mt-6"^>
echo           {['Ganpatipule', 'Tarkarli', 'Malvan', 'Dapoli', 'Vengurla'].map((place) =^> (
echo             ^<button
echo               key={place}
echo               onClick={() =^> router.push(`/destinations?q=${place}`)}
echo               className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm hover:bg-white/20 transition-colors"
echo             ^>
echo               {place}
echo             ^</button^>
echo           ))}
echo         ^</div^>
echo       ^</div^>
echo.
echo       ^<div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-kokan-cream to-transparent" /^>
echo     ^</section^>
echo   )
echo }
)

:: ================================================
:: src/components/home/StatsBar/index.tsx
:: ================================================
> "src\components\home\StatsBar\index.tsx" (
echo const stats = [
echo   { value: '50+', label: 'Destinations' },
echo   { value: '200+', label: 'Listed Experiences' },
echo   { value: '1000+', label: 'Happy Travellers' },
echo   { value: '4.8', label: 'Avg. Rating' },
echo ]
echo.
echo export default function StatsBar() {
echo   return (
echo     ^<section className="bg-kokan-green py-10"^>
echo       ^<div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white"^>
echo         {stats.map((s) =^> (
echo           ^<div key={s.label}^>
echo             ^<div className="text-4xl font-display font-bold text-kokan-gold"^>{s.value}^</div^>
echo             ^<div className="text-sm mt-1 text-white/70"^>{s.label}^</div^>
echo           ^</div^>
echo         ))}
echo       ^</div^>
echo     ^</section^>
echo   )
echo }
)

:: ================================================
:: src/components/listing/ListingCard/index.tsx
:: ================================================
> "src\components\listing\ListingCard\index.tsx" (
echo import Link from 'next/link'
echo import Image from 'next/image'
echo import { Star, MapPin, Users } from 'lucide-react'
echo import { Listing } from '@/types'
echo import { formatPrice } from '@/lib/utils'
echo.
echo interface Props { listing: Listing }
echo.
echo export default function ListingCard({ listing }: Props) {
echo   return (
echo     ^<Link href={`/listings/${listing.id}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"^>
echo       ^<div className="relative h-52 overflow-hidden"^>
echo         ^<Image
echo           src={listing.heroImage ^|^| '/images/ui/placeholder.jpg'}
echo           alt={listing.title}
echo           fill
echo           className="object-cover group-hover:scale-105 transition-transform duration-500"
echo         /^>
echo         ^<div className="absolute top-3 left-3"^>
echo           ^<span className="bg-white/90 backdrop-blur-sm text-kokan-green text-xs font-semibold px-2.5 py-1 rounded-full capitalize"^>
echo             {listing.category}
echo           ^</span^>
echo         ^</div^>
echo         ^<div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1"^>
echo           ^<Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /^>
echo           ^<span className="text-xs font-semibold"^>{listing.rating.toFixed(1)}^</span^>
echo         ^</div^>
echo       ^</div^>
echo       ^<div className="p-4"^>
echo         ^<div className="flex items-center gap-1 text-xs text-gray-500 mb-1"^>
echo           ^<MapPin className="w-3 h-3" /^>
echo           ^<span^>{listing.destinationName}^</span^>
echo         ^</div^>
echo         ^<h3 className="font-semibold text-gray-900 line-clamp-1 mb-2"^>{listing.title}^</h3^>
echo         ^<div className="flex items-center justify-between"^>
echo           ^<div^>
echo             ^<span className="text-kokan-green font-bold text-lg"^>{formatPrice(listing.price)}^</span^>
echo             ^<span className="text-xs text-gray-500 ml-1"^>/{listing.priceUnit.replace('_', ' ')}^</span^>
echo           ^</div^>
echo           ^<div className="flex items-center gap-1 text-xs text-gray-500"^>
echo             ^<Users className="w-3 h-3" /^>
echo             ^<span^>Max {listing.capacity}^</span^>
echo           ^</div^>
echo         ^</div^>
echo       ^</div^>
echo     ^</Link^>
echo   )
echo }
)

:: ================================================
:: src/components/blog/BlogCard/index.tsx
:: ================================================
> "src\components\blog\BlogCard\index.tsx" (
echo import Link from 'next/link'
echo import Image from 'next/image'
echo import { Clock, User } from 'lucide-react'
echo import { Blog } from '@/types'
echo.
echo interface Props { blog: Blog }
echo.
echo export default function BlogCard({ blog }: Props) {
echo   return (
echo     ^<Link href={`/blogs/${blog.slug}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"^>
echo       ^<div className="relative h-48 overflow-hidden"^>
echo         ^<Image
echo           src={blog.coverImage ^|^| '/images/ui/placeholder.jpg'}
echo           alt={blog.title}
echo           fill
echo           className="object-cover group-hover:scale-105 transition-transform duration-500"
echo         /^>
echo         {blog.featured ^&^& (
echo           ^<div className="absolute top-3 left-3 bg-kokan-coral text-white text-xs font-semibold px-2.5 py-1 rounded-full"^>Featured^</div^>
echo         )}
echo       ^</div^>
echo       ^<div className="p-4"^>
echo         ^<div className="flex flex-wrap gap-1.5 mb-2"^>
echo           {blog.tags.slice(0, 2).map((tag) =^> (
echo             ^<span key={tag} className="text-xs bg-kokan-sand text-kokan-earth px-2 py-0.5 rounded-full"^>{tag}^</span^>
echo           ))}
echo         ^</div^>
echo         ^<h3 className="font-semibold text-gray-900 line-clamp-2 mb-3 leading-snug"^>{blog.title}^</h3^>
echo         ^<div className="flex items-center justify-between text-xs text-gray-500"^>
echo           ^<div className="flex items-center gap-1"^>^<User className="w-3 h-3" /^>{blog.authorName}^</div^>
echo           ^<div className="flex items-center gap-1"^>^<Clock className="w-3 h-3" /^>{blog.readTime} min read^</div^>
echo         ^</div^>
echo       ^</div^>
echo     ^</Link^>
echo   )
echo }
)

:: ================================================
:: src/components/auth/AuthGuard/index.tsx
:: ================================================
> "src\components\auth\AuthGuard\index.tsx" (
echo 'use client'
echo import { useEffect } from 'react'
echo import { useRouter } from 'next/navigation'
echo import { useAuth } from '@/context/AuthContext'
echo import { UserRole } from '@/types'
echo.
echo interface Props {
echo   children: React.ReactNode
echo   allowedRoles?: UserRole[]
echo   redirectTo?: string
echo }
echo.
echo export default function AuthGuard({ children, allowedRoles, redirectTo = '/login' }: Props) {
echo   const { user, profile, loading } = useAuth()
echo   const router = useRouter()
echo.
echo   useEffect(() =^> {
echo     if (!loading) {
echo       if (!user) { router.push(redirectTo); return }
echo       if (allowedRoles ^&^& profile ^&^& !allowedRoles.includes(profile.role)) {
echo         router.push('/')
echo       }
echo     }
echo   }, [user, profile, loading, allowedRoles, redirectTo, router])
echo.
echo   if (loading) return ^<div className="min-h-screen flex items-center justify-center"^>^<div className="w-8 h-8 border-4 border-kokan-green border-t-transparent rounded-full animate-spin" /^>^</div^>
echo   if (!user) return null
echo   if (allowedRoles ^&^& profile ^&^& !allowedRoles.includes(profile.role)) return null
echo.
echo   return ^<^>{children}^</^>
echo }
)

:: ================================================
:: src/app/(auth)/login/page.tsx
:: ================================================
> "src\app\(auth)\login\page.tsx" (
echo 'use client'
echo import { useState } from 'react'
echo import Link from 'next/link'
echo import { useRouter } from 'next/navigation'
echo import { MapPin, Eye, EyeOff } from 'lucide-react'
echo import { useAuth } from '@/context/AuthContext'
echo import toast from 'react-hot-toast'
echo.
echo export default function LoginPage() {
echo   const [email, setEmail] = useState('')
echo   const [password, setPassword] = useState('')
echo   const [showPass, setShowPass] = useState(false)
echo   const [loading, setLoading] = useState(false)
echo   const { signIn, signInGoogle } = useAuth()
echo   const router = useRouter()
echo.
echo   const handleSubmit = async (e: React.FormEvent) =^> {
echo     e.preventDefault()
echo     setLoading(true)
echo     try {
echo       await signIn(email, password)
echo       toast.success('Welcome back!')
echo       router.push('/dashboard')
echo     } catch {
echo       toast.error('Invalid email or password')
echo     } finally {
echo       setLoading(false)
echo     }
echo   }
echo.
echo   const handleGoogle = async () =^> {
echo     try {
echo       await signInGoogle()
echo       toast.success('Signed in with Google!')
echo       router.push('/dashboard')
echo     } catch {
echo       toast.error('Google sign-in failed')
echo     }
echo   }
echo.
echo   return (
echo     ^<div className="min-h-screen bg-kokan-cream flex items-center justify-center px-4"^>
echo       ^<div className="w-full max-w-md"^>
echo         ^<div className="text-center mb-8"^>
echo           ^<Link href="/" className="inline-flex items-center gap-2 text-kokan-green font-display font-bold text-2xl mb-2"^>
echo             ^<MapPin className="w-6 h-6 text-kokan-coral" /^>Visit Kokan
echo           ^</Link^>
echo           ^<p className="text-gray-500 text-sm"^>Sign in to your account^</p^>
echo         ^</div^>
echo         ^<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"^>
echo           ^<form onSubmit={handleSubmit} className="space-y-4"^>
echo             ^<div^>
echo               ^<label className="block text-sm font-medium text-gray-700 mb-1"^>Email^</label^>
echo               ^<input type="email" value={email} onChange={(e) =^> setEmail(e.target.value)} required
echo                 className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30 focus:border-kokan-green" placeholder="you@example.com" /^>
echo             ^</div^>
echo             ^<div^>
echo               ^<label className="block text-sm font-medium text-gray-700 mb-1"^>Password^</label^>
echo               ^<div className="relative"^>
echo                 ^<input type={showPass ? 'text' : 'password'} value={password} onChange={(e) =^> setPassword(e.target.value)} required
echo                   className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30 focus:border-kokan-green pr-10" placeholder="Enter password" /^>
echo                 ^<button type="button" onClick={() =^> setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"^>
echo                   {showPass ? ^<EyeOff className="w-4 h-4" /^> : ^<Eye className="w-4 h-4" /^>}
echo                 ^</button^>
echo               ^</div^>
echo               ^<div className="text-right mt-1"^>^<Link href="/forgot-password" className="text-xs text-kokan-green hover:underline"^>Forgot password?^</Link^>^</div^>
echo             ^</div^>
echo             ^<button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3"^>
echo               {loading ? 'Signing in...' : 'Sign In'}
echo             ^</button^>
echo           ^</form^>
echo           ^<div className="relative my-6"^>^<div className="absolute inset-0 flex items-center"^>^<div className="w-full border-t border-gray-200" /^>^</div^>^<div className="relative flex justify-center"^>^<span className="bg-white px-3 text-xs text-gray-400"^>or continue with^</span^>^</div^>^</div^>
echo           ^<button onClick={handleGoogle} className="w-full border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"^>
echo             ^<svg className="w-4 h-4" viewBox="0 0 24 24"^>^<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/^>^<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/^>^<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/^>^<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/^>^</svg^>
echo             Continue with Google
echo           ^</button^>
echo           ^<p className="text-center text-sm text-gray-500 mt-6"^>Don't have an account? ^<Link href="/register" className="text-kokan-green font-medium hover:underline"^>Sign up^</Link^>^</p^>
echo         ^</div^>
echo       ^</div^>
echo     ^</div^>
echo   )
echo }
)

:: ================================================
:: src/app/(user)/dashboard/page.tsx
:: ================================================
> "src\app\(user)\dashboard\page.tsx" (
echo import AuthGuard from '@/components/auth/AuthGuard'
echo.
echo export default function DashboardPage() {
echo   return (
echo     ^<AuthGuard^>
echo       ^<div className="min-h-screen bg-kokan-cream pt-20 px-4"^>
echo         ^<div className="max-w-6xl mx-auto"^>
echo           ^<h1 className="section-title mb-6"^>My Dashboard^</h1^>
echo           ^<div className="grid grid-cols-1 md:grid-cols-3 gap-6"^>
echo             ^<div className="bg-white rounded-2xl p-6 shadow-sm"^>
echo               ^<h3 className="font-semibold text-gray-700 mb-1"^>My Bookings^</h3^>
echo               ^<p className="text-3xl font-bold text-kokan-green"^>0^</p^>
echo             ^</div^>
echo             ^<div className="bg-white rounded-2xl p-6 shadow-sm"^>
echo               ^<h3 className="font-semibold text-gray-700 mb-1"^>Wishlist^</h3^>
echo               ^<p className="text-3xl font-bold text-kokan-coral"^>0^</p^>
echo             ^</div^>
echo             ^<div className="bg-white rounded-2xl p-6 shadow-sm"^>
echo               ^<h3 className="font-semibold text-gray-700 mb-1"^>Reviews^</h3^>
echo               ^<p className="text-3xl font-bold text-kokan-gold"^>0^</p^>
echo             ^</div^>
echo           ^</div^>
echo         ^</div^>
echo       ^</div^>
echo     ^</AuthGuard^>
echo   )
echo }
)

:: ================================================
:: src/app/(admin)/admin/dashboard/page.tsx
:: ================================================
> "src\app\(admin)\admin\dashboard\page.tsx" (
echo import AuthGuard from '@/components/auth/AuthGuard'
echo.
echo export default function AdminDashboard() {
echo   return (
echo     ^<AuthGuard allowedRoles={['admin']}^>
echo       ^<div className="min-h-screen bg-kokan-cream pt-20 px-4"^>
echo         ^<div className="max-w-6xl mx-auto"^>
echo           ^<h1 className="section-title mb-6"^>Admin Dashboard^</h1^>
echo           ^<div className="grid grid-cols-2 md:grid-cols-4 gap-4"^>
echo             {['Total Users', 'Listings', 'Bookings', 'Pending Approvals'].map((label, i) =^> (
echo               ^<div key={label} className="bg-white rounded-2xl p-5 shadow-sm"^>
echo                 ^<p className="text-sm text-gray-500"^>{label}^</p^>
echo                 ^<p className="text-3xl font-bold text-kokan-green mt-1"^>0^</p^>
echo               ^</div^>
echo             ))}
echo           ^</div^>
echo         ^</div^>
echo       ^</div^>
echo     ^</AuthGuard^>
echo   )
echo }
)

:: ================================================
:: src/app/(vendor)/vendor/dashboard/page.tsx
:: ================================================
> "src\app\(vendor)\vendor\dashboard\page.tsx" (
echo import AuthGuard from '@/components/auth/AuthGuard'
echo.
echo export default function VendorDashboard() {
echo   return (
echo     ^<AuthGuard allowedRoles={['vendor', 'admin']}^>
echo       ^<div className="min-h-screen bg-kokan-cream pt-20 px-4"^>
echo         ^<div className="max-w-6xl mx-auto"^>
echo           ^<h1 className="section-title mb-6"^>Vendor Dashboard^</h1^>
echo           ^<div className="grid grid-cols-1 md:grid-cols-3 gap-6"^>
echo             {['My Listings', 'Total Bookings', 'This Month Revenue'].map((label) =^> (
echo               ^<div key={label} className="bg-white rounded-2xl p-6 shadow-sm"^>
echo                 ^<p className="text-sm text-gray-500"^>{label}^</p^>
echo                 ^<p className="text-3xl font-bold text-kokan-green mt-1"^>0^</p^>
echo               ^</div^>
echo             ))}
echo           ^</div^>
echo         ^</div^>
echo       ^</div^>
echo     ^</AuthGuard^>
echo   )
echo }
)

:: ================================================
:: src/app/(public)/destinations/[slug]/page.tsx
:: ================================================
> "src\app\(public)\destinations\[slug]\page.tsx" (
echo export default function DestinationPage({ params }: { params: { slug: string } }) {
echo   return (
echo     ^<div className="min-h-screen bg-kokan-cream pt-20 px-4"^>
echo       ^<div className="max-w-6xl mx-auto"^>
echo         ^<h1 className="section-title"^>Destination: {params.slug}^</h1^>
echo         ^<p className="text-gray-500 mt-2"^>Full destination page coming in Step 6.^</p^>
echo       ^</div^>
echo     ^</div^>
echo   )
echo }
)

:: ================================================
:: src/app/(public)/blogs/[slug]/page.tsx
:: ================================================
> "src\app\(public)\blogs\[slug]\page.tsx" (
echo export default function BlogPage({ params }: { params: { slug: string } }) {
echo   return (
echo     ^<div className="min-h-screen bg-kokan-cream pt-20 px-4"^>
echo       ^<div className="max-w-4xl mx-auto"^>
echo         ^<h1 className="section-title"^>Blog: {params.slug}^</h1^>
echo         ^<p className="text-gray-500 mt-2"^>Full blog page coming in Step 7.^</p^>
echo       ^</div^>
echo     ^</div^>
echo   )
echo }
)

:: ================================================
:: src/app/(public)/listings/[id]/page.tsx
:: ================================================
> "src\app\(public)\listings\[id]\page.tsx" (
echo export default function ListingPage({ params }: { params: { id: string } }) {
echo   return (
echo     ^<div className="min-h-screen bg-kokan-cream pt-20 px-4"^>
echo       ^<div className="max-w-6xl mx-auto"^>
echo         ^<h1 className="section-title"^>Listing: {params.id}^</h1^>
echo         ^<p className="text-gray-500 mt-2"^>Full listing page coming in Step 8.^</p^>
echo       ^</div^>
echo     ^</div^>
echo   )
echo }
)

:: ================================================
:: Update layout to include AuthProvider
:: ================================================
> "src\app\layout.tsx" (
echo import type { Metadata } from 'next'
echo import { Inter, Playfair_Display } from 'next/font/google'
echo import '@/styles/globals.css'
echo import { Toaster } from 'react-hot-toast'
echo import { AuthProvider } from '@/context/AuthContext'
echo.
echo const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' })
echo const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display', display: 'swap' })
echo.
echo export const metadata: Metadata = {
echo   title: { default: 'Visit Kokan - Explore the Konkan Coast', template: '%%s ^| Visit Kokan' },
echo   description: 'Discover untouched beaches, lush valleys and rich culture of the Konkan coast. Book treks, homestays and unique experiences.',
echo   keywords: ['Kokan', 'Konkan', 'tourism', 'Maharashtra', 'beaches', 'treks', 'homestay'],
echo   manifest: '/manifest.json',
echo   metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ^|^| 'https://visitkokan.in'),
echo }
echo.
echo export default function RootLayout({ children }: { children: React.ReactNode }) {
echo   return (
echo     ^<html lang="en" className={`${inter.variable} ${playfair.variable}`}^>
echo       ^<body^>
echo         ^<AuthProvider^>
echo           {children}
echo           ^<Toaster position="top-center" toastOptions={{ duration: 3000 }} /^>
echo         ^</AuthProvider^>
echo       ^</body^>
echo     ^</html^>
echo   )
echo }
)

:: ================================================
:: Update homepage with real sections
:: ================================================
> "src\app\page.tsx" (
echo import Navbar from '@/components/layout/Navbar'
echo import Footer from '@/components/layout/Footer'
echo import HeroSection from '@/components/home/HeroSection'
echo import StatsBar from '@/components/home/StatsBar'
echo.
echo export default function Home() {
echo   return (
echo     ^<main^>
echo       ^<Navbar /^>
echo       ^<HeroSection /^>
echo       ^<StatsBar /^>
echo       ^<section className="py-20 px-4 max-w-7xl mx-auto"^>
echo         ^<div className="text-center"^>
echo           ^<h2 className="section-title"^>Featured Destinations^</h2^>
echo           ^<p className="text-gray-500 mt-3"^>Destination cards will load from Firestore once connected.^</p^>
echo         ^</div^>
echo       ^</section^>
echo       ^<Footer /^>
echo     ^</main^>
echo   )
echo }
)

echo.
echo  OK - All source files written.
echo.
echo  ================================================
echo   SOURCE FILES COMPLETE!
echo  ================================================
echo.
echo  Files created:
echo  - src/context/AuthContext.tsx
echo  - src/hooks/useAuth.ts + useFirestore.ts
echo  - src/lib/firebase/admin.ts
echo  - src/lib/utils/index.ts
echo  - src/lib/seo/metadata.ts
echo  - src/lib/ai/tripPlanner.ts
echo  - src/components/layout/Navbar + Footer
echo  - src/components/home/HeroSection + StatsBar
echo  - src/components/listing/ListingCard
echo  - src/components/blog/BlogCard
echo  - src/components/auth/AuthGuard
echo  - src/app/page.tsx (updated with Navbar+Hero)
echo  - src/app/layout.tsx (updated with AuthProvider)
echo  - src/app/(auth)/login/page.tsx
echo  - src/app/(user)/dashboard/page.tsx
echo  - src/app/(vendor)/vendor/dashboard/page.tsx
echo  - src/app/(admin)/admin/dashboard/page.tsx
echo  - src/app/(public)/destinations/[slug]/page.tsx
echo  - src/app/(public)/blogs/[slug]/page.tsx
echo  - src/app/(public)/listings/[id]/page.tsx
echo.
echo  Run: npm run dev
echo  Open: http://localhost:3000
echo.
pause
