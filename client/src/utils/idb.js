export default function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('tenpai-buddy', 1);
    let db;
    let tx;
    let store;

    request.onupgradeneeded = () => {
      db = request.result;
      db.createObjectStore('scores', {keyPath: '_id'});
      db.createObjectStore('profiles', {keyPath: '_id'});
    };

    request.onerror = (error) => {
      console.error(`idb error: ${error.message}`);
    };

    request.onsucess = () => {
      db = request.result;
      tx = db.transaction(storeName);
      store = tx.objectStore(storeName);

      db.onerror = (error) => {
        console.error(`idb error: ${error.message}`);
      };
      switch (method) {
        case 'put': {
          store.put(object);
          resolve(object);
          break;
        }
        case 'get': {
          const all = store.getAll();
          all.onsucess = () => resolve(all.result);
          break;
        }
        case 'delete': {
          store.delete(object._id);
          break;
        }
        default: {
          console.error(`Unknown idbPromise method: "${method}"`);
          break;
        }
      }
      tx.oncomplete = () => db.close();
    };
  });
}
