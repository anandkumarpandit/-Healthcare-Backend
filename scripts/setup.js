const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('Created .env file from env.example');
    console.log(' Please update the .env file with your actual database credentials');
  } else {
    const envContent = `# Database Configuration
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

# Frontend URL (for CORS in production)
FRONTEND_URL=http://localhost:3001`;

    fs.writeFileSync(envPath, envContent);
    console.log('Created .env file with default values');
    console.log(' Please update the .env file with your actual database credentials');
  }
} else {
  console.log('.env file already exists');
}

console.log('\nNext steps:');
console.log('1. Update .env file with your PostgreSQL credentials');
console.log('2. Create the database: createdb healthcare_db');
console.log('3. Run the schema: psql -d healthcare_db -f database/schema.sql');
console.log('4. Install dependencies: npm install');
console.log('5. Start the server: npm run dev');

