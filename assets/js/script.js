// بيحسب طول شريط الخصم الأحمر (+ سبيسر لو موجود) عشان القائمة الجانبية
// وبانل البحث يبدأوا من تحته بالظبط، بدل ما يغطوه
function updatePanelOffset(){
    const promoBar = document.querySelector('.promo-bar');
    const spacerBar = document.querySelector('.spacer-bar');
    const mainHeader = document.querySelector('.main-header');
    if(!promoBar) return;
    const promoBottom = Math.max(0, promoBar.getBoundingClientRect().bottom);
    const panelStart = spacerBar ? Math.max(0, spacerBar.getBoundingClientRect().bottom) : promoBottom;
    // Bottom edge of the actual header row (logo/cart/heart/search/hamburger),
    // used so the filter drawer starts right under the header line instead of
    // behind/under it.
    const headerBottom = mainHeader ? Math.max(0, mainHeader.getBoundingClientRect().bottom) : panelStart;
    document.documentElement.style.setProperty('--panel-top', promoBottom + 'px');
    document.documentElement.style.setProperty('--filter-top', panelStart + 'px');
    document.documentElement.style.setProperty('--header-bottom', headerBottom + 'px');
}
updatePanelOffset();
window.addEventListener('resize', updatePanelOffset);

document.addEventListener('DOMContentLoaded', function(){

    const menuOpenBtn = document.getElementById('menuOpenBtn');
    const menuCloseBtn = document.getElementById('menuCloseBtn');
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');

    function openMenu(){
        updatePanelOffset();
        sideMenu.classList.add('active');
        overlay.classList.add('active');
        document.documentElement.classList.add('menu-open');
        document.body.classList.add('menu-open');
    }

    function closeMenu(){
        sideMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.documentElement.classList.remove('menu-open');
        document.body.classList.remove('menu-open');
    }

    if(menuOpenBtn) menuOpenBtn.addEventListener('click', openMenu);
    if(menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenu);
    if(overlay) overlay.addEventListener('click', closeMenu);

    const langToggle = document.getElementById('langToggle');
    const html = document.documentElement;
    let currentLang = 'ar';

    function readSavedLanguage(){
        try {
            const stored = localStorage.getItem('alyasser_lang');
            if(stored === 'ar' || stored === 'en') return stored;
        } catch(e) {}
        const cookieMatch = document.cookie.match(/(?:^|; )alyasser_lang=(ar|en)(?:;|$)/);
        return cookieMatch ? cookieMatch[1] : 'ar';
    }

    function saveLanguage(lang){
        try { localStorage.setItem('alyasser_lang', lang); } catch(e) {}
        document.cookie = 'alyasser_lang=' + lang + '; path=/; max-age=31536000; SameSite=Lax';
    }

    function applyLanguage(lang){
        lang = lang === 'en' ? 'en' : 'ar';
        currentLang = lang;
        saveLanguage(lang);

        document.querySelectorAll('[data-ar][data-en]').forEach(function(el){
            var langValue = lang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
            if (el.classList && el.classList.contains('anan-card-price')) {
                var strong = el.querySelector('strong');
                var del = el.querySelector('del');
                var oldNum = parseFloat(String(el.getAttribute('data-old-price') || '').replace(/[^0-9.]/g, ''));
                if (strong) strong.textContent = langValue;
                if (del && oldNum) {
                    var oldLocalized = oldNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    del.textContent = lang === 'ar' ? oldLocalized + ' ج.م' : oldLocalized + ' LE';
                }
                return;
            }
            if (el.classList && el.classList.contains('branch-text')) {
                el.innerHTML = langValue.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
                return;
            }
            el.textContent = langValue;
        });

        if (typeof refreshSaleBadges === 'function') refreshSaleBadges();

        document.querySelectorAll('[data-ar-placeholder][data-en-placeholder]').forEach(function(el){
            el.setAttribute('placeholder', lang === 'ar' ? el.getAttribute('data-ar-placeholder') : el.getAttribute('data-en-placeholder'));
        });

        if(lang === 'ar'){
            html.setAttribute('lang', 'ar');
            html.setAttribute('dir', 'rtl');
            if(langToggle) langToggle.textContent = 'EN';
        } else {
            html.setAttribute('lang', 'en');
            html.setAttribute('dir', 'ltr');
            if(langToggle) langToggle.textContent = 'AR';
        }

        // لو إحنا في صفحة المفضلة، أعد رسمها بلغة العرض الجديدة
        if(typeof renderWishlistPage === 'function') renderWishlistPage();
        if(typeof window.renderCheckoutPage === 'function') window.renderCheckoutPage();

        // اللغة اتوحدت في كل الصفحة، وضح الصفحة تاني (الإخفاء بدأ في head الصفحة)
        html.classList.remove('lang-loading');
    }

    if(langToggle){
        langToggle.addEventListener('click', function(){
            applyLanguage(currentLang === 'ar' ? 'en' : 'ar');
        });
    }

    applyLanguage(readSavedLanguage());

});

const slider = document.getElementById("reviewsSlider");
const prevBtn = document.querySelector(".slider-btn.prev");
const nextBtn = document.querySelector(".slider-btn.next");
const dotsContainer = document.getElementById("sliderDots");
const languageBtn = document.getElementById("languageBtn");

let currentLanguage = "ar";

/* ================= SLIDER ================= */

function getScrollAmount() {
  const card = document.querySelector(".review-card");

  if (!card) return 300;

  const gap = 20;

  return card.offsetWidth + gap;
}

if (slider && nextBtn && prevBtn) {

  nextBtn.addEventListener("click", () => {
    slider.scrollBy({
      left: document.documentElement.dir === "rtl"
        ? -getScrollAmount()
        : getScrollAmount(),
      behavior: "smooth"
    });
  });

  prevBtn.addEventListener("click", () => {
    slider.scrollBy({
      left: document.documentElement.dir === "rtl"
        ? getScrollAmount()
        : -getScrollAmount(),
      behavior: "smooth"
    });
  });

}


/* ================= LANGUAGE ================= */

function changeLanguage(language) {

  language = language === "en" ? "en" : "ar";
  currentLanguage = language;
  try { localStorage.setItem("alyasser_lang", language); } catch (e) {}
  document.cookie = "alyasser_lang=" + language + "; path=/; max-age=31536000; SameSite=Lax";
  
  document.documentElement.lang = language;

  if (language === "ar") {

    document.documentElement.dir = "rtl";

    if (languageBtn) languageBtn.textContent = "English";

  } else {

    document.documentElement.dir = "ltr";

    if (languageBtn) languageBtn.textContent = "العربية";
  }

  /*
   * Change all elements that contain
   * data-ar / data-en
   */

  const elements = document.querySelectorAll("[data-ar][data-en]");

  elements.forEach(element => {

    element.textContent = element.getAttribute(
      language === "ar" ? "data-ar" : "data-en"
    );

  });
}


/* ================= DOTS ================= */

function createDots() {

  if (!dotsContainer) return;

  const cards = document.querySelectorAll(".review-card");

  dotsContainer.innerHTML = "";

  /*
   * On desktop show fewer dots,
   * on mobile show one dot per card.
   */

  cards.forEach((card, index) => {

    const dot = document.createElement("button");

    dot.className = "slider-dot";

    if (index === 0) {
      dot.classList.add("active");
    }

    dot.addEventListener("click", () => {

      slider.scrollTo({
        left: document.documentElement.dir === "rtl"
          ? -(card.offsetWidth + 20) * index
          : (card.offsetWidth + 20) * index,
        behavior: "smooth"
      });

    });

    dotsContainer.appendChild(dot);

  });

}

let autoSlide;

// كل الكود المرتبط بالسلايدر (الدوتس، السكرول، اللمس، والتشغيل التلقائي)
// بيشتغل بس لو عناصر السلايدر موجودة فعلاً في الصفحة (زي index.html).
// من غير الشرط ده، صفحة زي wishlist.html (اللي معندهاش سلايدر تقييمات)
// كانت بتوقف تنفيذ script.js بالكامل وتمنع كود المفضلة من الاشتغال.
if (slider && nextBtn && prevBtn) {

  createDots();

  /* ================= UPDATE ACTIVE DOT ================= */

  slider.addEventListener("scroll", () => {

    const cards = document.querySelectorAll(".review-card");

    if (!cards.length) return;

    const scrollPosition = Math.abs(slider.scrollLeft);

    const cardWidth = cards[0].offsetWidth + 20;

    let index = Math.round(scrollPosition / cardWidth);

    const dots = document.querySelectorAll(".slider-dot");

    dots.forEach(dot => {
      dot.classList.remove("active");
    });

    if (dots[index]) {
      dots[index].classList.add("active");
    }

  });


  /* ================= TOUCH SWIPE ================= */

  let startX = 0;
  let endX = 0;

  slider.addEventListener("touchstart", (event) => {
    startX = event.touches[0].clientX;
  });

  slider.addEventListener("touchend", (event) => {

    endX = event.changedTouches[0].clientX;

    const difference = startX - endX;

    if (Math.abs(difference) < 50) return;

    if (difference > 0) {
      nextBtn.click();
    } else {
      prevBtn.click();
    }

  });


  /* ================= AUTO SLIDE ================= */

  autoSlide = setInterval(() => {

    const maxScroll =
      slider.scrollWidth - slider.clientWidth;

    const currentScroll = Math.abs(slider.scrollLeft);

    if (currentScroll >= maxScroll - 10) {

      if (document.documentElement.dir === "rtl") {
        slider.scrollTo({
          left: 0,
          behavior: "smooth"
        });
      } else {
        slider.scrollTo({
          left: 0,
          behavior: "smooth"
        });
      }

    } else {

      nextBtn.click();

    }

  }, 6000);


  /* Stop auto slide while user interacts */

  slider.addEventListener("mouseenter", () => {
    clearInterval(autoSlide);
  });

  slider.addEventListener("mouseleave", () => {

    autoSlide = setInterval(() => {
      nextBtn.click();
    }, 6000);

  });

}

const backToTop = document.getElementById("backToTop");

if (backToTop) backToTop.addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


/* ================================================================
   SEARCH — يعمل عربي وإنجليزي، ويقرأ المنتجات مباشرة من الصفحة
   (أي كارت .product-card جديد يُضاف للصفحة يدخل في نتائج البحث
   تلقائياً من غير أي تعديل هنا)
================================================================= */

const searchOpenBtn = document.getElementById('searchOpenBtn');
const searchCloseBtn = document.getElementById('searchCloseBtn');
const searchOverlay = document.getElementById('searchOverlay');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// تطبيع النص عشان البحث يتجاهل التشكيل واختلاف الألف/الياء/التاء المربوطة
function normalizeText(text){
    return (text || '')
        .replace(/[\u064B-\u0652]/g, '')   // إزالة التشكيل
        .replace(/[إأآا]/g, 'ا')
        .replace(/ى/g, 'ي')
        .replace(/ة/g, 'ه')
        .toLowerCase()
        .trim();
}

function getCurrentSearchLang(){
    return document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'ar';
}

function openSearch(){
    if(!searchOverlay) return;
    updatePanelOffset();
    searchOverlay.classList.add('active');
    document.body.classList.add('search-lock'); // يمنع سكرول الصفحة وهو البحث فاتح
    if(searchInput) searchInput.focus();
}

function closeSearch(){
    if(!searchOverlay) return;
    searchOverlay.classList.remove('active');
    document.body.classList.remove('search-lock');
    if(searchInput) searchInput.value = '';
    if(searchResults) searchResults.innerHTML = '';
}

if(searchOpenBtn) searchOpenBtn.addEventListener('click', openSearch);
if(searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);
if(searchOverlay){
    searchOverlay.addEventListener('click', function(e){
        if(e.target === searchOverlay) closeSearch();
    });
}
document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeSearch();
});

const categorySelect = document.getElementById('categorySelect');
let selectedCategory = 'all';

if(categorySelect){
    categorySelect.addEventListener('change', function(){
        selectedCategory = this.value;
        performSearch(searchInput.value);
    });
}

function performSearch(query){
    if(!searchResults) return;

    const q = normalizeText(query);
    searchResults.innerHTML = '';

    if(!q){
        return;
    }

    const lang = getCurrentSearchLang();

    // بيقرأ كل المنتجات الموجودة في الصفحة لحظياً — أي منتج جديد يتضاف
    // بنفس بنية .product-card يدخل في البحث تلقائي
    const cards = document.querySelectorAll('.product-card');
    const seen = new Set();
    const matches = [];

    cards.forEach(card => {
        const nameEl = card.querySelector('.product-name');
        if(!nameEl) return;

        const nameAr = nameEl.getAttribute('data-ar') || '';
        const nameEn = nameEl.getAttribute('data-en') || '';

        const key = nameAr + '|' + nameEn;
        if(seen.has(key)) return;

        const matchAr = normalizeText(nameAr).includes(q);
        const matchEn = nameEn.toLowerCase().includes(query.toLowerCase());

        if(matchAr || matchEn){
            seen.add(key);

            const priceEl = card.querySelector('.product-price');
            const imgEl = card.querySelector('.product-img, .product-img-wrap img');

            matches.push({
                nameAr,
                nameEn,
                priceAr: priceEl ? priceEl.getAttribute('data-ar') : '',
                priceEn: priceEl ? priceEl.getAttribute('data-en') : '',
                img: imgEl ? imgEl.getAttribute('src') : ''
            });
        }
    });

    if(matches.length === 0){
        const noResult = document.createElement('p');
        noResult.className = 'search-no-result';
        noResult.textContent = lang === 'ar' ? 'لا توجد نتائج' : 'No results found';
        searchResults.appendChild(noResult);
        return;
    }

    matches.forEach(m => {
        const item = document.createElement('a');
        item.href = '#';
        item.className = 'search-result-item';
        item.innerHTML =
            '<img src="' + m.img + '" alt="">' +
            '<div class="search-result-info">' +
                '<span class="search-result-name">' + (lang === 'ar' ? m.nameAr : m.nameEn) + '</span>' +
                '<span class="search-result-price">' + (lang === 'ar' ? m.priceAr : m.priceEn) + '</span>' +
            '</div>';
        searchResults.appendChild(item);
    });
}

if(searchInput){
    searchInput.addEventListener('input', function(){
        performSearch(this.value);
    });
}

/* ================================================================
   WISHLIST — تخزين في localStorage عشان تفضل محفوظة حتى لو قفلت
   المتصفح. أي زرار .wishlist-btn في أي كارت منتج بيشتغل تلقائي.
================================================================= */

const WISHLIST_KEY = 'alyasser_wishlist';

function getWishlist(){
    try{
        return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    }catch(e){
        return [];
    }
}

function saveWishlist(list){
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    if(typeof syncProductWishlistButtons === 'function') syncProductWishlistButtons();
}

function isInWishlist(id){
    return getWishlist().some(function(item){ return item.id === id; });
}

function updateWishlistCount(){
    const count = getWishlist().length;
    document.querySelectorAll('.wishlist-count').forEach(function(el){
        el.textContent = count;
    });
}

function getProductIdFromCard(card){
    const nameEl = card.querySelector('.product-name, .wishlist-item-name');
    if(!nameEl) return null;
    return nameEl.getAttribute('data-en') || nameEl.getAttribute('data-id') || nameEl.textContent.trim();
}

// Keep every product-card heart synchronized with the shared localStorage wishlist.
function syncProductWishlistButtons(){
    document.querySelectorAll('.product-card .wishlist-btn').forEach(function(btn){
        const card = btn.closest('.product-card');
        const id = card ? getProductIdFromCard(card) : null;
        const active = !!id && isInWishlist(id);
        const icon = btn.querySelector('i');
        btn.classList.toggle('active', active);
        btn.setAttribute('data-tooltip', active ? 'Browse Wishlist' : 'Add to Wishlist');
        if(icon){
            icon.classList.toggle('ph-fill', active);
        }
    });
}

function toggleWishlist(btn){
    const card = btn.closest('.product-card');
    if(!card) return;

    const id = getProductIdFromCard(card);
    if(!id) return;

    const nameEl = card.querySelector('.product-name');
    const priceEl = card.querySelector('.product-price');
    const imgFrontEl = card.querySelector('.img-front, .product-img, .product-img-wrap img');
    const imgBackEl = card.querySelector('.img-back');

    let list = getWishlist();
    const exists = list.some(function(item){ return item.id === id; });

const icon = btn.querySelector('i');
    if(exists){
        list = list.filter(function(item){ return item.id !== id; });
        btn.classList.remove('active');
        if(icon){ icon.classList.remove('ph-fill'); icon.classList.add('ph-heart'); }
    } else {
        const imgFront = imgFrontEl ? imgFrontEl.getAttribute('src') : '';
        list.push({
            id: id,
            nameAr: nameEl ? nameEl.getAttribute('data-ar') : '',
            nameEn: nameEl ? nameEl.getAttribute('data-en') : '',
            priceAr: priceEl ? priceEl.getAttribute('data-ar') : '',
            priceEn: priceEl ? priceEl.getAttribute('data-en') : '',
            img: imgFront,
            imgFront: imgFront,
            // لو مفيش صورة تانية (img-back) بنستخدم نفس الصورة الأولى
            imgBack: imgBackEl ? imgBackEl.getAttribute('src') : imgFront
        });
btn.classList.add('active');
        if(icon){ icon.classList.add('ph-fill'); }
    }

    saveWishlist(list);
    btn.setAttribute('data-tooltip', list.some(function(item){ return item.id === id; }) ? 'Browse Wishlist' : 'Add to Wishlist');
    updateWishlistCount();
    syncProductWishlistButtons();
}

// تفعيل كل زراير القلب الموجودة على كروت المنتجات في الصفحة
document.querySelectorAll('.product-card .wishlist-btn').forEach(function(btn){
    const card = btn.closest('.product-card');
    const id = card ? getProductIdFromCard(card) : null;
    btn.setAttribute('data-tooltip', btn.classList.contains('active') ? 'Browse Wishlist' : 'Add to Wishlist');
    if(id && isInWishlist(id)){
        btn.classList.add('active');
        const icon = btn.querySelector('i');
        if(icon){ icon.classList.add('ph-fill'); }
    }

	btn.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(btn);
    });
});

updateWishlistCount();


/* ================================================================
   WISHLIST PAGE — بيشتغل بس في صفحة wishlist.html (لما #wishlistGrid
   يكون موجود في الصفحة)
================================================================= */

const wishlistGrid = document.getElementById('wishlistGrid');
const wishlistEmpty = document.getElementById('wishlistEmpty');

function renderWishlistPage(){
    if(!wishlistGrid) return;

    const list = getWishlist();
    const lang = document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'ar';

    wishlistGrid.innerHTML = '';

    if(list.length === 0){
        if(wishlistEmpty) wishlistEmpty.style.display = 'flex';
        wishlistGrid.style.display = 'none';
        return;
    }

    if(wishlistEmpty) wishlistEmpty.style.display = 'none';
    wishlistGrid.style.display = 'flex';

    const quickShopText = lang === 'ar' ? 'تسوق سريع' : 'Quick Shop';

    list.forEach(function(item, index){
        const card = document.createElement('div');
        card.className = 'wishlist-card';
        // نفس ترتيب تأخير ظهور عناصر القائمة الجانبية، عشان الكروت تدخل واحد بعد التاني
        card.style.animationDelay = (index * 0.06) + 's';

        const imgFront = item.imgFront || item.img;
        const imgBack = item.imgBack || item.img;

        card.innerHTML =
            '<button class="wishlist-remove" data-id="' + item.id + '" aria-label="remove"><i class="ph ph-trash"></i></button>' +
            '<div class="product-img-wrap wishlist-img-wrap">' +
                '<img src="' + imgFront + '" class="product-img img-front" alt="">' +
                '<img src="' + imgBack + '" class="product-img img-back" alt="">' +
                '<button class="quick-shop-btn"><i class="ph ph-shopping-cart-simple"></i> <span>' + quickShopText + '</span></button>' +
            '</div>' +
            '<p class="wishlist-item-name">' + (lang === 'ar' ? item.nameAr : item.nameEn) + '</p>' +
            '<p class="wishlist-item-price">' + (lang === 'ar' ? item.priceAr : item.priceEn) + '</p>';
        wishlistGrid.appendChild(card);
    });

    wishlistGrid.querySelectorAll('.wishlist-remove').forEach(function(btn){
        btn.addEventListener('click', function(){
            const id = this.getAttribute('data-id');
            const list = getWishlist().filter(function(item){ return item.id !== id; });
            saveWishlist(list);
            updateWishlistCount();
            renderWishlistPage();
        });
    });
}

renderWishlistPage();


/* ================================================================
   QUICK SHOP + CART DRAWER
================================================================= */
(function(){
    const CART_KEY = 'alyasser_cart';
    const LEGACY_CART_KEYS = ['cart', 'alyasserCart', 'shoppingCart'];
    let quickProduct = null;
    let quickAddTimer = null;
    const $ = id => document.getElementById(id);

    function readCart(){
        const keys = [CART_KEY, ...LEGACY_CART_KEYS];
        for(const key of keys){
            try{
                const value = JSON.parse(localStorage.getItem(key));
                if(Array.isArray(value) && value.length) return value;
            }catch(e){}
        }
        return [];
    }
    function saveCart(cart){
        localStorage.setItem(CART_KEY, JSON.stringify(Array.isArray(cart) ? cart : []));
    }
    function money(value){return Number(value || 0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}) + ' LE';}
    function productFromCard(card){
        const name=card.querySelector('.product-name,.wishlist-item-name');
        const price=card.querySelector('.product-price,.wishlist-item-price');
        const img=card.querySelector('.img-front,.product-img,.wishlist-img-wrap img');
        const nameEn=name?.getAttribute('data-en') || name?.textContent.trim() || '';
        const nameAr=name?.getAttribute('data-ar') || name?.textContent.trim() || nameEn;
        const priceText=price?.getAttribute('data-en') || price?.textContent || '';
        const numeric=parseFloat(String(priceText).replace(/[^0-9.]/g,'')) || 0;
        const activeSwatch=card.querySelector('.color-swatches .swatch.active') || card.querySelector('.color-swatches .swatch');
        const colorTip=activeSwatch?.querySelector('.swatch-tooltip');
        const colorAr=colorTip?.getAttribute('data-ar') || colorTip?.textContent.trim() || 'أسود';
        const colorEn=colorTip?.getAttribute('data-en') || colorTip?.textContent.trim() || 'Black';
        const oldPrice=price?.querySelector('del');
        const isSale=!!card.querySelector('.anan-card-price, .product-sale-badge') || card.classList.contains('anan-sale-card');
        const oldNumeric=parseFloat(String(oldPrice?.textContent || price?.getAttribute('data-old-price') || '').replace(/[^0-9.]/g,'')) || 0;
        return {id:nameEn || img?.src, nameAr, nameEn, price:numeric, priceAr:price?.getAttribute('data-ar') || money(numeric), priceEn:price?.getAttribute('data-en') || money(numeric), oldPrice:oldNumeric, oldPriceAr:oldNumeric ? oldNumeric.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}) + ' ج.م' : '', oldPriceEn:oldNumeric ? money(oldNumeric) : '', isSale, img:img?.src || '', colorAr, colorEn};
    }
    function currentLang(){return document.documentElement.lang === 'en' ? 'en' : 'ar'}
    function updateCartCount(){const n=readCart().reduce((s,i)=>s+i.qty,0);document.querySelectorAll('.cart-count').forEach(e=>e.textContent=n)}

    function resetQuickAddButton(){
        if(quickAddTimer){window.clearTimeout(quickAddTimer); quickAddTimer=null;}
        const button=$('quickAddBtn');
        if(!button) return;
        button.classList.remove('is-loading','is-added');
        button.innerHTML=currentLang()==='ar' ? (button.dataset.ar || 'إضافة إلى السلة') : (button.dataset.en || 'ADD TO CART');
        button.removeAttribute('aria-label');
    }
    function openQuick(card){
        resetQuickAddButton();
        quickProduct=productFromCard(card); window.quickProductForOptions=quickProduct; if(!quickProduct || !$('quickShopOverlay')) return;
        $('quickShopName').textContent=currentLang()==='ar'?quickProduct.nameAr:quickProduct.nameEn;
        const quickPrice=$('quickShopPrice');
        const ananSale = !!card?.classList.contains('anan-sale-card') || /Anan Crepe Abaya|عنان/.test((quickProduct.nameEn || '') + ' ' + (quickProduct.nameAr || ''));
        if((quickProduct.isSale || ananSale) && (quickProduct.oldPrice || ananSale)){
            const lang=currentLang();
            var oldNum = quickProduct.oldPrice || (ananSale ? 1575 : 0);
            var oldTxt = oldNum ? oldNum.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}) : '';
            var newTxt = lang==='ar' ? quickProduct.priceAr : ((quickProduct.price||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}) + ' LE');
            quickPrice.innerHTML='<del>'+ oldTxt +'</del><strong>'+ newTxt +'</strong>';
        }else{
            quickPrice.textContent=currentLang()==='ar'?quickProduct.priceAr:((quickProduct.price||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}) + ' LE');
        }
        const colorLabel=document.querySelector('#quickShopOverlay .quick-shop-label');
        if(colorLabel) colorLabel.textContent=(currentLang()==='ar'?'اللون: ':'COLOR: ')+(currentLang()==='ar'?quickProduct.colorAr:quickProduct.colorEn);
        $('quickShopImage').src=quickProduct.img; $('quickShopThumb').src=quickProduct.img;
        $('quickQty').textContent='1';
        $('quickShopOverlay').classList.add('active'); $('quickShopOverlay').setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
        const waBox=document.querySelector('.whatsapp-box'); const btt=document.getElementById('backToTop');
        if(waBox) waBox.style.display='none'; if(btt) btt.style.display='none';
    }
    function closeQuick(){if(!$('quickShopOverlay'))return;$('quickShopOverlay').classList.remove('active');$('quickShopOverlay').setAttribute('aria-hidden','true');document.body.style.overflow='';const waBox=document.querySelector('.whatsapp-box');const btt=document.getElementById('backToTop');if(waBox) waBox.style.display='';if(btt) btt.style.display='';}
    function addProduct(item, qty){
        const cart=readCart(); const found=cart.find(x=>x.id===item.id);
        if(found) found.qty += qty; else cart.push({...item,qty}); saveCart(cart); updateCartCount(); renderCart();
    }
    function openCart(){if(!$('cartDrawer'))return; renderCart(); $('cartDrawer').classList.add('active');$('cartOverlay').classList.add('active');document.body.style.overflow='hidden'}
    function closeCart(){if(!$('cartDrawer'))return;$('cartDrawer').classList.remove('active');$('cartOverlay').classList.remove('active');document.body.style.overflow=''}
    function renderCart(){
        const cart=readCart(), items=$('cartItems'), empty=$('cartEmpty'), footer=$('cartFooter'); if(!items)return;
        items.innerHTML=''; let total=0;
        cart.forEach((item,index)=>{total+=item.price*item.qty; const row=document.createElement('div');row.className='cart-item';row.innerHTML='<img src="'+item.img+'" alt=""><div class="cart-item-info"><button class="cart-item-remove" data-index="'+index+'"><i class="ph ph-trash"></i></button><p class="cart-item-name">'+(currentLang()==='ar'?item.nameAr:item.nameEn)+'</p><p class="cart-item-price">'+money(item.price)+'</p><div class="quantity-control"><button class="cart-minus" data-index="'+index+'">−</button><span>'+item.qty+'</span><button class="cart-plus" data-index="'+index+'">+</button></div></div>';items.appendChild(row)});
        empty.classList.toggle('visible',cart.length===0); items.style.display=cart.length?'block':'none'; footer.style.display=cart.length?'block':'none'; $('cartSubtotal').textContent=money(total);
    }
    // Delegated fallback: handles hearts added after initial page load and keeps the click isolated from product links.
    document.addEventListener('click',function(e){
        const wishlist=e.target.closest('.product-card .wishlist-btn');
        if(wishlist){
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(wishlist);
            return;
        }
        const quick=e.target.closest('.quick-shop-btn'); if(quick){e.preventDefault();e.stopPropagation();openQuick(quick.closest('.product-card,.wishlist-card'));return}
        if(e.target.closest('.cart-view-btn')){e.preventDefault();window.location.href='cart.html';return}
        if(e.target.closest('#cartOpenBtn')){e.preventDefault();openCart();return}
        if(e.target.closest('#quickShopCloseBtn') || e.target.id==='quickShopOverlay'){closeQuick();return}
        if(e.target.closest('#cartCloseBtn') || e.target.id==='cartOverlay'){closeCart();return}
        if(e.target.closest('#returnShopBtn')){closeCart();return}
        const size=e.target.closest('.size-option'); if(size){document.querySelectorAll('.size-option').forEach(x=>x.classList.remove('active'));size.classList.add('active');return}
        if(e.target.closest('#quickQtyPlus')){$('quickQty').textContent=Number($('quickQty').textContent)+1;return}
        if(e.target.closest('#quickQtyMinus')){$('quickQty').textContent=Math.max(1,Number($('quickQty').textContent)-1);return}
        if(e.target.closest('#quickAddBtn') && quickProduct){
            const addBtn = e.target.closest('#quickAddBtn');
            if(addBtn.classList.contains('is-loading')) return;
            const originalText = addBtn.innerHTML;
            addBtn.classList.remove('is-added');
            addBtn.classList.add('is-loading');
            addBtn.innerHTML = '<span class="cart-spinner" aria-hidden="true"></span>';
            // Force a layout pass so the loading state is painted before the success state.
            void addBtn.offsetWidth;
            quickAddTimer = window.setTimeout(function(){
                quickAddTimer=null;
                addProduct({...quickProduct,size:window.selectedQuickSize||'44'},Number($('quickQty').textContent));
                addBtn.classList.remove('is-loading');
                addBtn.classList.add('is-added');
                addBtn.innerHTML = '<i class="ph ph-check" aria-hidden="true"></i><span>' + (currentLang()==='ar' ? 'تمت الإضافة إلى السلة' : 'ADDED TO CART') + '</span>';
                addBtn.setAttribute('aria-label', currentLang()==='ar' ? 'تمت الإضافة إلى السلة' : 'ADDED TO CART');
                window.setTimeout(function(){
                    if(addBtn.classList.contains('is-added')) resetQuickAddButton();
                }, 2800);
            }, 1500);
            return;
        }
        if(e.target.closest('#quickBuyBtn') && quickProduct){addProduct({...quickProduct,size:window.selectedQuickSize||'44'},Number($('quickQty').textContent));closeQuick();openCart();return}
        const remove=e.target.closest('.cart-item-remove'); if(remove){const cart=readCart();cart.splice(Number(remove.dataset.index),1);saveCart(cart);renderCart();updateCartCount();return}
        const plus=e.target.closest('.cart-plus'); if(plus){const cart=readCart();cart[Number(plus.dataset.index)].qty++;saveCart(cart);renderCart();updateCartCount();return}
        const minus=e.target.closest('.cart-minus'); if(minus){const cart=readCart(),i=Number(minus.dataset.index);cart[i].qty--;if(cart[i].qty<=0)cart.splice(i,1);saveCart(cart);renderCart();updateCartCount();return}
    });
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeQuick();closeCart()}});
    updateCartCount(); renderCart();
})();


/* ================================================================
   CHECKOUT — CASH ON DELIVERY
================================================================= */
(function(){
    const form=document.getElementById('checkoutForm');
    if(!form) return;
    const checkoutCartKey='alyasser_cart';
    const readCheckoutCart=()=>{try{return JSON.parse(localStorage.getItem(checkoutCartKey))||[]}catch(e){return[]}};
    const checkoutMoney=n=>document.documentElement.lang==='en'?(Number(n||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+' LE'):('ج.م '+Number(n||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}));
    const cart=readCheckoutCart();
    const shipping=110;
    let discount=0;
    const itemsEl=document.getElementById('checkoutItems');
    function renderCheckout(){
        let subtotal=0; itemsEl.innerHTML='';
        cart.forEach(item=>{subtotal+=Number(item.price||0)*Number(item.qty||1);const row=document.createElement('div');row.className='summary-product';row.innerHTML='<img src="'+item.img+'" alt=""><div class="summary-product-info"><strong>'+(document.documentElement.lang==='ar'?item.nameAr:item.nameEn)+'</strong><small>'+(item.color||'Black')+' / 44</small><small>◆ '+item.qty+' × '+checkoutMoney(item.price)+'</small></div><div class="summary-product-price">'+checkoutMoney(item.price*item.qty)+'</div>';itemsEl.appendChild(row)});
        const total=Math.max(0,subtotal+shipping-discount);
        document.getElementById('summarySubtotal').textContent=checkoutMoney(subtotal);
        document.getElementById('summaryShipping').textContent=checkoutMoney(shipping);
        document.getElementById('summaryTotal').textContent=checkoutMoney(total);
        document.getElementById('summarySavings').textContent=discount?'◆ TOTAL SAVINGS '+checkoutMoney(discount):'';
        return {subtotal,total};
    }
    window.renderCheckoutPage=renderCheckout;
    renderCheckout();
    document.getElementById('applyDiscount')?.addEventListener('click',function(){const code=document.getElementById('discountCode').value.trim().toUpperCase();if(code==='WELCOME10'){discount=Math.round(cart.reduce((s,i)=>s+i.price*i.qty,0)*.1);this.textContent='تم';}else{discount=0;this.textContent='تطبيق';}renderCheckout()});
    form.addEventListener('submit',function(e){
        e.preventDefault();
        if(!cart.length){document.getElementById('checkoutMessage').textContent='السلة فارغة. أضف منتجًا أولًا.';document.getElementById('checkoutMessage').classList.add('active');return}
        if(!form.checkValidity()){form.reportValidity();return}
        const data=Object.fromEntries(new FormData(form).entries());const totals=renderCheckout();
        const order={id:'AY-'+Date.now().toString().slice(-8),createdAt:new Date().toISOString(),payment:'Cash on Delivery',items:cart,customer:data,subtotal:totals.subtotal,shipping,total:totals.total};
        localStorage.setItem('alyasser_last_order',JSON.stringify(order));localStorage.removeItem(checkoutCartKey);
        const msg=document.getElementById('checkoutMessage');msg.innerHTML='<strong>تم استلام طلبك بنجاح.</strong><br>رقم الطلب: '+order.id+'<br>سيتم التواصل معك لتأكيد الطلب والدفع عند الاستلام.';msg.classList.add('active');form.querySelector('.complete-order-btn').disabled=true;form.querySelector('.complete-order-btn').style.opacity='.65';window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'});
    });
})();

/* Checkout navigation from cart and quick purchase */
document.addEventListener('click',function(e){
    if(e.target.closest('.cart-checkout-btn')){e.preventDefault();window.location.href='checkout.html';return}
    if(e.target.closest('#quickBuyBtn')){e.preventDefault();window.location.href='checkout.html';return}
});


/* ================================================================
   PRODUCT OPTIONS FIXES — colors, sizes and quick-shop wishlist
================================================================= */
(function(){
    let selectedQuickSize='44';
    const q=id=>document.getElementById(id);
    function wishlistHas(id){try{return (JSON.parse(localStorage.getItem('alyasser_wishlist'))||[]).some(x=>x.id===id)}catch(e){return false}}
    function renderQuickHeartIcon(btn,active){
        if(!btn)return;
        btn.innerHTML='<svg class="quick-heart-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" fill="'+(active?'currentColor':'none')+'" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path></svg>';
    }
    function setQuickHeart(){
        const btn=document.querySelector('.quick-wishlist');
        if(!btn)return;
        const item=window.quickProductForOptions;
        const active=item ? wishlistHas(item.id) : btn.classList.contains('active');
        btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',active?'true':'false');btn.setAttribute('data-tooltip',active?'Browse Wishlist':'Add to Wishlist');renderQuickHeartIcon(btn,active);
    }
    function toggleQuickHeart(){
        const btn=document.querySelector('#quickShopOverlay .quick-wishlist, .quick-shop-overlay .quick-wishlist');
        const item=window.quickProductForOptions;
        // غيّر الشكل فورًا؛ لا تنتظر اكتمال بيانات المنتج أو مراقب الـ MutationObserver.
        if(btn){
            const nextActive=!btn.classList.contains('active');
            btn.classList.toggle('active',nextActive);
            btn.setAttribute('aria-pressed',nextActive?'true':'false');
            renderQuickHeartIcon(btn,nextActive);
        }
        if(!item)return;
        let list=[];try{list=JSON.parse(localStorage.getItem('alyasser_wishlist'))||[]}catch(e){}
        const exists=list.some(x=>x.id===item.id);
        if(exists) list=list.filter(x=>x.id!==item.id); else list.push({...item,imgFront:item.img,imgBack:item.img});
        saveWishlist(list);
        updateWishlistCount();
        syncProductWishlistButtons();
    }
    function updateSizeLabel(){
        const labels=document.querySelectorAll('#quickShopOverlay .quick-shop-label');
        if(labels[1]){labels[1].classList.add('size-label');labels[1].textContent=(document.documentElement.lang==='ar'?'المقاس: ':'SIZE: ')+selectedQuickSize;window.selectedQuickSize=selectedQuickSize}
    }
    document.addEventListener('click',function(e){
        const swatch=e.target.closest('.color-swatches .swatch');
        if(swatch){
            e.preventDefault();e.stopPropagation();
            const card=swatch.closest('.product-card');if(!card)return;
            card.querySelectorAll('.color-swatches .swatch').forEach(x=>x.classList.remove('active'));swatch.classList.add('active');
            const front=card.querySelector('.img-a,.img-front');const back=card.querySelector('.img-b,.img-back');
            if(front){
                const colorTip=swatch.querySelector('.swatch-tooltip');
                const colorAr=colorTip?.getAttribute('data-ar') || colorTip?.textContent.trim() || '';
                const colorEn=colorTip?.getAttribute('data-en') || colorTip?.textContent.trim() || '';
                const colorLabel=document.querySelector('#quickShopOverlay .quick-shop-label');
                if(colorLabel) colorLabel.textContent=(document.documentElement.lang==='ar'?'اللون: ':'COLOR: ')+(document.documentElement.lang==='ar'?colorAr:colorEn);
                const match = swatch.style.backgroundImage.match(/url\(["']?(.*?)['"]?\)/);
                if(match && match[1]) front.src = match[1];
                front.classList.add('active-a');
            }
            if(back) back.classList.remove('active-b');
            return;
        }
        const size=e.target.closest('#quickShopSizes .size-option,.quick-shop-overlay .size-option');
        if(size){e.preventDefault();e.stopPropagation();document.querySelectorAll('#quickShopOverlay .size-option,.quick-shop-overlay .size-option').forEach(x=>x.classList.remove('active'));size.classList.add('active');selectedQuickSize=size.textContent.trim();updateSizeLabel();return}
        if(e.target.closest('.quick-wishlist')){e.preventDefault();e.stopPropagation();toggleQuickHeart();return}
    },true);
    const originalOpen=document.querySelector('.quick-shop-overlay');
    const observer=new MutationObserver(function(){
        if(originalOpen?.classList.contains('active')){
            const modal=originalOpen.querySelector('.quick-shop-actions');
            if(modal && !modal.querySelector('.quick-wishlist')){const b=document.createElement('button');b.className='quick-wishlist';b.type='button';b.setAttribute('aria-label','Add to wishlist');b.setAttribute('data-tooltip','Add to Wishlist');b.innerHTML='<svg class="quick-heart-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path></svg>';modal.appendChild(b)}
            selectedQuickSize='44';updateSizeLabel();setQuickHeart();
        }
    });
    if(originalOpen)observer.observe(originalOpen,{attributes:true,attributeFilter:['class']});
    const oldAddButtons=document.querySelectorAll('#quickAddBtn,#quickBuyBtn');
    oldAddButtons.forEach(btn=>btn.addEventListener('click',function(){
        try{const c=JSON.parse(localStorage.getItem('alyasser_cart'))||[];if(c.length)c[c.length-1].size=selectedQuickSize;localStorage.setItem('alyasser_cart',JSON.stringify(c))}catch(e){}
    },true));
    // expose the currently opened product by observing the modal title/image after it opens
    if(originalOpen){const productObserver=new MutationObserver(function(){const name=q('quickShopName')?.textContent;if(name){try{const c=[...document.querySelectorAll('.product-card,.wishlist-card')].find(x=>(x.querySelector('.product-name,.wishlist-item-name')?.textContent.trim()===name.trim()));if(c){const id=c.querySelector('.product-name')?.getAttribute('data-en')||c.querySelector('.wishlist-item-name')?.textContent.trim();window.quickProductForOptions={id:id,nameAr:name,nameEn:name,price:0,img:q('quickShopImage')?.src||''}}}catch(e){}}});productObserver.observe(document.body,{subtree:true,childList:true,characterData:true});}
})();

/* Expandable sidebar collections from the reference layout */
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.submenu-toggle').forEach(function(toggle){
    toggle.addEventListener('click', function(event){
      event.preventDefault();
      event.stopPropagation();
      const parent = toggle.closest('.has-submenu');
      if(!parent) return;
      const isOpen = parent.classList.toggle('submenu-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });
});


/* ================= SIDEBAR SUBMENU =================
   فتح القائمة عند الضغط على اسم القسم أو على السهم
====================================================== */
document.querySelectorAll('.has-submenu').forEach(function (submenuItem) {
    const row = submenuItem.querySelector(':scope > .submenu-row');
    const titleLink = row ? row.querySelector(':scope > a') : null;
    const toggleButton = row ? row.querySelector(':scope > .submenu-toggle') : null;

    if (!row) return;

    function toggleSubmenu(event) {
        if (event) event.preventDefault();
        const isOpen = submenuItem.classList.toggle('submenu-open');
        if (toggleButton) {
            toggleButton.setAttribute('aria-expanded', String(isOpen));
        }
    }

    // الضغط على اسم القسم نفسه
    if (titleLink) {
        titleLink.addEventListener('click', toggleSubmenu);
    }

    // الضغط على السهم
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleSubmenu);
    }
});

// Make the linked season collection cards navigate on any click within the card.
document.querySelectorAll('.season-item > .season-card-link').forEach(function (link) {
    link.addEventListener('click', function (event) {
        event.stopPropagation();
        window.location.href = link.getAttribute('href');
    });
});


/* ===== SULAF REVIEW FILTER + SEARCH CONTROLS ===== */
(function initSulafReviewTools() {
    function setup() {
        const reviewSection = document.querySelector('.reference-reviews');
        if (!reviewSection) return;

        const filterButton = document.getElementById('sulafReviewFilterBtn');
        const searchButton = document.getElementById('sulafReviewSearchBtn');
        const filterPanel = document.getElementById('sulafReviewFilterPanel');
        const searchPanel = document.getElementById('sulafReviewSearchPanel');
        const searchInput = document.getElementById('sulafReviewSearchInput');
        const searchClear = document.getElementById('sulafReviewSearchClear');
        const filterClear = document.getElementById('sulafReviewFilterClear');
        const reviews = Array.from(reviewSection.querySelectorAll('.sulaf-review-list .sulaf-review'));
        const ratingButtons = Array.from(reviewSection.querySelectorAll('[data-rating-filter]'));
        let selectedRating = 'all';

        function setPanel(panel, button, open) {
            if (!panel || !button) return;
            panel.classList.toggle('is-open', open);
            panel.setAttribute('aria-hidden', String(!open));
            button.classList.toggle('is-active', open);
            button.setAttribute('aria-pressed', String(open));
        }

        function closeTools() {
            setPanel(filterPanel, filterButton, false);
            setPanel(searchPanel, searchButton, false);
        }

        function applyReviewFilters() {
            const query = (searchInput ? searchInput.value : '').trim().toLocaleLowerCase();
            reviews.forEach(function (review) {
                const ratingMatches = selectedRating === 'all' || review.dataset.rating === selectedRating;
                const textMatches = !query || review.textContent.toLocaleLowerCase().includes(query);
                review.classList.toggle('is-hidden', !(ratingMatches && textMatches));
            });
        }

        if (filterButton) filterButton.addEventListener('click', function () {
            const open = !filterPanel || !filterPanel.classList.contains('is-open');
            setPanel(searchPanel, searchButton, false);
            setPanel(filterPanel, filterButton, open);
        });

        if (searchButton) searchButton.addEventListener('click', function () {
            const open = !searchPanel || !searchPanel.classList.contains('is-open');
            setPanel(filterPanel, filterButton, false);
            setPanel(searchPanel, searchButton, open);
            if (open && searchInput) window.setTimeout(function () { searchInput.focus(); }, 120);
        });

        ratingButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                selectedRating = button.dataset.ratingFilter || 'all';
                ratingButtons.forEach(function (item) { item.classList.toggle('is-active', item === button); });
                applyReviewFilters();
            });
        });

        if (filterClear) filterClear.addEventListener('click', function () {
            selectedRating = 'all';
            ratingButtons.forEach(function (item) { item.classList.toggle('is-active', item.dataset.ratingFilter === 'all'); });
            applyReviewFilters();
        });

        if (searchInput) searchInput.addEventListener('input', applyReviewFilters);
        if (searchClear) searchClear.addEventListener('click', function () {
            if (searchInput) searchInput.value = '';
            applyReviewFilters();
            if (searchInput) searchInput.focus();
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') closeTools();
        });

        applyReviewFilters();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup, { once: true });
    else setup();
})();


/* ===== SULAF REVIEW SORT CONTROL ===== */
(function initSulafReviewSort() {
    function setup() {
        const section = document.querySelector('.reference-reviews');
        if (!section) return;
        const list = section.querySelector('.sulaf-review-list');
        const resetButton = document.getElementById('sulafReviewSearchClear');
        const sortButtons = Array.from(section.querySelectorAll('[data-review-sort]'));
        if (!list || !sortButtons.length) return;
        const originalReviews = Array.from(list.querySelectorAll('.sulaf-review'));

        function sortReviews(mode) {
            const reviews = Array.from(list.querySelectorAll('.sulaf-review'));
            reviews.sort(function (a, b) {
                if (mode === 'high' || mode === 'low') {
                    const aRating = Number(a.dataset.rating || 0);
                    const bRating = Number(b.dataset.rating || 0);
                    return mode === 'high' ? bRating - aRating : aRating - bRating;
                }
                return originalReviews.indexOf(a) - originalReviews.indexOf(b);
            });
            reviews.forEach(function (review) { list.appendChild(review); });
        }

        sortButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                sortButtons.forEach(function (item) { item.classList.toggle('is-active', item === button); });
                sortReviews(button.dataset.reviewSort || 'recent');
            });
        });

        if (resetButton) resetButton.addEventListener('click', function () {
            sortButtons.forEach(function (item) { item.classList.toggle('is-active', item.dataset.reviewSort === 'recent'); });
            sortReviews('recent');
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup, { once: true });
    else setup();
})();

/* ===== Toba preview for the middle card in Style of your choice only ===== */
(function initTobaStylePreview() {
    const tobaCards = Array.from(document.querySelectorAll('[data-toba-preview-card]'));
    const milanaCards = Array.from(document.querySelectorAll('[data-milana-preview-card]'));
    const cards = tobaCards.concat(milanaCards);
    const overlay = document.getElementById('tobaPreviewOverlay');
    if (!cards.length || !overlay) return;

    const media = document.getElementById('tobaPreviewMedia');
    const closeButton = document.getElementById('tobaPreviewClose');
    const previousButton = document.getElementById('tobaPreviewPrev');
    const nextButton = document.getElementById('tobaPreviewNext');
    const quantity = document.getElementById('tobaPreviewQty');
    const sizeContainer = document.getElementById('tobaPreviewSizes');
    let sizeButtons = Array.from(document.querySelectorAll('#tobaPreviewSizes .toba-preview-size'));
    const sizeLabel = overlay.querySelectorAll('.toba-preview-label')[1];
    const addButton = document.getElementById('tobaPreviewAdd');
    const buyButton = document.getElementById('tobaPreviewBuy');
    const colorButton = document.getElementById('tobaPreviewColor');
    const favoriteButton = document.getElementById('tobaPreviewFavorite');
    const sizeGuideButton = document.getElementById('tobaPreviewSizeGuide');
    const askButton = document.getElementById('tobaPreviewAsk');
    const sizeGuideOverlay = document.getElementById('tobaSizeGuideOverlay');
    const sizeGuideClose = document.getElementById('tobaSizeGuideClose');
    const questionOverlay = document.getElementById('tobaQuestionOverlay');
    const questionClose = document.getElementById('tobaQuestionClose');
    const questionForm = document.getElementById('tobaQuestionForm');
    const questionSuccess = document.getElementById('tobaQuestionSuccess');
    const questionProductImage = questionOverlay?.querySelector('.toba-question-product img');
    const questionProductName = questionOverlay?.querySelector('.toba-question-product strong');
    const questionProductPrice = questionOverlay?.querySelector('.toba-question-product span');
    const previewName = document.getElementById('tobaPreviewName');
    const previewPrice = overlay.querySelector('.toba-preview-price');
    const previewColorLabel = overlay.querySelectorAll('.toba-preview-label')[0];

    const products = {
        toba: {
            id: 'Toba Crepe Abaya', nameAr: 'عباية توبا كريب', nameEn: 'Toba Crepe Abaya',
            price: 1675, priceAr: '1,675.00 ج.م', priceEn: '1,675.00 LE',
            colorAr: 'أسود', colorEn: 'Black', colorCss: '#151b2b', defaultSize: '50',
            sizes: ['50', '52', '54', '56', '58', '60'], image: 'assets/img/A1.webp',
            gallery: [
                { type: 'image', src: 'assets/img/A1.webp' }, { type: 'video', src: 'assets/img/A2.mp4' },
                { type: 'image', src: 'assets/img/A3.webp' }, { type: 'image', src: 'assets/img/A4.webp' },
                { type: 'image', src: 'assets/img/A5.webp' }, { type: 'image', src: 'assets/img/A6.webp' },
                { type: 'image', src: 'assets/img/A7.webp' }, { type: 'image', src: 'assets/img/A8.webp' }
            ]
        },
        milana: {
            id: 'Milana Denim Dress', nameAr: 'دريس ميلانا جينز', nameEn: 'Milana Denim Dress',
            price: 1950, priceAr: '1,950.00 ج.م', priceEn: '1,950.00 LE',
            colorAr: 'أزرق', colorEn: 'Blue', colorCss: '#005bd3', defaultSize: '44',
            sizes: ['44', '46', '48', '50', '52', '54', '56'], image: 'assets/img/m1.webp',
            gallery: [
                { type: 'image', src: 'assets/img/m1.webp' }, { type: 'image', src: 'assets/img/m2.webp' },
                { type: 'image', src: 'assets/img/m3.webp' }, { type: 'image', src: 'assets/img/m4.webp' },
                { type: 'image', src: 'assets/img/m5.webp' }, { type: 'image', src: 'assets/img/m6.webp' }
            ]
        }
    };

    let activeProduct = products.toba;
    let gallery = activeProduct.gallery;
    let currentIndex = 0;
    let selectedSize = activeProduct.defaultSize;
    let selectedQuantity = 1;

    function language() {
        return document.documentElement.lang === 'en' ? 'en' : 'ar';
    }

    function updateSizeLabel() {
        if (!sizeLabel) return;
        sizeLabel.dataset.ar = 'المقاس: ' + selectedSize;
        sizeLabel.dataset.en = 'SIZE: ' + selectedSize;
        sizeLabel.textContent = language() === 'ar' ? sizeLabel.dataset.ar : sizeLabel.dataset.en;
    }

    function setFavoriteState(active) {
        if (!favoriteButton) return;
        favoriteButton.classList.toggle('active', active);
        favoriteButton.setAttribute('aria-pressed', String(active));
        favoriteButton.setAttribute('aria-label', language() === 'ar' ? (active ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة') : (active ? 'Remove from wishlist' : 'Add to wishlist'));
        const icon = favoriteButton.querySelector('i');
        if (icon) {
            icon.classList.toggle('ph-fill', active);
        }
    }

    function updateTobaPlaceholders() {
        const lang = language();
        document.querySelectorAll('#tobaQuestionOverlay [data-ar-placeholder][data-en-placeholder]').forEach(function (input) {
            input.placeholder = input.getAttribute(lang === 'ar' ? 'data-ar-placeholder' : 'data-en-placeholder');
        });
        if (colorButton) {
            colorButton.setAttribute('aria-label', lang === 'ar' ? activeProduct.colorAr : activeProduct.colorEn);
            colorButton.setAttribute('title', lang === 'ar' ? activeProduct.colorAr : activeProduct.colorEn);
        }
        updateProductUI();
        setFavoriteState(favoriteButton?.classList.contains('active') || false);
    }

    function bindSizeButtons() {
        sizeButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                selectedSize = button.textContent.trim();
                sizeButtons.forEach(function (item) { item.classList.toggle('active', item === button); });
                updateSizeLabel();
            });
        });
    }

    function updateProductUI() {
        const lang = language();
        questionOverlay?.classList.toggle('milana-question', activeProduct === products.milana);
        if (previewName) {
            previewName.dataset.ar = activeProduct.nameAr;
            previewName.dataset.en = activeProduct.nameEn;
            previewName.textContent = lang === 'ar' ? activeProduct.nameAr : activeProduct.nameEn;
        }
        if (previewPrice) {
            previewPrice.dataset.ar = activeProduct.priceAr;
            previewPrice.dataset.en = activeProduct.priceEn;
            previewPrice.textContent = lang === 'ar' ? activeProduct.priceAr : activeProduct.priceEn;
        }
        if (previewColorLabel) {
            previewColorLabel.dataset.ar = 'اللون: ' + activeProduct.colorAr;
            previewColorLabel.dataset.en = 'COLOR: ' + activeProduct.colorEn.toUpperCase();
            previewColorLabel.textContent = lang === 'ar' ? previewColorLabel.dataset.ar : previewColorLabel.dataset.en;
        }
        if (colorButton) {
            colorButton.style.background = activeProduct.colorCss;
            colorButton.setAttribute('aria-label', lang === 'ar' ? activeProduct.colorAr : activeProduct.colorEn);
            colorButton.setAttribute('title', lang === 'ar' ? activeProduct.colorAr : activeProduct.colorEn);
        }
        if (questionProductImage) {
            questionProductImage.src = activeProduct.image;
            questionProductImage.alt = activeProduct.nameEn;
        }
        if (questionProductName) {
            questionProductName.dataset.ar = activeProduct.nameAr;
            questionProductName.dataset.en = activeProduct.nameEn;
            questionProductName.textContent = lang === 'ar' ? activeProduct.nameAr : activeProduct.nameEn;
        }
        if (questionProductPrice) {
            questionProductPrice.dataset.ar = activeProduct.priceAr;
            questionProductPrice.dataset.en = activeProduct.priceEn;
            questionProductPrice.textContent = lang === 'ar' ? activeProduct.priceAr : activeProduct.priceEn;
        }
        if (sizeContainer) {
            sizeContainer.innerHTML = activeProduct.sizes.map(function (size) {
                return '<button type="button" class="toba-preview-size' + (size === selectedSize ? ' active' : '') + '">' + size + '</button>';
            }).join('');
            sizeButtons = Array.from(sizeContainer.querySelectorAll('.toba-preview-size'));
            bindSizeButtons();
        }
        updateSizeLabel();
    }

    function setSecondaryOverlay(overlay, open) {
        if (!overlay) return;
        overlay.classList.toggle('active', open);
        overlay.setAttribute('aria-hidden', String(!open));
        if (open) document.body.style.overflow = 'hidden';
        else if (!document.querySelector('.toba-size-guide-overlay.active,.toba-question-overlay.active,.toba-preview-overlay.active')) document.body.style.overflow = '';
    }

    function renderMedia() {
        if (!media) return;
        media.innerHTML = '';
        const item = gallery[currentIndex];
        let element;
        if (item.type === 'video') {
            element = document.createElement('video');
            element.src = item.src;
            element.autoplay = true;
            element.muted = true;
            element.loop = true;
            element.controls = true;
            element.playsInline = true;
        } else {
            element = document.createElement('img');
            element.src = item.src;
            element.alt = activeProduct.nameEn;
        }
        media.appendChild(element);
    }

    function setQuantity(value) {
        selectedQuantity = Math.max(1, Number(value) || 1);
        if (quantity) quantity.textContent = selectedQuantity;
    }

    function openPreview(productKey) {
        activeProduct = products[productKey] || products.toba;
        gallery = activeProduct.gallery;
        currentIndex = 0;
        selectedSize = activeProduct.defaultSize;
        updateProductUI();
        setQuantity(1);
        renderMedia();
        setFavoriteState(typeof isInWishlist === 'function' ? isInWishlist(activeProduct.id) : false);
        updateTobaPlaceholders();
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        const waBox = document.querySelector('.whatsapp-box');
        const btt = document.getElementById('backToTop');
        if (waBox) waBox.style.display = 'none';
        if (btt) btt.style.display = 'none';
        closeButton && closeButton.focus();
    }

    function closePreview() {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        if (media) media.innerHTML = '';
        document.body.style.overflow = '';
        const waBox = document.querySelector('.whatsapp-box');
        const btt = document.getElementById('backToTop');
        if (waBox) waBox.style.display = '';
        if (btt) btt.style.display = '';
    }

    function changeMedia(step) {
        currentIndex = (currentIndex + step + gallery.length) % gallery.length;
        renderMedia();
    }

    function saveActiveToCart() {
        let cart = [];
        try { cart = JSON.parse(localStorage.getItem('alyasser_cart')) || []; } catch (error) { cart = []; }
        const item = {
            id: activeProduct.id,
            nameAr: activeProduct.nameAr,
            nameEn: activeProduct.nameEn,
            price: activeProduct.price,
            priceAr: activeProduct.priceAr,
            priceEn: activeProduct.priceEn,
            img: activeProduct.image,
            colorAr: activeProduct.colorAr,
            colorEn: activeProduct.colorEn,
            size: selectedSize
        };
        const existing = cart.find(function (entry) { return entry.id === item.id && entry.size === item.size; });
        if (existing) existing.qty = Number(existing.qty || 0) + selectedQuantity;
        else cart.push(Object.assign({}, item, { qty: selectedQuantity }));
        localStorage.setItem('alyasser_cart', JSON.stringify(cart));
        document.querySelectorAll('.cart-count').forEach(function (counter) {
            counter.textContent = cart.reduce(function (total, entry) { return total + Number(entry.qty || 0); }, 0);
        });
    }

    function getActiveWishlistItem() {
        return {
            id: activeProduct.id,
            nameAr: activeProduct.nameAr,
            nameEn: activeProduct.nameEn,
            priceAr: activeProduct.priceAr,
            priceEn: activeProduct.priceEn,
            price: activeProduct.price,
            img: activeProduct.image,
            imgFront: activeProduct.image,
            imgBack: activeProduct.gallery[activeProduct.gallery.length > 2 ? 2 : 0].src,
            colorAr: activeProduct.colorAr,
            colorEn: activeProduct.colorEn
        };
    }

    function toggleActiveWishlist() {
        const id = activeProduct.id;
        let list = typeof getWishlist === 'function' ? getWishlist() : [];
        const exists = list.some(function (item) { return item.id === id; });
        list = exists ? list.filter(function (item) { return item.id !== id; }) : list.concat(getActiveWishlistItem());
        if (typeof saveWishlist === 'function') saveWishlist(list);
        else localStorage.setItem('alyasser_wishlist', JSON.stringify(list));
        if (typeof updateWishlistCount === 'function') updateWishlistCount();
        if (typeof syncProductWishlistButtons === 'function') syncProductWishlistButtons();
        setFavoriteState(!exists);
    }

    cards.forEach(function (card) {
        const productKey = card.hasAttribute('data-milana-preview-card') ? 'milana' : 'toba';
        card.querySelector('.style-choice-view')?.addEventListener('click', function () { openPreview(productKey); });
    });
    closeButton?.addEventListener('click', closePreview);
    favoriteButton?.addEventListener('click', toggleActiveWishlist);
    sizeGuideButton?.addEventListener('click', function () { setSecondaryOverlay(sizeGuideOverlay, true); });
    askButton?.addEventListener('click', function () {
        if (questionSuccess) questionSuccess.classList.remove('visible');
        setSecondaryOverlay(questionOverlay, true);
    });
    sizeGuideClose?.addEventListener('click', function () { setSecondaryOverlay(sizeGuideOverlay, false); });
    questionClose?.addEventListener('click', function () { setSecondaryOverlay(questionOverlay, false); });
    [sizeGuideOverlay, questionOverlay].forEach(function (secondaryOverlay) {
        secondaryOverlay?.addEventListener('click', function (event) {
            if (event.target === secondaryOverlay) setSecondaryOverlay(secondaryOverlay, false);
        });
    });
    questionForm?.addEventListener('submit', function (event) {
        event.preventDefault();
        questionSuccess?.classList.add('visible');
    });
    previousButton?.addEventListener('click', function () { changeMedia(-1); });
    nextButton?.addEventListener('click', function () { changeMedia(1); });
    overlay.addEventListener('click', function (event) {
        if (event.target === overlay) closePreview();
    });
    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') return;
        if (overlay.classList.contains('active')) closePreview();
        if (sizeGuideOverlay?.classList.contains('active')) setSecondaryOverlay(sizeGuideOverlay, false);
        if (questionOverlay?.classList.contains('active')) setSecondaryOverlay(questionOverlay, false);
    });
    const tobaLanguageObserver = new MutationObserver(updateTobaPlaceholders);
    tobaLanguageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    updateTobaPlaceholders();
    bindSizeButtons();
    document.getElementById('tobaPreviewMinus')?.addEventListener('click', function () { setQuantity(selectedQuantity - 1); });
    document.getElementById('tobaPreviewPlus')?.addEventListener('click', function () { setQuantity(selectedQuantity + 1); });
    addButton?.addEventListener('click', function () { saveActiveToCart(); });
    buyButton?.addEventListener('click', function () {
        saveActiveToCart();
        window.location.href = 'checkout.html';
    });
})();

/* ================================================================
   EID LOOK — shoppable hotspots (eid-look-section)
   بيفتح كارت المنتج الصغير عند الضغط على النقطة، وبيتقفل تلقائي
   لو ضغطنا برا الكارت أو فتحنا منه الـ Quick Shop / Quick View.
================================================================= */
document.addEventListener('click', function (e) {
    const hotspot = e.target.closest('.eid-hotspot');

    if (hotspot) {
        e.preventDefault();
        e.stopPropagation();
        const thisSpot = hotspot.closest('.eid-look-spot');
        if (!thisSpot) return;
        const wasOpen = thisSpot.classList.contains('is-open');

        document.querySelectorAll('.eid-look-spot.is-open').forEach(function (spot) {
            spot.classList.remove('is-open');
            const h = spot.querySelector('.eid-hotspot');
            if (h) h.setAttribute('aria-expanded', 'false');
            const p = spot.querySelector('.eid-look-popup');
            if (p) p.setAttribute('aria-hidden', 'true');
        });

        if (!wasOpen) {
            thisSpot.classList.add('is-open');
            hotspot.setAttribute('aria-expanded', 'true');
            const popup = thisSpot.querySelector('.eid-look-popup');
            if (popup) popup.setAttribute('aria-hidden', 'false');
        }
        return;
    }

    // لما نضغط على "تسوق سريع" أو أيقونة العرض السريع جوه الكارت، بيفتح المودال الأساسي (تم ربطه تلقائي)
    // فبنقفل بابل الـ hotspot عشان ميفضلش فاتح فوق المودال.
    if (e.target.closest('.eid-look-popup .quick-shop-btn')) {
        document.querySelectorAll('.eid-look-spot.is-open').forEach(function (spot) {
            spot.classList.remove('is-open');
            const h = spot.querySelector('.eid-hotspot');
            if (h) h.setAttribute('aria-expanded', 'false');
        });
        return;
    }

    // ضغط في أي مكان تاني برا الـ hotspot يقفل أي بوب أب مفتوح
    if (!e.target.closest('.eid-look-spot')) {
        document.querySelectorAll('.eid-look-spot.is-open').forEach(function (spot) {
            spot.classList.remove('is-open');
            const h = spot.querySelector('.eid-hotspot');
            if (h) h.setAttribute('aria-expanded', 'false');
        });
    }
});
/* Compute and show the real discount % on product-card sale badges */
function refreshSaleBadges() {
    document.querySelectorAll('.product-sale-badge').forEach(function (badge) {
        var card = badge.closest('.product-card, .wishlist-card');
        if (!card) return;
        var priceEl = card.querySelector('.product-price');
        if (!priceEl) return;
        var del = priceEl.querySelector('del');
        var rawOld = del ? del.textContent : (priceEl.getAttribute('data-old-price') || '');
        var oldNum = parseFloat(String(rawOld).replace(/[^0-9.]/g, '')) || 0;
        var strong = priceEl.querySelector('strong');
        var rawNew = strong ? strong.textContent : priceEl.textContent;
        var newNum = parseFloat(String(rawNew).replace(/[^0-9.]/g, '')) || 0;
        if (oldNum <= 0 || newNum <= 0 || newNum >= oldNum) return;
        var pct = Math.round((oldNum - newNum) / oldNum * 100);
        badge.dataset.en = '-' + pct + '%';
        badge.dataset.ar = '-' + pct + '%';
        var lang = document.documentElement.dir === 'rtl' ? 'ar' : 'en';
        badge.textContent = lang === 'ar' ? badge.dataset.ar : badge.dataset.en;
    });
}
refreshSaleBadges();

/* ===== Product card swatch click keeps the chosen color image (applies to all cards) ===== */
document.querySelectorAll('.product-card').forEach(function (card) {
  var swatches = card.querySelectorAll('.color-swatches .swatch');
  if (!swatches.length) return;
  swatches.forEach(function (sw) {
    sw.addEventListener('click', function (e) {
      e.stopPropagation();
      swatches.forEach(function (s) { s.classList.remove('is-active-sw'); });
      sw.classList.add('is-active-sw');
    });
  });
});