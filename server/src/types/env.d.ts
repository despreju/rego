declare namespace NodeJS {
  interface ProcessEnv {
    JWT_EXPIRES_IN?: string;
    JWT_ACCESS_TOKEN_SECRET: string;
    JWT_REFRESH_TOKEN_SECRET: string;
    MONGO_URI: string;
    PORT?: string;
  }
}