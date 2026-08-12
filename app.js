// ==========================================================================
// Bennett University Student Portal JS Code
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  
  // Default values matching user screenshots
  const DEFAULT_STUDENT = {
    name: "Azam Jamal",
    rollNo: "S24CSEU0366",
    admissionNo: "830",
    admissionYear: "2024-2025",
    dob: "2004-12-29",
    gender: "Male",
    fatherName: "Jamal Ahmad Khan",
    motherName: "Sufiya",
    address: "127/662, W-Block, Keshav Nagar, Kanpur, Uttar Pradesh, IN",
    photo: "" // Will hold base64 image data URL
  };

  // Sample default avatar image in case user skips/onboards empty
  const DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232b6cb0'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/></svg>";

  // Current session student profile
  let studentProfile = null;

  // DOM Elements
  const onboardingScreen = document.getElementById('onboarding-screen');
  const onboardingForm = document.getElementById('onboarding-form');
  const portalScreen = document.getElementById('portal-screen');
  const photoInput = document.getElementById('student-photo-input');
  const photoDropzone = document.getElementById('photo-dropzone');
  const photoPreviewBox = document.getElementById('photo-preview-box');

  // Header and Navigation Buttons
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const menuCloseBtn = document.getElementById('menu-close-btn');
  const sidebarDrawer = document.getElementById('sidebar-drawer');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const profileViewBtn = document.getElementById('profile-view-btn');
  const logoutBtn = document.getElementById('logout-btn');

  // Bottom Navigation buttons
  const navAppsBtn = document.getElementById('nav-apps-btn');
  const navAccessibilityBtn = document.getElementById('nav-accessibility-btn');
  const navSettingsBtn = document.getElementById('nav-settings-btn');
  const bottomNavButtons = [navAppsBtn, navAccessibilityBtn, navSettingsBtn];

  // Search
  const menuSearchInput = document.getElementById('menu-search-input');
  const sidebarItemsContainer = document.getElementById('sidebar-items-container');

  // Dynamic Views
  const scrollableContent = document.getElementById('scrollable-content');
  const homeView = document.getElementById('home-view');
  const appsView = document.getElementById('apps-view');
  const accessibilityView = document.getElementById('accessibility-view');
  const settingsView = document.getElementById('settings-view');
  const cafeteriaView = document.getElementById('cafeteria-view');
  const allSubViews = [homeView, appsView, accessibilityView, settingsView, cafeteriaView];

  // Profile strip toggle (More Info / Manage Accounts)
  const stripButtons = document.querySelectorAll('.strip-btn');

  // Settings elements
  const settingsForm = document.getElementById('settings-form');
  const settingsPhotoInput = document.getElementById('settings-photo-input');
  const settingsPhotoPreviewBox = document.getElementById('settings-photo-preview-box');

  // Accessibility controllers
  const toggleContrast = document.getElementById('toggle-contrast');
  const toggleVisualAids = document.getElementById('toggle-visual-aids');
  const btnScaleNormal = document.getElementById('btn-scale-normal');
  const btnScaleLarge = document.getElementById('btn-scale-large');
  const btnScaleXL = document.getElementById('btn-scale-xl');

  // Initialize Application State
  function init() {
    const savedData = localStorage.getItem('student_profile');
    if (savedData) {
      try {
        studentProfile = JSON.parse(savedData);
        showPortal();
      } catch (e) {
        console.error("Failed to parse student data, launching onboarding.", e);
        showOnboarding();
      }
    } else {
      showOnboarding();
    }
  }

  // Toggle Screen Displays
  function showOnboarding() {
    onboardingScreen.classList.add('active');
    portalScreen.classList.remove('active');
    
    document.getElementById('student-name').value = DEFAULT_STUDENT.name;
    document.getElementById('student-roll').value = DEFAULT_STUDENT.rollNo;
    
    // Clear preview
    photoPreviewBox.innerHTML = `
      <svg viewBox="0 0 24 24" width="32" height="32" class="upload-icon">
        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
      </svg>
      <span>Tap to upload photo</span>
    `;
    photoInput.value = "";
  }

  function showPortal() {
    onboardingScreen.classList.remove('active');
    portalScreen.classList.add('active');
    
    renderStudentProfile();
    // Start at main Home Profile view
    switchSubView(homeView);
    setActiveNavButton(null);
    profileViewBtn.classList.add('active');
  }

  // Render profile data dynamically onto the document fields
  function renderStudentProfile() {
    const p = studentProfile || DEFAULT_STUDENT;
    
    // Split name into first & last for details view
    const nameParts = p.name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    
    // Calculate Age
    let ageText = "—";
    if (p.dob) {
      const birthDate = new Date(p.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      ageText = isNaN(age) ? "—" : age.toString();
    }

    // Set textual fields
    document.querySelectorAll('.student-name-text').forEach(el => el.textContent = p.name);
    document.querySelectorAll('.student-roll-text').forEach(el => el.textContent = p.rollNo);
    document.querySelectorAll('.student-semester-text').forEach(el => {
      el.textContent = "Semester - 5 | 2026-2027"; // Preserving semester timeline
    });

    document.getElementById('val-admission-no').textContent = p.admissionNo;
    document.getElementById('val-first-name').textContent = firstName;
    document.getElementById('val-last-name').textContent = lastName;
    document.getElementById('val-father').textContent = p.fatherName;
    document.getElementById('val-mother').textContent = p.motherName;
    document.getElementById('val-address').textContent = p.address;

    // DOB Formatting to DD-MM-YYYY as in screenshot (29-12-2004)
    if (p.dob) {
      const dateObj = new Date(p.dob);
      if (!isNaN(dateObj.getTime())) {
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        document.getElementById('val-dob').textContent = `${day}-${month}-${year}`;
      } else {
        document.getElementById('val-dob').textContent = p.dob;
      }
    } else {
      document.getElementById('val-dob').textContent = "—";
    }
    
    document.getElementById('val-age').textContent = ageText;

    // Apply Profile Photos
    const avatarUrl = p.photo || DEFAULT_AVATAR;
    document.querySelectorAll('.student-avatar-img').forEach(img => {
      img.src = avatarUrl;
    });

    // Populate values in the Settings View form fields
    document.getElementById('settings-name').value = p.name;
    document.getElementById('settings-roll').value = p.rollNo;
  }

  // View routing switcher
  function switchSubView(targetView) {
    allSubViews.forEach(view => {
      view.classList.remove('active');
    });
    targetView.classList.add('active');
    // Scroll back to top on transition
    scrollableContent.scrollTop = 0;
  }

  function setActiveNavButton(activeBtn) {
    bottomNavButtons.forEach(btn => {
      btn.classList.remove('active');
    });
    profileViewBtn.classList.remove('active');
    
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
  }

  // ==========================================================================
  // Onboarding Interaction (Dropzone & Validation)
  // ==========================================================================
  
  // Click dropzone triggers file dialog
  photoDropzone.addEventListener('click', () => {
    photoInput.click();
  });

  // Handle file selection
  photoInput.addEventListener('change', (e) => {
    handlePhotoFile(e.target.files[0], photoPreviewBox);
  });

  // Drag and Drop functionality
  photoDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    photoDropzone.style.backgroundColor = '#e0f2fe';
  });

  photoDropzone.addEventListener('dragleave', () => {
    photoDropzone.style.backgroundColor = '#f8fafc';
  });

  photoDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    photoDropzone.style.backgroundColor = '#f8fafc';
    if (e.dataTransfer.files.length > 0) {
      photoInput.files = e.dataTransfer.files;
      handlePhotoFile(e.dataTransfer.files[0], photoPreviewBox);
    }
  });

  function handlePhotoFile(file, previewContainer) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      previewContainer.innerHTML = `<img src="${e.target.result}" class="preview-thumbnail" alt="Selected Preview">`;
      // Cache photo URL on state temporarily
      if (studentProfile) {
        studentProfile.photo = e.target.result;
      } else {
        DEFAULT_STUDENT.photo = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }

  // Submit Onboarding Form
  onboardingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('student-name').value.trim();
    const rollNo = document.getElementById('student-roll').value.trim();

    if (!name || !rollNo) {
      alert("Name and Enrollment Number are mandatory.");
      return;
    }

    // Save profile object using screenshot static defaults for other parameters
    studentProfile = {
      name,
      rollNo,
      admissionNo: DEFAULT_STUDENT.admissionNo,
      admissionYear: DEFAULT_STUDENT.admissionYear,
      dob: DEFAULT_STUDENT.dob,
      gender: DEFAULT_STUDENT.gender,
      fatherName: DEFAULT_STUDENT.fatherName,
      motherName: DEFAULT_STUDENT.motherName,
      address: DEFAULT_STUDENT.address,
      photo: (studentProfile && studentProfile.photo) || DEFAULT_STUDENT.photo || DEFAULT_AVATAR
    };

    localStorage.setItem('student_profile', JSON.stringify(studentProfile));
    showPortal();
  });

  // ==========================================================================
  // Header Navigation & Logout
  // ==========================================================================
  
  // Header Profile click transitions back to Profile dashboard and handles scroll toggling
  profileViewBtn.addEventListener('click', () => {
    setActiveNavButton(profileViewBtn);
    if (!homeView.classList.contains('active')) {
      switchSubView(homeView);
      scrollableContent.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const personalCard = document.getElementById('personal-details-card');
      if (personalCard) {
        if (scrollableContent.scrollTop > 200) {
          scrollableContent.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          personalCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  });

  // Reset Application / Logout
  logoutBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to exit and reset portal configuration?")) {
      localStorage.removeItem('student_profile');
      studentProfile = null;
      showOnboarding();
    }
  });

  // ==========================================================================
  // Hamburger Sidebar Drawer Actions
  // ==========================================================================
  
  function openMenu() {
    sidebarDrawer.classList.add('open');
    sidebarBackdrop.classList.add('active');
  }

  function closeMenu() {
    sidebarDrawer.classList.remove('open');
    sidebarBackdrop.classList.remove('active');
  }

  menuToggleBtn.addEventListener('click', openMenu);
  menuCloseBtn.addEventListener('click', closeMenu);
  sidebarBackdrop.addEventListener('click', closeMenu);

  // Search logic in sidebar
  menuSearchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const navItems = sidebarItemsContainer.querySelectorAll('.sidebar-nav-item');
    
    navItems.forEach(item => {
      const text = item.querySelector('span').textContent.toLowerCase();
      if (text.includes(query)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  });

  // Click on drawer navigation items
  sidebarItemsContainer.addEventListener('click', (e) => {
    const navItem = e.target.closest('.sidebar-nav-item');
    if (!navItem) return;
    
    e.preventDefault();
    const action = navItem.getAttribute('data-action');
    closeMenu();

    if (action === 'institution') {
      switchSubView(homeView);
      setActiveNavButton(profileViewBtn);
    } else if (action === 'enrollment') {
      switchSubView(homeView);
      setActiveNavButton(profileViewBtn);
      setTimeout(() => {
        const personalCard = document.getElementById('personal-details-card');
        if (personalCard) {
          personalCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else if (action === 'attendance') {
      switchSubView(appsView);
      setActiveNavButton(navAppsBtn);
      // Highlight attendance widget
      const widget = document.querySelector('.attendance-widget');
      widget.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'cafeteria') {
      switchSubView(cafeteriaView);
      setActiveNavButton(null);
    } else {
      // General handler: switches to Apps View as a generic page landing
      switchSubView(appsView);
      setActiveNavButton(navAppsBtn);
    }
  });

  // ==========================================================================
  // Bottom Tab Navigation Actions
  // ==========================================================================
  navAppsBtn.addEventListener('click', () => {
    setActiveNavButton(navAppsBtn);
    switchSubView(appsView);
  });

  navAccessibilityBtn.addEventListener('click', () => {
    setActiveNavButton(navAccessibilityBtn);
    switchSubView(accessibilityView);
  });

  navSettingsBtn.addEventListener('click', () => {
    setActiveNavButton(navSettingsBtn);
    switchSubView(settingsView);
  });

  // Profilestrip sub-button triggers in details-view
  stripButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      stripButtons.forEach(b => b.classList.remove('active-btn'));
      btn.classList.add('active-btn');
    });
  });

  // ==========================================================================
  // Settings Change Action
  // ==========================================================================
  
  settingsPhotoPreviewBox.addEventListener('click', () => {
    settingsPhotoInput.click();
  });

  settingsPhotoInput.addEventListener('change', (e) => {
    handlePhotoFile(e.target.files[0], settingsPhotoPreviewBox);
  });

  settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('settings-name').value.trim();
    const rollNo = document.getElementById('settings-roll').value.trim();

    if (!name || !rollNo) {
      alert("Required fields cannot be empty.");
      return;
    }

    studentProfile.name = name;
    studentProfile.rollNo = rollNo;
    // Note: Photo is already synced when read inside handlePhotoFile

    localStorage.setItem('student_profile', JSON.stringify(studentProfile));
    renderStudentProfile();
    
    alert("Settings saved successfully!");
    
    // Redirect back to profile page
    switchSubView(homeView);
    setActiveNavButton(profileViewBtn);
  });

  // ==========================================================================
  // Accessibility Toggles Actions
  // ==========================================================================
  
  // Contrast Mode Toggle
  toggleContrast.addEventListener('change', (e) => {
    if (e.target.checked) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  });

  // Highlight Box Toggle
  toggleVisualAids.addEventListener('change', (e) => {
    if (e.target.checked) {
      document.body.classList.add('visual-aids');
    } else {
      document.body.classList.remove('visual-aids');
    }
  });

  // Text Scaling Buttons
  btnScaleNormal.addEventListener('click', () => {
    resetScaleButtons();
    btnScaleNormal.classList.add('active');
    document.body.classList.remove('accessibility-large', 'accessibility-xl');
  });

  btnScaleLarge.addEventListener('click', () => {
    resetScaleButtons();
    btnScaleLarge.classList.add('active');
    document.body.classList.remove('accessibility-xl');
    document.body.classList.add('accessibility-large');
  });

  btnScaleXL.addEventListener('click', () => {
    resetScaleButtons();
    btnScaleXL.classList.add('active');
    document.body.classList.remove('accessibility-large');
    document.body.classList.add('accessibility-xl');
  });

  function resetScaleButtons() {
    btnScaleNormal.classList.remove('active');
    btnScaleLarge.classList.remove('active');
    btnScaleXL.classList.remove('active');
  }

  // ==========================================================================
  // Cafeteria View Controllers
  // ==========================================================================
  
  // Click cafeteria widget in apps view redirects to cafeteria sub-page
  const appsCafeteriaWidget = document.getElementById('apps-cafeteria-widget');
  if (appsCafeteriaWidget) {
    appsCafeteriaWidget.addEventListener('click', () => {
      setActiveNavButton(null);
      switchSubView(cafeteriaView);
    });
  }

  // Update cafeteria date and days dynamically
  const cafeteriaDateDisplay = document.getElementById('cafeteria-date-display');
  const todayDate = new Date();
  
  if (cafeteriaDateDisplay) {
    const day = String(todayDate.getDate()).padStart(2, '0');
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[todayDate.getMonth()];
    const year = todayDate.getFullYear();
    cafeteriaDateDisplay.textContent = `${day}-${month}-${year}-Today-First Floor`;
  }

  // Set the current day name and abbreviation dynamically
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayName = daysOfWeek[todayDate.getDay()];
  const currentDayAbbrev = currentDayName.slice(0, 3); // e.g. "Wed", "Thu"

  // Update all day badges to current day
  document.querySelectorAll('.meal-day-badge').forEach(badge => {
    badge.textContent = currentDayName;
  });

  // Update menu text headers to match current day (e.g. Lunch(Wed) -> Lunch(Thu))
  document.querySelectorAll('.meal-menu-items p').forEach(p => {
    p.innerHTML = p.innerHTML.replace(/\((Wed|Sun|Mon|Tue|Thu|Fri|Sat)\)/gi, `(${currentDayAbbrev})`);
  });

  // Meal QR Modal references
  const mealQrModal = document.getElementById('meal-qr-modal');
  const closeMealModal = document.getElementById('close-meal-modal');

  // Dynamic automatic serving check based on current time
  function updateMealButtonsStatus() {
    const today = new Date();
    const currentMinutes = today.getHours() * 60 + today.getMinutes();

    const meals = [
      {
        key: 'breakfast',
        limit: 8 * 60 + 20, // 8:20 AM
        servedText: 'Meal Served On 8:24 AM'
      },
      {
        key: 'lunch',
        limit: 12 * 60 + 45, // 12:45 PM
        servedText: 'Meal Served On 12:53 PM'
      },
      {
        key: 'snack',
        limit: 17 * 60 + 15, // 5:15 PM
        servedText: 'Meal Served On 5:20 PM'
      },
      {
        key: 'dinner',
        limit: 21 * 60 + 12, // 9:12 PM
        servedText: 'Meal Served On 9:14 PM'
      }
    ];

    meals.forEach(meal => {
      const btn = document.querySelector(`.meal-status-btn[data-meal="${meal.key}"]`);
      if (btn) {
        if (currentMinutes >= meal.limit) {
          btn.classList.add('served');
          btn.textContent = meal.servedText;
          btn.setAttribute('data-locked', 'true');
          btn.style.cursor = 'default';
        } else {
          btn.classList.remove('served');
          btn.textContent = 'Select';
          btn.removeAttribute('data-locked');
          btn.style.cursor = 'pointer';
        }
      }
    });
  }

  // Run the check on load/init
  updateMealButtonsStatus();
  // Keep check fresh every 30 seconds
  setInterval(updateMealButtonsStatus, 30000);

  // Meal selection status click handler (opens the QR Token modal if not served/locked)
  document.querySelectorAll('.meal-status-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Locked buttons cannot be pressed to show QR code
      if (btn.getAttribute('data-locked') === 'true') {
        return;
      }

      // Dynamic scraping to populate the Meal QR Modal
      const mealCard = btn.closest('.meal-section-card');
      const titleTime = mealCard.querySelector('.meal-title-time').textContent;
      
      // Scrap paragraph list inside items
      const paragraphs = mealCard.querySelectorAll('.meal-menu-items p');
      let itemsArray = [];
      paragraphs.forEach(p => {
        const text = p.textContent.trim();
        if (text) itemsArray.push(text);
      });
      const menuText = itemsArray.join(' ');
      const dayName = mealCard.querySelector('.meal-day-badge').textContent;

      // Populate Modal Fields
      document.getElementById('meal-modal-title').textContent = titleTime;
      document.getElementById('meal-modal-menu-items').textContent = menuText;
      document.getElementById('meal-modal-day').textContent = dayName;

      // Open Modal
      if (mealQrModal) {
        mealQrModal.classList.add('show');
      }
    });
  });

  if (closeMealModal && mealQrModal) {
    closeMealModal.addEventListener('click', () => {
      mealQrModal.classList.remove('show');
    });
  }

  // QR Code Modal popup controls
  const qrModal = document.getElementById('qr-modal');
  const btnShowQr = document.getElementById('btn-show-qr');
  const btnRegenQr = document.getElementById('btn-regen-qr');
  const closeQrModal = document.getElementById('close-qr-modal');
  const btnDownloadQr = document.getElementById('btn-download-qr');

  if (btnShowQr && qrModal) {
    btnShowQr.addEventListener('click', () => qrModal.classList.add('show'));
  }
  if (btnRegenQr && qrModal) {
    btnRegenQr.addEventListener('click', () => {
      alert("Regenerating a new permanent reusable QR code...");
      qrModal.classList.add('show');
    });
  }
  if (closeQrModal && qrModal) {
    closeQrModal.addEventListener('click', () => qrModal.classList.remove('show'));
  }
  if (btnDownloadQr && qrModal) {
    btnDownloadQr.addEventListener('click', () => {
      alert("Downloading permanent QR code...");
      qrModal.classList.remove('show');
    });
  }
  // Close modals on click outside
  window.addEventListener('click', (e) => {
    if (e.target === qrModal) {
      qrModal.classList.remove('show');
    }
    if (e.target === mealQrModal) {
      mealQrModal.classList.remove('show');
    }
  });

  // Run initializer
  init();

});
