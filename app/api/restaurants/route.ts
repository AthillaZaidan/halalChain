// app/api/restaurants/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const province = searchParams.get('province')
    const cuisine = searchParams.get('cuisine')
    const search = searchParams.get('search')

    // Build query filters
    const where: any = { verified: true }

    if (province && province !== 'all') {
      where.province = province
    }

    if (cuisine && cuisine !== 'all') {
      where.cuisine = cuisine
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const restaurants = await prisma.restaurant.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: { qrScans: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(restaurants)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    )
  }
}

// POST - Create new restaurant (for dashboard later)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // TODO: Add authentication check here
    // const session = await getServerSession()
    // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const restaurant = await prisma.restaurant.create({
      data: {
        name: body.name,
        address: body.address,
        province: body.province,
        cuisine: body.cuisine,
        phone: body.phone,
        openHours: body.openHours,
        description: body.description,
        latitude: parseFloat(body.latitude),
        longitude: parseFloat(body.longitude),
        certificationId: body.certificationId || `MUI-${Date.now()}`,
        certifiedDate: new Date(body.certifiedDate),
        expiryDate: new Date(body.expiryDate),
        verified: body.verified || false,
        txHash: body.txHash || `0x${Math.random().toString(16).slice(2)}`,
        blockNumber: body.blockNumber || Math.floor(Math.random() * 10000000).toString(),
        rating: body.rating || 0,
        reviewCount: body.reviewCount || 0,
        ownerId: body.ownerId, // TODO: Get from session
      }
    })
    
    return NextResponse.json(restaurant, { status: 201 })
  } catch (error) {
    console.error('Failed to create restaurant:', error)
    return NextResponse.json(
      { error: 'Failed to create restaurant' },
      { status: 500 }
    )
  }
}
