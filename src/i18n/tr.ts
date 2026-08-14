// Tüm Türkçe kullanıcı metinleri burada yaşar — koda gömülmez (CLAUDE.md).
// Suçluluk sözlüğü yasak: "kaçırdın", "başarısız", "seri bozuldu", "maalesef" kullanılmaz.

export const tr = {
  ortak: {
    dokun: "dokun",
    dokunVeDon: "dokun ve dön",
    gec: "geç",
    devam: "devam",
    anladim: "anladım",
    tamam: "tamam",
  },

  intro: {
    birinciSatir: "gün ne kadar dolu olursa olsun,\niçinde küçük bir söz için yer vardır.",
    ikinciBaslik: "burada seri yok,\nrozet yok, suçluluk yok.",
    ikinciAciklama:
      "günde tek küçük söz verirsin; tuttuğunda güneş doğar. ben günde en fazla bir kez seslenirim — üç dakikan yeter.",
  },

  onboarding: {
    hedefSoru: "peki — senin için ne değişsin?",
    hedefPlaceholder: "yazmaya başla",
    olarakEkle: (metin: string) => `"${metin}" olarak ekle`,

    nedenTekBaslik: "hepsini duydum.\nama tek biriyle başlayacağız.",
    nedenTekAciklama:
      "aynı anda çok şeyi değiştirmeye çalışanların başarısı dramatik düşer. diğerleri sırada güvende — iki hafta tutarlılıkta sıradakinin kilidi açılır.",
    nedenTekKaynak: "— Fogg, McKeown",

    secimSoru: "hangisiyle başlayalım?",

    nedenKucukBaslik: "şimdi onu\nşaşırtıcı derecede küçülteceğiz.",
    nedenKucukAciklama:
      "küçük hedefler başarıyı artırır, çünkü beyin başarıyı tekrar ister. büyütmek hep serbest — söz hep küçük kalacak.",
    nedenKucukKaynak: "— Fogg",

    mikroBaslik: "küçük versiyonu:",

    desteBaslik: "sana bir deste hazırladım.",
    desteDahaKart: (n: number) => `+ ${n} kart daha`,
    desteAciklama: (hafta: number) =>
      `çapa yok, saat yok. boşluğun olduğunda söylersin, kartı ben çekerim. haftada ${hafta} kart yeter.`,
    desteMikro: "desteden bir kart",
    desteCapa: "iki dakikan olduğu an",

    tetikBaslik: "çapaya gerek yok.",
    tetikAciklamaBas: "bu hedefin çapası hayatın kendisi: ",
    tetikAciklamaSon: " zaten en net hatırlatıcı. o an geldiğinde ben değil, durum hatırlatır.",

    nedenCapaBaslik: "şimdi onu\nbir ana bağlayacağız.",
    nedenCapaAciklama:
      "yeni alışkanlık boşlukta unutulur. zaten yaptığın bir şeyin ardına eklersen, önceki alışkanlık zili çalar.",
    nedenCapaKaynak: "— Clear",

    capaSoru: "hangi anın ardına?",

    sozKimlik: (kim: string) => `çünkü sen ${kim} birisin.`,
    sozUygulama:
      "benim sözüm: günde en fazla bir kez seslenirim.\nseri yok, suçluluk yok. günde üç dakikan yeter.",
    sozBaslayalim: "söz — başlayalım",
  },

  gunAdlari: ["pazar", "pazartesi", "salı", "çarşamba", "perşembe", "cuma", "cumartesi"],

  bugun: {
    hafta: (n: number) => `hafta ${n}`,

    // 🌱🕰️🐌 çapa ailesi
    tekIsinVar: "tek işin var.",
    bugunlukBuKadar: "bugünlük bu kadar.",
    gunesDogar: "sözünü tuttuğunda güneş doğar",
    yaptim: "yaptım",
    canimIstemiyor: "bugün canım hiç istemiyor",

    // 🧺 dağınık bakım
    desteHazir: "deste hazır.",
    birKartDahaGitti: "bir kart daha gitti.",
    haftaSayaci: (yapilan: number, hedef: number) => `bu hafta ${yapilan}/${hedef}`,
    ikiDakikamVar: "iki dakikam var",
    evBeniYendi: "bugün ev beni yendi",
    cesaretKarti: "cesaret kartı · ",
    ikiDakika: "iki dakika. fazlası serbest.",
    baskaKart: "başka kart",
    desteDuzenlemeOnerisi: "üst üste geri koyuyorsun — istersen desteyi birlikte düzenleyelim.",
    ikiDakikamDahaVar: "iki dakikam daha var",
  },

  kutlama: {
    oy: (n: number) => `${n}. oy`,
    not: { kaynak: "Clear", metin: "her tekrar, o kişiye atılmış bir oydur." },
  },

  ilkYardim: {
    iyiKiSoyledin: "iyi ki söyledin.",
    nasilIstememe: "nasıl bir istememe bu?",
    secenekler: ["yorgunum", "sıkıldım", "kafam çok dolu", "sebepsiz — işte istemiyorum"],
    vazgectim: "vazgeçtim, iyiyim",

    nefesYonerge: "büyürken al, küçülürken ver.\nbir dakika buradayım.",
    birazDahaIyiyim: "biraz daha iyiyim",

    receteler: {
      yorgun: {
        baslik: "o zaman bugün izin günü tarifi.",
        metin: "tarif değil, sadece hazırlığı. sayılır — söz.",
      },
      sikildim: {
        baslik: "sıkıcı olan tarif, sen değilsin.",
        metin: "bugün sevdiğin bir şeyle eşleştir: podcast, müzik, ne iyi geliyorsa.",
      },
      istemiyorum: {
        baslik: "iki dakika anlaşması.",
        metin: "sadece başla. iki dakika sonra bırakabilirsin — gerçekten. gelmese de anlaşma geçerli.",
      },
    },
    deniyorum: "tamam, deniyorum",
    halaOlmuyor: "hâlâ olmuyor",

    izinBaslik: "bugünü boş bırakalım.",
    izinMetin: "bazı günler böyledir. yarın buradayım —\naynı an, aynı küçük tarif.",
    gorusuruz: "görüşürüz",
  },

  ornekHedefler: [
    "spora başlamak",
    "kitap okumak",
    "evi toplamak",
    "şekeri azaltmak",
    "öfkelenince sakin kalmak",
  ],

  capalar: [
    "kahve makinesi çalışırken",
    "bebek uyuyunca",
    "diş fırçasından sonra",
    "telefonu şarja takınca",
  ],

  // arketiplerin kullanıcıya görünen yüzü
  arketip: {
    baslama: {
      ad: "başlama",
      kim: "sözünü tutan",
      mikro: ["2 dakikalık versiyonu", "sadece hazırlığı yap", "ilk küçük adımı at"],
    },
    birakma: {
      ad: "bırakma",
      kim: "iradesine güvenen",
      mikro: ["istek gelince bir bardak su iç", "10 dakika ertele", "elini başka şeyle meşgul et"],
    },
    azaltma: {
      ad: "azaltma",
      kim: "dengesini kuran",
      mikro: ["porsiyonu yarıya böl", "önce alternatifi dene", "limiti bir tık düşür"],
    },
    duzenlilik: {
      ad: "düzen",
      kim: "ritmini bulan",
      mikro: ["aynı ana sabitle", "hazırlığı akşamdan yap", "bir bardak suyla başlat"],
    },
    erteleme: {
      ad: "erteleme yenme",
      kim: "başlayabilen",
      mikro: ["sadece 2 dakika başla", "dosyayı aç, o kadar", "ilk cümleyi yaz"],
    },
    duygu: {
      ad: "duygu anı",
      kim: "fırtınada sakin kalan",
      mikro: ["üç derin nefes", "odayı değiştir", "içinden ona kadar say"],
    },
    daginik: {
      ad: "dağınık bakım",
      kim: "evine sahip çıkan",
      mikro: [] as string[],
    },
  },

  // tetikli arketiplerde "çapa" yerine geçen an
  tetik: {
    duygu: "o duygu yükseldiği an",
    birakma: "istek geldiği an",
    azaltma: "istek geldiği an",
  },
} as const;

export type ArketipId = keyof typeof tr.arketip;
