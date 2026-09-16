import os
from PIL import Image, ImageDraw, ImageOps, ImageEnhance, ImageFilter
from collections import deque

def create_true_photo_pixel_player(img_path, out_path):
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
            im = im = orig.crop((0, top, W, top + new_h))
            
        # Target size 140x160
        im = im.resize((140, 160), Image.Resampling.LANCZOS)
        
        # 2. Arcade Color & Contrast Pop
        im = ImageEnhance.Color(im).enhance(1.3)
        im = ImageEnhance.Contrast(im).enhance(1.25)
        
        # 3. Smart Background Removal via Floodfill from Perimeter
        pix = im.load()
        
        # Sample border colors
        border_samples = []
        for x in range(0, 140, 5):
            border_samples.append(pix[x, 0][:3])
            border_samples.append(pix[x, 2][:3])
        for y in range(0, 80, 5):
            border_samples.append(pix[0, y][:3])
            border_samples.append(pix[139, y][:3])
            
        def col_dist(c1, c2):
            return ((c1[0]-c2[0])**2 + (c1[1]-c2[1])**2 + (c1[2]-c2[2])**2)**0.5
            
        # Floodfill from top border
        visited = [[False]*160 for _ in range(140)]
        is_bg = [[False]*160 for _ in range(140)]
        q = deque()
        
        # Seed top border and top corners
        for x in range(140):
            q.append((x, 0))
            visited[x][0] = True
        for y in range(1, 80):
            q.append((0, y))
            visited[0][y] = True
            q.append((139, y))
            visited[139][y] = True
            
        while q:
            cx, cy = q.popleft()
            c_rgb = pix[cx, cy][:3]
            c_lum = 0.299*c_rgb[0] + 0.587*c_rgb[1] + 0.114*c_rgb[2]
            
            # Check if this pixel matches background characteristics
            # (matches any border sample or is very bright ceiling or uniform wall)
            min_d = min(col_dist(c_rgb, s) for s in border_samples)
            
            is_pixel_bg = False
            if cy < 35:
                # Top ceiling: very lenient
                if min_d < 65 or c_lum > 185:
                    is_pixel_bg = True
            elif cy < 85:
                # Side wall / background behind head
                if (cx < 25 or cx > 115) and (min_d < 50 or c_lum > 195):
                    is_pixel_bg = True
                elif min_d < 35:
                    is_pixel_bg = True
            else:
                # Lower sides
                if (cx < 12 or cx > 127) and min_d < 40:
                    is_pixel_bg = True
                    
            if is_pixel_bg:
                is_bg[cx][cy] = True
                for dx, dy in [(-1, 0), (1, 0), (0, 1), (0, -1)]:
                    nx, ny = cx + dx, cy + dy
                    if 0 <= nx < 140 and 0 <= ny < 160:
                        if not visited[nx][ny]:
                            visited[nx][ny] = True
                            q.append((nx, ny))

        # 4. Create Cutout Pixel Sprite
        sprite = Image.new("RGBA", (140, 160), (0, 0, 0, 0))
        s_pix = sprite.load()
        
        for y in range(160):
            for x in range(140):
                if not is_bg[x][y]:
                    r, g, b, _ = pix[x, y]
                    # Quantize into 20-step arcade color palette
                    step = 20
                    qr = min(255, round(r / step) * step)
                    qg = min(255, round(g / step) * step)
                    qb = min(255, round(b / step) * step)
                    s_pix[x, y] = (qr, qg, qb, 255)
                    
        # 5. Add 1px Dark Arcade Edge Outline
        outlined = sprite.copy()
        out_pix = outlined.load()
        for y in range(1, 159):
            for x in range(1, 139):
                if s_pix[x, y][3] == 0:
                    has_solid = any(s_pix[x+dx, y+dy][3] > 128 for dx, dy in [(-1,0),(1,0),(0,-1),(0,1)])
                    if has_solid and y < 132:
                        out_pix[x, y] = (24, 18, 28, 255)
                        
        draw = ImageDraw.Draw(outlined)
        
        # 6. Foreground Desk + Exam Paper (The Foto 1 composition!)
        draw.polygon([(15, 132), (125, 132), (138, 160), (10, 160)], fill=(178, 190, 195, 255))
        draw.line([(15, 132), (125, 132)], fill=(140, 150, 155, 255), width=2)
        # White paper sheet
        draw.polygon([(65, 128), (110, 128), (118, 150), (60, 150)], fill=(245, 246, 250, 255))
        draw.line([(70, 134), (102, 134)], fill=(180, 185, 195, 255), width=1)
        draw.line([(70, 140), (98, 140)], fill=(180, 185, 195, 255), width=1)
        
        # 7. Upscale 2x nearest-neighbor for high-DPI razor sharpness (280x320)
        final_out = outlined.resize((280, 320), Image.Resampling.NEAREST)
        final_out.save(out_path, format="PNG")
        print("True photo pixel player saved:", out_path)

create_true_photo_pixel_player("assets/personalia/user_photo.jpg", "assets/personalia/test_true_player.png")
