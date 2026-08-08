import { useState, useEffect, useRef } from 'react';
import { Search, Bell, Mail, RefreshCw, AlertCircle, MessageSquare } from 'lucide-react';
import './AdminTopNav.css';
import { getAllNotificationsAdmin, markNotificationAsReadAdmin, markAllNotificationsAsReadAdmin } from '../../../services/notificationService';
import { getAllInquiriesAdmin, markInquiryAsReadAdmin } from '../../../services/inquiryService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminTopNav = () => {
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  // Detail Modal Inquiry
  const [activeInquiry, setActiveInquiry] = useState(null);

  const navigate = useNavigate();

  // Refs for click outside
  const alertRef = useRef(null);
  const messageRef = useRef(null);

  const fetchDropdownData = async () => {
    try {
      const [notifsData, inquiriesData] = await Promise.all([
        getAllNotificationsAdmin(),
        getAllInquiriesAdmin()
      ]);
      setNotifications(notifsData);
      setInquiries(inquiriesData);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  useEffect(() => {
    fetchDropdownData();

    // Poll for new notifications every 10 seconds
    const interval = setInterval(fetchDropdownData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (alertRef.current && !alertRef.current.contains(event.target)) {
        setAlertsOpen(false);
      }
      if (messageRef.current && !messageRef.current.contains(event.target)) {
        setMessagesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handlers
  const handleMarkAlertAsRead = async (id, link) => {
    try {
      await markNotificationAsReadAdmin(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setAlertsOpen(false);
      if (link) {
        navigate(link);
      }
    } catch (err) {
      toast.error("Failed to update notification");
    }
  };

  const handleMarkAllAlertsRead = async () => {
    try {
      await markAllNotificationsAsReadAdmin();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to clear alerts");
    }
  };

  const handleInquiryClick = async (inquiry) => {
    setActiveInquiry(inquiry);
    setMessagesOpen(false);
    if (!inquiry.read) {
      try {
        await markInquiryAsReadAdmin(inquiry.id);
        setInquiries(prev => prev.map(i => i.id === inquiry.id ? { ...i, read: true } : i));
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Counts
  const unreadAlertsCount = notifications.filter(n => !n.read).length;
  const unreadMessagesCount = inquiries.filter(i => !i.read).length;

  const getFormattedTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <header className="admin-top-nav">
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search orders, clients, or items..." 
          className="search-input"
        />
        <Search className="search-icon" size={20} />
      </div>

      <div className="nav-actions">
        {/* Alerts Bell Dropdown */}
        <div className="nav-actions__dropdown-wrapper" ref={alertRef}>
          <button 
            className="action-btn notification-btn"
            onClick={() => {
              setAlertsOpen(!alertsOpen);
              setMessagesOpen(false);
            }}
          >
            <Bell size={20} />
            {unreadAlertsCount > 0 && (
              <span className="nav-actions__badge">{unreadAlertsCount}</span>
            )}
          </button>

          {alertsOpen && (
            <div className="nav-actions__dropdown">
              <div className="dropdown-header">
                <h4 className="dropdown-header__title">Notifications</h4>
                {unreadAlertsCount > 0 && (
                  <button className="dropdown-header__action" onClick={handleMarkAllAlertsRead}>
                    Mark all read
                  </button>
                )}
              </div>
              <div className="dropdown-body">
                {notifications.length === 0 ? (
                  <div className="dropdown-empty">
                    <AlertCircle size={24} style={{ color: "#a2918a", margin: "0 auto 0.5rem" }} />
                    <p>Your notification tray is empty.</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <button 
                      key={notif.id} 
                      className={`dropdown-item ${!notif.read ? 'dropdown-item--unread' : ''}`}
                      onClick={() => handleMarkAlertAsRead(notif.id, notif.link)}
                    >
                      {!notif.read && <span className="dropdown-item__bullet"></span>}
                      <div className="dropdown-item__content">
                        <h5 className="dropdown-item__title">{notif.title}</h5>
                        <p className="dropdown-item__message">{notif.message}</p>
                        <p className="dropdown-item__time">{getFormattedTime(notif.createdAt)}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Messages Dropdown */}
        <div className="nav-actions__dropdown-wrapper" ref={messageRef}>
          <button 
            className="action-btn"
            onClick={() => {
              setMessagesOpen(!messagesOpen);
              setAlertsOpen(false);
            }}
          >
            <Mail size={20} />
            {unreadMessagesCount > 0 && (
              <span className="nav-actions__badge">{unreadMessagesCount}</span>
            )}
          </button>

          {messagesOpen && (
            <div className="nav-actions__dropdown">
              <div className="dropdown-header">
                <h4 className="dropdown-header__title">Customer Inquiries</h4>
              </div>
              <div className="dropdown-body">
                {inquiries.length === 0 ? (
                  <div className="dropdown-empty">
                    <MessageSquare size={24} style={{ color: "#a2918a", margin: "0 auto 0.5rem" }} />
                    <p>No customer messages received.</p>
                  </div>
                ) : (
                  inquiries.map((inq) => (
                    <button 
                      key={inq.id} 
                      className={`dropdown-item ${!inq.read ? 'dropdown-item--unread' : ''}`}
                      onClick={() => handleInquiryClick(inq)}
                    >
                      {!inq.read && <span className="dropdown-item__bullet"></span>}
                      <div className="dropdown-item__content">
                        <h5 className="dropdown-item__title">{inq.name}</h5>
                        <p className="dropdown-item__message truncate max-w-[18rem]">{inq.message}</p>
                        <p className="dropdown-item__time">{getFormattedTime(inq.createdAt)}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Circle Logo */}
        <div className="profile-btn" style={{ width: "2rem", height: "2rem", borderRadius: "9999px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src="/images/logo.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>

      {/* Message Inquiry Detail Dialog */}
      <Dialog open={activeInquiry !== null} onOpenChange={(open) => !open && setActiveInquiry(null)}>
        <DialogContent className="sm:max-w-md bg-[#F6F2EE] border-none rounded-[22px]">
          {activeInquiry && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl text-[#2B1E1A]">
                  Customer Message Inquiry
                </DialogTitle>
                <DialogDescription className="text-[#7A655D]">
                  Submitted on {getFormattedTime(activeInquiry.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4 text-xs text-[#5C4B44]">
                  <div>
                    <span className="font-bold text-[10px] text-gray-500 uppercase block">Client Name</span>
                    <span className="text-sm font-semibold text-[#2B1E1A]">{activeInquiry.name}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[10px] text-gray-500 uppercase block">Email Address</span>
                    <a href={`mailto:${activeInquiry.email}`} className="text-sm font-semibold text-[#E46A53] hover:underline block">
                      {activeInquiry.email}
                    </a>
                  </div>
                </div>

                {activeInquiry.phone && (
                  <div>
                    <span className="font-bold text-[10px] text-gray-500 uppercase block">Phone Number</span>
                    <span className="text-sm text-[#2B1E1A]">{activeInquiry.phone}</span>
                  </div>
                )}

                {activeInquiry.subject && (
                  <div>
                    <span className="font-bold text-[10px] text-gray-500 uppercase block">Subject</span>
                    <span className="text-sm font-medium text-[#2B1E1A]">{activeInquiry.subject}</span>
                  </div>
                )}

                <div className="p-4 bg-white rounded-xl border border-[#E9E3DD]">
                  <span className="font-bold text-[10px] text-gray-400 uppercase block mb-1">Message Content</span>
                  <p className="text-xs text-[#2B1E1A] whitespace-pre-wrap leading-relaxed">
                    {activeInquiry.message}
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <a 
                    href={`mailto:${activeInquiry.email}?subject=RE: ${encodeURIComponent(activeInquiry.subject || 'Asha Boutique Inquiry')}`}
                    className="bg-[#E46A53] hover:bg-[#d55a43] text-white rounded-full py-2.5 px-6 font-serif text-sm font-semibold transition-colors block text-center"
                  >
                    Send Email Reply
                  </a>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default AdminTopNav;
