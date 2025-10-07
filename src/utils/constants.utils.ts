import { randomBytes } from "crypto";

export const DOMAIN = "@meanrev.com";

export const BASE_URL = process.env.FRONTEND_BASE_URL!;
export const BA_BASE_URL = process.env.BACKEND_BASE_URL!;
export const REDIS_URL = process.env.REDIS_URL!;

export const SALT_ROUNDS = 10;

export const SUPPORT_MAIL_ID = process.env.SUPPORT_MAIL_ID!;

export const EMAIL_REGEX = /[a-z0-9._]+@[a-z.-]+\.[a-z]{2,}/;
export const DB_TEST_REGEX = /^[a-z0-9._]+@[a-z.-]+\.[a-z]{2,}$/i;
export const MOBILE_REGEX = /^\d{10}$/;

export const FIND_EMAIL_REGEX = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g;
export const FIND_MOBILE_REGEX = /(\+91[\s-]?)?([6-9]\d{9})/g;
export const FIND_MOBILE_REGEX_CODE_OPTIONAL = /(?:\+91[\s-]?)?([6-9]\d{9})/g;

export const ADMIN_NAME = process.env.ADMIN_NAME!;
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
export const ADMIN_MOBILE = process.env.ADMIN_MOBILE!;

export const TIMEZONE = process.env.TIMEZONE!;
export const NODE_ENV = process.env.NODE_ENV!;

export const generateUUID = (): string => {
    return randomBytes(64).toString("hex").slice(0, 9);
};
