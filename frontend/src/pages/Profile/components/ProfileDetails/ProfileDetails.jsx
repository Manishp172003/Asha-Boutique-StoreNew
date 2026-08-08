import { useState, useEffect } from "react";
import { useApp } from "../../../../context/AppContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import "./ProfileDetails.css";

const ProfileDetails = () => {
  const { user, updateUserProfile } = useApp();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  // Load user data on mount
  useEffect(() => {
    if (user) {
      const nameParts = user.name ? user.name.split(' ') : ['', ''];
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.firstName.trim()) {
      toast.error('First name is required');
      return;
    }

    const loadingToast = toast.loading('Saving changes...');

    try {
      await updateUserProfile({
        id: user.id,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: user.email,
        phone: formData.phone,
        role: user.role
      });
      toast.dismiss(loadingToast);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.message || 'Failed to update profile');
    }
  };

  return (
    <section className="profile-details-card">
      <div className="card-header">
        <h2>Profile Details</h2>
        <p>Manage your personal information</p>
      </div>

      <form id="profile-form" className="profile-details-form" onSubmit={handleSave}>

        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            disabled
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
          />
        </div>

      </form>

      <div className="profile-actions">
        <Button type="submit" form="profile-form" variant="primary">
          Save Changes
        </Button>
      </div>
    </section>
  );
};

export default ProfileDetails;