// frontend/src/types/auth.ts
// Import shared types from index.ts
import type {
  User,
  AuthState,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from './index';

// Re-export them if auth.ts is intended as a module exporting these types
// Or, if other files directly import from 'types/index', these exports might not be strictly necessary
// For now, let's re-export to maintain compatibility if other files were importing from 'types/auth'.
export type {
  User,
  AuthState,
  LoginCredentials,
  RegisterData,
  AuthResponse,
};

// If there were any types specific *only* to auth.ts and not shared, they would remain here.
// For example:
// export interface SomeAuthSpecificInternalType {
//   sessionKey: string;
// }
// Based on the previous analysis, all types in auth.ts were duplicates of what's now in index.ts.
