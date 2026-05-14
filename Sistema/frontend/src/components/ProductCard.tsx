import React from 'react'
import { Product } from '@app-types/index'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <button
      onClick={() => onAddToCart(product)}
      disabled={!product.available}
      className={`flex flex-col rounded-lg overflow-hidden transition-all hover:scale-105 ${
        product.available
          ? 'bg-dark-card border border-dark-border hover:border-neon-purple hover:shadow-glow cursor-pointer'
          : 'opacity-50 cursor-not-allowed bg-dark-card border border-dark-border'
      }`}
    >
      {/* Imagen placeholder */}
      <div className="w-full aspect-square bg-gradient-to-br from-dark-border to-dark-bg flex items-center justify-center text-4xl">
        {product.name.charAt(0)}
      </div>

      {/* Contenido */}
      <div className="p-3 flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-white line-clamp-2">{product.name}</h3>
        <p className="text-xs text-gray-400">{product.description}</p>
        <div className="flex items-center justify-between pt-2 border-t border-dark-border">
          <span className="text-lg font-bold text-neon-purple">S/ {product.price.toFixed(2)}</span>
          {product.available ? (
            <button className="bg-neon-purple text-black px-3 py-1 rounded text-xs font-bold hover:bg-neon-pink transition-colors">
              +
            </button>
          ) : (
            <span className="text-xs text-gray-500">No disponible</span>
          )}
        </div>
      </div>
    </button>
  )
}
