// file: script.js

// --- 1. KONFIGURASI WAJIB GANTI ---
const WHATSAPP_NUMBER = '6282122321195'; // GANTI dengan nomor WA Anda (tanpa + atau spasi)
// --- AKHIR KONFIGURASI ---

// Data Menu
const menuItems = [
    { id: 1, nama: "Nasi Kepal Ayam", harga: 6000, gambar: "nasi-kepal.jpg" }, 
    { id: 2, nama: "Nasi Ayam Pop", harga: 15000, gambar: "Ayam-fire.jpg" },
    { id: 3, nama: "Ayam Bakar", harga: 15000, gambar: "Ayam-Bakar.jfif" }, 
    { id: 4, nama: "Nasi Bakar", harga: 10000, gambar: "Nasi-Bakar.jfif" }, 
];

let cart = [];

// Elemen DOM
const menuContainer = document.getElementById('menu-container');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountElement = document.getElementById('cart-count');
const cartTotalElement = document.getElementById('cart-total-price');
const whatsappBtn = document.getElementById('whatsapp-order-btn');

// --- Fungsi Utilitas ---

/**
 * Memformat angka menjadi format Rupiah (IDR).
 * @param {number} number - Angka yang akan diformat.
 * @returns {string} - String format Rupiah.
 */
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
}

// --- Fungsionalitas Menu & Keranjang ---

/**
 * Merender daftar menu ke DOM.
 */
function renderMenu() {
    menuContainer.innerHTML = '';
    menuItems.forEach(item => {
        // Gunakan gambar default jika tidak ada gambar spesifik
        const imageSrc = item.gambar ? item.gambar : 'placeholder.jpg'; 
        
        const itemHTML = `
            <div class="menu-item">
                <img src="${imageSrc}" alt="${item.nama}" class="menu-item-image"> 
                <h4>${item.nama}</h4>
                <span class="item-price">${formatRupiah(item.harga)}</span>
                <button class="add-btn" onclick="addToCart(${item.id})">
                    + Tambah ke Keranjang
                </button>
            </div>
        `;
        menuContainer.innerHTML += itemHTML;
    });
}

/**
 * Menambahkan item ke keranjang atau menambah kuantitasnya.
 * @param {number} itemId - ID item menu yang akan ditambahkan.
 */
function addToCart(itemId) {
    const existingItem = cart.find(item => item.id === itemId);
    const menuItem = menuItems.find(item => item.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else if (menuItem) {
        cart.push({ ...menuItem, quantity: 1 });
    }
    updateCartDisplay();
}

/**
 * Memperbarui kuantitas item dalam keranjang.
 * @param {number} itemId - ID item yang kuantitasnya akan diubah.
 * @param {number} change - Nilai perubahan kuantitas (-1 atau 1).
 */
function updateQuantity(itemId, change) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1); // Hapus item jika kuantitas <= 0
        }
    }
    updateCartDisplay();
}

/**
 * Memperbarui tampilan keranjang dan total harga.
 */
function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let itemCount = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-message">Keranjang masih kosong.</p>';
        whatsappBtn.disabled = true;
    } else {
        cart.forEach(item => {
            const itemTotal = item.harga * item.quantity;
            total += itemTotal;
            itemCount += item.quantity;

            const itemHTML = `
                <div class="cart-item">
                    <span class="item-name-qty">${item.nama} (${item.quantity}x)</span>
                    <div class="item-controls">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span style="font-weight: bold;">${formatRupiah(itemTotal)}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
            `;
            cartItemsContainer.innerHTML += itemHTML;
        });
        whatsappBtn.disabled = false;
    }

    cartTotalElement.textContent = formatRupiah(total);
    cartCountElement.textContent = itemCount;
}

// --- Fungsionalitas WhatsApp ---

/**
 * Membuat link WhatsApp dengan rincian pesanan.
 * @returns {string} - Link WhatsApp yang sudah di-encode.
 */
function createWhatsappLink() {
    let message = `*Halo, saya ingin memesan menu ini:*\n\n`;
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.harga * item.quantity;
        total += itemTotal;
        
        message += `${index + 1}. ${item.nama} (${item.quantity}x) - ${formatRupiah(itemTotal)}\n`;
    });

    message += `\n*TOTAL: ${formatRupiah(total)}*\n\n`;
    message += `Mohon konfirmasi pesanan saya. Terima kasih!`;
    
    // Encode pesan agar aman di URL
    const encodedMessage = encodeURIComponent(message);
    
    // Format link WA
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    return whatsappLink;
}

/**
 * Handler untuk tombol pesan via WhatsApp.
 */
function handleWhatsappOrder() {
    if (cart.length > 0) {
        const link = createWhatsappLink();
        window.open(link, '_blank');
    } else {
        alert("Keranjang Anda masih kosong!");
    }
}

// --- Inisialisasi ---

/**
 * Fungsi inisialisasi yang dijalankan saat DOM selesai dimuat.
 */
function initialize() {
    renderMenu();
    updateCartDisplay();
    whatsappBtn.addEventListener('click', handleWhatsappOrder);
    
    // Tampilkan Nomor WA di Footer
    document.getElementById('whatsapp-number-display').textContent = `+${WHATSAPP_NUMBER}`;

    // Generate QR Code untuk Kontak WA
    new QRCode(document.getElementById("qr-code-display"), {
        text: `https://wa.me/${WHATSAPP_NUMBER}`,
        width: 80,
        height: 80,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}

document.addEventListener('DOMContentLoaded', initialize);
