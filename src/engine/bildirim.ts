// Bildirim katmanı — expo-notifications yan etkileri.
// Uygulama her açıldığında ve abonelikler her değiştiğinde plan sıfırdan kurulur
// (önümüzdeki 3 gün); böylece tarife hep taze kalır.

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as depo from "../db/depo";
import { tr } from "../i18n/tr";
import { planUret } from "./tarife";

const PLAN_UFKU_GUN = 3;

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

// tarifeyi sıfırdan kur — abonelik listesi her değiştiğinde çağrılır
export async function planla(abonelikler: depo.Abonelik[]): Promise<void> {
  try {
    const izinli = await izinIste();
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!izinli) return;
    await kanalKur();

    const plan = planUret(abonelikler, new Date(), PLAN_UFKU_GUN, depo.sonKomutlar(3));
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
