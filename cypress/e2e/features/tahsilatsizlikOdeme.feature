# I_18_2 - I201704 - @tanımlıÖdemeYöntemiİleTahsilatsızlıkÖde
# B_14_2 - B272504 - @tanımsızÖdemeYöntemiİleTahsilatsızlıkÖde
# Tahsilatsızlık Ekranı için MUSTERI_ROLU="Sigorta Ettiren",
# MUSTERI_ROLU="Sigorta Ettiren" terminalden --env ile yada .env dosyasından verilmeli
# CI entegrasyonu yapılınca Jenkins den verilmeli

Feature: (BCM-10705) Tahsilatsızlık Ödeme Kontrolleri
        @default
        Scenario: Tahsilatsızlık Ekranına gitme
            Given "Sigortalar" sekmesini seçiyorum
              And "Sigortalar" sekmesi açılmalı
              And Ürünü poliçe numarası ile seçiyorum
            Given Şuanki tarihi logluyorum
             When Tahsilatsızlık Detayı İncele butonuna lifeOverduePaymentDetails ile tıklıyorum

        @default
        Scenario: Tahsilatsızlık ödemesi akış
             When 1. sıradaki tahsilatsızlık vadesini seçiyorum
             Then "Açık Vadeleri Öde" butonu aktif olmalı
              And Açık Vadeleri Öde butonuna customerPaymentMethods ile tıklıyorum
              And Tahsilatsızlık sayfasında "Açık Vade Ödeme" header görünmeli
              And Poliçe no ve ürün adı bilgisi altı çizili olarak görünmeli
              And Tahsilatsızlık tanımlı ödeme yöntemi ile customerPaymentMethods uyumlu olmalı

        @tanımlıÖdemeYöntemiİleTahsilatsızlıkÖde
        Scenario: Tahsilatsızlık vadesini tanımlı ödeme yöntemi ile öde
            Given Tahsilatsızlık Ödenecek Toplam Tutarı alıyorum
             When "Öde" butonuna tıklıyorum
             Then "Açık Vade Ödeme" popup açılmalı
              And Açık Vadeleri Öde popup ile customerPaymentMethods ve Ödenecek Toplam Tutar uyumlu olmalı

        @tanımsızÖdemeYöntemiİleTahsilatsızlıkÖde
        Scenario: Tahsilatsızlık vadesini tanımlı olmayan ödeme yöntemi ile öde
            Given Tahsilatsızlık Ödenecek Toplam Tutarı alıyorum
             When Herhangi bir kredi kartı seçiyorum
              And Kendi Kredi Kartım Hesabım secenegini seciyorum
             When "Öde" butonuna tıklıyorum
             Then "Açık Vade Ödeme" popup açılmalı
             When Radio buton olarak "Sadece bu işlem için kullan" seçeneğine tıklıyorum

        @default
        Scenario: Tahsilatsızlık ödemesi onay
             When Açık Vadeleri Ödeme Popup body Evet butonuna payLifeOverduePayments ile tıklıyorum
             Then payLifeOverduePayments servisindeki overallPaymentStatus "false" dönmeli
              And Açık Vadeleri Ödeme bilgilendirme metni ile payLifeOverduePayments uyumlu olmalı

        @default
        Scenario: Etkileşim Geçmişi Kontrolü
            Given "Tamam" butonuna tıklıyorum
              And "Etkileşim Geçmişi" sekmesini seçiyorum
              And "Etkileşim Geçmişi" sekmesi açılmalı
             When "ETKİLEŞİM ANA KONU" sütununu aşağıdakiler ile filtreliyorum
                  | Hayat Tahsilatsızlık Bilgilerinin Gösterilmesi |
             Then Etkileşim geçmişi tablosundaki en üstteki tarih loglanan tarihle uyumlu olmalı
              And Etkileşim geçmişi tablosundaki en üstteki durum "Bitti" olmalı
              And Etkileşim geçmişi tablosundaki en üstteki etkileşim tipi "Bilgi" olmalı