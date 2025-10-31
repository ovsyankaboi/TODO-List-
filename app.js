(() => {
  const css = `
:root {
  --bg: #ffffff;
  --panel: #ffffff;
  --muted: #6b7280;      
  --text: #111827;       
  --brand: #ff7a00;      
  --accent: #16a34a;     
  --accent-2: #2563eb;   
  --danger: #ef4444;     
  --warn: #f59e0b;
  --border: #e5e7eb;     
  --shadow: rgba(0,0,0,0.08);
}

* { box-sizing: border-box; }

html, body {
  height: 100%;
  margin: 0;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  background: var(--bg);
  color: var(--text);
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 16px;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 12px 0 20px 0;
}

h1 {
  margin: 0;
  font-size: 28px;
  letter-spacing: 0.3px;
  color: var(--brand); 
}

.toolbar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  background: #f8fafc;
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 14px;
  cursor: pointer;
  transition: transform .1s ease, background .2s ease, border-color .2s ease;
  box-shadow: 0 4px 12px var(--shadow);
}
.btn:hover { background: #f1f5f9; transform: translateY(-1px); }
.btn:active { transform: translateY(0); }
.btn--accent { border-color: var(--accent); }
.btn--danger { border-color: var(--danger); color: #b91c1c; }
.btn__icon { margin-right: 8px; } 

.panel {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 8px 24px var(--shadow);
  padding: 16px;
}

.form {
  display: grid;
  grid-template-columns: 1fr 160px 120px;
  gap: 10px;
}
.form input[type="text"],
.form input[type="date"],
.controls input[type="search"], 
.select,
.select select {
  width: 100%;
  background: #ffffff;
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 12px;
  outline: none;
}

.controls input[type="search"] {
  border-radius: 20px;
}
.form .btn-add { grid-column: span 3; }
.form .btn-add {
  border-color: var(--brand);
}
.controls {
  display: grid;
  grid-template-columns: 1fr 160px 180px 160px;
  gap: 10px;
  margin-top: 16px;
}

.list {
  margin-top: 16px;
  display: grid;
  gap: 8px;
}

.item {
  display: grid;
  grid-template-columns: 28px 1fr 140px auto;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 10px 12px;
  box-shadow: 0 4px 14px var(--shadow);
}
.item.dragging { opacity: .6; border-style: dashed; }
.handle {
  width: 12px;
  height: 20px;
  background: linear-gradient(90deg, #cbd5e1 2px, transparent 2px) repeat-x,
              linear-gradient(0deg, #cbd5e1 2px, transparent 2px) repeat-y;
  background-size: 4px 100%, 100% 4px;
  border-radius: 4px;
  margin-right: 8px;
  cursor: grab;
}
.checkbox { width: 18px; height: 18px; accent-color: var(--accent); }

.title { font-size: 16px; line-height: 1.3; color: var(--text); }
.title.done { text-decoration: line-through; color: var(--muted); }

.date { color: var(--muted); font-size: 14px; }

.actions { display: flex; gap: 6px; }
.icon-btn {
  background: #ffffff;
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: 10px;
  padding: 6px 8px;
  cursor: pointer;
}
.icon-btn:hover { border-color: var(--accent-2); }

footer {
  margin: 28px 0 12px;
  color: var(--muted);
  text-align: center;
  font-size: 14px;
}

@media (max-width: 700px) {
  .form { grid-template-columns: 1fr; }
  .form .btn-add { grid-column: span 1; }
  .controls { grid-template-columns: 1fr; }
  .item { grid-template-columns: 28px 1fr; grid-auto-rows: auto; }
  .date { justify-self: start; margin-left: 28px; }
  .actions { justify-self: end; grid-column: span 2; }
}
`;

  const styleEl = document.createElement('style');
  const faviconPng = document.createElement('link');
  faviconPng.setAttribute('rel', 'icon');
  faviconPng.setAttribute('type', 'image/png');
  faviconPng.setAttribute('href', './favicon.png'); 
  document.head.appendChild(faviconPng);
  const appleTouch = document.createElement('link');
  appleTouch.setAttribute('rel', 'apple-touch-icon');
  appleTouch.setAttribute('href', './favicon.png');
  document.head.appendChild(appleTouch);
  styleEl.appendChild(document.createTextNode(css));
  document.head.appendChild(styleEl);
  let tasks = window.todoData.loadTasks(); 
  let filterStatus = 'all';   
  let sortMode = 'dateAsc';   
  let searchQuery = '';

  const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0);

  const save = () => window.todoData.saveTasks(tasks);

  const formatDate = (yyyyMMdd) => {
    if (!yyyyMMdd) return '';
    const [y,m,d] = yyyyMMdd.split('-');
    return `${d}.${m}.${y}`;
  };

  const filteredSortedSearched = () => {
    let list = tasks.slice();
    const q = searchQuery.trim().toLowerCase();
    if (q) list = list.filter(t => t.title.toLowerCase().includes(q));
    if (filterStatus === 'done') list = list.filter(t => t.done);
    if (filterStatus === 'active') list = list.filter(t => !t.done);
    const byDate = (a, b) => (a.date || '').localeCompare(b.date || '');
    const byCreated = (a, b) => (a.createdAt || 0) - (b.createdAt || 0);
    if (sortMode === 'dateAsc') list.sort((a,b) => byDate(a,b) || byOrder(a,b));
    if (sortMode === 'dateDesc') list.sort((a,b) => byDate(b,a) || byOrder(a,b));
    if (sortMode === 'createdAsc') list.sort((a,b) => byCreated(a,b) || byOrder(a,b));
    if (sortMode === 'createdDesc') list.sort((a,b) => byCreated(b,a) || byOrder(a,b));

    return list;
  };

  const findTask = (id) => tasks.find(t => t.id === id);

  const container = document.createElement('div');
  container.className = 'container';
  document.body.appendChild(container);

  const header = document.createElement('header');
  const h1 = document.createElement('h1'); h1.textContent = 'To-Do list';
  const headerTools = document.createElement('div'); headerTools.className = 'toolbar';
  const btnReset = document.createElement('button'); 
  btnReset.className = 'btn btn--danger'; 
  btnReset.setAttribute('type','button');
  const resetIcon = document.createElement('span');
  resetIcon.className = 'btn__icon';
  resetIcon.setAttribute('aria-hidden','true');
  resetIcon.textContent = '🗑️';
  const resetText = document.createTextNode('Сброс');
  btnReset.appendChild(resetIcon);
  btnReset.appendChild(resetText);
  headerTools.appendChild(btnReset);
  header.appendChild(h1);
  header.appendChild(headerTools);
  container.appendChild(header);

  const panel = document.createElement('section'); panel.className = 'panel';
  container.appendChild(panel);
  const form = document.createElement('form'); form.className = 'form'; form.setAttribute('aria-label', 'Форма добавления задачи');
  const inputTitle = document.createElement('input'); inputTitle.type = 'text'; inputTitle.placeholder = 'Название задачи'; inputTitle.required = true; inputTitle.setAttribute('autocomplete', 'off');
  const inputDate = document.createElement('input'); inputDate.type = 'date'; inputDate.setAttribute('aria-label', 'Дата');
  const btnAdd = document.createElement('button'); btnAdd.className = 'btn btn--accent btn-add'; btnAdd.type = 'submit'; btnAdd.textContent = 'Добавить задачу';
  form.appendChild(inputTitle);
  form.appendChild(inputDate);
  form.appendChild(btnAdd);
  panel.appendChild(form);

  const controls = document.createElement('div'); controls.className = 'controls';
  const search = document.createElement('input'); search.type = 'search'; search.placeholder = 'Поиск по названию…';

  const selectSortWrap = document.createElement('div'); selectSortWrap.className = 'select';
  const selectSort = document.createElement('select');
  [
    {v:'dateAsc', label:'Сортировка: дата ↑'},
    {v:'dateDesc', label:'Сортировка: дата ↓'},
    {v:'createdAsc', label:'Сортировка: создано ↑'},
    {v:'createdDesc', label:'Сортировка: создано ↓'},
  ].forEach(opt => {
    const o = document.createElement('option'); o.value = opt.v; o.textContent = opt.label;
    selectSort.appendChild(o);
  });
  selectSort.value = sortMode;
  selectSortWrap.appendChild(selectSort);

  const selectFilterWrap = document.createElement('div'); selectFilterWrap.className = 'select';
  const selectFilter = document.createElement('select');
  [
    {v:'all', label:'Фильтр: все'},
    {v:'active', label:'Фильтр: невыполненные'},
    {v:'done', label:'Фильтр: выполненные'},
  ].forEach(opt => {
    const o = document.createElement('option'); o.value = opt.v; o.textContent = opt.label;
    selectFilter.appendChild(o);
  });
  selectFilter.value = filterStatus;
  selectFilterWrap.appendChild(selectFilter);

  controls.appendChild(search);
  controls.appendChild(selectSortWrap);
  controls.appendChild(selectFilterWrap);

  panel.appendChild(controls);

  const list = document.createElement('div'); list.className = 'list'; list.setAttribute('aria-live', 'polite');
  panel.appendChild(list);
  const renderItem = (task) => {
    const item = document.createElement('div');
    item.className = 'item';
    item.setAttribute('draggable', 'true');
    item.dataset.id = task.id;

    const handle = document.createElement('div'); handle.className = 'handle'; handle.setAttribute('title', 'Перетащи, чтобы изменить порядок');
    const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.className = 'checkbox'; checkbox.checked = !!task.done; checkbox.setAttribute('aria-label','Отметить как выполнено');

    const title = document.createElement('div'); title.className = 'title'; title.textContent = task.title;
    if (task.done) title.classList.add('done');

    const date = document.createElement('div'); date.className = 'date';
    date.textContent = task.date ? formatDate(task.date) : 'Без даты';

    const actions = document.createElement('div'); actions.className = 'actions';
    const btnEdit = document.createElement('button'); btnEdit.className = 'icon-btn'; btnEdit.type = 'button'; btnEdit.textContent = '✏️';
    const btnDelete = document.createElement('button'); btnDelete.className = 'icon-btn'; btnDelete.type = 'button'; btnDelete.textContent = '🗑️';

    actions.appendChild(btnEdit);
    actions.appendChild(btnDelete);

    item.appendChild(handle);
    item.appendChild(checkbox);
    item.appendChild(title);
    item.appendChild(date);
    item.appendChild(actions);

    checkbox.addEventListener('change', () => {
      const t = findTask(task.id); if (!t) return;
      t.done = checkbox.checked;
      if (t.done) title.classList.add('done'); else title.classList.remove('done');
      save();
    });

    btnEdit.addEventListener('click', () => {
      const inputEdit = document.createElement('input'); inputEdit.type = 'text'; inputEdit.value = task.title; inputEdit.setAttribute('aria-label','Редактировать название');
      const inputDateEdit = document.createElement('input'); inputDateEdit.type = 'date'; inputDateEdit.value = task.date || '';
      const btnSave = document.createElement('button'); btnSave.className = 'icon-btn'; btnSave.type = 'button'; btnSave.textContent = '💾';
      const btnCancel = document.createElement('button'); btnCancel.className = 'icon-btn'; btnCancel.type = 'button'; btnCancel.textContent = '↩️';
      const editPanel = document.createElement('div');
      editPanel.style.display = 'grid';
      editPanel.style.gridTemplateColumns = '1fr 140px auto auto';
      editPanel.style.gap = '6px';
      editPanel.appendChild(inputEdit);
      editPanel.appendChild(inputDateEdit);
      editPanel.appendChild(btnSave);
      editPanel.appendChild(btnCancel);
      const oldTitle = title;
      const oldDate = date;
      const oldActions = actions;

      item.replaceChild(editPanel, oldTitle);
      item.replaceChild(document.createElement('div'), oldDate); 
      item.replaceChild(document.createElement('div'), oldActions);

      const restoreView = () => {
        item.replaceChild(oldTitle, editPanel);
        item.replaceChild(oldDate, item.children[3]);
        item.replaceChild(oldActions, item.children[4]);
      };

      btnSave.addEventListener('click', () => {
        const newTitle = inputEdit.value.trim();
        const newDate = inputDateEdit.value || '';
        if (!newTitle) { restoreView(); return; } 
        const t = findTask(task.id); if (!t) { restoreView(); return; }
        t.title = newTitle;
        t.date = newDate;
        save();
        title.textContent = t.title;
        date.textContent = t.date ? formatDate(t.date) : 'Без даты';
        restoreView();
      });

      btnCancel.addEventListener('click', restoreView);
    });

    // удаление
    btnDelete.addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      save();
      renderList(); 
    });

    // drag-and-drop
    item.addEventListener('dragstart', (e) => {
      if (e.target !== item && e.target !== handle) return; 
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', task.id);
    });
    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
    });

    return item;
  };

  const renderList = () => {
    while (list.firstChild) list.removeChild(list.firstChild);

    const arr = filteredSortedSearched();

    arr.forEach(t => {
      const el = renderItem(t);
      list.appendChild(el);
    });
  };

  // добаить задачку 
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = inputTitle.value.trim();
    const date = inputDate.value || '';
    if (!title) return; 

    const maxOrder = tasks.length ? Math.max(...tasks.map(t => t.order ?? 0)) : -1;
    const t = {
      id: window.todoData.uid(),
      title,
      date,
      done: false,
      createdAt: Date.now(),
      order: maxOrder + 1
    };
    tasks.push(t);
    save();

    inputTitle.value = '';
    inputDate.value = '';
    renderList();
  });

  // поиск
  search.addEventListener('input', () => {
    searchQuery = search.value;
    renderList();
  });

  // sort
  selectSort.addEventListener('change', () => {
    sortMode = selectSort.value;
    renderList();
  });

  // фильтр
  selectFilter.addEventListener('change', () => {
    filterStatus = selectFilter.value;
    renderList();
  });

  // сброс 
  btnReset.addEventListener('click', () => {
    localStorage.removeItem('todo__tasks_v1');
    tasks = window.todoData.loadTasks();
    renderList();
  });

  // вычисить позицию вставки
  const getDragAfterElement = (container, y) => {
    const draggableElements = [...container.querySelectorAll('.item:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - (box.top + box.height / 2);
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  };

  list.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(list, e.clientY);
    const draggable = document.querySelector('.dragging');
    if (!draggable) return;
    if (afterElement == null) {
      list.appendChild(draggable);
    } else {
      list.insertBefore(draggable, afterElement);
    }
  });

  list.addEventListener('drop', () => {
    const ids = [...list.querySelectorAll('.item')].map(el => el.dataset.id);
    ids.forEach((id, idx) => {
      const t = findTask(id);
      if (t) t.order = idx;
    });
    save();
    renderList();
  });

  renderList();
})();
