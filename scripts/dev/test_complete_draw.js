// Validate complete processUploadedPhotoToPixelPlayer implementation
function processUploadedPhotoToPixelPlayer(img, char = {}) {
    // 1. Prepare 140x160 analysis canvas
    const aCanvas = document.createElement('canvas');
    aCanvas.width = 140;
    aCanvas.height = 160;
    const aCtx = aCanvas.getContext('2d');

    // Waist-up bust focus crop
    const W_orig = img.naturalWidth || img.width || 140;
    const H_orig = img.naturalHeight || img.height || 160;
    const targetRatio = 140 / 160;
    let sX = 0, sY = 0, sW = W_orig, sH = H_orig;
    if (W_orig / H_orig > targetRatio) {
        sW = Math.round(H_orig * targetRatio);
        sX = Math.round((W_orig - sW) / 2);
    } else {
        sH = Math.round(W_orig / targetRatio);
        sY = Math.max(0, Math.round((H_orig - sH) * 0.08));
    }
    aCtx.drawImage(img, sX, sY, sW, sH, 0, 0, 140, 160);

    const imgData = aCtx.getImageData(0, 0, 140, 160);
    const d = imgData.data;

    function getPixel(x, y) {
        const idx = (Math.max(0, Math.min(159, y)) * 140 + Math.max(0, Math.min(139, x))) * 4;
        return [d[idx], d[idx + 1], d[idx + 2], d[idx + 3]];
    }

    function lum(rgb) {
        return 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
    }

    // A. Sample Face / Skin Tone (x: 65..95, y: 55..78)
    const faceSamples = [];
    for (let y = 55; y <= 78; y += 2) {
        for (let x = 65; x <= 95; x += 2) {
            faceSamples.push(getPixel(x, y));
        }
    }
    faceSamples.sort((a, b) => lum(a) - lum(b));
    const rawSkin = faceSamples[Math.floor(faceSamples.length * 0.55)] || [226, 155, 116];

    const skR = Math.min(255, Math.max(200, Math.round(rawSkin[0] * 1.15)));
    const skG = Math.min(255, Math.max(150, Math.round(rawSkin[1] * 1.10)));
    const skB = Math.min(255, Math.max(120, Math.round(rawSkin[2] * 1.05)));
    const colSkinLight = `rgb(${skR}, ${skG}, ${skB})`;
    const colSkinShadow = `rgb(${Math.round(skR * 0.78)}, ${Math.round(skG * 0.68)}, ${Math.round(skB * 0.60)})`;
    const colSkinHi = `rgb(${Math.min(255, skR + 15)}, ${Math.min(255, skG + 15)}, ${Math.min(255, skB + 15)})`;

    // B. Sample Hair Tone (x: 55..100, y: 20..42)
    const hairSamples = [];
    for (let y = 20; y <= 42; y += 2) {
        for (let x = 55; x <= 100; x += 2) {
            hairSamples.push(getPixel(x, y));
        }
    }
    hairSamples.sort((a, b) => lum(a) - lum(b));
    const rawHair = hairSamples[Math.floor(hairSamples.length * 0.2)] || [28, 20, 18];
    const hDarkR = Math.min(65, rawHair[0]);
    const hDarkG = Math.min(65, rawHair[1]);
    const hDarkB = Math.min(70, rawHair[2]);
    const colHairDark = `rgb(${hDarkR}, ${hDarkG}, ${hDarkB})`;
    const colHairMid = `rgb(${Math.min(255, hDarkR + 30)}, ${Math.min(255, hDarkG + 30)}, ${Math.min(255, hDarkB + 30)})`;
    const colHairHi = `rgb(${Math.min(255, hDarkR + 55)}, ${Math.min(255, hDarkG + 55)}, ${Math.min(255, hDarkB + 60)})`;

    // C. Sample Torso / Shirt Color (x: 55..110, y: 110..135)
    const torsoSamples = [];
    for (let y = 110; y <= 135; y += 2) {
        for (let x = 55; x <= 110; x += 2) {
            torsoSamples.push(getPixel(x, y));
        }
    }
    torsoSamples.sort((a, b) => lum(a) - lum(b));
    let rawTorso = torsoSamples[Math.floor(torsoSamples.length * 0.5)] || [245, 245, 250];
    let tR = rawTorso[0], tG = rawTorso[1], tB = rawTorso[2];
    if (char && char.color && (char.id === 'c2' || (tR > 225 && tG > 225 && tB > 225 && char.id !== 'c1'))) {
        // Can blend with character custom color
    }
    const colTorsoLight = `rgb(${tR}, ${tG}, ${tB})`;
    const colTorsoShadow = `rgb(${Math.round(tR * 0.72)}, ${Math.round(tG * 0.72)}, ${Math.round(tB * 0.72)})`;

    // D. Eye / Glasses Detection
    const eyeSamples = [];
    for (let y = 52; y <= 62; y++) {
        for (let x = 65; x <= 95; x++) {
            eyeSamples.push(getPixel(x, y));
        }
    }
    const avgEyeLum = eyeSamples.reduce((s, c) => s + lum(c), 0) / (eyeSamples.length || 1);
    const hasGlasses = avgEyeLum < 75 || (char && (char.id === 'c2' || (char.title && char.title.includes('Sub-Zero'))));

    // E. Smile / Teeth Detection
    let whiteTeethPixels = 0;
    for (let y = 72; y <= 82; y++) {
        for (let x = 70; x <= 92; x++) {
            if (lum(getPixel(x, y)) > 175) whiteTeethPixels++;
        }
    }
    const hasTeeth = whiteTeethPixels >= 6;

    // F. Prop Detection
    let redVotes = 0;
    let cyanVotes = 0;
    for (let y = 45; y <= 105; y += 3) {
        for (let x = 18; x <= 55; x += 3) {
            const p = getPixel(x, y);
            if (p[0] > p[1] + 25 && p[0] > p[2] + 25) redVotes++;
            if (p[2] > p[0] + 20 && p[1] > p[0] + 15) cyanVotes++;
        }
    }
    const isTablet = cyanVotes > 15 || (char && (char.id === 'c2' || (char.title && char.title.includes('Sub-Zero'))));

    // 2. Create 140x160 player canvas
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 140;
    pCanvas.height = 160;
    const ctx = pCanvas.getContext('2d');

    function drawPoly(pts, fill, stroke = null, strokeW = 1) {
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) {
            ctx.lineTo(pts[i][0], pts[i][1]);
        }
        ctx.closePath();
        if (fill) {
            ctx.fillStyle = fill;
            ctx.fill();
        }
        if (stroke) {
            ctx.strokeStyle = stroke;
            ctx.lineWidth = strokeW;
            ctx.stroke();
        }
    }

    function drawPx(x, y, col) {
        ctx.fillStyle = col;
        ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    }

    function drawRect(x, y, w, h, fill) {
        ctx.fillStyle = fill;
        ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
    }

    function drawLine(x1, y1, x2, y2, stroke, w = 1) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = stroke;
        ctx.lineWidth = w;
        ctx.stroke();
    }

    // 1. Torso
    for (let y = 120; y < 160; y++) {
        const w_chest = 40 + Math.floor((y - 120) * 0.5);
        for (let x = 70 - w_chest; x < 70 + w_chest; x++) {
            const col = (x < 40 || x > 95 || y > 145) ? colTorsoShadow : colTorsoLight;
            drawPx(x, y, col);
        }
    }
    drawPoly([[56, 118], [70, 134], [66, 135], [50, 126]], colTorsoLight, colTorsoShadow);
    drawPoly([[84, 118], [70, 134], [74, 135], [90, 126]], colTorsoLight, colTorsoShadow);
    drawRect(68, 126, 4, 22, isTablet ? '#0984e3' : (char.color || '#e74c3c'));

    // 2. Head & Neck
    const face_cx = 82, face_cy = 85;
    for (let ny = 104; ny <= 124; ny++) {
        for (let nx = face_cx - 10; nx <= face_cx + 10; nx++) {
            drawPx(nx, ny, colSkinShadow);
        }
    }
    for (let y = face_cy - 26; y <= face_cy + 25; y++) {
        const dy = y - face_cy;
        const w_f = dy > 0 ? Math.floor(22 - dy * 0.48) : Math.floor(22 - Math.abs(dy) * 0.15);
        for (let x = face_cx - w_f; x <= face_cx + w_f; x++) {
            const col = x < face_cx - 6 ? colSkinShadow : (x > face_cx + 7 ? colSkinHi : colSkinLight);
            drawPx(x, y, col);
        }
    }
    // Ear right
    for (let ey = 80; ey <= 94; ey++) {
        for (let ex = face_cx + 20; ex <= face_cx + 26; ex++) {
            drawPx(ex, ey, ex < face_cx + 23 ? colSkinLight : colSkinShadow);
        }
    }

    // 3. Features
    if (hasGlasses) {
        drawPoly([[62, 73], [102, 73], [98, 83], [64, 83]], '#0f172a');
        drawRect(66, 75, 12, 2, '#00e5ff');
        drawRect(84, 75, 12, 2, '#00e5ff');
        drawRect(72, 78, 4, 1, '#ffffff');
        drawRect(90, 78, 4, 1, '#ffffff');
    } else {
        for (let bx = 68; bx <= 76; bx++) { drawPx(bx, 73, colHairDark); drawPx(bx, 74, colHairDark); }
        for (let bx = 85; bx <= 98; bx++) {
            const by = 72 - Math.floor((bx - 85) * 0.2);
            drawPx(bx, by, colHairDark);
            drawPx(bx, by + 1, colHairDark);
        }
        drawLine(70, 78, 76, 78, colHairDark, 2);
        drawPx(73, 79, '#5a1818');
        drawLine(86, 77, 95, 77, colHairDark, 2);
        drawPx(90, 78, '#1e1412');
        drawPx(91, 78, '#1e1412');
        drawPx(92, 78, '#ffffff');
    }

    drawLine(81, 80, 81, 89, colSkinShadow, 1);
    drawPx(80, 89, colSkinShadow);
    drawPx(82, 89, colSkinLight);

    // Mouth
    const mouth_y = 96;
    if (hasTeeth) {
        for (let my = mouth_y; my <= mouth_y + 8; my++) {
            const mw = Math.floor(14 - Math.pow(my - mouth_y - 2, 2) * 0.25);
            if (mw > 0) {
                for (let mx = face_cx - mw + 1; mx <= face_cx + mw - 1; mx++) {
                    drawPx(mx, my, '#5a1818');
                }
            }
        }
        for (let tx = face_cx - 10; tx <= face_cx + 10; tx++) {
            drawPx(tx, mouth_y + 1, '#ffffff');
            drawPx(tx, mouth_y + 2, '#ffffff');
            drawPx(tx, mouth_y + 3, Math.abs(tx - face_cx) < 8 ? '#ffffff' : '#5a1818');
        }
        for (let tx = face_cx - 6; tx <= face_cx + 6; tx++) {
            drawPx(tx, mouth_y + 6, '#e15a64');
        }
        ctx.beginPath();
        ctx.arc(face_cx, mouth_y + 4, 13, 0, Math.PI);
        ctx.strokeStyle = '#c3695a';
        ctx.stroke();
    } else {
        drawLine(face_cx - 8, mouth_y + 2, face_cx + 8, mouth_y + 1, '#5a1818', 2);
        drawLine(face_cx - 6, mouth_y + 2, face_cx + 6, mouth_y + 2, '#ffffff', 1);
    }

    // 4. Spiky Hair
    const hairSpikes = [
        [65, 62, 58, 44, 7],
        [72, 60, 68, 38, 8],
        [80, 58, 82, 34, 9],
        [88, 58, 96, 36, 8],
        [96, 62, 108, 40, 8],
        [102, 66, 116, 48, 7],
        [106, 72, 120, 60, 6],
        [102, 80, 114, 76, 5],
        [75, 66, 73, 52, 6],
        [85, 64, 88, 48, 7],
        [94, 66, 100, 52, 6],
        [68, 70, 62, 56, 6]
    ];
    for (let y = 48; y <= 76; y++) {
        for (let x = 62; x <= 108; x++) {
            if (Math.pow(x - 85, 2) / 576 + Math.pow(y - 70, 2) / 256 <= 1) {
                drawPx(x, y, colHairMid);
            }
        }
    }
    hairSpikes.forEach(([bx, by, tx, ty, thick]) => {
        const half = Math.floor(thick / 2);
        drawPoly([[bx - half, by], [tx, ty], [bx + half, by]], colHairDark);
        drawLine(bx, by, tx, ty, colHairMid, 2);
        drawPx(tx, ty, colHairHi);
    });
    const bangs = [[68, 68], [72, 70], [76, 69], [80, 72], [84, 70], [88, 71], [94, 69]];
    bangs.forEach(([fx, fy]) => {
        drawPoly([[fx - 3, fy - 6], [fx, fy], [fx + 3, fy - 6]], colHairDark);
    });

    // 5. Held Prop (Book or Tablet)
    const bookPts = [[16, 56], [64, 46], [68, 134], [20, 144]];
    if (isTablet) {
        drawPoly([[14, 58], [18, 55], [22, 143], [18, 146]], '#0a192d');
        drawPoly(bookPts, '#0f233c', '#00e5ff');
        ctx.beginPath();
        ctx.ellipse(41, 86, 11, 11, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 2;
        ctx.stroke();
        drawRect(24, 60, 32, 2, '#00e5ff');
        drawRect(26, 67, 22, 1, '#ffffff');
        drawRect(24, 110, 32, 2, '#f1c40f');
    } else {
        drawPoly([[14, 58], [18, 55], [22, 143], [18, 146]], '#dcd7cd');
        drawPoly(bookPts, '#f8f2eb');
        drawPoly([[17, 56], [64, 46], [65, 78], [18, 88]], '#d2232d');
        drawPoly([[19, 108], [66, 98], [68, 134], [20, 144]], '#d2232d');
        drawLine(24, 65, 58, 58, '#ffffff', 3);
        drawLine(28, 71, 54, 66, '#ffffff', 2);
        drawPoly([[22, 85], [62, 77], [64, 102], [24, 110]], '#282d3c');
        const crowdDots = [[28, 92], [34, 91], [40, 90], [46, 89], [52, 88], [30, 97], [36, 96], [42, 95], [48, 94]];
        crowdDots.forEach(([px, py]) => drawPx(px, py, '#dcb4a0'));
        drawLine(26, 120, 60, 113, '#ffffff', 3);
        drawLine(28, 127, 58, 121, '#ffd700', 2);
        drawPoly(bookPts, null, '#9b141e', 1);
    }
    for (let sy = 58; sy <= 138; sy += 10) {
        drawRect(16, sy, 5, 3, '#dfe6e9');
    }

    // 6. Hands holding prop
    drawPoly([[6, 120], [18, 108], [24, 114], [12, 132]], colSkinShadow);
    const fingers = [[15, 64, 22, 62], [16, 72, 23, 70], [17, 80, 24, 78], [18, 88, 25, 86]];
    fingers.forEach(([fx1, fy1, fx2, fy2]) => {
        drawLine(fx1, fy1, fx2, fy2, colSkinLight, 4);
        drawPx(fx2, fy2, colSkinHi);
        drawLine(fx1, fy1, fx2, fy2, '#0f0c10', 1);
    });
    drawPoly([[14, 52], [26, 48], [28, 58], [16, 62]], colSkinLight, colSkinShadow);

    // 7. Desk in foreground
    drawPoly([[15, 136], [125, 136], [138, 160], [10, 160]], '#b2bec3');
    drawPoly([[65, 132], [110, 132], [118, 150], [60, 150]], '#f5f6fa');

    // 8. Upscale to 280x320 nearest-neighbor
    const outCanvas = document.createElement('canvas');
    outCanvas.width = 280;
    outCanvas.height = 320;
    const outCtx = outCanvas.getContext('2d');
    outCtx.imageSmoothingEnabled = false;
    if ('webkitImageSmoothingEnabled' in outCtx) outCtx.webkitImageSmoothingEnabled = false;
    if ('mozImageSmoothingEnabled' in outCtx) outCtx.mozImageSmoothingEnabled = false;
    if ('msImageSmoothingEnabled' in outCtx) outCtx.msImageSmoothingEnabled = false;
    outCtx.drawImage(pCanvas, 0, 0, 280, 320);

    return outCanvas.toDataURL('image/png');
}

console.log("Syntax check complete!");
