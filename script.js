/**
 * ==========================================================================
 * RETRO WINDOWS 95 / PIXEL PC OS LOGIC (Class XII-E KDNATOES)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------------------------
    // 1. Audio Synthesizer (Web Audio API - Zero External Dependencies)
    // ----------------------------------------------------------------------
    let audioCtx = null;
    let soundEnabled = true;

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playBeep(freq = 600, type = 'square', duration = 0.04) {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            // Audio context policy or unsupported
        }
    }

    function playRetroClick() {
        playBeep(900, 'square', 0.02);
    }

    function playErrorChord() {
        playBeep(220, 'sawtooth', 0.15);
        setTimeout(() => playBeep(180, 'sawtooth', 0.2), 100);
    }

    function playArcadeFanfare() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            [261.63, 329.63, 392.00, 523.25, 659.25].forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, now + idx * 0.07);
                gain.gain.setValueAtTime(0.06, now + idx * 0.07);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.18);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + idx * 0.07);
                osc.stop(now + idx * 0.07 + 0.18);
            });
        } catch (e) { }
    }

    function announceArcadeVoice(text, options = {}) {
        if (!soundEnabled || !('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            const cleanText = text.replace(/\(.*?\)/g, '').trim();
            const utter = new SpeechSynthesisUtterance(cleanText);
            utter.rate = options.rate || 1.02;
            utter.pitch = options.pitch || 0.72; // Deep arcade announcer tone
            utter.volume = options.volume || 1.0;
            const voices = window.speechSynthesis.getVoices();
            const preferred = voices.find(v => (v.lang.startsWith('en') && (v.name.includes('Male') || v.name.includes('David') || v.name.includes('Natural')))) || voices.find(v => v.lang.startsWith('en')) || voices[0];
            if (preferred) utter.voice = preferred;
            window.speechSynthesis.speak(utter);
        } catch (e) { }
    }

    // ----------------------------------------------------------------------
    // 1b. Retro 8-bit Chiptune BGM Synthesizer (Pure Web Audio API)
    // ----------------------------------------------------------------------
    let bgmPlaying = false;
    let bgmStep = 0;
    let bgmTimer = null;

    const bgmMelody = [
        261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 261.63, 329.63,
        220.00, 261.63, 329.63, 440.00, 329.63, 261.63, 220.00, 261.63,
        293.66, 349.23, 440.00, 587.33, 440.00, 349.23, 293.66, 349.23,
        196.00, 246.94, 293.66, 392.00, 293.66, 246.94, 196.00, 246.94
    ];

    const bgmBass = [
        130.81, 130.81, 130.81, 130.81, 130.81, 130.81, 130.81, 130.81,
        110.00, 110.00, 110.00, 110.00, 110.00, 110.00, 110.00, 110.00,
        146.83, 146.83, 146.83, 146.83, 146.83, 146.83, 146.83, 146.83,
        98.00, 98.00, 98.00, 98.00, 98.00, 98.00, 98.00, 98.00
    ];

    function playBgmNote() {
        if (!bgmPlaying || !soundEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;

            // 1. Lead Arpeggio (Square Wave)
            const oscLead = ctx.createOscillator();
            const gainLead = ctx.createGain();
            const freq = bgmMelody[bgmStep % bgmMelody.length];
            oscLead.type = 'square';
            oscLead.frequency.setValueAtTime(freq, now);
            gainLead.gain.setValueAtTime(0.022, now);
            gainLead.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            oscLead.connect(gainLead);
            gainLead.connect(ctx.destination);
            oscLead.start(now);
            oscLead.stop(now + 0.12);

            // 2. Bass Pulse (Triangle Wave) every 2 steps
            if (bgmStep % 2 === 0) {
                const oscBass = ctx.createOscillator();
                const gainBass = ctx.createGain();
                const bassFreq = bgmBass[bgmStep % bgmBass.length];
                oscBass.type = 'triangle';
                oscBass.frequency.setValueAtTime(bassFreq, now);
                gainBass.gain.setValueAtTime(0.038, now);
                gainBass.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
                oscBass.connect(gainBass);
                gainBass.connect(ctx.destination);
                oscBass.start(now);
                oscBass.stop(now + 0.22);
            }

            // 3. Retro 8-bit Snare click
            if (bgmStep % 4 === 2) {
                const oscSnare = ctx.createOscillator();
                const gainSnare = ctx.createGain();
                oscSnare.type = 'sawtooth';
                oscSnare.frequency.setValueAtTime(120, now);
                oscSnare.frequency.exponentialRampToValueAtTime(30, now + 0.05);
                gainSnare.gain.setValueAtTime(0.025, now);
                gainSnare.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                oscSnare.connect(gainSnare);
                gainSnare.connect(ctx.destination);
                oscSnare.start(now);
                oscSnare.stop(now + 0.05);
            }

            bgmStep = (bgmStep + 1) % bgmMelody.length;
        } catch (e) { }
    }

    function startBgm() {
        if (bgmPlaying) return;
        bgmPlaying = true;
        const ind = document.getElementById('bgm-icon-indicator');
        const btnBgm = document.getElementById('btn-toggle-bgm');
        if (ind) ind.textContent = '🎶';
        if (btnBgm) btnBgm.classList.add('is-active');
        bgmTimer = setInterval(playBgmNote, 140);
    }

    function stopBgm() {
        if (!bgmPlaying) return;
        bgmPlaying = false;
        const ind = document.getElementById('bgm-icon-indicator');
        const btnBgm = document.getElementById('btn-toggle-bgm');
        if (ind) ind.textContent = '🎵';
        if (btnBgm) btnBgm.classList.remove('is-active');
        if (bgmTimer) {
            clearInterval(bgmTimer);
            bgmTimer = null;
        }
    }

    function toggleBgm() {
        if (bgmPlaying) {
            stopBgm();
        } else {
            startBgm();
        }
    }

    const btnToggleBgm = document.getElementById('btn-toggle-bgm');
    if (btnToggleBgm) {
        btnToggleBgm.addEventListener('click', toggleBgm);
    }

    // Toggle Sound Button in System Tray
    const btnToggleSound = document.getElementById('btn-toggle-sound');
    if (btnToggleSound) {
        btnToggleSound.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            btnToggleSound.style.opacity = soundEnabled ? '1' : '0.4';
            if (soundEnabled) {
                playRetroClick();
            } else {
                stopBgm();
            }
        });
    }

    // Add click sound to all interactive buttons
    document.querySelectorAll('.win-btn, .win-btn-ctrl, .desktop-icon, .color-swatch, .paint-tool-btn, .brush-size-btn, .taskbar-tab, .start-menu-link').forEach(btn => {
        btn.addEventListener('click', () => {
            playRetroClick();
        });
    });

    // ----------------------------------------------------------------------
    // 2. Real-time System Tray Clock
    // ----------------------------------------------------------------------
    const clockEl = document.getElementById('win-clock');
    function updateClock() {
        if (!clockEl) return;
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 menjadi 12
        clockEl.textContent = `${hours}:${minutes} ${ampm}`;
    }
    updateClock();
    setInterval(updateClock, 1000);

    // ----------------------------------------------------------------------
    // 3. Start Menu Toggle
    // ----------------------------------------------------------------------
    const startBtn = document.getElementById('win-start-btn');
    const startMenu = document.getElementById('win-start-menu');

    function toggleStartMenu() {
        if (!startMenu) return;
        const isOpen = startMenu.classList.contains('is-open');
        if (isOpen) {
            startMenu.classList.remove('is-open');
            startBtn.classList.remove('is-active');
            startBtn.setAttribute('aria-expanded', 'false');
        } else {
            startMenu.classList.add('is-open');
            startBtn.classList.add('is-active');
            startBtn.setAttribute('aria-expanded', 'true');
        }
    }

    if (startBtn) {
        startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleStartMenu();
        });
    }

    // Close Start Menu when clicking outside
    document.addEventListener('click', (e) => {
        if (startMenu && startMenu.classList.contains('is-open')) {
            if (!startMenu.contains(e.target) && e.target !== startBtn && !startBtn.contains(e.target)) {
                startMenu.classList.remove('is-open');
                startBtn.classList.remove('is-active');
                startBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // ----------------------------------------------------------------------
    // 4. Windows Active State, Dragging Engine & Taskbar Sync
    // ----------------------------------------------------------------------
    const windows = document.querySelectorAll('.win-window');
    const taskbarTabs = document.querySelectorAll('.taskbar-tab');
    let highestZIndex = 25;

    function activateWindow(winId) {
        const targetWin = document.getElementById(winId);
        if (!targetWin) return;

        highestZIndex += 1;
        targetWin.style.zIndex = highestZIndex;
        targetWin.style.display = 'flex';

        windows.forEach(w => {
            if (w === targetWin) {
                w.classList.remove('is-inactive');
            } else {
                w.classList.add('is-inactive');
            }
        });

        taskbarTabs.forEach(tab => {
            if (tab.dataset.target === winId) {
                tab.style.display = 'flex';
                tab.classList.add('is-active');
            } else {
                tab.classList.remove('is-active');
            }
        });
    }

    function focusTopRemainingWindow() {
        let topWin = null;
        let maxZ = -1;
        windows.forEach(w => {
            if (w.style.display !== 'none') {
                const z = parseInt(w.style.zIndex || '0', 10);
                if (z > maxZ) {
                    maxZ = z;
                    topWin = w;
                }
            }
        });
        if (topWin) {
            activateWindow(topWin.id);
        } else {
            windows.forEach(w => w.classList.add('is-inactive'));
            taskbarTabs.forEach(tab => tab.classList.remove('is-active'));
        }
    }

    // Initial sync of taskbar tabs according to window visibility
    taskbarTabs.forEach(tab => {
        const targetId = tab.dataset.target;
        if (targetId === 'personalia-roster') {
            tab.style.display = 'none';
            tab.classList.remove('is-active');
            return;
        }
        const win = document.getElementById(targetId);
        if (win && win.style.display !== 'none') {
            tab.style.display = 'flex';
            tab.classList.add('is-active');
        } else {
            tab.style.display = 'none';
            tab.classList.remove('is-active');
        }
    });

    // Ensure default active window (#paint-window) is raised in front of desktop icons on load/refresh
    const paintDefaultWin = document.getElementById('paint-window');
    if (paintDefaultWin && paintDefaultWin.style.display !== 'none') {
        activateWindow('paint-window');
    }

    // Clicking anywhere inside a window brings it to focus
    windows.forEach(win => {
        win.addEventListener('mousedown', () => {
            activateWindow(win.id);
        });
    });

    // ----------------------------------------------------------------------
    // Genuine Windows 98 Window Dragging Engine
    // ----------------------------------------------------------------------
    let activeDragWin = null;
    let dragStartX = 0;
    let dragStartY = 0;
    let winStartLeft = 0;
    let winStartTop = 0;

    function startDrag(win, clientX, clientY) {
        if (win.classList.contains('is-maximized')) return;
        activeDragWin = win;
        activateWindow(win.id);

        const rect = win.getBoundingClientRect();
        dragStartX = clientX;
        dragStartY = clientY;
        winStartLeft = rect.left;
        winStartTop = rect.top;

        document.body.style.userSelect = 'none';
    }

    function onDrag(clientX, clientY) {
        if (!activeDragWin) return;
        const deltaX = clientX - dragStartX;
        const deltaY = clientY - dragStartY;

        let newLeft = winStartLeft + deltaX;
        let newTop = winStartTop + deltaY;

        // Keep titlebar accessible within desktop boundaries
        const maxLeft = window.innerWidth - 60;
        const maxTop = window.innerHeight - 60;
        newLeft = Math.max(-(activeDragWin.offsetWidth - 80), Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));

        activeDragWin.style.left = `${newLeft}px`;
        activeDragWin.style.top = `${newTop}px`;
    }

    function endDrag() {
        if (activeDragWin) {
            activeDragWin = null;
            document.body.style.userSelect = '';
        }
    }

    windows.forEach(win => {
        const titlebar = win.querySelector('.win-titlebar');
        if (!titlebar) return;

        // Window Control Buttons: Minimize (_), Maximize (□), Close (X)
        const titleButtons = win.querySelector('.win-title-buttons');
        if (titleButtons) {
            const ctrlBtns = titleButtons.querySelectorAll('.win-btn-ctrl');
            ctrlBtns.forEach((btn, index) => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const label = (btn.getAttribute('aria-label') || '').toLowerCase();
                    const txt = btn.textContent.trim();

                    if (label.includes('close') || label.includes('tutup') || txt === '×' || txt === 'X' || index === 2) {
                        // Close Window - Authentic Windows: completely removed from taskbar
                        win.style.display = 'none';
                        const tab = document.querySelector(`.taskbar-tab[data-target="${win.id}"]`);
                        if (tab) {
                            tab.classList.remove('is-active');
                            tab.style.display = 'none';
                        }
                        if (win.id === 'struktur-window') {
                            const pTab = document.querySelector('.taskbar-tab[data-target="personalia-roster"]');
                            if (pTab) {
                                pTab.classList.remove('is-active');
                                pTab.style.display = 'none';
                            }
                        }
                        focusTopRemainingWindow();
                    } else if (label.includes('min') || txt === '_' || index === 0) {
                        // Minimize Window - Authentic Windows: stays in taskbar as inactive tab
                        win.style.display = 'none';
                        const tab = document.querySelector(`.taskbar-tab[data-target="${win.id}"]`);
                        if (tab) tab.classList.remove('is-active');
                        if (win.id === 'struktur-window') {
                            const pTab = document.querySelector('.taskbar-tab[data-target="personalia-roster"]');
                            if (pTab) pTab.classList.remove('is-active');
                        }
                        focusTopRemainingWindow();
                    } else if (label.includes('max') || txt === '□' || txt === '&#9633;' || index === 1) {
                        // Maximize / Restore Window
                        win.classList.toggle('is-maximized');
                    }
                });
            });
        }

        titlebar.addEventListener('mousedown', (e) => {
            if (e.target.closest('.win-btn-ctrl') || e.target.closest('button')) return;
            e.preventDefault();
            startDrag(win, e.clientX, e.clientY);
        });

        titlebar.addEventListener('touchstart', (e) => {
            if (e.target.closest('.win-btn-ctrl') || e.target.closest('button')) return;
            const touch = e.touches[0];
            startDrag(win, touch.clientX, touch.clientY);
        }, { passive: true });

        // Double click titlebar to toggle maximize (authentic Win98)
        titlebar.addEventListener('dblclick', (e) => {
            if (e.target.closest('.win-btn-ctrl') || e.target.closest('button')) return;
            win.classList.toggle('is-maximized');
        });
    });

    window.addEventListener('mousemove', (e) => {
        if (activeDragWin) {
            onDrag(e.clientX, e.clientY);
        }
    });

    window.addEventListener('touchmove', (e) => {
        if (activeDragWin) {
            const touch = e.touches[0];
            onDrag(touch.clientX, touch.clientY);
        }
    }, { passive: true });

    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);

    // Taskbar Tabs Click
    taskbarTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.target;
            if (targetId === 'personalia-roster') {
                const strukturWin = document.getElementById('struktur-window');
                const personaliaEl = document.getElementById('personalia-roster');
                if (strukturWin) {
                    if (tab.classList.contains('is-active') && strukturWin.style.display !== 'none') {
                        // Minimize
                        strukturWin.style.display = 'none';
                        tab.classList.remove('is-active');
                        const structTab = document.querySelector('.taskbar-tab[data-target="struktur-window"]');
                        if (structTab) structTab.classList.remove('is-active');
                        focusTopRemainingWindow();
                    } else {
                        // Restore / Focus
                        strukturWin.style.display = 'flex';
                        activateWindow('struktur-window');
                        tab.style.display = 'flex';
                        tab.classList.add('is-active');
                        const structTab = document.querySelector('.taskbar-tab[data-target="struktur-window"]');
                        if (structTab) structTab.classList.remove('is-active');
                        if (personaliaEl) personaliaEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        playArcadeFanfare();
                        announceArcadeVoice("CHOOSE YOUR FIGHTER!", { pitch: 0.7, rate: 1.05 });
                    }
                }
                return;
            }

            const targetWin = document.getElementById(targetId);
            if (!targetWin) return;

            if (tab.classList.contains('is-active') && targetWin.style.display !== 'none') {
                // Toggle Minimize
                targetWin.style.display = 'none';
                tab.classList.remove('is-active');
                focusTopRemainingWindow();
            } else {
                targetWin.style.display = 'flex';
                activateWindow(targetId);
            }
        });
    });

    // Launch Window from Desktop Icons and Start Menu
    function launchWindow(targetId) {
        if (!targetId) return;
        if (targetId === 'personalia-roster') {
            const strukturWin = document.getElementById('struktur-window');
            const personaliaEl = document.getElementById('personalia-roster');
            if (strukturWin) {
                strukturWin.style.display = 'flex';
                activateWindow('struktur-window');
                const pTab = document.querySelector('.taskbar-tab[data-target="personalia-roster"]');
                if (pTab) {
                    pTab.style.display = 'flex';
                    pTab.classList.add('is-active');
                }
                const structTab = document.querySelector('.taskbar-tab[data-target="struktur-window"]');
                if (structTab) structTab.classList.remove('is-active');
                if (personaliaEl) personaliaEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                playArcadeFanfare();
                announceArcadeVoice("CHOOSE YOUR FIGHTER!", { pitch: 0.7, rate: 1.05 });
            }
            return;
        }

        const targetWin = document.getElementById(targetId);
        if (targetWin) {
            targetWin.style.display = 'flex';
            activateWindow(targetId);
        }
    }

    document.querySelectorAll('a.desktop-icon[href^="#"], a.start-menu-link[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                launchWindow(targetId);
                if (startMenu && startMenu.classList.contains('is-open')) {
                    startMenu.classList.remove('is-open');
                    if (startBtn) {
                        startBtn.classList.remove('is-active');
                        startBtn.setAttribute('aria-expanded', 'false');
                    }
                }
            }
        });
    });


    // ----------------------------------------------------------------------
    // 5. Interactive MS Paint Canvas Engine
    // ----------------------------------------------------------------------
    const canvas = document.getElementById('paint-canvas');
    const statusCoords = document.getElementById('paint-status-coords');
    const statusHelp = document.getElementById('paint-status-help');
    const activeColorPri = document.getElementById('active-color-pri');
    const activeColorSec = document.getElementById('active-color-sec');
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const toolBtns = document.querySelectorAll('.paint-tool-btn');
    const brushSizeBtns = document.querySelectorAll('.brush-size-btn');
    const btnClearCanvas = document.getElementById('btn-clear-canvas');
    const btnSaveCanvas = document.getElementById('btn-save-canvas');

    let ctx = null;
    let isDrawing = false;
    let currentColor = '#000000';
    let currentSecondaryColor = '#ffffff';
    let currentTool = 'pencil';
    let currentBrushSize = 2;
    let startX = 0;
    let startY = 0;
    let snapshotData = null;

    if (canvas && canvas.getContext) {
        ctx = canvas.getContext('2d', { willReadFrequently: true });

        // Setup initial background & cute retro welcome sketch
        function initPaintArtwork() {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw nostalgic pixel grid banner
            ctx.fillStyle = '#000080';
            ctx.fillRect(20, 20, canvas.width - 40, 60);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 24px "Pixelify Sans", Tahoma, sans-serif';
            ctx.fillText('XII - E  KDNATOES', 40, 58);

            ctx.font = '14px Tahoma, sans-serif';
            ctx.fillText('Official Class Operating System - 2026', 40, 75);

            // Draw a cute retro smiley or monitor icon
            ctx.fillStyle = '#dfdfdf';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.fillRect(40, 110, 120, 90);
            ctx.strokeRect(40, 110, 120, 90);

            // Screen
            ctx.fillStyle = '#008080';
            ctx.fillRect(50, 120, 100, 70);

            // Screen text
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px "Pixelify Sans", monospace';
            ctx.fillText('C:\\> WIN.COM', 55, 145);
            ctx.fillText('READY.', 55, 165);

            // Monitor base
            ctx.fillStyle = '#c0c0c0';
            ctx.fillRect(80, 200, 40, 15);
            ctx.strokeRect(80, 200, 40, 15);
            ctx.fillRect(65, 215, 70, 10);
            ctx.strokeRect(65, 215, 70, 10);

            // Handwritten note
            ctx.strokeStyle = '#e74c3c';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(200, 140);
            ctx.bezierCurveTo(240, 110, 280, 180, 320, 140);
            ctx.stroke();

            ctx.fillStyle = '#333333';
            ctx.font = 'italic 15px Georgia, serif';
            ctx.fillText('"Terus melangkah, mengukir sejarah bersama!"', 200, 175);
            ctx.fillText('Gunakan kuas atau pensil untuk berkreasi di sini...', 200, 205);
        }

        function restorePaintArtwork() {
            try {
                const savedArt = localStorage.getItem('xii_paint_art');
                if (savedArt) {
                    const img = new Image();
                    img.onload = () => {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0);
                    };
                    img.src = savedArt;
                    return true;
                }
            } catch (e) { console.warn(e); }
            return false;
        }

        if (!restorePaintArtwork()) {
            initPaintArtwork();
        }

        // Coordinates Helper
        function getCanvasCoords(e) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            let clientX = e.clientX;
            let clientY = e.clientY;

            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            }

            return {
                x: Math.floor((clientX - rect.left) * scaleX),
                y: Math.floor((clientY - rect.top) * scaleY)
            };
        }

        function startDrawing(e) {
            isDrawing = true;
            const coords = getCanvasCoords(e);
            startX = coords.x;
            startY = coords.y;

            if (['line', 'rect', 'ellipse'].includes(currentTool)) {
                snapshotData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            }

            ctx.beginPath();
            ctx.moveTo(startX, startY);

            if (currentTool === 'pencil' || currentTool === 'brush') {
                ctx.strokeStyle = currentColor;
                ctx.fillStyle = currentColor;
                ctx.lineWidth = currentBrushSize;
                ctx.lineCap = currentTool === 'brush' ? 'round' : 'square';
                ctx.lineTo(startX, startY);
                ctx.stroke();
            } else if (currentTool === 'eraser') {
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = currentBrushSize * 2.5;
                ctx.lineCap = 'square';
                ctx.lineTo(startX, startY);
                ctx.stroke();
            } else if (currentTool === 'spray') {
                sprayDots(startX, startY);
            } else if (currentTool === 'bucket') {
                // Simple bucket fill whole canvas
                ctx.fillStyle = currentColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }

        function draw(e) {
            const coords = getCanvasCoords(e);
            if (statusCoords) {
                statusCoords.textContent = `X: ${coords.x}, Y: ${coords.y} px`;
            }

            if (!isDrawing) return;

            if (currentTool === 'pencil' || currentTool === 'brush') {
                ctx.strokeStyle = currentColor;
                ctx.lineWidth = currentBrushSize;
                ctx.lineCap = currentTool === 'brush' ? 'round' : 'square';
                ctx.lineTo(coords.x, coords.y);
                ctx.stroke();
            } else if (currentTool === 'eraser') {
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = currentBrushSize * 2.5;
                ctx.lineCap = 'square';
                ctx.lineTo(coords.x, coords.y);
                ctx.stroke();
            } else if (currentTool === 'spray') {
                sprayDots(coords.x, coords.y);
            } else if (snapshotData && ['line', 'rect', 'ellipse'].includes(currentTool)) {
                ctx.putImageData(snapshotData, 0, 0);
                ctx.strokeStyle = currentColor;
                ctx.lineWidth = currentBrushSize;
                ctx.beginPath();
                if (currentTool === 'line') {
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(coords.x, coords.y);
                    ctx.stroke();
                } else if (currentTool === 'rect') {
                    ctx.strokeRect(startX, startY, coords.x - startX, coords.y - startY);
                } else if (currentTool === 'ellipse') {
                    const rx = Math.abs(coords.x - startX) / 2;
                    const ry = Math.abs(coords.y - startY) / 2;
                    const cx = Math.min(startX, coords.x) + rx;
                    const cy = Math.min(startY, coords.y) + ry;
                    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
        }

        function stopDrawing() {
            if (isDrawing) {
                ctx.closePath();
                isDrawing = false;
                try {
                    localStorage.setItem('xii_paint_art', canvas.toDataURL());
                } catch (err) { console.warn(err); }
            }
        }

        function sprayDots(x, y) {
            const density = currentBrushSize * 4;
            const radius = currentBrushSize * 2;
            ctx.fillStyle = currentColor;
            for (let i = 0; i < density; i++) {
                const offsetX = (Math.random() - 0.5) * radius * 2;
                const offsetY = (Math.random() - 0.5) * radius * 2;
                ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
            }
        }

        // Mouse Events
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        window.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseleave', () => {
            if (statusCoords) statusCoords.textContent = 'X: -, Y: - px';
        });

        // Touch Events
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startDrawing(e);
        }, { passive: false });
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            draw(e);
        }, { passive: false });
        canvas.addEventListener('touchend', stopDrawing);

        // Color Swatches Selection
        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                currentColor = swatch.dataset.color || '#000000';
                if (activeColorPri) activeColorPri.style.background = currentColor;
                if (statusHelp) statusHelp.textContent = `Warna terpilih: ${currentColor}`;
            });
            swatch.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                currentSecondaryColor = swatch.dataset.color || '#ffffff';
                if (activeColorSec) activeColorSec.style.background = currentSecondaryColor;
            });
        });

        // Tool Selection
        toolBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                toolBtns.forEach(b => b.classList.remove('is-active'));
                btn.classList.add('is-active');
                currentTool = btn.dataset.tool || 'pencil';
                if (statusHelp) statusHelp.textContent = `Alat aktif: ${btn.title || currentTool}`;
            });
        });

        // Brush Size Selection
        brushSizeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                brushSizeBtns.forEach(b => b.classList.remove('is-active'));
                btn.classList.add('is-active');
                currentBrushSize = parseInt(btn.dataset.size, 10) || 2;
            });
        });

        // Clear Canvas Button
        if (btnClearCanvas) {
            btnClearCanvas.addEventListener('click', () => {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                try {
                    localStorage.removeItem('xii_paint_art');
                } catch (e) { console.warn(e); }
                if (statusHelp) statusHelp.textContent = 'Kanvas telah dibersihkan.';
            });
        }

        // Save Canvas as PNG
        if (btnSaveCanvas) {
            btnSaveCanvas.addEventListener('click', () => {
                const link = document.createElement('a');
                link.download = 'Karya_XII-E_Paint.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        }
    }

    // ----------------------------------------------------------------------
    // 6. Dialog Modals (IT'S NOT FAIR, VIRUS, QUESTION, TASK, GALLERY)
    // ----------------------------------------------------------------------

    // Modal Helper
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            playRetroClick();
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            playRetroClick();
        }
    }

    // 1. Dialog "IT'S NOT FAIR"
    const btnDialogFair = document.getElementById('btn-dialog-fair');
    const dialogFair = document.getElementById('dialog-fair-backdrop');
    const closeFairBtn = document.getElementById('close-fair-btn');
    const btnFairOk = document.getElementById('btn-fair-ok');
    const btnFairCancel = document.getElementById('btn-fair-cancel');

    if (btnDialogFair) {
        btnDialogFair.addEventListener('click', () => {
            openModal('dialog-fair-backdrop');
            playErrorChord();
        });
    }
    if (closeFairBtn) closeFairBtn.addEventListener('click', () => closeModal('dialog-fair-backdrop'));
    if (btnFairOk) btnFairOk.addEventListener('click', () => closeModal('dialog-fair-backdrop'));
    if (btnFairCancel) btnFairCancel.addEventListener('click', () => closeModal('dialog-fair-backdrop'));

    // 2. Dialog "VIRUS!1! - GhostInTheMachine.exe"
    const btnDialogVirus = document.getElementById('btn-dialog-virus');
    const closeVirusBtn = document.getElementById('close-virus-btn');
    const btnVirusMercy = document.getElementById('btn-virus-mercy');
    const btnVirusPay = document.getElementById('btn-virus-pay');
    const btnVirusCry = document.getElementById('btn-virus-cry');

    if (btnDialogVirus) {
        btnDialogVirus.addEventListener('click', () => {
            openModal('dialog-virus-backdrop');
            playErrorChord();
        });
    }
    if (closeVirusBtn) closeVirusBtn.addEventListener('click', () => closeModal('dialog-virus-backdrop'));
    if (btnVirusMercy) {
        btnVirusMercy.addEventListener('click', () => {
            alert("GhostInTheMachine says: Mercy granted... for now. Keep learning, XII-E!");
            closeModal('dialog-virus-backdrop');
        });
    }
    if (btnVirusPay) {
        btnVirusPay.addEventListener('click', () => {
            alert("Payment failed: Inactive floppy drive. You can just do your homework instead!");
            closeModal('dialog-virus-backdrop');
        });
    }
    if (btnVirusCry) {
        btnVirusCry.addEventListener('click', () => {
            alert("Tears detected. System returning to safe mode.");
            closeModal('dialog-virus-backdrop');
        });
    }

    // 3. Dialog "Window ????? [ OK ]" (Recycle Bin Easter Egg)
    const btnRecycle = document.getElementById('btn-recycle');
    const closeQBtn = document.getElementById('close-q-btn');
    const btnQOk = document.getElementById('btn-q-ok');

    if (btnRecycle) {
        btnRecycle.addEventListener('click', () => {
            openModal('dialog-question-backdrop');
            playErrorChord();
        });
    }
    if (closeQBtn) closeQBtn.addEventListener('click', () => closeModal('dialog-question-backdrop'));
    if (btnQOk) btnQOk.addEventListener('click', () => closeModal('dialog-question-backdrop'));

    // 4. Task Modal Dialog
    const taskModalBackdrop = document.getElementById('task-modal-backdrop');
    const modalTaskClose = document.getElementById('modal-task-close');
    const modalTaskCancel = document.getElementById('modal-task-cancel');
    const modalTaskTitle = document.getElementById('modal-task-title');
    const modalTaskBadge = document.getElementById('modal-task-badge');
    const modalTaskDue = document.getElementById('modal-task-due');
    const modalTaskDesc = document.getElementById('modal-task-desc');
    const modalTaskAction = document.getElementById('modal-task-action');

    document.querySelectorAll('.btn-open-task').forEach(btn => {
        btn.addEventListener('click', () => {
            if (modalTaskTitle) modalTaskTitle.textContent = btn.dataset.title || 'Detail Tugas';
            if (modalTaskBadge) {
                modalTaskBadge.textContent = btn.dataset.badge || 'Tugas';
                modalTaskBadge.className = `task-badge-pill ${btn.dataset.badgetype || 'warning'}`;
            }
            if (modalTaskDue) modalTaskDue.textContent = `Batas Waktu: ${btn.dataset.due || '-'}`;
            if (modalTaskDesc) modalTaskDesc.textContent = btn.dataset.desc || '-';
            if (modalTaskAction) modalTaskAction.href = btn.dataset.link || '#';
            openModal('task-modal-backdrop');
        });
    });

    if (modalTaskClose) modalTaskClose.addEventListener('click', () => closeModal('task-modal-backdrop'));
    if (modalTaskCancel) modalTaskCancel.addEventListener('click', () => closeModal('task-modal-backdrop'));

    // 5. Gallery Lightbox Dialog & Slideshow Automation
    const galleryLightbox = document.getElementById('gallery-lightbox');
    const lightboxClose = document.getElementById('lightbox-close');
    const btnLightboxClose = document.getElementById('btn-lightbox-close');
    const btnLightboxPrev = document.getElementById('btn-lightbox-prev');
    const btnLightboxPlay = document.getElementById('btn-lightbox-play');
    const btnLightboxNext = document.getElementById('btn-lightbox-next');
    const menuGaleriSlideshow = document.getElementById('menu-galeri-slideshow');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxPreviewLabel = document.getElementById('lightbox-preview-label');
    const lightboxPreviewBox = document.getElementById('lightbox-preview');

    const galleryCards = Array.from(document.querySelectorAll('.btn-open-gallery'));
    let currentGalleryIndex = 0;
    let gallerySlideshowTimer = null;

    function renderGallerySlide(index) {
        if (!galleryCards.length) return;
        if (index < 0) index = galleryCards.length - 1;
        if (index >= galleryCards.length) index = 0;
        currentGalleryIndex = index;

        const card = galleryCards[index];
        const title = card.dataset.title || 'Foto Kenangan';
        const desc = card.dataset.desc || '';
        const thumbBox = card.querySelector('.gallery-thumb-box');

        if (lightboxTitle) lightboxTitle.textContent = `Pratinjau (${index + 1}/${galleryCards.length}) - ${title}`;
        if (lightboxDesc) lightboxDesc.textContent = desc;
        if (lightboxPreviewLabel) lightboxPreviewLabel.textContent = title;
        if (lightboxPreviewBox && thumbBox) {
            lightboxPreviewBox.style.background = thumbBox.style.background || '#222';
        }
        playBeep(640, 'sine', 0.03);
    }

    function startGallerySlideshow() {
        if (gallerySlideshowTimer) return;
        if (btnLightboxPlay) {
            btnLightboxPlay.textContent = '⏸ Jeda';
            btnLightboxPlay.classList.add('is-active');
        }
        gallerySlideshowTimer = setInterval(() => {
            renderGallerySlide(currentGalleryIndex + 1);
        }, 3200);
    }

    function stopGallerySlideshow() {
        if (gallerySlideshowTimer) {
            clearInterval(gallerySlideshowTimer);
            gallerySlideshowTimer = null;
        }
        if (btnLightboxPlay) {
            btnLightboxPlay.textContent = '▶ Slideshow';
            btnLightboxPlay.classList.remove('is-active');
        }
    }

    function toggleGallerySlideshow() {
        if (gallerySlideshowTimer) {
            stopGallerySlideshow();
        } else {
            startGallerySlideshow();
        }
    }

    function handleGalleryClose() {
        stopGallerySlideshow();
        closeModal('gallery-lightbox');
    }

    galleryCards.forEach((card, idx) => {
        card.addEventListener('click', () => {
            renderGallerySlide(idx);
            openModal('gallery-lightbox');
        });
    });

    if (btnLightboxPrev) {
        btnLightboxPrev.addEventListener('click', () => {
            stopGallerySlideshow();
            renderGallerySlide(currentGalleryIndex - 1);
        });
    }

    if (btnLightboxNext) {
        btnLightboxNext.addEventListener('click', () => {
            stopGallerySlideshow();
            renderGallerySlide(currentGalleryIndex + 1);
        });
    }

    if (btnLightboxPlay) {
        btnLightboxPlay.addEventListener('click', toggleGallerySlideshow);
    }

    if (menuGaleriSlideshow) {
        menuGaleriSlideshow.addEventListener('click', () => {
            renderGallerySlide(currentGalleryIndex);
            openModal('gallery-lightbox');
            startGallerySlideshow();
        });
    }

    if (lightboxClose) lightboxClose.addEventListener('click', handleGalleryClose);
    if (btnLightboxClose) btnLightboxClose.addEventListener('click', handleGalleryClose);

    // 6. Blue Screen of Death (BSOD)
    const bsodOverlay = document.getElementById('bsod-overlay');
    const menuTriggerBsod = document.getElementById('menu-trigger-bsod');

    function triggerBsod() {
        if (!bsodOverlay) return;
        bsodOverlay.classList.add('is-active');
        playErrorChord();
        if (startMenu) startMenu.classList.remove('is-open');
        if (startBtn) startBtn.classList.remove('is-active');
    }

    function dismissBsod() {
        if (!bsodOverlay) return;
        bsodOverlay.classList.remove('is-active');
        playBeep(440, 'sine', 0.1);
    }

    if (menuTriggerBsod) {
        menuTriggerBsod.addEventListener('click', (e) => {
            e.preventDefault();
            triggerBsod();
        });
    }

    if (bsodOverlay) {
        bsodOverlay.addEventListener('click', dismissBsod);
    }

    // ======================================================================
    // 7. Personalia Arcade Select Character Logic (Class XII-E)
    // ======================================================================
    const arcadeCharacters = [
        {
            "id": "c1",
            "name": "Abdan Husaini Lathif",
            "initials": "AH",
            "role": "Anggota Kelas",
            "title": "Silent Tactician",
            "tag": "#01 SCHOLAR",
            "color": "#0984e3",
            "badge": "GEN",
            "quote": "Fokus, tekun, dan biarkan hasil belajar yang berbicara.",
            "stats": {
                "lead": 80,
                "energy": 88,
                "tactic": 92
            }
        },
        {
            "id": "c2",
            "name": "Ahnaf Ghazy Aljabar",
            "initials": "AG",
            "role": "Seksi Penalaran",
            "title": "Algebra Prodigy",
            "tag": "#02 ALGEBRA",
            "color": "#f39c12",
            "badge": "GEN",
            "quote": "Aljabar kehidupan selalu punya solusi jika dicari dengan sabar.",
            "stats": {
                "lead": 82,
                "energy": 87,
                "tactic": 95
            }
        },
        {
            "id": "c3",
            "name": "Arfa Rausyan Failasuf",
            "initials": "AR",
            "role": "Seksi Akademik",
            "title": "Philosophic Thinker",
            "tag": "#03 THINKER",
            "color": "#f1c40f",
            "badge": "GEN",
            "quote": "Berpikir kritis sebelum bertindak, mengkaji makna di balik fakta.",
            "stats": {
                "lead": 84,
                "energy": 86,
                "tactic": 94
            }
        },
        {
            "id": "c4",
            "name": "Asa Kemal Dhanurendra",
            "initials": "AK",
            "role": "Anggota Kelas",
            "title": "Hope Bearer",
            "tag": "#04 HOPE",
            "color": "#e67e22",
            "badge": "GEN",
            "quote": "Selama ada asa dan harapan, tidak ada rintangan yang tak bisa dilewati.",
            "stats": {
                "lead": 81,
                "energy": 90,
                "tactic": 86
            }
        },
        {
            "id": "c5",
            "name": "Asyam Taufiqurrahman Setyawan",
            "initials": "AT",
            "role": "Anggota Kelas",
            "title": "Noble Vanguard",
            "tag": "#05 NOBLE",
            "color": "#34495e",
            "badge": "GEN",
            "quote": "Kejujuran dan integritas adalah mahkota sejati seorang penuntut ilmu.",
            "stats": {
                "lead": 83,
                "energy": 89,
                "tactic": 88
            }
        },
        {
            "id": "c6",
            "name": "Asyraf Raziq Muzeizin",
            "initials": "AR",
            "role": "Anggota Kelas",
            "title": "Steadfast Guardian",
            "tag": "#06 STEADFAST",
            "color": "#c0392b",
            "badge": "GEN",
            "quote": "Rizki dan keberkahan selalu menyertai langkah orang yang bersungguh-sungguh.",
            "stats": {
                "lead": 85,
                "energy": 92,
                "tactic": 87
            }
        },
        {
            "id": "c7",
            "name": "Ayaka Fawwaz Al-Arsy",
            "initials": "AF",
            "role": "Anggota Kelas",
            "title": "Sky Striker",
            "tag": "#07 VALOR",
            "color": "#9b59b6",
            "badge": "GEN",
            "quote": "Gantungkan cita-citamu setinggi Arsy, gapai dengan doa dan ikhtiar.",
            "stats": {
                "lead": 82,
                "energy": 91,
                "tactic": 89
            }
        },
        {
            "id": "c8",
            "name": "Azis Army Alfaridzi",
            "initials": "AA",
            "role": "Seksi Keamanan",
            "title": "Iron Legion",
            "tag": "#08 DEFENDER",
            "color": "#27ae60",
            "badge": "SEC",
            "quote": "Disiplin dan kesolidan adalah kunci persaudaraan sejati XII-E.",
            "stats": {
                "lead": 88,
                "energy": 95,
                "tactic": 85
            }
        },
        {
            "id": "c9",
            "name": "Bagaskara Anyunari Boemi",
            "initials": "BA",
            "role": "Anggota Kelas",
            "title": "Solar Radiance",
            "tag": "#09 SUNSHINE",
            "color": "#e74c3c",
            "badge": "GEN",
            "quote": "Bersinarlah seperti mentari fajar, memberi manfaat bagi seluruh bumi.",
            "stats": {
                "lead": 83,
                "energy": 93,
                "tactic": 86
            }
        },
        {
            "id": "c10",
            "name": "Damar Al Fathih",
            "initials": "DF",
            "role": "Seksi Kerohanian",
            "title": "Torch of Victory",
            "tag": "#10 LIGHT",
            "color": "#16a085",
            "badge": "GEN",
            "quote": "Menjadi pelita penuntun di tengah gelapnya tantangan zaman.",
            "stats": {
                "lead": 86,
                "energy": 88,
                "tactic": 91
            }
        },
        {
            "id": "c11",
            "name": "Fadel Ahmad Thufail",
            "initials": "FA",
            "role": "Anggota Kelas",
            "title": "Courteous Knight",
            "tag": "#11 GRACE",
            "color": "#2980b9",
            "badge": "GEN",
            "quote": "Adab di atas ilmu, budi pekerti luhur cerminan kemuliaan hati.",
            "stats": {
                "lead": 84,
                "energy": 87,
                "tactic": 90
            }
        },
        {
            "id": "c12",
            "name": "Faeyza Azka Putra Jovano",
            "initials": "FA",
            "role": "Anggota Kelas",
            "title": "Swift Horizon",
            "tag": "#12 SWIFT",
            "color": "#8e44ad",
            "badge": "GEN",
            "quote": "Melangkah maju tanpa ragu, masa depan gemilang sudah menanti kita.",
            "stats": {
                "lead": 85,
                "energy": 91,
                "tactic": 88
            }
        },
        {
            "id": "c13",
            "name": "Fathu Rizqi Almubarok",
            "initials": "FR",
            "role": "Sekretaris",
            "title": "Master Scribe // \"The Chronicler\"",
            "tag": "#13 SCRIBE",
            "color": "#6c5ce7",
            "badge": "SK",
            "quote": "Notula rapi, arsip tertata, setiap detik sejarah kelas tercatat abadi.",
            "stats": {
                "lead": 88,
                "energy": 92,
                "tactic": 96
            }
        },
        {
            "id": "c14",
            "name": "Iqbal Qodama Khoirurrijal",
            "initials": "IQ",
            "photo": "assets/personalia/iqbal_pixel_player.png",
            "role": "Ketua Kelas",
            "title": "Math Master // \"The Commander\"",
            "tag": "#14 LEADER",
            "color": "#0984e3",
            "badge": "KM",
            "quote": "Buku Matematika IPA Inten di tangan, kelas XII - E siap libas semua ujian!",
            "stats": {
                "lead": 96,
                "energy": 92,
                "tactic": 98
            }
        },
        {
            "id": "c15",
            "name": "M Zaidan Aulia Bhakti",
            "initials": "MZ",
            "role": "Anggota Kelas",
            "title": "Loyal Sentinel",
            "tag": "#15 DEVOTION",
            "color": "#2c3e50",
            "badge": "GEN",
            "quote": "Bakti tulus kepada almamater dan orang tua adalah jalan ridho Ilahi.",
            "stats": {
                "lead": 82,
                "energy": 90,
                "tactic": 88
            }
        },
        {
            "id": "c16",
            "name": "M. Anas Afif Alfadil",
            "initials": "MA",
            "photo": "assets/personalia/anas_pixel_player.png",
            "role": "Wakil Ketua",
            "title": "Sub-Zero Tactician",
            "tag": "#16 VICE",
            "color": "#00cec9",
            "badge": "WK",
            "quote": "Kepala tetap dingin, keputusan presisi, ketertiban kelas nomor satu.",
            "stats": {
                "lead": 91,
                "energy": 88,
                "tactic": 97
            }
        },
        {
            "id": "c17",
            "name": "M. Wafizzaliq",
            "initials": "MW",
            "role": "Anggota Kelas",
            "title": "Storm Strider",
            "tag": "#17 IMPACT",
            "color": "#1abc9c",
            "badge": "GEN",
            "quote": "Tiap tantangan adalah peluang untuk membuktikan potensi terbaik diri.",
            "stats": {
                "lead": 83,
                "energy": 93,
                "tactic": 85
            }
        },
        {
            "id": "c18",
            "name": "Muflih Davin Kurniawan",
            "initials": "MD",
            "role": "Anggota Kelas",
            "title": "Prosperous Mind",
            "tag": "#18 FOCUS",
            "color": "#3498db",
            "badge": "GEN",
            "quote": "Keberhasilan adalah buah dari ketekunan harian yang tak pernah putus.",
            "stats": {
                "lead": 84,
                "energy": 89,
                "tactic": 91
            }
        },
        {
            "id": "c19",
            "name": "Muhamad Fauzan Hilmy Ramadhan",
            "initials": "MF",
            "role": "Anggota Kelas",
            "title": "Patience Champion",
            "tag": "#19 SERENE",
            "color": "#27ae60",
            "badge": "GEN",
            "quote": "Ketenangan jiwa dan doa tulus di setiap malam adalah senjata terkuat.",
            "stats": {
                "lead": 85,
                "energy": 88,
                "tactic": 92
            }
        },
        {
            "id": "c20",
            "name": "Muhammad Azzamy Syauqi",
            "initials": "MA",
            "role": "Bendahara",
            "title": "Keeper of Coin // \"The Vault\"",
            "tag": "#20 TREASURER",
            "color": "#e17055",
            "badge": "BD",
            "quote": "Uang kas transparan, neraca imbang, anggaran kelas aman terkendali.",
            "stats": {
                "lead": 89,
                "energy": 91,
                "tactic": 98
            }
        },
        {
            "id": "c21",
            "name": "Muhammad Daffa Dary Yardan",
            "initials": "MD",
            "role": "Seksi Humas",
            "title": "Crown Explorer",
            "tag": "#21 CREST",
            "color": "#d35400",
            "badge": "GEN",
            "quote": "Menjalin silaturahmi, memperluas wawasan dan relasi ke mana pun melangkah.",
            "stats": {
                "lead": 86,
                "energy": 92,
                "tactic": 89
            }
        },
        {
            "id": "c22",
            "name": "Muhammad Farras Kurnia",
            "initials": "MF",
            "role": "Anggota Kelas",
            "title": "Astute Observer",
            "tag": "#22 INSIGHT",
            "color": "#f39c12",
            "badge": "GEN",
            "quote": "Cerdas membaca situasi, cepat mengambil keputusan tepat di saat genting.",
            "stats": {
                "lead": 84,
                "energy": 90,
                "tactic": 93
            }
        },
        {
            "id": "c23",
            "name": "Muhammad Rizky Setiawan",
            "initials": "MR",
            "role": "Anggota Kelas",
            "title": "Fortunate Spark",
            "tag": "#23 FORTUNE",
            "color": "#2980b9",
            "badge": "GEN",
            "quote": "Kesetiaan pada kawan adalah harga mati dalam persaudaraan KDNATOES.",
            "stats": {
                "lead": 83,
                "energy": 94,
                "tactic": 86
            }
        },
        {
            "id": "c24",
            "name": "Muhammad Sholahudin Rasya Habibie",
            "initials": "MS",
            "role": "Seksi Teknologi",
            "title": "Aerospace Dreamer",
            "tag": "#24 INNOVATOR",
            "color": "#8e44ad",
            "badge": "GEN",
            "quote": "Terbang tinggi menembus batas mimpi seperti Sang Visioner Habibie.",
            "stats": {
                "lead": 87,
                "energy": 91,
                "tactic": 95
            }
        },
        {
            "id": "c25",
            "name": "Muhammad Syawal Satriaji Sarwodamono",
            "initials": "MS",
            "role": "Seksi Olahraga",
            "title": "Warrior Spirit",
            "tag": "#25 WARRIOR",
            "color": "#c0392b",
            "badge": "GEN",
            "quote": "Jiwa ksatria, pantang menyerah sebelum peluit akhir berbunyi.",
            "stats": {
                "lead": 88,
                "energy": 97,
                "tactic": 87
            }
        },
        {
            "id": "c26",
            "name": "Muhammad Yardan",
            "initials": "MY",
            "role": "Anggota Kelas",
            "title": "Brave Voyager",
            "tag": "#26 VOYAGER",
            "color": "#16a085",
            "badge": "GEN",
            "quote": "Setiap pelayaran besar dimulai dari keberanian meninggalkan pantai.",
            "stats": {
                "lead": 82,
                "energy": 92,
                "tactic": 88
            }
        },
        {
            "id": "c27",
            "name": "Nahla Kemal Rayya Abrisam",
            "initials": "NK",
            "role": "Anggota Kelas",
            "title": "Gentle Breeze",
            "tag": "#27 SILK",
            "color": "#00b894",
            "badge": "GEN",
            "quote": "Kelembutan tutur kata dan keteguhan prinsip adalah kekuatan sejati.",
            "stats": {
                "lead": 85,
                "energy": 89,
                "tactic": 92
            }
        },
        {
            "id": "c28",
            "name": "Nathan Ferdwiansyah Wicaksono",
            "initials": "NF",
            "role": "Dev Engineer",
            "title": "Cyber Architect // \"The Coder\"",
            "tag": "#28 SYSTEM",
            "color": "#00b894",
            "badge": "DEV",
            "quote": "Merancang sistem retro Windows 95 hingga baris kode dan pixel terakhir.",
            "stats": {
                "lead": 90,
                "energy": 96,
                "tactic": 98
            }
        },
        {
            "id": "c29",
            "name": "Naufal Surya Putra",
            "initials": "NS",
            "role": "Anggota Kelas",
            "title": "Sun Herald",
            "tag": "#29 DAWN",
            "color": "#e67e22",
            "badge": "GEN",
            "quote": "Membawa energi positif dan kehangatan tawa di setiap sudut kelas.",
            "stats": {
                "lead": 84,
                "energy": 94,
                "tactic": 87
            }
        },
        {
            "id": "c30",
            "name": "Naufal Syamil Adz Dzaki",
            "initials": "NS",
            "role": "Seksi Kesenian",
            "title": "Sharp Intellect",
            "tag": "#30 GENIUS",
            "color": "#9b59b6",
            "badge": "GEN",
            "quote": "Kreativitas dipadu ketajaman akal melahirkan karya tanpa batas.",
            "stats": {
                "lead": 86,
                "energy": 90,
                "tactic": 94
            }
        },
        {
            "id": "c31",
            "name": "Radithya Mahardika Dzaky",
            "initials": "RM",
            "role": "Fotografer & Media",
            "title": "Visual Maestro",
            "tag": "#31 SHUTTER",
            "color": "#34495e",
            "badge": "GEN",
            "quote": "Satu jepretan kamera mampu mengabadikan sejuta kenangan masa putih abu-abu.",
            "stats": {
                "lead": 85,
                "energy": 93,
                "tactic": 91
            }
        },
        {
            "id": "c32",
            "name": "Rais Widaya Jati",
            "initials": "RW",
            "role": "Kedisiplinan & Logistik",
            "title": "Iron Pillar",
            "tag": "#32 PILLAR",
            "color": "#636e72",
            "badge": "GEN",
            "quote": "Karakter sejati terbentuk dari ketahanan menghadapi tempaan ujian.",
            "stats": {
                "lead": 87,
                "energy": 95,
                "tactic": 88
            }
        },
        {
            "id": "c33",
            "name": "Ust Misbachul Munir",
            "initials": "WK",
            "role": "Wali Kelas XII-E",
            "title": "MASTER SENSEI",
            "tag": "BOSS MASTER",
            "color": "#ffd700",
            "badge": "BOSS",
            "isBoss": true,
            "quote": "Disiplin adalah jembatan antara impian besar dan pencapaian nyata.",
            "stats": {
                "lead": 100,
                "energy": 98,
                "tactic": 100
            }
        }
    ];

    // ======================================================================
    // 7b. Automatic Procedural Pixel Player Generator (All 36 Students)
    // ======================================================================
    function adjustColor(hex, lum) {
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        lum = lum || 0;
        let rgb = "#", c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00" + c).substr(c.length);
        }
        return rgb;
    }

    function generatePixelFighterSprite(char) {
        const W = 140;
        const H = 160;
        const canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext('2d');

        function px(x, y, w, h, col) {
            ctx.fillStyle = col;
            ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
        }

        const cId = char.id;
        const isFemale = false;
        const isBoss = char.isBoss || cId === 'c33';
        const isGlitch = cId === 'c35';
        const isOff = char.isOff || cId === 'c33' || cId === 'c34';

        const baseCol = char.color || '#0984e3';
        const lightCol = adjustColor(baseCol, 0.35);
        const darkCol = adjustColor(baseCol, -0.35);

        // 1. Desk Surface & Exam Sheet in Foreground
        px(15, 126, 110, 34, '#b2bec3');
        px(10, 150, 120, 10, '#95a5a6');
        px(65, 122, 45, 24, '#f5f6fa'); // white exam paper

        // 2. Character Torso & Shoulders (Waist-up in perspective)
        px(55, 95, 60, 33, baseCol);
        px(85, 95, 30, 33, darkCol);
        // Collar & Tie / Badge
        px(70, 92, 15, 18, '#ffffff');
        px(75, 98, 5, 26, isBoss ? '#ffd700' : (isFemale ? '#e74c3c' : '#0984e3'));

        if (isBoss) {
            // Golden Batik embroidery lines on jacket
            px(58, 102, 4, 3, '#ffd700');
            px(66, 112, 4, 3, '#ffd700');
            px(92, 102, 4, 3, '#ffd700');
            px(100, 112, 4, 3, '#ffd700');
        }

        // 3. Neck & Head
        px(68, 75, 20, 20, '#d89f78'); // neck shadow
        // Face polygon
        px(60, 45, 45, 43, '#f6c49a'); // face base
        px(88, 45, 17, 43, '#e5b08c'); // right face shadow
        px(62, 85, 38, 5, '#e5b08c');  // chin shadow

        // Stylized Ear on right
        px(102, 54, 7, 15, '#e5b08c');
        px(104, 57, 3, 9, '#d89f78');

        // Expressive Arcade Mouth with White Teeth Bar (Just like Foto 1!)
        px(72, 74, 20, 7, '#781e1e');
        px(74, 75, 16, 3, '#ffffff'); // teeth

        // Eyes
        if (isGlitch) {
            // Giant glowing red cyber eye
            px(62, 52, 40, 10, '#110c1f');
            px(72, 53, 20, 8, '#cc0000');
            px(78, 54, 8, 6, '#ffffff');
            px(80, 55, 4, 4, '#ff0055');
        } else if (cId === 'c28') {
            // Nathan (DEV): Glowing Cyan HUD Visor
            px(62, 52, 40, 10, '#00e5ff');
            px(66, 54, 32, 4, '#ffffff');
        } else {
            // Natural expressive arcade eyes
            // Left Eye
            px(66, 54, 8, 5, '#ffffff');
            px(70, 54, 4, 5, '#1e272e');
            px(68, 54, 2, 2, '#ffffff');
            // Right Eye
            px(86, 54, 8, 5, '#ffffff');
            px(88, 54, 4, 5, '#1e272e');
            px(90, 54, 2, 2, '#ffffff');
            // Eyebrows
            px(65, 50, 10, 3, '#1a1a1a');
            px(85, 50, 10, 3, '#1a1a1a');
        }

        // 4. Hair / Headwear
        if (isBoss) {
            // Ust Misbachul Munir: Regal Black Velvet Peci / Songkok with Gold Trim Band
            px(58, 20, 48, 26, '#111111');
            px(58, 42, 48, 4, '#ffd700'); // Gold trim
            // Trimmed beard & moustache
            px(70, 72, 24, 2, '#2c3437');
            px(74, 81, 16, 7, '#2c3437');
            // Golden Aura Sparks
            px(45, 30, 4, 4, '#ffd700');
            px(115, 28, 4, 4, '#ffd700');
            px(120, 80, 3, 3, '#ffd700');
        } else if (isFemale) {
            // Styled Elegant Hijab framing face with gold brooch
            px(54, 26, 56, 20, lightCol);
            px(52, 38, 9, 48, lightCol);
            px(101, 38, 9, 48, darkCol);
            px(65, 88, 32, 12, lightCol);
            // Hijab accessory pin
            px(70, 89, 4, 4, '#ffd700');
        } else {
            // Spiky Punk / Anime Hair radiating outward (like Foto 1 Iqbal & Anas!)
            const spikes = [
                [60, 46, 58, 20, 66, 44],
                [66, 44, 68, 14, 74, 42],
                [74, 42, 78, 10, 82, 42],
                [82, 42, 88, 12, 92, 43],
                [92, 43, 98, 16, 102, 45],
                [102, 45, 110, 24, 106, 48],
                [106, 48, 116, 35, 105, 52]
            ];
            ctx.fillStyle = '#1a1a1a';
            spikes.forEach(([x1, y1, x2, y2, x3, y3]) => {
                ctx.beginPath();
                ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3);
                ctx.fill();
            });
            px(60, 40, 45, 10, '#2d3436');
            px(64, 42, 30, 4, '#4b5563'); // hair highlight
        }

        // 5. Signature Prop in Foreground (Held close to camera like Iqbal's Inten Book!)
        const propCol = baseCol;
        px(18, 38, 45, 88, propCol);
        px(22, 42, 37, 80, darkCol);
        // Spiral rings on left edge
        for (let sy = 46; sy <= 118; sy += 9) {
            px(15, sy, 6, 3, '#dfe6e9');
        }
        // Center panel on prop
        px(26, 58, 29, 36, '#2d3436');
        px(29, 64, 23, 2, lightCol);
        px(29, 72, 18, 2, '#ffffff');
        px(29, 80, 21, 2, '#ffd700');

        // Hands holding prop (top and bottom in 3D perspective!)
        px(14, 44, 14, 14, '#f6c49a');
        px(16, 46, 10, 10, '#ffe2cb');
        px(10, 110, 16, 16, '#f6c49a');
        px(8, 118, 12, 10, '#d89f78');

        // 6. Upscale to 280x320 nearest-neighbor for high-DPI razor sharpness
        const outCanvas = document.createElement('canvas');
        outCanvas.width = 280;
        outCanvas.height = 320;
        const outCtx = outCanvas.getContext('2d');
        outCtx.imageSmoothingEnabled = false;
        if ('webkitImageSmoothingEnabled' in outCtx) outCtx.webkitImageSmoothingEnabled = false;
        if ('mozImageSmoothingEnabled' in outCtx) outCtx.mozImageSmoothingEnabled = false;
        if ('msImageSmoothingEnabled' in outCtx) outCtx.msImageSmoothingEnabled = false;
        outCtx.drawImage(canvas, 0, 0, 280, 320);

        return outCanvas.toDataURL('image/png');
    }

    // Persist and restore custom student portraits from localStorage,
    // or automatically generate individual pixel player sprites!
    const PHOTO_ENGINE_VERSION = 'v5_original_pixelator';
    try {
        if (localStorage.getItem('photo_engine_ver') !== PHOTO_ENGINE_VERSION) {
            for (let i = 1; i <= 36; i++) {
                localStorage.removeItem('char_photo_c' + i);
            }
            localStorage.setItem('photo_engine_ver', PHOTO_ENGINE_VERSION);
        }
    } catch (e) { }

    const defaultCharacterPhotos = {};
    arcadeCharacters.forEach(c => {
        if (!c.photo) {
            c.photo = generatePixelFighterSprite(c);
        }
        if (c.photo) defaultCharacterPhotos[c.id] = c.photo;
        try {
            const savedPhoto = localStorage.getItem('char_photo_' + c.id);
            if (savedPhoto) {
                c.photo = savedPhoto;
            }
        } catch (e) { }
    });

    let selectedCharIndex = 13; // Default ke Iqbal Qodama Khoirurrijal (Ketua Kelas)
    const tekkenRowTop = document.getElementById('tekken-row-top');
    const tekkenRowMid = document.getElementById('tekken-row-mid');
    const tekkenRowBot = document.getElementById('tekken-row-bot');

    const tekkenRanks = [
        "Tekken Lord", "Divine Fist", "Dragon Sovereign", "Emperor", "Tekken God", "Iron Fist",
        "Vanquisher", "Berserker", "Sage", "Juggernaut", "Solar Champion", "Grandmaster",
        "Brawler", "Shadow Master", "Soundwave King", "Siren of Melody", "The Alchemist", "Zenith",
        "Colossus", "Lightning Rogue", "Starlight Weaver", "Supreme Jurist", "Cosmic Dreamer", "Turbo Engine",
        "Sun Warrior", "Serene Healer", "Falcon Eye", "Dawn Blossom", "Master Tactician", "Chrono Shifter",
        "Crystal Harmony", "Titan Shield", "Secret Challenger", "Shadow Challenger", "System Glitch", "Grand Master Sensei"
    ];

    function playTekkenSelect() {
        playBeep(880, 'square', 0.03);
    }

    function playTekkenConfirm() {
        playBeep(350, 'sawtooth', 0.08);
        setTimeout(() => playBeep(520, 'sine', 0.12), 60);
        setTimeout(() => playBeep(780, 'triangle', 0.16), 120);
    }

    function createTekkenTile(char, index) {
        const tile = document.createElement('div');
        tile.className = `tekken-tile ${index === selectedCharIndex ? 'is-selected' : ''} ${char.isOff ? 'is-off' : ''} ${char.isBoss ? 'is-boss' : ''}`;
        tile.dataset.index = index;
        tile.setAttribute('role', 'option');
        tile.setAttribute('aria-selected', index === selectedCharIndex ? 'true' : 'false');
        tile.title = `${char.name} (${char.role})`;

        if (char.photo) {
            tile.innerHTML = `
                <div class="tekken-tile-thumb" style="background: ${char.color};">
                    <img src="${char.photo}" alt="${char.name}" class="tekken-tile-photo" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='block';" />
                    <span class="tekken-tile-initials" style="display: none;">${char.initials}</span>
                    <span class="tekken-tile-badge" ${char.isBoss ? 'style="color: #ffd700;"' : ''}>${char.badge}</span>
                </div>
            `;
        } else if (char.isOff) {
            tile.innerHTML = `
                <div class="tekken-tile-thumb" style="background: #111827;">
                    <span class="tekken-tile-initials" style="color: #64748b; font-size: 11px;">?</span>
                    <span class="tekken-tile-badge" style="color: #64748b;">OFF</span>
                </div>
            `;
        } else {
            tile.innerHTML = `
                <div class="tekken-tile-thumb" style="background: ${char.color};">
                    <span class="tekken-tile-initials">${char.initials}</span>
                    <span class="tekken-tile-badge" ${char.isBoss ? 'style="color: #ffd700;"' : ''}>${char.badge}</span>
                </div>
            `;
        }

        tile.addEventListener('click', () => {
            if (selectedCharIndex === index) {
                confirmArcadeSelection();
            } else {
                selectCharacter(index);
            }
        });

        return tile;
    }

    function renderTekkenGrid() {
        if (!tekkenRowTop || !tekkenRowMid || !tekkenRowBot) return;
        tekkenRowTop.innerHTML = '';
        tekkenRowMid.innerHTML = '';
        tekkenRowBot.innerHTML = '';

        arcadeCharacters.forEach((char, index) => {
            const tile = createTekkenTile(char, index);
            if (index < 11) {
                tekkenRowTop.appendChild(tile);
            } else if (index < 22) {
                tekkenRowMid.appendChild(tile);
            } else {
                tekkenRowBot.appendChild(tile);
            }
        });
    }

    function selectCharacter(index) {
        if (index < 0) index = arcadeCharacters.length - 1;
        if (index >= arcadeCharacters.length) index = 0;

        selectedCharIndex = index;
        const char = arcadeCharacters[selectedCharIndex];
        const rank = tekkenRanks[selectedCharIndex] || 'Fighter';

        // Update active class on all tiles across rows
        const allTiles = document.querySelectorAll('.tekken-tile');
        allTiles.forEach((tile) => {
            const tileIdx = parseInt(tile.dataset.index, 10);
            if (tileIdx === selectedCharIndex) {
                tile.classList.add('is-selected');
                tile.setAttribute('aria-selected', 'true');
            } else {
                tile.classList.remove('is-selected');
                tile.setAttribute('aria-selected', 'false');
            }
        });

        // Update Left Showcase
        const nameEl = document.getElementById('tekken-char-name');
        const rankEl = document.getElementById('tekken-char-rank');
        const styleEl = document.getElementById('tekken-char-style');
        const slotEl = document.getElementById('tekken-slot-status');
        const torsoEl = document.getElementById('tekken-figure-torso');
        const hairEl = document.getElementById('tekken-figure-hair');
        const badgeEl = document.getElementById('tekken-figure-badge');
        const figure = document.getElementById('tekken-fighter-figure');
        const photoEl = document.getElementById('tekken-fighter-photo');

        if (nameEl) nameEl.textContent = char.name;
        if (rankEl) {
            rankEl.textContent = rank;
            if (char.isBoss) {
                rankEl.style.borderColor = '#ffd700';
                rankEl.style.color = '#ffd700';
            } else {
                rankEl.style.borderColor = '#8c5828';
                rankEl.style.color = '#fef08a';
            }
        }
        if (styleEl) {
            const cleanTitle = char.title.includes('"') ? char.title : `"${char.title}"`;
            styleEl.textContent = `${char.role} // ${cleanTitle}`;
        }
        if (slotEl) slotEl.textContent = `FIGHTER ${String(selectedCharIndex + 1).padStart(2, '0')} / 36`;

        const leadEl = document.getElementById('tekken-stat-lead');
        const energyEl = document.getElementById('tekken-stat-energy');
        const tacticEl = document.getElementById('tekken-stat-tactic');
        if (leadEl) leadEl.textContent = char.stats ? char.stats.lead : '85';
        if (energyEl) energyEl.textContent = char.stats ? char.stats.energy : '85';
        if (tacticEl) tacticEl.textContent = char.stats ? char.stats.tactic : '85';

        // Switch between real photo and stylized figure model
        if (char.photo) {
            if (photoEl) {
                photoEl.src = char.photo;
                photoEl.alt = char.name;
                photoEl.style.display = 'block';
                photoEl.onerror = () => {
                    photoEl.style.display = 'none';
                    if (figure) figure.style.display = 'flex';
                };
                photoEl.style.transform = 'translateY(-8px) scale(1.04)';
                setTimeout(() => {
                    photoEl.style.transform = 'translateY(0) scale(1)';
                }, 150);
            }
            if (figure) figure.style.display = 'none';
        } else {
            if (photoEl) photoEl.style.display = 'none';
            if (figure) {
                figure.style.display = 'flex';
                if (torsoEl) torsoEl.style.background = char.color;
                if (badgeEl) badgeEl.textContent = char.badge;
                if (hairEl) {
                    hairEl.style.background = char.isBoss ? '#ffd700' : (char.id === 'c35' ? '#00cec9' : '#2d3436');
                }
                figure.style.transform = 'translateY(-8px) scale(1.04)';
                setTimeout(() => {
                    figure.style.transform = 'translateY(0) scale(1)';
                }, 150);
            }
        }

        playTekkenSelect();
    }

    function navigateTekkenChar(direction) {
        let nextIndex = selectedCharIndex;
        if (direction === 'left') {
            nextIndex = (selectedCharIndex - 1 + arcadeCharacters.length) % arcadeCharacters.length;
        } else if (direction === 'right') {
            nextIndex = (selectedCharIndex + 1) % arcadeCharacters.length;
        } else if (direction === 'down') {
            if (selectedCharIndex < 10) {
                // Row 1 (0..9) to Row 2 (10..22): Row 1 centered over Row 2
                nextIndex = 10 + Math.min(12, Math.max(0, selectedCharIndex + 1));
            } else if (selectedCharIndex < 23) {
                // Row 2 (10..22) to Row 3 (23..35): Directly aligned
                nextIndex = selectedCharIndex + 13;
            } else {
                // Row 3 (23..35) wraps to Row 1
                nextIndex = Math.max(0, Math.min(9, selectedCharIndex - 24));
            }
        } else if (direction === 'up') {
            if (selectedCharIndex >= 23) {
                // Row 3 (23..35) to Row 2 (10..22)
                nextIndex = selectedCharIndex - 13;
            } else if (selectedCharIndex >= 10) {
                // Row 2 (10..22) to Row 1 (0..9)
                nextIndex = Math.max(0, Math.min(9, selectedCharIndex - 11));
            } else {
                // Row 1 (0..9) wraps to Row 3
                nextIndex = 23 + Math.min(12, selectedCharIndex + 1);
            }
        }
        selectCharacter(nextIndex);
    }

    // Random Pick Roulette
    const btnTekkenRandom = document.getElementById('btn-tekken-random');
    let isCycling = false;

    function triggerRandomTekkenPick() {
        if (isCycling) return;
        isCycling = true;
        let count = 0;
        const totalCycles = 16;
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * arcadeCharacters.length);
            selectCharacter(randomIndex);
            playBeep(450 + count * 35, 'square', 0.02);
            count++;
            if (count >= totalCycles) {
                clearInterval(interval);
                isCycling = false;
                playTekkenConfirm();
            }
        }, 70);
    }

    if (btnTekkenRandom) {
        btnTekkenRandom.addEventListener('click', triggerRandomTekkenPick);
    }

    // Character Detail Modal & Card Exporter Logic
    const closeCharModalBtn = document.getElementById('close-char-modal-btn');
    const btnCharModalClose = document.getElementById('btn-char-modal-close');
    const btnTekkenDetailsModal = document.getElementById('btn-tekken-details-modal');
    const btnExportCharCard = document.getElementById('btn-export-char-card');
    let currentCharInModal = null;

    function playFloppySound() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            for (let i = 0; i < 5; i++) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(150 + i * 30, now + i * 0.035);
                gain.gain.setValueAtTime(0.04, now + i * 0.035);
                gain.gain.exponentialRampToValueAtTime(0.001, now + (i + 1) * 0.035);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + i * 0.035);
                osc.stop(now + (i + 1) * 0.035);
            }
        } catch (e) { }
    }

    function announceFighter(name) {
        if (!soundEnabled || !('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            const cleanName = name.replace(/\(.*?\)/g, '').trim();
            const utter = new SpeechSynthesisUtterance(cleanName);
            utter.rate = 1.05;
            utter.pitch = 0.9;
            utter.volume = 0.65;
            window.speechSynthesis.speak(utter);
        } catch (e) { }
    }

    function openCharModal(char) {
        if (!char) return;
        currentCharInModal = char;
        const initialsEl = document.getElementById('modal-char-avatar-initials');
        const avatarBox = document.getElementById('modal-char-avatar-box');
        const roleEl = document.getElementById('modal-char-role');
        const nameEl = document.getElementById('modal-char-fullname');
        const titleEl = document.getElementById('modal-char-title');
        const quoteEl = document.getElementById('modal-char-quote');
        const stat1El = document.getElementById('modal-stat-1');
        const stat2El = document.getElementById('modal-stat-2');
        const stat3El = document.getElementById('modal-stat-3');

        if (avatarBox) {
            avatarBox.style.background = char.color;
            avatarBox.style.color = '#fff';
            avatarBox.style.borderColor = char.isBoss ? '#ffd700' : '#ffffff';
            if (char.photo) {
                avatarBox.innerHTML = `
                    <img src="${char.photo}" alt="${char.name}" class="char-modal-photo" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='block';" />
                    <span id="modal-char-avatar-initials" style="display:none;">${char.initials}</span>
                `;
            } else {
                avatarBox.innerHTML = `<span id="modal-char-avatar-initials">${char.initials}</span>`;
            }
        }
        if (roleEl) roleEl.textContent = char.role;
        if (nameEl) nameEl.textContent = char.name;
        if (titleEl) titleEl.textContent = `“${char.title}”`;
        if (quoteEl) quoteEl.textContent = `"${char.quote}"`;
        if (stat1El) stat1El.textContent = `${char.stats.lead} / 100`;
        if (stat2El) stat2El.textContent = `${char.stats.energy} / 100`;
        if (stat3El) stat3El.textContent = `${char.stats.tactic} / 100`;

        playTekkenConfirm();
        announceFighter(char.name);
        openModal('char-modal-backdrop');
    }

    // Helper to draw beveled 3D rectangles on canvas (classic Windows 95 outset / inset)
    function drawCanvasBevel(ctx, x, y, width, height, isInset = false, bgColor = '#c0c0c0') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(x, y, width, height);

        const lightColor = isInset ? '#808080' : '#ffffff';
        const darkColor = isInset ? '#ffffff' : '#000000';
        const midDarkColor = isInset ? '#dfdfdf' : '#808080';

        ctx.fillStyle = lightColor;
        ctx.fillRect(x, y, width, 2);
        ctx.fillRect(x, y, 2, height);

        ctx.fillStyle = darkColor;
        ctx.fillRect(x, y + height - 2, width, 2);
        ctx.fillRect(x + width - 2, y, 2, height);

        ctx.fillStyle = isInset ? '#000000' : midDarkColor;
        ctx.fillRect(x + 2, y + height - 4, width - 4, 2);
        ctx.fillRect(x + width - 4, y + 2, 2, height - 4);
    }

    // Helper for multiline text wrapping on canvas
    function drawCanvasWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                ctx.fillText(line, x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, currentY);
        return currentY + lineHeight;
    }

    async function exportCharacterCard(char) {
        if (!char) return;
        const btnExport = document.getElementById('btn-export-char-card');
        const origText = btnExport ? btnExport.innerHTML : '';
        if (btnExport) {
            btnExport.disabled = true;
            btnExport.innerHTML = '💾 Sedang Merender Kartu...';
        }

        try {
            const canvas = document.createElement('canvas');
            canvas.width = 640;
            canvas.height = 900;
            const ctx = canvas.getContext('2d');

            // 1. Windows 95 Outer Frame
            drawCanvasBevel(ctx, 0, 0, 640, 900, false, '#c0c0c0');

            // 2. Windows 95 Title Bar
            const titleGrad = ctx.createLinearGradient(6, 6, 634, 30);
            titleGrad.addColorStop(0, '#000080');
            titleGrad.addColorStop(1, '#1084d0');
            ctx.fillStyle = titleGrad;
            ctx.fillRect(6, 6, 628, 28);

            // Title Bar Text & Icon
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 13px "Segoe UI", Tahoma, Arial, sans-serif';
            ctx.fillText('🕹️  KARTU TANDA PETARUNG // KELAS XII - E (ARCADE 1995)', 16, 25);

            // Win95 Close Button Glyph
            drawCanvasBevel(ctx, 610, 8, 20, 22, false, '#c0c0c0');
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 12px monospace';
            ctx.fillText('×', 616, 23);

            // 3. Sub-header Ribbon
            ctx.fillStyle = '#2d3436';
            ctx.fillRect(14, 42, 612, 26);
            ctx.fillStyle = '#00ff88';
            ctx.font = 'bold 11px monospace';
            ctx.fillText('● SYSTEM: READY // XII-E FIGHTER DOSSIER • TEKKEN EDITION', 22, 59);
            ctx.fillStyle = '#fdcb6e';
            ctx.font = 'bold 11px monospace';
            ctx.fillText(`FIGHTER ID: #${char.id.toUpperCase()}`, 500, 59);

            // 4. Character Portrait Box (Win Inset)
            const portraitX = 24;
            const portraitY = 78;
            const portraitW = 592;
            const portraitH = 430;

            drawCanvasBevel(ctx, portraitX, portraitY, portraitW, portraitH, true, '#070b14');

            // Arena Glow / Radial Gradient in Portrait
            const arenaGrad = ctx.createRadialGradient(
                portraitX + portraitW / 2, portraitY + 280, 20,
                portraitX + portraitW / 2, portraitY + 280, 320
            );
            arenaGrad.addColorStop(0, 'rgba(0, 184, 148, 0.32)');
            arenaGrad.addColorStop(0.6, 'rgba(9, 132, 227, 0.18)');
            arenaGrad.addColorStop(1, 'rgba(5, 8, 16, 0.98)');
            ctx.fillStyle = arenaGrad;
            ctx.fillRect(portraitX + 4, portraitY + 4, portraitW - 8, portraitH - 8);

            // Cyber grid lines at arena base
            ctx.strokeStyle = 'rgba(0, 255, 136, 0.12)';
            ctx.lineWidth = 1;
            for (let gy = portraitY + 340; gy < portraitY + portraitH - 8; gy += 15) {
                ctx.beginPath();
                ctx.moveTo(portraitX + 4, gy);
                ctx.lineTo(portraitX + portraitW - 4, gy);
                ctx.stroke();
            }

            // Draw Character Photo or Avatar
            let photoDrawn = false;
            if (char.photo) {
                try {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    await new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = reject;
                        img.src = char.photo;
                    });

                    ctx.save();
                    ctx.imageSmoothingEnabled = false;

                    // Ground Shadow
                    ctx.fillStyle = 'rgba(0,0,0,0.55)';
                    ctx.beginPath();
                    ctx.ellipse(portraitX + portraitW / 2, portraitY + portraitH - 25, 140, 22, 0, 0, Math.PI * 2);
                    ctx.fill();

                    const scale = Math.min((portraitW - 40) / img.width, (portraitH - 30) / img.height);
                    const dw = img.width * scale;
                    const dh = img.height * scale;
                    const dx = portraitX + (portraitW - dw) / 2;
                    const dy = portraitY + portraitH - dh - 12;

                    ctx.drawImage(img, dx, dy, dw, dh);
                    ctx.restore();
                    photoDrawn = true;
                } catch (err) {
                    console.warn('Canvas image render fallback to avatar:', err);
                }
            }

            if (!photoDrawn) {
                const avX = portraitX + portraitW / 2;
                const avY = portraitY + portraitH / 2 - 20;

                ctx.fillStyle = char.color || '#0984e3';
                ctx.beginPath();
                ctx.arc(avX, avY, 90, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 4;
                ctx.stroke();

                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 70px "Trebuchet MS", sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(char.initials, avX, avY);
                ctx.textAlign = 'left';
                ctx.textBaseline = 'alphabetic';
            }

            // 5. Stat Ribbon & Fighter Identity
            const ribbonY = 518;
            const ribbonH = 74;
            drawCanvasBevel(ctx, 24, ribbonY, 592, ribbonH, false, '#060b17');

            // Rank Plaque
            drawCanvasBevel(ctx, 32, ribbonY + 12, 60, 50, false, '#d35400');
            ctx.fillStyle = '#f1c40f';
            ctx.font = 'bold 16px "Arial Black", Impact, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(char.badge || 'KM', 62, ribbonY + 42);
            ctx.textAlign = 'left';

            // Character Name (Outlined white text)
            const nameY = ribbonY + 38;
            ctx.font = '900 27px "Trebuchet MS", "Impact", "Arial Black", sans-serif';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 5;
            ctx.strokeText(char.name.toUpperCase(), 105, nameY);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(char.name.toUpperCase(), 105, nameY);

            // Subtitle / Title
            ctx.font = 'bold 12px monospace';
            ctx.fillStyle = '#00e5ff';
            ctx.fillText(`“${char.title}”  //  [ ${char.role.toUpperCase()} ]`, 105, ribbonY + 58);

            // 6. Quote Inset Box
            const quoteY = 600;
            drawCanvasBevel(ctx, 24, quoteY, 592, 64, true, '#ffffff');
            ctx.fillStyle = '#333333';
            ctx.font = 'italic 12px "Segoe UI", Tahoma, sans-serif';
            drawCanvasWrappedText(ctx, `"${char.quote}"`, 36, quoteY + 25, 568, 17);

            // 7. Stats Section (3 Columns)
            const statsY = 672;
            const statW = 190;
            const statGap = 11;
            const statsData = [
                { label: 'DISIPLIN', val: char.stats.lead, color: '#0984e3' },
                { label: 'SOLIDARITAS', val: char.stats.energy, color: '#00b894' },
                { label: 'TAKTIK', val: char.stats.tactic, color: '#6c5ce7' }
            ];

            statsData.forEach((st, idx) => {
                const sx = 24 + idx * (statW + statGap);
                drawCanvasBevel(ctx, sx, statsY, statW, 90, true, '#eef2f7');

                ctx.fillStyle = '#555555';
                ctx.font = 'bold 10px monospace';
                ctx.fillText(st.label, sx + 12, statsY + 22);

                ctx.fillStyle = st.color;
                ctx.font = 'bold 18px "Trebuchet MS", sans-serif';
                ctx.fillText(`${st.val} / 100`, sx + 12, statsY + 46);

                drawCanvasBevel(ctx, sx + 10, statsY + 58, statW - 20, 18, true, '#ffffff');

                const fillW = Math.max(4, Math.round(((statW - 24) * st.val) / 100));
                ctx.fillStyle = st.color;
                ctx.fillRect(sx + 12, statsY + 60, fillW, 14);

                ctx.fillStyle = 'rgba(255,255,255,0.3)';
                for (let px = sx + 12; px < sx + 12 + fillW; px += 4) {
                    ctx.fillRect(px, statsY + 60, 2, 14);
                }
            });

            // 8. Footer & Barcode Authentication
            const footerY = 772;
            drawCanvasBevel(ctx, 24, footerY, 592, 94, true, '#ffffff');

            const barcodeX = 36;
            const barcodeY = footerY + 12;
            ctx.fillStyle = '#000000';
            const barPattern = [3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 2, 1, 2, 3, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2];
            let bx = barcodeX;
            for (let i = 0; i < barPattern.length; i++) {
                ctx.fillRect(bx, barcodeY, barPattern[i], 42);
                bx += barPattern[i] + (i % 2 === 0 ? 3 : 2);
            }

            ctx.font = '10px monospace';
            ctx.fillStyle = '#333333';
            ctx.fillText(`XII-E-${char.id.toUpperCase()}-${Date.now().toString().slice(-4)}`, barcodeX, barcodeY + 56);

            ctx.fillStyle = '#2d3436';
            ctx.font = 'bold 12px "Segoe UI", Arial, sans-serif';
            ctx.fillText('VERIFIKASI RESMI: ANGKATAN XII - E', 250, footerY + 30);
            ctx.font = '11px "Segoe UI", Arial, sans-serif';
            ctx.fillStyle = '#636e72';
            ctx.fillText('Dicetak langsung dari Desktop Retro Windows 95 & Tekken Stage', 250, footerY + 48);
            ctx.fillText('“Solidaritas 100% — Selamanya Keluarga XII-E”', 250, footerY + 66);

            ctx.strokeStyle = '#c0392b';
            ctx.lineWidth = 2;
            ctx.strokeRect(505, footerY + 12, 100, 68);
            ctx.fillStyle = '#c0392b';
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('XII - E', 555, footerY + 38);
            ctx.fillText('CERTIFIED', 555, footerY + 54);
            ctx.textAlign = 'left';

            playFloppySound();

            const safeFileName = `Kartu_XII-E_${char.name.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = safeFileName;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            if (btnExport) {
                btnExport.innerHTML = '✓ Kartu Terunduh!';
                setTimeout(() => {
                    btnExport.disabled = false;
                    btnExport.innerHTML = origText || '💾 Unduh Kartu Siswa (.png)';
                }, 2200);
            }
        } catch (err) {
            console.error('Error exporting card:', err);
            if (btnExport) {
                btnExport.disabled = false;
                btnExport.innerHTML = '⚠ Gagal Mengunduh';
                setTimeout(() => {
                    btnExport.innerHTML = origText || '💾 Unduh Kartu Siswa (.png)';
                }, 2000);
            }
        }
    }

    function confirmArcadeSelection() {
        const char = arcadeCharacters[selectedCharIndex];
        playTekkenConfirm();
        openCharModal(char);
    }

    if (closeCharModalBtn) closeCharModalBtn.addEventListener('click', () => closeModal('char-modal-backdrop'));
    if (btnCharModalClose) btnCharModalClose.addEventListener('click', () => closeModal('char-modal-backdrop'));
    if (btnTekkenDetailsModal) {
        btnTekkenDetailsModal.addEventListener('click', () => {
            openCharModal(arcadeCharacters[selectedCharIndex]);
        });
    }
    if (btnExportCharCard) {
        btnExportCharCard.addEventListener('click', () => {
            const char = currentCharInModal || arcadeCharacters[selectedCharIndex];
            exportCharacterCard(char);
        });
    }

    // In-Browser Retro Photo Pixelator & Customizer (Option 2)
    const charPhotoInput = document.getElementById('char-photo-upload-input');
    const btnCharResetPhoto = document.getElementById('btn-char-reset-photo');

    function playCameraShutterSound() {
        if (!soundEnabled) return;
        try {
            playBeep(1200, 'square', 0.025);
            setTimeout(() => playBeep(650, 'triangle', 0.04), 35);
            setTimeout(() => playBeep(980, 'square', 0.02), 90);
        } catch (e) { }
    }

    if (charPhotoInput) {
        charPhotoInput.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file || !currentCharInModal) return;

            const reader = new FileReader();
            reader.onload = (ev) => {
                const img = new Image();
                img.onload = () => {
                    // Downscale into tiny pixel buffer (72x90)
                    const pW = 72;
                    const pH = 90;
                    const pCanvas = document.createElement('canvas');
                    pCanvas.width = pW;
                    pCanvas.height = pH;
                    const pCtx = pCanvas.getContext('2d');
                    pCtx.drawImage(img, 0, 0, pW, pH);

                    // Upscale using nearest neighbor (crisp retro pixel art)
                    const outW = 288;
                    const outH = 360;
                    const outCanvas = document.createElement('canvas');
                    outCanvas.width = outW;
                    outCanvas.height = outH;
                    const outCtx = outCanvas.getContext('2d');
                    outCtx.imageSmoothingEnabled = false;
                    if ('webkitImageSmoothingEnabled' in outCtx) outCtx.webkitImageSmoothingEnabled = false;
                    if ('mozImageSmoothingEnabled' in outCtx) outCtx.mozImageSmoothingEnabled = false;
                    if ('msImageSmoothingEnabled' in outCtx) outCtx.msImageSmoothingEnabled = false;
                    outCtx.drawImage(pCanvas, 0, 0, outW, outH);

                    const pixelDataUrl = outCanvas.toDataURL('image/png');

                    // Persist to localStorage
                    try {
                        localStorage.setItem('char_photo_' + currentCharInModal.id, pixelDataUrl);
                    } catch (err) {
                        console.warn('Storage quota warning:', err);
                    }

                    // Update memory state
                    currentCharInModal.photo = pixelDataUrl;
                    const targetInRoster = arcadeCharacters.find(c => c.id === currentCharInModal.id);
                    if (targetInRoster) targetInRoster.photo = pixelDataUrl;

                    // Update modal avatar frame
                    const avatarBox = document.getElementById('modal-char-avatar-box');
                    if (avatarBox) {
                        avatarBox.innerHTML = `
                            <img src="${pixelDataUrl}" alt="${currentCharInModal.name}" class="char-modal-photo" />
                            <span id="modal-char-avatar-initials" style="display:none;">${currentCharInModal.initials}</span>
                        `;
                    }

                    // Update Tekken showcase & grid
                    renderTekkenGrid();
                    selectCharacter(selectedCharIndex);
                    playCameraShutterSound();
                };
                img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
            charPhotoInput.value = '';
        });
    }

    if (btnCharResetPhoto) {
        btnCharResetPhoto.addEventListener('click', () => {
            if (!currentCharInModal) return;
            try {
                localStorage.removeItem('char_photo_' + currentCharInModal.id);
            } catch (e) { }

            if (defaultCharacterPhotos[currentCharInModal.id]) {
                currentCharInModal.photo = defaultCharacterPhotos[currentCharInModal.id];
            } else {
                delete currentCharInModal.photo;
            }

            const targetInRoster = arcadeCharacters.find(c => c.id === currentCharInModal.id);
            if (targetInRoster) {
                if (defaultCharacterPhotos[targetInRoster.id]) {
                    targetInRoster.photo = defaultCharacterPhotos[targetInRoster.id];
                } else {
                    delete targetInRoster.photo;
                }
            }

            // Update modal avatar frame
            const avatarBox = document.getElementById('modal-char-avatar-box');
            if (avatarBox) {
                avatarBox.style.background = currentCharInModal.color;
                if (currentCharInModal.photo) {
                    avatarBox.innerHTML = `
                        <img src="${currentCharInModal.photo}" alt="${currentCharInModal.name}" class="char-modal-photo" />
                        <span id="modal-char-avatar-initials" style="display:none;">${currentCharInModal.initials}</span>
                    `;
                } else {
                    avatarBox.innerHTML = `<span id="modal-char-avatar-initials">${currentCharInModal.initials}</span>`;
                }
            }

            renderTekkenGrid();
            selectCharacter(selectedCharIndex);
            playRetroClick();
        });
    }

    // Keyboard Arrow Navigation for Character Selection & Gallery
    window.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

        // If gallery lightbox is open, allow arrow keys for photos and space for slideshow
        const isGalleryOpen = document.getElementById('gallery-lightbox') && document.getElementById('gallery-lightbox').classList.contains('is-open');
        if (isGalleryOpen) {
            if (e.key === 'ArrowRight') {
                stopGallerySlideshow();
                renderGallerySlide(currentGalleryIndex + 1);
                e.preventDefault();
            } else if (e.key === 'ArrowLeft') {
                stopGallerySlideshow();
                renderGallerySlide(currentGalleryIndex - 1);
                e.preventDefault();
            } else if (e.key === ' ' || e.code === 'Space') {
                toggleGallerySlideshow();
                e.preventDefault();
            }
            return;
        }

        const isModalOpen = document.querySelector('.win-modal-backdrop.is-open');
        if (isModalOpen) return;

        if (e.key === 'ArrowRight') {
            navigateTekkenChar('right');
            e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
            navigateTekkenChar('left');
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            navigateTekkenChar('down');
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            navigateTekkenChar('up');
            e.preventDefault();
        } else if (e.key === 'Enter') {
            confirmArcadeSelection();
            e.preventDefault();
        }
    });

    // Tekken 5 Arcade Countdown Timer
    const tekkenTimerEl = document.getElementById('tekken-timer');
    let tekkenSeconds = 10;
    setInterval(() => {
        if (!tekkenTimerEl) return;
        tekkenSeconds--;
        if (tekkenSeconds < 1) {
            tekkenSeconds = 10;
            playBeep(980, 'square', 0.05);
        }
        tekkenTimerEl.textContent = tekkenSeconds;
        if (tekkenSeconds <= 3) {
            tekkenTimerEl.style.color = '#ff3838';
            tekkenTimerEl.style.textShadow = '0 0 16px #ff3838, 0 0 25px rgba(255, 56, 56, 0.8), 2px 2px 0 #000';
        } else {
            tekkenTimerEl.style.color = '#ffffff';
            tekkenTimerEl.style.textShadow = '0 0 12px rgba(255, 255, 255, 0.9), 0 0 25px rgba(0, 200, 255, 0.5), 2px 2px 0px #000000';
        }
    }, 1500);

    // Initialize Tekken 5 Grid
    renderTekkenGrid();
    selectCharacter(selectedCharIndex);



    // ----------------------------------------------------------------------
    // TEKKEN VERSUS BATTLE SIMULATOR
    // ----------------------------------------------------------------------
    let vsP1 = null;
    let vsP2 = null;
    let vsP1Hp = 100;
    let vsP2Hp = 100;
    let vsIsPlayerTurn = true;
    let vsIsOver = false;

    const vsModal = document.getElementById('tekken-versus-modal');
    const btnTekkenVersus = document.getElementById('btn-tekken-versus');
    const btnModalVersus = document.getElementById('btn-modal-versus');
    const btnTouchVersus = document.getElementById('btn-touch-versus');
    const closeVsModalBtn = document.getElementById('close-vs-modal-btn');
    const btnVsModalClose = document.getElementById('btn-vs-modal-close');
    const btnVsReset = document.getElementById('btn-vs-reset');
    const btnVsRerollCpu = document.getElementById('btn-vs-reroll-cpu');
    const vsCombatLog = document.getElementById('vs-combat-log');

    function logVs(msg, type = '') {
        if (!vsCombatLog) return;
        const div = document.createElement('div');
        div.className = `vs-log-entry ${type}`;
        div.textContent = msg;
        vsCombatLog.appendChild(div);
        vsCombatLog.scrollTop = vsCombatLog.scrollHeight;
    }

    function triggerVsScreenShake() {
        const banner = document.querySelector('.vs-stage-banner');
        if (banner) {
            banner.classList.remove('screen-shake');
            void banner.offsetWidth;
            banner.classList.add('screen-shake');
            setTimeout(() => banner.classList.remove('screen-shake'), 450);
        }
    }

    function startVersusBattle(p1Char = null) {
        vsP1 = p1Char || currentCharInModal || arcadeCharacters[selectedCharIndex] || arcadeCharacters[0];

        const candidates = arcadeCharacters.filter(c => c.id !== vsP1.id);
        vsP2 = candidates[Math.floor(Math.random() * candidates.length)] || arcadeCharacters[1];

        resetVersusMatch();
        openModal('tekken-versus-modal');
        playTekkenConfirm();
        playArcadeFanfare();
        announceArcadeVoice("ROUND 1... FIGHT!", { pitch: 0.7, rate: 1.0 });
        setTimeout(() => {
            announceArcadeVoice(`${vsP1.name} versus ${vsP2.name}`, { pitch: 0.75, rate: 1.05 });
        }, 1300);
    }

    function resetVersusMatch() {
        vsP1Hp = 100;
        vsP2Hp = 100;
        vsIsPlayerTurn = true;
        vsIsOver = false;

        const p1NameEl = document.getElementById('vs-p1-name');
        const p1HpEl = document.getElementById('vs-p1-hp');
        const p1HpBar = document.getElementById('vs-p1-hp-bar');
        const p1AvatarBox = document.getElementById('vs-p1-avatar-box');
        const p1Tag = document.getElementById('vs-p1-tag');

        if (p1NameEl) p1NameEl.textContent = vsP1.name.toUpperCase();
        if (p1HpEl) p1HpEl.textContent = '100';
        if (p1HpBar) p1HpBar.style.width = '100%';
        if (p1Tag) p1Tag.textContent = `[ P1: ${vsP1.badge || 'KM'} ]`;
        if (p1AvatarBox) {
            p1AvatarBox.style.background = vsP1.color || '#0984e3';
            if (vsP1.photo) {
                p1AvatarBox.innerHTML = `<img src="${vsP1.photo}" alt="${vsP1.name}" />`;
            } else {
                p1AvatarBox.innerHTML = `<span>${vsP1.initials}</span>`;
            }
        }

        const p2NameEl = document.getElementById('vs-p2-name');
        const p2HpEl = document.getElementById('vs-p2-hp');
        const p2HpBar = document.getElementById('vs-p2-hp-bar');
        const p2AvatarBox = document.getElementById('vs-p2-avatar-box');
        const p2Tag = document.getElementById('vs-p2-tag');

        if (p2NameEl) p2NameEl.textContent = vsP2.name.toUpperCase();
        if (p2HpEl) p2HpEl.textContent = '100';
        if (p2HpBar) p2HpBar.style.width = '100%';
        if (p2Tag) p2Tag.textContent = `[ CPU: ${vsP2.badge || 'FIGHTER'} ]`;
        if (p2AvatarBox) {
            p2AvatarBox.style.background = vsP2.color || '#e74c3c';
            if (vsP2.photo) {
                p2AvatarBox.innerHTML = `<img src="${vsP2.photo}" alt="${vsP2.name}" />`;
            } else {
                p2AvatarBox.innerHTML = `<span>${vsP2.initials}</span>`;
            }
        }

        // Setup Dropdown Fighter Selectors for P1 and P2
        const p1Select = document.getElementById('vs-p1-select');
        const p2Select = document.getElementById('vs-p2-select');
        if (p1Select && p1Select.options.length === 0) {
            arcadeCharacters.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.id;
                opt.textContent = `${c.name} (${c.badge || c.role})`;
                p1Select.appendChild(opt);
            });
            p1Select.addEventListener('change', () => {
                const found = arcadeCharacters.find(c => c.id === p1Select.value);
                if (found) {
                    vsP1 = found;
                    resetVersusMatch();
                }
            });
        }
        if (p1Select) p1Select.value = vsP1.id;

        if (p2Select && p2Select.options.length === 0) {
            arcadeCharacters.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.id;
                opt.textContent = `${c.name} (${c.badge || c.role})`;
                p2Select.appendChild(opt);
            });
            p2Select.addEventListener('change', () => {
                const found = arcadeCharacters.find(c => c.id === p2Select.value);
                if (found) {
                    vsP2 = found;
                    resetVersusMatch();
                }
            });
        }
        if (p2Select) p2Select.value = vsP2.id;

        if (btnVsReset) btnVsReset.style.display = 'none';
        if (vsCombatLog) {
            vsCombatLog.innerHTML = `
                <div class="vs-log-entry intro">🔔 ROUND 1: ${vsP1.name} VS ${vsP2.name}!</div>
                <div class="vs-log-entry intro">Giliran Anda! Pilih jurus taktis di bawah untuk menyerang!</div>
            `;
        }

        setVsButtonsDisabled(false);
    }

    function setVsButtonsDisabled(disabled) {
        document.querySelectorAll('.vs-act-btn').forEach(b => b.disabled = disabled);
    }

    function updateVsHp() {
        const p1HpEl = document.getElementById('vs-p1-hp');
        const p1HpBar = document.getElementById('vs-p1-hp-bar');
        const p2HpEl = document.getElementById('vs-p2-hp');
        const p2HpBar = document.getElementById('vs-p2-hp-bar');

        if (p1HpEl) p1HpEl.textContent = Math.max(0, vsP1Hp);
        if (p1HpBar) p1HpBar.style.width = `${Math.max(0, vsP1Hp)}%`;
        if (p2HpEl) p2HpEl.textContent = Math.max(0, vsP2Hp);
        if (p2HpBar) p2HpBar.style.width = `${Math.max(0, vsP2Hp)}%`;
    }

    function execPlayerVsAction(actType) {
        if (!vsIsPlayerTurn || vsIsOver) return;

        let dmg = 0;
        let heal = 0;
        let logMsg = '';
        let isCrit = false;

        if (actType === 'study') {
            const baseDmg = 16 + Math.round((vsP1.stats.lead / 100) * 12);
            dmg = baseDmg + Math.floor(Math.random() * 6);
            logMsg = `🥊 ${vsP1.name} melancarkan Serangan Belajar Disiplin! Menghantam ${vsP2.name} sebesar ${dmg} DMG!`;
            playBeep(480, 'square', 0.08);
        } else if (actType === 'solidarity') {
            heal = 18 + Math.round((vsP1.stats.energy / 100) * 12);
            vsP1Hp = Math.min(100, vsP1Hp + heal);
            logMsg = `🛡️ ${vsP1.name} membangkitkan Tameng Solidaritas! Memulihkan +${heal} HP!`;
            playBeep(620, 'sine', 0.12);
        } else if (actType === 'tactic') {
            const chance = Math.random();
            if (chance > 0.25) {
                dmg = 24 + Math.round((vsP1.stats.tactic / 100) * 16);
                isCrit = true;
                logMsg = `⚡ CRITICAL HIT! Debat Taktis ${vsP1.name} meruntuhkan pertahanan ${vsP2.name} (-${dmg} DMG)!`;
                playBeep(750, 'sawtooth', 0.1);
            } else {
                dmg = 10;
                logMsg = `⚡ Debat Taktis ${vsP1.name} berhasil ditepis sebagian oleh lawan (-${dmg} DMG).`;
                playBeep(350, 'triangle', 0.06);
            }
        } else if (actType === 'ultimate') {
            dmg = 32 + Math.round(((vsP1.stats.lead + vsP1.stats.tactic) / 200) * 18);
            isCrit = true;
            logMsg = `📖 JURUS SPESIAL! "${vsP1.quote.slice(0, 45)}..." menghantam telak ${vsP2.name} (-${dmg} DMG)!`;
            playTekkenConfirm();
        }

        if (dmg > 0) {
            vsP2Hp = Math.max(0, vsP2Hp - dmg);
            triggerVsScreenShake();
        }

        updateVsHp();
        logVs(logMsg, isCrit ? 'critical' : (heal > 0 ? 'heal' : 'player-action'));

        if (vsP2Hp <= 0) {
            vsIsOver = true;
            triggerVsScreenShake();
            logVs(`🏆 K.O.! ${vsP1.name} MEMENANGKAN DUEL! Solidaritas Kelas XII-E Berjaya!`, 'victory');
            playTekkenConfirm();
            playArcadeFanfare();
            announceArcadeVoice("K. O.! WINNER: " + vsP1.name.replace(/\(.*?\)/g, '').trim() + "!", { pitch: 0.68, rate: 0.95 });
            if (btnVsReset) btnVsReset.style.display = 'inline-block';
            return;
        }

        vsIsPlayerTurn = false;
        setVsButtonsDisabled(true);

        setTimeout(() => {
            if (vsIsOver) return;
            execCpuVsTurn();
        }, 900);
    }

    function execCpuVsTurn() {
        const actions = ['study', 'tactic'];
        if (vsP2Hp < 45) actions.push('solidarity');
        const cpuAct = actions[Math.floor(Math.random() * actions.length)];

        let dmg = 0;
        let heal = 0;
        let logMsg = '';

        if (cpuAct === 'solidarity') {
            heal = 16 + Math.round((vsP2.stats.energy / 100) * 10);
            vsP2Hp = Math.min(100, vsP2Hp + heal);
            logMsg = `🛡️ [CPU] ${vsP2.name} memulihkan diri dengan Semangat Kelas (+${heal} HP).`;
            playBeep(450, 'sine', 0.1);
        } else if (cpuAct === 'tactic') {
            dmg = 18 + Math.round((vsP2.stats.tactic / 100) * 10) + Math.floor(Math.random() * 5);
            logMsg = `⚡ [CPU] ${vsP2.name} melancarkan counter taktik cepat! Memberikan ${dmg} DMG ke ${vsP1.name}!`;
            playBeep(320, 'sawtooth', 0.08);
        } else {
            dmg = 14 + Math.round((vsP2.stats.lead / 100) * 8) + Math.floor(Math.random() * 6);
            logMsg = `🥊 [CPU] ${vsP2.name} menyerang balik dengan tebasan buku catatan (-${dmg} DMG)!`;
            playBeep(300, 'square', 0.06);
        }

        if (dmg > 0) {
            vsP1Hp = Math.max(0, vsP1Hp - dmg);
            triggerVsScreenShake();
        }

        updateVsHp();
        logVs(logMsg, 'cpu-action');

        if (vsP1Hp <= 0) {
            vsIsOver = true;
            triggerVsScreenShake();
            logVs(`💀 K.O.! ${vsP1.name} kehabisan stamina! ${vsP2.name} memenangkan duel kali ini.`, 'defeat');
            playErrorChord();
            announceArcadeVoice("K. O.! WINNER: " + vsP2.name.replace(/\(.*?\)/g, '').trim() + "!", { pitch: 0.68, rate: 0.95 });
            if (btnVsReset) btnVsReset.style.display = 'inline-block';
            return;
        }

        vsIsPlayerTurn = true;
        setVsButtonsDisabled(false);
    }

    document.querySelectorAll('.vs-act-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const act = btn.dataset.action;
            execPlayerVsAction(act);
        });
    });

    if (btnTekkenVersus) btnTekkenVersus.addEventListener('click', () => startVersusBattle());
    if (btnModalVersus) {
        btnModalVersus.addEventListener('click', () => {
            closeModal('char-modal-backdrop');
            startVersusBattle(currentCharInModal);
        });
    }
    if (btnTouchVersus) btnTouchVersus.addEventListener('click', () => startVersusBattle());
    if (btnVsRerollCpu) {
        btnVsRerollCpu.addEventListener('click', () => {
            const candidates = arcadeCharacters.filter(c => c.id !== vsP1.id);
            vsP2 = candidates[Math.floor(Math.random() * candidates.length)] || arcadeCharacters[1];
            resetVersusMatch();
        });
    }
    if (btnVsReset) btnVsReset.addEventListener('click', resetVersusMatch);
    if (closeVsModalBtn) closeVsModalBtn.addEventListener('click', () => closeModal('tekken-versus-modal'));
    if (btnVsModalClose) btnVsModalClose.addEventListener('click', () => closeModal('tekken-versus-modal'));

    // ----------------------------------------------------------------------
    // MOBILE TOUCH CONTROLS & SWIPE GESTURES
    // ----------------------------------------------------------------------
    document.querySelectorAll('.dpad-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const dir = btn.dataset.dir;
            if (dir) navigateTekkenChar(dir);
        });
    });

    const btnTouchRandom = document.getElementById('btn-touch-random');
    if (btnTouchRandom) {
        btnTouchRandom.addEventListener('click', triggerRandomTekkenPick);
    }

    const btnTouchSelect = document.getElementById('btn-touch-select');
    if (btnTouchSelect) {
        btnTouchSelect.addEventListener('click', confirmArcadeSelection);
    }

    const tekkenStageEl = document.getElementById('personalia-roster');
    let touchStartX = 0;
    let touchStartY = 0;

    if (tekkenStageEl) {
        tekkenStageEl.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        }, { passive: true });

        tekkenStageEl.addEventListener('touchend', (e) => {
            if (e.changedTouches && e.changedTouches.length === 1) {
                const diffX = e.changedTouches[0].clientX - touchStartX;
                const diffY = e.changedTouches[0].clientY - touchStartY;
                if (Math.abs(diffX) > 40 || Math.abs(diffY) > 40) {
                    if (Math.abs(diffX) > Math.abs(diffY)) {
                        if (diffX > 0) navigateTekkenChar('right');
                        else navigateTekkenChar('left');
                    } else {
                        if (diffY > 0) navigateTekkenChar('down');
                        else navigateTekkenChar('up');
                    }
                }
            }
        }, { passive: true });
    }

    // ======================================================================
    // 9. Classic Winamp 2.x Media Player Engine (Class XII-E Nostalgia Deck)
    // ======================================================================
    const winampPlaylist = [];

    const winampAnthemMelody = [
        523.25, 523.25, 587.33, 659.25, 659.25, 587.33, 523.25, 440.00,
        523.25, 523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 0,
        659.25, 659.25, 783.99, 880.00, 880.00, 783.99, 659.25, 587.33,
        523.25, 587.33, 659.25, 587.33, 523.25, 0, 523.25, 0
    ];
    const winampAnthemBass = [
        130.81, 130.81, 196.00, 196.00, 220.00, 220.00, 174.61, 174.61,
        130.81, 130.81, 196.00, 196.00, 220.00, 220.00, 196.00, 196.00,
        174.61, 174.61, 196.00, 196.00, 220.00, 220.00, 174.61, 174.61,
        130.81, 130.81, 196.00, 196.00, 130.81, 130.81, 130.81, 130.81
    ];

    const winampNostalgiaMelody = [
        369.99, 440.00, 554.37, 587.33, 554.37, 440.00, 369.99, 440.00,
        493.88, 554.37, 587.33, 739.99, 587.33, 554.37, 493.88, 0,
        369.99, 440.00, 554.37, 587.33, 659.25, 587.33, 554.37, 440.00,
        493.88, 440.00, 369.99, 329.63, 293.66, 0, 293.66, 0
    ];
    const winampNostalgiaBass = [
        146.83, 146.83, 146.83, 146.83, 185.00, 185.00, 185.00, 185.00,
        196.00, 196.00, 196.00, 196.00, 220.00, 220.00, 220.00, 220.00,
        146.83, 146.83, 146.83, 146.83, 185.00, 185.00, 185.00, 185.00,
        196.00, 196.00, 220.00, 220.00, 146.83, 146.83, 146.83, 146.83
    ];

    const winampAcousticMelody = [
        261.63, 329.63, 392.00, 329.63, 196.00, 246.94, 293.66, 246.94,
        220.00, 261.63, 329.63, 261.63, 164.81, 196.00, 246.94, 196.00,
        174.61, 220.00, 261.63, 220.00, 130.81, 164.81, 196.00, 164.81,
        146.83, 174.61, 220.00, 174.61, 196.00, 246.94, 293.66, 246.94
    ];
    const winampAcousticBass = [
        130.81, 0, 130.81, 0, 98.00, 0, 98.00, 0,
        110.00, 0, 110.00, 0, 82.41, 0, 82.41, 0,
        87.31, 0, 87.31, 0, 65.41, 0, 65.41, 0,
        73.42, 0, 73.42, 0, 98.00, 0, 98.00, 0
    ];

    const winampArcadeMelody = [
        440.00, 440.00, 523.25, 440.00, 587.33, 440.00, 659.25, 587.33,
        523.25, 440.00, 392.00, 440.00, 523.25, 659.25, 783.99, 880.00,
        880.00, 783.99, 659.25, 587.33, 659.25, 587.33, 523.25, 440.00,
        392.00, 440.00, 523.25, 587.33, 659.25, 523.25, 440.00, 440.00
    ];
    const winampArcadeBass = [
        110.00, 110.00, 110.00, 110.00, 130.81, 130.81, 110.00, 110.00,
        98.00, 98.00, 98.00, 98.00, 110.00, 110.00, 130.81, 146.83,
        110.00, 110.00, 110.00, 110.00, 130.81, 130.81, 110.00, 110.00,
        98.00, 98.00, 110.00, 110.00, 130.81, 130.81, 110.00, 110.00
    ];

    const winampAmbientMelody = [
        523.25, 0, 659.25, 0, 783.99, 0, 1046.50, 0,
        880.00, 0, 783.99, 0, 659.25, 0, 523.25, 0,
        587.33, 0, 698.46, 0, 880.00, 0, 1174.66, 0,
        1046.50, 0, 880.00, 0, 783.99, 0, 523.25, 0
    ];
    const winampAmbientBass = [
        65.41, 65.41, 130.81, 130.81, 164.81, 164.81, 196.00, 196.00,
        110.00, 110.00, 130.81, 130.81, 164.81, 164.81, 110.00, 110.00,
        87.31, 87.31, 130.81, 130.81, 174.61, 174.61, 220.00, 220.00,
        98.00, 98.00, 130.81, 130.81, 146.83, 146.83, 196.00, 196.00
    ];

    let winampCurrentIndex = 0;
    let winampIsPlaying = false;
    let winampIsPaused = false;
    let winampSeconds = 0;
    let winampTimer = null;
    let winampVizTimer = null;
    let winampSynthTimer = null;
    let winampSynthStep = 0;
    let winampCustomAudio = null;
    let winampMasterGain = null;
    let winampPanNode = null;

    const winampTimeEl = document.getElementById('winamp-time');
    const winampPlayStateEl = document.getElementById('winamp-play-state');
    const winampMarqueeEl = document.getElementById('winamp-marquee');
    const winampTrackListEl = document.getElementById('winamp-track-list');
    const winampTrackCountEl = document.getElementById('winamp-track-count');
    const winampVolSlider = document.getElementById('winamp-vol');
    const winampBalSlider = document.getElementById('winamp-bal');
    const winampVizBars = document.querySelectorAll('.winamp-viz-bar');

    const btnWinampPlay = document.getElementById('winamp-btn-play');
    const btnWinampPause = document.getElementById('winamp-btn-pause');
    const btnWinampStop = document.getElementById('winamp-btn-stop');
    const btnWinampPrev = document.getElementById('winamp-btn-prev');
    const btnWinampNext = document.getElementById('winamp-btn-next');
    const winampFileInput = document.getElementById('winamp-file-input');
    const btnWinampAddTrack = document.getElementById('winamp-btn-add-track');

    function getWinampAudioNodes() {
        const ctx = getAudioContext();
        if (!ctx) return null;
        if (!winampMasterGain) {
            winampMasterGain = ctx.createGain();
            const vol = winampVolSlider ? parseInt(winampVolSlider.value, 10) / 100 : 0.8;
            winampMasterGain.gain.setValueAtTime(vol, ctx.currentTime);

            if (ctx.createStereoPanner) {
                winampPanNode = ctx.createStereoPanner();
                const bal = winampBalSlider ? parseInt(winampBalSlider.value, 10) / 50 : 0;
                winampPanNode.pan.setValueAtTime(bal, ctx.currentTime);
                winampMasterGain.connect(winampPanNode);
                winampPanNode.connect(ctx.destination);
            } else {
                winampMasterGain.connect(ctx.destination);
            }
        }
        return { ctx, gain: winampMasterGain };
    }

    function formatWinampTime(secs) {
        const m = String(Math.floor(secs / 60)).padStart(2, '0');
        const s = String(secs % 60).padStart(2, '0');
        return `${m}:${s}`;
    }

    function updateWinampTimeDisplay() {
        if (!winampTimeEl) return;
        winampTimeEl.textContent = formatWinampTime(winampSeconds);
    }

    function startWinampTimer() {
        stopWinampTimer();
        winampTimer = setInterval(() => {
            if (winampCustomAudio) {
                winampSeconds = Math.floor(winampCustomAudio.currentTime || 0);
            } else {
                winampSeconds++;
            }
            updateWinampTimeDisplay();
        }, 1000);
    }

    function stopWinampTimer() {
        if (winampTimer) {
            clearInterval(winampTimer);
            winampTimer = null;
        }
    }

    function startWinampViz() {
        stopWinampViz();
        winampVizTimer = setInterval(() => {
            if (!winampIsPlaying || winampIsPaused) {
                winampVizBars.forEach(b => b.style.height = '6%');
                return;
            }
            winampVizBars.forEach((bar, idx) => {
                const minH = 15;
                const maxH = idx < 3 ? 96 : (idx < 7 ? 85 : 68);
                const randomH = Math.floor(Math.random() * (maxH - minH + 1)) + minH;
                bar.style.height = `${randomH}%`;
            });
        }, 90);
    }

    function stopWinampViz() {
        if (winampVizTimer) {
            clearInterval(winampVizTimer);
            winampVizTimer = null;
        }
        winampVizBars.forEach(b => b.style.height = '4%');
    }

    function playWinampSynthNote(track) {
        if (!winampIsPlaying || winampIsPaused || !soundEnabled) return;
        const nodes = getWinampAudioNodes();
        if (!nodes) return;
        const { ctx, gain } = nodes;
        const now = ctx.currentTime;

        let melodySeq, bassSeq, stepDuration;
        if (track.theme === 'anthem') {
            melodySeq = winampAnthemMelody; bassSeq = winampAnthemBass; stepDuration = 0.12;
        } else if (track.theme === 'nostalgia') {
            melodySeq = winampNostalgiaMelody; bassSeq = winampNostalgiaBass; stepDuration = 0.16;
        } else if (track.theme === 'acoustic') {
            melodySeq = winampAcousticMelody; bassSeq = winampAcousticBass; stepDuration = 0.174;
        } else if (track.theme === 'arcade') {
            melodySeq = winampArcadeMelody; bassSeq = winampArcadeBass; stepDuration = 0.11;
        } else {
            melodySeq = winampAmbientMelody; bassSeq = winampAmbientBass; stepDuration = 0.197;
        }

        const stepIdx = winampSynthStep % melodySeq.length;
        const mFreq = melodySeq[stepIdx];
        const bFreq = bassSeq[stepIdx];

        // 1. Lead Melody Voice
        if (mFreq > 0) {
            const oscLead = ctx.createOscillator();
            const gainLead = ctx.createGain();
            oscLead.type = track.theme === 'ambient' ? 'sine' : (track.theme === 'acoustic' ? 'triangle' : 'square');
            oscLead.frequency.setValueAtTime(mFreq, now);
            gainLead.gain.setValueAtTime(0.045, now);
            gainLead.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 0.95);
            oscLead.connect(gainLead);
            gainLead.connect(gain);
            oscLead.start(now);
            oscLead.stop(now + stepDuration * 0.95);
        }

        // 2. Bass Voice
        if (bFreq > 0 && stepIdx % 2 === 0) {
            const oscBass = ctx.createOscillator();
            const gainBass = ctx.createGain();
            oscBass.type = track.theme === 'arcade' ? 'sawtooth' : 'triangle';
            oscBass.frequency.setValueAtTime(bFreq, now);
            gainBass.gain.setValueAtTime(0.055, now);
            gainBass.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 1.9);
            oscBass.connect(gainBass);
            gainBass.connect(gain);
            oscBass.start(now);
            oscBass.stop(now + stepDuration * 1.9);
        }

        // 3. Retro Percussion
        if (track.theme !== 'ambient') {
            if (stepIdx % 4 === 2) {
                const oscSn = ctx.createOscillator();
                const gainSn = ctx.createGain();
                oscSn.type = 'sawtooth';
                oscSn.frequency.setValueAtTime(140, now);
                oscSn.frequency.exponentialRampToValueAtTime(25, now + 0.05);
                gainSn.gain.setValueAtTime(0.035, now);
                gainSn.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                oscSn.connect(gainSn);
                gainSn.connect(gain);
                oscSn.start(now);
                oscSn.stop(now + 0.05);
            } else if (stepIdx % 4 === 0) {
                const oscK = ctx.createOscillator();
                const gainK = ctx.createGain();
                oscK.type = 'sine';
                oscK.frequency.setValueAtTime(90, now);
                oscK.frequency.exponentialRampToValueAtTime(30, now + 0.07);
                gainK.gain.setValueAtTime(0.06, now);
                gainK.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
                oscK.connect(gainK);
                gainK.connect(gain);
                oscK.start(now);
                oscK.stop(now + 0.07);
            }
        }

        winampSynthStep++;
    }

    function startWinampSynth(track) {
        stopWinampSynth();
        winampSynthStep = 0;
        const stepMs = Math.round(60000 / (track.bpm || 120) / 2);
        winampSynthTimer = setInterval(() => {
            playWinampSynthNote(track);
        }, stepMs);
    }

    function stopWinampSynth() {
        if (winampSynthTimer) {
            clearInterval(winampSynthTimer);
            winampSynthTimer = null;
        }
    }

    function renderWinampPlaylist() {
        if (!winampTrackListEl) return;
        winampTrackListEl.innerHTML = '';
        if (winampPlaylist.length === 0) {
            const emptyLi = document.createElement('li');
            emptyLi.className = 'winamp-track-empty';
            emptyLi.style.cssText = 'padding: 12px 6px; color: #666; text-align: center; font-style: italic; font-size: 11px; user-select: none;';
            emptyLi.textContent = 'Playlist kosong. Klik "+ Tambah MP3" untuk menambahkan lagu.';
            winampTrackListEl.appendChild(emptyLi);
            if (winampTrackCountEl) {
                winampTrackCountEl.textContent = '0 TRACKS';
            }
            return;
        }

        winampPlaylist.forEach((trk, idx) => {
            const li = document.createElement('li');
            li.className = `winamp-track-item ${idx === winampCurrentIndex && winampIsPlaying ? 'is-playing' : ''}`;
            li.dataset.index = idx;
            li.innerHTML = `
                <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px;" title="${trk.title}">${trk.title}</span>
                <span style="opacity: 0.8; font-size: 10px; display: flex; align-items: center; gap: 4px;">
                    <span>${trk.duration}</span>
                    <button class="winamp-del-btn" data-id="${trk.dbId || ''}" data-idx="${idx}" title="Hapus lagu (Akses Admin)">×</button>
                </span>
            `;
            li.addEventListener('click', (e) => {
                if (e.target.closest('.winamp-del-btn')) return;
                playWinampTrack(idx);
            });

            const delBtn = li.querySelector('.winamp-del-btn');
            if (delBtn) {
                delBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    promptAdminToDeleteTrack(trk.dbId, idx, trk.title);
                });
            }

            winampTrackListEl.appendChild(li);
        });
        if (winampTrackCountEl) {
            winampTrackCountEl.textContent = `${winampPlaylist.length} TRACKS`;
        }
    }

    function playWinampTrack(index) {
        if (!winampPlaylist.length) {
            stopWinamp();
            if (winampMarqueeEl) {
                winampMarqueeEl.textContent = 'WINAMP CLASS XII-E *** PLAYLIST KOSONG - SILAKAN TAMBAH MP3 ***';
            }
            return;
        }

        if (index < 0) index = winampPlaylist.length - 1;
        if (index >= winampPlaylist.length) index = 0;
        winampCurrentIndex = index;

        stopWinampSynth();
        if (winampCustomAudio) {
            winampCustomAudio.pause();
            winampCustomAudio = null;
        }

        const track = winampPlaylist[winampCurrentIndex];
        winampIsPlaying = true;
        winampIsPaused = false;
        winampSeconds = 0;

        // Stop background BGM if currently running
        if (bgmPlaying) stopBgm();

        if (winampPlayStateEl) winampPlayStateEl.textContent = 'PLAY';
        if (winampMarqueeEl) {
            winampMarqueeEl.textContent = `*** ${track.title} *** [WINAMP CLASS XII-E] ***`;
            winampMarqueeEl.style.animation = 'none';
            void winampMarqueeEl.offsetWidth;
            winampMarqueeEl.style.animation = 'winampScroll 16s linear infinite';
        }

        updateWinampTimeDisplay();
        startWinampTimer();
        startWinampViz();
        renderWinampPlaylist();

        if (track.type === 'audio' && track.url) {
            winampCustomAudio = new Audio(track.url);
            const vol = winampVolSlider ? parseInt(winampVolSlider.value, 10) / 100 : 0.8;
            winampCustomAudio.volume = vol;
            winampCustomAudio.play().catch(e => console.warn('Winamp audio playback error:', e));
            winampCustomAudio.addEventListener('ended', () => {
                playWinampTrack((winampCurrentIndex + 1) % winampPlaylist.length);
            });
        } else {
            startWinampSynth(track);
        }
    }

    function pauseWinamp() {
        if (!winampIsPlaying) return;
        if (winampIsPaused) {
            winampIsPaused = false;
            if (winampPlayStateEl) winampPlayStateEl.textContent = 'PLAY';
            startWinampTimer();
            startWinampViz();
            const track = winampPlaylist[winampCurrentIndex];
            if (track && track.type === 'audio' && winampCustomAudio) {
                winampCustomAudio.play().catch(e => { });
            } else if (track) {
                startWinampSynth(track);
            }
        } else {
            winampIsPaused = true;
            if (winampPlayStateEl) winampPlayStateEl.textContent = 'PAUSE';
            stopWinampTimer();
            stopWinampViz();
            stopWinampSynth();
            if (winampCustomAudio) {
                winampCustomAudio.pause();
            }
        }
    }

    function stopWinamp() {
        winampIsPlaying = false;
        winampIsPaused = false;
        winampSeconds = 0;
        stopWinampTimer();
        stopWinampViz();
        stopWinampSynth();
        if (winampCustomAudio) {
            winampCustomAudio.pause();
            winampCustomAudio = null;
        }
        if (winampPlayStateEl) winampPlayStateEl.textContent = 'STOP';
        updateWinampTimeDisplay();
        renderWinampPlaylist();
    }

    if (btnWinampPlay) {
        btnWinampPlay.addEventListener('click', () => {
            if (!winampPlaylist.length) {
                if (winampMarqueeEl) {
                    winampMarqueeEl.textContent = 'WINAMP CLASS XII-E *** PLAYLIST KOSONG - SILAKAN TAMBAH MP3 ***';
                }
                return;
            }
            if (winampIsPaused) {
                pauseWinamp();
            } else {
                playWinampTrack(winampCurrentIndex);
            }
        });
    }
    if (btnWinampPause) btnWinampPause.addEventListener('click', pauseWinamp);
    if (btnWinampStop) btnWinampStop.addEventListener('click', stopWinamp);
    if (btnWinampPrev) btnWinampPrev.addEventListener('click', () => {
        playWinampTrack(winampCurrentIndex - 1);
    });
    if (btnWinampNext) btnWinampNext.addEventListener('click', () => {
        playWinampTrack(winampCurrentIndex + 1);
    });

    if (winampVolSlider) {
        winampVolSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10) / 100;
            if (winampMasterGain && audioCtx) {
                winampMasterGain.gain.setValueAtTime(val, audioCtx.currentTime);
            }
            if (winampCustomAudio) {
                winampCustomAudio.volume = val;
            }
        });
    }

    if (winampBalSlider) {
        winampBalSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10) / 50;
            if (winampPanNode && audioCtx) {
                winampPanNode.pan.setValueAtTime(val, audioCtx.currentTime);
            }
        });
    }

    // ----------------------------------------------------------------------
    // Persistent Custom MP3 Storage using IndexedDB (xii_winamp_store)
    // ----------------------------------------------------------------------
    const WINAMP_DB_NAME = 'xii_winamp_store';
    const WINAMP_DB_VERSION = 1;
    const WINAMP_STORE = 'custom_tracks';

    function openWinampDB() {
        return new Promise((resolve) => {
            if (!window.indexedDB) {
                resolve(null);
                return;
            }
            const req = indexedDB.open(WINAMP_DB_NAME, WINAMP_DB_VERSION);
            req.onupgradeneeded = () => {
                const db = req.result;
                if (!db.objectStoreNames.contains(WINAMP_STORE)) {
                    db.createObjectStore(WINAMP_STORE, { keyPath: 'id', autoIncrement: true });
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => resolve(null);
        });
    }

    async function saveCustomTrackToDB(file, rawName, duration) {
        try {
            const db = await openWinampDB();
            if (!db) return null;
            const tx = db.transaction(WINAMP_STORE, 'readwrite');
            const store = tx.objectStore(WINAMP_STORE);
            const record = {
                name: rawName,
                blob: file,
                duration: duration || 'MP3',
                createdAt: Date.now()
            };
            return new Promise((resolve) => {
                const addReq = store.add(record);
                addReq.onsuccess = () => resolve(addReq.result);
                addReq.onerror = () => resolve(null);
            });
        } catch (e) {
            console.warn('Winamp DB save error:', e);
            return null;
        }
    }

    async function deleteCustomTrackFromDB(id) {
        try {
            const db = await openWinampDB();
            if (!db) return;
            const tx = db.transaction(WINAMP_STORE, 'readwrite');
            tx.objectStore(WINAMP_STORE).delete(id);
        } catch (e) {
            console.warn('Winamp DB delete error:', e);
        }
    }

    async function updateCustomTrackDurationInDB(id, duration) {
        try {
            const db = await openWinampDB();
            if (!db) return;
            const tx = db.transaction(WINAMP_STORE, 'readwrite');
            const store = tx.objectStore(WINAMP_STORE);
            const getReq = store.get(id);
            getReq.onsuccess = () => {
                const record = getReq.result;
                if (record) {
                    record.duration = duration;
                    store.put(record);
                }
            };
        } catch (e) {
            console.warn('Winamp DB update duration error:', e);
        }
    }

    // ----------------------------------------------------------------------
    // Admin Verification for Deleting Playlist Tracks
    // ----------------------------------------------------------------------
    let pendingAdminAction = null;

    function openWinampAdminModal(title, desc, actionCallback) {
        const modal = document.getElementById('dialog-winamp-admin-backdrop');
        const titleEl = document.getElementById('winamp-admin-prompt-title');
        const descEl = document.getElementById('winamp-admin-prompt-desc');
        const passInput = document.getElementById('winamp-admin-pass');
        const errEl = document.getElementById('winamp-admin-err');

        if (!modal) return;
        if (titleEl) titleEl.textContent = title;
        if (descEl) descEl.textContent = desc;
        if (passInput) passInput.value = '';
        if (errEl) errEl.style.display = 'none';

        pendingAdminAction = actionCallback;
        modal.classList.add('is-open');
        if (passInput) setTimeout(() => passInput.focus(), 60);
    }

    function closeWinampAdminModal() {
        const modal = document.getElementById('dialog-winamp-admin-backdrop');
        if (modal) modal.classList.remove('is-open');
        pendingAdminAction = null;
    }

    function verifyWinampAdminPassword(inputPass) {
        const p = (inputPass || '').trim().toLowerCase();
        return p === 'admin' || p === '6e' || p === 'admin123' || p === 'xiie' || p === 'kdnatoes';
    }

    function handleWinampAdminSubmit() {
        const passInput = document.getElementById('winamp-admin-pass');
        const errEl = document.getElementById('winamp-admin-err');
        const pass = passInput ? passInput.value : '';

        if (verifyWinampAdminPassword(pass)) {
            const action = pendingAdminAction;
            closeWinampAdminModal();
            if (typeof action === 'function') {
                action();
            }
        } else {
            if (errEl) {
                errEl.style.display = 'block';
                errEl.textContent = '⚠️ Password salah! Hanya admin yang berhak menghapus playlist.';
            }
            if (passInput) {
                passInput.value = '';
                passInput.focus();
            }
        }
    }

    function promptAdminToDeleteTrack(dbId, trackIndex, trackTitle) {
        openWinampAdminModal(
            'Konfirmasi Hapus Lagu',
            `Hanya admin yang berhak menghapus "${trackTitle}". Masukkan password admin:`,
            () => {
                removeCustomTrack(dbId, trackIndex);
            }
        );
    }

    function promptAdminToClearPlaylist() {
        if (!winampPlaylist.length) return;
        openWinampAdminModal(
            'Konfirmasi Kosongkan Playlist',
            `Apakah Anda yakin ingin menghapus SELURUH lagu (${winampPlaylist.length} lagu) dari playlist Winamp? Tindakan ini hanya dapat dilakukan oleh Admin.`,
            async () => {
                clearAllWinampTracks();
            }
        );
    }

    async function clearAllWinampTracks() {
        stopWinamp();
        winampPlaylist.forEach(trk => {
            if (trk.url) {
                try { URL.revokeObjectURL(trk.url); } catch (e) { }
            }
        });
        winampPlaylist.length = 0;
        try {
            const db = await openWinampDB();
            if (db) {
                const tx = db.transaction(WINAMP_STORE, 'readwrite');
                tx.objectStore(WINAMP_STORE).clear();
            }
        } catch (e) {
            console.warn('Error clearing Winamp DB:', e);
        }
        renderWinampPlaylist();
        if (winampMarqueeEl) {
            winampMarqueeEl.textContent = 'WINAMP CLASS XII-E *** PLAYLIST TELAH DIKOSONGKAN ***';
        }
    }

    function removeCustomTrack(dbId, trackIndex) {
        if (trackIndex === winampCurrentIndex && winampIsPlaying) {
            stopWinamp();
        }
        const trk = winampPlaylist[trackIndex];
        if (trk && trk.url) {
            try { URL.revokeObjectURL(trk.url); } catch (e) { }
        }
        winampPlaylist.splice(trackIndex, 1);
        // Re-number remaining tracks
        winampPlaylist.forEach((t, i) => {
            if (t.rawName) {
                t.title = `${i + 1}. ${t.rawName}`;
            }
        });
        deleteCustomTrackFromDB(dbId);
        renderWinampPlaylist();
    }

    async function loadSavedCustomTracks() {
        try {
            const db = await openWinampDB();
            if (!db) return;
            const tx = db.transaction(WINAMP_STORE, 'readonly');
            const store = tx.objectStore(WINAMP_STORE);
            const getReq = store.getAll();
            getReq.onsuccess = () => {
                const records = getReq.result || [];
                records.forEach((record) => {
                    const objectUrl = URL.createObjectURL(record.blob);
                    const newTrackIndex = winampPlaylist.length + 1;
                    const newTrack = {
                        dbId: record.id,
                        rawName: record.name,
                        title: `${newTrackIndex}. ${record.name}`,
                        artist: "Lagu Lokal",
                        duration: record.duration || "MP3",
                        type: "audio",
                        url: objectUrl
                    };
                    winampPlaylist.push(newTrack);

                    // Compute duration if not already cached
                    if (!record.duration || record.duration === 'MP3') {
                        const tempAudio = new Audio(objectUrl);
                        tempAudio.addEventListener('loadedmetadata', () => {
                            if (tempAudio.duration && isFinite(tempAudio.duration)) {
                                const durStr = formatWinampTime(Math.floor(tempAudio.duration));
                                newTrack.duration = durStr;
                                updateCustomTrackDurationInDB(record.id, durStr);
                                renderWinampPlaylist();
                            }
                        });
                    }
                });
                renderWinampPlaylist();
            };
        } catch (e) {
            console.warn('Winamp DB load error:', e);
        }
    }

    if (btnWinampAddTrack && winampFileInput) {
        btnWinampAddTrack.addEventListener('click', () => {
            winampFileInput.click();
        });
    }

    if (winampFileInput) {
        winampFileInput.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files || []);
            if (!files.length) return;

            let firstNewIndex = -1;
            for (const file of files) {
                const objectUrl = URL.createObjectURL(file);
                const rawName = file.name.replace(/\.[^/.]+$/, "");
                const newTrackIndex = winampPlaylist.length + 1;
                const newTrack = {
                    rawName: rawName,
                    title: `${newTrackIndex}. ${rawName}`,
                    artist: "Lagu Lokal",
                    duration: "MP3",
                    type: "audio",
                    url: objectUrl
                };

                // Save to IndexedDB so it persists permanently
                const recordId = await saveCustomTrackToDB(file, rawName, 'MP3');
                if (recordId) {
                    newTrack.dbId = recordId;
                }

                // Detect exact audio duration asynchronously
                const tempAudio = new Audio(objectUrl);
                tempAudio.addEventListener('loadedmetadata', () => {
                    if (tempAudio.duration && isFinite(tempAudio.duration)) {
                        const durStr = formatWinampTime(Math.floor(tempAudio.duration));
                        newTrack.duration = durStr;
                        if (newTrack.dbId) {
                            updateCustomTrackDurationInDB(newTrack.dbId, durStr);
                        }
                        renderWinampPlaylist();
                    }
                });

                winampPlaylist.push(newTrack);
                if (firstNewIndex === -1) {
                    firstNewIndex = winampPlaylist.length - 1;
                }
            }

            renderWinampPlaylist();
            if (firstNewIndex !== -1) {
                playWinampTrack(firstNewIndex);
            }
            winampFileInput.value = '';
        });
    }

    // Hook up Clear Playlist & Winamp Admin Dialog Buttons
    const btnWinampClearPlaylist = document.getElementById('winamp-btn-clear-playlist');
    if (btnWinampClearPlaylist) {
        btnWinampClearPlaylist.addEventListener('click', promptAdminToClearPlaylist);
    }

    const btnWinampAdminConfirm = document.getElementById('btn-winamp-admin-confirm');
    if (btnWinampAdminConfirm) {
        btnWinampAdminConfirm.addEventListener('click', handleWinampAdminSubmit);
    }

    const btnWinampAdminCancel = document.getElementById('btn-winamp-admin-cancel');
    if (btnWinampAdminCancel) {
        btnWinampAdminCancel.addEventListener('click', closeWinampAdminModal);
    }

    const closeWinampAdminBtn = document.getElementById('close-winamp-admin-btn');
    if (closeWinampAdminBtn) {
        closeWinampAdminBtn.addEventListener('click', closeWinampAdminModal);
    }

    const winampAdminPassInput = document.getElementById('winamp-admin-pass');
    if (winampAdminPassInput) {
        winampAdminPassInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleWinampAdminSubmit();
            if (e.key === 'Escape') closeWinampAdminModal();
        });
    }

    // Initialize Winamp Tracklist and restore custom songs on startup
    renderWinampPlaylist();
    updateWinampTimeDisplay();
    loadSavedCustomTracks();

    // ======================================================================
    // 10. BUKU TAHUNAN DIGITAL & BUKU TAMU ALUMNI (BukuTahunan.doc)
    // ======================================================================
    const alumniExtendedData = {
        "c1": {
            "ptn": "ITS - Teknik Informatika",
            "career": "Software Engineer",
            "ig": "@abdan_hl"
        },
        "c2": {
            "ptn": "ITB - Matematika & Aktuaria",
            "career": "Data Scientist / Actuary",
            "ig": "@ahnaf_ghazy"
        },
        "c3": {
            "ptn": "UI - Ilmu Filsafat & Politik",
            "career": "Analis Kebijakan Publik",
            "ig": "@arfa_failasuf"
        },
        "c4": {
            "ptn": "UGM - Teknik Sipil",
            "career": "Infrastruktur Project Manager",
            "ig": "@asa_kemal"
        },
        "c5": {
            "ptn": "IPB - Manajemen Agribisnis",
            "career": "Agribusiness Consultant",
            "ig": "@asyam_t"
        },
        "c6": {
            "ptn": "ITS - Teknik Mesin",
            "career": "Automotive & Design Engineer",
            "ig": "@asyraf_raziq"
        },
        "c7": {
            "ptn": "UB - Arsitektur",
            "career": "Sustainable Architect",
            "ig": "@ayaka_fawwaz"
        },
        "c8": {
            "ptn": "UNAIR - Manajemen Bisnis",
            "career": "Perwira & Entrepreneur",
            "ig": "@azis_army"
        },
        "c9": {
            "ptn": "ITS - Teknik Elektro",
            "career": "Renewable Energy Specialist",
            "ig": "@bagas_boemi"
        },
        "c10": {
            "ptn": "UGM - Farmasi",
            "career": "Apoteker & Formulator Obat",
            "ig": "@damar_fathih"
        },
        "c11": {
            "ptn": "UI - Ilmu Ekonomi & Studi Pembangunan",
            "career": "Economic Policy Analyst",
            "ig": "@fadel_thufail"
        },
        "c12": {
            "ptn": "ITB - Teknik Industri",
            "career": "Operations & Supply Chain Lead",
            "ig": "@faeyza_jovano"
        },
        "c13": {
            "ptn": "UI - Ilmu Komunikasi & Jurnalistik",
            "career": "Editor in Chief & Penulis",
            "ig": "@fathurizqi_"
        },
        "c14": {
            "ptn": "ITB - Matematika & Aktuaria",
            "career": "Chief Actuary / Data Scientist",
            "ig": "@iqbal_qodama"
        },
        "c15": {
            "ptn": "UNAIR - Pendidikan Dokter",
            "career": "Dokter Spesialis Bedah",
            "ig": "@zaidan_bhakti"
        },
        "c16": {
            "ptn": "ITS - Teknik Informatika",
            "career": "AI & Cybersecurity Specialist",
            "ig": "@anas_afif"
        },
        "c17": {
            "ptn": "UB - Ilmu Komputer",
            "career": "Cloud Infrastructure Architect",
            "ig": "@wafizzaliq"
        },
        "c18": {
            "ptn": "ITS - Statistika Bisnis",
            "career": "Business Intelligence Lead",
            "ig": "@muflih_davin"
        },
        "c19": {
            "ptn": "UGM - Psikologi",
            "career": "Psikolog Industri & Konsultan HR",
            "ig": "@fauzan_hilmy"
        },
        "c20": {
            "ptn": "UGM - Akuntansi & Keuangan",
            "career": "Chartered Financial Analyst",
            "ig": "@azzamy_syauqi"
        },
        "c21": {
            "ptn": "ITS - Teknik Perkapalan",
            "career": "Maritime Logistics Director",
            "ig": "@daffa_yardan"
        },
        "c22": {
            "ptn": "UB - Teknik Elektro",
            "career": "Telecommunications Engineer",
            "ig": "@farras_kurnia"
        },
        "c23": {
            "ptn": "UNESA - Ilmu Keolahragaan",
            "career": "Sport Scientist & Fisioterapis",
            "ig": "@rizky_setiawan"
        },
        "c24": {
            "ptn": "ITB - Teknik Penerbangan / FTMD",
            "career": "Aerospace Systems Engineer",
            "ig": "@sholahudin_habibie"
        },
        "c25": {
            "ptn": "UNAIR - Hubungan Internasional",
            "career": "Diplomat RI & Negosiator",
            "ig": "@syawal_satria"
        },
        "c26": {
            "ptn": "UB - Agribisnis Modern",
            "career": "Agropreneur Modern",
            "ig": "@m_yardan"
        },
        "c27": {
            "ptn": "UNPAD - Hubungan Masyarakat",
            "career": "Corporate PR Director",
            "ig": "@nahla_kemal"
        },
        "c28": {
            "ptn": "ITB - Teknik Komputer & Cyber Security",
            "career": "Full-Stack Architect & Tech Founder",
            "ig": "@nathan_ferdwiansyah"
        },
        "c29": {
            "ptn": "UGM - Teknik Geodesi",
            "career": "Geodesi & Mapping Engineer",
            "ig": "@naufal_surya"
        },
        "c30": {
            "ptn": "UI - Desain Grafis & Multimedia",
            "career": "Creative Director",
            "ig": "@syamil_dzaki"
        },
        "c31": {
            "ptn": "UI - Televisi & Perfilman",
            "career": "Cinematographer & Photographer",
            "ig": "@radithya_dzaky"
        },
        "c32": {
            "ptn": "UNDIP - Perencanaan Wilayah & Kota",
            "career": "Urban & Regional Planner",
            "ig": "@rais_widaya"
        },
        "c33": {
            "ptn": "UIN Walisongo / Al-Azhar Kairo",
            "career": "Wali Kelas Tercinta & Murabbi",
            "ig": "@ust_misbach"
        }
    };

    const yearbookGrid = document.getElementById('yearbook-grid');
    const yearbookSearchInput = document.getElementById('yearbook-search-input');
    const yearbookChips = document.querySelectorAll('.yearbook-chip');
    const btnTabDirectory = document.getElementById('btn-tab-directory');
    const btnTabGuestbook = document.getElementById('btn-tab-guestbook');
    const tabContentDirectory = document.getElementById('tab-content-directory');
    const tabContentGuestbook = document.getElementById('tab-content-guestbook');
    const guestbookCountBadge = document.getElementById('guestbook-count-badge');
    const guestbookForm = document.getElementById('guestbook-form');
    const guestbookFeed = document.getElementById('guestbook-feed');
    const btnClearGuestbook = document.getElementById('btn-clear-guestbook');
    const wordpadSheet = document.getElementById('wordpad-document-sheet');

    let currentYearbookSearch = '';
    let currentYearbookCat = 'all';

    function renderYearbookGrid() {
        if (!yearbookGrid) return;
        yearbookGrid.innerHTML = '';

        const term = currentYearbookSearch.toLowerCase().trim();

        const filtered = arcadeCharacters.filter((char) => {
            const extra = alumniExtendedData[char.id] || { ptn: 'PTN Impian', career: 'Profesional', ig: '@xii_e' };

            // Category filter
            if (currentYearbookCat === 'pengurus') {
                if (!['KM', 'WK', 'SK', 'BD'].includes(char.badge)) return false;
            } else if (currentYearbookCat === 'itb') {
                if (!extra.ptn.includes('ITB')) return false;
            } else if (currentYearbookCat === 'ui') {
                if (!extra.ptn.includes('UI')) return false;
            } else if (currentYearbookCat === 'ugm') {
                if (!extra.ptn.includes('UGM')) return false;
            } else if (currentYearbookCat === 'its') {
                if (!extra.ptn.includes('ITS')) return false;
            }

            // Text search
            if (term) {
                const matchName = char.name.toLowerCase().includes(term);
                const matchPtn = extra.ptn.toLowerCase().includes(term);
                const matchCareer = extra.career.toLowerCase().includes(term);
                const matchQuote = (char.quote || '').toLowerCase().includes(term);
                const matchRole = (char.role || '').toLowerCase().includes(term);
                if (!matchName && !matchPtn && !matchCareer && !matchQuote && !matchRole) return false;
            }

            return true;
        });

        if (filtered.length === 0) {
            yearbookGrid.innerHTML = `
                <div style="grid-column: 1/-1; padding: 24px; text-align: center; color: #718096; background: #fff; border: 1px dashed #cbd5e0;">
                    <p style="font-weight: bold; font-size: 14px;">Tidak ada alumni yang sesuai kriteria pencarian "${currentYearbookSearch}".</p>
                    <small>Coba kata kunci lain atau pilih filter "Semua (36)".</small>
                </div>
            `;
            return;
        }

        filtered.forEach((char) => {
            const extra = alumniExtendedData[char.id] || { ptn: 'PTN Impian', career: 'Profesional', ig: '@xii_e' };
            const card = document.createElement('div');
            card.className = `yearbook-card ${char.isBoss ? 'is-boss-card' : ''}`;

            const avatarHtml = char.photo
                ? `<img src="${char.photo}" alt="${char.name}" onerror="this.style.display='none'; if (this.nextElementSibling) this.nextElementSibling.style.display='block';" />
                   <span style="display:none;">${char.initials}</span>`
                : `<span>${char.initials}</span>`;

            card.innerHTML = `
                <div class="yearbook-card-top">
                    <div class="yearbook-card-avatar" style="background: ${char.color};">
                        ${avatarHtml}
                    </div>
                    <div class="yearbook-card-identity">
                        <div class="yearbook-card-name">${char.name}</div>
                        <span class="yearbook-card-absen">${char.tag || '#ALUMNI'} • ${char.role}</span>
                        <div style="font-size: 10px; color: #4a5568;"><i>"${char.title}"</i></div>
                    </div>
                </div>
                <div class="yearbook-card-details">
                    <div class="yearbook-detail-row">
                        <span class="yearbook-detail-label">🎓 Kampus:</span>
                        <span class="yearbook-detail-value">${extra.ptn}</span>
                    </div>
                    <div class="yearbook-detail-row">
                        <span class="yearbook-detail-label">🎯 Cita-cita:</span>
                        <span class="yearbook-detail-value" style="color: #2c7a7b;">${extra.career}</span>
                    </div>
                </div>
                <div class="yearbook-card-quote">
                    “${char.quote}”
                </div>
                <div class="yearbook-card-footer">
                    <span class="yearbook-social-tag">${extra.ig}</span>
                    <button type="button" class="win-btn yearbook-btn-msg" data-name="${char.name}">
                        💬 Tulis Pesan
                    </button>
                </div>
            `;

            const btnMsg = card.querySelector('.yearbook-btn-msg');
            if (btnMsg) {
                btnMsg.addEventListener('click', () => {
                    const targetInput = document.getElementById('gb-target');
                    if (targetInput) targetInput.value = char.name;
                    switchYearbookTab('guestbook');
                    const msgInput = document.getElementById('gb-message');
                    if (msgInput) msgInput.focus();
                });
            }

            yearbookGrid.appendChild(card);
        });
    }

    function switchYearbookTab(tabName) {
        if (tabName === 'directory') {
            if (btnTabDirectory) btnTabDirectory.classList.add('is-active');
            if (btnTabGuestbook) btnTabGuestbook.classList.remove('is-active');
            if (tabContentDirectory) tabContentDirectory.style.display = 'block';
            if (tabContentGuestbook) tabContentGuestbook.style.display = 'none';
        } else {
            if (btnTabGuestbook) btnTabGuestbook.classList.add('is-active');
            if (btnTabDirectory) btnTabDirectory.classList.remove('is-active');
            if (tabContentGuestbook) tabContentGuestbook.style.display = 'block';
            if (tabContentDirectory) tabContentDirectory.style.display = 'none';
        }
    }

    if (btnTabDirectory) btnTabDirectory.addEventListener('click', () => switchYearbookTab('directory'));
    if (btnTabGuestbook) btnTabGuestbook.addEventListener('click', () => switchYearbookTab('guestbook'));

    if (yearbookSearchInput) {
        yearbookSearchInput.addEventListener('input', (e) => {
            currentYearbookSearch = e.target.value;
            renderYearbookGrid();
        });
    }

    yearbookChips.forEach(chip => {
        chip.addEventListener('click', () => {
            yearbookChips.forEach(c => c.classList.remove('is-active'));
            chip.classList.add('is-active');
            currentYearbookCat = chip.dataset.filter || 'all';
            renderYearbookGrid();
        });
    });

    // Guestbook Storage & Management
    const GB_STORAGE_KEY = 'kdnatoes_guestbook_entries_v2';
    const defaultGuestbookEntries = [
        {
            id: 'gb_01',
            author: 'Ust. Misbachul Munir',
            status: 'Wali Kelas / Guru',
            sticker: '🎓',
            target: 'Semua Sahabat XII-E',
            message: 'Untuk seluruh anak-anakku kelas XII-E tercinta: Jadilah pribadi yang istiqomah, rendah hati, dan bermanfaat di manapun kalian melangkah. Doa saya selalu menyertai kelulusan dan keberkahan masa depan kalian.',
            timestamp: '15/09/2025 08:30'
        },
        {
            id: 'gb_02',
            author: 'M. Iqbal Khoirul Anam',
            status: 'Siswa XII-E',
            sticker: '🚀',
            target: 'Keluarga Besar KDNATOES',
            message: 'Tiga tahun penuh kenangan dan perjuangan bersama buku Matematika Inten! Terima kasih atas solidaritas tanpa batas kawan-kawan. Sampai jumpa di puncak kesuksesan masing-masing!',
            timestamp: '15/09/2025 09:15'
        },
        {
            id: 'gb_03',
            author: 'M. Anas Dingin',
            status: 'Siswa XII-E',
            sticker: '😎',
            target: 'Semua Siswa XII-E',
            message: 'Kepala dingin saat ujian, hati hangat saat bersama kawan. Jangan lupakan canda tawa di sudut kelas XII-E.',
            timestamp: '15/09/2025 10:00'
        },
        {
            id: 'gb_04',
            author: 'Nathan R.',
            status: 'Siswa XII-E',
            sticker: '💻',
            target: 'Seluruh Angkatan 2024-2025',
            message: 'Website Windows 95 ini dipersembahkan agar setiap detik kenangan XII-E tetap abadi dalam bentuk kode dan pixel. KDNATOES FOREVER!',
            timestamp: '15/09/2025 11:20'
        }
    ];

    function getGuestbookEntries() {
        try {
            const raw = localStorage.getItem(GB_STORAGE_KEY);
            if (!raw) {
                localStorage.setItem(GB_STORAGE_KEY, JSON.stringify(defaultGuestbookEntries));
                return defaultGuestbookEntries;
            }
            return JSON.parse(raw) || defaultGuestbookEntries;
        } catch (e) {
            return defaultGuestbookEntries;
        }
    }

    function renderGuestbookFeed() {
        if (!guestbookFeed) return;
        const entries = getGuestbookEntries();
        if (guestbookCountBadge) guestbookCountBadge.textContent = String(entries.length);

        guestbookFeed.innerHTML = '';
        entries.slice().reverse().forEach(item => {
            const isWali = item.author.includes('Misbachul') || item.status.includes('Guru');
            const isKM = item.author.includes('Iqbal');

            const entryEl = document.createElement('div');
            entryEl.className = `guestbook-entry ${isWali ? 'is-wali' : ''} ${isKM ? 'is-km' : ''}`;
            entryEl.innerHTML = `
                <div class="guestbook-entry-header">
                    <div class="guestbook-author-wrap">
                        <span style="font-size: 16px;">${item.sticker || '💬'}</span>
                        <span class="guestbook-author-name">${item.author}</span>
                        <span class="guestbook-badge">${item.status}</span>
                    </div>
                    <span class="guestbook-time">${item.timestamp}</span>
                </div>
                <div class="guestbook-target-tag">Ditujukan untuk: <b>${item.target}</b></div>
                <div class="guestbook-text">${item.message}</div>
            `;
            guestbookFeed.appendChild(entryEl);
        });
    }

    if (guestbookForm) {
        guestbookForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const author = document.getElementById('gb-author').value.trim();
            const status = document.getElementById('gb-status').value;
            const sticker = document.getElementById('gb-sticker').value;
            const target = document.getElementById('gb-target').value.trim() || 'Semua Sahabat XII-E';
            const message = document.getElementById('gb-message').value.trim();

            if (!author || !message) return;

            const now = new Date();
            const timeStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

            const newEntry = {
                id: 'gb_' + Date.now(),
                author,
                status,
                sticker,
                target,
                message,
                timestamp: timeStr
            };

            const list = getGuestbookEntries();
            list.push(newEntry);
            try {
                localStorage.setItem(GB_STORAGE_KEY, JSON.stringify(list));
            } catch (err) { }

            renderGuestbookFeed();
            playArcadeFanfare();
            document.getElementById('gb-message').value = '';
        });
    }

    if (btnClearGuestbook) {
        btnClearGuestbook.addEventListener('click', () => {
            if (confirm('Apakah Anda yakin ingin mengatur ulang buku tamu ke pesan awal?')) {
                localStorage.removeItem(GB_STORAGE_KEY);
                renderGuestbookFeed();
                playRetroClick();
            }
        });
    }

    // WordPad Formatting Bar Listeners
    const wpFontFamily = document.getElementById('wp-font-family');
    const wpFontSize = document.getElementById('wp-font-size');
    const wpBtnBold = document.getElementById('wp-btn-bold');
    const wpBtnItalic = document.getElementById('wp-btn-italic');
    const wpBtnUnderline = document.getElementById('wp-btn-underline');
    const wpBtnAlignLeft = document.getElementById('wp-btn-align-left');
    const wpBtnAlignCenter = document.getElementById('wp-btn-align-center');
    const wpBtnAlignRight = document.getElementById('wp-btn-align-right');
    const wpBtnSave = document.getElementById('wp-btn-save');
    const wpBtnPrint = document.getElementById('wp-btn-print');
    const wpBtnExportTxt = document.getElementById('wp-btn-export-txt');

    if (wpFontFamily && wordpadSheet) {
        wpFontFamily.addEventListener('change', () => {
            wordpadSheet.style.fontFamily = wpFontFamily.value;
        });
    }

    if (wpFontSize && wordpadSheet) {
        wpFontSize.addEventListener('change', () => {
            wordpadSheet.style.fontSize = wpFontSize.value;
        });
    }

    if (wpBtnBold && wordpadSheet) {
        wpBtnBold.addEventListener('click', () => {
            const isBold = wordpadSheet.style.fontWeight === 'bold';
            wordpadSheet.style.fontWeight = isBold ? 'normal' : 'bold';
            wpBtnBold.classList.toggle('is-active', !isBold);
        });
    }

    if (wpBtnItalic && wordpadSheet) {
        wpBtnItalic.addEventListener('click', () => {
            const isItalic = wordpadSheet.style.fontStyle === 'italic';
            wordpadSheet.style.fontStyle = isItalic ? 'normal' : 'italic';
            wpBtnItalic.classList.toggle('is-active', !isItalic);
        });
    }

    if (wpBtnUnderline && wordpadSheet) {
        wpBtnUnderline.addEventListener('click', () => {
            const isUnderline = wordpadSheet.style.textDecoration === 'underline';
            wordpadSheet.style.textDecoration = isUnderline ? 'none' : 'underline';
            wpBtnUnderline.classList.toggle('is-active', !isUnderline);
        });
    }

    if (wpBtnAlignLeft && wordpadSheet) {
        wpBtnAlignLeft.addEventListener('click', () => {
            wordpadSheet.style.textAlign = 'left';
        });
    }

    if (wpBtnAlignCenter && wordpadSheet) {
        wpBtnAlignCenter.addEventListener('click', () => {
            wordpadSheet.style.textAlign = 'center';
        });
    }

    if (wpBtnAlignRight && wordpadSheet) {
        wpBtnAlignRight.addEventListener('click', () => {
            wordpadSheet.style.textAlign = 'right';
        });
    }

    if (wpBtnSave) {
        wpBtnSave.addEventListener('click', () => {
            playRetroClick();
            alert('Dokumen BukuTahunan.doc dan seluruh pesan Buku Tamu berhasil disimpan ke penyimpanan lokal.');
        });
    }

    if (wpBtnPrint) {
        wpBtnPrint.addEventListener('click', () => {
            window.print();
        });
    }

    if (wpBtnExportTxt) {
        wpBtnExportTxt.addEventListener('click', () => {
            const entries = getGuestbookEntries();
            let txt = "====================================================\r\n";
            txt += " BUKU TAMU & CORETAN KENANGAN KELAS XII - E (KDNATOES)\r\n";
            txt += " Angkatan 2024 - 2025 • Wali Kelas: Ust. Misbachul Munir\r\n";
            txt += "====================================================\r\n\r\n";
            entries.forEach((e, idx) => {
                txt += `[${idx + 1}] ${e.timestamp} - ${e.author} (${e.status})\r\n`;
                txt += `    Ditujukan: ${e.target}\r\n`;
                txt += `    Pesan: "${e.message}"\r\n\r\n`;
            });
            const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Buku_Tamu_Kelas_XII_E.txt';
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    renderYearbookGrid();
    renderGuestbookFeed();

    // ======================================================================
    // 11. RETRO WINDOWS 95 SCREENSAVER (3D Starfield Warp Speed & Glowing XII-E)
    // ======================================================================
    const screensaverOverlay = document.getElementById('screensaver-overlay');
    const screensaverCanvas = document.getElementById('screensaver-canvas');
    const btnScreensaverLaunch = document.getElementById('btn-screensaver-launch');
    const menuTriggerScreensaver = document.getElementById('menu-trigger-screensaver');

    let isScreensaverActive = false;
    let screensaverAnimId = null;
    let idleSeconds = 0;
    const stars = [];
    const NUM_STARS = 450;
    let bounceX = 100;
    let bounceY = 100;
    let bounceVx = 2;
    let bounceVy = 1.6;

    function initStarfield() {
        stars.length = 0;
        for (let i = 0; i < NUM_STARS; i++) {
            stars.push({
                x: (Math.random() - 0.5) * 2000,
                y: (Math.random() - 0.5) * 2000,
                z: Math.random() * 1000 + 1,
                pz: 1000
            });
        }
    }

    function resizeScreensaverCanvas() {
        if (!screensaverCanvas) return;
        screensaverCanvas.width = window.innerWidth;
        screensaverCanvas.height = window.innerHeight;
    }

    function launchScreensaver() {
        if (isScreensaverActive || !screensaverOverlay || !screensaverCanvas) return;
        isScreensaverActive = true;
        screensaverOverlay.style.display = 'block';
        resizeScreensaverCanvas();
        initStarfield();
        bounceX = window.innerWidth * 0.2;
        bounceY = window.innerHeight * 0.3;
        animateScreensaver();
    }

    function stopScreensaver() {
        if (!isScreensaverActive || !screensaverOverlay) return;
        isScreensaverActive = false;
        screensaverOverlay.style.display = 'none';
        if (screensaverAnimId) {
            cancelAnimationFrame(screensaverAnimId);
            screensaverAnimId = null;
        }
    }

    function animateScreensaver() {
        if (!isScreensaverActive || !screensaverCanvas) return;
        const ctx = screensaverCanvas.getContext('2d');
        const w = screensaverCanvas.width;
        const h = screensaverCanvas.height;
        const cx = w / 2;
        const cy = h / 2;

        // Space Black Backdrop
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, w, h);

        // 3D Starfield Warp Speed
        const speed = 9;
        for (let i = 0; i < stars.length; i++) {
            const s = stars[i];
            s.pz = s.z;
            s.z -= speed;
            if (s.z <= 0) {
                s.z = 1000;
                s.pz = 1000;
                s.x = (Math.random() - 0.5) * 2000;
                s.y = (Math.random() - 0.5) * 2000;
            }

            const k = 400 / s.z;
            const px = s.x * k + cx;
            const py = s.y * k + cy;

            const pk = 400 / s.pz;
            const prevX = s.x * pk + cx;
            const prevY = s.y * pk + cy;

            if (px >= 0 && px < w && py >= 0 && py < h) {
                const brightness = Math.min(1, Math.max(0.2, (1 - s.z / 1000)));
                const colorTone = i % 5 === 0 ? `rgba(0, 255, 255, ${brightness})` : (i % 7 === 0 ? `rgba(255, 255, 0, ${brightness})` : `rgba(255, 255, 255, ${brightness})`);
                ctx.strokeStyle = colorTone;
                ctx.lineWidth = Math.max(1, (1 - s.z / 1000) * 3);
                ctx.beginPath();
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(px, py);
                ctx.stroke();
            }
        }

        // 3D Bouncing Retro Text: KELAS XII - E FOREVER
        bounceX += bounceVx;
        bounceY += bounceVy;

        const text1 = "KELAS 6E - KDNATOES";
        const text2 = "★ KDNATOES • RASGARIONS ★";
        ctx.font = "bold 36px 'Pixelify Sans', 'VT323', monospace";
        const textMetrics = ctx.measureText(text1);
        const textW = textMetrics.width;

        if (bounceX <= 20 || bounceX + textW >= w - 20) bounceVx *= -1;
        if (bounceY <= 60 || bounceY >= h - 80) bounceVy *= -1;

        // 3D Extrusion Shadow Layers
        const depth = 6;
        for (let d = depth; d > 0; d--) {
            ctx.fillStyle = `rgba(142, 68, 173, ${0.4 + (d / depth) * 0.4})`;
            ctx.fillText(text1, bounceX + d * 2, bounceY + d * 2);
        }
        // Front Glowing Cyan Text
        ctx.fillStyle = '#00ffff';
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 15;
        ctx.fillText(text1, bounceX, bounceY);
        ctx.shadowBlur = 0;

        // Subtitle
        ctx.font = "16px 'VT323', monospace";
        ctx.fillStyle = '#f1c40f';
        ctx.fillText(text2, bounceX + 10, bounceY + 28);

        screensaverAnimId = requestAnimationFrame(animateScreensaver);
    }

    // 60-Second Idle Detection
    setInterval(() => {
        idleSeconds++;
        if (idleSeconds >= 60 && !isScreensaverActive) {
            launchScreensaver();
        }
    }, 1000);

    const resetIdle = () => {
        idleSeconds = 0;
        if (isScreensaverActive) {
            stopScreensaver();
        }
    };

    ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'wheel'].forEach(evt => {
        window.addEventListener(evt, resetIdle, { passive: true });
    });

    if (btnScreensaverLaunch) {
        btnScreensaverLaunch.addEventListener('click', (e) => {
            e.stopPropagation();
            launchScreensaver();
        });
    }

    if (menuTriggerScreensaver) {
        menuTriggerScreensaver.addEventListener('click', (e) => {
            e.stopPropagation();
            if (startMenu) startMenu.classList.remove('is-open');
            if (startBtn) startBtn.classList.remove('is-active');
            launchScreensaver();
        });
    }

    window.addEventListener('resize', () => {
        if (isScreensaverActive) resizeScreensaverCanvas();
    });

    // ======================================================================
    // 12. KUIS UJIAN NOSTALGIA & GENERATOR IJAZAH KELULUSAN (Ujian.exe)
    // ======================================================================
    const btnSubmitExam = document.getElementById('btn-submit-exam');
    const btnResetExam = document.getElementById('btn-reset-exam');
    const examResultBox = document.getElementById('exam-result-box');
    const resultScoreText = document.getElementById('result-score-text');
    const resultVerdictText = document.getElementById('result-verdict-text');
    const diplomaCanvas = document.getElementById('diploma-canvas');
    const btnDownloadDiploma = document.getElementById('btn-download-diploma');
    const btnPrintDiploma = document.getElementById('btn-print-diploma');

    const examAnswerKey = {
        q1: 'B', // Ust. Misbachul Munir
        q2: 'A', // KDNATOES
        q3: 'C', // M. Iqbal Khoirul Anam
        q4: 'A', // Diskusi masuk PTN, nobar layar proyektor
        q5: 'B'  // Lolos PTN Impian, sukses menggapai cita-cita, dan tetap kompak selamanya!
    };

    function drawGraduationDiploma(studentName, score, predikat) {
        if (!diplomaCanvas) return;
        const ctx = diplomaCanvas.getContext('2d');
        const w = diplomaCanvas.width;
        const h = diplomaCanvas.height;

        // 1. Parchment Cream Background
        ctx.fillStyle = '#fffdf7';
        ctx.fillRect(0, 0, w, h);

        // Vintage Paper Texture lines
        ctx.fillStyle = '#faf6eb';
        for (let i = 0; i < h; i += 4) {
            ctx.fillRect(0, i, w, 1);
        }

        // 2. Ornate Golden Outer Border
        ctx.strokeStyle = '#b8860b';
        ctx.lineWidth = 8;
        ctx.strokeRect(14, 14, w - 28, h - 28);

        // Thin Inner Gold Border
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        ctx.strokeRect(22, 22, w - 44, h - 44);

        // Corner Rosettes
        const corners = [
            [26, 26],
            [w - 26, 26],
            [26, h - 26],
            [w - 26, h - 26]
        ];
        corners.forEach(([cx, cy]) => {
            ctx.fillStyle = '#b8860b';
            ctx.beginPath();
            ctx.arc(cx, cy, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // 3. Official Header
        ctx.textAlign = 'center';
        ctx.fillStyle = '#1a365d';
        ctx.font = "bold 13px 'Georgia', serif";
        ctx.fillText("KEMENTERIAN KENANGAN & SOLIDARITAS ANGKATAN 2024 / 2025", w / 2, 60);

        ctx.fillStyle = '#742a2a';
        ctx.font = "bold 11px 'Georgia', serif";
        ctx.fillText("KELAS XII - E (KDNATOES) • MADRASAH ALIYAH / SMA NEGERI", w / 2, 80);

        // Decorative Double Line
        ctx.strokeStyle = '#b8860b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(100, 92);
        ctx.lineTo(w - 100, 92);
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(140, 96);
        ctx.lineTo(w - 140, 96);
        ctx.stroke();

        // 4. Main Certificate Title
        ctx.fillStyle = '#000080';
        ctx.font = "bold 28px 'Times New Roman', serif";
        ctx.fillText("IJAZAH KELULUSAN NOSTALGIA", w / 2, 136);

        ctx.fillStyle = '#4a5568';
        ctx.font = "italic 13px 'Georgia', serif";
        ctx.fillText("Nomor Induk: XII-E/KDNATOES/2025/CERT-036", w / 2, 160);

        ctx.fillStyle = '#2d3748';
        ctx.font = "14px 'Georgia', serif";
        ctx.fillText("Dengan penuh rasa syukur dan bangga dianugerahkan kepada:", w / 2, 195);

        // 5. Student Name
        ctx.fillStyle = '#1a202c';
        ctx.font = "bold 26px 'Times New Roman', serif";
        ctx.fillText(studentName.toUpperCase(), w / 2, 235);

        ctx.strokeStyle = '#a0aec0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(w / 2 - 180, 245);
        ctx.lineTo(w / 2 + 180, 245);
        ctx.stroke();

        // 6. Verdict and Accomplishment
        ctx.fillStyle = '#2d3748';
        ctx.font = "13px 'Georgia', serif";
        ctx.fillText("Telah menyelesaikan Kuis Ujian Akhir Nostalgia Kelas XII-E dengan perolehan:", w / 2, 275);

        ctx.fillStyle = '#c53030';
        ctx.font = "bold 18px 'Georgia', serif";
        ctx.fillText(`NILAI: ${score} / 100 • ${predikat}`, w / 2, 305);

        ctx.fillStyle = '#4a5568';
        ctx.font = "italic 12px 'Georgia', serif";
        ctx.fillText("“Semoga seluruh cita-cita, impian masuk Perguruan Tinggi Negeri impian,", w / 2, 335);
        ctx.fillText("serta persahabatan sejati senantiasa menyertai setiap langkah perjalanan hidupmu.”", w / 2, 355);

        // 7. Gold Official Stamped Seal
        ctx.save();
        const sealX = w / 2;
        const sealY = 440;
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.arc(sealX, sealY, 32, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#b8860b';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#744210';
        ctx.font = "bold 9px 'Arial', sans-serif";
        ctx.fillText("★ XII-E OFFICIAL ★", sealX, sealY - 6);
        ctx.font = "bold 11px 'Times New Roman', serif";
        ctx.fillText("KDNATOES", sealX, sealY + 8);
        ctx.font = "8px 'Arial', sans-serif";
        ctx.fillText("ANGKATAN 2025", sealX, sealY + 18);
        ctx.restore();

        // 8. Signatures
        // Left: Ketua Kelas
        ctx.textAlign = 'center';
        ctx.fillStyle = '#2d3748';
        ctx.font = "12px 'Georgia', serif";
        ctx.fillText("Ketua Kelas XII - E,", 180, 420);
        ctx.font = "italic 18px 'Brush Script MT', cursive, serif";
        ctx.fillStyle = '#000080';
        ctx.fillText("M. Iqbal Khoirul Anam", 180, 460);
        ctx.strokeStyle = '#718096';
        ctx.beginPath();
        ctx.moveTo(100, 475);
        ctx.lineTo(260, 475);
        ctx.stroke();
        ctx.fillStyle = '#2d3748';
        ctx.font = "bold 11px 'Georgia', serif";
        ctx.fillText("M. Iqbal Khoirul Anam", 180, 492);
        ctx.font = "10px 'Georgia', serif";
        ctx.fillText("KM / Math Master", 180, 508);

        // Right: Wali Kelas
        ctx.textAlign = 'center';
        ctx.fillStyle = '#2d3748';
        ctx.font = "12px 'Georgia', serif";
        ctx.fillText("Wali Kelas XII - E,", w - 180, 420);
        ctx.font = "italic 18px 'Brush Script MT', cursive, serif";
        ctx.fillStyle = '#276749';
        ctx.fillText("Misbachul Munir", w - 180, 460);
        ctx.strokeStyle = '#718096';
        ctx.beginPath();
        ctx.moveTo(w - 260, 475);
        ctx.lineTo(w - 100, 475);
        ctx.stroke();
        ctx.fillStyle = '#2d3748';
        ctx.font = "bold 11px 'Georgia', serif";
        ctx.fillText("Ust. Misbachul Munir", w - 180, 492);
        ctx.font = "10px 'Georgia', serif";
        ctx.fillText("NIP. 19780512 200312 1 002", w - 180, 508);
    }

    if (btnSubmitExam) {
        btnSubmitExam.addEventListener('click', () => {
            const form = document.getElementById('exam-questions-form');
            const studentNameInput = document.getElementById('exam-student-name');
            const studentName = (studentNameInput && studentNameInput.value.trim()) || 'Siswa Teladan XII-E';

            // Validate all 5 questions answered
            let answeredCount = 0;
            let correctCount = 0;
            for (let i = 1; i <= 5; i++) {
                const checked = form.querySelector(`input[name="q${i}"]:checked`);
                if (checked) {
                    answeredCount++;
                    if (checked.value === examAnswerKey[`q${i}`]) {
                        correctCount++;
                    }
                }
            }

            if (answeredCount < 5) {
                alert('Mohon jawab seluruh 5 pertanyaan sebelum mengumpulkan lembar ujian!');
                return;
            }

            const score = Math.round((correctCount / 5) * 100);
            let predikat = 'LULUS DENGAN CATATAN';
            if (score === 100) predikat = 'A+ CUMLAUDE (LULUS SEMPURNA!)';
            else if (score >= 80) predikat = 'A SANGAT MEMUASKAN';
            else if (score >= 60) predikat = 'B MEMUASKAN';

            if (resultScoreText) resultScoreText.textContent = `NILAI AKHIR: ${score} / 100`;
            if (resultVerdictText) resultVerdictText.textContent = `PREDIKAT: ${predikat}`;
            if (examResultBox) examResultBox.style.display = 'block';

            drawGraduationDiploma(studentName, score, predikat);

            playArcadeFanfare();
            announceArcadeVoice("CONGRATULATIONS! GRADUATION CERTIFICATE GRANTED!", { pitch: 0.72, rate: 1.0 });

            if (examResultBox) examResultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    if (btnResetExam) {
        btnResetExam.addEventListener('click', () => {
            const form = document.getElementById('exam-questions-form');
            if (form) form.reset();
            if (examResultBox) examResultBox.style.display = 'none';
            playRetroClick();
        });
    }

    if (btnDownloadDiploma && diplomaCanvas) {
        btnDownloadDiploma.addEventListener('click', () => {
            const studentNameInput = document.getElementById('exam-student-name');
            const cleanName = ((studentNameInput && studentNameInput.value) || 'Siswa').replace(/[^a-zA-Z0-9]/g, '_');
            const dataUrl = diplomaCanvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = `Ijazah_Kelulusan_XII-E_${cleanName}.png`;
            a.click();
            playRetroClick();
        });
    }

    if (btnPrintDiploma && diplomaCanvas) {
        btnPrintDiploma.addEventListener('click', () => {
            const dataUrl = diplomaCanvas.toDataURL('image/png');
            const printWin = window.open('', '_blank');
            if (printWin) {
                printWin.document.write(`
                    <html>
                        <head><title>Cetak Ijazah Kelulusan XII-E</title></head>
                        <body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#fff;">
                            <img src="${dataUrl}" style="max-width:100%; height:auto;" onload="window.print(); window.close();" />
                        </body>
                    </html>
                `);
                printWin.document.close();
            }
        });
    }

    // ======================================================================
    // PILAR 2: WINDOWS 98 DESKTOP CONTEXT MENU & DISPLAY PROPERTIES
    // ======================================================================
    const contextMenu = document.getElementById('desktop-context-menu');
    const displayPropsModal = document.getElementById('display-properties-modal');
    const closeDispPropsBtn = document.getElementById('close-disp-props-btn');
    const btnCancelWallpaper = document.getElementById('btn-cancel-wallpaper');
    const btnApplyWallpaper = document.getElementById('btn-apply-wallpaper');
    const crtPreviewScreen = document.getElementById('crt-preview-screen');
    const wallpaperOptBtns = document.querySelectorAll('.wallpaper-opt-btn');
    const inputCustomWallpaper = document.getElementById('input-custom-wallpaper');

    const wallpaperPresets = {
        bliss: {
            bgImage: "url('assets/bliss_1080p.jpg')",
            bgColor: "#008080",
            bgSize: "cover",
            bgPos: "center"
        },
        teal: {
            bgImage: "none",
            bgColor: "#008080",
            bgSize: "auto",
            bgPos: "center"
        },
        clouds: {
            bgImage: "radial-gradient(ellipse at center, #93c5fd 0%, #1d4ed8 100%)",
            bgColor: "#1d4ed8",
            bgSize: "cover",
            bgPos: "center"
        },
        cyber: {
            bgImage: "linear-gradient(180deg, #180527 0%, #4a0e4e 55%, #881177 100%)",
            bgColor: "#180527",
            bgSize: "cover",
            bgPos: "center"
        }
    };

    let selectedWallpaperKey = 'bliss';
    let customWallpaperDataUrl = null;

    function applyDesktopWallpaper(presetKey, customUrl = null) {
        const viewport = document.getElementById('desktop-viewport');
        if (!viewport) return;

        if (customUrl) {
            viewport.style.backgroundImage = `url('${customUrl}')`;
            viewport.style.backgroundColor = '#000000';
            viewport.style.backgroundSize = 'cover';
            viewport.style.backgroundPosition = 'center';
            if (crtPreviewScreen) {
                crtPreviewScreen.style.backgroundImage = `url('${customUrl}')`;
                crtPreviewScreen.style.backgroundColor = '#000000';
            }
            try {
                localStorage.setItem('xii_wallpaper', JSON.stringify({ type: 'custom', url: customUrl }));
            } catch (e) { console.warn(e); }
            return;
        }

        const preset = wallpaperPresets[presetKey] || wallpaperPresets.bliss;
        viewport.style.backgroundImage = preset.bgImage;
        viewport.style.backgroundColor = preset.bgColor;
        viewport.style.backgroundSize = preset.bgSize;
        viewport.style.backgroundPosition = preset.bgPos;

        if (crtPreviewScreen) {
            crtPreviewScreen.style.backgroundImage = preset.bgImage;
            crtPreviewScreen.style.backgroundColor = preset.bgColor;
        }

        try {
            localStorage.setItem('xii_wallpaper', JSON.stringify({ type: 'preset', key: presetKey }));
        } catch (e) { console.warn(e); }
    }

    // Restore saved wallpaper from localStorage on boot (Pilar 3)
    try {
        const savedWp = localStorage.getItem('xii_wallpaper');
        if (savedWp) {
            const parsed = JSON.parse(savedWp);
            if (parsed.type === 'custom' && parsed.url) {
                applyDesktopWallpaper(null, parsed.url);
            } else if (parsed.type === 'preset' && parsed.key) {
                selectedWallpaperKey = parsed.key;
                applyDesktopWallpaper(parsed.key);
                wallpaperOptBtns.forEach(btn => {
                    btn.classList.toggle('is-active', btn.dataset.wallpaper === parsed.key);
                });
            }
        }
    } catch (e) { console.warn('Failed restoring wallpaper from localStorage:', e); }

    // Desktop Right-Click Context Menu
    const desktopViewport = document.getElementById('desktop-viewport');
    if (desktopViewport && contextMenu) {
        desktopViewport.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.win-window') || e.target.closest('.win-modal-backdrop') || e.target.closest('.win-taskbar')) {
                return;
            }
            e.preventDefault();
            playRetroClick();
            contextMenu.style.display = 'block';

            const menuWidth = 180;
            const menuHeight = 160;
            let posX = e.clientX;
            let posY = e.clientY;
            if (posX + menuWidth > window.innerWidth) posX = window.innerWidth - menuWidth - 8;
            if (posY + menuHeight > window.innerHeight - 36) posY = window.innerHeight - menuHeight - 40;

            contextMenu.style.left = `${posX}px`;
            contextMenu.style.top = `${posY}px`;
        });

        document.addEventListener('mousedown', (e) => {
            if (contextMenu.style.display !== 'none' && !contextMenu.contains(e.target)) {
                contextMenu.style.display = 'none';
            }
        });
    }

    const ctxArrangeIcons = document.getElementById('ctx-arrange-icons');
    const ctxRefresh = document.getElementById('ctx-refresh');
    const ctxOpenPaint = document.getElementById('ctx-open-paint');
    const ctxOpenTugas = document.getElementById('ctx-open-tugas');
    const ctxOpenVersus = document.getElementById('ctx-open-versus');
    const ctxProperties = document.getElementById('ctx-properties');

    if (ctxArrangeIcons) {
        ctxArrangeIcons.addEventListener('click', () => {
            contextMenu.style.display = 'none';
            const shortcuts = document.querySelector('.desktop-shortcuts');
            if (shortcuts) {
                shortcuts.style.transform = 'scale(0.98)';
                setTimeout(() => shortcuts.style.transform = '', 150);
            }
            playRetroClick();
        });
    }

    if (ctxRefresh) {
        ctxRefresh.addEventListener('click', () => {
            contextMenu.style.display = 'none';
            playRetroClick();
            if (desktopViewport) {
                desktopViewport.style.opacity = '0.6';
                setTimeout(() => desktopViewport.style.opacity = '1', 120);
            }
        });
    }

    if (ctxOpenPaint) {
        ctxOpenPaint.addEventListener('click', () => {
            contextMenu.style.display = 'none';
            activateWindow('paint-window');
        });
    }

    if (ctxOpenTugas) {
        ctxOpenTugas.addEventListener('click', () => {
            contextMenu.style.display = 'none';
            activateWindow('tugas-window');
        });
    }

    if (ctxOpenVersus) {
        ctxOpenVersus.addEventListener('click', () => {
            contextMenu.style.display = 'none';
            startVersusBattle();
        });
    }

    if (ctxProperties) {
        ctxProperties.addEventListener('click', () => {
            contextMenu.style.display = 'none';
            openModal('display-properties-modal');
        });
    }

    wallpaperOptBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            wallpaperOptBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            selectedWallpaperKey = btn.dataset.wallpaper;
            customWallpaperDataUrl = null;
            const preset = wallpaperPresets[selectedWallpaperKey];
            if (crtPreviewScreen && preset) {
                crtPreviewScreen.style.backgroundImage = preset.bgImage;
                crtPreviewScreen.style.backgroundColor = preset.bgColor;
            }
            playRetroClick();
        });
    });

    if (inputCustomWallpaper) {
        inputCustomWallpaper.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
                customWallpaperDataUrl = evt.target.result;
                wallpaperOptBtns.forEach(b => b.classList.remove('is-active'));
                if (crtPreviewScreen) {
                    crtPreviewScreen.style.backgroundImage = `url('${customWallpaperDataUrl}')`;
                    crtPreviewScreen.style.backgroundColor = '#000000';
                }
            };
            reader.readAsDataURL(file);
        });
    }

    if (btnApplyWallpaper) {
        btnApplyWallpaper.addEventListener('click', () => {
            if (customWallpaperDataUrl) {
                applyDesktopWallpaper(null, customWallpaperDataUrl);
            } else {
                applyDesktopWallpaper(selectedWallpaperKey);
            }
            closeModal('display-properties-modal');
        });
    }

    if (btnCancelWallpaper) {
        btnCancelWallpaper.addEventListener('click', () => closeModal('display-properties-modal'));
    }

    if (closeDispPropsBtn) {
        closeDispPropsBtn.addEventListener('click', () => closeModal('display-properties-modal'));
    }

    // ======================================================================
    // PILAR 2: WINDOW RESIZING ENGINE (VIA .win-resize-grip)
    // ======================================================================
    windows.forEach(win => {
        if (!win.querySelector('.win-resize-grip')) {
            const grip = document.createElement('div');
            grip.className = 'win-resize-grip';
            grip.title = 'Tarik sudut untuk mengubah ukuran jendela';
            win.appendChild(grip);

            let isResizing = false;
            let startW = 0;
            let startH = 0;
            let startMouseX = 0;
            let startMouseY = 0;

            function startResize(clientX, clientY) {
                if (win.classList.contains('is-maximized')) return;
                isResizing = true;
                startW = win.offsetWidth;
                startH = win.offsetHeight;
                startMouseX = clientX;
                startMouseY = clientY;
                document.body.style.userSelect = 'none';
                activateWindow(win.id);
            }

            function onResize(clientX, clientY) {
                if (!isResizing) return;
                const newW = Math.max(340, Math.min(window.innerWidth - 20, startW + (clientX - startMouseX)));
                const newH = Math.max(220, Math.min(window.innerHeight - 40, startH + (clientY - startMouseY)));
                win.style.width = `${newW}px`;
                win.style.maxWidth = `${newW}px`;
                win.style.height = `${newH}px`;
                win.style.maxHeight = `${newH}px`;
            }

            function stopResize() {
                if (isResizing) {
                    isResizing = false;
                    document.body.style.userSelect = '';
                }
            }

            grip.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                e.preventDefault();
                startResize(e.clientX, e.clientY);
            });

            grip.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                const t = e.touches[0];
                startResize(t.clientX, t.clientY);
            }, { passive: true });

            window.addEventListener('mousemove', (e) => {
                if (isResizing) onResize(e.clientX, e.clientY);
            });

            window.addEventListener('touchmove', (e) => {
                if (isResizing) {
                    const t = e.touches[0];
                    onResize(t.clientX, t.clientY);
                }
            }, { passive: true });

            window.addEventListener('mouseup', stopResize);
            window.addEventListener('touchend', stopResize);
        }
    });

    // ======================================================================
    // PILAR 2: DESKTOP MARQUEE SELECTION BOX
    // ======================================================================
    let isMarquee = false;
    let marqueeStartX = 0;
    let marqueeStartY = 0;
    let marqueeBox = null;

    if (desktopViewport) {
        desktopViewport.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            if (e.target.closest('.win-window') || e.target.closest('.desktop-icon') || e.target.closest('.win-modal-backdrop') || e.target.closest('.win-taskbar') || e.target.closest('.win-context-menu')) {
                return;
            }

            isMarquee = true;
            marqueeStartX = e.clientX;
            marqueeStartY = e.clientY;

            if (!marqueeBox) {
                marqueeBox = document.createElement('div');
                marqueeBox.className = 'desktop-marquee';
                desktopViewport.appendChild(marqueeBox);
            }
            marqueeBox.style.left = `${marqueeStartX}px`;
            marqueeBox.style.top = `${marqueeStartY}px`;
            marqueeBox.style.width = '0px';
            marqueeBox.style.height = '0px';
            marqueeBox.style.display = 'block';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isMarquee || !marqueeBox) return;
            const currentX = e.clientX;
            const currentY = e.clientY;

            const left = Math.min(marqueeStartX, currentX);
            const top = Math.min(marqueeStartY, currentY);
            const width = Math.abs(currentX - marqueeStartX);
            const height = Math.abs(currentY - marqueeStartY);

            marqueeBox.style.left = `${left}px`;
            marqueeBox.style.top = `${top}px`;
            marqueeBox.style.width = `${width}px`;
            marqueeBox.style.height = `${height}px`;
        });

        window.addEventListener('mouseup', () => {
            if (isMarquee && marqueeBox) {
                isMarquee = false;
                marqueeBox.style.display = 'none';
            }
        });
    }

    // ======================================================================
    // PILAR 3: NOTEPAD (TUGAS.TXT) LOCALSTORAGE TASK MANAGER
    // ======================================================================
    const btnAddCustomTask = document.getElementById('btn-add-custom-task');
    const customTaskContainer = document.getElementById('custom-task-container');

    let customTasks = [];
    try {
        const savedTasks = localStorage.getItem('xii_user_tasks');
        if (savedTasks) customTasks = JSON.parse(savedTasks);
    } catch (e) { console.warn(e); }

    function renderCustomTasks() {
        if (!customTaskContainer) return;
        customTaskContainer.innerHTML = '';
        if (customTasks.length === 0) {
            customTaskContainer.style.display = 'none';
            return;
        }
        customTaskContainer.style.display = 'grid';

        customTasks.forEach((task, index) => {
            const article = document.createElement('article');
            article.className = 'task-card-win win-outset is-custom';
            article.innerHTML = `
                <div class="task-card-inner win-inset">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <span class="task-badge-pill" style="background: #27ae60; color: #fff;">📌 Catatan Mandiri</span>
                        <button class="win-btn btn-delete-task" data-index="${index}" title="Hapus catatan ini">✕</button>
                    </div>
                    <h3 class="task-title" style="margin-top: 6px;">${task.title}</h3>
                    <p class="task-desc">${task.desc}</p>
                    <div class="task-footer">
                        <span>Batas: <strong>${task.due || 'Segera'}</strong></span>
                    </div>
                </div>
            `;
            customTaskContainer.appendChild(article);
        });

        customTaskContainer.querySelectorAll('.btn-delete-task').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.index, 10);
                if (!isNaN(idx)) {
                    customTasks.splice(idx, 1);
                    try {
                        localStorage.setItem('xii_user_tasks', JSON.stringify(customTasks));
                    } catch (err) { console.warn(err); }
                    renderCustomTasks();
                    playRetroClick();
                }
            });
        });
    }

    renderCustomTasks();

    if (btnAddCustomTask) {
        btnAddCustomTask.addEventListener('click', () => {
            playRetroClick();
            const title = prompt('Masukkan Judul Tugas / Catatan:');
            if (!title || !title.trim()) return;

            const desc = prompt('Masukkan Keterangan / Deskripsi Tugas:', 'Selesaikan tugas mandiri sebelum tenggat waktu.');
            const due = prompt('Batas Waktu Pengumpulan:', 'Besok, 23:59 WIB');

            customTasks.unshift({
                title: title.trim(),
                desc: desc ? desc.trim() : '-',
                due: due ? due.trim() : 'Segera'
            });

            try {
                localStorage.setItem('xii_user_tasks', JSON.stringify(customTasks));
            } catch (err) { console.warn(err); }

            renderCustomTasks();
            playTekkenConfirm();
        });
    }

    // ======================================================================
    // 13. DREAMCAMPUS.MAP ENGINE (Radar Sebaran Alumni Encarta 95 Edition)
    // ======================================================================
    const campusCityMapping = {
        "surabaya": [
            "c1",
            "c6",
            "c8",
            "c9",
            "c15",
            "c16",
            "c18",
            "c21",
            "c23",
            "c25"
        ],
        "bandung": [
            "c2",
            "c12",
            "c14",
            "c24",
            "c27",
            "c28"
        ],
        "jakarta": [
            "c3",
            "c11",
            "c13",
            "c30",
            "c31"
        ],
        "jogja": [
            "c4",
            "c10",
            "c19",
            "c20",
            "c29"
        ],
        "malang": [
            "c7",
            "c17",
            "c22",
            "c26"
        ],
        "semarang": [
            "c32",
            "c33"
        ],
        "bogor": [
            "c5"
        ],
        "boston": [
            "c28"
        ]
    };

    const campusCityMeta = {
        all: {
            title: '📍 SEMUA DESTINASI (32 SISWA KELAS XII-E)',
            coords: 'KOORDINAT: KEPULAUAN NUSANTARA & DUNIA'
        },
        bandung: {
            title: '📍 BANDUNG - ITB & UNPAD (6 MAHASISWA BARU)',
            coords: 'LAT: -6.9175° S • LON: 107.6191° E (JAWA BARAT)'
        },
        surabaya: {
            title: '📍 SURABAYA - ITS, UNAIR & UNESA (10 MAHASISWA BARU)',
            coords: 'LAT: -7.2575° S • LON: 112.7521° E (JAWA TIMUR)'
        },
        jakarta: {
            title: '📍 DEPOK / JAKARTA - UNIVERSITAS INDONESIA (5 MAHASISWA BARU)',
            coords: 'LAT: -6.3653° S • LON: 106.8317° E (JABODETABEK)'
        },
        jogja: {
            title: '📍 YOGYAKARTA & SOLO - UGM & UNS (5 MAHASISWA BARU)',
            coords: 'LAT: -7.7713° S • LON: 110.3775° E (DIY & JATENG)'
        },
        malang: {
            title: '📍 MALANG - UNIVERSITAS BRAWIJAYA & UIN (4 MAHASISWA BARU)',
            coords: 'LAT: -7.9526° S • LON: 112.6144° E (JAWA TIMUR)'
        },
        semarang: {
            title: '📍 SEMARANG - UNDIP & UIN WALISONGO (1 MAHASISWA BARU)',
            coords: 'LAT: -7.0505° S • LON: 110.4395° E (JAWA TENGAH)'
        },
        bogor: {
            title: '📍 BOGOR - INSTITUT PERTANIAN BOGOR (1 MAHASISWA BARU)',
            coords: 'LAT: -6.6018° S • LON: 106.8055° E (JAWA BARAT)'
        },
        boston: {
            title: '📍 USA / OVERSEAS - MASSACHUSETTS INSTITUTE OF TECHNOLOGY',
            coords: 'LAT: 42.3601° N • LON: 71.0942° W (BOSTON, USA)'
        }
    };

    const campusStudentListEl = document.getElementById('campus-student-list');
    const campusCityTitleEl = document.getElementById('campus-current-city-title');
    const campusRadarCoordsEl = document.getElementById('campus-radar-coords');
    const campusStatusTextEl = document.getElementById('campus-status-text');
    const campusSearchInput = document.getElementById('campus-search-input');
    const campusChips = document.querySelectorAll('.campus-chip');
    const radarPins = document.querySelectorAll('.radar-city-pin');

    let currentCampusCity = 'all';
    let currentCampusSearch = '';

    function playRadarPingSound() {
        if (!soundEnabled || !window.AudioContext) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const now = ctx.currentTime;
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.15);
        } catch (e) { }
    }

    function renderCampusStudents() {
        if (!campusStudentListEl) return;
        campusStudentListEl.innerHTML = '';

        const term = currentCampusSearch.toLowerCase().trim();
        const allowedIds = currentCampusCity === 'all'
            ? null
            : (campusCityMapping[currentCampusCity] || []);

        const filtered = arcadeCharacters.filter(char => {
            if (allowedIds && !allowedIds.includes(char.id)) return false;
            const extra = alumniExtendedData[char.id] || { ptn: 'PTN Impian', career: 'Profesional' };
            if (term) {
                const matchName = char.name.toLowerCase().includes(term);
                const matchPtn = extra.ptn.toLowerCase().includes(term);
                const matchCareer = extra.career.toLowerCase().includes(term);
                const matchRole = (char.role || '').toLowerCase().includes(term);
                if (!matchName && !matchPtn && !matchCareer && !matchRole) return false;
            }
            return true;
        });

        if (filtered.length === 0) {
            campusStudentListEl.innerHTML = `
                <div style="padding: 24px; text-align: center; color: #718096; background: #fff; border: 1px dashed #cbd5e0;">
                    <p style="font-weight: bold; font-size: 13px;">Tidak ada alumni yang cocok dengan pencarian.</p>
                    <small>Coba kata kunci lain atau pilih kota lain pada radar.</small>
                </div>
            `;
            if (campusStatusTextEl) campusStatusTextEl.textContent = 'Tidak ada alumni ditemukan.';
            return;
        }

        filtered.forEach(char => {
            const extra = alumniExtendedData[char.id] || { ptn: 'PTN Impian', career: 'Profesional' };
            const card = document.createElement('div');
            card.className = 'campus-student-card';

            const avatarHtml = char.photo
                ? `<img src="${char.photo}" alt="${char.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" /><span style="display:none;">${char.initials}</span>`
                : `<span>${char.initials}</span>`;

            card.innerHTML = `
                <div class="csc-avatar" style="background: ${char.color};">
                    ${avatarHtml}
                </div>
                <div class="csc-info">
                    <div class="csc-name">
                        <span>${char.name}</span>
                        <span class="csc-badge">${char.badge || 'XII-E'}</span>
                    </div>
                    <div class="csc-major" title="${extra.ptn}">🎓 ${extra.ptn}</div>
                    <div class="csc-career">🎯 Cita-cita: ${extra.career}</div>
                </div>
            `;

            card.addEventListener('click', () => {
                playRetroClick();
                if (campusStatusTextEl) {
                    campusStatusTextEl.textContent = `${char.name} → Menuju ${extra.ptn}`;
                }
            });

            campusStudentListEl.appendChild(card);
        });

        if (campusStatusTextEl) {
            campusStatusTextEl.textContent = `Menampilkan ${filtered.length} mahasiswa baru Kelas XII-E (${currentCampusCity.toUpperCase()})`;
        }
    }

    function selectCampusCity(cityKey) {
        currentCampusCity = cityKey;
        const meta = campusCityMeta[cityKey] || campusCityMeta.all;

        if (campusCityTitleEl) campusCityTitleEl.textContent = meta.title;
        if (campusRadarCoordsEl) campusRadarCoordsEl.textContent = meta.coords;

        // Update Chips UI
        campusChips.forEach(chip => {
            chip.classList.toggle('is-active', chip.dataset.city === cityKey);
        });

        // Update Radar Pins UI
        radarPins.forEach(pin => {
            pin.classList.toggle('is-active', pin.dataset.city === cityKey);
        });

        playRadarPingSound();
        renderCampusStudents();
    }

    radarPins.forEach(pin => {
        pin.addEventListener('click', () => {
            const city = pin.dataset.city;
            if (city) selectCampusCity(city);
        });
    });

    campusChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const city = chip.dataset.city;
            if (city) selectCampusCity(city);
        });
    });

    if (campusSearchInput) {
        campusSearchInput.addEventListener('input', (e) => {
            currentCampusSearch = e.target.value;
            renderCampusStudents();
        });
    }

    renderCampusStudents();

    // ======================================================================
    // 14. CLIPPY DESKTOP ASSISTANT ENGINE (Kelas XII-E Interactive Agent)
    // ======================================================================
    const clippyAgent = document.getElementById('clippy-agent');
    const clippyBubble = document.getElementById('clippy-bubble');
    const clippyCharacter = document.getElementById('clippy-character');
    const clippyGreetingEl = document.getElementById('clippy-greeting');
    const clippyScheduleInfoEl = document.getElementById('clippy-schedule-info');
    const clippyQuoteEl = document.getElementById('clippy-quote');
    const clippyCloseBubbleBtn = document.getElementById('clippy-btn-close-bubble');

    const clippyActJadwal = document.getElementById('clippy-act-jadwal');
    const clippyActWinamp = document.getElementById('clippy-act-winamp');
    const clippyActCampus = document.getElementById('clippy-act-campus');
    const clippyActTips = document.getElementById('clippy-act-tips');
    const clippyActHide = document.getElementById('clippy-act-hide');
    const iconClippyToggle = document.getElementById('icon-clippy-toggle');
    const menuTriggerClippy = document.getElementById('menu-trigger-clippy');

    const clippyQuotes = [
        '“Matematika bukan sekadar angka, tapi cara berpikir rasional untuk menaklukkan masa depan!” — Iqbal Qodama (KM)',
        '“Kepala tetap dingin di depan lembar ujian, hati selalu hangat bersama kawan sekelas!” — M. Anas Afif',
        '“Tiga tahun penuh warna di kelas XII-E akan selalu abadi dalam setiap baris kode ini.” — Nathan Ferdwiansyah',
        '“Jadilah pribadi yang bermanfaat di manapun kalian melangkah. Doa saya menyertai kalian.” — Ust. Misbachul Munir',
        '“Psst... Winamp sekarang bisa memutar lagu MP3 buatanmu dan tersimpan permanen lho!”',
        '“Sudah coba PhotoBooth.exe? Bisa cetak foto polaroid angkatan 90-an langsung jadi!”',
        '“Tahukah kamu? Dari 32 siswa XII-E, 10 kawan berjuang ke Surabaya dan 6 kawan ke Bandung!”',
        '“Semangat belajar untuk UTBK dan Ujian Mandiri, sampai jumpa di puncak kesuksesan!”',
        '“Jangan lupa cek Papan Tugas di Tugas.txt agar tugas kelompok tidak terlewat!”'
    ];
    let currentClippyQuoteIdx = 0;

    const classDailySchedules = {
        0: 'Hari Ahad (Libur): Waktu istirahat, muraja\'ah, dan persiapan belajar menyambut hari Senin! ☕',
        1: 'Jadwal Hari Senin: Upacara Bendera 🇮🇩, Akidah Akhlak, Informatika, Fikih, Ilmu Pendidikan, Bahasa Arab.',
        2: 'Jadwal Hari Selasa: Matematika, Bahasa Inggris, Bahasa Indonesia, Matematika Lanjut.',
        3: 'Jadwal Hari Rabu: Qur\'an Hadis, Akidah Akhlak, Kemuhammadiyahan, Kimia.',
        4: 'Jadwal Hari Kamis: Bahasa Arab, Ilmu Falak, Qur\'an Hadis, Matematika, SKI, Bimbel Internal.',
        5: 'Jadwal Hari Jumat: Bahasa Indonesia, Pendidikan Pancasila, Biologi, Bimbel Eksternal.',
        6: 'Jadwal Hari Sabtu: Bahasa Inggris, Sejarah Indonesia, Fisika, Bimbel Eksternal.'
    };

    function updateClippyContent() {
        if (!clippyGreetingEl || !clippyScheduleInfoEl || !clippyQuoteEl) return;
        const now = new Date();
        const dayIdx = now.getDay();
        const days = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const dayName = days[dayIdx];

        clippyGreetingEl.textContent = `Hai Kawan XII-E! Salam hari ${dayName}! 👋`;
        clippyScheduleInfoEl.textContent = classDailySchedules[dayIdx] || 'Semangat belajar untuk kelas XII-E!';
        clippyQuoteEl.textContent = clippyQuotes[currentClippyQuoteIdx % clippyQuotes.length];

        if (clippyCharacter) {
            clippyCharacter.classList.remove('is-tapping');
            void clippyCharacter.offsetWidth;
            clippyCharacter.classList.add('is-tapping');
        }
    }

    function showClippy() {
        if (!clippyAgent) return;
        clippyAgent.classList.remove('is-hidden');
        if (clippyBubble) clippyBubble.style.display = 'block';
        updateClippyContent();
        playRetroClick();
    }

    function hideClippy() {
        if (!clippyAgent) return;
        clippyAgent.classList.add('is-hidden');
        playRetroClick();
    }

    if (clippyCharacter) {
        clippyCharacter.addEventListener('click', () => {
            if (clippyBubble && clippyBubble.style.display === 'none') {
                clippyBubble.style.display = 'block';
            }
            currentClippyQuoteIdx = (currentClippyQuoteIdx + 1) % clippyQuotes.length;
            updateClippyContent();
            playRetroClick();
        });
    }

    if (clippyCloseBubbleBtn) {
        clippyCloseBubbleBtn.addEventListener('click', () => {
            if (clippyBubble) clippyBubble.style.display = 'none';
        });
    }

    if (clippyActJadwal) {
        clippyActJadwal.addEventListener('click', () => launchWindow('jadwal-window'));
    }
    if (clippyActWinamp) {
        clippyActWinamp.addEventListener('click', () => launchWindow('winamp-window'));
    }
    if (clippyActCampus) {
        clippyActCampus.addEventListener('click', () => launchWindow('campus-window'));
    }
    if (clippyActTips) {
        clippyActTips.addEventListener('click', () => {
            currentClippyQuoteIdx = (currentClippyQuoteIdx + 1) % clippyQuotes.length;
            updateClippyContent();
            playRetroClick();
        });
    }
    if (clippyActHide) {
        clippyActHide.addEventListener('click', hideClippy);
    }
    if (iconClippyToggle) {
        iconClippyToggle.addEventListener('click', showClippy);
    }
    if (menuTriggerClippy) {
        menuTriggerClippy.addEventListener('click', () => {
            showClippy();
            if (startMenu) startMenu.classList.remove('is-open');
            if (startBtn) startBtn.classList.remove('is-active');
        });
    }

    // Initialize Clippy
    updateClippyContent();

    // ======================================================================
    // 15. PHOTOBOOTH.EXE ENGINE (Neoprint Studio 98 & Polaroid Maker)
    // ======================================================================
    const pbCanvas = document.getElementById('pb-canvas');
    const pbCtx = pbCanvas ? pbCanvas.getContext('2d') : null;
    const pbVideo = document.getElementById('pb-webcam-video');
    const pbInputFile = document.getElementById('pb-input-file');
    const pbBtnWebcam = document.getElementById('pb-btn-webcam');
    const pbBtnSnap = document.getElementById('pb-btn-snap');
    const pbBtnSample = document.getElementById('pb-btn-sample');
    const pbBtnClearStickers = document.getElementById('pb-btn-clear-stickers');
    const pbBtnDownload = document.getElementById('pb-btn-download');
    const pbCaptionInput = document.getElementById('pb-caption-input');
    const pbFrameBtns = document.querySelectorAll('.pb-frame-btn');
    const pbFilterBtns = document.querySelectorAll('.pb-filter-btn');
    const pbStickerBtns = document.querySelectorAll('.pb-sticker-btn');

    let pbActiveFrame = 'polaroid';
    let pbActiveFilter = 'normal';
    let pbLoadedImage = null;
    let pbWebcamStream = null;
    let pbStickers = [];
    let pbCaption = 'KDNATOES • CLASS OF 2025';

    // Sample fallback image
    const samplePhotoUrl = 'assets/personalia/user_photo.jpg';

    function initPhotoBooth() {
        if (!pbCanvas || !pbCtx) return;
        const img = new Image();
        img.onload = () => {
            pbLoadedImage = img;
            renderPhotoBoothCanvas();
        };
        img.onerror = () => {
            // Draw colorful placeholder canvas if sample photo missing
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = 400;
            tempCanvas.height = 400;
            const tCtx = tempCanvas.getContext('2d');
            tCtx.fillStyle = '#1084d0';
            tCtx.fillRect(0, 0, 400, 400);
            tCtx.fillStyle = '#ffffff';
            tCtx.font = 'bold 28px sans-serif';
            tCtx.textAlign = 'center';
            tCtx.fillText('★ KDNATOES XII-E ★', 200, 190);
            tCtx.font = '16px sans-serif';
            tCtx.fillText('Klik "Unggah Foto" untuk pasang fotomu!', 200, 230);
            pbLoadedImage = tempCanvas;
            renderPhotoBoothCanvas();
        };
        img.src = samplePhotoUrl;
    }

    function renderPhotoBoothCanvas() {
        if (!pbCanvas || !pbCtx) return;
        const W = pbCanvas.width;   // 480
        const H = pbCanvas.height;  // 580

        pbCtx.clearRect(0, 0, W, H);

        // 1. Draw Frame Background
        if (pbActiveFrame === 'polaroid') {
            // Polaroid Paper Frame
            pbCtx.fillStyle = '#fafaf7';
            pbCtx.fillRect(0, 0, W, H);
            pbCtx.lineWidth = 1;
            pbCtx.strokeStyle = '#d5d5d0';
            pbCtx.strokeRect(0, 0, W, H);

            // Inner Shadow
            pbCtx.strokeStyle = '#e0e0dc';
            pbCtx.strokeRect(20, 20, 440, 440);
        } else if (pbActiveFrame === 'win98') {
            // Windows 98 Window Chrome Frame
            pbCtx.fillStyle = '#c0c0c0';
            pbCtx.fillRect(0, 0, W, H);

            // Win98 Outset Border
            pbCtx.strokeStyle = '#ffffff';
            pbCtx.lineWidth = 3;
            pbCtx.strokeRect(1.5, 1.5, W - 3, H - 3);
            pbCtx.strokeStyle = '#000000';
            pbCtx.strokeRect(3, 3, W - 6, H - 6);

            // Win98 Blue Gradient Titlebar
            const grad = pbCtx.createLinearGradient(6, 6, W - 12, 6);
            grad.addColorStop(0, '#000080');
            grad.addColorStop(1, '#1084d0');
            pbCtx.fillStyle = grad;
            pbCtx.fillRect(6, 6, W - 12, 24);

            // Titlebar text & controls
            pbCtx.fillStyle = '#ffffff';
            pbCtx.font = 'bold 12px Tahoma, sans-serif';
            pbCtx.textAlign = 'left';
            pbCtx.fillText('Foto_Kenangan_XII-E.bmp - Paint Studio', 14, 23);

            // Close button in titlebar
            pbCtx.fillStyle = '#c0c0c0';
            pbCtx.fillRect(W - 26, 9, 16, 16);
            pbCtx.fillStyle = '#000';
            pbCtx.font = 'bold 11px sans-serif';
            pbCtx.fillText('×', W - 22, 21);
        } else if (pbActiveFrame === 'neoprint') {
            // Kawaii Purikura Pastel Pink
            pbCtx.fillStyle = '#ffeaa7';
            pbCtx.fillRect(0, 0, W, H);
            pbCtx.fillStyle = '#fd79a8';
            pbCtx.fillRect(10, 10, W - 20, H - 20);

            // Dotted border
            pbCtx.strokeStyle = '#ffffff';
            pbCtx.lineWidth = 3;
            pbCtx.setLineDash([6, 6]);
            pbCtx.strokeRect(16, 16, W - 32, H - 32);
            pbCtx.setLineDash([]);

            // Cute Top Banner
            pbCtx.fillStyle = '#ffffff';
            pbCtx.font = '900 14px "Comic Sans MS", cursive, sans-serif';
            pbCtx.textAlign = 'center';
            pbCtx.fillText('🌸 PURIKURA 1998 • KDNATOES FOREVER 🌸', W / 2, 38);
        } else {
            // Cyber Synthwave 90s Frame
            pbCtx.fillStyle = '#0a0a14';
            pbCtx.fillRect(0, 0, W, H);

            // Neon Grid Accents
            pbCtx.strokeStyle = '#00ffcc';
            pbCtx.lineWidth = 2;
            pbCtx.strokeRect(12, 12, W - 24, H - 24);
            pbCtx.strokeStyle = '#ff007f';
            pbCtx.strokeRect(16, 16, W - 32, H - 32);

            // Tech headers
            pbCtx.fillStyle = '#00ffcc';
            pbCtx.font = 'bold 10px monospace';
            pbCtx.textAlign = 'left';
            pbCtx.fillText('REC ● 00:24:98 [NIGHT VISION]', 24, 34);
            pbCtx.textAlign = 'right';
            pbCtx.fillText('BAT: 100% ⚡', W - 24, 34);
        }

        // 2. Compute Inner Photo Box coordinates
        let px = 24, py = 24, pw = 432, ph = 432;
        if (pbActiveFrame === 'win98') {
            px = 16; py = 36; pw = 448; ph = 460;
        } else if (pbActiveFrame === 'neoprint') {
            px = 28; py = 50; pw = 424; ph = 430;
        } else if (pbActiveFrame === 'cyber') {
            px = 24; py = 44; pw = 432; ph = 440;
        }

        // Draw Inset Shadow Box for photo
        pbCtx.fillStyle = '#000000';
        pbCtx.fillRect(px, py, pw, ph);

        // 3. Draw Photo Image (Aspect Fill)
        if (pbLoadedImage) {
            pbCtx.save();
            pbCtx.beginPath();
            pbCtx.rect(px, py, pw, ph);
            pbCtx.clip();

            const imgW = pbLoadedImage.naturalWidth || pbLoadedImage.videoWidth || pbLoadedImage.width;
            const imgH = pbLoadedImage.naturalHeight || pbLoadedImage.videoHeight || pbLoadedImage.height;

            const scale = Math.max(pw / imgW, ph / imgH);
            const drawW = imgW * scale;
            const drawH = imgH * scale;
            const dx = px + (pw - drawW) / 2;
            const dy = py + (ph - drawH) / 2;

            pbCtx.drawImage(pbLoadedImage, dx, dy, drawW, drawH);

            // 4. Apply Filters
            if (pbActiveFilter === 'sepia') {
                pbCtx.fillStyle = 'rgba(112, 66, 20, 0.38)';
                pbCtx.fillRect(px, py, pw, ph);
                pbCtx.fillStyle = 'rgba(255, 230, 160, 0.15)';
                pbCtx.fillRect(px, py, pw, ph);
            } else if (pbActiveFilter === 'dither') {
                const imgData = pbCtx.getImageData(px, py, pw, ph);
                const d = imgData.data;
                for (let i = 0; i < d.length; i += 4) {
                    const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
                    const bw = gray > 128 ? 245 : 20;
                    d[i] = bw;
                    d[i + 1] = bw;
                    d[i + 2] = bw;
                }
                pbCtx.putImageData(imgData, px, py);
            } else if (pbActiveFilter === 'cyber') {
                pbCtx.fillStyle = 'rgba(0, 255, 204, 0.15)';
                pbCtx.fillRect(px, py, pw, ph);
                // Scanlines
                pbCtx.fillStyle = 'rgba(0, 0, 0, 0.25)';
                for (let y = py; y < py + ph; y += 4) {
                    pbCtx.fillRect(px, y, pw, 2);
                }
            }

            pbCtx.restore();
        }

        // 5. Draw Stickers
        pbStickers.forEach(stk => {
            pbCtx.save();
            pbCtx.translate(stk.x, stk.y);
            pbCtx.rotate((stk.rot || 0) * Math.PI / 180);

            // Badge Background
            pbCtx.fillStyle = stk.bg || '#f1c40f';
            pbCtx.strokeStyle = '#000000';
            pbCtx.lineWidth = 2;

            const textW = pbCtx.measureText(stk.text).width + 16;
            pbCtx.fillRect(-textW / 2, -14, textW, 28);
            pbCtx.strokeRect(-textW / 2, -14, textW, 28);

            // Badge Text
            pbCtx.fillStyle = stk.color || '#000000';
            pbCtx.font = '900 13px Tahoma, sans-serif';
            pbCtx.textAlign = 'center';
            pbCtx.textBaseline = 'middle';
            pbCtx.fillText(stk.text, 0, 0);

            pbCtx.restore();
        });

        // 6. Draw Handwritten / Retro Caption at Bottom
        const captionText = pbCaption.trim();
        if (captionText) {
            if (pbActiveFrame === 'polaroid') {
                pbCtx.fillStyle = '#1e3799';
                pbCtx.font = '900 17px "Courier New", Courier, monospace';
                pbCtx.textAlign = 'center';
                pbCtx.fillText(captionText, W / 2, 515);

                pbCtx.fillStyle = '#6a89cc';
                pbCtx.font = 'italic 11px sans-serif';
                pbCtx.fillText('★ KDNATOES MEMORIES • SMAN/MAN 2025 ★', W / 2, 542);
            } else if (pbActiveFrame === 'win98') {
                pbCtx.fillStyle = '#333';
                pbCtx.font = '11px Tahoma, sans-serif';
                pbCtx.textAlign = 'left';
                pbCtx.fillText(`Label: ${captionText}`, 20, 525);
                pbCtx.fillText('Status: Gambar Terverifikasi Asli (BMP 24-bit)', 20, 545);
            } else if (pbActiveFrame === 'neoprint') {
                pbCtx.fillStyle = '#ffffff';
                pbCtx.font = '900 15px "Comic Sans MS", cursive, sans-serif';
                pbCtx.textAlign = 'center';
                pbCtx.fillText(`✨ ${captionText} ✨`, W / 2, 530);
            } else {
                pbCtx.fillStyle = '#00ffcc';
                pbCtx.font = 'bold 13px monospace';
                pbCtx.textAlign = 'center';
                pbCtx.fillText(`// SYSTEM_ID: ${captionText}`, W / 2, 530);
            }
        }
    }

    // Photo Input: File Upload
    if (pbInputFile) {
        pbInputFile.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    pbLoadedImage = img;
                    if (pbWebcamStream) {
                        pbWebcamStream.getTracks().forEach(t => t.stop());
                        pbWebcamStream = null;
                        if (pbBtnSnap) pbBtnSnap.style.display = 'none';
                    }
                    renderPhotoBoothCanvas();
                    playArcadeFanfare();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // Photo Input: Webcam
    if (pbBtnWebcam) {
        pbBtnWebcam.addEventListener('click', async () => {
            try {
                if (pbWebcamStream) {
                    pbWebcamStream.getTracks().forEach(t => t.stop());
                    pbWebcamStream = null;
                    if (pbBtnSnap) pbBtnSnap.style.display = 'none';
                    pbBtnWebcam.textContent = '📷 Buka Kamera';
                    return;
                }
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    alert('Browser Anda tidak mendukung akses kamera langsung pada protokol ini. Silakan gunakan tombol "📁 Unggah Foto..." untuk memilih foto dari galeri komputer/HP.');
                    return;
                }

                let stream = null;
                try {
                    // Try with ideal flexible constraints
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
                    });
                } catch (firstErr) {
                    try {
                        // Fallback to basic video constraint without rigid dimensions
                        stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    } catch (secErr) {
                        throw secErr;
                    }
                }

                pbWebcamStream = stream;
                if (pbVideo) {
                    pbVideo.srcObject = stream;
                    pbVideo.play().catch(e => console.warn(e));
                }
                if (pbBtnSnap) pbBtnSnap.style.display = 'inline-block';
                pbBtnWebcam.textContent = '⏹️ Matikan Kamera';

                // Real-time canvas stream loop
                const updateWebcamFrame = () => {
                    if (pbWebcamStream && pbVideo) {
                        pbLoadedImage = pbVideo;
                        renderPhotoBoothCanvas();
                        requestAnimationFrame(updateWebcamFrame);
                    }
                };
                requestAnimationFrame(updateWebcamFrame);
            } catch (err) {
                console.warn('Webcam error:', err);
                let msg = 'Tidak dapat menyalakan kamera:\n\n';
                if (err.name === 'NotReadableError' || (err.message && err.message.includes('video source'))) {
                    msg += '⚠️ Kamera sedang digunakan oleh aplikasi lain di laptop Anda (seperti Zoom, Google Meet, Discord, OBS, aplikasi Kamera Windows, atau tab browser lain).\n\nSilakan tutup aplikasi tersebut, atau gunakan tombol "📁 Unggah Foto..." untuk memilih foto langsung dari file komputer/HP!';
                } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                    msg += '🔒 Izin kamera belum diberikan atau diblokir oleh browser.\n\nKlik ikon gembok / perisai di sebelah kiri alamat URL browser Anda dan pilih "Izinkan Kamera" (Allow Camera).';
                } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                    msg += '📷 Tidak ditemukan perangkat webcam pada komputer/laptop ini.\n\nGunakan tombol "📁 Unggah Foto..." untuk memilih foto dari galeri!';
                } else {
                    msg += (err.message || err.name) + '\n\n💡 Tips: Anda bisa langsung klik tombol "📁 Unggah Foto..." untuk memakai foto apa saja dari komputer/HP Anda!';
                }
                alert(msg);
            }
        });
    }

    // Photo Input: Snap Current Video Frame
    if (pbBtnSnap) {
        pbBtnSnap.addEventListener('click', () => {
            if (!pbVideo) return;
            // Freeze video frame to offscreen canvas
            const freeze = document.createElement('canvas');
            freeze.width = pbVideo.videoWidth || 640;
            freeze.height = pbVideo.videoHeight || 480;
            const fCtx = freeze.getContext('2d');
            fCtx.drawImage(pbVideo, 0, 0, freeze.width, freeze.height);

            pbLoadedImage = freeze;
            if (pbWebcamStream) {
                pbWebcamStream.getTracks().forEach(t => t.stop());
                pbWebcamStream = null;
            }
            pbBtnSnap.style.display = 'none';
            if (pbBtnWebcam) pbBtnWebcam.textContent = '📷 Buka Kamera';

            renderPhotoBoothCanvas();
            playArcadeFanfare();
        });
    }

    // Photo Input: Sample Image
    if (pbBtnSample) {
        pbBtnSample.addEventListener('click', () => {
            const img = new Image();
            img.onload = () => {
                pbLoadedImage = img;
                renderPhotoBoothCanvas();
                playRetroClick();
            };
            img.src = 'assets/personalia/iqbal.jpg';
        });
    }

    // Frame Selection Buttons
    pbFrameBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            pbFrameBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            pbActiveFrame = btn.dataset.frame || 'polaroid';
            renderPhotoBoothCanvas();
            playRetroClick();
        });
    });

    // Filter Selection Buttons
    pbFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            pbFilterBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            pbActiveFilter = btn.dataset.filter || 'normal';
            renderPhotoBoothCanvas();
            playRetroClick();
        });
    });

    // Sticker Stamp Palette
    const stickerTemplates = {
        lulus: { text: '🎓 LULUS 2025', bg: '#2ecc71', color: '#fff' },
        kdnatoes: { text: '★ KDNATOES ★', bg: '#f1c40f', color: '#000' },
        besties: { text: '💖 BESTIES FOREVER', bg: '#fd79a8', color: '#fff' },
        juara: { text: '⚡ XII-E JUARA', bg: '#e74c3c', color: '#fff' },
        sukses: { text: '🚀 SUKSES PTN', bg: '#0984e3', color: '#fff' },
        cool: { text: '😎 SUPER COOL', bg: '#2d3436', color: '#00ffcc' }
    };

    pbStickerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const stkKey = btn.dataset.sticker;
            const tpl = stickerTemplates[stkKey];
            if (!tpl) return;

            // Compute smart random coordinates within the photo bounds
            const randX = Math.floor(Math.random() * 260) + 110;
            const randY = Math.floor(Math.random() * 260) + 90;
            const randRot = Math.floor(Math.random() * 24) - 12;

            pbStickers.push({
                text: tpl.text,
                bg: tpl.bg,
                color: tpl.color,
                x: randX,
                y: randY,
                rot: randRot
            });

            renderPhotoBoothCanvas();
            playRetroClick();
        });
    });

    if (pbBtnClearStickers) {
        pbBtnClearStickers.addEventListener('click', () => {
            pbStickers = [];
            renderPhotoBoothCanvas();
            playRetroClick();
        });
    }

    if (pbCaptionInput) {
        pbCaptionInput.addEventListener('input', (e) => {
            pbCaption = e.target.value;
            renderPhotoBoothCanvas();
        });
    }

    // Download Polaroid PNG
    if (pbBtnDownload) {
        pbBtnDownload.addEventListener('click', () => {
            if (!pbCanvas) return;
            renderPhotoBoothCanvas();

            const link = document.createElement('a');
            link.download = `Neoprint_XII-E_Polaroid_${Date.now()}.png`;
            link.href = pbCanvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            playArcadeFanfare();
        });
    }

    initPhotoBooth();

    // ======================================================================
    // 14. MS-DOS Prompt CLI Engine (C:\KDNATOES)
    // ======================================================================
    function initDosPrompt() {
        const dosInput = document.getElementById('dos-cli-input');
        const dosHistory = document.getElementById('dos-history');
        const dosScreen = document.getElementById('dos-screen');
        const dosTerminalContainer = document.getElementById('dos-terminal-container');
        const dosMatrixCanvas = document.getElementById('dos-matrix-canvas');
        const dosBtnHelp = document.getElementById('dos-btn-help');
        const dosBtnMatrix = document.getElementById('dos-btn-matrix');
        const dosBtnColor = document.getElementById('dos-btn-color');
        const dosBtnCls = document.getElementById('dos-btn-cls');

        if (!dosInput || !dosHistory) return;

        let cmdHistory = [];
        let historyIdx = -1;
        let isMatrixActive = false;
        let matrixAnimId = null;
        let currentColorIdx = 0;
        const colorPalette = [
            { name: '0A Hijau Phosphor', color: '#00ff66' },
            { name: '0C Merah Retro', color: '#ff4d4d' },
            { name: '0B Cyan Biru', color: '#00e5ff' },
            { name: '0E Kuning Amber', color: '#ffea00' },
            { name: '0F Putih Klasik', color: '#ffffff' }
        ];

        function appendOutput(html) {
            const row = document.createElement('div');
            row.className = 'dos-history-entry';
            row.innerHTML = html;
            dosHistory.appendChild(row);
            if (dosTerminalContainer) {
                dosTerminalContainer.scrollTop = dosTerminalContainer.scrollHeight;
            }
        }

        function toggleMatrix() {
            if (!dosMatrixCanvas) return;
            isMatrixActive = !isMatrixActive;
            if (isMatrixActive) {
                dosMatrixCanvas.style.display = 'block';
                startMatrixRain();
            } else {
                dosMatrixCanvas.style.display = 'none';
                if (matrixAnimId) {
                    cancelAnimationFrame(matrixAnimId);
                    matrixAnimId = null;
                }
            }
        }

        function startMatrixRain() {
            const ctx = dosMatrixCanvas.getContext('2d');
            dosMatrixCanvas.width = dosTerminalContainer.clientWidth;
            dosMatrixCanvas.height = dosTerminalContainer.clientHeight;
            const chars = '01KDNATOES123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';
            const fontSize = 14;
            const columns = Math.floor(dosMatrixCanvas.width / fontSize);
            const drops = Array(columns).fill(1);

            function draw() {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
                ctx.fillRect(0, 0, dosMatrixCanvas.width, dosMatrixCanvas.height);
                ctx.fillStyle = '#00ff66';
                ctx.font = `${fontSize}px monospace`;

                for (let i = 0; i < drops.length; i++) {
                    const text = chars.charAt(Math.floor(Math.random() * chars.length));
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                    if (drops[i] * fontSize > dosMatrixCanvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
                if (isMatrixActive) {
                    matrixAnimId = requestAnimationFrame(draw);
                }
            }
            draw();
        }

        if (dosMatrixCanvas) {
            dosMatrixCanvas.addEventListener('click', toggleMatrix);
        }

        function handleCommand(rawCmd) {
            const trimmed = rawCmd.trim();
            if (!trimmed) {
                appendOutput('<span class="dos-prompt-label">C:\\KDNATOES&gt;</span>');
                return;
            }

            cmdHistory.push(trimmed);
            historyIdx = cmdHistory.length;

            appendOutput(`<span class="dos-prompt-label">C:\\KDNATOES&gt;</span> <span class="dos-history-cmd">${trimmed}</span>`);

            const parts = trimmed.split(/\s+/);
            const cmd = parts[0].toLowerCase();
            const arg = parts.slice(1).join(' ');

            switch (cmd) {
                case 'help':
                    appendOutput(`
<pre style="margin: 0; font-family: inherit;">
Daftar Perintah MS-DOS XII-E:
  HELP       - Menampilkan panduan perintah ini
  DIR        - Melihat daftar berkas &amp; modul kelas
  MATRIX     - Mengaktifkan / mematikan hujan kode Matrix
  WHOAMI     - Menampilkan identitas pengguna &amp; jaringan kelas
  SISWA      - Menampilkan daftar 32 siswa kelas XII-E (atau: SISWA &lt;nama&gt;)
  JADWAL     - Ringkasan mata pelajaran hari ini
  COLOR &lt;xy&gt; - Mengganti warna font (0A=Hijau, 0C=Merah, 0B=Cyan, 0F=Putih)
  CLS        - Membersihkan layar konsol
  VER        - Informasi versi sistem operasi
  DATE       - Tanggal sistem saat ini
  TIME       - Jam sistem saat ini
  ECHO &lt;txt&gt; - Menampilkan teks kembali di layar
  EXIT       - Menutup jendela MS-DOS Prompt
</pre>`);
                    break;

                case 'dir':
                    appendOutput(`
<pre style="margin: 0; font-family: inherit;">
 Volume in drive C is KDNATOES_OS
 Volume Serial Number is 12E0-1998
 Directory of C:\\KDNATOES

.              &lt;DIR&gt;        16-09-25  10:00a .
..             &lt;DIR&gt;        16-09-25  10:00a ..
JADWAL   EXE       45,056   16-09-25   8:30a Jadwal.exe
TUGAS    TXT        8,192   16-09-25   9:15a Tugas.txt
STRUKTUR SYS       32,768   16-09-25   7:45a Struktur.sys
WINAMP   EXE      524,288   16-09-25   9:00a Winamp.exe
GALERI   DAT    1,048,576   16-09-25  11:20a Galeri.dat
ALUMNI   DOC       65,536   16-09-25  10:00a BukuTahunan.doc
UJIAN    EXE       28,672   16-09-25   8:00a Ujian.exe
SECRET   BAT        1,024   16-09-25  12:00p Secret.bat
       8 File(s)      1,754,072 bytes
       2 Dir(s)     482,852,864 bytes free
</pre>`);
                    break;

                case 'bsod':
                    triggerBsod();
                    return 'Triggering Fatal Exception in VXD KDNATOES(01)...';
                case 'matrix':
                    toggleMatrix();
                    if (isMatrixActive) {
                        appendOutput('Mode Matrix AKTIF. Klik layar untuk keluar.');
                    } else {
                        appendOutput('Mode Matrix DIMATIKAN.');
                    }
                    break;

                case 'whoami':
                    appendOutput('USER: Siswa-PC (Administrator) | IP: 192.168.12.5 | DOMAIN: KDNATOES.LOCAL | KELAS: XII-E');
                    break;

                case 'siswa':
                    if (typeof arcadeCharacters !== 'undefined' && Array.isArray(arcadeCharacters)) {
                        if (arg) {
                            const found = arcadeCharacters.filter(c => c.name.toLowerCase().includes(arg.toLowerCase()));
                            if (found.length > 0) {
                                found.forEach(s => {
                                    appendOutput(`[${s.id}] ${s.name} - "${s.quote || '-'}" (Role: ${s.role || 'Siswa'})`);
                                });
                            } else {
                                appendOutput(`Siswa dengan nama '${arg}' tidak ditemukan.`);
                            }
                        } else {
                            let rosterText = 'DAFTAR SISWA KELAS XII-E (TOTAL 32 SISWA):\n';
                            arcadeCharacters.forEach((s, idx) => {
                                rosterText += `${String(idx + 1).padStart(2, ' ')}. ${s.name.padEnd(16, ' ')} `;
                                if ((idx + 1) % 2 === 0) rosterText += '\n';
                            });
                            appendOutput(`<pre style="margin: 0; font-family: inherit;">${rosterText}</pre>`);
                        }
                    } else {
                        appendOutput('Memuat data 32 siswa kelas XII-E...');
                    }
                    break;

                case 'jadwal':
                    const dayIdx = new Date().getDay();
                    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                    const dayName = dayNames[dayIdx];
                    appendOutput(`JADWAL PELAJARAN HARI INI (${dayName.toUpperCase()}):`);
                    if (typeof dayScheduleText !== 'undefined' && dayScheduleText[dayIdx]) {
                        appendOutput(dayScheduleText[dayIdx]);
                    } else {
                        appendOutput(dayIdx === 0 ? 'Hari Minggu libur! Manfaatkan untuk istirahat.' : 'Silakan buka aplikasi Jadwal.exe untuk rincian lengkap.');
                    }
                    break;

                case 'color':
                    if (!arg) {
                        currentColorIdx = (currentColorIdx + 1) % colorPalette.length;
                        const col = colorPalette[currentColorIdx];
                        dosScreen.style.color = col.color;
                        appendOutput(`Warna font diubah ke: ${col.name}`);
                    } else {
                        const val = arg.toLowerCase();
                        if (val === '0a') { dosScreen.style.color = '#00ff66'; appendOutput('Warna: Hijau Phosphor'); }
                        else if (val === '0c') { dosScreen.style.color = '#ff4d4d'; appendOutput('Warna: Merah Retro'); }
                        else if (val === '0b') { dosScreen.style.color = '#00e5ff'; appendOutput('Warna: Cyan Biru'); }
                        else if (val === '0e') { dosScreen.style.color = '#ffea00'; appendOutput('Warna: Kuning Amber'); }
                        else if (val === '0f') { dosScreen.style.color = '#ffffff'; appendOutput('Warna: Putih Klasik'); }
                        else { appendOutput('Kode warna tidak valid. Gunakan 0A, 0C, 0B, 0E, atau 0F.'); }
                    }
                    break;

                case 'cls':
                    dosHistory.innerHTML = '';
                    break;

                case 'ver':
                    appendOutput('Microsoft Windows 98 Second Edition [Version 4.10.2222 A - XII-E KDNATOES]');
                    break;

                case 'date':
                    appendOutput(`Current date is: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);
                    break;

                case 'time':
                    appendOutput(`Current time is: ${new Date().toLocaleTimeString('id-ID')}`);
                    break;

                case 'echo':
                    appendOutput(arg || '');
                    break;

                case 'exit':
                    const dosWin = document.getElementById('dos-window');
                    if (dosWin) {
                        dosWin.style.display = 'none';
                        const tab = document.querySelector('.taskbar-tab[data-target="dos-window"]');
                        if (tab) {
                            tab.classList.remove('is-active');
                            tab.style.display = 'none';
                        }
                        focusTopRemainingWindow();
                    }
                    break;

                default:
                    appendOutput(`Bad command or file name: '${trimmed}'. Ketik 'help' untuk panduan.`);
                    playBeep(240, 'sawtooth', 0.1);
                    break;
            }
        }

        dosInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = dosInput.value;
                dosInput.value = '';
                handleCommand(val);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (cmdHistory.length > 0 && historyIdx > 0) {
                    historyIdx--;
                    dosInput.value = cmdHistory[historyIdx] || '';
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIdx < cmdHistory.length - 1) {
                    historyIdx++;
                    dosInput.value = cmdHistory[historyIdx] || '';
                } else {
                    historyIdx = cmdHistory.length;
                    dosInput.value = '';
                }
            }
        });

        if (dosBtnHelp) dosBtnHelp.addEventListener('click', () => handleCommand('help'));
        if (dosBtnMatrix) dosBtnMatrix.addEventListener('click', () => handleCommand('matrix'));
        if (dosBtnColor) dosBtnColor.addEventListener('click', () => handleCommand('color'));
        if (dosBtnCls) dosBtnCls.addEventListener('click', () => handleCommand('cls'));

        if (dosTerminalContainer) {
            dosTerminalContainer.addEventListener('click', (e) => {
                if (e.target !== dosMatrixCanvas) {
                    dosInput.focus();
                }
            });
        }
    }

    // ======================================================================
    // 15. Internet Explorer 5.0 & Retro Web 1.0 Homepage Engine
    // ======================================================================
    function initRetroBrowser() {
        const ieContentArea = document.getElementById('ie-content-area');
        const ieQuickLinkBtns = document.querySelectorAll('.ie-quick-link-btn');
        const ieBtnGo = document.getElementById('ie-btn-go');
        const ieBtnHome = document.getElementById('ie-btn-home');
        const ieBtnRefresh = document.getElementById('ie-btn-refresh');
        const ieStatusText = document.getElementById('ie-status-text');
        const ieSpinner = document.getElementById('ie-spinner');
        const ieOdometer = document.getElementById('ie-visitor-odometer');

        if (!ieContentArea) return;

        let activeTab = 'home';

        // Increment visitor counter in localStorage
        try {
            let visitors = parseInt(localStorage.getItem('kdnatoes_visitors') || '4289', 10);
            visitors += 1;
            localStorage.setItem('kdnatoes_visitors', visitors.toString());
            if (ieOdometer) {
                ieOdometer.textContent = String(visitors).padStart(6, '0');
            }
        } catch (e) { }

        const pages = {
            home: `
                <div class="web1-card">
                    <h3>🏛️ Sambutan Hangat Keluarga Besar XII-E (KDNATOES)</h3>
                    <p>Selamat datang di situs resmi kelas XII-E Angkatan 2025! Website ini dibangun sebagai wadah silaturahmi, arsip kenangan, dan pusat informasi terpadu seluruh siswa.</p>
                    <p><strong>Motto Kelas:</strong> <em>"Bersatu dalam tawa, berjuang menggapai cita, selamanya KDNATOES!"</em></p>
                </div>
                <div class="web1-card" style="background: #fff8e7;">
                    <h3>📊 Sekilas Statistik Kelas</h3>
                    <ul>
                        <li><strong>Jumlah Siswa:</strong> 36 Calon Orang Sukses &amp; Pemimpin Masa Depan</li>
                        <li><strong>Wali Kelas:</strong> Ibu Siti Aminah, M.Pd. (Paling sabar sedunia!)</li>
                        <li><strong>Ketua Kelas:</strong> Rian Pratama &amp; Wakil: Siti Rahma</li>
                        <li><strong>Target Kelulusan:</strong> 100% Lulus &amp; Tembus Kampus Impian PTN 2025</li>
                    </ul>
                </div>
                <div class="web1-card">
                    <h3>📢 Pengumuman Terkini</h3>
                    <p>📌 Pengambilan jas buku tahunan dijadwalkan hari Jumat setelah salat Jumat di ruang multimedia.</p>
                    <p>📌 Jangan lupa kumpulkan tugas mandiri dan cek simulasi kuis di <code>Ujian.exe</code>!</p>
                </div>`,

            wiki: `
                <div class="web1-card">
                    <h3>📚 Encyclopedia KDNATOES: Mitos &amp; Fakta Kelas XII-E</h3>
                    <p>Berikut adalah catatan mitos dan fakta melegenda yang hanya dimengerti oleh penghuni kelas XII-E:</p>
                </div>
                <div class="web1-card">
                    <h3>👻 1. Mitos Bangku Baris 3 Pojok Kiri</h3>
                    <p>Konon siapapun yang duduk di bangku ini akan otomatis terserang rasa kantuk mistis saat jam pelajaran Matematika atau Sejarah, tetapi anehnya selalu luput dari tunjuk guru!</p>
                </div>
                <div class="web1-card">
                    <h3>🚁 2. Legenda Kipas Angin Sayap Tiga</h3>
                    <p>Kipas angin gantung nomor 2 suaranya menyerupai helikopter tempur Apache yang siap lepas landas, tapi hembusan anginnya tetap lembut sepoi-sepoi.</p>
                </div>
                <div class="web1-card">
                    <h3>👑 3. Filosofi Nama "KDNATOES"</h3>
                    <p>Akronim kebersamaan yang diciptakan saat masa LDKS. Menyimbolkan kekompakan 36 kepala berbeda watak yang disatukan menjadi satu keluarga besar.</p>
                </div>`,

            quotes: `
                <div class="web1-card">
                    <h3>💬 Galeri Kutipan &amp; Quote Ikonik Kelas</h3>
                    <p>Kumpulan kata mutiara dari guru tercinta dan teman sekelas yang tak terlupakan:</p>
                </div>
                <div class="web1-card" style="border-left: 4px solid #000080;">
                    <p><em>"Ujian nasional atau SNBT itu cuma jembatan kecil anak-anak. Yang terpenting adalah kejujuran dan daya juang kalian!"</em></p>
                    <strong>— Ibu Siti (Wali Kelas)</strong>
                </div>
                <div class="web1-card" style="border-left: 4px solid #e74c3c;">
                    <p><em>"Siapa piket hari ini tolong spidolnya diisi ulang, jangan tunggu gurunya datang baru kalang kabut!"</em></p>
                    <strong>— Rian (Ketua Kelas)</strong>
                </div>
                <div class="web1-card" style="border-left: 4px solid #27ae60;">
                    <p><em>"Pinjam tipe-x dong sekejap, nanti pasti kubalikin... (kata-kata paling sering berujung lenyap)."</em></p>
                    <strong>— Suara Anonim Meja Belakang</strong>
                </div>
                <div class="web1-card" style="border-left: 4px solid #f39c12;">
                    <p><em>"Bel istirahat adalah musik terindah sepanjang 3 tahun masa SMA."</em></p>
                    <strong>— Dimas (Pecinta Kantin)</strong>
                </div>`,

            guestbook: `
                <div class="web1-card">
                    <h3>✍️ Buku Tamu Web 1.0 (Guestbook Online)</h3>
                    <p>Tinggalkan jejak, pesan semangat, atau sapaan nostalgia untuk teman-teman XII-E:</p>
                    <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 8px;">
                        <input type="text" id="ie-gb-name" class="win-inset" placeholder="Nama Anda / Samaran..." style="padding: 4px; font-size: 12px;" />
                        <textarea id="ie-gb-msg" class="win-inset" rows="3" placeholder="Tuliskan pesan / kenangan Anda..." style="padding: 4px; font-size: 12px; resize: vertical;"></textarea>
                        <button class="win-btn" id="ie-gb-submit" style="align-self: flex-start; padding: 4px 12px; font-weight: bold; background: #2980b9; color: #fff;">
                            📝 Kirim Buku Tamu
                        </button>
                    </div>
                </div>
                <div class="web1-card" id="ie-gb-list">
                    <h3>📬 Pesan Masuk Terbaru</h3>
                    <div id="ie-gb-entries">
                        <!-- Populated dynamically -->
                    </div>
                </div>`
        };

        function renderGuestbookEntries() {
            const container = document.getElementById('ie-gb-entries');
            if (!container) return;
            let entries = [];
            try {
                entries = JSON.parse(localStorage.getItem('kdnatoes_guestbook') || '[]');
            } catch (e) { }

            if (entries.length === 0) {
                entries = [
                    { name: 'Nathan', msg: 'Website kelas ini keren banget vibes 90-annya! Jaya terus XII-E!', time: '16/09/2025 10:15' },
                    { name: 'Sarah', msg: 'Sukses PTN buat kita semua ya guys! Jangan putus kontak setelah wisuda!', time: '15/09/2025 14:20' }
                ];
            }

            container.innerHTML = entries.map(e => `
                <div style="border-bottom: 1px dashed #ccc; padding: 6px 0; font-size: 12px;">
                    <strong>${e.name}</strong> <span style="color: #888; font-size: 10px;">(${e.time})</span><br>
                    <span>${e.msg}</span>
                </div>
            `).join('');
        }

        function setTab(tab) {
            activeTab = tab;
            ieQuickLinkBtns.forEach(btn => {
                if (btn.dataset.tab === tab) {
                    btn.classList.add('is-active');
                } else {
                    btn.classList.remove('is-active');
                }
            });

            if (ieSpinner) {
                ieSpinner.style.transform = 'rotate(180deg)';
                setTimeout(() => { if (ieSpinner) ieSpinner.style.transform = ''; }, 200);
            }

            if (ieStatusText) ieStatusText.textContent = `Loading https://kdnatoes.sch.id/${tab}...`;
            setTimeout(() => {
                ieContentArea.innerHTML = pages[tab] || pages['home'];
                if (ieStatusText) ieStatusText.textContent = 'Done';
                if (tab === 'guestbook') {
                    renderGuestbookEntries();
                    const btnSub = document.getElementById('ie-gb-submit');
                    if (btnSub) {
                        btnSub.addEventListener('click', () => {
                            const nameIn = document.getElementById('ie-gb-name');
                            const msgIn = document.getElementById('ie-gb-msg');
                            if (!nameIn || !msgIn) return;
                            const name = nameIn.value.trim() || 'Alumni XII-E';
                            const msg = msgIn.value.trim();
                            if (!msg) return;

                            let entries = [];
                            try {
                                entries = JSON.parse(localStorage.getItem('kdnatoes_guestbook') || '[]');
                            } catch (e) { }
                            entries.unshift({
                                name,
                                msg,
                                time: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
                            });
                            try {
                                localStorage.setItem('kdnatoes_guestbook', JSON.stringify(entries));
                            } catch (e) { }
                            msgIn.value = '';
                            renderGuestbookEntries();
                            playArcadeFanfare();
                        });
                    }
                }
            }, 120);
        }

        ieQuickLinkBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                setTab(btn.dataset.tab);
                playRetroClick();
            });
        });

        if (ieBtnGo) {
            ieBtnGo.addEventListener('click', () => {
                setTab(activeTab);
                playRetroClick();
            });
        }
        if (ieBtnHome) {
            ieBtnHome.addEventListener('click', () => {
                setTab('home');
                playRetroClick();
            });
        }
        if (ieBtnRefresh) {
            ieBtnRefresh.addEventListener('click', () => {
                setTab(activeTab);
                playRetroClick();
            });
        }

        setTab('home');
    }

    // ======================================================================
    // 16. Solitaire Klondike Game Engine & Bouncing Card Victory Animation
    // ======================================================================
    function initSolitaireGame() {
        const solBoard = document.getElementById('solitaire-board');
        const solStock = document.getElementById('sol-stock');
        const solWaste = document.getElementById('sol-waste');
        const solScoreEl = document.getElementById('sol-status-score');
        const solTimeEl = document.getElementById('sol-status-time');
        const solBtnNew = document.getElementById('sol-btn-new-game');
        const solBtnRestart = document.getElementById('sol-btn-restart');
        const solBtnTestWin = document.getElementById('sol-btn-test-win');
        const solCascadeCanvas = document.getElementById('solitaire-cascade-canvas');

        if (!solBoard) return;

        const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
        const SUIT_SYMBOLS = { hearts: '♥️', diamonds: '♦️', clubs: '♣️', spades: '♠️' };
        const SUIT_COLORS = { hearts: 'red', diamonds: 'red', clubs: 'black', spades: 'black' };
        const RANK_NAMES = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' };

        let deck = [];
        let stock = [];
        let waste = [];
        let foundations = { hearts: [], diamonds: [], clubs: [], spades: [] };
        let tableau = [[], [], [], [], [], [], []];
        let score = 0;
        let moves = 0;
        let seconds = 0;
        let timer = null;
        let isCascadeActive = false;

        function createDeck() {
            const newDeck = [];
            SUITS.forEach(suit => {
                for (let rank = 1; rank <= 13; rank++) {
                    newDeck.push({
                        suit,
                        rank,
                        color: SUIT_COLORS[suit],
                        symbol: SUIT_SYMBOLS[suit],
                        name: RANK_NAMES[rank] || rank.toString(),
                        faceUp: false,
                        id: `${suit}-${rank}`
                    });
                }
            });
            return newDeck;
        }

        function shuffle(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }

        function startTimer() {
            if (timer) clearInterval(timer);
            seconds = 0;
            timer = setInterval(() => {
                seconds++;
                const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
                const secs = String(seconds % 60).padStart(2, '0');
                if (solTimeEl) solTimeEl.textContent = `Waktu: ${mins}:${secs}`;
            }, 1000);
        }

        function updateStatus() {
            if (solScoreEl) solScoreEl.textContent = `Score: ${score} | Langkah: ${moves}`;
        }

        function renderBoard() {
            if (solWaste) {
                solWaste.innerHTML = '';
                if (waste.length > 0) {
                    const topCard = waste[waste.length - 1];
                    const el = createCardElement(topCard);
                    el.addEventListener('click', () => handleWasteCardClick(topCard));
                    solWaste.appendChild(el);
                }
            }

            SUITS.forEach(suit => {
                const fSlot = document.getElementById(`sol-f-${suit}`);
                if (fSlot) {
                    fSlot.innerHTML = '';
                    const fPile = foundations[suit];
                    if (fPile.length > 0) {
                        const topCard = fPile[fPile.length - 1];
                        fSlot.appendChild(createCardElement(topCard));
                    } else {
                        fSlot.textContent = SUIT_SYMBOLS[suit];
                    }
                }
            });

            for (let col = 0; col < 7; col++) {
                const colEl = document.getElementById(`sol-col-${col}`);
                if (!colEl) continue;
                colEl.innerHTML = '';
                const pile = tableau[col];

                pile.forEach((card, idx) => {
                    const el = createCardElement(card);
                    el.style.top = `${idx * 20}px`;
                    if (card.faceUp) {
                        el.addEventListener('click', () => handleTableauCardClick(col, idx));
                        el.addEventListener('dblclick', () => autoSendToFoundation(col, idx));
                    } else if (idx === pile.length - 1) {
                        el.addEventListener('click', () => {
                            card.faceUp = true;
                            score += 5;
                            playBeep(700, 'square', 0.03);
                            renderBoard();
                        });
                    }
                    colEl.appendChild(el);
                });
            }

            updateStatus();
            checkWinCondition();
        }

        function createCardElement(card) {
            const div = document.createElement('div');
            div.className = `sol-card is-${card.color}`;
            if (!card.faceUp) {
                div.classList.add('is-back');
                div.innerHTML = '';
                return div;
            }

            div.innerHTML = `
                <div class="sol-card-top-corner">${card.name}<br>${card.symbol}</div>
                <div class="sol-card-suit-center">${card.symbol}</div>
                <div class="sol-card-bot-corner">${card.name}<br>${card.symbol}</div>
            `;
            return div;
        }

        function dealGame() {
            stopCascade();
            deck = shuffle(createDeck());
            tableau = [[], [], [], [], [], [], []];
            foundations = { hearts: [], diamonds: [], clubs: [], spades: [] };
            waste = [];
            stock = [];
            score = 0;
            moves = 0;

            for (let col = 0; col < 7; col++) {
                for (let row = 0; row <= col; row++) {
                    const card = deck.pop();
                    card.faceUp = (row === col);
                    tableau[col].push(card);
                }
            }
            stock = deck;
            startTimer();
            renderBoard();
            playRetroClick();
        }

        if (solStock) {
            solStock.addEventListener('click', () => {
                if (isCascadeActive) return;
                moves++;
                if (stock.length > 0) {
                    const card = stock.pop();
                    card.faceUp = true;
                    waste.push(card);
                    playBeep(850, 'square', 0.02);
                } else if (waste.length > 0) {
                    stock = waste.reverse().map(c => { c.faceUp = false; return c; });
                    waste = [];
                    score = Math.max(0, score - 20);
                    playBeep(450, 'square', 0.04);
                }
                renderBoard();
            });
        }

        function handleWasteCardClick(card) {
            if (!card) return;
            const fPile = foundations[card.suit];
            const neededRank = fPile.length === 0 ? 1 : fPile[fPile.length - 1].rank + 1;
            if (card.rank === neededRank) {
                waste.pop();
                fPile.push(card);
                score += 10;
                moves++;
                playBeep(1000, 'square', 0.04);
                renderBoard();
                return;
            }

            for (let col = 0; col < 7; col++) {
                const pile = tableau[col];
                if (pile.length === 0 && card.rank === 13) {
                    waste.pop();
                    pile.push(card);
                    score += 5;
                    moves++;
                    playBeep(750, 'square', 0.03);
                    renderBoard();
                    return;
                } else if (pile.length > 0) {
                    const top = pile[pile.length - 1];
                    if (top.faceUp && top.color !== card.color && top.rank === card.rank + 1) {
                        waste.pop();
                        pile.push(card);
                        score += 5;
                        moves++;
                        playBeep(750, 'square', 0.03);
                        renderBoard();
                        return;
                    }
                }
            }
        }

        function handleTableauCardClick(col, idx) {
            const pile = tableau[col];
            const card = pile[idx];
            if (!card.faceUp) return;

            if (idx === pile.length - 1) {
                const fPile = foundations[card.suit];
                const neededRank = fPile.length === 0 ? 1 : fPile[fPile.length - 1].rank + 1;
                if (card.rank === neededRank) {
                    pile.pop();
                    fPile.push(card);
                    score += 10;
                    moves++;
                    if (pile.length > 0 && !pile[pile.length - 1].faceUp) {
                        pile[pile.length - 1].faceUp = true;
                        score += 5;
                    }
                    playBeep(1100, 'square', 0.04);
                    renderBoard();
                    return;
                }
            }

            const cardsToMove = pile.slice(idx);
            for (let targetCol = 0; targetCol < 7; targetCol++) {
                if (targetCol === col) continue;
                const targetPile = tableau[targetCol];
                if (targetPile.length === 0 && card.rank === 13) {
                    tableau[col] = pile.slice(0, idx);
                    tableau[targetCol] = targetPile.concat(cardsToMove);
                    moves++;
                    if (tableau[col].length > 0 && !tableau[col][tableau[col].length - 1].faceUp) {
                        tableau[col][tableau[col].length - 1].faceUp = true;
                        score += 5;
                    }
                    playBeep(750, 'square', 0.03);
                    renderBoard();
                    return;
                } else if (targetPile.length > 0) {
                    const targetTop = targetPile[targetPile.length - 1];
                    if (targetTop.faceUp && targetTop.color !== card.color && targetTop.rank === card.rank + 1) {
                        tableau[col] = pile.slice(0, idx);
                        tableau[targetCol] = targetPile.concat(cardsToMove);
                        moves++;
                        if (tableau[col].length > 0 && !tableau[col][tableau[col].length - 1].faceUp) {
                            tableau[col][tableau[col].length - 1].faceUp = true;
                            score += 5;
                        }
                        playBeep(750, 'square', 0.03);
                        renderBoard();
                        return;
                    }
                }
            }
        }

        function autoSendToFoundation(col, idx) {
            const pile = tableau[col];
            if (idx !== pile.length - 1) return;
            const card = pile[idx];
            const fPile = foundations[card.suit];
            const neededRank = fPile.length === 0 ? 1 : fPile[fPile.length - 1].rank + 1;
            if (card.rank === neededRank) {
                pile.pop();
                fPile.push(card);
                score += 10;
                moves++;
                if (pile.length > 0 && !pile[pile.length - 1].faceUp) {
                    pile[pile.length - 1].faceUp = true;
                    score += 5;
                }
                playBeep(1200, 'square', 0.05);
                renderBoard();
            }
        }

        function checkWinCondition() {
            const totalInFoundations = Object.values(foundations).reduce((acc, p) => acc + p.length, 0);
            if (totalInFoundations === 52) {
                triggerWinCascade();
            }
        }

        let cascadeAnimId = null;
        function triggerWinCascade() {
            if (isCascadeActive || !solCascadeCanvas) return;
            isCascadeActive = true;
            solCascadeCanvas.style.display = 'block';
            solCascadeCanvas.width = solBoard.clientWidth;
            solCascadeCanvas.height = solBoard.clientHeight;
            const ctx = solCascadeCanvas.getContext('2d');

            playArcadeFanfare();
            if (timer) clearInterval(timer);

            const allCards = [];
            SUITS.forEach(suit => {
                for (let r = 13; r >= 1; r--) {
                    allCards.push({
                        name: RANK_NAMES[r] || r.toString(),
                        symbol: SUIT_SYMBOLS[suit],
                        color: SUIT_COLORS[suit] === 'red' ? '#e74c3c' : '#222222',
                        x: 350 + Math.random() * 250,
                        y: 30,
                        vx: (Math.random() - 0.5) * 8,
                        vy: Math.random() * 2 - 1,
                        bounce: 0.82
                    });
                }
            });

            let cardIdx = 0;
            const activeCards = [];

            function loop() {
                if (cardIdx < allCards.length && Math.random() > 0.4) {
                    activeCards.push(allCards[cardIdx]);
                    cardIdx++;
                }

                activeCards.forEach(c => {
                    ctx.fillStyle = '#ffffff';
                    ctx.strokeStyle = '#000000';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.rect(c.x, c.y, 68, 96);
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = c.color;
                    ctx.font = 'bold 12px sans-serif';
                    ctx.fillText(c.name, c.x + 6, c.y + 16);
                    ctx.fillText(c.symbol, c.x + 6, c.y + 30);
                    ctx.font = '22px sans-serif';
                    ctx.fillText(c.symbol, c.x + 24, c.y + 56);

                    c.vy += 0.45;
                    c.x += c.vx;
                    c.y += c.vy;

                    if (c.y + 96 >= solCascadeCanvas.height) {
                        c.y = solCascadeCanvas.height - 96;
                        c.vy = -c.vy * c.bounce;
                    }
                });

                if (isCascadeActive) {
                    cascadeAnimId = requestAnimationFrame(loop);
                }
            }
            loop();
        }

        function stopCascade() {
            isCascadeActive = false;
            if (cascadeAnimId) {
                cancelAnimationFrame(cascadeAnimId);
                cascadeAnimId = null;
            }
            if (solCascadeCanvas) {
                solCascadeCanvas.style.display = 'none';
                const ctx = solCascadeCanvas.getContext('2d');
                if (ctx) ctx.clearRect(0, 0, solCascadeCanvas.width, solCascadeCanvas.height);
            }
        }

        if (solBtnNew) solBtnNew.addEventListener('click', dealGame);
        if (solBtnRestart) solBtnRestart.addEventListener('click', dealGame);
        if (solBtnTestWin) solBtnTestWin.addEventListener('click', triggerWinCascade);

        dealGame();
    }

    // ======================================================================
    // 17. mIRC 5.91 / MSN Messenger Engine (Class XII-E Chatroom)
    // ======================================================================
    function initMircChat() {
        const mircWindow = document.getElementById('mirc-window');
        const mircFeed = document.getElementById('mirc-feed');
        const mircUserList = document.getElementById('mirc-user-list');
        const mircInput = document.getElementById('mirc-input');
        const mircBtnSend = document.getElementById('mirc-btn-send');
        const mircBtnClear = document.getElementById('mirc-btn-clear');
        const mircBtnReset = document.getElementById('mirc-btn-reset-hist');
        const mircBtnSlap = document.getElementById('mirc-btn-slap');
        const mircBtnNudge = document.getElementById('mirc-btn-nudge');
        const mircMyNickEl = document.getElementById('mirc-my-nick');

        if (!mircFeed || !mircInput) return;

        let myNick = localStorage.getItem('kdnatoes_irc_nick') || 'Nathan';
        if (mircMyNickEl) mircMyNickEl.textContent = `${myNick}:`;

        const onlineClassmates = [
            { nick: 'Ust_MisbachulMunir', op: true },     // Wali Kelas XII-E
            { nick: 'Iqbal_Qodama', op: true },           // Ketua Kelas: Iqbal Qodama Khoirurrijal
            { nick: 'Anas_Afif', op: true },              // Wakil Ketua: M. Anas Afif Alfadil
            { nick: 'Fathu_Rizqi', op: true },            // Sekretaris: Fathu Rizqi Almubarok
            { nick: 'Azzamy_Syauqi', op: true },          // Bendahara: Muhammad Azzamy Syauqi
            { nick: 'Nathan', me: true },                 // Dev Engineer: Nathan Ferdwiansyah
            { nick: 'Abdan_Husaini' },
            { nick: 'Ahnaf_Ghazy' },
            { nick: 'Arfa_Rausyan' },
            { nick: 'Asa_Kemal' },
            { nick: 'Asyam_Taufiq' },
            { nick: 'Asyraf_Raziq' },
            { nick: 'Damar_AlFathih' },
            { nick: 'Fadel_Thufail' },
            { nick: 'M_Zaidan' },
            { nick: 'M_Wafizzaliq' },
            { nick: 'Muflih_Davin' },
            { nick: 'Fauzan_Hilmy' },
            { nick: 'Daffa_Yardan' },
            { nick: 'Farras_Kurnia' },
            { nick: 'Rizky_Setiawan' },
            { nick: 'Sholahudin_Rasya' },
            { nick: 'Syawal_Satriaji' },
            { nick: 'Nahla_Kemal' },
            { nick: 'Naufal_Surya' },
            { nick: 'Naufal_Syamil' },
            { nick: 'Radithya_Dzaky' },
            { nick: 'Rais_Widaya' }
        ];

        function renderUserList() {
            if (!mircUserList) return;
            mircUserList.innerHTML = onlineClassmates.map(u => {
                const prefix = u.op ? '@' : '+';
                const styleClass = u.op ? 'mirc-user-op' : '';
                return `<li class="mirc-user-item ${styleClass}">${prefix}${u.nick}</li>`;
            }).join('');
        }
        renderUserList();

        function appendMessage(html) {
            const line = document.createElement('div');
            line.className = 'mirc-msg-line';
            line.innerHTML = html;
            mircFeed.appendChild(line);
            mircFeed.scrollTop = mircFeed.scrollHeight;
        }

        function getTimeStr() {
            const d = new Date();
            return `[${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}]`;
        }

        const presetMessages = [
            { time: '[09:30]', nick: '***', text: 'Now talking in #XII-E_Nongkrong (Topic: Tempat kumpul & koordinasi santai XII-E KDNATOES)', type: 'system' },
            { time: '[09:31]', nick: 'Ust_MisbachulMunir', text: "Assalamu'alaikum anak-anak hebat XII-E, jangan lupa istirahat yang cukup dan tetap jaga kedisiplinan menjelang ujian ya." },
            { time: '[09:33]', nick: 'Iqbal_Qodama', text: "Wa'alaikumsalam Pak Ust Misbach! Siap, modul latihan dan jadwal belajar kelompok sudah dikoordinasikan." },
            { time: '[09:34]', nick: 'Anas_Afif', text: "Ruang kelas dan absensi harian juga sudah aman terkendali, Pak." },
            { time: '[09:35]', nick: 'Fathu_Rizqi', text: "Catatan notula dan jadwal tryout sudah dipajang di mading ya teman-teman." },
            { time: '[09:36]', nick: 'Azzamy_Syauqi', text: "Kas kelas per minggu ini juga sudah beres dan tercatat transparan!" }
        ];

        function loadHistory() {
            mircFeed.innerHTML = '';
            let saved = [];
            try {
                saved = JSON.parse(localStorage.getItem('kdnatoes_mirc_history') || '[]');
            } catch (e) { }

            // Auto-migrate outdated mock structure names in cache
            if (saved.length > 0) {
                const hasOldNames = saved.some(m => m.nick && (m.nick.includes('BuSiti') || m.nick === 'KetuaKelas_Rian' || m.nick === 'Wakil_SitiRahma'));
                if (hasOldNames) {
                    saved = presetMessages;
                    try { localStorage.setItem('kdnatoes_mirc_history', JSON.stringify(presetMessages)); } catch (e) { }
                }
            }

            const toShow = saved.length > 0 ? saved : presetMessages;
            toShow.forEach(m => {
                if (m.type === 'system') {
                    appendMessage(`<span class="mirc-msg-time">${m.time}</span> <span class="mirc-msg-system">${m.text}</span>`);
                } else if (m.type === 'action') {
                    appendMessage(`<span class="mirc-msg-time">${m.time}</span> <span class="mirc-msg-action">* ${m.nick} ${m.text}</span>`);
                } else {
                    appendMessage(`<span class="mirc-msg-time">${m.time}</span> &lt;<span class="mirc-msg-nick">${m.nick}</span>&gt; ${m.text}`);
                }
            });
        }
        loadHistory();

        function saveMessage(msgObj) {
            let saved = [];
            try {
                saved = JSON.parse(localStorage.getItem('kdnatoes_mirc_history') || '[]');
            } catch (e) { }
            saved.push(msgObj);
            if (saved.length > 60) saved.shift();
            try {
                localStorage.setItem('kdnatoes_mirc_history', JSON.stringify(saved));
            } catch (e) { }
        }

        function triggerMsnNudge() {
            if (!mircWindow) return;
            mircWindow.classList.remove('is-nudged');
            void mircWindow.offsetWidth;
            mircWindow.classList.add('is-nudged');
            setTimeout(() => mircWindow.classList.remove('is-nudged'), 650);

            playBeep(180, 'sawtooth', 0.12);
            setTimeout(() => playBeep(220, 'sawtooth', 0.14), 140);
            setTimeout(() => playBeep(150, 'sawtooth', 0.2), 300);

            const time = getTimeStr();
            appendMessage(`<span class="mirc-msg-time">${time}</span> <span class="mirc-msg-system">⚡ *** ${myNick} just sent a Nudge! (BUZZZZZZ)</span>`);
            saveMessage({ time, text: `⚡ *** ${myNick} just sent a Nudge! (BUZZZZZZ)`, type: 'system' });
        }

        function sendMessage() {
            const raw = mircInput.value.trim();
            if (!raw) return;
            mircInput.value = '';
            const time = getTimeStr();

            if (raw.startsWith('/me ')) {
                const act = raw.substring(4).trim();
                appendMessage(`<span class="mirc-msg-time">${time}</span> <span class="mirc-msg-action">* ${myNick} ${act}</span>`);
                saveMessage({ time, nick: myNick, text: act, type: 'action' });
            } else if (raw.startsWith('/slap ')) {
                const target = raw.substring(6).trim();
                const act = `menampar ${target} dengan ikan teri raksasa berbobot 50 kilogram!`;
                appendMessage(`<span class="mirc-msg-time">${time}</span> <span class="mirc-msg-action">* ${myNick} ${act}</span>`);
                saveMessage({ time, nick: myNick, text: act, type: 'action' });
            } else if (raw.startsWith('/nick ')) {
                const newN = raw.substring(6).trim();
                if (newN) {
                    const oldN = myNick;
                    myNick = newN;
                    localStorage.setItem('kdnatoes_irc_nick', myNick);
                    if (mircMyNickEl) mircMyNickEl.textContent = `${myNick}:`;
                    appendMessage(`<span class="mirc-msg-time">${time}</span> <span class="mirc-msg-system">*** ${oldN} is now known as ${newN}</span>`);
                    saveMessage({ time, text: `*** ${oldN} is now known as ${newN}`, type: 'system' });
                }
            } else {
                appendMessage(`<span class="mirc-msg-time">${time}</span> &lt;<span class="mirc-msg-nick">${myNick}</span>&gt; ${raw}`);
                saveMessage({ time, nick: myNick, text: raw });

                const responders = [
                    'Iqbal_Qodama',
                    'Anas_Afif',
                    'Fathu_Rizqi',
                    'Azzamy_Syauqi',
                    'Abdan_Husaini',
                    'Ahnaf_Ghazy',
                    'Sholahudin_Rasya',
                    'Syawal_Satriaji',
                    'Radithya_Dzaky'
                ];
                const replies = [
                    'Wkwkwk setuju banget bro! KDNATOES selalu solid.',
                    'Mantap! Jangan lupa besok kumpul catatan dan kas kelas ya.',
                    'Hahaha bener juga tuh, seru parah!',
                    'Semangat gaes, tinggal hitungan minggu kita lulus dan masuk kampus impian!',
                    'Aseekk, ntar istirahat kita kumpul lagi di pojokan kantin.',
                    'Wkwkwk emang paling bisa lu mah! Jos gandos!'
                ];
                setTimeout(() => {
                    const rNick = responders[Math.floor(Math.random() * responders.length)];
                    const rText = replies[Math.floor(Math.random() * replies.length)];
                    const rTime = getTimeStr();
                    appendMessage(`<span class="mirc-msg-time">${rTime}</span> &lt;<span class="mirc-msg-nick">${rNick}</span>&gt; ${rText}`);
                    saveMessage({ time: rTime, nick: rNick, text: rText });
                    playBeep(920, 'square', 0.03);
                }, 2200);
            }
            playRetroClick();
        }

        mircInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        if (mircBtnSend) mircBtnSend.addEventListener('click', sendMessage);
        if (mircBtnNudge) mircBtnNudge.addEventListener('click', triggerMsnNudge);
        if (mircBtnSlap) {
            mircBtnSlap.addEventListener('click', () => {
                mircInput.value = '/slap Dimas_Keamanan';
                mircInput.focus();
            });
        }
        if (mircBtnClear) {
            mircBtnClear.addEventListener('click', () => {
                mircFeed.innerHTML = '';
            });
        }
        if (mircBtnReset) {
            mircBtnReset.addEventListener('click', () => {
                localStorage.removeItem('kdnatoes_mirc_history');
                loadHistory();
            });
        }
        if (mircMyNickEl) {
            mircMyNickEl.addEventListener('click', () => {
                const n = prompt('Masukkan Nickname Baru:', myNick);
                if (n && n.trim()) {
                    myNick = n.trim();
                    localStorage.setItem('kdnatoes_irc_nick', myNick);
                    mircMyNickEl.textContent = `${myNick}:`;
                }
            });
        }
    }

    // ======================================================================
    // 18. Calculator & Formula Cheat Sheet Engine (Windows 98 Style)
    // ======================================================================
    function initCalculator() {
        const calcMainDisplay = document.getElementById('calc-main-display');
        const calcSubDisplay = document.getElementById('calc-sub-display');
        const calcModeBtns = document.querySelectorAll('.calc-mode-btn');
        const calcSciKeys = document.getElementById('calc-sci-keys');
        const calcCalcPanel = document.getElementById('calc-calc-panel');
        const calcFormulaPanel = document.getElementById('calc-formula-panel');
        const formulaContainer = document.getElementById('formula-cards-container');
        const formulaSubtabs = document.querySelectorAll('.formula-subtab');

        if (!calcMainDisplay) return;

        let currentVal = '0';
        let storedVal = null;
        let pendingOp = null;
        let resetNext = false;

        function updateDisplay() {
            calcMainDisplay.textContent = currentVal;
            if (calcSubDisplay) {
                if (storedVal !== null && pendingOp) {
                    calcSubDisplay.textContent = `${storedVal} ${pendingOp}`;
                } else {
                    calcSubDisplay.innerHTML = '&nbsp;';
                }
            }
        }

        function handleNum(digit) {
            if (resetNext || currentVal === '0') {
                currentVal = digit;
                resetNext = false;
            } else {
                if (currentVal.length < 14) {
                    currentVal += digit;
                }
            }
            updateDisplay();
            playRetroClick();
        }

        function handleOp(op) {
            const num = parseFloat(currentVal);
            if (storedVal === null) {
                storedVal = num;
            } else if (pendingOp && !resetNext) {
                storedVal = calculate(storedVal, num, pendingOp);
                currentVal = String(storedVal);
            }
            pendingOp = op;
            resetNext = true;
            updateDisplay();
            playRetroClick();
        }

        function calculate(a, b, op) {
            switch (op) {
                case '+': return a + b;
                case '-': return a - b;
                case '*': return a * b;
                case '/': return b !== 0 ? a / b : 'Error';
                default: return b;
            }
        }

        function handleEquals() {
            if (storedVal !== null && pendingOp) {
                const num = parseFloat(currentVal);
                const res = calculate(storedVal, num, pendingOp);
                currentVal = String(res);
                storedVal = null;
                pendingOp = null;
                resetNext = true;
                updateDisplay();
                playBeep(950, 'square', 0.04);
            }
        }

        document.querySelectorAll('.calc-btn-num').forEach(btn => {
            btn.addEventListener('click', () => {
                const num = btn.dataset.num;
                const action = btn.dataset.action;
                if (num !== undefined) {
                    handleNum(num);
                } else if (action === 'dot') {
                    if (!currentVal.includes('.')) {
                        currentVal += '.';
                        updateDisplay();
                    }
                } else if (action === 'neg') {
                    currentVal = String(-parseFloat(currentVal));
                    updateDisplay();
                }
            });
        });

        document.querySelectorAll('.calc-btn-op').forEach(btn => {
            btn.addEventListener('click', () => {
                const op = btn.dataset.op;
                const action = btn.dataset.action;
                if (op) {
                    handleOp(op);
                } else if (action === 'sqrt') {
                    const n = parseFloat(currentVal);
                    currentVal = n >= 0 ? String(Math.sqrt(n)) : 'Error';
                    resetNext = true;
                    updateDisplay();
                } else if (action === 'inv') {
                    const n = parseFloat(currentVal);
                    currentVal = n !== 0 ? String(1 / n) : 'Error';
                    resetNext = true;
                    updateDisplay();
                } else if (action === 'percent') {
                    currentVal = String(parseFloat(currentVal) / 100);
                    resetNext = true;
                    updateDisplay();
                }
                playRetroClick();
            });
        });

        const btnEq = document.querySelector('.calc-btn-eq');
        if (btnEq) btnEq.addEventListener('click', handleEquals);

        document.querySelectorAll('.calc-btn-ctrl-key').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                if (action === 'c') {
                    currentVal = '0';
                    storedVal = null;
                    pendingOp = null;
                    resetNext = false;
                } else if (action === 'ce') {
                    currentVal = '0';
                } else if (action === 'backspace') {
                    if (currentVal.length > 1) {
                        currentVal = currentVal.slice(0, -1);
                    } else {
                        currentVal = '0';
                    }
                }
                updateDisplay();
                playRetroClick();
            });
        });

        document.querySelectorAll('.calc-btn-func').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                const n = parseFloat(currentVal);
                switch (action) {
                    case 'sin': currentVal = String(Math.sin(n * Math.PI / 180)); break;
                    case 'cos': currentVal = String(Math.cos(n * Math.PI / 180)); break;
                    case 'tan': currentVal = String(Math.tan(n * Math.PI / 180)); break;
                    case 'log': currentVal = n > 0 ? String(Math.log10(n)) : 'Error'; break;
                    case 'ln': currentVal = n > 0 ? String(Math.log(n)) : 'Error'; break;
                    case 'sqr': currentVal = String(n * n); break;
                    case 'pi': currentVal = String(Math.PI); break;
                    case 'fact':
                        let f = 1;
                        for (let i = 2; i <= Math.min(n, 20); i++) f *= i;
                        currentVal = String(f);
                        break;
                }
                resetNext = true;
                updateDisplay();
                playRetroClick();
            });
        });

        calcModeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                calcModeBtns.forEach(b => b.classList.remove('is-active'));
                btn.classList.add('is-active');
                const mode = btn.dataset.mode;
                if (mode === 'standard') {
                    if (calcCalcPanel) calcCalcPanel.style.display = 'block';
                    if (calcFormulaPanel) calcFormulaPanel.style.display = 'none';
                    if (calcSciKeys) calcSciKeys.style.display = 'none';
                } else if (mode === 'scientific') {
                    if (calcCalcPanel) calcCalcPanel.style.display = 'block';
                    if (calcFormulaPanel) calcFormulaPanel.style.display = 'none';
                    if (calcSciKeys) calcSciKeys.style.display = 'grid';
                } else if (mode === 'formulas') {
                    if (calcCalcPanel) calcCalcPanel.style.display = 'none';
                    if (calcFormulaPanel) calcFormulaPanel.style.display = 'block';
                    renderFormulas('math');
                }
                playRetroClick();
            });
        });

        const formulas = {
            math: [
                { title: 'Persamaan Kuadrat (Rumus ABC)', eq: 'x = (-b ± √(b² - 4ac)) / (2a)', desc: 'Menentukan akar-akar persamaan kuadrat ax² + bx + c = 0' },
                { title: 'Trigonometri Dasar', eq: 'sin²θ + cos²θ = 1', desc: 'Identitas phytagoras trigonometri' },
                { title: 'Deret Aritmatika', eq: 'Sn = (n/2) × (2a + (n - 1)b)', desc: 'Jumlah n suku pertama barisan aritmatika' },
                { title: 'Peluang Suatu Kejadian', eq: 'P(A) = n(A) / n(S)', desc: 'Peluang kejadian A terhadap ruang sampel S' }
            ],
            physics: [
                { title: 'GLBB (Kecepatan Akhir)', eq: 'vt = v0 + at', desc: 'Gerak lurus berubah beraturan dengan percepatan a konstan' },
                { title: 'Hukum II Newton', eq: 'ΣF = m · a', desc: 'Hubungan gaya, massa benda, dan percepatan' },
                { title: 'Energi Kinetik', eq: 'Ek = 1/2 · m · v²', desc: 'Energi yang dimiliki benda karena gerakannya' },
                { title: 'Hukum Ohm (Kelistrikan)', eq: 'V = I · R', desc: 'Tegangan sama dengan kuat arus dikali hambatan' }
            ],
            chem: [
                { title: 'Konsep Mol (Massa ke Mol)', eq: 'n = gram / Mr', desc: 'Menghitung jumlah mol dari massa dan massa molar' },
                { title: 'Persamaan Gas Ideal', eq: 'P · V = n · R · T', desc: 'Tekanan, volume, mol, konstanta gas, dan suhu mutlak' },
                { title: 'Molaritas Larutan', eq: 'M = n / V (Liter)', desc: 'Konsentrasi zat terlarut dalam larutan' },
                { title: 'Derajat Keasaman (pH)', eq: 'pH = -log [H⁺]', desc: 'Menentukan tingkat keasaman larutan' }
            ]
        };

        function renderFormulas(subject) {
            if (!formulaContainer) return;
            const list = formulas[subject] || [];
            formulaContainer.innerHTML = list.map(item => `
                <div class="formula-card">
                    <div class="formula-card-title">${item.title}</div>
                    <div class="formula-card-eq">${item.eq}</div>
                    <div class="formula-card-desc">${item.desc}</div>
                </div>
            `).join('');
        }

        formulaSubtabs.forEach(tab => {
            tab.addEventListener('click', () => {
                formulaSubtabs.forEach(t => t.classList.remove('is-active'));
                tab.classList.add('is-active');
                renderFormulas(tab.dataset.subject);
                playRetroClick();
            });
        });
    }

    // ======================================================================
    // 19. Recycle Bin Engine (Deleted Class Secrets & Restore to Desktop)
    // ======================================================================
    function initRecycleBin() {
        const recycleTbody = document.getElementById('recycle-tbody');
        const previewBox = document.getElementById('recycle-preview-box');
        const previewTitle = document.getElementById('recycle-preview-title');
        const previewBody = document.getElementById('recycle-preview-body');
        const btnClosePreview = document.getElementById('recycle-btn-close-preview');
        const btnRestoreCurrent = document.getElementById('recycle-btn-restore-current');
        const btnEmpty = document.getElementById('recycle-btn-empty');
        const btnRestoreAll = document.getElementById('recycle-btn-restore-all');
        const statusText = document.getElementById('recycle-status-text');

        if (!recycleTbody) return;

        let deletedFiles = [
            {
                id: 'remedial',
                name: '📄 remedial_matematika_terburuk.xls',
                loc: 'C:\\Dokumen\\Akademik',
                date: 'Kemarin, 14:10',
                size: '124 KB',
                preview: 'DAFTAR NILAI REMEDIAL UH 3 MATEMATIKA (LIMIT & TURUNAN):\n- Dimas: 35 (salah masukkan rumus turunan)\n- Nathan: 40 (kurang minum kopi/mengantuk)\n- Budi: 20 (kolom jawaban ditulis: "Hanya Allah yang tahu")\n- Rizky: 45 (hampir lulus KKM tapi salah di nomor 5)\n\nCATATAN GURU: Semua nama di atas wajib remedial ulang hari Senin jam ke-0!'
            },
            {
                id: 'aib_ketua',
                name: '🖼️ foto_candid_aib_ketua.bmp',
                loc: 'C:\\Foto\\Kegiatan_LDKS',
                date: '2 hari lalu',
                size: '840 KB',
                preview: '[BITMAP PREVIEW - 24 BIT]\nFoto Ketua Kelas tertidur pulas dengan mulut sedikit terbuka sambil memeluk botol minum tupperware warna ungu saat jam istirahat kedua di teras kelas XII-E.\n(Catatan: Jangan sampai ketua kelas melihat arsip ini!)'
            },
            {
                id: 'surat_cinta',
                name: '💌 surat_cinta_salah_kirim.doc',
                loc: 'C:\\Dokumen\\Pribadi\\Rahasia',
                date: '3 minggu lalu',
                size: '45 KB',
                preview: 'SURAT CINTA YANG SALAH ALAMAT:\n"Kepada mawar merah di bangku deretan kedua dari depan...\nSetiap kali kamu meminjamkan penghapus, jantungku berdetak melebihi frekuensi gelombang radio..."\n\n(DIBUANG KARENA: Surat ini malah keliru dimasukkan ke loker meja Guru BK!)'
            },
            {
                id: 'contekan',
                name: '🤐 contekan_ujian_bocor.txt',
                loc: 'C:\\Download\\Bocoran',
                date: '1 bulan lalu',
                size: '12 KB',
                preview: 'BOCORAN SOAL & KUNCI JAWABAN FISIKA BAB GELOMBANG:\n1. A\n2. B\n3. C\n4. D\n\n(FAKTA MENGEJUTKAN: Ternyata pas hari H ujian, gurunya ganti soal paket B... zonk total!)'
            },
            {
                id: 'rekaman_suara',
                name: '🎵 rekaman_suara_ngorok_jam_kosong.wav',
                loc: 'C:\\Audio\\Nostalgia',
                date: '2 minggu lalu',
                size: '420 KB',
                preview: '[WAVE AUDIO LOG - 44.1 kHz]\nDurasi: 00:35 detik\nRekaman audio orkestra dengkuran saat jam kosong 2 jam pelajaran di pojok belakang kelas. Suara decakan kipas angin nomor 2 berpadu merdu dengan desah napas anak-anak lelah.'
            }
        ];

        let selectedFile = null;

        function updateStatus() {
            if (!statusText) return;
            statusText.textContent = `${deletedFiles.length} item(s) terhapus | 1.44 MB Disk Space`;
        }

        function renderTable() {
            recycleTbody.innerHTML = '';
            deletedFiles.forEach(file => {
                const tr = document.createElement('tr');
                if (selectedFile && selectedFile.id === file.id) {
                    tr.classList.add('is-selected');
                }
                tr.innerHTML = `
                    <td>${file.name}</td>
                    <td>${file.loc}</td>
                    <td>${file.date}</td>
                    <td>${file.size}</td>
                `;
                tr.addEventListener('click', () => {
                    selectedFile = file;
                    renderTable();
                    openPreview(file);
                    playRetroClick();
                });
                recycleTbody.appendChild(tr);
            });
            updateStatus();
        }

        function openPreview(file) {
            if (!previewBox || !previewTitle || !previewBody) return;
            previewTitle.textContent = `Preview - ${file.name}`;
            previewBody.textContent = file.preview;
            previewBox.style.display = 'block';
        }

        function restoreFile(file) {
            if (!file) return;
            deletedFiles = deletedFiles.filter(f => f.id !== file.id);
            selectedFile = null;
            if (previewBox) previewBox.style.display = 'none';
            renderTable();

            const shortcutsContainer = document.querySelector('.desktop-shortcuts');
            if (shortcutsContainer) {
                const restoredIcon = document.createElement('div');
                restoredIcon.className = 'desktop-icon';
                restoredIcon.title = `File Dipulihkan: ${file.name}`;
                restoredIcon.innerHTML = `
                    <svg viewBox="0 0 32 32" fill="none">
                        <rect x="5" y="4" width="22" height="24" rx="2" fill="#fff" stroke="#000" stroke-width="1.5" />
                        <path d="M12 10h8M12 15h8M12 20h5" stroke="#27ae60" stroke-width="2" />
                    </svg>
                    <span class="desktop-icon-label" style="color: #ffff00;">${file.name.slice(0, 14)}...</span>
                `;
                restoredIcon.addEventListener('click', () => {
                    alert(`[FILE DIPULIHKAN: ${file.name}]\n\n${file.preview}`);
                    playRetroClick();
                });
                shortcutsContainer.appendChild(restoredIcon);
            }

            playArcadeFanfare();
            alert(`File "${file.name}" berhasil di-restore ke Desktop Windows 98!`);
        }

        if (btnClosePreview) {
            btnClosePreview.addEventListener('click', () => {
                if (previewBox) previewBox.style.display = 'none';
            });
        }

        if (btnRestoreCurrent) {
            btnRestoreCurrent.addEventListener('click', () => {
                if (selectedFile) restoreFile(selectedFile);
            });
        }

        if (btnEmpty) {
            btnEmpty.addEventListener('click', () => {
                if (deletedFiles.length === 0) {
                    alert('Recycle Bin sudah kosong.');
                    return;
                }
                const confirmEmpty = confirm('Apakah Anda yakin ingin membuang semua arsip kenangan ini secara permanen?');
                if (confirmEmpty) {
                    deletedFiles = [];
                    selectedFile = null;
                    if (previewBox) previewBox.style.display = 'none';
                    renderTable();
                    playBeep(220, 'sawtooth', 0.08);
                    setTimeout(() => playBeep(180, 'sawtooth', 0.1), 70);
                    setTimeout(() => playBeep(140, 'sawtooth', 0.15), 140);
                }
            });
        }

        if (btnRestoreAll) {
            btnRestoreAll.addEventListener('click', () => {
                if (deletedFiles.length === 0) return;
                const toRestore = [...deletedFiles];
                toRestore.forEach(f => restoreFile(f));
            });
        }

        renderTable();
    }

    // Initialize the 6 new modules
    initDosPrompt();
    initRetroBrowser();
    initSolitaireGame();
    initMircChat();
    initCalculator();
    initRecycleBin();

    // Global Escape Key Listener to Close Modals / BSOD / Screensaver
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (isScreensaverActive) {
                stopScreensaver();
            } else if (bsodOverlay && bsodOverlay.classList.contains('is-active')) {
                dismissBsod();
            } else {
                closeModal('dialog-fair-backdrop');
                closeModal('dialog-virus-backdrop');
                closeModal('dialog-question-backdrop');
                closeModal('task-modal-backdrop');
                handleGalleryClose();
                closeModal('char-modal-backdrop');
                closeModal('tekken-versus-modal');
                closeModal('display-properties-modal');
                if (contextMenu) contextMenu.style.display = 'none';
                if (startMenu) startMenu.classList.remove('is-open');
                if (startBtn) startBtn.classList.remove('is-active');
            }
        }
    });

    // ======================================================================
    // 21. TelkomNet Instan 56k Dial-Up Engine (Web Audio Synthesized)
    // ======================================================================
    function initTelkomNet() {
        const telkomWin = document.getElementById('telkom-window');
        const btnDial = document.getElementById('btn-telkom-dial');
        const btnHangup = document.getElementById('btn-telkom-hangup');
        const btnCancel = document.getElementById('btn-telkom-cancel');
        const statusText = document.getElementById('telkom-status-text');
        const animBar = document.getElementById('telkom-anim-bar');
        const animFill = document.getElementById('telkom-anim-fill');
        const statsBox = document.getElementById('telkom-stats');
        const timerElem = document.getElementById('telkom-timer');
        const bytesElem = document.getElementById('telkom-bytes');
        const trayTelkom = document.getElementById('tray-telkom');

        let isConnecting = false;
        let isConnected = false;
        let connectDuration = 0;
        let statsInterval = null;
        let activeAudioNodes = [];

        function stopAllAudio() {
            activeAudioNodes.forEach(node => {
                try {
                    node.stop();
                    node.disconnect();
                } catch (e) { }
            });
            activeAudioNodes = [];
        }

        function playTone(freq, duration, type = 'sine', gainVal = 0.1, delay = 0) {
            const ctx = getAudioContext();
            if (!ctx) return;
            setTimeout(() => {
                try {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = type;
                    osc.frequency.setValueAtTime(freq, ctx.currentTime);
                    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + duration);
                    activeAudioNodes.push(osc);
                } catch (e) { }
            }, delay * 1000);
        }

        function playDialSequence() {
            playTone(350, 0.6, 'sine', 0.12, 0);
            playTone(440, 0.6, 'sine', 0.12, 0);

            const dtmfMap = {
                '0': [941, 1336],
                '8': [852, 1336],
                '9': [852, 1477]
            };
            const number = '080989999';
            let t = 0.8;
            for (let ch of number) {
                const freqs = dtmfMap[ch] || [852, 1336];
                playTone(freqs[0], 0.08, 'sine', 0.15, t);
                playTone(freqs[1], 0.08, 'sine', 0.15, t);
                t += 0.12;
            }

            playTone(440, 0.4, 'sine', 0.1, t + 0.2);
            playTone(480, 0.4, 'sine', 0.1, t + 0.2);

            setTimeout(() => {
                const ctx = getAudioContext();
                if (!ctx || !isConnecting) return;
                try {
                    const bufferSize = ctx.sampleRate * 1.5;
                    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                    const data = buffer.getChannelData(0);
                    for (let i = 0; i < bufferSize; i++) {
                        data[i] = (Math.random() * 2 - 1) * 0.08;
                    }
                    const noise = ctx.createBufferSource();
                    noise.buffer = buffer;
                    const filter = ctx.createBiquadFilter();
                    filter.type = 'bandpass';
                    filter.frequency.setValueAtTime(1800, ctx.currentTime);
                    noise.connect(filter);
                    filter.connect(ctx.destination);
                    noise.start();
                    activeAudioNodes.push(noise);

                    playTone(2100, 0.8, 'sawtooth', 0.06, 0);
                    playTone(1200, 1.2, 'sawtooth', 0.05, 0.3);
                } catch (e) { }
            }, (t + 0.8) * 1000);
        }

        function startDial() {
            if (isConnecting || isConnected) return;
            isConnecting = true;
            btnDial.disabled = true;
            animBar.style.display = 'block';
            animFill.style.width = '10%';
            statusText.textContent = 'Status: Memutar nomor 080989999 (Dialing)...';

            playDialSequence();

            setTimeout(() => {
                if (!isConnecting) return;
                animFill.style.width = '45%';
                statusText.textContent = 'Status: Mengontak server TelkomNet Instan...';
            }, 1800);

            setTimeout(() => {
                if (!isConnecting) return;
                animFill.style.width = '75%';
                statusText.textContent = 'Status: Negosiasi protokol & handshake modem...';
            }, 3200);

            setTimeout(() => {
                if (!isConnecting) return;
                isConnecting = false;
                isConnected = true;
                btnDial.disabled = false;
                btnDial.style.display = 'none';
                btnHangup.style.display = 'inline-block';
                animFill.style.width = '100%';
                statusText.textContent = 'Status: Terhubung ke TelkomNet Instan (Connected)!';
                statusText.style.color = '#27ae60';
                statsBox.style.display = 'flex';
                if (trayTelkom) trayTelkom.style.display = 'flex';
                if (trayTelkom) trayTelkom.classList.add('is-telkom-active');

                playTone(523.25, 0.15, 'sine', 0.15, 0);
                playTone(659.25, 0.25, 'sine', 0.15, 0.15);

                connectDuration = 0;
                let bytes = 12400;
                statsInterval = setInterval(() => {
                    connectDuration++;
                    const hrs = String(Math.floor(connectDuration / 3600)).padStart(2, '0');
                    const mins = String(Math.floor((connectDuration % 3600) / 60)).padStart(2, '0');
                    const secs = String(connectDuration % 60).padStart(2, '0');
                    if (timerElem) timerElem.textContent = `${hrs}:${mins}:${secs}`;
                    bytes += Math.floor(Math.random() * 850 + 250);
                    if (bytesElem) bytesElem.textContent = (bytes / 1024).toFixed(1) + ' KB';
                }, 1000);
            }, 4600);
        }

        function hangup() {
            isConnecting = false;
            isConnected = false;
            stopAllAudio();
            if (statsInterval) clearInterval(statsInterval);
            if (animBar) animBar.style.display = 'none';
            if (animFill) animFill.style.width = '0%';
            if (statsBox) statsBox.style.display = 'none';
            if (btnDial) {
                btnDial.disabled = false;
                btnDial.style.display = 'inline-block';
            }
            if (btnHangup) btnHangup.style.display = 'none';
            if (statusText) {
                statusText.textContent = 'Status: Terputus (Disconnected).';
                statusText.style.color = '#333';
            }
            if (trayTelkom) {
                trayTelkom.style.display = 'none';
                trayTelkom.classList.remove('is-telkom-active');
            }
            playTone(200, 0.2, 'sawtooth', 0.1);
        }

        if (btnDial) btnDial.addEventListener('click', startDial);
        if (btnHangup) btnHangup.addEventListener('click', hangup);
        if (btnCancel) {
            btnCancel.addEventListener('click', () => {
                if (isConnecting) hangup();
                if (telkomWin) telkomWin.style.display = 'none';
                const tab = document.querySelector('.taskbar-tab[data-target="telkom-window"]');
                if (tab) tab.classList.remove('is-active');
            });
        }
        if (trayTelkom) {
            trayTelkom.addEventListener('click', () => {
                activateWindow('telkom-window');
            });
        }
    }

    // ======================================================================
    // 22. Kalender Meja XII-E, Ultah 32 Siswa & Live Countdown Timer
    // ======================================================================
    function initCalendarAndCountdown() {
        const tabBtns = document.querySelectorAll('#jadwal-tab-bar .win-tab-btn');
        const tabPanes = document.querySelectorAll('.jadwal-tab-pane');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('is-active'));
                tabPanes.forEach(p => p.style.display = 'none');
                btn.classList.add('is-active');
                const targetId = btn.dataset.tab;
                const targetPane = document.getElementById(targetId);
                if (targetPane) targetPane.style.display = 'block';
                playBeep(480, 'sine', 0.05);
            });
        });

        const studentBirthdays = [
            { id: 'c1', name: 'Abdan Husaini', month: 0, day: 12, wish: 'Barakallah fii umrik Abdan! Semoga sukses lolos Informatika ITS!' },
            { id: 'c2', name: 'Ahnaf Ghazy', month: 1, day: 5, wish: 'Selamat ulang tahun Ahnaf si Aljabar! Sukses Aktuaria ITB!' },
            { id: 'c3', name: 'Arfa Rausyan', month: 2, day: 18, wish: 'Happy birthday Arfa Sang Pemikir! Jaya di UI!' },
            { id: 'c4', name: 'Asa Kemal', month: 3, day: 24, wish: 'Selamat hari lahir Asa! Calon insinyur sipil UGM!' },
            { id: 'c5', name: 'Asyam Taufiq', month: 4, day: 9, wish: 'Milad saeed Asyam! Berkah selalu di IPB!' },
            { id: 'c6', name: 'Asyraf Raziq', month: 5, day: 14, wish: 'Selamat ulang tahun Asyraf! Calon maestro mesin ITS!' },
            { id: 'c7', name: 'Ayaka Fawwaz', month: 6, day: 27, wish: 'HBD Ayaka! Sukses arsitek hebat di UB!' },
            { id: 'c8', name: 'Azis Army', month: 7, day: 8, wish: 'Dirgahayu Danmen Azis! Jaga kekompakan kelas selalu!' },
            { id: 'c9', name: 'Bagaskara Boemi', month: 7, day: 17, wish: 'Selamat ultah Bagas mentari fajar! Calon engineer elektro ITS!' },
            { id: 'c10', name: 'Damar Al Fathih', month: 8, day: 3, wish: 'Happy birthday Damar! Pelita kebaikan Farmasi UGM!' },
            { id: 'c11', name: 'Fadel Thufail', month: 8, day: 15, wish: 'Selamat milad Fadel! Sukses ekonom handal FEB UI!' },
            { id: 'c12', name: 'Faeyza Jovano', month: 8, day: 28, wish: 'HBD Faeyza! Gaspol Teknik Industri ITB!' },
            { id: 'c13', name: 'Fathu Rizqi', month: 9, day: 10, wish: 'Selamat ulang tahun Pak Sekre Fathu! Arsip kelas selalu rapi!' },
            { id: 'c14', name: 'Iqbal Qodama', month: 9, day: 22, wish: 'Selamat ulang tahun Pak KM Iqbal Qodama! Komandan matematika KDNATOES!' },
            { id: 'c15', name: 'M Zaidan', month: 10, day: 4, wish: 'Barakallah Zaidan! Calon dokter spesialis UNAIR!' },
            { id: 'c16', name: 'M. Anas Afif', month: 10, day: 16, wish: 'HBD Wakil Ketua Anas Dingin! Kepala dingin, eksekusi presisi!' },
            { id: 'c17', name: 'M. Wafizzaliq', month: 10, day: 29, wish: 'Selamat ultah Wafizzaliq! Jawara Ilkom UB!' },
            { id: 'c18', name: 'Muflih Davin', month: 11, day: 7, wish: 'Milad saeed Muflih Davin! Sukses Statistika Bisnis ITS!' },
            { id: 'c19', name: 'Fauzan Hilmy', month: 11, day: 19, wish: 'Selamat hari lahir Fauzan! Calon psikolog hebat UGM!' },
            { id: 'c20', name: 'Azzamy Syauqi', month: 0, day: 3, wish: 'Happy birthday Bendahara Azzamy! Kas kelas aman sentosa!' },
            { id: 'c21', name: 'Daffa Yardan', month: 1, day: 14, wish: 'Selamat ultah Daffa! Calon kapten maritim ITS!' },
            { id: 'c22', name: 'Farras Kurnia', month: 2, day: 25, wish: 'Dirgahayu Farras! Calon jagoan elektro UB!' },
            { id: 'c23', name: 'Rizky Setiawan', month: 3, day: 11, wish: 'Selamat ulang tahun Rizky! Olahragawan handal UNESA!' },
            { id: 'c24', name: 'Sholahudin Rasya', month: 4, day: 20, wish: 'HBD Habibie Rasya! Menembus dirgantara FTMD ITB!' },
            { id: 'c25', name: 'Syawal Satriaji', month: 5, day: 1, wish: 'Selamat milad Syawal! Ksatria HI UNAIR!' },
            { id: 'c26', name: 'Muhammad Yardan', month: 6, day: 19, wish: 'Happy birthday Yardan! Sukses Agropreneur UB!' },
            { id: 'c27', name: 'Nahla Kemal', month: 7, day: 30, wish: 'Barakallah Nahla! Calon PR Director UNPAD!' },
            { id: 'c28', name: 'Nathan Ferdwiansyah', month: 8, day: 12, wish: 'Selamat ulang tahun Nathan! Mastermind dev Windows 98 XII-E!' },
            { id: 'c29', name: 'Naufal Surya', month: 9, day: 8, wish: 'Dirgahayu Naufal Surya! Calon geodesi mapper UGM!' },
            { id: 'c30', name: 'Naufal Syamil', month: 10, day: 21, wish: 'Selamat ultah Syamil Kesenian! Creative Director UI!' },
            { id: 'c31', name: 'Radithya Dzaky', month: 11, day: 5, wish: 'HBD Radithya Fotografer! Mengabadikan tiap momen XII-E!' },
            { id: 'c32', name: 'Rais Widaya', month: 11, day: 26, wish: 'Selamat hari lahir Rais! Pilar disiplin & tata kota UNDIP!' },
            { id: 'c33', name: 'Ust Misbachul Munir', month: 6, day: 10, wish: 'Mabruk alfa mabruk Ustadz Misbachul Munir tercinta! Sehat selalu membimbing XII-E!' }
        ];

        let currYear = 2026;
        let currMonth = 8; // September

        const monthNames = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];

        function renderCalendar(year, month) {
            const container = document.getElementById('cal-days-container');
            const title = document.getElementById('cal-month-title');
            if (!container || !title) return;

            title.textContent = `${monthNames[month]} ${year}`;
            container.innerHTML = '';

            const firstDayIndex = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            for (let i = 0; i < firstDayIndex; i++) {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'cal-day-cell';
                emptyCell.style.background = '#f5f6fa';
                emptyCell.style.opacity = '0.4';
                container.appendChild(emptyCell);
            }

            const today = new Date();
            for (let day = 1; day <= daysInMonth; day++) {
                const cell = document.createElement('div');
                cell.className = 'cal-day-cell';

                const bdays = studentBirthdays.filter(b => b.month === month && b.day === day);
                const isToday = (today.getFullYear() === year && today.getMonth() === month && today.getDate() === day);

                if (isToday) cell.classList.add('is-today');
                if (bdays.length > 0) cell.classList.add('has-birthday');

                const numSpan = document.createElement('span');
                numSpan.className = 'cal-day-num';
                numSpan.textContent = day;
                cell.appendChild(numSpan);

                if (bdays.length > 0) {
                    bdays.forEach(b => {
                        const badge = document.createElement('span');
                        badge.className = 'cal-bday-badge';
                        badge.textContent = '🎂 ' + b.name.split(' ')[0];
                        cell.appendChild(badge);
                    });
                }

                cell.addEventListener('click', () => {
                    const infoBox = document.getElementById('cal-selected-info');
                    if (!infoBox) return;
                    if (bdays.length > 0) {
                        infoBox.innerHTML = bdays.map(b => `<strong>🎉 Ulang Tahun: ${b.name}!</strong> — <em>"${b.wish}"</em>`).join('<br>');
                        infoBox.style.background = '#e8f8f5';
                        infoBox.style.border = '2px solid #27ae60';
                        playBeep(600, 'sine', 0.1);
                    } else {
                        infoBox.innerHTML = `Tanggal <strong>${day} ${monthNames[month]} ${year}</strong>: Agenda reguler KDNATOES XII-E. Tetap semangat menuntut ilmu!`;
                        infoBox.style.background = '#fffbe7';
                        infoBox.style.border = '1px inset #808080';
                        playBeep(400, 'sine', 0.05);
                    }
                });

                container.appendChild(cell);
            }
        }

        const prevBtn = document.getElementById('cal-prev-btn');
        const nextBtn = document.getElementById('cal-next-btn');
        const todayBtn = document.getElementById('cal-today-btn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currMonth--;
                if (currMonth < 0) { currMonth = 11; currYear--; }
                renderCalendar(currYear, currMonth);
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currMonth++;
                if (currMonth > 11) { currMonth = 0; currYear++; }
                renderCalendar(currYear, currMonth);
            });
        }
        if (todayBtn) {
            todayBtn.addEventListener('click', () => {
                const now = new Date();
                currYear = now.getFullYear();
                currMonth = now.getMonth();
                renderCalendar(currYear, currMonth);
            });
        }

        renderCalendar(currYear, currMonth);

        function updateCountdowns() {
            const now = new Date().getTime();

            function updateTimer(targetTime, dId, hId, mId, sId) {
                const diff = targetTime - now;
                if (diff <= 0) {
                    if (document.getElementById(dId)) document.getElementById(dId).textContent = '000';
                    return;
                }
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                if (document.getElementById(dId)) document.getElementById(dId).textContent = String(days).padStart(3, '0');
                if (document.getElementById(hId)) document.getElementById(hId).textContent = String(hours).padStart(2, '0');
                if (document.getElementById(mId)) document.getElementById(mId).textContent = String(minutes).padStart(2, '0');
                if (document.getElementById(sId)) document.getElementById(sId).textContent = String(seconds).padStart(2, '0');
            }

            updateTimer(new Date('2027-05-01T08:00:00').getTime(), 'wisuda-days', 'wisuda-hours', 'wisuda-mins', 'wisuda-secs');
            updateTimer(new Date('2027-04-22T06:45:00').getTime(), 'utbk-days', 'utbk-hours', 'utbk-mins', 'utbk-secs');
        }

        setInterval(updateCountdowns, 1000);
        updateCountdowns();
    }

    // ======================================================================
    // 23. Mading Virtual (Interactive 32-Student Radar & Sticky Notes)
    // ======================================================================
    function initMadingVirtual() {
        const radarGrid = document.getElementById('mading-radar-grid');
        const hoverCard = document.getElementById('mading-hover-card');
        const cardAvatar = document.getElementById('mading-card-avatar');
        const cardName = document.getElementById('mading-card-name');
        const cardRole = document.getElementById('mading-card-role');
        const cardQuote = document.getElementById('mading-card-quote');
        const cardPtn = document.getElementById('mading-card-ptn');
        const menuAddNote = document.getElementById('menu-mading-add-note');
        const notesContainer = document.getElementById('mading-sticky-notes');

        if (!radarGrid) return;

        radarGrid.innerHTML = '';
        arcadeCharacters.forEach((char, idx) => {
            const btn = document.createElement('button');
            btn.className = 'mading-badge-btn';
            btn.textContent = char.tag ? char.tag.split(' ')[0] : '#' + (idx + 1);
            if (char.isBoss) {
                btn.style.background = '#f39c12';
                btn.style.color = '#000';
            } else if (char.badge === 'KM' || char.badge === 'WK') {
                btn.style.background = '#0984e3';
            } else if (char.badge === 'SK' || char.badge === 'BD') {
                btn.style.background = '#6c5ce7';
            } else {
                btn.style.background = '#34495e';
            }

            btn.title = char.name + ' (' + char.role + ')';

            btn.addEventListener('mouseenter', (e) => {
                if (!hoverCard) return;
                const extra = alumniExtendedData[char.id] || {};
                if (cardAvatar) {
                    cardAvatar.textContent = char.initials || 'XII';
                    cardAvatar.style.background = char.color || '#0984e3';
                }
                if (cardName) cardName.textContent = (idx + 1) + '. ' + char.name;
                if (cardRole) cardRole.textContent = char.role + ' • ' + (char.title || '');
                if (cardQuote) cardQuote.textContent = '“' + (char.quote || 'Semangat KDNATOES!') + '”';
                if (cardPtn) cardPtn.textContent = '🎯 ' + (extra.ptn || 'PTN Impian');

                hoverCard.style.display = 'block';
                const rect = btn.getBoundingClientRect();
                const container = btn.closest('.mading-radar-container');
                if (container) {
                    const parentRect = container.getBoundingClientRect();
                    let leftPos = rect.left - parentRect.left - 40;
                    let topPos = rect.bottom - parentRect.top + 6;
                    if (leftPos + 220 > parentRect.width) leftPos = parentRect.width - 230;
                    if (leftPos < 10) leftPos = 10;
                    hoverCard.style.left = leftPos + 'px';
                    hoverCard.style.top = topPos + 'px';
                }
                playBeep(700, 'sine', 0.03);
            });

            btn.addEventListener('mouseleave', () => {
                if (hoverCard) hoverCard.style.display = 'none';
            });

            radarGrid.appendChild(btn);
        });

        function addNewStickyNote(text, sender = 'Siswa XII-E') {
            if (!notesContainer || !text) return;
            const note = document.createElement('div');
            note.className = 'sticky-note win-outset';
            const colors = ['#fffb8f', '#e1f5fe', '#f8bbd0', '#dcedc8'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const rot = (Math.random() * 4 - 2).toFixed(1);
            note.style.background = randomColor;
            note.style.border = '1px solid rgba(0,0,0,0.2)';
            note.style.padding = '8px';
            note.style.fontFamily = "'Courier New', monospace";
            note.style.fontSize = '11px';
            note.style.transform = `rotate(${rot}deg)`;
            note.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.2)';
            note.style.position = 'relative';

            note.innerHTML = `
                <div style="position: absolute; top: -5px; right: 8px; width: 10px; height: 10px; background: #e74c3c; border-radius: 50%; border: 1px solid #000;"></div>
                <strong>[${sender.toUpperCase()}]</strong><br>
                "${text}"
            `;
            notesContainer.appendChild(note);
        }

        if (menuAddNote) {
            menuAddNote.addEventListener('click', () => {
                const msg = prompt('Tulis catatan sticky note untuk ditempel di mading:', 'XII-E pasti sukses menembus kampus impian!');
                if (msg && msg.trim()) {
                    const sender = prompt('Nama Anda (pengirim):', 'Alumni XII-E') || 'Anonim';
                    addNewStickyNote(msg.trim(), sender.trim());
                    try {
                        const existing = JSON.parse(localStorage.getItem('kdnatoes_mading_notes') || '[]');
                        existing.push({ text: msg.trim(), sender: sender.trim() });
                        localStorage.setItem('kdnatoes_mading_notes', JSON.stringify(existing));
                    } catch (e) { }
                    playBeep(520, 'sine', 0.1);
                }
            });
        }

        try {
            const saved = JSON.parse(localStorage.getItem('kdnatoes_mading_notes') || '[]');
            saved.forEach(n => addNewStickyNote(n.text, n.sender));
        } catch (e) { }
    }

    // ======================================================================
    // 24. Friendster Profile Network 2000-an & Glitter Engine
    // ======================================================================
    function initFriendsterNetwork() {
        const studentSelect = document.getElementById('friendster-student-select');
        const avatarBox = document.getElementById('fst-avatar-box');
        const profileName = document.getElementById('fst-profile-name');
        const profileRole = document.getElementById('fst-profile-role');
        const statusElem = document.getElementById('fst-status');
        const ptnElem = document.getElementById('fst-ptn');
        const careerElem = document.getElementById('fst-career');
        const foodElem = document.getElementById('fst-food');
        const songElem = document.getElementById('fst-song');
        const quoteElem = document.getElementById('fst-quote');
        const top8Grid = document.getElementById('fst-top8-grid');
        const testiList = document.getElementById('fst-testi-list');
        const testiCount = document.getElementById('fst-testi-count');
        const btnSendTesti = document.getElementById('btn-fst-send-testi');
        const inputSender = document.getElementById('fst-input-sender');
        const inputMsg = document.getElementById('fst-input-msg');
        const footerStatus = document.getElementById('fst-footer-status');
        const friendsterWin = document.getElementById('friendster-window');

        if (!studentSelect) return;

        studentSelect.innerHTML = '';
        arcadeCharacters.forEach((char, i) => {
            const opt = document.createElement('option');
            opt.value = char.id;
            opt.textContent = (i + 1) + '. ' + char.name + (char.role ? ' (' + char.role + ')' : '');
            studentSelect.appendChild(opt);
        });

        const relationshipStatuses = [
            'Menikah dengan Buku Matematika IPA Inten',
            'Berpacaran dengan Target SBMPTN & SNBT',
            'Single & Sedang Fokus Meraih Cita-cita',
            'Taken by Kampus Impian',
            'Sedang Galau Menunggu Pengumuman Tryout',
            'Setia Bersama Persaudaraan XII-E',
            'Menunggu Jawaban dari Dia yang di Kelas Sebelah'
        ];

        const kantinFoods = [
            'Mie Ayam Bakso Pak Kumis + Es Jeruk',
            'Nasi Goreng Kantin Belakang + Es Teh Manis Jumbo',
            'Gorengan Tempe Mendoan + Sambal Kecap',
            'Siomay Ikan Tenggiri Bu Joko',
            'Soto Ayam Lamongan + Kerupuk Putih',
            'Batagor Renyah Bumbu Kacang Pedas'
        ];

        const retroSongs = [
            'Sheila on 7 - Sahabat Sejati',
            'Peterpan - Sahabat',
            'Padi - Menanti Sebuah Jawaban',
            'Dewa 19 - Kangen',
            'Kahitna - Cantik',
            'Project Pop - Ingat-Ingat Lupa'
        ];

        function renderFriendsterProfile(charId) {
            const char = arcadeCharacters.find(c => c.id === charId) || arcadeCharacters[0];
            const extra = alumniExtendedData[char.id] || {};

            if (avatarBox) {
                avatarBox.textContent = char.initials || 'XII';
                avatarBox.style.background = char.color || '#0984e3';
            }
            if (profileName) profileName.textContent = char.name;
            if (profileRole) profileRole.textContent = char.role + (char.title ? ' • ' + char.title : '');
            if (ptnElem) ptnElem.textContent = extra.ptn || 'Perguruan Tinggi Impian';
            if (careerElem) careerElem.textContent = extra.career || 'Profesional Berprestasi';
            if (quoteElem) quoteElem.textContent = '“' + (char.quote || 'Semangat KDNATOES!') + '”';
            if (footerStatus) footerStatus.textContent = char.name;

            const charIndex = parseInt(char.id.replace('c', ''), 10) || 1;
            if (statusElem) statusElem.textContent = relationshipStatuses[charIndex % relationshipStatuses.length];
            if (foodElem) foodElem.textContent = kantinFoods[charIndex % kantinFoods.length];
            if (songElem) songElem.textContent = retroSongs[charIndex % retroSongs.length];

            if (top8Grid) {
                top8Grid.innerHTML = '';
                const peers = arcadeCharacters.filter(c => c.id !== char.id);
                for (let k = 0; k < 8; k++) {
                    const peer = peers[(charIndex + k) % peers.length];
                    if (!peer) continue;
                    const item = document.createElement('div');
                    item.className = 'fst-top8-item';
                    item.innerHTML = `
                        <div style="width: 28px; height: 28px; margin: 0 auto 2px; background: ${peer.color || '#0984e3'}; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 1px solid #000; font-size: 10px;">
                            ${peer.initials || 'X'}
                        </div>
                        <span style="display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${peer.name.split(' ')[0]}</span>
                    `;
                    item.addEventListener('click', () => {
                        studentSelect.value = peer.id;
                        renderFriendsterProfile(peer.id);
                        playBeep(450, 'sine', 0.05);
                    });
                    top8Grid.appendChild(item);
                }
            }

            if (testiList) {
                testiList.innerHTML = '';
                const baseTestis = [
                    { sender: 'Iqbal Qodama', text: `${char.name.split(' ')[0]} ini kawan seperjuangan terbaik di kelas! Sukses selalu bro!` },
                    { sender: 'M. Anas Afif', text: `Selalu kompak dan bisa diandalkan. Sampai jumpa di kampus impian!` },
                    { sender: 'Ust Misbachul Munir', text: `Ananda hebat, pertahankan ketekunan dan budi pekerti luhur.` }
                ];

                let customTestis = [];
                try {
                    customTestis = JSON.parse(localStorage.getItem('kdnatoes_fst_testi_' + char.id) || '[]');
                } catch (e) { }

                const allTestis = [...baseTestis, ...customTestis];
                if (testiCount) testiCount.textContent = allTestis.length;

                allTestis.forEach(t => {
                    const bubble = document.createElement('div');
                    bubble.className = 'fst-testi-bubble';
                    bubble.innerHTML = `<strong>${t.sender}:</strong> "${t.text}"`;
                    testiList.appendChild(bubble);
                });
            }
        }

        studentSelect.addEventListener('change', () => {
            renderFriendsterProfile(studentSelect.value);
            playBeep(520, 'sine', 0.05);
        });

        if (btnSendTesti) {
            btnSendTesti.addEventListener('click', () => {
                const sender = (inputSender && inputSender.value.trim()) ? inputSender.value.trim() : 'Kawan XII-E';
                const msg = inputMsg ? inputMsg.value.trim() : '';
                if (!msg) {
                    alert('Mohon ketikkan pesan testimonial!');
                    return;
                }
                const curId = studentSelect.value;
                try {
                    const existing = JSON.parse(localStorage.getItem('kdnatoes_fst_testi_' + curId) || '[]');
                    existing.push({ sender, text: msg });
                    localStorage.setItem('kdnatoes_fst_testi_' + curId, JSON.stringify(existing));
                } catch (e) { }
                if (inputMsg) inputMsg.value = '';
                renderFriendsterProfile(curId);
                playBeep(650, 'sine', 0.1);
            });
        }

        if (friendsterWin) {
            let lastSparkle = 0;
            friendsterWin.addEventListener('mousemove', (e) => {
                const now = Date.now();
                if (now - lastSparkle < 80) return;
                lastSparkle = now;

                const sparkle = document.createElement('div');
                sparkle.className = 'glitter-sparkle';
                sparkle.textContent = ['✨', '⭐', '🌟', '💫'][Math.floor(Math.random() * 4)];
                sparkle.style.left = e.clientX + 'px';
                sparkle.style.top = e.clientY + 'px';
                sparkle.style.setProperty('--dx', (Math.random() * 30 - 15) + 'px');
                sparkle.style.setProperty('--dy', (Math.random() * 30 - 15) + 'px');
                document.body.appendChild(sparkle);
                setTimeout(() => sparkle.remove(), 600);
            });
        }

        renderFriendsterProfile('c14');
    }

    // ======================================================================
    // 25. Windows Plus! 98 Theme Switcher Engine
    // ======================================================================
    function initThemeManager() {
        const themeSelect = document.getElementById('theme-selector-dropdown');
        const previewScreen = document.getElementById('theme-preview-screen');
        const previewTitlebar = document.getElementById('theme-preview-titlebar');
        const descText = document.getElementById('theme-description-text');
        const btnApply = document.getElementById('btn-theme-apply');
        const btnOk = document.getElementById('btn-theme-ok');
        const btnCancel = document.getElementById('btn-theme-cancel');
        const themeWin = document.getElementById('themes-window');

        const themeMeta = {
            teal: {
                bg: '#008080',
                titlebar: 'linear-gradient(90deg, #000080, #1084d0)',
                desc: 'Desktop tosca legendaris dengan title bar biru navy dan tombol 3D bevel khas Windows 98.'
            },
            gray: {
                bg: '#5a6268',
                titlebar: 'linear-gradient(90deg, #343a40, #6c757d)',
                desc: 'Nuansa abu-abu monokromatik industri klasik Windows 95, tenang dan fokus.'
            },
            space: {
                bg: '#060913',
                titlebar: 'linear-gradient(90deg, #4834d4, #686de0)',
                desc: 'Tema luar angkasa Windows Plus! 98 dengan wallpaper kosmik dan aksen neon berpendar.'
            },
            gold: {
                bg: '#0f1d36',
                titlebar: 'linear-gradient(90deg, #b7950b, #d4af37)',
                desc: 'Edisi mewah KDNATOES Royal Gold dengan wallpaper biru malam dan title bar emas berkilau.'
            }
        };

        function updatePreview(themeKey) {
            const meta = themeMeta[themeKey] || themeMeta.teal;
            if (previewScreen) previewScreen.style.background = meta.bg;
            if (previewTitlebar) previewTitlebar.style.background = meta.titlebar;
            if (descText) descText.textContent = meta.desc;
        }

        function applyTheme(themeKey) {
            document.body.classList.remove('theme-teal', 'theme-gray', 'theme-space', 'theme-gold');
            document.body.classList.add('theme-' + themeKey);
            try {
                localStorage.setItem('kdnatoes_win_theme', themeKey);
            } catch (e) { }
            playChordSound();
        }

        if (themeSelect) {
            themeSelect.addEventListener('change', () => {
                updatePreview(themeSelect.value);
                playBeep(450, 'sine', 0.05);
            });
        }

        if (btnApply) {
            btnApply.addEventListener('click', () => {
                if (themeSelect) applyTheme(themeSelect.value);
            });
        }

        if (btnOk) {
            btnOk.addEventListener('click', () => {
                if (themeSelect) applyTheme(themeSelect.value);
                if (themeWin) themeWin.style.display = 'none';
                const tab = document.querySelector('.taskbar-tab[data-target="themes-window"]');
                if (tab) tab.classList.remove('is-active');
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', () => {
                if (themeWin) themeWin.style.display = 'none';
                const tab = document.querySelector('.taskbar-tab[data-target="themes-window"]');
                if (tab) tab.classList.remove('is-active');
            });
        }

        try {
            const savedTheme = localStorage.getItem('kdnatoes_win_theme') || 'teal';
            if (themeSelect) themeSelect.value = savedTheme;
            updatePreview(savedTheme);
            if (savedTheme !== 'teal') {
                document.body.classList.add('theme-' + savedTheme);
            }
        } catch (e) { }
    }

    // ======================================================================
    // 26. Enhanced Screensaver (3 Modes) & BSOD Keyboard Handler
    // ======================================================================
    function initEnhancedScreensaverAndBsod() {
        let idleSecs = 0;
        setInterval(() => {
            idleSecs++;
            if (idleSecs >= 60 && !isScreensaverActive) {
                launchScreensaver();
            }
        }, 1000);

        function resetIdle() {
            idleSecs = 0;
            if (isScreensaverActive) {
                dismissScreensaver();
            }
        }

        ['mousemove', 'mousedown', 'keydown', 'touchstart'].forEach(evt => {
            window.addEventListener(evt, resetIdle, { passive: true });
        });

        window.addEventListener('keydown', (e) => {
            if (bsodOverlay && bsodOverlay.classList.contains('is-active')) {
                dismissBsod();
            }
        });
    }

    // Run new module inits
    initTelkomNet();
    initCalendarAndCountdown();
    initMadingVirtual();
    initFriendsterNetwork();
    initThemeManager();
    initEnhancedScreensaverAndBsod();

});
