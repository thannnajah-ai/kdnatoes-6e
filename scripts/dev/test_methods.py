import os
from PIL import Image, ImageDraw, ImageOps, ImageEnhance

def test_methods(img_path):
    with Image.open(img_path) as orig:
        orig = ImageOps.exif_transpose(orig).convert("RGBA")
        W, H = orig.size
        
        # Crop bust (waist-up)
        tr = 140 / 160
        if W / H > tr:
            nw = int(H * tr)
            l = (W - nw) // 2
            cropped = orig.crop((l, 0, l + nw, H))
        else:
            nh = int(W / tr)
            top = max(0, int((H - nh) * 0.08))
            cropped = orig.crop((0, top, W, top + nh))
            
        cropped = cropped.resize((140, 160), Image.Resampling.LANCZOS)
        
        # Boost contrast and saturation
        enh_col = ImageEnhance.Color(cropped).enhance(1.4)
        enh_con = ImageEnhance.Contrast(enh_col).enhance(1.3)
        
        # Method 1: Intelligent Cutout Pixel Player
        pix = enh_con.load()
        # Sample corners for background
        bg_samples = [pix[2, 2][:3], pix[137, 2][:3], pix[70, 2][:3], pix[2, 20][:3], pix[137, 20][:3]]
        
        def cdist(c1, c2):
            return sum((a - b)**2 for a, b in zip(c1, c2))**0.5
            
        m1 = Image.new("RGBA", (140, 160), (0, 0, 0, 0))
        m1_draw = ImageDraw.Draw(m1)
        m1_pix = m1.load()
        
        for y in range(160):
            for x in range(140):
                r, g, b, a = pix[x, y]
                lum = 0.299*r + 0.587*g + 0.114*b
                min_d = min(cdist((r, g, b), s) for s in bg_samples)
                
                # Near top or edges ceiling/wall
                is_bg = (y < 40 and lum > 190) or (min_d < 50 and (y < 50 or x < 12 or x > 128))
                
                if not is_bg:
                    # Posterize into 24-step retro color
                    step = 24
                    pr = min(255, round(r / step) * step)
                    pg = min(255, round(g / step) * step)
                    pb = min(255, round(b / step) * step)
                    m1_pix[x, y] = (pr, pg, pb, 255)
                    
        # Add desk in foreground for Method 1
        m1_draw.polygon([(15, 126), (125, 126), (138, 160), (10, 160)], fill=(178, 190, 195, 255))
        m1_draw.polygon([(65, 122), (110, 122), (118, 145), (60, 145)], fill=(245, 246, 250, 255))
        
        m1_out = m1.resize((280, 320), Image.Resampling.NEAREST)
        m1_out.save("assets/personalia/test_method1.png")
        print("Method 1 saved")

test_methods("assets/personalia/user_photo.jpg")
