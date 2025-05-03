const crypto = require('crypto');
const fs = require('fs');

// Get password from command line or environment
const password = process.argv[2] || process.env.ENCRYPTION_KEY || 'default-dev-password';

// Read the .env file
const env = fs.readFileSync('.env', 'utf8');

// Encrypt the content
const algorithm = 'aes-256-ctr';
const key = crypto.scryptSync(password, 'salt', 32);
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv(algorithm, key, iv);
let encrypted = cipher.update(env, 'utf8', 'hex');
encrypted += cipher.final('hex');

// Store the IV and encrypted content
const result = `${iv.toString('hex')}:${encrypted}`;
fs.writeFileSync('.env.encrypted', result);

console.log('Encrypted .env to .env.encrypted');
