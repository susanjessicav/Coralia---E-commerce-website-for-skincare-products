let productsData = []; // Array to store fetched products

// Function to add a product to the cart
function addtocart(productId) {
    const countSpan = document.getElementById('count' + productId);
    let currentCount = parseInt(countSpan.textContent);
    currentCount += 1; // Increment the count
    countSpan.textContent = currentCount;

    // Store the quantity in local storage
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    cart[productId] = currentCount;
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update totals
    updateCartTotals();
}

// Function to remove a product from the cart
function removefromcart(productId) {
    const countSpan = document.getElementById('count' + productId);
    let currentCount = parseInt(countSpan.textContent);
    if (currentCount > 0) {
        currentCount -= 1; // Decrement the count
        countSpan.textContent = currentCount;

        // Update the quantity in local storage
        const cart = JSON.parse(localStorage.getItem('cart')) || {};
        cart[productId] = currentCount;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Update totals
    updateCartTotals();
}

// Function to update cart totals
function updateCartTotals() {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    let totalItems = 0;
    let totalCost = 0;

    for (const productId in cart) {
        const count = cart[productId];
        totalItems += count;

        // Get the product price from the productsData array
        const product = productsData[productId - 1]; // Adjust index since productId starts from 1
        if (product) {
            totalCost += product.price * count; // Calculate total cost
        }
    }

    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('total-cost').textContent = totalCost.toFixed(2); // Format to 2 decimal places
}

// Fetch products from the API
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/products');
        productsData = await response.json(); // Store fetched products in productsData
        const productContainer = document.querySelector('.pro-container');

        productsData.forEach((product, index) => {
            const productElement = document.createElement('div');
            productElement.classList.add('pro');
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="desc">
                    <h5>${product.name}</h5>
                    <h4>$${product.price}</h4>
                </div>
                <button type="button" onclick="removefromcart(${index + 1})">-</button>
                <span id="count${index + 1}">0</span>
                <button type="button" onclick="addtocart(${index + 1})">+</button>
            `;
            productContainer.appendChild(productElement);
        });

        // Load cart from local storage
        loadCart();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Function to load the cart from local storage
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    for (const productId in cart) {
        const countSpan = document.getElementById('count' + productId);
        if (countSpan) {
            countSpan.textContent = cart[productId];
        }
    }

    // Update totals
    updateCartTotals();
}

// Handle the order button click
document.getElementById('order-button').addEventListener('click', () => {
    alert('Order placed successfully!');
});

document.addEventListener('DOMContentLoaded', fetchProducts);
