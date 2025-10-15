# 🏥 Healthcare Management System API

A secure and robust healthcare backend built with Node.js, Express.js, and PostgreSQL. Provides RESTful APIs for user authentication, patient and doctor management, and patient-doctor mapping with JWT-based security.






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


    
the repository or contact the development team.

