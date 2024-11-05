Feature: Ek Faydalar Tablosu kontrolü
        
        @ekFaydaVar #I201704
        Scenario: Ek Faydalar Tablosu servisten gelen response ile uyumlu olmalı
            Given "Sigortalar" sekmesini seçiyorum
             Then "Sigortalar" sekmesi açılmalı
             When Ek Faydalar tablosu için poliçe numarası ile ürün seçip ilgili servislerden gelen response sonuçlarını kaydediyorum
             Then Ek Fayda tablosunu görmeliyim
             Then Ek fayda tablosu içerik kontrolü

        @ekFaydaYok #B502659
        Scenario: Ek Faydalar Bulunamadı textinin kontrolü
             Then "Ek Faydalar Bulunamadı." mesajı görünmeli

        @ekFaydaVar #I201704
        Scenario: Ek Faydalar Tablosunda Kapsam sütununda filtreleme işlemi gerçekleştirme
             When Ek fayda tablosunda Kapsam sütununda "Ebeveynler" kelimesini filtreliyorum
             Then Kapsam sütununda filtrelenmiş "Ebeveynler" textini görüntülüyorum
              And Ek Fayda tablosunda "Kapsam" sütununun sağ üst köşesinde çarpı işareti iconunu görmeliyim

        @ekFaydaVar #I201704
        Scenario: Ek Faydalar Tablosunda Kapsam sütununda filtrelenen kelimenin bulunamaması
             When Ek fayda tablosunda Kapsam sütununda "Asdfgjhkl" kelimesini filtreliyorum
             Then "Ek Faydalar Bulunamadı." mesajı görünmeli
             When "Kapsam" sütunundaki çarpı işareti iconuna tıklıyorum
             Then Ek Fayda tablosunu görmeliyim

        @ekFaydaVar #I201704
        Scenario: Ek Faydalar Tablosunda Fayda Adı sütununda paket seçip Uygulama işlevinin gerçekleştirilmesi
             When "Fayda Adı" sütununda checkbox ile "Çocuk Paketi" seçiyorum
              And "Uygula" butonuna tıklıyorum
             Then Ek Fayda tablosunda "Fayda Adı" sütununun sağ üst köşesinde çarpı işareti iconunu görmeliyim
              And Ek fayda tablosu içerik kontrolü