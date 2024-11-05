import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { basePage } from "@pages/BasePage";
import { policeIptal } from "@pages/PoliceIptalPage";
import { taleplerPage } from "@pages/TaleplerPage";

let lifePolicyDeductionsAndPaidAmountRes,
  reasonsRes,
  saveProductOperationReasonRes,
  persuasionMessageRes,
  lifeRecallMessageRes,
  policyDetailRes,
  contactDetailRes,
  subjectsRes,
  combinationsRes,
  createFlowRes,
  findPotentialWorkgroupRes,
  bankInfoRes,
  lifePaymentTypeInfoRes,
  lifeSaveExitAddendumRes,
  accountInformation,
  musteriyeIadeEdilecekTutar;

const prefix = Cypress.env("POLICE_NO").charAt(0);
const policyNo = Cypress.env("POLICE_NO").match(/(?<=[-A-Z])\d+/)[0];
const policeNumarasi = prefix + policyNo;
const _ = require("lodash");

When(
  "İptal Talebi butonuna lifePolicyDeductionsAndPaidAmount ve reasons servisi ile tıklıyorum",
  () => {
    cy.intercept("GET", "**/lifePolicyDeductionsAndPaidAmount*").as(
      "lifePolicyDeductionsAndPaidAmount"
    );
    cy.intercept("GET", "**/reasons*").as("reasons");

    basePage.butonTikla("İptal Talebi");

    cy.wait("@lifePolicyDeductionsAndPaidAmount")
      .its("response.body")
      .then((interception) => {
        lifePolicyDeductionsAndPaidAmountRes = interception;
        // cy.log(
        //   "lifePolicyDeductionsAndPaidAmountRes: " +
        //     JSON.stringify(lifePolicyDeductionsAndPaidAmountRes)
        // );
      });

    cy.wait("@reasons")
      .its("response.body")
      .then((interception) => {
        reasonsRes = interception;
        // cy.log("reasonsRes: " + JSON.stringify(reasonsRes));
      });
  }
);

Then("Poliçe iptal talebi header görünmeli", () => {
  policeIptal.headerIcerik("Nolu Poliçe İptal Talebi");
  policeIptal.headerIcerik(policeNumarasi);
});

Then(
  "Poliçe iptal talebi bilgilendirme metni lifePolicyDeductionsAndPaidAmount servisi ile uyumlu olmalı",
  () => {
    basePage.daireLoaderYok();
    policeIptal.elements.bilgilendirmeMetiniText().then((el) => {
      expect(
        JSON.stringify(
          lifePolicyDeductionsAndPaidAmountRes.data.announcementList
        )
          .replace(/<\/?[^>]+(>|$)/g, "")
          .replaceAll(" ", "")
      ).to.includes(el.text().replaceAll(" ", ""));
    });
  }
);

Then(
  "Poliçe iptal hesap tablosu lifePolicyDeductionsAndPaidAmount servisi ile uyumlu olmalı",
  () => {
    basePage.daireLoaderYok();

    function paraMiktarlariniGetir(key) {
      const foreignCurrencyExists =
        !!lifePolicyDeductionsAndPaidAmountRes.data
          .deductionsAndPaidAmountCurrencyModelForeignCurrency;
      const usdMiktari = foreignCurrencyExists
        ? lifePolicyDeductionsAndPaidAmountRes.data
            .deductionsAndPaidAmountCurrencyModelForeignCurrency[key]?.amount
        : null;
      const tlMiktari =
        lifePolicyDeductionsAndPaidAmountRes.data
          .deductionsAndPaidAmountCurrencyModel[key]?.amount;

      return {
        usd: usdMiktari, // USD varsa döndür, yoksa null
        tl: tlMiktari, // TL varsa döndür, yoksa null
      };
    }

    // Tutarları doğrulamak için tekrar kullanılabilir fonksiyon
    function paraMiktarlariniDogrula(etiket, miktarlar, foreignCurrencyExists) {
      // Sadece TL varsa doğrulama yap
      if (miktarlar.tl) {
        policeIptal.elements
          .iptalHesapMiktar(etiket)
          .should("contain", miktarlar.tl);
      }
      // Eğer foreignCurrencyExists true ise ve USD varsa onu da doğrula
      if (foreignCurrencyExists && miktarlar.usd) {
        policeIptal.elements
          .iptalHesapMiktar(etiket)
          .should("contain", miktarlar.usd);
      }
    }

    function paraMiktarlariniDogrula(label, amounts, foreignCurrencyExists) {
      // Sadece TL varsa doğrulama yap
      if (amounts.tl) {
        policeIptal.elements
          .iptalHesapMiktar(label)
          .should("contain", amounts.tl);
      }
      // Eğer foreignCurrencyExists true ise ve USD varsa onu da doğrula
      if (foreignCurrencyExists && amounts.usd) {
        policeIptal.elements
          .iptalHesapMiktar(label)
          .should("contain", amounts.usd);
      }
    }

    const foreignCurrencyExists =
      !!lifePolicyDeductionsAndPaidAmountRes.data
        .deductionsAndPaidAmountCurrencyModelForeignCurrency;

    const toplamOdenenPrim = paraMiktarlariniGetir("totalPremiumPaid");
    const toplamFonDegeri = paraMiktarlariniGetir("totalFundValue");
    const toplamKesintiTutari = paraMiktarlariniGetir("totalDeduction");
    const stopajKesintisi = paraMiktarlariniGetir("stoppageDeduction");
    const riskKesintisi = paraMiktarlariniGetir("riskDeduction");
    const istiraKesintisi = paraMiktarlariniGetir("surrenderDeduction");
    musteriyeIadeEdilecekTutar =
      paraMiktarlariniGetir("amountPayCustomer");

    paraMiktarlariniDogrula(
      "Toplam Ödenen Prim",
      toplamOdenenPrim,
      foreignCurrencyExists
    );
    paraMiktarlariniDogrula(
      "Toplam Fon Değeri",
      toplamFonDegeri,
      foreignCurrencyExists
    );
    paraMiktarlariniDogrula(
      "Toplam Kesinti Tutarı",
      toplamKesintiTutari,
      foreignCurrencyExists
    );
    paraMiktarlariniDogrula(
      "Stopaj Kesintisi",
      stopajKesintisi,
      foreignCurrencyExists
    );
    paraMiktarlariniDogrula(
      "Risk Kesintisi",
      riskKesintisi,
      foreignCurrencyExists
    );
    paraMiktarlariniDogrula(
      "İştira Kesintisi",
      istiraKesintisi,
      foreignCurrencyExists
    );
    paraMiktarlariniDogrula(
      "Bugün İtibariyle Müşteriye İade Edilecek Tutar",
      musteriyeIadeEdilecekTutar,
      foreignCurrencyExists
    );
  }
);

Then("Poliçe İptal Nedeni ile reasons servisi uyumlu olmalı", () => {
  reasonsRes.data.operationReasons.forEach((el) => {
    policeIptal.elements.iptalNedeniContainer().should("contain", el.reason);
  });
});

Then(
  "Poliçe iptal talebi bilgilendirme metni reasons servisi ile uyumlu olmalı",
  () => {
    basePage.daireLoaderYok();
    policeIptal.elements.bilgilendirmeMetiniText().then((el) => {
      expect(
        JSON.stringify(reasonsRes.data.announcementList)
          .replaceAll(" ", "")
          .replaceAll("<br>", "")
      ).to.includes(el.text().replaceAll(" ", ""));
    });
  }
);

When(
  "Random Poliçe İptal Nedeni ile devam ederken saveProductOperationReason ve persuasionMessage servis dönütlerini alıyorum",
  () => {
    cy.intercept("POST", "**/saveProductOperationReason").as(
      "saveProductOperationReason"
    );
    cy.intercept("POST", "**/persuasionMessage").as("persuasionMessage");

    policeIptal.elements.iptalNedeniRadioButon().then((el) => {
      let randomSebep = _.random(0, el.length);
      cy.wrap(el)
        .eq(randomSebep - 1)
        .check({ force: true });
    });

    basePage.butonTikla("Devam");

    cy.wait("@saveProductOperationReason")
      .its("response.body")
      .then((interception) => {
        saveProductOperationReasonRes = interception;
        cy.log(
          "saveProductOperationReasonRes: " +
            JSON.stringify(saveProductOperationReasonRes)
        );
      });

    cy.wait("@persuasionMessage")
      .its("response.body")
      .then((interception) => {
        persuasionMessageRes = interception;
        cy.log("persuasionMessageRes: " + JSON.stringify(persuasionMessageRes));
      });
  }
);

Then(
  "Poliçe iptal talebi Tutundurma metni persuasionMessage servisi ile uyumlu olmalı",
  () => {
    basePage.daireLoaderYok();
    policeIptal.elements.bilgilendirmeMetiniText().then((el) => {
      expect(
        JSON.stringify(persuasionMessageRes.data.message)
          .replace(/<\/?[^>]+(>|$)/g, "")
          .replaceAll(" ", "")
      ).to.includes(el.text().replaceAll(" ", ""));
    });
  }
);

When(
  "Devam butonuna lifeRecallMessage, policy-detail, contact-detail, subjects, combinations,create-flow ve find-potential-workgroup servisleri ile tıklıyorum",
  () => {
    cy.intercept("POST", "**/lifeRecallMessage").as("lifeRecallMessage");
    cy.intercept("POST", "**/policy-detail").as("policyDetail");
    cy.intercept("POST", "**/contact-detail").as("contactDetail");
    cy.intercept("GET", "**/subjects*").as("subjects");
    cy.intercept("GET", "**/combinations*").as("combinations");
    cy.intercept("POST", "**/create-flow").as("createFlow");
    cy.intercept("POST", "**/find-potential-workgroup").as(
      "findPotentialWorkgroup"
    );

    basePage.butonTikla("Devam");

    cy.wait("@lifeRecallMessage")
      .its("response.body")
      .then((interception) => {
        lifeRecallMessageRes = interception;
        cy.log("lifeRecallMessageRes: " + JSON.stringify(lifeRecallMessageRes));
      });

    cy.wait("@policyDetail")
      .its("response.body")
      .then((interception) => {
        policyDetailRes = interception;
        cy.log("policyDetailRes: " + JSON.stringify(policyDetailRes));
      });

    cy.wait("@contactDetail")
      .its("response.body")
      .then((interception) => {
        contactDetailRes = interception;
        cy.log("contactDetailRes: " + JSON.stringify(contactDetailRes));
      });

    cy.wait("@subjects")
      .its("response.body")
      .then((interception) => {
        subjectsRes = interception;
        cy.log("subjectsRes: " + JSON.stringify(subjectsRes));
      });

    cy.wait("@combinations")
      .its("response.body")
      .then((interception) => {
        combinationsRes = interception;
        cy.log("combinationsRes: " + JSON.stringify(combinationsRes));
      });

    cy.wait("@createFlow")
      .its("response.body")
      .then((interception) => {
        createFlowRes = interception;
        cy.log("createFlowRes: " + JSON.stringify(createFlowRes));
      });

    cy.wait("@findPotentialWorkgroup")
      .its("response.body")
      .then((interception) => {
        findPotentialWorkgroupRes = interception;
        cy.log(
          "findPotentialWorkgroupRes: " +
            JSON.stringify(findPotentialWorkgroupRes)
        );
      });
  }
);

When(
  "Devam butonuna lifeRecallMessage, bankInfo ve lifePaymentTypeInfo servisleri ile tıklıyorum",
  () => {
    cy.intercept("POST", "**/lifeRecallMessage").as("lifeRecallMessage");
    cy.intercept("GET", "**/bankInfo").as("bankInfo");
    cy.intercept("POST", "**/lifePaymentTypeInfo").as("lifePaymentTypeInfo");

    basePage.butonTikla("Devam");

    cy.wait("@lifeRecallMessage")
      .its("response.body")
      .then((interception) => {
        lifeRecallMessageRes = interception;
        // cy.log("lifeRecallMessageRes: " + JSON.stringify(lifeRecallMessageRes));
      });

    cy.wait("@bankInfo")
      .its("response.body")
      .then((interception) => {
        bankInfoRes = interception;
        // cy.log("bankInfoRes: " + JSON.stringify(bankInfoRes));
      });

    cy.wait("@lifePaymentTypeInfo")
      .its("response.body")
      .then((interception) => {
        lifePaymentTypeInfoRes = interception;
        // cy.log("lifePaymentTypeInfoRes: " + JSON.stringify(lifePaymentTypeInfoRes));
      });
  }
);

Then("lifeRecallMessage servisinde redirectToDemand {string} dönmeli", (state) => {
  expect(lifeRecallMessageRes.data.redirectToDemand.toString()).to.equal(state);
});

Then("create-flow servisi {string} dönmeli", (state) => {
  expect(createFlowRes.success.toString()).to.equal(state);
});

Then("create-flow servisi error mesajı görünmeli", () => {
  cy.contains(createFlowRes.error.message.toString());
});

Then(
  "Poliçe iptal talebi sayfasında Aktivite Tipi, Talebin Konusu, Talebin Detay Konusu configdeki gibi görünmeli",
  () => {
    taleplerPage.elements
      .seciliAktiviteTipi()
      .should("contain", Cypress.config("custom").iptal_talebi_aktivite_tipi);
    taleplerPage.elements
      .seciliTalebinKonusu()
      .should("contain", Cypress.config("custom").iptal_talebi_konusu);
    taleplerPage.elements
      .seciliTalebinDetayKonusu()
      .should("contain", Cypress.config("custom").iptal_talebi_detay_konusu);
  }
);

Then(
  "Poliçe iptal talebi sayfasındaki iletişim bilgileri contact-detail servisi ile uyumlu olmalı",
  () => {
    taleplerPage.elements
      .kayitliTelNo()
      .invoke("attr", "value")
      .then((el) => {
        expect(contactDetailRes.data.phone).to.includes(el.replaceAll(" ", ""));
      });

    taleplerPage.elements
      .kayitliEMail()
      .invoke("attr", "value")
      .then((el) => {
        expect(contactDetailRes.data.email).to.includes(el);
      });

    let iletisimAdresi =
      contactDetailRes.data.address.detail +
      contactDetailRes.data.address.town +
      contactDetailRes.data.address.city.value +
      contactDetailRes.data.address.country.value;
    taleplerPage.elements
      .kayitliIletisimAdresi()
      .invoke("attr", "value")
      .then((el) => {
        expect(iletisimAdresi.replaceAll(" ", "")).to.includes(
          el.replaceAll(" ", "")
        );
      });
  }
);

When(
  "Poliçe iptal talebi sayfasındaki açıklama kısmını doldurmadan Kaydet butonuna tıklıyorum",
  () => {
    taleplerPage.elements.buton("Kaydet").last().click();
  }
);

When(
  "Poliçe iptal talebi için random açıklama yazarak Kaydet butonuna tıklıyorum",
  () => {
    let randomText =
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.";
    taleplerPage.elements.aciklama().click().clear().type(randomText);

    taleplerPage.elements.buton("Kaydet").last().click();
  }
);

Then("Poliçe iptal talebi için hata uyarı popup görünmeli", () => {
  taleplerPage.elements.uyari().should("be.visible");
});

Then(
  "Poliçe iptal talebi bilgilendirme metni lifePaymentTypeInfo servisi ile uyumlu olmalı",
  () => {
    basePage.daireLoaderYok();
    policeIptal.elements.bilgilendirmeMetiniText().then((el) => {
      expect(
        JSON.stringify(lifePaymentTypeInfoRes.data.announcementList)
          .replace(/<\/?[^>]+(>|$)/g, "")
          .replaceAll(" ", "")
      ).to.includes(el.text().replaceAll(" ", ""));
    });
  }
);

Then(
  "Poliçe iptal hesap tablosundaki çıkış tarihi lifePaymentTypeInfo servisi ile uyumlu olmalı",
  () => {
    basePage.daireLoaderYok();

    let cikisTarihi = lifePaymentTypeInfoRes.data.exitDate;
    policeIptal.elements
      .iptalHesapMiktar("Çıkış Tarihi")
      .should("contain", cikisTarihi);
  }
);

When("Popup body Evet butonuna lifeSaveExitAddendum ile tıklıyorum", () => {
  cy.intercept("POST", "**/lifeSaveExitAddendum").as("lifeSaveExitAddendum");

  basePage.popupBodyButonTikla("Evet");

  cy.wait("@lifeSaveExitAddendum")
    .its("response.body")
    .then((interception) => {
      lifeSaveExitAddendumRes = interception;
      cy.log(
        "lifeSaveExitAddendumRes: " + JSON.stringify(lifeSaveExitAddendumRes)
      );
    });
});

Then("lifeSaveExitAddendum servisi {string} dönmeli", (state) => {
  expect(lifeSaveExitAddendumRes.success.toString()).to.equal(state);
});

Then(
  "Poliçe iptali için tanımlı ödeme yöntemi lifePaymentTypeInfo servisi ile uyumlu olmalı",
  () => {
    if (parseFloat(musteriyeIadeEdilecekTutar.tl.replace(",", ".")) > 0) {
      policeIptal.elements.tanimliOdemeKarti().within(() => {
        cy.get("div.row div.row div#label")
          .first()
          .then((el) => {
            cy.log(el.text());
            expect(
              JSON.stringify(
                lifePaymentTypeInfoRes.data.customerPaymentMethodList
              )
            ).to.includes(el.text());
          });

        cy.get("div.row div.row div#label")
          .last()
          .then((el) => {
            accountInformation = el.text();
            expect(
              JSON.stringify(
                lifePaymentTypeInfoRes.data.customerPaymentMethodList
              )
            ).to.includes(el.text());
          });
      });
    } else {
      policeIptal.elements
        .tanimliOdemeKarti()
        .should("contain", "Ödeme yöntemi bulunamadı.");
    }
  }
);

Then(
  "Poliçe İptal Onayı bilgilendirme metni lifePaymentTypeInfo servisi ile uyumlu olmalı",
  () => {
    const refundAmountTL =
      lifePolicyDeductionsAndPaidAmountRes.data
        .deductionsAndPaidAmountCurrencyModel.amountPayCustomer.amount + " TL";

    policeIptal.elements
      .bilgilendirmeMetiniText()
      .should("contain", refundAmountTL)
      .and("contain", accountInformation)
      .and("contain", policeNumarasi)
      .and("contain", Cypress.config("custom").urun_adi);
  }
);
