/**
 * LUDO GAME CLASSIC - OFFICIAL WEB SCRIPT
 * Developed by Quantum Core Studios
 * Features: Responsive Layout Switcher, Web Audio SFX, 3D Dice Roller,
 *           Interactive Lucky Wheel Canvas, Live World Chat Simulator,
 *           Instagram Profile Inspector & Video Controls.
 */

document.addEventListener('DOMContentLoaded', () => {
  initLayoutSwitcher();
  initSoundEngine();
  initDiceLab();
  initLuckyWheel();
  initWorldChat();
  initArenasExplorer();
  initVideoPlayer();
  initFaqAccordion();
  initMobileBottomNav();
  initDownloadModal();
});

/* ==========================================================================
   1. LAYOUT SWITCHER & DETECTOR (Desktop vs Mobile View)
   ========================================================================== */
function initLayoutSwitcher() {
  const btnAuto = document.getElementById('btnLayoutAuto');
  const btnDesktop = document.getElementById('btnLayoutDesktop');
  const btnMobile = document.getElementById('btnLayoutMobile');
  const sizeIndicator = document.getElementById('screenSizeIndicator');

  function updateScreenIndicator() {
    const width = window.innerWidth;
    if (sizeIndicator) {
      if (document.body.classList.contains('force-mobile')) {
        sizeIndicator.textContent = 'Mobile Simulated (390px)';
      } else if (document.body.classList.contains('force-desktop')) {
        sizeIndicator.textContent = `Desktop Forced (${width}px)`;
      } else {
        const mode = width <= 768 ? 'Mobile UI Active' : 'Desktop UI Active';
        sizeIndicator.textContent = `${mode} (${width}px)`;
      }
    }
  }

  function setActiveBtn(activeBtn) {
    [btnAuto, btnDesktop, btnMobile].forEach(btn => {
      if (btn) btn.classList.remove('active');
    });
    if (activeBtn) activeBtn.classList.add('active');
  }

  if (btnAuto) {
    btnAuto.addEventListener('click', () => {
      document.body.classList.remove('force-desktop', 'force-mobile');
      setActiveBtn(btnAuto);
      updateScreenIndicator();
      showToast('Switched to Auto Responsive layout (Adapts to viewport)');
    });
  }

  if (btnDesktop) {
    btnDesktop.addEventListener('click', () => {
      document.body.classList.remove('force-mobile');
      document.body.classList.add('force-desktop');
      setActiveBtn(btnDesktop);
      updateScreenIndicator();
      showToast('Forced Desktop / Tablet UI layout');
    });
  }

  if (btnMobile) {
    btnMobile.addEventListener('click', () => {
      document.body.classList.remove('force-desktop');
      document.body.classList.add('force-mobile');
      setActiveBtn(btnMobile);
      updateScreenIndicator();
      showToast('Rendering Mobile Screen Layout in Phone Preview frame');
    });
  }

  window.addEventListener('resize', updateScreenIndicator);
  updateScreenIndicator();
}

/* ==========================================================================
   2. SYNTHESIZED WEB AUDIO SOUND ENGINE (No external MP3 required!)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initSoundEngine() {
  const soundBtns = document.querySelectorAll('.sound-toggle-btn');

  function toggleSound() {
    soundEnabled = !soundEnabled;
    soundBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
      }
      btn.title = soundEnabled ? 'Mute Game SFX' : 'Enable Game SFX';
    });
    showToast(soundEnabled ? '🔊 Audio effects enabled' : '🔇 Audio muted');
  }

  soundBtns.forEach(btn => btn.addEventListener('click', toggleSound));
}

function playSynthesizedSound(type) {
  if (!soundEnabled) return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    if (type === 'dice') {
      // Rapid rolling clicks followed by wooden thud
      for (let i = 0; i < 4; i++) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320 + i * 80, now + i * 0.08);
        gain.gain.setValueAtTime(0.2, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.06);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.07);
      }
    } else if (type === 'win') {
      // Victorious major triad chime
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.25, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.45);
      });
    } else if (type === 'click') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'wheel-tick') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.025);
    }
  } catch (e) {
    console.warn('AudioContext error or not supported:', e);
  }
}

/* ==========================================================================
   3. 3D DICE ROLLER PLAYGROUND
   ========================================================================== */
function initDiceLab() {
  const diceBox = document.getElementById('dice3dBox');
  const rollBtn = document.getElementById('btnRollDice');
  const resultBanner = document.getElementById('diceResultBanner');
  const heroDiceCard = document.getElementById('heroDiceCard');
  let isRolling = false;

  const rotations = {
    1: { x: 0, y: 0 },
    2: { x: 0, y: -90 },
    3: { x: 0, y: -180 },
    4: { x: 0, y: 90 },
    5: { x: -90, y: 0 },
    6: { x: 90, y: 0 }
  };

  function executeRoll() {
    if (isRolling) return;
    isRolling = true;
    playSynthesizedSound('dice');

    if (diceBox) {
      // Add multiple 360-degree spins to create a dramatic tumbling effect
      const extraSpinsX = (Math.floor(Math.random() * 3) + 2) * 360;
      const extraSpinsY = (Math.floor(Math.random() * 3) + 2) * 360;
      const rollNumber = Math.floor(Math.random() * 6) + 1;
      const target = rotations[rollNumber];

      diceBox.style.transform = `rotateX(${target.x + extraSpinsX}deg) rotateY(${target.y + extraSpinsY}deg)`;

      if (resultBanner) {
        resultBanner.textContent = '🎲 Rolling dice across the board...';
        resultBanner.style.color = 'var(--gold-light)';
      }

      if (heroDiceCard) {
        heroDiceCard.classList.add('rolling');
      }

      setTimeout(() => {
        isRolling = false;
        if (heroDiceCard) {
          heroDiceCard.classList.remove('rolling');
          const heroDiceNum = heroDiceCard.querySelector('#heroDiceNumber');
          if (heroDiceNum) heroDiceNum.textContent = rollNumber;
        }

        if (rollNumber === 6) {
          playSynthesizedSound('win');
          if (resultBanner) {
            resultBanner.innerHTML = `<span style="color:#ef4444;">🔥 YOU ROLLED A 6!</span> Bonus turn & ladder unlocked!`;
          }
          showToast('🎉 Rolled a 6! Extra Bonus Turn awarded in Ludo Classic!');
        } else {
          playSynthesizedSound('click');
          if (resultBanner) {
            resultBanner.innerHTML = `You rolled a <strong style="color:var(--gold-light);">${rollNumber}</strong>! Ready to advance pawns.`;
          }
        }
      }, 850);
    }
  }

  if (rollBtn) rollBtn.addEventListener('click', executeRoll);
  if (diceBox) diceBox.addEventListener('click', executeRoll);
  if (heroDiceCard) heroDiceCard.addEventListener('click', executeRoll);
}

/* ==========================================================================
   4. INTERACTIVE LUCKY WHEEL CANVAS (Desktop & Mobile)
   ========================================================================== */
function initLuckyWheel() {
  const desktopCanvas = document.getElementById('luckyWheelCanvas');
  const mobileCanvas = document.getElementById('luckyWheelCanvasMobile');
  const spinFreeBtn = document.getElementById('btnSpinFree');
  const spinDiamondBtn = document.getElementById('btnSpinDiamond');
  const mobileSpinBtn = document.getElementById('btnMobileSpin');
  
  let currentRotation = 0;
  let isSpinning = false;

  const slices = [
    { text: '+500 Diamonds', color: '#1e1b4b', textColor: '#60a5fa', icon: '💎' },
    { text: '+1,000 Gold', color: '#78350f', textColor: '#fde047', icon: '🪙' },
    { text: 'Grandmaster', color: '#831843', textColor: '#f472b6', icon: '👑' },
    { text: '24h Enhancer', color: '#14532d', textColor: '#4ade80', icon: '⚡' },
    { text: 'Gold Dice', color: '#b45309', textColor: '#ffffff', icon: '🎲' },
    { text: '+250 Gold', color: '#451a03', textColor: '#fef08a', icon: '🪙' },
    { text: 'Blue Tick', color: '#0369a1', textColor: '#38bdf8', icon: '🛡️' },
    { text: 'Mystery Chest', color: '#581c87', textColor: '#e9d5ff', icon: '🎁' }
  ];

  const numSlices = slices.length;
  const arcSize = (2 * Math.PI) / numSlices;

  function drawWheelOnCanvas(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 8;

    ctx.clearRect(0, 0, width, height);

    slices.forEach((slice, i) => {
      const angle = i * arcSize;
      ctx.beginPath();
      ctx.fillStyle = slice.color;
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + arcSize);
      ctx.lineTo(centerX, centerY);
      ctx.fill();

      // Border between slices
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text & Icon
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + arcSize / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = slice.textColor;
      ctx.font = `bold ${width < 300 ? '11px' : '13px'} Outfit, sans-serif`;
      ctx.fillText(`${slice.icon} ${slice.text}`, radius - (width < 300 ? 12 : 20), 4);
      ctx.restore();
    });

    // Outer decorative gold rim
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = width < 300 ? 4 : 6;
    ctx.stroke();
  }

  drawWheelOnCanvas(desktopCanvas);
  drawWheelOnCanvas(mobileCanvas);

  function spinWheel(type) {
    if (isSpinning) return;
    isSpinning = true;
    playSynthesizedSound('click');

    const winningIndex = Math.floor(Math.random() * numSlices);
    const winningSlice = slices[winningIndex];

    const extraRotations = (Math.floor(Math.random() * 4) + 5) * 360;
    const sliceAngleDeg = (360 / numSlices);
    const targetDeg = extraRotations + (360 - (winningIndex * sliceAngleDeg + sliceAngleDeg / 2) + 270) % 360;

    currentRotation += targetDeg;

    [desktopCanvas, mobileCanvas].forEach(c => {
      if (c) {
        c.style.transition = 'transform 4.5s cubic-bezier(0.15, 0.9, 0.1, 1)';
        c.style.transform = `rotate(${currentRotation}deg)`;
      }
    });

    // Play tick sound during spin
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      tickCount++;
      if (tickCount < 26) {
        playSynthesizedSound('wheel-tick');
      } else {
        clearInterval(tickInterval);
      }
    }, 150);

    setTimeout(() => {
      isSpinning = false;
      playSynthesizedSound('win');
      showToast(`🎰 Jackpot! You won: ${winningSlice.icon} ${winningSlice.text}!`);
    }, 4600);
  }

  if (spinFreeBtn) {
    spinFreeBtn.addEventListener('click', () => spinWheel('free'));
  }
  if (spinDiamondBtn) {
    spinDiamondBtn.addEventListener('click', () => spinWheel('diamond'));
  }
  if (mobileSpinBtn) {
    mobileSpinBtn.addEventListener('click', () => spinWheel('free'));
  }
}

/* ==========================================================================
   5. REALISTIC WORLD CHAT & INSTAGRAM PROFILE INSPECTOR
   ========================================================================== */
const sampleChatters = [
  {
    name: 'ProdiptoPal',
    flag: '🇮🇳',
    title: 'Supreme Architect',
    blueTick: true,
    bio: 'Founder, CEO & Lead Developer of Ludo Game Classic. Catch me on the International Arena!',
    matches: '1,420',
    winRate: '88.4%',
    trophies: 24,
    avatar: 'PP'
  },
  {
    name: 'ViperStrike',
    flag: '🇺🇸',
    title: 'Grandmaster',
    blueTick: true,
    bio: 'USA Rank #4. Nobody escapes my knockouts in Rapid Ludo.',
    matches: '980',
    winRate: '79.2%',
    trophies: 18,
    avatar: 'VS'
  },
  {
    name: 'SakuraDice',
    flag: '🇯🇵',
    title: 'Legend',
    blueTick: false,
    bio: 'Tokyo tactician. 3-time regional tournament champion.',
    matches: '740',
    winRate: '76.5%',
    trophies: 14,
    avatar: 'SD'
  },
  {
    name: 'RioCarnival',
    flag: '🇧🇷',
    title: 'Conqueror',
    blueTick: true,
    bio: 'Samba rhythm on the board! Rolling sixes all day long.',
    matches: '1,150',
    winRate: '82.0%',
    trophies: 20,
    avatar: 'RC'
  },
  {
    name: 'BlitzKrieg',
    flag: '🇩🇪',
    title: 'Eternal',
    blueTick: true,
    bio: 'Speed & calculation. Rapid Mode only.',
    matches: '860',
    winRate: '77.8%',
    trophies: 16,
    avatar: 'BK'
  },
  {
    name: 'CrownAce',
    flag: '🇬🇧',
    title: 'Grandmaster',
    blueTick: false,
    bio: 'London caller. Pass & Play champion with family.',
    matches: '620',
    winRate: '73.1%',
    trophies: 12,
    avatar: 'CA'
  }
];

const realisticChatStream = [
  { user: sampleChatters[0], text: 'Welcome all warriors to the official Ludo Classic global server! 🎲', time: 'Just now' },
  { user: sampleChatters[1], text: 'Looking for high-stakes 4-player International Match! 🇺🇸', time: '1m ago' },
  { user: sampleChatters[2], text: 'Anyone up for Snake Ludo in the Ice Age arena? Ladder race is wild!', time: '2m ago' },
  { user: sampleChatters[3], text: 'Just hit a 9-game win streak! Blue tick feels amazing 😎', time: '3m ago' },
  { user: sampleChatters[4], text: 'The latency is super crisp, 24ms from Frankfurt server.', time: '4m ago' },
  { user: sampleChatters[5], text: 'Ruined Church arena background is so aesthetic! Great gothic vibe.', time: '5m ago' }
];

function initWorldChat() {
  const feedBoxes = document.querySelectorAll('.chat-feed-box');
  const inputFields = document.querySelectorAll('.chat-input-field');
  const sendBtns = document.querySelectorAll('.btn-send-chat');
  const quickChips = document.querySelectorAll('.quick-chip');

  function renderInitialMessages() {
    feedBoxes.forEach(box => {
      box.innerHTML = '';
      realisticChatStream.forEach(msg => {
        const row = createChatRow(msg);
        box.appendChild(row);
      });
    });
  }

  function createChatRow(msg) {
    const row = document.createElement('div');
    row.className = 'chat-msg-row';
    row.onclick = () => inspectPlayerProfile(msg.user);

    const blueTickHtml = msg.user.blueTick 
      ? `<span class="blue-tick-badge" title="Verified Blue Tick Master"><i class="fa-solid fa-check"></i></span>`
      : '';

    row.innerHTML = `
      <div class="chat-user-avatar">${msg.user.avatar}</div>
      <div class="chat-msg-body">
        <div class="chat-msg-top">
          <span class="chat-sender-name">
            ${msg.user.flag} ${msg.user.name}
            ${blueTickHtml}
          </span>
          <span class="chat-user-title">${msg.user.title}</span>
          <span class="chat-msg-time">${msg.time}</span>
        </div>
        <p class="chat-text">${escapeHtml(msg.text)}</p>
      </div>
    `;
    return row;
  }

  function sendMessage(text) {
    if (!text.trim()) return;
    playSynthesizedSound('click');

    const newMsg = {
      user: {
        name: 'You (Challenger)',
        flag: '🇮🇳',
        title: 'Contender',
        blueTick: true,
        bio: 'Ready to dominate the global leaderboard in Ludo Game Classic!',
        matches: '48',
        winRate: '85.4%',
        trophies: 8,
        avatar: 'ME'
      },
      text: text.trim(),
      time: 'Just now'
    };

    feedBoxes.forEach(box => {
      const row = createChatRow(newMsg);
      box.insertBefore(row, box.firstChild);
    });

    inputFields.forEach(input => input.value = '');
    showToast('💬 Message broadcast to World Chat server!');
  }

  sendBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const input = inputFields[index] || inputFields[0];
      if (input) sendMessage(input.value);
    });
  });

  inputFields.forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage(input.value);
      }
    });
  });

  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      sendMessage(chip.textContent);
    });
  });

  renderInitialMessages();

  // Periodic random realistic chat message simulation
  setInterval(() => {
    const randomUser = sampleChatters[Math.floor(Math.random() * sampleChatters.length)];
    const randomPhrases = [
      'Rematch request sent! Who is ready?',
      'Just claimed the daily wheel spin, got +1,000 gold!',
      'Gg well played on the last move!',
      'Rolling double sixes in Rapid Mode feels glorious!',
      'Add me to your 1v1 Inbox challenges.',
      'That snake at tile 98 was brutal 😂'
    ];
    const phrase = randomPhrases[Math.floor(Math.random() * randomPhrases.length)];

    feedBoxes.forEach(box => {
      const row = createChatRow({ user: randomUser, text: phrase, time: 'Just now' });
      box.insertBefore(row, box.firstChild);
      if (box.children.length > 25) {
        box.removeChild(box.lastChild);
      }
    });
  }, 14000);
}

function inspectPlayerProfile(user) {
  playSynthesizedSound('click');

  // Update Desktop profile card
  const dName = document.getElementById('profileInspectorName');
  const dTitle = document.getElementById('profileInspectorTitle');
  const dBio = document.getElementById('profileInspectorBio');
  const dMatches = document.getElementById('profileInspectorMatches');
  const dWinRate = document.getElementById('profileInspectorWinRate');
  const dAvatar = document.getElementById('profileInspectorAvatar');
  const dBlueTick = document.getElementById('profileInspectorBlueTick');

  if (dName) dName.textContent = `${user.flag} ${user.name}`;
  if (dTitle) dTitle.textContent = user.title;
  if (dBio) dBio.textContent = user.bio;
  if (dMatches) dMatches.textContent = user.matches;
  if (dWinRate) dWinRate.textContent = user.winRate;
  if (dAvatar) dAvatar.textContent = user.avatar;
  if (dBlueTick) dBlueTick.style.display = user.blueTick ? 'inline-flex' : 'none';

  // Update Mobile Bottom Sheet if on mobile view
  const sheet = document.getElementById('mobileProfileBottomSheet');
  if (sheet) {
    const mName = document.getElementById('mProfileName');
    const mTitle = document.getElementById('mProfileTitle');
    const mBio = document.getElementById('mProfileBio');
    const mMatches = document.getElementById('mProfileMatches');
    const mWinRate = document.getElementById('mProfileWinRate');
    const mAvatar = document.getElementById('mProfileAvatar');
    const mBlueTick = document.getElementById('mProfileBlueTick');

    if (mName) mName.textContent = `${user.flag} ${user.name}`;
    if (mTitle) mTitle.textContent = user.title;
    if (mBio) mBio.textContent = user.bio;
    if (mMatches) mMatches.textContent = user.matches;
    if (mWinRate) mWinRate.textContent = user.winRate;
    if (mAvatar) mAvatar.textContent = user.avatar;
    if (mBlueTick) mBlueTick.style.display = user.blueTick ? 'inline-flex' : 'none';

    sheet.classList.add('open');
  }

  showToast(`Inspecting ${user.name}'s Profile Card`);
}

/* ==========================================================================
   6. ATMOSPHERIC THEMED ARENAS EXPLORER
   ========================================================================== */
function initArenasExplorer() {
  const tabBtns = document.querySelectorAll('.arena-tab-btn');
  const stage = document.getElementById('arenaDisplayStage');
  const title = document.getElementById('arenaStageTitle');
  const desc = document.getElementById('arenaStageDesc');

  const arenasData = {
    wooden: {
      title: 'Classic Wooden Table Arena',
      desc: 'Warm, nostalgic, handcrafted polished mahogany tabletop aesthetics reminiscent of heritage family game nights.',
      bg: 'linear-gradient(135deg, rgba(69, 26, 3, 0.85) 0%, rgba(120, 53, 15, 0.85) 100%), url("asset/game_homescreen_bg.jpeg")',
      glow: 'rgba(245, 158, 11, 0.4)'
    },
    church: {
      title: 'Ruined Church Arena',
      desc: 'Atmospheric, dark gothic battlefield set among ancient stone arches, gargoyles, and moonlight shadows.',
      bg: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(49, 46, 129, 0.85) 100%), url("asset/loading_screen_bg.jpeg")',
      glow: 'rgba(99, 102, 241, 0.4)'
    },
    skull: {
      title: 'Skull Hunter Arena',
      desc: 'Fiery, molten underworld arena forged in magma cracks with aggressive battle horn audio effects.',
      bg: 'linear-gradient(135deg, rgba(69, 10, 10, 0.88) 0%, rgba(185, 28, 28, 0.88) 100%), url("asset/loading_screen_bg.jpeg")',
      glow: 'rgba(239, 68, 68, 0.4)'
    },
    lastbattle: {
      title: 'The Last Battle Arena',
      desc: 'Epic, high-fantasy twilight showdown arena floating above cosmic clouds with shimmering constellation tracks.',
      bg: 'linear-gradient(135deg, rgba(30, 27, 75, 0.85) 0%, rgba(112, 26, 117, 0.85) 100%), url("asset/game_homescreen_bg.jpeg")',
      glow: 'rgba(217, 70, 239, 0.4)'
    },
    deadland: {
      title: 'Deadland Arena',
      desc: 'Desolate post-apocalyptic battleground with rugged industrial steel plates and neon radiation glows.',
      bg: 'linear-gradient(135deg, rgba(24, 24, 27, 0.9) 0%, rgba(63, 63, 70, 0.9) 100%), url("asset/game_homescreen_bg.jpeg")',
      glow: 'rgba(16, 185, 129, 0.4)'
    }
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const arenaKey = btn.dataset.arena;
      const data = arenasData[arenaKey];

      if (stage && data) {
        stage.style.background = data.bg;
        stage.style.boxShadow = `0 10px 30px ${data.glow}`;
        if (title) title.textContent = data.title;
        if (desc) desc.textContent = data.desc;
        playSynthesizedSound('click');
      }
    });
  });
}

/* ==========================================================================
   7. GAMEPLAY TRAILER VIDEO CONTROLS
   ========================================================================== */
function initVideoPlayer() {
  const video = document.getElementById('gameplayVideo');
  const btnPlayPause = document.getElementById('btnVideoPlayPause');
  const btnMute = document.getElementById('btnVideoMute');
  const btnFullscreen = document.getElementById('btnVideoFullscreen');

  if (!video) return;

  if (btnPlayPause) {
    btnPlayPause.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        btnPlayPause.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
      } else {
        video.pause();
        btnPlayPause.innerHTML = '<i class="fa-solid fa-play"></i> Play Trailer';
      }
      playSynthesizedSound('click');
    });
  }

  if (btnMute) {
    btnMute.addEventListener('click', () => {
      video.muted = !video.muted;
      btnMute.innerHTML = video.muted 
        ? '<i class="fa-solid fa-volume-xmark"></i> Unmute'
        : '<i class="fa-solid fa-volume-high"></i> Mute';
      playSynthesizedSound('click');
    });
  }

  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      }
    });
  }
}

/* ==========================================================================
   8. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
          playSynthesizedSound('click');
        }
      });
    }
  });
}

/* ==========================================================================
   9. MOBILE DEDICATED BOTTOM NAVIGATION & TAB SWITCHER
   ========================================================================== */
function initMobileBottomNav() {
  const navItems = document.querySelectorAll('.bottom-nav-item');
  const tabViews = document.querySelectorAll('.mobile-tab-view');
  const closeSheetBtn = document.getElementById('btnCloseBottomSheet');
  const bottomSheet = document.getElementById('mobileProfileBottomSheet');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTabId = item.dataset.tab;

      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      tabViews.forEach(view => {
        if (view.id === targetTabId) {
          view.classList.add('active-tab');
        } else {
          view.classList.remove('active-tab');
        }
      });

      playSynthesizedSound('click');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  if (closeSheetBtn && bottomSheet) {
    closeSheetBtn.addEventListener('click', () => {
      bottomSheet.classList.remove('open');
    });
  }

  if (bottomSheet) {
    bottomSheet.addEventListener('click', (e) => {
      if (e.target === bottomSheet) {
        bottomSheet.classList.remove('open');
      }
    });
  }
}

/* ==========================================================================
   10. DOWNLOAD MODAL & TOAST NOTIFICATION HELPERS
   ========================================================================== */
function initDownloadModal() {
  const modal = document.getElementById('downloadModal');
  const openBtns = document.querySelectorAll('.trigger-download-modal');
  const closeBtn = document.getElementById('btnCloseModal');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.classList.add('open');
      playSynthesizedSound('click');
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }
}

function showToast(message) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-bell" style="color:var(--gold-light);"></i> <span>${escapeHtml(message)}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3400);
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
