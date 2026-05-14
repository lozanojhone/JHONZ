// === BASE DE DATOS LOCAL CON TALLAS Y COLORES ===
const WHATSAPP_NUM = "51999999999"; 
const products = [
    { 
        id: 1, name: "Polo Oversize Neón", category: "polos", price: 65, 
        img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
        colors: ["Verde Neón", "Negro", "Blanco"],
        sizes: ["S", "M", "L", "XL"]
    },
    { 
        id: 2, name: "Casaca Bomber Reflectiva", category: "casacas", price: 185, 
        img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
        colors: ["Gris Plata", "Negro"],
        sizes: ["M", "L", "XL"]
    },
    { 
        id: 3, name: "Cargo Pant Black Tech", category: "pantalones", price: 125, 
        img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500",
        colors: ["Negro", "Verde Militar"],
        sizes: ["30", "32", "34"]
    },
    { 
        id: 4, name: "Hoodie Cyberpunk White", category: "hoodies", price: 110, 
        img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        colors: ["Blanco", "Negro"],
        sizes: ["S", "M", "L"]
    },
    { 
        id: 5, name: "Polo Graphic Urban", category: "polos", price: 55, 
        img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500",
        colors: ["Negro", "Azul Eléctrico"],
        sizes: ["S", "M", "L"]
    },
    { 
        id: 6, name: "Joggers Neon Edge", category: "pantalones", price: 95, 
        img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500",
        colors: ["Negro con Verde", "Gris"],
        sizes: ["S", "M", "L"]
    }
];

let cart = JSON.parse(localStorage.getItem('jhonz_cart')) || [];

function saveCart() {
    localStorage.setItem('jhonz_cart', JSON.stringify(cart));
}

function addToCart(id) {
    const prod = products.find(p => p.id === id);
    const colorSel = document.getElementById(`color-${id}`).value;
    const sizeSel = document.getElementById(`size-${id}`).value;

    if(prod) {
        const item = {
            uniqueKey: Date.now(), 
            id: prod.id,
            name: prod.name,
            price: prod.price,
            img: prod.img,
            color: colorSel,
            size: sizeSel
        };
        cart.push(item);
        saveCart();
        updateCartBadge();
        
        const btn = event.target;
        const originalText = btn.innerText;
        btn.innerText = "¡AGREGADO!";
        btn.style.backgroundColor = "var(--orange)";
        btn.style.color = "white";
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.backgroundColor = "transparent";
            btn.style.color = "var(--orange)";
        }, 1500);
    }
}

function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    if(badge) {
        badge.innerText = cart.length;
        badge.classList.add('pop');
        setTimeout(() => badge.classList.remove('pop'), 300);
    }
}

function renderProducts(list) {
    const container = document.getElementById('product-display');
    if(!container) return; 
    
    container.innerHTML = '';
    list.forEach(p => {
        const colorOptions = p.colors.map(c => `<option value="${c}">${c}</option>`).join('');
        const sizeOptions = p.sizes.map(s => `<option value="${s}">${s}</option>`).join('');

        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
            <div class="badge">NUEVO</div>
            <img src="${p.img}" alt="${p.name}">
            <div class="p-info">
                <h3>${p.name}</h3>
                <div class="product-selectors">
                    <select id="color-${p.id}" class="custom-select">${colorOptions}</select>
                    <select id="size-${p.id}" class="custom-select">${sizeOptions}</select>
                </div>
                <p class="price">S/ ${p.price.toFixed(2)}</p>
                <button class="add-btn" onclick="addToCart(${p.id})"><i class="fas fa-shopping-cart"></i> AÑADIR</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function applyFilters() {
    const searchBar = document.getElementById('searchBar');
    const filterCat = document.getElementById('filterCategory');
    if(!searchBar || !filterCat) return;

    const query = searchBar.value.toLowerCase();
    const cat = filterCat.value;
    const filtered = products.filter(p => (cat === 'all' || p.category === cat) && p.name.toLowerCase().includes(query));
    renderProducts(filtered);
}

function renderCartPage() {
    const list = document.getElementById('cart-items-list');
    const totalDisplay = document.getElementById('cart-total-price');
    if(!list || !totalDisplay) return;

    if(cart.length === 0) {
        list.innerHTML = `
            <div style="text-align:center; padding: 50px 0;">
                <i class="fas fa-box-open" style="font-size: 4rem; color: #444; margin-bottom: 20px;"></i>
                <p class='empty-msg'>Tu carrito está vacío.</p>
                <a href="catalogo.html" class="btn-orange" style="margin-top: 20px;">IR A LA TIENDA</a>
            </div>`;
        totalDisplay.innerText = "S/ 0.00";
        return;
    }

    list.innerHTML = "";
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        const div = document.createElement('div');
        div.className = 'cart-item-row';
        div.innerHTML = `
            <img src="${item.img}" width="80" style="border-radius: 8px;">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>Talla: ${item.size} | Color: ${item.color}</p>
                <p class="item-price">S/ ${item.price.toFixed(2)}</p>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${index})"><i class="fas fa-trash-alt"></i></button>
        `;
        list.appendChild(div);
    });
    totalDisplay.innerText = `S/ ${total.toFixed(2)}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartBadge();
    renderCartPage();
}

function sendToWhatsApp() {
    if(cart.length === 0) return alert("El carrito está vacío.");
    let msg = "*🔥 NUEVO PEDIDO JHONZ 🔥*%0A------------------%0A";
    let total = 0;
    cart.forEach((item, i) => {
        msg += `*${i+1}. ${item.name}* (${item.size}/${item.color})%0A`;
        total += item.price;
    });
    msg += `------------------%0A*TOTAL: S/ ${total.toFixed(2)}*`;
    window.open(`https://wa.me/${WHATSAPP_NUM}?text=${msg}`, '_blank');
}

// Lógica de Galería (Modal/Lightbox)
function openGalleryModal(imgSrc) {
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('modalImg');
    if(modal && modalImg) {
        modal.style.display = "flex";
        modalImg.src = imgSrc;
    }
}

function closeGalleryModal() {
    const modal = document.getElementById('galleryModal');
    if(modal) modal.style.display = "none";
}

function setupVideos() {
    const videos = document.querySelectorAll('.video-item video');
    videos.forEach(vid => {
        vid.addEventListener('mouseenter', () => { vid.play(); });
        vid.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });
    });
}

window.onload = () => {
    updateCartBadge();
    if(document.getElementById('product-display')) applyFilters();
    if(document.getElementById('cart-items-list')) renderCartPage();
    setupVideos();
};