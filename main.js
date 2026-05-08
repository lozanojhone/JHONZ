// === BASE DE DATOS LOCAL CON TALLAS Y COLORES ===
const WHATSAPP_NUM = "51906308439"; 
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

// Añadir al carrito con opciones seleccionadas
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
        
        // Efecto visual al agregar
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

// Renderizado con selectores de talla y color
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
                <button class="add-btn" onclick="addToCart(${p.id})"><i class="fas fa-shopping-cart"></i> AÑADIR AL CARRITO</button>
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
                <p class='empty-msg' style="font-size: 1.5rem; color: #888;">Tu carrito está vacío.</p>
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
                <h4 style="font-size: 1.2rem; margin-bottom: 5px;">${item.name}</h4>
                <p style="color: #bbb; font-size: 0.9rem;">Talla: <span style="color:white; font-weight:bold;">${item.size}</span> | Color: <span style="color:white; font-weight:bold;">${item.color}</span></p>
                <p class="item-price" style="color: var(--orange); font-size: 1.2rem; font-weight: bold; margin-top: 5px;">S/ ${item.price.toFixed(2)}</p>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${index})" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
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
        msg += `*${i+1}. ${item.name}*%0A   Talla: ${item.size} | Color: ${item.color}%0A   Precio: S/ ${item.price.toFixed(2)}%0A%0A`;
        total += item.price;
    });
    msg += `------------------%0A*TOTAL A PAGAR: S/ ${total.toFixed(2)}*%0A%0A¡Hola! Quiero confirmar mi pedido. ¿A dónde realizo el depósito?`;
    window.open(`https://wa.me/${WHATSAPP_NUM}?text=${msg}`, '_blank');
}

// Videos interactivos: reproducir al pasar el mouse
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
