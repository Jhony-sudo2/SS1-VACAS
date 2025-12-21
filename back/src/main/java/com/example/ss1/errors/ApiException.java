package com.example.ss1.errors;

import org.springframework.http.HttpStatus;

public class ApiException extends RuntimeException{
     private HttpStatus code;
    public ApiException(String message,HttpStatus code){
        super(message);
        this.code = code;
    }

    public HttpStatus getCode(){
        return this.code;
    }
    
}
