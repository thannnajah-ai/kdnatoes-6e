import os
from PIL import Image, ImageDraw, ImageOps, ImageEnhance, ImageFilter

def make_real_photo_pixel_player(img_path, out_path):
    with Image.open(img_path) as im:
        im = ImageOps.exif_transpose(im).convert("RGBA")
        W, H = im.size
        
        # 1. Waist-up bust crop (focus on face & torso)
        target_ratio = 140 / 160
        if W / H > target_ratio:
            new_w = int(H * target_ratio)
            left = (W - new_w) // 2
            im = im.crop((left, 0, left + new_w, H))
        else:
            new_h = int(W / target_ratio)
            top = max(0, int((H - new_h) * 0.08))
            im = im.crop((0, top, W, top + new_h))
            
        im = im.resize((140, 160), Image.Resampling.LANCZOS)
        
        # 2. Boost color & contrast for vibrant arcade retro aesthetic
        enh_col = ImageEnhance.Color(im).enhance(1.35)
        enh_con = ImageEnhance.Contrast(enh_col).enhance(1.30)
        im = enh_con
        
        # 3. Intelligent Background Removal (Key out perimeter / ceiling background)
        pix = im.load()
        # Sample border pixels (corners and top edge)
        bg_samples = [
            pix[2, 2][:3], pix[137, 2][:3], pix[70, 2][:3],
            pix[2, 15][:3], pix[137, 15][:3], pix[2, 35][:3], pix[137, 35][:3]
        ]
        
        def dist(c1, c2):
            return sum((a - b)**2 for a, b in zip(c1, c2))**0.5
            
        mask = Image.new("L", (140, 160), 255)
        m_pix = mask.load()
        
        # Flood-fill or distance check from edges
        for y in range(160):
            for x in range(140):
                r, g, b, a = pix[x, y]
                lum = 0.299 * r + 0.587 * g + 0.114 * b
                min_d = min(dist((r, g, b), s) for s in bg_samples)
                
                # If near top or edges and matches background sample or is bright washed ceiling
                is_bg = False
                if y < 45:
                    if lum > 200 or min_d < 50:
                        is_bg = True
                elif y < 90 and (x < 15 or x > 125):
                    if lum > 195 or min_d < 45:
                        is_bg = True
                elif (x < 10 or x > 130) and min_d < 40:
                    is_bg = True
                    
                if is_bg:
                    m_pix[x, y] = 0

        # Refine mask: smooth edges slightly then threshold
        mask = mask.filter(ImageFilter.MedianFilter(size=3))
        
        # 4. Pixelate Subject into Retro Arcade Palette (Quantize & Posterize)
        sprite = Image.new("RGBA", (140, 160), (0, 0, 0, 0))
        s_pix = sprite.load()
        m_pix = mask.load()
        
        for y in range(160):
            for x in range(140):
                if m_pix[x, y] > 128:
                    r, g, b, _ = pix[x, y]
                    # Retro 24-step color quantization
                    step = 24
                    qr = min(255, round(r / step) * step)
                    qg = min(255, round(g / step) * step)
                    qb = min(255, round(b / step) * step)
                    s_pix[x, y] = (qr, qg, qb, 255)
                    
        # 5. Add 1px Dark Retro Arcade Outline around Cutout Subject
        outlined = sprite.copy()
        out_pix = outlined.load()
        for y in range(1, 159):
            for x in range(1, 139):
                if s_pix[x, y][3] == 0:
                    # Check if neighbor is solid
                    has_solid_neighbor = False
                    for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                        if s_pix[x + dx, y + dy][3] > 128:
                            has_solid_neighbor = True
                            break
                    if has_solid_neighbor and y < 135:
                        out_pix[x, y] = (20, 16, 24, 255)
                        
        draw = ImageDraw.Draw(outlined)
        
        # 6. Foreground Arcade Elements (Desk + White Exam Paper like Foto 1)
        # Desk surface
        draw.polygon([(15, 126), (125, 126), (138, 160), (10, 160)], fill=(178, 190, 195, 255))
        draw.line([(15, 126), (125, 126)], fill=(140, 150, 155, 255), width=2)
        # White exam paper
        draw.polygon([(65, 122), (110, 122), (118, 145), (60, 145)], fill=(245, 246, 250, 255))
        draw.line([(70, 128), (102, 128)], fill=(180, 185, 195, 255), width=1)
        draw.line([(70, 134), (98, 134)], fill=(180, 185, 195, 255), width=1)
        
        # 7. Upscale 2x nearest-neighbor to 280x320 for high-DPI razor-sharp pixels
        final_out = outlined.resize((280, 320), Image.Resampling.NEAREST)
        final_out.save(out_path, format="PNG")
        print("Real photo pixel player created at:", out_path)

make_real_photo_pixel_player("assets/personalia/user_photo.jpg", "assets/personalia/test_real_photo_player.png")
