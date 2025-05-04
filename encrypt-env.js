const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Get password from command line or environment
const password = process.argv[2] || process.env.ENCRYPTION_KEY || 'default-dev-password';

// Read the .env file from secrets folder
const envPath = path.join(__dirname, 'secrets', '.env');
const env = fs.readFileSync(envPath, 'utf8');

// Encrypt the content
const algorithm = 'aes-256-ctr';
const key = crypto.scryptSync(password, 'salt', 32);
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv(algorithm, key, iv);
let encrypted = cipher.update(env, 'utf8', 'hex');
encrypted += cipher.final('hex');

// Store the IV and encrypted content in secrets folder
const result = `${iv.toString('hex')}:${encrypted}`;
const encryptedPath = path.join(__dirname, 'secrets', '.env.encrypted');
fs.writeFileSync(encryptedPath, result);

console.log('Environment variables encrypted successfully to secrets/.env.encrypted');
