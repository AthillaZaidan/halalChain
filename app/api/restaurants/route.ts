// app/api/restaurants/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET - List all restaurants with optional filters
export async function GET(request: Request) {
  try {
    // Debug: Check if DATABASE_URL exists
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set')
      return NextResponse.json(
        { error: 'Database configuration error', details: 'DATABASE_URL not configured' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    
    const province = searchParams.get('province')
    const search = searchParams.get('search')
    const verified = searchParams.get('verified')
    const limit = searchParams.get('limit')
    
    // Build where clause
    const where: {
      province?: string
      verified?: boolean
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' }
        address?: { contains: string; mode: 'insensitive' }
        cuisine?: { contains: string; mode: 'insensitive' }
      }>
    } = {}
    
    if (province && province !== 'All Provinces') {
      where.province = province
    }
    
    if (verified === 'true') {
      where.verified = true
    } else if (verified === 'false') {
      where.verified = false
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { cuisine: { contains: search, mode: 'insensitive' } },
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
          select: {
            qrScans: true
          }
        }
      },
      orderBy: {
        rating: 'desc'
      },
      ...(limit ? { take: parseInt(limit) } : {})
    })

    return NextResponse.json(restaurants)
  } catch (error) {
    console.error('Database error:', error)
    // Return detailed error in response for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    )
  }
}

// POST - Create new restaurant
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // ownerId is required - either from body or we need to skip
    if (!body.ownerId) {
      return NextResponse.json(
        { error: 'Owner ID is required' },
        { status: 400 }
      )
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        name: body.name,
        address: body.address,
        province: body.province,
        cuisine: body.cuisine,
        phone: body.phone || '',
        openHours: body.openHours || '',
        description: body.description || '',
        latitude: body.latitude ? parseFloat(body.latitude) : 0,
        longitude: body.longitude ? parseFloat(body.longitude) : 0,
        certificationId: body.certificationId || `CERT-${Date.now()}`,
        issuingAuthority: body.issuingAuthority || 'MUI',
        certifiedDate: body.certifiedDate ? new Date(body.certifiedDate) : new Date(),
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        verified: body.verified || false,
        txHash: body.txHash || `0x${Math.random().toString(16).slice(2)}`,
        blockNumber: body.blockNumber || Math.floor(Math.random() * 1000000).toString(),
        rating: body.rating || 0,
        reviewCount: body.reviewCount || 0,
        qrScanCount: 0,
        owner: {
          connect: { id: body.ownerId }
        }
      }
    })

    return NextResponse.json(restaurant, { status: 201 })
  } catch (error) {
    console.error('Create error:', error)
    return NextResponse.json(
      { error: 'Failed to create restaurant' },
      { status: 500 }
    )
  }
}
