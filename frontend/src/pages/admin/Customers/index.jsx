import { useState, useEffect } from 'react';
import { Search, Download, RefreshCw, Users, Ban, Trash2, ShieldCheck, Mail, Calendar } from 'lucide-react';
import './Customers.css';
import AdminSidebar from '../../../components/admin/Sidebar/AdminSidebar';
import AdminTopNav from '../../../components/admin/TopNav/AdminTopNav';
import AdminButton from '../../../components/admin/Button/AdminButton';
import EmptyState from '../../../components/EmptyState/EmptyState';
import { getAllUsersAdmin, deleteUserAdmin, toggleUserBlockAdmin, updateUserRoleAdmin } from '../../../services/userService';
import { getAllSubscribersAdmin } from '../../../services/newsletterService';
import { useApp } from '../../../context/AppContext';
import { toast } from 'sonner';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewTab, setViewTab] = useState('customers'); // 'customers' or 'newsletter'
  const { user: currentUser } = useApp();

  const fetchCustomersData = async () => {
    setLoading(true);
    try {
      const data = await getAllUsersAdmin();
      setCustomers(data);
    } catch (err) {
      toast.error("Failed to load boutique customer directory");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscribersData = async () => {
    setLoading(true);
    try {
      const data = await getAllSubscribersAdmin();
      setSubscribers(data);
    } catch (err) {
      toast.error("Failed to load newsletter subscriber list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewTab === 'customers') {
      fetchCustomersData();
    } else {
      fetchSubscribersData();
    }
  }, [viewTab]);

  const getInitials = (name) => {
    if (!name) return 'CS';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleToggleBlock = async (id, isCurrentlyBlocked) => {
    const action = isCurrentlyBlocked ? "Unblocking" : "Blocking";
    const actionToast = toast.loading(`${action} customer account...`);
    try {
      await toggleUserBlockAdmin(id);
      toast.dismiss(actionToast);
      toast.success("Customer status updated successfully!");
      fetchCustomersData();
    } catch (err) {
      toast.dismiss(actionToast);
      toast.error(err.message || "Failed to update block status");
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this customer? This action is irreversible.")) return;
    const actionToast = toast.loading("Deleting customer account...");
    try {
      await deleteUserAdmin(id);
      toast.dismiss(actionToast);
      toast.success("Customer account deleted successfully!");
      fetchCustomersData();
    } catch (err) {
      toast.dismiss(actionToast);
      toast.error(err.message || "Failed to delete customer");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    const actionToast = toast.loading(`Updating customer role to ${newRole}...`);
    try {
      await updateUserRoleAdmin(id, newRole);
      toast.dismiss(actionToast);
      toast.success("User role updated successfully!");
      fetchCustomersData();
    } catch (err) {
      toast.dismiss(actionToast);
      toast.error(err.message || "Failed to update user role");
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (viewTab === 'customers') {
      if (filteredCustomers.length === 0) {
        toast.error("No customers found to export.");
        return;
      }
      const headers = ["User ID", "Name", "Email", "Phone", "Role", "Status"];
      const rows = filteredCustomers.map(c => [
        c.id,
        `"${(c.name || 'Customer').replace(/"/g, '""')}"`,
        c.email,
        c.phone || '',
        c.role || 'USER',
        c.blocked ? "BLOCKED" : "ACTIVE"
      ]);
      const csvContent = "data:text/csv;charset=utf-8,"
        + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      triggerDownload(csvContent, `Asha_Boutique_Customers_${new Date().toISOString().slice(0, 10)}.csv`);
    } else {
      if (filteredSubscribers.length === 0) {
        toast.error("No subscribers found to export.");
        return;
      }
      const headers = ["ID", "Email", "Subscribed At"];
      const rows = filteredSubscribers.map(s => [
        s.id,
        s.email,
        s.subscribedAt
      ]);
      const csvContent = "data:text/csv;charset=utf-8,"
        + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      triggerDownload(csvContent, `Asha_Boutique_Newsletter_Subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    }
  };

  const triggerDownload = (content, filename) => {
    const encodedUri = encodeURI(content);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("List exported successfully!");
  };

  // Filter based on search query
  const filteredCustomers = customers.filter(c => {
    const nameMatch = c.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = c.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || emailMatch;
  });

  const filteredSubscribers = subscribers.filter(s => {
    return s.email?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="admin-page">
      <AdminSidebar />
      <AdminTopNav />
      
      <main className="admin-main">
        {/* Header */}
        <div className="customers-header" style={{ marginBottom: "20px" }}>
          <div className="customers-header__left w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="customers-header__title font-serif text-3xl font-semibold text-[#2B1E1A]">Directory</h2>
              <p className="text-sm text-[#7A655D]">Manage registered boutique clients and newsletter subscribers.</p>
            </div>
            <div className="customers-header__search max-w-sm w-full">
              <Search className="customers-header__search-icon" size={20} />
              <input 
                type="text" 
                placeholder={viewTab === 'customers' ? "Search clients by name or email..." : "Search subscribers by email..."}
                className="customers-header__search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Sliding View Toggle Pills */}
        <div className="flex gap-2 mb-6 bg-white border border-[#E9E3DD] p-1.5 rounded-2xl max-w-sm">
          <button
            onClick={() => { setViewTab('customers'); setSearchQuery(''); }}
            className={`flex-1 flex items-center justify-center gap-2 text-xs font-semibold py-2.5 px-4 rounded-xl transition-all cursor-pointer ${
              viewTab === 'customers' 
                ? 'bg-[#2B1E1A] text-white shadow-sm' 
                : 'text-[#7A655D] hover:text-[#2B1E1A]'
            }`}
          >
            <Users size={16} />
            <span>Clients Directory</span>
          </button>
          <button
            onClick={() => { setViewTab('newsletter'); setSearchQuery(''); }}
            className={`flex-1 flex items-center justify-center gap-2 text-xs font-semibold py-2.5 px-4 rounded-xl transition-all cursor-pointer ${
              viewTab === 'newsletter' 
                ? 'bg-[#2B1E1A] text-white shadow-sm' 
                : 'text-[#7A655D] hover:text-[#2B1E1A]'
            }`}
          >
            <Mail size={16} />
            <span>Subscribers</span>
          </button>
        </div>

        {/* Table Header */}
        <div className="customers-table-header">
          <div className="customers-table-header__info">
            <span className="customers-table-header__label">
              {viewTab === 'customers' ? 'Client Registry' : 'Mailing List'}
            </span>
            <h3 className="customers-table-header__title">
              {viewTab === 'customers' 
                ? `Registered Clients (${customers.length})` 
                : `Active Subscribers (${subscribers.length})`
              }
            </h3>
          </div>
          <div className="customers-table-header__actions">
            <AdminButton 
              variant="outline" 
              icon={<RefreshCw size={18} />} 
              onClick={viewTab === 'customers' ? fetchCustomersData : fetchSubscribersData}
            >
              Refresh
            </AdminButton>
            <AdminButton variant="outline" icon={<Download size={18} />} onClick={handleExportCSV}>
              Export
            </AdminButton>
          </div>
        </div>

        {/* Conditional Tables Render */}
        <div className="customers-table-container">
          {viewTab === 'customers' ? (
            <table className="customers-table">
              <thead>
                <tr>
                  <th className="customers-table__th--profile">Client Profile</th>
                  <th className="customers-table__th--status">Role</th>
                  <th className="customers-table__th--phone">Phone Number</th>
                  <th className="customers-table__th--id">Status / ID</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-[#7A655D]">Loading customer directory...</td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <EmptyState
                        icon={Users}
                        title="No Customers Found"
                        description="Registered boutique accounts will be displayed here."
                      />
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer, index) => {
                    const isSelf = currentUser && currentUser.email === customer.email;
                    return (
                      <tr key={customer.id || index} className="customers-table__row">
                        <td>
                          <div className="customer-profile">
                            <div className="customer-profile__avatar text-center flex items-center justify-center bg-[#E9E3DD] text-[#2B1E1A] font-semibold text-sm">
                              {getInitials(customer.name)}
                            </div>
                            <div className="customer-profile__info">
                              <div className="customer-profile__name text-left">
                                {customer.name || 'Customer'} {isSelf && <span className="text-xs text-[#E46A53] font-medium">(You)</span>}
                              </div>
                              <div className="customer-profile__email">{customer.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          {currentUser && currentUser.email === 'manishpawar172003@gmail.com' && !isSelf ? (
                            <select
                              value={customer.role || 'USER'}
                              onChange={(e) => handleRoleChange(customer.id, e.target.value)}
                              className="bg-white border border-[#E9E3DD] rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#2B1E1A] focus:outline-none focus:border-[#E46A53] cursor-pointer"
                            >
                              <option value="USER">USER</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          ) : (
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              customer.role === 'ADMIN' ? 'bg-[#E46A53]/15 text-[#E46A53]' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {customer.role || 'USER'}
                            </span>
                          )}
                        </td>
                        <td className="text-sm text-[#7A655D]">
                          {customer.phone || '—'}
                        </td>
                        <td>
                          <div className="flex flex-col gap-0.5 text-left">
                            <span className={`text-[10px] uppercase font-bold tracking-wider ${
                              customer.blocked ? 'text-red-500' : 'text-green-500'
                            }`}>
                              {customer.blocked ? "BLOCKED" : "ACTIVE"}
                            </span>
                            <span className="text-[11px] font-mono text-[#7A655D]">
                              #USER-{customer.id}
                            </span>
                          </div>
                        </td>
                        <td className="text-right">
                          <div className="flex gap-2 justify-end">
                            {!isSelf && (
                              <>
                                <button 
                                  className={`p-2 rounded-full transition-colors ${
                                    customer.blocked ? 'hover:bg-green-50 text-green-600' : 'hover:bg-red-50 text-red-500'
                                  }`}
                                  title={customer.blocked ? "Unblock Account" : "Block Account"}
                                  onClick={() => handleToggleBlock(customer.id, customer.blocked)}
                                >
                                  {customer.blocked ? <ShieldCheck size={18} /> : <Ban size={18} />}
                                </button>
                                <button 
                                  className="p-2 rounded-full hover:bg-red-50 text-red-600 transition-colors"
                                  title="Delete Customer Account"
                                  onClick={() => handleDeleteCustomer(customer.id)}
                                >
                                  <Trash2 size={18} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          ) : (
            <table className="customers-table">
              <thead>
                <tr>
                  <th className="customers-table__th--profile">Subscriber Email</th>
                  <th>Subscription Date</th>
                  <th>Status</th>
                  <th className="text-right">ID</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-[#7A655D]">Loading subscribers list...</td>
                  </tr>
                ) : filteredSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      <EmptyState
                        icon={Mail}
                        title="No Subscribers Found"
                        description="Mailing list newsletter signups will be displayed here."
                      />
                    </td>
                  </tr>
                ) : (
                  filteredSubscribers.map((subscriber, index) => (
                    <tr key={subscriber.id || index} className="customers-table__row">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#E46A53]/5 text-[#E46A53] rounded-full flex items-center justify-center">
                            <Mail size={16} />
                          </div>
                          <span className="font-medium text-[#2B1E1A]">{subscriber.email}</span>
                        </div>
                      </td>
                      <td>
                        {subscriber.subscribedAt ? (
                          <span className="flex items-center gap-1.5 text-sm text-[#7A655D]">
                            <Calendar size={14} />
                            {new Date(subscriber.subscribedAt).toLocaleString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        ) : (
                          <span className="text-sm text-[#7A655D]/40">—</span>
                        )}
                      </td>
                      <td>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#10B981]/10 text-[#10B981]">
                          Subscribed
                        </span>
                      </td>
                      <td className="text-right font-mono text-xs text-[#7A655D]">
                        #SUB-{subscriber.id}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default Customers;
