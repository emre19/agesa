# I201704
# Tahsilatsızlık Ekranı için MUSTERI_ROLU="Sigorta Ettiren",
# MUSTERI_ROLU="Sigorta Ettiren" terminalden --env ile yada .env dosyasından verilmeli
# CI entegrasyonu yapılınca Jenkins den verilmeli
@default
Feature: (BCM-10529) Tahsilatsızlık Ekranı Kontrolleri

        Scenario: Tahsilatsızlık Ekranı banner kontrolü
            Given "Sigortalar" sekmesini seçiyorum
              And "Sigortalar" sekmesi açılmalı
             When Ürünü poliçe numarası ile seçiyorum
             Then "vade tahsil edilememiştir." mesajı görünmeli
              And "Tahsilatsızlık Detayı İncele" butonu görünmeli
              And "Tahsilatsızlık Detayı İncele" butonu aktif olmalı

        Scenario: Tahsilatsızlık Ekranı butonu kontrolü
            Given Tahsilatsızlık olan vadelerin sayısını alıyorum
             When Tahsilatsızlık Detayı İncele butonuna lifeOverduePaymentDetails ile tıklıyorum
             Then Tahsilatsızlık Bilgisi header görünmeli
              And Poliçe no ve ürün adı bilgisi altı çizili olarak görünmeli
              And Tahsilatsızlık olan vade sayısı ile tahsilatsızlık tablosu uyumlu olmalı
              And Tahsilatsızlık tablosu aşağıdaki başlıkları içermeli
                  | Vade Tarihi           |
                  | Vade Tutarı           |
                  | Durum                 |
                  | Tahsilatsızlık Nedeni |
              And "En üstte yer alan vadeden itibaren seçim yapılmalıdır." mesajı görünmeli
              And Tahsilatsızlık durum bilgisi her zaman ödenmemiş olarak görünmeli
              And "Açık Vadeleri Öde" butonu pasif olmalı
              And Ödenecek Toplam Tutar sıfır olmalı

        Scenario: Tahsilatsızlık Ekranı seçim kontrolü
             When 2. sıradaki tahsilatsızlık vadesini seçiyorum
             Then "En üstte yer alan vadeden itibaren seçim yapılmalıdır" mesajı kırmızı olarak görünmeli
            Given 2. sıradaki tahsilatsızlık vadesinindeki seçimi kaldırıyorum
             When 1. sıradaki tahsilatsızlık vadesini seçiyorum
             Then "Açık Vadeleri Öde" butonu aktif olmalı
            Given 1. sıradaki tahsilatsızlık vadesinindeki seçimi kaldırıyorum
             When Tüm tahsilatsızlık nedeni aşağı oklarını tıklıyorum
             Then lifeOverdueDetailsde boş dönen lifeOverduePayments ile tahsilatsızlık nedeni uyumlu olmalı
              And lifeOverdueDetailsde dolu dönen lifeOverduePayments ile tahsilatsızlık nedeni uyumlu olmalı
              And Ödenmeyen Vadeler tablosu ile Ödenecek Toplam Tutar tablosundaki tarihler, tutarlar ve toplam uyumlu olmalı
