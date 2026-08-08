import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'
import LazyImage from '../common/LazyImage'

const ProductPreviewDialog = ({ open, onOpenChange, product, onAddToCart, onBuyNow, trendingRef }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-[#F6F2EE] border-none rounded-[22px] max-h-[92vh] overflow-y-auto p-4 md:p-6">
        {product && (
          <div className="grid gap-6 md:grid-cols-[0.95fr_1.05fr]">
            <div className="overflow-hidden rounded-[18px] bg-[#E9E3DD]">
              <LazyImage
                src={product.image}
                alt={product.name}
                loading="eager"
              />
            </div>

            <div className="flex flex-col">
              <DialogHeader className="pr-8">
                <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-[#E46A53]">
                  {product.category}
                </div>
                <DialogTitle className="font-serif text-3xl md:text-4xl leading-tight text-[#2B1E1A]">
                  {product.name}
                </DialogTitle>
                <DialogDescription className="text-base leading-7 text-[#7A655D]">
                  {product.description}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-5 flex items-center justify-between border-y border-[#E9E3DD] py-4">
                <span className="text-2xl font-semibold text-[#2B1E1A]">{product.price}</span>
                <span className="rounded-full bg-white px-4 py-2 text-sm text-[#2B1E1A]">
                  {product.stock} in stock
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ['Fabric', product.fabric],
                  ['Fit', product.fit],
                  ['Care', product.care],
                  ['Delivery', product.delivery],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-white p-4">
                    <div className="text-xs font-medium uppercase tracking-[0.14em] text-[#A08B82]">{label}</div>
                    <div className="mt-2 text-sm leading-6 text-[#2B1E1A]">{value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-white p-4">
                <h4 className="font-serif text-lg text-[#2B1E1A]">Boutique note</h4>
                <p className="mt-2 text-sm leading-6 text-[#7A655D]">
                  Need a small adjustment? Book a fitting after checkout and our atelier can help with length, waist, or sleeve refinements.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="primary"
                  onClick={() => {
                    onAddToCart(product)
                    onOpenChange(false)
                  }}
                  className="flex-1"
                >
                  <ShoppingBag className="mr-2" size={18} />
                  Add to Cart
                </Button>
                <Button
                  onClick={() => onBuyNow(product)}
                  className="flex-1 bg-[#2B1E1A] hover:bg-[#3a2923] text-white rounded-full py-6"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ProductPreviewDialog
