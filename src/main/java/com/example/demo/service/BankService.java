package com.example.demo.service;

import com.example.demo.model.BankAccount;
import com.example.demo.model.Customer;
import com.example.demo.repository.BankAccountRepository;
import com.example.demo.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BankService {
    private final CustomerRepository customerRepository;
    private final BankAccountRepository bankAccountRepository;

    public BankService(CustomerRepository customerRepository, BankAccountRepository bankAccountRepository) {
        this.customerRepository = customerRepository;
        this.bankAccountRepository = bankAccountRepository;
    }

    @Transactional
    public Customer createCustomer(String firstName, String lastName, String email) {
        Customer customer = new Customer(firstName, lastName, email);
        return customerRepository.save(customer);
    }

    @Transactional
    public BankAccount createAccount(Long customerId, String accountNumber) {
        Customer customer = customerRepository.findById(customerId).orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        BankAccount account = new BankAccount(accountNumber, customer);
        customer.addAccount(account);

        return bankAccountRepository.save(account);
    }

    @Transactional
    public void deposit(Long accountId, BigDecimal amount) {
        BankAccount account = bankAccountRepository.findById(accountId).orElseThrow(() -> new IllegalArgumentException("Account not found"));
        account.deposit(amount);
        bankAccountRepository.save(account);
    }

    @Transactional
    public void withdraw(Long accountId, BigDecimal amount) {
        BankAccount account = bankAccountRepository.findById(accountId).orElseThrow(() -> new IllegalArgumentException("Account not found"));
        account.withdraw(amount);
        bankAccountRepository.save(account);
    }

    public BigDecimal getBalance(Long accountId) {
        return bankAccountRepository.findById(accountId).orElseThrow(() -> new IllegalArgumentException("Account not found")).getBalance();
    }

    public List<BankAccount> getCustomerAccounts(Long customerId) {
        return bankAccountRepository.findByCustomerId(customerId);
    }
}