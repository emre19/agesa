import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { basePage } from "@pages/BasePage";
import { makbuzlarPage } from "@pages/MakbuzlarPage";

let urunAdi = Cypress.config("custom").urun_adi;
let makbuzAdi = Cypress.config("custom").makbuz_adi;
let makbuzEmail = Cypress.config("custom").belge_gönderim_email;
let receiptInfoRes = {};
let sendMailReceiptsRes = {};
const prefix = Cypress.env("POLICE_NO").charAt(0);
const policyNo = Cypress.env("POLICE_NO").match(/(?<=[-A-Z])\d+/)[0];
const policeNumarasi = prefix + policyNo;

Given(
  "receiptInfo servis dönütünü alarak makbuzlar butonuna tıklıyorum",
  () => {
    cy.intercept("GET", "**/receiptInfo/**").as("receiptInfo");

    basePage.butonTikla("Makbuzlar");

    cy.wait("@receiptInfo")
      .its("response.body")
      .then((interception) => {
        receiptInfoRes = interception;
      });
  }
);

Then("Makbuzlar tablosunda ürün adı görünmeli", () => {
  makbuzlarPage.elements.makbuzlarTabloBody().should("be.visible");
  makbuzlarPage.urunAdiDogrulama(urunAdi);
});

Then("Makbuzlar tablosunda poliçe numarası görünmeli", () => {
  makbuzlarPage.elements.makbuzlarTabloBody().should("be.visible");
  makbuzlarPage.policeNumarasiDogrulama(policeNumarasi);
});

Then("Makbuzlar tablosunda aşağıdaki sütunlar bulunmalı", (table) => {
  basePage.loaderYok();
  table
    .raw()
    .flat()
    .forEach((item) => {
      makbuzlarPage.sutunIsmiDogrulama(item);
    });
});

Then("Ürüne ait en üst sıradaki makbuzu açıyorum", () => {
  makbuzlarPage.elements.urunAdiIleMabuz(urunAdi).first().click();
});

Then("Ürüne ait en üst sıradaki makbuzu seçiyorum", () => {
  makbuzlarPage.elements.
  makbuzSecimUrunAdi(urunAdi)
    .first()
    .click();
});

Then("Makbuzu config dosyasındaki emaile gönderiyorum", () => {
  cy.intercept("POST", "**/sendMailReceipts").as("sendMailReceipts");

  basePage.elements.popupBodyEmailInput().type(`${makbuzEmail}`);

  cy.get(".proto-popup-buttons .icon-send").click();

  cy.wait("@sendMailReceipts")
    .its("response.body")
    .then((interception) => {
      sendMailReceiptsRes = interception;
    });
});

Then("sendMailReceiptsRes {string} dönmeli", (state) => {
  expect(sendMailReceiptsRes.success.toString()).to.equal(state);
});

Then(
  "Makbuz gönderme bilgilendirme metni {string} makbuza uygun olmalı",
  (tekCok) => {
    const bilgilendirmeMtnTek =
      "Sigorta poliçeniz ile ilgili detayların yer aldığı makbuzu mail adresinize göndereceğim.";
    const bilgilendirmeMtnCok =
      "Sigorta poliçeniz ile ilgili detayların  yer aldığı makbuzları mail adresinize göndereceğim.";

    if (tekCok.toLowerCase() == "tek") {
      makbuzlarPage.elements.popupBilgilendirmeMetiniText().then((el) => {
        expect(el.text().replaceAll(" ", "")).to.equal(
          bilgilendirmeMtnTek.replaceAll(" ", "")
        );
      });
    } else {
      makbuzlarPage.elements.popupBilgilendirmeMetiniText().then((el) => {
        expect(el.text().replaceAll(" ", "")).to.equal(
          bilgilendirmeMtnCok.replaceAll(" ", "")
        );
      });
    }
  }
);

Given("Ürüne ait tüm makbuzarı seçiyorum", () => {
  makbuzlarPage.tumMakbuzlariSec();
});
