#### Backend - Products

#### Test Product-endpoint in Postman

1. Clone the repository.
2. Open Docker and your IDE of choice.  
   Open your terminal and navigate to the project´s root directory. Run the following command:
    - `docker-compose up`
3. Open Postman and create and register a new user:
   - POST: `https://localhost:448/public/register`
     set the body to raw and JSON and add the following:
   ```json
   {
       "name": "name",
       "email": "email",
       "password": "password",
       "role": "USER_CLIENT" or "USER_SELLER"
   }
   ```
   or authorized your account:
   - POST: `https://localhost:448/public/authenticate`
     set the body to raw and JSON and add the following:
   ```json
   {
       "email": "email",
       "password": "password"
   }
   ```
4. Copy the token and add it to the authorization as a Bearer Token.

5. Create a new product:
- POST: `https://localhost:446/private/products`
  set the body to raw and JSON and add the following:
```json
{
    "name": "name",
    "description": "description",
    "price": "price",
    "quantity": "quantity",
    "file": {}
}
```
6. Test the following endpoints:
https://localhost:44
    - GET: `/privat/products`: Retrieve all products from the current user.
    - GET: `/private/products/{id}`: Retrieve a product by id.
    - POST: `/private/products`: Create a new product.
    - PUT: `/private/products/{id}`: Update a specific product by id.
    - DELETE: `/private/products/{id}`: Delete a specific product by id.


```