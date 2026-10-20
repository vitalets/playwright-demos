const list = document.querySelector('ul');
const form = document.querySelector('form');
const input = form.querySelector('input');
let todos = [];
let removing = false;

function render() {
  list.replaceChildren();
  todos.forEach((todo, index) => {
    const item = document.createElement('li');
    const text = document.createElement('span');
    text.textContent = todo.name;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'remove';
    remove.textContent = '×';
    remove.setAttribute('aria-label', `Delete ${todo.name}`);
    remove.title = 'Delete task';
    remove.addEventListener('click', async () => {
      if (removing) return;
      removing = true;
      list.querySelectorAll('button').forEach(button => { button.disabled = true; });
      todos.splice(index, 1);
      try {
        await Promise.all([
          chrome.storage.local.set({ todos }),
          item.animate([
            { height: `${item.getBoundingClientRect().height}px`, opacity: 1 },
            { height: '0px', paddingTop: '0px', paddingBottom: '0px', borderWidth: '0px', opacity: 0, transform: 'translateX(12px)' },
          ], {
            duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 420,
            easing: 'ease-in-out',
            fill: 'forwards',
          }).finished,
        ]);
      } finally {
        removing = false;
        render();
      }
    });
    item.append(text, remove);
    list.append(item);
  });
}

chrome.storage.local.get({ todos: [] }).then(result => {
  todos = result.todos;
  render();
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (removing) return;
    const todo = input.value.trim();
    if (!todo) return;
    todos.push({ name: todo, done: false });
    await chrome.storage.local.set({ todos });
    input.value = '';
    render();
  });
});
