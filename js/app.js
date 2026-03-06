/**
 * app.js
 * Bootstrap: inicjalizacja i obsługa wszystkich zdarzeń.
 */
document.addEventListener('DOMContentLoaded', () => {

  // ---- Inicjalizacja ----
  Notes.init();
  UI.renderNoteList(Notes.getAll());

  // ---- Pomocnicze ----
  let aktywneZapytanie = '';

  function odswiez() {
    if (aktywneZapytanie) {
      UI.renderNoteList(Notes.search(aktywneZapytanie), true);
    } else {
      UI.renderNoteList(Notes.getAll());
    }
  }

  // ---- Przycisk "Nowa notatka" ----
  document.getElementById('btn-nowa-notatka').addEventListener('click', () => {
    UI.showModal('nowa');
  });

  // ---- Zamknięcie modalu ----
  document.getElementById('btn-zamknij-modal').addEventListener('click', UI.hideModal);
  document.getElementById('btn-anuluj').addEventListener('click', UI.hideModal);

  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) UI.hideModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') UI.hideModal();
  });

  // ---- Submit formularza (Utwórz / Zaktualizuj) ----
  document.getElementById('formularz-notatki').addEventListener('submit', (e) => {
    e.preventDefault();
    const { tytul, tresc, editId } = UI.getFormData();

    if (!tytul.trim()) {
      UI.showTytulError();
      return;
    }

    if (editId) {
      Notes.update(editId, tytul, tresc);
    } else {
      Notes.create(tytul, tresc);
    }

    UI.hideModal();
    odswiez();
  });

  // ---- Wyszukiwarka (debounce 200ms) ----
  let debounceTimer = null;
  document.getElementById('wyszukiwarka').addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      aktywneZapytanie = e.target.value;
      odswiez();
    }, 200);
  });

  // ---- Event delegation na siatce kart ----
  document.getElementById('lista-notatek').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-akcja]');
    if (!btn) return;

    const akcja = btn.dataset.akcja;
    const id    = btn.dataset.id;

    if (akcja === 'edytuj') {
      const notatka = Notes.getById(id);
      if (notatka) UI.showModal('edytuj', notatka);
    }

    if (akcja === 'usun') {
      UI.showDeleteConfirm(id);
    }

    if (akcja === 'anuluj-usun') {
      UI.hideDeleteConfirm(id);
    }

    if (akcja === 'potwierdz-usun') {
      Notes.remove(id);
      odswiez();
    }
  });

});
