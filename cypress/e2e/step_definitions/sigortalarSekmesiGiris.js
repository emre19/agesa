import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { sigortalarSekmesiGiris } from "../../pages/SigortalarSekmesiGirisPage";

Then(
    "Sigortalar sayfasında aşağıdaki poliçe başlıklarını görmeliyim",
    (table) => {
      table
        .raw()
        .flat()
        .forEach((item, index) => {
        sigortalarSekmesiGiris.policeBaslikIcerikDogrulama(item, index);
        });
    }
  );

  Then("{string} kartında aşagıdaki değerleri görmeliyim", (kartTipi, table) => {
    table
      .raw()
      .flat()
      .forEach((item) => {
        sigortalarSekmesiGiris.sigortalarKartiIcerigiDogrulama(item, kartTipi);
      });
  });

  Then("{string} poliçe tablosunda aşağıdaki sütun isimlerini görmeliyim",(policeTabloIsmi, table) => {
      table
        .raw()
        .flat()
        .forEach((item) => {
          sigortalarSekmesiGiris.sigortaSayfasindakiTablolarinSutunIsimleriniDogrulama(
            item,
            policeTabloIsmi
          );
        });
  });

  Then("{string} için ürün olmadıgına dair uyarı mesajını görmeliyim",(kartTipi) => {
      sigortalarSekmesiGiris.hayatUrunYokKontrol(kartTipi);
  });

  Then("Sigorta listeleme ekranı için lifeInsuranceSummary servisinin response kaydediyorum",() => {
      sigortalarSekmesiGiris.lifeInsuranceSummaryResponseKaydet();
  });

  Then("lifeInsuranceSummary servisinden gelen policyType ve policyCount değerlerini kaydediyorum",() => {
    sigortalarSekmesiGiris.lifeInsuranceSummaryPolicyTypeKaydet();
  });

  Then("{string} poliçe tablosunun sağ üst köşesinde yazan adet sayısı servisten gelen response ile aynı olmalı",(policeTablosu) => {
    sigortalarSekmesiGiris.policeTablosuAdetSayisininServisleKontrolu(policeTablosu);
  });

  Then("{string} poliçe tablosundaki satır sayısı servisten dönen policyCount degeri ile eşit olmalı",(policeTablosu) => {
    sigortalarSekmesiGiris.policeTablosuSatirSayisininServisleKontrolu(policeTablosu);
  });

  Then("{string} poliçe tablosunun satırlarındaki datalar servisten gelen response ile uyumlu olmalı",(policeTablosu) => {
    sigortalarSekmesiGiris.policeTablosuSatirlardakiDatalarinServisleKontrolu(policeTablosu);
  });

  Then("{string} kartında {string} poliçe tablosu için kaç adet aktif poliçe sayısı yazıyorsa servisten gelen policyCount ile eşit olmalı",(kartIsmi, policeTablosu) => {
    sigortalarSekmesiGiris.karttakiAdetSayisininServisleKontrolu(kartIsmi, policeTablosu);
  });

  Then("{string} kartında {string} poliçe tablosu için Toplam Teminat miktarı servisten gelen response ile uyumlu olmalı",(kartIsmi, policeTablosu) => {
    sigortalarSekmesiGiris.karttakiToplamTeminatMiktarinınServisleKontrolu(kartIsmi, policeTablosu);
  });

  Then("{string} poliçe tablosunda Süre Sonunda Ulaşılacak Birikim Tutarı sütunundaki datalar servisten gelen response ile uyumlu olmalı",(policeTablosu) => {
    sigortalarSekmesiGiris.policeTablosuSureSonundaUlasilacakBirikimTutariDatalarininServisleKontrolu(policeTablosu);
  });

  Then("Süre Sonunda Ulaşılacak Birikim Tutarı info iconundaki mesaj servisten gelen response ile uyumlu olmali",() => {
    sigortalarSekmesiGiris.sureSonundaUlasilacakBirikimTutariInfoIconMesajKontrolu();
  });

  Then("Toplam Birikim Tutarı info icon mesajı servisten gelen response ile uyumlu olmalı",() => {
    sigortalarSekmesiGiris.toplamBirikimTutariInfoIconMesajKontrolu();
  });