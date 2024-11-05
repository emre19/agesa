import { basePage} from "./BasePage";
import { sigortaDetayGiris } from "./SigortaDetayGirisPage";

let lifePolicyTaxDiscountCalculateRes, lifeInsuranceSummaryDetailRes;

class VergiIndirimiHesaplaPage {
  elements = {
    radioButtonVergiIndirimi: () => cy.get(".clearfix"),
    inputField: (textAlani) =>
      cy.get(
        `.w-50 .proto-input-container.theme.with-label label:contains("${textAlani}")`
      ),
  };

  selectedHizliTarihSecimiKontrol(radioButton) {
    this.elements
      .radioButtonVergiIndirimi()
      .within(() =>
        cy.get(`div:contains("${radioButton}")`).should("have.class", "checked")
      );
  }

  kurDegerleriKontrolu() {
    const currencyRates = {
      USD: null,
      EUR: null,
    };

    //servisteki arraylari dolaş ve usd veya eur buldugunda ona göre miktarları variableye ata
    lifeInsuranceSummaryDetailRes.data.generalCurrencyRates.forEach((rate) => {
      if (rate.currency === "USD") {
        currencyRates.USD = `${rate.amount} TL`;
      } else if (rate.currency === "EUR") {
        currencyRates.EUR = `${rate.amount} TL`;
      }
    });

    const USD = "Günlük USD kur değeri: " + currencyRates.USD;
    const EUR = "Günlük EUR kur değeri: " + currencyRates.EUR;

    basePage.elements
      .popupBody()
      .invoke("text")
      .then((UItext) => {
        expect(UItext).contain(USD);
        expect(UItext).contain(EUR);
      });
  }

  textAlaninaMiktarGir(textAlani, miktar) {
    this.elements.inputField(textAlani).parent().find("input").type(miktar);
  }

  hesaplaButonTikla(butonIsmi) {
    cy.intercept("POST", "**/lifePolicyTaxDiscountCalculate").as(
      "lifePolicyTaxDiscountCalculate"
    );

    basePage.elements.popupBodyButon(butonIsmi).click();

    cy.wait("@lifePolicyTaxDiscountCalculate")
      .its("response.body")
      .then((interception) => {
        lifePolicyTaxDiscountCalculateRes = interception;
      });
  }

  hesapKontroluUcretliCalısan() {
    const labels = [
      "Toplam Vergi İndirimi",
      "Yıllık Gelir Vergisi Matrahı",
      "Gelir Vergisi(indirimli)",
      "Gelir Vergisi(indirimsiz)",
    ];

    const hesapSonucRes = lifePolicyTaxDiscountCalculateRes.data;

    const toplamVergiIndirimi = hesapSonucRes.totalTaxDiscountAmount.amount;
    const yillikGelirVergisiMatrahi = hesapSonucRes.incomeTaxBaseAmount.amount;
    const gelirVergisiIndirimli =
      hesapSonucRes.incomeTaxWithDiscountAmount.amount;
    const gelirVergisiIndirimsiz =
      hesapSonucRes.incomeTaxWithoutDiscountAmount.amount;

    basePage.elements.popupBody().within(() => {
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
              if (labelText === "Toplam Vergi İndirimi") {
                expect(valueText).to.contain(toplamVergiIndirimi);
              } else if (labelText === "Yıllık Gelir Vergisi Matrahı") {
                expect(valueText).to.contain(yillikGelirVergisiMatrahi);
              } else if (labelText === "Gelir Vergisi(indirimli)") {
                expect(valueText).to.contain(gelirVergisiIndirimli);
              } else if (labelText === "Gelir Vergisi(indirimsiz)") {
                expect(valueText).to.contain(gelirVergisiIndirimsiz);
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

  hesapKontroluSerbestCalısan() {
    const labels = [
      "Toplam Vergi İndirimi",
      "Aylık Gelir Vergisi Matrahı",
      "Gelir Vergisi(indirimli)",
      "Gelir Vergisi(indirimsiz)",
    ];

    const hesapSonucRes = lifePolicyTaxDiscountCalculateRes.data;

    const toplamVergiIndirimi = hesapSonucRes.totalTaxDiscountAmount.amount;
    const aylikGelirVergisiMatrahi = hesapSonucRes.incomeTaxBaseAmount.amount;
    const gelirVergisiIndirimli =
      hesapSonucRes.incomeTaxWithDiscountAmount.amount;
    const gelirVergisiIndirimsiz =
      hesapSonucRes.incomeTaxWithoutDiscountAmount.amount;

    basePage.elements.popupBody().within(() => {
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
              if (labelText === "Toplam Vergi İndirimi") {
                expect(valueText).to.contain(toplamVergiIndirimi);
              } else if (labelText === "Aylık Gelir Vergisi Matrahı") {
                expect(valueText).to.contain(aylikGelirVergisiMatrahi);
              }  else if (labelText === "Gelir Vergisi(indirimli)") {
                expect(valueText).to.contain(gelirVergisiIndirimli);
              } else if (labelText === "Gelir Vergisi(indirimsiz)") {
                expect(valueText).to.contain(gelirVergisiIndirimsiz);
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

  lifeInsuranceSummaryDetailResponseKaydet(){
    cy.intercept("GET", `**/lifeInsuranceSummaryDetail*`).as(
      "lifeInsuranceSummaryDetail"
    );

    basePage.policeNumarasiIleUrunSec();

    cy.wait(`@lifeInsuranceSummaryDetail`)
      .its("response.body")
      .then((interception) => {
        lifeInsuranceSummaryDetailRes = interception;
      });
  }

  vergiIndirimiKontrolu() {

    const hesapSonucRes = lifePolicyTaxDiscountCalculateRes.data;
    const toplamVergiIndirimiAmount = hesapSonucRes.totalTaxDiscountAmount.amount;
    const toplamVergiIndirimiCurrency = hesapSonucRes.totalTaxDiscountAmount.currency;

    sigortaDetayGiris.elements
      .primTutarlari("Vergi İndirimi")
      .find(".insurance-summary-text-right")
      .invoke("text")
      .then((vergiIndirimi) => {
          expect(vergiIndirimi).to.contains(toplamVergiIndirimiAmount);
          expect(vergiIndirimi).to.contains(toplamVergiIndirimiCurrency);
      });
  }
}

export const vergiIndirimiHesapla = new VergiIndirimiHesaplaPage();
