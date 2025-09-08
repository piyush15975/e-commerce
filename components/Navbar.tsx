"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ShoppingCart, User, Menu, X } from "lucide-react"

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    router.push("/login")
  }

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
            ShopHub
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Shop
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium"
            >
              <ShoppingCart className="w-5 h-5" />
              Cart
            </Link>
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-foreground">
                  <User className="w-5 h-5" />
                  <span className="font-medium">Account</span>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-foreground hover:text-primary transition-colors font-medium">
                  Login
                </Link>
                <Link href="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/cart"
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingCart className="w-5 h-5" />
                Cart
              </Link>
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 text-foreground">
                    <User className="w-5 h-5" />
                    <span className="font-medium">Account</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="btn btn-secondary w-fit"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/login"
                    className="text-foreground hover:text-primary transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link href="/signup" className="btn btn-primary w-fit" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
