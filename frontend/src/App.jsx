import React, { useState, useEffect } from 'react';
import { bankAPI } from './services/api';
import CustomerForm from './components/CustomerForm';
import AccountForm from './components/AccountForm';
import TransactionForm from './components/TransactionForm';
import AccountList from './components/AccountList';
import CustomerList from './components/CustomerList';
import { User, CreditCard, TrendingUp, Building } from 'lucide-react';

function App() {
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('customers');
  const [alert, setAlert] = useState(null);

  // Load customers on component mount
  useEffect(() => {
    // We'll implement this when we have an endpoint to fetch all customers
    // For now, customers will be added when created
  }, []);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleCustomerCreated = (customer) => {
    setCustomers(prev => [...prev, customer]);
    showAlert(`Customer ${customer.firstName} ${customer.lastName} created successfully!`);
  };

  const handleAccountCreated = (account) => {
    setAccounts(prev => [...prev, account]);
    showAlert(`Account ${account.accountNumber} created successfully!`);
  };

  const handleTransactionComplete = (message) => {
    showAlert(message);
    // Refresh accounts if we have a selected customer
    if (selectedCustomer) {
      loadCustomerAccounts(selectedCustomer.id);
    }
  };

  const loadCustomerAccounts = async (customerId) => {
    try {
      setLoading(true);
      const response = await bankAPI.getCustomerAccounts(customerId);
      setAccounts(response.data);
    } catch (error) {
      showAlert('Error loading customer accounts', 'error');
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    loadCustomerAccounts(customer.id);
    setActiveTab('accounts');
  };

  const tabs = [
    { id: 'customers', label: 'Customers', icon: User },
    { id: 'accounts', label: 'Accounts', icon: CreditCard },
    { id: 'transactions', label: 'Transactions', icon: TrendingUp },
  ];

  return (
    <div className="app">
      <header className="header">
        <h1>
          <Building className="inline-block mr-3" size={48} />
          SecureBank Pro
        </h1>
        <p>Professional Banking Management System</p>
      </header>

      {alert && (
        <div className={`alert ${alert.type}`}>
          {alert.message}
        </div>
      )}

      <div className="tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={20} className="mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {selectedCustomer && (
        <div className="card">
          <h2>Selected Customer</h2>
          <div className="customer-item">
            <h3>{selectedCustomer.firstName} {selectedCustomer.lastName}</h3>
            <p>Email: {selectedCustomer.email}</p>
            <p>Customer ID: {selectedCustomer.id}</p>
          </div>
          <button
            className="button secondary"
            onClick={() => setSelectedCustomer(null)}
          >
            Clear Selection
          </button>
        </div>
      )}

      <div className="container">
        {activeTab === 'customers' && (
          <>
            <CustomerForm onCustomerCreated={handleCustomerCreated} />
            <CustomerList
              customers={customers}
              onCustomerSelect={handleCustomerSelect}
            />
          </>
        )}

        {activeTab === 'accounts' && (
          <>
            <AccountForm
              customers={customers}
              selectedCustomer={selectedCustomer}
              onAccountCreated={handleAccountCreated}
            />
            <AccountList
              accounts={accounts}
              loading={loading}
              selectedCustomer={selectedCustomer}
            />
          </>
        )}

        {activeTab === 'transactions' && (
          <>
            <TransactionForm
              accounts={accounts}
              selectedCustomer={selectedCustomer}
              onTransactionComplete={handleTransactionComplete}
            />
            {accounts.length > 0 && (
              <div className="card">
                <h2>Quick Balance Check</h2>
                <div className="account-list">
                  {accounts.map(account => (
                    <div key={account.id} className="account-item">
                      <h3>Account: {account.accountNumber}</h3>
                      <p className="balance">Balance: ${account.balance.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;