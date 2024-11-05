class OdemeGunDegisikligiPage {
  elements = {
    odemePeriyotlari: () =>
      cy.get(".change-payment-day-and-period .pB20 .pR10"),
    odemeGunSecenekleri: () => cy.get(".pB20.select-day"),
    seciliOdemeGunu: () => cy.get(".pB20.select-day .Select-value-label"),
    odemeGunSecmeArrow: () =>
      cy.get("div.proto-popup-body .pB20.select-day .Select-arrow-zone"),
    odemeGunuOpsiyonu: (odemeGunu) =>
      cy.get(
        `div.proto-popup-body .pB20.select-day .Select-menu-outer #react-select-3--list div:contains("${odemeGunu}")`
      ),
    odemeGunuOpsiyonlari: () => cy.get('[id^="react-select-3--option"]'),
    odemePeriyotPasifInfoIkon: () =>
      cy.get("div.proto-popup-body .icon.icon-info-circle"),
  };

  typeUsername(username) {
    this.elements.usernameInput().type(username);
  }

  typePassword(password) {
    this.elements.passwordInput().type(password);
  }

  clickLogin() {
    this.elements.loginBtn().click();
  }

  submitLogin(username, password) {
    this.elements.usernameInput().type(username);
    this.elements.passwordInput().type(password);
    this.elements.loginBtn().click();
  }

  checkErrorMessage(message) {
    this.elements.errorMessage(message);
  }
}

export const oGDPage = new OdemeGunDegisikligiPage();
