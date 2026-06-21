/* Brutally Hard Father Games Arcade */
(function (global) {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);

  function playFail() {
    if (window.AppAudio?.playTone) window.AppAudio.playTone(150, 0.3, 'sawtooth', 0.15);
  }

  function playWin() {
    if (window.AppAudio?.playSuccess) window.AppAudio.playSuccess();
  }

  // ─── Game 1: Father Says (Simon, impossibly fast) ───
  function initFatherSays(container) {
    const btns = ['SLEEP', 'EAT', 'WATER', 'SAFE'];
    let sequence = [];
    let playerStep = 0;
    let round = 0;
    let playing = false;
    let speed = 420;

    container.innerHTML = `
      <div class="game-panel" id="fatherSaysPanel">
        <p class="game-desc">Memorize the dad commands. One mistake = you're grounded forever.</p>
        <div class="game-score-row"><span>Round: <strong id="fsRound">0</strong></span><span>Best: <strong id="fsBest">0</strong></span></div>
        <div class="father-says-grid" id="fsGrid"></div>
        <p class="game-status" id="fsStatus">Press START. Good luck.</p>
        <button class="btn-primary game-start" id="fsStart" type="button">START (you won't win)</button>
      </div>
    `;

    const grid = $('#fsGrid', container);
    btns.forEach((label) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'fs-btn';
      b.textContent = label;
      b.dataset.cmd = label;
      b.disabled = true;
      grid.appendChild(b);
    });

    let best = parseInt(localStorage.getItem('fsBest') || '0', 10);

    async function flashBtn(cmd, lit) {
      const btn = grid.querySelector(`[data-cmd="${cmd}"]`);
      if (!btn) return;
      btn.classList.toggle('lit', lit);
      await sleep(lit ? speed : 120);
      btn.classList.remove('lit');
    }

    async function playSequence() {
      playing = true;
      playerStep = 0;
      $('#fsStatus', container).textContent = 'Watch...';
      grid.querySelectorAll('.fs-btn').forEach((b) => (b.disabled = true));
      await sleep(400);
      for (const cmd of sequence) {
        await flashBtn(cmd, true);
        await sleep(80);
      }
      $('#fsStatus', container).textContent = 'YOUR TURN. Don\'t choke.';
      grid.querySelectorAll('.fs-btn').forEach((b) => (b.disabled = false));
      playing = false;
    }

    function fail() {
      playFail();
      $('#fsStatus', container).textContent = `FAILED at round ${round}. Dad is disappointed.`;
      grid.querySelectorAll('.fs-btn').forEach((b) => (b.disabled = true));
      $('#fsStart', container).disabled = false;
      sequence = [];
      round = 0;
      speed = 420;
      $('#fsRound', container).textContent = '0';
    }

    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.fs-btn');
      if (!btn || btn.disabled || playing) return;
      const cmd = btn.dataset.cmd;
      flashBtn(cmd, true);
      if (cmd !== sequence[playerStep]) {
        fail();
        return;
      }
      playerStep++;
      if (playerStep >= sequence.length) {
        round++;
        $('#fsRound', container).textContent = round;
        if (round > best) {
          best = round;
          localStorage.setItem('fsBest', String(best));
          $('#fsBest', container).textContent = best;
        }
        speed = Math.max(180, speed - 35);
        $('#fsStatus', container).textContent = `Round ${round} cleared. It gets worse now.`;
        grid.querySelectorAll('.fs-btn').forEach((b) => (b.disabled = true));
        setTimeout(() => {
          sequence.push(btns[Math.floor(Math.random() * btns.length)]);
          playSequence();
        }, 900);
      }
    });

    $('#fsStart', container).addEventListener('click', () => {
      sequence = [btns[Math.floor(Math.random() * btns.length)]];
      round = 0;
      speed = 420;
      $('#fsRound', container).textContent = '0';
      $('#fsBest', container).textContent = best;
      $('#fsStart', container).disabled = true;
      playSequence();
    });
    $('#fsBest', container).textContent = best;
  }

  // ─── Game 2: Did You Eat? (shrinking moving button) ───
  function initDidYouEat(container) {
    container.innerHTML = `
      <div class="game-panel eat-game" id="eatGame">
        <p class="game-desc">Click "I ATE" before it vanishes. 18 clicks. Button shrinks every time.</p>
        <div class="game-score-row"><span>Clicks: <strong id="eatCount">0</strong>/18</span><span>Time: <strong id="eatTime">45</strong>s</span></div>
        <div class="eat-arena" id="eatArena">
          <button type="button" class="eat-btn" id="eatBtn" disabled>I ATE</button>
        </div>
        <p class="game-status" id="eatStatus">START to begin suffering.</p>
        <button class="btn-primary game-start" id="eatStart" type="button">START</button>
      </div>
    `;

    const arena = $('#eatArena', container);
    const btn = $('#eatBtn', container);
    let clicks = 0;
    let timer = null;
    let moveTimer = null;
    let timeLeft = 45;
    let scale = 1;

    function moveBtn() {
      const ar = arena.getBoundingClientRect();
      const bw = btn.offsetWidth;
      const bh = btn.offsetHeight;
      const maxX = ar.width - bw - 8;
      const maxY = ar.height - bh - 8;
      btn.style.left = Math.random() * maxX + 'px';
      btn.style.top = Math.random() * maxY + 'px';
      scale = Math.max(0.35, scale - 0.04);
      btn.style.transform = `scale(${scale})`;
    }

    function endGame(win) {
      clearInterval(timer);
      clearInterval(moveTimer);
      btn.disabled = true;
      $('#eatStart', container).disabled = false;
      if (win) {
        playWin();
        $('#eatStatus', container).textContent = 'Impossible. You actually ate enough times.';
      } else {
        playFail();
        $('#eatStatus', container).textContent = 'Time\'s up. Dad doesn\'t believe you.';
      }
    }

    $('#eatStart', container).addEventListener('click', () => {
      clicks = 0;
      scale = 1;
      timeLeft = 45;
      $('#eatCount', container).textContent = '0';
      $('#eatTime', container).textContent = '45';
      btn.disabled = false;
      btn.style.transform = 'scale(1)';
      $('#eatStart', container).disabled = true;
      moveBtn();
      moveTimer = setInterval(moveBtn, 650);
      timer = setInterval(() => {
        timeLeft--;
        $('#eatTime', container).textContent = timeLeft;
        if (timeLeft <= 0) endGame(false);
      }, 1000);
    });

    btn.addEventListener('click', () => {
      clicks++;
      $('#eatCount', container).textContent = clicks;
      if (clicks >= 18) endGame(true);
      else moveBtn();
    });
  }

  // ─── Game 3: Bedtime Maze (walls shift, tiny path) ───
  function initBedtimeMaze(container) {
    const W = 14, H = 10, CELL = 22;
    container.innerHTML = `
      <div class="game-panel">
        <p class="game-desc">Drag the dot to the bed without touching walls. Walls MOVE every 2 seconds.</p>
        <canvas id="mazeCanvas" width="${W * CELL}" height="${H * CELL}" class="game-canvas"></canvas>
        <p class="game-status" id="mazeStatus">Drag the glowing dot to the moon.</p>
      </div>
    `;

    const canvas = $('#mazeCanvas', container);
    const ctx = canvas.getContext('2d');
    let walls = [];
    let player = { x: 1, y: 1 };
    const goal = { x: W - 2, y: H - 2 };
    let dragging = false;
    let alive = true;

    function genWalls() {
      walls = [];
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          if (x === 0 || y === 0 || x === W - 1 || y === H - 1) walls.push({ x, y });
          else if (Math.random() < 0.22 && !(x < 3 && y < 3) && !(x > W - 4 && y > H - 4)) walls.push({ x, y });
        }
      }
    }

    function draw() {
      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      walls.forEach((w) => {
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(w.x * CELL, w.y * CELL, CELL, CELL);
      });
      ctx.fillStyle = '#e8c547';
      ctx.beginPath();
      ctx.arc(goal.x * CELL + CELL / 2, goal.y * CELL + CELL / 2, CELL / 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#7eb8da';
      ctx.beginPath();
      ctx.arc(player.x * CELL + CELL / 2, player.y * CELL + CELL / 2, CELL / 3, 0, Math.PI * 2);
      ctx.fill();
    }

    function hitWall(px, py) {
      const gx = Math.floor(px / CELL);
      const gy = Math.floor(py / CELL);
      return walls.some((w) => w.x === gx && w.y === gy);
    }

    function checkWin() {
      if (player.x === goal.x && player.y === goal.y) {
        alive = false;
        playWin();
        $('#mazeStatus', container).textContent = 'You reached bed. Unheard of.';
      }
    }

    genWalls();
    draw();
    setInterval(() => {
      if (!alive) return;
      genWalls();
      if (hitWall(player.x * CELL, player.y * CELL)) {
        alive = false;
        playFail();
        $('#mazeStatus', container).textContent = 'Wall ate you. Go to sleep anyway.';
      }
      draw();
    }, 2000);

    canvas.addEventListener('pointerdown', (e) => {
      dragging = true;
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointerup', () => (dragging = false));
    canvas.addEventListener('pointermove', (e) => {
      if (!dragging || !alive) return;
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      if (hitWall(px, py)) {
        alive = false;
        playFail();
        $('#mazeStatus', container).textContent = 'You touched a wall. Classic Ivan.';
        return;
      }
      player.x = Math.floor(px / CELL);
      player.y = Math.floor(py / CELL);
      draw();
      checkWin();
    });
  }

  // ─── Game 4: Hydration Hell (canvas catch) ───
  function initHydrationHell(container) {
    container.innerHTML = `
      <div class="game-panel">
        <p class="game-desc">Catch 40 water drops with a tiny cup. They fall FAST and fake drops explode you.</p>
        <canvas id="waterCanvas" width="320" height="400" class="game-canvas"></canvas>
        <p class="game-status" id="waterStatus">Score: <strong id="waterScore">0</strong>/40</p>
        <button class="btn-primary game-start" id="waterStart" type="button">START</button>
      </div>
    `;

    const canvas = $('#waterCanvas', container);
    const ctx = canvas.getContext('2d');
    let cupX = 140;
    let drops = [];
    let score = 0;
    let running = false;
    let animId = null;
    let spawnId = null;

    function stopGame() {
      running = false;
      clearInterval(spawnId);
      cancelAnimationFrame(animId);
      $('#waterStart', container).disabled = false;
    }

    function loop() {
      if (!running) return;
      ctx.fillStyle = '#0d1a2d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drops.forEach((d) => {
        d.y += d.speed;
        ctx.fillStyle = d.fake ? '#e74c3c' : '#7eb8da';
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
        if (d.y > canvas.height - 40 && d.y < canvas.height - 10 && Math.abs(d.x - cupX) < 28) {
          if (d.fake) {
            stopGame();
            playFail();
            $('#waterStatus', container).innerHTML = 'FAKE DROP. You drank poison water. Score: ' + score;
            return;
          }
          score++;
          $('#waterScore', container).textContent = score;
          d.y = 9999;
          if (score >= 40) {
            stopGame();
            playWin();
            $('#waterStatus', container).innerHTML = 'Hydration achieved. Dad approves.';
          }
        }
      });
      drops = drops.filter((d) => d.y < canvas.height + 20);
      ctx.fillStyle = '#e8c547';
      ctx.fillRect(cupX - 25, canvas.height - 35, 50, 12);
      animId = requestAnimationFrame(loop);
    }

    canvas.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      cupX = Math.max(25, Math.min(canvas.width - 25, e.clientX - rect.left));
    });

    $('#waterStart', container).addEventListener('click', () => {
      score = 0;
      drops = [];
      running = true;
      $('#waterScore', container).textContent = '0';
      $('#waterStart', container).disabled = true;
      $('#waterStatus', container).innerHTML = 'Score: <strong id="waterScore">0</strong>/40';
      spawnId = setInterval(() => {
        if (!running) return;
        drops.push({
          x: 20 + Math.random() * (canvas.width - 40),
          y: -10,
          r: 4 + Math.random() * 3,
          speed: 4 + Math.random() * 5 + score * 0.08,
          fake: Math.random() < 0.18,
        });
      }, 380);
      loop();
    });
  }

  // ─── Game 5: Impossible Math (dad homework) ───
  function initImpossibleMath(container) {
    container.innerHTML = `
      <div class="game-panel">
        <p class="game-desc">Solve 25 problems in 40 seconds. Wrong = -4 seconds. Gets absurd fast.</p>
        <div class="game-score-row"><span>Correct: <strong id="mathScore">0</strong>/25</span><span>Time: <strong id="mathTime">40</strong>s</span></div>
        <p class="math-problem" id="mathProblem">—</p>
        <input type="number" class="math-input" id="mathInput" disabled placeholder="answer">
        <p class="game-status" id="mathStatus"></p>
        <button class="btn-primary game-start" id="mathStart" type="button">START</button>
      </div>
    `;

    let correct = 0;
    let timeLeft = 40;
    let timer = null;
    let answer = 0;

    function newProblem() {
      const n = Math.min(correct + 3, 12);
      const ops = ['+', '-', '×'];
      const op = ops[Math.floor(Math.random() * ops.length)];
      let a = Math.floor(Math.random() * n) + 1;
      let b = Math.floor(Math.random() * n) + 1;
      if (op === '-') { if (a < b) [a, b] = [b, a]; answer = a - b; }
      else if (op === '×') { answer = a * b; }
      else answer = a + b;
      if (correct > 8) { a *= Math.floor(Math.random() * 5) + 2; b *= Math.floor(Math.random() * 5) + 2; answer = a + b; }
      $('#mathProblem', container).textContent = `${a} ${op} ${b} = ?`;
    }

    function end(won) {
      clearInterval(timer);
      $('#mathInput', container).disabled = true;
      $('#mathStart', container).disabled = false;
      if (won) {
        playWin();
        $('#mathStatus', container).textContent = 'You passed dad math. Suspicious.';
      } else {
        playFail();
        $('#mathStatus', container).textContent = 'Failed homework. No dinner.';
      }
    }

    $('#mathStart', container).addEventListener('click', () => {
      correct = 0;
      timeLeft = 40;
      $('#mathScore', container).textContent = '0';
      $('#mathTime', container).textContent = '40';
      $('#mathInput', container).disabled = false;
      $('#mathInput', container).value = '';
      $('#mathStart', container).disabled = true;
      newProblem();
      timer = setInterval(() => {
        timeLeft--;
        $('#mathTime', container).textContent = timeLeft;
        if (timeLeft <= 0) end(false);
      }, 1000);
    });

    $('#mathInput', container).addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const val = parseInt($('#mathInput', container).value, 10);
      if (val === answer) {
        correct++;
        $('#mathScore', container).textContent = correct;
        if (correct >= 25) end(true);
        else newProblem();
        $('#mathInput', container).value = '';
      } else {
        timeLeft = Math.max(0, timeLeft - 4);
        $('#mathTime', container).textContent = timeLeft;
        playFail();
      }
    });
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function initArcade() {
    const tabs = $('#gameTabs');
    const area = $('#gameArea');
    if (!tabs || !area) return;

    const games = [
      { id: 'fatherSays', label: 'Father Says', init: initFatherSays },
      { id: 'didYouEat', label: 'Did You Eat?', init: initDidYouEat },
      { id: 'maze', label: 'Bedtime Maze', init: initBedtimeMaze },
      { id: 'hydration', label: 'Hydration Hell', init: initHydrationHell },
      { id: 'math', label: 'Dad Math', init: initImpossibleMath },
    ];

    games.forEach((g, i) => {
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'game-tab' + (i === 0 ? ' active' : '');
      tab.textContent = g.label;
      tab.dataset.game = g.id;
      tabs.appendChild(tab);
    });

    function loadGame(id) {
      const g = games.find((x) => x.id === id);
      if (!g) return;
      area.innerHTML = '';
      g.init(area);
    }

    tabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.game-tab');
      if (!tab) return;
      tabs.querySelectorAll('.game-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      loadGame(tab.dataset.game);
    });

    loadGame(games[0].id);
  }

  global.FatherGames = { initArcade };
})(window);
