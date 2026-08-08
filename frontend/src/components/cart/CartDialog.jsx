import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ShoppingBag, X } from 'lucide-react'

const CartDialog = ({ open, onOpenChange, cart, cartTotal, onUpdateQuantity, onRemoveFromCart, onCheckout, onScrollToSection, trendingRef }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#F6F2EE] border-none rounded-[22px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-[#2B1E1A]">Your Cart</DialogTitle>
          <DialogDescription className="text-[#7A655D]">
            {cart.length === 0 ? 'Your cart is empty' : `${cart.length} item${cart.length > 1 ? 's' : ''} in your cart`}
          </DialogDescription>
        </DialogHeader>
        
        {cart.length === 0 ? (
          <div className="py-12 text-center">
            <ShoppingBag className="mx-auto text-[#7A655D] mb-4" size={48} />
            <p className="text-[#7A655D]">Your cart is empty</p>
            <Button 
              onClick={() => {
                onOpenChange(false)
                onScrollToSection(trendingRef)
              }}
              className="mt-4 bg-[#E46A53] hover:bg-[#d55a43] text-white rounded-full"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="mt-4">
            <div className="max-h-[60vh] overflow-y-auto space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-white rounded-xl">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-[#2B1E1A] text-sm">{item.name}</h4>
                    <p className="text-[#7A655D] text-sm">{item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-full bg-[#E9E3DD] hover:bg-[#d9d3cd] flex items-center justify-center text-[#2B1E1A]"
                      >
                        -
                      </button>
                      <span className="text-[#2B1E1A] font-medium">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-full bg-[#E9E3DD] hover:bg-[#d9d3cd] flex items-center justify-center text-[#2B1E1A]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveFromCart(item.id)}
                    className="text-[#7A655D] hover:text-[#E46A53] transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-[#E9E3DD]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[#2B1E1A] font-medium">Total</span>
                <span className="text-[#2B1E1A] font-semibold text-lg">₹{cartTotal.toLocaleString()}</span>
              </div>
              <Button 
                onClick={onCheckout}
                className="w-full bg-[#E46A53] hover:bg-[#d55a43] text-white rounded-full py-6"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CartDialog
