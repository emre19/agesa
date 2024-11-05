#I201704
@default
Feature: Poliçe Basım
        Scenario: Poliçe içerik kontrolü
            Given "Sigortalar" sekmesini seçiyorum
              And "Sigortalar" sekmesi açılmalı
              And Poliçe basım ürününü lifeInsuranceSummaryDetail ve lifePolicyPaymentMethod ile seçiyorum
             When "Poliçeyi Gönder" butonuna tıklıyorum
             Then Açılan pdfte poliçe basım adı görünmeli
              And pdf ile lifeInsuranceSummaryDetail ve lifePolicyPaymentMethod uyumlu olmalı

        Scenario: Poliçe gönderi kontrolü
            Given Popup body "Poliçeyi Gönder" butonuna tıklıyorum
              And "Poliçe Dokümanı Gönderme" popup açılmalı
              And Popup body "Poliçenizle ilgili detayların yer aldığı dokümanı mail adresinize göndereceğim." mesajı içermeli
              And Popup body email input kutusunu temizleme
              And Şuanki tarihi logluyorum
              And Radio buton olarak "İletişim adresim olarak güncelle" seçeneğine tıklıyorum
             When Poliçeyi config dosyasındaki emaile gönderiyorum
             Then sendLifePolicyDocumentRes "true" dönmeli
            Given "Tamam" butonuna tıklıyorum
             When "Müşteri Bilgileri" sekmesini seçiyorum
             Then config dosyasındaki email sayfada görünmeli

        Scenario: Etkileşim Geçmişi Kontrolü
              And "Etkileşim Geçmişi" sekmesini seçiyorum
              And "Etkileşim Geçmişi" sekmesi açılmalı
             When "ETKİLEŞİM ANA KONU" sütununu aşağıdakiler ile filtreliyorum
                  | Sigorta Poliçe Dokümanı Gönderilmesi |
             Then Etkileşim geçmişi tablosundaki en üstteki tarih loglanan tarihle uyumlu olmalı
              And Etkileşim geçmişi tablosundaki en üstteki durum "Bitti" olmalı