// ============================================
// KONFIGURASI
// ============================================
const CONFIG = {
    DANA_NUMBER: '085216704274', // <-- GANTI INI
    ADMIN_PASSWORD: 'WAnzSHOP0812'
};

// ============================================
// STATE - DATA LAYANAN
// ============================================
let state = {
    services: [
        // ========== INSTAGRAM ==========
        { id: 1, name: 'Followers Instagram (Indonesia)', price: 31, min: 100, max: 2000, category: 'instagram' },
        { id: 2, name: 'Followers Instagram (Global)', price: 10, min: 100, max: 50000, category: 'instagram' },
        { id: 3, name: 'Likes Foto Instagram', price: 5, min: 50, max: 50000, category: 'instagram' },
        { id: 4, name: 'Views Reels Instagram', price: 5, min: 50, max: 100000, category: 'instagram' },
        { id: 5, name: 'Komentar Instagram', price: 10, min: 50, max: 1000, category: 'instagram' },
        { id: 6, name: 'Save Post Instagram', price: 5, min: 100, max: 5000, category: 'instagram' },
        { id: 7, name: 'Story Views Instagram', price: 3, min: 100, max: 50000, category: 'instagram' },
        { id: 8, name: 'IGTV Views', price: 5, min: 50, max: 100000, category: 'instagram' },
        
        // ========== TIKTOK ==========
        { id: 9, name: 'Followers TikTok (Indonesia)', price: 65, min: 100, max: 50000, category: 'tiktok' },
        { id: 10, name: 'Followers TikTok (Global)', price: 25, min: 100, max: 50000, category: 'tiktok' },
        { id: 11, name: 'Likes Video TikTok', price: 5, min: 100, max: 50000, category: 'tiktok' },
        { id: 12, name: 'Views TikTok', price: 3, min: 100, max: 100000, category: 'tiktok' },
        { id: 13, name: 'Share TikTok', price: 3, min: 100, max: 50000, category: 'tiktok' },
        { id: 14, name: 'Comment TikTok', price: 18, min: 100, max: 1000, category: 'tiktok' },
        { id: 15, name: 'Live Views TikTok', price: 300, min: 100, max: 50000, category: 'tiktok' },
        
        // ========== WHATSAPP ==========
        { id: 16, name: 'Pengikut Saluran WhatsApp', price: 50, min: 50, max: 500, category: 'whatsapp' },
        { id: 17, name: 'WhatsApp Verified Badge', price: 1500000, min: 1, max: 1, category: 'whatsapp' },
    ],
    selectedService: null,
    cart: { serviceId: null, target: '', quantity: 10, totalPrice: 0 },
    currentPage: 'services'
};

// ============================================
// DOM REFERENCES
// ============================================
const DOM = {
    servicesGrid: document.getElementById('servicesGrid'),
    loadingServices: document.getElementById('loadingServices'),
    serviceSelect: document.getElementById('serviceSelect'),
    pricePerUnit: document.getElementById('pricePerUnit'),
    minOrder: document.getElementById('minOrder'),
    maxOrder: document.getElementById('maxOrder'),
    qtyMinDisplay: document.getElementById('qtyMinDisplay'),
    targetInput: document.getElementById('targetInput'),
    quantityInput: document.getElementById('quantityInput'),
    qtyMinus: document.getElementById('qtyMinus'),
    qtyPlus: document.getElementById('qtyPlus'),
    totalAmount: document.getElementById('totalAmount'),
    orderForm: document.getElementById('orderForm'),
    paymentModal: document.getElementById('paymentModal'),
    modalClose: document.getElementById('modalClose'),
    modalService: document.getElementById('modalService'),
    modalTarget: document.getElementById('modalTarget'),
    modalQuantity: document.getElementById('modalQuantity'),
    modalTotal: document.getElementById('modalTotal'),
    modalAmount: document.getElementById('modalAmount'),
    confirmationForm: document.getElementById('confirmationForm'),
    senderName: document.getElementById('senderName'),
    proofImage: document.getElementById('proofImage'),
    imagePreview: document.getElementById('imagePreview'),
    hiddenService: document.getElementById('hiddenService'),
    hiddenTarget: document.getElementById('hiddenTarget'),
    hiddenQuantity: document.getElementById('hiddenQuantity'),
    hiddenPrice: document.getElementById('hiddenPrice'),
    trackingContainer: document.getElementById('trackingContainer'),
    trackingOrders: document.getElementById('trackingOrders'),
    trackingTargetInput: document.getElementById('trackingTargetInput'),
    trackingSearchBtn: document.getElementById('trackingSearchBtn'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),
    hamburger: document.getElementById('hamburger'),
    navbarMenu: document.querySelector('.navbar-menu'),
    navLinks: document.querySelectorAll('.nav-link')
};

// ============================================
// LOAD SERVICES
// ============================================
function loadServices() {
    DOM.loadingServices.style.display = 'none';
    renderServices(state.services);
    populateSelect(state.services);
}

// ============================================
// RENDER SERVICES
// ============================================
function renderServices(services) {
    if (!services || services.length === 0) {
        DOM.servicesGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;"><p>Tidak ada layanan</p></div>`;
        return;
    }
    
    DOM.servicesGrid.innerHTML = services.map(service => `
        <div class="service-card" data-service-id="${service.id}" onclick="selectService('${service.id}')">
            <div class="service-icon">
                <i class="fab fa-${getServiceIcon(service.category)}"></i>
            </div>
            <div class="service-name">${service.name}</div>
            <div class="service-category">${capitalize(service.category)}</div>
            <div class="service-price">
                Rp ${formatNumber(service.price)}
                <small>/unit</small>
            </div>
            <div class="service-min">Min. Order: ${service.min}</div>
            ${service.max ? `<div class="service-max" style="font-size:13px;color:var(--gray-500);">Max. Order: ${service.max}</div>` : ''}
        </div>
    `).join('');
}

// ============================================
// POPULATE SELECT
// ============================================
function populateSelect(services) {
    if (!services || services.length === 0) return;
    DOM.serviceSelect.innerHTML = `
        <option value="">-- Pilih layanan --</option>
        ${services.map(s => `<option value="${s.id}">${s.name} - Rp ${formatNumber(s.price)}/unit</option>`).join('')}
    `;
}

// ============================================
// SELECT SERVICE
// ============================================
function selectService(serviceId) {
    const service = state.services.find(s => s.id == serviceId);
    if (!service) return;
    state.selectedService = service;
    DOM.serviceSelect.value = serviceId;
    DOM.pricePerUnit.textContent = `Rp ${formatNumber(service.price)}`;
    DOM.minOrder.textContent = service.min;
    DOM.maxOrder.textContent = service.max || '∞';
    DOM.qtyMinDisplay.textContent = service.min;
    const minQty = service.min || 1;
    DOM.quantityInput.value = minQty;
    DOM.quantityInput.min = minQty;
    if (service.max) DOM.quantityInput.max = service.max;
    state.cart.quantity = minQty;
    document.querySelectorAll('.service-card').forEach(c => c.classList.toggle('selected', c.dataset.serviceId == serviceId));
    calculateTotal();
    document.getElementById('orderSection').scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// QUANTITY HANDLERS
// ============================================
DOM.qtyMinus.addEventListener('click', () => {
    const current = parseInt(DOM.quantityInput.value) || 0;
    const min = parseInt(DOM.quantityInput.min) || 1;
    if (current > min) { DOM.quantityInput.value = current - 1; state.cart.quantity = current - 1; calculateTotal(); }
});

DOM.qtyPlus.addEventListener('click', () => {
    const current = parseInt(DOM.quantityInput.value) || 0;
    const max = parseInt(DOM.quantityInput.max) || Infinity;
    if (current < max) { DOM.quantityInput.value = current + 1; state.cart.quantity = current + 1; calculateTotal(); }
});

DOM.quantityInput.addEventListener('change', () => {
    let value = parseInt(DOM.quantityInput.value) || 0;
    const min = parseInt(DOM.quantityInput.min) || 1;
    const max = parseInt(DOM.quantityInput.max) || Infinity;
    if (value < min) value = min;
    if (value > max) value = max;
    DOM.quantityInput.value = value;
    state.cart.quantity = value;
    calculateTotal();
});

// ============================================
// CALCULATE TOTAL
// ============================================
function calculateTotal() {
    const service = state.selectedService;
    if (!service) { DOM.totalAmount.textContent = 'Rp 0'; return; }
    const qty = parseInt(DOM.quantityInput.value) || 0;
    const total = qty * service.price;
    state.cart.totalPrice = total;
    DOM.totalAmount.textContent = `Rp ${formatNumber(total)}`;
}

// ============================================
// ORDER FORM SUBMIT
// ============================================
DOM.orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const serviceId = DOM.serviceSelect.value;
    const target = DOM.targetInput.value.trim();
    const quantity = parseInt(DOM.quantityInput.value) || 0;
    
    if (!serviceId) { showToast('Pilih layanan!', 'error'); return; }
    if (!target) { showToast('Masukkan target akun!', 'error'); return; }
    
    const service = state.services.find(s => s.id == serviceId);
    if (!service) { showToast('Layanan tidak ditemukan!', 'error'); return; }
    
    const total = quantity * service.price;
    DOM.modalService.textContent = service.name;
    DOM.modalTarget.textContent = target;
    DOM.modalQuantity.textContent = quantity;
    DOM.modalTotal.textContent = `Rp ${formatNumber(total)}`;
    DOM.modalAmount.textContent = `Rp ${formatNumber(total)}`;
    DOM.hiddenService.value = serviceId;
    DOM.hiddenTarget.value = target;
    DOM.hiddenQuantity.value = quantity;
    DOM.hiddenPrice.value = total;
    DOM.paymentModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// ============================================
// CLOSE MODAL
// ============================================
function closeModal() {
    DOM.paymentModal.classList.remove('active');
    document.body.style.overflow = '';
    DOM.imagePreview.innerHTML = '';
    DOM.proofImage.value = '';
    DOM.senderName.value = '';
}
DOM.modalClose.addEventListener('click', closeModal);
DOM.paymentModal.addEventListener('click', (e) => { if (e.target === DOM.paymentModal) closeModal(); });

// ============================================
// PROOF IMAGE UPLOAD
// ============================================
DOM.proofImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showToast('Maksimal 2MB!', 'error'); DOM.proofImage.value = ''; return; }
    if (!file.type.startsWith('image/')) { showToast('Harus gambar!', 'error'); DOM.proofImage.value = ''; return; }
    const reader = new FileReader();
    reader.onload = (e) => DOM.imagePreview.innerHTML = `<img src="${e.target.result}" alt="Bukti" />`;
    reader.readAsDataURL(file);
});

// ============================================
// CONFIRMATION FORM
// ============================================
DOM.confirmationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const senderName = DOM.senderName.value.trim();
    const proofFile = DOM.proofImage.files[0];
    const serviceId = DOM.hiddenService.value;
    const target = DOM.hiddenTarget.value;
    const quantity = parseInt(DOM.hiddenQuantity.value);
    const total = parseInt(DOM.hiddenPrice.value);
    
    if (!senderName) { showToast('Masukkan nama pengirim!', 'error'); return; }
    if (!proofFile) { showToast('Upload bukti transfer!', 'error'); return; }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const order = {
            id: Date.now(),
            orderId: `#SMB-${Date.now().toString().slice(-6)}`,
            serviceId, serviceName: state.services.find(s => s.id == serviceId)?.name || 'Unknown',
            target, quantity, price: total, status: 'pending',
            payment: { senderName, proofImage: e.target.result, transferDate: new Date().toISOString() },
            createdAt: new Date().toISOString()
        };
        saveOrder(order);
        closeModal();
        DOM.orderForm.reset();
        DOM.totalAmount.textContent = 'Rp 0';
        DOM.imagePreview.innerHTML = '';
        state.cart = { serviceId: null, target: '', quantity: 0, totalPrice: 0 };
        showToast('✅ Pesanan berhasil! Cek di Tracking.', 'success');
        document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
        DOM.serviceSelect.value = '';
        DOM.pricePerUnit.textContent = 'Rp 0';
        DOM.minOrder.textContent = '0';
        DOM.maxOrder.textContent = '0';
        DOM.qtyMinDisplay.textContent = '0';
        switchTab('tracking');
    };
    reader.readAsDataURL(proofFile);
});

// ============================================
// SAVE & GET ORDERS
// ============================================
function saveOrder(order) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

function getOrders() {
    return JSON.parse(localStorage.getItem('orders')) || [];
}

// ============================================
// TRACKING ORDERS
// ============================================
function trackOrders(username) {
    if (!username) {
        DOM.trackingOrders.innerHTML = `<div class="tracking-empty"><i class="fas fa-search"></i><p>Masukkan username untuk melacak pesanan</p></div>`;
        return;
    }
    const orders = getOrders().filter(o => o.target?.toLowerCase().includes(username.toLowerCase()));
    if (orders.length === 0) {
        DOM.trackingOrders.innerHTML = `<div class="tracking-empty"><i class="fas fa-inbox"></i><p>Tidak ada pesanan ditemukan</p></div>`;
        return;
    }
    DOM.trackingOrders.innerHTML = orders.sort((a, b) => b.id - a.id).map(order => `
        <div class="tracking-card">
            <div class="tracking-header">
                <span class="tracking-id">${order.orderId || '#' + order.id}</span>
                <span class="tracking-date">${formatDate(order.createdAt)}</span>
            </div>
            <div class="tracking-body">
                <div class="tracking-service">${order.serviceName}</div>
                <div class="tracking-target"><i class="fas fa-user"></i> ${order.target}</div>
                <div class="tracking-qty">Qty: ${order.quantity} | Total: Rp ${formatNumber(order.price)}</div>
                <div class="tracking-status status-${order.status}">
                    <i class="fas ${getStatusIcon(order.status)}"></i> ${capitalize(order.status)}
                </div>
                ${order.status === 'rejected' && order.reason ? `<div class="tracking-reason"><i class="fas fa-info-circle"></i> ${order.reason}</div>` : ''}
            </div>
        </div>
    `).join('');
}

// ============================================
// SEARCH TRACKING
// ============================================
DOM.trackingSearchBtn.addEventListener('click', () => {
    const username = DOM.trackingTargetInput.value.trim();
    trackOrders(username);
});
DOM.trackingTargetInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') DOM.trackingSearchBtn.click(); });

// ============================================
// SWITCH TAB
// ============================================
function switchTab(tab) {
    state.currentPage = tab;
    document.querySelectorAll('.page-section').forEach(section => section.style.display = 'none');
    document.getElementById(`${tab}Section`).style.display = 'block';
    document.querySelectorAll('.nav-link').forEach(link => link.classList.toggle('active', link.dataset.tab === tab));
    if (tab === 'tracking') { trackOrders(DOM.trackingTargetInput.value.trim()); }
}

// ============================================
// NAV LINKS
// ============================================
DOM.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;
        if (tab) switchTab(tab);
        DOM.navbarMenu.classList.remove('active');
    });
});

// ============================================
// TOAST
// ============================================
function showToast(message, type = 'success') {
    DOM.toastMessage.textContent = message;
    DOM.toast.className = `toast show ${type === 'error' ? 'toast-error' : ''}`;
    clearTimeout(DOM.toast._timeout);
    DOM.toast._timeout = setTimeout(() => DOM.toast.classList.remove('show'), 4000);
}

// ============================================
// UTILITY
// ============================================
function formatNumber(num) { return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }

function formatDate(dateString) {
    const d = new Date(dateString);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

function getStatusIcon(status) {
    const icons = { pending: 'fa-clock', processed: 'fa-spinner fa-spin', completed: 'fa-check-circle', rejected: 'fa-times-circle' };
    return icons[status] || 'fa-circle';
}

function getServiceIcon(category) {
    const icons = { instagram: 'fa-instagram', tiktok: 'fa-tiktok', whatsapp: 'fa-whatsapp' };
    return icons[category] || 'fa-share-alt';
}

// ============================================
// HAMBURGER
// ============================================
DOM.hamburger.addEventListener('click', () => DOM.navbarMenu.classList.toggle('active'));

// ============================================
// SELECT CHANGE
// ============================================
DOM.serviceSelect.addEventListener('change', (e) => {
    const id = e.target.value;
    if (id) selectService(id);
    else {
        state.selectedService = null;
        DOM.pricePerUnit.textContent = 'Rp 0';
        DOM.minOrder.textContent = '0';
        DOM.maxOrder.textContent = '0';
        DOM.qtyMinDisplay.textContent = '0';
        DOM.totalAmount.textContent = 'Rp 0';
        document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
    }
});

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadServices();
    document.querySelectorAll('.dana-number').forEach(el => el.textContent = CONFIG.DANA_NUMBER);
    switchTab('services');
});
