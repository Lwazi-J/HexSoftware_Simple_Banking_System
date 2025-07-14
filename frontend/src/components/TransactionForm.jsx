import React, { useState } from 'react';
import { bankAPI } from '../services/api';
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';

const TransactionForm = ({ accounts, selectedCustomer, onTransactionComplete }) => {
  const [formData, setFormData] = useState({
    accountId: '',
    amount: '',
    transactionType: 'deposit'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.accountId) {
      newErrors.accountId = 'Please select an account';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    } else if (parseFloat(formData.amount) > 1000000) {
      newErrors.amount = 'Amount cannot exceed $1,000,000';
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
      const amount = parseFloat(formData.amount);
      const accountId = formData.accountId;

      if (formData.transactionType === 'deposit') {
        await bankAPI.deposit(accountId, amount);
        onTransactionComplete(`Successfully deposited $${amount.toFixed(2)}`);
      } else {
        await bankAPI.withdraw(accountId, amount);
        onTransactionComplete(`Successfully withdrew $${amount.toFixed(2)}`);
      }

      // Reset form
      setFormData({
        accountId: '',
        amount: '',
        transactionType: 'deposit'
      });
      setErrors({});
    } catch (error) {
      console.error('Error processing transaction:', error);
      const errorMessage = error.response?.data?.message ||
        error.response?.data ||
        'Error processing transaction. Please try again.';
      setErrors({
        submit: errorMessage
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

  const getSelectedAccount = () => {
    return accounts.find(account => account.id.toString() === formData.accountId);
  };

  const selectedAccount = getSelectedAccount();

  return (
    <div className="card">
      <h2>
        <TrendingUp size={24} />
        Process Transaction
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="accountId">
            <CreditCard size={16} className="inline mr-1" />
            Select Account
          </label>
          <select
            id="accountId"
            name="accountId"
            value={formData.accountId}
            onChange={handleChange}
            className={errors.accountId ? 'error' : ''}
          >
            <option value="">Select an account...</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.accountNumber} - Balance: ${account.balance.toFixed(2)}
              </option>
            ))}
          </select>
          {errors.accountId && <span className="error-text">{errors.accountId}</span>}
        </div>

        {selectedAccount && (
          <div className="alert info">
            <strong>Selected Account:</strong> {selectedAccount.accountNumber}<br />
            <strong>Current Balance:</strong> ${selectedAccount.balance.toFixed(2)}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="transactionType">Transaction Type</label>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="transactionType"
                value="deposit"
                checked={formData.transactionType === 'deposit'}
                onChange={handleChange}
              />
              <TrendingUp size={16} color="#38a169" />
              Deposit
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="transactionType"
                value="withdraw"
                checked={formData.transactionType === 'withdraw'}
                onChange={handleChange}
              />
              <TrendingDown size={16} color="#e53e3e" />
              Withdraw
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="amount">
            <DollarSign size={16} className="inline mr-1" />
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            step="0.01"
            min="0.01"
            max="1000000"
            className={errors.amount ? 'error' : ''}
          />
          {errors.amount && <span className="error-text">{errors.amount}</span>}
        </div>

        {formData.transactionType === 'withdraw' && selectedAccount && formData.amount && (
          <div className="alert info">
            <strong>After transaction:</strong> ${(selectedAccount.balance - parseFloat(formData.amount || 0)).toFixed(2)}
          </div>
        )}

        {formData.transactionType === 'deposit' && selectedAccount && formData.amount && (
          <div className="alert info">
            <strong>After transaction:</strong> ${(selectedAccount.balance + parseFloat(formData.amount || 0)).toFixed(2)}
          </div>
        )}

        {errors.submit && (
          <div className="alert error">
            {errors.submit}
          </div>
        )}

        <button
          type="submit"
          className={`button ${formData.transactionType === 'withdraw' ? 'danger' : 'secondary'}`}
          disabled={loading || accounts.length === 0}
        >
          {loading ? 'Processing...' :
           formData.transactionType === 'deposit' ? 'Deposit Money' : 'Withdraw Money'}
        </button>

        {accounts.length === 0 && (
          <p className="text-sm text-gray-600 mt-2">
            {selectedCustomer ?
              'No accounts found for selected customer. Please create an account first.' :
              'Please select a customer and create an account first.'
            }
          </p>
        )}
      </form>
    </div>
  );
};

export default TransactionForm;