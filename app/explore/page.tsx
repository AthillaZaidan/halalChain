"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { Search, MapPin, Star, Clock, ChevronDown, Grid3X3, List, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

// Restaurant type based on Prisma schema
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
}

// Indonesia provinces list
const provincesList = [
  "All Provinces",
  "Aceh", "Bali", "Banten", "Bengkulu", "DI Yogyakarta", "DKI Jakarta",
  "Gorontalo", "Jambi", "Jawa Barat", "Jawa Tengah", "Jawa Timur",
  "Kalimantan Barat", "Kalimantan Selatan", "Kalimantan Tengah",
  "Kalimantan Timur", "Kalimantan Utara", "Kepulauan Bangka Belitung",
  "Kepulauan Riau", "Lampung", "Maluku", "Maluku Utara",
  "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Papua", "Papua Barat",
  "Riau", "Sulawesi Barat", "Sulawesi Selatan", "Sulawesi Tengah",
  "Sulawesi Tenggara", "Sulawesi Utara", "Sumatera Barat",
  "Sumatera Selatan", "Sumatera Utara"
]

// Cuisine types
const cuisineTypesList = [
  "All Cuisines", "Padang", "Javanese", "Sundanese", "Satay",
  "Grilled Chicken", "Seafood", "Indonesian", "Middle Eastern",
  "Indian", "Chinese", "Japanese", "Korean", "Western"
]

export default function ExplorePage() {
  // Data state
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProvince, setSelectedProvince] = useState("All Provinces")
  const [selectedCuisine, setSelectedCuisine] = useState("All Cuisines")
  const [sortBy, setSortBy] = useState<"rating" | "name" | "reviews">("rating")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showProvinceFilter, setShowProvinceFilter] = useState(false)
  const [showCuisineFilter, setShowCuisineFilter] = useState(false)

  // Fetch restaurants from API
  useEffect(() => {
    async function fetchRestaurants() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/restaurants')
        if (!res.ok) throw new Error('Failed to fetch restaurants')
        const data = await res.json()
        setRestaurants(data)
      } catch (err) {
        console.error('Failed to fetch restaurants:', err)
        setError('Failed to load restaurants. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchRestaurants()
  }, [])

  const filteredRestaurants = useMemo(() => {
    const result = restaurants.filter((r: Restaurant) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.province.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesProvince = selectedProvince === "All Provinces" || r.province === selectedProvince
      const matchesCuisine = selectedCuisine === "All Cuisines" || r.cuisine === selectedCuisine
      return matchesSearch && matchesProvince && matchesCuisine
    })

    // Sort
    if (sortBy === "rating") {
      result.sort((a: Restaurant, b: Restaurant) => b.rating - a.rating)
    } else if (sortBy === "name") {
      result.sort((a: Restaurant, b: Restaurant) => a.name.localeCompare(b.name))
    } else if (sortBy === "reviews") {
      result.sort((a: Restaurant, b: Restaurant) => b.reviewCount - a.reviewCount)
    }

    return result
  }, [restaurants, searchQuery, selectedProvince, selectedCuisine, sortBy])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading restaurants...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/#map"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Map
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Explore Halal Restaurants</h1>
            <p className="text-muted-foreground">
              Discover {restaurants.length} blockchain-verified halal restaurants across Indonesia
            </p>
          </div>

          {/* Search and Filters */}
          <div className="glass rounded-2xl p-4 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name, location, or cuisine..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-card border-border h-12"
                />
              </div>

              {/* Province Filter */}
              <div className="relative">
                <Button
                  variant="outline"
                  className="h-12 gap-2 bg-transparent w-full lg:w-48 justify-between"
                  onClick={() => {
                    setShowProvinceFilter(!showProvinceFilter)
                    setShowCuisineFilter(false)
                  }}
                >
                  <span className="truncate">{selectedProvince}</span>
                  <ChevronDown className="h-4 w-4 shrink-0" />
                </Button>
                {showProvinceFilter && (
                  <div className="absolute top-14 left-0 right-0 z-50 glass rounded-xl p-2 max-h-[300px] overflow-y-auto">
                    {provincesList.map((province: string) => (
                      <button
                        key={province}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                          selectedProvince === province
                            ? "bg-purple-500/20 text-purple-400"
                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                        }`}
                        onClick={() => {
                          setSelectedProvince(province)
                          setShowProvinceFilter(false)
                        }}
                      >
                        {province}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cuisine Filter */}
              <div className="relative">
                <Button
                  variant="outline"
                  className="h-12 gap-2 bg-transparent w-full lg:w-48 justify-between"
                  onClick={() => {
                    setShowCuisineFilter(!showCuisineFilter)
                    setShowProvinceFilter(false)
                  }}
                >
                  <span className="truncate">{selectedCuisine}</span>
                  <ChevronDown className="h-4 w-4 shrink-0" />
                </Button>
                {showCuisineFilter && (
                  <div className="absolute top-14 left-0 right-0 z-50 glass rounded-xl p-2 max-h-[300px] overflow-y-auto">
                    {cuisineTypesList.map((cuisine: string) => (
                      <button
                        key={cuisine}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                          selectedCuisine === cuisine
                            ? "bg-purple-500/20 text-purple-400"
                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                        }`}
                        onClick={() => {
                          setSelectedCuisine(cuisine)
                          setShowCuisineFilter(false)
                        }}
                      >
                        {cuisine}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sort and View Toggle */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <div className="flex gap-1">
                  {[
                    { value: "rating", label: "Rating" },
                    { value: "reviews", label: "Reviews" },
                    { value: "name", label: "Name" },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant="ghost"
                      size="sm"
                      className={sortBy === option.value ? "bg-purple-500/20 text-purple-400" : "text-muted-foreground"}
                      onClick={() => setSortBy(option.value as typeof sortBy)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={viewMode === "grid" ? "bg-purple-500/20 text-purple-400" : "text-muted-foreground"}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={viewMode === "list" ? "bg-purple-500/20 text-purple-400" : "text-muted-foreground"}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing <span className="text-foreground font-semibold">{filteredRestaurants.length}</span> restaurants
              {selectedProvince !== "All Provinces" && (
                <span>
                  {" "}
                  in <span className="text-purple-400">{selectedProvince}</span>
                </span>
              )}
              {selectedCuisine !== "All Cuisines" && (
                <span>
                  {" "}
                  serving <span className="text-pink-400">{selectedCuisine}</span>
                </span>
              )}
            </p>
          </div>

          {/* Restaurant Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantListItem key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredRestaurants.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 mb-4">
                <Search className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No restaurants found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedProvince("All Provinces")
                  setSelectedCuisine("All Cuisines")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <div className="glass rounded-2xl overflow-hidden hover:bg-white/8 transition-all group">
        {/* Image */}
        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20">
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">🍽️</span>
          </div>
          <div className="absolute top-3 right-3">
            {restaurant.verified && (
              <Badge className="bg-green-500/90 text-white border-0">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-black/50 backdrop-blur-sm border-0">
              {restaurant.cuisine}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-1 truncate">{restaurant.name}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
            <MapPin className="h-3 w-3" />
            {restaurant.address}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-foreground">{restaurant.rating}</span>
              <span className="text-xs text-muted-foreground">({restaurant.reviewCount})</span>
            </div>
            <span className="text-sm text-muted-foreground">{restaurant.province}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function RestaurantListItem({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <div className="glass rounded-2xl p-4 hover:bg-white/8 transition-all flex gap-4">
        {/* Image */}
        <div className="relative w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
          <span className="text-4xl">🍽️</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-semibold text-foreground">{restaurant.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {restaurant.address}, {restaurant.province}
              </p>
            </div>
            {restaurant.verified && (
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20 shrink-0">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{restaurant.description}</p>

          <div className="flex items-center gap-4 flex-wrap">
            <Badge variant="secondary">{restaurant.cuisine}</Badge>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-foreground">{restaurant.rating}</span>
              <span className="text-xs text-muted-foreground">({restaurant.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              {restaurant.openHours}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
