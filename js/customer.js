let cart = JSON.parse(localStorage.getItem('cart')) || [];
let medicines = [];

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'customer') {
        window.location.href = 'index.html';
        return;
    }
    
    // Display customer details
    document.getElementById('customerUsername').textContent = user.username || 'N/A';
    document.getElementById('customerEmail').textContent = user.email || 'N/A';
    document.getElementById('customerAddress').textContent = user.address || 'N/A';
    
    loadMedicines();
    loadOrders();
    updateCart();
    
    document.querySelectorAll('.sidebar a[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.dataset.section;
            showSection(section);
        });
    });
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
    
    document.getElementById('searchMedicine').addEventListener('input', (e) => {
        filterMedicines(e.target.value);
    });
    
    const modal = document.getElementById('paymentModal');
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    document.getElementById('paymentMethod').addEventListener('change', handlePaymentMethodChange);
    document.getElementById('paymentForm').addEventListener('submit', processPayment);
    
    setupCardFormatting();
});

function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(section).classList.add('active');
}

async function loadMedicines() {
    try {
        const response = await fetch('php/get_medicines.php');
        medicines = await response.json();
        displayMedicines(medicines);
    } catch (error) {
        console.error('Error loading medicines:', error);
    }
}

function displayMedicines(meds) {
    const container = document.getElementById('medicinesList');
    if (meds.length === 0) {
        container.innerHTML = '<div class="cart-empty"><div class="cart-empty-icon">🔍</div><p>No medicines found</p></div>';
        return;
    }
    
    container.innerHTML = meds.map(med => {
        const stockStatus = med.stock === 0 ? 'stock-out' : (med.stock < 10 ? 'stock-low' : 'stock-available');
        const stockText = med.stock === 0 ? 'Out of Stock' : (med.stock < 10 ? `Only ${med.stock} left` : 'In Stock');
        const inCart = cart.find(item => item.id == med.id);
        
        return `
            <div class="medicine-card">
                <h3>${med.name}</h3>
                <p>Category: ${med.category}</p>
                <p>${med.description || 'No description available'}</p>
                <p class="price">Rs. ${parseFloat(med.price).toFixed(2)}</p>
                <p><span class="stock-badge ${stockStatus}">${stockText}</span></p>
                ${med.stock > 0 ? 
                    (inCart ? 
                        `<button onclick="addToCart(${med.id})" style="background: #27ae60;">✓ Added (${inCart.quantity})</button>` :
                        `<button onclick="addToCart(${med.id})">Add to Cart</button>`
                    ) :
                    `<button disabled>Out of Stock</button>`
                }
            </div>
        `;
    }).join('');
}

function filterMedicines(query) {
    const filtered = medicines.filter(med => 
        med.name.toLowerCase().includes(query.toLowerCase()) ||
        med.category.toLowerCase().includes(query.toLowerCase())
    );
    displayMedicines(filtered);
}

function addToCart(medicineId) {
    const medicine = medicines.find(m => m.id == medicineId);
    if (!medicine) return;
    
    const cartItem = cart.find(item => item.id == medicineId);
    
    if (cartItem) {
        if (cartItem.quantity < medicine.stock) {
            cartItem.quantity++;
            showNotification('Quantity updated in cart', 'success');
        } else {
            showNotification('Cannot add more than available stock', 'error');
            return;
        }
    } else {
        cart.push({
            id: medicine.id,
            name: medicine.name,
            price: medicine.price,
            quantity: 1,
            stock: medicine.stock
        });
        showNotification('Added to cart successfully', 'success');
    }
    
    saveCart();
    updateCart();
    displayMedicines(medicines);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
    
    const cartItems = document.getElementById('cartItems');
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>Your cart is empty</p><p style="color: #999;">Add some medicines to get started</p></div>';
        document.getElementById('cartTotal').textContent = '0.00';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Price: Rs. ${parseFloat(item.price).toFixed(2)} each</p>
                <p style="color: #666;">Subtotal: Rs. ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <div class="cart-item-actions">
                <button onclick="decreaseQuantity(${item.id})" style="width: 30px; padding: 5px;">-</button>
                <input type="number" class="qty-input" value="${item.quantity}" 
                    min="1" max="${item.stock}" 
                    onchange="updateQuantity(${item.id}, this.value)">
                <button onclick="increaseQuantity(${item.id})" style="width: 30px; padding: 5px;">+</button>
                <button class="btn-delete" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartTotal').textContent = total.toFixed(2);
}

function increaseQuantity(medicineId) {
    const item = cart.find(i => i.id == medicineId);
    if (item && item.quantity < item.stock) {
        item.quantity++;
        saveCart();
        updateCart();
    } else {
        showNotification('Maximum stock reached', 'error');
    }
}

function decreaseQuantity(medicineId) {
    const item = cart.find(i => i.id == medicineId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity--;
            saveCart();
            updateCart();
        } else {
            removeFromCart(medicineId);
        }
    }
}

function updateQuantity(medicineId, quantity) {
    const item = cart.find(i => i.id == medicineId);
    if (item) {
        const qty = parseInt(quantity);
        if (qty > 0 && qty <= item.stock) {
            item.quantity = qty;
            saveCart();
            updateCart();
        } else if (qty > item.stock) {
            showNotification('Quantity exceeds available stock', 'error');
            item.quantity = item.stock;
            saveCart();
            updateCart();
        }
    }
}

function removeFromCart(medicineId) {
    if (confirm('Remove this item from cart?')) {
        cart = cart.filter(item => item.id != medicineId);
        saveCart();
        updateCart();
        displayMedicines(medicines);
        showNotification('Item removed from cart', 'success');
    }
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const summaryItems = document.getElementById('orderSummaryItems');
    summaryItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <span class="summary-item-name">${item.name}</span>
            <span class="summary-item-qty">x${item.quantity}</span>
            <span class="summary-item-price">Rs. ${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    document.getElementById('summaryTotal').textContent = total.toFixed(2);
    document.getElementById('payAmount').textContent = total.toFixed(2);
    document.getElementById('paymentForm').reset();
    
    // Auto-fill delivery address from user's registered address
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.address) {
        document.getElementById('deliveryAddress').value = user.address;
    }
    
    document.getElementById('paymentModal').style.display = 'block';
}

function handlePaymentMethodChange(e) {
    const method = e.target.value;
    
    document.getElementById('cardDetails').style.display = 'none';
    document.getElementById('upiDetails').style.display = 'none';
    document.getElementById('walletDetails').style.display = 'none';
    
    document.querySelectorAll('#cardDetails input').forEach(input => input.required = false);
    document.querySelectorAll('#upiDetails input').forEach(input => input.required = false);
    document.querySelectorAll('#walletDetails input, #walletDetails select').forEach(input => input.required = false);
    
    if (method === 'card') {
        document.getElementById('cardDetails').style.display = 'block';
        document.querySelectorAll('#cardDetails input').forEach(input => input.required = true);
    } else if (method === 'upi') {
        document.getElementById('upiDetails').style.display = 'block';
        document.getElementById('upiId').required = true;
    } else if (method === 'wallet') {
        document.getElementById('walletDetails').style.display = 'block';
        document.getElementById('walletType').required = true;
        document.getElementById('walletPhone').required = true;
    }
}

function setupCardFormatting() {
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    const expiryDate = document.getElementById('expiryDate');
    if (expiryDate) {
        expiryDate.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
    
    const cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
}

async function processPayment(e) {
    e.preventDefault();
    
    const paymentMethod = document.getElementById('paymentMethod').value;
    if (!paymentMethod) {
        showNotification('Please select a payment method', 'error');
        return;
    }
    
    const deliveryAddress = document.getElementById('deliveryAddress').value;
    if (!deliveryAddress) {
        showNotification('Please select delivery city', 'error');
        return;
    }
    
    if (paymentMethod === 'card') {
        if (!validateCardDetails()) return;
    } else if (paymentMethod === 'upi') {
        if (!validateUPI()) return;
    } else if (paymentMethod === 'wallet') {
        if (!validateWallet()) return;
    }
    
    const user = JSON.parse(localStorage.getItem('user'));
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const formData = new FormData();
    formData.append('customer_id', user.id);
    formData.append('total', total);
    formData.append('payment_method', paymentMethod);
    formData.append('delivery_address', deliveryAddress);
    formData.append('items', JSON.stringify(cart));
    
    try {
        const response = await fetch('php/process_order.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('paymentModal').style.display = 'none';
            document.getElementById('successOrderId').textContent = data.order_id;
            document.getElementById('successModal').style.display = 'block';
            
            cart = [];
            localStorage.removeItem('cart');
            updateCart();
            loadOrders();
            loadMedicines();
        } else {
            showNotification(data.message || 'Payment failed', 'error');
        }
    } catch (error) {
        showNotification('Payment failed. Please try again.', 'error');
    }
}

function validateCardDetails() {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const cardholderName = document.getElementById('cardholderName').value.trim();
    
    if (cardNumber.length !== 16) {
        showNotification('Invalid card number', 'error');
        return false;
    }
    
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        showNotification('Invalid expiry date (MM/YY)', 'error');
        return false;
    }
    
    if (cvv.length !== 3) {
        showNotification('Invalid CVV', 'error');
        return false;
    }
    
    if (!cardholderName) {
        showNotification('Please enter cardholder name', 'error');
        return false;
    }
    
    return true;
}

function validateUPI() {
    const upiId = document.getElementById('upiId').value.trim();
    if (!upiId.includes('@')) {
        showNotification('Invalid UPI ID', 'error');
        return false;
    }
    return true;
}

function validateWallet() {
    const walletType = document.getElementById('walletType').value;
    const walletPhone = document.getElementById('walletPhone').value;
    
    if (!walletType) {
        showNotification('Please select a wallet', 'error');
        return false;
    }
    
    if (walletPhone.length !== 10) {
        showNotification('Invalid phone number', 'error');
        return false;
    }
    
    return true;
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    showSection('browse');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

async function loadOrders() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    try {
        const response = await fetch(`php/get_orders.php?customer_id=${user.id}`);
        const orders = await response.json();
        
        const tbody = document.querySelector('#ordersTable tbody');
        tbody.innerHTML = orders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.order_date}</td>
                <td>Rs. ${parseFloat(order.total).toFixed(2)}</td>
                <td>${order.status}</td>
                <td><button class="btn-edit" onclick="viewOrderDetails(${order.id})">View</button></td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

async function viewOrderDetails(orderId) {
    try {
        const response = await fetch(`php/get_order_details.php?order_id=${orderId}`);
        const data = await response.json();
        
        if (data.success) {
            const order = data.order;
            const items = data.items;
            
            let itemsHtml = '';
            if (items.length > 0) {
                itemsHtml = items.map(item => {
                    const unit = item.unit || 'Strip';
                    return `
                    <tr>
                        <td>${item.medicine_name}</td>
                        <td>${item.quantity} ${unit}${item.quantity > 1 ? 's' : ''}</td>
                        <td>Rs. ${parseFloat(item.price).toFixed(2)} per ${unit}</td>
                        <td>Rs. ${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                `;
                }).join('');
            } else {
                itemsHtml = '<tr><td colspan="4" style="text-align: center; padding: 20px;">No item details available for this order</td></tr>';
            }
            
            document.getElementById('orderDetailsContent').innerHTML = `
                <div style="margin-bottom: 20px;">
                    <p><strong>Order ID:</strong> #${order.id}</p>
                    <p><strong>Order Date:</strong> ${order.order_date}</p>
                    <p><strong>Status:</strong> <span style="color: green;">${order.status}</span></p>
                    <p><strong>Payment Method:</strong> ${order.payment_method}</p>
                    <p><strong>Delivery Address:</strong> ${order.delivery_address}</p>
                </div>
                <h3>Ordered Items:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f0f0f0;">
                            <th style="padding: 10px; border: 1px solid #ddd;">Medicine</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Quantity</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>
                <div style="margin-top: 20px; text-align: right;">
                    <h3>Total: Rs. ${parseFloat(order.total).toFixed(2)}</h3>
                </div>
            `;
            
            document.getElementById('orderDetailsModal').style.display = 'block';
        } else {
            alert('Failed to load order details: ' + (data.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error loading order details: ' + error.message);
    }
}

function closeOrderDetails() {
    document.getElementById('orderDetailsModal').style.display = 'none';
}
