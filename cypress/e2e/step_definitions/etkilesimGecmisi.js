import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { etkilesimGecmisi } from "../../pages/EtkilesimGecmisiPage";
import { basePage } from "@pages/BasePage";
import { suankiTarih } from "./common_steps";
import { parseDateToMilliseconds } from "./utils";

Then("Etkileşim geçmişi navigasyonunda 4 sekme olmalı", () => {
  etkilesimGecmisi.sekmeSayisi();
  etkilesimGecmisi.loaderYok();
});

Then("{string} etkileşim geçmişi alt sekmesi olarak seçili olmalı", (sekme) => {
  etkilesimGecmisi.aktifAltSekmeHangisi(sekme);
});

Then(
  "Etkileşim geçmişi alt sekmesinde aşağıdaki sütunlar bulunmalı",
  (table) => {
    table
      .raw()
      .flat()
      .forEach((item) => {
        etkilesimGecmisi.etkilesimGecmisiAltSekmeIcerigiDogrulama(item);
      });
  }
);

When("{string} sütununu {string} ile filtreliyorum", (sutunBaslıgı, filtre) => {
  etkilesimGecmisi.etkilesimGecmisiAltSekmeFiltreleme(sutunBaslıgı, filtre);
});

When(
  "{string} sütununu aşağıdakiler ile filtreliyorum",
  (sutunBaslıgı, table) => {
    etkilesimGecmisi.etkilesimGecmisiAltSekmeCokluFiltreme(sutunBaslıgı, table);
    basePage.elements.buton("Uygula").click();
  }
);

Then("Her satırda {string} filtresi görülmeli", (filtre) => {
  etkilesimGecmisi.etkilesimGecmisiFiltreKontrol(filtre);
});

When("{string} etkileşim geçmişi alt sekmesi olarak seçiyorum", (sekme) => {
  etkilesimGecmisi.altSekmeSecme(sekme);
});

Given("{string} olarak {string} giriyorum", (tarihTipi, tarih) => {
  etkilesimGecmisi.tarihGirisi(tarihTipi, tarih);
});

When("Kanal olarak {string} seçiyorum", (kanalAdi) => {
  etkilesimGecmisi.kanalSecimi(kanalAdi);
});

Then("Gönderi geçmişi tablosunda aşağıdaki sütunlar bulunmalı", (table) => {
  table
    .raw()
    .flat()
    .forEach((item) => {
      etkilesimGecmisi.gonderiGecmisiAltSekmeIcerigiDogrulama(item);
    });
});

When("Gönderi geçmişi tablosu kaybolmalı", () => {
  etkilesimGecmisi.elements.gonderiGecmisiTablo().should("not.be.visible");
});

Then("Doküman Görüntüleme tablosunda aşağıdaki sütunlar bulunmalı", (table) => {
  table
    .raw()
    .flat()
    .forEach((item) => {
      etkilesimGecmisi.dokumanGoruntulemeAltSekmeIcerigiDogrulama(item);
    });
});

Then(
  "Doküman Görüntüleme tablosundaki her satırda görüntüle butonu görülmeli",
  () => {
    etkilesimGecmisi.goruntuleButonKontrol();
  }
);

When("{string} dönem seçerek filtreliyorum", (donem) => {
  etkilesimGecmisi.donemSecerekGonderimTarihiFiltreleme(donem);
});

Then("Gönderim Tarihi filtresini kapatma ikonu görülmeli", () => {
  etkilesimGecmisi.gonderimTarihiFiltreIconVar();
});

Then("Gönderim Tarihi filtresini kapatma ikonunu tıklıyorum", () => {
  etkilesimGecmisi.gonderimTarihiFiltreIconTikla();
});

Given("Tarih aralığı gir tabına tıklıyorum", () => {
  etkilesimGecmisi.tarihAralıgıGirTabiTikla();
});

Given(
  "Başlangıç tarihi gün-ay-yıl olarak {string}-{string}-{string} giriyorum",
  (gun, ay, yil) => {
    etkilesimGecmisi.baslangicTarihiGir(gun, ay, yil);
  }
);

Given(
  "Bitiş tarihi gün-ay-yıl olarak {string}-{string}-{string} giriyorum",
  (gun, ay, yil) => {
    etkilesimGecmisi.bitisTarihiGir(gun, ay, yil);
  }
);

Given(
  "Etkileşim geçmişi tablosundaki en üstteki tarih loglanan tarihle uyumlu olmalı",
  () => {
    etkilesimGecmisi.elements.etkilesimGecmisiTabloTarihSatir(1).then((el) => {
      // tarihleri ms cinsine çevir
      let tarih1Ms = parseDateToMilliseconds(el.text());
      let tarih2Ms = parseDateToMilliseconds(suankiTarih);
      let tarihFarkiMs = tarih1Ms - tarih2Ms;
      expect(tarihFarkiMs).to.be.lessThan(600000);
      expect(tarihFarkiMs).to.be.least(0); // tarih farkı negatif deger olmamalı
    });
  }
);

Given(
  "Etkileşim geçmişi tablosundaki en üstteki durum {string} olmalı",
  (durum) => {
    etkilesimGecmisi.elements.etkilesimGecmisiTabloDurumSatir(1).then((el) => {
      expect(el.text()).to.includes(durum);
    });
  }
);

Given(
  "Etkileşim geçmişi tablosundaki en üstteki etkileşim tipi {string} olmalı",
  (durum) => {
    etkilesimGecmisi.elements.etkilesimGecmisiTabloEtkilesimTipiSatir(1).then((el) => {
      expect(el.text()).to.includes(durum);
    });
  }
);

When("Seçili filtreyi siliyorum", () => {
  etkilesimGecmisi.seciliFiltreyiKaldir();
});