import { useState, useEffect } from 'react';
import { Sparkles, Calendar, Calendar as CalendarIcon, Check, X, RefreshCw } from 'lucide-react';
import './Appointments.css';
import AdminSidebar from '../../../components/admin/Sidebar/AdminSidebar';
import AdminTopNav from '../../../components/admin/TopNav/AdminTopNav';
import AdminButton from '../../../components/admin/Button/AdminButton';
import EmptyState from '../../../components/EmptyState/EmptyState';
import { getAllBookingsAdmin, updateBookingStatus } from '../../../services/bookingService';
import { toast } from 'sonner';

const Appointments = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All Services');

  const fetchBookingsData = async () => {
    setLoading(true);
    try {
      const data = await getAllBookingsAdmin();
      setBookings(data);
    } catch (err) {
      toast.error("Failed to load salon bookings scheduler");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingsData();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    const actionMsg = newStatus === 'CONFIRMED' ? 'Confirming booking...' : 'Cancelling booking...';
    const actionToast = toast.loading(actionMsg);
    try {
      await updateBookingStatus(id, newStatus);
      toast.dismiss(actionToast);
      toast.success(`Booking ${newStatus.toLowerCase()} successfully!`);
      fetchBookingsData();
    } catch (err) {
      toast.dismiss(actionToast);
      toast.error(err.message || "Failed to update booking status");
    }
  };

  // Filter calculations
  const filteredBookings = bookings.filter(b => {
    if (activeFilter === 'All Services') return true;
    return b.serviceType?.toUpperCase() === activeFilter.toUpperCase();
  });

  const activeApts = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING' || b.status === 'SCHEDULED');
  const pendingAptsCount = bookings.filter(b => b.status === 'PENDING').length;

  const getServiceColor = (service) => {
    const serviceMap = {
      'BRIDAL CONSULT': 'bg-primary-fixed text-primary-fixed-on',
      'SILK FITTING': 'bg-secondary-fixed text-secondary-fixed-on',
      'FABRIC SELECTION': 'bg-tertiary-fixed text-tertiary-fixed-on',
    };
    return serviceMap[service?.toUpperCase()] || 'bg-surface-container-highest text-on-surface-variant';
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'CONFIRMED': 'text-green-600 bg-green-50 px-2 py-0.5 rounded-md',
      'PENDING': 'text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-md',
      'COMPLETED': 'text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md',
      'CANCELLED': 'text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md',
    };
    return statusMap[status?.toUpperCase()] || 'text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md';
  };

  return (
    <div className="admin-page">
      <AdminSidebar />
      <AdminTopNav />
      
      <main className="admin-main">
        {/* Stats Summary */}
        <div className="appointments-stats">
          <div className="appointments-stats__main">
            <div className="appointments-stats__content">
              <span className="appointments-stats__label">Upcoming Ledger</span>
              <h2 className="appointments-stats__value">
                {activeApts.length} <span className="appointments-stats__sub">Active Bookings</span>
              </h2>
              <p className="appointments-stats__description">{pendingAptsCount} pending review approvals</p>
            </div>
            <div className="appointments-stats__icon">
              <Sparkles size={48} />
            </div>
          </div>
          <div className="appointments-stats__next">
            <div className="appointments-stats__next-content">
              <h3 className="appointments-stats__next-title">Total Bookings</h3>
              <p className="appointments-stats__next-time">{bookings.length} reservations recorded</p>
            </div>
            <AdminButton variant="secondary" size="sm" icon={<RefreshCw size={14} />} onClick={fetchBookingsData}>
              Sync Scheduler
            </AdminButton>
            <div className="appointments-stats__next-bg">
              <Calendar size={160} />
            </div>
          </div>
        </div>

        {/* Appointment List */}
        <div className="appointments-list-container">
          <div className="appointments-list-header">
            <div className="appointments-view-toggle">
              <button className="appointments-view-btn appointments-view-btn--active">
                List View
              </button>
            </div>
            <div className="appointments-filters">
              <span className="appointments-filters__label">Filter by:</span>
              <select 
                className="appointments-filters__select"
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
              >
                <option>All Services</option>
                <option>Bridal Consult</option>
                <option>Silk Fitting</option>
                <option>Fabric Selection</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="appointments-table-container">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Service</th>
                  <th>Date/Time</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-[#7A655D]">Loading appointments calendar...</td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <EmptyState
                        icon={Calendar}
                        title="No Bookings Found"
                        description="Boutique consultations and fittings will show up here."
                      />
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((apt, index) => {
                    const clientInitials = apt.name ? apt.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'CS';
                    const bookingDate = new Date(apt.preferredDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                    return (
                      <tr key={apt.id || index} className="appointments-table__row">
                        <td>
                          <div className="appointment-client">
                            <div className="appointment-client__avatar text-center flex items-center justify-center bg-[#E9E3DD] text-[#2B1E1A] font-semibold text-xs">
                              {clientInitials}
                            </div>
                            <div className="appointment-client__info">
                              <p className="appointment-client__name">{apt.name}</p>
                              <p className="appointment-client__email">{apt.email || 'No Email'}</p>
                              <p className="appointment-client__phone text-xs text-gray-400">{apt.phone || 'No Phone'}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`appointment-service ${getServiceColor(apt.serviceType)}`}>
                            {apt.serviceType || 'Fitting'}
                          </span>
                        </td>
                        <td>
                          <p className="appointment-date">{bookingDate}</p>
                          <p className="appointment-time text-xs text-gray-500">{apt.preferredTime}</p>
                        </td>
                        <td>
                          <div className="appointment-status">
                            <span className={`appointment-status__dot ${apt.status === 'PENDING' ? 'animate-pulse bg-yellow-500' : 'bg-green-500'}`}></span>
                            <span className={`appointment-status__text ${getStatusColor(apt.status)}`}>
                              {apt.status}
                            </span>
                          </div>
                        </td>
                        <td className="text-right">
                          <div className="flex gap-2 justify-end">
                            {(apt.status === 'PENDING' || apt.status === 'SCHEDULED') && (
                              <button 
                                className="p-2 rounded-full hover:bg-green-50 text-green-600 transition-colors" 
                                title="Confirm Appointment"
                                onClick={() => handleStatusUpdate(apt.id, 'CONFIRMED')}
                              >
                                <Check size={18} />
                              </button>
                            )}
                            {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                              <button 
                                className="p-2 rounded-full hover:bg-red-50 text-red-600 transition-colors" 
                                title="Cancel Appointment"
                                onClick={() => handleStatusUpdate(apt.id, 'CANCELLED')}
                              >
                                <X size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Appointments;
