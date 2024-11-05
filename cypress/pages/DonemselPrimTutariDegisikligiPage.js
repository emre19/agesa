import { basePage } from "@pages/BasePage";

const prefix = Cypress.env("POLICE_NO").charAt(0);
const policyNo = Cypress.env("POLICE_NO").slice(-6);

let customerPremiumAmountInformationRes;
let premiumMin;

class DonemselPrimTutariDegisikligiPage {
  elements = {
    altiCizgiliUrunVePolice: () => cy.get("a.underline span"),
    donemselPrimTutariText: () => cy.get(".mL10.mT5.mB10 span"),
    bilgilendirmeMetniText: () => cy.get(".announcement-content"),
    yeniDonemselPrimInput: () => cy.get("#newSavingAmount"),
    gecersizPrimTutariDegistirUyariMesaji: () => cy.get(".invalid-feedback"),
  };

  donemselPrimTutariPoliceVeUrunAdiAltiCizgili() {
    this.elements
      .altiCizgiliUrunVePolice()
      .should("contain", prefix)
      .and("contain", policyNo)
      .and("contain", Cypress.config("custom").urun_adi);
  }

  donemselPrimTutariDegerininServisleKarsilastirma() {
    const selectedPremiumAmount =
      customerPremiumAmountInformationRes.data.currentPeriodicPremiumAmount
        .amount;

    const selectedPremiumCurrency =
      customerPremiumAmountInformationRes.data.currentPeriodicPremiumAmount
        .currency;

    this.elements
      .donemselPrimTutariText()
      .should("contain", selectedPremiumAmount)
      .and("contain", selectedPremiumCurrency);
  }

  customerPremiumAmountInformationRopServisIleUrunSec() {
    cy.intercept("GET", "**/customerPremiumAmountInformationRop*").as(
      "customerPremiumAmountInformation"
    );

    basePage.policeNumarasiIleUrunSec();

    cy.wait("@customerPremiumAmountInformation")
      .its("response.body")
      .then((interception) => {
        customerPremiumAmountInformationRes = interception;
        cy.log(
          "customerPremiumAmountInformationRes: " +
            JSON.stringify(customerPremiumAmountInformationRes)
        );
      });
  }

  donemselPrimTutariBilgilendirmeMesajiKontrolu() {
    const announcementListAnnounceModelsMessage =
      customerPremiumAmountInformationRes.data.announcementList
        .announceModels[1].message;

    this.elements
      .bilgilendirmeMetniText()
      .invoke("text")
      .then((text) => {
        let cleanText = announcementListAnnounceModelsMessage.replace(
          /<br>/g,
          ""
        );
        expect(text).to.equal(cleanText);
      });
  }

  gecersizYeniDonemselPrimGirisi() {
    premiumMin = customerPremiumAmountInformationRes.data.premiumMin;

    let IntegerGecersizPrimTutari = parseInt(premiumMin) - 1;
    let StringGecersizPrimTutari = IntegerGecersizPrimTutari.toString();

    this.elements.yeniDonemselPrimInput().type(StringGecersizPrimTutari);
    basePage.butonClick("Devam");
  }

  gecersizPrimTutariHataMesajiKontrolu(){
    let premiumMinFormatted = premiumMin.toString().replace(".", ",");

    const hataText = "Yeni dönemsel prim tutarı değeri " + premiumMinFormatted + " " + currentPeriodicPremiumAmountCurrency + "  ile " + currentPeriodicPremiumAmount + " " + currentPeriodicPremiumAmountCurrency + " arasında olabilir";

    this.elements
    .gecersizPrimTutariDegistirUyariMesaji()
    .invoke("text")
    .then((text) => {
      expect(text).to.equal(hataText);
    });
  }
}
export const donemselPrimTutariDegisikligiPage =
  new DonemselPrimTutariDegisikligiPage();
