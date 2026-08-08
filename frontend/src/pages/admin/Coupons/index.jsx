import { useState, useEffect } from 'react';
import { Ticket, Percent, Sparkles, Trash2, Calendar, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { getAllCouponsAdmin, createCouponAdmin, deleteCouponAdmin } from '../../../services/couponService';
import AdminSidebar from '../../../components/admin/Sidebar/AdminSidebar';
import AdminTopNav from '../../../components/admin/TopNav/AdminTopNav';
import AdminButton from '../../../components/admin/Button/AdminButton';
import EmptyState from '../../../components/EmptyState/EmptyState';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import './Coupons.css';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await getAllCouponsAdmin();
      setCoupons(data);
    } catch (err) {
      toast.error(err.message || "Failed to load coupons list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!code || !discountValue) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Creating coupon...");
    try {
      await createCouponAdmin({
        code: code.toUpperCase().trim(),
        discountType,
        discountValue: parseFloat(discountValue),
        minAmount: minAmount ? parseFloat(minAmount) : 0.0,
        expiryDate: expiryDate || null,
        active: true
      });
      toast.dismiss(toastId);
      toast.success("Coupon code created successfully!");
      setModalOpen(false);
      // Reset form
      setCode('');
      setDiscountType('PERCENTAGE');
      setDiscountValue('');
      setMinAmount('');
      setExpiryDate('');
      fetchCoupons();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message || "Failed to create coupon code");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete and revoke coupon ${code}?`)) return;
    const toastId = toast.loading(`Deleting coupon ${code}...`);
    try {
      await deleteCouponAdmin(id);
      toast.dismiss(toastId);
      toast.success(`Coupon ${code} deleted successfully`);
      fetchCoupons();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message || "Failed to delete coupon");
    }
  };

  // Helper check expiry
  const isExpired = (expiryStr) => {
    if (!expiryStr) return false;
    const expiry = new Date(expiryStr);
    expiry.setHours(23, 59, 59, 999);
    return expiry < new Date();
  };

  // Stats
  const activeCoupons = coupons.filter(c => c.active && !isExpired(c.expiryDate));
  const totalPercentage = coupons.filter(c => c.discountType === 'PERCENTAGE').length;
  const totalFixed = coupons.filter(c => c.discountType === 'FIXED').length;

  return (
    <div className="admin-page">
      <AdminSidebar />
      <AdminTopNav />

      <main className="admin-main">
        {/* Header */}
        <div className="coupons-header">
          <div>
            <h2 className="coupons-header__title">Coupons Manager</h2>
            <p className="text-sm text-[#7A655D]">Create and manage promotional discount codes for clients.</p>
          </div>
          <AdminButton
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => setModalOpen(true)}
          >
            Create Coupon
          </AdminButton>
        </div>

        {/* Stats Grid */}
        <div className="coupons-stats-grid">
          <div className="coupons-stat-card">
            <div>
              <span className="coupons-stat-card__label">Active Coupons</span>
              <h3 className="coupons-stat-card__value">{activeCoupons.length}</h3>
            </div>
            <div className="coupons-stat-card__icon">
              <Ticket size={24} />
            </div>
          </div>

          <div className="coupons-stat-card">
            <div>
              <span className="coupons-stat-card__label">Percentage Off</span>
              <h3 className="coupons-stat-card__value">{totalPercentage}</h3>
            </div>
            <div className="coupons-stat-card__icon">
              <Percent size={24} />
            </div>
          </div>

          <div className="coupons-stat-card">
            <div>
              <span className="coupons-stat-card__label">Flat Discount</span>
              <h3 className="coupons-stat-card__value">{totalFixed}</h3>
            </div>
            <div className="coupons-stat-card__icon">
              <Sparkles size={24} />
            </div>
          </div>
        </div>

        {/* Table List */}
        <div className="coupons-table-container">
          {loading ? (
            <div className="text-center py-12 text-[#7A655D]">Loading coupons catalog...</div>
          ) : coupons.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={Ticket}
                title="No Coupons Yet"
                description="Create custom coupon codes (e.g. WELCOME10 or FESTIVE500) to reward your shoppers."
              />
            </div>
          ) : (
            <table className="coupons-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Min Order</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => {
                  const expired = isExpired(coupon.expiryDate);
                  return (
                    <tr key={coupon.id}>
                      <td>
                        <span className="coupon-code-badge">{coupon.code}</span>
                      </td>
                      <td>
                        <span className={`coupon-discount-badge ${
                          coupon.discountType === 'PERCENTAGE' 
                            ? 'coupon-discount-badge--percentage' 
                            : 'coupon-discount-badge--fixed'
                        }`}>
                          {coupon.discountType === 'PERCENTAGE' 
                            ? `${coupon.discountValue}% Off` 
                            : `₹${coupon.discountValue} Off`
                          }
                        </span>
                      </td>
                      <td>₹{coupon.minAmount.toLocaleString('en-IN')}</td>
                      <td>
                        {coupon.expiryDate ? (
                          <span className="flex items-center gap-1.5 text-xs text-[#7A655D]">
                            <Calendar size={14} />
                            {coupon.expiryDate}
                          </span>
                        ) : (
                          <span className="text-xs text-[#7A655D]/40">No Expiry</span>
                        )}
                      </td>
                      <td>
                        {coupon.active && !expired ? (
                          <span className="coupon-status-badge coupon-status-badge--active">Active</span>
                        ) : (
                          <span className="coupon-status-badge coupon-status-badge--expired">
                            {expired ? 'Expired' : 'Inactive'}
                          </span>
                        )}
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                          className="coupon-delete-btn"
                          title="Delete Coupon"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Create Dialog Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#F6F2EE] border-none rounded-[22px]">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-[#2B1E1A]">Create Promo Coupon</DialogTitle>
            <DialogDescription className="text-[#7A655D]">
              Configure custom coupon codes, specify min order criteria, and schedule expiry dates.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCoupon} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-[#2B1E1A]">Coupon Code</Label>
              <Input
                id="code"
                placeholder="e.g. WELCOME10"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="bg-white border-[#E9E3DD] rounded-xl uppercase font-mono tracking-wider"
                required
              />
            </div>

            <div className="coupon-form-grid">
              <div className="space-y-2">
                <Label htmlFor="discountType" className="text-[#2B1E1A]">Discount Type</Label>
                <Select onValueChange={setDiscountType} value={discountType}>
                  <SelectTrigger className="bg-white border-[#E9E3DD] rounded-xl">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                    <SelectItem value="FIXED">Fixed Amount (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountValue" className="text-[#2B1E1A]">
                  {discountType === 'PERCENTAGE' ? 'Discount Percentage (%)' : 'Discount Amount (₹)'}
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  placeholder={discountType === 'PERCENTAGE' ? 'e.g. 10' : 'e.g. 500'}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="bg-white border-[#E9E3DD] rounded-xl"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="coupon-form-grid">
              <div className="space-y-2">
                <Label htmlFor="minAmount" className="text-[#2B1E1A]">Min Order Amount (₹)</Label>
                <Input
                  id="minAmount"
                  type="number"
                  placeholder="e.g. 1000"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  className="bg-white border-[#E9E3DD] rounded-xl"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate" className="text-[#2B1E1A]">Expiry Date (Optional)</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="bg-white border-[#E9E3DD] rounded-xl"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#E46A53] hover:bg-[#d55a43] text-white rounded-full py-6 font-serif text-lg mt-2 transition-all"
            >
              Publish Coupon Code
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Coupons;
