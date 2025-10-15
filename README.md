# 🏥 Healthcare Management System API

A robust and secure healthcare backend system built with Node.js, Express.js, and PostgreSQL. This RESTful API provides comprehensive patient and doctor management capabilities with advanced security features, making it perfect for healthcare applications, clinics, and medical practice management systems.

## 🌟 Key Features

- **🔐 Secure Authentication**: JWT-based authentication with password hashing
- **👥 User Management**: Complete user registration and login system
- **🏥 Patient Management**: Full CRUD operations for patient records with medical history
- **👨‍⚕️ Doctor Management**: Comprehensive doctor profiles with specialization tracking
- **🔗 Patient-Doctor Mapping**: Advanced assignment system for patient-doctor relationships
- **🛡️ Security First**: Input validation, CORS protection, and secure headers
- **📊 PostgreSQL Database**: Robust relational database with proper constraints
- **🚀 Production Ready**: Error handling, logging, and environment configuration

## 🎯 Perfect For

- **Healthcare Applications**: Build patient management systems for clinics and hospitals
- **Medical Practice Software**: Create comprehensive doctor and patient tracking systems
- **Healthcare APIs**: Use as a foundation for larger healthcare platforms
- **Learning Projects**: Understand modern backend development with Node.js and PostgreSQL
- **Portfolio Projects**: Showcase full-stack development skills with a real-world application

## 🏗️ Architecture

This project follows modern backend architecture principles:

- **MVC Pattern**: Clean separation of concerns with controllers, models, and routes
- **Middleware Architecture**: Modular authentication and error handling
- **Database Abstraction**: PostgreSQL with connection pooling for optimal performance
- **Security Layers**: Multiple security measures including JWT, bcrypt, and input validation
- **Environment Configuration**: Secure handling of sensitive configuration data

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | PostgreSQL |
| **Authentication** | JWT (jsonwebtoken) |
| **Security** | Helmet, CORS, bcryptjs |
| **Validation** | express-validator |
| **Environment** | dotenv |
| **Development** | nodemon, morgan |

## 📊 Project Stats

- **API Endpoints**: 15+ RESTful endpoints
- **Database Tables**: 4 interconnected tables
- **Security Features**: 5+ security layers
- **Authentication**: JWT with password hashing
- **Validation**: Comprehensive input validation
- **Documentation**: Complete API documentation with examples

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd healthcare-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Database Setup

#### Create PostgreSQL database:
```bash
createdb healthcare_db
```

#### Run the database schema:
```bash
psql -d healthcare_db -f database/schema.sql
```

### 4. Environment Configuration

#### Run the setup script:
```bash
node scripts/setup.js
```

#### Update the `.env` file with your database credentials:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=healthcare_db
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_secure
JWT_EXPIRE=7d

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 5. Start the server

#### Development mode:
```bash
npm run dev
```

#### Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login user | No |

### Patient Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/patients/` | Add a new patient | Yes |
| GET | `/api/patients/` | Get all patients (created by user) | Yes |
| GET | `/api/patients/:id` | Get specific patient | Yes |
| PUT | `/api/patients/:id` | Update patient details | Yes |
| DELETE | `/api/patients/:id` | Delete patient | Yes |

### Doctor Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/doctors/` | Add a new doctor | Yes |
| GET | `/api/doctors/` | Get all doctors | Yes |
| GET | `/api/doctors/:id` | Get specific doctor | Yes |
| PUT | `/api/doctors/:id` | Update doctor details | Yes |
| DELETE | `/api/doctors/:id` | Delete doctor | Yes |

### Patient-Doctor Mapping Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/mappings/` | Assign doctor to patient | Yes |
| GET | `/api/mappings/` | Get all mappings | Yes |
| GET | `/api/mappings/:patient_id` | Get doctors for specific patient | Yes |
| DELETE | `/api/mappings/:id` | Remove doctor from patient | Yes |

## API Usage Examples

### 1. Register a new user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Create a patient (with authentication)
```bash
curl -X POST http://localhost:3000/api/patients/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "1234567890",
    "date_of_birth": "1990-01-01",
    "address": "123 Main St, City, State",
    "medical_history": "No known allergies"
  }'
```

### 4. Create a doctor
```bash
curl -X POST http://localhost:3000/api/doctors/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Dr. Smith",
    "email": "dr.smith@hospital.com",
    "phone": "9876543210",
    "specialization": "Cardiology",
    "license_number": "MD123456",
    "hospital": "City General Hospital"
  }'
```

### 5. Assign doctor to patient
```bash
curl -X POST http://localhost:3000/api/mappings/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "patient_id": 1,
    "doctor_id": 1,
    "notes": "Regular checkup"
  }'
```

## Database Schema

### Users Table
- `id` (Primary Key)
- `name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR, Hashed)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Patients Table
- `id` (Primary Key)
- `name` (VARCHAR)
- `email` (VARCHAR)
- `phone` (VARCHAR)
- `date_of_birth` (DATE)
- `address` (TEXT)
- `medical_history` (TEXT)
- `created_by` (Foreign Key to Users)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Doctors Table
- `id` (Primary Key)
- `name` (VARCHAR)
- `email` (VARCHAR)
- `phone` (VARCHAR)
- `specialization` (VARCHAR)
- `license_number` (VARCHAR)
- `hospital` (VARCHAR)
- `created_by` (Foreign Key to Users)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Patient-Doctor Mappings Table
- `id` (Primary Key)
- `patient_id` (Foreign Key to Patients)
- `doctor_id` (Foreign Key to Doctors)
- `assigned_at` (TIMESTAMP)
- `notes` (TEXT)
- `created_by` (Foreign Key to Users)

## Security Features

- 🔐 JWT-based authentication
- 🔒 Password hashing with bcryptjs
- 🛡️ Helmet for security headers
- 🌐 CORS configuration
- ✅ Input validation and sanitization
- 🚫 SQL injection prevention with parameterized queries

## Error Handling

The API includes comprehensive error handling:
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Conflict errors (409)
- Server errors (500)

## Testing

You can test the API using:
- **Postman**: Import the API collection
- **curl**: Command line examples provided above
- **Thunder Client**: VS Code extension
- **Insomnia**: API testing tool

## Health Check

Check if the API is running:
```bash
curl http://localhost:3000/health
```

## Development

### Project Structure
```
healthcare-backend/
├── config/
│   └── database.js
├── controllers/
│   ├── authController.js
│   ├── patientController.js
│   ├── doctorController.js
│   └── mappingController.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── routes/
│   ├── auth.js
│   ├── patients.js
│   ├── doctors.js
│   └── mappings.js
├── database/
│   └── schema.sql
├── scripts/
│   └── setup.js
├── server.js
├── package.json
└── README.md
```

### Available Scripts
- `npm start`: Start the production server
- `npm run dev`: Start the development server with nodemon
- `npm test`: Run tests (when implemented)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the repository or contact the development team.

