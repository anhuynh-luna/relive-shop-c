const CART_KEY = "relive_cart_v1";

// KHÔNG ĐỊNH NGHĨA HÀM FIX VÀ RENDER Ở ĐÂY NỮA
// KHÔNG CẦN renderCartPage() HAY formatVND() NỮA

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function setCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  // Chỉ giữ lại renderCartBadge() vì nó là global
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
  // Thay thế renderCartPage() bằng một lời gọi đến hàm render global (renderCart/renderCartPage)
  // Trong list.html, ta sẽ định nghĩa một hàm render global có thể truy cập được.
  // Nếu list.html đã được load, nó sẽ tự động gọi renderCart()
  if (typeof renderCart === 'function') { renderCart(); }
  else if (typeof renderCartPage === 'function') { renderCartPage(); }
}

function clearCart() {
  setCart([]);
  if (typeof renderCart === 'function') { renderCart(); }
  else if (typeof renderCartPage === 'function') { renderCartPage(); }
}

// Giữ lại formatVND và renderCartBadge vì chúng là tiện ích chung
function formatVND(n) {
  try { return (n || 0).toLocaleString("vi-VN") + "đ"; }
  catch { return n + "đ"; }
}

function renderCartBadge() {
  const el = document.getElementById("cart-count-badge");
  if (!el) return;
  el.textContent = getCart().length;
}

// XÓA HÀM renderCartPage() CŨ

// CHỈ CẦN RENDER BADGE KHI LOAD
document.addEventListener("DOMContentLoaded", () => {
  renderCartBadge();
  // XÓA LỜI GỌI renderCartPage()
});