package info.opc.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import info.opc.configs.JwtService;
import info.opc.views.PrivateProductView;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.annotation.JsonView;

import info.opc.models.Product;
import info.opc.repositories.ProductRepository;
import info.opc.services.ProductService;
import info.opc.views.PublicProductView;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/private")
@RequiredArgsConstructor
public class ProductsController {

    private final ProductService productService;
    @Autowired
    ProductRepository productRepository;

    @GetMapping("/products")
    @JsonView(PrivateProductView.class)
    public ResponseEntity<?> findAllFromUser(
            HttpServletRequest request) {
        String id = JwtService.getUserIdFromRequest(request);
        if (id == null || id.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<Product> products = productService.findAllFromUser(id);
        return ResponseEntity.ok(products);
    }

    @JsonView(PrivateProductView.class)
    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(
            @Valid @RequestBody Product product,
            HttpServletRequest request) {
        String role = JwtService.getUserRoleFromRequest(request);
        if (role == null || !role.equals("USER_SELLER")) {
            return ResponseEntity.badRequest().build();
        }

        String id = JwtService.getUserIdFromRequest(request);
        if (id == null || id.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        product.setUserId(id);
        Product createdProduct = productService.save(product);
        return ResponseEntity.ok(createdProduct);
    }

    @JsonView(PublicProductView.class)
    @GetMapping("/products/{requestedId}")
    public ResponseEntity<Product> findById(
            @PathVariable String requestedId,
            HttpServletRequest request) {
        String userId = JwtService.getUserIdFromRequest(request);
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Product product = findProduct(requestedId, userId);
        if (product != null) {
            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PutMapping("/products/{requestedId}")
    private ResponseEntity<Void> putProduct(
            @PathVariable String requestedId,
            @Valid @RequestBody Product productUpdate,
            HttpServletRequest request) {
        String role = JwtService.getUserRoleFromRequest(request);
        if (role == null || !role.equals("USER_SELLER")) {
            return ResponseEntity.badRequest().build();
        }

        String userId = JwtService.getUserIdFromRequest(request);
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Product product = findProduct(requestedId, userId);
        if (product != null) {
            Product updatedProduct = new Product(
                    requestedId,
                    productUpdate.getName(),
                    productUpdate.getDescription(),
                    productUpdate.getQuantity(),
                    productUpdate.getPrice(),
                    userId);

            productRepository.save(updatedProduct);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @DeleteMapping("/products/{requestedId}")
    private ResponseEntity<Void> deleteProduct(
            @PathVariable String requestedId,
            HttpServletRequest request) {
        String role = JwtService.getUserRoleFromRequest(request);
        if (role == null || !role.equals("USER_SELLER")) {
            return ResponseEntity.badRequest().build();
        }

        String userId = JwtService.getUserIdFromRequest(request);
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (productRepository.existsByIdAndUserId(requestedId, userId)) {
            productRepository.deleteById(requestedId);
            productService.sendDeleteProductMessage(requestedId);
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    private Product findProduct(String requestedId, String userId) {
        Optional<Product> searchedProduct = productRepository.findById(requestedId);
        if (searchedProduct.isEmpty()) {
            return null;
        }

        Product foundProduct = searchedProduct.get();
        if (!foundProduct.getUserId().equals(userId)) {
            return null;
        }
        return foundProduct;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

}
