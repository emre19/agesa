import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { basePage } from "@pages/BasePage";
import { policeIptal } from "@pages/PoliceIptalPage";
import { policeCayma } from "@pages/PoliceCaymaPage";
import { taleplerPage } from "@pages/TaleplerPage";

const prefix = Cypress.env("POLICE_NO").charAt(0);
const policyNo = Cypress.env("POLICE_NO").match(/(?<=[-A-Z])\d+/)[0];
const policeNumarasi = prefix + policyNo;
const _ = require("lodash");

let musteriyeIadeEdilecekTutar,
  checkLifeCancellationAvailabilityRes,
  lifePolicyDeductionsAndPaidAmountRes,
  reasonsRes,
  saveProductOperationReasonRes,
  persuasionMessageRes,
  contactDetailRes,
  createFlowRes,
  persuasionStatusesRes,
  findPotentialWorkgroupRes,
  lifeRecallMessageRes,
  bankInfoRes,
  lifePaymentTypeInfoRes,
  lifeSaveExitAddendumRes;

Given(
  "Poliçe cayma ürününü checkLifeCancellationAvailability servisi ile seçiyorum",
  () => {
    cy.intercept("POST", "**/checkLifeCancellationAvailability").as(
      "checkLifeCancellationAvailability"
    );

    basePage.policeNumarasiIleUrunSec();

    cy.wait("@checkLifeCancellationAvailability")
      .its("response.body")
      .then((interception) => {
        checkLifeCancellationAvailabilityRes = interception;
        cy.log(
          "checkLifeCancellationAvailabilityRes: " +
            JSON.stringify(checkLifeCancellationAvailabilityRes)
        );
      });
  }
);

Then(
  "checkLifeCancellationAvailability servisindeki son cayma tarihi sayfada görünmeli",
  () => {
    policeCayma.elements
      .caymaSonTarihInfo()
      .should("contain", "Son Cayma Tarihi")
      .and(
        "contain",
        checkLifeCancellationAvailabilityRes.data.lastBackdownDate
      );
  }
);

When(
  "Cayma Talebi butonuna lifePolicyDeductionsAndPaidAmount ve reasons servisi ile tıklıyorum",
  () => {
    cy.intercept("GET", "**/lifePolicyDeductionsAndPaidAmount*").as(
      "lifePolicyDeductionsAndPaidAmount"
    );
    cy.intercept("GET", "**/reasons*").as("reasons");

    basePage.butonTikla("Cayma Talebi");

    cy.wait("@lifePolicyDeductionsAndPaidAmount")
      .its("response.body")
      .then((interception) => {
        lifePolicyDeductionsAndPaidAmountRes = interception;
        cy.log(
          "lifePolicyDeductionsAndPaidAmountRes: " +
            JSON.stringify(lifePolicyDeductionsAndPaidAmountRes)
        );
      });

    cy.wait("@reasons")
      .its("response.body")
      .then((interception) => {
        reasonsRes = interception;
        cy.log("reasonsRes: " + JSON.stringify(reasonsRes));
      });
  }
);

Then("Poliçe cayma talebi header görünmeli", () => {
  policeCayma.headerIcerik("Nolu Poliçe Cayma Talebi");
  policeCayma.headerIcerik(policeNumarasi);
});

Then(
  "Poliçe cayma talebi bilgilendirme metni lifePolicyDeductionsAndPaidAmount servisi ile uyumlu olmalı",
  () => {
    basePage.daireLoaderYok();
    policeCayma.elements.bilgilendirmeMetiniText().then((el) => {
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
  "Poliçe cayma hesap tablosu lifePolicyDeductionsAndPaidAmount servisi ile uyumlu olmalı",
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
        policeCayma.elements
          .iptalHesapMiktar(etiket)
          .should("contain", miktarlar.tl);
      }
      // Eğer foreignCurrencyExists true ise ve USD varsa onu da doğrula
      if (foreignCurrencyExists && miktarlar.usd) {
        policeCayma.elements
          .iptalHesapMiktar(etiket)
          .should("contain", miktarlar.usd);
      }
    }

    function paraMiktarlariniDogrula(label, amounts, foreignCurrencyExists) {
      // Sadece TL varsa doğrulama yap
      if (amounts.tl) {
        policeCayma.elements
          .iptalHesapMiktar(label)
          .should("contain", amounts.tl);
      }
      // Eğer foreignCurrencyExists true ise ve USD varsa onu da doğrula
      if (foreignCurrencyExists && amounts.usd) {
        policeCayma.elements
          .iptalHesapMiktar(label)
          .should("contain", amounts.usd);
      }
    }

    // "Toplam Sigorta Primi" kontrolü için yardımcı fonksiyon
    function toplamSigortaPrimiDogrula() {
      const sigortaPrimi =
        lifePolicyDeductionsAndPaidAmountRes.data
          .deductionsAndPaidAmountCurrencyModel.totalInsurancePremium;

      // Eğer UI'da "Toplam Sigorta Primi" gösterilmişse doğrulama yap
      policeCayma.elements
        .toplamSigortaPrimi()
        .if("visible")
        .then(() => {
          // Eğer görünüyorsa, JSON'daki değeri kontrol et
          policeCayma.elements
            .iptalHesapMiktar("Toplam Sigorta Primi")
            .should("contain", sigortaPrimi.amount);
        });
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
    musteriyeIadeEdilecekTutar = paraMiktarlariniGetir("amountPayCustomer");

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

    toplamSigortaPrimiDogrula();
  }
);

Then("Poliçe cayma Nedeni ile reasons servisi uyumlu olmalı", () => {
  reasonsRes.data.operationReasons.forEach((el) => {
    policeCayma.elements.iptalNedeniContainer().should("contain", el.reason);
  });
});

Then(
  "Poliçe cayma talebi bilgilendirme metni reasons servisi ile uyumlu olmalı",
  () => {
    basePage.daireLoaderYok();
    policeCayma.elements.bilgilendirmeMetiniText().then((el) => {
      expect(
        JSON.stringify(reasonsRes.data.announcementList)
          .replaceAll(" ", "")
          .replaceAll("<br>", "")
      ).to.includes(el.text().replaceAll(" ", ""));
    });
  }
);

When(
  "Random Poliçe cayma Nedeni ile devam ederken saveProductOperationReason ve persuasionMessage servis dönütlerini alıyorum",
  () => {
    cy.intercept("POST", "**/saveProductOperationReason").as(
      "saveProductOperationReason"
    );
    cy.intercept("POST", "**/persuasionMessage").as("persuasionMessage");

    policeCayma.elements.iptalNedeniRadioButon().then((el) => {
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

When(
  "Random Poliçe cayma Nedeni ile devam ederken saveProductOperationReason servis dönütünü alıyorum",
  () => {
    cy.intercept("POST", "**/saveProductOperationReason").as(
      "saveProductOperationReason"
    );

    policeCayma.elements.iptalNedeniRadioButon().then((el) => {
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
  }
);

Then(
  "Poliçe cayma talebi Tutundurma metni saveProductOperationReason servisi ile uyumlu olmalı",
  () => {
    basePage.daireLoaderYok();
    policeCayma.elements.bilgilendirmeMetiniText().then((el) => {
      expect(
        JSON.stringify(
          saveProductOperationReasonRes.data.announcementList.announceModels[0]
            .message
        )
          .replace(/<\/?[^>]+(>|$)/g, "")
          .replaceAll(" ", "")
      ).to.includes(el.text().replaceAll(" ", ""));
    });
  }
);

Then(
  "Poliçe cayma talebi Tutundurma metni persuasionMessage servisi ile uyumlu olmalı",
  () => {
    basePage.daireLoaderYok();
    policeCayma.elements.bilgilendirmeMetiniText().then((el) => {
      expect(
        JSON.stringify(persuasionMessageRes.data.message)
          .replace(/<\/?[^>]+(>|$)/g, "")
          .replaceAll(" ", "")
      ).to.includes(el.text().replaceAll(" ", ""));
    });
  }
);

When(
  "Poliçe cayma için devam butonuna contact-detail, create-flow, persuasion-status ve find-potential-workgroup servisleri ile tıklıyorum",
  () => {
    cy.intercept("POST", "**/contact-detail").as("contactDetail");
    cy.intercept("POST", "**/create-flow").as("createFlow");
    cy.intercept("GET", "**/persuasion-statuses").as("persuasionStatuses");
    cy.intercept("POST", "**/find-potential-workgroup").as(
      "findPotentialWorkgroup"
    );

    basePage.butonTikla("Devam");

    cy.wait("@contactDetail")
      .its("response.body")
      .then((interception) => {
        contactDetailRes = interception;
        cy.log("contactDetailRes: " + JSON.stringify(contactDetailRes));
      });

    cy.wait("@createFlow")
      .its("response.body")
      .then((interception) => {
        createFlowRes = interception;
        cy.log("createFlowRes: " + JSON.stringify(createFlowRes));
      });

    cy.wait("@persuasionStatuses")
      .its("response.body")
      .then((interception) => {
        persuasionStatusesRes = interception;
        cy.log(
          "persuasionStatusesRes: " + JSON.stringify(persuasionStatusesRes)
        );
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

Then(
  "Poliçe cayma talebi sayfasında Aktivite Tipi, Talebin Konusu, Talebin Detay Konusu configdeki gibi görünmeli",
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
  "Poliçe cayma talebi sayfasındaki iletişim bilgileri contact-detail servisi ile uyumlu olmalı",
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
  "Poliçe cayma için devam butonuna lifeRecallMessage, bankInfo ve lifePaymentTypeInfo servisleri ile tıklıyorum",
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
        // cy.log(
        //   "lifePaymentTypeInfoRes: " + JSON.stringify(lifePaymentTypeInfoRes)
        // );
      });
  }
);

Then(
  "Poliçe cayma talebi bilgilendirme metni lifePaymentTypeInfo servisi ile uyumlu olmalı",
  () => {
    basePage.daireLoaderYok();
    policeCayma.elements.bilgilendirmeMetiniText().then((el) => {
      expect(
        JSON.stringify(lifePaymentTypeInfoRes.data.announcementList)
          .replace(/<\/?[^>]+(>|$)/g, "")
          .replaceAll(" ", "")
      ).to.includes(el.text().replaceAll(" ", ""));
    });
  }
);

Then(
  "Poliçe cayma hesap tablosundaki çıkış tarihi lifePaymentTypeInfo servisi ile uyumlu olmalı",
  () => {
    basePage.daireLoaderYok();

    let cikisTarihi = lifePaymentTypeInfoRes.data.exitDate;
    policeIptal.elements
      .iptalHesapMiktar("Çıkış Tarihi")
      .should("contain", cikisTarihi);
  }
);

Then(
  "Poliçe cayma için tanımlı ödeme yöntemi lifePaymentTypeInfo servisi ile uyumlu olmalı",
  () => {
    if (parseFloat(musteriyeIadeEdilecekTutar.tl.replace(",", ".")) > 0) {
      policeCayma.elements.tanimliOdemeKarti().within(() => {
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
      policeCayma.elements
        .tanimliOdemeKarti()
        .should("contain", "Ödeme yöntemi bulunamadı.");
    }
  }
);

When(
  "Poliçe cayma için popup body Evet butonuna lifeSaveExitAddendum ile tıklıyorum",
  () => {
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
  }
);

Then(
  "Poliçe cayma için lifeSaveExitAddendum servisi {string} dönmeli",
  (state) => {
    expect(lifeSaveExitAddendumRes.success.toString()).to.equal(state);
  }
);
