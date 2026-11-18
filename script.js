// ---------- Coursework periodic table ----------
const courses = [
  { n: 1,  sym: "Ca", name: "Calculus",                          c: "math", eq: "∫ₐᵇ f′(x) dx = f(b) − f(a)", why: "fundamental theorem" },
  { n: 2,  sym: "La", name: "Linear Algebra",                    c: "math", eq: "A v = λ v",                    why: "eigen-everything" },
  { n: 3,  sym: "Ps", name: "Probability & Statistics",          c: "math", eq: "P(A|B) = P(B|A)P(A) / P(B)",   why: "bayes, always" },
  { n: 4,  sym: "Dm", name: "Discrete Mathematics",              c: "math", eq: "Σ deg(v) = 2|E|",              why: "handshake lemma" },
  { n: 5,  sym: "Nm", name: "Numerical Methods",                 c: "math", eq: "xₙ₊₁ = xₙ − f(xₙ)/f′(xₙ)",     why: "newton's method" },
  { n: 6,  sym: "Da", name: "Data Structures & Algorithms",      c: "cs",   eq: "T(n) = 2T(n/2) + O(n)",        why: "→ O(n log n)" },
  { n: 7,  sym: "Oo", name: "Object-Oriented Programming",       c: "cs",   eq: "class Idea extends Product",   why: "inheritance" },
  { n: 8,  sym: "Fs", name: "Full-Stack Web Development",        c: "cs",   eq: "client ⇄ API ⇄ DB",            why: "the whole loop" },
  { n: 9,  sym: "Ai", name: "Artificial Intelligence",           c: "ai",   eq: "f(n) = g(n) + h(n)",           why: "A* search" },
  { n: 10, sym: "Nn", name: "Neural Networks",                   c: "ai",   eq: "θ ← θ − η ∇L(θ)",              why: "gradient descent" },
  { n: 11, sym: "Cb", name: "Computational Biology",             c: "bio",  eq: "F(i,j) = max{F(i−1,j−1)+s, F(i−1,j)−d, F(i,j−1)−d}", why: "needleman–wunsch" },
];
const colors = { math: "var(--green)", cs: "var(--sand)", ai: "var(--violet)", bio: "var(--red)" };
const table = document.getElementById("ptable");
courses.forEach(k => {
  const el = document.createElement("div");
  el.className = "el";
  el.style.setProperty("--c", colors[k.c]);
  el.tabIndex = 0;
  el.innerHTML = `
    <div class="inner">
      <div class="face front"><span class="num">${String(k.n).padStart(2, "0")}</span><span class="sym">${k.sym}</span><span class="name">${k.name}</span></div>
      <div class="face back"><span class="eq">${k.eq}</span><span class="why">// ${k.why}</span></div>
    </div>`;
  el.addEventListener("click", () => el.classList.toggle("flip"));
  el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.classList.toggle("flip"); } });
  table.appendChild(el);
});

// ---------- Project card spotlight ----------
document.querySelectorAll(".project").forEach(card => {
  card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

// ---------- Reveal on scroll ----------
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(s => io.observe(s));

document.getElementById("yr").textContent = new Date().getFullYear();

// ---------- Lorenz attractor (RK4) ----------
const cv = document.getElementById("attractor");
const ctx = cv.getContext("2d");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let W, H, dpr;
function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = cv.width = innerWidth * dpr;
  H = cv.height = innerHeight * dpr;
  ctx.fillStyle = "#0b100f"; ctx.fillRect(0, 0, W, H);
}
resize();
addEventListener("resize", resize);

const σ = 10, ρ = 28, β = 8 / 3, dt = 0.006;
const f = ([x, y, z]) => [σ * (y - x), x * (ρ - z) - y, x * y - β * z];
function rk4(p) {
  const k1 = f(p);
  const k2 = f(p.map((v, i) => v + dt / 2 * k1[i]));
  const k3 = f(p.map((v, i) => v + dt / 2 * k2[i]));
  const k4 = f(p.map((v, i) => v + dt * k3[i]));
  return p.map((v, i) => v + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
}

// two trajectories that start 1e-3 apart: sensitive dependence, in green and red
let trails = [
  { p: [0.1, 0, 0], color: [47, 210, 138] },
  { p: [0.101, 0, 0], color: [229, 83, 61] },
];
let angle = 0, mouseX = 0.5, mouseY = 0.5;
addEventListener("pointermove", e => { mouseX = e.clientX / innerWidth; mouseY = e.clientY / innerHeight; });

function project([x, y, z]) {
  const a = angle + (mouseX - 0.5) * 1.2;
  const xr = x * Math.cos(a) - y * Math.sin(a);
  const s = Math.min(W, H) / 70;
  const cx = W * (innerWidth > 860 ? 0.7 : 0.5);
  const cy = H * (0.5 + (mouseY - 0.5) * 0.1);
  return [cx + xr * s, cy - (z - 25) * s];
}

function frame() {
  ctx.fillStyle = "rgba(11,16,15,0.035)";
  ctx.fillRect(0, 0, W, H);
  angle += 0.0015;
  for (const t of trails) {
    for (let i = 0; i < 6; i++) {
      const a = project(t.p);
      t.p = rk4(t.p);
      const b = project(t.p);
      ctx.strokeStyle = `rgba(${t.color.join(",")},0.55)`;
      ctx.lineWidth = 1.1 * dpr;
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    }
  }
  requestAnimationFrame(frame);
}
if (reduce) { for (let i = 0; i < 4000; i++) { for (const t of trails) { const a = project(t.p); t.p = rk4(t.p); const b = project(t.p); ctx.strokeStyle = `rgba(${t.color.join(",")},0.35)`; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); } } }
else requestAnimationFrame(frame);
