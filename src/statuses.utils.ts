export const STATUS_CODES = {
  // 2xx Success
  OK: 200,                          // GET success, PUT success, general success
  CREATED: 201,                     // POST success, resource created
  ACCEPTED: 202,                    // Async processing started, queue-based tasks
  NO_CONTENT: 204,                  // DELETE success, PUT with no response body

  // 3xx Redirection
  MOVED_PERMANENTLY: 301,           // Permanent redirect (e.g., old routes)
  FOUND: 302,                       // Temporary redirect (e.g., login redirects)
  NOT_MODIFIED: 304,                // Caching, resource not changed

  // 4xx Client Errors
  BAD_REQUEST: 400,                 // Invalid input, missing params, validation error
  UNAUTHORIZED: 401,               // No auth token or invalid token
  FORBIDDEN: 403,                  // Authenticated but no permission
  NOT_FOUND: 404,                  // Resource not found (invalid ID or route)
  METHOD_NOT_ALLOWED: 405,         // HTTP method not supported
  CONFLICT: 409,                   // Duplicate record, conflict in state
  PAYLOAD_TOO_LARGE: 413,          // File too large
  UNSUPPORTED_MEDIA_TYPE: 415,     // Invalid Content-Type (expecting JSON)
  UNPROCESSABLE_ENTITY: 422,       // Validation failed, form field errors
  TOO_MANY_REQUESTS: 429,          // Rate limiting, OTP retries exceeded

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR: 500,      // Uncaught server error
  NOT_IMPLEMENTED: 501,            // API route not implemented
  BAD_GATEWAY: 502,                // Proxy/gateway upstream error
  SERVICE_UNAVAILABLE: 503,        // Maintenance mode, server down
  GATEWAY_TIMEOUT: 504,            // Upstream service timeout
};