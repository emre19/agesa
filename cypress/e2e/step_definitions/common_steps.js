import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { basePage } from "../../pages/BasePage";
const dayjs = require("dayjs");

export let responseBody, lifeInsuranceSummaryDetailRes;
export let suankiTarih;

Then("{string} mesajı görünmeli", (message) => {
  cy.contains(message);
});

When("Çağrı merkezi uylamasına giriyorum", () => {
  cy.window().then((win) => {
    const orig = win.open;
    win.open = function (url, features) {
      return orig.call(this, url, "_self", features);
    };
  });
  cy.get("a:contains('Çağrı Merkezi')").click();
});

Given("{string} sekmesini seçiyorum", (sekme) => {
  basePage.sekmeSecme(sekme);
});

Given("{string} sekmesi açılmalı", (sekme) => {
  basePage.sekmeKontrol(sekme);
});

Given("{string} butonu görünmeli", (butonAdi) => {
  basePage.butonGorunmeli(butonAdi);
});

Given("{string} butonu aktif olmalı", (butonAdi) => {
  basePage.butonAktif(butonAdi);
});

Given("{string} butonu pasif olmalı", (butonAdi) => {
  basePage.butonPasif(butonAdi);
});

Given("{string} butonuna tıklıyorum", (butonAdi) => {
  basePage.butonTikla(butonAdi);
});

Given("{string} butonu ünlem işareti üzerine geliyorum", (butonAdi) => {
  basePage.elements.butonUnlemIsareti(butonAdi).realHover();
});

Given("En üst sıradaki {string} ürününü seçiyorum", (urunAdi) => {
  basePage.elements.urun(urunAdi).first().click();
});

Given("En üst sıradaki ürününü seçiyorum", () => {
  let urunAdi = Cypress.config("custom").urun_adi;
  basePage.elements.urun(urunAdi).first().click();
});

Given("Ürünü poliçe numarası ile seçiyorum", () => {
  basePage.policeNumarasiIleUrunSec();
});

Given(
  "En üstteki {string} ürün {string} dönütünü kaydediyorum",
  (urunAdi, servisAdi) => {
    cy.intercept("GET", `**/${servisAdi}*`).as(servisAdi);
    basePage.elements.urun(urunAdi).first().click();
    cy.wait(`@${servisAdi}`)
      .its("response.body")
      .then((interception) => {
        responseBody = JSON.stringify(interception);
        cy.log(responseBody);
      });
  }
);

Given("En üstteki ürünü lifeInsuranceSummaryDetail ile seçiyorum", () => {
  let urunAdi = Cypress.config("custom").urun_adi;
  cy.intercept("GET", `**/lifeInsuranceSummaryDetail*`).as(
    "lifeInsuranceSummaryDetail"
  );
  basePage.elements.urun(urunAdi).first().click();
  cy.wait(`@lifeInsuranceSummaryDetail`)
    .its("response.body")
    .then((interception) => {
      lifeInsuranceSummaryDetailRes = interception;
      // cy.log(lifeInsuranceSummaryDetailRes);
    });
});

Then("lifeInsuranceSummaryDetail dönütü aşağıdakileri içermeli", (table) => {
  table.raw().forEach((item) => {
    let icerik = `"${item[0]}":"${item[1]}"`;
    cy.log(icerik);
    expect(lifeInsuranceSummaryDetailRes).to.include(icerik);
  });
});

Given("Sayfada daire şeklinde loader kalmamalı", () => {
  basePage.daireLoaderYok();
  basePage.loaderYok();
});

Then("{string} popup açılmalı", (titel) => {
  basePage.popupTitleVar(titel);
});

Then("{string} popup alt başlığı olarak görünmeli", (titel) => {
  basePage.popupAltBaslikVar(titel);
});

Then("Popup görünmemeli", () => {
  basePage.popupYok();
});

Then("Pdf kapanmış olmalı", () => {
  basePage.pdfKapanmali();
});

Then("Popup body aşağıdaki başlıkları içermeli", (table) => {
  table
    .raw()
    .flat()
    .forEach((item) => {
      basePage.elements.popupBody().should("contain", item);
    });
});

Then("Popup body aşağıdaki butonları içermeli", (table) => {
  table
    .raw()
    .flat()
    .forEach((item) => {
      basePage.elements.popupBodyButonlar().should("contain", item);
    });
});

Then("Popup body {string} mesajı içermeli", (mesaj) => {
  basePage.elements.popupBody().should("contain", mesaj);
});

Given("Popup body {string} butonuna tıklıyorum", (butonAdi) => {
  basePage.popupBodyButonTikla(butonAdi);
});

Given("Popup daki {string} butonu aktif olmalı", (butonAdi) => {
  basePage.popupbutonAktif(butonAdi);
});

Given("Popup daki {string} butonu pasif olmalı", (butonAdi) => {
  basePage.popupButonPasif(butonAdi);
});

Given("Popup body email input kutusunu temizleme", () => {
  basePage.popupBodyEmailTemizle();
});

Given("Şuanki tarihi logluyorum", () => {
  suankiTarih = dayjs().format("DD-MM-YY HH:mm:ss");
  cy.log("ŞİMDİ: ", suankiTarih);

  var milliseconds = suankiTarih.valueOf();
  cy.log("MS", milliseconds);
});

Given(
  "İşlem yapmak istediğim ürünü poliçe numarası ve lifeInsuranceSummaryDetail dönütü ile seçiyorum",
  () => {
    basePage.policeNumarasiSeclifeInsuranceSummaryDetailServisiyle();
  }
);

When("{int}. sıradaki makbuzu açıyorum", (siraNo) => {
  basePage.tablodanMakbuzAcma(siraNo);
});

Then("Açılan pdfte makbuz adı görünmeli", () => {
  basePage.pdfIleMakbuzAdiKontrolu();
});

When("{string} yazısına tıklıyorum", (text) => {
  basePage.yaziyaTikla(text);
});

Then("Çarpı işareti iconu görünmeli", () => {
  basePage.iconGrunmeli();
});

Given(
  "Poliçe numarası ile ürün seçip ilgili servislerden gelen response sonuçlarını kaydediyorum",
  () => {
    basePage.policeNoIleUrunSecVeServisdenGelenResponseKaydet();
  }
);

When("Radio buton olarak {string} seçeneğine tıklıyorum", (radioButton) => {
  basePage.radioButtonClick(radioButton);
});

Given("Popup body iletişim eposta alanına email ekliyorum", () => {
  basePage.popupBodyEmailEkle();
});

Then("config dosyasındaki email sayfada görünmeli", () => {
  cy.contains(Cypress.config("custom").belge_gönderim_email).should(
    "be.visible"
  );
});

Then("Banka bilgisi dropdown butonuna tıklıyorum", () => {
  basePage.elements.bankaBilgisiDropdown().click();
});

Then("Iban input kutusuna {string} değerini giriyorum", (ibanNo) => {
  basePage.elements.ibanInput().clear().type(ibanNo);
});