import { basePage } from "./BasePage";

let lifeInsuranceAppendixActivitiesRes,
  prefixeGoreServisIsmiRes,
  lifeInsuranceAccountHistoryFileRes,
  sendLifeInsuranceAccountHistoryFileEmailRes;
let prefixeGoreServisIsmi =
  Cypress.config("custom").servis_adi.sigorta_gecmis_goruntule;

class SigortaGecmisiGoruntulePage {
  elements = {
    tumSayfaContent: () => cy.get("div[class='Content']"),
    selectedHizliTarihCheckbox: () => cy.get(".clearfix"),
    tarihAraligi: () => cy.get(".react-datepicker__input-container input"),
    tablo: () => cy.get(".details .proto-card"),
    yilDropdown: () => cy.get(".react-datepicker__year-select"),
    ayDropdown: () => cy.get(".react-datepicker__month-select"),
    gunDropdown: (day) =>
      cy.get(`.react-datepicker__day--0${day}[aria-disabled="false"]`),
    tabloSutun: () => cy.get(".Content .row .customTable thead"),
    tabloSatirlar: () => cy.get(".Content .row .customTable tbody tr"),
  };

  servisResponseAlarakSigortaGecmisiGoruntuleTikla(butonIsmi) {
    cy.intercept("GET", `**/${prefixeGoreServisIsmi}*`).as(
      `${prefixeGoreServisIsmi}`
    );
    cy.intercept("GET", "**/lifeInsuranceAppendixActivities*").as(
      "lifeInsuranceAppendixActivities"
    );

    basePage.yaziyaTikla(butonIsmi);

    cy.wait(`@${prefixeGoreServisIsmi}`)
      .its("response.body")
      .then((interception) => {
        prefixeGoreServisIsmiRes = interception;
        //cy.log("lifeInsuranceAccountHistoryRes: " + JSON.stringify(lifeInsuranceAccountHistoryRes));
      });

    cy.wait("@lifeInsuranceAppendixActivities")
      .its("response.body")
      .then((interception) => {
        lifeInsuranceAppendixActivitiesRes = interception;
        //cy.log("lifeInsuranceAppendixActivitiesRes: " + JSON.stringify(lifeInsuranceAppendixActivitiesRes));
      });
  }

  sabitTextleriSayfadaGoruntuleme(item) {
    this.elements
      .tumSayfaContent()
      .should("be.visible")
      .should("contain", item);
  }

  selectedHizliTarihSecimiKontrol(radioButton) {
    this.elements
      .selectedHizliTarihCheckbox()
      .within(() =>
        cy.get(`div:contains("${radioButton}")`).should("have.class", "checked")
      );
  }

  tarihAraliklarininKontrolu() {
    const resDate = lifeInsuranceAppendixActivitiesRes.data.dateRange;

    // Tarih aralıklarını ayırıyoruz
    const dates = resDate.split("-");

    // Birinci tarihi ters çeviriyoruz
    const ilkTarih = `${dates[5]}-${dates[4]}-${dates[3]}`;

    // İkinci tarihi ters çeviriyoruz
    const ikinciTarih = `${dates[2]}-${dates[1]}-${dates[0]}`;

    const tarihAraliklari = [
      ikinciTarih, // İlk tarih aralığı
      ilkTarih, // İkinci tarih aralığı
    ];

    tarihAraliklari.forEach((expectedDate, index) => {
      this.elements
        .tarihAraligi()
        .eq(index)
        .invoke("val")
        .then((value) => {
          expect(value).to.equal(expectedDate);
        });
    });
  }

  //Soldaki ve Sağdaki tabloların içeriklerini kontrol ediiyor
  verifyAllLabelValues(expectedValues, tabloNo) {
    this.elements
      .tablo()
      .eq(tabloNo)
      .find(".card-row-wrapper")
      .each(($rowWrapper) => {
        cy.wrap($rowWrapper).within(() => {
          // Label ve değeri birlikte alıyoruz
          cy.get("#label")
            .invoke("text")
            .then((labelText) => {
              const labelName = labelText.trim();

              // Eğer bu label için bir expectedValue varsa, onu assert ediyoruz
              if (expectedValues.hasOwnProperty(labelName)) {
                cy.get("#value")
                  .invoke("text")
                  .then((actualValue) => {
                    expect(actualValue.trim()).to.contains(
                      expectedValues[labelName]
                    ); // Beklenen değerle karşılaştırma
                  });
              } else {
                // Eğer expectedValues'da label bulunmazsa hata atıyoruz ve test durduruluyor
                throw new Error(
                  `Beklenen label bulunamadı, bulunamayan label: ${labelName}`
                );
              }
            });
        });
      });
  }

  soldakiTabloKontrol(tabloNo) {
    const expectedValues = {
      "Poliçe No": prefixeGoreServisIsmiRes.data.policyNo,
      "Sigorta Ettiren": prefixeGoreServisIsmiRes.data.insurer,
      "Ödeme Şekli": prefixeGoreServisIsmiRes.data.paymentType,
    };

    if (prefixeGoreServisIsmi === "lifeInsuranceAccountHistory") {
      expectedValues["Toplam Fon Adedi"] =
        prefixeGoreServisIsmiRes.data.totalFundCount;
      expectedValues["Toplam Fon Değeri"] =
        prefixeGoreServisIsmiRes.data.totalFundAmount.amount +
        " " +
        prefixeGoreServisIsmiRes.data.totalFundAmount.currency;
    } else if (prefixeGoreServisIsmi === "insuranceAccountHistory") {
      expectedValues["Poliçe Başlangıç Tarihi"] =
        prefixeGoreServisIsmiRes.data.policyStartDate;
      expectedValues["Sigortali"] = prefixeGoreServisIsmiRes.data.insured;
    }

    this.verifyAllLabelValues(expectedValues, tabloNo);
  }

  sagdakiTabloKontrol(tabloNo) {
    const expectedValues = {
      "Poliçe Başlangıç Tarihi":
        prefixeGoreServisIsmiRes.data.contractStartDate,
      Sigortalı: prefixeGoreServisIsmiRes.data.insured,
      "Para Birimi": prefixeGoreServisIsmiRes.data.totalPaymentAmount.currency,
      "Birim Fiyatı": prefixeGoreServisIsmiRes.data.unitPrice.amount,
      "Toplam Ödenen Tutar":
        prefixeGoreServisIsmiRes.data.totalPaymentAmount.amount +
        " " +
        prefixeGoreServisIsmiRes.data.totalPaymentAmount.currency,
    };
    this.verifyAllLabelValues(expectedValues, tabloNo);
  }

  tarihAraliklariSeciyorum(kacinciTarih, gun, ay, yil) {
    const eskiTarih = gun + "-" + ay + "-" + yil;

    // Hangi tarih alanının seçileceğini belirliyoruz
    const tarihSelector = kacinciTarih === 1 ? 0 : 1;
    this.elements.tarihAraligi().eq(tarihSelector).should("be.exist").click();

    // DatePicker input'unun mevcut value değerini alıyoruz
    this.elements
      .tarihAraligi()
      .eq(tarihSelector)
      .invoke("val")
      .then((currentTarih) => {
        cy.log("currentTarih: " + currentTarih);

        // Eğer tarihler aynı değilse intercept ve wait işlemleri yapılır
        if (currentTarih !== eskiTarih) {
          cy.intercept("GET", `**/${prefixeGoreServisIsmi}*`).as(
            `${prefixeGoreServisIsmi}`
          );
          cy.intercept("GET", "**/lifeInsuranceAppendixActivities*").as(
            "lifeInsuranceAppendixActivities"
          );

          basePage.selectDate(gun, ay, yil);

          cy.wait(`@${prefixeGoreServisIsmi}`)
            .its("response.body")
            .then((interception) => {
              prefixeGoreServisIsmiRes = interception;
            });

          cy.wait("@lifeInsuranceAppendixActivities")
            .its("response.body")
            .then((interception) => {
              lifeInsuranceAppendixActivitiesRes = interception;
            });
        } else {
          this.elements.tarihAraligi().eq(tarihSelector).type("{enter}");
          cy.log("Tarihler aynı, intercept ve wait yapılmadı.");
        }
      });
  }

  sigortaGecmisiTabloSutunIsimleriniDogrulama(item) {
    this.elements
      .tabloSutun()
      .within(() => cy.get("th").should("contain", item));
  }

  hesapHareketleriTabloIceriklerininServisleUyumu() {
    cy.wrap(prefixeGoreServisIsmiRes.data.lifeInsuranceAccountHistoryList).then(
      (el) => {
        this.elements
          .tabloSatirlar()
          .should("have.length.at.least", el.length > 5 ? 5 : el.length)
          .its("length")
          .then((tableLength) => {
            for (let i = 0; i < tableLength; i++) {
              cy.wrap(el[i]).then((icerik) => {
                this.elements
                  .tabloSatirlar()
                  .eq(i) // Tablodaki 0'dan başlayarak i'nci satırı seçer
                  .should(
                    "contain",
                    icerik.operationDate ? icerik.operationDate : ""
                  )
                  .and(
                    "contain",
                    icerik.operationType ? icerik.operationType : ""
                  )
                  .and("contain", icerik.unitDate ? icerik.unitDate : "")
                  .and("contain", icerik.unitCount ? icerik.unitCount : "")
                  .and(
                    "contain",
                    icerik.unitPrice.amount ? icerik.unitPrice.amount : ""
                  )
                  .and(
                    "contain",
                    icerik.operationAmount.amount
                      ? icerik.operationAmount.amount
                      : ""
                  );
              });
            }
          });
      }
    );
  }

  islemlerTabloIceriklerininServisleUyumu() {
    cy.wrap(
      lifeInsuranceAppendixActivitiesRes.data.lifeInsuranceAppendixActivities
    ).then((el) => {
      this.elements
        .tabloSatirlar()
        .should("have.length.at.least", el.length > 5 ? 5 : el.length)
        .its("length")
        .then((tableLength) => {
          for (let i = 0; i < tableLength; i++) {
            cy.wrap(el[i]).then((icerik) => {
              this.elements
                .tabloSatirlar()
                .eq(i) // Tablodaki 0'dan başlayarak i'nci satırı seçer
                .should("contain", icerik.policyAppendixOrderNo)
                .and("contain", icerik.policyAppendixDescription)
                .and("contain", icerik.issuedDate)
                .and("contain", icerik.completionDate)
                .and("contain", icerik.channelInfo);
            });
          }
        });
    });
  }

  hizliTarihAraligiSecimi(radioButton) {
    cy.intercept("GET", "**/lifeInsuranceAppendixActivities*").as(
      "lifeInsuranceAppendixActivities"
    );

    basePage.radioButtonClick(radioButton);

    cy.wait("@lifeInsuranceAppendixActivities")
      .its("response.body")
      .then((interception) => {
        lifeInsuranceAppendixActivitiesRes = interception;
      });
  }

  acilanPdfVeIlgiliServisUyumu() {
    cy.wrap(prefixeGoreServisIsmiRes.data).then((el) => {
      basePage.elements
        .pdfIcerik()
        .should("contain", el.policyNo)
        .and("contain", el.insurer)
        .and("contain", el.insured)
        .and("contain", el.paymentType)
        .and("contain", el.totalFundCount)
        .and("contain", el.totalFundAmount.amountBase)
        .and("contain", el.contractStartDate.toString().replaceAll("-", "/"))
        .and("contain", el.unitPrice.amount)
        .and("contain", el.totalPaymentAmount.amount);
    });
  }

  hesapHareketleriDokumaniGondermeBilgilendirmeMetni() {
    const announcementListRes = lifeInsuranceAccountHistoryFileRes.data.announcementList.announceModels;

    basePage.elements
      .popupBody()
      .find(".content")
      .invoke("text")
      .then((text) => {
        // Announcement listesi içindeki mesajlarla karşılaştırma
        const messages = announcementListRes.map((model) => model.message);

        // valueText, messages içindeki herhangi bir mesajla eşleşmiyorsa test hata verir
        expect(messages).to.include(text);
      });
  }

  emailAdresineYollaButonunaTikla(butonIsmi) {
    cy.intercept("GET", "**/lifeInsuranceAccountHistoryFile*").as(
      "lifeInsuranceAccountHistoryFile"
    );

    basePage.butonTikla(butonIsmi);

    cy.wait("@lifeInsuranceAccountHistoryFile")
      .its("response.body")
      .then((interception) => {
        lifeInsuranceAccountHistoryFileRes = interception;
      });
  }

  dokumaniGonderButonunaTikla(butonIsmi) {
    cy.intercept("POST", "**/sendLifeInsuranceAccountHistoryFileEmail").as(
      "sendLifeInsuranceAccountHistoryFileEmail"
    );

    basePage.butonTikla(butonIsmi);

    cy.wait("@sendLifeInsuranceAccountHistoryFileEmail")
      .its("response.body")
      .then((interception) => {
        sendLifeInsuranceAccountHistoryFileEmailRes = interception;
      });
  }

  hesapHareketleriDokumaniBasariIleGondermeBilgilendirmeMetni(){
    const announcementListRes = sendLifeInsuranceAccountHistoryFileEmailRes.data.announcementList.announceModels;

    basePage.elements
      .popupBody()
      .find(".content")
      .invoke("text")
      .then((text) => {
        // Announcement listesi içindeki mesajlarla karşılaştırma
        const messages = announcementListRes.map((model) => model.message);

        // valueText, messages içindeki herhangi bir mesajla eşleşmiyorsa test hata verir
        expect(messages).to.include(text);
      });
  }

  emailGondermeServisKontrolu(state){
    expect(sendLifeInsuranceAccountHistoryFileEmailRes.success.toString()).to.equal(state);
  }
}

export const sigortaGecmisiGoruntule = new SigortaGecmisiGoruntulePage();
