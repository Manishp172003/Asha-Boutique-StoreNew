import { Plus } from 'lucide-react';
import './AddressHeader.css';

const AddressHeader = ({ onAddClick, hasAddresses }) => {
  return (
    <div className="address-header">
      <div>
        <h1 className="address-header__title">My Addresses</h1>
        <p className="address-header__subtitle">Manage your delivery addresses</p>
      </div>
      {hasAddresses && (
        <button className="address-header__add-button" onClick={onAddClick}>
          <Plus size={16} />
          <span>Add Address</span>
        </button>
      )}
    </div>
  );
};

export default AddressHeader;
