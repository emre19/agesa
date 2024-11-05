import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { oGDPage } from "../../pages/OdemeGunDegisikligiPage";
import { basePage } from "@pages/BasePage";

const _ = require("lodash");

let lifeInsuranceSummaryDetailRes,
  insurancePaymentInfoRes,
  odemeGunu,
  randomGun;
const odemeGunuOpsiyonlari = [];

Then("Ödeme Periyodu Seçenekleri aşağıdaki opsiyonları içermeli", (table) => {
  table
    .raw()
    .flat()
    .forEach((item) => {
      oGDPage.elements.odemePeriyotlari().should("contain", item);
    });
});

Then("Ödeme Günü Seçenekleri altında gün selektörü bulunmalı", () => {
  oGDPage.elements
    .odemeGunSecenekleri()
    .should("be.visible")
    .and("contain", "ÖDEME GÜNÜ");
});

Then("Seçili ödeme gününü odemeGunu değişkenine atıyorum", () => {
  // oGDPage.elements
  //   .seciliOdemeGunu()
  //   .invoke("text")
  //   .then((el) => {
  //     odemeGunu = el;
  //     cy.log("ÖDEME GÜNÜ: " + odemeGunu);
  //   });

  odemeGunu = `${lifeInsuranceSummaryDetailRes.data.policyPaymentDay}. Gün`;
  cy.log("ÖDEME GÜNÜ: " + odemeGunu);
});

Then("odemeGunu değişkeni aynı kalmalı", () => {
  oGDPage.elements
    .seciliOdemeGunu()
    .invoke("text")
    .then((el) => {
      cy.log("ÖDEME GÜNÜ son durum: " + el);
      expect(el).equal(odemeGunu);
    });
});

Then("odemeGunu haricide random bir gün seçiyorum", () => {
  oGDPage.elements.odemeGunSecmeArrow().click();
  oGDPage.elements
    .odemeGunuOpsiyonlari()
    .each((el) => {
      if (el.text().trim() != odemeGunu.trim()) {
        odemeGunuOpsiyonlari.push(el.text().trim());
      }
    })
    .then(() => {
      randomGun = _.sample(odemeGunuOpsiyonlari);
      cy.log("Random Gün: " + randomGun);
      oGDPage.elements.odemeGunuOpsiyonu(randomGun).first().click();
    });
});

Then("Ödeme günü random gün olarak görülmeli", () => {
  oGDPage.elements
    .seciliOdemeGunu()
    .invoke("text")
    .then((el) => {
      cy.log("ÖDEME GÜNÜ son durum: " + el);
      expect(el).equal(randomGun);
    });
});

Then("Ödeme Periyodu Seçenekleri pasif olmalı", () => {
  oGDPage.elements
    .odemePeriyotlari()
    .each((el) => cy.wrap(el).find("div").should("have.class", "disabled"));
});

Then("Ödeme Periyodu Seçenekleri info ikonu üzerine geliyorum", () => {
  oGDPage.elements.odemePeriyotPasifInfoIkon().realHover();
});

Then("Ürünün ödeme periyodu haricindeki seçenekler aktif olmalı", () => {
  oGDPage.elements.odemePeriyotlari().each((el) => {
    if (
      `"${el.text().toUpperCase().toString()}"` ===
      JSON.stringify(lifeInsuranceSummaryDetailRes.data.policyTerm)
    ) {
      cy.wrap(el).find("div").should("have.class", "disabled");
    } else {
      cy.wrap(el).find("div").should("not.have.class", "disabled");
    }
  });
});

Given(
  "Ödeme İşlemleri için ürünü lifeInsuranceSummaryDetail ve insurancePaymentInfo servisleri ile seçiyorum",
  () => {
    cy.intercept("GET", "**/lifeInsuranceSummaryDetail*").as(
      "lifeInsuranceSummaryDetail"
    );
    cy.intercept("GET", "**/insurancePaymentInfo*").as("insurancePaymentInfo");

    basePage.policeNumarasiIleUrunSec();

    cy.wait("@lifeInsuranceSummaryDetail")
      .its("response.body")
      .then((interception) => {
        lifeInsuranceSummaryDetailRes = interception;
      });

    cy.wait("@insurancePaymentInfo")
      .its("response.body")
      .then((interception) => {
        insurancePaymentInfoRes = interception;
      });
  }
);

Then("paymentPeriodChangeable {string} dönmeli", (state) => {
  expect(
    insurancePaymentInfoRes.data.paymentPeriodChangeable.toString()
  ).to.equal(state);
});

Then("Ödeme günü opsiyonları config dosyası ile uyumlu olmalı", () => {
  expect(odemeGunuOpsiyonlari.length).to.equal((Cypress.config("custom").odeme_gunu_opsiyonlari).length);
});