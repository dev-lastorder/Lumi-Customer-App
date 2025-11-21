import * as Sentry from "@sentry/react-native";

// Sentry Handler
export const initSentry = () => {
  console.log("Initializing Sentry");
  // if (!SENTRY_DSN) return;
  Sentry.init({
    dsn: "https://91b55f514a2c4708845789d6e79abf10@o1103026.ingest.us.sentry.io/6131933",
    environment: "development",
    debug: true,
    // enableTracing: false, // Disables tracing completely
    // tracesSampleRate: 0.3, // Prevents sampling any traces
  });
};
