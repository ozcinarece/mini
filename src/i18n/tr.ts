// Tüm Türkçe kullanıcı metinleri burada yaşar — koda gömülmez (CLAUDE.md).
// Suçluluk sözlüğü yasak: "kaçırdın", "başarısız", "seri bozuldu", "öldü" kullanılmaz.

export const tr = {
  ortak: {
    dokun: "DOKUN",
    geri: "geri",
    devam: "Devam",
  },

  onboarding: {
    kapiBaslik: "Burası senin bahçen.",
    kapiAlt: "Hayatını düzene soktukça, onun güzelleştiğini göreceksin.",

    renkAlanBaslik: "Her çiçek, hayatının bir alanı.",
    renkAlanDevami: "…ve daha fazlası",
    renkAlanKapanis: "Sen onlara baktıkça, onlar açar.",

    guvenceBaslik: "Bakamadığın gün\nçiçeğin ölmez — uyur.",
    guvenceAlt: "Burada suçluluk yok, ceza yok, seri yok.\nDöndüğünde bahçen seni bekliyor olacak.",

    kategoriBaslik: "Hangi alanlara bakmak istersin?",
    kategoriAlt: "İster tek alana yoğunlaş, ister hepsine — bahçe senin.",
    devamSayili: (n: number) => `Devam (${n} alan)`,
    onizlemeBos: "alan seçtikçe burada açacak 🌱",

    hediyeBaslik: "Hoş geldin hediyen 🌱",
    hediyeAlt: "Seçtiğin her alandan bir tohum ektik bile — ilk filizlerin:",

    nasilBaslik: "Bahçe böyle büyür:",
    nasilSatirlar: [
      ["🌙", "Günlük hedeflerini tamamla", "tohum kazan"],
      ["💧", "Gün içindeki mini işleri yap", "o alanın çiçeği sulanır, büyür"],
      ["🧺", "Olgunlaşınca topla", "kazandıklarınla bahçeni süsle"],
    ],

    sesBaslik: "Sana ne kadar sesleneyim?",
    sesAlt: "Günlük tavan hep 5 — fazla ses, sesi görünmez yapar.",
    sesSecenekleri: [
      { id: "gunde1", metin: "Günde bir kez, yeter" },
      { id: "gunde3", metin: "Ara sıra dürt — günde 2-3" },
      { id: "hic", metin: "Hiç seslenme, ben gelirim" },
    ],

    bahcenBaslik: "İşte bahçen 🌱",
    bahcenAlt: "İlk filizlerin seni bekliyor.\nKüçük bir işle sulamak ister misin?",
    ilkGorev: "İlk görevimi göster",
    sonraBakayim: "şimdilik bahçeme bakayım",
  },

  bahce: {
    kanit: (n: number) => `✓ ${n} kanıt`,
    ekimIpucu: (ad: string) => `${ad} — boş kareye dokun`,
    hasatIpucu: "olgun sebzeler parlar — dokun, topla",
    bolgeKilidi: (fiyat: number) => `🔒 aç: ${fiyat} 🪙`,
    bolgeAcildi: "bölge açıldı 🌿",
    yeniTur: (ad: string) => `yeni: ${ad} 🌱`,

    panelBugun: "bugün",
    panelDukkan: "dükkân",

    yaptim: "Yaptım",
    ilkKanitEki: " (+1 ilk kanıt)",
    simdiOlmadi: "şimdi olmadı",
    sonraMesaji: "sorun yok — birazdan usulca yine sorarım.",
    gorevYok: "bugünlük görev havuzu sakin — bahçen keyfine bakıyor.",

    dukkanTohum: "🌰 tohumluk",
    dukkanDekor: "🪙 dekor",
    kilitliEsik: (mevcut: number, esik: number) => `🔒 ${mevcut}/${esik} kanıt`,
    sandiktan: "sandıktan ✨",
    sebzeKari: (n: number) => ` → +${n} 🪙`,
  },

  bildirim: {
    kanalAdi: "usulca sesler",
  },
} as const;
