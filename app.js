/* ===== HAPPY FATHER'S DAY, KEILAH™ ===== */

(function () {
  'use strict';

  // ─── State ───
  let audioEnabled = false;
  let audioCtx = null;
  const konamiSequence = [];
  const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let footerClickCount = 0;
  let typedBuffer = '';
  const EASTER_EGG_PHRASE = 'ihaveeaten';

  // ─── DOM refs ───
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ─── Audio System (Web Audio API, no autoplay) ───
  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
  }

  function playTone(freq, duration, type = 'sine', volume = 0.15) {
    if (!audioEnabled || !audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  function playSuccess() {
    playTone(523, 0.15);
    setTimeout(() => playTone(659, 0.15), 100);
    setTimeout(() => playTone(784, 0.25), 200);
  }

  function playAchievement() {
    playTone(880, 0.1, 'square', 0.08);
    setTimeout(() => playTone(1100, 0.2, 'square', 0.08), 120);
  }

  function playPrinter() {
    if (!audioEnabled || !audioCtx) return;
    for (let i = 0; i < 6; i++) {
      setTimeout(() => playTone(200 + Math.random() * 100, 0.05, 'sawtooth', 0.06), i * 40);
    }
  }

  function playConfettiPop() {
    playTone(400, 0.08, 'triangle', 0.1);
    setTimeout(() => playTone(600, 0.1, 'triangle', 0.08), 50);
  }

  function playGavel() {
    playTone(150, 0.2, 'square', 0.2);
    setTimeout(() => playTone(100, 0.15, 'square', 0.15), 80);
  }

  function playAlarm() {
    playTone(800, 0.15, 'sawtooth', 0.1);
    setTimeout(() => playTone(600, 0.15, 'sawtooth', 0.1), 200);
  }

  function playCartoonBoing() {
    if (!audioEnabled || !audioCtx) return;
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.15);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.4);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + 0.45);
  }

  function playRecordScratch() {
    if (!audioEnabled || !audioCtx) return;
    const t = audioCtx.currentTime;
    const bufferSize = audioCtx.sampleRate * 0.25;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = audioCtx.createBufferSource();
    src.buffer = buffer;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    src.connect(gain);
    gain.connect(audioCtx.destination);
    src.start(t);
  }

  window.AppAudio = {
    playTone,
    playSuccess,
    playFail: () => playTone(150, 0.3, 'sawtooth', 0.15),
  };

  // ─── Documentary Narrator ───
  const DOC_CHAPTERS = [
    { chapter: 'CHAPTER I — THE MEETING', text: 'It began like any love story. Two people. Normal labels. No one suspected the family tree would file for emotional damages.' },
    { chapter: 'CHAPTER II — EARLY SIGNS', text: 'Hydration reminders appeared. Sleep commands followed. Ivan thought it was sweet. Biology thought it was a paperwork violation.' },
    { chapter: 'CHAPTER III — THE HOLD', text: 'Then came the photograph — Exhibit A. A grip so parental, the National Dad Registry opened an investigation.' },
    { chapter: 'CHAPTER IV — MEDIA STORM', text: 'CBS called. Fox 5 called. CNN left seventeen voicemails. Everyone asked the same question: how is she both girlfriend and father?' },
    { chapter: 'CHAPTER V — THE VERDICT', text: 'Courts ruled. Scientists surrendered. Keilah accepted her destiny. Ivan remained confused. The certificate was stamped APPROVED.' },
    { chapter: 'EPILOGUE', text: 'And so, on Father\'s Day, we celebrate the woman who cared enough to become a category error — and still text "did you eat?"' },
  ];

  let docChapterIdx = 0;
  let docTypingTimer = null;

  function initDocumentary() {
    const narration = $('#docNarration');
    const chapterEl = $('#docChapter');
    const dots = $('#docDots');
    if (!narration || !chapterEl) return;

    DOC_CHAPTERS.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'doc-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Chapter ${i + 1}`);
      dot.addEventListener('click', () => showDocChapter(i));
      dots?.appendChild(dot);
    });

    function typeText(text) {
      clearInterval(docTypingTimer);
      narration.textContent = '';
      let i = 0;
      docTypingTimer = setInterval(() => {
        narration.textContent += text[i];
        i++;
        if (i >= text.length) clearInterval(docTypingTimer);
      }, 22);
    }

    function showDocChapter(idx) {
      docChapterIdx = idx;
      const ch = DOC_CHAPTERS[idx];
      chapterEl.textContent = ch.chapter;
      typeText(ch.text);
      dots?.querySelectorAll('.doc-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    showDocChapter(0);
    setInterval(() => {
      docChapterIdx = (docChapterIdx + 1) % DOC_CHAPTERS.length;
      showDocChapter(docChapterIdx);
    }, 12000);

    const docSection = $('#documentary');
    if (docSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('doc-active');
        });
      }, { threshold: 0.15 });
      observer.observe(docSection);
    }
  }

  function initEvidence() {
    let enhanced = false;
    $('#enhanceBtn')?.addEventListener('click', () => {
      enhanced = !enhanced;
      const frame = document.querySelector('.evidence-frame');
      const btn = $('#enhanceBtn');
      if (frame) frame.classList.toggle('enhanced', enhanced);
      if (btn) btn.textContent = enhanced ? 'Un-enhance (too powerful)' : 'Enhance Image (it gets funnier)';
      if (audioEnabled) {
        initAudio();
        enhanced ? playCartoonBoing() : playRecordScratch();
      }
      if (enhanced) launchConfetti(30);
    });

    // Subtle parallax on evidence photo
    const photo = $('#evidencePhoto');
    const frame = document.querySelector('.evidence-frame');
    if (photo && frame) {
      frame.addEventListener('mousemove', (e) => {
        const rect = frame.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        photo.style.transform = `scale(1.03) translate(${x * 8}px, ${y * 8}px)`;
      });
      frame.addEventListener('mouseleave', () => {
        photo.style.transform = '';
      });
    }
  }

  $('#audioSwitch')?.addEventListener('change', (e) => {
    audioEnabled = e.target.checked;
    if (audioEnabled) {
      initAudio();
      playTone(440, 0.1);
    }
  });

  // ─── Boot Sequence ───
  const bootMessages = [
    { text: 'Initializing database...', delay: 400, cls: '' },
    { text: 'Connecting to National Dad Registry...', delay: 600, cls: 'info' },
    { text: 'Searching family records...', delay: 500, cls: '' },
    { text: 'Cross-checking emotional support logs...', delay: 700, cls: '' },
    { text: 'Analyzing snack reminders...', delay: 500, cls: '' },
    { text: 'Scanning 14,000 text messages...', delay: 800, cls: '' },
    { text: 'Computing...', delay: 900, cls: '' },
    { text: '⚠ Unexpected anomaly detected.', delay: 600, cls: 'warn' },
    { text: '', delay: 300, cls: '' },
    { text: 'Relationship status:', delay: 200, cls: 'info' },
    { text: '  Girlfriend.', delay: 400, cls: 'highlight' },
    { text: '', delay: 200, cls: '' },
    { text: 'Parental status:', delay: 200, cls: 'info' },
    { text: '  Father.', delay: 400, cls: 'highlight' },
    { text: '', delay: 300, cls: '' },
    { text: 'Resolving contradiction...', delay: 800, cls: 'warn' },
    { text: 'Resolution complete.', delay: 500, cls: '' },
  ];

  async function runBootSequence() {
    document.body.classList.add('boot-active');
    const log = $('#bootLog');
    const progress = $('#bootProgress');
    const terminal = $('.boot-terminal');
    const reveal = $('#bootReveal');
    const bootScreen = $('#bootScreen');
    const mainContent = $('#mainContent');

    let progressVal = 0;
    const totalSteps = bootMessages.length + 2;

    for (let i = 0; i < bootMessages.length; i++) {
      const msg = bootMessages[i];
      await sleep(msg.delay);
      if (msg.text) {
        const line = document.createElement('div');
        line.className = msg.cls;
        line.textContent = '> ' + msg.text;
        log.appendChild(line);
        log.scrollTop = log.scrollHeight;
      }
      progressVal = ((i + 1) / totalSteps) * 100;
      progress.style.width = progressVal + '%';
    }

    await sleep(600);
    terminal.classList.add('hidden');
    reveal.classList.remove('hidden');

    await sleep(3500);
    bootScreen.classList.add('fade-out');
    document.body.classList.remove('boot-active');
    mainContent.classList.remove('hidden');

    await sleep(800);
    bootScreen.style.display = 'none';
    initMainExperience();
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  // ─── Particles ───
  function initParticles() {
    const canvas = $('#particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    if (!prefersReduced) {
      for (let i = 0; i < 40; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 3 + 1,
          dx: (Math.random() - 0.5) * 0.3,
          dy: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.4 + 0.1,
        });
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244, 164, 196, ${p.opacity})`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ─── Mouse Glow & Parallax ───
  function initMouseEffects() {
    const glow = $('#mouseGlow');
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (glow) {
        glow.style.left = mouseX + 'px';
        glow.style.top = mouseY + 'px';
      }
    });

    const blobs = $$('.blob');
    document.addEventListener('mousemove', (e) => {
      const cx = (e.clientX / window.innerWidth - 0.5) * 20;
      const cy = (e.clientY / window.innerHeight - 0.5) * 20;
      blobs.forEach((b, i) => {
        const factor = (i + 1) * 0.3;
        b.style.transform = `translate(${cx * factor}px, ${cy * factor}px)`;
      });
    });
  }

  // ─── Confetti ───
  let confettiCanvas, confettiCtx, confettiPieces = [];

  function initConfettiCanvas() {
    confettiCanvas = document.createElement('canvas');
    confettiCanvas.id = 'confettiCanvas';
    document.body.appendChild(confettiCanvas);
    confettiCtx = confettiCanvas.getContext('2d');
    resizeConfetti();
    window.addEventListener('resize', resizeConfetti);
  }

  function resizeConfetti() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }

  function launchConfetti(count = 150) {
    const colors = ['#f4a4c4', '#7eb8da', '#e8c547', '#e8919f', '#fff'];
    for (let i = 0; i < count; i++) {
      confettiPieces.push({
        x: Math.random() * confettiCanvas.width,
        y: -20 - Math.random() * 100,
        w: Math.random() * 10 + 5,
        h: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        gravity: 0.1,
      });
    }
    if (confettiPieces.length === count) animateConfetti();
    playConfettiPop();
  }

  function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces = confettiPieces.filter((p) => p.y < confettiCanvas.height + 50);

    confettiPieces.forEach((p) => {
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rotation * Math.PI) / 180);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      confettiCtx.restore();
    });

    if (confettiPieces.length > 0) {
      requestAnimationFrame(animateConfetti);
    }
  }

  // ─── News Ticker ───
  const headlines = [
    'Keilah caught caring too much.',
    'Authorities report suspicious levels of emotional support.',
    'Scientists discover girlfriend became father overnight.',
    'Neighborhood reports repeated use of "Did you eat?"',
    'Ivan still confused.',
    'Family tree crashes due to unexpected relationship mapping.',
    'Experts remain baffled.',
    'Court hearing delayed because everyone started laughing.',
  ];

  function initTicker() {
    const track = $('#tickerTrack');
    if (!track) return;
    const items = headlines.map((h) =>
      `<span><span class="breaking">BREAKING:</span> ${h}</span>`
    );
    track.innerHTML = items.join('') + items.join('');
  }

  // ─── Hero Subtitle Rotation ───
  const subtitles = [
    'or should I say... daddy (help)',
    'still wondering how this happened',
    'biology is filing a complaint',
    'the family tree gave up',
    'my girlfriend accidentally became my father',
    'scientists remain confused',
    'the paperwork makes no sense',
    'this cannot be explained',
    'the government has questions',
  ];

  let subtitleIndex = 0;

  function rotateSubtitle() {
    const el = $('#heroSubtitle');
    if (!el) return;
    el.classList.add('fade');
    setTimeout(() => {
      el.textContent = subtitles[subtitleIndex];
      subtitleIndex = (subtitleIndex + 1) % subtitles.length;
      el.classList.remove('fade');
    }, 400);
  }

  // ─── Dashboard Stats ───
  const stats = [
    { label: 'Years of Father Experience', value: 18742, tooltip: 'Time is a social construct. Dad time is eternal.' },
    { label: 'Times Told Ivan To Sleep', value: 999999, tooltip: 'The counter broke. It kept going.' },
    { label: 'Hydration Reminders Sent', value: '∞', tooltip: 'Hydration is a lifestyle, not a suggestion.', isInfinity: true },
    { label: 'Protective Aura', value: '100%', tooltip: 'Radiating concern at maximum wattage.', isPercent: true },
    { label: 'Proud Parent Stares', value: 527, tooltip: 'Usually followed by "I\'m not upset, just disappointed."' },
    { label: 'Random Check-ins', value: 'Maximum', tooltip: '"Just thinking about you" texts: classified.', isText: true },
    { label: 'Snack Monitoring', value: 'Elite Tier', tooltip: 'She knows when you haven\'t eaten. Somehow.', isText: true },
    { label: '"Did You Eat?" Messages', value: 3800000, tooltip: 'Loading... Loading... Loading... there we go.', loading: true },
  ];

  function initDashboard() {
    const grid = $('#statsGrid');
    if (!grid) return;

    stats.forEach((stat, i) => {
      const card = document.createElement('div');
      card.className = 'stat-card';
      card.innerHTML = `
        <div class="stat-tooltip">${stat.tooltip}</div>
        <div class="stat-label">${stat.label}</div>
        <div class="stat-value" data-stat="${i}">${stat.loading ? 'Loading...' : stat.isText || stat.isInfinity ? stat.value : '0'}</div>
      `;
      grid.appendChild(card);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStats();
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(grid);
  }

  function animateStats() {
    stats.forEach((stat, i) => {
      const el = document.querySelector(`[data-stat="${i}"]`);
      if (!el) return;

      if (stat.loading) {
        let dots = 0;
        const loadInterval = setInterval(() => {
          dots = (dots % 3) + 1;
          el.textContent = 'Loading' + '.'.repeat(dots);
        }, 400);
        setTimeout(() => {
          clearInterval(loadInterval);
          animateCounter(el, 0, stat.value, 2000, (v) => formatNumber(v));
        }, 2000);
        return;
      }

      if (stat.isText || stat.isInfinity) {
        el.textContent = stat.value;
        return;
      }

      if (stat.isPercent) {
        animateCounter(el, 0, 100, 1500, (v) => v + '%');
        return;
      }

      animateCounter(el, 0, stat.value, 2000, formatNumber);
    });
  }

  function animateCounter(el, start, end, duration, formatter) {
    const startTime = performance.now();
    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * eased);
      el.textContent = formatter(current);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function formatNumber(n) {
    return n.toLocaleString();
  }

  // ─── Accept Father Button ───
  function initAcceptButton() {
    $('#acceptFatherBtn')?.addEventListener('click', () => {
      document.body.classList.add('screen-shake');
      setTimeout(() => document.body.classList.remove('screen-shake'), 500);
      launchConfetti(200);
      playSuccess();

      const popup = $('#achievementPopup');
      popup.classList.remove('hidden');
      playAchievement();
      setTimeout(() => popup.classList.add('hidden'), 5000);
    });
  }

  // ─── Certificate ───
  function initCertificate() {
    $('#approveCertBtn')?.addEventListener('click', () => {
      const stamp = $('#approvedStamp');
      const cert = $('#certificate');
      stamp.classList.remove('hidden');
      cert.classList.add('wiggle');
      setTimeout(() => cert.classList.remove('wiggle'), 500);
      launchConfetti(80);
      playPrinter();
    });
  }

  // ─── DNA Analyzer ───
  function initDNA() {
    $('#runDnaBtn')?.addEventListener('click', async () => {
      const display = $('#dnaDisplay');
      const btn = $('#runDnaBtn');
      btn.disabled = true;
      display.innerHTML = '';

      const steps = [
        'Collecting sample...',
        'Comparing genetics...',
        'Error...',
        'Relationship conflict detected...',
      ];

      for (const step of steps) {
        const line = document.createElement('div');
        line.className = 'dna-line';
        line.textContent = '> ' + step;
        display.appendChild(line);
        await sleep(800);
      }

      await sleep(500);
      display.innerHTML += `
        <div class="dna-result">
          <div><strong>0%</strong> biological father</div>
          <div><strong>100%</strong> emotional father</div>
          <div class="verdict">Verdict: Certified. ✓</div>
        </div>
      `;
      playSuccess();
      btn.disabled = false;
    });
  }

  // ─── Supreme Court ───
  function initCourt() {
    $('#gavelBtn')?.addEventListener('click', () => {
      const btn = $('#gavelBtn');
      btn.classList.add('bang');
      setTimeout(() => btn.classList.remove('bang'), 300);
      playGavel();
      $('#courtVerdict').classList.remove('hidden');
    });
  }

  // ─── Quiz ───
  const quizQuestions = [
    { q: 'Who reminds Ivan to drink water?', options: ['Keilah', 'A random stranger', 'The weather app', 'Nobody'] },
    { q: 'Who says "go to sleep"?', options: ['Keilah', 'His alarm clock', 'The moon', 'A concerned pigeon'] },
    { q: 'Who checks if he\'s eaten?', options: ['Keilah', 'The FDA', 'His stomach', 'GPS'] },
    { q: 'Who worries too much?', options: ['Keilah', 'Definitely not Keilah', 'Maybe Keilah?', 'Keilah (obviously)'] },
    { q: 'Who acts responsible?', options: ['Keilah', 'Ivan (lol)', 'The government', 'A magic 8-ball'] },
  ];

  let quizStep = 0;

  function initQuiz() {
    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    const container = $('#quizContent');
    if (!container) return;

    if (quizStep >= quizQuestions.length) {
      container.innerHTML = `
        <div class="quiz-complete">
          <h3>Congratulations.</h3>
          <p>You scored:</p>
          <p class="quiz-score">100%</p>
          <p>You are now officially Dad.</p>
        </div>
      `;
      playAchievement();
      launchConfetti(60);
      return;
    }

    const q = quizQuestions[quizStep];
    container.innerHTML = `
      <p class="quiz-question">${q.q}</p>
      <div class="quiz-options">
        ${q.options.map((opt, i) => `<button class="quiz-option" data-idx="${i}">${opt}</button>`).join('')}
      </div>
    `;

    container.querySelectorAll('.quiz-option').forEach((btn) => {
      btn.addEventListener('click', () => {
        btn.classList.add('correct');
        playTone(600, 0.1);
        setTimeout(() => {
          quizStep++;
          renderQuizQuestion();
        }, 800);
      });
    });
  }

  // ─── Father Meter ───
  const meterSteps = [0, 12, 48, 83, 99, 100];
  let meterRunning = false;

  function initMeter() {
    $('#runMeterBtn')?.addEventListener('click', runMeter);
  }

  async function runMeter() {
    if (meterRunning) return;
    meterRunning = true;
    const fill = $('#gaugeFill');
    const value = $('#gaugeValue');
    const status = $('#meterStatus');
    const circumference = 251;

    for (let i = 0; i < meterSteps.length; i++) {
      const pct = meterSteps[i];
      const offset = circumference - (pct / 100) * circumference;
      fill.style.strokeDashoffset = offset;
      value.textContent = pct + '%';
      status.textContent = pct < 100 ? 'Scanning...' : '';
      await sleep(600);
    }

    status.textContent = 'MAXIMUM DAD ENERGY DETECTED.';
    status.classList.add('alarm');
    playAlarm();
    launchConfetti(50);
    meterRunning = false;
  }

  // ─── Achievements ───
  const achievements = [
    { icon: 'concern', accent: 'gold', name: 'Master of Concern' },
    { icon: 'water', accent: 'blue', name: 'Hydration Supervisor' },
    { icon: 'shield', accent: 'blue', name: 'Protector Class' },
    { icon: 'sandwich', accent: 'gold', name: 'Snack Inspector' },
    { icon: 'moon', accent: 'gold', name: 'Bedtime Enforcer' },
    { icon: 'star', accent: 'gold', name: 'Legendary Caregiver' },
    { icon: 'phone', accent: 'blue', name: '"Text Me When You Get Home"' },
  ];

  function initAchievements() {
    const grid = $('#achievementsGrid');
    if (!grid) return;

    achievements.forEach((a, i) => {
      const badge = document.createElement('div');
      badge.className = 'achievement-badge';
      badge.innerHTML = `
        <div class="badge-icon">${window.Icons ? Icons.glassIcon(a.icon, 'lg', a.accent) : ''}</div>
        <div class="badge-name">${a.name}</div>
        <div class="badge-status">Locked</div>
      `;
      grid.appendChild(badge);

      setTimeout(() => {
        badge.classList.add('unlocked');
        badge.querySelector('.badge-status').textContent = 'Unlocked';
        if (i % 2 === 0) playAchievement();
      }, 800 + i * 400);
    });
  }

  // ─── Wisdom Generator ───
  const wisdomQuotes = [
    'Go to sleep.',
    'Drink water.',
    'Have you eaten?',
    'Don\'t spend all your money.',
    'Be safe.',
    'Charge your phone.',
    'Take your jacket.',
    'Text me when you get there.',
    'I\'m not upset... I\'m just disappointed.',
  ];

  function initWisdom() {
    $('#wisdomBtn')?.addEventListener('click', () => {
      const card = $('#wisdomCard');
      const quote = $('#wisdomQuote');
      card.classList.add('flip');
      setTimeout(() => {
        quote.textContent = '"' + wisdomQuotes[Math.floor(Math.random() * wisdomQuotes.length)] + '"';
        card.classList.remove('flip');
      }, 250);
      playTone(500, 0.08);
    });
  }

  // ─── Timeline ───
  const timelineEvents = [
    { title: 'Met Ivan', desc: 'Little did anyone know...' },
    { title: 'Started dating', desc: 'Relationship status: normal. For now.' },
    { title: 'Started caring', desc: 'The first warning sign.' },
    { title: 'Started checking in', desc: '"How was your day?" energy activated.' },
    { title: 'Became protective', desc: 'Protective aura unlocked.' },
    { title: 'Accidentally evolved into Father', desc: 'Biology was not consulted.' },
    { title: 'Accepted destiny', desc: 'Resistance was futile.' },
    { title: 'Earned lifetime certification', desc: 'No refunds. No returns.' },
  ];

  function initTimeline() {
    const list = $('#timelineList');
    if (!list) return;

    timelineEvents.forEach((ev) => {
      const item = document.createElement('div');
      item.className = 'timeline-item';
      item.innerHTML = `<h4>${ev.title}</h4><p>${ev.desc}</p>`;
      list.appendChild(item);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.2 });

    list.querySelectorAll('.timeline-item').forEach((item, i) => {
      setTimeout(() => observer.observe(item), i * 100);
    });
  }

  // ─── Performance Review ───
  function initReview() {
    const grades = [
      ['Concern for Ivan', 'A+'],
      ['Checking if he ate', 'A+'],
      ['Being supportive', 'A+'],
      ['Protectiveness', 'A++'],
      ['Ability to randomly become Father', 'Off the charts'],
    ];

    const container = $('#reviewGrades');
    if (!container) return;

    grades.forEach(([cat, grade]) => {
      const row = document.createElement('div');
      row.className = 'review-row';
      row.innerHTML = `<span>${cat}</span><span>${grade}</span>`;
      container.appendChild(row);
    });
  }

  // ─── Emergency Button ───
  function initEmergency() {
    $('#emergencyBtn')?.addEventListener('click', () => {
      document.body.classList.add('emergency-flash', 'emergency-pulse');

      const overlay = document.createElement('div');
      overlay.className = 'siren-overlay';
      document.body.appendChild(overlay);

      playAlarm();
      setTimeout(() => playAlarm(), 300);

      setTimeout(() => {
        $('#emergencyModal').classList.remove('hidden');
        document.body.classList.remove('emergency-flash', 'emergency-pulse');
        overlay.remove();
      }, 900);
    });

    $('#closeEmergency')?.addEventListener('click', () => {
      $('#emergencyModal').classList.add('hidden');
    });
  }

  // ─── Slot Machine ───
  const slotSymbols = ['DAD', 'FATHER', 'PARENT', 'CAREGIVER', 'KEILAH'];
  let spinning = false;

  function initSlots() {
    const reels = [$('#reel1'), $('#reel2'), $('#reel3')];
    reels.forEach((reel) => {
      const inner = reel.querySelector('.reel-inner');
      slotSymbols.forEach((sym) => {
        const item = document.createElement('div');
        item.className = 'reel-item';
        item.textContent = sym;
        inner.appendChild(item);
      });
      slotSymbols.forEach((sym) => {
        const item = document.createElement('div');
        item.className = 'reel-item';
        item.textContent = sym;
        inner.appendChild(item);
      });
    });

    $('#spinBtn')?.addEventListener('click', spinSlots);
  }

  async function spinSlots() {
    if (spinning) return;
    spinning = true;
    $('#slotResult').classList.add('hidden');

    const reels = [$('#reel1'), $('#reel2'), $('#reel3')];
    const results = [];

    for (let r = 0; r < 3; r++) {
      const inner = reels[r].querySelector('.reel-inner');
      const targetIdx = Math.floor(Math.random() * slotSymbols.length);
      results.push(slotSymbols[targetIdx]);

      await new Promise((resolve) => {
        let speed = 20;
        let pos = 0;
        const totalSpins = 20 + r * 10 + targetIdx;

        function spin() {
          pos++;
          inner.style.transform = `translateY(-${(pos % (slotSymbols.length * 2)) * 100}px)`;
          if (pos < totalSpins) {
            if (pos > totalSpins - 10) speed += 3;
            setTimeout(spin, speed);
          } else {
            inner.style.transform = `translateY(-${targetIdx * 100}px)`;
            resolve();
          }
        }
        spin();
      });
    }

    $('#slotResult').classList.remove('hidden');
    playSuccess();
    launchConfetti(40);
    spinning = false;
  }

  // ─── Radar ───
  const radarDetections = [
    { label: 'Concern', x: 30, y: 25 },
    { label: 'Kindness', x: 70, y: 35 },
    { label: 'Protective Instinct', x: 45, y: 60 },
    { label: 'Random check-in text', x: 65, y: 70 },
    { label: 'Peak Father Energy', x: 35, y: 75 },
  ];

  function initRadar() {
    const screen = $('#radarScreen');
    if (!screen) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          radarDetections.forEach((d, i) => {
            setTimeout(() => {
              const blip = document.createElement('div');
              blip.className = 'radar-blip';
              blip.textContent = 'Detected: ' + d.label;
              blip.style.left = d.x + '%';
              blip.style.top = d.y + '%';
              $('#radarBlips').appendChild(blip);
              playTone(800 + i * 100, 0.08, 'sine', 0.05);
            }, i * 800);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(screen);
  }

  // ─── Flipbook Handbook ───
  const handbookRules = [
    'Check if Ivan ate.',
    'Tell Ivan to sleep.',
    'Remind Ivan to drink water.',
    'Continue being amazing.',
    'Accept Father status.',
  ];

  let flipPage = 0;

  function initFlipbook() {
    renderFlipPage();

    $('#flipPrev')?.addEventListener('click', () => {
      if (flipPage > 0) { flipPage--; renderFlipPage(); }
    });
    $('#flipNext')?.addEventListener('click', () => {
      if (flipPage < handbookRules.length - 1) { flipPage++; renderFlipPage(); }
    });
  }

  function renderFlipPage() {
    const pages = $('#flipPages');
    if (!pages) return;
    pages.innerHTML = `
      <div class="flip-page">
        <div class="rule-num">Rule #${flipPage + 1}</div>
        <div class="rule-text">${handbookRules[flipPage]}</div>
      </div>
    `;
    $('#flipIndicator').textContent = `Page ${flipPage + 1} of ${handbookRules.length}`;
  }

  // ─── Finale Hearts ───
  function initFinaleHearts() {
    const container = $('#heartsContainer');
    if (!container) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInterval(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.innerHTML = window.Icons
              ? Icons.glassIcon('heart', ['sm','md','sm'][Math.floor(Math.random() * 3)], 'pink')
              : '';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (4 + Math.random() * 4) + 's';
            container.appendChild(heart);
            setTimeout(() => heart.remove(), 8000);
          }, 600);
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    observer.observe($('#finale'));
  }

  // ─── Scroll Animations ───
  function initScrollAnimations() {
    const sections = $$('.section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    sections.forEach((s) => observer.observe(s));
  }

  // ─── Easter Eggs ───

  // Konami Code
  document.addEventListener('keydown', (e) => {
    konamiSequence.push(e.key);
    if (konamiSequence.length > KONAMI_CODE.length) konamiSequence.shift();

    if (konamiSequence.join(',') === KONAMI_CODE.join(',')) {
      $('#secretModal').classList.remove('hidden');
      playAchievement();
      konamiSequence.length = 0;
    }

    // ihaveeaten typing
    if (e.key.length === 1) {
      typedBuffer += e.key.toLowerCase();
      if (typedBuffer.length > EASTER_EGG_PHRASE.length) {
        typedBuffer = typedBuffer.slice(-EASTER_EGG_PHRASE.length);
      }
      if (typedBuffer === EASTER_EGG_PHRASE) {
        spawnFlyingSandwiches();
        typedBuffer = '';
      }
    }
  });

  $('#closeSecret')?.addEventListener('click', () => {
    $('#secretModal').classList.add('hidden');
  });

  // Double-click logo
  let logoClickTimer = null;
  $('#navLogo')?.addEventListener('click', () => {
    if (logoClickTimer) {
      clearTimeout(logoClickTimer);
      logoClickTimer = null;
      const toast = $('#xpToast');
      toast.classList.remove('hidden');
      playAchievement();
      setTimeout(() => toast.classList.add('hidden'), 2000);
    } else {
      logoClickTimer = setTimeout(() => { logoClickTimer = null; }, 400);
    }
  });

  // Footer 5 clicks
  $('#siteFooter')?.addEventListener('click', () => {
    footerClickCount++;
    if (footerClickCount >= 5) {
      $('#footerSecret').classList.remove('hidden');
      playSuccess();
      footerClickCount = 0;
    }
  });

  function spawnFlyingSandwiches() {
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        const sandwich = document.createElement('div');
        sandwich.className = 'flying-sandwich';
        sandwich.innerHTML = window.Icons ? Icons.glassIcon('sandwich', 'lg', 'gold') : '';
        sandwich.style.left = Math.random() * window.innerWidth + 'px';
        sandwich.style.top = Math.random() * window.innerHeight + 'px';
        sandwich.style.setProperty('--tx', (Math.random() - 0.5) * 400 + 'px');
        sandwich.style.setProperty('--ty', (Math.random() - 0.5) * 400 + 'px');
        document.body.appendChild(sandwich);
        setTimeout(() => sandwich.remove(), 3000);
      }, i * 100);
    }
    playConfettiPop();
  }

  // ─── Init Main Experience ───
  function initMainExperience() {
    if (window.Icons) Icons.injectSectionIcons();

    initConfettiCanvas();
    initParticles();
    initMouseEffects();
    initTicker();
    rotateSubtitle();
    setInterval(rotateSubtitle, 4000);
    initDocumentary();
    if (window.FatherGames) FatherGames.initArcade();
    initEvidence();
    initDashboard();
    initAcceptButton();
    initCertificate();
    initDNA();
    initCourt();
    initQuiz();
    initMeter();
    initAchievements();
    initWisdom();
    initTimeline();
    initReview();
    initEmergency();
    initSlots();
    initRadar();
    initFlipbook();
    initFinaleHearts();
    initScrollAnimations();

    $('#hero')?.classList.add('visible');
    $('#evidence')?.classList.add('visible');
  }

  // ─── Start ───
  document.addEventListener('DOMContentLoaded', () => {
    runBootSequence();
  });
})();
