import { basePage } from "./BasePage";
class EtkilesimGecmisiPage {
  elements = {
    navigasyon: () => cy.get(".interaction-history"),
    loader: () => cy.get("#loader-sm"),
    altSekme: (sekme) =>
      cy.get(`.interaction-history div:contains("${sekme}")`),
    etkilesimGecmisiTablo: () => cy.get(".interaction-history-table"),
    etkilesimGecmisiTabloTarihSatir: (satirNo) =>
      cy
        .get(".proto-table-body >tr")
        .eq(satirNo - 1)
        .find("td")
        .eq(2),
    etkilesimGecmisiTabloDurumSatir: (satirNo) =>
      cy
        .get(".proto-table-body >tr")
        .eq(satirNo - 1)
        .find("td")
        .eq(9),
    etkilesimGecmisiTabloEtkilesimTipiSatir: (satirNo) =>
      cy
        .get(".proto-table-body >tr")
        .eq(satirNo - 1)
        .find("td")
        .eq(5),
    gonderiGecmisiTablo: () => cy.get(".posting-history-table"),
    dokumanGoruntulemeTablo: () => cy.get(".document-view-table"),
    tarihInput: (tarihTipi) =>
      cy
        .get(`div.proto-label-container:contains("${tarihTipi}")`)
        .parent()
        .find("div.react-datepicker-wrapper input"),
    kanalInput: () => cy.get(".messaging-type input"),
    gonderimTarihiFiltreIcon: () => cy.get(".icon-policy-app-menu"),
    tarihAralıgıGirTabi: () => cy.get("#unique_id_tabitem_1"),
    baslangiTarihiGun: () => cy.get('input[name="startDay"]'),
    baslangiTarihiAy: () => cy.get('input[name="startMonth"]'),
    baslangiTarihiYil: () => cy.get('input[name="startYear"]'),
    bitisTarihiGun: () => cy.get('input[name="endDay"]'),
    bitisTarihiAy: () => cy.get('input[name="endMonth"]'),
    bitisTarihiYil: () => cy.get('input[name="endYear"]'),
    filtreSilmeCarpiIsareti: () => cy.get('.proto-table-header_content--badge .icon-close'),
  };

  sekmeSecme(sekme) {
    this.elements
      .navigasyon()
      .within(() =>
        cy.get(`li:contains("${sekme}")`).should("be.visible").click()
      );
  }

  sekmeSayisi() {
    this.elements
      .navigasyon()
      .within(() => cy.get("div").should("have.lengthOf", 4));
  }

  loaderYok() {
    this.elements.loader().should("not.exist");
  }

  altSekmeSecme(sekme) {
    if (sekme === "Gönderi Geçmişi") {
      this.elements.altSekme(sekme).first().click();
    } else if (sekme === "Gönderi Geçmişi - Arşiv") {
      this.elements.altSekme(sekme).last().click();
    } else {
      this.elements.altSekme(sekme).click();
    }
    this.loaderYok();
  }

  aktifAltSekmeHangisi(sekme) {
    this.elements.altSekme(sekme).should("have.class", "proto-tab-active");
  }

  etkilesimGecmisiAltSekmeIcerigiDogrulama(sutunBaslıgı) {
    this.elements
      .etkilesimGecmisiTablo()
      .should("be.visible")
      .within(() => cy.get("thead").should("contain", sutunBaslıgı));
  }

  etkilesimGecmisiAltSekmeFiltreleme(sutunBaslıgı, filtre) {
    this.elements
      .etkilesimGecmisiTablo()
      .should("be.visible")
      .within(() => {
        cy.get(
          `thead th:contains("${sutunBaslıgı}") .icon-arrow-down-light`
        ).click();
        cy.get('input[placeholder="Ara"]').clear().type(filtre);
        cy.get("#container-filterCheckbox1").click();
        basePage.elements.buton("Uygula").click();
      });
  }

  etkilesimGecmisiAltSekmeCokluFiltreme(sutunBaslıgı, table) {
    this.elements.etkilesimGecmisiTablo().should("be.visible");

    cy.get(
      `thead th:contains("${sutunBaslıgı}") .icon-arrow-down-light`
    ).click();

    table.raw().forEach((filtre) => {
      cy.get('input[placeholder="Ara"]').clear().type(filtre.toString());
      cy.get("#container-filterCheckbox1").click();
    });
  }

  etkilesimGecmisiFiltreKontrol(filtre) {
    this.elements
      .etkilesimGecmisiTablo()
      .should("be.visible")
      .within(() => {
        cy.get("tbody tr").each((el) => {
          cy.wrap(el).should("contain", filtre);
        });
      });
  }

  tarihGirisi(tarihTipi, tarih) {
    this.elements
      .tarihInput(tarihTipi)
      .clear()
      .realType(tarih.toString().replaceAll(".", ""))
      .realPress("Enter");
  }

  kanalSecimi(kanalAdi) {
    this.elements.kanalInput().clear().type(kanalAdi);
    cy.get(".Select-menu-outer").click();
  }

  gonderiGecmisiAltSekmeIcerigiDogrulama(sutunBaslıgı) {
    this.elements
      .gonderiGecmisiTablo()
      .should("be.visible")
      .within(() => cy.get("thead").should("contain", sutunBaslıgı));
  }

  dokumanGoruntulemeAltSekmeIcerigiDogrulama(sutunBaslıgı) {
    this.elements
      .dokumanGoruntulemeTablo()
      .should("be.visible")
      .within(() => cy.get("thead").should("contain", sutunBaslıgı));
  }

  goruntuleButonKontrol() {
    this.elements
      .dokumanGoruntulemeTablo()
      .should("be.visible")
      .within(() => {
        cy.get("tbody tr").each((el) => {
          cy.wrap(el).should("contain", "Görüntüle");
        });
      });
  }

  donemSecerekGonderimTarihiFiltreleme(donem) {
    this.loaderYok();
    this.elements.gonderimTarihiFiltreIcon().click();
    basePage.elements.buton(donem).click();
    basePage.elements.buton("Uygula").click();
    this.elements
      .gonderimTarihiFiltreIcon()
      .siblings(".proto-table-header_content--badge")
      .find(".icon-close")
      .should("be.visible");
  }

  gonderimTarihiFiltreIconVar() {
    this.elements
      .gonderimTarihiFiltreIcon()
      .siblings(".proto-table-header_content--badge")
      .find(".icon-close")
      .should("be.visible");
  }

  gonderimTarihiFiltreIconTikla() {
    this.elements
      .gonderimTarihiFiltreIcon()
      .siblings(".proto-table-header_content--badge")
      .find(".icon-close")
      .click();
  }

  tarihAralıgıGirTabiTikla() {
    this.loaderYok();
    this.elements.gonderimTarihiFiltreIcon().click();
    this.elements.tarihAralıgıGirTabi().realClick();
  }

  baslangicTarihiGir(gun, ay, yil) {
    this.loaderYok();
    this.elements.baslangiTarihiGun().clear().realType(gun);
    this.elements.baslangiTarihiAy().clear().realType(ay);
    this.elements.baslangiTarihiYil().clear().realType(yil);
  }

  bitisTarihiGir(gun, ay, yil) {
    this.loaderYok();
    this.elements.bitisTarihiGun().clear().realType(gun);
    this.elements.bitisTarihiAy().clear().realType(ay);
    this.elements.bitisTarihiYil().clear().realType(yil);
  }

  seciliFiltreyiKaldir(){
    this.elements.filtreSilmeCarpiIsareti().click();
  }
}

export const etkilesimGecmisi = new EtkilesimGecmisiPage();
