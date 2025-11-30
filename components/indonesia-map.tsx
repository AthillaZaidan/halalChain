// components/indonesia-map.tsx
"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import {
  MapPin,
  Star,
  ExternalLink,
  Filter,
  Search,
  ChevronDown,
  ZoomIn,
  ZoomOut,
  Locate,
  Shield,
  Utensils,
  X,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

type Restaurant = {
  id: string
  name: string
  address: string
  province: string
  cuisine: string
  phone: string
  openHours: string
  description: string
  latitude: number
  longitude: number
  certificationId: string
  issuingAuthority: string
  certifiedDate: string
  expiryDate: string
  verified: boolean
  txHash: string
  blockNumber: string
  rating: number
  reviewCount: number
  qrScanCount: number
  createdAt: string
  updatedAt: string
  owner?: {
    id: string
    name: string
    email: string
  }
  _count?: {
    qrScans: number
  }
}

const provinces = [
  "All Provinces",
  "Aceh",
  "Bali",
  "Banten",
  "Bengkulu",
  "DI Yogyakarta",
  "DKI Jakarta",
  "Gorontalo",
  "Jambi",
  "Jawa Barat",
  "Jawa Tengah",
  "Jawa Timur",
  "Kalimantan Barat",
  "Kalimantan Selatan",
  "Kalimantan Tengah",
  "Kalimantan Timur",
  "Kalimantan Utara",
  "Kepulauan Bangka Belitung",
  "Kepulauan Riau",
  "Lampung",
  "Maluku",
  "Maluku Utara",
  "Nusa Tenggara Barat",
  "Nusa Tenggara Timur",
  "Papua",
  "Papua Barat",
  "Riau",
  "Sulawesi Barat",
  "Sulawesi Selatan",
  "Sulawesi Tengah",
  "Sulawesi Tenggara",
  "Sulawesi Utara",
  "Sumatera Barat",
  "Sumatera Selatan",
  "Sumatera Utara",
]

const INDONESIA_CENTER = { lat: -2.5, lng: 118 }
const TILE_SIZE = 256

// ✅ SIMPLIFIED: Standard Web Mercator projection
class WebMercator {
  static latToY(lat: number, zoom: number): number {
    const latRad = (lat * Math.PI) / 180
    const n = Math.log(Math.tan(Math.PI / 4 + latRad / 2))
    const scale = TILE_SIZE * Math.pow(2, zoom)
    return (1 - n / Math.PI) / 2 * scale
  }

  static lngToX(lng: number, zoom: number): number {
    const scale = TILE_SIZE * Math.pow(2, zoom)
    return ((lng + 180) / 360) * scale
  }

  static yToLat(y: number, zoom: number): number {
    const scale = TILE_SIZE * Math.pow(2, zoom)
    const n = Math.PI * (1 - 2 * y / scale)
    return (180 / Math.PI) * Math.atan(Math.sinh(n))
  }

  static xToLng(x: number, zoom: number): number {
    const scale = TILE_SIZE * Math.pow(2, zoom)
    return (x / scale) * 360 - 180
  }
}

function getTileUrl(x: number, y: number, z: number) {
  return `https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/${z}/${x}/${y}.png`
}

export function IndonesiaMap() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [hoveredRestaurant, setHoveredRestaurant] = useState<Restaurant | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProvince, setSelectedProvince] = useState("All Provinces")
  const [showFilters, setShowFilters] = useState(false)

  const [zoom, setZoom] = useState(5)
  const [center, setCenter] = useState(INDONESIA_CENTER)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ 
    mouseX: 0, 
    mouseY: 0, 
    centerX: 0, 
    centerY: 0 
  })
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapSize, setMapSize] = useState({ width: 800, height: 500 })

  // Fetch restaurants
  useEffect(() => {
    async function fetchRestaurants() {
      setLoading(true)
      setError(null)
      
      try {
        const params = new URLSearchParams()
        
        if (selectedProvince !== "All Provinces") {
          params.append('province', selectedProvince)
        }
        
        if (searchQuery) {
          params.append('search', searchQuery)
        }
        
        const res = await fetch(`/api/restaurants?${params}`)
        
        if (!res.ok) {
          throw new Error('Failed to fetch restaurants')
        }
        
        const data = await res.json()
        setRestaurants(data)
      } catch (err) {
        console.error('Failed to fetch restaurants:', err)
        setError('Failed to load restaurants. Please try again.')
        setRestaurants([])
      } finally {
        setLoading(false)
      }
    }
    
    const timer = setTimeout(() => {
      fetchRestaurants()
    }, 300)
    
    return () => clearTimeout(timer)
  }, [selectedProvince, searchQuery])

  useEffect(() => {
    const updateSize = () => {
      if (mapRef.current) {
        setMapSize({
          width: mapRef.current.clientWidth,
          height: mapRef.current.clientHeight,
        })
      }
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProvince = selectedProvince === "All Provinces" || r.province === selectedProvince
    return matchesSearch && matchesProvince
  })

  // ✅ FIXED: Get tiles to display
  const getTiles = useCallback(() => {
    const centerX = WebMercator.lngToX(center.lng, zoom)
    const centerY = WebMercator.latToY(center.lat, zoom)
    
    const tiles: { x: number; y: number; z: number; screenX: number; screenY: number }[] = []
    
    const centerTileX = Math.floor(centerX / TILE_SIZE)
    const centerTileY = Math.floor(centerY / TILE_SIZE)
    
    const offsetX = centerX - centerTileX * TILE_SIZE
    const offsetY = centerY - centerTileY * TILE_SIZE
    
    const tilesWide = Math.ceil(mapSize.width / TILE_SIZE) + 1
    const tilesHigh = Math.ceil(mapSize.height / TILE_SIZE) + 1
    
    const startX = centerTileX - Math.ceil(tilesWide / 2)
    const startY = centerTileY - Math.ceil(tilesHigh / 2)
    
    const maxTile = Math.pow(2, zoom)
    
    for (let x = startX; x < startX + tilesWide + 1; x++) {
      for (let y = startY; y < startY + tilesHigh + 1; y++) {
        if (y >= 0 && y < maxTile) {
          const tileX = ((x % maxTile) + maxTile) % maxTile
          
          const screenX = mapSize.width / 2 + (x - centerTileX) * TILE_SIZE - offsetX
          const screenY = mapSize.height / 2 + (y - centerTileY) * TILE_SIZE - offsetY
          
          tiles.push({
            x: tileX,
            y: y,
            z: zoom,
            screenX,
            screenY,
          })
        }
      }
    }
    
    return tiles
  }, [center.lat, center.lng, zoom, mapSize.width, mapSize.height])

  // ✅ FIXED: Get marker screen position
  const getMarkerPosition = useCallback(
    (lat: number, lng: number) => {
      const markerX = WebMercator.lngToX(lng, zoom)
      const markerY = WebMercator.latToY(lat, zoom)
      
      const centerX = WebMercator.lngToX(center.lng, zoom)
      const centerY = WebMercator.latToY(center.lat, zoom)
      
      const screenX = mapSize.width / 2 + (markerX - centerX)
      const screenY = mapSize.height / 2 + (markerY - centerY)
      
      return { x: screenX, y: screenY }
    },
    [center.lat, center.lng, zoom, mapSize.width, mapSize.height],
  )

  const handleZoomIn = () => setZoom((z) => Math.min(z + 1, 15))
  const handleZoomOut = () => setZoom((z) => Math.max(z - 1, 3))
  const handleResetView = () => {
    setZoom(5)
    setCenter(INDONESIA_CENTER)
    setSelectedRestaurant(null)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button, a")) return
    setIsDragging(true)
    setDragStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      centerX: WebMercator.lngToX(center.lng, zoom),
      centerY: WebMercator.latToY(center.lat, zoom),
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const dx = e.clientX - dragStart.mouseX
    const dy = e.clientY - dragStart.mouseY
    
    const newCenterX = dragStart.centerX - dx
    const newCenterY = dragStart.centerY - dy
    
    const newLat = WebMercator.yToLat(newCenterY, zoom)
    const newLng = WebMercator.xToLng(newCenterX, zoom)
    
    setCenter({
      lat: Math.max(-85, Math.min(85, newLat)),
      lng: newLng,
    })
  }

  const handleMouseUp = () => setIsDragging(false)
  const handleMouseLeave = () => setIsDragging(false)

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    
    const delta = e.deltaY > 0 ? -1 : 1
    const newZoom = Math.max(3, Math.min(15, zoom + delta))
    
    if (newZoom !== zoom) {
      const rect = mapRef.current?.getBoundingClientRect()
      if (rect) {
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        
        // Get world coordinates at mouse position
        const centerWorldX = WebMercator.lngToX(center.lng, zoom)
        const centerWorldY = WebMercator.latToY(center.lat, zoom)
        
        const mouseWorldX = centerWorldX + (mouseX - mapSize.width / 2)
        const mouseWorldY = centerWorldY + (mouseY - mapSize.height / 2)
        
        const mouseLat = WebMercator.yToLat(mouseWorldY, zoom)
        const mouseLng = WebMercator.xToLng(mouseWorldX, zoom)
        
        // Calculate new center at new zoom
        const mouseWorldXNew = WebMercator.lngToX(mouseLng, newZoom)
        const mouseWorldYNew = WebMercator.latToY(mouseLat, newZoom)
        
        const newCenterWorldX = mouseWorldXNew - (mouseX - mapSize.width / 2)
        const newCenterWorldY = mouseWorldYNew - (mouseY - mapSize.height / 2)
        
        const newLat = WebMercator.yToLat(newCenterWorldY, newZoom)
        const newLng = WebMercator.xToLng(newCenterWorldX, newZoom)
        
        setCenter({
          lat: Math.max(-85, Math.min(85, newLat)),
          lng: newLng,
        })
      }
      
      setZoom(newZoom)
    }
  }

  const focusOnRestaurant = useCallback((restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
    setCenter({ lat: restaurant.latitude, lng: restaurant.longitude })
    setZoom(12)
  }, [])

  const tiles = getTiles()

  return (
    <div className="relative w-full">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background -z-10" />

      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Interactive Map
          </span>
        </h2>
        <p className="text-xl text-muted-foreground mb-2">
          Explore Halal Restaurants <span className="font-semibold text-foreground">Across Indonesia</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Click on any pin to view restaurant details and blockchain-verified halal certification status
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search restaurants, locations, or cuisines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 bg-card border-border h-12"
          />
        </div>
        <div className="relative">
          <Button
            variant="outline"
            className="w-full md:w-auto h-12 px-6"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            {selectedProvince === "All Provinces" ? "Filter by Province" : selectedProvince}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          {showFilters && (
            <div className="absolute top-full mt-2 right-0 w-64 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              {provinces.map((province) => (
                <button
                  key={province}
                  onClick={() => {
                    setSelectedProvince(province)
                    setShowFilters(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-accent transition-colors"
                >
                  {province}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-[600px] bg-card border border-border rounded-xl">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading restaurants...</p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center justify-center h-[600px] bg-card border border-border rounded-xl">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          <div className="relative bg-card border border-border rounded-xl overflow-hidden shadow-lg">
            <div
              ref={mapRef}
              className="relative w-full h-[600px] overflow-hidden cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onWheel={handleWheel}
            >
              {/* Map Tiles */}
              <div className="absolute inset-0 select-none pointer-events-none">
                {tiles.map((tile) => (
                  <img
                    key={`${tile.z}-${tile.x}-${tile.y}`}
                    src={getTileUrl(tile.x, tile.y, tile.z)}
                    alt=""
                    className="absolute"
                    style={{
                      left: tile.screenX,
                      top: tile.screenY,
                      width: TILE_SIZE,
                      height: TILE_SIZE,
                    }}
                  />
                ))}
              </div>

              {/* Restaurant Markers */}
              {filteredRestaurants.map((restaurant) => {
                const pos = getMarkerPosition(restaurant.latitude, restaurant.longitude)
                const isSelected = selectedRestaurant?.id === restaurant.id
                const isHovered = hoveredRestaurant?.id === restaurant.id

                if (pos.x < -50 || pos.x > mapSize.width + 50 || pos.y < -50 || pos.y > mapSize.height + 50) {
                  return null
                }

                return (
                  <div
                    key={restaurant.id}
                    className="absolute pointer-events-auto"
                    style={{
                      left: pos.x,
                      top: pos.y,
                      transform: "translate(-50%, -100%)",
                    }}
                  >
                    {(isSelected || isHovered) && (
                      <div className="absolute -inset-4 bg-green-500/20 rounded-full animate-ping" />
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        focusOnRestaurant(restaurant)
                      }}
                      onMouseEnter={() => setHoveredRestaurant(restaurant)}
                      onMouseLeave={() => setHoveredRestaurant(null)}
                      className={`relative transition-all duration-200 ${
                        isSelected || isHovered ? "scale-125 z-50" : "hover:scale-110 z-10"
                      }`}
                    >
                      <MapPin
                        className={`h-8 w-8 drop-shadow-lg ${
                          restaurant.verified
                            ? isSelected
                              ? "fill-green-500 text-green-600"
                              : "fill-green-400 text-green-500"
                            : isSelected
                              ? "fill-orange-500 text-orange-600"
                              : "fill-orange-400 text-orange-500"
                        }`}
                      />
                      <div
                        className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0.5 h-2 ${
                          restaurant.verified
                            ? isSelected
                              ? "bg-green-600"
                              : "bg-green-500"
                            : isSelected
                              ? "bg-orange-600"
                              : "bg-orange-500"
                        }`}
                      />
                    </button>

                    {isHovered && !isSelected && (
                      <div className="absolute left-full ml-4 -top-2 w-64 bg-card border border-border rounded-lg shadow-xl p-3 pointer-events-none z-50">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-sm">{restaurant.name}</h3>
                          {restaurant.verified && (
                            <Badge variant="default" className="text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{restaurant.address}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            {restaurant.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Utensils className="w-3 h-3" />
                            {restaurant.cuisine}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="icon" variant="secondary" onClick={handleZoomIn} title="Zoom In">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" onClick={handleZoomOut} title="Zoom Out">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" onClick={handleResetView} title="Reset View">
                  <Locate className="h-4 w-4" />
                </Button>
              </div>

              <div className="absolute bottom-4 left-4 bg-card/90 border border-border rounded-lg px-3 py-1 text-xs">
                Zoom: <span className="font-mono font-semibold">{zoom}x</span>
              </div>

              <div className="absolute bottom-4 left-24 bg-card/90 border border-border rounded-lg px-3 py-1 text-xs">
                Showing {filteredRestaurants.length} restaurants
              </div>

              <div className="absolute top-4 left-4 bg-card/90 border border-border rounded-lg p-3 text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 fill-green-400 text-green-500" />
                  <span>Verified ({filteredRestaurants.filter((r) => r.verified).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 fill-orange-400 text-orange-500" />
                  <span>Pending ({filteredRestaurants.filter((r) => !r.verified).length})</span>
                </div>
              </div>

              <div className="absolute bottom-2 right-4 text-[10px] text-muted-foreground bg-card/70 px-2 py-1 rounded">
                © OpenStreetMap contributors
              </div>
            </div>
          </div>

          {/* Restaurant Details Panel */}
          <div className="bg-card border border-border rounded-xl p-6 h-fit lg:sticky lg:top-4">
            {selectedRestaurant ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-2xl font-bold">{selectedRestaurant.name}</h3>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setSelectedRestaurant(null)}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {selectedRestaurant.address}, {selectedRestaurant.province}
                  </p>
                  {selectedRestaurant.verified && (
                    <Badge variant="default" className="mb-4">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified Halal
                    </Badge>
                  )}
                </div>

                <p className="text-sm">{selectedRestaurant.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-3 bg-accent/50 rounded-lg">
                    <Star className="h-5 w-5 fill-yellow-500 text-yellow-500 mb-1" />
                    <span className="text-xl font-bold">{selectedRestaurant.rating}</span>
                    <span className="text-xs text-muted-foreground">Rating</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-accent/50 rounded-lg">
                    <Utensils className="h-5 w-5 mb-1" />
                    <span className="text-sm font-semibold">{selectedRestaurant.cuisine}</span>
                    <span className="text-xs text-muted-foreground">Cuisine</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Blockchain Verification
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Certificate ID</span>
                      <p className="font-mono text-xs">{selectedRestaurant.certificationId}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Authority</span>
                      <p>{selectedRestaurant.issuingAuthority}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Valid Until</span>
                      <p>{new Date(selectedRestaurant.expiryDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Block Hash</span>
                      <p className="font-mono text-xs break-all">{selectedRestaurant.txHash.slice(0, 20)}...</p>
                    </div>
                  </div>
                </div>

                <Link href={`/restaurant/${selectedRestaurant.id}`} className="block">
                  <Button className="w-full" variant="default">
                    View Details
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="font-semibold mb-2">Select a Restaurant</h3>
                <p className="text-sm text-muted-foreground">
                  Click on any pin on the map to view restaurant details and blockchain verification status
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && !error && filteredRestaurants.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Quick Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {filteredRestaurants.slice(0, 10).map((restaurant) => (
              <button
                key={restaurant.id}
                onClick={() => focusOnRestaurant(restaurant)}
                className="p-4 bg-card border border-border rounded-lg hover:border-green-500 transition-all text-left group"
              >
                <div className="flex items-start gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <h4 className="font-semibold text-sm group-hover:text-green-500 transition-colors">
                    {restaurant.name}
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground">{restaurant.address}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
