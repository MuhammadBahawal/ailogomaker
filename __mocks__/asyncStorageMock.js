const storage = new Map();

const AsyncStorage = {
  clear: jest.fn(async () => {
    storage.clear();
  }),
  getItem: jest.fn(async key => {
    return storage.has(key) ? storage.get(key) : null;
  }),
  removeItem: jest.fn(async key => {
    storage.delete(key);
  }),
  setItem: jest.fn(async (key, value) => {
    storage.set(key, value);
  }),
};

module.exports = AsyncStorage;
