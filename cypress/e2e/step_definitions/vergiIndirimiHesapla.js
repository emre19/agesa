import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { vergiIndirimiHesapla } from "../../pages/VergiIndirimiHesaplaPage";

Then(
  "Vergi indirimi popup açıldığında {string} radio button da default olarak seçilmiş gözükmelidir",
  (radioButton) => {
    vergiIndirimiHesapla.selectedHizliTarihSecimiKontrol(radioButton);
  }
);

Then(
  "Günlük USD-EUR kur degerleri servisten gelen data ile uyumlu olmali",
  () => {
    vergiIndirimiHesapla.kurDegerleriKontrolu();
  }
);

When("{string} alanına {string} degeri girilir", (textAlani, miktar) => {
  vergiIndirimiHesapla.textAlaninaMiktarGir(textAlani, miktar);
});

When(
  "{string} butonuna tıklayıp lifePolicyTaxDiscountCalculate servisinin response kaydediyorum",
  (butonIsmi) => {
    vergiIndirimiHesapla.hesaplaButonTikla(butonIsmi);
  }
);

Then("Ücretli Çalışan için hesaplanan sonuçlar servisten dönen response ile uyumlu olmalı", () => {
  vergiIndirimiHesapla.hesapKontroluUcretliCalısan();
});

Then("Serbest Çalışan için hesaplanan sonuçlar servisten dönen response ile uyumlu olmalı", () => {
  vergiIndirimiHesapla.hesapKontroluSerbestCalısan();
});

When(
  "Vergi İndirimi Hesapla buton işlemi için ürün seçip ilgili servislerden gelen response sonuçlarını kaydediyorum",
  () => {
    vergiIndirimiHesapla.lifeInsuranceSummaryDetailResponseKaydet();
  }
);

Then("Sigorta detay ekranında Vergi indirimi alanında yeni vergi değeri görüntülenmeli", () => {
  vergiIndirimiHesapla.vergiIndirimiKontrolu();
});
