/* Sarava Parihaara — site script: tracking, menu, cart, WhatsApp checkout, forms */
(function () {
  "use strict";
  var C = window.SP_CONFIG || {};
  var P = window.SP_PRODUCTS || {};
  var inr = function (n) { return "₹" + Number(n).toLocaleString("en-IN"); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- tracking (only loads when IDs are filled in config.js) ---------- */
  function track(ev, data) {
    try { if (window.fbq) window.fbq("track", ev, data || {}); } catch (e) {}
    try { if (window.gtag) window.gtag("event", ev, data || {}); } catch (e) {}
  }
  if (C.metaPixelId) {
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", C.metaPixelId); window.fbq("track", "PageView");
  }
  if (C.ga4Id) {
    var g = document.createElement("script"); g.async = true; g.src = "https://www.googletagmanager.com/gtag/js?id=" + C.ga4Id; document.head.appendChild(g);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date()); window.gtag("config", C.ga4Id);
  }

  /* ---------- contact details & social from config ---------- */
  $$("[data-wa-link]").forEach(function (a) {
    var t = a.getAttribute("data-wa-link");
    a.href = "https://wa.me/" + C.whatsapp + (t ? "?text=" + encodeURIComponent(t) : "");
    a.target = "_blank"; a.rel = "noopener";
    a.addEventListener("click", function () { track("Contact", { method: "whatsapp" }); });
  });
  $$("[data-phone]").forEach(function (el) { el.textContent = C.phoneDisplay; if (el.tagName === "A") el.href = "tel:+" + C.whatsapp; });
  $$("[data-email]").forEach(function (el) { el.textContent = C.email; if (el.tagName === "A") el.href = "mailto:" + C.email; });
  ["instagram", "facebook", "youtube"].forEach(function (k) {
    $$("[data-social='" + k + "']").forEach(function (a) { if (C[k]) { a.href = C[k]; a.hidden = false; } else { a.hidden = true; } });
  });

  /* ---------- mobile menu ---------- */
  var burger = $(".burger"), menu = $(".menu");
  if (burger && menu) burger.addEventListener("click", function () {
    var open = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", open);
  });

  /* ---------- cart storage ---------- */
  var KEY = "sp_cart_v1";
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return window.__spCart || {}; } }
  function save(c) { window.__spCart = c; try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} render(); }
  function count(c) { return Object.keys(c).reduce(function (s, k) { return s + c[k]; }, 0); }
  function total(c) { return Object.keys(c).reduce(function (s, k) { return s + (P[k] ? P[k].price * c[k] : 0); }, 0); }
  function add(id, q) {
    if (!P[id]) return; var c = load(); c[id] = Math.min(20, (c[id] || 0) + (q || 1)); save(c);
    toast(P[id].name + " added to cart");
    track("AddToCart", { content_ids: [id], content_name: P[id].name, value: P[id].price * (q || 1), currency: "INR" });
  }
  function setQty(id, q) { var c = load(); if (q <= 0) delete c[id]; else c[id] = Math.min(20, q); save(c); }

  /* ---------- drawer ---------- */
  var drawer = document.createElement("div");
  drawer.innerHTML =
    '<div class="drawer-bg" data-close></div>' +
    '<aside class="drawer" role="dialog" aria-modal="true" aria-label="Your cart">' +
    '<div class="drawer-head"><h3>Your cart</h3><button class="x" data-close aria-label="Close cart">&times;</button></div>' +
    '<div class="drawer-body" id="cartItems"></div>' +
    '<div class="drawer-foot" id="cartFoot">' +
    '<div class="total"><span>Total (MRP, incl. taxes)</span><span id="cartTotal">₹0</span></div>' +
    '<button class="btn btn-primary btn-block" id="toCheckout" type="button">Checkout on WhatsApp</button>' +
    '<form class="checkout" id="checkoutForm" novalidate>' +
    '<p class="small" style="margin:0">Fill in your details. WhatsApp opens with your order ready to send. Our team confirms payment and delivery there.</p>' +
    '<input id="co-name" placeholder="Full name *" autocomplete="name" required>' +
    '<input id="co-phone" placeholder="Mobile number *" inputmode="tel" autocomplete="tel" required>' +
    '<textarea id="co-address" placeholder="Full delivery address *" autocomplete="street-address" required></textarea>' +
    '<input id="co-pin" placeholder="City & PIN code *" required>' +
    '<input id="co-note" placeholder="Note (optional)">' +
    '<p class="small" id="co-err" style="color:#a3361b;margin:0" hidden>Please fill in name, mobile, address and city/PIN.</p>' +
    '<a class="btn btn-wa btn-block" id="sendOrder" href="#" target="_blank" rel="noopener">Send order on WhatsApp</a>' +
    '</form></div></aside>';
  document.body.appendChild(drawer);
  var toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl);
  var tt; function toast(m) { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(function () { toastEl.classList.remove("show"); }, 2200); }

  function openCart() { document.body.classList.add("cart-open"); track("ViewCart"); }
  function closeCart() { document.body.classList.remove("cart-open"); }
  $$(".cart-btn").forEach(function (b) { b.addEventListener("click", openCart); });
  $$("[data-close]", drawer).forEach(function (b) { b.addEventListener("click", closeCart); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeCart(); });

  function render() {
    var c = load(), n = count(c);
    $$(".cart-count").forEach(function (el) { el.textContent = n; });
    var box = $("#cartItems"); if (!box) return;
    if (!n) {
      box.innerHTML = '<div class="empty"><p>Your cart is empty.</p><a class="btn btn-ghost" href="shop.html">Browse products</a></div>';
      $("#cartFoot").style.display = "none"; return;
    }
    $("#cartFoot").style.display = "";
    box.innerHTML = Object.keys(c).filter(function (k) { return P[k]; }).map(function (k) {
      var p = P[k];
      return '<div class="line-item"><img src="' + p.img + '" alt=""><div><h4>' + p.name + '</h4><div class="meta">' + p.size + ' · ' + inr(p.price) + '</div>' +
        '<div class="qty" style="margin-top:6px"><button type="button" data-dec="' + k + '" aria-label="Decrease">−</button><input value="' + c[k] + '" readonly aria-label="Quantity"><button type="button" data-inc="' + k + '" aria-label="Increase">+</button></div>' +
        '<button class="remove" data-rm="' + k + '">Remove</button></div><b>' + inr(p.price * c[k]) + '</b></div>';
    }).join("");
    $("#cartTotal").textContent = inr(total(c));
    updateWa();
  }
  drawer.addEventListener("click", function (e) {
    var t = e.target, c = load();
    if (t.dataset.inc) setQty(t.dataset.inc, (c[t.dataset.inc] || 0) + 1);
    if (t.dataset.dec) setQty(t.dataset.dec, (c[t.dataset.dec] || 0) - 1);
    if (t.dataset.rm) setQty(t.dataset.rm, 0);
  });
  $("#toCheckout").addEventListener("click", function () {
    $("#checkoutForm").classList.add("show"); this.style.display = "none"; $("#co-name").focus();
    track("InitiateCheckout", { value: total(load()), currency: "INR" });
  });
  function v(id) { return ($("#" + id).value || "").trim(); }
  function orderText() {
    var c = load(), i = 0, lines = ["Hello Sarava Parihaara, I would like to place an order:", ""];
    Object.keys(c).forEach(function (k) { if (P[k]) { i++; lines.push(i + ". " + P[k].name + " (" + P[k].size + ") x " + c[k] + " = " + inr(P[k].price * c[k])); } });
    lines.push("", "Total: " + inr(total(c)), "", "Name: " + v("co-name"), "Mobile: " + v("co-phone"), "Address: " + v("co-address"), "City / PIN: " + v("co-pin"));
    if (v("co-note")) lines.push("Note: " + v("co-note"));
    return lines.join("\n");
  }
  function updateWa() { var a = $("#sendOrder"); if (a) a.href = "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(orderText()); }
  $("#checkoutForm").addEventListener("input", updateWa);
  $("#sendOrder").addEventListener("click", function (e) {
    var ok = v("co-name") && v("co-phone").replace(/\D/g, "").length >= 10 && v("co-address") && v("co-pin");
    if (!ok) { e.preventDefault(); $("#co-err").hidden = false; return; }
    $("#co-err").hidden = true; updateWa();
    track("Lead", { content_category: "whatsapp_order", value: total(load()), currency: "INR" });
  });

  /* ---------- add-to-cart buttons ---------- */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-add]"); if (!b) return;
    e.preventDefault();
    var q = 1, qi = $("#pdpQty"); if (b.hasAttribute("data-use-qty") && qi) q = parseInt(qi.value, 10) || 1;
    add(b.getAttribute("data-add"), q);
    if (b.hasAttribute("data-open")) openCart();
  });

  /* ---------- product page: gallery, variants, qty ---------- */
  var main = $("#galleryMain");
  $$(".thumbs button").forEach(function (t) {
    t.addEventListener("click", function () {
      main.src = t.dataset.src; main.alt = t.dataset.alt || main.alt;
      $$(".thumbs button").forEach(function (x) { x.setAttribute("aria-current", x === t); });
    });
  });
  function syncVariant(id) {
    var p = P[id]; if (!p) return;
    $$("[data-variant-target]").forEach(function (b) { b.setAttribute("data-add", id); });
    var pr = $("#pdpPrice"); if (pr) pr.textContent = inr(p.price);
    var sz = $("#pdpSize"); if (sz) sz.textContent = p.size;
    var wa = $("#pdpWa"); if (wa) wa.href = "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent("Hello Sarava Parihaara, I would like to order " + p.name + " (" + p.size + ") – " + inr(p.price) + ". Please share details.");
  }
  $$(".variant").forEach(function (b) {
    b.addEventListener("click", function () {
      $$(".variant").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); syncVariant(b.dataset.id);
    });
  });
  var first = $(".variant[aria-pressed='true']") || $("[data-variant-target]");
  if (first) syncVariant(first.dataset.id || first.getAttribute("data-add"));
  var qi = $("#pdpQty");
  if (qi) {
    $("#qtyMinus").addEventListener("click", function () { qi.value = Math.max(1, (parseInt(qi.value, 10) || 1) - 1); });
    $("#qtyPlus").addEventListener("click", function () { qi.value = Math.min(20, (parseInt(qi.value, 10) || 1) + 1); });
  }
  var vc = $("[data-view-content]");
  if (vc) track("ViewContent", { content_ids: [vc.dataset.viewContent], currency: "INR" });

  /* ---------- shop filters ---------- */
  $$(".filters .chip").forEach(function (ch) {
    ch.addEventListener("click", function () {
      var f = ch.dataset.filter;
      $$(".filters .chip").forEach(function (x) { x.setAttribute("aria-pressed", x === ch); });
      $$("[data-cat]").forEach(function (card) { card.hidden = !(f === "all" || card.dataset.cat === f); });
    });
  });

  /* ---------- lead forms (partner, consultation, contact) ---------- */
  $$("form[data-lead]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = $(".form-msg", form), fd = new FormData(form), lines = [form.dataset.lead];
      var missing = $$("[required]", form).some(function (el) { return !el.value.trim(); });
      if (missing) { msg.className = "form-msg warn"; msg.textContent = "Please fill in all fields marked *."; return; }
      fd.forEach(function (val, key) { if (key !== "website" && key !== "form" && String(val).trim()) lines.push(key + ": " + val); });
      var waText = lines.join("\n");
      var waHref = "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(waText);
      function viaWhatsApp() {
        msg.className = "form-msg warn";
        msg.innerHTML = "Almost done! Tap below to send your details to us on WhatsApp.<br><a class=\"btn btn-wa\" style=\"margin-top:10px\" href=\"" + waHref + "\" target=\"_blank\" rel=\"noopener\">Send on WhatsApp</a>";
        track("Lead", { form: form.dataset.lead, via: "whatsapp" });
      }
      if (!C.formEndpoint) { viaWhatsApp(); return; }
      var btn = $("button[type=submit]", form); btn.disabled = true; btn.textContent = "Sending…";
      fd.append("_subject", "New " + form.dataset.lead + " – Sarava Parihaara website");
      fetch(C.formEndpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } }).then(function (r) {
        if (!r.ok) throw new Error();
        msg.className = "form-msg ok";
        msg.innerHTML = "Thank you! We have received your details and will contact you soon. For a faster reply, <a href=\"" + waHref + "\" target=\"_blank\" rel=\"noopener\">message us on WhatsApp</a>.";
        form.reset(); track("Lead", { form: form.dataset.lead });
      }).catch(viaWhatsApp).then(function () { btn.disabled = false; btn.textContent = btn.dataset.label; });
    });
    var b = $("button[type=submit]", form); b.dataset.label = b.textContent;
  });

  /* ---------- video testimonials (YouTube, from config.js) ---------- */
  function ytId(u) {
    var m = String(u).match(/(?:youtu\.be\/|v=|shorts\/|embed\/|live\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : (/^[A-Za-z0-9_-]{11}$/.test(String(u).trim()) ? String(u).trim() : null);
  }
  var vids = (C.videos || []).map(function (line) {
    var parts = String(line).split("|"), id = ytId(parts[0]);
    return id ? { id: id, vertical: /shorts\//.test(parts[0]), cap: (parts[1] || "").trim() } : null;
  }).filter(Boolean);
  $$("[data-videos]").forEach(function (box) {
    var limit = parseInt(box.getAttribute("data-videos"), 10) || 99;
    var sec = box.closest("[data-video-section]");
    if (!vids.length) { if (sec) sec.hidden = true; return; }
    if (sec) sec.hidden = false;
    box.innerHTML = vids.slice(0, limit).map(function (v) {
      return '<figure class="video' + (v.vertical ? " vertical" : "") + '"><button type="button" class="video-play" data-yt="' + v.id + '" aria-label="Play video' + (v.cap ? ": " + v.cap.replace(/"/g, "") : "") + '">' +
        '<img src="https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg" alt="" loading="lazy"><span class="play" aria-hidden="true"></span></button>' +
        (v.cap ? '<figcaption>' + v.cap.replace(/</g, "&lt;") + '</figcaption>' : '') + '</figure>';
    }).join("");
  });
  document.addEventListener("click", function (e) {
    var b = e.target.closest(".video-play"); if (!b) return;
    var f = document.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + b.dataset.yt + "?autoplay=1&rel=0&playsinline=1";
    f.title = "Customer video testimonial"; f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen"; f.allowFullscreen = true;
    b.replaceWith(f); track("ViewContent", { content_type: "video_testimonial" });
  });

  /* ---------- footer year ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  render();
})();
