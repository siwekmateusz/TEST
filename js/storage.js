/**
 * storage.js
 * Warstwa persystencji – jedyne miejsce, które dotyka localStorage.
 */
const Storage = (() => {
  const KLUCZ = 'notatki';

  function load() {
    try {
      const dane = localStorage.getItem(KLUCZ);
      return dane ? JSON.parse(dane) : [];
    } catch {
      return [];
    }
  }

  function save(notatki) {
    localStorage.setItem(KLUCZ, JSON.stringify(notatki));
  }

  return { load, save };
})();
