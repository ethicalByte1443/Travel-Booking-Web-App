package com.example.travelagency.exception;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) { super(message); }
}
