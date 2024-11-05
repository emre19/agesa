import {
  Given,
  When,
  Then,
} from "@badeball/cypress-cucumber-preprocessor";
import {loginPage} from '@pages/LoginPage'

Given("Login sayfasına gittim", () => {
  cy.clearAllCookies()
  cy.clearAllLocalStorage()
  cy.clearAllSessionStorage()
  cy.visit("/");
});

When("{string} kullanıcı adı ve {string} şifresi ile giriş yapıyorum", (username,password) => {
  loginPage.submitLogin(username,password)
});

When("Uygulamadan çıkış yapıyorum", () => {
  loginPage.elements.logoutBtn().click()
});

Then("{string} uyarısı görünmeli", (message) => {
  loginPage.checkErrorMessage(message)
});
