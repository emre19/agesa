Feature: Vergi Indirimi Hesapla kontrolü

        @default #I201704
        Scenario: Vergi Indirimi pop-up açıldığında default değer kontrolleri
            Given "Sigortalar" sekmesini seçiyorum
             Then "Sigortalar" sekmesi açılmalı
             When Vergi İndirimi Hesapla buton işlemi için ürün seçip ilgili servislerden gelen response sonuçlarını kaydediyorum
             Then "Vergi İndirimi Hesapla" butonu aktif olmalı
             When "Vergi İndirimi Hesapla" butonuna tıklıyorum
             Then Popup daki "İptal" butonu aktif olmalı
              And Popup daki "Hesapla" butonu pasif olmalı
              And "Vergi İndirimi" popup açılmalı
              And Vergi indirimi popup açıldığında "Ücretli çalışan" radio button da default olarak seçilmiş gözükmelidir
              And Günlük USD-EUR kur degerleri servisten gelen data ile uyumlu olmali

        @default #I201704
        Scenario: Vergi İndirimi ücretli çalışan hesap kontrolü
             When "BRÜT MAAŞINIZ / TL" alanına "20000" degeri girilir
              And "AYLIK ÖDENEN PRİM TUTARI / TL" alanına "1000" degeri girilir
             Then Popup daki "Hesapla" butonu aktif olmalı
             When "Hesapla" butonuna tıklayıp lifePolicyTaxDiscountCalculate servisinin response kaydediyorum
             Then Ücretli Çalışan için hesaplanan sonuçlar servisten dönen response ile uyumlu olmalı

        @default #I201704
        Scenario: Ücretli Çalışan için Toplam Vergi İndirimi Değerinin sigorta detay ekranında kontrolü
             When Popup body "İptal" butonuna tıklıyorum
             Then Popup görünmemeli
              And Sigorta detay ekranında Vergi indirimi alanında yeni vergi değeri görüntülenmeli

        @default #I201704
        Scenario: Vergi İndirimi serbest meslek sahibi hesap kontrolü
             When "Vergi İndirimi Hesapla" butonuna tıklıyorum
             When Radio buton olarak "Serbest meslek sahibi" seçeneğine tıklıyorum
              And "YILLIK GELİRİNİZ / TL" alanına "20000" degeri girilir
              And "YILLIK ÖDENEN PRİM TUTARI / TL" alanına "1000" degeri girilir
             Then Popup daki "Hesapla" butonu aktif olmalı
             When "Hesapla" butonuna tıklayıp lifePolicyTaxDiscountCalculate servisinin response kaydediyorum
             Then Serbest Çalışan için hesaplanan sonuçlar servisten dönen response ile uyumlu olmalı

        @default #I201704
        Scenario: Serbest Çalışan için Toplam Vergi İndirimi Değerinin sigorta detay ekranında kontrolü
             When Popup body "İptal" butonuna tıklıyorum
             Then Popup görünmemeli
              And Sigorta detay ekranında Vergi indirimi alanında yeni vergi değeri görüntülenmeli