#!/usr/bin/env node
/**
 * Database Connection Diagnostic
 *
 * Run this to verify:
 * 1. DATABASE_URL is set
 * 2. Can connect to PostgreSQL
 * 3. Prisma client works
 * 4. Database has tables
 *
 * Usage: node scripts/test-db-connection.js
 */

const path = require('path');

// Load env from .env.local in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
}

async function testDatabaseConnection() {
  console.log('🔍 Database Connection Diagnostic\n');

  // Check 1: DATABASE_URL set
  console.log('1️⃣  Checking DATABASE_URL...');
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ DATABASE_URL is not set!');
    console.log('   Set it in:');
    console.log('   - Local: .env.local file');
    console.log('   - Render: Environment variables');
    process.exit(1);
  }
  console.log('✅ DATABASE_URL is set');

  // Mask password in output
  const maskedUrl = dbUrl.replace(/:([^@]+)@/, ':***@');
  console.log(`   ${maskedUrl}\n`);

  // Check 2: Try to create Prisma client
  console.log('2️⃣  Attempting Prisma connection...');
  try {
    const { getPrisma } = require('../lib/prisma');
    const prisma = getPrisma();

    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1 as connection_test`;
    console.log('✅ Prisma connected successfully');
    console.log(`   Query result: ${JSON.stringify(result)}\n`);
  } catch (error) {
    console.error('❌ Prisma connection failed!');
    console.error(`   Error: ${error.message}`);

    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n   💡 Fix: PostgreSQL server is not running');
      console.log('   - Local: Start PostgreSQL');
      console.log('   - Render: Check Database tab shows "Available"');
    } else if (error.message.includes('password authentication failed')) {
      console.log('\n   💡 Fix: Wrong username/password in DATABASE_URL');
      console.log('   - Check Render database credentials');
    } else if (error.message.includes('connect ENOTFOUND')) {
      console.log('\n   💡 Fix: Cannot reach database host');
      console.log('   - Check DATABASE_URL host is correct');
      console.log('   - Verify PostgreSQL add-on is "Available"');
    }

    process.exit(1);
  }

  // Check 3: Count tables
  console.log('3️⃣  Checking database schema...');
  try {
    const { getPrisma } = require('../lib/prisma');
    const prisma = getPrisma();

    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    if (tables.length === 0) {
      console.warn('⚠️  No tables found in database!');
      console.log('   💡 Run migrations:');
      console.log('   - Local: npx prisma migrate dev');
      console.log('   - Render: Redeploy (auto-runs migrations)');
    } else {
      console.log(`✅ Found ${tables.length} tables:`);
      tables.forEach(t => console.log(`   - ${t.table_name}`));
    }
  } catch (error) {
    console.error('❌ Could not query database schema');
    console.error(`   Error: ${error.message}`);
  }

  console.log('\n✨ Diagnostic complete!');
  process.exit(0);
}

// Run
testDatabaseConnection().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
