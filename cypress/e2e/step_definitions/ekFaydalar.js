import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { ekFaydalar } from "../../pages/EkFaydalarPage";

Then(
  "Ek Faydalar tablosu için poliçe numarası ile ürün seçip ilgili servislerden gelen response sonuçlarını kaydediyorum",
  () => {
    ekFaydalar.ekFaydaServisResponseKaydet();
  }
);

Then("Ek fayda tablosu içerik kontrolü", () => {
  ekFaydalar.ekFaydaTablosuKontrolu();
});

When(
  "Ek fayda tablosunda Kapsam sütununda {string} kelimesini filtreliyorum",
  (filtrelenecekKelime) => {
    ekFaydalar.ekFaydaTablosuKapsamFiltreleme(filtrelenecekKelime);
  }
);

Then(
  "Kapsam sütununda filtrelenmiş {string} textini görüntülüyorum",
  (filtrelenenKelime) => {
    ekFaydalar.ekFaydaKapsamSutunuFiltrenenIcerikKontrol(
      filtrelenenKelime
    );
  }
);

Then(
  "Ek Fayda tablosunda {string} sütununun sağ üst köşesinde çarpı işareti iconunu görmeliyim",
  (sutunIsmi) => {
    ekFaydalar.ekFaydaCarpiIconKontrol(sutunIsmi);
  }
);

Then(
  "{string} sütununda checkbox ile {string} seçiyorum",
  (sutunIsmi, item) => {
    ekFaydalar.ekFaydaCheckBoxSecim(sutunIsmi, item);
  }
);

When("{string} sütunundaki çarpı işareti iconuna tıklıyorum", (sutunIsmi) => {
  ekFaydalar.ekFaydaCarpiIconTikla(sutunIsmi);
});

Then("Ek Fayda tablosunu görmeliyim", () => {
  ekFaydalar.ekFaydaExistKontrol();
});
