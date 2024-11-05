let sendMailCreateReceiptDocumentRes, lifePaymentRes;

let makbuzEmail = Cypress.config("custom").makbuz_email;

import { basePage } from "@pages/BasePage";

class OdemeBilgileriPage {
  elements = {
    tekliMakbuzTablo: () => cy.get("thead[class='proto-table-header']"),
    tarihAraligi: () => cy.get(".react-datepicker__input-container input"),
    odemeBilgileriTableBody: () => cy.get(".proto-table-body"),
    ePostaIleGonderButton: () => cy.get(".proto-popup-buttons .icon-send"),
    yilDropdown: () => cy.get(".react-datepicker__year-select"),
    ayDropdown: () => cy.get(".react-datepicker__month-select"),
    gunDropdown: (day) =>
      cy.get(`.react-datepicker__day--0${day}[aria-disabled="false"]`),
    hizliTarihRadioButton: (radioButton) =>
      cy.get(
        `.proto-radio-mark.proto-label-container:contains("${radioButton}")`
      ),
    uyariMesaj: () => cy.get(".text-center"),
  };

  tekliMakbuzTablosundaSutunIsmiDogrulama(sutunBaslıgı) {
    this.elements
      .tekliMakbuzTablo()
      .should("be.visible")
      .within(() => cy.get("th").should("contain", sutunBaslıgı));
  }

  tarihAraliklariSeciyorum(kacinciTarih, gun, ay, yil) {

    const eskiTarih = gun + "-" + ay + "-" + yil;
      
    // Hangi tarih alanının seçileceğini belirliyoruz
    const tarihSelector = kacinciTarih === 1 ? 0 : 1;
    this.elements.tarihAraligi().eq(tarihSelector).should("be.exist").click();
  
    // DatePicker input'unun mevcut value değerini alıyoruz
    this.elements.tarihAraligi().eq(tarihSelector)
      .invoke('val')
      .then((currentTarih) => {
        cy.log("currentTarih: " + currentTarih);
  
        // Eğer tarihler aynı değilse intercept ve wait işlemleri yapılır
        if (currentTarih !== eskiTarih) {
          cy.intercept("GET", "**/lifePaymentHistory*").as("lifePaymentHistory");
      
          basePage.selectDate(gun, ay, yil);
  
          cy.wait("@lifePaymentHistory")
          .its("response.body")
          .then((interception) => {
            lifePaymentRes = interception;
          });
          
        } else {
          this.elements.tarihAraligi().eq(tarihSelector).type('{enter}');
          cy.log("Tarihler aynı, intercept ve wait yapılmadı.");
        }
      });
  }

  lifePaymentHistoryServisindekiResponseAlipOdemeBilgileriButonunaTikla(
    butonIsmi
  ) {
    cy.intercept("GET", "**/lifePaymentHistory*").as("lifePaymentHistory");

    basePage.butonTikla(butonIsmi);

    cy.wait("@lifePaymentHistory")
      .its("response.body")
      .then((interception) => {
        lifePaymentRes = interception;
      });
  }

  tekliMakbuzIlk10SatirSec(adet) {
    for (let i = 0; i < adet; i++) {
      this.elements
        .odemeBilgileriTableBody()
        .find("tr")
        .eq(i)
        .find("div .proto-checkbox-container")
        .click();
    }
  }

  popUpEmailEkleme() {
    cy.intercept("POST", "**/sendMailCreateReceiptDocument").as(
      "sendMailCreateReceiptDocument"
    );

    basePage.elements.popupBodyEmailInput().type(`${makbuzEmail}`);

    this.elements.ePostaIleGonderButton().click();

    cy.wait("@sendMailCreateReceiptDocument")
      .its("response.body")
      .then((interception) => {
        sendMailCreateReceiptDocumentRes = interception;
      });
  }

  emailIleGondermeServisKontrolu(state) {
    expect(sendMailCreateReceiptDocumentRes.success.toString()).to.equal(state);
  }

  tablodakiSatirlarinIceriklerininServisleKontrolu() {

    cy.wrap(lifePaymentRes.data.paymentInformationList).then((el) => {
      this.elements
        .odemeBilgileriTableBody()
        .find("tr")
        .should("have.length.at.least", el.length > 10 ? 10 : el.length)
        .its("length")
        .then((tableLength) => {
          const dataLength = el.length;

          for (let i = 0; i < tableLength; i++) {
            // `dataLength - 1 - i` ile son veri setinden başlayarak geriye doğru gideriz
            const dataIndex = dataLength - 1 - i;

            cy.wrap(el[dataIndex]).then((icerik) => {
              this.elements
                .odemeBilgileriTableBody()
                .find("tr")
                .eq(i) // Tablodaki 0'dan başlayarak i'nci satırı seçer
                .should("contain", icerik.maturityDate)
                .and("contain", icerik.paymentDate)
                .and("contain", icerik.paymentMethod)
                .and("contain", icerik.paymentCurrency)
                .and("contain", icerik.paymentAmount.amount)
                .and("contain", icerik.paymentInstrument);
            });
          }
        });
    });
  }

  hizliTarihAraligiSecimi(radioButton) {
    cy.intercept("GET", "**/lifePaymentHistory*").as("lifePaymentHistory");

    this.elements.hizliTarihRadioButton(radioButton).click();

    cy.wait("@lifePaymentHistory")
      .its("response.body")
      .then((interception) => {
        lifePaymentRes = interception;
      });
  }

  hizliTarihFiltreyeUygunDataYok() {
    cy.wrap(
      lifePaymentRes.data.paymentInformationList
    ).then((el) => {
      expect(el.length).to.equal(0);
      this.elements
        .uyariMesaj()
        .should(
          "have.text",
          "Sigorta Poliçesine ait ödeme bilgileri bulunamadı."
        );
    });
  }
}

export const odemeBilgileri = new OdemeBilgileriPage();
