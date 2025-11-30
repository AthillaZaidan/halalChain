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

    // Increment QR scan count (optional - bisa di-trigger dari verify page)
    // await prisma.restaurant.update({
    //   where: { id: params.id },
    //   data: { qrScanCount: { increment: 1 } }
    // })

    return NextResponse.json(restaurant)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch restaurant' },
      { status: 500 }
    )
  }
}
