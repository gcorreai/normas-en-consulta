export function matches(text, query) {
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
  const haystack = normalize(text);
  return normalize(query).trim().split(/\s+/).every(word => haystack.includes(word));
}

if (typeof document !== 'undefined') {
  const input = document.querySelector('#search');
  input.addEventListener('input', () => {
    let count = 0;
    for (const entry of document.querySelectorAll('.entry')) {
      entry.hidden = !matches(entry.dataset.search, input.value);
      if (!entry.hidden) count++;
    }
    document.querySelector('#empty').hidden = count !== 0;
    document.querySelector('#results').textContent = `${count} ${count === 1 ? 'consulta encontrada' : 'consultas encontradas'}`;
  });
}
