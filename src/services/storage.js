const memoryStorage = new Map();

function getStorage() {
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage;
  }

  return {
    getItem(key) {
      return memoryStorage.has(key) ? memoryStorage.get(key) : null;
    },
    setItem(key, value) {
      memoryStorage.set(key, value);
    },
    removeItem(key) {
      memoryStorage.delete(key);
    },
  };
}

export function readJson(key, fallback) {
  const storage = getStorage();
  const raw = storage.getItem(key);

  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJson(key, value) {
  const storage = getStorage();
  storage.setItem(key, JSON.stringify(value));
}

export function readText(key, fallback = "") {
  const storage = getStorage();
  return storage.getItem(key) ?? fallback;
}

export function writeText(key, value) {
  const storage = getStorage();
  storage.setItem(key, value);
}
