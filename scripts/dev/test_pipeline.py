import os
from PIL import Image, ImageDraw, ImageOps, ImageEnhance

def convert_photo_to_pixel_player(img_path, out_path, default_color="#0984e3", default_role="Math Master"):
    with Image.open(img_path) as orig:
        orig = ImageOps.exif_transpose(orig).convert("RGBA")
        W_orig, H_orig = orig.size
        
        # 1. Focus crop (bust / waist-up)
        target_ratio = 140 / 160
        if W_orig / H_orig > target_ratio:
            new_w = int(H_orig * target_ratio)
            left = (W_orig - new_w) // 2
            im = orig.crop((left, 0, left + new_w, H_orig))
        else:
            new_h = int(W_orig / target_ratio)
            top = max(0, int((H_orig - new_h) * 0.08))
            im = orig.crop((0, top, W_orig, top + new_h))
            
        im = im.resize((140, 160), Image.Resampling.LANCZOS)
        
        # 2. Extract Color Signatures from Photo
        # Center of face (x: 60..85, y: 55..75)
        face_pixels = []
        for x in range(60, 85):
            for y in range(55, 75):
                face_pixels.append(im.getpixel((x, y))[:3])
        avg_skin = [sum(p[i] for p in face_pixels) // len(face_pixels) for i in range(3)]
        
        # Hair region (x: 55..85, y: 15..35)
        hair_pixels = []
        for x in range(55, 85):
            for y in range(15, 35):
                hair_pixels.append(im.getpixel((x, y))[:3])
        avg_hair = [sum(p[i] for p in hair_pixels) // len(hair_pixels) for i in range(3)]
        
        # Torso / clothing region (x: 60..90, y: 120..145)
        torso_pixels = []
        for x in range(60, 90):
            for y in range(120, 145):
                torso_pixels.append(im.getpixel((x, y))[:3])
        avg_torso = [sum(p[i] for p in torso_pixels) // len(torso_pixels) for i in range(3)]
        
        # Left prop region (x: 20..50, y: 50..100)
        prop_pixels = []
        for x in range(20, 50):
            for y in range(50, 100):
                prop_pixels.append(im.getpixel((x, y))[:3])
        avg_prop = [sum(p[i] for p in prop_pixels) // len(prop_pixels) for i in range(3)]
        
        print("Detected Skin:", avg_skin)
        print("Detected Hair:", avg_hair)
        print("Detected Torso:", avg_torso)
        print("Detected Prop:", avg_prop)
        
        # 3. Create Clean 140x160 RGBA Player Canvas
        player = Image.new("RGBA", (140, 160), (0, 0, 0, 0))
        draw = ImageDraw.Draw(player)
        
        # Desk in foreground (like Foto 1)
        draw.polygon([(15, 126), (125, 126), (138, 160), (10, 160)], fill=(178, 190, 195, 255))
        draw.polygon([(65, 122), (110, 122), (118, 145), (60, 145)], fill=(245, 246, 250, 255))
        
        # Character Torso (using detected torso color with shading)
        tc_r, tc_g, tc_b = avg_torso
        tc_dark = (int(tc_r * 0.7), int(tc_g * 0.7), int(tc_b * 0.7), 255)
        tc_light = (min(255, int(tc_r * 1.2)), min(255, int(tc_g * 1.2)), min(255, int(tc_b * 1.2)), 255)
        draw.rectangle([55, 95, 115, 130], fill=tc_light)
        draw.rectangle([85, 95, 115, 130], fill=tc_dark)
        draw.rectangle([70, 92, 85, 110], fill=(255, 255, 255, 255)) # Collar
        draw.rectangle([75, 98, 80, 125], fill=(tc_r, tc_g, tc_b, 255)) # Tie/strip
        
        # Neck & Face base (using detected skin tones)
        sk_r, sk_g, sk_b = avg_skin
        # normalize skin if too dark or too washed out
        sk_light = (min(255, max(180, int(sk_r * 1.15))), min(255, max(140, int(sk_g * 1.1))), min(255, max(110, int(sk_b * 1.05))), 255)
        sk_shadow = (int(sk_light[0] * 0.75), int(sk_light[1] * 0.7), int(sk_light[2] * 0.65), 255)
        
        # Neck
        draw.rectangle([68, 75, 88, 95], fill=sk_shadow)
        # Face
        draw.polygon([(60, 45), (105, 45), (98, 88), (68, 88)], fill=sk_light)
        draw.polygon([(88, 45), (105, 45), (98, 88), (86, 88)], fill=sk_shadow)
        # Ear
        draw.rectangle([102, 54, 108, 68], fill=sk_shadow)
        
        # Wide Arcade Smile with Teeth (Iconic Foto 1 style!)
        draw.polygon([(72, 74), (92, 74), (88, 80), (74, 80)], fill=(120, 30, 30, 255))
        draw.rectangle([(74, 75), (90, 77)], fill=(255, 255, 255, 255)) # teeth bar
        
        # Arcade Eyes
        draw.rectangle([(67, 56), (75, 60)], fill=(30, 30, 30, 255))
        draw.rectangle([(85, 56), (93, 60)], fill=(30, 30, 30, 255))
        draw.rectangle([(71, 57), (74, 59)], fill=(255, 255, 255, 255))
        draw.rectangle([(89, 57), (92, 59)], fill=(255, 255, 255, 255))
        
        # Dynamic Hair Spikes (using detected hair color)
        hr_r, hr_g, hr_b = min(50, avg_hair[0]), min(50, avg_hair[1]), min(55, avg_hair[2])
        hair_col = (hr_r, hr_g, hr_b, 255)
        hair_hi = (min(255, hr_r + 40), min(255, hr_g + 40), min(255, hr_b + 45), 255)
        
        spikes = [
            [(58, 46), (54, 18), (64, 44)],
            [(64, 44), (66, 12), (72, 42)],
            [(72, 42), (76, 8), (80, 42)],
            [(80, 42), (86, 10), (90, 43)],
            [(90, 43), (96, 14), (100, 45)],
            [(100, 45), (108, 22), (105, 48)],
            [(105, 48), (114, 32), (104, 52)],
        ]
        for sp in spikes:
            draw.polygon(sp, fill=hair_col)
        draw.polygon([(60, 40), (105, 40), (105, 50), (60, 50)], fill=hair_col)
        draw.polygon([(62, 42), (95, 42), (95, 46), (62, 46)], fill=hair_hi)
        
        # Prop held in hand (Detected book / item)
        # Check if detected prop is reddish (like Inten book) or another color
        pr_r, pr_g, pr_b = avg_prop
        if pr_r > pr_g + 30 and pr_r > pr_b + 30:
            # Red Prosus Inten book!
            prop_base = (200, 30, 30, 255)
            prop_shadow = (140, 20, 20, 255)
        elif pr_b > pr_r + 20 and pr_b > pr_g + 20:
            # Cyan / Blue tablet
            prop_base = (0, 180, 210, 255)
            prop_shadow = (0, 110, 140, 255)
        else:
            prop_base = (max(50, pr_r), max(50, pr_g), max(50, pr_b), 255)
            prop_shadow = (int(prop_base[0] * 0.7), int(prop_base[1] * 0.7), int(prop_base[2] * 0.7), 255)
            
        draw.polygon([(18, 40), (62, 34), (66, 122), (22, 128)], fill=prop_shadow)
        draw.polygon([(20, 42), (60, 36), (64, 120), (24, 126)], fill=prop_base)
        # Spiral rings
        for sy in range(46, 120, 9):
            draw.rectangle([(15, sy), (21, sy + 3)], fill=(223, 230, 233, 255))
        # Center book panel / text lines
        draw.rectangle([(26, 58), (55, 94)], fill=(45, 52, 54, 255))
        draw.rectangle([(29, 64), (52, 66)], fill=(255, 255, 255, 255))
        draw.rectangle([(29, 72), (47, 74)], fill=(255, 255, 255, 255))
        draw.rectangle([(29, 80), (50, 82)], fill=(255, 215, 0, 255))
        
        # Hands holding prop
        draw.polygon([(14, 44), (28, 42), (27, 56), (13, 58)], fill=sk_light)
        draw.polygon([(18, 110), (32, 108), (30, 124), (16, 126)], fill=sk_light)
        draw.polygon([(10, 116), (20, 114), (18, 128), (8, 130)], fill=sk_shadow)
        
        # Upscale 2x nearest neighbor for 280x320 crisp output
        out = player.resize((280, 320), Image.Resampling.NEAREST)
        out.save(out_path, format="PNG")
        print(f"Player sprite saved to {out_path}")

convert_photo_to_pixel_player("assets/personalia/user_photo.jpg", "assets/personalia/test_converted_player.png")
