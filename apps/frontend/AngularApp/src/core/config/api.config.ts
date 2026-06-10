/**
 * Central API configuration used across the frontend.
 * - baseUrl: backend API root URL
 * - tenantId: multi-tenant identifier sent with every request
 *
 * tokenKey:
 * Browser localStorage key used to store the JWT returned by backend.
 *
 * IMPORTANT:
 * This is NOT the JWT_SECRET.
 * JWT_SECRET must stay only in the Node.js backend .env file.
 */
export const API_CONFIG = {
  baseUrl: 'http://localhost:5000/api',
  tenantId: 'apollonia',
  tokenKey: 'apollonia_auth_token',
  userKey: 'apollonia_auth_user',
} as const;
