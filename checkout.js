// Checkout page JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters to populate order from service selection
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service');
    
    // Service prices (matching updated prices)
    const servicePrices = {
        'whatsapp': { name: 'WhatsApp Consultation', price: 100 },
        'auto-expert': { name: 'Call with an Auto-Expert', price: 200 },
        '2-calls': { name: '2 Phone Calls', price: 300 },
        '4-calls': { name: '4 Phone Calls with Auto Expert', price: 400 },
        'express': { name: 'Express Call', price: 500 },
        'senior': { name: 'Senior Consultant', price: 600 }
    };
    
    // If service parameter exists, update the order
    if (service && servicePrices[service]) {
        updateOrderForService(service);
    } else {
        // Default to showing auto-expert service if no parameter
        updateOrderForService('auto-expert');
    }
    
    // Form validation
    const form = document.getElementById('checkoutForm');
    const placeOrderBtn = document.querySelector('.place-order-btn');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const agreeTerms = document.getElementById('agreeTerms');
        if (!agreeTerms.checked) {
            alert('Please agree to the terms and conditions to continue.');
            return;
        }
        
        // Process order with MongoDB backend
        placeOrderBtn.textContent = 'Processing...';
        placeOrderBtn.disabled = true;
        
        try {
            // Get form data
            const formData = new FormData(form);
            const urlParams = new URLSearchParams(window.location.search);
            const selectedService = urlParams.get('service') || 'auto-expert';
            
            const orderData = {
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                whatsapp: formData.get('whatsapp'),
                pincode: formData.get('pincode'),
                service: selectedService,
                totalAmount: getCurrentServicePrice(selectedService),
                carDetails: {
                    budget: formData.get('budget'),
                    carType: formData.get('carType'),
                    fuelType: formData.get('fuelType')
                },
                additionalInfo: formData.get('additionalRequirements')
            };
            
            // Submit to MongoDB API
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert(`Order placed successfully! Order ID: ${result.orderId}. You will receive confirmation details shortly.`);
                // Reset form
                form.reset();
                // Optionally redirect to success page
                // window.location.href = '/success.html?orderId=' + result.orderId;
            } else {
                throw new Error(result.message || 'Failed to place order');
            }
            
        } catch (error) {
            console.error('Order submission error:', error);
            alert('Failed to place order: ' + error.message + '. Please try again.');
        } finally {
            placeOrderBtn.textContent = 'PLACE ORDER';
            placeOrderBtn.disabled = false;
        }
    });
});

function updateOrderForService(serviceKey) {
    const servicePrices = {
        'whatsapp': { name: 'WhatsApp Consultation', price: 100 },
        'auto-expert': { name: 'Call with an Auto-Expert', price: 200 },
        '2-calls': { name: '2 Phone Calls', price: 300 },
        '4-calls': { name: '4 Phone Calls with Auto Expert', price: 400 },
        'express': { name: 'Express Call', price: 500 },
        'senior': { name: 'Senior Consultant', price: 600 }
    };
    
    const service = servicePrices[serviceKey];
    if (!service) return;
    
    // Update order items based on the selected service
    const orderItems = document.getElementById('orderItems');
    
    if (serviceKey === 'auto-expert') {
        // Show multiple services as in the screenshot when auto-expert is selected
        orderItems.innerHTML = `
            <div class="order-item">
                <div class="item-details">
                    <span class="item-name">4 Phone Calls with Auto Expert</span>
                    <div class="quantity-controls">
                        <button type="button" class="qty-btn" onclick="updateQuantity('4calls', -1)">-</button>
                        <span class="quantity" id="qty4calls">1</span>
                        <button type="button" class="qty-btn" onclick="updateQuantity('4calls', 1)">+</button>
                    </div>
                </div>
                <span class="item-price" id="price4calls">₹1299.00</span>
            </div>
            <div class="order-item">
                <div class="item-details">
                    <span class="item-name">WhatsApp Consultation</span>
                    <div class="quantity-controls">
                        <button type="button" class="qty-btn" onclick="updateQuantity('whatsapp-multi', -1)">-</button>
                        <span class="quantity" id="qtyWhatsappMulti">2</span>
                        <button type="button" class="qty-btn" onclick="updateQuantity('whatsapp-multi', 1)">+</button>
                    </div>
                </div>
                <span class="item-price" id="priceWhatsappMulti">₹998.00</span>
            </div>
            <div class="order-item">
                <div class="item-details">
                    <span class="item-name">Call with an Auto-Expert</span>
                    <div class="quantity-controls">
                        <button type="button" class="qty-btn" onclick="updateQuantity('autoexpert-multi', -1)">-</button>
                        <span class="quantity" id="qtyAutoexpertMulti">2</span>
                        <button type="button" class="qty-btn" onclick="updateQuantity('autoexpert-multi', 1)">+</button>
                    </div>
                </div>
                <span class="item-price" id="priceAutoexpertMulti">₹1398.00</span>
            </div>
        `;
    } else if (serviceKey === '2-calls') {
        // Show all 4 services as in the screenshot when 2-calls is selected
        orderItems.innerHTML = `
            <div class="order-item">
                <div class="item-details">
                    <span class="item-name">4 Phone Calls with Auto Expert</span>
                    <div class="quantity-controls">
                        <button type="button" class="qty-btn" onclick="updateQuantity('4calls-bundle', -1)">-</button>
                        <span class="quantity" id="qty4callsBundle">1</span>
                        <button type="button" class="qty-btn" onclick="updateQuantity('4calls-bundle', 1)">+</button>
                    </div>
                </div>
                <span class="item-price" id="price4callsBundle">₹1299.00</span>
            </div>
            <div class="order-item">
                <div class="item-details">
                    <span class="item-name">WhatsApp Consultation</span>
                    <div class="quantity-controls">
                        <button type="button" class="qty-btn" onclick="updateQuantity('whatsapp-bundle', -1)">-</button>
                        <span class="quantity" id="qtyWhatsappBundle">2</span>
                        <button type="button" class="qty-btn" onclick="updateQuantity('whatsapp-bundle', 1)">+</button>
                    </div>
                </div>
                <span class="item-price" id="priceWhatsappBundle">₹998.00</span>
            </div>
            <div class="order-item">
                <div class="item-details">
                    <span class="item-name">Call with an Auto-Expert</span>
                    <div class="quantity-controls">
                        <button type="button" class="qty-btn" onclick="updateQuantity('autoexpert-bundle', -1)">-</button>
                        <span class="quantity" id="qtyAutoexpertBundle">2</span>
                        <button type="button" class="qty-btn" onclick="updateQuantity('autoexpert-bundle', 1)">+</button>
                    </div>
                </div>
                <span class="item-price" id="priceAutoexpertBundle">₹1398.00</span>
            </div>
            <div class="order-item">
                <div class="item-details">
                    <span class="item-name">2 Phone Calls</span>
                    <div class="quantity-controls">
                        <button type="button" class="qty-btn" onclick="updateQuantity('2calls-bundle', -1)">-</button>
                        <span class="quantity" id="qty2callsBundle">1</span>
                        <button type="button" class="qty-btn" onclick="updateQuantity('2calls-bundle', 1)">+</button>
                    </div>
                </div>
                <span class="item-price" id="price2callsBundle">₹999.00</span>
            </div>
        `;
    } else if (serviceKey === '4-calls') {
        // Show all 4 services with higher quantities as in the screenshot when 4-calls is selected
        orderItems.innerHTML = `
            <div class="order-item">
                <div class="item-details">
                    <span class="item-name">4 Phone Calls with Auto Expert</span>
                    <div class="quantity-controls">
                        <button type="button" class="qty-btn" onclick="updateQuantity('4calls-premium', -1)">-</button>
                        <span class="quantity" id="qty4callsPremium">2</span>
                        <button type="button" class="qty-btn" onclick="updateQuantity('4calls-premium', 1)">+</button>
                    </div>
                </div>
                <span class="item-price" id="price4callsPremium">₹2598.00</span>
            </div>
            <div class="order-item">
                <div class="item-details">
                    <span class="item-name">WhatsApp Consultation</span>
                    <div class="quantity-controls">
                        <button type="button" class="qty-btn" onclick="updateQuantity('whatsapp-premium', -1)">-</button>
                        <span class="quantity" id="qtyWhatsappPremium">2</span>
                        <button type="button" class="qty-btn" onclick="updateQuantity('whatsapp-premium', 1)">+</button>
                    </div>
                </div>
                <span class="item-price" id="priceWhatsappPremium">₹998.00</span>
            </div>
            <div class="order-item">
                <div class="item-details">
                    <span class="item-name">Call with an Auto-Expert</span>
                    <div class="quantity-controls">
                        <button type="button" class="qty-btn" onclick="updateQuantity('autoexpert-premium', -1)">-</button>
                        <span class="quantity" id="qtyAutoexpertPremium">2</span>
                        <button type="button" class="qty-btn" onclick="updateQuantity('autoexpert-premium', 1)">+</button>
                    </div>
                </div>
                <span class="item-price" id="priceAutoexpertPremium">₹1398.00</span>
            </div>
            <div class="order-item">
                <div class="item-details">
                    <span class="item-name">2 Phone Calls</span>
                    <div class="quantity-controls">
                        <button type="button" class="qty-btn" onclick="updateQuantity('2calls-premium', -1)">-</button>
                        <span class="quantity" id="qty2callsPremium">1</span>
                        <button type="button" class="qty-btn" onclick="updateQuantity('2calls-premium', 1)">+</button>
                    </div>
                </div>
                <span class="item-price" id="price2callsPremium">₹999.00</span>
            </div>
        `;
        // Show only WhatsApp service
        orderItems.innerHTML = `
            <div class="order-item">
                <div class="item-details">
                    <span class="item-name">WhatsApp Consultation</span>
                    <div class="quantity-controls">
                        <button type="button" class="qty-btn" onclick="updateQuantity('whatsapp-single', -1)">-</button>
                        <span class="quantity" id="qtyWhatsappSingle">1</span>
                        <button type="button" class="qty-btn" onclick="updateQuantity('whatsapp-single', 1)">+</button>
                    </div>
                </div>
                <span class="item-price" id="priceWhatsappSingle">₹100.00</span>
            </div>
        `;
    } else {
        // For other services, show only the selected service
        orderItems.innerHTML = `
            <div class="order-item">
                <div class="item-details">
                    <span class="item-name">${service.name}</span>
                    <div class="quantity-controls">
                        <button type="button" class="qty-btn" onclick="updateQuantity('${serviceKey}', -1)">-</button>
                        <span class="quantity" id="qty${serviceKey}"}>1</span>
                        <button type="button" class="qty-btn" onclick="updateQuantity('${serviceKey}', 1)">+</button>
                    </div>
                </div>
                <span class="item-price" id="price${serviceKey}">₹${service.price}.00</span>
            </div>
        `;
    }
    
    // Update totals
    updateTotals();
}

function updateQuantity(serviceKey, change) {
    // Service prices for the multi-service scenario
    const multiServicePrices = {
        '4calls': 1299,
        'whatsapp-multi': 499,
        'autoexpert-multi': 699,
        '4calls-bundle': 1299,
        'whatsapp-bundle': 499,
        'autoexpert-bundle': 699,
        '2calls-bundle': 999,
        '4calls-premium': 1299,
        'whatsapp-premium': 499,
        'autoexpert-premium': 699,
        '2calls-premium': 999,
        'whatsapp-single': 100,
        'auto-expert': 200,
        '2-calls': 300,
        '4-calls': 400,
        'express': 500,
        'senior': 600
    };
    
    let qtyElement, priceElement;
    
    // Find the correct elements based on service key
    if (serviceKey === '4calls') {
        qtyElement = document.getElementById('qty4calls');
        priceElement = document.getElementById('price4calls');
    } else if (serviceKey === 'whatsapp-multi') {
        qtyElement = document.getElementById('qtyWhatsappMulti');
        priceElement = document.getElementById('priceWhatsappMulti');
    } else if (serviceKey === 'autoexpert-multi') {
        qtyElement = document.getElementById('qtyAutoexpertMulti');
        priceElement = document.getElementById('priceAutoexpertMulti');
    } else if (serviceKey === '4calls-bundle') {
        qtyElement = document.getElementById('qty4callsBundle');
        priceElement = document.getElementById('price4callsBundle');
    } else if (serviceKey === 'whatsapp-bundle') {
        qtyElement = document.getElementById('qtyWhatsappBundle');
        priceElement = document.getElementById('priceWhatsappBundle');
    } else if (serviceKey === 'autoexpert-bundle') {
        qtyElement = document.getElementById('qtyAutoexpertBundle');
        priceElement = document.getElementById('priceAutoexpertBundle');
    } else if (serviceKey === '2calls-bundle') {
        qtyElement = document.getElementById('qty2callsBundle');
        priceElement = document.getElementById('price2callsBundle');
    } else if (serviceKey === '4calls-premium') {
        qtyElement = document.getElementById('qty4callsPremium');
        priceElement = document.getElementById('price4callsPremium');
    } else if (serviceKey === 'whatsapp-premium') {
        qtyElement = document.getElementById('qtyWhatsappPremium');
        priceElement = document.getElementById('priceWhatsappPremium');
    } else if (serviceKey === 'autoexpert-premium') {
        qtyElement = document.getElementById('qtyAutoexpertPremium');
        priceElement = document.getElementById('priceAutoexpertPremium');
    } else if (serviceKey === '2calls-premium') {
        qtyElement = document.getElementById('qty2callsPremium');
        priceElement = document.getElementById('price2callsPremium');
    } else if (serviceKey === 'whatsapp-single') {
        qtyElement = document.getElementById('qtyWhatsappSingle');
        priceElement = document.getElementById('priceWhatsappSingle');
    } else {
        qtyElement = document.getElementById(`qty${serviceKey}`);
        priceElement = document.getElementById(`price${serviceKey}`);
    }
    
    if (!qtyElement || !priceElement) return;
    
    let currentQty = parseInt(qtyElement.textContent);
    let newQty = currentQty + change;
    
    // Don't allow quantity less than 1
    if (newQty < 1) newQty = 1;
    
    qtyElement.textContent = newQty;
    
    // Get base price and update total price for this item
    const basePrice = multiServicePrices[serviceKey] || 200;
    const newPrice = basePrice * newQty;
    priceElement.textContent = `₹${newPrice.toFixed(2)}`;
    
    updateTotals();
}

function updateTotals() {
    const priceElements = document.querySelectorAll('.item-price');
    let subtotal = 0;
    
    priceElements.forEach(element => {
        const priceText = element.textContent.replace('₹', '').replace(',', '');
        const price = parseFloat(priceText);
        if (!isNaN(price)) {
            subtotal += price;
        }
    });
    
    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `₹${subtotal.toFixed(2)}`;
}

// Helper function to get current service price
function getCurrentServicePrice(serviceKey) {
    const servicePrices = {
        'whatsapp': 100,
        'auto-expert': 200,
        '2-calls': 300,
        '4-calls': 400,
        'express': 500,
        'senior': 600
    };
    
    return servicePrices[serviceKey] || 200;
}