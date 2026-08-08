import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Package, CheckCircle, Timer, Truck } from 'lucide-react'

const OrderHistoryDialog = ({ open, onOpenChange, orders, getUserOrders }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl bg-[#F6F2EE] border-none rounded-[22px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-[#2B1E1A]">My Orders</DialogTitle>
          <DialogDescription className="text-[#7A655D]">
            Track your order history
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          {getUserOrders().length === 0 ? (
            <div className="py-12 text-center">
              <Package className="mx-auto text-[#7A655D] mb-4" size={48} />
              <p className="text-[#7A655D]">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {getUserOrders().map((order) => (
                <div key={order.id} className="bg-white rounded-xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-[#2B1E1A]">Order #{order.orderNumber || order.id}</h4>
                      <p className="text-sm text-[#7A655D]">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-[#2B1E1A]">
                        ₹{order.total.toLocaleString()}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-[#E46A53]">
                        {order.status === 'confirmed' && <CheckCircle size={14} />}
                        {order.status === 'processing' && <Timer size={14} />}
                        {order.status === 'shipped' && <Truck size={14} />}
                        {order.status === 'delivered' && <CheckCircle size={14} />}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-3">
                    <div className="text-sm text-[#7A655D] mb-2">Items:</div>
                    <div className="space-y-1">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-[#7A655D]">{item.name} x{item.quantity}</span>
                          <span className="text-[#2B1E1A]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Tracking */}
                  <div className="border-t border-[#E9E3DD] pt-3">
                    <div className="text-sm text-[#7A655D] mb-2">Tracking:</div>
                    <div className="space-y-2">
                      {order.tracking.map((step, index) => (
                        <div key={step.status} className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            step.timestamp ? 'bg-[#E46A53]' : 'bg-[#E9E3DD]'
                          }`}>
                            {step.timestamp && <CheckCircle size={12} className="text-white" />}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-[#2B1E1A]">{step.message}</div>
                            {step.timestamp && (
                              <div className="text-xs text-[#7A655D]">
                                {new Date(step.timestamp).toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Estimated Delivery */}
                  <div className="mt-3 text-sm text-[#7A655D]">
                    Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default OrderHistoryDialog
