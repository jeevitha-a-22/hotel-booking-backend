# Hotel Booking Backend API

A RESTful backend application developed to manage hotel booking and hotel operations, including user authentication, hotel and room management, bookings, pricing, check-in/check-out, housekeeping, cancellations, invoices, and occupancy reports.

---

## 1. Project Title & Team Details

### Project Title

**Hotel Booking Backend API**

### Team Details

**Department:** ADSE  
**Class & Section:** 5BTCSAIML B

| Name | Roll Number |
|---|---|
| Jeevitha A | 2462079 |
| Gopireddy Rethvik Reddy | 2462076 |
| Florentina Francis | 2462070 |
| Girikshith Bhat | 2462073 |

---

## 2. Problem Statement

Hotels require an efficient system to manage guests, hotels, rooms, availability, bookings, pricing, check-in/check-out, housekeeping, cancellations, invoices, and operational reports. Managing these operations manually or through disconnected systems can lead to booking conflicts, inconsistent room information, difficulty in tracking room status, and inefficient hotel operations. This project addresses these business needs by providing a centralized RESTful backend API that manages hotel booking and operational workflows using authentication, role-based authorization, and MongoDB-based data management.

---

## 3. Tech Stack Used

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication and Security

- JSON Web Token (JWT)
- bcryptjs
- dotenv

### Additional Libraries

- cors

### API Testing

- Postman

### Version Control

- Git
- GitHub

---

## 4. Setup Instructions

### Prerequisites

Make sure the following are installed:

- Node.js
- MongoDB or MongoDB Atlas
- Git

### Step 1: Clone the Repository

```bash
git clone <repository-url>
```

### Step 2: Navigate to the Project Directory

```bash
cd hotel-booking-backend
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Configure Environment Variables

Create a `.env` file in the root directory of the project.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
```

### Step 5: Seed the Database

Run the seed script to create sample users, hotel, room types, rooms, and pricing rules.

```bash
npm run seed
```

Sample seeded users:

```text
Hotel Owner
Email: owner@test.com
Password: Owner@123

Guest
Email: guest2@test.com
Password: Guest@123
```

### Step 6: Create Admin User

Run:

```bash
node scripts/createAdmin.js
```

Admin credentials:

```text
Email: admin@test.com
Password: Admin@123
```

### Step 7: Run the Server

```bash
node server.js
```

The server will run locally at:

```text
http://localhost:5000
```

---

## 5. List of Implemented Modules

### 5.1 Authentication and Authorization Module

Implemented features:

- User registration
- User login
- JWT token generation
- Password hashing using bcryptjs
- Protected routes
- Role-based authorization

Supported roles:

- Guest
- Hotel Owner
- Staff
- Admin

---

### 5.2 Hotel Management Module

Implemented features:

- Hotel creation
- Hotel retrieval
- Hotel owner association
- Hotel information management

---

### 5.3 Room Type Management Module

Implemented features:

- Room type creation
- Base price configuration
- Room capacity management
- Total room configuration

Example room types:

- Standard Room
- Deluxe Room

---

### 5.4 Room Management Module

Implemented features:

- Individual room management
- Room number management
- Room type association
- Housekeeping status management

---

### 5.5 Availability and Booking Module

Implemented features:

- Room availability checking
- Booking creation
- Booking retrieval
- Guest booking history
- Booking status management
- Room cost calculation
- Tax calculation
- Total amount calculation
- Number of nights calculation

---

### 5.6 Pricing Module

Implemented features:

- Pricing rules
- Seasonal pricing
- Weekend pricing
- Price multipliers
- Dynamic booking amount calculation

---

### 5.7 Check-In and Check-Out Module

Implemented features:

- Guest check-in
- Guest check-out
- Actual check-in timestamp
- Actual check-out timestamp
- Booking status updates

---

### 5.8 Housekeeping Module

Implemented features:

- Retrieve housekeeping rooms
- Filter rooms by housekeeping status
- Filter rooms by hotel
- Update room housekeeping status

Supported statuses:

- clean
- dirty
- maintenance

---

### 5.9 Cancellation and Refund Module

Implemented features:

- Booking cancellation
- Refund calculation
- Booking status update
- Cancellation refund storage

Refund policy implemented:

| Cancellation Time | Refund |
|---|---|
| 7 or more days before check-in | 100% |
| 2 to 6 days before check-in | 50% |
| Less than 2 days before check-in | 0% |

---

### 5.10 Invoice Module

Implemented features:

- Invoice generation
- Invoice number generation
- Guest information
- Hotel information
- Room type information
- Room cost details
- Tax details
- Total amount
- Refund amount
- Booking status

---

### 5.11 Reports Module

Implemented features:

- Total rooms calculation
- Booking count
- Occupied room nights
- Revenue calculation
- Occupancy rate calculation
- Admin-protected report access

---

## 6. API Endpoint Reference

The complete Postman collection is available at:

```text
postman/Hotel-Booking-API.postman_collection.json
```

### Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Booking APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/bookings/my` | Get bookings of the logged-in guest |

### Housekeeping APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/housekeeping` | Get all rooms for housekeeping |
| GET | `/api/housekeeping?housekeepingStatus=dirty` | Filter rooms by housekeeping status |
| GET | `/api/housekeeping?hotelId=<hotelId>` | Filter rooms by hotel |
| PUT | `/api/housekeeping/:id` | Update room housekeeping status |

### Cancellation APIs

| Method | Endpoint | Description |
|---|---|---|
| PUT | `/api/cancellations/:id` | Cancel a booking and calculate refund |

### Invoice APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/invoices/:id` | Generate invoice for a booking |

### Report APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reports/occupancy?hotelId=<hotelId>` | Get hotel occupancy report |
| GET | `/api/admin/reports/occupancy?hotelId=<hotelId>` | Get admin occupancy report |

### Postman Collection

The Postman collection includes API testing for:

- User Registration
- User Login
- Guest Authentication
- Hotel Owner Authentication
- Admin Authentication
- Booking Operations
- Guest Booking History
- Housekeeping List
- Housekeeping Status Filter
- Hotel-Based Housekeeping Filter
- Housekeeping Status Update
- Booking Cancellation
- Refund Calculation
- Invoice Generation
- Occupancy Report
- Admin Occupancy Report

---

## 7. Database Schema Summary

The application uses MongoDB with Mongoose for database modeling.

### User Collection

Stores all application users.

Main fields:

- name
- email
- passwordHash
- role

Supported roles:

- guest
- hotelOwner
- staff
- admin

Relationships:

- A Hotel Owner can own hotels.
- A Guest can create bookings.

---

### Hotel Collection

Stores hotel information.

Main fields:

- ownerId
- name
- city
- amenities
- rating

Relationship:

```text
User (Hotel Owner)
        |
        | owns
        ↓
      Hotel
```

---

### RoomType Collection

Stores room categories belonging to hotels.

Main fields:

- hotelId
- name
- basePrice
- totalRooms
- capacity

Relationship:

```text
Hotel
  |
  | has
  ↓
Room Types
```

---

### Room Collection

Stores individual rooms.

Main fields:

- roomNumber
- roomTypeId
- housekeepingStatus

Relationship:

```text
Room Type
    |
    | contains
    ↓
   Rooms
```

---

### Booking Collection

Stores hotel booking information.

Main fields:

- guestId
- hotelId
- roomTypeId
- checkIn
- checkOut
- guests
- status
- roomCost
- taxes
- totalAmount
- nights
- cancellationRefund
- actualCheckIn
- actualCheckOut

Relationship:

```text
Guest
  |
  | creates
  ↓
Booking
  |
  |------ Hotel
  |
  |------ Room Type
```

---

### PricingRule Collection

Stores pricing rules associated with room types.

Main fields:

- roomTypeId
- season
- multiplier

Relationship:

```text
Room Type
    |
    | has
    ↓
Pricing Rules
```

---

### Database Relationship Overview

```text
                     USER
                       |
             -------------------
             |                 |
             ↓                 ↓
        HOTEL OWNER          GUEST
             |                 |
             | owns            | creates
             ↓                 ↓
           HOTEL <---------- BOOKING
             |
             | has
             ↓
         ROOM TYPE
          /      \
         ↓        ↓
      ROOMS   PRICING RULES
```

---

## 8. Known Limitations

The current project focuses on backend REST API development. The following features are intentionally outside the current project scope:

- Complete frontend user interface
- Payment gateway integration
- Real-time payment processing
- Email notifications
- SMS notifications
- Hotel image uploads
- File management
- Advanced recommendation system
- Real-time analytics dashboard
- Automated room allocation
- Automated housekeeping scheduling
- PDF invoice generation and download
- Production-scale cloud deployment

### Assumptions

The current implementation assumes that:

- Users authenticate using JWT tokens.
- MongoDB is properly configured and available.
- Protected routes receive valid authorization tokens.
- Hotels are managed by authorized users.
- Bookings are associated with registered guests.
- Rooms belong to valid room types.
- Room types belong to valid hotels.
- Pricing rules are associated with valid room types.

---

