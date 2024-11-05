class OzetSafyasiPage {
  elements = {
    sunucuSeçimiTamamBtn: () =>
      cy
        .get("div:contains('Sunucu Seçimi')")
        .parent()
        .find("div button:contains('TAMAM')"),
    musteriFiltreAlani: (filtreTipi) =>
      cy.get(`input[placeholder="${filtreTipi}"]`),
    musteriFiltreAraBtn: () => cy.get("form>ul>li>button").contains("Ara"),
    musteriFiltreTemizleBtn: () => cy.get("span.temizle"),
    musteriSecimi: (musteriTipi) => cy.get(`td:contains("${musteriTipi}")`),
    musteriListesi: () => cy.get(".bT10 tbody"),
    guvenlikSorusuAlani: () => cy.get("div.p15"),
    besSozesmeleriKarti: () =>
      cy.get("div.bgSummary1:contains('BES Sözleşmeleri')"),
    sigortalarKarti: () => cy.get("div.bgSummary2:contains('Sigortalar')"),
    basvuruGecmisiKarti: () =>
      cy.get("div.proto-card-container-text:contains('Başvuru Geçmişi')"),
    musteriTemsilcisiNotuKarti: () =>
      cy.get(
        "div.proto-card-container-text:contains('Müşteri Temsilcisi Notu')"
      ),
    bekleyenTaleplerKarti: () =>
      cy.get("div.proto-card-container-text:contains('Bekleyen Talepler')"),
    sonEtkileşimKarti: () =>
      cy.get("div.proto-card-container-text:contains('Son Etkileşim')"),
    kartlar: () => cy.get(".error-card"),
  };

  sunucuSeçimiTamamBtnTikla() {
    this.elements.sunucuSeçimiTamamBtn().click();
  }

  musteriFiltreleme(filtreTipi, filtreSorgusu) {
    this.elements
      .musteriFiltreAlani(filtreTipi)
      .click()
      .clear()
      .type(filtreSorgusu);
    this.elements.musteriFiltreAraBtn().click();
  }

  policeNoIleMusteriFiltreleme() {
    this.elements
      .musteriFiltreAlani("x-xxxxxxx")
      .click()
      .clear()
      .type((Cypress.env("POLICE_NO")));
    this.elements.musteriFiltreAraBtn().click();

    // cy.log(typeof(Cypress.env("POLICE_NO")))
  }

  musteriFiltresiTemizleme() {
    this.elements.musteriFiltreTemizleBtn().click();
  }

  musteriSecimi(musteriTipi) {
    this.elements.musteriSecimi(musteriTipi).click();
  }

  musteriSayisi() {
    this.elements.musteriListesi().should("have.descendants", "tr");
  }

  guvenlikSorulariniDogruOlarakIsaretle() {
    this.elements.guvenlikSorusuAlani().find("i.icon-accept").click();
    this.elements
      .guvenlikSorusuAlani()
      .find(".proto-button-loading-icon")
      .should("be.visible");
    this.elements.guvenlikSorusuAlani().find("i.icon-accept").click();
    this.elements
      .guvenlikSorusuAlani()
      .find(".proto-button-loading-icon")
      .should("be.visible");
    this.elements.guvenlikSorusuAlani().find("i.icon-accept").click();
    this.elements
      .guvenlikSorusuAlani()
      .find(".proto-button-loading-icon")
      .should("be.visible");

      cy.intercept("GET", `**/lifeInsuranceSummary/*`).as(
        "lifeInsuranceSummary"
      );

    this.elements.guvenlikSorusuAlani().find("i.icon-accept").click();
  }

  kartSayisi(kartSayisi) {
    this.elements.kartlar().should("have.length", kartSayisi);
    cy.screenshot()
  }

  besSozesmeleriKartiIcerigiDogrulama(icerik) {
    this.elements
      .besSozesmeleriKarti()
      .within(() => cy.get("div").should("contain", icerik));
  }

  sigortalarKartiIcerigiDogrulama(icerik) {
    this.elements
      .sigortalarKarti()
      .within(() => cy.get("div").should("contain", icerik));
  }

  basvuruGecmisiKartiIcerigiDogrulama(icerik) {
    this.elements
      .basvuruGecmisiKarti()
      .should("be.visible")
      .within(() => cy.get("div").should("contain", icerik));
  }

  musteriTemsilcisiNotuKartiIcerigiDogrulama(icerik) {
    this.elements
      .musteriTemsilcisiNotuKarti()
      .should("be.visible")
      .within(() => {
        cy.get("div").should("contain", icerik);
      });
  }

  bekleyenTaleplerKartiIcerigiDogrulama(icerik) {
    this.elements
      .bekleyenTaleplerKarti()
      .should("be.visible")
      .within(() => cy.get("div").should("contain", icerik));
  }

  sonEtkileşimKartiIcerigiDogrulama(icerik) {
    this.elements
      .sonEtkileşimKarti()
      .should("be.visible")
      .within(() => cy.get("thead").should("contain", icerik));
  }
}

export const ozetSafyasi = new OzetSafyasiPage();
