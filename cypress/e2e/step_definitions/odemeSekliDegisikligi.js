import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { odemeSekliDegisikligi } from "../../pages/OdemeSekliDegisikligiPage";

  When("Ödeme şeklini değiştirmek için poliçe numarası seçip ilgili servislerden dönen response kaydediyorum",() => {
      odemeSekliDegisikligi.policeNoSecipServisResponseKaydet();
  });

  When("checkLifePaymentChangeAvailability servisindeki isAvailable parametresi true dönmeli",() => {
      odemeSekliDegisikligi.isAvailableResponseKontrol();
  });

  When("Değiştir butonuna tıklamadan önce tanımlı ödeme yöntemindeki bilgileri kaydediyorum",() => {
      odemeSekliDegisikligi.odemeYontemiBilgileriKaydet();
  });

  When("Tanımlı ödeme yöntemi kartındaki Değiştir butonuna tıklıyorum",() => {
      odemeSekliDegisikligi.degistirButonunaTikla();
  });

  Then("Değiştir butonuna tıklamadan önceki kart bilgisi ile tıkladıktan sonraki işaretlenmiş kart bilgisi uyumlu olmalı",() => {
      odemeSekliDegisikligi.secilmisOdemeKartiIcerikKontrolu();
  });

  Then("Tanımlı ödeme yöntemlerinden birini seçme ile ilgili Bilgilendirme Metni servisten gelen response ile uyumlu olmalı",() => {
      odemeSekliDegisikligi.tanimliOdemeYontemiBilgilendirmeMetniKontrol();
  });

  When("Ödeme Tutar tablosundaki datalar servisten gelen response ile uyumlu olmalı",() => {
      odemeSekliDegisikligi.odemeTutarTablosuDataKontrol();
  });

  When("Yeni kredi kartı ekle radio butonuna tıklıyorum",() => {
      odemeSekliDegisikligi.yeniKrediKartiEkleRadioButtonSec();
  });

  Then("Yeni kredi kartı ekle Bilgilendirme Metni UI da gözüken mesaj ile uyumlu olmalı",() => {
      odemeSekliDegisikligi.yeniKrediKartiEkleBilgilendirmeMetniKontrol();
  });

  Then("Servis kontrol edilerek Tanımlı Ödeme Yöntemi alanındaki banka hesap ve kredi kartı bilgileri ürüne ait ptp-for bilgisine göre olmalı",() => {
      odemeSekliDegisikligi.ptpForOdemeBilgileriServisleKontrol();
  });

  Then("Tanımlı Ödeme Yöntemi alanındaki kartlar servisten dönen response ile uyumlu olmalı",() => {
      odemeSekliDegisikligi.tanimliOdemeYontemiKartIcerikKontrolu();
  });

  Then("Yeni kredi kartı ekle alanının kontrolü",() => {
      odemeSekliDegisikligi.yeniKrediKartiEkleAlaniExistKontrolu();
  });

  Then("Yeni banka hesabı ekle alanının kontrolü",() => {
      odemeSekliDegisikligi.yeniBankaHesabiEkleAlaniExistKontrolu();
  });

  When("Tanımlı Ödeme Yöntemi alanından İş Bankası olan bir ödeme kartı seçilir",() => {
      odemeSekliDegisikligi.isBankasiKartiSecimi();
  });

  Then("Kayıt oluşturma ile ilgili ekranda gözüken bilgilendirme metni servisten gelen response ile uyumlu olmalı",() => {
    odemeSekliDegisikligi.kayitOlusturmaBilgilendirmeMetniKontrol();
  });

  Then("create-flow servisinden dönen success parametresi true olmalı",() => {
    odemeSekliDegisikligi.createflowServisSuccessKontrol();
  });

  Then("Devam butonuna tıklayıp create-flow servisinden response kaydediyorum",() => {
    odemeSekliDegisikligi.devamTiklaCreateflowResponseKaydet();
  });

  Then("Tanımlanacak hesap checkboxda banka isimleri servis response ile uyumlu olmalı",() => {
    odemeSekliDegisikligi.tanimlanacakHesapCheckboxBankaIsmiKontrol();
  });

  When("Akbank ve iş bankası dışında hesap seçiyorum",() => {
    odemeSekliDegisikligi.akbankVeIsBankasiHesapHaricHesapSec();
  });

  When("Kendi Kredi Kartım Hesabım secenegini seciyorum",() => {
    odemeSekliDegisikligi.kendiKartimiHesabimSec();
  });

  Then("ATS Formu mesajı görünmeli",() => {
    odemeSekliDegisikligi.ATSmesajKontrolu();
  });

  Then("ATS ve Sigorta Ettiren Formları mesajı görünmeli",() => {
    odemeSekliDegisikligi.ATSveSigortaEttirenMesajKontrolu();
  }); 

  Then("Popup içinde Bilgilendirme Metni görünmelidir",() => {
    odemeSekliDegisikligi.formGonderimiPopupBilgilendirmeMetni();
  });

  When("{string} butonuna tıkayıp notifyPaymentChangeDocuments servisinden response kaydediyorum",(butonIsmi) => {
    odemeSekliDegisikligi.formGonderimiButonTiklaResponseKaydet(butonIsmi);
  });

  Then("notifyPaymentChangeDocuments servisindeki success parametresi true dönmeli",() => {
    odemeSekliDegisikligi.notifyPaymentChangeDocumentsServisSuccessKontrol();
  });

  When("Form Gönderiimi popup daki {string} butonuna tıklayıp create-flow servisinden response kaydediyorum",(butonIsmi) => {
    odemeSekliDegisikligi.formGonderimiPopupButonTikla(butonIsmi);
  });

  Then("Talepler tabından ödeme şeklini değiştirme sayfasına dönüş",() => {
    odemeSekliDegisikligi.taleplerTabindanSigortalarTabinaGecis();
  }); 

   When("Başkasının hesabı kartı secenegini seciyorum",() => {
    odemeSekliDegisikligi.baskasininKartimiHesabimSec();
  });

  When("Herhangi bir kredi kartı seçiyorum",() => {
    odemeSekliDegisikligi.herhangiBirKrediKartiSec();
  });

  Then("{string} için Sigorta Ettiren Değişikliği mesajı görünmeli",(item) => {
    odemeSekliDegisikligi.sigortaEttirenMesajKontrolu(item);
  }); 

  When("Akbank hesabı seçiyorum",() => {
    odemeSekliDegisikligi.akbankHesapSec();
  });

  When("Yeni banka hesabı ekle alanından tanımlanacak hesap dropdown açıyorum",() => {
    odemeSekliDegisikligi.tanimlanacakHesapDropdownAc();
  });

  When("Tanımlı ödeme yöntemi ekranında {string} butonuna tıklıyorum",(butonIsmi) => {
    odemeSekliDegisikligi.kaydetButonunaTikla(butonIsmi);
  });

  When("Kredi kartı numarasının son 4 hanesini bir değişkene atıyorum onay metninde kullanabilmek için",() => {
    odemeSekliDegisikligi.krediKartiVeyaIbanSonHaneyiDegiskeneAta();
  });

  When("Akbank hesap numarasının son 2 hanesini bir değişkene atıyorum onay metninde kullanabilmek için",() => {
    odemeSekliDegisikligi.krediKartiVeyaIbanSonHaneyiDegiskeneAta();
  });

  Then("{string} için Popup body içindeki onay metni görünmeli",(item) => {
    odemeSekliDegisikligi.popupOnayMetniKontrol(item);
  }); 

  Then("{string} için Popup body içindeki tercih sorusu görünmeli",(item) => {
    odemeSekliDegisikligi.popupTercihSorusuKontrol(item);
  }); 

  When("{string} seçeneğini tıklıyorum",(secenek) => {
    odemeSekliDegisikligi.tercihSorusuSecenekSec(secenek);
  });

  When("Popup body {string} butonuna tıklayıp lifeChangePaymentMethod servisinden gelen response kaydediyorum",(butonIsmi) => {
    odemeSekliDegisikligi.popupEvetButonunaTiklaReponseKaydet(butonIsmi);
  });

  Then("Popup bilgilendirme metni servisten gelen response ile uyumlu olmalı",() => {
    odemeSekliDegisikligi.popupBilgilendirmeMetniServisUyumu();
  });

  When("Açılan dropdowndan {string} bir hesap seçiyorum",(bankaTercihi) => {
    odemeSekliDegisikligi.tanimlanacakHesapDropdownSecimYap(bankaTercihi);
  });

  When("{string} secenegini seçiyorum",(item) => {
    odemeSekliDegisikligi.kendiHesabimVeyaBaskasininHesabiSeciminiYap(item);
  });

  Then("Hesap numarası alanı görünmeli",() => {
    odemeSekliDegisikligi.hesapNumarasiInputAlaniGorunmeli();
  });

  When("Hesap numarası alanına {string} değerini giriyorum",(deger) => {
    odemeSekliDegisikligi.hesapNumarasiAlaninaDegerGir(deger);
  });

  Then("Iban alanı pasif olmalı",() => {
    odemeSekliDegisikligi.ibanAlaniPasifGorunmeli();
  });

  When("Hesap numarası alanındaki datayı siliyorum",() => {
    odemeSekliDegisikligi.hesapNumarasiInputAlaniTemizleme();
  });

  When("Iban alanına {string} değerini giriyorum",(deger) => {
    odemeSekliDegisikligi.ibanAlaninaDegerGir(deger);
  });

  Then("Hesap numarası ve şube alanlarının pasif olmalı",() => {
    odemeSekliDegisikligi.hesapVeSubeAlaniPasifGorunmeli();
  });

  When("Şube {string} seçiyorum",(item) => {
    odemeSekliDegisikligi.subeSec(item);
  });

  Then("Talebin Konusu ve Talebin Detay Konusu servisten gelen data ile uyumlu olmalı",() => {
    odemeSekliDegisikligi.talepKonuVeDetayKonuKontrol();
  }); 

  When("Ödeme yöntemi değiştirilen poliçe numaraları bir değişkene atıyorum",() => {
    odemeSekliDegisikligi.odemeYontemiDegisenPoliceler();
  }); 

  Then("Bu poliçe için ödeme yönteminin değiştiği sigorta detay ekranında gözükmeli",() => {
    odemeSekliDegisikligi.buPoliceOdemeYontemiKontrol();
  }); 

  Then("Ödeme yöntemi değiştirilen poliçelerden birini seçip ödeme yönteminin değiştiği sigorta detay ekranında gözükmeli",() => {
    odemeSekliDegisikligi.tumPoliceOdemeYontemiKontrol();
  }); 