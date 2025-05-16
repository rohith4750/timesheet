import React, { useState } from 'react';
import { useAuth } from '../../services/auth';
import './profile.scss';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: user?.username || '',
    phoneNumber: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    console.log('Profile data:', formData);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-image">
            {/* Profile image placeholder */}
          </div>
          <div className="profile-details">
            <h2>{user?.username}</h2>
            <span className="role">System Admin</span>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'changePassword' ? 'active' : ''}`}
          onClick={() => setActiveTab('changePassword')}
        >
          Change Password
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'overview' ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name*</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="form-group">
                <label>Last Name*</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>ID Number*</label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="Enter your ID number"
                />
              </div>
              <div className="form-group">
                <label>Email Address*</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  disabled
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Street Address*</label>
                <input
                  type="text"
                  value={formData.streetAddress}
                  onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                  placeholder="Enter your street address"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City*</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter your city"
                />
              </div>
              <div className="form-group">
                <label>State*</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Enter your state"
                />
              </div>
              <div className="form-group">
                <label>Zip Code*</label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="Enter your zip code"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-button">Save</button>
              <button type="button" className="back-button">Back</button>
            </div>
          </form>
        ) : (
          <form className="change-password-form">
            <div className="form-group">
              <label>Current Password*</label>
              <input type="password" placeholder="Enter current password" />
            </div>
            <div className="form-group">
              <label>New Password*</label>
              <input type="password" placeholder="Enter new password" />
            </div>
            <div className="form-group">
              <label>Confirm Password*</label>
              <input type="password" placeholder="Confirm new password" />
            </div>
            <div className="form-actions">
              <button type="submit" className="change-password-button">Change Password</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;