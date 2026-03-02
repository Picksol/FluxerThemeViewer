// ─────────────────────────────────────────────
// FLUXER THEME BROWSER — script.js
// Loads themes from ../res/themes.json at runtime.
// To add a new theme, append an object to themes.json following the same schema.
// ─────────────────────────────────────────────

let themes = [];
let activeFilter = 'all';
let allTags = new Set();

// ─────────────────────────────────────────────
// BOOT — fetch themes then render
// ─────────────────────────────────────────────
async function init() {
  try {
    // Path relative to site.html location: ../res/themes.json
    const res = await fetch('./res/themes.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    themes = await res.json();

    // Collect all unique tags across themes
    themes.forEach(t => (t.tags || []).forEach(tag => allTags.add(tag)));

    // Update count stat
    document.getElementById('count').textContent = themes.length;

    // Build filter buttons dynamically from tags
    buildFilterBar();

    // Hide loading, show filter bar + grid
    document.getElementById('loading-state').style.display = 'none';
    document.querySelector('.filter-bar').style.display = 'flex';

    renderGrid('all');
  } catch (err) {
    document.getElementById('loading-state').style.display = 'none';
    const errEl = document.getElementById('error-state');
    errEl.style.display = 'block';
    errEl.innerHTML = `
      <strong>Couldn't load themes.json</strong><br>
      <span style="color:#9090b0;font-size:13px;margin-top:8px;display:block;">
        Make sure <code>./res/themes.json</code> exists relative to <code>./site.html</code>.<br>
        If you're opening the file directly (file://), try a local server or GitHub Pages.<br><br>
        Error: ${err.message}
      </span>
    `;
  }
}

// ─────────────────────────────────────────────
// BUILD FILTER BAR
// ─────────────────────────────────────────────
function buildFilterBar() {
  const bar = document.querySelector('.filter-bar');
  const label = bar.querySelector('.filter-label');

  // Remove any existing buttons (keep the label)
  bar.querySelectorAll('.filter-btn').forEach(b => b.remove());

  // Always-first "All" button
  const allBtn = makeFilterBtn('All', 'all', true);
  bar.appendChild(allBtn);

  // One button per unique tag, sorted alphabetically
  [...allTags].sort().forEach(tag => {
    bar.appendChild(makeFilterBtn(capitalize(tag), tag, false));
  });

  bar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderGrid(activeFilter);
    });
  });
}

function makeFilterBtn(label, filter, isActive) {
  const btn = document.createElement('button');
  btn.className = 'filter-btn' + (isActive ? ' active' : '');
  btn.dataset.filter = filter;
  btn.textContent = label;
  return btn;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─────────────────────────────────────────────
// BUILD MOCK UI
// ─────────────────────────────────────────────
function buildMock(t) {
  const s = (key) => t[key] || '#888';
  const avatarColors = t.avatarColors || ['#888', '#999', '#aaa'];

  return `
  <div class="mock" style="background:${s('bg1')};">
    <!-- Server sidebar -->
    <div class="mock-sidebar" style="background:${s('bg3')};">
      <div class="mock-guild active" style="background:${s('accent')};color:${s('bg3')};font-size:9px;">F</div>
      <div class="mock-guild-sep" style="background:${s('textMid')};"></div>
      <div class="mock-guild" style="background:${s('bg1')};color:${s('textMid')};font-size:9px;">G</div>
      <div class="mock-guild" style="background:${avatarColors[1] || s('accent2')};opacity:0.7;font-size:9px;"></div>
    </div>

    <!-- Channel list -->
    <div class="mock-channels" style="background:${s('bg2')};">
      <div class="mock-server-name" style="color:${s('text')};border-color:${s('border')};">
        <span>My Server</span>
        <span style="opacity:0.5;font-size:9px;">⌄</span>
      </div>
      <div class="mock-category" style="color:${s('textMid')};">TEXT CHANNELS</div>
      <div class="mock-channel" style="color:${s('textMid')};">
        <span class="mock-channel-icon">#</span> general
      </div>
      <div class="mock-channel active" style="background:${s('accent')}20;color:${s('text')};border-radius:4px;">
        <span class="mock-channel-icon" style="color:${s('accent')};">#</span>
        <span style="color:${s('accent')};">random</span>
      </div>
      <div class="mock-channel" style="color:${s('textMid')};">
        <span class="mock-channel-icon">#</span> off-topic
      </div>
    </div>

    <!-- Chat -->
    <div class="mock-chat" style="background:${s('bg1')};">
      <div class="mock-chat-header" style="color:${s('text')};border-color:${s('border')}20;background:${s('bg1')};">
        <span style="color:${s('accent')};">#</span> random
        <span style="margin-left:auto;opacity:0.4;font-size:9px;">🔍 📌 👥</span>
      </div>
      <div class="mock-messages">
        <div class="mock-message">
          <div class="mock-avatar" style="background:${avatarColors[0]};color:${s('bg3')};">A</div>
          <div class="mock-msg-body">
            <span class="mock-msg-name" style="color:${avatarColors[0]};">Alice</span>
            <div class="mock-msg-text" style="color:${s('text')};">Hey, have you tried the new theme yet?</div>
          </div>
        </div>
        <div class="mock-message">
          <div class="mock-avatar" style="background:${avatarColors[1]};color:${s('bg3')};">B</div>
          <div class="mock-msg-body">
            <span class="mock-msg-name" style="color:${avatarColors[1]};">Bob</span>
            <div class="mock-msg-text" style="color:${s('text')};">Yes! Looks amazing 🎨</div>
            <div class="mock-bubble" style="background:${s('textMid')};width:60%;"></div>
          </div>
        </div>
      </div>
      <div class="mock-input-area">
        <div class="mock-input" style="background:${s('input')};border-color:${s('border')};">
          <span style="opacity:0.3;color:${s('text')};">+</span>
          <span class="mock-input-text" style="color:${s('textMid')};">Message #random</span>
          <span style="margin-left:auto;opacity:0.3;color:${s('text')};">😊</span>
        </div>
      </div>
    </div>

    <!-- User bar -->
    <div class="mock-userbar" style="background:${s('bg3')};">
      <div class="mock-avatar-sm" style="background:${s('accent2')};">
        <div class="mock-status-dot" style="background:${s('online')};border-color:${s('bg3')};"></div>
      </div>
      <div>
        <div class="mock-username" style="color:${s('text')};">you</div>
        <div class="mock-discrim" style="color:${s('textMid')};">online</div>
      </div>
    </div>
  </div>`;
}

// ─────────────────────────────────────────────
// RENDER GRID
// ─────────────────────────────────────────────
function renderGrid(filter) {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  const filtered = filter === 'all'
    ? themes
    : themes.filter(t => (t.tags || []).includes(filter));

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty">No themes match this filter.</div>';
    return;
  }

  filtered.forEach((t, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.tags = (t.tags || []).join(',');

    const tagHtml = (t.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('');

    card.innerHTML = `
      ${buildMock(t)}
      <div class="card-info">
        <div>
          <div class="card-name">${t.name}</div>
          <div class="card-tags">${tagHtml}</div>
        </div>
        <button class="copy-btn" data-idx="${i}">copy css</button>
      </div>
    `;

    grid.appendChild(card);
  });

  // Copy button listeners
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx);
      const theme = filtered[idx];
      try {
        await navigator.clipboard.writeText(theme.css);
        btn.textContent = '✓ copied!';
        btn.classList.add('copied');
        showToast(`"${theme.name}" copied to clipboard`);
        setTimeout(() => {
          btn.textContent = 'copy css';
          btn.classList.remove('copied');
        }, 2000);
      } catch {
        btn.textContent = 'copy failed';
        setTimeout(() => { btn.textContent = 'copy css'; }, 2000);
      }
    });
  });
}

// ─────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = '✓ ' + msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ─────────────────────────────────────────────
// START
// ─────────────────────────────────────────────
init();