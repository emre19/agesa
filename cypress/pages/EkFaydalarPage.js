import { basePage } from "./BasePage";

let lifeInsuranceSummaryDetailRes;

class EkFaydalarPage {
  elements = {
    ekFaydaTablo: () => cy.get(`.row table:contains("Fayda Adı")`),
    ekFaydaTabloSütundakiOkIsareti: (sütunIsmi) =>
        cy.get(`.proto-table-header_content:contains("${sütunIsmi}") span`),
    ekFaydaTabloKapsamInputField: () => cy.get("input[placeholder='Ara']"),
    ekFaydaTabloCheckBox: (isaretlenecekItem) =>
        cy.get(
          `div[role='listbox'] .proto-label:contains("${isaretlenecekItem}")`
        ),
  };

  ekFaydaServisResponseKaydet() {
    cy.intercept("GET", `**/lifeInsuranceSummaryDetail*`).as(
      "lifeInsuranceSummaryDetail"
    );

    basePage.policeNumarasiIleUrunSec();

    cy.wait(`@lifeInsuranceSummaryDetail`)
      .its("response.body")
      .then((interception) => {
        lifeInsuranceSummaryDetailRes = interception;
      });
  }

  ekFaydaTablosuKontrolu() {
    this.elements
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
  }

  ekFaydaTablosuKapsamFiltreleme(filtrelenecekKelime) {
    this.elements.ekFaydaTabloSütundakiOkIsareti("Kapsam").click();
    this.elements
      .ekFaydaTabloKapsamInputField()
      .should("be.visible")
      .type(`${filtrelenecekKelime}{enter}`);
  }

  ekFaydaKapsamSutunuFiltrenenIcerikKontrol(filtrelenenKelime) {
    this.elements.ekFaydaTablo().within(() => {
      cy.get(".proto-table-row p").should("contain", filtrelenenKelime);
    });
  }

  ekFaydaCarpiIconKontrol(sutunIsmi) {
    this.elements
      .ekFaydaTabloSütundakiOkIsareti(sutunIsmi)
      .parent()
      .find(".icon-close")
      .should("exist");
  }

  ekFaydaCarpiIconTikla(sutunIsmi) {
    this.elements
      .ekFaydaTabloSütundakiOkIsareti(sutunIsmi)
      .parent()
      .find(".icon-close")
      .should("exist")
      .click();
  }

  ekFaydaCheckBoxSecim(sutunIsmı, secilecekCheckBox) {
    this.elements.ekFaydaTabloSütundakiOkIsareti(sutunIsmı).click();
    this.elements.ekFaydaTabloCheckBox(secilecekCheckBox).click();
  }

  ekFaydaExistKontrol(){
    this.elements.ekFaydaTablo().should("exist");
  }
}

export const ekFaydalar = new EkFaydalarPage();
