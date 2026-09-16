import os
from PIL import Image, ImageDraw, ImageOps, ImageEnhance, ImageFilter

def photo_to_exact_arcade_player(img_path, out_path):
    with Image.open(img_path) as orig:
        orig = ImageOps.exif_transpose(orig).convert("RGBA")
        W, H = orig.size
        
        # 1. Waist-up bust crop (focus on face & torso)
        target_ratio = 140 / 160
        if W / H > target_ratio:
            new_w = int(H * target_ratio)
            left = (W - new_w) // 2
            im = orig.crop((left, 0, left + new_w, H))
        else:
            new_h = int(W / target_ratio)
            top = max(0, int((H - new_h) * 0.08))
            im = orig.crop((0, top, W, top + new_h))
            
        im = im.resize((140, 160), Image.Resampling.LANCZOS)
        
        # 2. Arcade Color & Contrast Boost
        im = ImageEnhance.Color(im).enhance(1.30)
        im = ImageEnhance.Contrast(im).enhance(1.25)
        pix = im.load()
        
        # 3. Clean Background Cutout
        # Sample border / ceiling background colors
        bg_samples = []
        for x in range(0, 140, 5):
            bg_samples.append(pix[x, 0][:3])
            bg_samples.append(pix[x, 2][:3])
        for y in range(0, 70, 5):
            bg_samples.append(pix[0, y][:3])
            bg_samples.append(pix[139, y][:3])
            
        def cdist(c1, c2):
            return ((c1[0]-c2[0])**2 + (c1[1]-c2[1])**2 + (c1[2]-c2[2])**2)**0.5
            
        # Create alpha mask
        mask = Image.new("L", (140, 160), 255)
        mp = mask.load()
        
        for y in range(160):
            for x in range(140):
                r, g, b, _ = pix[x, y]
                lum = 0.299 * r + 0.587 * g + 0.114 * b
                min_d = min(cdist((r, g, b), s) for s in bg_samples)
                
                # Subject protection center zone (head + chest)
                # Head: center (70, 58), rx=32, ry=38
                # Chest: center (70, 115), rx=48, ry=35
                in_head = (((x - 70)/32.0)**2 + ((y - 58)/38.0)**2) <= 1.0
                in_chest = (((x - 70)/48.0)**2 + ((y - 115)/35.0)**2) <= 1.0
                
                is_bg = False
                if not (in_head or in_chest):
                    if y < 35 and (min_d < 65 or lum > 175):
                        is_bg = True
                    elif y < 90 and (x < 24 or x > 116) and (min_d < 50 or lum > 185):
                        is_bg = True
                    elif (x < 12 or x > 128) and min_d < 40:
                        is_bg = True
                elif y < 22 and lum > 200 and min_d < 45:
                    # Ceiling directly above head
                    is_bg = True
                    
                if is_bg:
                    mp[x, y] = 0

        # Refine mask
        mask = mask.filter(ImageFilter.MedianFilter(size=3))
        mp = mask.load()
        
        # 4. Posterize Subject into Retro Arcade 24-step Palette
        sprite = Image.new("RGBA", (140, 160), (0, 0, 0, 0))
        sp = sprite.load()
        
        for y in range(160):
            for x in range(140):
                if mp[x, y] > 128:
                    r, g, b, _ = pix[x, y]
                    step = 22
                    qr = min(255, round(r / step) * step)
                    qg = min(255, round(g / step) * step)
                    qb = min(255, round(b / step) * step)
                    sp[x, y] = (qr, qg, qb, 255)
                    
        # 5. Add 1px Dark Retro Outline around Cutout Subject
        outlined = sprite.copy()
        op = outlined.load()
        for y in range(1, 159):
            for x in range(1, 139):
                if sp[x, y][3] == 0:
                    has_neighbor = any(sp[x+dx, y+dy][3] > 128 for dx, dy in [(-1,0),(1,0),(0,-1),(0,1)])
                    if has_neighbor and y < 132:
                        op[x, y] = (20, 16, 24, 255)
                        
        draw = ImageDraw.Draw(outlined)
        
        # 6. Foreground Desk + Exam Paper (The Foto 1 composition!)
        # Desk surface
        draw.polygon([(15, 134), (125, 134), (138, 160), (10, 160)], fill=(178, 190, 195, 255))
        draw.line([(15, 134), (125, 134)], fill=(140, 150, 155, 255), width=2)
        # White paper sheet
        draw.polygon([(65, 130), (110, 130), (118, 150), (60, 150)], fill=(245, 246, 250, 255))
        draw.line([(70, 136), (102, 136)], fill=(180, 185, 195, 255), width=1)
        draw.line([(70, 142), (98, 142)], fill=(180, 185, 195, 255), width=1)
        
        # 7. Upscale 2x nearest-neighbor (280x320)
        final_out = outlined.resize((280, 320), Image.Resampling.NEAREST)
        final_out.save(out_path, format="PNG")
        print("Done:", out_path)

photo_to_exact_arcade_player("assets/personalia/user_photo.jpg", "assets/personalia/test_hybrid.png")
