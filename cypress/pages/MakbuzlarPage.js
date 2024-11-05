class MakbuzlarPage {
  elements = {
    makbuzlarTabloBody: () => cy.get(".proto-table-body"),
    makbuzlarTabloSatir: () => cy.get(".proto-table-body tr"),
    makbuzlarTabloHeader: () => cy.get("thead[class='proto-table-header']"),
    makbuzlarTabloPoliceNumarasi: () =>
      cy.get(".proto-table-body tr .proto-table-col-bordered").eq(0),
    makbuzlarTabloUrun: () =>
      cy.get(".proto-table-body tr").each((el) => {
        cy.wrap(el).find(".proto-table-col-bordered").eq(1);
      }),
    popupBilgilendirmeMetiniText: () =>
      cy.get(".proto-popup-body .content span.announcement-content"),
    hepsiniSec: () => cy.get("thead.proto-table-header tr th").eq(0),
    urunAdiIleMabuz: (urunAdi) =>
      cy.get(`.proto-table-body td:contains("${urunAdi}")`),
    makbuzSecimUrunAdi: (urunAdi) =>
      cy
        .get(`.proto-table-body td:contains("${urunAdi}")`)
        .parent()
        .find("div .proto-checkbox-container"),
  };

  urunAdiDogrulama(urunAdi) {
    this.elements.makbuzlarTabloSatir().each((el) => {
      cy.wrap(el).find("td").eq(2).should("contain", urunAdi);
    });
  }

  policeNumarasiDogrulama(policeNo) {
    this.elements.makbuzlarTabloSatir().each((el) => {
      cy.wrap(el).find("td").eq(1).should("contain", policeNo);
    });
  }

  sutunIsmiDogrulama(sutunBaslıgı) {
    this.elements
      .makbuzlarTabloHeader()
      .should("be.visible")
      .within(() => {
        cy.get("tr").should("contain", sutunBaslıgı);
      });
  }

  tumMakbuzlariSec() {
    this.elements.hepsiniSec().should("be.visible").click();
  }
}

export const makbuzlarPage = new MakbuzlarPage();
