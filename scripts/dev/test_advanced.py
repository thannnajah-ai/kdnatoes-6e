import os
from PIL import Image, ImageDraw, ImageOps, ImageEnhance, ImageFilter
from collections import deque

def advanced_photo_to_arcade_player(img_path, out_path):
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
            top = max(0, int((H - new_h) * 0.06))
            im = orig.crop((0, top, W, top + new_h))
            
        # Target size 140x160
        im = im.resize((140, 160), Image.Resampling.LANCZOS)
        
        # 2. Arcade Color & Contrast Pop
        enh = ImageEnhance.Color(im).enhance(1.4)
        enh = ImageEnhance.Contrast(enh).enhance(1.35)
        
        pix = enh.load()
        
        # 3. Robust Background Removal
        # Sample border pixels (corners & top rim)
        border_pts = []
        for x in range(0, 140, 4):
            border_pts.append(pix[x, 0][:3])
            border_pts.append(pix[x, 2][:3])
        for y in range(0, 70, 4):
            border_pts.append(pix[0, y][:3])
            border_pts.append(pix[139, y][:3])
            
        def cdist(c1, c2):
            return ((c1[0]-c2[0])**2 + (c1[1]-c2[1])**2 + (c1[2]-c2[2])**2)**0.5
            
        # Center preservation zone: face & torso center is shielded from bg removal
        # Oval center at (70, 80), rx=38, ry=55
        def is_center_shield(x, y):
            dx = (x - 70) / 36.0
            dy = (y - 85) / 50.0
            return (dx*dx + dy*dy) <= 1.0

        visited = [[False]*160 for _ in range(140)]
        is_bg = [[False]*160 for _ in range(140)]
        q = deque()
        
        # Seed from top and top corners
        for x in range(140):
            q.append((x, 0))
            visited[x][0] = True
        for y in range(1, 75):
            q.append((0, y))
            visited[0][y] = True
            q.append((139, y))
            visited[139][y] = True
            
        while q:
            cx, cy = q.popleft()
            c_rgb = pix[cx, cy][:3]
            lum = 0.299*c_rgb[0] + 0.587*c_rgb[1] + 0.114*c_rgb[2]
            min_d = min(cdist(c_rgb, s) for s in border_pts)
            
            # If inside center shield and not near border, do not classify as bg
            if is_center_shield(cx, cy) and cy > 35 and min_d > 40:
                continue
                
            # Background conditions:
            # Matches border color, or very high luminance (ceiling/light), or flat perimeter
            is_pixel_bg = False
            if cy < 30:
                if min_d < 70 or lum > 175:
                    is_pixel_bg = True
            elif cy < 85:
                if (cx < 28 or cx > 112) and (min_d < 55 or lum > 185):
                    is_pixel_bg = True
                elif min_d < 35:
                    is_pixel_bg = True
            else:
                if (cx < 15 or cx > 125) and (min_d < 45 or lum > 190):
                    is_pixel_bg = True
                    
            if is_pixel_bg:
                is_bg[cx][cy] = True
                for dx, dy in [(-1, 0), (1, 0), (0, 1), (0, -1)]:
                    nx, ny = cx + dx, cy + dy
                    if 0 <= nx < 140 and 0 <= ny < 160:
                        if not visited[nx][ny]:
                            visited[nx][ny] = True
                            q.append((nx, ny))

        # 4. Generate Pixel Art Cutout Sprite
        sprite = Image.new("RGBA", (140, 160), (0, 0, 0, 0))
        s_pix = sprite.load()
        
        # 16-color step quantization for retro arcade look
        for y in range(160):
            for x in range(140):
                if not is_bg[x][y]:
                    r, g, b, _ = pix[x, y]
                    # Posterize
                    step = 24
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
                        out_pix[x, y] = (20, 16, 24, 255)
                        
        draw = ImageDraw.Draw(outlined)
        
        # 6. Foreground Desk + Exam Paper (Bentukan Player Foto 1!)
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
        print("Advanced arcade player saved to:", out_path)

advanced_photo_to_arcade_player("assets/personalia/user_photo.jpg", "assets/personalia/test_advanced_player.png")
