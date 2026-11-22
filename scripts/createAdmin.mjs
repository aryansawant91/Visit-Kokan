import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Manually read .env.local
const envPath = resolve(process.cwd(), '.env.local')
const envFile = readFileSync(envPath, 'utf-8')
envFile.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=')
  if (key && vals.length) process.env[key.trim()] = vals.join('=').trim()
})

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
})

const auth = getAuth()
const db = getFirestore()

const ADMIN_EMAIL = process.env.INITIAL_ADMIN_EMAIL || process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.INITIAL_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD
const ADMIN_NAME = process.env.ADMIN_NAME || 'Kokan Admin'

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('❌ Error: INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD environment variables are required.')
  console.error('Example: INITIAL_ADMIN_EMAIL="admin@visitkokan.in" INITIAL_ADMIN_PASSWORD="YourSecurePassword!" node scripts/createAdmin.mjs')
  process.exit(1)
}

async function createAdmin() {
  try {
    let userRecord
    try {
      userRecord = await auth.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        displayName: ADMIN_NAME,
        emailVerified: true,
      })
      console.log('✅ Auth user created:', userRecord.uid)
    } catch (err) {
      if (err.code === 'auth/email-already-exists') {
        userRecord = await auth.getUserByEmail(ADMIN_EMAIL)
        console.log('ℹ️  User already exists:', userRecord.uid)
      } else {
        throw err
      }
    }

    await auth.setCustomUserClaims(userRecord.uid, { role: 'admin' })
    console.log('✅ Custom claim set: role = admin')

    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: ADMIN_EMAIL,
      displayName: ADMIN_NAME,
      role: 'admin',
      emailVerified: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    console.log('✅ Firestore profile created')
    console.log('\n🎉 Admin ready!')
    console.log('   Email   :', ADMIN_EMAIL)
    console.log('   Password:', ADMIN_PASSWORD)

  } catch (err) {
    console.error('❌ Error:', err.message)
  } finally {
    process.exit(0)
  }
}

createAdmin()