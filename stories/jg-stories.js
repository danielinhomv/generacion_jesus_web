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
        location: "Central School Community — Bolivia",
        badge: "🎓 Student Transformation",
        quote: "I was carrying so many questions and fears every day at school. When the chaplain listened to me and prayed with me, I found peace. Today, I know I am not alone and I have hope in Jesus.",
        author: "— Mateo, 14 years old",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad616cff484614db2f03b1.jpg"
      },
      {
        location: "Elementary Campus — Honduras",
        badge: "🎒 Hope in the Classroom",
        quote: "Before the chaplaincy program started, school felt overwhelming. Learning about Jesus' love gave me courage to help my classmates and stand strong in faith.",
        author: "— Sofia, 11 years old",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad6173711f85a2aab9cb0b.jpg"
      },
      {
        location: "Public High School — Panama",
        badge: "✨ New Life in Christ",
        quote: "During a mission team visit, I heard the Gospel clearly for the first time. Receiving Christ in my school changed my future and gave me a real purpose.",
        author: "— Lucas, 16 years old",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad6172711f85a2aab9caeb.jpg"
      },
      {
        location: "Community School — Colombia",
        badge: "✝ Faith & Direction",
        quote: "I used to feel hopeless about my future. Having a chaplain at school taught me that God has a specific plan for my life.",
        author: "— Valentina, 15 years old",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad616d4091fa65e6629e85.jpg"
      }
    ],
    families: [
      {
        location: "Honduras Ministry Network",
        badge: "🏠 Family Pastoral Care",
        quote: "When our family was going through a crisis, the school chaplain didn't just help our daughter — he reached out to us as parents. His support and prayer restored our home through Christ.",
        author: "— Maria & Carlos, Parents",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad6173711f85a2aab9cb0b.jpg"
      },
      {
        location: "Community Outreach — Colombia",
        badge: "🤝 Family Restoration",
        quote: "The Gospel brought back hope to our home. Having spiritual leaders caring for our children at school has brought unity and peace to our entire family.",
        author: "— Elena, Mother of three",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad616cff484614db2f03b1.jpg"
      },
      {
        location: "Suburban Neighborhood — Panama",
        badge: "🙏 Spiritual Unity",
        quote: "Through the school devotions, our children started praying before meals at home. Now our entire family attends church together every Sunday.",
        author: "— Jorge & Patricia, Family",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad616fff484614db2f0425.jpg"
      }
    ],
    chaplains: [
      {
        location: "Panama School Chaplaincy Program",
        badge: "✝ Certified School Chaplain",
        quote: "Being present in the school every single day allows us to build deep trust with teachers and students. We are not visitors — we are part of their community bringing the hope of the Gospel.",
        author: "— Chaplain Miller",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad616f30b0f957cc7216a0.jpg"
      },
      {
        location: "Bolivia Educational Network",
        badge: "✝ Dedicated Chaplain",
        quote: "Equipping young minds and walking alongside educators in prayer has transformed the moral climate of our entire campus.",
        author: "— Chaplain Garza",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad616cff484614db2f03b1.jpg"
      },
      {
        location: "Northern District — Honduras",
        badge: "📜 Trained Minister",
        quote: "The certification program provided me with exact crisis-intervention tools needed to handle student trauma with Christian compassion.",
        author: "— Chaplain Rodriguez",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad6164bdaa5e26a922bbb5.png"
      }
    ],
    pastors: [
      {
        location: "Colombia Church Network",
        badge: "📕 Local Church Multiplication",
        quote: "Partnering with Jesus Generation opened the doors of local schools to our church congregation. We have trained our youth leaders, and now dozens of students are joining local discipleship.",
        author: "— Pastor Roberto",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad616e4091fa65e6629e9d.jpg"
      },
      {
        location: "Central Regional Alliance — Honduras",
        badge: "⛪ Pastoral Growth",
        quote: "The Academy training provided our leadership team with practical strategies to reach schools effectively. Our discipleship groups have doubled.",
        author: "— Pastor Alejandro",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad616f30b0f957cc7216a0.jpg"
      },
      {
        location: "Santa Cruz Diocese — Bolivia",
        badge: "📖 Kingdom Synergy",
        quote: "Instead of ministering in isolation, our local churches are now united around school chaplaincy. The kingdom impact is unprecedented.",
        author: "— Pastor Fernando",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad6168ff484614db2f0305.png"
      }
    ],
    "mission-participants": [
      {
        location: "Bolivia Mission Trip Team",
        badge: "✈ Mission Team Volunteer",
        quote: "This was not just watching someone else preach. Our team divided into pairs and went directly into classrooms. Sharing my personal testimony with students transformed my own faith.",
        author: "— Sarah, Mission Team Member",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad616e4091fa65e6629e9d.jpg"
      },
      {
        location: "Panama Evangelism Initiative",
        badge: "✈ Short-Term Missionary",
        quote: "Seeing hundreds of children open their hearts to Christ in just one week renewed my passion for global missions and personal evangelism.",
        author: "— John, Team Volunteer",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad6172711f85a2aab9caeb.jpg"
      },
      {
        location: "Honduras Outreach Team",
        badge: "✈ Youth Leader",
        quote: "Taking our church's youth group on this trip showed them that God can use anyone at any age to proclaim the Gospel clearly.",
        author: "— Mark, Youth Pastor",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad6170de8ed1c29f57bdd1.jpg"
      }
    ],
    "academy-students": [
      {
        location: "Jesus Generation Academy Graduate",
        badge: "🎓 Leadership & Certification",
        quote: "The Academy provided me with rigorous biblical foundation and practical chaplaincy training. I felt completely equipped to step into school environments with confidence and professional integrity.",
        author: "— David, Certified Chaplain",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad616cff484614db2f03b1.jpg"
      },
      {
        location: "Online Pastoral Cohort",
        badge: "📜 Theological Training",
        quote: "The flexibility and depth of the courses allowed me to balance local ministry work with academic excellence. Highly recommended for every leader!",
        author: "— Rebecca, Ministry Director",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad616f30b0f957cc7216a0.jpg"
      },
      {
        location: "Train-the-Trainer Track",
        badge: "👥 Leadership Multiplication",
        quote: "Learning how to train other chaplains amplified my reach. Now I am mentoring 15 new leaders serving in public campuses.",
        author: "— Gabriel, Academy Instructor",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad6162bdaa5e26a922bb7a.png"
      }
    ],
    "national-leaders": [
      {
        location: "National Leadership — Latin America",
        badge: "🌐 Regional Multiplication",
        quote: "Our mission is to empower national leaders to reach their own schools and children. Seeing thousands of local chaplains rise up across our country is the true multiplication of the Gospel.",
        author: "— National Ministry Director",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad6173711f85a2aab9cb0b.jpg"
      },
      {
        location: "Executive Coordination — Central America",
        badge: "🗺 Strategic Expansion",
        quote: "We are establishing sustainable frameworks so that every school in our country has access to trained Christian spiritual care.",
        author: "— Regional Representative",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad6168de8ed1c29f57bc91.png"
      }
    ],
    churches: [
      {
        location: "Partnering Local Church",
        badge: "⛪ Strategic Church Partnership",
        quote: "Partnering with Jesus Generation invigorated our entire congregation. Our members are praying, giving, and actively serving in local schools with measurable spiritual impact.",
        author: "— Ministry Council Member",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad616e4091fa65e6629e9d.jpg"
      },
      {
        location: "Grace Community Church",
        badge: "⛪ Kingdom Impact",
        quote: "Sending mission teams alongside chaplains opened direct pathways for unchurched youth to connect with our Sunday discipleship programs.",
        author: "— Elder James",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad6169ff484614db2f0315.png"
      }
    ],
    communities: [
      {
        location: "Rural Community Network",
        badge: "🤝 Community Transformation",
        quote: "When the school experiences peace and hope through chaplaincy, the entire village feels the difference. Families are stronger and community relationships are restored.",
        author: "— Community Leader",
        img: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/gs4xUibAAQ1nX0LBXvT7/media/6aad6172711f85a2aab9caeb.jpg"
      },
      {
        location: "Urban District — Panama",
        badge: "🤝 Neighborhood Renewal",
        quote: "The reduction in youth delinquency since chaplaincy began in our local school has brought immense gratitude from local civic authorities.",
        author: "— District Council Representative",
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
            '<img loading="lazy" src="' + story.img + '" alt="Story Image" class="' + imgClass + '">' +
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

  function setupGlobalCarousel() {
    var prevBtn = qs("#main-prev-btn");
    var nextBtn = qs("#main-next-btn");

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
          status.textContent = (document.documentElement.lang === "es" ? "Vista previa: en el sitio publicado esto se envía con un formulario de GoHighLevel." : "Preview only: on the live site this submits through a GoHighLevel form.");
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