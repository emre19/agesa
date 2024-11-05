Feature: Kapsanan Teminatlar kontrolü

        @default #I201704
        Scenario: Kapsanan Teminatlar tablosu servisten gelen response ile uyumlu olmalı
            Given "Sigortalar" sekmesini seçiyorum
             Then "Sigortalar" sekmesi açılmalı
             When Kapsanan detaylar kartı için poliçe numarası seçip ilgili servislerden gelen response kaydediyorum
             Then Kapsanan Teminatlar tablosu icerik kontrolu

        @BHSkapsananTeminatlarKarti #B-502892
        Scenario: Kapsanan Teminatlar BHS ürün için sabit textler, info icon mesajları ve  Vefat Teminatı Katsayısını Değiştir butonu kontrolü
             Then Kapsanan Teminatlar tablosu sabit textler kontrolü
                  | Ana Teminatlar                         |
                  | VEFAT TEMİNATI KATSAYISI               |
                  | SÜRE SONUNDA ULAŞILACAK BİRİKİM TUTARI |
                  | VEFAT TEMİNATI                         |
              And "Vefat Teminatı Katsayısını Değiştir" butonu görünmeli
              And Vefat Teminatı Katsayısını Değiştir butonunun info icon mesajı servisten gelen response ile uyumlu olmalı
              And Kapsanan Teminatlar kartındaki info icon mesajları servisten gelen response ile uyumlu olmalı

        @BHSolmayanKapsananTeminatlarKarti #I201704
        Scenario: Kapsanan Teminatlar BHS olmayan ürün için sabit textler kontrolü
             Then Kapsanan Teminatlar tablosu sabit textler kontrolü
                  | Ana Teminatlar |
                  | Ek Teminatlar  |
              And Kapsanan Teminatlar kartında info icon mesajı görmemeliyim

     #    @default #I201704
     #    Scenario: Teminat Tutarları sayfasına giriş
     #        When Teminat Tutarları linkine tıklıyorum coverageInfo servisinden dönen response kaydediyorum
     #         Then Sayfada daire şeklinde loader kalmamalı
     #          And Ürün ve police numarası teminat bilgisi ekranında gözükmelidir

     #    @default #I201704
     #    Scenario: Teminat Tutarları sayfası dataları servis ile uyumlu olmalı
     #         Then Teminat Tutarları içerik kontrolü
     #          And Teminat Bilgisi sayfasındaki sabit textler kontrolü
     #              | Teminat Bilgisi   |
     #              | Mevcut Teminatlar |
     #              | Teminat Tipi      |
     #              | Teminat Tutarı    |
        
     #    @teminatTutarGosterimiOlmayan #I201704
     #    Scenario: Mevcut ürün için yıl/ay bazlı teminat tutar gösterimi yapılamayan durum kontrolü
     #         Then Çarpı işareti iconu görünmeli
     #         And "Bu ürün için yıl/ay bazlı teminat tutar gösterimi yapılmamaktadır." mesajı görünmeli

     #    @teminatTutarGosterimiOlan #V-3719663
     #    Scenario: Mevcut ürün için yıl/ay bazlı teminat tutar gösterimi yapılan durumda tablo kontrolü
     #         Then "Ay Bazında Teminatlar" mesajı görünmeli
     #         And Teminatlar tablosunda aşağıdaki sütun isimlerini görmeliyim
     #              | Teminat Yılı              |
     #              | Teminat Ayı               |
     #              | VKP Kodu                  |
     #              | Ay Bazında Teminat Tutarı |
     #         And Teminatlar tablosundaki satırların servisten gelen response ile uyumlu olmalı