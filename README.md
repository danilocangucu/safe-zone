# buy-01

E-Commerce Platform with Spring Boot Microservices and Angular.
Register as a seller and add your products to the platform.
Register as a client and view all the products on the platform.

---

### Instructions:

1. Clone the repository.
2. Open Docker and your IDE of choice.   
   Open your terminal and navigate to the project´s root directory. Run the following command:
   - `docker-compose up --build`
3. Open the project in your browser at https://localhost

### Client

- Sign up to our platform.
- View all products.
- View your profile and delete your account.

### Seller

- Sign up with your chosen avatar.
- Manage products - add, edit and delete. Choose up to 5 images for each product.
- View your profile, edit your information and delete your account.

---

### Access mongodb servers:

#### media:

mongodb+srv://admin:admin@cluster0.9sbwdo2.mongodb.net/

#### products:

mongodb+srv://admin:admin@cluster0.78xloga.mongodb.net/

#### users:

mongodb+srv://admin:admin@cluster0.ig8awlz.mongodb.net/

---

## Project Structure

- `buy-01-frontend`: Angular frontend.
- `buy-01-backend-user`: User microservice.
- `buy-01-backend-product`: Product microservice.
- `buy-01-backend-media`: Media microservice.

---

### Database Design

![Database Design](./Database-Design.png)

### Created by

🎩🎩 Danilo, Falusvampen, Jacob and Stefanie | Grit:lab 2023 🎩🎩

---
