(function () {
    "use strict";

    /* ============ Reveal-анимации при скролле ============ */
    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".reveal").forEach(function (el, i) {
        const parent = el.parentElement;
        const siblings = parent ? parent.querySelectorAll(".reveal") : [];
        const idx = Array.prototype.indexOf.call(siblings, el);
        if (idx > 0) el.style.setProperty("--d", Math.min(idx * 90, 450) + "ms");
        revealObserver.observe(el);
    });

    /* ============ Фильтры портфолио ============ */
    const chips = document.querySelectorAll(".chip");
    const cards = document.querySelectorAll(".card");

    chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
            chips.forEach(function (c) { c.classList.remove("is-active"); });
            chip.classList.add("is-active");
            const filter = chip.dataset.filter;

            cards.forEach(function (card) {
                const show = filter === "all" || card.dataset.cat === filter;
                card.style.display = show ? "" : "none";
                if (show) {
                    card.classList.add("is-visible");
                }
            });
        });
    });

    /* ============ Spotlight на карточках услуг ============ */
    document.querySelectorAll(".service").forEach(function (card) {
        card.addEventListener("mousemove", function (e) {
            const rect = card.getBoundingClientRect();
            card.style.setProperty("--mx", (e.clientX - rect.left) + "px");
            card.style.setProperty("--my", (e.clientY - rect.top) + "px");
        });
    });

    /* ============ Магнитные кнопки ============ */
    const magneticEls = document.querySelectorAll(".btn--primary, .btn--outline, .nav__cta");
    if (window.matchMedia("(hover: hover)").matches) {
        magneticEls.forEach(function (el) {
            el.addEventListener("mousemove", function (e) {
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
                el.style.transform = "translate(" + x + "px, " + y + "px)";
            });
            el.addEventListener("mouseleave", function () {
                el.style.transform = "";
            });
        });
    }

    /* ============ Кастомный курсор ============ */
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    if (dot && ring && window.matchMedia("(hover: hover)").matches) {
        let mx = 0, my = 0, rx = 0, ry = 0;

        window.addEventListener("mousemove", function (e) {
            mx = e.clientX;
            my = e.clientY;
            dot.style.transform = "translate(" + (mx - 4) + "px, " + (my - 4) + "px)";
        });

        (function loop() {
            rx += (mx - rx) * 0.18;
            ry += (my - ry) * 0.18;
            ring.style.transform = "translate(" + (rx - ring.offsetWidth / 2) + "px, " + (ry - ring.offsetHeight / 2) + "px)";
            requestAnimationFrame(loop);
        })();

        const hoverTargets = "a, button, .chip, input, textarea, video";
        document.querySelectorAll(hoverTargets).forEach(function (el) {
            el.addEventListener("mouseenter", function () { ring.classList.add("is-hover"); });
            el.addEventListener("mouseleave", function () { ring.classList.remove("is-hover"); });
        });
    }

    /* ============ Навигация при скролле ============ */
    const nav = document.getElementById("nav");
    const onScroll = function () {
        nav.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ============ Мобильное меню ============ */
    const burger = document.getElementById("burger");
    const mobileMenu = document.getElementById("mobileMenu");
    burger.addEventListener("click", function () {
        const open = mobileMenu.classList.toggle("is-open");
        burger.classList.toggle("is-open", open);
        burger.setAttribute("aria-expanded", String(open));
        document.body.style.overflow = open ? "hidden" : "";
    });
    mobileMenu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            mobileMenu.classList.remove("is-open");
            burger.classList.remove("is-open");
            burger.setAttribute("aria-expanded", "false");
            document.body.style.overflow = "";
        });
    });

    /* ============ Плавный скролл (в т.ч. для мобильных якорей) ============ */
    document.querySelectorAll('a[data-scroll]').forEach(function (link) {
        link.addEventListener("click", function (e) {
            const id = link.getAttribute("href");
            if (!id || id[0] !== "#") return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" });
        });
    });

    /* ============ Форма обратной связи ============ */
    const form = document.getElementById("contactForm");
    const status = document.getElementById("formStatus");
    if (form && status) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const message = form.message.value.trim();

            if (!name || !email || !message) {
                status.textContent = "Пожалуйста, заполните все поля.";
                status.className = "form__status is-error";
                return;
            }

            const mail = document.getElementById("contactMail");
            const to = mail ? mail.textContent : "";
            const subject = encodeURIComponent("Заявка с сайта-портфолио от " + name);
            const body = encodeURIComponent("Имя: " + name + "\nE-mail: " + email + "\n\nЗадача:\n" + message);
            window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;

            status.textContent = "Спасибо! Открываю почтовый клиент — осталось нажать «Отправить».";
            status.className = "form__status is-ok";
            form.reset();
        });
    }

    /* ============ Год в футере ============ */
    document.getElementById("year").textContent = new Date().getFullYear();
})();
