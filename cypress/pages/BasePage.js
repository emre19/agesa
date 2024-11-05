let makbuzAdi = Cypress.config("custom").makbuz_adi;
let makbuzEmail = Cypress.config("custom").makbuz_email;

export let lifeInsuranceSummaryDetailRes, checkLifePolicyTaxDiscountRes, lifePolicyPaymentMethodRes, financialAdvisorInfoRes;

class BasePage {
  elements = {
    navigasyon: (sekmeIsmi) =>
      cy.get(`.UnorderedList:contains("${sekmeIsmi}")`),
    buton: (butonAdi) =>
      cy.get(`button:contains("${butonAdi}")`, { timeout: 300000 }),
    butonUnlemIsareti: (butonAdi) =>
      cy
        .get(`button:contains("${butonAdi}")`, { timeout: 300000 })
        .within(() => cy.get(".icon-exclamation-circle")),
    urun: (urunAdi) => cy.get(`#planName[title="${urunAdi}"]`),
    //urunPoliceNoIle: (policeNo) => cy.get(`#name[title^="${policeNo}"]`),
    urunPoliceNoIle: (policeNo) =>
      cy.get(`table tbody td:contains("${policeNo}")`),
    daireLoader: () =>
      cy.get(".proto-button-loading-icon", { timeout: 300000 }),
    popupContainer: () => cy.get(".proto-popup-container"),
    popupTitle: () => cy.get(".proto-popup-title-text"),
    popupBody: () => cy.get("div.proto-popup-body"),
    popupBodyButon: (butonAdi) =>
      cy.get(`.proto-popup-container button:contains("${butonAdi}")`),
    popupBodyButonlar: () => cy.get("div.proto-popup-body button"),
    popupBodyEmailInput: () => cy.get("div.proto-popup-body #email"),
    popupAltBaslik: () => cy.get("p.proto-popup-subtitle-text"),
    makbuzTableBody: () => cy.get(".proto-table-body tr"),
    loader: () => cy.get("#loader-sm"),
    pdfIcerik: () => cy.get(".react-pdf__Page__textContent"),
    tarihAraligi: () => cy.get(".react-datepicker__input-container input"),
    yilDropdown: () => cy.get(".react-datepicker__year-select"),
    ayDropdown: () => cy.get(".react-datepicker__month-select"),
    gunDropdown: (day) =>
      cy.get(`.react-datepicker__day--0${day}[aria-disabled="false"]`),
    carpiIsaretIcon: () => cy.get(".icon-close-circle"),
    odenecekToplamTutar: () => cy.get('span:contains("Ödenecek Toplam Tutar")').next(),
    radioButton: (radioButton) =>
      cy.get(
        `.proto-radio-mark.proto-label-container:contains("${radioButton}")`
      ),
      bankaBilgisiDropdown: () => cy.get(".Select-control:contains('BANKA BİLGİSİ')"),
      ibanInput: () => cy.get('input[name="iban"]'),
  };

  sekmeSecme(sekme) {
    this.elements
      .navigasyon(sekme)
      .within(() => cy.get(`li:contains("${sekme}")`).should("exist").click());
  }

  sekmeKontrol(sekme) {
    this.elements
      .navigasyon(sekme)
      .within(() =>
        cy.get(`li:contains("${sekme}")`).should("have.class", "active")
      );
  }

  butonGorunmeli(butonAdi) {
    this.elements.buton(butonAdi).scrollIntoView().should("be.visible");
  }

  butonAktif(butonAdi) {
    this.elements.buton(butonAdi).should("be.enabled");
  }

  butonPasif(butonAdi) {
    this.elements.buton(butonAdi).should("be.disabled");
  }

  butonTikla(butonAdi) {
    this.elements
      .buton(butonAdi)
      // .scrollIntoView().should("be.visible")
      .click();
  }

  daireLoaderYok() {
    this.elements.daireLoader().should("not.exist");
  }

  loaderYok() {
    this.elements.loader().should("not.exist");
  }

  popupTitleVar(titel) {
    this.elements.popupTitle().should("contain", titel);
  }

  popupAltBaslikVar(titel) {
    this.elements.popupAltBaslik().should("contain", titel);
  }

  popupYok() {
    this.elements.popupContainer().should("not.exist");
  }

  popupBodyButonTikla(butonAdi) {
    this.elements.popupBodyButon(butonAdi).click();
  }

  popupbutonAktif(butonAdi) {
    this.elements.popupBodyButon(butonAdi).should("be.enabled");
  }

  popupButonPasif(butonAdi) {
    this.elements.popupBodyButon(butonAdi).should("be.disabled");
  }

  popupBodyEmailTemizle() {
    this.elements.popupBodyEmailInput().clear();
  }

  policeNumarasiSeclifeInsuranceSummaryDetailServisiyle() {
    cy.intercept("GET", `**/lifeInsuranceSummaryDetail*`).as(
      "lifeInsuranceSummaryDetail"
    );

    this.policeNumarasiIleUrunSec();

    cy.wait(`@lifeInsuranceSummaryDetail`)
      .its("response.body")
      .then((interception) => {
        lifeInsuranceSummaryDetailRes = interception;
      });
  }

  policeNumarasiIleUrunSec() {
    const prefix = Cypress.env("POLICE_NO").charAt(0);
    let policyNo = Cypress.env("POLICE_NO").slice(1).split("-").join("");

    const policeNumarasi = `${prefix}${policyNo}`;
    basePage.elements.urunPoliceNoIle(policeNumarasi).first().click();
  }

  tablodanMakbuzAcma(siraNo) {
    this.elements.makbuzTableBody().eq(siraNo).click();
  }

  pdfIleMakbuzAdiKontrolu() {
    this.elements.pdfIcerik().should("contain", makbuzAdi);
  }

  yaziyaTikla(text) {
    cy.contains(text).click();
  }

  selectDate(day, month, year) {
    // Aylar 0 bazlı olduğu için, 11 Aralık ayına denk gelir
    const monthIndex = month - 1;

    // Yıl dropdown'ından yılı seç
    this.elements.yilDropdown().select(year.toString());

    // Ay dropdown'ından ayı seç
    this.elements.ayDropdown().select(monthIndex.toString());

    // Gün seçimini yap
    this.elements.gunDropdown(day).click();
  }

  iconGrunmeli() {
    this.elements.carpiIsaretIcon().should("be.visible");
  }

  pdfKapanmali() {
    this.elements.pdfIcerik().should("not.exist");
  }

  policeNoIleUrunSecVeServisdenGelenResponseKaydet() {
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
  }

  radioButtonClick(radioButton){
    this.elements.radioButton(radioButton).click();
  }

  popupBodyEmailEkle(){
    this.elements.popupBodyEmailInput().type(`${makbuzEmail}`);
  }
}

export const basePage = new BasePage();
