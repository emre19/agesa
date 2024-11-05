import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { basePage } from "@pages/BasePage";
import { odemeBilgileri } from "../../pages/OdemeBilgileriPage";

let tekliMakbuzUyariMesaji =
  Cypress.config("custom").tekliMakbuz10AdetUyariMesaj;

Given(
  "lifePaymentHistory servisinden response alarak {string} butonuna tıklıyorum",
  (butonIsmi) => {
    odemeBilgileri.lifePaymentHistoryServisindekiResponseAlipOdemeBilgileriButonunaTikla(
      butonIsmi
    );
  }
);

Then("Tekli makbuzlar tablosunda aşağıdaki sütunlar bulunmalı", (table) => {
  basePage.loaderYok();
  table
    .raw()
    .flat()
    .forEach((item) => {
      odemeBilgileri.tekliMakbuzTablosundaSutunIsmiDogrulama(item);
    });
});

Then(
  "Maksimum 10 Adet makbuz gönderilebilir uyarı mesajı kırmızı renkte görülmeli",
  () => {
    cy.get(`span:contains("${tekliMakbuzUyariMesaji}")`).should(
      "have.class",
      "color-red"
    );
  }
);

Then(
  "Tekli Makbuz tablosundaki satırların iceriklerinin servisten gelen response ile kontrolü",
  () => {
    odemeBilgileri.tablodakiSatirlarinIceriklerininServisleKontrolu();
  }
);

Then("Tekli makbuz tablosundaki ilk {int} makbuzu seçiyorum", (adet) => {
  odemeBilgileri.tekliMakbuzIlk10SatirSec(adet);
});

Then("Tekli makbuz gönderme popup bodye email ekliyorum", () => {
  odemeBilgileri.popUpEmailEkleme();
});

Then("sendMailCreateReceiptDocumentRes {string} dönmeli", (state) => {
  odemeBilgileri.emailIleGondermeServisKontrolu(state);
});

When(
  "{int}. tarih aralığını gün-ay-yıl olarak {string}-{string}-{string} giriyorum",
  (kacinciTarih, gun, ay, yil) => {
    odemeBilgileri.tarihAraliklariSeciyorum(kacinciTarih, gun, ay, yil);
  }
);

Then(
  "paymentInformationList eleman içerikleri ile filtrelenen tablodaki satırların içerikleri aynı olmalı",
  () => {
    odemeBilgileri.tablodakiSatirlarinIceriklerininServisleKontrolu();
  }
);

Given(
  "lifePaymentHistory servisinden response alarak hızlı tarih aralığı olarak {string} seçeneğini seçiyorum",
  (radioButton) => {
    odemeBilgileri.hizliTarihAraligiSecimi(radioButton);
  }
);

Then(
  "Seçim yapıldıktan sonra filtrelenen data içerigi servis ile uyumlu olmalı",
  () => {
    odemeBilgileri.tablodakiSatirlarinIceriklerininServisleKontrolu();
  }
);

Then(
  "Seçim yapıldıktan sonra filtreye uygun data olmadıgı için uyarı mesajı görüntülenmelidir",
  () => {
    odemeBilgileri.hizliTarihFiltreyeUygunDataYok();
  }
);
