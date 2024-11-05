import { basePage } from "./BasePage";

let lifeInsuranceSummaryDetailRes,
  checkLifePolicyTaxDiscountRes,
  lifePolicyPaymentMethodRes,
  financialAdvisorInfoRes,
  lifeInsuranceSummaryRes,
  customerPremiumAmountInformationRes;
let renewalCode;

class SigortaDetayGirisPage {
  elements = {
    seciliUrunAdi: () => cy.get(".row .header"),
    policeNo: () => cy.get(".row.pL5 .underline"),
    policeSuresi: () => cy.get(".table tr td:nth-child(2)"),
    policeBaslangicYenilemeTarihi: (tarih) =>
      cy.get(`.d-flex.flex-column:contains("${tarih}") .upside-span.mT10`),
    policeBitisTarihi: () => cy.get(".table tr td:nth-child(4)"),
    policeDuzenliOdeme: () => cy.get(".table tr td:nth-child(5)"),
    primTutarlari: (label) => cy.get(`.insurance-summary:contains("${label}")`),
    vergiIndirimiInfoIcon: () => cy.get(".pR5"),
    tanimliOdemeYontemiKarti: () =>
      cy.get(".assurance-and-assurance:contains('Tanımlı Ödeme Yöntemi')"),
    kartSecimi: (kartTipi) =>
      cy.get(`.proto-card-container-text:contains("${kartTipi}")`),
    finansalDanismanKartiIcerik: (item) =>
      cy.get(`.proto-card-body .row .content-item:contains("${item}")`),
    finansalDanismanKartiOkIsareti: () => cy.get(".proto-card-body .row .mT10"),
    finansalDanismanKartiOkAltindakiIcerik: () =>
      cy.get(`.proto-card-body .row .mL5:contains("Finansal Danışmanınız")`),
    ekFaydaCloseIcon: () =>
      cy.get(".proto-table-header_content--badge i.icon-close"),
    degistirButonu: () => cy.get(".mR10 button"),
    donemselBirikimPrimButonInfoIcon: () =>
      cy.get(".mT10 .icon-exclamation-circle "),
  };

  policeNoSecipServisResponseKaydet() {
    cy.wait(`@lifeInsuranceSummary`)
      .its("response.body")
      .then((interception) => {
        lifeInsuranceSummaryRes = interception;
        renewalCode =
          lifeInsuranceSummaryRes.data.insuranceSummaryList[0]
            .salesInsuranceInfoList[0].renewalCode;
      });

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

    cy.intercept("GET", "**/customerPremiumAmountInformation*").as(
      "customerPremiumAmountInformation"
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

    cy.wait("@customerPremiumAmountInformation")
      .its("response.body")
      .then((interception) => {
        customerPremiumAmountInformationRes = interception;
      });
  }

  secilenUrunAdiDetaySayfasindaGorunmeKontrolu() {
    this.elements
      .seciliUrunAdi()
      .should("contain", Cypress.config("custom").urun_adi);
  }

  policeTablosuPoliceNoKontrolu() {
    cy.wrap(lifeInsuranceSummaryDetailRes.data).then((el) => {
      // Tek basamaklıysa başına 0 ekle, iki basamaklıysa olduğu gibi bırak
      const formattedRenewalCode =
        renewalCode < 10 ? `0${renewalCode}` : renewalCode;

      // Police numarasını oluştur
      const policeNumarasi =
        el.policyPrefix + "-" + el.policyNo + "-" + formattedRenewalCode;

      // UI'da police numarasının kontrolünü yap
      this.elements.policeNo().should("contain", policeNumarasi);
    });
  }

  policeTablosuPoliceSuresiKontrolu() {
    cy.wrap(lifeInsuranceSummaryDetailRes.data).then((el) => {
      this.elements.policeSuresi().should("contain", el.policyDuration);
    });
  }

  policeTablosuBaslangicTarihiKontrolu() {
    if (lifeInsuranceSummaryDetailRes.data.policyStartDate) {
      this.elements
        .policeBaslangicYenilemeTarihi("Başlangıç Tarihi")
        .should("contain", lifeInsuranceSummaryDetailRes.data.policyStartDate);
    } else {
      this.elements
        .policeBaslangicYenilemeTarihi("Başlangıç Tarihi")
        .invoke("text")
        .then((text) => {
          expect(text).to.equal("-");
        });
    }
  }

  policeTablosuYenilemeTarihiKontrolu() {
    if (lifeInsuranceSummaryDetailRes.data.isRenewable) {
      this.elements
        .policeBaslangicYenilemeTarihi("Yenileme Tarihi")
        .should("contain", lifeInsuranceSummaryDetailRes.data.isRenewable);
    } else {
      this.elements
        .policeBaslangicYenilemeTarihi("Yenileme Tarihi")
        .invoke("text")
        .then((text) => {
          expect(text).to.equal("-");
        });
    }
  }

  policeTablosuPoliceBitisTarihiKontrolu() {
    cy.wrap(lifeInsuranceSummaryDetailRes.data).then((el) => {
      this.elements.policeBitisTarihi().should("contain", el.policyEndDate);
    });
  }

  policeTablosuBHSolmayanUrunPoliceDuzenliOdemeKontrolu() {
    cy.wrap(lifeInsuranceSummaryDetailRes.data).then((el) => {
      this.elements
        .policeDuzenliOdeme()
        .should("contain", el.termlyPaymentAmount.amount)
        .and("contain", el.termlyPaymentAmount.currency)
        .and("contain", el.policyTerm)
        .and("contain", `Ödeme Günü ${el.policyPaymentDay}. Gün`);
    });
  }

  policeTablosuBHSolanUrunPoliceDuzenliOdemeKontrolu() {
    cy.wrap(lifeInsuranceSummaryDetailRes.data).then((el) => {
      this.elements
        .policeDuzenliOdeme()
        .should("contain", `Ödeme Günü ${el.policyPaymentDay}. Gün`)
        .and(
          "contain",
          `Dönemsel Toplam Prim Tutarı ${el.termlyPaymentAmount.amount} ${el.termlyPaymentAmount.currency} / ${el.policyTerm}`
        )
        .and(
          "contain",
          `Dönemsel Birikim Primi Tutarı ${el.termlySavingPremiumAmount.amount} ${el.termlySavingPremiumAmount.currency}`
        )
        .and(
          "contain",
          `Dönemsel Vefat Primi Tutarı ${el.termlyDeceasePremiumAmount.amount} ${el.termlyDeceasePremiumAmount.currency}`
        );
    });
  }

  toplamOdenenPrimMiktarKontrolu() {
    this.elements
      .primTutarlari("Toplam Ödenen Prim")
      .find(".insurance-summary-text-right")
      .invoke("text")
      .then((text) => {
        const kalanPrimMiktarı = text.trim();
        expect(kalanPrimMiktarı).to.contains(
          lifeInsuranceSummaryDetailRes.data.totalPremiumAmount.amount
        );
        expect(kalanPrimMiktarı).to.contains(
          lifeInsuranceSummaryDetailRes.data.totalPremiumAmount.currency
        );
      });
  }

  kalanPrimBorcuKontrolu() {
    this.elements
      .primTutarlari("Kalan Prim Borcu")
      .find(".insurance-summary-text-right")
      .invoke("text")
      .then((kalanPrimBorcu) => {
        let integerSumPremiumAmount = parseInt(
          lifeInsuranceSummaryDetailRes.data.sumPremiumAmount.amount,
          10
        );

        if (
          lifeInsuranceSummaryDetailRes.data.policyPrefix == "B" &&
          integerSumPremiumAmount !== 0
        ) {
          expect(kalanPrimBorcu.trim()).to.equal("-");
        } else {
          expect(kalanPrimBorcu).to.contains(
            lifeInsuranceSummaryDetailRes.data.sumPremiumAmount.amount
          );
          expect(kalanPrimBorcu).to.contains(
            lifeInsuranceSummaryDetailRes.data.sumPremiumAmount.currency
          );
        }
      });
  }

  vergiIndirimiKontrolu() {
    let discountAmount, discountCurrency;

    this.elements
      .primTutarlari("Vergi İndirimi")
      .find(".insurance-summary-text-right")
      .invoke("text")
      .then((vergiIndirimi) => {
        if (checkLifePolicyTaxDiscountRes.data.discountAmount) {
          discountAmount =
            checkLifePolicyTaxDiscountRes.data.discountAmount.amount;
          discountCurrency =
            checkLifePolicyTaxDiscountRes.data.discountAmount.currency;

          expect(vergiIndirimi).to.contains(discountAmount);
          expect(vergiIndirimi).to.contains(discountCurrency);
        } else {
          expect(vergiIndirimi).to.contains("- TL");
        }
      });
  }

  vergiIndirimiIconMesajKontrolu() {
    this.elements.vergiIndirimiInfoIcon().trigger("mouseover");

    cy.get(".proto-tooltip-body")
      .invoke("text")
      .then((text) => {
        // Announcement listesi içindeki mesajlarla karşılaştırma
        const messages =
          checkLifePolicyTaxDiscountRes.data.announcementList.announceModels.map(
            (model) => model.message
          );

        // valueText, messages içindeki herhangi bir mesajla eşleşmiyorsa test hata verir
        expect(messages).to.include(text);
      });
  }

  degistirButonKontrol(kontrolTipi) {
    this.elements.tanimliOdemeYontemiKarti().within(() => {
      if (kontrolTipi === "aktif") {
        this.elements.degistirButonu().should("be.enabled");
      } else if (kontrolTipi === "pasif") {
        this.elements.degistirButonu().should("be.disabled");
      } else if (kontrolTipi === "exist") {
        this.elements.degistirButonu().should("exist");
      }
    });
  }

  tanimliOdemeKartiKontrolu(action) {
    if (action === "görmeliyim") {
      this.elements.tanimliOdemeYontemiKarti().should("be.exist");

      //3 çeşit paymentType var. Ona göre diğer datalar kontrol ediliyor
      const paymentType = lifePolicyPaymentMethodRes.data.paymentType;

      if (paymentType === "HESAP NUMARASI") {
        this.elements
          .tanimliOdemeYontemiKarti()
          .invoke("text")
          .then((text) => {
            expect(text).to.contains(
              lifePolicyPaymentMethodRes.data.accountNumber
            );
            expect(text).to.contains(
              `BANKA HESABI (${lifePolicyPaymentMethodRes.data.bankName})`
            );
            expect(text).to.contains("Hesap No");
          });
      } else if (paymentType === "IBAN") {
        this.elements
          .tanimliOdemeYontemiKarti()
          .invoke("text")
          .then((text) => {
            expect(text).to.contains(lifePolicyPaymentMethodRes.data.ibanNo);
            expect(text).to.contains(
              `BANKA HESABI (${lifePolicyPaymentMethodRes.data.bankName})`
            );
            expect(text).to.contains(
              lifePolicyPaymentMethodRes.data.paymentType
            );
          });
      } else if (paymentType === "KREDİ KARTI") {
        this.elements
          .tanimliOdemeYontemiKarti()
          .invoke("text")
          .then((text) => {
            // Ayı iki basamaklı hale getirme yani 6 ise 06 yapıyoruz
            const month = lifePolicyPaymentMethodRes.data.expireMonth;
            let formattedMonth = month < 10 ? "0" + month : month.toString();

            // Yılın son iki rakamını alma yani 2023 ise 23 alıyoruz
            const year = lifePolicyPaymentMethodRes.data.expireYear;
            let formattedYear = year % 100;
            formattedYear =
              formattedYear < 10 ? "0" + formattedYear : formattedYear;

            expect(text).to.contains(
              lifePolicyPaymentMethodRes.data.creditCardNo
            );
            const bankName = lifePolicyPaymentMethodRes.data.bankName || '-'; // Eğer bankName boşsa '-' kullan
            expect(text).to.contains(`KREDİ KARTI (${bankName})`);

            expect(text).to.contains(`${formattedMonth}/${formattedYear}`);
          });
      } else if (paymentType === "NAKIT") {
        this.elements
          .tanimliOdemeYontemiKarti()
          .invoke("text")
          .then((text) => {
            expect(text).to.contains("NAKIT");
          });
      }
    } else {
      this.elements.tanimliOdemeYontemiKarti().should("be.not.exist");
    }
  }

  musteriRoluKartKontrolu(item) {
    this.elements.kartSecimi(item).then(($element) => {
      const cardText = $element.text();

      // Eğer "SİGORTALI / SİGORTA ETTİREN" metni bulunmuyorsa sigorta ettiren bilgilerini kontrol et
      if (!cardText.includes("SİGORTALI / SİGORTA ETTİREN")) {
        const insurerName =
          lifeInsuranceSummaryDetailRes.data.insurerCustomerName || "";
        const insurerNumber =
          lifeInsuranceSummaryDetailRes.data.insurerCustomerNumber || "";
        const insurerMobile =
          lifeInsuranceSummaryDetailRes.data.insurerMobilNumber || "";
        const insurerEmail =
          lifeInsuranceSummaryDetailRes.data.insurerEmail || "";

        expect(cardText).to.contain(insurerName);
        expect(cardText).to.contain(insurerNumber);
        expect(cardText).to.contain(insurerMobile);
        expect(cardText).to.contain(insurerEmail);
      }

      // Sigortalı bilgilerini kontrol et
      const insuredName =
        lifeInsuranceSummaryDetailRes.data.insuredCustomerName || "";
      const insuredNumber =
        lifeInsuranceSummaryDetailRes.data.insuredCustomerNumber || "";
      const insuredMobile =
        lifeInsuranceSummaryDetailRes.data.insuredMobilNumber || "";
      const insuredEmail =
        lifeInsuranceSummaryDetailRes.data.insuredEmail || "";

      expect(cardText).to.contain(insuredName);
      expect(cardText).to.contain(insuredNumber);
      expect(cardText).to.contain(insuredMobile);
      expect(cardText).to.contain(insuredEmail);
    });
  }

  musterRoluKartiSabitTextKontrolu(item) {
    this.elements.kartSecimi("Müşteri Rolü").then(($element) => {
      const text = $element.text();

      const regex = new RegExp(item, "g");
      const kacTaneItem = text.match(regex);

      if (text.includes("SİGORTALI / SİGORTA ETTİREN")) {
        cy.wrap(kacTaneItem).should("have.length", 1);
      } else {
        cy.wrap(kacTaneItem).should("have.length", 2);
      }
    });
  }

  lehtarBilgisiKartKontrolu(item) {
    const count = lifeInsuranceSummaryDetailRes.data.beneficiaryInfo.length;
    let name1, rate1, birthDate1, name0, rate0, birthDate0;

    if (count > 1) {
      name1 =
        lifeInsuranceSummaryDetailRes.data.beneficiaryInfo[1]
          .beneficiaryNameInfo || "";
      rate1 =
        lifeInsuranceSummaryDetailRes.data.beneficiaryInfo[1].beneficiaryRate ||
        "";
      birthDate1 =
        lifeInsuranceSummaryDetailRes.data.beneficiaryInfo[1]
          .beneficiaryBirthDate || "";
    }

    name0 =
      lifeInsuranceSummaryDetailRes.data.beneficiaryInfo[0]
        .beneficiaryNameInfo || "";
    rate0 =
      lifeInsuranceSummaryDetailRes.data.beneficiaryInfo[0].beneficiaryRate ||
      "";
    birthDate0 =
      lifeInsuranceSummaryDetailRes.data.beneficiaryInfo[0]
        .beneficiaryBirthDate || "";

    this.elements
      .kartSecimi(item)
      .invoke("text")
      .then((text) => {
        if (count > 1) {
          if (rate0 === rate1) {
            const regex = new RegExp(rate0, "g");
            const kacTaneOran = text.match(regex);
            cy.wrap(kacTaneOran).should("have.length", 2);
          }
          expect(text).to.contain(name1);
          expect(text).to.contain(rate1);
          expect(text).to.contain(birthDate1);
        }

        expect(text).to.contain(name0);
        expect(text).to.contain(rate0);
        expect(text).to.contain(birthDate0);
      });
  }

  lehtarBilgisiKartiSabitTextKontrolu(item) {
    this.elements.kartSecimi("Lehtar Bilgisi").then(($element) => {
      const text = $element.text();
      const count = lifeInsuranceSummaryDetailRes.data.beneficiaryInfo.length;

      //Eger lehtar bilgisinde 2 adet data olursa o zaman kartın ortasından geçen 3 adet tire olmalı
      if (count > 1) {
        const tireSayısı = $element.find(".text-nowrap").text();
        const regex = new RegExp("-", "g");
        const kacTaneItem = tireSayısı.match(regex);
        cy.wrap(kacTaneItem).should("have.length", 3);
      }

      expect(text).to.contain(item);
    });
  }

  lehtarBilgisiInfoIconMesajKontrolu(item) {
    // Her bir icon-info-circle elemanını sırayla işlemek için each kullanıyoruz
    this.elements
      .kartSecimi(item)
      .find(".icon-info-circle")
      .each(($icon, index) => {
        // Her bir icon üzerinde mouseover tetikleniyor
        cy.wrap($icon).trigger("mouseover");

        // İki tane info icon olursa Sırasıyla iconun üzerine hover ediliyor
        this.elements
          .kartSecimi(item)
          .find(".proto-tooltip-body")
          .eq(index) // Hangi info iconun üzerine bakmamız gerektiğini belirtir
          .then(($tooltip) => {
            let valueText = $tooltip.text();

            const email =
              "E-Posta: " +
              lifeInsuranceSummaryDetailRes.data.beneficiaryInfo[index]
                .beneficiaryEmail;
            const telefon =
              "Telefon: " +
              lifeInsuranceSummaryDetailRes.data.beneficiaryInfo[index]
                .beneficiaryMobileNumber;

            expect(valueText).to.contains(email);
            expect(valueText).to.contains(telefon);
          });
      });
  }

  sabitTextleriFinansalDanismaKartindaGoruntuleme(item) {
    this.elements
      .kartSecimi("Finansal Danışman Bilgileri")
      .should("be.visible")
      .should("contain", item);
  }

  satanFinansalDanismanKontrolu() {
    const satisKanali = financialAdvisorInfoRes.data.salesChannel;
    const satanKisi =
      financialAdvisorInfoRes.data.sellerRecordId +
      " / " +
      financialAdvisorInfoRes.data.seller;

    this.elements
      .finansalDanismanKartiIcerik("SATIŞ KANALI")
      .should("be.visible")
      .should("contain", satisKanali);

    this.elements
      .finansalDanismanKartiIcerik("SATAN KİŞİ")
      .should("be.visible")
      .should("contain", satanKisi);
  }

  sorumluFinansalDanismanKontrolu() {
    const sorumluKanali = financialAdvisorInfoRes.data.responsibleChannel;
    const sorumluKisi =
      financialAdvisorInfoRes.data.responsibleRecordId +
      " / " +
      financialAdvisorInfoRes.data.responsible;

    this.elements
      .finansalDanismanKartiIcerik("SORUMLU KANALI")
      .should("be.visible")
      .should("contain", sorumluKanali);

    this.elements
      .finansalDanismanKartiIcerik("SORUMLU KİŞİ")
      .should("be.visible")
      .should("contain", sorumluKisi);
  }

  finansalDanismanKartiInfoIconKontrolu(item) {
    // Her bir icon-info-circle elemanını sırayla işlemek için each kullanıyoruz
    this.elements
      .kartSecimi(item)
      .find(".icon-info-circle")
      .each(($icon, index) => {
        // Her bir icon üzerinde mouseover tetikleniyor
        cy.wrap($icon).trigger("mouseover");

        // İki tane info icon olursa Sırasıyla iconun üzerine hover ediliyor
        this.elements
          .kartSecimi(item)
          .find(".proto-tooltip-body")
          .eq(index) // Hangi info iconun üzerine bakmamız gerektiğini belirtir
          .then(($tooltip) => {
            let valueText = $tooltip.text(); //UI dan gelen text

            if (valueText.includes("Satan statüsü")) {
              cy.log(
                "financialAdvisorInfoRes.data.sellerStatus " +
                  financialAdvisorInfoRes.data.sellerStatus
              );
              const satanStatus =
                "Satan statüsü: " +
                  financialAdvisorInfoRes.data.sellerStatus ===
                1
                  ? "Pasif"
                  : "Aktif";
              cy.log("satanStatus :" + satanStatus);
              let dogumTarihi =
                "Doğum tarihi: " + financialAdvisorInfoRes.data.sellerBirthDate;
              let kimlikNo =
                "Kimlik numarası: " +
                financialAdvisorInfoRes.data.sellerIdentityNumber;

              expect(valueText).to.contains(satanStatus);
              expect(valueText).to.contains(dogumTarihi);
              expect(valueText).to.contains(kimlikNo);
            } else {
              let dogumTarihi =
                "Doğum tarihi: " +
                financialAdvisorInfoRes.data.responsibleBirthDate;
              let kimlikNo =
                "Kimlik numarası: " +
                financialAdvisorInfoRes.data.responsibleIdentityNumber;

              expect(valueText).to.contains(dogumTarihi);
              expect(valueText).to.contains(kimlikNo);
            }
          });
      });
  }

  satanFinansalDanismanDetayOkAltindakiDataKontrolu() {
    this.elements.finansalDanismanKartiOkIsareti().eq(0).click();

    this.elements
      .finansalDanismanKartiOkAltindakiIcerik()
      .invoke("text")
      .then((text) => {
        const seller = financialAdvisorInfoRes.data.seller;
        const sellerGsmNumber = financialAdvisorInfoRes.data.sellerGsmNumber;
        const sellerEmail = financialAdvisorInfoRes.data.sellerEmail;
        const sellerRegionName = financialAdvisorInfoRes.data.sellerRegionName;

        expect(text).to.contain(seller);
        expect(text).to.contain(sellerGsmNumber);
        expect(text).to.contain(sellerEmail);
        expect(text).to.contain(sellerRegionName);

        this.elements.finansalDanismanKartiOkIsareti().eq(0).click();
      });
  }

  sorumluFinansalDanismanDetayOkAltindakiDataKontrolu() {
    this.elements.finansalDanismanKartiOkIsareti().eq(1).click();

    this.elements
      .finansalDanismanKartiOkAltindakiIcerik()
      .invoke("text")
      .then((text) => {
        const responsible = financialAdvisorInfoRes.data.responsible;
        const responsibleGsmNumber =
          financialAdvisorInfoRes.data.responsibleGsmNumber;
        const responsibleEmail = financialAdvisorInfoRes.data.responsibleEmail;
        const responsibleRegionName =
          financialAdvisorInfoRes.data.responsibleRegionName;

        expect(text).to.contain(responsible);
        expect(text).to.contain(responsibleGsmNumber);
        expect(text).to.contain(responsibleEmail);
        expect(text).to.contain(responsibleRegionName);

        this.elements.finansalDanismanKartiOkIsareti().eq(1).click();
      });
  }

  finansalDanismanDetayButonKontrolu(butonIsmi) {
    this.elements.kartSecimi("Finansal Danışman Bilgileri").within(() => {
      basePage.butonAktif(butonIsmi);
    });
  }

  birikimDetaylariKontrolu(kartIsmi) {
    const labels = [
      "Toplam Ödenen Prim",
      "Toplam Birikim Primi Kesintisi",
      "Birikim Primi Kesintisi İadesi",
      "Toplam Yatırıma Yönlendirilen",
      "Yatırıma Yönlendirilmeyi Bekleyen",
      "Toplam Getiri",
      "Toplam Birikim",
      "Ayrılma Durumunda Alınacak",
    ];

    const birikimRes = lifeInsuranceSummaryDetailRes.data;

    const toplamOdenenPrim =
      birikimRes.totalPremiumAmount.amount +
      " " +
      birikimRes.totalPremiumAmount.currency;

    const toplamBirikimPrimiKesintisi =
      birikimRes.lifeTotalSavingsPremiumStoppage.amount +
      " " +
      birikimRes.lifeTotalSavingsPremiumStoppage.currency;

    const birikimPrimiKesintisiIadesi =
      birikimRes.lifeSavingsPremiumStoppageReturn.amount +
      " " +
      birikimRes.lifeSavingsPremiumStoppageReturn.currency;

    const toplamYatirimaYonlendirilen =
      birikimRes.lifeTotalDirectedToInvestmentAmount.amount +
      " " +
      birikimRes.lifeTotalDirectedToInvestmentAmount.currency;

    const yatirimaYonlendirilmeyiBekleyen =
      birikimRes.lifeWaitingToBeInvestedAmount.amount +
      " " +
      birikimRes.lifeWaitingToBeInvestedAmount.currency;

    const toplamGetiri =
      birikimRes.lifeTotalReturn.amount +
      " " +
      birikimRes.lifeTotalReturn.currency;

    const toplamBirikim =
      birikimRes.lifeTotalFundPremiumAmount.amount +
      " " +
      birikimRes.lifeTotalFundPremiumAmount.currency;

    const ayrılmaDurumundaAlinacak =
      birikimRes.lifeLeaveContractPortfolio.amount +
      " " +
      birikimRes.lifeLeaveContractPortfolio.currency;

    this.elements.kartSecimi(kartIsmi).within(() => {
      // Tüm label ve value'ları içeren elementleri seç
      cy.get('div[id="label"]').each((labelElement, index) => {
        // Label text'ini al
        const labelText = labelElement.text().trim();

        // Label text'i array'deki bir elemana eşit mi kontrol et
        if (labels.includes(labelText)) {
          // Label ile aynı index'teki value elementini al
          cy.get('div[id="value"]')
            .eq(index)
            .then((valueElement) => {
              const valueText = valueElement.text().trim();

              // Burada servisten gelen degeri assert et
              if (labelText === "Toplam Ödenen Prim") {
                expect(valueText).to.contain(toplamOdenenPrim);
              } else if (labelText === "Toplam Birikim Primi Kesintisi") {
                expect(valueText).to.contain(toplamBirikimPrimiKesintisi);
              } else if (labelText === "Birikim Primi Kesintisi İadesi") {
                expect(valueText).to.contain(birikimPrimiKesintisiIadesi);
              } else if (labelText === "Toplam Yatırıma Yönlendirilen") {
                expect(valueText).to.contain(toplamYatirimaYonlendirilen);
              } else if (labelText === "Yatırıma Yönlendirilmeyi Bekleyen") {
                expect(valueText).to.contain(yatirimaYonlendirilmeyiBekleyen);
              } else if (labelText === "Toplam Getiri") {
                expect(valueText).to.contain(toplamGetiri);
              } else if (labelText === "Toplam Birikim") {
                expect(valueText).to.contain(toplamBirikim);
              } else if (labelText === "Ayrılma Durumunda Alınacak") {
                expect(valueText).to.contain(ayrılmaDurumundaAlinacak);
              } else {
                throw new Error(
                  `Beklenen text bulunamadı, bulunamayan text: ${labelText}`
                );
              }
            });
        }
      });
    });
  }

  birikimDetaylariInfoIconMesajKontrolu(item) {
    const announcementListRes =
      lifeInsuranceSummaryDetailRes.data.announcementList.announceModels;
    // Her bir icon-info-circle elemanını sırayla işlemek için each kullanıyoruz
    this.elements
      .kartSecimi(item)
      .find(".icon-info-circle")
      .each(($icon, index) => {
        // Her bir icon üzerinde mouseover tetikleniyor
        cy.wrap($icon).trigger("mouseover", { force: true });

        // İki tane info icon olursa Sırasıyla iconun üzerine hover ediliyor
        this.elements
          .kartSecimi(item)
          .find(".proto-tooltip-body")
          .eq(index) // Hangi info iconun üzerine bakmamız gerektiğini belirtir
          .then(($tooltip) => {
            let valueText = $tooltip.text();

            // Announcement listesi içindeki mesajlarla karşılaştırma
            const messages = announcementListRes.map((model) => model.message);

            // valueText, messages içindeki herhangi bir mesajla eşleşmiyorsa test hata verir
            expect(messages).to.include(valueText);
          });
      });
  }

  donemselPrimDegisikligiInfoIconMsjKontrol() {
    this.elements.donemselBirikimPrimButonInfoIcon().trigger("mouseover");

    cy.get(".proto-tooltip-body")
      .invoke("text")
      .then((text) => {
        // Announcement listesi içindeki mesajlarla karşılaştırma
        const announcementListRes =
          lifeInsuranceSummaryRes.data.announcementList.announceModels.concat(
            customerPremiumAmountInformationRes.data.announcementList
              .announceModels
          );

        // Metni "." (nokta) ile bölelim. Bu şekilde her cümleyi ayırıyoruz.
        const sentences = text
          .split(".")
          .map((sentence) => sentence.trim() + ".")
          .filter((sentence) => sentence !== ".");

        // Servisten dönen mesajları al ve trim yap
        const serviceMessages = announcementListRes.map((model) =>
          model.message.trim()
        );

        // Her bir cümleyi döngü ile kontrol et ve servisten dönen mesajlarla assert et
        sentences.forEach((sentence) => {
          expect(serviceMessages).to.include(sentence);
        });
      })
      .then(() => {
        // Hover işlemini iptal etmek için mouseout tetikleyelim
        this.elements.donemselBirikimPrimButonInfoIcon().trigger("mouseout");
      });
  }
}

export const sigortaDetayGiris = new SigortaDetayGirisPage();
