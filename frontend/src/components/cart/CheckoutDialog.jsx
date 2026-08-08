import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Truck, CreditCard } from 'lucide-react'

const CheckoutDialog = ({ open, onOpenChange, cart, cartTotal, shippingInfo, paymentMethod, onShippingInfoChange, onPaymentMethodChange, onPlaceOrder }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-[#F6F2EE] border-none rounded-[22px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-[#2B1E1A]">Checkout</DialogTitle>
          <DialogDescription className="text-[#7A655D]">
            Complete your order details
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-xl p-4">
            <h3 className="font-serif text-lg text-[#2B1E1A] mb-3">Order Summary</h3>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-[#7A655D]">{item.name} x{item.quantity}</span>
                  <span className="text-[#2B1E1A]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div className="border-t border-[#E9E3DD] pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-[#2B1E1A]">Total</span>
                  <span className="text-[#2B1E1A] text-lg">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-xl p-4">
            <h3 className="font-serif text-lg text-[#2B1E1A] mb-3">Shipping Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-[#2B1E1A]">Full Name</Label>
                <Input
                  id="name"
                  value={shippingInfo.name}
                  onChange={(e) => onShippingInfoChange({ ...shippingInfo, name: e.target.value })}
                  className="bg-white border-[#E9E3DD] rounded-xl"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-[#2B1E1A]">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={shippingInfo.email}
                  onChange={(e) => onShippingInfoChange({ ...shippingInfo, email: e.target.value })}
                  className="bg-white border-[#E9E3DD] rounded-xl"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-[#2B1E1A]">Phone</Label>
                <Input
                  id="phone"
                  value={shippingInfo.phone}
                  onChange={(e) => onShippingInfoChange({ ...shippingInfo, phone: e.target.value })}
                  className="bg-white border-[#E9E3DD] rounded-xl"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <Label htmlFor="pincode" className="text-[#2B1E1A]">Pincode</Label>
                <Input
                  id="pincode"
                  value={shippingInfo.pincode}
                  onChange={(e) => onShippingInfoChange({ ...shippingInfo, pincode: e.target.value })}
                  className="bg-white border-[#E9E3DD] rounded-xl"
                  placeholder="400001"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address" className="text-[#2B1E1A]">Address</Label>
                <Textarea
                  id="address"
                  value={shippingInfo.address}
                  onChange={(e) => onShippingInfoChange({ ...shippingInfo, address: e.target.value })}
                  className="bg-white border-[#E9E3DD] rounded-xl"
                  placeholder="123, Main Street, Area Name"
                />
              </div>
              <div>
                <Label htmlFor="city" className="text-[#2B1E1A]">City</Label>
                <Input
                  id="city"
                  value={shippingInfo.city}
                  onChange={(e) => onShippingInfoChange({ ...shippingInfo, city: e.target.value })}
                  className="bg-white border-[#E9E3DD] rounded-xl"
                  placeholder="Mumbai"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-[#2B1E1A]">State</Label>
                <Input
                  id="state"
                  value={shippingInfo.state}
                  onChange={(e) => onShippingInfoChange({ ...shippingInfo, state: e.target.value })}
                  className="bg-white border-[#E9E3DD] rounded-xl"
                  placeholder="Maharashtra"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl p-4">
            <h3 className="font-serif text-lg text-[#2B1E1A] mb-3">Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => onPaymentMethodChange(e.target.value)}
                  className="text-[#E46A53]"
                />
                <div className="flex items-center gap-2">
                  <Truck size={20} className="text-[#E46A53]" />
                  <span className="text-[#2B1E1A]">Cash on Delivery</span>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => onPaymentMethodChange(e.target.value)}
                  className="text-[#E46A53]"
                />
                <div className="flex items-center gap-2">
                  <CreditCard size={20} className="text-[#E46A53]" />
                  <span className="text-[#2B1E1A]">Credit/Debit Card</span>
                </div>
              </label>
            </div>
          </div>

          {/* Place Order Button */}
          <Button
            onClick={onPlaceOrder}
            className="w-full bg-[#E46A53] hover:bg-[#d55a43] text-white rounded-full py-6"
          >
            Place Order • ₹{cartTotal.toLocaleString()}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CheckoutDialog
