import React, { useState } from 'react';
import { bankAPI } from '../services/api';
import { UserPlus, Mail, User } from 'lucide-react';

const CustomerForm = ({ onCustomerCreated }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await bankAPI.createCustomer(
        formData.firstName,
        formData.lastName,
        formData.email
      );

      onCustomerCreated(response.data);

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error creating customer:', error);
      setErrors({
        submit: error.response?.data?.message || 'Error creating customer. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="card">
      <h2>
        <UserPlus size={24} />
        Create New Customer
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">
            <User size={16} className="inline mr-1" />
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
            className={errors.firstName ? 'error' : ''}
          />
          {errors.firstName && <span className="error-text">{errors.firstName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">
            <User size={16} className="inline mr-1" />
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
            className={errors.lastName ? 'error' : ''}
          />
          {errors.lastName && <span className="error-text">{errors.lastName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            <Mail size={16} className="inline mr-1" />
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        {errors.submit && (
          <div className="alert error">
            {errors.submit}
          </div>
        )}

        <button
          type="submit"
          className="button"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Customer'}
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;
