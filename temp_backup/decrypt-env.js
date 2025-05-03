const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Function to decrypt the .env file
function decryptEnv() {
  try {
    // Get password from environment
    const password = process.env.ENCRYPTION_KEY || 'default-dev-password';
    
    // Read the encrypted file
    const encryptedPath = path.resolve(__dirname, '.env.encrypted');
    const encryptedData = fs.readFileSync(encryptedPath, 'utf8');
    
    // Split IV and content
    const [ivHex, encryptedHex] = encryptedData.split(':');
    
    // Decrypt
    const algorithm = 'aes-256-ctr';
    const key = crypto.scryptSync(password, 'salt', 32);
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    // Write to .env file for React build process
    fs.writeFileSync(path.resolve(__dirname, '.env'), decrypted);
    
    console.log('Successfully decrypted environment variables');
    return true;
  } catch (error) {
    console.error('Error decrypting environment:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  const success = decryptEnv();
  process.exit(success ? 0 : 1);
} else {
  // Export for use in other files
  module.exports = decryptEnv;
}
