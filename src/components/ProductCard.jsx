import React, { useRef } from 'react'
import { ShoppingBag, Heart, Eye } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import { useToast } from './ui/use-toast'
import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const cardRef = useRef(null)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart({ product }))
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been successfully added.`,
      className: 'bg-black border-neutral-700 text-white',
    })
  }

  // 3D Hover Tilt
  const handleMouseMove = (e) => {
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * 8
    const rotateY = ((x - centerX) / centerX) * -8
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    card.style.transform = 'rotateX(0deg) rotateY(0deg)'
  }

  return (
    <div
      ref={cardRef}
      className="group relative w-full max-w-sm mx-auto perspective-1000 transition-transform duration-300"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={`/product/${product.slug}`}
        className="block rounded-3xl border border-neutral-700/30 backdrop-blur-md bg-gradient-to-br from-white/5 via-white/3 to-white/5 shadow-[0_8px_24px_rgba(255,255,255,0.05)] overflow-hidden transition-all hover:shadow-lg hover:scale-[1.015] will-change-transform"
      >
        {/* Product Image */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1698476803391-cef4134df5c2'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Floating Badge */}
          <span className="absolute top-4 left-4 bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-lg border border-white/20 shadow-md animate-pulse">
            New Arrival
          </span>

          {/* Floating Icons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button className="bg-white/10 p-2 rounded-full border border-white/20 backdrop-blur-md text-white hover:bg-white/20 transition">
              <Heart size={16} />
            </button>
            <button className="bg-white/10 p-2 rounded-full border border-white/20 backdrop-blur-md text-white hover:bg-white/20 transition">
              <Eye size={16} />
            </button>
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
        </div>

        {/* Product Info */}
        <div className="relative z-20 p-5">
          <h3 className="text-xl font-serif font-semibold text-white truncate">{product.name}</h3>
          <p className="text-sm text-neutral-300 mb-4">{product.category}</p>

          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gold-400 tracking-tight">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
            <button
              onClick={handleAddToCart}
              className="rounded-full p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingBag size={18} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard
