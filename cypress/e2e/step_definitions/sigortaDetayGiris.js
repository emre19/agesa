import { sigortaDetayGiris } from "../../pages/SigortaDetayGirisPage";
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

  When("Sigorta detay ekranı için poliçe numarası ile ürün seçip ilgili servislerden dönen response kaydediyorum",() => {
    sigortaDetayGiris.policeNoSecipServisResponseKaydet();
  });

  Then("Poliçe tablosundan seçilen ürünün adı sigorta detay sayfasında görünmeli", () => {
    sigortaDetayGiris.secilenUrunAdiDetaySayfasindaGorunmeKontrolu();
  });

  Then("Poliçe tablosundaki Poliçe Numarası kontrolü", () => {
    sigortaDetayGiris.policeTablosuPoliceNoKontrolu();
  });

  Then("Poliçe tablosundaki Poliçe Süresi kontrolü", () => {
    sigortaDetayGiris.policeTablosuPoliceSuresiKontrolu();
  });

  Then("Poliçe tablosundaki Poliçe Başlangıç Tarihi kontrolü", () => {
    sigortaDetayGiris.policeTablosuBaslangicTarihiKontrolu();
  });

  Then("Poliçe tablosundaki Poliçe Yenileme Tarihi kontrolü", () => {
    sigortaDetayGiris.policeTablosuYenilemeTarihiKontrolu();
  });

  Then("Poliçe tablosundaki Poliçe Bitiş Tarihi kontrolü", () => {
    sigortaDetayGiris.policeTablosuPoliceBitisTarihiKontrolu();
  });

  Then("Poliçe tablosundaki BHS olmayan ürün için Düzenli Ödeme kontrolü", () => {
    sigortaDetayGiris.policeTablosuBHSolmayanUrunPoliceDuzenliOdemeKontrolu();
  });

  Then("Poliçe tablosundaki BHS olan ürün için Düzenli Ödeme kontrolü", () => {
    sigortaDetayGiris.policeTablosuBHSolanUrunPoliceDuzenliOdemeKontrolu();
  });

  Then("Toplam Ödenen Prim miktarının kontrolü", () => {
    sigortaDetayGiris.toplamOdenenPrimMiktarKontrolu();
  });

  Then("Kalan Prim Borcu miktarının kontrolü", () => {
    sigortaDetayGiris.kalanPrimBorcuKontrolu();
  });

  Then("Vergi İndirimi miktarının kontrolü", () => {
    sigortaDetayGiris.vergiIndirimiKontrolu();
  });

  Then("Vergi İndirimi info icon mesajının kontrolü", () => {
    sigortaDetayGiris.vergiIndirimiIconMesajKontrolu();
  });

  Then(/Tanımlı Ödeme Yöntemi kartını (görmeliyim|görmemeliyim)/, (action) => {
    sigortaDetayGiris.tanimliOdemeKartiKontrolu(action);
  });

  Then("Tanımlı Ödeme Yöntemi kartındaki Değiştir butonu {string} kontrolü", (kontrolTipi) => {
    sigortaDetayGiris.degistirButonKontrol(kontrolTipi);
  });

  Then("Müşteri Rolü kartının kontrolü", () => {
    sigortaDetayGiris.musteriRoluKartKontrolu("Müşteri Rolü");
  });

  Then(
    "Müşteri Rolü kartındaki sabit textler kontrolü",
    (table) => {
      table
        .raw()
        .flat()
        .forEach((item) => {
          sigortaDetayGiris.musterRoluKartiSabitTextKontrolu(item);
        });
    }
  );

  Then("Lehtar Bilgisi kartının kontrolü", () => {
    sigortaDetayGiris.lehtarBilgisiKartKontrolu("Lehtar Bilgisi");
  });

  Then(
    "Lehtar Bilgisi kartındaki sabit textler kontrolü",
    (table) => {
      table
        .raw()
        .flat()
        .forEach((item) => {
          sigortaDetayGiris.lehtarBilgisiKartiSabitTextKontrolu(item);
        });
    }
  );

  Then("Lehtar Bilgisindeki info icon mesajının kontrolü", () => {
    sigortaDetayGiris.lehtarBilgisiInfoIconMesajKontrolu("Lehtar Bilgisi");
  });

  Then(
    "Aşağıdaki sabit textler Finansal Danışman Bilgileri kartında gözükmeli",
    (table) => {
      table
        .raw()
        .flat()
        .forEach((item) => {
          sigortaDetayGiris.sabitTextleriFinansalDanismaKartindaGoruntuleme(item);
        });
    }
  );

  Then("Satan Finansal Danışman Bilgileri kontrolü", () => {
    sigortaDetayGiris.satanFinansalDanismanKontrolu();
  });

  Then("Sorumlu Finansal Danışman Bilgileri kontrolü", () => {
    sigortaDetayGiris.sorumluFinansalDanismanKontrolu();
  });

  Then("Satan Finansal Danışman Bilgileri detay oku altındaki datalar gözükmelidir", () => {
    sigortaDetayGiris.satanFinansalDanismanDetayOkAltindakiDataKontrolu();
  });

  Then("Sorumlu Finansal Danışman Bilgileri detay oku altındaki datalar gözükmelidir", () => {
    sigortaDetayGiris.sorumluFinansalDanismanDetayOkAltindakiDataKontrolu();
  });

  Then("Finansal Danışman Bilgileri info icon kontrolü", () => {
    sigortaDetayGiris.finansalDanismanKartiInfoIconKontrolu("Finansal Danışman Bilgileri");
  });

  Then("{string} butonu kart içerisinde aktif olarak görünmelidir", (butonIsmi) => {
    sigortaDetayGiris.finansalDanismanDetayButonKontrolu(butonIsmi);
  });

  Then("Birikim Detayları kartındaki içeriklerin kontrolü", () => {
    sigortaDetayGiris.birikimDetaylariKontrolu("Birikim Detayları");
  });

  Then("Birikim Detayları kartındaki info icon mesajlarının kontrolü", () => {
    sigortaDetayGiris.birikimDetaylariInfoIconMesajKontrolu("Birikim Detayları");
  });

  Then("Dönemsel Birikim Prim Değişikliği butonunun info icon mesajı servisten gelen response ile uyumlu olmalı", () => {
    sigortaDetayGiris.donemselPrimDegisikligiInfoIconMsjKontrol();
  });

  Then("Dönemsel Prim Tutarı Değişikliği butonunun info icon mesajı servisten gelen response ile uyumlu olmalı", () => {
    sigortaDetayGiris.donemselPrimDegisikligiInfoIconMsjKontrol();
  });
