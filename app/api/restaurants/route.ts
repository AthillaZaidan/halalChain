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
        { address: { contains: search, mode: 'insensitive' } }
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
