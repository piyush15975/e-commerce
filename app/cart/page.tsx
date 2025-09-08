"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import CartItem from "@/components/CartItem"
import { ShoppingBag, ArrowLeft, CreditCard, Truck, Shield } from "lucide-react"

interface CartItemType {
  item: {
    _id: string
    name: string
    price: number
    image?: string
  }
  quantity: number
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token")
      console.log("Cart page - Token from localStorage:", token)
      if (!token) {
        console.log("Cart page - No token, redirecting to login")
        router.push("/login")
        return
      }

      try {
        const res = await fetch("/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        })
        console.log("Cart API response status:", res.status)
        if (!res.ok) {
          const errorData = await res.json()
          console.log("Cart API error:", errorData)
          throw new Error(errorData.error || "Failed to fetch cart")
        }
        const data = await res.json()
        setCartItems(data)
      } catch (err: unknown) {
        console.error("Cart fetch error:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch cart")
      } finally {
        setIsLoading(false)
      }
    }
    fetchCart()
  }, [router])

  const handleRemove = async (itemId: string) => {
    const token = localStorage.getItem("token")
    console.log("Cart page - Remove item, token:", token)
    if (!token) {
      router.push("/login")
      return
    }

    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId }),
      })
      if (!res.ok) throw new Error("Failed to remove item")
      const updatedCart = await res.json()
      setCartItems(updatedCart)
    } catch (err: unknown) {
      console.error("Remove item error:", err)
      setError(err instanceof Error ? err.message : "Failed to remove item")
    }
  }

  const total = cartItems.reduce((sum, item) => sum + item.item.price * item.quantity, 0)

  const shipping = total > 50 ? 0 : 9.99
  const tax = total * 0.08
  const finalTotal = total + shipping + tax

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-destructive rounded-full"></div>
          {error}
        </div>
      )}

      {cartItems.length === 0 ? (
        /* Enhanced empty cart state */
        <div className="text-center py-16">
          <div className="space-y-6">
            <div className="w-32 h-32 mx-auto bg-muted rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Your cart is empty</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Looks like you have not added any items to your cart yet. Start shopping to fill it up!
              </p>
            </div>
            <button onClick={() => router.push("/")} className="btn btn-primary">
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Items in Cart</h2>
              <button
                onClick={() => router.push("/")}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Continue Shopping
              </button>
            </div>

            <div className="space-y-4">
              {cartItems.map((cartItem) => (
                <CartItem key={cartItem.item._id} cartItem={cartItem} onRemove={handleRemove} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">Order Summary</h3>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-foreground">Total</span>
                    <span className="text-lg font-bold text-foreground">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {total < 50 && (
                <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg">
                  <p className="text-sm text-accent-foreground">
                    Add ${(50 - total).toFixed(2)} more for free shipping!
                  </p>
                  <div className="mt-2 w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((total / 50) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <button className="btn btn-primary w-full mt-6 h-12 text-base font-medium group">
                <CreditCard className="w-5 h-5 mr-2" />
                Proceed to Checkout
              </button>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Free shipping on orders over $50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
