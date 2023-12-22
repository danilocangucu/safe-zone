#### Backend - User

#### Test Media-endpoint in Postman
1. Clone the repository.
2. Open Docker and your IDE of choice.  
   Open your terminal and navigate to the project´s root directory. Run the following command:
   - `docker-compose up`
3. Open Postman and create and register a new user:
    - POST: `http://localhost:448/public/register`
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
5. Test the following endpoints:
   https://localhost:448/
    - GET: `/private/user/`: Retrieve the current user's information.
    - PUT: `/private/user/`: Update the current user's information.
    - Put: `/private/user/avatar`: Update the current user's avatar.
    - DELETE: `/private/user/`: Delete the current user's account.