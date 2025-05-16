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
  if (initialView && invitationContent && openBtn) {
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
          audioControl.classList.add("show-audio-control"); // Show the audio control
          isPlaying = true;
        }
      }

      // Load wishes after invitation is opened
      if (typeof loadWishes === "function") {
        loadWishes();
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

  // PERBAIKAN COUNTDOWN
  // Deklarasikan variabel timer di luar fungsi
  let countdownTimer;

  function updateCountdown() {
    const weddingDate = new Date("June 22, 2025 09:00:00").getTime(); // Sesuai dengan tanggal di HTML
    const now = new Date().getTime();
    const distance = weddingDate - now;

    // Time calculations
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Debug: Tampilkan di console untuk pengecekan
    console.log("Countdown elemen:", document.getElementById("days"));
    console.log(`Countdown values: ${days}d ${hours}h ${minutes}m ${seconds}s`);

    // Update countdown elements dengan cara yang lebih agresif
    try {
      const daysElement = document.getElementById("days");
      const hoursElement = document.getElementById("hours");
      const minutesElement = document.getElementById("minutes");
      const secondsElement = document.getElementById("seconds");

      if (daysElement) {
        daysElement.textContent = days < 10 ? `0${days}` : `${days}`;
        console.log("Days updated:", daysElement.textContent);
      } else {
        console.warn("Element 'days' not found");
      }

      if (hoursElement) {
        hoursElement.textContent = hours < 10 ? `0${hours}` : `${hours}`;
      }

      if (minutesElement) {
        minutesElement.textContent =
          minutes < 10 ? `0${minutes}` : `${minutes}`;
      }

      if (secondsElement) {
        secondsElement.textContent =
          seconds < 10 ? `0${seconds}` : `${seconds}`;
      }

      // If the countdown is over
      if (distance < 0) {
        const countdownElement = document.getElementById("countdown");
        clearInterval(countdownTimer);
        if (countdownElement) {
          countdownElement.innerHTML =
            "<div class='expired'>Acara telah dimulai!</div>";
        }
      }
    } catch (error) {
      console.error("Error updating countdown:", error);
    }
  }

  // Panggil sekali agar countdown langsung tampil
  setTimeout(updateCountdown, 500); // Tambahkan delay kecil

  // Set interval untuk memperbarui setiap detik
  countdownTimer = setInterval(updateCountdown, 1000);

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

  // PENTING: HAPUS bagian "Wishes form handling" duplikat yang ada di sini
  // Code untuk wishesForm lokal ini dihapus karena diganti dengan Google Sheets integration

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

  // Gift functionality
  const showGiftBtn = document.getElementById("showGiftBtn");
  const bankAccounts = document.getElementById("bankAccounts");
  const physicalGift = document.getElementById("physicalGift");

  if (showGiftBtn && bankAccounts) {
    showGiftBtn.addEventListener("click", function () {
      console.log("Gift button clicked"); // For debugging

      // Toggle display of bank accounts
      if (
        bankAccounts.style.display === "none" ||
        !bankAccounts.style.display
      ) {
        console.log("Showing bank accounts"); // For debugging

        // Make sure element is visible first
        bankAccounts.style.display = "block";

        // Force a reflow before adding the show class
        void bankAccounts.offsetWidth;

        setTimeout(() => {
          bankAccounts.classList.add("show");
        }, 10);

        // Also show physical gift section
        if (physicalGift) {
          physicalGift.style.display = "block";
          setTimeout(() => {
            physicalGift.classList.add("show");
          }, 200); // Slight delay for staggered animation
        }

        // Change button text
        showGiftBtn.innerHTML = '<i class="fas fa-times"></i> Sembunyikan';
      } else {
        console.log("Hiding bank accounts"); // For debugging

        // Hide sections
        bankAccounts.classList.remove("show");
        if (physicalGift) physicalGift.classList.remove("show");

        setTimeout(() => {
          bankAccounts.style.display = "none";
          if (physicalGift) physicalGift.style.display = "none";
        }, 500); // Wait for transition to complete

        // Restore button text
        showGiftBtn.innerHTML = '<i class="fas fa-gift"></i> Kirim Hadiah';
      }
    });
  }

  // ===== GOOGLE SHEETS INTEGRATION =====
  // Pindahkan kode Google Sheets integration ke dalam event listener DOMContentLoaded utama
  // untuk menghindari konflik duplikasi event listener

  // TAMBAHKAN URL Google Apps Script yang benar dengan CORS support
  const GOOGLE_APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzxtIETlFzrBZE6je1kMFLwZdUDIOYoY6zX7cktvJrnK-0jUTBpZLIZdJXSdhMoTDCsZg/exec";

  // Expose loadWishes function to global scope agar bisa dipanggil oleh tombol open invitation
  window.loadWishes = loadWishes;

  const wishesForm = document.getElementById("wishesForm");
  const wishesList = document.getElementById("wishesList");
  const wishesLoading = document.getElementById("wishesLoading");
  const loadMoreWishes = document.getElementById("loadMoreWishes");
  const wishesCount = document.getElementById("wishesCount");
  const attendingCount = document.getElementById("attendingCount");
  const notAttendingCount = document.getElementById("notAttendingCount");

  let wishesData = [];
  let displayedWishes = 0;
  const WISHES_PER_PAGE = 5;

  // Function to format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Load wishes from Google Sheets
  function loadWishes() {
    if (!wishesList || !wishesLoading) {
      console.log("Missing elements: wishesList or wishesLoading");
      return;
    }

    wishesLoading.style.display = "flex";

    console.log("Fetching wishes from:", GOOGLE_APPS_SCRIPT_URL);

    fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log("Fetch response received:", response);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data received:", data);
        wishesData = data.data || [];

        // Update stats
        if (wishesCount) wishesCount.textContent = wishesData.length;

        let attending = 0;
        let notAttending = 0;

        wishesData.forEach((wish) => {
          if (wish.Attendance === "hadir") attending++;
          if (wish.Attendance === "tidak hadir") notAttending++;
        });

        if (attendingCount) attendingCount.textContent = attending;
        if (notAttendingCount) notAttendingCount.textContent = notAttending;

        // Sort by timestamp (newest first)
        wishesData.sort(
          (a, b) => new Date(b.Timestamp) - new Date(a.Timestamp)
        );

        // Display initial wishes
        displayWishes();

        wishesLoading.style.display = "none";
      })
      .catch((error) => {
        console.error("Error loading wishes:", error);
        wishesLoading.style.display = "none";
        wishesList.innerHTML =
          '<div class="error-message">Gagal memuat ucapan. Silakan coba lagi nanti.</div>';
      });
  }

  // Display wishes in batches
  function displayWishes() {
    if (!wishesList || wishesData.length === 0) {
      console.log("No wishes data to display or missing wishesList element");
      return;
    }

    const end = Math.min(displayedWishes + WISHES_PER_PAGE, wishesData.length);
    console.log(`Displaying wishes from ${displayedWishes} to ${end}`);

    for (let i = displayedWishes; i < end; i++) {
      const wish = wishesData[i];

      // Create attendance class
      let attendanceClass = "";
      let attendanceText = "Belum Konfirmasi";

      if (wish.Attendance === "hadir") {
        attendanceClass = "hadir";
        attendanceText = "Hadir";
      } else if (wish.Attendance === "tidak hadir") {
        attendanceClass = "tidak-hadir";
        attendanceText = "Tidak Hadir";
      } else if (wish.Attendance === "ragu") {
        attendanceClass = "ragu";
        attendanceText = "Masih Ragu";
      }

      const wishItem = document.createElement("div");
      wishItem.className = "wish-item";
      wishItem.innerHTML = `
        <div class="wish-header">
          <div class="wish-name">${wish.Name}</div>
          <div class="wish-attendance ${attendanceClass}">${attendanceText}</div>
        </div>
        <div class="wish-message">${wish.Message}</div>
        <div class="wish-time">${formatDate(wish.Timestamp)}</div>
      `;

      wishesList.appendChild(wishItem);
    }

    displayedWishes = end;

    // Hide load more button if all wishes are displayed
    if (loadMoreWishes) {
      loadMoreWishes.style.display =
        displayedWishes >= wishesData.length ? "none" : "block";
    }
  }

  // Submit wish to Google Sheets
  if (wishesForm) {
    wishesForm.addEventListener("submit", function (e) {
      e.preventDefault();
      console.log("Wishes form submitted");

      const nameInput = document.getElementById("name");
      const messageInput = document.getElementById("message");
      const attendanceInput = document.getElementById("attendance");

      if (!nameInput || !messageInput || !attendanceInput) {
        console.error("Missing form inputs");
        return;
      }

      const name = nameInput.value;
      const message = messageInput.value;
      const attendance = attendanceInput.value;

      const submitBtn = wishesForm.querySelector(".submit-btn");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
      }

      const wishData = {
        name: name,
        message: message,
        attendance: attendance,
      };

      console.log("Sending wish data:", wishData);

      // Ubah kode fetch untuk menangani OPTIONS request secara lebih baik
      fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(wishData),
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors", // Penting
        redirect: "follow", // Ikuti redirect jika ada
        credentials: "omit", // Jangan kirim cookie
      })
        .then((response) => {
          console.log("POST response status:", response.status);
          if (!response.ok) {
            return response.text().then((text) => {
              console.error("Error response:", text);
              throw new Error(`HTTP error! Status: ${response.status}`);
            });
          }
          return response.text().then((text) => {
            console.log("Raw response text:", text);
            return JSON.parse(text);
          });
        })
        .then((data) => {
          console.log("POST data received:", data);
          if (data.result === "success") {
            // Add new wish to the top of the list
            const timestamp = new Date();
            const newWish = {
              Timestamp: timestamp,
              Name: name,
              Message: message,
              Attendance: attendance,
            };

            wishesData.unshift(newWish);

            // Update stats
            if (wishesCount)
              wishesCount.textContent =
                parseInt(wishesCount.textContent || "0") + 1;
            if (attendance === "hadir" && attendingCount) {
              attendingCount.textContent =
                parseInt(attendingCount.textContent || "0") + 1;
            }
            if (attendance === "tidak hadir" && notAttendingCount) {
              notAttendingCount.textContent =
                parseInt(notAttendingCount.textContent || "0") + 1;
            }

            // Clear the form
            wishesForm.reset();

            // Refresh the displayed wishes
            if (wishesList) {
              wishesList.innerHTML = "";
              displayedWishes = 0;
              displayWishes();
            }

            // Show success message
            alert("Ucapan berhasil terkirim. Terima kasih!");
          } else {
            alert("Gagal mengirim ucapan. Silakan coba lagi.");
          }
        })
        .catch((error) => {
          console.error("Error sending wish:", error);
          alert("Gagal mengirim ucapan. Silakan coba lagi.");
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML =
              '<i class="fas fa-paper-plane"></i> Kirim Ucapan';
          }
        });
    });
  }

  // Load more wishes button
  if (loadMoreWishes) {
    loadMoreWishes.addEventListener("click", displayWishes);
  }

  // Test connection to Google Apps Script
  console.log("Testing connection to Google Apps Script...");
  fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      console.log("Response status:", response.status);
      return response.text();
    })
    .then((text) => {
      console.log("Response text:", text);
      try {
        const json = JSON.parse(text);
        console.log("Parsed JSON:", json);
      } catch (e) {
        console.error("Failed to parse JSON:", e);
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
});

// HAPUS test connection di luar event listener karena GOOGLE_APPS_SCRIPT_URL tidak terdefinisi di sini
