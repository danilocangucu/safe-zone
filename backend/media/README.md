## Configuration

To configure this project, replace the `MY_SECRET_KEY` in the `config.js` file with your actual secret key.

javascript const config = { secretKey: 'MY_SECRET_KEY', // Other configurations... };

#### Backend - Media

#### Test Media-endpoint in Postman
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
   ````
4. Copy the token and add it to the authorization as a Bearer Token.
5. Add a new media file:
- POST: `https://localhost:447/media`
  set the body to form-data and add the following:
  - key: `file`
  - value: `file`
  
6. Test the following endpoints:
    https://localhost:447
    - GET: `/media/{id}`: Retrieve a media file by id.
    - POST: `/media`: Upload a media file.
    - PUT: `/media/{id}`: Update a media file.
    - DELETE: `/media/{id}`: Delete a media file.

The request needs to have the file attached to the body as a form-data with the key `file` and the value as the file itself.
