package com.example.demo.service;

import com.example.demo.model.BankAccount;
import com.example.demo.model.Customer;
import com.example.demo.repository.BankAccountRepository;
import com.example.demo.repository.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BankServiceTest {
    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private BankAccountRepository bankAccountRepository;

    @InjectMocks
    private BankService bankService;

    private Customer customer;
    private BankAccount account;

    @BeforeEach
    void setUp() {
        customer = new Customer("John", "Doe", "john.doe@example.com");
        customer.setId(1L);

        account = new BankAccount("123456789", customer);
        account.setId(1L);
        account.setBalance(BigDecimal.valueOf(1000));
    }

    @Test
    void createCustomer_validData_shouldReturnCustomer() {
        when(customerRepository.save(any(Customer.class))).thenReturn(customer);

        Customer created = bankService.createCustomer("John", "Doe", "john.doe@example.com");

        assertNotNull(created);
        assertEquals("John", created.getFirstName());
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    @Test
    void createAccount_validData_shouldReturnAccount() {
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(bankAccountRepository.save(any(BankAccount.class))).thenReturn(account);

        BankAccount created = bankService.createAccount(1L, "123456789");

        assertNotNull(created);
        assertEquals("123456789", created.getAccountNumber());
        verify(bankAccountRepository, times(1)).save(any(BankAccount.class));
    }

    @Test
    void createAccount_invalidCustomerId_shouldThrowException() {
        when(customerRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () ->
                bankService.createAccount(99L, "123456789"));
    }

    @Test
    void deposit_validAmount_shouldUpdateBalance() {
        when(bankAccountRepository.findById(1L)).thenReturn(Optional.of(account));
        when(bankAccountRepository.save(any(BankAccount.class))).thenReturn(account);

        bankService.deposit(1L, BigDecimal.valueOf(500));

        assertEquals(BigDecimal.valueOf(1500), account.getBalance());
        verify(bankAccountRepository, times(1)).save(account);
    }

    @Test
    void withdraw_validAmount_shouldUpdateBalance() {
        when(bankAccountRepository.findById(1L)).thenReturn(Optional.of(account));
        when(bankAccountRepository.save(any(BankAccount.class))).thenReturn(account);

        bankService.withdraw(1L, BigDecimal.valueOf(500));

        assertEquals(BigDecimal.valueOf(500), account.getBalance());
        verify(bankAccountRepository, times(1)).save(account);
    }

    @Test
    void withdraw_amountExceedingBalance_shouldThrowException() {
        when(bankAccountRepository.findById(1L)).thenReturn(Optional.of(account));

        assertThrows(IllegalArgumentException.class, () ->
                bankService.withdraw(1L, BigDecimal.valueOf(1500)));
    }

    @Test
    void getBalance_validAccount_shouldReturnBalance() {
        when(bankAccountRepository.findById(1L)).thenReturn(Optional.of(account));

        BigDecimal balance = bankService.getBalance(1L);

        assertEquals(BigDecimal.valueOf(1000), balance);
    }

    @Test
    void getCustomerAccounts_validCustomer_shouldReturnAccounts() {
        List<BankAccount> accounts = Arrays.asList(account);
        when(bankAccountRepository.findByCustomerId(1L)).thenReturn(accounts);

        List<BankAccount> result = bankService.getCustomerAccounts(1L);

        assertEquals(1, result.size());
        assertEquals(account, result.get(0));
    }
}