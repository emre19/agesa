let lifeInsuranceSummaryRes;
let policyTypes,
  hayatPolicyCount,
  ferdiKazaPolicyCount,
  saglikPolicyCount,
  gecmisDonemPolicyCount;

class SigortalarSekmesiGirisPage {
  aktifUrunSayisi;

  elements = {
    policeBaslik: () => cy.get(".pR40 .justify-content-between"),
    tümSigortalar: (kartTipi) => cy.get(`div.w32:contains("${kartTipi}")`),
    policeBaslikAdetSayisi: (tabloIsim) =>
      cy.get(`.pB10:contains("${tabloIsim}")`),
    aktifSigortaliMusteri: (filtre) =>
      cy.get(`div:contains("${filtre}") + div table tbody`),
    policeTablo: (policeTabloIsmi) =>
      cy.get(`div:contains("${policeTabloIsmi}") + div table thead`),
    sureSonundaUlasilacakBirikimTutariInfoIcon: () => cy.get(".text-decoration-none .icon-exclamation-circle"),
    toplamBirikimTutariInfoIcon: () => cy.get(".mR10 .icon-exclamation-circle"),
  };

  policeBaslikIcerikDogrulama(item, index) {
    this.elements.policeBaslik().eq(index).should("contain", item);
  }

  aktifPoliceSayisiKontrolEdiyorum(kartTipi) {
    return this.elements
      .tümSigortalar(kartTipi)
      .contains("Adet")
      .invoke("text")
      .then((text) => {
        this.aktifUrunSayisi = parseInt(text.trim().split(" ")[0]); // Metni atama ve boşlukları temizleme
        return this.aktifUrunSayisi;
      });
  }

  sigortalarKartiIcerigiDogrulama(icerik, kartTipi) {
    this.elements
      .tümSigortalar(kartTipi)
      .within(() => cy.get("div").should("contain", icerik));
  }

  sigortaSayfasindakiTablolarinSutunIsimleriniDogrulama(item, policeTabloIsmi) {
    this.elements
      .policeTablo(policeTabloIsmi)
      .within(() => cy.get("th").should("contain", item));
  }

  hayatUrunYokKontrol(kartTipi) {
    this.elements
      .tümSigortalar(kartTipi)
      .should("contain", `${kartTipi} ürünü bulunmamaktadır.`);
  }

  lifeInsuranceSummaryResponseKaydet() {
    cy.wait(`@lifeInsuranceSummary`)
      .its("response.body")
      .then((interception) => {
        lifeInsuranceSummaryRes = interception;
      });
  }

  lifeInsuranceSummaryPolicyTypeKaydet() {
    // Tüm policyType değerlerini bir array'e atıyoruz
    policyTypes = lifeInsuranceSummaryRes.data.insuranceSummaryList.map(
      (item) => item.policyType
    );

    hayatPolicyCount = (
      lifeInsuranceSummaryRes.data.insuranceSummaryList.find(
        (item) => item.policyType === "Hayat - Aktif Sigortalar"
      ) || {}
    ).policyCount;
    ferdiKazaPolicyCount = (
      lifeInsuranceSummaryRes.data.insuranceSummaryList.find(
        (item) => item.policyType === "Ferdi Kaza - Aktif Sigortalar"
      ) || {}
    ).policyCount;
    saglikPolicyCount = (
      lifeInsuranceSummaryRes.data.insuranceSummaryList.find(
        (item) => item.policyType === "Sağlık - Aktif Sigortalar"
      ) || {}
    ).policyCount;
    gecmisDonemPolicyCount = (
      lifeInsuranceSummaryRes.data.insuranceSummaryList.find(
        (item) => item.policyType === "Geçmiş Dönem Sigortaları"
      ) || {}
    ).policyCount;
  }

  policyCountDegeriniAl(policeTablosu) {
    let policyCount;

    // policeTablosu değeri kontrol edilerek uygun policyCount atanır
    if (policeTablosu === "Geçmiş Dönem Poliçeleri") {
      policyCount = gecmisDonemPolicyCount;
    } else if (policeTablosu === "Hayat - Aktif Sigortalar") {
      policyCount = hayatPolicyCount;
    } else if (policeTablosu === "Ferdi Kaza - Aktif Sigortalar") {
      policyCount = ferdiKazaPolicyCount;
    } else if (policeTablosu === "Sağlık - Aktif Sigortalar") {
      policyCount = saglikPolicyCount;
    } else {
      throw new Error(`Beklenen Poliçe Tablosu ismi bulunamadı`);
    }
    return policyCount;
  }

  policeTablosuAdetSayisininServisleKontrolu(policeTablosu) {
    // Önce policyCount'u policeTablosu'na göre belirleyelim
    let policyCount = this.policyCountDegeriniAl(policeTablosu);

    // Şimdi UI'daki değer ile policyCount'u karşılaştıralım
    this.elements
      .policeBaslikAdetSayisi(policeTablosu)
      .contains("Adet")
      .invoke("text")
      .then((extractedNumber) => {
        extractedNumber = parseInt(extractedNumber.trim().split(" ")[0]); // "16 Adet" -> 16
        // extractedNumber ile policyCount'u karşılaştır
        expect(policyCount).to.equal(extractedNumber);
      });
  }

  policeTablosuSatirSayisininServisleKontrolu(policeTablosu) {
    // Önce policyCount'u policeTablosu'na göre belirleyelim
    let policyCount = this.policyCountDegeriniAl(policeTablosu);

    this.elements
      .aktifSigortaliMusteri(policeTablosu)
      .find("tr")
      .then(($rows) => {
        // Bulunan aktif müşteri sayısını kontrol eder
        const rowCount = $rows.length;
        expect(rowCount).to.equal(policyCount);
      });
  }

  policeTablosuSatirlardakiDatalarinServisleKontrolu(policeTablosu) {
    let selectedPoliceTablosu;

    if (policeTablosu === "Geçmiş Dönem Poliçeleri") {
      selectedPoliceTablosu = policeTablosu.replace(
        "Poliçeleri",
        "Sigortaları"
      );
    } else {
      selectedPoliceTablosu = policeTablosu;
    }

    // Öncelikle, policyType'a göre ilgili poliçeyi bulalım
    const selectedPolicy =
      lifeInsuranceSummaryRes.data.insuranceSummaryList.find(
        (item) => item.policyType === selectedPoliceTablosu
      );

    cy.wrap(selectedPolicy.salesInsuranceInfoList).then((el) => {
      for (let i = 0; i < el.length; i++) {
        cy.wrap(selectedPolicy.salesInsuranceInfoList[i]).then((icerik) => {
/*           cy.contains(policeTablosu)
            .parent()
            .next() // Sonraki sibling element olan tabloya geçer
            .find("tbody tr") */
            this.elements
            .aktifSigortaliMusteri(policeTablosu)
            .find("tr")
            .eq(i)
            .should("contain", icerik.policyPrefix + "" + icerik.policyNo)
            .and("contain", icerik.productName)
            .and("contain", icerik.policyStartDate)
            .and(
              "contain",
              icerik.collateralAmount.amount +
                " " +
                icerik.collateralAmount.currency
            )
            .and("contain", icerik.status);
        });
      }
    });
  }

  karttakiAdetSayisininServisleKontrolu(kartIsmi, policeTablosu) {
    this.aktifPoliceSayisiKontrolEdiyorum(kartIsmi).then((extractedNumber) => {
      // Önce policyCount'u policeTablosu'na göre belirleyelim
      let policyCount = this.policyCountDegeriniAl(policeTablosu);

      expect(policyCount).to.equal(extractedNumber);
    });
  }

  karttakiToplamTeminatMiktarinınServisleKontrolu(kartIsmi, policeTablosu) {
    // Öncelikle, policyType'a göre ilgili poliçeyi bulalım
    const selectedPolicy =
      lifeInsuranceSummaryRes.data.insuranceSummaryList.find(
        (item) => item.policyType === policeTablosu
      );
    let toplamTeminat =
      selectedPolicy.totalAmountCurrencyList[0].amount +
      " " +
      selectedPolicy.totalAmountCurrencyList[0].currency;

    this.elements
      .tümSigortalar(kartIsmi)
      .within(() => cy.get("div").should("contain", toplamTeminat));
  }

  policeTablosuSureSonundaUlasilacakBirikimTutariDatalarininServisleKontrolu = (
    policeTablosu
  ) => {
    // Öncelikle, policyType'a göre ilgili poliçeyi bulalım
    const selectedPolicy =
      lifeInsuranceSummaryRes.data.insuranceSummaryList.find(
        (item) => item.policyType === policeTablosu
      );

    cy.wrap(selectedPolicy.salesInsuranceInfoList).then((el) => {
      for (let i = 0; i < el.length; i++) {
        cy.wrap(selectedPolicy.salesInsuranceInfoList[i]).then((icerik) => {
          const expectedAmount =
            icerik.savingAmount && icerik.savingAmount.amount !== null
              ? icerik.savingAmount.amount + " " + icerik.savingAmount.currency
              : "-"; // Eğer savingAmount null ise "-" kullanacağız

          this.elements
            .aktifSigortaliMusteri(policeTablosu)
            .find("tr")
            .eq(i) // İlgili satırı bul
            .find("td") // Bu satırdaki tüm td'leri bul
            .last() // En sonuncu td'yi seç
            .should("contain", expectedAmount); // Beklenen değeri en sonuncu td'de kontrol et
        });
      }
    });
  }

  sureSonundaUlasilacakBirikimTutariInfoIconMesajKontrolu(){

    this.elements.sureSonundaUlasilacakBirikimTutariInfoIcon().trigger("mouseover");

    cy.get(".proto-tooltip-body")
      .invoke("text")
      .then((text) => {
        // Announcement listesi içindeki mesajlarla karşılaştırma
        const messages =
          lifeInsuranceSummaryRes.data.announcementList.announceModels.map(
            (model) => model.message
          );

        // valueText, messages içindeki herhangi bir mesajla eşleşmiyorsa test hata verir
        expect(messages).to.include(text);

        this.elements
        .sureSonundaUlasilacakBirikimTutariInfoIcon()
        .trigger("mouseout");
      });
  }

  toplamBirikimTutariInfoIconMesajKontrolu(){

    this.elements.toplamBirikimTutariInfoIcon().trigger("mouseover");

    cy.get(".proto-tooltip-body")
      .invoke("text")
      .then((text) => {
        // Announcement listesi içindeki mesajlarla karşılaştırma
        const messages =
          lifeInsuranceSummaryRes.data.announcementList.announceModels.map(
            (model) => model.message
          );

        // valueText, messages içindeki herhangi bir mesajla eşleşmiyorsa test hata verir
        expect(messages).to.include(text);

        this.elements
        .toplamBirikimTutariInfoIcon()
        .trigger("mouseout");
      });
  }
}

export const sigortalarSekmesiGiris = new SigortalarSekmesiGirisPage();
