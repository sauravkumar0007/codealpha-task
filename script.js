let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('checkout').addEventListener('click', checkout);
});

function addToCart(id, name, price) {
    cart.push({ id, name, price });
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.textContent = `${item.name} - $${item.price}`;
        cartItems.appendChild(itemDiv);
    });
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    cartCount.textContent = `Cart: ${cart.length}`;
}

function checkout() {
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }

    alert('Order placed successfully!\nTotal: $' + cart.reduce((sum, item) => sum + item.price, 0).toFixed(2));
    cart = [];
    updateCart();
}