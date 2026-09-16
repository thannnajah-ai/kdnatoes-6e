// Test the Pixel Fighter sprite generator algorithm in JavaScript
function generatePixelPlayerFromPhotoData(pixelDataGetter, char = {}) {
    const W = 140;
    const H = 160;

    function lum(rgb) {
        return 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
    }

    // A. Sample Face / Skin Tone (x: 65..95, y: 55..78)
    const faceSamples = [];
    for (let y = 55; y <= 78; y += 2) {
        for (let x = 65; x <= 95; x += 2) {
            faceSamples.push(pixelDataGetter(x, y));
        }
    }
    faceSamples.sort((a, b) => lum(a) - lum(b));
    const rawSkin = faceSamples[Math.floor(faceSamples.length * 0.55)] || [226, 155, 116];

    const skR = Math.min(255, Math.max(200, Math.round(rawSkin[0] * 1.15)));
    const skG = Math.min(255, Math.max(150, Math.round(rawSkin[1] * 1.10)));
    const skB = Math.min(255, Math.max(120, Math.round(rawSkin[2] * 1.05)));
    const colSkinLight = `rgb(${skR}, ${skG}, ${skB})`;
    const colSkinShadow = `rgb(${Math.round(skR * 0.8)}, ${Math.round(skG * 0.7)}, ${Math.round(skB * 0.62)})`;
    const colSkinHi = `rgb(${Math.min(255, skR + 15)}, ${Math.min(255, skG + 15)}, ${Math.min(255, skB + 15)})`;

    // B. Sample Hair Tone (x: 55..100, y: 20..42)
    const hairSamples = [];
    for (let y = 20; y <= 42; y += 2) {
        for (let x = 55; x <= 100; x += 2) {
            hairSamples.push(pixelDataGetter(x, y));
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
            torsoSamples.push(pixelDataGetter(x, y));
        }
    }
    torsoSamples.sort((a, b) => lum(a) - lum(b));
    let rawTorso = torsoSamples[Math.floor(torsoSamples.length * 0.5)] || [245, 245, 250];
    let tR = rawTorso[0], tG = rawTorso[1], tB = rawTorso[2];
    if (char && char.color && (char.id === 'c2' || (tR > 220 && tG > 220 && tB > 220 && char.color !== '#ffffff'))) {
        // Can adopt char color if specific role
    }
    const colTorsoLight = `rgb(${tR}, ${tG}, ${tB})`;
    const colTorsoShadow = `rgb(${Math.round(tR * 0.72)}, ${Math.round(tG * 0.72)}, ${Math.round(tB * 0.72)})`;

    // D. Eye / Glasses Detection
    const eyeSamples = [];
    for (let y = 52; y <= 62; y++) {
        for (let x = 65; x <= 95; x++) {
            eyeSamples.push(pixelDataGetter(x, y));
        }
    }
    const avgEyeLum = eyeSamples.reduce((s, c) => s + lum(c), 0) / (eyeSamples.length || 1);
    const hasGlasses = avgEyeLum < 75 || (char && (char.id === 'c2' || (char.title && char.title.includes('Sub-Zero'))));

    // E. Smile / Teeth Detection
    let whiteTeethPixels = 0;
    for (let y = 72; y <= 82; y++) {
        for (let x = 70; x <= 92; x++) {
            if (lum(pixelDataGetter(x, y)) > 175) whiteTeethPixels++;
        }
    }
    const hasTeeth = whiteTeethPixels >= 6;

    // F. Prop Detection
    let redVotes = 0;
    let cyanVotes = 0;
    for (let y = 45; y <= 105; y += 3) {
        for (let x = 18; x <= 55; x += 3) {
            const p = pixelDataGetter(x, y);
            if (p[0] > p[1] + 25 && p[0] > p[2] + 25) redVotes++;
            if (p[2] > p[0] + 20 && p[1] > p[0] + 15) cyanVotes++;
        }
    }
    const isTablet = cyanVotes > 15 || (char && (char.id === 'c2' || (char.title && char.title.includes('Sub-Zero'))));

    return {
        colSkinLight, colSkinShadow, colSkinHi,
        colHairDark, colHairMid, colHairHi,
        colTorsoLight, colTorsoShadow,
        hasGlasses, hasTeeth, isTablet
    };
}

const mockGetter = (x, y) => [200, 150, 120, 255];
console.log("Result:", generatePixelPlayerFromPhotoData(mockGetter, { id: 'c2', title: 'Sub-Zero Tactician' }));
