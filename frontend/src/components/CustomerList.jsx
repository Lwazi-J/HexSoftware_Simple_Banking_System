import React from 'react';
import { User, Mail, MousePointer, Users } from 'lucide-react';

const CustomerList = ({ customers, onCustomerSelect }) => {
  return (
    <div className="card">
      <h2>
        <Users size={24} />
        Customer Directory
      </h2>

      {customers.length === 0 ? (
        <div className="empty-state">
          <User size={48} color="#cbd5e0" />
          <h3>No customers found</h3>
          <p>Create your first customer to get started with the banking system.</p>
        </div>
      ) : (
        <>
          <div className="alert info">
            <MousePointer size={16} className="inline mr-2" />
            Click on a customer to select them and view their accounts
          </div>

          <div className="customer-list">
            {customers.map(customer => (
              <div
                key={customer.id}
                className="customer-item"
                onClick={() => onCustomerSelect(customer)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3>
                      <User size={20} className="inline mr-2" />
                      {customer.firstName} {customer.lastName}
                    </h3>
                    <p>
                      <Mail size={16} className="inline mr-1" />
                      {customer.email}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#718096' }}>
                      Customer ID: {customer.id}
                    </p>
                  </div>

                  <div style={{
                    background: '#667eea',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    Click to Select
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
                    Created: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {customers.length > 0 && (
        <div className="stats">
          <div className="stat-card">
            <h3>{customers.length}</h3>
            <p>Total Customers</p>
          </div>
          <div className="stat-card">
            <h3>{customers.filter(c => c.email.includes('@')).length}</h3>
            <p>Verified Emails</p>
          </div>
          <div className="stat-card">
            <h3>{new Date().toLocaleDateString()}</h3>
            <p>Last Updated</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;