"use client"

import { useState, useEffect } from "react"
import Filter from "@/components/Filter"
import ItemCard from "@/components/ItemCard"
import { Search, Grid, List } from "lucide-react"

interface Item {
  _id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([])
  const [error, setError] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")

  const fetchItems = async (filters: { minPrice?: number; maxPrice?: number; category?: string }) => {
    try {
      const params = new URLSearchParams()
      if (filters.minPrice) params.append("minPrice", filters.minPrice.toString())
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice.toString())
      if (filters.category) params.append("category", filters.category)
      const url = `/api/items?${params.toString()}`
      console.log("Fetching items from:", url)
      const res = await fetch(url)
      console.log("Fetch items response status:", res.status)
      if (!res.ok) {
        const errorData = await res.json()
        console.log("Fetch items error response:", errorData)
        throw new Error(errorData.error || "Failed to fetch items")
      }
      const data = await res.json()
      console.log("Fetched items:", data)
      setItems(data)
    } catch (err: unknown) {
      console.error("Fetch items error:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch items")
    }
  }

  useEffect(() => {
    fetchItems({})
  }, [])

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Discover Amazing Products</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find everything you need in our curated collection of quality items at unbeatable prices
          </p>
        </div>

        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
      </div>

      <Filter onFilterChange={fetchItems} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">
            {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
          </h2>
          <p className="text-muted-foreground">
            {filteredItems.length} {filteredItems.length === 1 ? "product" : "products"} found
          </p>
        </div>

        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "grid"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "list"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="space-y-4">
            <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">No products found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try adjusting your search terms or filters" : "No items available at the moment"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
          }
        >
          {filteredItems.map((item) => (
            <ItemCard key={item._id} item={item} viewMode={viewMode} />
          ))}
        </div>
      )}
    </div>
  )
}
