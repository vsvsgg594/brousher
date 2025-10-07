import { FastifyRequest, FastifyReply } from "fastify";
import Sequelize from "sequelize";
import { STATUS_CODES } from "../statuses.utils";

export const customErrorHandler = (
  err: any,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (err instanceof Sequelize.BaseError) {
    let errors = [];
    if (err instanceof Sequelize.ValidationError) {
      errors = err.errors.map((e) => ({
        message: e.message,
        field: e.path,
      }));
      return reply
        .status(STATUS_CODES.BAD_REQUEST)
        .send({ message: "Validation error", details: errors });
    } else if (err instanceof Sequelize.UniqueConstraintError) {
      errors = err.errors.map((e) => ({
        message: e.message,
        field: e.path,
      }));
      return reply
        .status(STATUS_CODES.CONFLICT)
        .send({ message: "Unique constraint error", details: errors });
    } else if (err instanceof Sequelize.ForeignKeyConstraintError) {
      return reply.status(STATUS_CODES.BAD_REQUEST).send({
        message: "Foreign key constraint error",
        details: err.message,
      });
    } else {
      return reply
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "Database error" });
    }
  } else if (err.status) {
    return reply.status(err.status).send({ message: err.message });
  } else {
    return reply
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: "Internal Server Error" });
  }
};
