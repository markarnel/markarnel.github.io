// LEAD52 landing: motion + interactions. Vanilla JS, no build step.
window.L52_READY = true; // tells the head fallback the entrance animations will run
const $ =(s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
const easeOut = (x) => 1 - (1 - x) ** 3;

/* ---------- particle field (bokeh in three depth layers) ---------- */
(() => {
  const cv = $("#field");
  const ctx = cv.getContext("2d");
  let w = 0, h = 0, dpr = 1, dots = [], mx = 0, my = 0, run = true;
  const resize = () => {
    dpr = Math.min(2, devicePixelRatio || 1);
    w = innerWidth; h = innerHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(70, (w * h) / 22000));
    dots = Array.from({ length: n }, (_, i) => {
      const z = i % 3; // 0 far … 2 near
      return {
        x: Math.random() * w, y: Math.random() * h, z,
        r: [1.2, 2.4, 5][z] * (0.6 + Math.random() * 0.8),
        vx: (Math.random() - 0.5) * [0.08, 0.16, 0.3][z], vy: -[0.05, 0.1, 0.2][z] * (0.5 + Math.random()),
        a: [0.35, 0.3, 0.16][z], tw: Math.random() * 6.28, white: i % 6 === 0,
      };
    });
  };
  const draw = (t) => {
    ctx.clearRect(0, 0, w, h);
    const sy = scrollY;
    for (const d of dots) {
      d.x += d.vx; d.y += d.vy;
      if (d.y < -20) d.y = h + 20;
      if (d.x < -20) d.x = w + 20; else if (d.x > w + 20) d.x = -20;
      const k = (d.z + 1) * 6;
      const x = d.x + mx * k;
      const y = ((d.y - sy * (d.z + 1) * 0.08) % (h + 40) + h + 40) % (h + 40) - 20 + my * k;
      const a = d.a * (0.6 + 0.4 * Math.sin(t / 900 + d.tw));
      ctx.beginPath();
      ctx.fillStyle = d.white ? `rgba(255,255,255,${a})` : `rgba(0,186,188,${a})`;
      ctx.shadowColor = "rgba(0,186,188,0.8)";
      ctx.shadowBlur = d.z === 2 ? 14 : 4;
      ctx.arc(x, y, d.r, 0, 6.283);
      ctx.fill();
    }
  };
  const loop = (t) => {
    if (run) draw(t);
    if (!reduced) requestAnimationFrame(loop);
  };
  addEventListener("resize", resize);
  addEventListener("pointermove", (e) => {
    mx = e.clientX / w - 0.5; my = e.clientY / h - 0.5;
  }, { passive: true });
  document.addEventListener("visibilitychange", () => (run = !document.hidden));
  resize();
  reduced ? draw(0) : requestAnimationFrame(loop);
})();

/* ---------- cursor glow ---------- */
if (finePointer && !reduced) {
  const g = $(".cursor-glow");
  addEventListener("pointermove", (e) => {
    g.style.setProperty("--mx", e.clientX + "px");
    g.style.setProperty("--my", e.clientY + "px");
  }, { passive: true });
}

/* ---------- nav ---------- */
const nav = $("#nav");
const onScroll = () => nav.classList.toggle("scrolled", scrollY > 12);
addEventListener("scroll", onScroll, { passive: true });
onScroll();
const menuBtn = $("#menu-btn");
const links = $("#nav-links");
const setMenu = (open) => {
  links.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
};
menuBtn.addEventListener("click", () => setMenu(!links.classList.contains("open")));
$$("a", links).forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

/* ---------- kinetic headline ---------- */
const kin = $(".kinetic");
$$(".w", kin).forEach((w, i) => (w.style.transitionDelay = `${0.15 + i * 0.08}s`));
requestAnimationFrame(() => requestAnimationFrame(() => kin.classList.add("in")));

/* ---------- counters ---------- */
const count = (el) => {
  const to = Number(el.dataset.count);
  if (reduced || to === 0) return void (el.textContent = String(to));
  const t0 = performance.now();
  const step = (t) => {
    const p = Math.min(1, (t - t0) / 1400);
    el.textContent = String(Math.round(to * easeOut(p)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

/* ---------- reveal on scroll (staggered within each parent) ---------- */
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target;
      const sibs = $$(":scope > .reveal", el.parentElement);
      el.style.setProperty("--d", `${Math.max(0, sibs.indexOf(el)) * 0.07}s`);
      el.classList.add("in");
      $$("[data-count]", el).forEach(count);
      io.unobserve(el);
    }
  },
  { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
);
$$(".reveal").forEach((el) => io.observe(el));

/* ---------- 3D tilt + spotlight ---------- */
if (finePointer && !reduced) {
  $$("[data-tilt]").forEach((el) => {
    const target = el.classList.contains("hero-media") ? $(".globe", el) : el;
    const max = el.classList.contains("hero-media") ? 10 : 8;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      target.style.setProperty("--ry", `${(x - 0.5) * max}deg`);
      target.style.setProperty("--rx", `${(0.5 - y) * max}deg`);
      el.style.setProperty("--gx", `${x * 100}%`);
      el.style.setProperty("--gy", `${y * 100}%`);
    });
    el.addEventListener("pointerleave", () => {
      target.style.setProperty("--ry", "0deg");
      target.style.setProperty("--rx", "0deg");
    });
  });

  /* magnetic buttons */
  $$(".magnetic").forEach((b) => {
    b.addEventListener("pointermove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.setProperty("--bx", `${(e.clientX - r.left - r.width / 2) * 0.18}px`);
      b.style.setProperty("--by", `${(e.clientY - r.top - r.height / 2) * 0.3}px`);
    });
    b.addEventListener("pointerleave", () => {
      b.style.setProperty("--bx", "0px");
      b.style.setProperty("--by", "0px");
    });
  });
}

/* ---------- how-it-works progress line (scroll-linked) ---------- */
const steps = $(".steps");
const stepLine = () => {
  const r = steps.getBoundingClientRect();
  const p = Math.min(1, Math.max(0, (innerHeight * 0.75 - r.top) / (r.height + innerHeight * 0.3)));
  steps.style.setProperty("--p", p.toFixed(3));
};
addEventListener("scroll", stepLine, { passive: true });
stepLine();

/* ---------- hero globe: the promo video's globe (Join.tsx), animated live ---------- */
(() => {
  const NS = "http://www.w3.org/2000/svg";
  const R = 235, RX = R * 1.32, RY = R * 0.36;
  const back = $("#g-back"), front = $("#g-front"), pingG = $("#g-pings");
  const ring1 = $("#g-ring1"), ring2 = $("#g-ring2");
  const mers = $$(".g-mer");
  const mk = (parent, attrs) => {
    const el = document.createElementNS(NS, "circle");
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    parent.append(el);
    return el;
  };
  // Every 13th leader is a teal "lead" dot that sends out ping rings.
  const dots = Array.from({ length: 52 }, (_, j) => {
    const lead = j % 13 === 0;
    return { j, lead, el: mk(back, { fill: lead ? "#00babc" : "#fff", style: lead ? "filter: drop-shadow(0 0 6px #00babc)" : "" }) };
  });
  const pings = [0, 13, 26, 39].map(() => mk(pingG, { r: 0, opacity: 0 }));
  let visible = true;
  const draw = (t) => {
    ring1.setAttribute("transform", `rotate(${t * 8})`);
    ring2.setAttribute("transform", `rotate(${-t * 14})`);
    mers.forEach((m, j) => m.setAttribute("rx", Math.max(1, Math.abs(Math.cos(((t * 22 + j * 60) * Math.PI) / 180)) * R).toFixed(1)));
    for (const d of dots) {
      const an = (d.j / 52) * Math.PI * 2 - Math.PI / 2 + t * 0.16;
      const z = Math.sin(an);
      d.x = Math.cos(an) * RX;
      d.y = z * RY;
      d.z = z;
      const depth = 0.55 + 0.45 * (z + 1) / 2;
      const parent = z > 0 ? front : back;
      if (d.el.parentNode !== parent) parent.append(d.el);
      d.el.setAttribute("cx", d.x.toFixed(1));
      d.el.setAttribute("cy", d.y.toFixed(1));
      d.el.setAttribute("r", ((d.lead ? 9 : 5) * depth).toFixed(2));
      d.el.setAttribute("fill-opacity", (d.lead ? 1 : 0.65) * (z > 0 ? 1 : 0.4));
    }
    [0, 13, 26, 39].forEach((j, k) => {
      const local = (t - k * 0.65 + 100) % 2.6;
      const d = dots[j];
      const p = local / 1.2;
      const show = local <= 1.2 && d.z >= -0.2;
      pings[k].setAttribute("opacity", show ? ((1 - p) * 0.9).toFixed(2) : 0);
      if (show) {
        pings[k].setAttribute("cx", d.x.toFixed(1));
        pings[k].setAttribute("cy", d.y.toFixed(1));
        pings[k].setAttribute("r", (8 + p * 42).toFixed(1));
      }
    });
  };
  const loop = (ms) => {
    if (visible && !document.hidden) draw(ms / 1000);
    requestAnimationFrame(loop);
  };
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe($(".globe"));
  draw(0);
  if (!reduced) requestAnimationFrame(loop);
})();

/* ---------- your year: 52-dot orbit ring around the logo ---------- */
const ring = $("#orbit-ring");
ring.append(...Array.from({ length: 52 }, () => document.createElement("i")));
const cells = $$("i", ring);
const placeRing = (t) => {
  const S = ring.clientWidth;
  const spin = reduced ? 0 : t / 14000;
  cells.forEach((c, i) => {
    const a = (i / 52) * Math.PI * 2 - Math.PI / 2 + spin;
    const depth = Math.sin(a); // +1 = front (lower half of the ellipse)
    const k = 0.7 + 0.45 * (depth + 1) / 2;
    c.style.transform = `translate(${S / 2 + Math.cos(a) * S * 0.46}px, ${S / 2 + depth * S * 0.147}px) scale(${k})`;
    c.style.zIndex = depth > 0 ? 3 : 1;
    c.style.opacity = String(0.45 + 0.55 * (depth + 1) / 2);
  });
};
let ringOn = false;
new IntersectionObserver(([e]) => (ringOn = e.isIntersecting)).observe(ring);
const ringLoop = (t) => {
  if (ringOn) placeRing(t);
  if (!reduced) requestAnimationFrame(ringLoop);
};
placeRing(0);
requestAnimationFrame(ringLoop);
const range = $("#week");
const setWeek = (wk) => {
  cells.forEach((c, i) => {
    c.classList.toggle("on", i < wk);
    c.classList.toggle("cur", i === wk - 1);
  });
  $("#orbit-week").textContent = wk;
  $("#week-out").textContent = wk;
  $("#ys-lessons").textContent = wk;
  $("#ys-min").textContent = `<${wk * 5}`;
  $("#ys-pct").textContent = `${Math.round((wk / 52) * 100)}%`;
};
range.addEventListener("input", () => setWeek(Number(range.value)));
setWeek(1);
// Fill the year once when it scrolls into view, then hand control to the slider.
new IntersectionObserver(
  ([e], obs) => {
    if (!e.isIntersecting) return;
    obs.disconnect();
    const to = 12;
    if (reduced) return setWeek(to);
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / 1600);
      const wk = Math.max(1, Math.round(to * easeOut(p)));
      range.value = wk;
      setWeek(wk);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },
  { threshold: 0.4 },
).observe(ring);

/* ---------- tour player ---------- */
const tour = $("#tour");
const player = $("#player");
$("#play").addEventListener("click", () => {
  tour.controls = true;
  tour.play();
});
tour.addEventListener("play", () => player.classList.add("playing"));
tour.addEventListener("ended", () => {
  player.classList.remove("playing");
  tour.controls = false;
});
tour.addEventListener("timeupdate", () => {
  $("#tour-bar").style.width = `${(tour.currentTime / (tour.duration || 1)) * 100}%`;
});


/* ---------- sign-up ---------- */
const burst = (btn) => {
  if (reduced) return;
  const r = btn.getBoundingClientRect();
  for (let i = 0; i < 26; i++) {
    const p = document.createElement("i");
    p.className = "burst";
    p.style.left = `${r.left + r.width / 2}px`;
    p.style.top = `${r.top + r.height / 2}px`;
    p.style.background = i % 4 ? "#00babc" : "#fff";
    document.body.append(p);
    const a = Math.random() * Math.PI * 2;
    const d = 60 + Math.random() * 120;
    p.animate(
      [
        { transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
        { transform: `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d + 40}px) rotate(${a * 3}rad) scale(.4)`, opacity: 0 },
      ],
      { duration: 900 + Math.random() * 400, easing: "cubic-bezier(.2,.8,.2,1)" },
    ).onfinish = () => p.remove();
  }
};

$$(".signup").forEach((form) => {
  const msg = $(".form-msg", form);
  const btn = $("button", form);
  const label = $("span", btn);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    $$("input", form).forEach((i) => i.removeAttribute("aria-invalid"));
    msg.className = "form-msg";
    const fail = (text, field) => {
      msg.textContent = text;
      msg.classList.add("err");
      if (field) {
        const input = $(`[name="${field}"]`, form);
        input.setAttribute("aria-invalid", "true");
        input.focus();
      }
    };
    if (!data.name.trim()) return fail("Please add your first name.", "name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) return fail("That email doesn't look right.", "email");

    // Opened as a local file there is no API to send to.
    if (location.protocol === "file:") return fail("Sign-up needs the site server: run node server.mjs and open http://localhost:4173.");

    btn.disabled = true;
    const was = label.textContent;
    label.textContent = "Joining…";
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, source: form.dataset.source }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) return fail(body.error ?? "Something went wrong. Please try again.", body.field);
      const first = data.name.trim().split(/\s+/)[0];
      msg.textContent = body.already
        ? `You're already in, ${first}. See you Monday.`
        : `Welcome to the family, ${first}! Your first lesson arrives Monday.`;
      msg.classList.add("ok");
      form.classList.add("done");
      burst(btn);
    } catch {
      fail("You seem to be offline. Please try again.");
    } finally {
      btn.disabled = false;
      label.textContent = was;
    }
  });
});

/* ---------- offline + installable (PWA) ---------- */
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
