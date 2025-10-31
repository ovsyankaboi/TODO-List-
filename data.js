(() => {
  const STORAGE_KEY = 'todo__tasks_v1';
  const uid = () => 't_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  const loadTasks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

  const saveTasks = (tasks) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  };

  window.todoData = {
    uid,
    loadTasks,
    saveTasks,
  };
})();
