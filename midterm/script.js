const MAX_PER_PRODUCT = 3;      // (41 mod 4) + 2
let cart = [];                  // [{ id, name, price }]

const badge     = document.querySelector('.cart-badge');
const cartLink  = document.querySelector('a[aria-label="Cart"]');
const panel     = document.getElementById('miniCart');
const listEl    = document.getElementById('cartList');
const totalEl   = document.getElementById('cartTotal');

function parsePrice(text) {
  return parseInt(text.replace(/[^0-9]/g, ''), 10);   // "PKR 6,490" -> 6490
}

function countOf(id) {
  return cart.filter(item => item.id === id).length;
}

function render() {
  // badge
  badge.textContent = cart.length;

  // list
  listEl.innerHTML = '';
  if (cart.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'small text-secondary';
    empty.textContent = 'Your cart is empty.';
    listEl.appendChild(empty);
  }
  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'cart-row';

    const info = document.createElement('span');
    info.textContent = item.name + ' - PKR ' + item.price.toLocaleString('en-US');

    const btn = document.createElement('button');
    btn.className = 'btn btn-sm btn-outline-dark rounded-0 remove-btn';
    btn.textContent = 'Remove';
    btn.dataset.index = index;

    li.append(info, btn);
    listEl.appendChild(li);
  });

  // total with reduce()
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  totalEl.textContent = 'PKR ' + total.toLocaleString('en-US');

  // per-product button state
  document.querySelectorAll('.product-card').forEach(card => {
    const id  = card.querySelector('img').getAttribute('src');
    const btn = card.querySelector('.add-btn');
    const full = countOf(id) >= MAX_PER_PRODUCT;
    btn.disabled = full;
    btn.textContent = full ? 'Limit reached' : 'Add to Cart';
  });
}

// Add to Cart buttons
document.querySelectorAll('.add-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.product-card');
    const id    = card.querySelector('img').getAttribute('src');
    const name  = card.querySelector('.p-name').textContent.trim();
    const price = parsePrice(card.querySelector('.p-price').textContent);

    if (countOf(id) >= MAX_PER_PRODUCT) return;
    cart.push({ id, name, price });
    render();
  });
});

// Remove buttons (event delegation on the list)
listEl.addEventListener('click', e => {
  if (e.target.classList.contains('remove-btn')) {
    cart.splice(Number(e.target.dataset.index), 1);
    render();
  }
});

// Cart icon toggles the mini cart
cartLink.addEventListener('click', e => {
  e.preventDefault();
  panel.hidden = !panel.hidden;
  cartLink.setAttribute('aria-expanded', String(!panel.hidden));
});

render();