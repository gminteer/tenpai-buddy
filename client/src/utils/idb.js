export default function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('tenpai-buddy', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore('scores', {keyPath: '_id'});
      db.createObjectStore('me', {keyPath: '_id'});
    };

    request.onerror = (event) => reject(event.target.errorCode);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      db.onerror = (event) => reject(event.target.errorCode);
      tx.oncomplete = () => db.close();

      switch (method) {
        case 'put': {
          store.put(object);
          resolve(object);
          break;
        }
        case 'get': {
          const all = store.getAll();
          all.onsuccess = () => resolve(all.result);
          break;
        }
        case 'delete': {
          store.delete(object._id);
          resolve();
          break;
        }
        default: {
          reject(`Unknown method: "${method}"`);
          break;
        }
      }
    };
  });
}
