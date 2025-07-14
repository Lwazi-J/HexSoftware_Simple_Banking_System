import React, { useState } from 'react';
import { bankAPI } from '../services/api';
import { CreditCard, Hash, User } from 'lucide-react';

const AccountForm = ({ customers, selectedCustomer, onAccountCreated }) => {
  const [formData, setFormData] = useState({
    customerId: selectedCustomer?.id || '',
    accountNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Update form when selectedCustomer changes
  React.useEffect(() => {
    if (selectedCustomer) {
      setFormData(prev => ({
        ...prev,
        customerId: selectedCustomer.id
      }));
    }
  }, [selectedCustomer]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerId) {
      newErrors.customerId = 'Please select a customer';
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (formData.accountNumber.length < 8) {
      newErrors.accountNumber = 'Account number must be at least 8 characters';
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
      const response = await bankAPI.createAccount(
        formData.customerId,
        formData.accountNumber
      );

      onAccountCreated(response.data);

      // Reset form
      setFormData({
        customerId: selectedCustomer?.id || '',
        accountNumber: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error creating account:', error);
      setErrors({
        submit: error.response?.data?.message || 'Error creating account. Please try again.'
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

  const generateAccountNumber = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const accountNumber = `ACC${timestamp.slice(-6)}${random}`;
    setFormData(prev => ({
      ...prev,
      accountNumber
    }));
  };

  return (
    <div className="card">
      <h2>
        <CreditCard size={24} />
        Create New Account
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="customerId">
            <User size={16} className="inline mr-1" />
            Select Customer
          </label>
          <select
            id="customerId"
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            className={errors.customerId ? 'error' : ''}
          >
            <option value="">Select a customer...</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.firstName} {customer.lastName} - {customer.email}
              </option>
            ))}
          </select>
          {errors.customerId && <span className="error-text">{errors.customerId}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="accountNumber">
            <Hash size={16} className="inline mr-1" />
            Account Number
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="Enter account number"
              className={errors.accountNumber ? 'error' : ''}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={generateAccountNumber}
              className="button secondary"
              style={{ whiteSpace: 'nowrap' }}
            >
              Generate
            </button>
          </div>
          {errors.accountNumber && <span className="error-text">{errors.accountNumber}</span>}
        </div>

        {errors.submit && (
          <div className="alert error">
            {errors.submit}
          </div>
        )}

        <button
          type="submit"
          className="button"
          disabled={loading || customers.length === 0}
        >
          {loading ? 'Creating...' : 'Create Account'}
        </button>

        {customers.length === 0 && (
          <p className="text-sm text-gray-600 mt-2">
            Please create a customer first before creating an account.
          </p>
        )}
      </form>
    </div>
  );
};

export default AccountForm;