import os
from PIL import Image, ImageDraw, ImageOps, ImageEnhance, ImageFilter

def clean_cutout_player(img_path, out_path):
    with Image.open(img_path) as orig:
        orig = ImageOps.exif_transpose(orig).convert("RGBA")
        W, H = orig.size
        
        # 1. Waist-up bust crop (center on face/torso)
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
        
        # Boost vibrance & contrast
        im = ImageEnhance.Color(im).enhance(1.35)
        im = ImageEnhance.Contrast(im).enhance(1.25)
        pix = im.load()
        
        # Sample background from top corners and perimeter
        bg_samples = []
        for x in [0, 5, 10, 130, 135, 139]:
            for y in [0, 5, 10, 15, 20]:
                bg_samples.append(pix[x, y][:3])
                
        def cdist(c1, c2):
            return ((c1[0]-c2[0])**2 + (c1[1]-c2[1])**2 + (c1[2]-c2[2])**2)**0.5
            
        def is_human_skin(r, g, b):
            # Standard human skin detector
            return (r > g > b) and (r - g >= 10) and (r >= 70) and (g >= 45) and (b >= 30) and (r - b >= 15)
            
        def is_dark_hair(r, g, b):
            return r < 65 and g < 65 and b < 70
            
        mask = Image.new("L", (140, 160), 255)
        mp = mask.load()
        
        for y in range(160):
            for x in range(140):
                r, g, b, _ = pix[x, y]
                lum = 0.299*r + 0.587*g + 0.114*b
                min_d = min(cdist((r, g, b), s) for s in bg_samples)
                
                # Check if background
                # 1. Matches corner background sample
                # 2. Or is bright washed wall/ceiling (lum > 185) and not skin
                is_bg = False
                if min_d < 45:
                    is_bg = True
                elif lum > 195 and not is_human_skin(r, g, b):
                    is_bg = True
                elif lum > 175 and y < 45 and not is_dark_hair(r, g, b) and not is_human_skin(r, g, b):
                    is_bg = True
                elif (x < 15 or x > 125) and lum > 170 and not is_human_skin(r, g, b):
                    is_bg = True
                    
                if is_bg:
                    mp[x, y] = 0

        # Refine mask
        mask = mask.filter(ImageFilter.MedianFilter(size=3))
        mp = mask.load()
        
        # Create Cutout Sprite
        sprite = Image.new("RGBA", (140, 160), (0, 0, 0, 0))
        sp = sprite.load()
        
        for y in range(160):
            for x in range(140):
                if mp[x, y] > 128:
                    r, g, b, _ = pix[x, y]
                    # Quantize into 22-step retro arcade color palette
                    step = 22
                    qr = min(255, round(r / step) * step)
                    qg = min(255, round(g / step) * step)
                    qb = min(255, round(b / step) * step)
                    sp[x, y] = (qr, qg, qb, 255)
                    
        # Add 1px Dark Arcade Outline
        outlined = sprite.copy()
        op = outlined.load()
        for y in range(1, 159):
            for x in range(1, 139):
                if sp[x, y][3] == 0:
                    has_solid = any(sp[x+dx, y+dy][3] > 128 for dx, dy in [(-1,0),(1,0),(0,-1),(0,1)])
                    if has_solid and y < 132:
                        op[x, y] = (20, 16, 24, 255)
                        
        draw = ImageDraw.Draw(outlined)
        
        # Foreground Desk + Exam Paper (Foto 1 composition!)
        draw.polygon([(15, 134), (125, 134), (138, 160), (10, 160)], fill=(178, 190, 195, 255))
        draw.line([(15, 134), (125, 134)], fill=(140, 150, 155, 255), width=2)
        # White paper sheet
        draw.polygon([(65, 130), (110, 130), (118, 150), (60, 150)], fill=(245, 246, 250, 255))
        draw.line([(70, 136), (102, 136)], fill=(180, 185, 195, 255), width=1)
        draw.line([(70, 142), (98, 142)], fill=(180, 185, 195, 255), width=1)

        # Upscale 2x nearest-neighbor (280x320)
        final_out = outlined.resize((280, 320), Image.Resampling.NEAREST)
        final_out.save(out_path, format="PNG")
        print("Saved clean cutout player:", out_path)

clean_cutout_player("assets/personalia/user_photo.jpg", "assets/personalia/test_clean_player.png")
