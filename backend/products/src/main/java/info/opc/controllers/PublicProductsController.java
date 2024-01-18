package info.opc.controllers;

import java.util.List;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.annotation.JsonView;

import info.opc.models.Product;
import info.opc.repositories.ProductRepository;
import info.opc.views.PublicProductView;
import lombok.RequiredArgsConstructor;
@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/public")
@RequiredArgsConstructor
public class PublicProductsController {

    @Autowired
    ProductRepository productRepository;

    @GetMapping("/products")
    @JsonView(PublicProductView.class)
    public ResponseEntity<List<Product>> findAll(
            HttpServletRequest request
    ) {
        List<Product> products = productRepository.findAll();
        if (products.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(products);
    }
}