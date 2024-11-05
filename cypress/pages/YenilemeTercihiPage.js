class YenilemeTercihiPage {
  elements = {
    header: () => cy.get("span.h3"),
    yenilemeTalebindenVazgecBtnInfoIkon: () =>
      cy.get("div.proto-popup-body .icon.icon-info-circle"),
    bilgilendirmeMetiniText: () => cy.get("span.announcement-content"),
    iptalNedeniContainer: () => cy.get("div.radio-group"),
    iptalNedeniRadioButon: () => cy.get("div.radio-group input.proto-radio"),
  };

  headerIcerik(baslik) {
    this.elements.header().should("contain", baslik);
  }
}

export const yenilemeTercihiPage = new YenilemeTercihiPage();
