import os
from PIL import Image, ImageDraw, ImageOps

def photo_to_pixel_player_v2(img_path, out_path, char_info=None):
    with Image.open(img_path) as orig:
        orig = ImageOps.exif_transpose(orig).convert("RGBA")
        W_orig, H_orig = orig.size
        
        # 1. Waist-up bust crop (center/upper)
        target_ratio = 140 / 160
        if W_orig / H_orig > target_ratio:
            new_w = int(H_orig * target_ratio)
            left = (W_orig - new_w) // 2
            cropped = orig.crop((left, 0, left + new_w, H_orig))
        else:
            new_h = int(W_orig / target_ratio)
            top = max(0, int((H_orig - new_h) * 0.08))
            cropped = orig.crop((0, top, W_orig, top + new_h))
            
        base = cropped.resize((140, 160), Image.Resampling.LANCZOS)
        pix = base.load()
        
        # 2. Intelligent Feature Extraction from Photo
        # A. Face / Skin Tone (x: 65..95, y: 55..78)
        face_pts = []
        for x in range(65, 95):
            for y in range(55, 78):
                face_pts.append(pix[x, y][:3])
        # Sort by brightness
        face_pts.sort(key=lambda c: 0.299*c[0] + 0.587*c[1] + 0.114*c[2])
        # Sample midtone
        f_mid = face_pts[int(len(face_pts) * 0.55)]
        
        # Normalize to healthy warm arcade skin palette
        sr, sg, sb = f_mid
        # boost warmth and vibrance
        sk_light = (
            min(255, max(210, int(sr * 1.15))),
            min(255, max(160, int(sg * 1.10))),
            min(255, max(130, int(sb * 1.05))),
            255
        )
        sk_shadow = (
            int(sk_light[0] * 0.82),
            int(sk_light[1] * 0.72),
            int(sk_light[2] * 0.65),
            255
        )
        
        # B. Hair Tone & Style (x: 55..100, y: 20..42)
        hair_pts = []
        for x in range(55, 100):
            for y in range(20, 42):
                hair_pts.append(pix[x, y][:3])
        hair_pts.sort(key=lambda c: 0.299*c[0] + 0.587*c[1] + 0.114*c[2])
        h_dark = hair_pts[int(len(hair_pts) * 0.20)]
        hr, hg, hb = min(55, h_dark[0]), min(55, h_dark[1]), min(60, h_dark[2])
        hair_dark = (hr, hg, hb, 255)
        hair_hi = (min(255, hr + 45), min(255, hg + 45), min(255, hb + 50), 255)
        
        # C. Torso / Shirt Color (x: 55..110, y: 110..135)
        torso_pts = []
        for x in range(55, 110):
            for y in range(110, 135):
                torso_pts.append(pix[x, y][:3])
        torso_pts.sort(key=lambda c: 0.299*c[0] + 0.587*c[1] + 0.114*c[2])
        t_mid = torso_pts[len(torso_pts) // 2]
        tr, tg, tb = t_mid
        torso_light = (min(255, int(tr * 1.1)), min(255, int(tg * 1.1)), min(255, int(tb * 1.1)), 255)
        torso_dark = (int(tr * 0.75), int(tg * 0.75), int(tb * 0.75), 255)
        
        # D. Eye / Glasses Detection (x: 65..95, y: 52..62)
        eye_pts = []
        for x in range(65, 95):
            for y in range(52, 62):
                eye_pts.append(pix[x, y][:3])
        avg_eye_lum = sum(0.299*c[0] + 0.587*c[1] + 0.114*c[2] for c in eye_pts) / len(eye_pts)
        has_glasses = avg_eye_lum < 65 or (char_info and 'glasses' in char_info)
        
        # E. Smile / Teeth Detection (x: 70..92, y: 72..82)
        mouth_pts = []
        for x in range(70, 92):
            for y in range(72, 82):
                mouth_pts.append(pix[x, y][:3])
        mouth_bright = sum(1 for c in mouth_pts if (0.299*c[0] + 0.587*c[1] + 0.114*c[2]) > 170)
        has_teeth_smile = mouth_bright > 8  # White teeth detected!
        
        # F. Prop / Book Detection (x: 18..55, y: 45..105)
        prop_pts = []
        for x in range(18, 55):
            for y in range(45, 105):
                prop_pts.append(pix[x, y][:3])
        # Find if saturated red, blue, green, etc.
        red_pts = sum(1 for c in prop_pts if c[0] > c[1] + 30 and c[0] > c[2] + 30)
        cyan_pts = sum(1 for c in prop_pts if c[2] > c[0] + 25 and c[1] > c[0] + 20)
        
        if red_pts > 40:
            # Iconic red Inten book
            prop_bg = (192, 57, 43, 255)
            prop_border = (150, 30, 20, 255)
        elif cyan_pts > 40 or (char_info and 'Sub-Zero' in str(char_info)):
            # Cyan tactical tablet
            prop_bg = (15, 35, 60, 255)
            prop_border = (10, 25, 45, 255)
        else:
            # Match torso or stylish dark binder
            prop_bg = (min(255, tr + 20), min(255, tg + 20), min(255, tb + 20), 255)
            prop_border = (int(tr * 0.6), int(tg * 0.6), int(tb * 0.6), 255)
            
        print(f"Features: Skin={sk_light[:3]}, Hair={hair_dark[:3]}, Teeth={has_teeth_smile}, Glasses={has_glasses}")
        
        # 3. Render Pixel Fighter (Exact Foto 1 Anatomy!)
        player = Image.new("RGBA", (140, 160), (0, 0, 0, 0))
        draw = ImageDraw.Draw(player)
        
        # 1. Desk Surface in Foreground
        draw.polygon([(15, 126), (125, 126), (138, 160), (10, 160)], fill=(178, 190, 195, 255))
        draw.polygon([(65, 122), (110, 122), (118, 145), (60, 145)], fill=(245, 246, 250, 255)) # Exam paper
        
        # 2. Torso (Bust)
        draw.rectangle([55, 95, 115, 130], fill=torso_light)
        draw.rectangle([85, 95, 115, 130], fill=torso_dark)
        draw.rectangle([70, 92, 85, 108], fill=(255, 255, 255, 255)) # White collar
        draw.rectangle([76, 98, 80, 125], fill=(30, 144, 255, 255)) # Tie
        
        # 3. Head & Neck
        draw.rectangle([68, 75, 88, 95], fill=sk_shadow) # Neck shadow
        # Face base
        draw.polygon([(60, 45), (105, 45), (98, 88), (68, 88)], fill=sk_light)
        draw.polygon([(88, 45), (105, 45), (98, 88), (86, 88)], fill=sk_shadow) # Right shadow
        draw.rectangle([102, 54, 108, 68], fill=sk_shadow) # Ear
        
        # 4. Expressive Arcade Mouth (Matching Foto 1!)
        if has_teeth_smile:
            draw.polygon([(72, 74), (92, 74), (88, 81), (74, 81)], fill=(120, 30, 30, 255))
            draw.rectangle([(74, 75), (90, 77)], fill=(255, 255, 255, 255)) # White teeth bar
        else:
            # Confident fighter smirk
            draw.polygon([(74, 75), (90, 75), (88, 79), (76, 79)], fill=(130, 35, 35, 255))
            draw.rectangle([(76, 75), (88, 76)], fill=(255, 255, 255, 255))
            
        # 5. Eyes or Glasses
        if has_glasses:
            # Sub-zero / tactical visor glasses
            draw.polygon([(62, 52), (102, 52), (100, 62), (64, 62)], fill=(15, 23, 42, 255))
            draw.rectangle([(66, 55), (78, 57)], fill=(0, 229, 255, 255))
            draw.rectangle([(84, 55), (96, 57)], fill=(0, 229, 255, 255))
            draw.rectangle([(72, 58), (76, 59)], fill=(255, 255, 255, 255))
            draw.rectangle([(90, 58), (94, 59)], fill=(255, 255, 255, 255))
        else:
            # Arcade eyes
            draw.rectangle([(68, 56), (75, 60)], fill=(45, 52, 54, 255))
            draw.rectangle([(85, 56), (92, 60)], fill=(45, 52, 54, 255))
            draw.rectangle([(71, 57), (74, 59)], fill=(255, 255, 255, 255)) # Glimmer
            draw.rectangle([(88, 57), (91, 59)], fill=(255, 255, 255, 255))
            
        # 6. Dynamic Spiky Hair (Like Foto 1!)
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
            draw.polygon(sp, fill=hair_dark)
        draw.polygon([(60, 40), (105, 40), (105, 50), (60, 50)], fill=hair_dark)
        draw.polygon([(62, 42), (95, 42), (95, 46), (62, 46)], fill=hair_hi)
        
        # 7. Signature Prop Held in Left Hand in 3D Perspective!
        draw.polygon([(18, 40), (62, 34), (66, 122), (22, 128)], fill=prop_border)
        draw.polygon([(20, 42), (60, 36), (64, 120), (24, 126)], fill=prop_bg)
        
        # Spiral rings on left spine
        for sy in range(46, 120, 9):
            draw.rectangle([(15, sy), (21, sy + 3)], fill=(223, 230, 233, 255))
            
        # Prop center details
        if prop_bg == (15, 35, 60, 255):
            # Cyan tactical circle / tablet
            draw.ellipse([(32, 70), (52, 90)], outline=(0, 229, 255, 255), width=2)
            draw.rectangle([(28, 55), (52, 57)], fill=(0, 229, 255, 255))
            draw.rectangle([(28, 98), (52, 100)], fill=(255, 215, 0, 255))
        else:
            # Inten / math notebook panel
            draw.rectangle([(26, 58), (55, 94)], fill=(45, 52, 54, 255))
            draw.rectangle([(29, 64), (52, 66)], fill=(255, 255, 255, 255))
            draw.rectangle([(29, 72), (47, 74)], fill=(255, 255, 255, 255))
            draw.rectangle([(29, 80), (50, 82)], fill=(255, 215, 0, 255))
            
        # 8. Hands Gripping the Prop (3D Perspective!)
        # Top hand
        draw.polygon([(14, 44), (28, 42), (27, 56), (13, 58)], fill=sk_light)
        # Bottom hand
        draw.polygon([(18, 110), (32, 108), (30, 124), (16, 126)], fill=sk_light)
        draw.polygon([(10, 116), (20, 114), (18, 128), (8, 130)], fill=sk_shadow)
        
        # 9. Crisp nearest-neighbor upscale to 280x320
        final_out = player.resize((280, 320), Image.Resampling.NEAREST)
        final_out.save(out_path, format="PNG")
        print(f"Generated v2: {out_path}")

photo_to_pixel_player_v2("assets/personalia/user_photo.jpg", "assets/personalia/test_v2.png")
