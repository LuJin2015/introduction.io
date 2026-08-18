const cards = document.querySelectorAll('.scratch-card');

async function loadProjectName(card) {
  const id = card.dataset.projectId;
  const title = card.querySelector('.project-title');
  try {
    const response = await fetch(`https://api.scratch.mit.edu/projects/${id}`);
    if (!response.ok) throw new Error('Scratch API request failed');
    const project = await response.json();
    title.textContent = project.title || `Scratch Project ${id}`;
  } catch {
    title.textContent = `Scratch Project ${id}`;
  }
}

function showUnavailable(card) {
  const id = card.dataset.projectId;
  const placeholder = card.querySelector('.scratch-placeholder');
  placeholder.innerHTML = `<div class="placeholder-icon">⚠️</div><p>This Scratch project could not be loaded.</p><a class="load-button" href="https://scratch.mit.edu/projects/${id}/" target="_blank" rel="noopener">Open on Scratch</a>`;
}

function loadProject(card) {
  if (card.dataset.loaded === 'true') return;
  const id = card.dataset.projectId;
  const placeholder = card.querySelector('.scratch-placeholder');
  const iframe = document.createElement('iframe');
  iframe.src = `https://scratch.mit.edu/projects/${id}/embed?autostart=false`;
  iframe.title = card.querySelector('.project-title').textContent;
  iframe.allowTransparency = true;
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('scrolling', 'no');
  iframe.allowFullscreen = true;
  iframe.addEventListener('error', () => showUnavailable(card), { once: true });
  placeholder.replaceWith(iframe);
  card.dataset.loaded = 'true';
}

cards.forEach(card => {
  loadProjectName(card);
  card.querySelector('.load-button').addEventListener('click', () => loadProject(card));
});
