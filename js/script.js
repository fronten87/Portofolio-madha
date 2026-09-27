document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".slide");
    const progress = document.querySelector(".scroll-progress");
    const backToTop = document.querySelector(".back-to-top");
    // ===== HAMBURGER NAVBAR =====
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    const closeMenu = () => {
        hamburger?.classList.remove("is-open");
        navMenu?.classList.remove("is-open");
        hamburger?.setAttribute("aria-expanded", "false");
        hamburger?.setAttribute("aria-label", "Buka menu navigasi");
    };

    hamburger?.addEventListener("click", (event) => {
        event.stopPropagation();
        const open = !navMenu.classList.contains("is-open");
        hamburger.classList.toggle("is-open", open);
        navMenu.classList.toggle("is-open", open);
        hamburger.setAttribute("aria-expanded", String(open));
        hamburger.setAttribute("aria-label", open ? "Tutup menu navigasi" : "Buka menu navigasi");
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.forEach((item) => item.classList.remove("active"));
            link.classList.add("active");
            closeMenu();
        });
    });

    document.addEventListener("click", (event) => {
        if (navMenu?.classList.contains("is-open") && !event.target.closest(".navbar")) {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) closeMenu();
    });


    // ===== DARK / LIGHT MODE =====
    const themeToggle = document.querySelector(".theme-toggle");
    const savedTheme = localStorage.getItem("argya-theme");

    const applyTheme = (dark) => {
        document.body.classList.toggle("dark-mode", dark);
        themeToggle.textContent = dark ? "☀️" : "🌙";
        themeToggle.setAttribute("aria-label", dark ? "Aktifkan mode terang" : "Aktifkan mode gelap");
        themeToggle.setAttribute("title", dark ? "Ganti ke mode terang" : "Ganti ke mode gelap");
    };

    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(savedTheme ? savedTheme === "dark" : prefersDark);

    themeToggle.addEventListener("click", () => {
        const dark = !document.body.classList.contains("dark-mode");
        applyTheme(dark);
        localStorage.setItem("argya-theme", dark ? "dark" : "light");
    });

    // Animasi section saat masuk viewport
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("is-visible");

            // Animasi isi secara berurutan
            const items = entry.target.querySelectorAll(".reveal-item");
            items.forEach((item, index) => {
                item.style.transitionDelay = `${index * 90}ms`;
            });

            obs.unobserve(entry.target);
        });
    }, {
        threshold: 0.14
    });

    slides.forEach((slide) => observer.observe(slide));

    // Progress bar berdasarkan posisi scroll
    const updateScrollUI = () => {
        const scrollTop = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const percentage = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

        progress.style.width = `${percentage}%`;

        if (scrollTop > 500) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }
    };

    window.addEventListener("scroll", updateScrollUI, { passive: true });
    updateScrollUI();

    // Tombol kembali ke atas
    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // Efek tilt ringan pada card saat mouse bergerak
    document.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("mousemove", (event) => {
            if (window.innerWidth <= 768) return;

            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const rotateX = ((y / rect.height) - 0.5) * -2;
            const rotateY = ((x / rect.width) - 0.5) * 2;

            card.style.transform =
                `translateY(-8px) perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });

    // Navbar otomatis mengikuti section yang sedang terlihat
    const navSections = [...document.querySelectorAll("section[id]")];
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
            });
        });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

    navSections.forEach((section) => navObserver.observe(section));

    // Fallback jika browser tidak mendukung IntersectionObserver
    if (!("IntersectionObserver" in window)) {
        slides.forEach((slide) => slide.classList.add("is-visible"));
    }
});
