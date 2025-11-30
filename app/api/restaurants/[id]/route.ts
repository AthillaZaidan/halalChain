// app/api/restaurants/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        qrScans: {
          take: 10,
          orderBy: { scannedAt: 'desc' }
        }
      }
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(restaurant)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch restaurant' },
      { status: 500 }
    )
  }
}

// PUT - Update restaurant
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // TODO: Add authentication & authorization check
    
    const restaurant = await prisma.restaurant.update({
      where: { id: params.id },
      data: {
        name: body.name,
        address: body.address,
        province: body.province,
        cuisine: body.cuisine,
        phone: body.phone,
        openHours: body.openHours,
        description: body.description,
        latitude: body.latitude ? parseFloat(body.latitude) : undefined,
        longitude: body.longitude ? parseFloat(body.longitude) : undefined,
        verified: body.verified,
      }
    })
    
    return NextResponse.json(restaurant)
  } catch (error) {
    console.error('Failed to update restaurant:', error)
    return NextResponse.json(
      { error: 'Failed to update restaurant' },
      { status: 500 }
    )
  }
}

// DELETE - Delete restaurant
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add authentication & authorization check
    
    await prisma.restaurant.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ message: 'Restaurant deleted successfully' })
  } catch (error) {
    console.error('Failed to delete restaurant:', error)
    return NextResponse.json(
      { error: 'Failed to delete restaurant' },
      { status: 500 }
    )
  }
}
