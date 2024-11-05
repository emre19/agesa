class FinansalDanismanPage {
  elements = {
    kart: () => cy.get(
      "div.proto-card-title:contains('Finansal Danışman Bilgileri')"
    ),
    detayKart: (kartTuru) => cy.get(
      `div.proto-card-container:contains('${kartTuru}')`
    ),
    header: () => cy.get("span.h3"),
    headerAltBaslik: () => cy.get("span.label.underline")
  };

  headerIcerik(baslik) {
    this.elements.header().should("contain", baslik);
  }

  headerAltBaslikIcerik(baslik) {
    this.elements.headerAltBaslik().should("contain", baslik);
  }
}

export const finansalDanismanPage = new FinansalDanismanPage();
