function saveData() {
  const name = document.getElementById("name").value;
  const enroll = document.getElementById("enroll").value;
  const file = document.getElementById("photo").files[0];

  if (!name || !enroll || !file) {
    alert("Fill all fields");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    localStorage.setItem("name", name);
    localStorage.setItem("enroll", enroll);
    localStorage.setItem("photo", reader.result);
    window.location.href = "dashboard.html";
  };
  reader.readAsDataURL(file);
}

// Runs only on dashboard
if (window.location.pathname.includes("dashboard")) {
  document.getElementById("dname").innerText =
    localStorage.getItem("name");

  document.getElementById("denroll").innerText =
    localStorage.getItem("enroll");

  document.getElementById("img").src =
    localStorage.getItem("photo");
}

if (window.location.pathname.includes("dashboard")) {
  const name = localStorage.getItem("name");
  const enroll = localStorage.getItem("enroll");
  const photo = localStorage.getItem("photo");

  document.getElementById("dname").innerText = name;
  document.getElementById("dnameTop").innerText = name;
  document.getElementById("denroll").innerText = enroll;
  document.getElementById("img").src = photo;
  document.getElementById("imgTop").src = photo;
}


function openDrawer() {
  document.getElementById("drawer").classList.add("open");
  document.getElementById("overlay").style.display = "block";
}

function closeDrawer() {
  document.getElementById("drawer").classList.remove("open");
  document.getElementById("overlay").style.display = "none";
}

function openCafeteria() {
  closeDrawer();
  setTimeout(() => {
    window.location.href = "cafeteria.html";
  }, 200);
}

function goBack() {
  window.history.back();
}

// CAFETERIA PAGE DATA
if (window.location.pathname.includes("cafeteria")) {
  const name = localStorage.getItem("name");
  const photo = localStorage.getItem("photo");

  document.getElementById("dnameTop").innerText = name;
  document.getElementById("imgTop").src = photo;

  const today = new Date();
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  const dateStr = today.toLocaleDateString('en-GB', options);

  const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });

document.querySelectorAll('.dayPill').forEach(pill => {
  pill.textContent = day;
});


  document.getElementById("dateLine").innerText =
    `${dateStr} - Today - First Floor`;

  document.getElementById("dayPill").innerText = day;
}











// const now = new Date();
// const currentMinutes = now.getHours() * 60 + now.getMinutes();

// document.querySelectorAll('.meal-btn').forEach(btn => {
//   const meal = btn.dataset.meal;

//   let servedTime = null;

//   // Breakfast: after 9:00 AM
//   if (meal === 'breakfast' && currentMinutes >= (9 * 60)) {
//     servedTime = '8:20 AM';
//   }

//   // Lunch: after 1:00 PM
//   if (meal === 'lunch' && currentMinutes >= (13 * 60)) {
//     servedTime = '12:15 PM';
//   }

//   // Snacks: after 5:20 PM
//   if (meal === 'snacks' && currentMinutes >= (17 * 60 + 20)) {
//     servedTime = '5:03 PM';
//   }

//   // Dinner: after 8:40 PM
//   if (meal === 'dinner' && currentMinutes >= (20 * 60 + 40)) {
//     servedTime = '8:07 PM';
//   }

//   if (servedTime) {
//     btn.textContent = `Meal served on ${servedTime}`;
//     btn.classList.add('meal-served');
//     btn.disabled = true;
//   }
// });






document.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  document.querySelectorAll('.meal-btn').forEach(btn => {
    const meal = btn.dataset.meal;
    let servedTime = null;

    // Breakfast: after 9:00 AM
    if (meal === 'breakfast' && currentMinutes >= (9 * 60)) {
      servedTime = '8:20 AM';
    }

    // Lunch: after 1:00 PM
    if (meal === 'lunch' && currentMinutes >= (13 * 60)) {
      servedTime = '12:15 PM';
    }

    // Snacks: after 5:20 PM
    if (meal === 'snacks' && currentMinutes >= (17 * 60 + 20)) {
      servedTime = '5:03 PM';
    }

    // Dinner: after 8:40 PM
    if (meal === 'dinner' && currentMinutes >= (20 * 60 + 40)) {
      servedTime = '8:07 PM';
    }

    if (servedTime) {
      btn.textContent = `Meal served on ${servedTime}`;
      btn.classList.add('meal-served');
      btn.disabled = true;
    }
  });
});
