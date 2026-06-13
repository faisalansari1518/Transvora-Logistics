(() => {
  "use strict";

  const cfg = window.TRANSVORA_CONFIG || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const setText = (selector, value) => $$(selector).forEach((el) => { el.textContent = value; });
  const setHref = (selector, value) => $$(selector).forEach((el) => { el.href = value; });

  setText("[data-company]", cfg.companyName || "Transvora Logistics");
  setText("[data-phone-display]", cfg.phoneDisplay || "+91 99999 99999");
  setText("[data-email]", cfg.email || "info@transvoralogistics.in");
  setText("[data-hours]", cfg.hours || "Mon–Sat, 9:00 AM–7:00 PM");
  setText("[data-location]", [cfg.city, cfg.state].filter(Boolean).join(", ") || "Navi Mumbai, Maharashtra");

  setHref("[data-phone-link]", `tel:${cfg.phoneLink || "+919999999999"}`);
  setHref("[data-email-link]", `mailto:${cfg.email || "info@transvoralogistics.in"}`);
  setHref("[data-map-link]", `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cfg.mapsQuery || "Navi Mumbai Maharashtra")}`);

  const standardWhatsAppMessage = `Hello ${cfg.companyName || "Transvora Logistics"}, I would like to discuss a logistics requirement.`;
  setHref("[data-whatsapp-link]", `https://wa.me/${cfg.whatsapp || "919999999999"}?text=${encodeURIComponent(standardWhatsAppMessage)}`);

  $$('[data-social]').forEach((link) => {
    const platform = link.dataset.social;
    link.href = cfg[platform] || "#";
  });

  const menuButton = $(".menu-toggle");
  const nav = $(".main-nav");
  const header = $(".site-header");

  const closeNav = () => {
    nav?.classList.remove("open");
    menuButton?.classList.remove("active");
    menuButton?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  menuButton?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.classList.toggle("active", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  });

  $$(".main-nav a").forEach((link) => link.addEventListener("click", closeNav));
  window.addEventListener("resize", () => { if (window.innerWidth > 1050) closeNav(); });

  const backToTop = $(".back-to-top");
  const handleScroll = () => {
    const scrolled = window.scrollY > 20;
    header?.classList.toggle("scrolled", scrolled);
    backToTop?.classList.toggle("show", window.scrollY > 650);
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 })
    : null;

  $$(".reveal").forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    if (revealObserver) revealObserver.observe(element);
    else element.classList.add("visible");
  });

  const sendWhatsApp = (lines) => {
    const message = lines.filter(Boolean).join("\n");
    const url = `https://wa.me/${cfg.whatsapp || "919999999999"}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  $("#hero-quote-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    sendWhatsApp([
      `Hello ${cfg.companyName || "Transvora Logistics"},`,
      "",
      "I would like a quick logistics quotation.",
      `Service: ${$("#hero-service").value}`,
      `Pickup: ${$("#hero-pickup").value.trim()}`,
      `Delivery: ${$("#hero-drop").value.trim()}`,
      `Phone: ${$("#hero-phone").value.trim()}`
    ]);
  });

  $("#main-quote-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    sendWhatsApp([
      `Hello ${cfg.companyName || "Transvora Logistics"},`,
      "",
      "I would like a detailed logistics quotation.",
      `Name: ${form.get("name") || ""}`,
      `Company: ${form.get("company") || "Not provided"}`,
      `Phone: ${form.get("phone") || ""}`,
      `Service: ${form.get("service") || ""}`,
      `Pickup: ${form.get("pickup") || ""}`,
      `Delivery: ${form.get("drop") || ""}`,
      `Cargo: ${form.get("cargo") || "Not provided"}`,
      `Approx. weight: ${form.get("weight") || "Not provided"}`,
      `Additional details: ${form.get("details") || "Not provided"}`
    ]);
  });

  $$(".service-card").forEach((card) => {
    $(".service-link", card)?.addEventListener("click", () => {
      const service = card.dataset.service || "";
      const serviceSelect = $("#service");
      if (serviceSelect) serviceSelect.value = service;
      $("#quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
