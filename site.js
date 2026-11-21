(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

  function setOpen(btn, open) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (!panel) return;
    panel.classList.toggle("is-open", open);
    panel.setAttribute("aria-hidden", open ? "false" : "true");
  }

  function jumpTo(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var btn = el.querySelector("[data-acc]");
    if (btn) setOpen(btn, true);
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    document.querySelectorAll(".is-lit").forEach(function (node) {
      node.classList.remove("is-lit");
    });
    void el.offsetWidth;
    el.classList.add("is-lit");
    window.clearTimeout(jumpTo.timer);
    jumpTo.timer = window.setTimeout(function () {
      el.classList.remove("is-lit");
    }, reduce ? 600 : 1700);
  }

  document.querySelectorAll("[data-acc]").forEach(function (btn) {
    setOpen(btn, false);
    btn.addEventListener("click", function () {
      setOpen(btn, btn.getAttribute("aria-expanded") !== "true");
    });
  });

  var themeTimer = 0;
  document.querySelectorAll("[data-theme]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("[data-theme]").forEach(function (other) {
        other.setAttribute("aria-pressed", other === btn ? "true" : "false");
      });
      var line = document.querySelector("[data-theme-line]");
      if (line) {
        line.hidden = false;
        line.textContent = btn.getAttribute("data-line") || "";
      }
      var target = btn.getAttribute("data-jump");
      window.clearTimeout(themeTimer);
      themeTimer = window.setTimeout(function () { jumpTo(target); }, reduce ? 0 : 700);
    });
  });

  document.querySelectorAll("[data-jump]").forEach(function (link) {
    if (link.hasAttribute("data-theme")) return;
    link.addEventListener("click", function (event) {
      event.preventDefault();
      jumpTo(link.getAttribute("data-jump"));
    });
  });

  var navLinks = document.querySelectorAll("[data-nav]");
  var sections = ["consult", "assess", "ai", "contact"].map(function (id) {
    return document.getElementById(id);
  }).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          if (link.getAttribute("href") === "#" + entry.target.id) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    sections.forEach(function (section) { spy.observe(section); });
  }

  var reveals = document.querySelectorAll(".reveal");
  if (!reduce && "IntersectionObserver" in window) {
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        seen.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { seen.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  var bar = document.querySelector("[data-scroll-bar]");
  var topbar = document.querySelector(".topbar");
  var scrollPending = false;
  function paintScroll() {
    var max = root.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    root.style.setProperty("--scroll", p.toFixed(4));
    if (bar) bar.style.transform = "scaleX(" + p + ")";
    if (topbar) topbar.classList.toggle("is-scrolled", window.scrollY > 12);
    scrollPending = false;
  }
  window.addEventListener("scroll", function () {
    if (scrollPending) return;
    scrollPending = true;
    window.requestAnimationFrame(paintScroll);
  }, { passive: true });
  paintScroll();

  var frame = document.querySelector("[data-qr]");
  if (!frame) return;
  var files = [
    "assets/wechat-qr.png",
    "assets/wechat-qr.jpg",
    "assets/wechat-qr.jpeg",
    "assets/wechat-qr.webp"
  ];
  var note = document.querySelector("[data-qr-note]");

  function showPlaceholder() {
    frame.classList.remove("has-image");
    frame.replaceChildren();
    var hold = document.createElement("p");
    hold.className = "qr-placeholder";
    var title = document.createElement("span");
    title.className = "qr-title";
    title.textContent = "微信二维码";
    var state = document.createElement("span");
    state.className = "qr-state";
    state.textContent = "待放入";
    hold.append(title, state);
    frame.appendChild(hold);
    if (note) note.hidden = false;
  }

  function tryAt(i) {
    if (i >= files.length) {
      showPlaceholder();
      return;
    }
    var img = new Image();
    img.alt = "陈咏的微信二维码";
    img.onload = function () {
      frame.classList.add("has-image");
      frame.replaceChildren(img);
      if (note) note.hidden = true;
    };
    img.onerror = function () { tryAt(i + 1); };
    img.src = files[i];
  }

  var current = frame.querySelector("img");
  if (current && current.complete && current.naturalWidth > 0) {
    frame.classList.add("has-image");
    if (note) note.hidden = true;
  } else if (current) {
    current.addEventListener("load", function () {
      frame.classList.add("has-image");
      if (note) note.hidden = true;
    });
    current.addEventListener("error", function () { tryAt(1); });
  } else {
    tryAt(0);
  }
})();
