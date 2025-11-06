document.addEventListener("DOMContentLoaded", function () {
  // Target date/time (Malaysia time = UTC+08:00)
  const target = new Date("2026-03-07T19:00:00+08:00");

  // DOM refs
  const elDays = document.getElementById("days");
  const elHours = document.getElementById("hours");
  const elMinutes = document.getElementById("minutes");
  const elSeconds = document.getElementById("seconds");
  const celebrateEl = document.getElementById("celebrate");
  const unitEls = {
    days: document.querySelector('.unit[data-unit="days"]'),
    hours: document.querySelector('.unit[data-unit="hours"]'),
    minutes: document.querySelector('.unit[data-unit="minutes"]'),
    seconds: document.querySelector('.unit[data-unit="seconds"]'),
  };

  // keep previous values so we can animate when they change
  let prev = { d: null, h: null, m: null, s: null };
  let timer = null;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function getRemaining(ms) {
    if (ms <= 0) return { d: 0, h: 0, m: 0, s: 0, done: true };
    let s = Math.floor(ms / 1000);
    const d = Math.floor(s / 86400);
    s -= d * 86400;
    const h = Math.floor(s / 3600);
    s -= h * 3600;
    const m = Math.floor(s / 60);
    const sec = s - m * 60;
    return { d, h, m, s: sec, done: false };
  }

  function update() {
    const now = new Date();
    const rem = target - now;
    const r = getRemaining(rem);
    if (r.done) {
      // reached zero
      document.getElementById("countdown").style.display = "none";
      celebrateEl.style.display = "block";
      spawnBurst(18);
      clearInterval(timer);
      return;
    }
    // update values + animate changed units
    if (prev.d !== r.d) {
      elDays.textContent = r.d;
      flashUnit("days");
      prev.d = r.d;
    }
    if (prev.h !== r.h) {
      elHours.textContent = pad(r.h);
      flashUnit("hours");
      prev.h = r.h;
    }
    if (prev.m !== r.m) {
      elMinutes.textContent = pad(r.m);
      flashUnit("minutes");
      prev.m = r.m;
    }
    if (prev.s !== r.s) {
      elSeconds.textContent = pad(r.s);
      flashUnit("seconds");
      spawnFloatingHeart(); // small heart each second tick
      prev.s = r.s;
    }
  }

  function flashUnit(name) {
    const el = unitEls[name];
    if (!el) return;
    el.classList.remove("changed");
    // force reflow to restart animation
    void el.offsetWidth;
    el.classList.add("changed");
    setTimeout(() => el.classList.remove("changed"), 700);
  }

  // floating hearts generator (small)
  const heartWrap = document.getElementById("heartWrap");
  function spawnFloatingHeart() {
    const h = document.createElement("div");
    h.className = "floating-heart";
    h.textContent = "❤";
    const size = Math.random() * 12 + 10;
    h.style.fontSize = size + "px";
    const left = Math.random() * 80 + 10;
    h.style.left = left + "%";
    const duration = Math.random() * 2 + 2.2;
    h.style.animationDuration = duration + "s";
    heartWrap.appendChild(h);
    setTimeout(() => {
      h.remove();
    }, duration * 1000 + 200);
  }

  // celebration burst hearts
  function spawnBurst(count) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const b = document.createElement("div");
        b.className = "floating-heart";
        b.textContent = "❤";
        const size = Math.random() * 18 + 14;
        b.style.fontSize = size + "px";
        b.style.left = 40 + (Math.random() * 30 - 15) + "%";
        const dur = Math.random() * 1.2 + 1.6;
        b.style.animationDuration = dur + "s";
        b.style.transform = `translateY(0) rotate(${
          Math.random() * 60 - 30
        }deg)`;
        heartWrap.appendChild(b);
        setTimeout(() => b.remove(), dur * 1000 + 200);
      }, i * 60);
    }
  }

  // initial update & start interval
  update();
  timer = setInterval(update, 1000);

  // Nice tiny flourish every 10 seconds: gentle background pulse
  setInterval(() => {
    heartWrap.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.02)" },
        { transform: "scale(1)" },
      ],
      { duration: 1200 }
    );
  }, 10000);
});
