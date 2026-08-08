import { useApp } from '../../../../context/AppContext';
import AddressCard from '../AddressCard/AddressCard';
import EmptyAddressState from '../EmptyAddressState/EmptyAddressState';
import './AddressList.css';

const AddressList = () => {
  const { addresses } = useApp();

  if (addresses.length === 0) {
    return <EmptyAddressState />;
  }

  return (
    <div className="address-list">
      {addresses.map((address) => (
        <AddressCard key={address.id} address={address} />
      ))}
    </div>
  );
};

export default AddressList;
