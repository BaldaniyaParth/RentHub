# RentHub

RentHub is a comprehensive travel listings platform that allows users to create, read, update, and delete travel listings. The application also includes features like user authentication and authorization, search functionality, reviews, map visualization, and a responsive design using Bootstrap.

## Features

- ✅ **User authentication and authorization**
- ✅ **Create, read, update, and delete travel listings**
- ✅ **Search for travel listings**
- ✅ **Submit and manage reviews for listings**
- ✅ **Map to show location**
- ✅ **Responsive design using Bootstrap**

## Technologies Used

- ⚙️ **HTML, CSS, Bootstrap**
- ⚙️ **JavaScript (EJS)**
- ⚙️ **Node.js, Express**
- ⚙️ **MongoDB**
- ⚙️ **Passport.js for authentication**
- ⚙️ **Mapbox for map visualization**
- ⚙️ **Joi for validation**

## Live Demo

- Check out the live demo of RentHub: [https://renthub-parth.onrender.com](https://renthub-parth.onrender.com)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/renthub.git
   ```

2. Navigate to the project directory:
    ```sh
    cd renthub
    ```

3. Install the dependencies:
    ```sh
    npm install
    ```

4. Create a .env file in the root directory and add your environment variables:
    ```env
    PORT = 8000

    ATLASDB_URL="your mongodb url"

    CLOUD_NAME = "your cloud name"
    CLOUD_API_KEY = "your cloud api"
    CLOUD_API_SECRET = "your cloud api secret"

    SESSION_SECRET = "your session secret code"

    MAP_TOKEN = "your map token"
    ```

5. Start the development server:
    ```sh
    npm start
    ```

## Usage

- Visit the home page and sign up for a new account or log in with existing credentials.
- Browse travel listings or use the search functionality to find specific listings.
- Create new travel listings, edit or delete existing ones.
- Submit reviews for listings and view reviews submitted by other users.
- Use the map to visualize the location of listings.

## Acknowledgements

- Node.js
- Express
- MongoDB
- Passport.js
- Mapbox
- Bootstrap
- Joi
