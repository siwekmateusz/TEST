/**
 * notes.js
 * Logika biznesowa: CRUD + wyszukiwanie.
 * Trzyma notatki w pamięci i synchronizuje z Storage po każdej mutacji.
 */
const Notes = (() => {
  let notatki = [];

  function init() {
    notatki = Storage.load();
  }

  function getAll() {
    return notatki;
  }

  function search(zapytanie) {
    const q = zapytanie.trim().toLowerCase();
    if (!q) return notatki;
    return notatki.filter(n =>
      n.tytul.toLowerCase().includes(q) ||
      n.tresc.toLowerCase().includes(q)
    );
  }

  function create(tytul, tresc) {
    const notatka = {
      id:        crypto.randomUUID(),
      tytul:     tytul.trim(),
      tresc:     tresc.trim(),
      utworzono: new Date().toISOString(),
      zmieniono: new Date().toISOString(),
    };
    notatki.unshift(notatka);
    Storage.save(notatki);
    return notatka;
  }

  function update(id, tytul, tresc) {
    const idx = notatki.findIndex(n => n.id === id);
    if (idx === -1) return null;
    notatki[idx] = {
      ...notatki[idx],
      tytul:     tytul.trim(),
      tresc:     tresc.trim(),
      zmieniono: new Date().toISOString(),
    };
    Storage.save(notatki);
    return notatki[idx];
  }

  function remove(id) {
    const idx = notatki.findIndex(n => n.id === id);
    if (idx === -1) return false;
    notatki.splice(idx, 1);
    Storage.save(notatki);
    return true;
  }

  function getById(id) {
    return notatki.find(n => n.id === id) || null;
  }

  return { init, getAll, search, create, update, remove, getById };
})();
