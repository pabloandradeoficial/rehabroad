import type { D1Database, R2Bucket } from "@cloudflare/workers-types";

export {};

declare global {
  interface Env {
    DB: D1Database;
    R2_BUCKET: R2Bucket;

    MOCHA_USERS_SERVICE_API_URL: string;
    MOCHA_USERS_SERVICE_API_KEY: string;

    STRIPE_SECRET_KEY?: string;
    STRIPE_WEBHOOK_SECRET?: string;
    RESEND_API_KEY?: string;
    OPENAI_API_KEY: string;
  }
}