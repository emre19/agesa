import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { basePage } from "@pages/BasePage";
import { tahsilatsizlikPage } from "@pages/TahsilatsizlikPage";
import dayjs from "dayjs";
import "dayjs/locale/tr";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

let lifeInsuranceSummaryDetailRes,
  lifeOverduePaymentDetailsRes,
  customerPaymentMethodsRes,
  seciliOdemeYontemi,
  seciliBankaAdi,
  seciliOdemeTipi,
  odenecekToplamTutarText,
  payLifeOverduePaymentsRes;

const prefix = Cypress.env("POLICE_NO").charAt(0);
const policyNo = Cypress.env("POLICE_NO").match(/(?<=[-A-Z])\d+/)[0];
const policeNumarasi = prefix + "-" + policyNo;

Given(
  "Tahsilatsızlık olan ürünü lifeInsuranceSummaryDetail ile seçiyorum",
  () => {
    cy.intercept("GET", "**/lifeInsuranceSummaryDetail*").as(
      "lifeInsuranceSummaryDetail"
    );

    basePage.policeNumarasiIleUrunSec();

    cy.wait("@lifeInsuranceSummaryDetail")
      .its("response.body")
      .then((interception) => {
        lifeInsuranceSummaryDetailRes = interception;
        cy.log(
          "lifeInsuranceSummaryDetailRes: " + lifeInsuranceSummaryDetailRes
        );
      });
  }
);

When(
  "Tahsilatsızlık Detayı İncele butonuna lifeOverduePaymentDetails ile tıklıyorum",
  () => {
    cy.intercept("GET", "**/lifeOverduePaymentDetails*").as(
      "lifeOverduePaymentDetails"
    );

    basePage.butonTikla("Tahsilatsızlık Detayı İncele");

    cy.wait("@lifeOverduePaymentDetails")
      .its("response.body")
      .then((interception) => {
        lifeOverduePaymentDetailsRes = interception;
        // cy.log("lifeOverduePaymentDetailsRes: " + JSON.stringify(lifeOverduePaymentDetailsRes));
      });
  }
);

Then("Tahsilatsızlık Bilgisi header görünmeli", () => {
  tahsilatsizlikPage.headerIcerik("Tahsilatsızlık Bilgisi");
});

Then("Poliçe no ve ürün adı bilgisi altı çizili olarak görünmeli", () => {
  tahsilatsizlikPage.elements
    .headerAltiCizili()
    .should("contain", policeNumarasi)
    .and("contain", Cypress.config("custom").urun_adi);
});

Then("Tahsilatsızlık tablosu aşağıdaki başlıkları içermeli", (table) => {
  table
    .raw()
    .flat()
    .forEach((item) => {
      tahsilatsizlikPage.elements
        .tahsilatsizlikTabloHeader()
        .should("contain", item);
    });
});

Then(
  "Tahsilatsızlık durum bilgisi her zaman ödenmemiş olarak görünmeli",
  () => {
    tahsilatsizlikPage.elements.tahsilatsizlikDurumBilgisi().each((el) => {
      cy.wrap(el).should("contain", "Ödenmemiş");
    });
  }
);

Then("Ödenecek Toplam Tutar sıfır olmalı", () => {
  tahsilatsizlikPage.elements
    .odenecekToplamTutar()
    .should("contain", "0,00 TL")
    .contains("0,00 USD")
    .if()
    .should("be.visible");
});

When("{int}. sıradaki tahsilatsızlık vadesini seçiyorum", (vadeSirasi) => {
  tahsilatsizlikPage.elements.noluVade(vadeSirasi).check({ force: true });
});

Given(
  "{int}. sıradaki tahsilatsızlık vadesinindeki seçimi kaldırıyorum",
  (vadeSirasi) => {
    tahsilatsizlikPage.elements.noluVade(vadeSirasi).uncheck({ force: true });
  }
);

Then("{string} mesajı kırmızı olarak görünmeli", (mesaj) => {
  tahsilatsizlikPage.elements.spanText(mesaj).should("have.class", "error");
});

Then("Tüm tahsilatsızlık nedeni aşağı oklarını tıklıyorum", () => {
  tahsilatsizlikPage.elements.asagiOk().each((el) => {
    cy.wrap(el).click();
  });
});

Then(
  "lifeOverdueDetailsde boş dönen lifeOverduePayments ile tahsilatsızlık nedeni uyumlu olmalı",
  () => {
    const bosDonenDetaySayisi =
      lifeOverduePaymentDetailsRes.data.lifeOverduePayments.filter(
        (payment) => payment.lifeOverdueDetails.length === 0
      ).length;

    tahsilatsizlikPage.elements
      .cekimDenemesiDetayYok()
      .should("have.length", bosDonenDetaySayisi);
  }
);

Then(
  "lifeOverdueDetailsde dolu dönen lifeOverduePayments ile tahsilatsızlık nedeni uyumlu olmalı",
  () => {
    const doluDonenDetay =
      lifeOverduePaymentDetailsRes.data.lifeOverduePayments.filter(
        (payment) => payment.lifeOverdueDetails.length !== 0
      );
    const ilkDoluDetayTarih = doluDonenDetay[0].paymentDate;

    tahsilatsizlikPage.elements
      .tahsilatsizlikNedenTarihBazli(ilkDoluDetayTarih)
      .should("contain", doluDonenDetay[0].paymentAmount.amount);

    for (let i = 0; i < doluDonenDetay[0].lifeOverdueDetails.length; i++) {
      tahsilatsizlikPage.elements
        .tahsilatsizlikNedenTarihBazli(ilkDoluDetayTarih)
        .next()
        .should(
          "contain",
          doluDonenDetay[0].lifeOverdueDetails[i].paymentOverdueDate.replaceAll(
            "-",
            "."
          )
        )
        .and("contain", doluDonenDetay[0].lifeOverdueDetails[i].overdueTime)
        .and("contain", doluDonenDetay[0].lifeOverdueDetails[i].overdueReason);
    }
  }
);

Then(
  "Ödenmeyen Vadeler tablosu ile Ödenecek Toplam Tutar tablosundaki tarihler, tutarlar ve toplam uyumlu olmalı",
  () => {
    let tahsilatsizlikVadeTarihleri = [];
    let tahsilatsizlikVadeTutarlariUSD = [];
    let tahsilatsizlikVadeTutarlariTL = [];
    let odemeTablosuTarihleri = [];
    let odemeTablosuTutarlariUSD = [];
    let odemeTablosuTutarlariTL = [];
    let odemeToplamTutarUSD = 0;
    let odemeToplamTutarTL = 0;

    // Ödenmeyen Vadeler tablosundaki tarihleri al
    tahsilatsizlikPage.elements.odenmeyenVadelerTablodakiTarih().each((el) => {
      let rawDate = el.text().trim();
      let formattedDate = dayjs(rawDate, "DD-MM-YYYY")
        .locale("tr")
        .format("MMMM YYYY");
      if (formattedDate === "Invalid Date") {
        cy.log(`Hatalı tarih formatı: ${rawDate}`);
      }
      tahsilatsizlikVadeTarihleri.push(formattedDate);
    });

    // Ödenmeyen Vadeler tablosundaki USD tutarları al
    tahsilatsizlikPage.elements.odenmeyenVadelerTablodakiDeger().each((el) => {
      let tutar;
      if (el.text().includes("USD")) {
        tutar = parseFloat(
          el
            .text()
            .trim()
            .split(" USD")[0]
            .replace(/[^0-9,-]+/g, "")
            .replace(",", ".")
        );
        tahsilatsizlikVadeTutarlariUSD.push(tutar);
      }
    });

    // Ödenmeyen Vadeler tablosundaki TL tutarları al
    tahsilatsizlikPage.elements.odenmeyenVadelerTablodakiDeger().each((el) => {
      let tutar = parseFloat(
        el
          .text()
          .trim()
          .split("(")[1]
          .split(" TL")[0]
          .replace(/[^0-9,-]+/g, "")
          .replace(",", ".")
      );
      tahsilatsizlikVadeTutarlariTL.push(tutar);
      // cy.log("TL TUTAR: " + tutar);
    });

    // Tüm vadeleri seç
    tahsilatsizlikPage.elements.vadeCheckbox().check({ force: true });

    // Ödenecek Toplam Tutar tablosundaki tarihleri al
    tahsilatsizlikPage.elements
      .odenecekToplamTutarTablodakiTarih()
      .each((el) => {
        odemeTablosuTarihleri.push(el.text().trim());
      });

    // Ödenecek Toplam Tutar tablosundaki USD tutarları al
    tahsilatsizlikPage.elements
      .odenecekToplamTutarTablodakiDeger()
      .each((el) => {
        let tutar;
        if (el.text().includes("USD")) {
          tutar = parseFloat(
            el
              .text()
              .trim()
              .split(" USD")[0]
              .replace(/[^0-9,-]+/g, "")
              .replace(",", ".")
          );
          odemeTablosuTutarlariUSD.push(tutar);
        }
      });

    // Ödenmeyen Vadeler tablosundaki TL tutarları al
    tahsilatsizlikPage.elements
      .odenecekToplamTutarTablodakiDeger()
      .each((el) => {
        let tutar = parseFloat(
          el
            .text()
            .trim()
            .split("(")[1]
            .split(" TL")[0]
            .replace(/[^0-9,-]+/g, "")
            .replace(",", ".")
        );
        odemeTablosuTutarlariTL.push(tutar);
        cy.log("odemeTablosuTutarlariTL: " + tutar);
      });

    // Tarihleri karşılaştır
    cy.wrap(tahsilatsizlikVadeTarihleri).each((tarih) => {
      expect(odemeTablosuTarihleri).to.include(tarih);
    });

    // USD Tutarları karşılaştır ve topla tutarı hesapla
    let tahsilatsizlikToplamUSD = 0;
    cy.wrap(tahsilatsizlikVadeTutarlariUSD).each((tutar) => {
      tahsilatsizlikToplamUSD += tutar;
      expect(odemeTablosuTutarlariUSD).to.include(tutar);
    });

    // TL Tutarları karşılaştır ve topla tutarı hesapla
    let tahsilatsizlikToplamTL = 0;
    cy.wrap(tahsilatsizlikVadeTutarlariTL).each((tutar) => {
      tahsilatsizlikToplamTL += tutar;
      expect(odemeTablosuTutarlariTL).to.include(tutar);
    });

    // Ödenecek Toplam Tutar tablosundaki toplam tutarı al ve karşılaştır
    tahsilatsizlikPage.elements.odenecekToplamTutarMiktari().then((el) => {
      odemeToplamTutarUSD = parseFloat(
        el
          .text()
          .trim()
          .split(" USD")[0]
          .replace(/[^0-9,-]+/g, "")
          .replace(",", ".")
      );

      odemeToplamTutarTL = parseFloat(
        el
          .text()
          .trim()
          .split("(")[1]
          .split(" TL")[0]
          .replace(/[^0-9,-]+/g, "")
          .replace(",", ".")
      );
      // Toplamları karşılaştır
      let ikiHaneUSD = tahsilatsizlikToplamUSD.toFixed(2);

      expect(ikiHaneUSD).to.eq(odemeToplamTutarUSD.toString());
      // TL tutarlarda küsurat farkı olduğu için tahsilatsizlikToplamTL olarak hesaplanan tutar
      // sayfada görünen odemeToplamTutarTL tutarından +/- 1 TL fazla oabilir
      expect(odemeToplamTutarTL).to.be.within(tahsilatsizlikToplamTL - 1, tahsilatsizlikToplamTL + 1)
    });
  }
);

Then("Tahsilatsızlık sayfasında {string} header görünmeli", (baslik) => {
  tahsilatsizlikPage.headerIcerik(baslik);
});

When("Açık Vadeleri Öde butonuna customerPaymentMethods ile tıklıyorum", () => {
  cy.intercept("GET", "**/customerPaymentMethods*").as(
    "customerPaymentMethods"
  );

  basePage.butonTikla("Açık Vadeleri Öde");

  cy.wait("@customerPaymentMethods")
    .its("response.body")
    .then((interception) => {
      customerPaymentMethodsRes = interception;
      // cy.log(
      //   "customerPaymentMethods: " + JSON.stringify(customerPaymentMethodsRes)
      // );
    });
});

Then(
  "Tahsilatsızlık tanımlı ödeme yöntemi ile customerPaymentMethods uyumlu olmalı",
  () => {
    const selectedPayment =
      customerPaymentMethodsRes.data.paymentMethodsList.find(
        (method) => method.selectedPaymentType
      );
    seciliOdemeYontemi =
      selectedPayment.ibanNo ||
      selectedPayment.accountNumber ||
      selectedPayment.creditCardNo;
    seciliBankaAdi = selectedPayment.bankName;
    seciliOdemeTipi = selectedPayment.paymentType;
    cy.get("div.border-primary")
      .should("contain", seciliBankaAdi)
      .and("contain", seciliOdemeTipi)
      .and("contain", seciliOdemeYontemi);
  }
);

Then("Tahsilatsızlık Ödenecek Toplam Tutarı alıyorum", () => {
  basePage.elements.odenecekToplamTutar().then((el) => {
    odenecekToplamTutarText = el.text().split(" USD")[0];
    // cy.log(odenecekToplamTutarText)
  });
});

Then(
  "Açık Vadeleri Öde popup ile customerPaymentMethods ve Ödenecek Toplam Tutar uyumlu olmalı",
  () => {
    basePage.elements
      .popupBody()
      .should("contain", odenecekToplamTutarText)
      .and("contain", seciliBankaAdi)
      .and("contain", seciliOdemeTipi)
      .and("contain", seciliOdemeYontemi);
  }
);

When(
  "Açık Vadeleri Ödeme Popup body Evet butonuna payLifeOverduePayments ile tıklıyorum",
  () => {
    cy.intercept("POST", "**/payLifeOverduePayments").as(
      "payLifeOverduePayments"
    );

    basePage.popupBodyButonTikla("Evet");

    cy.wait("@payLifeOverduePayments")
      .its("response.body")
      .then((interception) => {
        payLifeOverduePaymentsRes = interception;
        cy.log(
          "payLifeOverduePaymentsRes: " +
            JSON.stringify(payLifeOverduePaymentsRes)
        );
      });
  }
);

Then(
  "payLifeOverduePayments servisindeki overallPaymentStatus {string} dönmeli",
  (state) => {
    expect(
      payLifeOverduePaymentsRes.data.overallPaymentStatus.toString()
    ).to.equal(state);
  }
);

Then(
  "Açık Vadeleri Ödeme bilgilendirme metni ile payLifeOverduePayments uyumlu olmalı",
  () => {
    basePage.elements
      .popupBody()
      .should(
        "contain",
        payLifeOverduePaymentsRes.data.overdueResult[0].overdueDate.toString()
      )
      .and(
        "contain",
        payLifeOverduePaymentsRes.data.announcementList.announceModels[0].message.toString()
      );
  }
);

let tahsilatsizVadeSayisi;
Given("Tahsilatsızlık olan vadelerin sayısını alıyorum", () => {
  tahsilatsizlikPage.elements.tahsilatsizlikInfoBaner().then((el) => {
    tahsilatsizVadeSayisi = parseInt(el.text().trim().split(" ")[0]);

    cy.log("el.text(): " + el.text());
    cy.log("el.text().trim(): " + el.text().trim());
    cy.log('el.text().trim().split(" ")[0]: ' + el.text().trim().split(" ")[0]);
    cy.log("tahsilatsizVadeSayisi: " + tahsilatsizVadeSayisi);
  });
});

Then(
  "Tahsilatsızlık olan vade sayısı ile tahsilatsızlık tablosu uyumlu olmalı",
  () => {
    tahsilatsizlikPage.elements.tabloSatir().then((el) => {
      expect(el.length).to.be.within(
        tahsilatsizVadeSayisi,
        tahsilatsizVadeSayisi + 1
      );
    });
  }
);
