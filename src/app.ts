import http from "http";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { MongooseService } from "./services/mongoose_service.js";
import { getDefaultRateLimiter } from "./middlewares/rate_limiter_middlewares.js";
import { errorHandler } from "./middlewares/error_middlewares.js";
import { hitCounter } from "./middlewares/hit_counter_middleware.js";
import logger from "./utils/logger.js";
import { RedisService } from "./services/redis_service.js";
import { getHealthCheckRouter } from "./routes/health_check_routes.js";
import { getIfscRouter } from "./routes/ifsc_routes.js";

dotenv.config({ path: `.env.development` });

await MongooseService.connect();
await RedisService.initClient();

const app = express();

app.use(helmet());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.use(express.json({ limit: "100kb" }));

app.use(hitCounter());

app.use(getDefaultRateLimiter());

app.use("/api/health", getHealthCheckRouter());

app.use("/api/v1/ifsc", getIfscRouter());

app.use(errorHandler);

process.on("unhandledRejection", (reason, promise) => {
  console.error(reason);
});
process.on("uncaughtException", (error, origin) => {
  console.error(error);
  console.error(origin);
});

const server = http.createServer(
  {
    maxHeaderSize: 8192, // 8 kB
  },
  app
);

server.listen(3000, "0.0.0.0", () => {
  logger.info("Server running at http://localhost:3000/");
});
