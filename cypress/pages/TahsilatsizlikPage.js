class TahsilatsizlikPage {
  elements = {
    header: () => cy.get("span.h3"),
    headerAltiCizili: () => cy.get("span.label.underline"),
    tahsilatsizlikInfoBaner: () =>
      cy.get(
        ".proto-notification-body_content:contains('vade tahsil edilememiştir')"
      ),
    tabloSatir: () => cy.get("form .tableBody .row"),
    odenecekToplamTutar: () =>
      cy.get("span:contains('Ödenecek Toplam Tutar')").next(),
    odenecekToplamTutarTablodakiDeger: () =>
      cy.get(".proto-card-body div#value"),
    odenecekToplamTutarTablodakiTarih: () =>
      cy.get(".proto-card-body div#label"),
    vadeCheckbox: () => cy.get('.tableHeader [type="checkbox"]'),
    odenmeyenVadelerTablodakiDeger: () =>
      cy.get(`.tableBody span[id="column1"] .text-truncate`),
    odenmeyenVadelerTablodakiTarih: () =>
      cy.get(`.tableBody span[id="column0"] .text-truncate`),
    noluVade: (vadeSirasi) => cy.get(`input[id="${vadeSirasi - 1}"]`),
    spanText: (mesaj) => cy.get(`span:contains("${mesaj}")`),
    asagiOk: () => cy.get(".icon-arrow-down"),
    cekimDenemesiDetayYok: () =>
      cy.get(
        "div.text-center:contains('Çekim denemesi detayları bulunamadı.')"
      ),
    tahsilatsizlikNedenTarihBazli: (tarih) =>
      cy.get(`span[id="column0"]:contains("${tarih}")`).parentsUntil("div.row"),
    tahsilatsizlikDurumBilgisi: () =>
      cy.get(".expiredOverduePolicyDataValueLife .tableBody span#column2"),
    tahsilatsizlikTabloHeader: () =>
      cy.get(".expiredOverduePolicyDataValueLife .tableHeader"),
    odenecekToplamTutarMiktari: () =>
      cy.get('span:contains("Ödenecek Toplam Tutar")').next(),
  };

  headerIcerik(baslik) {
    this.elements.header().should("contain", baslik);
  }
}

export const tahsilatsizlikPage = new TahsilatsizlikPage();
