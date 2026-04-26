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

const ADMIN_EMAIL = 'admin@kokan.com'   // 👈 change this
const ADMIN_PASSWORD = 'Admin@123'       // 👈 change this
const ADMIN_NAME = 'Kokan Admin'

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