package com.example.demo.controller;

import com.example.demo.model.BankAccount;
import com.example.demo.model.Customer;
import com.example.demo.service.BankService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/bank")
public class BankController {
    private final BankService bankService;

    public BankController(BankService bankService) {
        this.bankService = bankService;
    }

    @PostMapping("/customers")
    public Customer createCustomer(@RequestParam String firstName, @RequestParam String lastName, @RequestParam String email) {
        return bankService.createCustomer(firstName, lastName, email);
    }

    @PostMapping("/accounts")
    public BankAccount createAccount(@RequestParam Long customerId, @RequestParam String accountNumber) {
        return bankService.createAccount(customerId, accountNumber);
    }

    @PostMapping("/accounts/{accountId}/deposit")
    public void deposit(@PathVariable Long accountId, @RequestParam BigDecimal amount) {
        bankService.deposit(accountId, amount);
    }

    @PostMapping("/accounts/{accountId}/withdraw")
    public void withdraw(@PathVariable Long accountId, @RequestParam BigDecimal amount) {
        bankService.withdraw(accountId, amount);
    }

    @GetMapping("/accounts/{accountId}/balance")
    public BigDecimal getBalance(@PathVariable Long accountId) {
        return bankService.getBalance(accountId);
    }

    @GetMapping("/customers/{customerId}/accounts")
    public List<BankAccount> getCustomerAccounts(@PathVariable Long customerId) {
        return bankService.getCustomerAccounts(customerId);
    }
}