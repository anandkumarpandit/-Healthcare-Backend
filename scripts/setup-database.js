const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  console.log('Setting up PostgreSQL database for Healthcare API...\n');

  const adminPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'anandkumar',
    password: process.env.DB_PASSWORD || '',
    database: 'postgres' 
  });

  try {
    console.log('Connecting to PostgreSQL...');
    await adminPool.query('SELECT NOW()');
    console.log(' Connected to PostgreSQL successfully\n');

    const dbName = process.env.DB_NAME || 'healthcare_db';
    console.log(`Creating database: ${dbName}...`);
    
    try {
      await adminPool.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database '${dbName}' created successfully\n`);
    } catch (error) {
      if (error.code === '42P04') {
        console.log(`Database '${dbName}' already exists\n`);
      } else {
        throw error;
      }
    }

    await adminPool.end();

    const appPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'anandkumar',
      password: process.env.DB_PASSWORD || '',
      database: dbName
    });

    console.log('Running database schema...');
    
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await appPool.query(schema);
    console.log('Database schema executed successfully\n');

    console.log('Testing database connection...');
    const result = await appPool.query('SELECT NOW() as current_time, version() as postgres_version');
    console.log('Database connection test successful');
    console.log(`Current time: ${result.rows[0].current_time}`);
    console.log(`PostgreSQL version: ${result.rows[0].postgres_version.split(' ')[0]}\n`);

    console.log('📋 Checking created tables...');
    const tablesResult = await appPool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('Created tables:');
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

    await appPool.end();
    
    console.log('\n Database setup completed successfully!');
    console.log('\n Next steps:');
    console.log('1. Make sure your .env file has the correct database credentials');
    console.log('2. Start your server: npm run dev');
    console.log('3. Test the API endpoints\n');

  } catch (error) {
    console.error('Database setup failed:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure PostgreSQL is running: brew services start postgresql@15');
    console.log('2. Check your database credentials in .env file');
    console.log('3. Ensure your user has permission to create databases');
    process.exit(1);
  }
}

if (require.main === module) {
  require('dotenv').config();
  setupDatabase();
}

module.exports = setupDatabase;
