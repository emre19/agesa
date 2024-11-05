@default
Feature: Dönemsel Prim Tutarı Degisikligi kontrolü

        Scenario: Dönemsel Prim Tutarı Degisikligi buton kontrolü
            Given "Sigortalar" sekmesini seçiyorum
              And "Sigortalar" sekmesi açılmalı
             When customerPremiumAmountInformationRop servis response alarak istediğim police numarasi ile ürün seçiyorum
             Then "Dönemsel Prim Tutarı Değişikliği" butonu görünmeli
              And "Dönemsel Prim Tutarı Değişikliği" butonu aktif olmalı

        Scenario: Dönemsel Prim Tutarı Degisikligi ekrandaki icerik kontrolleri
             When "Dönemsel Prim Tutarı Değişikliği" butonuna tıklıyorum
             Then Dönemsel Prim Tutarı Değişikliği ekranında Poliçe no ve ürün adı bilgisi altı çizili olarak görünmeli
              And Dönemsel Prim Tutarı değeri customerPremiumAmountInformationRop servisinden gelen response ile uyumlu olmalı
              And Bilgilendirme Metnini görmeliyim

        Scenario: Dönemsel Prim Tutarını geçerli aralık dışındaki bir degerle deneyip hata mesajını görüntüleme kontrolü
             When Geçersiz bir yeni dönemsel prim tutarı giriyorum
             Then Geçersiz yeni prim tutarı girişi için hata mesajını görmeliyim
