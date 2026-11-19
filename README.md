# amani-portfolio

Personal portfolio of **Amani Ziane**, an Applied & Computational Mathematics student at USC (minors in AI Applications and Computational Biology & Bioinformatics).

**Live:** https://a-ziane.github.io/amani-portfolio/

## Design
- **Hero:** a live Lorenz attractor, integrated with RK4 in the browser. Two trajectories start 0.001 apart and drift apart (sensitive dependence on initial conditions). The view follows your cursor.
- **Coursework:** shown as a periodic table. Each tile flips to show an equation tied to that course.
- **Palette:** cream paper with ink, terracotta, forest green and ochre, like a math notebook. A zellige-inspired divider separates the sections.

## Stack
Plain HTML, CSS and JavaScript, with no build step. Open `index.html` to view it, or serve the folder with any static host.

```bash
python3 -m http.server 8000
```

## Edit content
- Projects, the timeline and contact info are in `index.html`
- Coursework tiles are in the `courses` array at the top of `script.js`
