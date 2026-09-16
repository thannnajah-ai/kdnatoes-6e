from PIL import Image, ImageDraw, ImageOps

def render_arcade_player_sprite(skin_tuple, hair_tuple, shirt_tuple, prop_type="book", has_glasses=False, has_teeth=True):
    W, H = 140, 160
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)

    sk_light, sk_shadow = skin_tuple
    hair_dark, hair_mid, hair_hi = hair_tuple
    shirt_light, shirt_shadow, tie_col = shirt_tuple

    # 1. Torso
    for y in range(120, 160):
        w_chest = 40 + int((y - 120) * 0.5)
        for x in range(70 - w_chest, 70 + w_chest):
            col = shirt_shadow if (x < 40 or x > 95 or y > 145) else shirt_light
            im.putpixel((x, y), col)

    # Collar V-neck & flaps
    draw.polygon([(56, 118), (70, 134), (66, 135), (50, 126)], fill=shirt_light, outline=shirt_shadow)
    draw.polygon([(84, 118), (70, 134), (74, 135), (90, 126)], fill=shirt_light, outline=shirt_shadow)
    if tie_col:
        draw.rectangle([68, 126, 72, 148], fill=tie_col)

    # 2. Head & Neck
    face_cx, face_cy = 82, 85
    # Neck
    for ny in range(104, 124):
        for nx in range(face_cx - 10, face_cx + 10):
            im.putpixel((nx, ny), sk_shadow)

    # Face base
    for y in range(face_cy - 26, face_cy + 25):
        dy = y - face_cy
        w_f = int(22 - dy * 0.48) if dy > 0 else int(22 - abs(dy) * 0.15)
        for x in range(face_cx - w_f, face_cx + w_f):
            if x < face_cx - 6:
                col = sk_shadow
            elif x > face_cx + 7:
                col = (min(255, sk_light[0] + 15), min(255, sk_light[1] + 15), min(255, sk_light[2] + 15), 255)
            else:
                col = sk_light
            im.putpixel((x, y), col)

    # Right Ear
    for ey in range(80, 94):
        for ex in range(face_cx + 20, face_cx + 26):
            im.putpixel((ex, ey), sk_light if ex < face_cx + 23 else sk_shadow)

    # 3. Features
    if has_glasses:
        # Sunglasses / Visor
        draw.polygon([(62, 73), (102, 73), (98, 83), (64, 83)], fill=(15, 23, 42, 255))
        draw.rectangle([(66, 75), (78, 77)], fill=(0, 229, 255, 255))
        draw.rectangle([(84, 75), (96, 77)], fill=(0, 229, 255, 255))
        draw.rectangle([(72, 78), (76, 79)], fill=(255, 255, 255, 255))
        draw.rectangle([(90, 78), (94, 79)], fill=(255, 255, 255, 255))
    else:
        # Eyebrows
        for bx in range(68, 76):
            im.putpixel((bx, 73), hair_dark)
            im.putpixel((bx, 74), hair_dark)
        for bx in range(85, 98):
            im.putpixel((bx, 72 - int((bx - 85)*0.2)), hair_dark)
            im.putpixel((bx, 73 - int((bx - 85)*0.2)), hair_dark)

        # Eyes
        draw.line([(70, 78), (76, 78)], fill=hair_dark, width=2)
        im.putpixel((73, 79), (90, 24, 24, 255))
        draw.line([(86, 77), (95, 77)], fill=hair_dark, width=2)
        im.putpixel((90, 78), (30, 20, 18, 255))
        im.putpixel((91, 78), (30, 20, 18, 255))
        im.putpixel((92, 78), (255, 255, 255, 255)) # sparkle highlight

    # Nose
    draw.line([(81, 80), (81, 89)], fill=sk_shadow)
    im.putpixel((80, 89), sk_shadow)
    im.putpixel((82, 89), sk_light)

    # Mouth
    mouth_y = 96
    if has_teeth:
        for my in range(mouth_y, mouth_y + 9):
            mw = int(14 - (my - mouth_y - 2)**2 * 0.25)
            if mw > 0:
                for mx in range(face_cx - mw + 1, face_cx + mw - 1):
                    im.putpixel((mx, my), (90, 24, 24, 255))
        # Upper teeth
        for tx in range(face_cx - 10, face_cx + 10):
            im.putpixel((tx, mouth_y + 1), (255, 255, 255, 255))
            im.putpixel((tx, mouth_y + 2), (255, 255, 255, 255))
            im.putpixel((tx, mouth_y + 3), (255, 255, 255, 255) if abs(tx - face_cx) < 8 else (90, 24, 24, 255))
        # Lower pink tongue
        for tx in range(face_cx - 6, face_cx + 6):
            im.putpixel((tx, mouth_y + 6), (225, 90, 100, 255))
        draw.arc([face_cx - 13, mouth_y - 2, face_cx + 13, mouth_y + 10], 0, 180, fill=(195, 105, 90, 255))
    else:
        # Smirk
        draw.line([(face_cx - 8, mouth_y + 2), (face_cx + 8, mouth_y + 1)], fill=(90, 24, 24, 255), width=2)
        draw.line([(face_cx - 6, mouth_y + 2), (face_cx + 6, mouth_y + 2)], fill=(255, 255, 255, 255), width=1)

    # 4. Spiky Hair
    hair_spikes = [
        (65, 62, 58, 44, 7),
        (72, 60, 68, 38, 8),
        (80, 58, 82, 34, 9),
        (88, 58, 96, 36, 8),
        (96, 62, 108, 40, 8),
        (102, 66, 116, 48, 7),
        (106, 72, 120, 60, 6),
        (102, 80, 114, 76, 5),
        (75, 66, 73, 52, 6),
        (85, 64, 88, 48, 7),
        (94, 66, 100, 52, 6),
        (68, 70, 62, 56, 6),
    ]
    for y in range(48, 76):
        for x in range(62, 108):
            if (x - 85)**2 / 24**2 + (y - 70)**2 / 16**2 <= 1:
                im.putpixel((x, y), hair_mid)
    for bx, by, tx, ty, thick in hair_spikes:
        draw.polygon([(bx - thick//2, by), (tx, ty), (bx + thick//2, by)], fill=hair_dark)
        draw.line([(bx, by), (tx, ty)], fill=hair_mid, width=2)
        im.putpixel((tx, ty), hair_hi)
    bangs = [(68, 68), (72, 70), (76, 69), (80, 72), (84, 70), (88, 71), (94, 69)]
    for fx, fy in bangs:
        draw.polygon([(fx-3, fy-6), (fx, fy), (fx+3, fy-6)], fill=hair_dark)

    # 5. Held Prop (Book or Tablet)
    book_pts = [(16, 56), (64, 46), (68, 134), (20, 144)]
    if prop_type == "tablet":
        # Sub-zero cyan tactical tablet
        draw.polygon([(14, 58), (18, 55), (22, 143), (18, 146)], fill=(10, 25, 45, 255))
        draw.polygon(book_pts, fill=(15, 35, 60, 255))
        draw.polygon(book_pts, outline=(0, 229, 255, 255))
        # Cyan glowing border & radar circle
        draw.ellipse([(30, 75), (52, 97)], outline=(0, 229, 255, 255), width=2)
        draw.rectangle([(24, 60), (56, 62)], fill=(0, 229, 255, 255))
        draw.rectangle([(26, 67), (48, 68)], fill=(255, 255, 255, 255))
        draw.rectangle([(24, 110), (56, 112)], fill=(241, 196, 15, 255))
    else:
        # Red Prosus Inten book
        draw.polygon([(14, 58), (18, 55), (22, 143), (18, 146)], fill=(220, 215, 205, 255)) # pages
        draw.polygon(book_pts, fill=(248, 242, 235, 255))
        # Red banners
        draw.polygon([(17, 56), (64, 46), (65, 78), (18, 88)], fill=(210, 35, 45, 255))
        draw.polygon([(19, 108), (66, 98), (68, 134), (20, 144)], fill=(210, 35, 45, 255))
        draw.line([(24, 65), (58, 58)], fill=(255, 255, 255, 255), width=3)
        draw.line([(28, 71), (54, 66)], fill=(255, 255, 255, 255), width=2)
        draw.polygon([(22, 85), (62, 77), (64, 102), (24, 110)], fill=(40, 45, 60, 255))
        for px, py in [(28, 92), (34, 91), (40, 90), (46, 89), (52, 88), (30, 97), (36, 96), (42, 95), (48, 94)]:
            im.putpixel((px, py), (220, 180, 160, 255))
        draw.line([(26, 120), (60, 113)], fill=(255, 255, 255, 255), width=3)
        draw.line([(28, 127), (58, 121)], fill=(255, 215, 0, 255), width=2)
        draw.polygon(book_pts, outline=(155, 20, 30, 255))

    # Spiral rings on book spine
    for sy in range(58, 138, 10):
        draw.rectangle([(16, sy), (21, sy + 3)], fill=(223, 230, 233, 255))

    # 6. Hands holding prop
    draw.polygon([(6, 120), (18, 108), (24, 114), (12, 132)], fill=sk_shadow)
    fingers = [(15, 64, 22, 62), (16, 72, 23, 70), (17, 80, 24, 78), (18, 88, 25, 86)]
    for fx1, fy1, fx2, fy2 in fingers:
        draw.line([(fx1, fy1), (fx2, fy2)], fill=sk_light, width=4)
        im.putpixel((fx2, fy2), (255, 205, 175, 255))
        draw.line([(fx1, fy1), (fx2, fy2)], fill=(15, 12, 16, 255), width=1)
    draw.polygon([(14, 52), (26, 48), (28, 58), (16, 62)], fill=sk_light, outline=sk_shadow)

    # 7. Desk in foreground
    draw.polygon([(15, 136), (125, 136), (138, 160), (10, 160)], fill=(178, 190, 195, 255))
    draw.polygon([(65, 132), (110, 132), (118, 150), (60, 150)], fill=(245, 246, 250, 255)) # paper sheet

    return im

# Generate Anas version
sk = ((245, 185, 150, 255), (180, 115, 85, 255))
hr = ((24, 28, 36, 255), (40, 48, 62, 255), (65, 80, 105, 255))
sh = ((0, 206, 201, 255), (0, 140, 140, 255), (9, 132, 227, 255))
anas_sprite = render_arcade_player_sprite(sk, hr, sh, prop_type="tablet", has_glasses=True, has_teeth=True)
anas_sprite.save("assets/personalia/anas_perfect_player.png")
print("anas_perfect_player.png generated!")
