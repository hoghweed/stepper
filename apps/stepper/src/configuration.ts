import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const configuration = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    STP_DB_URI: z.string().min(1),
    STP_NATS_URI: z.string().min(1),
    SERVICES_URI: z.string().default('./dist/services'),
    SERVICES_MASK: z.string().default('**/*.service.js'),
  },
  runtimeEnv: process.env,
})
