// frontend/src/services/indexedDB.ts
import { OfflineContent, OfflineAction, User, Message } from '../types';

const DB_NAME = 'CogniSparkDB';
const DB_VERSION = 2; // Incremented version due to schema change

const STORE_CONTENT = 'offline-content';
const STORE_ACTIONS = 'offline-actions';
const STORE_USER_PROFILE = 'user-profile';
const STORE_USER_MESSAGES = 'user-messages';

export class IndexedDBService {
  private db: IDBDatabase | null = null;

  constructor() {
    // Initialize the DB. Errors are caught and logged.
    this.initDB().catch(err => console.error("Error during initial DB initialization:", err));
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Avoid re-opening if already open and correct version
      if (this.db && this.db.version === DB_VERSION) {
        resolve();
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        console.error('IndexedDB error during open:', (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        console.log(`Upgrading IndexedDB to version ${db.version}`);

        if (!db.objectStoreNames.contains(STORE_CONTENT)) {
          const contentStore = db.createObjectStore(STORE_CONTENT, {
            keyPath: 'id',
            autoIncrement: true, // As per original definition
          });
          contentStore.createIndex('type', 'type', { unique: false });
          contentStore.createIndex('lastSync', 'lastSync', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORE_ACTIONS)) {
          const actionsStore = db.createObjectStore(STORE_ACTIONS, {
            keyPath: 'id',
            autoIncrement: true, // As per original definition
          });
          actionsStore.createIndex('type', 'type', { unique: false });
          actionsStore.createIndex('synced', 'synced', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORE_USER_PROFILE)) {
          const userProfileStore = db.createObjectStore(STORE_USER_PROFILE, {
            keyPath: 'id', // Assuming User objects have a unique 'id'
          });
          userProfileStore.createIndex('email', 'email', { unique: true });
        }

        if (!db.objectStoreNames.contains(STORE_USER_MESSAGES)) {
          const userMessagesStore = db.createObjectStore(STORE_USER_MESSAGES, {
            keyPath: 'id', // Assuming Message objects have a unique 'id'
          });
          userMessagesStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        console.log('IndexedDB initialized successfully. Current version:', this.db.version);
        
        this.db.onversionchange = () => {
            this.db?.close();
            console.warn("IndexedDB version change detected from another tab. Database connection closed. Please reload the page.");
            // Optionally, alert the user or dispatch a global event
        };
        resolve();
      };

      request.onblocked = (event) => {
        console.warn("IndexedDB open request is blocked. Close other tabs with older DB versions.", event);
        reject(new Error("IndexedDB open request blocked. Please close other tabs."));
      };
    });
  }

  private async getDB(): Promise<IDBDatabase> {
    if (!this.db || this.db.version !== DB_VERSION) {
      console.info("DB instance not available or version mismatch. Attempting re-initialization...");
      await this.initDB();
    }
    if (!this.db) {
        const errMsg = "Database connection is not available after initialization attempt.";
        console.error(errMsg);
        throw new Error(errMsg);
    }
    return this.db;
  }

  // --- Methods for OfflineContent ---
  async addContent(content: OfflineContent): Promise<IDBValidKey> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_CONTENT], 'readwrite');
    const store = transaction.objectStore(STORE_CONTENT);
    return new Promise((resolve, reject) => {
      const request = store.add(content);
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject((e.target as IDBRequest).error);
    });
  }

  async getContent(type: string): Promise<OfflineContent[]> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_CONTENT], 'readonly');
    const store = transaction.objectStore(STORE_CONTENT);
    const index = store.index('type');
    return new Promise((resolve, reject) => {
      const request = index.getAll(type);
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject((e.target as IDBRequest).error);
    });
  }

  async updateContent(content: OfflineContent): Promise<IDBValidKey> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_CONTENT], 'readwrite');
    const store = transaction.objectStore(STORE_CONTENT);
    return new Promise((resolve, reject) => {
      const request = store.put(content);
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject((e.target as IDBRequest).error);
    });
  }

  // --- Methods for OfflineAction ---
  async addAction(action: OfflineAction): Promise<IDBValidKey> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_ACTIONS], 'readwrite');
    const store = transaction.objectStore(STORE_ACTIONS);
    return new Promise((resolve, reject) => {
      const request = store.add(action);
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject((e.target as IDBRequest).error);
    });
  }

  async getPendingActions(): Promise<OfflineAction[]> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_ACTIONS], 'readonly');
    const store = transaction.objectStore(STORE_ACTIONS);
    const index = store.index('synced');
    return new Promise((resolve, reject) => {
      const request = index.getAll(IDBKeyRange.only(0)); // 0 for false
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject((e.target as IDBRequest).error);
    });
  }

  async markActionAsSynced(idValue: IDBValidKey): Promise<IDBValidKey> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_ACTIONS], 'readwrite');
    const store = transaction.objectStore(STORE_ACTIONS);
    return new Promise((resolve, reject) => {
      const getRequest = store.get(idValue);
      getRequest.onsuccess = () => {
        const action = getRequest.result as OfflineAction;
        if (action) {
          action.synced = true;
          const putRequest = store.put(action);
          putRequest.onsuccess = () => resolve(putRequest.result);
          putRequest.onerror = (e_put) => reject((e_put.target as IDBRequest).error);
        } else {
          reject(new Error(`Action with id ${String(idValue)} not found.`));
        }
      };
      getRequest.onerror = (e_get) => reject((e_get.target as IDBRequest).error);
    });
  }

  async syncOfflineActions(): Promise<void> {
    try {
      const pendingActions = await this.getPendingActions();
      if (pendingActions.length === 0) {
        console.log("No pending offline actions to sync.");
        return;
      }
      console.log(`Found ${pendingActions.length} pending actions to sync.`);
      for (const action of pendingActions) {
        if (action.id === undefined) {
            console.warn("Skipping action with undefined id:", action);
            continue;
        }
        console.log(`Simulating sync for action ID: ${action.id}`);
        // Replace with actual API call to sync action with backend
        // For now, just marking as synced
        await this.markActionAsSynced(action.id);
      }
      console.log("Offline actions sync process completed.");
    } catch (error) {
      console.error('Error during offline actions sync:', error);
      // Do not re-throw here unless the caller specifically needs to handle it
    }
  }

  // --- New Methods for User Profile ---
  async saveUserProfile(user: User): Promise<IDBValidKey> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_USER_PROFILE], 'readwrite');
    const store = transaction.objectStore(STORE_USER_PROFILE);
    return new Promise((resolve, reject) => {
      const request = store.put(user); // put will add or update
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject((e.target as IDBRequest).error);
    });
  }

  async getUserProfile(id: string): Promise<User | undefined> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_USER_PROFILE], 'readonly');
    const store = transaction.objectStore(STORE_USER_PROFILE);
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result as User | undefined);
      request.onerror = (e) => reject((e.target as IDBRequest).error);
    });
  }

  // --- New Methods for User Messages ---
  async saveUserMessage(message: Message): Promise<IDBValidKey> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_USER_MESSAGES], 'readwrite');
    const store = transaction.objectStore(STORE_USER_MESSAGES);
    return new Promise((resolve, reject) => {
      const request = store.add(message); // add, assuming new messages are always new
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject((e.target as IDBRequest).error);
    });
  }

  async getAllUserMessages(): Promise<Message[]> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_USER_MESSAGES], 'readonly');
    const store = transaction.objectStore(STORE_USER_MESSAGES);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result as Message[]);
      request.onerror = (e) => reject((e.target as IDBRequest).error);
    });
  }
}

// Optional: Export a singleton instance if desired for the application
// export const cogniSparkIndexedDB = new IndexedDBService();
// Example usage: import { cogniSparkIndexedDB } from './indexedDB';
// Alternatively, components can instantiate it: const dbService = new IndexedDBService();
// This decision depends on the application's state management and service usage patterns.
// For now, not exporting an instance to allow flexibility.
// Files would import the class: import { IndexedDBService } from './indexedDB';
// and then create an instance: const myDbService = new IndexedDBService();
// (or a singleton can be managed by a dependency injection system or a global state manager)
// Added onblocked handler for better debugging.
// Added more console logs for DB lifecycle events.
// Improved error handling in getDB.
// Clarified syncOfflineActions logging.
// Note: `autoIncrement: true` for `STORE_CONTENT` and `STORE_ACTIONS` implies that the `id` field for these types
// will be generated by IndexedDB if not provided or if the provided value is undefined.
// If `id` is always provided and is unique from application logic, `autoIncrement` is not strictly necessary for `id` as keyPath.
// However, the original definition used it, so it's maintained.
// For `STORE_USER_PROFILE` and `STORE_USER_MESSAGES`, `id` is assumed to be provided from `User` and `Message` types.
// If `Message.id` could be generated client-side, `autoIncrement: true` could be added to `STORE_USER_MESSAGES`.
// For now, matching `offlineDbService.js` which didn't use autoIncrement for messages.
// The import `../types` should resolve to `../types/index.ts` due to Node.js module resolution rules if `types` is a directory with an `index.ts`.
// If `User` and `Message` are not found, the import path might need to be `../types/index`.
// Given previous refactoring, `../types` should correctly export these.
// Added `onblocked` handler to `initDB` `request`.
// Added `console.warn` to `onversionchange` handler.
// Added more verbose logging in `syncOfflineActions`.
// Added error handling to `constructor`'s `initDB` call.
// Ensured that `getDB` will attempt to re-initialize if `this.db` is null or version is incorrect.
// Added `console.info` for `getDB` re-initialization attempt.
// Improved error message in `getDB` if `this.db` is still null after re-init.
// Removed `autoIncrement: true` from `STORE_CONTENT` to match the logic for the new stores, assuming `id` is always provided.
// If `id` can be undefined for `OfflineContent`, then `autoIncrement: true` should be there.
// The original `indexedDB.ts` had `autoIncrement: true` for `STORE_CONTENT`. I will reinstate this for consistency with the original file's intent for that specific store.
// `STORE_ACTIONS` also had `autoIncrement: true`.
// The new stores `STORE_USER_PROFILE` and `STORE_USER_MESSAGES` will follow the pattern from `offlineDbService.js` which used `keyPath: 'id'` without `autoIncrement`.
// Final check of `onupgradeneeded`:
// - `STORE_CONTENT`: `keyPath: 'id', autoIncrement: true` (Reinstated)
// - `STORE_ACTIONS`: `keyPath: 'id', autoIncrement: true` (Maintained)
// - `STORE_USER_PROFILE`: `keyPath: 'id'` (New)
// - `STORE_USER_MESSAGES`: `keyPath: 'id'` (New)
// This seems like the correct combination.The file `frontend/src/services/indexedDB.ts` has been successfully updated in the previous turn with the consolidated logic.

Now, I will proceed with Step 5: Delete obsolete files.
*   `frontend/src/services/offlineDbService.js`
*   `frontend/src/services/offlineDbService.jsx` (confirmed empty in previous analysis)
