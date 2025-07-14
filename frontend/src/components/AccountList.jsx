import React, { useState } from 'react';
import { bankAPI } from '../services/api';
import { CreditCard, DollarSign, RefreshCw, Eye } from 'lucide-react';

const AccountList = ({ accounts, loading, selectedCustomer }) => {
  const [balanceLoading, setBalanceLoading] = useState({});
  const [balances, setBalances] = useState({});

  const refreshBalance = async (accountId) => {
    setBalanceLoading(prev => ({ ...prev, [accountId]: true }));
    try {
      const response = await bankAPI.getBalance(accountId);
      setBalances(prev => ({ ...prev, [accountId]: response.data }));
    } catch (error) {
      console.error('Error refreshing balance:', error);
    } finally {
      setBalanceLoading(prev => ({ ...prev, [accountId]: false }));
    }
  };

  const getDisplayBalance = (account) => {
    return balances[account.id] !== undefined ? balances[account.id] : account.balance;
  };

  if (loading) {
    return (
      <div className="card">
        <h2>
          <CreditCard size={24} />
          Account List
        </h2>
        <div className="loading">Loading accounts...</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>
        <CreditCard size={24} />
        {selectedCustomer ?
          `${selectedCustomer.firstName}'s Accounts` :
          'Account List'
        }
      </h2>

      {accounts.length === 0 ? (
        <div className="empty-state">
          <CreditCard size={48} color="#cbd5e0" />
          <h3>No accounts found</h3>
          <p>
            {selectedCustomer ?
              'This customer has no accounts yet. Create one to get started.' :
              'Select a customer to view their accounts or create a new account.'
            }
          </p>
        </div>
      ) : (
        <div className="account-list">
          {accounts.map(account => (
            <div key={account.id} className="account-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3>
                    <CreditCard size={20} className="inline mr-2" />
                    Account: {account.accountNumber}
                  </h3>
                  <p>Account ID: {account.id}</p>
                  <p>
                    <DollarSign size={16} className="inline mr-1" />
                    Balance:
                    <span className="balance">
                      ${getDisplayBalance(account).toFixed(2)}
                    </span>
                  </p>
                  {account.customer && (
                    <p>
                      Owner: {account.customer.firstName} {account.customer.lastName}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => refreshBalance(account.id)}
                    disabled={balanceLoading[account.id]}
                    className="button secondary"
                    style={{
                      padding: '0.5rem',
                      minWidth: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                    title="Refresh Balance"
                  >
                    <RefreshCw
                      size={16}
                      className={balanceLoading[account.id] ? 'spin' : ''}
                    />
                    {balanceLoading[account.id] ? 'Loading...' : 'Refresh'}
                  </button>
                </div>
              </div>

              <div style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e2e8f0',
                fontSize: '0.875rem',
                color: '#718096'
              }}>
                <p>
                  <Eye size={14} className="inline mr-1" />
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {accounts.length > 0 && (
        <div className="stats">
          <div className="stat-card">
            <h3>{accounts.length}</h3>
            <p>Total Accounts</p>
          </div>
          <div className="stat-card">
            <h3>${accounts.reduce((sum, account) => sum + getDisplayBalance(account), 0).toFixed(2)}</h3>
            <p>Total Balance</p>
          </div>
          <div className="stat-card">
            <h3>${(accounts.reduce((sum, account) => sum + getDisplayBalance(account), 0) / accounts.length).toFixed(2)}</h3>
            <p>Average Balance</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountList;