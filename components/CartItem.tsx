"use client"

import Image from "next/image"
import { Trash2, Plus, Minus } from "lucide-react"
import { useState } from "react"

interface CartItemType {
  item: {
    _id: string
    name: string
    price: number
    image?: string
  }
  quantity: number
}

interface CartItemProps {
  cartItem: CartItemType
  onRemove: (itemId: string) => void
}

export default function CartItem({ cartItem, onRemove }: CartItemProps) {
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemove = async () => {
    setIsRemoving(true)
    await onRemove(cartItem.item._id)
    setIsRemoving(false)
  }

  return (
    <div className="bg-card text-card-foreground rounded-lg border border-border shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <Image
            src={cartItem.item.image || "/placeholder.svg?height=80&width=80&query=product"}
            alt={cartItem.item.name}
            width={80}
            height={80}
            className="w-20 h-20 object-cover rounded-lg"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{cartItem.item.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">${cartItem.item.price.toFixed(2)} each</p>

          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center border border-border rounded-lg">
              <button className="p-2 hover:bg-muted transition-colors rounded-l-lg">
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-3 py-2 text-sm font-medium min-w-[3rem] text-center">{cartItem.quantity}</span>
              <button className="p-2 hover:bg-muted transition-colors rounded-r-lg">
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <div className="text-sm text-muted-foreground">
              Total:{" "}
              <span className="font-semibold text-foreground">
                ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
          >
            {isRemoving ? (
              <div className="w-4 h-4 border border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
