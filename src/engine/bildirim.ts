// Bildirim katmanı — expo-notifications yan etkileri (bahçe vizyonu: görev-bazlı).
// Kullanıcının kategori seçimi + ses tercihi görev havuzuna çevrilir; tarife motoru
// pencere içine eşit dağıtır. Saatler kullanıcıya asla gösterilmez.
// (Backoffice gelince komut-başına metin varyantı/pencere/gün config'ten okunacak.)

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { KATEGORILER } from "../data/kategoriler";
import * as depo from "../db/depo";
import { tr } from "../i18n/tr";
import { planUret, TarifeGirdisi } from "./tarife";

const PLAN_UFKU_GUN = 3;
const GUN_BOYU_PENCERE = 1; // PENCERELER[1] = 09–21

// ses tercihi → günlük bildirim adedi (tavan 5'in altında kalır)
const SES_ADEDI: Record<depo.SesTercihi, number> = { gunde1: 1, gunde3: 3, hic: 0 };

// uygulama açıkken sessiz: kullanıcı zaten buradaysa ses gereksizdir
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: false,
    shouldShowList: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

let kanalHazir = false;

async function kanalKur(): Promise<void> {
  if (kanalHazir || Platform.OS !== "android") {
    kanalHazir = true;
    return;
  }
  await Notifications.setNotificationChannelAsync("sesler", {
    name: tr.bildirim.kanalAdi,
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 120],
  });
  kanalHazir = true;
}

export async function izinIste(): Promise<boolean> {
  const mevcut = await Notifications.getPermissionsAsync();
  if (mevcut.granted) return true;
  const yeni = await Notifications.requestPermissionsAsync();
  return yeni.granted;
}

// seçim + ses tercihi → tek görev havuzu girdisi
function girdiKur(secim: depo.Secim, ses: depo.SesTercihi): TarifeGirdisi {
  const komutlar = KATEGORILER.flatMap((k) =>
    k.alt.filter((a) => (secim[k.id] ?? []).includes(a.id)).flatMap((a) => a.komutlar)
  );
  return {
    ad: "minik",
    komutlar,
    gunler: [0, 1, 2, 3, 4, 5, 6],
    adet: SES_ADEDI[ses],
    pencere: GUN_BOYU_PENCERE,
    pencereGun: null,
    aktif: true,
  };
}

// tarifeyi sıfırdan kur — seçim veya ses tercihi her değiştiğinde çağrılır
export async function planla(secim: depo.Secim, ses: depo.SesTercihi): Promise<void> {
  try {
    const izinli = await izinIste();
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!izinli || SES_ADEDI[ses] === 0) return;
    await kanalKur();

    const plan = planUret([girdiKur(secim, ses)], new Date(), PLAN_UFKU_GUN, depo.sonKomutlar(3));
    for (const madde of plan) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: madde.paketAd,
          body: madde.komut,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: madde.tarih,
          channelId: Platform.OS === "android" ? "sesler" : undefined,
        },
      });
    }
  } catch {
    // bildirim kurulamaması uygulamayı asla düşürmez (Expo Go kısıtları dahil)
  }
}
