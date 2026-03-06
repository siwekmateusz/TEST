/**
 * ui.js
 * Renderowanie DOM: karty notatek, modal, stany puste.
 */
const UI = (() => {
  // ---- Elementy DOM ----
  const listaEl         = () => document.getElementById('lista-notatek');
  const modalOverlay    = () => document.getElementById('modal-overlay');
  const modalTytul      = () => document.getElementById('modal-tytul-naglowek');
  const formularz       = () => document.getElementById('formularz-notatki');
  const poleTytul       = () => document.getElementById('pole-tytul');
  const poleTresc       = () => document.getElementById('pole-tresc');
  const bladTytul       = () => document.getElementById('blad-tytul');

  // ---- Pomocnicze ----
  function formatujDate(isoString) {
    const d = new Date(isoString);
    return d.toLocaleDateString('pl-PL', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  // ---- Renderowanie listy ----
  function renderNoteList(notatki, czyWyszukiwanie = false) {
    const lista = listaEl();
    lista.innerHTML = '';

    if (notatki.length === 0) {
      if (czyWyszukiwanie) {
        lista.appendChild(stanBrakWynikow());
      } else {
        lista.appendChild(stanPusty());
      }
      return;
    }

    notatki.forEach(n => lista.appendChild(renderNoteCard(n)));
  }

  function renderNoteCard(notatka) {
    const karta = document.createElement('article');
    karta.className = 'karta-notatki';
    karta.dataset.id = notatka.id;

    const podglad = notatka.tresc || '';
    const dataZm = formatujDate(notatka.zmieniono);

    karta.innerHTML = `
      <h3 class="karta-tytul">${escapeHtml(notatka.tytul)}</h3>
      ${podglad ? `<p class="karta-podglad">${escapeHtml(podglad)}</p>` : '<p class="karta-podglad" style="opacity:.4;font-style:italic;">Brak treści</p>'}
      <div class="karta-stopka">
        <span class="karta-data">Edytowano: ${dataZm}</span>
        <div class="karta-akcje">
          <button class="btn btn-edytuj" data-akcja="edytuj" data-id="${notatka.id}" title="Edytuj notatkę">&#9998; Edytuj</button>
          <button class="btn btn-usun" data-akcja="usun" data-id="${notatka.id}" title="Usuń notatkę">&#128465; Usuń</button>
        </div>
      </div>
      <div class="potwierdzenie-usuniecia ukryty" data-confirm="${notatka.id}">
        <span>Usunąć tę notatkę?</span>
        <button class="btn-anuluj-usuniecie" data-akcja="anuluj-usun" data-id="${notatka.id}">Nie</button>
        <button class="btn-potwierdzenie-usun" data-akcja="potwierdz-usun" data-id="${notatka.id}">Tak, usuń</button>
      </div>
    `;
    return karta;
  }

  // ---- Stany puste ----
  function stanPusty() {
    const el = document.createElement('div');
    el.className = 'stan-pusty';
    el.innerHTML = `
      <span class="stan-pusty-ikona">&#128221;</span>
      <h3>Nie masz jeszcze żadnych notatek</h3>
      <p>Kliknij „+ Nowa notatka", aby dodać pierwszą.</p>
    `;
    return el;
  }

  function stanBrakWynikow() {
    const el = document.createElement('div');
    el.className = 'stan-pusty';
    el.innerHTML = `
      <span class="stan-pusty-ikona">&#128269;</span>
      <h3>Nie znaleziono notatek</h3>
      <p>Spróbuj innego słowa kluczowego.</p>
    `;
    return el;
  }

  // ---- Modal ----
  function showModal(tryb, notatka = null) {
    const overlay = modalOverlay();
    const form = formularz();

    modalTytul().textContent = tryb === 'edytuj' ? 'Edytuj notatkę' : 'Nowa notatka';

    poleTytul().value = notatka ? notatka.tytul : '';
    poleTresc().value = notatka ? notatka.tresc : '';

    // Zapisz id edytowanej notatki na formularzu
    form.dataset.editId = notatka ? notatka.id : '';

    clearValidation();
    overlay.classList.remove('ukryty');
    poleTytul().focus();
  }

  function hideModal() {
    modalOverlay().classList.add('ukryty');
    formularz().dataset.editId = '';
    poleTytul().value = '';
    poleTresc().value = '';
    clearValidation();
  }

  function clearValidation() {
    bladTytul().classList.add('ukryty');
    poleTytul().classList.remove('blad');
  }

  function showTytulError() {
    bladTytul().classList.remove('ukryty');
    poleTytul().classList.add('blad');
    poleTytul().focus();
  }

  // ---- Potwierdzenie usunięcia ----
  function showDeleteConfirm(id) {
    // Najpierw chowamy wszystkie aktywne potwierdzenia
    document.querySelectorAll('.potwierdzenie-usuniecia').forEach(el => {
      el.classList.add('ukryty');
    });
    const el = document.querySelector(`.potwierdzenie-usuniecia[data-confirm="${id}"]`);
    if (el) el.classList.remove('ukryty');
  }

  function hideDeleteConfirm(id) {
    const el = document.querySelector(`.potwierdzenie-usuniecia[data-confirm="${id}"]`);
    if (el) el.classList.add('ukryty');
  }

  // ---- Narzędzia ----
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getFormData() {
    return {
      tytul:  poleTytul().value,
      tresc:  poleTresc().value,
      editId: formularz().dataset.editId,
    };
  }

  return {
    renderNoteList,
    showModal,
    hideModal,
    showTytulError,
    showDeleteConfirm,
    hideDeleteConfirm,
    getFormData,
  };
})();
