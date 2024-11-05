import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { basePage } from "@pages/BasePage";

let permanentLifeInsuranceRes,
  customerPaymentMethodsRes,
  selectedPolicy,
  additionalPremiumPaymentRes;
const prefix = Cypress.env("POLICE_NO").charAt(0);
const policyNo = Cypress.env("POLICE_NO").slice(-6);

When(
  "Ek Prim Ödemesi butonuna permanentLifeInsurance ve customerPaymentMethods ile tıklıyorum",
  () => {
    cy.intercept("GET", "**/customerPaymentMethods*").as(
      "customerPaymentMethods"
    );
    cy.intercept("POST", "**/permanentLifeInsurance").as(
      "permanentLifeInsurance"
    );

    basePage.butonTikla("Ek Prim Ödemesi");

    cy.wait("@customerPaymentMethods")
      .its("response.body")
      .then((interception) => {
        customerPaymentMethodsRes = interception;
        // cy.log("customerPaymentMethodsRes: " + JSON.stringify(customerPaymentMethodsRes));
      });

    cy.wait("@permanentLifeInsurance")
      .its("response.body")
      .then((interception) => {
        permanentLifeInsuranceRes = interception;
        // cy.log("permanentLifeInsuranceRes: " + JSON.stringify(permanentLifeInsuranceRes));
      });
  }
);

Then("Bilgilendirme metni ile permanentLifeInsurance uyumlu olmalı", () => {
  cy.wrap(permanentLifeInsuranceRes.data.announcementList.announceModels).then(
    (el) => {
      cy.get(".announcement-content ")
        .first()
        .then((bilgilendirme) => {
          expect(bilgilendirme.text()).to.includes(el[0].message);
        });
    }
  );
});

Then("Tanımlı ödeme yöntemi ile customerPaymentMethods uyumlu olmalı", () => {
  const selectedPayment =
    customerPaymentMethodsRes.data.paymentMethodsList.find(
      (method) => method.selectedPaymentType
    );
  let odemeYontemi =
    selectedPayment.ibanNo ||
    selectedPayment.accountNumber ||
    selectedPayment.creditCardNo;
  cy.get("div.border-primary")
    .should("contain", selectedPayment.bankName)
    .and("contain", selectedPayment.paymentType)
    .and("contain", odemeYontemi);
});

Then("Poliçe bilgileri ile permanentLifeInsurance uyumlu olmalı", () => {
  selectedPolicy =
    permanentLifeInsuranceRes.data.permanentLifeInsuranceModelList.find(
      (policy) => policy.policyNo == policyNo
    );

  cy.log("selectedPolicy: ", JSON.stringify(selectedPolicy));

  cy.get("div#label:contains('Toplam Birikim Tutarı')")
    .parentsUntil(".proto-card-container-text")
    .should("contain", selectedPolicy.totalSavingAmount.amount)
    .and("contain", selectedPolicy.policyStartDate);

  if (selectedPolicy.customerRole === null) {
    cy.get("div:contains('Ödeme Yapan Kişi')")
      .next("div#value")
      .should("contain", "Sigorta Ettiren");
  } else {
    cy.get("div:contains('Ödeme Yapan Kişi')")
      .next("div#value")
      .should("contain", "Sigortalı");
  }
});

Then(
  "Toplam birikim tutarının yarısı kadar ek prim miktarı ile öde butonuna tıklıyorum",
  () => {
    let yariTutar =
      parseInt(selectedPolicy.totalSavingAmount.amount.replaceAll(".", "")) / 2;
    // cy.get("#paymentField").clear().type(yariTutar);
    cy.get("#paymentField").clear().type(1);

    basePage.butonTikla("Öde");
  }
);

When("Popup body Evet butonuna additionalPremiumPayment ile tıklıyorum", () => {
  cy.intercept("POST", "**/additionalPremiumPayment").as(
    "additionalPremiumPayment"
  );

  basePage.popupBodyButonTikla("Evet");

  cy.wait("@additionalPremiumPayment")
    .its("response.body")
    .then((interception) => {
      additionalPremiumPaymentRes = interception;
      cy.log(
        "additionalPremiumPaymentsRes: " +
          JSON.stringify(additionalPremiumPaymentRes)
      );
    });
});

Then("additionalPremiumPayment {string} dönmeli", (state) => {
  cy.wrap(additionalPremiumPaymentRes.success.toString(), {
    timeout: 150000,
  }).should("equal", state);
});

Then("additionalPremiumPayment ile başarısız işlem mesajı uyumlu olmalı", () => {
  cy.get(".proto-popup-body .announcement-content").then((el) => {
    cy.wrap(additionalPremiumPaymentRes.error.message, {
      timeout: 150000,
    }).should("contain", el.text());
  });
});

Then("additionalPremiumPayment ile başarılı işlem mesajı uyumlu olmalı", () => {
  cy.get(".proto-popup-body .announcement-content").then((el) => {
    cy.wrap(additionalPremiumPaymentRes.announcementList.announceModels, {
      timeout: 150000,
    }).should("contain", el.text());
  });
});
