// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
import "cypress-mochawesome-reporter/register";
import "cypress-real-events";
import 'cypress-if'
import { loginPage } from "@pages/LoginPage";
import { ozetSafyasi } from "../pages/OzetSafyasiPage";

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

before(() => {
  // Given Login sayfasına gittim
  cy.clearAllCookies();
  cy.clearAllLocalStorage();
  cy.clearAllSessionStorage();
  cy.visit("/");

  // When "fatihdemir" kullanıcı adı ve "Fatihd2204" şifresi ile giriş yapıyorum
  loginPage.submitLogin("fatihdemir", "Fatihd22043");

  // Then "Hangi işlemi yaparsan yap, Bi’Tıkla portal ile her işlem bir tık uzağında." mesajı görünmeli
  cy.contains(
    "Hangi işlemi yaparsan yap, Bi’Tıkla portal ile her işlem bir tık uzağında."
  );

  // When Çağrı merkezi uylamasına giriyorum
  cy.window().then((win) => {
    const orig = win.open;
    win.open = function (url, features) {
      return orig.call(this, url, "_self", features);
    };
  });
  cy.get("a:contains('Çağrı Merkezi')").first().click();

  // Then "Sunucu Seçimi" mesajı görünmeli
  //cy.contains("Sunucu Seçimi");

  // When Sunucu seçimi ekranındaki tamam butonuna tıklıyorum
  //ozetSafyasi.sunucuSeçimiTamamBtnTikla();

  //  And Poliçe no ile müşteri sorguluyorum
  ozetSafyasi.policeNoIleMusteriFiltreleme();

  // Then Müşteri listesinde en az 1 kişi bulunmalı
  ozetSafyasi.musteriSayisi();

  //  And "Sigortalı" müşteriyi seçiyorum
  let musteriRolu = Cypress.env("MUSTERI_ROLU") || "Sigortalı"
  ozetSafyasi.musteriSecimi(musteriRolu);

  // Then "Güvenliğiniz için size soracağım güvenlik sorularını yanıtlamanızı rica ederim." mesajı görünmeli
  cy.contains(
    "Güvenliğiniz için size soracağım güvenlik sorularını yanıtlamanızı rica ederim."
  );

  // When Güvenlik sorularını doğru olarak işaretliyorum
  ozetSafyasi.guvenlikSorulariniDogruOlarakIsaretle();

  // // Then Özet sayfasında 6 adet kart görünmeli
  // ozetSafyasi.kartSayisi(6);
});
