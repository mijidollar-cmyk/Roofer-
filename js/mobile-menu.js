(function () {
  function initMobileMenu() {
    var button = document.getElementById("nav-toggle");
    var nav = document.getElementById("primary-navigation");
    if (!button || !nav || button.dataset.menuReady === "true") return;
    button.dataset.menuReady = "true";

    var articlePages = new Set([
      "roof-replacement-cost-miami.html",
      "roof-repair-vs-replacement-miami.html",
      "miami-roof-inspection-guide.html",
      "miami-roofing-resource-center.html",
      "storm-damage-roof-repair-miami.html",
      "hurricane-roof-damage-miami.html",
      "roof-insurance-claims-miami.html",
      "how-long-does-a-roof-last-in-miami.html",
      "how-do-i-know-if-i-need-a-new-roof.html",
      "what-to-do-when-roof-starts-leaking.html",
      "tile-vs-shingle-roofing-miami.html",
      "miami-dade-roofing-requirements.html",
      "how-often-should-you-inspect-roof-florida.html",
      "signs-you-need-emergency-roof-repair.html",
      "flat-roof-problems-miami.html"
    ]);
    var servicePages = new Set([
      "roof-repair-miami.html",
      "roof-replacement-miami.html",
      "emergency-roof-repair-miami.html",
      "commercial-roofing-miami.html",
      "roof-inspection-miami.html",
      "miami-beach-roofing.html",
      "coral-gables-roofing.html",
      "kendall-roofing.html",
      "doral-roofing.html",
      "hialeah-roofing.html",
      "miami-gardens-roofing.html",
      "homestead-roofing.html",
      "north-miami-roofing.html",
      "north-miami-beach-roofing.html",
      "aventura-roofing.html"
    ]);

    function setActiveLink() {
      var path = window.location.pathname.replace(/\/+$/, "") || "/";
      var current = path.split("/").pop() || "index.html";
      if (path === "/blog" || current === "blog.html" || articlePages.has(current)) {
        current = "blog";
      } else if (servicePages.has(current)) {
        current = "services";
      } else if (path === "/" || current === "index.html") {
        current = "home";
      } else if (current === "about.html") {
        current = "about";
      } else if (current === "contact.html") {
        current = "contact";
      } else {
        current = "";
      }

      nav.querySelectorAll("a").forEach(function (link) {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
        var href = link.getAttribute("href") || "";
        var key = href === "/blog" ? "blog" :
          href === "index.html#services" ? "services" :
          href === "index.html" ? "home" :
          href === "about.html" ? "about" :
          href === "contact.html" ? "contact" : "";
        if (key && key === current) {
          link.classList.add("active");
          link.setAttribute("aria-current", "page");
        }
      });
    }

    function setOpen(open) {
      var mobile = window.innerWidth <= 760;
      var visible = mobile ? open : true;
      nav.classList.toggle("open", mobile && open);
      button.setAttribute("aria-expanded", mobile && open ? "true" : "false");
      button.setAttribute("aria-label", mobile && open ? "Close navigation menu" : "Open navigation menu");
      button.textContent = mobile && open ? "×" : "☰";
      nav.setAttribute("aria-hidden", visible ? "false" : "true");
    }

    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(button.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("click", function (event) {
      if (window.innerWidth <= 760 && !nav.contains(event.target) && !button.contains(event.target)) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setOpen(false);
    });

    window.addEventListener("resize", function () {
      setOpen(false);
    });

    setActiveLink();
    setOpen(false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMobileMenu);
  } else {
    initMobileMenu();
  }
})();
