// Cart State
let cart = [];

// DOM Elements
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');

// Toggle Cart Sidebar
function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

// Add Item to Cart
function addToCart(id, name, price, image, amazonLink) {
    // Check if item already exists
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        // For simplicity in this static version, we just don't add duplicates
        // Or we could increase quantity. Let's just alert.
        alert(`${name} is already in your cart!`);
    } else {
        cart.push({ id, name, price, image, amazonLink });
        updateCartUI();
        
        // Show cart on add
        if (!cartSidebar.classList.contains('active')) {
            toggleCart();
        }
    }
}

// Remove Item from Cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

// Update UI
function updateCartUI() {
    // Update Count
    cartCount.innerText = cart.length;

    // Render Items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<div class="empty-cart-msg">Your cart is currently empty.</div>`;
        checkoutBtn.disabled = true;
    } else {
        checkoutBtn.disabled = false;
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">₹${item.price}</div>
                    <button class="remove-item" onclick="removeFromCart('${item.id}')">Remove</button>
                </div>
            </div>
        `).join('');
    }

    // Update Total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotalPrice.innerText = `₹${total}`;
}

// Checkout Function
function checkout() {
    if (cart.length === 0) return;
    
    const shopWhatsAppNumber = "919876543210"; // Replace with Humaira's actual number (include country code)
    
    let message = "Hello Sarava Parihaara! I would like to place an order:\n\n";
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} - ₹${item.price}\n`;
    });
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    message += `\n*Total Amount: ₹${total}*\n\nPlease let me know the payment details.`;
    
    const encodedMessage = encodeURIComponent(message);
    const checkoutUrl = `https://wa.me/${shopWhatsAppNumber}?text=${encodedMessage}`;
    
    checkoutBtn.innerText = "Opening WhatsApp...";
    setTimeout(() => {
        window.open(checkoutUrl, '_blank');
        checkoutBtn.innerText = "Order via WhatsApp";
    }, 1000);
}
