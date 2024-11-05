import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { basePage } from "@pages/BasePage";
import { donemselPrimTutariDegisikligiPage } from "../../pages/DonemselPrimTutariDegisikligiPage";


Then(
  "Dönemsel Prim Tutarı Değişikliği ekranında Poliçe no ve ürün adı bilgisi altı çizili olarak görünmeli",
  () => {
    donemselPrimTutariDegisikligiPage.donemselPrimTutariPoliceVeUrunAdiAltiCizgili();
  }
);

Then(
  "customerPremiumAmountInformationRop servis response alarak istediğim police numarasi ile ürün seçiyorum",
  () => {
    donemselPrimTutariDegisikligiPage.customerPremiumAmountInformationRopServisIleUrunSec();
  }
);


Then(
  "Dönemsel Prim Tutarı değeri customerPremiumAmountInformationRop servisinden gelen response ile uyumlu olmalı",
  () => {
    donemselPrimTutariDegisikligiPage.donemselPrimTutariDegerininServisleKarsilastirma();
  }
);

Then("Bilgilendirme Metnini görmeliyim", () => {
  donemselPrimTutariDegisikligiPage.donemselPrimTutariBilgilendirmeMesajiKontrolu();
});

When("Geçersiz bir yeni dönemsel prim tutarı giriyorum", () => {
  donemselPrimTutariDegisikligiPage.gecersizYeniDonemselPrimGirisi();
});

Then("Geçersiz yeni prim tutarı girişi için hata mesajını görmeliyim", () => {
  donemselPrimTutariDegisikligiPage.gecersizPrimTutariHataMesajiKontrolu();
});
