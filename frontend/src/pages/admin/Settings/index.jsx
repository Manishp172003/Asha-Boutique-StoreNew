import { useState, useEffect } from 'react';
import { Search, Store, CalendarPlus, Clock, User, Sparkles } from 'lucide-react';
import './Settings.css';
import AdminSidebar from '../../../components/admin/Sidebar/AdminSidebar';
import AdminTopNav from '../../../components/admin/TopNav/AdminTopNav';
import AdminButton from '../../../components/admin/Button/AdminButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '../../../context/AppContext';
import { toast } from 'sonner';

const Settings = () => {
  const { user: currentUser, updateUserProfile } = useApp();

  // Store settings
  const [boutiqueName, setBoutiqueName] = useState(() => localStorage.getItem('settings_boutiqueName') || "Asha Boutique");
  const [publicEmail, setPublicEmail] = useState(() => localStorage.getItem('settings_publicEmail') || "hello@ashaboutique.com");
  const [description, setDescription] = useState(() => localStorage.getItem('settings_description') || "Luxury artisanal commerce focusing on organic fibers and ethical craftsmanship. Curated for the modern mindful aesthetic.");

  // Appointment Slots settings
  const [stylistConsultations, setStylistConsultations] = useState(() => localStorage.getItem('settings_stylistConsultations') !== 'false');
  const [autoConfirmBookings, setAutoConfirmBookings] = useState(() => localStorage.getItem('settings_autoConfirmBookings') === 'true');
  const [slotDuration, setSlotDuration] = useState(() => Number(localStorage.getItem('settings_slotDuration')) || 45);
  const [capacity, setCapacity] = useState(() => Number(localStorage.getItem('settings_capacity')) || 2);
  const [bufferTime, setBufferTime] = useState(() => Number(localStorage.getItem('settings_bufferTime')) || 15);

  // Business Hours state
  const [businessHours, setBusinessHours] = useState(() => {
    const saved = localStorage.getItem('settings_businessHours');
    return saved ? JSON.parse(saved) : [
      { day: 'MONDAY', hours: '10:00 — 18:00', closed: false },
      { day: 'TUESDAY', hours: '10:00 — 18:00', closed: false },
      { day: 'WEDNESDAY', hours: '10:00 — 18:00', closed: false },
      { day: 'THURSDAY', hours: '10:00 — 20:00', closed: false },
      { day: 'FRIDAY', hours: '10:00 — 20:00', closed: false },
      { day: 'SATURDAY', hours: '09:00 — 19:00', closed: false },
      { day: 'SUNDAY', hours: 'CLOSED', closed: true },
    ];
  });

  // Modal Dialog states
  const [hoursModalOpen, setHoursModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Temporary edit states for hours
  const [tempHours, setTempHours] = useState([]);

  // Profile Edit states
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');

  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || '');
      setProfilePhone(currentUser.phone || '');
    }
  }, [currentUser]);

  // Handlers
  const handleSaveStoreInfo = (e) => {
    e.preventDefault();
    localStorage.setItem('settings_boutiqueName', boutiqueName);
    localStorage.setItem('settings_publicEmail', publicEmail);
    localStorage.setItem('settings_description', description);
    toast.success("Store credentials saved successfully!");
  };

  const handleSaveSlotsInfo = (e) => {
    e.preventDefault();
    localStorage.setItem('settings_stylistConsultations', stylistConsultations);
    localStorage.setItem('settings_autoConfirmBookings', autoConfirmBookings);
    localStorage.setItem('settings_slotDuration', slotDuration);
    localStorage.setItem('settings_capacity', capacity);
    localStorage.setItem('settings_bufferTime', bufferTime);
    toast.success("Consultation configurations updated!");
  };

  const handleOpenHoursModal = () => {
    setTempHours(JSON.parse(JSON.stringify(businessHours)));
    setHoursModalOpen(true);
  };

  const handleHourChange = (idx, field, val) => {
    const updated = [...tempHours];
    updated[idx][field] = val;
    if (field === 'closed') {
      updated[idx].hours = val ? 'CLOSED' : '10:00 — 18:00';
    }
    setTempHours(updated);
  };

  const handleSaveHours = () => {
    setBusinessHours(tempHours);
    localStorage.setItem('settings_businessHours', JSON.stringify(tempHours));
    setHoursModalOpen(false);
    toast.success("Operational hours updated successfully!");
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const loader = toast.loading("Updating admin profile...");
    try {
      await updateUserProfile({
        name: profileName,
        phone: profilePhone
      });
      toast.dismiss(loader);
      toast.success("Superuser profile updated successfully!");
      setProfileModalOpen(false);
    } catch (err) {
      toast.dismiss(loader);
      toast.error(err.message || "Failed to update profile");
    }
  };

  return (
    <div className="admin-page">
      <AdminSidebar />
      <AdminTopNav />
      
      <main className="admin-main">
        {/* Header */}
        <div className="settings-header">
          <h2 className="settings-header__title">Settings</h2>
          <div className="settings-header__search">
            <Search className="settings-header__search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Search settings..." 
              className="settings-header__search-input"
            />
          </div>
        </div>

        <div className="settings-grid">
          {/* Main Settings Column */}
          <div className="settings-main">
            {/* Store Info */}
            <div className="settings-card">
              <div className="settings-card__header">
                <div>
                  <h3 className="settings-card__title">Store Info</h3>
                  <p className="settings-card__subtitle">Update your public profile and storefront details.</p>
                </div>
                <span className="settings-card__icon">
                  <Store size={24} />
                </span>
              </div>
              <form className="settings-form" onSubmit={handleSaveStoreInfo}>
                <div className="settings-form__row">
                  <div className="settings-form__group">
                    <label className="settings-form__label">Boutique Name</label>
                    <input 
                      type="text" 
                      value={boutiqueName}
                      onChange={(e) => setBoutiqueName(e.target.value)}
                      className="settings-form__input"
                    />
                  </div>
                  <div className="settings-form__group">
                    <label className="settings-form__label">Public Email</label>
                    <input 
                      type="email" 
                      value={publicEmail}
                      onChange={(e) => setPublicEmail(e.target.value)}
                      className="settings-form__input"
                    />
                  </div>
                </div>
                <div className="settings-form__group">
                  <label className="settings-form__label">Description</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    className="settings-form__textarea"
                  ></textarea>
                </div>
                <div className="settings-form__actions">
                  <AdminButton type="submit" variant="primary">
                    Save Changes
                  </AdminButton>
                </div>
              </form>
            </div>

            {/* Appointment Slots */}
            <div className="settings-card">
              <div className="settings-card__header">
                <div>
                  <h3 className="settings-card__title">Appointment Slots</h3>
                  <p className="settings-card__subtitle">Define booking duration and available daily capacity.</p>
                </div>
                <span className="settings-card__icon">
                  <CalendarPlus size={24} />
                </span>
              </div>
              
              <form className="settings-form" onSubmit={handleSaveSlotsInfo}>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-gray-500 uppercase">Slot Duration (Min)</Label>
                    <Input 
                      type="number" 
                      value={slotDuration} 
                      onChange={(e) => setSlotDuration(Number(e.target.value))} 
                      className="bg-white border-[#E9E3DD] rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-gray-500 uppercase">Capacity (Persons)</Label>
                    <Input 
                      type="number" 
                      value={capacity} 
                      onChange={(e) => setCapacity(Number(e.target.value))} 
                      className="bg-white border-[#E9E3DD] rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-gray-500 uppercase">Buffer Time (Min)</Label>
                    <Input 
                      type="number" 
                      value={bufferTime} 
                      onChange={(e) => setBufferTime(Number(e.target.value))} 
                      className="bg-white border-[#E9E3DD] rounded-xl"
                    />
                  </div>
                </div>

                <div className="settings-toggle">
                  <span className="settings-toggle__label">Enable Stylist Consultations</span>
                  <button 
                    type="button"
                    className={`settings-toggle__button ${stylistConsultations ? 'settings-toggle__button--active' : ''}`}
                    onClick={() => setStylistConsultations(!stylistConsultations)}
                  >
                    <span className="settings-toggle__knob"></span>
                  </button>
                </div>
                <div className="settings-toggle">
                  <span className="settings-toggle__label">Auto-Confirm Bookings</span>
                  <button 
                    type="button"
                    className={`settings-toggle__button ${autoConfirmBookings ? 'settings-toggle__button--active' : ''}`}
                    onClick={() => setAutoConfirmBookings(!autoConfirmBookings)}
                  >
                    <span className="settings-toggle__knob"></span>
                  </button>
                </div>
                <div className="settings-form__actions">
                  <AdminButton type="submit" variant="primary">
                    Update Slots
                  </AdminButton>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="settings-sidebar">
            {/* Business Hours */}
            <div className="settings-card settings-card--sidebar">
              <div className="settings-card__header--compact">
                <Clock className="settings-card__icon--compact" size={24} />
                <h3 className="settings-card__title--compact">Business Hours</h3>
              </div>
              <div className="settings-hours">
                {businessHours.map((schedule, index) => (
                  <div key={index} className={`settings-hours__row ${schedule.closed ? 'settings-hours__row--closed' : ''}`}>
                    <span className="settings-hours__day">{schedule.day}</span>
                    <span className={`settings-hours__time ${schedule.closed ? 'settings-hours__time--closed' : ''}`}>
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
              <AdminButton variant="outline" className="settings-hours__edit" onClick={handleOpenHoursModal}>
                Edit Hours
              </AdminButton>
            </div>

            {/* Admin Profile */}
            <div className="settings-card settings-card--profile">
              <div className="settings-card__profile-bg"></div>
              <div className="settings-card__profile-content">
                <h3 className="settings-card__profile-title">Admin Profile</h3>
                <div className="settings-profile">
                  <div className="settings-profile__avatar flex items-center justify-center bg-[#E9E3DD] text-[#2B1E1A] font-semibold">
                    {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AD'}
                  </div>
                  <div className="settings-profile__info">
                    <p className="settings-profile__name">{currentUser?.name || "Asha Admin"}</p>
                    <p className="settings-profile__role">Superuser {currentUser?.role || "ADMIN"}</p>
                  </div>
                </div>
                <AdminButton variant="secondary" className="settings-profile__edit" onClick={() => setProfileModalOpen(true)}>
                  Edit Profile
                </AdminButton>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Hours Modal */}
      <Dialog open={hoursModalOpen} onOpenChange={setHoursModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#F6F2EE] border-none rounded-[22px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-[#2B1E1A]">Edit Business Hours</DialogTitle>
            <DialogDescription className="text-[#7A655D]">Set weekly operational hours for bookings.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {tempHours.map((schedule, idx) => (
              <div key={idx} className="flex justify-between items-center gap-4 py-2 border-b border-[#E9E3DD]">
                <span className="font-semibold text-xs text-[#2B1E1A] w-24">{schedule.day}</span>
                <div className="flex items-center gap-2 flex-1">
                  <Input 
                    type="text" 
                    value={schedule.hours} 
                    onChange={(e) => handleHourChange(idx, 'hours', e.target.value)} 
                    disabled={schedule.closed}
                    className="bg-white border-[#E9E3DD] rounded-xl flex-1 text-xs h-[36px]"
                  />
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={schedule.closed} 
                      onChange={(e) => handleHourChange(idx, 'closed', e.target.checked)} 
                    />
                    <span className="text-[11px] text-[#7A655D]">Closed</span>
                  </label>
                </div>
              </div>
            ))}
            <div className="pt-4 flex justify-end">
              <AdminButton variant="primary" onClick={handleSaveHours}>
                Save Operational Hours
              </AdminButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Modal */}
      <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#F6F2EE] border-none rounded-[22px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-[#2B1E1A]">Edit Admin Profile</DialogTitle>
            <DialogDescription className="text-[#7A655D]">Modify your administrative credentials.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4 mt-4" onSubmit={handleSaveProfile}>
            <div className="space-y-2">
              <Label className="text-[#2B1E1A]">Full Name</Label>
              <Input 
                type="text" 
                value={profileName} 
                onChange={(e) => setProfileName(e.target.value)} 
                className="bg-white border-[#E9E3DD] rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#2B1E1A]">Phone Number</Label>
              <Input 
                type="text" 
                value={profilePhone} 
                onChange={(e) => setProfilePhone(e.target.value)} 
                className="bg-white border-[#E9E3DD] rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#2B1E1A]">Security Email (Identifier)</Label>
              <Input 
                type="email" 
                value={currentUser?.email || ''} 
                disabled 
                className="bg-gray-100 border-[#E9E3DD] rounded-xl cursor-not-allowed"
              />
            </div>
            <div className="pt-4">
              <AdminButton type="submit" variant="primary" className="w-full">
                Update Profile Settings
              </AdminButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
