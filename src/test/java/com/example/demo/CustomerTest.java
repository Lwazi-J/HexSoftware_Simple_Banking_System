package com.example.demo;

import com.example.demo.model.BankAccount;
import com.example.demo.model.Customer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CustomerTest {
    private Customer customer;

    @BeforeEach
    void setUp() {
        customer = new Customer("John", "Doe", "john.doe@example.com");
    }

    @Test
    void addAccount_shouldAddAccountToCustomer() {
        BankAccount account = new BankAccount("123456789", customer);
        customer.addAccount(account);

        assertEquals(1, customer.getAccounts().size());
        assertEquals(account, customer.getAccounts().get(0));
        assertEquals(customer, account.getCustomer());
    }

    @Test
    void getFullName_shouldReturnConcatenatedName() {
        assertEquals("John Doe", customer.getFirstName() + " " + customer.getLastName());
    }

    @Test
    void setEmail_validEmail_shouldUpdateEmail() {
        String newEmail = "new.email@example.com";
        customer.setEmail(newEmail);
        assertEquals(newEmail, customer.getEmail());
    }
}