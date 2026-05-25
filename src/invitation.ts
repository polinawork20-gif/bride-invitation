// @ts-nocheck

const MOBILE_BREAKPOINT = 768;

const isMobile = () => window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function scaleCount(count, reductionPercent, min = 1) {
  if (!isMobile()) return count;
  return Math.max(min, Math.round(count * (1 - reductionPercent / 100)));
}

function particleCount(desktop, mobileReduction, min = 1) {
  if (prefersReducedMotion()) return min;
  return scaleCount(desktop, mobileReduction, min);
}

function initPerformanceMode() {
  const mobile = isMobile();
  const reduced = prefersReducedMotion();
  document.documentElement.classList.toggle('is-mobile', mobile);
  document.documentElement.classList.toggle('perf-lite', mobile || reduced);
  document.documentElement.classList.toggle('reduced-motion', reduced);
}

initPerformanceMode();

const bgGlows = document.getElementById('bgGlows');
    const bgFlowers = document.getElementById('bgFlowers');
    const layerFar = document.getElementById('layerFar');
    const layerNear = document.getElementById('layerNear');
    const envelope = document.getElementById('envelope');
    const hint = document.getElementById('hint');
    const glow = document.getElementById('glow');
    const closeBtn = document.getElementById('closeBtn');

    const heartPath = 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

    const heartSvg = (fill, stroke, strokeW) => {
      let attrs = `d="${heartPath}"`;
      if (stroke) {
        attrs += ` fill="none" stroke="${stroke}" stroke-width="${strokeW || 0.9}"`;
      } else {
        attrs += ` fill="${fill}"`;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path ${attrs}/></svg>`;
    };

    const heartSvgSmall = (fill) =>
      `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${heartPath}" fill="${fill}" transform="scale(0.65) translate(4.2 4.2)"/><path d="${heartPath}" fill="${fill}" transform="scale(0.5) translate(12 10)" opacity="0.6"/></svg>`;

    const petalFills = [
      'rgba(248, 192, 206, 0.82)',
      'rgba(244, 175, 192, 0.78)',
      'rgba(252, 210, 218, 0.8)',
      'rgba(240, 160, 178, 0.75)',
      'rgba(253, 200, 212, 0.77)'
    ];

    const petalSvg = (fill) =>
      `<svg viewBox="0 0 20 28" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 1.5 C15 10, 16.5 19, 10 26.5 C3.5 19, 5 10, 10 1.5 Z" fill="${fill}"/>
        <path d="M10 2 C10 12, 10 20, 10 26" fill="none" stroke="rgba(190,100,120,0.15)" stroke-width="0.35" stroke-linecap="round"/>
      </svg>`;

    function blossomSvg(scale) {
      const s = scale * 120;
      const tints = [
        { petal: '#fde8ec', center: '#eaa6b7', inner: '#f4b8c6' },
        { petal: '#fff4ea', center: '#e8c4b4', inner: '#f5e0d4' },
        { petal: '#fff0e8', center: '#e0b8b0', inner: '#f0d4cc' },
        { petal: '#fce8ee', center: '#e8a8b8', inner: '#f4c8d0' }
      ];
      const c = tints[Math.floor(Math.random() * tints.length)];
      const petals = [0, 72, 144, 216, 288].map((deg) => {
        const rad = deg * Math.PI / 180;
        const cx = (60 + Math.cos(rad) * 24).toFixed(1);
        const cy = (58 + Math.sin(rad) * 24).toFixed(1);
        return `<ellipse cx="${cx}" cy="${cy}" rx="13" ry="19" fill="${c.petal}" transform="rotate(${deg} ${cx} ${cy})"/>`;
      }).join('');
      return `<svg width="${s}" height="${s}" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.68">${petals}
        <circle cx="60" cy="58" r="7" fill="${c.center}" opacity="0.72"/>
        <circle cx="60" cy="58" r="4" fill="${c.inner}" opacity="0.48"/></g>
      </svg>`;
    }

    function createGlowBlobs() {
      const mobile = isMobile();
      const blobs = [
        { w: 480, h: 480, bg: 'radial-gradient(circle at 35% 35%, #ffe8d0, #ffd0a8 50%, transparent 72%)', blur: 105, op: 0.55, left: '2%', top: '12%', dx: '14px', dy: '-12px' },
        { w: 400, h: 400, bg: 'radial-gradient(circle at 60% 40%, #fce8ec, #f0b0c8 50%, transparent 70%)', blur: 95, op: 0.48, left: '74%', top: '5%', dx: '-20px', dy: '12px' },
        { w: 380, h: 380, bg: 'radial-gradient(circle at 40% 60%, #fff4e8, #f0b8c8 55%, transparent 72%)', blur: 88, op: 0.44, left: '3%', top: '70%', dx: '10px', dy: '10px' },
        { w: 360, h: 360, bg: 'radial-gradient(circle at 55% 45%, #f8c8d8, #e8a0b8 52%, transparent 68%)', blur: 82, op: 0.4, left: '76%', top: '65%', dx: '-16px', dy: '-12px' }
      ];
      const list = mobile ? blobs.slice(0, 2) : blobs;
      list.forEach((b, i) => {
        const w = mobile ? Math.round(b.w * 0.72) : b.w;
        const h = mobile ? Math.round(b.h * 0.72) : b.h;
        const blur = mobile ? Math.min(20, Math.round(b.blur * 0.45)) : b.blur;
        const el = document.createElement('div');
        el.className = 'glow-blob';
        el.style.cssText = `
          width: ${w}px; height: ${h}px;
          background: ${b.bg};
          --blur: ${blur}px; --op: ${mobile ? b.op * 0.85 : b.op};
          --dx: ${b.dx}; --dy: ${b.dy};
          --dur: ${18 + i * 3}s;
          --delay: ${-i * 4}s;
          left: ${b.left}; top: ${b.top};
        `;
        bgGlows.appendChild(el);
      });
    }

    function pickBorderSideSpot(side) {
      const r = () => Math.random();
      if (side === 'top') return { left: `${r() * 100}%`, top: `${-5 + r() * 9}%` };
      if (side === 'bottom') return { left: `${r() * 100}%`, top: `${93 + r() * 7}%` };
      if (side === 'left') return { left: `${-5 + r() * 7}%`, top: `${r() * 100}%` };
      return { left: `${94 + r() * 6}%`, top: `${r() * 100}%` };
    }

    function pickCornerZoneSpot() {
      const r = () => Math.random();
      const zone = Math.floor(Math.random() * 4);
      if (zone === 0) return { left: `${-5 + r() * 18}%`, top: `${-5 + r() * 16}%` };
      if (zone === 1) return { left: `${82 + r() * 18}%`, top: `${-5 + r() * 16}%` };
      if (zone === 2) return { left: `${-5 + r() * 18}%`, top: `${84 + r() * 16}%` };
      return { left: `${82 + r() * 18}%`, top: `${84 + r() * 16}%` };
    }

    function pickEdgeFlowerSpot() {
      const r = () => Math.random();
      const zone = Math.floor(Math.random() * 20);
      const spots = [
        () => ({ left: `${r() * 12}%`, top: `${-5 + r() * 8}%` }),
        () => ({ left: `${12 + r() * 14}%`, top: `${-5 + r() * 7}%` }),
        () => ({ left: `${26 + r() * 14}%`, top: `${-5 + r() * 7}%` }),
        () => ({ left: `${40 + r() * 14}%`, top: `${-5 + r() * 7}%` }),
        () => ({ left: `${54 + r() * 14}%`, top: `${-5 + r() * 7}%` }),
        () => ({ left: `${68 + r() * 14}%`, top: `${-5 + r() * 7}%` }),
        () => ({ left: `${82 + r() * 12}%`, top: `${-5 + r() * 8}%` }),
        () => ({ left: `${r() * 12}%`, top: `${93 + r() * 8}%` }),
        () => ({ left: `${12 + r() * 14}%`, top: `${94 + r() * 7}%` }),
        () => ({ left: `${26 + r() * 14}%`, top: `${94 + r() * 7}%` }),
        () => ({ left: `${40 + r() * 14}%`, top: `${94 + r() * 7}%` }),
        () => ({ left: `${54 + r() * 14}%`, top: `${94 + r() * 7}%` }),
        () => ({ left: `${68 + r() * 14}%`, top: `${94 + r() * 7}%` }),
        () => ({ left: `${82 + r() * 12}%`, top: `${93 + r() * 8}%` }),
        () => ({ left: `${-5 + r() * 5}%`, top: `${r() * 96}%` }),
        () => ({ left: `${-5 + r() * 5}%`, top: `${r() * 96}%` }),
        () => ({ left: `${94 + r() * 5}%`, top: `${r() * 96}%` }),
        () => ({ left: `${94 + r() * 5}%`, top: `${r() * 96}%` }),
        () => pickCornerZoneSpot(),
        () => pickCornerZoneSpot()
      ];
      return spots[zone]();
    }

    function pickFlowerTier() {
      const roll = Math.random();
      if (roll < 0.42) {
        return { scale: 0.3 + Math.random() * 0.16, op: 0.22 + Math.random() * 0.1, blur: 1.7 + Math.random() * 1 };
      }
      if (roll < 0.8) {
        return { scale: 0.44 + Math.random() * 0.18, op: 0.26 + Math.random() * 0.12, blur: 1.2 + Math.random() * 0.8 };
      }
      return { scale: 0.58 + Math.random() * 0.2, op: 0.32 + Math.random() * 0.14, blur: 0.9 + Math.random() * 0.65 };
    }

    function createBlossomClusters() {
      const corners = [
        { left: '-8%', top: '-6%', scale: 1.22, op: 0.5, blur: 1.85 },
        { right: '-8%', top: '-6%', scale: 1.18, op: 0.48, blur: 1.9 },
        { left: '-7%', bottom: '-5%', scale: 1.14, op: 0.46, blur: 2 },
        { right: '-7%', bottom: '-5%', scale: 1.1, op: 0.46, blur: 2 }
      ];

      const borderCounts = { top: 34, bottom: 34, left: 36, right: 34 };
      const borderDense = [];
      ['top', 'bottom', 'left', 'right'].forEach((side) => {
        for (let i = 0; i < borderCounts[side]; i++) {
          borderDense.push({ ...pickBorderSideSpot(side), ...pickFlowerTier() });
        }
      });

      const cornerFlowers = [];
      for (let i = 0; i < 20; i++) {
        cornerFlowers.push({ ...pickCornerZoneSpot(), ...pickFlowerTier() });
      }

      const edgeAccents = [];
      const addSideAccents = (side, n) => {
        const r = () => Math.random();
        for (let i = 0; i < n; i++) {
          const t = pickFlowerTier();
          if (side === 'top') edgeAccents.push({ left: `${4 + r() * 90}%`, top: `${r() * 3}%`, ...t });
          else if (side === 'bottom') edgeAccents.push({ left: `${4 + r() * 90}%`, bottom: `${r() * 3}%`, ...t });
          else if (side === 'left') edgeAccents.push({ left: `${r() * 3}%`, top: `${4 + r() * 90}%`, ...t });
          else edgeAccents.push({ right: `${r() * 3}%`, top: `${4 + r() * 90}%`, ...t });
        }
      };
      addSideAccents('top', 14);
      addSideAccents('bottom', 14);
      addSideAccents('left', 14);
      addSideAccents('right', 14);

      const edgeFlowers = [];
      for (let i = 0; i < 44; i++) {
        edgeFlowers.push({ ...pickEdgeFlowerSpot(), ...pickFlowerTier() });
      }

      [...corners, ...borderDense, ...cornerFlowers, ...edgeAccents, ...edgeFlowers].forEach((c, i) => {
        const el = document.createElement('div');
        el.className = 'blossom-cluster';
        el.innerHTML = blossomSvg(c.scale);
        const pos = [];
        if (c.left) {
          pos.push(`left:${c.left}`);
          el.dataset.side = 'left';
        }
        if (c.right) {
          pos.push(`right:${c.right}`);
          el.dataset.side = 'right';
        }
        if (c.top) {
          pos.push(`top:${c.top}`);
          if (!el.dataset.side) el.dataset.side = 'top';
        }
        if (c.bottom) {
          pos.push(`bottom:${c.bottom}`);
          if (!el.dataset.side) el.dataset.side = 'bottom';
        }
        el.style.cssText = `
          ${pos.join(';')};
          --op: ${c.op};
          --blur: ${c.blur}px;
          --delay: ${-(i * 1.8 + Math.random() * 3)}s;
        `;
        bgFlowers.appendChild(el);
      });
    }

    function createBokeh(container, count) {
      const colors = ['rgba(255,255,255,0.9)', 'rgba(255,248,242,0.85)', 'rgba(253,230,233,0.8)', 'rgba(248,207,216,0.75)'];
      for (let i = 0; i < count; i++) {
        const size = 4 + Math.random() * 32;
        const el = document.createElement('div');
        el.className = 'bokeh';
        const opMin = 0.12 + Math.random() * 0.15;
        const opMax = opMin + 0.15 + Math.random() * 0.18;
        el.style.cssText = `
          width: ${size}px; height: ${size}px;
          --bokeh-color: ${colors[i % colors.length]};
          --blur: ${2 + Math.random() * 10}px;
          --op-min: ${opMin}; --op-max: ${Math.min(opMax, 0.45)};
          --dur: ${5 + Math.random() * 8}s;
          --delay: ${Math.random() * -12}s;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
        `;
        container.appendChild(el);
      }
    }

    function createSparkles(container, count) {
      const colors = ['#fff', '#fff8f5', '#fde6e9', '#f8d0d8', '#fff0ea'];
      for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.className = 'sparkle-dot';
        const size = 1 + Math.random() * 2;
        el.style.cssText = `
          --size: ${size}px;
          --sparkle-color: ${colors[i % colors.length]};
          --dur: ${2 + Math.random() * 4}s;
          --delay: ${Math.random() * -8}s;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
        `;
        container.appendChild(el);
      }
    }

    function pickGiantHeartSpawn() {
      const edge = Math.random();
      if (edge < 0.28) {
        return { left: `${-10 + Math.random() * 24}%`, top: `${12 + Math.random() * 78}%` };
      }
      if (edge < 0.56) {
        return { left: `${76 + Math.random() * 24}%`, top: `${12 + Math.random() * 78}%` };
      }
      if (edge < 0.78) {
        return { left: `${2 + Math.random() * 96}%`, top: `${76 + Math.random() * 20}%` };
      }
      return { left: `${2 + Math.random() * 96}%`, top: `${4 + Math.random() * 24}%` };
    }

    function pickHeartSpawn(near) {
      if (near) {
        return {
          left: `${3 + Math.random() * 94}%`,
          top: `${55 + Math.random() * 45}%`
        };
      }
      let left, top;
      let tries = 0;
      do {
        left = 3 + Math.random() * 94;
        top = 78 + Math.random() * 22;
        tries++;
      } while (tries < 20 && left > 30 && left < 70 && top > 32 && top < 72);
      return { left: `${left}%`, top: `${top}%` };
    }

    function pickHeartTier() {
      if (isMobile()) {
        const roll = Math.random();
        if (roll < 0.2) return { tier: 'medium', op: 0.15 + Math.random() * 0.1, blurChance: 0.22, visible: false };
        if (roll < 0.45) return { tier: 'clear', op: 0.18 + Math.random() * 0.1, blurChance: 0.16, visible: false };
        if (roll < 0.7) return { tier: 'soft', op: 0.14 + Math.random() * 0.08, blurChance: 0.35, visible: false };
        return { tier: 'bold', op: 0.22 + Math.random() * 0.1, blurChance: 0.1, visible: false };
      }
      const roll = Math.random();
      if (roll < 0.24) {
        return { tier: 'whisper', op: 0.04 + Math.random() * 0.06, blurChance: 0.62, visible: false };
      }
      if (roll < 0.46) {
        return { tier: 'faint', op: 0.07 + Math.random() * 0.09, blurChance: 0.58, visible: false };
      }
      if (roll < 0.66) {
        return { tier: 'mist', op: 0.1 + Math.random() * 0.1, blurChance: 0.52, visible: false };
      }
      if (roll < 0.82) {
        return { tier: 'soft', op: 0.13 + Math.random() * 0.1, blurChance: 0.48, visible: false };
      }
      if (roll < 0.92) {
        return { tier: 'medium', op: 0.17 + Math.random() * 0.1, blurChance: 0.32, visible: false };
      }
      if (roll < 0.97) {
        return { tier: 'clear', op: 0.2 + Math.random() * 0.1, blurChance: 0.2, visible: false };
      }
      return { tier: 'bold', op: 0.24 + Math.random() * 0.12, blurChance: 0.14, visible: false };
    }

    const heartPalettes = {
      whisper: [
        { fill: 'rgba(255, 230, 235, 0.06)', type: 'soft' },
        { fill: 'rgba(248, 207, 216, 0.07)', type: 'soft' },
        { fill: 'rgba(244, 184, 198, 0.05)', type: 'filled' }
      ],
      faint: [
        { fill: 'rgba(185, 76, 96, 0.08)', type: 'filled' },
        { fill: 'rgba(234, 166, 183, 0.1)', type: 'filled' },
        { fill: 'rgba(255, 200, 210, 0.07)', type: 'filled' },
        { fill: 'rgba(244, 184, 198, 0.06)', type: 'double' }
      ],
      mist: [
        { fill: 'rgba(220, 110, 130, 0.14)', type: 'filled' },
        { fill: 'rgba(234, 166, 183, 0.15)', type: 'soft' },
        { fill: 'rgba(255, 215, 222, 0.12)', type: 'filled' },
        { fill: 'rgba(248, 207, 216, 0.16)', type: 'filled' }
      ],
      soft: [
        { fill: 'rgba(220, 110, 130, 0.18)', type: 'filled' },
        { fill: 'rgba(234, 166, 183, 0.2)', type: 'filled' },
        { fill: 'rgba(244, 184, 198, 0.19)', type: 'filled' },
        { fill: 'rgba(244, 184, 198, 0.14)', type: 'double' }
      ],
      medium: [
        { fill: 'rgba(210, 100, 125, 0.28)', type: 'filled' },
        { fill: 'rgba(228, 150, 170, 0.3)', type: 'filled' },
        { fill: 'rgba(234, 166, 183, 0.32)', type: 'filled' },
        { fill: 'rgba(244, 184, 198, 0.26)', type: 'double' }
      ],
      clear: [
        { fill: 'rgba(200, 88, 115, 0.36)', type: 'filled' },
        { fill: 'rgba(228, 150, 170, 0.38)', type: 'filled' },
        { fill: 'rgba(234, 166, 183, 0.4)', type: 'filled' },
        { fill: 'rgba(220, 120, 145, 0.34)', type: 'double' }
      ],
      bold: [
        { fill: 'rgba(195, 80, 110, 0.45)', type: 'filled' },
        { fill: 'rgba(220, 110, 130, 0.48)', type: 'filled' },
        { fill: 'rgba(234, 166, 183, 0.5)', type: 'filled' },
        { fill: 'rgba(210, 95, 120, 0.42)', type: 'double' }
      ]
    };

    function createHearts(container, count, near) {
      for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        const roll = Math.random();
        let size;
        if (roll < 0.68) size = 16 + Math.random() * 22;
        else if (roll < 0.9) size = 34 + Math.random() * 18;
        else size = 48 + Math.random() * 14;

        const tier = pickHeartTier();
        const palette = heartPalettes[tier.tier];
        const p = palette[Math.floor(Math.random() * palette.length)];
        let cls = `heart-shape ${tier.tier}`;
        if (tier.tier === 'bold') cls += ' visible-bold';
        else if (tier.tier === 'clear') cls += ' visible';
        else if (tier.tier === 'medium') cls += ' visible-medium';
        if (Math.random() < tier.blurChance) cls += ' blurred';
        else if (p.type === 'soft' || tier.tier === 'whisper' || tier.tier === 'faint' || tier.tier === 'mist') cls += ' soft-blur';

        if (p.type === 'double') {
          el.innerHTML = heartSvgSmall(p.fill);
        } else {
          el.innerHTML = heartSvg(p.fill);
        }

        const dur = 100 + Math.random() * 70;
        const pos = pickHeartSpawn(near);
        const op = Math.min(0.26, tier.op * (0.7 + Math.random() * 0.25));
        el.className = cls;
        el.style.cssText = `
          --size: ${size}px;
          --op: ${op};
          --dur: ${dur}s;
          --delay: ${Math.random() * -dur}s;
          --rot: ${-14 + Math.random() * 28}deg;
          --rot-end: ${5 + Math.random() * 12}deg;
          --drift: ${-22 + Math.random() * 44}px;
          --scale-start: ${0.84 + Math.random() * 0.1};
          --scale-end: ${0.9 + Math.random() * 0.08};
          left: ${pos.left};
          top: ${pos.top};
        `;
        container.appendChild(el);
      }
    }

    function createLargeSoftHearts(container, count) {
      const fills = [
        'rgba(255, 230, 235, 0.09)',
        'rgba(248, 207, 216, 0.1)',
        'rgba(244, 184, 198, 0.08)',
        'rgba(255, 220, 228, 0.07)',
        'rgba(252, 195, 210, 0.085)'
      ];
      for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        const size = 92 + Math.random() * 72;
        el.className = 'heart-shape heart-giant whisper soft-blur';
        el.innerHTML = heartSvg(fills[i % fills.length]);
        const dur = 130 + Math.random() * 90;
        const pos = pickGiantHeartSpawn();
        el.style.cssText = `
          --size: ${size}px;
          --op: ${0.07 + Math.random() * 0.09};
          --dur: ${dur}s;
          --delay: ${Math.random() * -dur}s;
          --rot: ${-10 + Math.random() * 20}deg;
          --rot-end: ${4 + Math.random() * 8}deg;
          --drift: ${-16 + Math.random() * 32}px;
          --scale-start: ${0.88 + Math.random() * 0.08};
          --scale-end: ${0.92 + Math.random() * 0.06};
          left: ${pos.left};
          top: ${pos.top};
        `;
        container.appendChild(el);
      }
    }

    function createMegaSoftHearts(container, count) {
      const fills = [
        'rgba(255, 228, 236, 0.065)',
        'rgba(245, 200, 212, 0.07)',
        'rgba(252, 210, 222, 0.06)'
      ];
      for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        const size = 148 + Math.random() * 95;
        el.className = 'heart-shape heart-giant-xl whisper soft-blur';
        el.innerHTML = heartSvg(fills[i % fills.length]);
        const dur = 150 + Math.random() * 100;
        const pos = pickGiantHeartSpawn();
        el.style.cssText = `
          --size: ${size}px;
          --op: ${0.06 + Math.random() * 0.08};
          --dur: ${dur}s;
          --delay: ${Math.random() * -dur}s;
          --rot: ${-8 + Math.random() * 16}deg;
          --rot-end: ${3 + Math.random() * 6}deg;
          --drift: ${-12 + Math.random() * 24}px;
          --scale-start: ${0.9 + Math.random() * 0.06};
          --scale-end: ${0.94 + Math.random() * 0.05};
          left: ${pos.left};
          top: ${pos.top};
        `;
        container.appendChild(el);
      }
    }

    const giantBackdropSpots = [
      { left: '6%', top: '32%' },
      { left: '78%', top: '38%' },
      { left: '12%', top: '68%' }
    ];

    function createUltraSoftHearts(container, count) {
      const fills = [
        'rgba(255, 225, 235, 0.08)',
        'rgba(248, 195, 210, 0.085)',
        'rgba(252, 210, 222, 0.075)',
        'rgba(255, 218, 228, 0.07)'
      ];
      for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        const size = 220 + Math.random() * 100;
        el.className = 'heart-shape heart-giant-ultra whisper soft-blur';
        el.innerHTML = heartSvg(fills[i % fills.length]);
        const dur = 165 + Math.random() * 110;
        const pos = giantBackdropSpots[i] || pickGiantHeartSpawn();
        el.style.cssText = `
          --size: ${size}px;
          --op: ${0.055 + Math.random() * 0.075};
          --dur: ${dur}s;
          --delay: ${Math.random() * -dur}s;
          --rot: ${-6 + Math.random() * 12}deg;
          --rot-end: ${2 + Math.random() * 5}deg;
          --drift: ${-10 + Math.random() * 20}px;
          --scale-start: ${0.92 + Math.random() * 0.05};
          --scale-end: ${0.95 + Math.random() * 0.04};
          left: ${pos.left};
          top: ${pos.top};
        `;
        container.appendChild(el);
      }
    }

    function createPetals(container, count, near) {
      for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        const w = 14 + Math.random() * 18;
        const h = w * 1.45;
        const blurred = Math.random() < 0.2;
        el.className = 'petal-drift' + (blurred ? ' blurred' : '');
        el.innerHTML = petalSvg(petalFills[i % petalFills.length]);
        const dur = 32 + Math.random() * 28;
        el.style.cssText = `
          --w: ${w}px;
          --h: ${h}px;
          width: ${w}px;
          height: ${h}px;
          --op: ${0.2 + Math.random() * 0.35};
          --dur: ${dur}s;
          --delay: ${Math.random() * -dur}s;
          --rot: ${-30 + Math.random() * 60}deg;
          --spin: ${20 + Math.random() * 25}deg;
          --dx: ${-40 + Math.random() * 80}px;
          --fall: 108vh;
          left: ${near ? pickEdgeFlowerSpot().left : `${Math.random() * 100}%`};
          top: ${near ? pickEdgeFlowerSpot().top : `${-5 + Math.random() * 8}%`};
        `;
        container.appendChild(el);
      }
    }

    function buildAtmosphere() {
      createGlowBlobs();
      createBlossomClusters();
      createBokeh(layerFar, particleCount(22, 50, 6));
      createSparkles(layerFar, particleCount(38, 70, 8));
      createHearts(layerFar, particleCount(530, 60, 80), false);
      createLargeSoftHearts(layerFar, particleCount(70, 55, 2));
      createUltraSoftHearts(layerFar, prefersReducedMotion() ? 0 : (isMobile() ? 2 : 3));
      createSparkles(layerNear, particleCount(22, 70, 4));
      createHearts(layerNear, particleCount(270, 60, 40), true);
      createLargeSoftHearts(layerNear, particleCount(35, 55, 1));
    }

    function getSpringCounts() {
      if (prefersReducedMotion()) {
        return { bloom: 8, heart: 6, shimmer: 6, petal: 2, extraSparkles: 6, fillMax: 3 };
      }
      if (isMobile()) {
        return { bloom: 22, heart: 18, shimmer: 22, petal: 6, extraSparkles: 18, fillMax: 8 };
      }
      return { bloom: 72, heart: 58, shimmer: 85, petal: 20, extraSparkles: 75, fillMax: 24 };
    }

    const springBloomLayer = document.getElementById('springBloomLayer');

    const springHeartFills = [
      'rgba(244, 200, 210, 0.28)',
      'rgba(234, 166, 183, 0.26)',
      'rgba(248, 207, 216, 0.3)',
      'rgba(255, 225, 235, 0.32)',
      'rgba(220, 120, 145, 0.24)'
    ];

    let springFillTimer = null;

    function addSpringHeart() {
      const el = document.createElement('div');
      const size = 38 + Math.random() * 44;
      el.className = 'spring-item spring-item--heart';
      el.innerHTML = heartSvg(springHeartFills[Math.floor(Math.random() * springHeartFills.length)]);
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 100}%`;
      el.style.setProperty('--op', `${0.18 + Math.random() * 0.28}`);
      el.style.animationDelay = `${Math.random() * 1.2}s`;
      el.style.animationDuration = `${2.8 + Math.random() * 2}s`;
      springBloomLayer.appendChild(el);
    }

    function addSpringBloom() {
      const el = document.createElement('div');
      el.className = 'spring-item spring-item--bloom';
      el.innerHTML = blossomSvg(0.7 + Math.random() * 1.1);
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 100}%`;
      el.style.setProperty('--op', `${0.2 + Math.random() * 0.35}`);
      el.style.setProperty('--blur', `${0.3 + Math.random() * 1.2}px`);
      el.style.animationDelay = `${Math.random() * 1.4}s`;
      el.style.animationDuration = `${2.6 + Math.random() * 2}s`;
      springBloomLayer.appendChild(el);
    }

    function addSpringShimmer() {
      const el = document.createElement('div');
      const sz = 3 + Math.random() * 12;
      el.className = 'spring-shimmer';
      el.style.width = `${sz}px`;
      el.style.height = `${sz}px`;
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 100}%`;
      el.style.setProperty('--delay', `${Math.random() * -8}s`);
      springBloomLayer.appendChild(el);
    }

    function addSpringPetal() {
      const el = document.createElement('div');
      const w = 14 + Math.random() * 16;
      const h = w * 1.45;
      el.className = 'spring-petal' + (Math.random() < 0.15 ? ' blurred' : '');
      el.innerHTML = petalSvg(petalFills[Math.floor(Math.random() * petalFills.length)]);
      const dur = 42 + Math.random() * 28;
      el.style.cssText = `
        --w: ${w}px;
        width: ${w}px;
        height: ${h}px;
        --op: ${0.16 + Math.random() * 0.26};
        --dur: ${dur}s;
        --delay: ${Math.random() * -dur}s;
        --rot: ${-25 + Math.random() * 50}deg;
        --spin: ${18 + Math.random() * 22}deg;
        --dx: ${-35 + Math.random() * 70}px;
        --fall: 108vh;
        left: ${Math.random() * 100}%;
        top: ${-2 + Math.random() * 4}%;
      `;
      springBloomLayer.appendChild(el);
    }

    function addExtraSparkles() {
      const colors = ['rgba(255,255,255,0.95)', 'rgba(255,248,242,0.9)', 'rgba(253,230,233,0.85)'];
      const total = getSpringCounts().extraSparkles;
      for (let i = 0; i < total; i++) {
        const size = 2 + Math.random() * 6;
        const el = document.createElement('div');
        el.className = 'sparkle-dot spring-extra';
        el.style.cssText = `
          width: ${size}px; height: ${size}px;
          --sparkle-color: ${colors[i % colors.length]};
          --dur: ${3 + Math.random() * 5}s;
          --delay: ${Math.random() * -10}s;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
        `;
        layerFar.appendChild(el);
      }
    }

    function spawnSpringBloom() {
      const c = getSpringCounts();
      springBloomLayer.innerHTML = '';
      for (let i = 0; i < c.bloom; i++) addSpringBloom();
      for (let i = 0; i < c.heart; i++) addSpringHeart();
      for (let i = 0; i < c.shimmer; i++) addSpringShimmer();
      for (let i = 0; i < c.petal; i++) addSpringPetal();
    }

    function startSpringGentleFill() {
      stopSpringGentleFill();
      let n = 0;
      const fillMax = getSpringCounts().fillMax;
      const fillInterval = isMobile() ? 1600 : 1100;
      springFillTimer = setInterval(() => {
        if (!document.body.classList.contains('letter-reading') || n >= fillMax) {
          stopSpringGentleFill();
          return;
        }
        addSpringHeart();
        if (n % 2 === 0) addSpringBloom();
        if (n % 5 === 0) addSpringShimmer();
        n += 1;
      }, fillInterval);
    }

    function stopSpringGentleFill() {
      if (springFillTimer) {
        clearInterval(springFillTimer);
        springFillTimer = null;
      }
    }

    function clearSpringBloom() {
      stopSpringGentleFill();
      springBloomLayer.innerHTML = '';
      document.querySelectorAll('.sparkle-dot.spring-extra').forEach((el) => el.remove());
    }

    function setSpringBloom(on) {
      document.body.classList.toggle('letter-reading', on);
      if (on) {
        setTimeout(() => {
          spawnSpringBloom();
          addExtraSparkles();
          startSpringGentleFill();
        }, 750);
      } else {
        clearSpringBloom();
      }
    }

    let isOpen = false;

    envelope.addEventListener('click', () => {
      if (isOpen) return;
      isOpen = true;
      envelope.classList.add('open');
      hint.classList.add('hidden');
      glow.classList.add('active');
      closeBtn.classList.add('visible');
      setSpringBloom(true);
    });

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isOpen = false;
      setSpringBloom(false);
      envelope.classList.remove('open');
      hint.classList.remove('hidden');
      glow.classList.remove('active');
      closeBtn.classList.remove('visible');
    });

    buildAtmosphere();