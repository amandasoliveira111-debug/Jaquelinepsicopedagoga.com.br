(() => {
  "use strict";

  /* ------------------------------------------------------------
     Config — dados fáceis de atualizar
  ------------------------------------------------------------ */
  var WHATSAPP_NUMBER = "5511947959290";
  var WHATSAPP_MESSAGE = "Olá, Jaqueline! Conheci seu trabalho pelo site e gostaria de agendar minha primeira sessão gratuita. Poderia me informar os horários disponíveis?";
  // Nota e número de avaliações no Google informados pelo cliente. Atualize aqui quando houver um novo total.
  var GOOGLE_RATING = "5,0";
  var GOOGLE_REVIEW_COUNT = 35;

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------
     WhatsApp links — adiciona a mensagem pré-definida com segurança
  ------------------------------------------------------------ */
  function enhanceWhatsAppLinks() {
    var links = document.querySelectorAll(".js-wa");
    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(WHATSAPP_MESSAGE);
    links.forEach(function (link) {
      link.setAttribute("href", url);
    });
  }

  /* ------------------------------------------------------------
     Número de avaliações — mantém sincronizado a partir da config
  ------------------------------------------------------------ */
  function renderReviewCount() {
    var ratingEl = document.getElementById("review-rating");
    var labelEl = document.getElementById("review-count-label");
    if (ratingEl) ratingEl.textContent = GOOGLE_RATING;
    if (labelEl) labelEl.textContent = GOOGLE_REVIEW_COUNT + " avaliações no Google";
  }

  /* ------------------------------------------------------------
     Header: estado "scrolled" + navegação mobile
  ------------------------------------------------------------ */
  function initHeader() {
    var header = document.getElementById("site-header");
    var toggle = document.getElementById("menu-toggle");
    var mobileNav = document.getElementById("mobile-nav");
    if (!header) return;

    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (toggle && mobileNav) {
      toggle.addEventListener("click", function () {
        var isOpen = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!isOpen));
        mobileNav.classList.toggle("is-open", !isOpen);
        document.body.style.overflow = !isOpen ? "hidden" : "";
      });

      mobileNav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          toggle.setAttribute("aria-expanded", "false");
          mobileNav.classList.remove("is-open");
          document.body.style.overflow = "";
        });
      });
    }
  }

  /* ------------------------------------------------------------
     Hero video — o vídeo usa autoplay nativo (o jeito mais confiável
     entre navegadores). Aqui só desligamos ele nos casos em que o
     usuário pediu explicitamente menos dados/movimento — nesses casos
     o poster (já definido no atributo poster do <video>) permanece.
  ------------------------------------------------------------ */
  function respectDataAndMotionPreferences() {
    var video = document.getElementById("hero-video");
    if (!video) return;

    var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    var saveData = !!(connection && connection.saveData);
    var slowConnection = !!(connection && /2g/.test(connection.effectiveType || ""));

    if (prefersReducedMotion || saveData || slowConnection) {
      video.pause();
      video.removeAttribute("src");
      video.querySelectorAll("source").forEach(function (s) { s.remove(); });
      video.load();
    }
  }

  /* ------------------------------------------------------------
     Reveal on scroll
  ------------------------------------------------------------ */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------------------
     FAQ accordion
  ------------------------------------------------------------ */
  function initFaq() {
    var faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(function (item) {
      var btn = item.querySelector(".faq-question");
      btn.addEventListener("click", function () {
        var isOpen = item.getAttribute("data-open") === "true";
        faqItems.forEach(function (other) {
          other.setAttribute("data-open", "false");
          other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        });
        item.setAttribute("data-open", String(!isOpen));
        btn.setAttribute("aria-expanded", String(!isOpen));
      });
    });
  }

  /* ------------------------------------------------------------
     Carrossel de depoimentos
  ------------------------------------------------------------ */
  function initTestimonials() {
    var track = document.getElementById("testimonial-track");
    var prev = document.getElementById("testimonial-prev");
    var next = document.getElementById("testimonial-next");
    if (!track || !prev || !next) return;

    var scrollByCard = function (direction) {
      var card = track.querySelector(".testimonial-card");
      if (!card) return;
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || "0");
      var distance = card.getBoundingClientRect().width + gap;
      track.scrollBy({ left: direction * distance, behavior: prefersReducedMotion ? "auto" : "smooth" });
    };

    prev.addEventListener("click", function () { scrollByCard(-1); });
    next.addEventListener("click", function () { scrollByCard(1); });
  }

  /* ------------------------------------------------------------
     Google Maps — carregamento sob demanda (sem chave de API)
  ------------------------------------------------------------ */
  function initMap() {
    var facade = document.getElementById("map-facade");
    var frame = document.getElementById("map-frame");
    if (!facade || !frame) return;

    facade.addEventListener("click", function () {
      var iframe = document.createElement("iframe");
      var address = "Rua Otto Unger, 158, Centro, Mogi das Cruzes, SP, 08780-090";
      iframe.src = "https://www.google.com/maps?q=" + encodeURIComponent(address) + "&output=embed";
      iframe.title = "Mapa: " + address;
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.setAttribute("allowfullscreen", "");
      frame.innerHTML = "";
      frame.appendChild(iframe);
    }, { once: true });
  }

  /* ------------------------------------------------------------
     Init
  ------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    enhanceWhatsAppLinks();
    renderReviewCount();
    initHeader();
    initReveal();
    initFaq();
    initTestimonials();
    initMap();
    respectDataAndMotionPreferences();
  });
})();
