class TaleplerPage {
  elements = {
    buton: (butonAdi)=> cy.get(`button[btnstyle="primary"]:contains("${butonAdi}")`),
    seciliAktiviteTipi: () => cy.get(".clearfix .checked"),
    seciliTalebinKonusu: () => cy.get('div.Select-control:contains("Talebin Konusu Seçiniz")').within(()=> {
      cy.get("span.Select-value-label")
    }),
    seciliTalebinDetayKonusu: () => cy.get('div.Select-control:contains("Talebin Detay Konusunu Seçiniz")').within(()=> {
      cy.get("span.Select-value-label")
    }),
    kayitliTelNo: () =>  cy.get("input#registeredPhoneNumber"),
    kayitliEMail: () => cy.get('input[name="registeredEmail"]'),
    kayitliIletisimAdresi: () => cy.get('input[name="registeredContactAddress"]'),
    aciklama : () => cy.get('textarea[type="text"]'),
    uyari: () => cy.get('div[role="alert"]'),
  };
}

export const taleplerPage = new TaleplerPage();
