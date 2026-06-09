/**
 * Central API configuration used across the frontend.
 * - baseUrl: backend API root URL
 * - tenantId: multi-tenant identifier sent with every request
 */
export const API_CONFIG = {
  baseUrl: 'http://localhost:5000/api',
  tenantId: 'apollonia',
  tokenKey: 'apollonia_auth_token',
} as const;
