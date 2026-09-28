(function () {
  "use strict";

  var DESKTOP = 1025;

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function isDesktop() { return window.matchMedia("(min-width: " + DESKTOP + "px)").matches; }

  /* ══════════════════════════════════════════
     BASE DE DATOS EXTENDIDA DE HISTORIAS
  ══════════════════════════════════════════ */
  var storiesDatabase = {
    students: [
      {
        location: "Comunidad escolar central — Bolivia",
        badge: "🎓 Transformación de un estudiante",
        quote: "Cada día llegaba a la escuela con muchas preguntas y miedos. Cuando el capellán me escuchó y oró conmigo, encontré paz. Hoy sé que no estoy solo y tengo esperanza en Jesús.",
        author: "— Mateo, 14 años",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad616cff484614db2f03b1.jpg"
      },
      {
        location: "Campus de primaria — Honduras",
        badge: "🎒 Esperanza en el aula",
        quote: "Antes de que empezara la capellanía, la escuela se sentía demasiado pesada. Conocer el amor de Jesús me dio valor para ayudar a mis compañeros y mantenerme firme en la fe.",
        author: "— Sofía, 11 años",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad6173711f85a2aab9cb0b.jpg"
      },
      {
        location: "Secundaria pública — Panamá",
        badge: "✨ Nueva vida en Cristo",
        quote: "Durante la visita de un equipo misionero escuché el Evangelio con claridad por primera vez. Recibir a Cristo en mi escuela cambió mi futuro y me dio un propósito real.",
        author: "— Lucas, 16 años",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad6172711f85a2aab9caeb.jpg"
      },
      {
        location: "Escuela comunitaria — Colombia",
        badge: "✝ Fe y dirección",
        quote: "Antes sentía que mi futuro no tenía salida. Tener un capellán en la escuela me enseñó que Dios tiene un plan concreto para mi vida.",
        author: "— Valentina, 15 años",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad616d4091fa65e6629e85.jpg"
      }
    ],
    families: [
      {
        location: "Red de ministerio — Honduras",
        badge: "🏠 Cuidado pastoral a la familia",
        quote: "Cuando nuestra familia pasaba por una crisis, el capellán de la escuela no solo ayudó a nuestra hija: también se acercó a nosotros como padres. Su apoyo y su oración restauraron nuestro hogar por medio de Cristo.",
        author: "— María y Carlos, padres",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad6173711f85a2aab9cb0b.jpg"
      },
      {
        location: "Alcance comunitario — Colombia",
        badge: "🤝 Restauración familiar",
        quote: "El Evangelio devolvió la esperanza a nuestro hogar. Que líderes espirituales cuiden de nuestros hijos en la escuela trajo unidad y paz a toda la familia.",
        author: "— Elena, madre de tres",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad616cff484614db2f03b1.jpg"
      },
      {
        location: "Barrio residencial — Panamá",
        badge: "🙏 Unidad espiritual",
        quote: "Por las devocionales de la escuela, nuestros hijos empezaron a orar antes de comer en casa. Ahora toda la familia va a la iglesia junta cada domingo.",
        author: "— Jorge y Patricia, familia",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad616fff484614db2f0425.jpg"
      }
    ],
    chaplains: [
      {
        location: "Programa de capellanía escolar — Panamá",
        badge: "✝ Capellán escolar certificado",
        quote: "Estar en la escuela todos los días nos permite construir una confianza profunda con maestros y estudiantes. No somos visitas: somos parte de su comunidad y llevamos la esperanza del Evangelio.",
        author: "— Capellán Miller",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad616f30b0f957cc7216a0.jpg"
      },
      {
        location: "Red educativa — Bolivia",
        badge: "✝ Capellán dedicado",
        quote: "Equipar mentes jóvenes y caminar en oración junto a los educadores transformó el clima moral de todo nuestro campus.",
        author: "— Capellán Garza",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad616cff484614db2f03b1.jpg"
      },
      {
        location: "Distrito norte — Honduras",
        badge: "📜 Ministro formado",
        quote: "El programa de certificación me dio herramientas concretas de intervención en crisis para acompañar el trauma de los estudiantes con compasión cristiana.",
        author: "— Capellán Rodríguez",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad6164bdaa5e26a922bbb5.png"
      }
    ],
    pastors: [
      {
        location: "Red de iglesias — Colombia",
        badge: "📕 Multiplicación de la iglesia local",
        quote: "Aliarnos con Jesus Generation abrió las puertas de las escuelas locales a nuestra congregación. Formamos a nuestros líderes de jóvenes y ahora decenas de estudiantes se están uniendo al discipulado local.",
        author: "— Pastor Roberto",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad616e4091fa65e6629e9d.jpg"
      },
      {
        location: "Alianza regional central — Honduras",
        badge: "⛪ Crecimiento pastoral",
        quote: "La formación de la Academia dio a nuestro equipo de liderazgo estrategias prácticas para alcanzar las escuelas con fruto. Nuestros grupos de discipulado se duplicaron.",
        author: "— Pastor Alejandro",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad616f30b0f957cc7216a0.jpg"
      },
      {
        location: "Santa Cruz — Bolivia",
        badge: "📖 Sinergia del Reino",
        quote: "En lugar de ministrar cada uno por su lado, nuestras iglesias locales ahora están unidas alrededor de la capellanía escolar. El impacto del Reino no tiene precedente.",
        author: "— Pastor Fernando",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad6168ff484614db2f0305.png"
      }
    ],
    "mission-participants": [
      {
        location: "Equipo de viaje misionero — Bolivia",
        badge: "✈ Voluntario de equipo misionero",
        quote: "No fue solo ver a otro predicar. Nuestro equipo se dividió en parejas y entró directo a las aulas. Compartir mi testimonio con los estudiantes transformó mi propia fe.",
        author: "— Sarah, integrante del equipo",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad616e4091fa65e6629e9d.jpg"
      },
      {
        location: "Iniciativa de evangelismo — Panamá",
        badge: "✈ Misionero de corto plazo",
        quote: "Ver a cientos de niños abrir el corazón a Cristo en una sola semana renovó mi pasión por las misiones y por el evangelismo personal.",
        author: "— John, voluntario del equipo",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad6172711f85a2aab9caeb.jpg"
      },
      {
        location: "Equipo de alcance — Honduras",
        badge: "✈ Líder de jóvenes",
        quote: "Llevar al grupo de jóvenes de nuestra iglesia a este viaje les mostró que Dios puede usar a cualquiera, a cualquier edad, para proclamar el Evangelio con claridad.",
        author: "— Mark, pastor de jóvenes",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad6170de8ed1c29f57bdd1.jpg"
      }
    ],
    "academy-students": [
      {
        location: "Graduado de la Academia Jesus Generation",
        badge: "🎓 Liderazgo y certificación",
        quote: "La Academia me dio un fundamento bíblico sólido y una formación práctica de capellanía. Me sentí completamente equipado para entrar a las escuelas con confianza e integridad profesional.",
        author: "— David, capellán certificado",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad616cff484614db2f03b1.jpg"
      },
      {
        location: "Cohorte pastoral en línea",
        badge: "📜 Formación teológica",
        quote: "La flexibilidad y la profundidad de los cursos me permitieron equilibrar el ministerio local con una formación de verdad. Lo recomiendo a cada líder.",
        author: "— Rebecca, directora de ministerio",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad616f30b0f957cc7216a0.jpg"
      },
      {
        location: "Ruta de formar a formadores",
        badge: "👥 Multiplicación de líderes",
        quote: "Aprender a formar a otros capellanes amplió mi alcance. Ahora acompaño a 15 líderes nuevos que sirven en campus públicos.",
        author: "— Gabriel, instructor de la Academia",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad6162bdaa5e26a922bb7a.png"
      }
    ],
    "national-leaders": [
      {
        location: "Liderazgo nacional — América Latina",
        badge: "🌐 Multiplicación regional",
        quote: "Nuestra misión es capacitar a líderes nacionales para alcanzar sus propias escuelas y sus propios niños. Ver a miles de capellanes locales levantarse en nuestro país es la verdadera multiplicación del Evangelio.",
        author: "— Director nacional del ministerio",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad6173711f85a2aab9cb0b.jpg"
      },
      {
        location: "Coordinación ejecutiva — Centroamérica",
        badge: "🗺 Expansión estratégica",
        quote: "Estamos estableciendo marcos sostenibles para que cada escuela de nuestro país tenga acceso a cuidado espiritual cristiano y formado.",
        author: "— Representante regional",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad6168de8ed1c29f57bc91.png"
      }
    ],
    churches: [
      {
        location: "Iglesia local aliada",
        badge: "⛪ Alianza estratégica con la iglesia",
        quote: "Aliarnos con Jesus Generation revitalizó a toda nuestra congregación. Nuestros miembros oran, donan y sirven de forma activa en las escuelas locales, con un impacto espiritual que se puede ver.",
        author: "— Integrante del consejo del ministerio",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad616e4091fa65e6629e9d.jpg"
      },
      {
        location: "Iglesia Comunidad de Gracia",
        badge: "⛪ Impacto del Reino",
        quote: "Enviar equipos misioneros junto a los capellanes abrió caminos directos para que jóvenes sin iglesia se conectaran con nuestros programas de discipulado del domingo.",
        author: "— Anciano James",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad6169ff484614db2f0315.png"
      }
    ],
    communities: [
      {
        location: "Red de comunidades rurales",
        badge: "🤝 Transformación comunitaria",
        quote: "Cuando la escuela vive paz y esperanza por la capellanía, todo el pueblo lo siente. Las familias se fortalecen y las relaciones de la comunidad se restauran.",
        author: "— Líder comunitario",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad6172711f85a2aab9caeb.jpg"
      },
      {
        location: "Distrito urbano — Panamá",
        badge: "🤝 Renovación del barrio",
        quote: "La disminución de la delincuencia juvenil desde que empezó la capellanía en nuestra escuela ha producido un profundo agradecimiento de las autoridades locales.",
        author: "— Representante del consejo distrital",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad6170de8ed1c29f57bdc5.jpg"
      }
    ]
  };

  /* ══════════════════════════════════════════
     HEADER — Hamburger + Dropdowns + Scroll
  ══════════════════════════════════════════ */
  function closeDropdowns(header) {
    qsa("[data-dropdown]", header).forEach(function (item) {
      item.classList.remove("is-open");
      var toggle = qs("[data-dropdown-toggle]", item);
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  }

  function bindHeader(header) {
    var menuToggle = qs("[data-jg-menu-toggle]", header);
    var menuClose  = qs("[data-jg-menu-close]", header);

    if (menuToggle) {
      menuToggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var open = header.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.style.overflow = open && !isDesktop() ? "hidden" : "";
        if (!open) closeDropdowns(header);
      });
    }

    if (menuClose) {
      menuClose.addEventListener("click", function (e) {
        e.preventDefault();
        header.classList.remove("is-open");
        document.body.style.overflow = "";
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
        closeDropdowns(header);
      });
    }

    qsa("[data-dropdown]", header).forEach(function (item) {
      var toggle = qs("[data-dropdown-toggle]", item);
      if (!toggle) return;
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var willOpen = !item.classList.contains("is-open");
        closeDropdowns(header);
        item.classList.toggle("is-open", willOpen);
        toggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });
    });

    qsa(".jg-nav a:not([data-dropdown-toggle])", header).forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("is-open");
        document.body.style.overflow = "";
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
        closeDropdowns(header);
      });
    });

    document.addEventListener("click", function (e) {
      if (!header.contains(e.target)) closeDropdowns(header);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeDropdowns(header);
        header.classList.remove("is-open");
        document.body.style.overflow = "";
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
      }
    });

    window.addEventListener("resize", function () {
      if (isDesktop()) {
        header.classList.remove("is-open");
        document.body.style.overflow = "";
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function bindScroll() {
    var header = qs("[data-jg-header]");
    if (!header) return;
    window.addEventListener("scroll", function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }, { passive: true });
  }

  /* ══════════════════════════════════════════
     SMOOTH SCROLL & NAVIGATION
  ══════════════════════════════════════════ */
  function bindSmoothScroll() {
    var header = qs("[data-jg-header]");
    document.addEventListener("click", function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var hash = link.getAttribute("href");
      if (!hash || hash === "#" || hash === "#es") return;

      var catNav = link.getAttribute("data-cat-nav");
      if (catNav) {
        filterGlobalStories(catNav);
      }

      var target = qs(hash);
      if (!target) return;
      e.preventDefault();
      var offset = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset - 12;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  }

  /* ══════════════════════════════════════════
     BARRA DE FILTROS EN MÓVIL (DESPLAZAMIENTO FLUIDO Y AUTOPLAY 5S)
  ══════════════════════════════════════════ */
  function bindCategoryBarNavigation() {
    var track = qs("#cat-scroll-track");
    var prevBtn = qs("#cat-prev-btn");
    var nextBtn = qs("#cat-next-btn");

    if (!track) return;

    function getScrollAmount() {
      var btn = qs(".jg-cat-btn", track);
      return btn ? btn.offsetWidth + 16 : 180;
    }

    function scrollNext() {
      if (isDesktop()) return;
      var maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 10) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
      }
    }

    function scrollPrev() {
      if (isDesktop()) return;
      if (track.scrollLeft <= 10) {
        track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
      } else {
        track.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        scrollPrev();
        resetCatAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        scrollNext();
        resetCatAutoplay();
      });
    }

    var catAutoplayTimer = setInterval(scrollNext, 5000);

    function resetCatAutoplay() {
      if (catAutoplayTimer) clearInterval(catAutoplayTimer);
      catAutoplayTimer = setInterval(scrollNext, 5000);
    }

    track.addEventListener("touchstart", function () {
      if (catAutoplayTimer) clearInterval(catAutoplayTimer);
    }, { passive: true });

    track.addEventListener("touchend", function () {
      resetCatAutoplay();
    }, { passive: true });
  }

  /* ══════════════════════════════════════════
     LOGICA UNIFICADA DE CARRUSEL CON AUTOPLAY (5 SEC)
  ══════════════════════════════════════════ */
  var currentCategory = "all";
  var activeStoriesList = [];
  var currentIndex = 0;
  var autoplayTimer = null;

  function getAllStories() {
    var all = [];
    Object.keys(storiesDatabase).forEach(function (cat) {
      storiesDatabase[cat].forEach(function (item) {
        all.push(item);
      });
    });
    return all;
  }

  function renderGlobalSlider(stories) {
    var track = qs("#global-slider-track");
    var dotsContainer = qs("#main-dots-container");
    if (!track) return;

    activeStoriesList = stories;
    currentIndex = 0;

    track.innerHTML = "";
    stories.forEach(function (story) {
      var card = document.createElement("div");
      card.className = "jg-testimonial-card";

      var isContain = story.img.indexOf("ClipArt") !== -1 || story.img.indexOf("icon") !== -1;
      var imgClass = isContain ? "jg-img-contain" : "";

      card.innerHTML =
        '<div class="jg-testimonial-content">' +
          '<div class="jg-testimonial-img">' +
            '<img loading="lazy" src="' + story.img + '" alt="Imagen de la historia" class="' + imgClass + '">' +
          '</div>' +
          '<div class="jg-testimonial-body">' +
            '<span class="jg-test-location">' + story.location + '</span>' +
            '<div class="jg-test-badge">' + story.badge + '</div>' +
            '<p class="jg-test-quote">"' + story.quote + '"</p>' +
            '<span class="jg-test-author">' + story.author + '</span>' +
          '</div>' +
        '</div>';
      track.appendChild(card);
    });

    if (dotsContainer) {
      dotsContainer.innerHTML = "";
      stories.forEach(function (_, idx) {
        var dot = document.createElement("span");
        dot.className = "dot" + (idx === 0 ? " active" : "");
        dot.addEventListener("click", function () {
          goToSlide(idx);
          resetAutoplay();
        });
        dotsContainer.appendChild(dot);
      });
    }

    goToSlide(0);
    resetAutoplay();
  }

  function goToSlide(idx) {
    var track = qs("#global-slider-track");
    var dotsContainer = qs("#main-dots-container");
    if (!track || !activeStoriesList.length) return;

    currentIndex = (idx + activeStoriesList.length) % activeStoriesList.length;
    track.style.transform = "translateX(-" + (currentIndex * 100) + "%)";

    if (dotsContainer) {
      var dots = qsa(".dot", dotsContainer);
      dots.forEach(function (d, i) {
        d.classList.toggle("active", i === currentIndex);
      });
    }
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function resetAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    if (activeStoriesList.length > 1) {
      autoplayTimer = setInterval(nextSlide, 5000);
    }
  }

  function filterGlobalStories(categoryKey) {
    currentCategory = categoryKey;
    
    qsa(".jg-category-bar .jg-cat-btn").forEach(function (btn) {
      var filter = btn.getAttribute("data-filter");
      btn.classList.toggle("is-active", filter === categoryKey);
    });

    var storiesToDisplay = categoryKey === "all" ? getAllStories() : storiesDatabase[categoryKey] || [];
    renderGlobalSlider(storiesToDisplay);
  }

  function bindStorySwipe(viewport) {
    var startX = 0;
    var startY = 0;
    var tracking = false;
    var SWIPE = 40;

    viewport.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      tracking = true;
      startX = e.clientX;
      startY = e.clientY;
      if (viewport.setPointerCapture) viewport.setPointerCapture(e.pointerId);
      if (autoplayTimer) clearInterval(autoplayTimer);
    });

    function finishSwipe(e) {
      if (!tracking) return;
      tracking = false;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      if (Math.abs(dx) >= SWIPE && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) nextSlide();
        else prevSlide();
      }
      resetAutoplay();
    }

    viewport.addEventListener("pointerup", finishSwipe);
    viewport.addEventListener("pointercancel", function () {
      if (!tracking) return;
      tracking = false;
      resetAutoplay();
    });
  }

  function setupGlobalCarousel() {
    var prevBtn = qs("#main-prev-btn");
    var nextBtn = qs("#main-next-btn");
    var viewport = qs(".jg-slider-viewport");

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        prevSlide();
        resetAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        nextSlide();
        resetAutoplay();
      });
    }

    if (viewport) bindStorySwipe(viewport);

    qsa(".jg-category-bar .jg-cat-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-filter");
        filterGlobalStories(filter);
      });
    });

    filterGlobalStories("all");
  }

  /* ══════════════════════════════════════════
     NEWSLETTER & STAMP YEAR
  ══════════════════════════════════════════ */
  function stampYear() {
    qsa("[data-jg-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  function bindNewsletter() {
    qsa("[data-jg-newsletter]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var status = qs("[data-jg-newsletter-status]", form);
        var email  = qs('input[type="email"]', form);
        if (!email || !email.value) return;
        if (status) {
          status.hidden = false;
          status.textContent = "Vista previa: en el sitio publicado esto se envía con un formulario de GoHighLevel.";
        }
        form.reset();
      });
    });
  }

  function bindStepReveal() {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var viewH = window.innerHeight || document.documentElement.clientHeight;
    var sections = qsa("#main section").filter(function (el) {
      if (el.classList.contains("jg-hero")) return false;
      if (el.querySelector("section")) return false;
      return true;
    });

    function onFirstScreen(el) {
      var rect = el.getBoundingClientRect();
      return rect.top < viewH - 8 && rect.bottom > 48;
    }

    function stampDelays(section) {
      var bits = qsa(".jg-reveal, .jg-way-card, .jg-gospel-step, .jg-next-grid article, .jg-connect-card", section);
      if (bits.length < 2) return;
      bits.forEach(function (el, i) {
        el.classList.add("jg-reveal");
        el.style.setProperty("--jg-d", Math.min(i, 7) * 0.09 + "s");
      });
    }

    var pending = [];

    sections.forEach(function (el) {
      stampDelays(el);
      el.classList.add("jg-reveal-block");
      if (onFirstScreen(el)) {
        el.classList.add("is-shown");
      } else {
        pending.push(el);
        el.addEventListener("focusin", function () {
          el.classList.add("is-in");
        });
      }
    });

    if (!pending.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0 }
    );

    pending.forEach(function (el) { observer.observe(el); });
  }

  /* ══════════════════════════════════════════
     INIT
  ══════════════════════════════════════════ */
  function init() {
    qsa("[data-jg-header]").forEach(bindHeader);
    bindScroll();
    bindSmoothScroll();
    bindCategoryBarNavigation();
    setupGlobalCarousel();
    stampYear();
    bindNewsletter();
    bindStepReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();