document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const initialView = document.getElementById("initialView");
  const invitationContent = document.getElementById("invitationContent");
  const openBtn = document.getElementById("openBtn");
  const audioControl = document.getElementById("audioControl");
  const bgMusic = document.getElementById("bgMusic");
  const coverPhoto = document.getElementById("coverPhoto");
  const invitationWrapper = document.getElementById("invitationWrapper");

  // Get URL parameters for guest name
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get("to");

  // Set guest name if available
  const guestNameElement = document.getElementById("guestName");
  if (guestName && guestNameElement) {
    guestNameElement.textContent = decodeURIComponent(guestName);
  }

  // Add loaded class to container for animations
  document.querySelector(".container").classList.add("loaded");

  // Audio control
  let isPlaying = false;

  if (audioControl) {
    audioControl.addEventListener("click", function () {
      if (!bgMusic) return;

      if (isPlaying) {
        bgMusic.pause();
        audioControl.classList.remove("playing");
        isPlaying = false;
      } else {
        bgMusic.play().catch((error) => {
          console.error("Audio playback failed:", error);
        });
        audioControl.classList.add("playing");
        isPlaying = true;
      }
    });
  }

  // Open invitation button
  if (openBtn && initialView && invitationContent) {
    openBtn.addEventListener("click", function () {
      // Enable scrolling
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";

      initialView.classList.add("hide-initial");
      invitationContent.classList.add("show-content");

      // Start playing music automatically
      if (bgMusic) {
        bgMusic.play().catch((error) => {
          console.error("Audio playback failed:", error);
        });

        if (audioControl) {
          audioControl.classList.add("playing");
          isPlaying = true;
        }
      }
    });
  }

  // Adjust layout for responsive design
  function adjustLayout() {
    if (window.innerWidth <= 768) {
      // Mobile layout
      if (coverPhoto) coverPhoto.style.display = "none";
      if (invitationWrapper) {
        invitationWrapper.style.marginLeft = "0";
        invitationWrapper.style.width = "100%";
      }
    } else {
      // Desktop layout
      if (coverPhoto) coverPhoto.style.display = "block";
      if (invitationWrapper) {
        invitationWrapper.style.marginLeft = "60%";
        invitationWrapper.style.width = "40%";
      }

      // Adjust text size based on container width
      const coverText = document.querySelector(".cover-text");
      const coupleNameElem = document.querySelector(".cover-couple-name");
      const weddingDateElem = document.querySelector(".cover-wedding-date");

      if (coverPhoto && coupleNameElem && weddingDateElem) {
        const coverWidth = coverPhoto.offsetWidth;
        if (coverWidth < 500) {
          coupleNameElem.style.fontSize = "2.5rem";
          weddingDateElem.style.fontSize = "1.2rem";
        } else {
          coupleNameElem.style.fontSize = "3.5rem";
          weddingDateElem.style.fontSize = "1.5rem";
        }
      }
    }
  }

  // Initial layout adjustment
  adjustLayout();

  // Adjust on window resize
  window.addEventListener("resize", adjustLayout);

  // Countdown timer
  const countdownElement = document.getElementById("countdown");
  if (countdownElement) {
    const weddingDate = new Date("January 20, 2025 08:00:00").getTime();

    const countdown = setInterval(function () {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      // Time calculations
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Format time to always have 2 digits
      const formatTime = (time) => (time < 10 ? `0${time}` : time);

      // Update countdown if elements exist
      const daysElement = document.getElementById("days");
      const hoursElement = document.getElementById("hours");
      const minutesElement = document.getElementById("minutes");
      const secondsElement = document.getElementById("seconds");

      if (daysElement) daysElement.textContent = formatTime(days);
      if (hoursElement) hoursElement.textContent = formatTime(hours);
      if (minutesElement) minutesElement.textContent = formatTime(minutes);
      if (secondsElement) secondsElement.textContent = formatTime(seconds);

      // If the countdown is over
      if (distance < 0) {
        clearInterval(countdown);
        countdownElement.innerHTML =
          "<div class='expired'>Acara telah dimulai!</div>";
      }
    }, 1000);
  }

  // Copy account number functionality
  const copyButtons = document.querySelectorAll(".copy-btn");
  copyButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const textToCopy = this.getAttribute("data-clipboard");
      navigator.clipboard.writeText(textToCopy).then(() => {
        this.textContent = "Tersalin!";
        this.classList.add("copied");

        // Reset button text after 2 seconds
        setTimeout(() => {
          this.textContent = "Salin";
          this.classList.remove("copied");
        }, 2000);
      });
    });
  });

  // Wishes form handling
  const wishesForm = document.getElementById("wishesForm");
  const wishesList = document.getElementById("wishesList");

  if (wishesForm && wishesList) {
    wishesForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const message = document.getElementById("message").value;
      const attendance = document.getElementById("attendance").value;

      // Display attendance text
      let attendanceText = "";
      if (attendance === "hadir") {
        attendanceText = "Hadir";
      } else if (attendance === "tidak hadir") {
        attendanceText = "Tidak Hadir";
      } else {
        attendanceText = "Masih Ragu";
      }

      // Create wish item
      const wishItem = document.createElement("div");
      wishItem.className = "wish-item";
      wishItem.innerHTML = `
        <div class="wish-header">
          <div class="wish-name">${name}</div>
          <div class="wish-attendance">${attendanceText}</div>
        </div>
        <div class="wish-message">${message}</div>
      `;

      // Add to list
      wishesList.prepend(wishItem);

      // Reset form
      wishesForm.reset();
    });
  }

  // Gallery lightbox
  const galleryItems = document.querySelectorAll(".gallery-item");
  galleryItems.forEach((item) => {
    item.addEventListener("click", function () {
      const img = this.querySelector("img");
      if (!img) return;

      const imgSrc = img.src;

      const lightbox = document.createElement("div");
      lightbox.className = "lightbox";
      lightbox.innerHTML = `
        <div class="lightbox-content">
          <span class="close-lightbox">&times;</span>
          <img src="${imgSrc}" alt="Gallery Image">
        </div>
      `;

      document.body.appendChild(lightbox);

      // Close on click
      const closeBtn = lightbox.querySelector(".close-lightbox");
      closeBtn.addEventListener("click", function () {
        document.body.removeChild(lightbox);
      });

      lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox) {
          document.body.removeChild(lightbox);
        }
      });
    });
  });
});
