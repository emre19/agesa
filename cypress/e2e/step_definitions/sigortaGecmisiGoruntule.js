import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { sigortaGecmisiGoruntule } from "../../pages/SigortaGecmisiGoruntulePage";

When(
  "{string} butonuna tıklayıp ilgili servislerinden gelen response kaydediyorum",
  (butonIsmi) => {
    sigortaGecmisiGoruntule.servisResponseAlarakSigortaGecmisiGoruntuleTikla(
      butonIsmi
    );
  }
);

Then(
  "Aşağıdaki sabit değerler Sigorta Geçmişini Görüntüle sayfasında görüntülenmelidir",
  (table) => {
    table
      .raw()
      .flat()
      .forEach((item) => {
        sigortaGecmisiGoruntule.sabitTextleriSayfadaGoruntuleme(item);
      });
  }
);

Then(
  "Sayfa açıldığında hızlı tarih seçimi {string} olarak seçilmiş gözükmelidir",
  (radioButton) => {
    sigortaGecmisiGoruntule.selectedHizliTarihSecimiKontrol(radioButton);
  }
);

Then(
  "İkinci tarih aralığı bugünün tarihini ve birinci tarih aralığı ise bugünden 1 ay öncesini göstermelidir",
  () => {
    sigortaGecmisiGoruntule.tarihAraliklarininKontrolu();
  }
);

Then(
  "Sigorta geçmişini görüntüle sayfasında soldaki tablo servisten gelen data ile uyumlu olmalı",
  () => {
    const tabloNo = 0;
    sigortaGecmisiGoruntule.soldakiTabloKontrol(tabloNo);
  }
);

Then(
  "Sigorta geçmişini görüntüle sayfasında sagdaki tablo servisten gelen data ile uyumlu olmalı",
  () => {
    const tabloNo = 1;
    sigortaGecmisiGoruntule.sagdakiTabloKontrol(tabloNo);
  }
);

When(
  "Hesap Hareketleri tablosunu filtrelemek için {int}. tarih aralığını gün-ay-yıl olarak {string}-{string}-{string} giriyorum",
  (kacinciTarih, gun, ay, yil) => {
    sigortaGecmisiGoruntule.tarihAraliklariSeciyorum(
      kacinciTarih,
      gun,
      ay,
      yil
    );
  }
);

Then(
  "Hesap Hareketleri tablosunda aşağıdaki sütun isimlerini görmeliyim",
  (table) => {
    table
      .raw()
      .flat()
      .forEach((item) => {
        sigortaGecmisiGoruntule.sigortaGecmisiTabloSutunIsimleriniDogrulama(
          item
        );
      });
  }
);

When(
  "İşlemler tablosunu filtrelemek için {int}. tarih aralığını gün-ay-yıl olarak {string}-{string}-{string} giriyorum",
  (kacinciTarih, gun, ay, yil) => {
    sigortaGecmisiGoruntule.tarihAraliklariSeciyorum(
      kacinciTarih,
      gun,
      ay,
      yil
    );
  }
);

Then("Hesap Hareketleri tablosunun satırlarındaki datalar servisten gelen data ile uyumlu olmalı", () => {
  sigortaGecmisiGoruntule.hesapHareketleriTabloIceriklerininServisleUyumu();
});

Then(
  "İşlemler tablosunda aşağıdaki sütun isimlerini görmeliyim",
  (table) => {
    table
      .raw()
      .flat()
      .forEach((item) => {
        sigortaGecmisiGoruntule.sigortaGecmisiTabloSutunIsimleriniDogrulama(
          item
        );
      });
  }
);

Then("İşlemler tablosunun satırlarındaki datalar servisten gelen data ile uyumlu olmalı", () => {
  sigortaGecmisiGoruntule.islemlerTabloIceriklerininServisleUyumu();
});

Given(
  "lifeInsuranceAppendixActivities servisinden response alarak hızlı tarih aralığı olarak {string} seçeneğini seçiyorum",
  (radioButton) => {
    sigortaGecmisiGoruntule.hizliTarihAraligiSecimi(radioButton);
  }
);

Then("Açılan pdf ile lifeInsuranceAccountHistory servisi uyumlu olmalı", () => {
  sigortaGecmisiGoruntule.acilanPdfVeIlgiliServisUyumu();
});

Then("Hesap Hareketleri Dökumanı Gönderme ile ilgili bilgilendirme metni görüntülenmeli", () => {
  sigortaGecmisiGoruntule.hesapHareketleriDokumaniGondermeBilgilendirmeMetni();
});

Then("{string} butonuna tıklayıp lifeInsuranceAccountHistoryFile servisinin response kaydediyorum", (butonIsmi) => {
  sigortaGecmisiGoruntule.emailAdresineYollaButonunaTikla(butonIsmi);
});

Then("{string} butonuna tıklayıp sendLifeInsuranceAccountHistoryFileEmail servisinin response kaydediyorum", (butonIsmi) => {
  sigortaGecmisiGoruntule.dokumaniGonderButonunaTikla(butonIsmi);
});

Then("Sigorta hesap hareketleri dokümanını başarıyla gönderme ile ilgili bilgilendirme metni görüntülenmeli", () => {
  sigortaGecmisiGoruntule.hesapHareketleriDokumaniBasariIleGondermeBilgilendirmeMetni();
});

Then("sendLifeInsuranceAccountHistoryFileEmailRes {string} dönmeli", (state) => {
  sigortaGecmisiGoruntule.emailGondermeServisKontrolu(state);
});
