import { basePage } from "./BasePage";
export let coverageInfoRes;
let lifeInsuranceSummaryDetailRes,
  checkLifePolicyTaxDiscountRes,
  lifePolicyPaymentMethodRes,
  financialAdvisorInfoRes,
  lifeInsuranceSummaryRes,
  customerPremiumAmountInformationRes;

let urunAdi = Cypress.config("custom").urun_adi;

class KapsananTeminatlarPage {
  elements = {
    kapsananTeminatlarKarti: () =>
      cy.get(`.assurance-and-assurance:contains("Kapsanan Teminatlar")`),
    teminatBilgisi: () => cy.get(".coverage-container"),
    teminatBilgisiTabloSutunBaslik: () =>
      cy.get(
        ".coverage-container div.coverage-container thead.proto-table-header"
      ),
    teminatBilgisiTabloSatirlari: () =>
      cy.get(
        ".coverage-container div.coverage-container tbody .proto-table-row"
      ),
    vefatTeminatiKatsayisiniDegistirInfoIcon: () =>
      cy.get(".mL0 .icon-exclamation-circle"),
  };

  policeNoSecipServisResponseKaydet() {
    cy.wait(`@lifeInsuranceSummary`)
      .its("response.body")
      .then((interception) => {
        lifeInsuranceSummaryRes = interception;
      });

    cy.intercept("GET", `**/lifeInsuranceSummaryDetail*`).as(
      "lifeInsuranceSummaryDetail"
    );

    cy.intercept("POST", `**/checkLifePolicyTaxDiscount*`).as(
      "checkLifePolicyTaxDiscount"
    );

    cy.intercept("GET", `**/lifePolicyPaymentMethod*`).as(
      "lifePolicyPaymentMethod"
    );

    cy.intercept("GET", `**/financialAdvisorInfo/**`).as(
      "financialAdvisorInfo"
    );

    cy.intercept("GET", "**/customerPremiumAmountInformation*").as(
      "customerPremiumAmountInformation"
    );

    basePage.policeNumarasiIleUrunSec();

    cy.wait(`@lifeInsuranceSummaryDetail`)
      .its("response.body")
      .then((interception) => {
        lifeInsuranceSummaryDetailRes = interception;
      });

    cy.wait(`@checkLifePolicyTaxDiscount`)
      .its("response.body")
      .then((interception) => {
        checkLifePolicyTaxDiscountRes = interception;
      });

    cy.wait(`@lifePolicyPaymentMethod`)
      .its("response.body")
      .then((interception) => {
        lifePolicyPaymentMethodRes = interception;
      });

    cy.wait(`@financialAdvisorInfo`)
      .its("response.body")
      .then((interception) => {
        financialAdvisorInfoRes = interception;
      });

    cy.wait("@customerPremiumAmountInformation")
      .its("response.body")
      .then((interception) => {
        customerPremiumAmountInformationRes = interception;
      });
  }

  kapsananTeminatlarKartIcerikKontrol() {
    const coveredBenefits = lifeInsuranceSummaryDetailRes.data.coveredBenefits;

    this.elements
      .kapsananTeminatlarKarti()
      .invoke("text")
      .then((uiText) => {
        coveredBenefits.forEach((benefit) => {
          const benefitText = (benefit.text || "").trim().replace(/\s+/g, " ");
          const benefitAmount = (benefit.amount.amount || "")
            .trim()
            .replace(/\s+/g, " ");
          const benefitCurrency = (benefit.amount.currency || "")
            .trim()
            .replace(/\s+/g, " ");

          cy.contains("#label", benefitText)
            .should("exist")
            .then((labelElement) => {
              const expectedValue = `${benefitAmount} ${benefitCurrency}`;

              cy.wrap(labelElement)
                .parent()
                .find("#value")
                .should("have.text", expectedValue);
            });
        });

        if (uiText.includes("VEFAT TEMİNATI KATSAYISI")) {
          cy.contains("#label", "VEFAT TEMİNATI KATSAYISI")
            .should("exist")
            .then((labelElement) => {
              const expectedValue =
                lifeInsuranceSummaryDetailRes.data.deceaseBenefitCoefficient;

              cy.wrap(labelElement)
                .parent()
                .find("#value")
                .should("have.text", expectedValue);
            });
        }
      });
  }

  teminatTutarlarinaTikla() {
    cy.intercept("GET", `**/coverageInfo*`).as("coverageInfo");

    this.elements
      .kapsananTeminatlarKarti()
      .find(".proto-link.underline")
      .should("exist")
      .click();

    cy.wait(`@coverageInfo`)
      .its("response.body")
      .then((interception) => {
        coverageInfoRes = interception;
      });
  }
  urunAdiVePoliceNoKontrol() {
    const prefix = Cypress.env("POLICE_NO").charAt(0);
    let policyNo = Cypress.env("POLICE_NO").slice(1).split("-").join("");

    const policeNumarasi = `${prefix}-${policyNo}`;

    this.elements
      .teminatBilgisi()
      .find(".label.underline")
      .should("contain", urunAdi)
      .and("contain", policeNumarasi);
  }

  teminatTutarlariIcerikKontrol() {
    const coveredBenefits = lifeInsuranceSummaryDetailRes.data.coveredBenefits;

    coveredBenefits.forEach((benefit, index) => {
      const benefitText = benefit.text || "";
      const benefitAmount = benefit.amount.amount || "";
      const benefitCurrency = benefit.amount.currency || "";

      const currentCoverageAmount =
        coverageInfoRes.data.currentCoverage.maturityBonusAmount.amount || "";
      const currentCoverageCurrency =
        coverageInfoRes.data.currentCoverage.maturityBonusAmount.currency || "";

      const expectedValue = `${benefitAmount} ${benefitCurrency}`;
      const vadePrimTutari = `Vade Prim Tutarı: ${currentCoverageAmount} ${currentCoverageCurrency}`;

      this.elements
        .teminatBilgisi()
        .find(".pB20 h2")
        .should("contain", vadePrimTutari);

      this.elements
        .teminatBilgisi()
        .find(".proto-table-row")
        .eq(index)
        .should("contain", benefitText)
        .and("contain", expectedValue);
    });
  }

  teminatBilgisiSabitTextKontrolu(item) {
    this.elements.teminatBilgisi().then(($element) => {
      const text = $element.text();
      expect(text).to.contain(item);
    });
  }

  teminatBilgisiSutunIsimleriKontrolu(item) {
    this.elements.teminatBilgisiTabloSutunBaslik().then(($element) => {
      const text = $element.text();
      expect(text).to.contain(item);
    });
  }

  teminatTablosuSatirlarKontrolu() {
    cy.wrap(
      coverageInfoRes.data.monthBasedCoverage.monthBasedCoverageTable
    ).then((el) => {
      this.elements
        .teminatBilgisiTabloSatirlari()
        .should("have.length.at.least", el.length > 10 ? 10 : el.length)
        .its("length")
        .then((tableLength) => {
          for (let i = 0; i < tableLength; i++) {
            cy.wrap(el[i]).then((icerik) => {
              this.elements
                .teminatBilgisiTabloSatirlari()
                .eq(i) // Tablodaki 0'dan başlayarak i'nci satırı seçer
                .should("contain", icerik.coverageYear)
                .and("contain", icerik.coverageMonth)
                .and("contain", icerik.vpkCode)
                .and("contain", icerik.coverageAmount.amount)
                .and("contain", icerik.coverageAmount.currency);
            });
          }
        });
    });
  }

  kapsananTeminatlarSabitTextKontrolu(item) {
    this.elements.kapsananTeminatlarKarti().then(($element) => {
      const text = $element.text();
      expect(text).to.contain(item);
    });
  }

  vefatTeminatiKatsayisiniDegistirInfoIconMsjKontrol() {
    // Info iconuna mouseover tetikleme
    this.elements
      .vefatTeminatiKatsayisiniDegistirInfoIcon()
      .trigger("mouseover");

    // Announcement listesi içindeki mesajlarla karşılaştırma
    const announcementListRes =
      lifeInsuranceSummaryRes.data.announcementList.announceModels.concat(
        customerPremiumAmountInformationRes.data.announcementList.announceModels
      );

    // Tooltip içinde birden fazla element olabileceği için .proto-tooltip-body içindeki her bir elementi kontrol et
    cy.get(".proto-tooltip-body .mT10")
      .each((tooltipElement) => {
        // Her bir tooltip elementinin text'ini al
        cy.wrap(tooltipElement)
          .invoke("text")
          .then((uiText) => {
            // Announcement listesi içindeki mesajlarla karşılaştırma
            const messages = announcementListRes.map((model) => model.message);

            // valueText, messages içindeki herhangi bir mesajla eşleşmiyorsa test hata verir
            expect(messages).to.include(uiText);
          });
      })
      .then(() => {
        // Hover işlemini iptal etmek için mouseout tetikleyelim
        this.elements
          .vefatTeminatiKatsayisiniDegistirInfoIcon()
          .trigger("mouseout");
      });
  }

  kapsananTeminatlarInfoIconMsjKontrol() {
    const announcementListRes =
      lifeInsuranceSummaryDetailRes.data.announcementList.announceModels;

    this.elements
      .kapsananTeminatlarKarti()
      .find(".icon-info-circle")
      .each(($icon, index) => {
        // İlgili icon üzerinde mouseover tetikleniyor
        cy.wrap($icon).trigger("mouseover", { force: true });

        // Tooltip içeriğini almak için proto-tooltip-body elemanını buluyoruz
        this.elements
          .kapsananTeminatlarKarti()
          .find(".proto-tooltip-body")
          .eq(index) // Hangi info iconun üzerine bakmamız gerektiğini belirtir
          .then(($tooltip) => {
            let valueText = $tooltip.text();

            // Announcement listesi içindeki mesajlarla karşılaştırma
            const messages = announcementListRes.map((model) => model.message);

            // Eğer valueText, messages içindeki herhangi bir mesajla eşleşmiyorsa test hata verir
            expect(messages).to.include(valueText);
          });
      });
  }

  kapsananTeminatlarInfoIconMsjOlmamasiKontrolu(){
    this.elements
    .kapsananTeminatlarKarti()
    .find(".icon-info-circle")
    .should('not.exist'); // Bu, doğrudan öğenin bulunmadığını kontrol eder.
  }
}

export const kapsananTeminatlarPage = new KapsananTeminatlarPage();
