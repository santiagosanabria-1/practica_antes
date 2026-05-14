const products = [
  { id: 1, name: "Audífonos Pro Wireless", price: 129900, category: ["audifonos"], badge: "Top ventas", specs: ["Bluetooth", "Cancelación", "Hi-Fi"], image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=90" },
  { id: 2, name: "Cargador Rápido 30W", price: 69900, category: ["cargadores"], badge: "Nuevo", specs: ["USB-C", "30W", "Carga segura"], image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=90" },
  { id: 3, name: "Funda MagSafe Premium", price: 59900, category: ["fundas"], badge: "Premium", specs: ["Antigolpes", "Magnética", "Delgada"], image: "https://images.unsplash.com/photo-1601972599720-36938d4ecd31?auto=format&fit=crop&w=900&q=90" },
  { id: 4, name: "Smartwatch Sport X", price: 189900, category: ["smartwatches"], badge: "Nuevo", specs: ["Salud", "Deporte", "Notificaciones"], image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=90" },
  { id: 5, name: "Parlante Mini Bass", price: 99900, category: ["parlantes"], badge: "Top ventas", specs: ["Bajos", "Portátil", "Bluetooth"], image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=90" },
  { id: 6, name: "Kit Gamer Mobile RGB", price: 149900, category: ["gamer"], badge: "Gamer", specs: ["RGB", "Triggers", "Precisión"], image: "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=900&q=90" },
  { id: 7, name: "Protector Hidrogel HD", price: 34900, category: ["fundas"], badge: "Nuevo", specs: ["Pantalla", "HD", "Ajuste exacto"], image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=900&q=90" },
  { id: 8, name: "Cable Reforzado Tipo C", price: 29900, category: ["cargadores"], badge: "Esencial", specs: ["1 metro", "Reforzado", "Datos"], image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=90" }
];

const formatter = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const productsGrid = document.getElementById("productsGrid");
const productSearch = document.getElementById("productSearch");
const filterButtons = document.querySelectorAll(".filter-btn");
const cartSidebar = document.getElementById("cartSidebar");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.querySelector(".cart-count");
const overlay = document.getElementById("overlay");
const checkoutBtn = document.getElementById("checkoutBtn");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
let activeFilter = "todos";
let cart = [];

function renderProducts() {
  const searchValue = productSearch.value.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    const matchesFilter = activeFilter === "todos" || product.category.includes(activeFilter);
    const matchesSearch = product.name.toLowerCase().includes(searchValue) || product.category.join(" ").includes(searchValue) || product.specs.join(" ").toLowerCase().includes(searchValue);
    return matchesFilter && matchesSearch;
  });

  productsGrid.innerHTML = filteredProducts.map((product) => `
    <article class="product-card magnetic">
      <span class="product-badge">${product.badge}</span>
      <div class="product-image"><img src="${product.image}" alt="${product.name}" loading="lazy"></div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="price">${formatter.format(product.price)}</p>
        <div class="chip-row">${product.specs.map((spec) => `<span class="chip">${spec}</span>`).join("")}</div>
        <button class="btn btn-primary add-cart magnetic" type="button" data-id="${product.id}">Agregar al carrito</button>
      </div>
    </article>
  `).join("") || `<p class="cart-empty">No encontramos productos con esos filtros.</p>`;

  attachMagnetic();
  animateProductCards();
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = totalItems;
  cartTotal.textContent = formatter.format(total);

  if (!cart.length) {
    cartItems.innerHTML = `<p class="cart-empty">Tu carrito está vacío. Agrega accesorios para iniciar tu compra.</p>`;
    checkoutBtn.href = "https://wa.me/573163071674?text=Hola%20T%C3%BA-M%C3%B3vil%2C%20quiero%20asesor%C3%ADa";
    return;
  }

  cartItems.innerHTML = cart.map((item) => `
    <article class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div><h4>${item.name}</h4><span>${item.quantity} x ${formatter.format(item.price)}</span></div>
      <button class="remove-item" type="button" data-id="${item.id}" aria-label="Eliminar ${item.name}"><i class="fa-solid fa-trash"></i></button>
    </article>
  `).join("");

  const message = cart.map((item) => `${item.quantity} x ${item.name} - ${formatter.format(item.price)}`).join("%0A");
  checkoutBtn.href = `https://wa.me/573163071674?text=Hola%20T%C3%BA-M%C3%B3vil%2C%20quiero%20comprar%3A%0A${message}%0ATotal%3A%20${encodeURIComponent(formatter.format(total))}`;
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) existingItem.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  renderCart();
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  renderCart();
}

function openCart() {
  cartSidebar.classList.add("open");
  cartSidebar.setAttribute("aria-hidden", "false");
  overlay.classList.add("active");
}

function closeCart() {
  cartSidebar.classList.remove("open");
  cartSidebar.setAttribute("aria-hidden", "true");
  overlay.classList.remove("active");
}

function bootAnimations() {
  if (window.AOS) AOS.init({ duration: 900, easing: "ease-out-cubic", once: true, offset: 90 });

  if (window.Swiper) {
    new Swiper(".feature-swiper", { loop: true, speed: 900, effect: "creative", creativeEffect: { prev: { translate: ["-22%", 0, -1], opacity: .5 }, next: { translate: ["100%", 0, 0] } }, autoplay: { delay: 3600, disableOnInteraction: false }, pagination: { el: ".swiper-pagination", clickable: true } });
    new Swiper(".testimonial-swiper", { loop: true, speed: 800, slidesPerView: 1.08, spaceBetween: 18, autoplay: { delay: 4300, disableOnInteraction: false }, breakpoints: { 780: { slidesPerView: 2.1 }, 1120: { slidesPerView: 2.8 } } });
  }

  if (!window.gsap) {
    document.getElementById("loader").style.display = "none";
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.timeline({ defaults: { ease: "power4.out" } })
    .to(".loader-core", { scale: .35, opacity: 0, delay: .6, duration: .55 })
    .to(".loader strong, .loader span", { y: -20, opacity: 0, stagger: .05, duration: .55 }, "<")
    .to(".loader", { yPercent: -100, duration: .9 })
    .from(".navbar", { y: -90, opacity: 0, duration: .75 }, "-=.35")
    .from(".hero h1 span", { yPercent: 110, opacity: 0, stagger: .1, duration: 1 }, "-=.45")
    .from(".hero-copy p, .hero-actions", { y: 28, opacity: 0, stagger: .12, duration: .75 }, "-=.5")
    .from(".phone, .spec-card", { y: 70, rotate: 8, opacity: 0, stagger: .12, duration: 1 }, "-=.75");

  gsap.to(".tech-marquee div", { xPercent: -25, ease: "none", scrollTrigger: { trigger: ".hero", scrub: 1 } });
  gsap.utils.toArray("[data-speed]").forEach((element) => {
    gsap.to(element, { y: () => Number(element.dataset.speed) * -420, ease: "none", scrollTrigger: { trigger: element, scrub: true } });
  });
  animateProductCards();
}

function animateProductCards() {
  if (!window.gsap) return;
  gsap.utils.toArray(".product-card").forEach((card) => {
    gsap.from(card, { y: 70, opacity: 0, duration: .75, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 88%" } });
  });
}

function attachMagnetic() {
  if (window.matchMedia("(max-width: 1050px)").matches) return;
  document.querySelectorAll(".magnetic").forEach((element) => {
    element.onmousemove = (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      element.style.transform = `translate(${x * .08}px, ${y * .08}px)`;
    };
    element.onmouseleave = () => { element.style.transform = "translate(0, 0)"; };
  });
}

function initCursor() {
  if (window.matchMedia("(max-width: 1050px)").matches) return;
  window.addEventListener("mousemove", (event) => {
    cursorDot.style.left = `${event.clientX}px`;
    cursorDot.style.top = `${event.clientY}px`;
    cursorRing.animate({ left: `${event.clientX}px`, top: `${event.clientY}px` }, { duration: 430, fill: "forwards" });
  });
  document.addEventListener("mouseover", (event) => {
    if (event.target.closest("a, button, .product-card, input, textarea")) cursorRing.classList.add("active");
  });
  document.addEventListener("mouseout", (event) => {
    if (event.target.closest("a, button, .product-card, input, textarea")) cursorRing.classList.remove("active");
  });
}

function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  const amount = 72;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = Array.from({ length: amount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - .5) * .38,
      vy: (Math.random() - .5) * .38,
      r: Math.random() * 1.8 + .7
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(125, 249, 255, .62)";
      ctx.fill();

      for (let j = index + 1; j < particles.length; j += 1) {
        const q = particles[j];
        const distance = Math.hypot(p.x - q.x, p.y - q.y);
        if (distance < 115) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(143, 92, 255, ${1 - distance / 115})`;
          ctx.lineWidth = .45;
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", resize);
}

productsGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".add-cart");
  if (button) addToCart(Number(button.dataset.id));
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest(".remove-item");
  if (button) removeFromCart(Number(button.dataset.id));
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderProducts();
  });
});

productSearch.addEventListener("input", renderProducts);
document.querySelector(".cart-trigger").addEventListener("click", openCart);
document.querySelector(".close-cart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
navLinks.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

window.addEventListener("scroll", () => {
  document.querySelector(".navbar").classList.toggle("scrolled", window.scrollY > 40);
});

document.getElementById("contactForm").addEventListener("submit", (event) => {
  event.preventDefault();
  alert("Solicitud recibida. Tú-Móvil te contactará muy pronto.");
  event.currentTarget.reset();
});

renderProducts();
renderCart();
initCursor();
initParticles();
attachMagnetic();
window.addEventListener("load", bootAnimations);
