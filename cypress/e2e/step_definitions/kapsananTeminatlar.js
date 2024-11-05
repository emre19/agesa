import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

import { kapsananTeminatlarPage } from "../../pages/KapsananTeminatlarPage";

Then("Kapsanan Teminatlar tablosu icerik kontrolu", () => {
  kapsananTeminatlarPage.kapsananTeminatlarKartIcerikKontrol();
});

When("Kapsanan detaylar kartı için poliçe numarası seçip ilgili servislerden gelen response kaydediyorum", () => {
  kapsananTeminatlarPage.policeNoSecipServisResponseKaydet();
});

Given("Teminat Tutarları linkine tıklıyorum coverageInfo servisinden dönen response kaydediyorum", () => {
  kapsananTeminatlarPage.teminatTutarlarinaTikla();
});

Then("Ürün ve police numarası teminat bilgisi ekranında gözükmelidir", () => {
  kapsananTeminatlarPage.urunAdiVePoliceNoKontrol();
});

Then("Teminat Tutarları içerik kontrolü", () => {
  kapsananTeminatlarPage.teminatTutarlariIcerikKontrol();
});

Then(
  "Teminat Bilgisi sayfasındaki sabit textler kontrolü",
  (table) => {
    table
      .raw()
      .flat()
      .forEach((item) => {
        kapsananTeminatlarPage.teminatBilgisiSabitTextKontrolu(item);
      });
  }
);

Then(
  "Teminatlar tablosunda aşağıdaki sütun isimlerini görmeliyim",
  (table) => {
    table
      .raw()
      .flat()
      .forEach((item) => {
        kapsananTeminatlarPage.teminatBilgisiSutunIsimleriKontrolu(item);
      });
  }
);

Then("Teminatlar tablosundaki satırların servisten gelen response ile uyumlu olmalı", () => {
  kapsananTeminatlarPage.teminatTablosuSatirlarKontrolu();
});

Then(
  "Kapsanan Teminatlar tablosu sabit textler kontrolü",
  (table) => {
    table
      .raw()
      .flat()
      .forEach((item) => {
        kapsananTeminatlarPage.kapsananTeminatlarSabitTextKontrolu(item);
      });
  }
);

Then("Teminatlar tablosundaki satırların servisten gelen response ile uyumlu olmalı", () => {
  kapsananTeminatlarPage.teminatTablosuSatirlarKontrolu();
});

Then("Vefat Teminatı Katsayısını Değiştir butonunun info icon mesajı servisten gelen response ile uyumlu olmalı", () => {
  kapsananTeminatlarPage.vefatTeminatiKatsayisiniDegistirInfoIconMsjKontrol();
});

Then("Kapsanan Teminatlar kartındaki info icon mesajları servisten gelen response ile uyumlu olmalı", () => {
  kapsananTeminatlarPage.kapsananTeminatlarInfoIconMsjKontrol();
});

Then("Kapsanan Teminatlar kartında info icon mesajı görmemeliyim", () => {
  kapsananTeminatlarPage.kapsananTeminatlarInfoIconMsjOlmamasiKontrolu();
});

