import { basePage } from "./BasePage";
import { sigortaDetayGiris } from "./SigortaDetayGirisPage";

let lifeInsuranceSummaryDetailRes,
  checkLifePaymentChangeAvailabilityRes,
  lifePolicyPaymentMethodRes,
  customerPaymentMethodsRes,
  bankInfoRes,
  lifeChangePaymentMethodRes,
  createflowRes,
  notifyPaymentChangeDocumentsRes,
  demandComplaintSubjectIdRes;
let odemeYontemiBilgileriUI,
  krediKartiSon4,
  bankaHesabiSon2,
  tanimlanacakHesapSon4Hane,
  yeniSecilenOdemeYontemiBilgisi,
  mevcutPoliceNo,
  randomPoliceNo;

class OdemeSekliDegisikligiPage {
  elements = {
    maviRenkleIsaretlenmisKart: () =>
      cy.get(".payment-type-container div.border-primary"),
    bilgilendirmeMetni: () => cy.get(".script-container .content"),
    odemeTutarTablo: () => cy.get(".payment-change-contract-info"),
    radioButton: (item) =>
      cy.get(`.proto-radio-mark .proto-label:contains("${item}")`),
    tanimliOdemeYontemindekiOdemeKartlari: () =>
      cy.get(".payment-type-container.w-100.d-flex.flex-wrap .m5"),
    kayitOlusturmaBilgilendirmeMetni: () =>
      cy.get(".script-container.script-w3"),
    kendiVeyaBaskaKartHesapSecim: (item) =>
      cy.get(`.w-100 .clearfix div.proto-radio-container:contains("${item}")`),
    kendiVeyaBaskaKartHesapSecimBilgilendirmeMetni: () =>
      cy.get(".mB10.send-card-container .announcement-content"),
    formuGonderVeyaIptalButon: (butonIsmi) =>
      cy.get(`.mB10 .script-button-container button:contains("${butonIsmi}")`),
    tanimlanacakHesapOkIsareti: () =>
      cy.get(`.w-50 .Select-control:contains("BANKA BİLGİSİ")`),
    listDropdown: () => cy.get(".Select-menu-outer .Select-option"),
    kaydetVeyaIptalButon: (butonIsmi) =>
      cy.get(`.button-group button:contains("${butonIsmi}")`),
    tercihSorusuBuPoliceIcinKullan: () =>
      cy.get("label[for='radio_1_this-policy']"),
    tercihSorusuTumPolicelerIcinKullan: () =>
      cy.get("label[for='radio_2_all-policy']"),
    kendiHesabimVeyaBaskasininHesabi: (item) =>
      cy.get(
        `.mB5 .clearfix .proto-radio-mark.proto-label-container label:contains("${item}")`
      ),
    hesapNumarasiInputField: () => cy.get("input[name='accountNumber']"),
    ibanInputField: () =>
      cy.get(".pB10.proto-input-container.theme.with-label input"),
    subeDropdown: () => cy.get(".mB10.w-100 div.Select"),
    talepKonu: (item) =>
      cy.get(`.Select-control:contains("${item}") .Select-value`),
    popupKartBilgisiAlani: () => cy.get(".proto-popup-body .row.bg-white "),
    etkilesimGecmisiTablosu: () => cy.get(".proto-table-row"),
  };

  policeNoSecipServisResponseKaydet() {
    cy.intercept("GET", `**/lifeInsuranceSummaryDetail*`).as(
      "lifeInsuranceSummaryDetail"
    );

    cy.intercept("POST", `**/checkLifePaymentChangeAvailability*`).as(
      "checkLifePaymentChangeAvailability"
    );

    cy.intercept("GET", `**/lifePolicyPaymentMethod*`).as(
      "lifePolicyPaymentMethod"
    );

    basePage.policeNumarasiIleUrunSec();

    cy.wait(`@lifeInsuranceSummaryDetail`)
      .its("response.body")
      .then((interception) => {
        lifeInsuranceSummaryDetailRes = interception;
      });

    cy.wait(`@checkLifePaymentChangeAvailability`)
      .its("response.body")
      .then((interception) => {
        checkLifePaymentChangeAvailabilityRes = interception;
      });

    cy.wait(`@lifePolicyPaymentMethod`)
      .its("response.body")
      .then((interception) => {
        lifePolicyPaymentMethodRes = interception;
      });
  }

  isAvailableResponseKontrol() {
    expect(checkLifePaymentChangeAvailabilityRes.data.isAvailable.toString()).to.equal("true");
  }

  odemeYontemiBilgileriKaydet() {
    sigortaDetayGiris.elements
      .tanimliOdemeYontemiKarti()
      .invoke("text")
      .then((text) => {
        odemeYontemiBilgileriUI = text;
      });
  }

  degistirButonunaTikla() {
    sigortaDetayGiris.elements.tanimliOdemeYontemiKarti().within(() => {
      cy.intercept("GET", `**/customerPaymentMethods*`).as(
        "customerPaymentMethods"
      );

      cy.intercept("GET", `**/bankInfo`).as("bankInfo");

      sigortaDetayGiris.elements.degistirButonu().click();

      basePage.loaderYok();

      cy.wait(`@customerPaymentMethods`)
        .its("response.body")
        .then((interception) => {
          customerPaymentMethodsRes = interception;
        });

      cy.wait(`@bankInfo`)
        .its("response.body")
        .then((interception) => {
          bankInfoRes = interception;
        });
    });
  }

  secilmisOdemeKartiIcerikKontrolu() {
    // `selectedPaymentType: true` olan öğeyi bul ve selectedPaymentMethod değişkenine ata
    const selectedPaymentMethod =
      customerPaymentMethodsRes.data.paymentMethodsList.find(
        (method) => method.selectedPaymentType === true
      );

    const paymentType = selectedPaymentMethod.paymentType;

    this.elements
      .maviRenkleIsaretlenmisKart()
      .invoke("text")
      .then((text) => {
        if (paymentType.includes("KREDİ KARTI")) {
          // Ayı iki basamaklı hale getirme yani 6 ise 06 yapıyoruz
          const month = selectedPaymentMethod.expireMonth;
          let formattedMonth = month < 10 ? "0" + month : month.toString();

          // Yılın son iki rakamını alma yani 2023 ise 23 alıyoruz
          const year = selectedPaymentMethod.expireYear;
          let formattedYear = year % 100;
          formattedYear = formattedYear < 10 ? "0" + formattedYear : formattedYear;

          expect(text).to.contains(`${formattedMonth}/${formattedYear}`);
          expect(odemeYontemiBilgileriUI).to.contains(`${formattedMonth}/${formattedYear}`);

          expect(text).to.contains(selectedPaymentMethod.creditCardNo);
          expect(odemeYontemiBilgileriUI).to.contains(selectedPaymentMethod.creditCardNo);

        } else if (paymentType.includes("IBAN")) {
          expect(text).to.contains(selectedPaymentMethod.ibanNo);
          expect(odemeYontemiBilgileriUI).to.contains(selectedPaymentMethod.ibanNo);

        } else if (paymentType.includes("HESAP NUMARASI")) {
          expect(text).to.contains(selectedPaymentMethod.accountNumber);
          expect(odemeYontemiBilgileriUI).to.contains(selectedPaymentMethod.accountNumber);

        } else {
          throw new Error(`Beklenen text bulunamadı`);
        }
      });
  }

  tanimliOdemeYontemiBilgilendirmeMetniKontrol() {
    const announcementListRes = customerPaymentMethodsRes.data.announcementList.announceModels;

    this.elements
      .bilgilendirmeMetni()
      .eq(0)
      .invoke("text")
      .then((text) => {
        // Announcement listesi içindeki mesajlarla karşılaştırma
        const messages = announcementListRes.map((model) => model.message);

        // valueText, messages içindeki herhangi bir mesajla eşleşmiyorsa test hata verir
        expect(messages).to.include(text);
      });
  }

  odemeTutarTablosuDataKontrol() {
    const odemeTutar = lifeInsuranceSummaryDetailRes.data.termlyPaymentAmount.amount;
    const odemeTutarCurrency = lifeInsuranceSummaryDetailRes.data.termlyPaymentAmount.currency;
    const odemeTutarTL = lifeInsuranceSummaryDetailRes.data.convertedTermlyPaymentAmount.amount;
    const odemeTutarCurrencyTL = lifeInsuranceSummaryDetailRes.data.convertedTermlyPaymentAmount.currency;

    const odemePeriyodu = lifeInsuranceSummaryDetailRes.data.policyTerm;
    const baslangicTarihi = lifeInsuranceSummaryDetailRes.data.policyStartDate;

    const payerType = lifeInsuranceSummaryDetailRes.data.payerType;

    this.elements
      .odemeTutarTablo()
      .find(".proto-card-body")
      .invoke("text")
      .then((text) => {
        expect(text).to.contains(`${odemeTutar} ${odemeTutarCurrency}`);
        expect(text).to.contains(`${odemeTutarTL} ${odemeTutarCurrencyTL}`);
        expect(text).to.contains(odemePeriyodu);
        expect(text).to.contains(baslangicTarihi);

        if (payerType === "M") {
          expect(text).to.contains("SİGORTALI / ÖDEYEN");
        } else if (payerType === "S") {
          expect(text).to.contains("SİGORTA ETTİREN / ÖDEYEN");
        } else if (payerType === "M/S") {
          expect(text).to.contains("SİGORTALI / SİGORTA ETTİREN");
        }
      });
  }

  yeniKrediKartiEkleRadioButtonSec() {
    this.elements.radioButton("Yeni Kredi Kartı Ekle").click();
  }

  yeniKrediKartiEkleBilgilendirmeMetniKontrol() {
    const announcementListRes = bankInfoRes.data.announcementList.announceModels;

    this.elements
      .bilgilendirmeMetni()
      .eq(1)
      .invoke("text")
      .then((text) => {
        // Announcement listesi içindeki mesajlarla karşılaştırma
        const messages = announcementListRes.map((model) => model.message);

        // valueText, messages içindeki herhangi bir mesajla eşleşmiyorsa test hata verir
        expect(messages).to.include(text);
      });
  }

  ptpForOdemeBilgileriServisleKontrol() {
    const bankaHesabiNeGelebilirUruneGore = Cypress.config("custom").odeme_sekilleri.bankaHesabi;
    const krediKartiNeGelebilirUruneGore = Cypress.config("custom").odeme_sekilleri.krediKarti;

    // Ortak bir kontrol fonksiyonu tanımlıyoruz
    const odemeTipiKontrol = (payment, odemeTuru, bankaAdi, beklenenOdemeTipleri) => {
      // Eğer beklenen ödeme tipleri arasında mevcut paymentType varsa
      if (beklenenOdemeTipleri.includes(payment.paymentType)) {
        if (odemeTuru === "AKBANK") {
          expect(bankaAdi).to.equal("AKBANK",`Bank name should be "AKBANK", but was "${bankaAdi}"`);
          
        } else if (
          odemeTuru === "BANKA HESAP KARTI GELMEMELİ" ||
          odemeTuru === "KREDİ KARTI GELMEMELİ"
        ) {
          // Beklenen ödeme kartının gelmemesi gerekiyor
          expect(payment.paymentType).to.not.be.oneOf(beklenenOdemeTipleri);
        } else if (
          odemeTuru === "HERHANGİ BİR HESAP GELMELİ" ||
          odemeTuru === "HERHANGİ BİR KREDİ KARTI GELMELİ"
        ) {
          // Beklenen ödeme kartının gelmesi gerekiyor
          expect(payment.paymentType).to.be.oneOf(beklenenOdemeTipleri);
        }
      }
    };

    customerPaymentMethodsRes.data.paymentMethodsList.forEach((payment) => {
      // Banka hesabı için kontrol
      odemeTipiKontrol(payment, bankaHesabiNeGelebilirUruneGore, payment.bankName, ["IBAN", "HESAP NUMARASI"]);

      // Kredi kartı için kontrol
      odemeTipiKontrol(payment, krediKartiNeGelebilirUruneGore, payment.bankName, ["KREDİ KARTI"]);
    });
  }

  tanimliOdemeYontemiKartIcerikKontrolu() {
    // Elementleri seçiyoruz
    this.elements
      .tanimliOdemeYontemindekiOdemeKartlari()
      .each((element, index) => {
        // Her bir elementin text'ini alıyoruz
        const elementText = element.text().trim();

        const paymentType = customerPaymentMethodsRes.data.paymentMethodsList[index].paymentType;
        const bankName = customerPaymentMethodsRes.data.paymentMethodsList[index].bankName;

        if (paymentType === "HESAP NUMARASI") {
          const accountNumber = customerPaymentMethodsRes.data.paymentMethodsList[index].accountNumber;

          expect(elementText).to.contains(accountNumber);
          expect(elementText).to.contains(`BANKA HESABI (${bankName})`);
          expect(elementText).to.contains("Hesap No");
        } else if (paymentType === "IBAN") {
          const ibanNo = customerPaymentMethodsRes.data.paymentMethodsList[index].ibanNo;

          expect(elementText).to.contains(ibanNo);
          expect(elementText).to.contains(`BANKA HESABI (${bankName})`);
          expect(elementText).to.contains(paymentType);
        } else if (paymentType === "KREDİ KARTI") {
          // Ayı iki basamaklı hale getirme yani 6 ise 06 yapıyoruz
          const month = customerPaymentMethodsRes.data.paymentMethodsList[index].expireMonth;

          let formattedMonth = month < 10 ? "0" + month : month.toString();

          // Yılın son iki rakamını alma yani 2023 ise 23 alıyoruz
          const year = customerPaymentMethodsRes.data.paymentMethodsList[index].expireYear;
          let formattedYear = year % 100;
          formattedYear = formattedYear < 10 ? "0" + formattedYear : formattedYear;

          const creditCardNo = customerPaymentMethodsRes.data.paymentMethodsList[index].creditCardNo;

          expect(elementText).to.contains(creditCardNo);
          expect(elementText).to.contains(`KREDİ KARTI (${bankName})`);
          expect(elementText).to.contains(`${formattedMonth}/${formattedYear}`);
        } else if (paymentType === "NAKIT") {
          expect(elementText).to.contains("NAKIT");
        }
      });
  }

  yeniKrediKartiEkleAlaniExistKontrolu() {
    const yeniKrediKartiAlan = Cypress.config("custom").odeme_sekilleri.yeni_krediKarti_alani;

    if (yeniKrediKartiAlan === "Var") {
      this.elements.radioButton("Yeni Kredi Kartı Ekle").should("exist");
    } else if (yeniKrediKartiAlan === "Yok") {
      this.elements.radioButton("Yeni Kredi Kartı Ekle").should("not.exist");
    }
  }

  yeniBankaHesabiEkleAlaniExistKontrolu() {
    const yeniBankaHesabiAlan = Cypress.config("custom").odeme_sekilleri.yeni_bankaHesabi_alani;

    if (yeniBankaHesabiAlan === "Var") {
      this.elements.radioButton("Yeni Banka Hesabı Ekle").should("exist");
    } else if (yeniBankaHesabiAlan === "Yok") {
      this.elements.radioButton("Yeni Banka Hesabı Ekle").should("not.exist");
    }
  }

  tanimlanacakHesapCheckboxBankaIsmiKontrol() {
    // Önce 'allowedOnlyAkbankBankAccount' kontrolü yapılır
    const akbank = customerPaymentMethodsRes.data.allowedOnlyAkbankBankAccount;

    if (akbank) {
      // allowedOnlyAkbankBankAccount true ise
      this.elements.listDropdown().each(($element) => {
        const elementText = $element.text().trim();

        // Eğer text 'AKBANK' değilse test hata verecek
        expect(elementText).to.eq("AKBANK",`AKBANK harici bir text bulundu: ${elementText}`);
      });
    } else {
      // allowedOnlyAkbankBankAccount false ise
      // bankInfoRes'den dönen değerleri al
      const bankList = bankInfoRes.data.customerChannelBankList;

      // Dropdown'daki elementlerle servis verilerini sırayla karşılaştır
      this.elements.listDropdown().each(($element, index) => {
        const elementText = $element.text().trim();

        // Servisten dönen ilgili index'teki bankayı al
        const expectedBank = bankList[index].bankName.trim();

        // Dropdown'dan gelen element text'i ile servisten gelen text'i karşılaştır
        expect(elementText).to.eq(expectedBank,`Beklenen bankanın adı: ${expectedBank}, ancak bulunan: ${elementText}`);
      });
    }
  }

  isBankasiKartiSecimi() {
    this.elements.tanimliOdemeYontemindekiOdemeKartlari().each(($element) => {
      // Her bir elementin text'ini alıyoruz
      const elementText = $element.text().trim();

      if (elementText.includes("T.IŞ BANKASI")) {
        cy.wrap($element).click();
        return false;
      }
    });
  }

  kayitOlusturmaBilgilendirmeMetniKontrol() {
    const announcementListRes = bankInfoRes.data.announcementList.announceModels;

    this.elements
      .kayitOlusturmaBilgilendirmeMetni()
      .find(".content")
      .invoke("text")
      .then((text) => {
        // Announcement listesi içindeki mesajlarla karşılaştırma
        const messages = announcementListRes.map((model) => model.message);

        // valueText, messages içindeki herhangi bir mesajla eşleşmiyorsa test hata verir
        expect(messages).to.include(text);
      });
  }

  devamTiklaCreateflowResponseKaydet() {
    cy.intercept("POST", `**/create-flow`).as("create-flow");
    cy.intercept("GET", `**/combinations?demandComplaintSubjectId*`).as(
      "demandComplaintSubjectId"
    );

    this.elements
      .kayitOlusturmaBilgilendirmeMetni()
      .find(".script-button-container button")
      .click();

    cy.wait(`@create-flow`)
      .its("response.body")
      .then((interception) => {
        createflowRes = interception;
      });

    cy.wait(`@demandComplaintSubjectId`)
      .its("response.body")
      .then((interception) => {
        demandComplaintSubjectIdRes = interception;
      });
  }

  createflowServisSuccessKontrol() {
    expect(createflowRes.success.toString()).to.equal("true");
  }

  akbankVeIsBankasiHesapHaricHesapSec() {
    this.elements.tanimliOdemeYontemindekiOdemeKartlari().each(($element) => {
      // Her bir elementin text'ini alıyoruz
      const elementText = $element.text().trim();

      // Eğer class içinde "border-primary" varsa döngüyü atla
      const elementClass = $element.attr("class");

      // Şartları kontrol ediyoruz: "BANKA HESABI" içeriyor ama "AKBANK" ve "T.IŞ BANKASI" içermiyor
      if (
        elementText.includes("BANKA HESABI") &&
        !elementText.includes("AKBANK") &&
        !elementText.includes("T.IŞ BANKASI") &&
        !elementClass.includes("border-primary")
      ) {
        // Şartlar sağlandığında elemente tıklayıp döngüyü bitiriyoruz
        cy.wrap($element).click();
        return false; // Döngüden çıkmak için return false kullanıyoruz
      }
    });
  }

  kendiKartimiHesabimSec() {
    this.elements
      .kendiVeyaBaskaKartHesapSecim("Kendi Kredi Kartım / Hesabım")
      .click();
    //cy.get("div[class='button-group'] button[class='btn proto-button-base proto-button proto-button-primary']").click();
  }

  baskasininKartimiHesabimSec() {
    this.elements
      .kendiVeyaBaskaKartHesapSecim("Başkasının Kredi Kartı / Hesabı")
      .click();
  }

  ATSmesajKontrolu() {
    const announcementListRes = bankInfoRes.data.announcementList.announceModels;

    this.elements
      .kendiVeyaBaskaKartHesapSecimBilgilendirmeMetni()
      .invoke("text")
      .then((text) => {
        // Announcement listesi içindeki mesajlarla karşılaştırma
        const messages = announcementListRes.map((model) => model.message);

        // valueText, messages içindeki herhangi bir mesajla eşleşmiyorsa test hata verir
        expect(messages).to.include(text);
      });
  }

  ATSveSigortaEttirenMesajKontrolu() {
    const announcementListRes = customerPaymentMethodsRes.data.announcementList.announceModels;

    this.elements
      .kendiVeyaBaskaKartHesapSecimBilgilendirmeMetni()
      .invoke("text")
      .then((text) => {
        // Announcement listesi içindeki mesajlarla karşılaştırma
        const messages = announcementListRes.map((model) => model.message);

        // valueText, messages içindeki herhangi bir mesajla eşleşmiyorsa test hata verir
        expect(messages).to.include(text);
      });
  }

  formGonderimiPopupBilgilendirmeMetni() {
    const announcementListRes = bankInfoRes.data.announcementList.announceModels;

    // Locatordan gelen text'i al ve dinamik olarak cümleleri ayır
    basePage.elements
      .popupBody()
      .find(".content")
      .invoke("text")
      .then((text) => {
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
      });
  }

  formGonderimiButonTiklaResponseKaydet(butonIsmi) {
    cy.intercept("POST", `**/notifyPaymentChangeDocuments`).as(
      "notifyPaymentChangeDocuments"
    );

    this.elements.formuGonderVeyaIptalButon(butonIsmi).click();

    cy.wait(`@notifyPaymentChangeDocuments`)
      .its("response.body")
      .then((interception) => {
        notifyPaymentChangeDocumentsRes = interception;
      });
  }

  notifyPaymentChangeDocumentsServisSuccessKontrol() {
    expect(notifyPaymentChangeDocumentsRes.success.toString()).to.equal("true");
  }

  formGonderimiPopupButonTikla(butonIsmi) {
    cy.intercept("POST", `**/create-flow`).as("create-flow");
    cy.intercept("GET", `**/combinations?demandComplaintSubjectId*`).as(
      "demandComplaintSubjectId"
    );

    basePage.popupBodyButonTikla(butonIsmi);

    cy.wait(`@create-flow`)
      .its("response.body")
      .then((interception) => {
        createflowRes = interception;
      });

    cy.wait(`@demandComplaintSubjectId`)
      .its("response.body")
      .then((interception) => {
        demandComplaintSubjectIdRes = interception;
      });
  }

  taleplerTabindanSigortalarTabinaGecis() {
    basePage.sekmeSecme("Sigortalar");
    basePage.sekmeKontrol("Sigortalar");
    this.policeNoSecipServisResponseKaydet();
    this.degistirButonunaTikla();
  }

  herhangiBirKrediKartiSec() {
    this.elements.tanimliOdemeYontemindekiOdemeKartlari().each(($element) => {
      // Her bir elementin text'ini alıyoruz
      const elementText = $element.text().trim();

      // Eğer class içinde "border-primary" varsa döngüyü atla
      const elementClass = $element.attr("class");

      if (
        elementText.includes("KREDİ KARTI") &&
        !elementClass.includes("border-primary")
      ) {
        // Şartlar sağlandığında elemente tıklayıp döngüyü bitiriyoruz
        cy.wrap($element).click();
        return false; // Döngüden çıkmak için return false kullanıyoruz
      }
    });
  }

  sigortaEttirenMesajKontrolu(item) {
    let updatedMessages;

    const announcementListRes = customerPaymentMethodsRes.data.announcementList.announceModels;

    this.elements
      .kendiVeyaBaskaKartHesapSecimBilgilendirmeMetni()
      .invoke("text")
      .then((uiText) => {
        // Announcement listesi içindeki mesajları al
        const messages = announcementListRes.map((model) => model.message);

        if (item.includes("kart")) {
          // Servisten dönen mesajlarda hesap kısmını kart ile değiştir
          updatedMessages = messages.map((message) => {
            return message.replace("hesap", "kart");
          });

          // UI'daki text ile servisten güncellenmiş mesajlar arasında assert yap
          expect(updatedMessages).to.include(uiText.trim());
        } else if (item.includes("hesap")) {
          expect(messages).to.include(uiText.trim());
        } else {
          throw new Error(`Hatalı text!`);
        }
      });
  }

  akbankHesapSec() {
    this.elements.tanimliOdemeYontemindekiOdemeKartlari().each(($element) => {
      // Her bir elementin text'ini alıyoruz
      const elementText = $element.text().trim();

      // Eğer class içinde "border-primary" varsa döngüyü atla
      const elementClass = $element.attr("class");

      // Şartları kontrol ediyoruz: "AKBANK" içeriyor
      if (
        elementText.includes("AKBANK") &&
        elementText.includes("BANKA HESABI") &&
        !elementClass.includes("border-primary")
      ) {
        // Şartlar sağlandığında elemente tıklayıp döngüyü bitiriyoruz
        cy.wrap($element).click();
        return false; // Döngüden çıkmak için return false kullanıyoruz
      }
    });
  }

  tanimlanacakHesapDropdownAc() {
    this.elements.radioButton("Yeni Banka Hesabı Ekle").click();
    this.elements.tanimlanacakHesapOkIsareti("TANIMLANACAK HESAP").click();
  }

  kaydetButonunaTikla(butonIsmi) {
    this.elements.kaydetVeyaIptalButon(butonIsmi).click();
  }

  krediKartiVeyaIbanSonHaneyiDegiskeneAta() {
    this.elements
      .popupKartBilgisiAlani()
      .invoke("text")
      .then((text) => {
        yeniSecilenOdemeYontemiBilgisi = text;
        if (text.includes("KREDİ KARTI")) {
          // Text'in son 4 karakterini al ve bir değişkene ata
          krediKartiSon4 = text.slice(-4);
          cy.log("Kredi kartının son 4 hanesi: " + krediKartiSon4);
        } else if (text.includes("BANKA HESABI")) {
          // Text'in son 2 karakterini al ve bir değişkene ata
          bankaHesabiSon2 = text.slice(-2);
          cy.log("Banka hesabının son 2 hanesi: " + bankaHesabiSon2);
        } else {
          throw new Error(`Beklenen text bulunamadı`);
        }
      });
  }

  popupOnayMetniKontrol(item) {
    let updatedMessages;

    const announcementListRes = bankInfoRes.data.announcementList.announceModels;

    basePage.elements
      .popupBody()
      .find(".content")
      .eq(0)
      .invoke("text")
      .then((uiText) => {
        // Announcement listesi içindeki mesajları al
        const messages = announcementListRes.map((model) => model.message);

        if (item.includes("KREDİ KARTI")) {
          // Servisten dönen mesajlarda {xx} kısmını kredi kartı son 4 hane ile değiştir
          updatedMessages = messages.map((message) => {
            return message.replace("{xx}", krediKartiSon4);
          });
        } else if (item.includes("BANKA HESABI")) {
          // Servisten dönen mesajlarda {IBAN} kısmını banka hesap numarası son 2 hane ile değiştir
          updatedMessages = messages.map((message) => {
            return message.replace("{IBAN}", bankaHesabiSon2);
          });
        } else if (item.includes("TANIMLANACAK HESAP")) {
          // Servisten dönen mesajlarda {IBAN} kısmını tanımlanacak hesap numarası son 4 hane ile değiştir
          updatedMessages = messages.map((message) => {
            return message.replace("{IBAN}", tanimlanacakHesapSon4Hane);
          });
        }
        // UI'daki text ile servisten güncellenmiş mesajlar arasında assert yap
        expect(updatedMessages).to.include(uiText);
      });
  }

  popupTercihSorusuKontrol(item) {
    let announcementListRes;

    if (item.includes("KREDİ KARTI")) {
      announcementListRes = bankInfoRes.data.announcementList.announceModels;
    } else if (item.includes("BANKA HESABI")) {
      announcementListRes = customerPaymentMethodsRes.data.announcementList.announceModels;
    }

    basePage.elements
      .popupBody()
      .find(".content")
      .eq(1)
      .invoke("text")
      .then((text) => {
        // Announcement listesi içindeki mesajlarla karşılaştırma
        const messages = announcementListRes.map((model) => model.message);

        // valueText, messages içindeki herhangi bir mesajla eşleşmiyorsa test hata verir
        expect(messages).to.include(text);
      });
  }

  tercihSorusuSecenekSec(secenek) {
    if (secenek.includes("Bu poliçe için kullan")) {
      this.elements.tercihSorusuBuPoliceIcinKullan().click();
    } else if (secenek.includes("Tüm poliçeler için kullan")) {
      this.elements.tercihSorusuTumPolicelerIcinKullan().click();
    }
  }

  popupEvetButonunaTiklaReponseKaydet(butonAdi) {
    cy.intercept("POST", `**/lifeChangePaymentMethod`).as(
      "lifeChangePaymentMethod"
    );

    basePage.popupBodyButonTikla(butonAdi);

    cy.wait(`@lifeChangePaymentMethod`)
      .its("response.body")
      .then((interception) => {
        lifeChangePaymentMethodRes = interception;
      });
  }

  popupBilgilendirmeMetniServisUyumu() {
    const response = lifeChangePaymentMethodRes.data.announcementList.announceModels[0].message.toString();
    basePage.elements.popupBody().should("contain", response);
  }

  tanimlanacakHesapDropdownSecimYap(bankaTercihi) {
    this.elements.listDropdown().each(($element) => {
      // Elementin text'ini alıyoruz
      const elementText = $element.text().trim();

      if (bankaTercihi.includes("Akbank dışında")) {
        // Eğer text 'AKBANK' içermiyorsa
        if (!elementText.includes("AKBANK")) {
          // Elemente tıklıyoruz
          cy.wrap($element).click();

          // Döngüyü sonlandırmak için return false
          return false;
        }
      } else if (bankaTercihi.includes("AKBANK")) {
        if (elementText.includes("AKBANK")) {
          // Elemente tıklıyoruz
          cy.wrap($element).click();

          // Döngüyü sonlandırmak için return false
          return false;
        }
      } else if (bankaTercihi.includes("T.IŞ BANKASI")) {
        if (elementText.includes("T.IŞ BANKASI")) {
          // Elemente tıklıyoruz
          cy.wrap($element).click();
          return false; // Döngüyü sonlandırmak için return false
        }
      } else {
        throw new Error(`Beklenen ${bankaTercihi} bulunamadı`);
      }
    });
  }

  kendiHesabimVeyaBaskasininHesabiSeciminiYap(item) {
    this.elements.kendiHesabimVeyaBaskasininHesabi(item).click();
  }

  hesapNumarasiInputAlaniGorunmeli() {
    this.elements.hesapNumarasiInputField().should("be.visible");
  }

  hesapNumarasiAlaninaDegerGir(deger) {
    tanimlanacakHesapSon4Hane = deger.slice(-4);
    this.elements.hesapNumarasiInputField().type(deger);
  }

  ibanAlaniPasifGorunmeli() {
    this.elements.ibanInputField().should("be.disabled");
  }

  hesapNumarasiInputAlaniTemizleme() {
    this.elements.hesapNumarasiInputField().clear();
  }

  ibanAlaninaDegerGir(deger) {
    tanimlanacakHesapSon4Hane = deger.slice(-4);
    this.elements.ibanInputField().type(deger);
  }

  hesapVeSubeAlaniPasifGorunmeli() {
    this.elements.hesapNumarasiInputField().should("be.disabled");
    this.elements.subeDropdown().should("have.class", "is-disabled");
  }

  subeSec(item) {
    this.elements.subeDropdown().click();

    this.elements.listDropdown().each(($element) => {
      // Elementin text'ini alıyoruz
      const elementText = $element.text();

      if (elementText.includes(item)) {
        // Elemente tıklıyoruz
        cy.wrap($element).click();
        return false; // Döngüyü sonlandırmak için return false
      }
    });
  }

  talepKonuVeDetayKonuKontrol() {
    // 'id' 38 olan kısmı bul
    const item = demandComplaintSubjectIdRes.data.find((obj) => obj.id === 38);

    if (item) {
      // 'Hayat Değişiklik Talepleri' textini talepKonusu değişkenine atama
      const talepKonusu = item.demandComplaintSubject.subject;

      // 'Ödeme Şekli Değişiklik' textini talepDetayKonusu değişkenine atama
      const talepDetayKonusu = item.demandComplaintDetailSubject.subject;

      // UI'dan talep konusu ve detay konusu textlerini al ve kontrol et
      this.elements
        .talepKonu("Talebin Konusu Seçiniz")
        .invoke("text")
        .then((UItalepKonusu) => {
          this.elements
            .talepKonu("Talebin Detay Konusunu Seçiniz")
            .invoke("text")
            .then((UIdetayTalepKonusu) => {
              // Değerleri assert et
              expect(UItalepKonusu.trim()).to.equal(talepKonusu);
              expect(UIdetayTalepKonusu.trim()).to.equal(talepDetayKonusu);
            });
        });
    } else {
      cy.log("ID: 38 olan item bulunamadı.");
    }
  }

  odemeYontemiDegisenPoliceler() {
    const prefix = Cypress.env("POLICE_NO").charAt(0);
    let policyNo = Cypress.env("POLICE_NO").slice(1).split("-").join("");

    // Mevcut poliçe numarasını oluştur
    const mevcutPoliceNumarasi = `${prefix}-${policyNo}`;

    basePage.elements
      .popupBody()
      .find(".content") // Buraya locatordaki elementi koyun
      .invoke("text")
      .then((text) => {
        // "başarılı bir şekilde değiştirilmiştir" ibaresinden önceki poliçe numaralarını bul
        const splitText = text.split(
          "başarılı bir şekilde değiştirilmiştir"
        )[0];

        // Poliçe numaralarını virgüle göre ayır
        const policyNumbers = splitText.match(/\b[A-Z]-\d{6}\b/g) || [];

        // Mevcut poliçe numarasını bul ve mevcutPoliceNo olarak ata
        mevcutPoliceNo = policyNumbers.find((policy) => policy === mevcutPoliceNumarasi) || null;

        // Mevcut poliçe numarasından farklı olan bir random poliçe numarasını randomPoliceNo olarak seç
        let otherPolicyNumbers = policyNumbers.filter((policy) => policy !== mevcutPoliceNumarasi);

        randomPoliceNo = otherPolicyNumbers.length > 0
            ? otherPolicyNumbers[Math.floor(Math.random() * otherPolicyNumbers.length)]: null;
      });
  }

  buPoliceOdemeYontemiKontrol() {
    sigortaDetayGiris.elements
      .tanimliOdemeYontemiKarti()
      .find(".row:last-of-type")
      .should(($el) => {
        const actualText = $el.text();
        expect(yeniSecilenOdemeYontemiBilgisi).to.contains(actualText);
      });
  }

  tumPoliceOdemeYontemiKontrol() {
    // Eğer mevcutPoliceNo null değilse buPoliceOdemeYontemiKontrol() metodunu çağır
    if (mevcutPoliceNo !== null) {
      this.buPoliceOdemeYontemiKontrol();
    }

    // Eğer mevcutPoliceNo dışında başka poliçe no varsa yani null değilse buPoliceOdemeYontemiKontrol() metodunu çağır
    if (randomPoliceNo !== null) {
      basePage.sekmeSecme("Sigortalar");
      basePage.sekmeKontrol("Sigortalar");
      this.odemeYontemiDegisenPoliceSec();
      this.buPoliceOdemeYontemiKontrol();
    }
  }

  odemeYontemiDegisenPoliceSec() {
    const prefix = randomPoliceNo.charAt(0);
    let policyNo = randomPoliceNo.slice(1).split("-").join("");

    const policeNo = `${prefix}${policyNo}`;
    basePage.elements.urunPoliceNoIle(policeNo).first().click();
  }
}

export const odemeSekliDegisikligi = new OdemeSekliDegisikligiPage();
