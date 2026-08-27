"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     01. ELEMENT SELECTORS
     ========================================================= */

  const header = document.getElementById("header");

  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = document.querySelectorAll(".mobile-links a");
  const mobileClose = document.querySelector(".mobile-close");

  const desktopNavLinks = document.querySelectorAll(".nav-link");

  const backTop = document.getElementById("backTop");

  const counters = document.querySelectorAll("[data-count]");

  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right",
  );

  const filterButtons = document.querySelectorAll(".filter");
  const projectCards = document.querySelectorAll(".project");

  const testimonialTrack = document.getElementById("testimonialTrack");
  const testimonials = testimonialTrack
    ? testimonialTrack.querySelectorAll(".testimonial")
    : [];

  const prevButton = document.querySelector(".slider-btn.prev");
  const nextButton = document.querySelector(".slider-btn.next");
  const dotsContainer = document.getElementById("dots");

  /* NOTE: form id matches the actual HTML markup: id="contact-form" */
  const quoteForm = document.getElementById("contact-form");
  const formStatus = quoteForm
    ? quoteForm.querySelector(".form-status")
    : document.querySelector(".form-status");

  /* =========================================================
     02. MOBILE MENU
     ========================================================= */

  function openMobileMenu() {
    if (!mobileMenu || !menuToggle) return;

    mobileMenu.classList.add("active");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");

    document.body.classList.add("menu-open");
  }

  function closeMobileMenu() {
    if (!mobileMenu || !menuToggle) return;

    mobileMenu.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");

    document.body.classList.remove("menu-open");
  }

  function toggleMobileMenu() {
    if (!mobileMenu) return;

    if (mobileMenu.classList.contains("active")) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMobileMenu);
  }

  if (mobileClose) {
    mobileClose.addEventListener("click", closeMobileMenu);
  }

  /* Delegated fallback: catches the close button even if clicked on
     one of its inner <span> elements, and even if the button gets
     re-rendered after this script first runs. */
  document.addEventListener("click", (event) => {
    if (event.target.closest(".mobile-close")) {
      closeMobileMenu();
    }
  });

  /* Close menu after clicking mobile navigation */

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  /* Close menu when clicking outside */

  document.addEventListener("click", (event) => {
    if (!mobileMenu || !menuToggle) return;

    const clickedInsideMenu = mobileMenu.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (
      mobileMenu.classList.contains("active") &&
      !clickedInsideMenu &&
      !clickedToggle
    ) {
      closeMobileMenu();
    }
  });

  /* Close menu with ESC */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  /* =========================================================
     03. CLOSE MOBILE MENU ON RESIZE
     ========================================================= */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 850) {
      closeMobileMenu();
    }

    updateTestimonialSlider();
  });

  /* =========================================================
     04. SMOOTH SCROLL
     ========================================================= */

  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      closeMobileMenu();

      const headerHeight = header ? header.offsetHeight : 0;

      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });

      history.replaceState(null, "", targetId);
    });
  });

  /* =========================================================
     05. HEADER SCROLL EFFECT
     ========================================================= */

  function updateHeader() {
    if (!header) return;

    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true,
  });

  /* =========================================================
     06. ACTIVE NAVIGATION ON SCROLL
     ========================================================= */

  const sections = [];

  desktopNavLinks.forEach((link) => {
    const href = link.getAttribute("href");

    if (!href || !href.startsWith("#")) return;

    const section = document.querySelector(href);

    if (section) {
      sections.push({
        link,
        section,
      });
    }
  });

  function updateActiveNavigation() {
    if (!sections.length) return;

    const scrollPosition =
      window.scrollY + (header ? header.offsetHeight : 100) + 100;

    let currentSection = sections[0];

    sections.forEach((item) => {
      if (scrollPosition >= item.section.offsetTop) {
        currentSection = item;
      }
    });

    desktopNavLinks.forEach((link) => {
      link.classList.remove("active");
    });

    if (currentSection && currentSection.link) {
      currentSection.link.classList.add("active");
    }
  }

  updateActiveNavigation();

  window.addEventListener("scroll", updateActiveNavigation, {
    passive: true,
  });

  /* =========================================================
     07. HERO ENTRANCE ANIMATION
     ========================================================= */

  const heroElements = document.querySelectorAll(".hero-reveal");

  heroElements.forEach((element, index) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition =
      "opacity 0.8s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)";

    setTimeout(
      () => {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      },
      250 + index * 160,
    );
  });

  /* =========================================================
     08. SCROLL REVEAL
     ========================================================= */

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  /* =========================================================
     09. COUNTER ANIMATION
     ========================================================= */

  function animateCounter(element) {
    if (!element || element.dataset.counted === "true") return;

    element.dataset.counted = "true";

    const target = Number(element.dataset.count);

    if (Number.isNaN(target)) return;

    const originalText = element.textContent.trim();

    const suffix = originalText.includes("+") ? "+" : "";

    const duration = 1800;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;

      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const currentValue = Math.floor(target * easedProgress);

      element.textContent = currentValue.toLocaleString("en-IN") + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString("en-IN") + suffix;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          animateCounter(entry.target);

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.5,
      },
    );

    counters.forEach((counter) => {
      counterObserver.observe(counter);
    });
  } else {
    counters.forEach((counter) => {
      animateCounter(counter);
    });
  }

  /* =========================================================
     10. PROJECT FILTER
     ========================================================= */

  function filterProjects(category) {
    projectCards.forEach((project, index) => {
      const projectCategory = project.dataset.category;

      const shouldShow = category === "all" || projectCategory === category;

      if (shouldShow) {
        project.style.display = "";
        project.style.opacity = "0";
        project.style.transform = "translateY(20px) scale(0.98)";

        requestAnimationFrame(() => {
          setTimeout(() => {
            project.style.opacity = "1";
            project.style.transform = "translateY(0) scale(1)";
          }, index * 50);
        });
      } else {
        project.style.opacity = "0";
        project.style.transform = "translateY(20px) scale(0.98)";

        setTimeout(() => {
          project.style.display = "none";
        }, 250);
      }
    });
  }

  projectCards.forEach((project) => {
    project.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-selected", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-selected", "true");

      filterProjects(category);
    });
  });

  /* =========================================================
     11. PROJECT VIEW MODAL
     ========================================================= */

  let projectModal = null;

  function createProjectModal() {
    if (projectModal) return projectModal;

    projectModal = document.createElement("div");

    projectModal.className = "project-modal";

    projectModal.innerHTML = `
      <div class="project-modal-overlay"></div>

      <div
        class="project-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="projectModalTitle"
      >
        <button
          class="project-modal-close"
          type="button"
          aria-label="Close project"
        >
          &times;
        </button>

        <div class="project-modal-image-wrap">
          <img
            class="project-modal-image"
            src=""
            alt=""
          />
        </div>

        <div class="project-modal-content">
          <span class="project-modal-category"></span>

          <h2 id="projectModalTitle"></h2>

          <p class="project-modal-location"></p>

          <p class="project-modal-description">
            A beautifully crafted project designed around
            the client's space, lifestyle, and requirements.
          </p>

          <a
            class="btn btn-dark project-modal-cta"
            href="#contact"
          >
            Start Your Project →
          </a>
        </div>
      </div>
    `;

    document.body.appendChild(projectModal);

    const style = document.createElement("style");

    style.textContent = `
      .project-modal {
        position: fixed;
        inset: 0;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition:
          opacity 0.3s ease,
          visibility 0.3s ease;
      }

      .project-modal.active {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }

      .project-modal-overlay {
        position: absolute;
        inset: 0;
        background: rgba(15, 10, 7, 0.78);
        backdrop-filter: blur(8px);
      }

      .project-modal-dialog {
        position: relative;
        z-index: 2;
        width: min(900px, 100%);
        max-height: 90vh;
        overflow: auto;
        background: #fff;
        border-radius: 18px;
        box-shadow: 0 30px 80px rgba(0,0,0,.28);
        transform: translateY(30px) scale(.97);
        transition: transform .35s cubic-bezier(.22,1,.36,1);
      }

      .project-modal.active .project-modal-dialog {
        transform: translateY(0) scale(1);
      }

      .project-modal-image-wrap {
        width: 100%;
        aspect-ratio: 16 / 8;
        overflow: hidden;
        background: #eee;
      }

      .project-modal-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .project-modal-content {
        padding: 34px;
      }

      .project-modal-category {
        display: block;
        margin-bottom: 10px;
        color: #c28a52;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: .16em;
        text-transform: uppercase;
      }

      .project-modal-content h2 {
        margin: 0 0 10px;
        color: #191614;
        font-family: "Playfair Display", Georgia, serif;
        font-size: clamp(30px, 5vw, 48px);
        line-height: 1.1;
      }

      .project-modal-location {
        margin-bottom: 18px;
        color: #777;
        font-size: 14px;
      }

      .project-modal-description {
        max-width: 650px;
        margin-bottom: 26px;
        color: #555;
        line-height: 1.7;
      }

      .project-modal-close {
        position: absolute;
        top: 14px;
        right: 14px;
        z-index: 5;
        width: 42px;
        height: 42px;
        border: 0;
        border-radius: 50%;
        background: rgba(255,255,255,.95);
        color: #222;
        font-size: 28px;
        line-height: 1;
        cursor: pointer;
        box-shadow: 0 5px 20px rgba(0,0,0,.15);
      }

      .project-modal-close:hover {
        transform: rotate(90deg);
      }

      @media (max-width: 600px) {
        .project-modal {
          padding: 12px;
        }

        .project-modal-content {
          padding: 24px 20px;
        }

        .project-modal-image-wrap {
          aspect-ratio: 4 / 3;
        }
      }

      body.modal-open {
        overflow: hidden;
      }
    `;

    document.head.appendChild(style);

    return projectModal;
  }

  function openProjectModal(project) {
    if (!project) return;

    const modal = createProjectModal();

    const image = project.querySelector("img");
    const title = project.querySelector("h3");
    const category = project.querySelector("small");
    const location = project.querySelector("p");

    const modalImage = modal.querySelector(".project-modal-image");

    const modalTitle = modal.querySelector("#projectModalTitle");

    const modalCategory = modal.querySelector(".project-modal-category");

    const modalLocation = modal.querySelector(".project-modal-location");

    modalImage.src = image ? image.src : "";

    modalImage.alt = image ? image.alt : "";

    modalTitle.textContent = title
      ? title.textContent.replace(/\s+/g, " ").trim()
      : "Project";

    modalCategory.textContent = category ? category.textContent : "";

    modalLocation.textContent = location ? location.textContent : "";

    modal.classList.add("active");

    document.body.classList.add("modal-open");

    const closeButton = modal.querySelector(".project-modal-close");

    if (closeButton) {
      setTimeout(() => closeButton.focus(), 50);
    }
  }

  function closeProjectModal() {
    if (!projectModal) return;

    projectModal.classList.remove("active");

    document.body.classList.remove("modal-open");
  }

  projectCards.forEach((project) => {
    const viewButton = project.querySelector(".project-view");

    if (!viewButton) return;

    viewButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      openProjectModal(project);
    });
  });

  document.addEventListener("click", (event) => {
    if (!projectModal) return;

    if (
      event.target.classList.contains("project-modal-overlay") ||
      event.target.closest(".project-modal-close")
    ) {
      closeProjectModal();
    }

    if (event.target.closest(".project-modal-cta")) {
      closeProjectModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      projectModal &&
      projectModal.classList.contains("active")
    ) {
      closeProjectModal();
    }
  });

  /* =========================================================
     12. TESTIMONIAL SLIDER
     ========================================================= */

  let currentTestimonial = 0;
  let testimonialTimer = null;
  let testimonialPerView = 1;

  function getTestimonialsPerView() {
    const width = window.innerWidth;

    if (width >= 1100) {
      return 3;
    }

    if (width >= 700) {
      return 2;
    }

    return 1;
  }

  function getMaxTestimonialIndex() {
    return Math.max(0, testimonials.length - testimonialPerView);
  }

  function createTestimonialDots() {
    if (!dotsContainer || !testimonials.length) {
      return;
    }

    testimonialPerView = getTestimonialsPerView();

    const totalDots = Math.max(1, testimonials.length - testimonialPerView + 1);

    dotsContainer.innerHTML = "";

    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement("button");

      dot.type = "button";

      dot.className = "testimonial-dot";

      dot.setAttribute("aria-label", `Go to testimonial ${i + 1}`);

      dot.addEventListener("click", () => {
        currentTestimonial = i;

        updateTestimonialSlider();

        restartTestimonialAutoplay();
      });

      dotsContainer.appendChild(dot);
    }
  }

  function updateTestimonialSlider() {
    if (!testimonialTrack || !testimonials.length) {
      return;
    }

    testimonialPerView = getTestimonialsPerView();

    const maxIndex = getMaxTestimonialIndex();

    if (currentTestimonial > maxIndex) {
      currentTestimonial = maxIndex;
    }

    const gap = parseFloat(getComputedStyle(testimonialTrack).gap) || 0;

    const firstCard = testimonials[0];

    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;

    const movement = currentTestimonial * (cardWidth + gap);

    testimonialTrack.style.transform = `translate3d(-${movement}px, 0, 0)`;

    /* Update dots */

    const dots = dotsContainer
      ? dotsContainer.querySelectorAll(".testimonial-dot")
      : [];

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentTestimonial);

      dot.setAttribute(
        "aria-current",
        index === currentTestimonial ? "true" : "false",
      );
    });

    /* Disable arrows when necessary */

    if (prevButton) {
      prevButton.disabled = currentTestimonial <= 0;
    }

    if (nextButton) {
      nextButton.disabled = currentTestimonial >= maxIndex;
    }
  }

  function goToNextTestimonial() {
    const maxIndex = getMaxTestimonialIndex();

    if (currentTestimonial >= maxIndex) {
      currentTestimonial = 0;
    } else {
      currentTestimonial++;
    }

    updateTestimonialSlider();
  }

  function goToPreviousTestimonial() {
    const maxIndex = getMaxTestimonialIndex();

    if (currentTestimonial <= 0) {
      currentTestimonial = maxIndex;
    } else {
      currentTestimonial--;
    }

    updateTestimonialSlider();
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      goToNextTestimonial();
      restartTestimonialAutoplay();
    });
  }

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      goToPreviousTestimonial();
      restartTestimonialAutoplay();
    });
  }

  function startTestimonialAutoplay() {
    if (testimonialTimer) {
      clearInterval(testimonialTimer);
    }

    testimonialTimer = setInterval(() => {
      goToNextTestimonial();
    }, 5000);
  }

  function stopTestimonialAutoplay() {
    if (testimonialTimer) {
      clearInterval(testimonialTimer);
      testimonialTimer = null;
    }
  }

  function restartTestimonialAutoplay() {
    stopTestimonialAutoplay();
    startTestimonialAutoplay();
  }

  if (testimonialTrack && testimonials.length) {
    createTestimonialDots();

    requestAnimationFrame(() => {
      updateTestimonialSlider();
    });

    startTestimonialAutoplay();

    /* Pause when mouse is over slider */

    const slider = document.querySelector(".testimonial-slider");

    if (slider) {
      slider.addEventListener("mouseenter", stopTestimonialAutoplay);

      slider.addEventListener("mouseleave", startTestimonialAutoplay);

      /* Touch swipe */

      let touchStartX = 0;
      let touchEndX = 0;

      slider.addEventListener(
        "touchstart",
        (event) => {
          touchStartX = event.changedTouches[0].screenX;

          stopTestimonialAutoplay();
        },
        {
          passive: true,
        },
      );

      slider.addEventListener(
        "touchend",
        (event) => {
          touchEndX = event.changedTouches[0].screenX;

          const distance = touchEndX - touchStartX;

          if (Math.abs(distance) > 50) {
            if (distance < 0) {
              goToNextTestimonial();
            } else {
              goToPreviousTestimonial();
            }
          }

          startTestimonialAutoplay();
        },
        {
          passive: true,
        },
      );
    }
  }

  /* =========================================================
     13. QUOTE FORM VALIDATION + WEB3FORMS SUBMISSION
     ========================================================= */

  function showFormStatus(message, type = "info") {
    if (!formStatus) return;

    formStatus.textContent = message;

    formStatus.dataset.status = type;

    if (type === "success") {
      formStatus.style.color = "#2f7d32";
    } else if (type === "error") {
      formStatus.style.color = "#b3261e";
    } else {
      formStatus.style.color = "#7a6a55";
    }
  }

  function clearFieldError(input) {
    if (!input) return;

    input.removeAttribute("aria-invalid");

    const error = input.parentElement.querySelector(".field-error");

    if (error) {
      error.remove();
    }

    input.style.borderColor = "";
  }

  function showFieldError(input, message) {
    if (!input) return;

    clearFieldError(input);

    input.setAttribute("aria-invalid", "true");

    input.style.borderColor = "#c0392b";

    const error = document.createElement("small");

    error.className = "field-error";

    error.textContent = message;

    error.style.display = "block";
    error.style.marginTop = "6px";
    error.style.color = "#b3261e";
    error.style.fontSize = "12px";

    input.parentElement.appendChild(error);
  }

  function validateName(input) {
    const value = input.value.trim();

    if (!value) {
      showFieldError(input, "Please enter your full name.");

      return false;
    }

    if (value.length < 2) {
      showFieldError(input, "Name must contain at least 2 characters.");

      return false;
    }

    clearFieldError(input);

    return true;
  }

  function validateEmail(input) {
    const value = input.value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
      showFieldError(input, "Please enter your email address.");

      return false;
    }

    if (!emailPattern.test(value)) {
      showFieldError(input, "Please enter a valid email address.");

      return false;
    }

    clearFieldError(input);

    return true;
  }

  function validatePhone(input) {
    const value = input.value.trim();

    const phoneDigits = value.replace(/\D/g, "");

    if (!value) {
      showFieldError(input, "Please enter your phone number.");

      return false;
    }

    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      showFieldError(input, "Please enter a valid phone number.");

      return false;
    }

    clearFieldError(input);

    return true;
  }

  function validateSelect(input) {
    if (!input.value.trim()) {
      showFieldError(input, "Please select a service.");

      return false;
    }

    clearFieldError(input);

    return true;
  }

  function validateMessage(input) {
    const value = input.value.trim();

    if (!value) {
      showFieldError(input, "Please tell us about your project.");

      return false;
    }

    if (value.length < 10) {
      showFieldError(input, "Please provide a little more project detail.");

      return false;
    }

    clearFieldError(input);

    return true;
  }

  if (quoteForm) {
    const nameInput = quoteForm.querySelector('[name="name"]');

    const emailInput = quoteForm.querySelector('[name="email"]');

    const phoneInput = quoteForm.querySelector('[name="phone"]');

    const serviceInput = quoteForm.querySelector('[name="service"]');

    const messageInput = quoteForm.querySelector('[name="message"]');

    const submitButton = quoteForm.querySelector('button[type="submit"]');

    const originalButtonText = submitButton ? submitButton.textContent : "";

    /* Validate while typing */

    if (nameInput) {
      nameInput.addEventListener("blur", () => validateName(nameInput));
    }

    if (emailInput) {
      emailInput.addEventListener("blur", () => validateEmail(emailInput));
    }

    if (phoneInput) {
      phoneInput.addEventListener("blur", () => validatePhone(phoneInput));
    }

    if (serviceInput) {
      serviceInput.addEventListener("change", () =>
        validateSelect(serviceInput),
      );
    }

    if (messageInput) {
      messageInput.addEventListener("blur", () =>
        validateMessage(messageInput),
      );
    }

    /* Submit */

    quoteForm.addEventListener("submit", (event) => {
      /* This MUST run first, before anything else, so a native
         redirect to Web3Forms can never happen even if a later
         line throws an error. */
      event.preventDefault();

      showFormStatus("Checking your information...", "info");

      const isNameValid = nameInput ? validateName(nameInput) : false;

      const isEmailValid = emailInput ? validateEmail(emailInput) : false;

      const isPhoneValid = phoneInput ? validatePhone(phoneInput) : false;

      const isServiceValid = serviceInput
        ? validateSelect(serviceInput)
        : false;

      const isMessageValid = messageInput
        ? validateMessage(messageInput)
        : false;

      const isValid =
        isNameValid &&
        isEmailValid &&
        isPhoneValid &&
        isServiceValid &&
        isMessageValid;

      if (!isValid) {
        showFormStatus("Please check the highlighted fields.", "error");

        const firstInvalid = quoteForm.querySelector('[aria-invalid="true"]');

        if (firstInvalid) {
          firstInvalid.focus();
        }

        return;
      }

      /* Submits to Web3Forms via fetch (AJAX) so the browser
         stays on this page instead of redirecting to
         api.web3forms.com — see https://web3forms.com/ */

      const formData = new FormData(quoteForm);

      const name = formData.get("name");

      const service = formData.get("service");

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }

      showFormStatus("Sending your enquiry...", "info");

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          if (!result.success) {
            throw new Error(result.message || "Submission failed");
          }

          showFormStatus(
            `Thank you ${name}! Your ${service} enquiry has been received.`,
            "success",
          );

          quoteForm.classList.add("submitted");

          setTimeout(() => {
            quoteForm.reset();

            quoteForm
              .querySelectorAll('[aria-invalid="true"]')
              .forEach((input) => {
                clearFieldError(input);
              });

            quoteForm.classList.remove("submitted");

            showFormStatus("We will contact you shortly.", "success");
          }, 3500);
        })
        .catch((error) => {
          console.error(error);

          showFormStatus(
            "Something went wrong. Please call or WhatsApp us instead.",
            "error",
          );
        })
        .finally(() => {
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
          }
        });
    });
  }

  /* =========================================================
     14. BACK TO TOP BUTTON
     ========================================================= */

  function updateBackTop() {
    if (!backTop) return;

    if (window.scrollY > 600) {
      backTop.classList.add("visible");
    } else {
      backTop.classList.remove("visible");
    }
  }

  if (backTop) {
    backTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    updateBackTop();

    window.addEventListener("scroll", updateBackTop, {
      passive: true,
    });
  }

  /* =========================================================
     15. PROJECT CARD KEYBOARD ACCESSIBILITY
     ========================================================= */

  projectCards.forEach((project) => {
    const button = project.querySelector(".project-view");

    if (!button) return;

    button.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();

        openProjectModal(project);
      }
    });
  });

  /* =========================================================
     16. IMAGE LOADING
     ========================================================= */

  const images = document.querySelectorAll("img");

  images.forEach((image) => {
    image.addEventListener(
      "load",
      () => {
        image.classList.add("image-loaded");
      },
      {
        once: true,
      },
    );

    image.addEventListener(
      "error",
      () => {
        image.classList.add("image-error");
      },
      {
        once: true,
      },
    );
  });

  /* =========================================================
     17. BUTTON RIPPLE EFFECT
     ========================================================= */

  const buttons = document.querySelectorAll(".btn, .filter, .slider-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", function (event) {
      const rect = this.getBoundingClientRect();

      const ripple = document.createElement("span");

      ripple.className = "js-ripple";

      const size = Math.max(rect.width, rect.height);

      ripple.style.width = `${size}px`;

      ripple.style.height = `${size}px`;

      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;

      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  /* Ripple CSS */

  const rippleStyle = document.createElement("style");

  rippleStyle.textContent = `
    .btn,
    .filter,
    .slider-btn {
      position: relative;
      overflow: hidden;
    }

    .js-ripple {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      background: rgba(255,255,255,.28);
      transform: scale(0);
      animation: jsRipple .6s ease-out;
    }

    @keyframes jsRipple {
      to {
        transform: scale(2.5);
        opacity: 0;
      }
    }
  `;

  document.head.appendChild(rippleStyle);

  /* =========================================================
     18. LAZY LOAD IMAGES
     ========================================================= */

  const lazyImages = document.querySelectorAll("img[data-src]");

  if ("IntersectionObserver" in window && lazyImages.length) {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const image = entry.target;

          image.src = image.dataset.src;

          image.removeAttribute("data-src");

          observer.unobserve(image);
        });
      },
      {
        rootMargin: "200px",
      },
    );

    lazyImages.forEach((image) => {
      imageObserver.observe(image);
    });
  }

  /* =========================================================
     19. REDUCE MOTION ACCESSIBILITY
     ========================================================= */

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  function handleReducedMotion() {
    if (!prefersReducedMotion.matches) {
      return;
    }

    document.documentElement.classList.add("reduce-motion");

    stopTestimonialAutoplay();

    heroElements.forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "none";
      element.style.transition = "none";
    });
  }

  handleReducedMotion();

  /* =========================================================
     20. KEYBOARD NAVIGATION FOR PROJECT FILTERS
     ========================================================= */

  filterButtons.forEach((button, index) => {
    button.addEventListener("keydown", (event) => {
      let nextIndex = null;

      if (event.key === "ArrowRight") {
        nextIndex = (index + 1) % filterButtons.length;
      }

      if (event.key === "ArrowLeft") {
        nextIndex = (index - 1 + filterButtons.length) % filterButtons.length;
      }

      if (nextIndex !== null) {
        event.preventDefault();

        filterButtons[nextIndex].focus();

        filterButtons[nextIndex].click();
      }
    });
  });

  /* =========================================================
     21. UPDATE ARIA FOR FILTER BUTTONS
     ========================================================= */

  filterButtons.forEach((button) => {
    button.setAttribute("role", "tab");

    button.setAttribute(
      "aria-selected",
      button.classList.contains("active") ? "true" : "false",
    );
  });

  /* =========================================================
     22. TESTIMONIAL TRACK TRANSITION
     ========================================================= */

  if (testimonialTrack) {
    testimonialTrack.style.transition =
      "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)";
  }

  /* =========================================================
     23. INITIAL STATE
     ========================================================= */

  updateHeader();
  updateActiveNavigation();
  updateBackTop();

  if (testimonialTrack) {
    requestAnimationFrame(() => {
      createTestimonialDots();
      updateTestimonialSlider();
    });
  }

  /* =========================================================
     24. CONSOLE CHECK
     ========================================================= */

  console.log(
    "%cPrem Interior website JavaScript loaded successfully. (mobile-close fix active)",
    "color:#c28a52;font-weight:700;font-size:14px;",
  );
});
