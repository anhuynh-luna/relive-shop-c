const CART_KEY = "cart";


function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function setCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  renderCartBadge();
}

function addToCart(item) {
  const cart = getCart();
  cart.push({ ...item, qty: 1, addedAt: Date.now() });
  setCart(cart);
  alert("Đã thêm vào giỏ hàng!");
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  setCart(cart);
  renderCartPage();
}

function clearCart() {
  setCart([]);
  renderCartPage();
}

function formatVND(n) {
  try { return (n || 0).toLocaleString("vi-VN") + "đ"; }
  catch { return n + "đ"; }
}

function renderCartBadge() {
  const el = document.getElementById("cart-count-badge");
  if (!el) return;
  el.textContent = getCart().length;
}

function renderCartPage() {
  const itemsEl = document.getElementById("cart-items");
  const emptyEl = document.getElementById("cart-empty");
  const summaryEl = document.getElementById("cart-summary");
  const totalEl = document.getElementById("cart-total");
  if (!itemsEl || !emptyEl || !summaryEl) return;

  const cart = getCart();

  if (cart.length === 0) {
    emptyEl.classList.remove("hidden");
    summaryEl.classList.add("hidden");
    itemsEl.innerHTML = "";
    return;
  }

  emptyEl.classList.add("hidden");
  summaryEl.classList.remove("hidden");

  let total = 0;
  itemsEl.innerHTML = cart.map((it, idx) => {
    total += (it.price || 0) * (it.qty || 1);
    // hiển thị options (vd: class)
    const opts = it.options ? Object.entries(it.options).filter(([k,v]) => v) : [];
    return `
      <div class="flex gap-4 items-center border border-slate-800 rounded-xl p-3">
        ${it.image ? `<img src="${it.image}" class="w-20 h-20 object-cover rounded">` : ""}
        <div class="flex-1">
          <div class="font-semibold">${it.name}</div>
          <div class="text-sm text-slate-300">Mã: ${it.sku || "N/A"}</div>
          ${opts.length ? `<div class="text-sm text-slate-300">Tùy chọn: ${opts.map(([k,v])=>`${k}: ${v}`).join(", ")}</div>` : ""}
          <div class="mt-1 font-mono">${formatVND(it.price)}</div>
        </div>
        <button class="text-sm px-3 py-1 border border-slate-700 rounded hover:bg-slate-900"
                onclick="removeFromCart(${idx})">Xóa</button>
      </div>
    `;
  }).join("");

  totalEl.textContent = formatVND(total);
}

function fakeCheckout() {
  const code = "BRODE-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  alert(`Thanh toán thành công (giả lập)!\nMã kích hoạt của bạn: ${code}\n(Lưu ý: mã chỉ tương thích với duy nhất bạn.)`);
  clearCart();
}

document.addEventListener("DOMContentLoaded", () => {
  renderCartBadge();
  renderCartPage();
});
