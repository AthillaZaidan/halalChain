// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@halalchain.com' },
    update: {},
    create: {
      email: 'demo@halalchain.com',
      name: 'Demo User',
      passwordHash: await bcrypt.hash('demo123', 10),
      role: 'OWNER'
    }
  })

  console.log('✅ Created demo user:', demoUser.email)

  // Sample restaurants
  const restaurants = [
    {
      name: "Warung Padang Sederhana",
      address: "Jl. Sudirman No. 123, Jakarta Pusat",
      province: "DKI Jakarta",
      cuisine: "Padang",
      phone: "+62 21 5234567",
      openHours: "08:00 - 22:00",
      description: "Authentic Padang cuisine with traditional recipes",
      latitude: -6.2088,
      longitude: 106.8456,
      certificationId: "MUI-2025-001234",
      certifiedDate: new Date('2025-01-15'),
      expiryDate: new Date('2026-12-31'),
      verified: true,
      txHash: "0x7f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4a3b2c1d",
      blockNumber: "12345678",
      rating: 4.8,
      reviewCount: 1250
    },
    {
      name: "Sate Khas Senayan",
      address: "Jl. Asia Afrika No. 45, Bandung",
      province: "Jawa Barat",
      cuisine: "Satay",
      phone: "+62 22 4201234",
      openHours: "10:00 - 22:00",
      description: "Premium satay with signature peanut sauce",
      latitude: -6.9175,
      longitude: 107.6191,
      certificationId: "MUI-2025-001235",
      certifiedDate: new Date('2025-02-01'),
      expiryDate: new Date('2026-11-30'),
      verified: true,
      txHash: "0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      blockNumber: "12346789",
      rating: 4.6,
      reviewCount: 890
    },
    {
      name: "Ayam Bakar Wong Solo",
      address: "Jl. Pemuda No. 78, Surabaya",
      province: "Jawa Timur",
      cuisine: "Grilled Chicken",
      phone: "+62 31 5678901",
      openHours: "09:00 - 21:00",
      description: "Famous grilled chicken with secret spices",
      latitude: -7.2575,
      longitude: 112.7521,
      certificationId: "MUI-2025-001236",
      certifiedDate: new Date('2025-01-20'),
      expiryDate: new Date('2026-12-31'),
      verified: true,
      txHash: "0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
      blockNumber: "12347890",
      rating: 4.7,
      reviewCount: 1560
    }
  ]

  for (const restaurant of restaurants) {
    await prisma.restaurant.create({
      data: {
        ...restaurant,
        ownerId: demoUser.id
      }
    })
    console.log(`✅ Created: ${restaurant.name}`)
  }

  console.log('🎉 Seed completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
