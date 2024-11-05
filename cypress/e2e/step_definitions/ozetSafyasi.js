import {
  Given,
  When,
  Then,
} from "@badeball/cypress-cucumber-preprocessor";
import {ozetSafyasi} from '@pages/OzetSafyasiPage'


Given("Sunucu seçimi ekranındaki tamam butonuna tıklıyorum", () => {
  ozetSafyasi.sunucuSeçimiTamamBtnTikla();
});

Given("Müşteriyi {string} alanında {string} ile sorguluyorum", (filtreTipi, filtreSorgusu) => {
  ozetSafyasi.musteriFiltreleme(filtreTipi, filtreSorgusu)
});

Given("Poliçe no ile müşteri sorguluyorum", () => {
  ozetSafyasi.policeNoIleMusteriFiltreleme()
});

When("{string} müşteriyi seçiyorum", (musteriTipi) => {
  ozetSafyasi.musteriSecimi(musteriTipi)
});

Then("Müşteri listesinde en az 1 kişi bulunmalı", () => {
  ozetSafyasi.musteriSayisi()
});

When("Güvenlik sorularını doğru olarak işaretliyorum", () => {
  ozetSafyasi.guvenlikSorulariniDogruOlarakIsaretle()
});

Then("Özet sayfasında {int} adet kart görünmeli", (kartSayisi) => {
  ozetSafyasi.kartSayisi(kartSayisi);
});

Then("Bes sözleşmeleri kartı aşağıdakileri içermeli", (table) => {
  // cy.get("#loader-md").should("be.visible")
  cy.get("#loader-md").should("not.exist")
  table.raw().flat().forEach((item) => {
    ozetSafyasi.besSozesmeleriKartiIcerigiDogrulama(item)
  })
});

Then("Sigortalar kartı aşağıdakileri içermeli", (table) => {
  cy.get("#loader-md").should("not.exist")
  table.raw().flat().forEach((item) => {
    ozetSafyasi.sigortalarKartiIcerigiDogrulama(item)
  })
});

Then("Başvuru geçmişi aşağıdakileri içermeli", (table) => {
  cy.get("#loader-md").should("not.exist")
  table.raw().flat().forEach((item) => {
    ozetSafyasi.basvuruGecmisiKartiIcerigiDogrulama(item)
  })
});

Then("Müşteri temsilcisi notu aşağıdakileri içermeli", (table) => {
  cy.get("#loader-md").should("not.exist")
  table.raw().flat().forEach((item) => {
    ozetSafyasi.musteriTemsilcisiNotuKartiIcerigiDogrulama(item)
  })
});

Then("Bekleyen Talepler kartı aşağıdakileri içermeli", (table) => {
  cy.get("#loader-md").should("not.exist")
  table.raw().flat().forEach((item) => {
    ozetSafyasi.bekleyenTaleplerKartiIcerigiDogrulama(item)
  })
});

Then("Son Etkileşim kartında aşağıdaki sütunlar bulunmalı", (table) => {
  cy.get("#loader-md").should("not.exist")
  table.raw().flat().forEach((item) => {
    ozetSafyasi.sonEtkileşimKartiIcerigiDogrulama(item)
  })
});