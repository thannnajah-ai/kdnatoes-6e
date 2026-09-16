import os
from PIL import Image, ImageDraw, ImageOps, ImageEnhance, ImageFilter

def smart_photo_to_pixel_player(img_path, out_path):
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
            top = max(0, int((H_orig - new_h) * 0.10))
            cropped = orig.crop((0, top, W_orig, top + new_h))
            
        # Resize to 140x160
        base_140 = cropped.resize((140, 160), Image.Resampling.LANCZOS)
        
        # 2. Extract Palette from Photo
        pix = base_140.load()
        
        # Sample Face Region (x: 55..95, y: 55..80)
        face_colors = []
        for x in range(55, 95):
            for y in range(55, 80):
                face_colors.append(pix[x, y][:3])
        face_colors.sort(key=lambda c: 0.299*c[0] + 0.587*c[1] + 0.114*c[2])
        # Pick 60th percentile for skin tone
        skin_mid = face_colors[int(len(face_colors) * 0.6)]
        skin_light = (min(255, int(skin_mid[0] * 1.15)), min(255, int(skin_mid[1] * 1.12)), min(255, int(skin_mid[2] * 1.10)))
        skin_shadow = (int(skin_mid[0] * 0.75), int(skin_mid[1] * 0.70), int(skin_mid[2] * 0.65))
        
        # Sample Hair Region (x: 50..95, y: 15..38)
        hair_colors = []
        for x in range(50, 95):
            for y in range(15, 38):
                hair_colors.append(pix[x, y][:3])
        hair_colors.sort(key=lambda c: 0.299*c[0] + 0.587*c[1] + 0.114*c[2])
        hair_dark = hair_colors[int(len(hair_colors) * 0.25)]
        hair_dark = (min(60, hair_dark[0]), min(60, hair_dark[1]), min(65, hair_dark[2]))
        hair_hi = (min(255, hair_dark[0] + 45), min(255, hair_dark[1] + 45), min(255, hair_dark[2] + 55))
        
        # Sample Shirt Region (x: 55..100, y: 120..145)
        shirt_colors = []
        for x in range(55, 100):
            for y in range(120, 145):
                shirt_colors.append(pix[x, y][:3])
        shirt_colors.sort(key=lambda c: 0.299*c[0] + 0.587*c[1] + 0.114*c[2])
        shirt_col = shirt_colors[len(shirt_colors) // 2]
        
        # Sample Prop/Book Region (x: 18..55, y: 50..105)
        prop_colors = []
        for x in range(18, 55):
            for y in range(50, 105):
                prop_colors.append(pix[x, y][:3])
        # Find dominant colorful pixel (highest saturation)
        def sat(c):
            mx = max(c)
            mn = min(c)
            return 0 if mx == 0 else (mx - mn) / mx
        prop_colors.sort(key=sat, reverse=True)
        top_prop = prop_colors[len(prop_colors) // 4]
        
        print("Detected Skin:", skin_light, skin_shadow)
        print("Detected Hair:", hair_dark)
        print("Detected Shirt:", shirt_col)
        print("Detected Prop:", top_prop)
        
        # Check if the photo has an object/book with red, blue, green, etc.
        pr, pg, pb = top_prop
        if pr > pg + 25 and pr > pb + 25:
            # Red book like Iqbal!
            prop_main = (200, 35, 35, 255)
            prop_dark = (140, 20, 20, 255)
        elif pb > pr + 20 and pb > pg + 20:
            # Cyan/blue tactical tablet
            prop_main = (0, 180, 210, 255)
            prop_dark = (0, 110, 140, 255)
        elif sat(top_prop) > 0.25:
            prop_main = (pr, pg, pb, 255)
            prop_dark = (int(pr*0.7), int(pg*0.7), int(pb*0.7), 255)
        else:
            # Default to stylish dark tactical book
            prop_main = (45, 52, 54, 255)
            prop_dark = (30, 35, 38, 255)
            
        # 3. Create the Fighter Player canvas (140x160)
        player = Image.new("RGBA", (140, 160), (0, 0, 0, 0))
        draw = ImageDraw.Draw(player)
        
        # A. Desk Surface & Exam Sheet in foreground
        draw.polygon([(15, 126), (125, 126), (138, 160), (10, 160)], fill=(178, 190, 195, 255))
        draw.polygon([(65, 122), (110, 122), (118, 145), (60, 145)], fill=(245, 246, 250, 255))
        
        # B. Torso & Shirt (Using detected shirt color from photo)
        sr, sg, sb = shirt_col
        s_main = (sr, sg, sb, 255)
        s_shadow = (int(sr * 0.7), int(sg * 0.7), int(sb * 0.7), 255)
        draw.rectangle([55, 95, 115, 130], fill=s_main)
        draw.rectangle([85, 95, 115, 130], fill=s_shadow)
        # White shirt collar
        draw.rectangle([70, 92, 85, 108], fill=(255, 255, 255, 255))
        # Tie or center stripe
        draw.rectangle([76, 98, 80, 125], fill=(min(255, sr+40), min(255, sg+40), min(255, sb+40), 255))
        
        # C. Head & Neck (Using detected skin tone from photo)
        draw.rectangle([68, 75, 88, 95], fill=(*skin_shadow, 255))
        # Angular arcade jaw & face
        draw.polygon([(60, 45), (105, 45), (98, 88), (68, 88)], fill=(*skin_light, 255))
        draw.polygon([(88, 45), (105, 45), (98, 88), (86, 88)], fill=(*skin_shadow, 255))
        # Ear
        draw.rectangle([102, 54, 108, 68], fill=(*skin_shadow, 255))
        
        # D. Expressive Arcade Smile with Teeth (Like Foto 1!)
        draw.polygon([(72, 74), (92, 74), (88, 81), (74, 81)], fill=(120, 25, 25, 255))
        draw.rectangle([(74, 75), (90, 77)], fill=(255, 255, 255, 255))
        
        # E. Arcade Eyes
        draw.rectangle([(67, 56), (75, 60)], fill=(30, 30, 30, 255))
        draw.rectangle([(85, 56), (93, 60)], fill=(30, 30, 30, 255))
        draw.rectangle([(71, 57), (74, 59)], fill=(255, 255, 255, 255))
        draw.rectangle([(89, 57), (92, 59)], fill=(255, 255, 255, 255))
        
        # F. Dynamic Hair (Using detected hair color from photo)
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
            draw.polygon(sp, fill=(*hair_dark, 255))
        draw.polygon([(60, 40), (105, 40), (105, 50), (60, 50)], fill=(*hair_dark, 255))
        draw.polygon([(62, 42), (95, 42), (95, 46), (62, 46)], fill=(*hair_hi, 255))
        
        # G. Signature Prop held in hand (Detected book/item)
        draw.polygon([(18, 40), (62, 34), (66, 122), (22, 128)], fill=prop_dark)
        draw.polygon([(20, 42), (60, 36), (64, 120), (24, 126)], fill=prop_main)
        
        # Spiral rings on left spine
        for sy in range(46, 120, 9):
            draw.rectangle([(15, sy), (21, sy + 3)], fill=(223, 230, 233, 255))
            
        # Center panel
        draw.rectangle([(26, 58), (55, 94)], fill=(45, 52, 54, 255))
        draw.rectangle([(29, 64), (52, 66)], fill=(255, 255, 255, 255))
        draw.rectangle([(29, 72), (47, 74)], fill=(255, 255, 255, 255))
        draw.rectangle([(29, 80), (50, 82)], fill=(255, 215, 0, 255))
        
        # Hands holding prop (using detected skin)
        draw.polygon([(14, 44), (28, 42), (27, 56), (13, 58)], fill=(*skin_light, 255))
        draw.polygon([(18, 110), (32, 108), (30, 124), (16, 126)], fill=(*skin_light, 255))
        draw.polygon([(10, 116), (20, 114), (18, 128), (8, 130)], fill=(*skin_shadow, 255))
        
        # Final upscale 2x nearest neighbor (280x320)
        final_out = player.resize((280, 320), Image.Resampling.NEAREST)
        final_out.save(out_path, format="PNG")
        print("Smart photo to pixel player complete ->", out_path)

smart_photo_to_pixel_player("assets/personalia/user_photo.jpg", "assets/personalia/smart_player_test.png")
