import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { basePage } from "@pages/BasePage";
import { finansalDanismanPage } from "@pages/FinansalDanismanPage";

const prefix = Cypress.env("POLICE_NO").charAt(0);
const policyNo = Cypress.env("POLICE_NO").match(/(?<=[-A-Z])\d+/)[0];
const policeNumarasi = prefix+ "-" + policyNo;

let financialAdvisorInfoDetailRes = {};

When(
  "Finansal danışman detay butonuna financialAdvisorInfoDetail ile tıklıyorum",
  () => {
    cy.intercept("GET", "**/financialAdvisorInfoDetail*").as(
      "financialAdvisorInfoDetail"
    );
    cy.wait(3000);
    finansalDanismanPage.elements.kart().within(() => {
      basePage.butonTikla("Detay");
    });

    cy.wait("@financialAdvisorInfoDetail")
      .its("response.body")
      .then((interception) => {
        financialAdvisorInfoDetailRes = interception;
        // cy.log(
        //   "financialAdvisorInfoDetailRes: ",
        //   JSON.stringify(financialAdvisorInfoDetailRes)
        // );
      });
  }
);

Then(
  "financialAdvisorInfoDetail içeriği ile finansal danışman içerikleri aynı olmalı",
  () => {
    cy.wrap(financialAdvisorInfoDetailRes.data).then((el) => {
      finansalDanismanPage.elements.detayKart('Satan Finansal Danışman Bilgileri')
      .within(() => {
        cy.get("div#label:contains('Ekip')")
          .siblings()
          .should("contain", el.sellerTeamName);
      });

      finansalDanismanPage.elements.detayKart('Sorumlu Finansal Danışman Bilgileri')
      .within(() => {
        cy.get("div#label:contains('Ekip')")
          .siblings()
          .should("contain", el.responsibleTeamName);
      });
    });
  }
);

Then("Finansal danışman header görünmeli", () => {
  finansalDanismanPage.headerIcerik("Finansal Danışman Bilgileri");
  finansalDanismanPage.headerAltBaslikIcerik(policeNumarasi);
  finansalDanismanPage.headerAltBaslikIcerik(Cypress.config("custom").urun_adi);
});