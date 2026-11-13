/* Builds the menu markup from window.MENU (menu-data.js).
   Runs synchronously, before the page's other scripts, so they see the finished markup. */
(() => {
  const M = window.MENU;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const slug = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const money = v => '$' + v.toFixed(2);
  M.money = money;
  M.slug = slug;

  /* --- normalise --- */
  const used = new Set();
  M.cats.forEach((c, i) => {
    c.num = String(i + 1).padStart(2, '0');
    c.photo = !!c.banner;
    c.items.forEach(it => {
      it.cat = c;
      let s = slug(it.n);
      if (used.has(s)) s = slug(it.n + ' ' + c.short);
      used.add(s);
      it.slug = s;
      it.sized = it.s != null;
      it.from = it.sized ? it.s : it.p;
      it.priceText = it.sized ? 'S ' + money(it.s) + ' / D ' + money(it.d) : money(it.p);
      it.page = !!it.img;
    });
    c.count = c.items.length;
    // "from" price uses the category's main (photo) dishes when it has any, so a side like Garlic Bread doesn't set it
    const main = c.items.filter(it => it.page);
    c.min = Math.min(...(main.length ? main : c.items).map(it => it.from));
    c.meta = c.count + (c.count === 1 ? ' item' : ' items') + ' · from ' + money(c.min);
  });
  M.byId = Object.fromEntries(M.cats.map(c => [c.id, c]));
  M.products = M.cats.flatMap(c => c.items.filter(it => it.page));
  M.bySlug = Object.fromEntries(M.products.map(it => [it.slug, it]));
  M.find = (cat, name) => M.byId[cat]?.items.find(it => it.n === name);

  /* --- markup helpers (cards use the original card format so the page's scripts can enhance them) --- */
  const card = (it, withDesc = true) =>
    '<article class="pc" data-slug="' + it.slug + '"><div class="ph"><img src="' + esc(it.img) + '" alt="' + esc(it.n) + '" loading="lazy">' +
    (it.badge ? '<em class="bd">' + esc(it.badge) + '</em>' : '') + '</div>' +
    '<b>' + esc(it.n) + '</b>' + (withDesc && it.desc ? '<p>' + esc(it.desc) + '</p>' : '') +
    '<span class="sr-only"> ' + esc(it.cat.title) + '</span>' +
    '<div class="pr"><span>' + (it.sized ? '<small>From</small> ' + money(it.s) : money(it.p)) + '</span>' +
    '<button class="add" aria-label="View ' + esc(it.n) + '">+</button></div></article>';
  const row = it =>
    '<li class="mrow" data-q="' + esc((it.n + ' ' + (it.desc || '') + ' ' + it.cat.title).toLowerCase()) + '">' +
    '<div class="mr-t"><b>' + esc(it.n) + '</b><span class="mr-l" aria-hidden="true"></span><i>' + esc(it.priceText) + '</i></div>' +
    (it.desc ? '<p>' + esc(it.desc) + '</p>' : '') + '</li>';
  const longTitle = c => (c.title.length > 12 ? ' bn-long' : '');

  /* --- popular picks --- */
  const pop = document.getElementById('popular-grid');
  if (pop) pop.innerHTML = M.popular.map(([cat, name]) => M.find(cat, name)).filter(Boolean).map(it => card(it, false)).join('');

  /* --- category tabs + "All" button --- */
  const row$ = document.getElementById('catrow');
  row$.innerHTML = '<a href="#popular" data-tab="popular">Popular</a>' +
    M.cats.map(c => '<a href="#' + c.id + '" data-tab="' + c.id + '">' + esc(c.short) + '<sup>' + c.count + '</sup></a>').join('');
  const allBtn = document.createElement('button');
  allBtn.type = 'button';
  allBtn.className = 'call';
  allBtn.setAttribute('aria-haspopup', 'dialog');
  allBtn.setAttribute('aria-controls', 'catsheet');
  allBtn.innerHTML = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></svg><span>All <em>' + M.cats.length + '</em></span>';
  row$.before(allBtn);

  /* --- "All categories" sheet --- */
  const sheet = document.createElement('dialog');
  sheet.className = 'catsheet';
  sheet.id = 'catsheet';
  sheet.setAttribute('aria-labelledby', 'cs-title');
  sheet.innerHTML = '<div class="cs-in"><div class="cs-top"><div><span class="eyebrow-l">The full menu</span><h2 id="cs-title">All categories</h2></div>' +
    '<button type="button" class="dr-close cs-close" aria-label="Close categories"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
    '<ul class="cs-grid">' + M.cats.map(c => '<li><a href="#' + c.id + '" data-tab="' + c.id + '"><span class="cs-num">' + c.num + '</span><span class="cs-tx"><b>' + esc(c.title) + '</b><small>' + esc(c.meta) + '</small></span><span class="cs-go" aria-hidden="true">→</span></a></li>').join('') + '</ul>' +
    '<p class="cs-note">' + esc(M.note) + '</p></div>';
  document.body.append(sheet);

  /* --- drawer + footer category links --- */
  const drCats = document.querySelector('#drawer .dr-cats ul');
  if (drCats) drCats.innerHTML = M.cats.map(c => '<li><a href="#' + c.id + '">' + esc(c.title) + '</a></li>').join('');
  // the footer comes after this script, so fill it once the page has parsed
  document.addEventListener('DOMContentLoaded', () => {
    const sfMenu = document.querySelector('.sf-menu');
    if (sfMenu) sfMenu.insertAdjacentHTML('beforeend', M.cats.slice(0, 6).map(c => '<a href="#/menu/' + c.id + '">' + esc(c.title) + '</a>').join('') + '<a href="#categories">All ' + M.cats.length + ' categories →</a>');
  });

  /* --- category index (home) --- */
  const list = document.getElementById('cats-list');
  const index = document.createElement('section');
  index.className = 'cindex';
  index.id = 'categories';
  index.setAttribute('aria-labelledby', 'ci-title');
  index.innerHTML = '<div class="ci-head"><div><span class="eyebrow-l">The full menu</span><h2 class="vh2" id="ci-title">Browse by category</h2></div><p>' + M.cats.length + ' categories · ' + esc(M.note) + '</p></div>' +
    '<ul class="ci-grid">' + M.cats.map(c => c.photo
      ? '<li class="ci-photo"><a href="#' + c.id + '"><img src="' + esc(c.thumb) + '" alt="" loading="lazy"><span class="ci-num">' + c.num + '</span><span class="ci-tx"><b>' + esc(c.title) + '</b><small>' + esc(c.meta) + '</small></span></a></li>'
      : '<li class="ci-text"><a href="#' + c.id + '"><span class="ci-num">' + c.num + '</span><span class="ci-tx"><b>' + esc(c.title) + '</b><small>' + esc(c.meta) + '</small></span><span class="ci-go" aria-hidden="true">→</span></a></li>'
    ).join('') + '</ul>';
  list.before(index);

  /* --- full menu: photo categories as banner + cards, the rest as a menu board --- */
  const photo = M.cats.filter(c => c.photo), board = M.cats.filter(c => !c.photo);
  list.innerHTML =
    photo.map(c => {
      const cards = c.items.filter(it => it.page), rows = c.items.filter(it => !it.page);
      return '<section class="msec" id="' + c.id + '" data-cat="' + c.id + '">' +
        '<div class="bn' + longTitle(c) + '" data-cat="' + c.id + '" style="background-image:url(\'' + esc(c.banner) + '\')"><div class="bt"><h2 class="d">' + esc(c.title) + '</h2><span class="sp2">' + esc(c.tagline || c.meta) + '</span></div></div>' +
        '<div class="grid">' + cards.map(it => card(it)).join('') + '</div>' +
        (rows.length ? '<ul class="mrows mrows-x">' + rows.map(row).join('') + '</ul>' : '') +
        '</section>';
    }).join('') +
    '<div class="board"><div class="board-head"><span class="eyebrow-l">More from the kitchen</span><h2 class="vh2">Kebabs, sides &amp; extras</h2></div><div class="board-cols">' +
    board.map(c =>
      '<section class="msec mpanel" id="' + c.id + '" data-cat="' + c.id + '">' +
      '<div class="bn bn-text' + longTitle(c) + '" data-cat="' + c.id + '"><div class="bt"><span class="bn-num">' + c.num + '</span><h2 class="d">' + esc(c.title) + '</h2><span class="sp2">' + esc(c.meta) + '</span></div></div>' +
      '<h3 class="mp-h"><a href="#' + c.id + '">' + esc(c.title) + '</a><span>' + c.num + '</span></h3>' +
      '<ul class="mrows">' + c.items.map(row).join('') + '</ul></section>'
    ).join('') +
    '</div></div>';
})();
