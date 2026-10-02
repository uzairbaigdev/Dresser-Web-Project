import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'dresser-cart-items'

const safeParseCart = () => {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(safeParseCart)
  const [isCartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }
  }, [items])

  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
    [items]
  )

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0),
    [items]
  )

  const addItem = (product, quantity = 1) => {
    const amount = Number(quantity) || 1
    const productId = String(product?.id ?? product?.slug ?? product?.name ?? 'item')

    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.id === productId)

      if (existing) {
        return currentItems.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + amount } : item
        )
      }

      return [
        ...currentItems,
        {
          id: productId,
          name: product?.name || 'Product',
          price: Number(product?.price || 0),
          image: product?.image || product?.gallery?.[0]?.image || '',
          quantity: amount,
          category: product?.category || product?.categoryLabel || 'General',
          slug: product?.slug || productId,
        },
      ]
    })

    setCartOpen(true)
  }

  const updateQuantity = (productId, delta) => {
    setItems((currentItems) =>
      currentItems
        .map((item) => {
          if (item.id !== String(productId)) return item
          const nextQuantity = Number(item.quantity) + Number(delta)
          return nextQuantity > 0 ? { ...item, quantity: nextQuantity } : null
        })
        .filter(Boolean)
    )
  }

  const removeItem = (productId) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== String(productId)))
  }

  const clearCart = () => setItems([])
  const openCart = () => setCartOpen(true)
  const closeCart = () => setCartOpen(false)
  const toggleCart = () => setCartOpen((value) => !value)

  const value = {
    items,
    cartCount,
    subtotal,
    isCartOpen,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}
