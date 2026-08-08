import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useApp } from '../../../../context/AppContext';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ address, open, onOpenChange }) => {
  const { deleteAddress } = useApp();

  const handleDelete = () => {
    deleteAddress(address.id);
    toast.success('Address deleted successfully');
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <div className="delete-modal__icon">
          <AlertTriangle size={48} color="#E46A53" />
        </div>
        
        <h2 className="delete-modal__title">Delete Address?</h2>
        
        <p className="delete-modal__message">
          Are you sure you want to delete this address? This action cannot be undone.
        </p>

        <div className="delete-modal__address-preview">
          <strong>{address.fullName}</strong>
          <p>{address.houseFlat}, {address.street}</p>
          <p>{address.city}, {address.state} - {address.pincode}</p>
        </div>

        <div className="delete-modal__actions">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="delete-modal__button delete-modal__button--cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            className="delete-modal__button delete-modal__button--delete"
          >
            Delete Address
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
