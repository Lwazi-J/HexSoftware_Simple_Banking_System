package com.example.demo.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class BankAccountTest {
    private BankAccount account;
    private Customer customer;

    @BeforeEach
    void setUp() {
        customer = new Customer("John", "Doe", "john.doe@example.com");
        account = new BankAccount("123456789", customer);
        account.setBalance(BigDecimal.valueOf(1000));
    }

    @Test
    void deposit_positiveAmount_shouldIncreaseBalance() {
        account.deposit(BigDecimal.valueOf(500));
        assertEquals(BigDecimal.valueOf(1500), account.getBalance());
    }

    @Test
    void deposit_zeroAmount_shouldThrowException() {
        assertThrows(IllegalArgumentException.class, () ->
                account.deposit(BigDecimal.ZERO));
    }

    @Test
    void deposit_negativeAmount_shouldThrowException() {
        assertThrows(IllegalArgumentException.class, () ->
                account.deposit(BigDecimal.valueOf(-100)));
    }

    @Test
    void withdraw_validAmount_shouldDecreaseBalance() {
        account.withdraw(BigDecimal.valueOf(500));
        assertEquals(BigDecimal.valueOf(500), account.getBalance());
    }

    @Test
    void withdraw_amountExceedingBalance_shouldThrowException() {
        assertThrows(IllegalArgumentException.class, () ->
                account.withdraw(BigDecimal.valueOf(1500)));
    }

    @Test
    void withdraw_zeroAmount_shouldThrowException() {
        assertThrows(IllegalArgumentException.class, () ->
                account.withdraw(BigDecimal.ZERO));
    }

    @Test
    void withdraw_negativeAmount_shouldThrowException() {
        assertThrows(IllegalArgumentException.class, () ->
                account.withdraw(BigDecimal.valueOf(-100)));
    }
}