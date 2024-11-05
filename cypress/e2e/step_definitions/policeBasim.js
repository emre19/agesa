import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { basePage } from "@pages/BasePage";

let lifeInsuranceSummaryDetailRes, lifePolicyPaymentMethodRes, sendLifePolicyDocumentRes;
let policeBasimAdi = Cypress.config("custom").police_basim_adi;
let policeEmail = Cypress.config("custom").belge_gönderim_email;


// let lifePolicyDocumentRes = {};
// Given(
//   "lifePolicyDocument servis dönütü ile poliçe gönder butonuna tıklıyorum",
//   () => {
//     cy.intercept("GET", "**/lifePolicyDocument*").as("lifePolicyDocument");

//     basePage.butonTikla("Poliçeyi Gönder");

//     cy.wait("@lifePolicyDocument")
//       .its("response.body")
//       .then((interception) => {
//         lifePolicyDocumentRes = interception;
//         cy.log("lifePolicyDocumentRes: " + JSON.stringify(lifePolicyDocumentRes))
//       });
//   }
// );

Given(
  "Poliçe basım ürününü lifeInsuranceSummaryDetail ve lifePolicyPaymentMethod ile seçiyorum",
  () => {
    let urunAdi = Cypress.config("custom").urun_adi;
    cy.intercept("GET", `**/lifeInsuranceSummaryDetail*`).as(
      "lifeInsuranceSummaryDetail"
    );
    cy.intercept("GET", `**/lifePolicyPaymentMethod*`).as(
      "lifePolicyPaymentMethod"
    );

    basePage.elements.urun(urunAdi).first().click();

    cy.wait(`@lifeInsuranceSummaryDetail`)
      .its("response.body")
      .then((interception) => {
        lifeInsuranceSummaryDetailRes = interception;
      });

    cy.wait(`@lifePolicyPaymentMethod`)
      .its("response.body")
      .then((interception) => {
        lifePolicyPaymentMethodRes = interception;
        cy.log(
          "lifePolicyPaymentMethodRes: " +
            JSON.stringify(lifePolicyPaymentMethodRes)
        );
      });
  }
);

Then("Açılan pdfte poliçe basım adı görünmeli", () => {
  cy.get(".react-pdf__Page__textContent").should("contain", policeBasimAdi);
});

Then(
  "pdf ile lifeInsuranceSummaryDetail ve lifePolicyPaymentMethod uyumlu olmalı",
  () => {
    cy.wrap(lifeInsuranceSummaryDetailRes.data).then((el) => {
      cy.get(".react-pdf__Page__textContent")
        .should("contain", el.policyStartDate.toString().replaceAll("-", "."))
        .and("contain", el.policyEndDate.toString().replaceAll("-", "."))
        .and(
          "contain",
          el.policyInitializationDate.toString().replaceAll("-", ".")
        )
        .and("contain", el.policyTerm)
        .and("contain", el.termlyPaymentAmount.amount)
        .and("contain", el.termlyPaymentAmount.currency)
        .and("contain", el.productName)
        .and("contain", el.policyDuration.replace(" YIL", ""));
    });

    cy.wrap(lifeInsuranceSummaryDetailRes.data.beneficiaryInfo).each((el) => {
      cy.get(".react-pdf__Page__textContent")
        .should("contain", el.beneficiaryNameInfo)
        .and("contain", el.beneficiaryRate);
    });

    cy.wrap(lifePolicyPaymentMethodRes.data).then((el) => {
      cy.get(".react-pdf__Page__textContent").should("contain", el.paymentType);
    });
  }
);

Then("Poliçeyi config dosyasındaki emaile gönderiyorum", () => {
  cy.intercept("POST", "**/sendLifePolicyDocument").as("sendLifePolicyDocument");

  basePage.elements.popupBodyEmailInput().type(`${policeEmail}`);
  
  cy.get(".proto-popup-buttons .icon-send").click();

  cy.wait("@sendLifePolicyDocument")
    .its("response.body")
    .then((interception) => {
      sendLifePolicyDocumentRes = interception;
    });
});

Then("sendLifePolicyDocumentRes {string} dönmeli", (state) => {
  expect(
    sendLifePolicyDocumentRes.success.toString()
  ).to.equal(state);
});
