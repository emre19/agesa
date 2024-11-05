import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { basePage } from "@pages/BasePage";
import { yenilemeTercihiPage } from "@pages/YenilemeTercihiPage";
import { ekFaydalar } from "@pages/EkFaydalarPage";


let lifeInsuranceSummaryDetailRes, reasonsRes, lifeChangeRenewalActivationStatusRes, yenilemeyeKalanGun;
const prefix = Cypress.env("POLICE_NO").charAt(0);
const policyNo = Cypress.env("POLICE_NO").match(/(?<=[-A-Z])\d+/)[0];
const policeNumarasi = prefix + policyNo;
const _ = require("lodash");

let iknaMetniIlkParagraf =
  "hiçbirimizin başına gelmesini istemeyiz elbette ama kötü ihtimaller hayatta hep var. Sahip olduğunuz poliçe ile poliçe süresi boyunca risklere karşı sevdiklerinizi güvence altına alıyorsunuz. Poliçenizin teminat tutarı başınıza beklenmedik bir şey gelmesi durumunda sevdiklerinize ödenecek ve onları maddi açıdan korumuş olacaksınız.";
let iknaMetniIkinciParagraf =
  ", poliçenizi yenileyerek, kendinizi ve sevdiklerinizi korumaya devam etmenizi öneririz. Poliçenizin yenilenmesini iptal etmek istiyor musunuz?";

Given(
  "Yenileme Tercihi değiştirme olan ürünü lifeInsuranceSummaryDetail ile seçiyorum",
  () => {
    cy.intercept("GET", "**/lifeInsuranceSummaryDetail*").as(
      "lifeInsuranceSummaryDetail"
    );

    basePage.policeNumarasiIleUrunSec();

    cy.wait("@lifeInsuranceSummaryDetail")
      .its("response.body")
      .then((interception) => {
        lifeInsuranceSummaryDetailRes = interception;
        yenilemeyeKalanGun =
          lifeInsuranceSummaryDetailRes.data.remainingDayToRenewal;
        cy.log("remainingDayToRenewal: " + yenilemeyeKalanGun);
      });
  }
);

Then("Yenilemeye kalan gün sayısı 30'dan fazla olmalı", () => {
  expect(yenilemeyeKalanGun).to.be.greaterThan(30);
});

Then("Yenileme aktive talebi header görünmeli", () => {
  yenilemeTercihiPage.headerIcerik("Nolu Poliçe Yenileme Aktive Talebi");
  yenilemeTercihiPage.headerIcerik(policeNumarasi);
});

Then("Yenileme iptal talebi header görünmeli", () => {
  yenilemeTercihiPage.headerIcerik("Nolu Poliçe Yenileme İptal Talebi");
  yenilemeTercihiPage.headerIcerik(policeNumarasi);
});

Then("Vazgeç butonuna reasons servisi ile tıklıyorum", () => {
  cy.wait(2000);
  cy.intercept("GET", "**/reasons*").as("reasons");

  basePage.butonTikla("Devam");

  cy.wait("@reasons")
    .its("response.body")
    .then((interception) => {
      reasonsRes = interception;
      cy.log("reasonsRes: " + JSON.stringify(reasonsRes));
    });
});

Then(
  "Yenileme İptal Talebi sebep sorma bilgilendirme metni reasons servisi ile uyumlu olmalı",
  () => {
    yenilemeTercihiPage.elements.bilgilendirmeMetiniText().then((el) => {
      let bilgilendirmeMetiniTextIcerik = el.text();
      expect(JSON.stringify(reasonsRes)).to.includes(
        bilgilendirmeMetiniTextIcerik
      );
    });
  }
);

Then(
  "Müşterinin Yenileme İptal Nedeni ile reasons servisi uyumlu olmalı",
  () => {
    reasonsRes.data.operationReasons.forEach((el) => {
      yenilemeTercihiPage.elements
        .iptalNedeniContainer()
        .should("contain", el.reason);
    });
  }
);

When("Random Yenileme İptal Nedeni ile devam ediyorum", () => {
  yenilemeTercihiPage.elements.iptalNedeniRadioButon().then((el) => {
    let randomSebep = _.random(0, el.length);
    cy.wrap(el)
      .eq(randomSebep - 1)
      .check({ force: true });
  });

  basePage.butonTikla("Devam");
});

Then("Yenileme İptalinden vazgeçirme ikna metini görünmeli", () => {
  yenilemeTercihiPage.elements
    .bilgilendirmeMetiniText()
    .should("contain", iknaMetniIlkParagraf)
    .and("contain", iknaMetniIkinciParagraf);
});

Then("Yenileme İptal Talebi Müşteri Onayı görünmeli", () => {
  let iptalTalebiMusteriOnayi = `${policeNumarasi} numaralı poliçenizin ${lifeInsuranceSummaryDetailRes.data.policyEndDate} tarihinde  yapılacak olan yenilenmesi iptal edilecektir. Onaylıyor musunuz?`;
  let elText;
  cy.get(".proto-popup-container span.announcement-content").then((el) => {
    elText = el.text();
    expect(elText.replaceAll(" ", "")).to.include(
      iptalTalebiMusteriOnayi.replaceAll(" ", "")
    );
  });
});

When("Popuptaki devam butonuna lifeChangeRenewalActivationStatus servisi ile tıklıyorum", () => {
  cy.wait(2000);
  cy.intercept("POST", "**/lifeChangeRenewalActivationStatus").as("lifeChangeRenewalActivationStatus");

  basePage.popupBodyButonTikla("Devam");

  cy.wait("@lifeChangeRenewalActivationStatus")
    .its("response.body")
    .then((interception) => {
      lifeChangeRenewalActivationStatusRes = interception;
      cy.log("lifeChangeRenewalActivationStatusRes: " + JSON.stringify(lifeChangeRenewalActivationStatusRes));
    });
});

When("Devam butonuna lifeChangeRenewalActivationStatus servisi ile tıklıyorum", () => {
  cy.wait(2000);
  cy.intercept("POST", "**/lifeChangeRenewalActivationStatus").as("lifeChangeRenewalActivationStatus");

  basePage.butonTikla("Devam");

  cy.wait("@lifeChangeRenewalActivationStatus")
    .its("response.body")
    .then((interception) => {
      lifeChangeRenewalActivationStatusRes = interception;
      cy.log("lifeChangeRenewalActivationStatusRes: " + JSON.stringify(lifeChangeRenewalActivationStatusRes));
    });
});

Then("lifeChangeRenewalActivationStatus {string} dönmeli", (state) => {
  expect(
    lifeChangeRenewalActivationStatusRes.success.toString()
  ).to.equal(state);
});


Then("Yenileme Tercihindeki ek faydalar lifeInsuranceSummaryDetail ile uyumlu olmalı", () => {
  ekFaydalar.elements
      .ekFaydaTablo()
      .find(".proto-table-row")
      .each(($row, index) => {
        cy.wrap($row)
          .find("td")
          .each(($td, tdIndex) => {
            const kurumlar =
              lifeInsuranceSummaryDetailRes.data.sideBenefits[index]
                .productGroup;
            const faydaAdi =
              lifeInsuranceSummaryDetailRes.data.sideBenefits[index].name;
            // Beklenen değerler dizisi
            const expectedValues = [faydaAdi, kurumlar];

            // Her td'yi dolaşıp index'e göre kontrol ediyoruz
            cy.wrap($td)
              .invoke("text")
              .then((actualText) => {
                if (tdIndex === 2) {
                  // 'kapsam' alanı (3. sütun)
                  expect(actualText.trim()).to.not.be.empty; // Dolu olduğunu assert et
                } else {
                  // Diğer alanlar için contain kontrolü yap
                  expect(actualText.trim()).to.contain(expectedValues[tdIndex]);
                }
              });
          });
      });

});
