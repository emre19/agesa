@default
Feature: Makbuzlar kontroü

        Scenario: Makbuzlar buton kontrolü
            Given "Sigortalar" sekmesini seçiyorum
              And "Sigortalar" sekmesi açılmalı
             When Ürünü poliçe numarası ile seçiyorum
             Then "Makbuzlar" butonu görünmeli
              And "Makbuzlar" butonu aktif olmalı

        Scenario: Makbuzlar sayfa kontrolü
             When receiptInfo servis dönütünü alarak makbuzlar butonuna tıklıyorum
             Then Makbuzlar tablosunda aşağıdaki sütunlar bulunmalı
                  | Poliçe Numarası  |
                  | Ürün             |
                  | Tarih            |
                  | İletilen E-posta |
                  | İletilme Durumu  |
              And Makbuzlar tablosunda ürün adı görünmeli
              And Makbuzlar tablosunda poliçe numarası görünmeli
              And "E-posta ile Gönder" butonu görünmeli
              And "E-posta ile Gönder" butonu aktif olmalı

        Scenario: Makbuz içerik kontrolü
             When Ürüne ait en üst sıradaki makbuzu açıyorum
             Then Açılan pdfte makbuz adı görünmeli

        Scenario: Çoklu makbuz gönderme popup kontrolü
            Given "Kapat" butonuna tıklıyorum
              And Ürüne ait tüm makbuzarı seçiyorum
             When "E-posta ile Gönder" butonuna tıklıyorum
             Then "Makbuz Gönderme" popup açılmalı
              And Makbuz gönderme bilgilendirme metni "çoklu" makbuza uygun olmalı

        Scenario: Tek makbuz gönderme popup kontrolü
            Given Popup body "İptal" butonuna tıklıyorum
              And Ürüne ait tüm makbuzarı seçiyorum
              And Ürüne ait en üst sıradaki makbuzu seçiyorum
             When "E-posta ile Gönder" butonuna tıklıyorum
             Then "Makbuz Gönderme" popup açılmalı
              And Makbuz gönderme bilgilendirme metni "tek" makbuza uygun olmalı

        Scenario: Makbuz gönderim kontrolü
            Given Popup body email input kutusunu temizleme
              And Popup body aşağıdaki başlıkları içermeli
                  | Tercih Sorusu                    |
                  | Sadece bu işlem için kullan      |
                  | İletişim adresim olarak güncelle |
              And Şuanki tarihi logluyorum
              And Makbuzu config dosyasındaki emaile gönderiyorum
             Then sendMailReceiptsRes "false" dönmeli

        Scenario: Etkileşim Geçmişi Kontrolü
            Given "Tamam" butonuna tıklıyorum
              And "Etkileşim Geçmişi" sekmesini seçiyorum
              And "Etkileşim Geçmişi" sekmesi açılmalı
             When "ETKİLEŞİM ANA KONU" sütununu aşağıdakiler ile filtreliyorum
                  | Makbuz Bilgileri Görüntüle |
                  | Makbuzların Gösterilmesi   |
                  | Makbuzların Gönderilmesi   |
              And Etkileşim geçmişi tablosundaki en üstteki tarih loglanan tarihle uyumlu olmalı
              And Her satırda "Bilgi" filtresi görülmeli