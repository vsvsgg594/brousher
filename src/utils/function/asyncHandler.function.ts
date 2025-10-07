import { FastifyRequest, FastifyReply } from "fastify";
import { STATUS_CODES } from "../../statuses.utils";

interface CustomError extends Error {
  code?: string;
  statusCode?: number;
  details?: any;
}

export const asyncHandler = (
  fn: (req: FastifyRequest, res: FastifyReply) => Promise<any>
) => {
  return async (req: FastifyRequest, res: FastifyReply) => {
    try {
      await fn(req, res);
    } catch (error: unknown) {
      const err = error as CustomError;
      req.log.error(
        `AsyncHandler Error for ${req.method} ${req.url}: ${err.message}`
      );
      let statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR;
      let errorMessage = "An unexpected error occurred";
      let errorCode = "INTERNAL_SERVER_ERROR";
      if (err instanceof Error) {
        errorMessage = err.message;
        if (err.name === "SequelizeValidationError") {
          statusCode = STATUS_CODES.BAD_REQUEST;
          errorCode = "VALIDATION_ERROR";
        } else if (err.name === "SequelizeUniqueConstraintError") {
          statusCode = STATUS_CODES.CONFLICT;
          errorCode = "DUPLICATE_ENTRY";
        } else if (err.name === "SequelizeDatabaseError") {
          statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR;
          errorCode = "DATABASE_ERROR";
        } else if (err.name === "SequelizeForeignKeyConstraintError") {
          statusCode = STATUS_CODES.BAD_REQUEST;
          errorCode = "FOREIGN_KEY_CONSTRAINT";
        } else if (err.name === "NotFoundError") {
          statusCode = STATUS_CODES.NOT_FOUND;
          errorCode = "NOT_FOUND";
        } else if (err.name === "ValidationError") {
          statusCode = STATUS_CODES.BAD_REQUEST;
          errorCode = "VALIDATION_ERROR";
        } else if (err.name === "AuthenticationError") {
          statusCode = STATUS_CODES.UNAUTHORIZED;
          errorCode = "UNAUTHORIZED";
        } else if (err.name === "AuthorizationError") {
          statusCode = STATUS_CODES.FORBIDDEN;
          errorCode = "FORBIDDEN";
        }
        if (err.statusCode && typeof err.statusCode === "number") {
          statusCode = err.statusCode;
        }
        if (err.code) {
          errorCode = err.code;
        }
      }

      const errorResponse: any = {
        success: false,
        message: errorMessage,
        code: errorCode,
        timestamp: new Date().toISOString(),
        path: req.url,
      };

      if (process.env.NODE_ENV === "development") {
        errorResponse.stack = err.stack;
        if (err.details) {
          errorResponse.details = err.details;
        }
      }

      res.status(statusCode).send(errorResponse);
    }
  };
};
