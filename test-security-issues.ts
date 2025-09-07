// Test file with intentional security issues for Quality Gates testing

import crypto from 'crypto';

// Secret exposure (should be blocked)
const API_KEY = 'sk-1234567890abcdef1234567890abcdef'; // OpenAI-style API key
const DATABASE_URL = 'postgres://user:password123@localhost:5432/mydb';
const JWT_SECRET = 'super-secret-jwt-key-that-should-not-be-exposed';

// Potential XSS vulnerability
function unsafeHtml(userInput: string) {
  document.innerHTML = userInput; // Direct HTML injection
  return `<div>${userInput}</div>`; // Unsafe template
}

// SQL Injection vulnerability
function unsafeQuery(userId: string) {
  const query = `SELECT * FROM users WHERE id = '${userId}'`; // String concatenation
  return query;
}

// Eval usage (dangerous)
function executeCode(userCode: string) {
  return eval(userCode); // Direct eval usage
}

// Weak crypto
function weakEncryption(data: string) {
  const cipher = crypto.createCipher('des', 'weak-key'); // Weak algorithm
  return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
}

// Hardcoded credentials
const config = {
  aws: {
    accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
    secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
  },
  github: {
    token: 'ghp_1234567890abcdef1234567890abcdef12345678'
  }
};

export default { unsafeHtml, unsafeQuery, executeCode, config };