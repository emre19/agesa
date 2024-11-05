class PoliceIptalPage {
  elements = {
    header: () => cy.get("span.h3"),
    bilgilendirmeMetiniText: () => cy.get("span.announcement-content"),
    iptalNedeniContainer: () => cy.get("div.radio-group"),
    iptalNedeniRadioButon: () => cy.get("div.radio-group input.proto-radio"),
    iptalHesapMiktar: (bedel) => cy.get(`div[id="label"]:contains("${bedel}")`).siblings("div#value"),
    toplamFonDegeriMiktar: () => cy.get('div[id="label"]:contains("Toplam Fon Değeri")').siblings("div#value"),
    tanimliOdemeKarti: () => cy.get('div.pT20:contains("Tanımlı Ödeme Yöntemi")'),
    bankaBilgisiDropdown: () => cy.get(".Select-control:contains('BANKA BİLGİSİ')"),
    ibanInput: () => cy.get('[name="iban"]'),
  };

  headerIcerik(baslik) {
    this.elements.header().should("contain", baslik);
  }
}

export const policeIptal = new PoliceIptalPage();
