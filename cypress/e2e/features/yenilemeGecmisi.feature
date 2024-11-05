#Y2876323
Feature: Yenileme geçmişi
        @yenilemeGeçmişiVar
        Scenario: Yenileme geçmişi içerik kontrolü
            Given "Sigortalar" sekmesini seçiyorum
              And "Sigortalar" sekmesi açılmalı
              And Ürünü poliçe numarası ile seçiyorum
              And Şuanki tarihi logluyorum
             When Yenileme geçmişini görüntüle linkine renewalHistory ile tıklıyorum
             Then renewalHistoryList eleman içerikleri ile yenileme satırları içerikleri aynı olmalı

        @yenilemeGeçmişiYok
        Scenario: Yenileme geçmişi içerik kontrolü
            Given "Sigortalar" sekmesini seçiyorum
              And "Sigortalar" sekmesi açılmalı
              And Ürünü poliçe numarası ile seçiyorum
             When Yenileme geçmişini görüntüle linkine renewalHistory ile tıklıyorum
             Then "Seçilen poliçe için Yenileme/Yenileme İptal Geçmişi bulunamamıştır" mesajı görünmeli

        @default
        Scenario: Etkileşim Geçmişi Kontrolü
            Given "Etkileşim Geçmişi" sekmesini seçiyorum
              And "Etkileşim Geçmişi" sekmesi açılmalı
             When "ETKİLEŞİM ANA KONU" sütununu aşağıdakiler ile filtreliyorum
                  | Yenileme Geçmişini Görüntüleme |
             Then Etkileşim geçmişi tablosundaki en üstteki tarih loglanan tarihle uyumlu olmalı
              And Etkileşim geçmişi tablosundaki en üstteki durum "Bitti" olmalı
              And Etkileşim geçmişi tablosundaki en üstteki etkileşim tipi "Bilgi" olmalı