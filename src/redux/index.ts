import { store, persistor } from "./store";
// # Export the store instance
export { store, persistor };

// # Export typed hooks
export * from "./hooks";

// # Export base types (like interfaces)
export * from "./types";

// # Export store-specific types
export type { RootState, AppDispatch } from "./store";

// # Export actions/reducers from slices for convenience
export * from "./slices";
