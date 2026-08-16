// Tüm Türkçe kullanıcı metinleri burada yaşar — koda gömülmez (CLAUDE.md).
// Suçluluk sözlüğü yasak: "kaçırdın", "başarısız", "seri bozuldu", "maalesef" kullanılmaz.

export const tr = {
  ortak: {
    dokun: "dokun",
    devam: "devam",
    geri: "geri",
    tamam: "tamam",
    vazgec: "vazgeç",
  },

  intro: {
    birinciSatir: "gün ne kadar dolu olursa olsun,\niçinde küçük bir söz için yer vardır.",
    ikinciBaslik: "burada kontrol sende.",
    ikinciAciklama:
      "neyi, ne zaman hatırlatacağımı sen seçersin.\nben usulca seslenirim — asla yormam.\nher \"yaptım\" bir kanıt, her kanıtta güneş doğar.",
  },

  kurulum: {
    paketSoru: "ne hatırlatayım?",

    komutlarNot: "bildirimler bu komutlardan gelir — dokunup çıkarabilirsin",
    komutlarNotBos: "kendi komutlarını yaz",
    komutEklePlaceholder: "+ kendi komutunu yaz",

    gunlerSoru: "hangi günler?",
    gunlerNot: "istediğin kadar işaretle",
    herGun: "her gün",

    adetSoru: "günde kaç kez?",
    adetNot: (tavan: number) => `günlük toplam tavan ${tavan} — fazla ses, sesi görünmez yapar`,
    adetDigerPaketler: (n: number) => ` · diğer paketlerin ${n} hakkı kullanıyor`,
    adetSecenek: (i: number) => `günde ${["bir", "iki", "üç", "dört", "beş"][i]} kez`,
    tavanDolu: "bugünlük ses hakkın dolu — önce bir paketi sessize al.",

    pencereSoru: "günün hangi aralığına?",
    pencereEtiketleri: ["sabah · 08–12", "gün boyu · 09–21", "akşam · 18–23"],
    gunBazliIstiyorum: "gün bazlı ayarlamak istiyorum",
    gunBazliEtiket: "saatleri gün gün senin ayarınla",
    pencereGunBaslik: "gün gün:",
    pencereGunNot: "aralığa dokun, değişsin",

    ozetHerGun: "her gün",
    ozetSatir: (adet: number, pencereMetni: string, komutSayisi: number) =>
      `günde ${adet} kez, ${pencereMetni} — ${komutSayisi} komuttan sırayla.`,
    ozetPencereArasinda: (etiket: string) => `${etiket} arasında`,
    ozetKanit: "her \"yaptım\" bir kanıt: güneş doğar, sayaç büyür.",
    baslasin: "başlasın",
  },

  bugun: {
    bugunSayaci: (bugun: number, toplam: number) => ` · bugün ${bugun} · toplam ${toplam} kanıt`,
    hazirOldugunda: "hazır olduğunda.",
    guzelGidiyor: "güzel gidiyor.",
    kucukBirSey: "küçük bir şey:",
    ikiDakikamVar: "iki dakikam var",
    yaptim: "yaptım",
    simdiOlmadi: "şimdi olmadı",
    sonraMesaji: "sorun yok — birazdan usulca yine sorarım.",
    not: { kaynak: "Clear", metin: "her tekrar, o kişiye atılmış bir oydur." },
    sesSatiri: "ara ara ben de seslenirim —\nsaatlerini dert etme, o benim işim.",
  },

  gecmis: {
    baslik: "geçmiş",
    altBaslik: (gun: number, kanit: number) => `son ${gun} gün · ${kanit} kanıt`,
    solEtiket: "iki hafta önce",
    sagEtiket: "bugün",
    oran: (gun: number, dolu: number) => `${gun} günün ${dolu}'ünde en az bir kanıt bıraktın.`,
    kapanis: "boş günler kayıp değil — sadece sessiz.",
  },

  paketler: {
    baslik: "paketlerim",
    sesSayaci: (kullanilan: number, tavan: number) => `günlük ses: ${kullanilan}/${tavan}`,
    gundeAdet: (n: number) => `günde ${n}`,
    sessizeAl: "sessize al",
    sesiAc: "sesi aç",
    yeniPaket: "+ yeni paket",
  },

  kimlik: {
    baslik: "sen sözünü tutan\nbirisin.",
    kanit: "kanıt",
    altYazi: "her \"yaptım\" buraya bir güneş bıraktı",
    bosIddia: "şimdilik bu bir iddia.\nbirlikte kanıta çevireceğiz.",
    bosNot: "ilk kanıt için tek \"yaptım\" yeter.",
    bugunGit: "bugüne git",
  },

  bildirim: {
    kanalAdi: "usulca sesler",
  },

  alanlar: ["bugün", "geçmiş", "paketler", "kimlik"] as const,

  // gün etiketleri: 0 = pazartesi ... 6 = pazar
  gunKisa: ["pzt", "sal", "çar", "per", "cum", "cmt", "paz"],
  gunAdlari: ["pazartesi", "salı", "çarşamba", "perşembe", "cuma", "cumartesi", "pazar"],
} as const;
