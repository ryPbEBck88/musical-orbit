(() => {
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".nav-toggle");
    const mobileNav = document.querySelector(".mobile-nav");

    if (toggle && mobileNav) {
        toggle.addEventListener("click", () => {
            const open = mobileNav.hasAttribute("hidden");
            if (open) {
                mobileNav.removeAttribute("hidden");
            } else {
                mobileNav.setAttribute("hidden", "");
            }
            toggle.setAttribute("aria-expanded", String(open));
        });

        mobileNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                mobileNav.setAttribute("hidden", "");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    const onScroll = () => {
        if (!header) return;
        header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const reveals = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
        );
        reveals.forEach((el, index) => {
            el.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
            io.observe(el);
        });
    } else {
        reveals.forEach((el) => el.classList.add("is-visible"));
    }
})();
