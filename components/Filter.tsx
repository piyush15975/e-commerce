"use client"

import { useState } from "react"
import { FilterIcon, X } from "lucide-react"

interface FilterProps {
  onFilterChange: (filters: { minPrice?: number; maxPrice?: number; category?: string }) => void
}

export default function Filter({ onFilterChange }: FilterProps) {
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [category, setCategory] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  const handleApplyFilters = () => {
    onFilterChange({
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      category: category || undefined,
    })
  }

  const handleClearFilters = () => {
    setMinPrice("")
    setMaxPrice("")
    setCategory("")
    onFilterChange({})
  }

  const hasActiveFilters = minPrice || maxPrice || category

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FilterIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">Active</span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="md:hidden p-2 hover:bg-muted rounded-md transition-colors"
        >
          {isExpanded ? <X className="w-4 h-4" /> : <FilterIcon className="w-4 h-4" />}
        </button>
      </div>

      <div className={`mt-4 space-y-4 ${isExpanded ? "block" : "hidden md:block"}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Min Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="input pl-8"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Max Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="input pl-8"
                placeholder="1000"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button onClick={handleApplyFilters} className="btn btn-primary flex-1">
              Apply
            </button>
            {hasActiveFilters && (
              <button onClick={handleClearFilters} className="btn bg-muted text-muted-foreground hover:bg-muted/80">
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
