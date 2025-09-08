"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { ShoppingCart, Heart, Star } from "lucide-react"
import { useState } from "react"

interface Item {
  _id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
}

interface ItemCardProps {
  item: Item
  viewMode?: "grid" | "list"
}

export default function ItemCard({ item, viewMode = "grid" }: ItemCardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId: item._id, quantity: 1 }),
      })
      if (!res.ok) throw new Error("Failed to add to cart")

      const notification = document.createElement("div")
      notification.className =
        "fixed top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2"
      notification.textContent = "Added to cart!"
      document.body.appendChild(notification)
      setTimeout(() => notification.remove(), 3000)
    } catch (error) {
      console.error("Add to cart error:", error)
      alert("Failed to add to cart")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited)
  }

  if (viewMode === "grid") {
    return (
      <div className="group bg-card text-card-foreground rounded-lg border border-border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
        <div className="relative overflow-hidden">
          <Image
            src={item.image || "/placeholder.svg?height=240&width=300&query=product"}
            alt={item.name}
            width={300}
            height={240}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />

          <div className="absolute top-3 left-3">
            <span className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              {item.category}
            </span>
          </div>

          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
          </button>

          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="btn btn-primary transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Quick Add
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {item.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
          </div>

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-xs text-muted-foreground ml-1">(4.5)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-lg font-bold text-foreground">${item.price.toFixed(2)}</p>
            </div>
            <button onClick={handleAddToCart} disabled={isLoading} className="btn btn-secondary text-sm px-3 py-1.5">
              {isLoading ? (
                <div className="w-3 h-3 border border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin" />
              ) : (
                <ShoppingCart className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group bg-card text-card-foreground rounded-lg border border-border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="flex gap-4 p-4">
        <div className="relative flex-shrink-0">
          <Image
            src={item.image || "/placeholder.svg?height=120&width=120&query=product"}
            alt={item.name}
            width={120}
            height={120}
            className="w-24 h-24 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
          />
          <button
            onClick={toggleFavorite}
            className="absolute -top-2 -right-2 p-1.5 bg-background border border-border rounded-full hover:bg-muted transition-colors"
          >
            <Heart className={`w-3 h-3 ${isFavorited ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
          </button>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">{item.category}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-xl font-bold text-foreground">${item.price.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-xs text-muted-foreground ml-1">(4.5)</span>
            </div>

            <button onClick={handleAddToCart} disabled={isLoading} className="btn btn-primary">
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
