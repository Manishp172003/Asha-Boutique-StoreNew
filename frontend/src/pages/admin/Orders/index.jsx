import { useState, useEffect } from 'react';
import { ListFilter, Download, Eye, RefreshCw, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import './Orders.css';
import AdminSidebar from '../../../components/admin/Sidebar/AdminSidebar';
import AdminTopNav from '../../../components/admin/TopNav/AdminTopNav';
import StatusBadge from '../../../components/admin/StatusBadge/StatusBadge';
import AdminButton from '../../../components/admin/Button/AdminButton';
import EmptyState from '../../../components/EmptyState/EmptyState';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllOrdersAdmin, updateOrderStatus, updateOrderPaymentStatus } from '../../../services/orderService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [statusVal, setStatusVal] = useState('');
  const [paymentStatusVal, setPaymentStatusVal] = useState('');

  const filterOptions = ['All Orders', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const [activeFilter, setActiveFilter] = useState('All Orders');

  const fetchOrdersData = async () => {
    setLoading(true);
    try {
      const data = await getAllOrdersAdmin();
      setOrders(data);
    } catch (err) {
      toast.error("Failed to load customer orders");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      toast.error("No orders available to export.");
      return;
    }

    const headers = ["Order ID", "Customer Name", "Customer Email", "Date", "Shipment Status", "Payment Status", "Total (INR)"];
    const rows = filteredOrders.map(o => {
      const orderDate = new Date(o.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      return [
        o.id,
        `"${(o.user?.name || 'Customer').replace(/"/g, '""')}"`,
        o.user?.email || 'N/A',
        `"${orderDate}"`,
        o.status || 'PENDING',
        o.paymentStatus || 'PENDING',
        o.totalPrice
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Asha_Boutique_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Orders ledger exported to CSV successfully!");
  };

  useEffect(() => {
    fetchOrdersData();
  }, []);

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setStatusVal(order.status || 'PENDING');
    setPaymentStatusVal(order.paymentStatus || 'PENDING');
    setDetailsOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    const loadToast = toast.loading("Updating shipment status...");
    try {
      await updateOrderStatus(selectedOrder.id, statusVal);
      toast.dismiss(loadToast);
      toast.success("Order status updated successfully!");
      fetchOrdersData();
      setDetailsOpen(false);
    } catch (err) {
      toast.dismiss(loadToast);
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleUpdatePayment = async () => {
    if (!selectedOrder) return;
    const loadToast = toast.loading("Updating payment status...");
    try {
      await updateOrderPaymentStatus(selectedOrder.id, paymentStatusVal, selectedOrder.paymentId || 'TXN-ADMIN');
      toast.dismiss(loadToast);
      toast.success("Order payment status updated successfully!");
      fetchOrdersData();
      setDetailsOpen(false);
    } catch (err) {
      toast.dismiss(loadToast);
      toast.error(err.message || "Failed to update payment");
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'All Orders') return true;
    return order.status?.toUpperCase() === activeFilter.toUpperCase();
  });

  const getInitials = (name) => {
    if (!name) return 'CS';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getItemsCount = (order) => {
    return order.items ? order.items.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;
  };

  const formatPrice = (price) => {
    return `₹${(price || 0).toLocaleString('en-IN')}`;
  };

  return (
    <div className="admin-page">
      <AdminSidebar />
      <AdminTopNav />
      
      <main className="admin-main">
        {/* Header */}
        <div className="admin-page-header" style={{ marginBottom: "20px" }}>
          <div className="admin-page-header__content">
            <nav className="admin-breadcrumb">
              <span>Dashboard</span>
              <span>/</span>
              <span className="admin-breadcrumb__active">Orders</span>
            </nav>
            <h2 className="admin-page-header__title">Customer Orders Ledger</h2>
            <p className="admin-page-header__description">
              Verify client receipts, update shipment statuses, check billing references, and track delivery workflows.
            </p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="admin-orders-header">
          <div className="admin-orders-filters">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                className={`admin-filter-chip ${activeFilter === filter ? 'admin-filter-chip--active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="admin-orders-actions">
            <AdminButton variant="outline" icon={<RefreshCw size={18} />} onClick={fetchOrdersData}>
              Refresh
            </AdminButton>
            <AdminButton variant="outline" icon={<Download size={18} />} onClick={handleExportCSV}>
              Export
            </AdminButton>
          </div>
        </div>

        {/* Orders Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Total</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-[#7A655D]">Loading orders history...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <EmptyState
                      icon={XCircle}
                      title="No Orders Found"
                      description="Customer orders placed in the boutique will be shown here."
                    />
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, index) => {
                  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });
                  return (
                    <tr key={order.id || index} className="admin-table__row">
                      <td>
                        <span className="admin-table__order-id">#{order.orderNumber || `AB-${order.id}`}</span>
                      </td>
                      <td>
                        <div className="customer-cell">
                          <div className="customer-avatar bg-[#E9E3DD] text-[#2B1E1A] font-medium">
                            {getInitials(order.user?.name)}
                          </div>
                          <div className="customer-info">
                            <div className="customer-name">{order.user?.name || 'Customer'}</div>
                            <div className="customer-email">{order.user?.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td>{orderDate}</td>
                      <td>
                        <StatusBadge status={order.status} />
                      </td>
                      <td>
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                          order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.paymentStatus || 'PENDING'}
                        </span>
                      </td>
                      <td className="admin-table__total">{formatPrice(order.totalPrice)}</td>
                      <td className="text-right">
                        <div className="admin-table__actions">
                          <button className="admin-table__action-btn" onClick={() => handleOpenDetails(order)}>
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Order Details & Operations Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-2xl bg-[#F6F2EE] border-none rounded-[22px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-[#2B1E1A]">
              Order Details (#AB-{selectedOrder?.id})
            </DialogTitle>
            <DialogDescription className="text-[#7A655D]">
              Review products, shipping details, and modify status settings.
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 mt-4">
              {/* Order Status Controls */}
              <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-[#E9E3DD]">
                <div className="space-y-2">
                  <Label className="text-[#2B1E1A] font-medium text-sm">Shipment Status</Label>
                  <div className="flex gap-2">
                    <Select onValueChange={setStatusVal} value={statusVal}>
                      <SelectTrigger className="bg-white border-[#E9E3DD] rounded-xl flex-1">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PROCESSING">Processing</SelectItem>
                        <SelectItem value="SHIPPED">Shipped</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <AdminButton variant="primary" className="py-2 px-4 text-xs h-[40px] rounded-xl" onClick={handleUpdateStatus}>
                      Save
                    </AdminButton>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#2B1E1A] font-medium text-sm">Payment Status</Label>
                  <div className="flex gap-2">
                    <Select onValueChange={setPaymentStatusVal} value={paymentStatusVal}>
                      <SelectTrigger className="bg-white border-[#E9E3DD] rounded-xl flex-1">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PAID">Paid</SelectItem>
                        <SelectItem value="FAILED">Failed</SelectItem>
                        <SelectItem value="REFUNDED">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                    <AdminButton variant="primary" className="py-2 px-4 text-xs h-[40px] rounded-xl" onClick={handleUpdatePayment}>
                      Save
                    </AdminButton>
                  </div>
                </div>
              </div>

              {/* Customer and Shipping Details */}
              <div className="bg-white p-4 rounded-xl border border-[#E9E3DD] space-y-2">
                <h4 className="text-sm font-semibold text-[#2B1E1A]">Shipping & Customer Details</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-[#7A655D]">
                  <div>
                    <span className="font-medium text-[#2B1E1A]">Name:</span> {selectedOrder.user?.name || 'Customer'}
                  </div>
                  <div>
                    <span className="font-medium text-[#2B1E1A]">Email:</span> {selectedOrder.user?.email || 'N/A'}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-[#2B1E1A]">Address:</span> {selectedOrder.shippingAddress || 'No Address Provided'}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-white p-4 rounded-xl border border-[#E9E3DD]">
                <h4 className="text-sm font-semibold text-[#2B1E1A] mb-3">Order Items ({getItemsCount(selectedOrder)})</h4>
                <div className="divide-y divide-[#E9E3DD]">
                  {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                    <div key={item.id || idx} className="py-3 flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-[50px] h-[50px] rounded-lg overflow-hidden border border-[#E9E3DD] bg-gray-50 flex-shrink-0">
                          <img src={item.product?.imageUrl && item.product.imageUrl.includes(',') ? item.product.imageUrl.split(',')[0] : (item.product?.imageUrl || '/images/product1.jpg')} alt={item.product?.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h5 className="font-medium text-[#2B1E1A]">{item.product?.name}</h5>
                          <p className="text-xs text-[#7A655D]">Qty: {item.quantity} | Size: {item.size || 'S'} x {formatPrice(item.price)}</p>
                        </div>
                      </div>
                      <span className="font-medium text-[#2B1E1A]">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-[#E9E3DD] flex justify-between items-center font-semibold text-lg text-[#2B1E1A]">
                  <span>Total Amount</span>
                  <span>{formatPrice(selectedOrder.totalPrice)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
