class LoginPage {
  elements = {
    usernameInput: () => cy.get("#username"),
    passwordInput: () => cy.get("#password"),
    loginBtn: () => cy.get("button"),
    logoutBtn: () => cy.get(".icon-logout"),
    errorMessage: (message) => cy.get('.proto-popup.alert-modal').should('contain', message),
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

  submitLogin(username,password){
    this.elements.usernameInput().type(username);
    this.elements.passwordInput().type(password);
    this.elements.loginBtn().click();
  }

  checkErrorMessage(message){
    this.elements.errorMessage(message)
  }
}

export const loginPage = new LoginPage();
