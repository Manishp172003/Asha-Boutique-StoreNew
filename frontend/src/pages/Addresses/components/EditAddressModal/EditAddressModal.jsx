import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useApp } from '../../../../context/AppContext';
import '../AddAddressModal/AddressModal.css';

const EditAddressModal = ({ address, open, onOpenChange }) => {
  const { updateAddress } = useApp();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    houseFlat: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    addressType: 'Home'
  });

  useEffect(() => {
    if (address) {
      setFormData({
        fullName: address.fullName || '',
        phone: address.phone || '',
        houseFlat: address.houseFlat || '',
        street: address.street || '',
        city: address.city || '',
        state: address.state || '',
        pincode: address.pincode || '',
        country: address.country || 'India',
        addressType: address.addressType || 'Home'
      });
    }
  }, [address]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.phone || !formData.houseFlat || 
        !formData.street || !formData.city || !formData.state || !formData.pincode) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    if (formData.pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }

    updateAddress(address.id, formData);
    toast.success('Address updated successfully');
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="address-modal-overlay">
      <div className="address-modal">
        <div className="address-modal__header">
          <h2 className="address-modal__title">Edit Address</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="address-modal__close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="address-modal__form">
          <div className="address-modal__field">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="address-modal__field">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              required
              maxLength={10}
            />
          </div>

          <div className="address-modal__field">
            <Label htmlFor="houseFlat">House/Flat No. *</Label>
            <Input
              id="houseFlat"
              name="houseFlat"
              value={formData.houseFlat}
              onChange={handleChange}
              placeholder="123, Apt 4B"
              required
            />
          </div>

          <div className="address-modal__field">
            <Label htmlFor="street">Street *</Label>
            <Input
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="Main Street"
              required
            />
          </div>

          <div className="address-modal__row">
            <div className="address-modal__field">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Mumbai"
                required
              />
            </div>

            <div className="address-modal__field">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Maharashtra"
                required
              />
            </div>
          </div>

          <div className="address-modal__row">
            <div className="address-modal__field">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                name="pincode"
                type="text"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="400001"
                required
                maxLength={6}
              />
            </div>

            <div className="address-modal__field">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="address-modal__field">
            <Label htmlFor="addressType">Address Type</Label>
            <select
              id="addressType"
              name="addressType"
              value={formData.addressType}
              onChange={handleChange}
              className="address-modal__select"
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="address-modal__actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="address-modal__button address-modal__button--cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="address-modal__button address-modal__button--submit"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAddressModal;
