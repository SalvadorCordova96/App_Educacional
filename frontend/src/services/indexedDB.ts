// frontend/src/services/indexedDB.ts
import { OfflineContent, OfflineAction } from '../types';

const DB_NAME = 'CogniSparkDB';
const DB_VERSION = 1;
const STORE_CONTENT = 'offline-content';
const STORE_ACTIONS = 'offline-actions';

export class IndexedDBService {
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDB();
  }

  private initDB() {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Error al abrir IndexedDB:', event);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Crear store para contenido offline
      if (!db.objectStoreNames.contains(STORE_CONTENT)) {
        const contentStore = db.createObjectStore(STORE_CONTENT, {
          keyPath: 'id',
          autoIncrement: true,
        });
        contentStore.createIndex('type', 'type', { unique: false });
        contentStore.createIndex('lastSync', 'lastSync', { unique: false });
      }

      // Crear store para acciones offline
      if (!db.objectStoreNames.contains(STORE_ACTIONS)) {
        const actionsStore = db.createObjectStore(STORE_ACTIONS, {
          keyPath: 'id',
          autoIncrement: true,
        });
        actionsStore.createIndex('type', 'type', { unique: false });
        actionsStore.createIndex('synced', 'synced', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
    };
  }

  private getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve(this.db);
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result);
      request.onerror = (event) => reject(event);
    });
  }

  // Métodos para contenido offline
  async addContent(content: OfflineContent): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_CONTENT], 'readwrite');
    const store = transaction.objectStore(STORE_CONTENT);
    await store.add(content);
  }

  async getContent(type: string): Promise<OfflineContent[]> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_CONTENT], 'readonly');
    const store = transaction.objectStore(STORE_CONTENT);
    const index = store.index('type');
    return await index.getAll(type);
  }

  async updateContent(content: OfflineContent): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_CONTENT], 'readwrite');
    const store = transaction.objectStore(STORE_CONTENT);
    await store.put(content);
  }

  // Métodos para acciones offline
  async addAction(action: OfflineAction): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_ACTIONS], 'readwrite');
    const store = transaction.objectStore(STORE_ACTIONS);
    await store.add(action);
  }

  async getPendingActions(): Promise<OfflineAction[]> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_ACTIONS], 'readonly');
    const store = transaction.objectStore(STORE_ACTIONS);
    const index = store.index('synced');
    return await index.getAll(false);
  }

  async markActionAsSynced(id: number): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_ACTIONS], 'readwrite');
    const store = transaction.objectStore(STORE_ACTIONS);
    const action = await store.get(id);
    if (action) {
      action.synced = true;
      await store.put(action);
    }
  }

  // Método para sincronización
  async syncOfflineActions(): Promise<void> {
    try {
      const pendingActions = await this.getPendingActions();
      
      // Aquí iría la lógica para sincronizar con el servidor
      // Simulamos la sincronización para desarrollo
      for (const action of pendingActions) {
        await this.markActionAsSynced(action.id);
      }
    } catch (error) {
      console.error('Error al sincronizar:', error);
    }
  }
}
