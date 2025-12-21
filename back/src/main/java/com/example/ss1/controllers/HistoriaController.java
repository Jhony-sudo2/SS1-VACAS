package com.example.ss1.controllers;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/historia")
public class HistoriaController {
    //@Autowired
    //private HistoriaService historiaService;

    @GetMapping()
    public String hola(){
        return "HOLA";
    }
}
