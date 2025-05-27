import React from 'react';
import { openDB } from 'idb';

const DB_NAME = 'app-offline-data';
const DB_VERSION = 1;

export const initOfflineDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('user')) {
        const userStore = db.createObjectStore('user', { keyPath: 'id' });
        userStore.createIndex('email', 'email', { unique: true });
      }
      
      if (!db.objectStoreNames.contains('messages')) {
        db.createObjectStore('messages', { keyPath: 'id' });
      }
    }
  });
  return db;
};

export const saveToOfflineDB = async (storeName, data) => {
  const db = await openDB(DB_NAME, DB_VERSION);
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  await store.put(data);
  await tx.done;
};

export const getFromOfflineDB = async (storeName, key) => {
  const db = await openDB(DB_NAME, DB_VERSION);
  return db.get(storeName, key);
};

export const getAllFromOfflineDB = async (storeName) => {
  const db = await openDB(DB_NAME, DB_VERSION);
  return db.getAll(storeName);
};
