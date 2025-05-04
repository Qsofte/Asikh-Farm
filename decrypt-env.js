const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Function to decrypt the .env file
function decryptEnv() {
  try {
    // Get password from environment
    const password = process.env.ENCRYPTION_KEY || 'default-dev-password';
    
    // Read the encrypted file from secrets folder
    const encryptedPath = path.resolve(__dirname, 'secrets', '.env.encrypted');
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
    
    // Write the decrypted content to .env file in secrets folder
    const outputPath = path.resolve(__dirname, 'secrets', '.env');
    fs.writeFileSync(outputPath, decrypted);
    console.log('Environment variables decrypted successfully to secrets/.env');
    
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
