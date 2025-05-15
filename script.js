document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const openBtn = document.getElementById("openBtn");
  const backBtn = document.getElementById("backBtn");
  const initialView = document.getElementById("initialView");
  const invitationContent = document.getElementById("invitationContent");
  const coverPhoto = document.getElementById("coverPhoto");
  const invitationWrapper = document.getElementById("invitationWrapper");
  document.querySelector(".container").classList.add("loaded");

  // Open Invitation
  openBtn.addEventListener("click", function () {
    initialView.classList.add("hide-initial");
    invitationContent.classList.add("show-content");
    invitationContent.scrollTo(0, 0);

    // Add animation class
    invitationContent.classList.add("fade-in");

    // Remove animation after it completes
    setTimeout(() => {
      invitationContent.classList.remove("fade-in");
    }, 500);
  });

  // Back to Initial View
  backBtn.addEventListener("click", function () {
    invitationContent.classList.remove("show-content");
    initialView.classList.remove("hide-initial");
    window.scrollTo(0, 0);
  });

  // Adjust layout for mobile/desktop
  function adjustLayout() {
    if (window.innerWidth <= 768) {
      // Mobile - hide cover photo
      if (coverPhoto) {
        coverPhoto.style.display = "none";
      }
      if (invitationWrapper) {
        invitationWrapper.style.width = "100%";
      }
    } else {
      // Desktop - show split screen
      if (coverPhoto) {
        coverPhoto.style.display = "block";

        // Adjust text size based on container width
        const coverWidth = coverPhoto.offsetWidth;
        if (coverWidth < 500) {
          coverPhoto.querySelector(".cover-couple-name").style.fontSize =
            "2.5rem";
          coverPhoto.querySelector(".cover-wedding-date").style.fontSize =
            "1.2rem";
        } else {
          coverPhoto.querySelector(".cover-couple-name").style.fontSize =
            "3.5rem";
          coverPhoto.querySelector(".cover-wedding-date").style.fontSize =
            "1.5rem";
        }
      }
      if (invitationWrapper) {
        invitationWrapper.style.width = "40%";
      }
    }
  }

  // Initial adjustment
  adjustLayout();

  // Adjust on resize
  window.addEventListener("resize", adjustLayout);

  // Prevent scrolling when initial view is shown
  function preventScroll(e) {
    if (!invitationContent.classList.contains("show-content")) {
      e.preventDefault();
    }
  }

  // Add touch event listeners for mobile
  window.addEventListener("touchmove", preventScroll, { passive: false });

  // Cleanup on unmount
  return () => {
    window.removeEventListener("touchmove", preventScroll);
    window.removeEventListener("resize", adjustLayout);
  };
});

function setGuestNameFromURL() {
  const params = new URLSearchParams(window.location.search);
  let nama = params.get("nama");
  if (!nama) {
    // Cek juga jika pakai path, misal /undangan/dini
    const pathParts = window.location.pathname.split("/");
    nama = pathParts[pathParts.length - 1] || null;
    // Jika path terakhir bukan file html dan bukan kosong
    if (nama && !nama.endsWith(".html") && nama !== "") {
      // nama sudah didapat dari path
    } else {
      nama = null;
    }
  }
  if (nama) {
    // Ubah format nama: kapitalisasi awal
    nama = decodeURIComponent(nama).replace(/-/g, " ");
    nama = nama.replace(/\b\w/g, (c) => c.toUpperCase());
    const guestNameSpan = document.getElementById("guestName");
    if (guestNameSpan) guestNameSpan.textContent = nama;
  }
}

window.addEventListener("DOMContentLoaded", setGuestNameFromURL);
