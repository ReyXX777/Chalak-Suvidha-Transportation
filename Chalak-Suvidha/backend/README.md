# Chalak Suvidha Backend

This is the backend for the Chalak Suvidha project. It provides RESTful APIs for user authentication, service integration, and geolocation.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/chalak-suvidha.git
   cd chalak-suvidha/backend

   npm install
Create a .env file and add the following environment variables:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FASTAG_API_URL=https://api.fastag.com/data
SARATHI_API_URL=https://api.sarathi.com/data
ADVOCATE_API_URL=https://api.advocate.com/data
POLICE_API_URL=https://api.police.com/data
TRUCK_API_URL=https://api.truck.com/data
Start the server:

npm start
API Endpoints
Auth
POST /api/auth/register - Register a new user
POST /api/auth/login - Login a user
Services
GET /api/services/fastag - Get FASTag data
GET /api/services/sarathi - Get Sarathi data
GET /api/services/advocate - Get Advocate data
GET /api/services/police - Get Police data
GET /api/services/truck - Get Truck data
Notifications
GET /api/notifications/location - Get location data