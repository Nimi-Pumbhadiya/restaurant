

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {
    initializeDateAndTime();
    initializeCart();
    initializeCheckoutValidation();
    initializeCategoryTabs();
    initializePopupCart();
    initializeMobileMenu();
    initializeSwiper();
});

/** Set today's date as the minimum for the date picker */
function initializeDateAndTime() {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    document.querySelectorAll('#currentDate').forEach(el => el.textContent = formattedDate);
    document.querySelectorAll('#currentTime').forEach(el => el.textContent = formattedTime);
    document.querySelectorAll('#invoiceDate').forEach(el => el.textContent = formattedDate);

    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.min = currentDate.toISOString().split('T')[0];
    }
}
/** Cart functionality */
function initializeCart() {
    document.querySelectorAll('.text-red-500').forEach(button => {
        button.addEventListener('click', function () {
            const cartItem = this.closest('.border-b');
            if (cartItem) {
                cartItem.style.opacity = '0';
                setTimeout(() => {
                    cartItem.remove();
                    updateCartTotal();
                }, 300);
            }
        });
    });
}

/** Cart total calculation */
function updateCartTotal() {
    let subtotal = 0;
    document.querySelectorAll('.cart-item').forEach(item => {
        const priceText = item.querySelector('.text-primary').textContent;
        const quantity = parseInt(item.querySelector('input').value, 10);
        const price = parseFloat(priceText.replace('$', ''));
        subtotal += price * quantity;
    });

    const subtotalEl = document.querySelector('.summary-row:first-child .font-medium');
    const taxEl = document.querySelector('.summary-row:nth-child(2) .font-medium');
    const totalEl = document.querySelector('.summary-total .text-primary');

    if (subtotalEl && taxEl && totalEl) {
        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        const tax = subtotal * 0.08;
        taxEl.textContent = `$${tax.toFixed(2)}`;
        const deliveryFee = 3.99;
        const total = subtotal + tax + deliveryFee;
        totalEl.textContent = `$${total.toFixed(2)}`;
    }
}

/** Checkout form validation */
function initializeCheckoutValidation() {
    const form = document.querySelector('form[action="receipt.html"]');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const data = {
            name: form.querySelector('[name="name"]').value,
            email: form.querySelector('[name="email"]').value,
            phone: form.querySelector('[name="phone"]').value,
            address: form.querySelector('[name="address"]').value,
            cardNumber: form.querySelector('[name="card-number"]').value,
            expiry: form.querySelector('[name="expiry"]').value,
            cvv: form.querySelector('[name="cvv"]').value
        };

        if (Object.values(data).some(v => !v)) {
            showToast('Please fill out all fields', 'error');
            return;
        }

        console.log('Checkout:', data);
        window.location.href = 'receipt.html';
    });
}

/** Category tab switcher */
function initializeCategoryTabs() {
    const tabs = document.querySelectorAll('.category-tab');
    const menues = document.querySelectorAll('.menu-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const category = this.getAttribute('data-category');
            menues.forEach(d => {
                d.style.display = category === 'all' || d.getAttribute('data-category') === category ? 'block' : 'none';
            });
        });
    });
}

/** Add-to-cart popup logic */
function initializePopupCart() {
    const cartPopup = document.getElementById('cartPopup');
    if (!cartPopup) return; 

    const closePopup = document.getElementById('closePopup');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const quantityValue = cartPopup.querySelector('.quantity-value');
    const totalPrice = document.getElementById('totalPrice');

    let quantity = 1;
    let currentPrice = 14.99;

    const popupItemName = document.getElementById('popupItemName');
    const popupItemDesc = document.getElementById('popupItemDesc');

    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function () {
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            const desc = this.getAttribute('data-description');
            const image = this.getAttribute('data-image');

            popupItemName.textContent = name;
            popupItemDesc.textContent = desc;

            document.getElementById('sizeSmall').checked = true;
            document.getElementById('crustThin').checked = true;
            document.querySelectorAll('input[name="topping"]').forEach(c => c.checked = false);
            document.getElementById('specialInstructions').value = '';

            quantity = 1;
            quantityValue.textContent = quantity;
            currentPrice = price;

            cartPopup.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    });

    closePopup?.addEventListener('click', () => {
        cartPopup.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });

    addToCartBtn?.addEventListener('click', () => {
        addToCartBtn.innerHTML = '<i class="fas fa-check"></i><span>Added!</span>';
        addToCartBtn.classList.replace('from-orange-500', 'from-green-500');
        addToCartBtn.classList.replace('to-orange-600', 'to-green-600');

        setTimeout(() => {
            addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i><span>Add to Cart</span>';
            addToCartBtn.classList.replace('from-green-500', 'from-orange-500');
            addToCartBtn.classList.replace('to-green-600', 'to-orange-600');

            setTimeout(() => {
                cartPopup.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }, 500);
        }, 1500);
    });

    cartPopup?.addEventListener('click', (e) => {
        if (e.target === cartPopup) {
            cartPopup.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
}
document.addEventListener('DOMContentLoaded', initializePopupCart);

document.addEventListener('DOMContentLoaded', function () {
const tabButtons = document.querySelectorAll('.category-tab');
const menuCards = document.querySelectorAll('.menu-card');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
    // Remove active class from all tabs
    tabButtons.forEach(btn => btn.classList.remove('active'));

    // Add active class to clicked tab
    button.classList.add('active');

    const selectedCategory = button.getAttribute('data-category');

    // Show/hide menu cards based on selected category
    menuCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (selectedCategory === 'all' || selectedCategory === cardCategory) {
        card.classList.remove('hidden');
        } else {
        card.classList.add('hidden');
        }
    });
    });
});
});

/** Mobile menu toggle */
function initializeMobileMenu() {
    const btn = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    if (btn && menu) {
        btn.addEventListener('click', () => menu.classList.toggle('active'));
    }
}

document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('open');
    
    // Toggle hamburger icon
    const icon = this.querySelector('i');
    if (menu.classList.contains('open')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(b => b.classList.remove("active", "text-primary", "border-b-2", "border-primary"));
            tabContents.forEach(tc => tc.classList.remove("active"));

            // Add active class to the clicked button and corresponding tab content
            btn.classList.add("active", "text-primary", "border-b-2", "border-primary");
            tabContents[index].classList.add("active");
        });
    });
});

/** Swiper.js slider for testimonials */
function initializeSwiper() {
    if (typeof Swiper !== 'undefined') {
        // Hero slider
        new Swiper('.hero-slider', {
            slidesPerView: 6,
            spaceBetween: 20,
            loop: true,
            speed: 4000,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
            },
            breakpoints: {
                0: { slidesPerView: 2, spaceBetween: 15 },
                640: { slidesPerView: 3, spaceBetween: 15 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 5 },
                1280: { slidesPerView: 6 }
            },
        });

        // Testimonial slider
        new Swiper('.testimonial-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: { delay: 5000, disableOnInteraction: false },
            breakpoints: {
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3}
            },
            arrow:false,
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            }
        });

        // Menu slider
        new Swiper('.menu-slider', {
            slidesPerView: 3,
            spaceBetween: 20,
            loop: false,
            speed: 1000,
            breakpoints: {
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 30 }
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
        });
        new Swiper('.blog-slider', {
            slidesPerView: 3,
            spaceBetween: 20,
            loop: false,
            speed: 1000,
            breakpoints: {
                0: { slidesPerView: 1, spaceBetween: 20 },
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 20 },
                1280: { slidesPerView: 3, spaceBetween: 30 }
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
        });
        new Swiper('.gallery-slider', {
            slidesPerView: 3,
            spaceBetween: 20,
            loop: true,
            speed: 1000,
            breakpoints: {
                0: { slidesPerView: 1, spaceBetween: 20 },
                640: { slidesPerView: 3, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
                1280: { slidesPerView: 5, spaceBetween: 30 }
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
        });
    }
}
document.addEventListener('DOMContentLoaded', function () {
  const tabs = Array.from(document.querySelectorAll('.menu-tab'));
  const tabContents = Array.from(document.querySelectorAll('.menu-content'));

  function resetTabs() {
    tabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => {
      content.classList.add('hidden');
      content.classList.remove('block');
    });
  }

  // Initial state
  resetTabs();
  if (tabs[0] && tabContents[0]) {
    tabs[0].classList.add('active');
    tabContents[0].classList.remove('hidden');
    tabContents[0].classList.add('block');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      resetTabs();
      this.classList.add('active');
      const tabName = this.getAttribute('data-tab');
      const content = document.querySelector('.menu-content[data-tab-content="' + tabName + '"]');
      if (content) {
        content.classList.remove('hidden');
        content.classList.add('block');
      }
    });
  });
});
// quantity js 
document.addEventListener("DOMContentLoaded", function () {
    const spinners = document.querySelectorAll(".quantity-spinner");

    spinners.forEach(spinner => {
      const decreaseBtn = spinner.querySelector(".decrease");
      const increaseBtn = spinner.querySelector(".increase");
      const quantityDisplay = spinner.querySelector(".quantity-value");

      let quantity = parseInt(quantityDisplay.textContent, 10);

      increaseBtn.addEventListener("click", () => {
        quantity++;
        quantityDisplay.textContent = quantity;
      });

      decreaseBtn.addEventListener("click", () => {
        if (quantity > 1) {
          quantity--;
          quantityDisplay.textContent = quantity;
        }
      });
    });
  });

//   date picker js 
  document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById('datepicker-input');
    const calendar = document.getElementById('datepicker-calendar');
    if (!input || !calendar) return; 
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let selectedDate = null;
    input.addEventListener('click', (e) => {
      e.stopPropagation();
      calendar.classList.remove('hidden');
      renderCalendar(currentYear, currentMonth);
    });
    calendar.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', () => {
      calendar.classList.add('hidden');
    });
    function renderCalendar(year, month) {
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const monthNames = ["January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"];
      let html = `
        <div class="flex justify-between items-center mb-2">
          <button type="button" onclick="changeMonth(-1)" class="px-1.5 py-1 hover:bg-gray-200 rounded"><i class="fa-solid fa-angle-left"></i></button>
          <span class="font-semibold">${monthNames[month]} ${year}</span>
          <button type="button" onclick="changeMonth(1)" class="px-1.5 py-1 hover:bg-gray-200 rounded"><i class="fa-solid fa-angle-right"></i></button>
        </div>
        <div class="grid grid-cols-7 text-center font-semibold text-sm mb-1">
          <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
        </div>
        <div class="grid grid-cols-7 gap-1 text-center text-sm">
      `;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      for (let i = 0; i < firstDay; i++) {
        html += `<div></div>`;
      }
      for (let day = 1; day <= daysInMonth; day++) {
        const thisDate = new Date(year, month, day);
        thisDate.setHours(0, 0, 0, 0);
        const isPast = thisDate < today;
        const isSelected =
          selectedDate &&
          selectedDate.getFullYear() === year &&
          selectedDate.getMonth() === month &&
          selectedDate.getDate() === day;
        const isToday =
          today.getFullYear() === year &&
          today.getMonth() === month &&
          today.getDate() === day;
        const baseClasses = [
          "p-1.5",
          "rounded",
          "text-center",
          isSelected ? "bg-primary text-black" :
          isToday ? "bg-gray-200" : "",
        ];
        if (isPast) {
          html += `<div class="${baseClasses.join(' ')} opacity-40 cursor-not-allowed">${day}</div>`;
        } else {
          html += `<div class="${["cursor-pointer", "hover:bg-primary/20", ...baseClasses].join(' ')}" onclick="selectDate(${day})">${day}</div>`;
        }
      }
      html += `</div>`;
      calendar.innerHTML = html;
    }
    window.changeMonth = function (offset) {
      currentMonth += offset;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar(currentYear, currentMonth);
    };
    window.selectDate = function (day) {
      selectedDate = new Date(currentYear, currentMonth, day);

      const dd = String(day).padStart(2, '0');
      const mm = String(currentMonth + 1).padStart(2, '0');
      const yyyy = currentYear;

      const formatted = `${dd}/${mm}/${yyyy}`;
      input.value = formatted;
      calendar.classList.add('hidden');
    };
  });