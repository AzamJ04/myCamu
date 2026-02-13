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

  // document.getElementById("dayPill").innerText = day;
}

window.addEventListener("load", function () {

  const mealButtons = document.querySelectorAll(".cafeteria-btn");

  const servingTimes = {
    breakfast: "8:12 AM",
    lunch: "12:21 PM",
    snacks: "5:10 PM",
    dinner: "8:15 PM"
  };

  mealButtons.forEach(button => {
    button.addEventListener("click", function () {

      const mealType = this.dataset.meal;

      // ✅ toggle OFF if already selected
      if (this.classList.contains("active-meal")) {
        this.classList.remove("active-meal");
        this.style.backgroundColor = "";
        this.style.color = "black";
        this.innerText = "Select";
        return;
      }

      // ✅ activate button
      this.classList.add("active-meal");
      this.style.backgroundColor = "green";
      this.style.color = "white";
      this.innerText = `Meal served at ${servingTimes[mealType]}`;

    });
  });

});
