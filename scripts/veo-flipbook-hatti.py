"""Veo videosu -> oyun flipbook kareleri.
Kullanım: python3 scripts/veo-flipbook-hatti.py video.mp4 cikti_klasoru [kare_sayisi=12]
Yaptıkları: (1) kare farkı analiziyle hareketin tepe anını bulur (düşüş sonrası geri dönüşü atar),
(2) 0->tepe arasından eşit aralıklı kare çeker, (3) düz zemini şeffaflaştırır,
(4) tüm kareleri ORTAK çerçeveye hizalar (titremesiz flipbook), (5) PNG dizisi yazar.
Uygulamada: ileri oynat + son karede sabitlen = solma; tersten = uyanma."""
import sys, subprocess, glob, os
from PIL import Image
import numpy as np

video, cikti = sys.argv[1], sys.argv[2]
N = int(sys.argv[3]) if len(sys.argv) > 3 else 12
os.makedirs(cikti, exist_ok=True); os.makedirs('/tmp/vk', exist_ok=True)
subprocess.run(f'ffmpeg -y -v error -i "{video}" -vf "fps=12,scale=320:-1" /tmp/vk/%03d.png', shell=True, check=True)
ks = sorted(glob.glob('/tmp/vk/*.png'))
ref = np.array(Image.open(ks[0]).convert('L'), dtype=int)
farklar = [np.abs(np.array(Image.open(f).convert('L'), dtype=int) - ref).mean() for f in ks]
tepe_sn = int(np.argmax(farklar)) / 12
print(f"tepe an: {tepe_sn:.2f} sn")
temiz, kutular = [], []
for i in range(N):
    t = round(i * tepe_sn / (N - 1), 3)
    subprocess.run(f'ffmpeg -y -v error -ss {t} -i "{video}" -frames:v 1 /tmp/vk/sec.png', shell=True, check=True)
    im = Image.open('/tmp/vk/sec.png').convert('RGBA'); a = np.array(im).astype(int); bg = a[8,8,:3]
    dist = np.sqrt(((a[:,:,:3]-bg)**2).sum(axis=2))
    alpha = np.clip((dist-20)*10, 0, 255).astype(np.uint8)
    out = a.astype(np.uint8); out[:,:,3] = alpha
    temiz.append(Image.fromarray(out)); kutular.append(Image.fromarray(alpha).getbbox())
x0=min(k[0] for k in kutular)-10; y0=min(k[1] for k in kutular)-10
x1=max(k[2] for k in kutular)+10; y1=max(k[3] for k in kutular)+10
for i, im in enumerate(temiz):
    c = im.crop((max(0,x0),max(0,y0),x1,y1)); h=420
    c.resize((int(c.width*h/c.height), h), Image.LANCZOS).save(f'{cikti}/{i:02d}.png', optimize=True)
print(f"{N} kare -> {cikti}")
