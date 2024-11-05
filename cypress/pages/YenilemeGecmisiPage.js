class YenilemeGecmisiPage {
  elements = {
    header: () => cy.get("span.h3"),
    yenilemeGecmisGoruntuleBtn: () =>
      cy.get(
        ".insurance-summary-underline.cp:contains('Yenileme Geçmişini Görüntüle')"
      ),
      tablo: () => cy.get("table"),
      tabloBody: () => cy.get("table tbody tr"),


  };

  headerIcerik(baslik) {
    this.elements.header().should("contain", baslik);
  }
}

export const yenilemeGecmisiPage = new YenilemeGecmisiPage();
