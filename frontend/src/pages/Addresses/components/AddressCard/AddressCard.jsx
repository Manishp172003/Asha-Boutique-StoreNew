import { useState } from 'react';
import { MapPin, Edit2, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../../../../context/AppContext';
import EditAddressModal from '../EditAddressModal/EditAddressModal';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import './AddressCard.css';

const AddressCard = ({ address }) => {
  const { setDefaultAddress } = useApp();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSetDefault = () => {
    if (!address.isDefault) {
      setDefaultAddress(address.id);
      toast.success('Default address updated');
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  return (
    <>
      <div className="address-card">
        {address.isDefault && (
          <div className="address-card__default-badge">
            <Star size={14} />
            <span>Default</span>
          </div>
        )}
        
        <div className="address-card__content">
          <div className="address-card__icon">
            <MapPin size={20} color="#E46A53" />
          </div>
          
          <div className="address-card__details">
            <h3 className="address-card__name">{address.fullName}</h3>
            <p className="address-card__phone">{address.phone}</p>
            <p className="address-card__address">
              {address.houseFlat}, {address.street}<br />
              {address.city}, {address.state} - {address.pincode}<br />
              {address.country}
            </p>
            <span className="address-card__type">{address.addressType}</span>
          </div>
        </div>

        <div className="address-card__actions">
          {!address.isDefault && (
            <button
              onClick={handleSetDefault}
              className="address-card__action address-card__action--default"
            >
              Set as Default
            </button>
          )}
          <button
            onClick={handleEdit}
            className="address-card__action address-card__action--edit"
          >
            <Edit2 size={16} />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="address-card__action address-card__action--delete"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {showEditModal && (
        <EditAddressModal
          address={address}
          open={showEditModal}
          onOpenChange={setShowEditModal}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          address={address}
          open={showDeleteModal}
          onOpenChange={setShowDeleteModal}
        />
      )}
    </>
  );
};

export default AddressCard;

