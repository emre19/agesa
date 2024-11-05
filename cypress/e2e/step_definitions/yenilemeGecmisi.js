import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { yenilemeGecmisiPage } from "@pages/YenilemeGecmisiPage";

let renewalHistoryRes = {};

When(
  "Yenileme geçmişini görüntüle linkine renewalHistory ile tıklıyorum",
  () => {
    cy.intercept("GET", "**/renewalHistory*").as("renewalHistory");

    yenilemeGecmisiPage.elements.yenilemeGecmisGoruntuleBtn().click();

    cy.wait("@renewalHistory")
      .its("response.body")
      .then((interception) => {
        renewalHistoryRes = interception;
      });
  }
);

Then("renewalHistoryList eleman sayısı ile yenileme sayısı aynı olmalı", () => {
  cy.wrap(renewalHistoryRes.data.renewalHistoryList).as("renewalHistoryList");
  cy.get("@renewalHistoryList").then((el) => {
    yenilemeGecmisiPage.elements.tabloBody().should("have.length", el.length);
  });
});

Then(
  "renewalHistoryList eleman içerikleri ile yenileme satırları içerikleri aynı olmalı",
  () => {
    yenilemeGecmisiPage.elements.tablo().should(
      "not.contain",
      "Seçilen poliçe için Yenileme/Yenileme İptal Geçmişi bulunamamıştır"
    );
    cy.wait(400);

    let satirSayisi;
    yenilemeGecmisiPage.elements.tabloBody().then((el) => {
      satirSayisi = el.length;
      cy.log("SATIR SAYISI: " + satirSayisi);
    });

    cy.wrap(renewalHistoryRes.data.renewalHistoryList).then(() => {
      for (let i = 0; i < satirSayisi; i++) {
        cy.wrap(renewalHistoryRes.data.renewalHistoryList[i]).then((icerik) => {
          cy.log("SATIR NO: ", i + 1);
          yenilemeGecmisiPage.elements.tabloBody()
            .eq(i)
            .should("contain", icerik.renewalStatus)
            .and("contain", icerik.renewalCancellationReason)
            .and("contain", icerik.transactionChannel)
            .and("contain", icerik.transactionDate);
        });
      }
    });
  }
);
