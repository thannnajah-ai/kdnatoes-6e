#!/usr/bin/env python3
"""
scripts/convert_photos.py
=========================
Helper script untuk otomatisasi konversi foto siswa kelas XII-E menjadi
sprite tempur resolusi pixel-art retro Tekken 5 / 6 arcade.

Cara Penggunaan:
  1. Letakkan foto-foto siswa (JPG/PNG/WEBP) di folder:
     assets/personalia/raw/   (atau langsung di assets/personalia/)
  2. Jalankan:
     python scripts/convert_photos.py
  3. Atau konversi satu file spesifik:
     python scripts/convert_photos.py path/ke/foto.jpg

Hasil file akan disimpan di:
  assets/personalia/<nama>_pixel.png
Lalu script akan mencetak cuplikan konfigurasi JavaScript siap pakai untuk script.js!
"""

import sys
import os
from pathlib import Path
from PIL import Image, ImageEnhance, ImageOps

TARGET_WIDTH = 320
TARGET_HEIGHT = 380
PIXEL_FACTOR = 4  # Rasio pixelasi (320 / 4 = 80px retro grid)

def pixelate_fighter_portrait(input_path: Path, output_path: Path):
    print(f"[+] Memproses: {input_path.name} ...")
    try:
        with Image.open(input_path) as im:
            # 1. Pastikan orientasi EXIF benar (terutama untuk foto smartphone)
            im = ImageOps.exif_transpose(im)
            im = im.convert("RGBA")

            # 2. Crop/Fit ke aspek rasio target portrait (320x380)
            orig_w, orig_h = im.size
            target_ratio = TARGET_WIDTH / TARGET_HEIGHT
            orig_ratio = orig_w / orig_h

            if orig_ratio > target_ratio:
                # Terlalu lebar, crop horizontal tengah
                new_w = int(orig_h * target_ratio)
                left = (orig_w - new_w) // 2
                im = im.crop((left, 0, left + new_w, orig_h))
            else:
                # Terlalu tinggi, fokus ke bagian atas/tengah (wajah & badan atas)
                new_h = int(orig_w / target_ratio)
                top = max(0, int((orig_h - new_h) * 0.2))  # Sedikit bias ke atas
                im = im.crop((0, top, orig_w, top + new_h))

            # Resize ke ukuran standar
            im = im.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.LANCZOS)

            # 3. Peningkatan warna arcade (kontras & saturasi agar pixel art tajam)
            rgb = im.convert("RGB")
            rgb = ImageEnhance.Color(rgb).enhance(1.22)
            rgb = ImageEnhance.Contrast(rgb).enhance(1.12)

            # Kembalikan alpha jika ada
            r, g, b = rgb.split()
            im = Image.merge("RGBA", (r, g, b, im.split()[-1]))

            # 4. Efek Retro Pixel Art: Downscale lalu Upscale dengan Nearest Neighbor
            grid_w = TARGET_WIDTH // PIXEL_FACTOR
            grid_h = TARGET_HEIGHT // PIXEL_FACTOR

            small = im.resize((grid_w, grid_h), Image.Resampling.BOX)
            pixelated = small.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.NEAREST)

            # 5. Simpan output PNG
            output_path.parent.mkdir(parents=True, exist_ok=True)
            pixelated.save(output_path, format="PNG", optimize=True)

            print(f"    -> Berhasil disimpan: {output_path}")
            return True
    except Exception as e:
        print(f"[!] Gagal memproses {input_path.name}: {e}")
        return False

def main():
    workspace_root = Path(__file__).resolve().parent.parent
    personalia_dir = workspace_root / "assets" / "personalia"
    raw_dir = personalia_dir / "raw"
    raw_dir.mkdir(parents=True, exist_ok=True)

    input_files = []
    if len(sys.argv) > 1:
        # User memberikan file / folder spesifik sebagai argumen
        target = Path(sys.argv[1])
        if target.is_file():
            input_files = [target]
        elif target.is_dir():
            for ext in ("*.jpg", "*.jpeg", "*.png", "*.webp"):
                input_files.extend(target.glob(ext))
    else:
        # Default: Cek folder assets/personalia/raw/ terlebih dahulu
        for ext in ("*.jpg", "*.jpeg", "*.png", "*.webp"):
            input_files.extend(raw_dir.glob(ext))

        # Jika folder raw kosong, jangan timpa file _pixel.png yang sudah jadi
        if not input_files:
            print(f"[*] Folder raw/ kosong ({raw_dir}).")
            print("    Letakkan foto siswa baru ke folder tersebut untuk konversi otomatis.")

    if not input_files:
        print("[!] Tidak ada file foto yang diproses.")
        print(f"    Tips: Taruh foto (contoh: budi.jpg) di: {raw_dir}")
        print("    Lalu jalankan lagi: python scripts/convert_photos.py")
        return

    print(f"=== Memproses {len(input_files)} foto siswa XII-E ===")
    converted = []
    for f in input_files:
        if f.name.endswith("_pixel.png") or f.name.endswith("_player.png"):
            continue
        out_name = f.stem.lower().replace(" ", "_") + "_pixel.png"
        out_file = personalia_dir / out_name
        if pixelate_fighter_portrait(f, out_file):
            converted.append((f.stem, f"assets/personalia/{out_name}"))

    if converted:
        print("\n=== Cuplikan Konfigurasi untuk arcadeCharacters di script.js ===")
        for stem, path_rel in converted:
            display_name = stem.replace("_", " ").title()
            print(f"{{")
            print(f"    name: '{display_name}',")
            print(f"    photo: '{path_rel}',")
            print(f"    role: 'Anggota XII-E',")
            print(f"    title: 'The Challenger',")
            print(f"}},")
        print("================================================================")

if __name__ == "__main__":
    main()
