import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { basePage } from "@pages/BasePage";

let proposalListRes, application;
const BASVURU_NO = Cypress.env("BASVURU_NO");

Given("Başvurular sekmesini açıyorum", () => {
  cy.intercept("POST", "**/proposalList*").as("proposalList");

  basePage.sekmeSecme("Başvurular");

  cy.wait("@proposalList")
    .its("response.body")
    .then((interception) => {
      proposalListRes = interception;
      cy.log("proposalListRes: " + JSON.stringify(proposalListRes));

      // Dinamik olarak verilen BASVURU_NO sunun buluduğu objeyi alma
      application = proposalListRes.data.applications.find(
        (app) => app.applicationNo === BASVURU_NO
      );
      cy.log("BASVURU_NO: " + JSON.stringify(application));
      cy.log(
        "BASVURU_NO.stepDetails: " + JSON.stringify(application.stepDetails)
      );
    });
});

Then("Başvuruyu açıyorum", () => {
  if (BASVURU_NO) {
    cy.get(
      `.proto-table tbody .proto-table-col-bordered:contains(${Cypress.env(
        "BASVURU_NO"
      )})`
    )
      .should("be.visible")
      .click();
  } else {
    cy.get(".proto-table tbody .proto-table-col-bordered")
      .first()
      .should("be.visible")
      .click();
  }
});

Then("stepDetails ile başvuru aşamaları aynı olmalı", () => {
  cy.wrap(application.stepDetails).as("stepDetails");
  cy.get("@stepDetails").then((stepDetails) => {
    const lastElementOrder = stepDetails[stepDetails.length - 1].order;
    cy.get("div.active").should("have.length", lastElementOrder);
  });
});

Then("stepDetails ile başvuru tarihleri aynı olmalı", () => {
  cy.wrap(application.stepDetails).as("stepDetails");
  cy.get("@stepDetails").then((stepDetails) => {
  const dates = stepDetails.map(step => step.date);
  cy.wrap(dates).each(date => {cy.get(".timeline-component-wrapper").should("contain", date);});
  });
});