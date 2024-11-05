# Y_1_39 => Y-2876577
# K_63_5 => K3556975

# Yenileme Tercihi Değiştirme Aktif için MUSTERI_ROLU="Sigorta Ettiren",
# Yenileme Tercihi Değiştirme Pasif için MUSTERI_ROLU="Sigortalı",
# MUSTERI_ROLU="Sigorta Ettiren" terminalden --env ile yada .env dosyasından verilmeli
# CI entegrasyonu yapılınca Jenkins den verilmeli
# !!! Bu test case için MUSTERI_ROLU="Sigorta Ettiren" olarak verilmeli !!!

Feature: (BCM-10668) Yenileme Tercihi Değiştirme

        @default
        Scenario: Yenileme Tercihi Değiştirme olan ürüne gitme
            Given "Sigortalar" sekmesini seçiyorum
              And "Sigortalar" sekmesi açılmalı
             When Yenileme Tercihi değiştirme olan ürünü lifeInsuranceSummaryDetail ile seçiyorum
             Then "Yenileme Talebinden Vazgeç" butonu aktif olmalı
              And Yenilemeye kalan gün sayısı 30'dan fazla olmalı
            Given Şuanki tarihi logluyorum
             When "Yenileme Talebinden Vazgeç" butonu ünlem işareti üzerine geliyorum
             Then "Poliçenin yenileme tarihine 30 günden fazla süre bulunmaktadır. Yenileme iptal talebi için, ikna akışı oluşturulmalıdır." mesajı görünmeli

        @default
        Scenario: Yenileme Talebinden Vazgeç butonu kontrolü - iptal
             When "Yenileme Talebinden Vazgeç" butonuna tıklıyorum
             Then Yenileme iptal talebi header görünmeli
              And "Poliçenin yenileme tarihine 30 günden fazla süre bulunmaktadır. Yenileme iptal talebi için, ikna akışı oluşturulmalıdır. İşleme devam etmek istiyor musunuz?" mesajı görünmeli
             When "Vazgeç" butonuna tıklıyorum
             Then "Yenileme Talebinden Vazgeç" butonu aktif olmalı

        @yenilemeTalebiVazgeçEkFaydasız
        Scenario: Yenileme Talebinden Vazgeç butonu kontrolü - ek fayda yok - devam
             When "Yenileme Talebinden Vazgeç" butonuna tıklıyorum
             Then Yenileme iptal talebi header görünmeli
              And "Poliçenin yenileme tarihine 30 günden fazla süre bulunmaktadır. Yenileme iptal talebi için, ikna akışı oluşturulmalıdır. İşleme devam etmek istiyor musunuz?" mesajı görünmeli
             When Vazgeç butonuna reasons servisi ile tıklıyorum
             Then Yenileme İptal Talebi sebep sorma bilgilendirme metni reasons servisi ile uyumlu olmalı
              And Müşterinin Yenileme İptal Nedeni ile reasons servisi uyumlu olmalı
             When Random Yenileme İptal Nedeni ile devam ediyorum
             Then Yenileme İptalinden vazgeçirme ikna metini görünmeli
             When "Devam" butonuna tıklıyorum
             Then Yenileme İptal Talebi Müşteri Onayı görünmeli
             When Popuptaki devam butonuna lifeChangeRenewalActivationStatus servisi ile tıklıyorum
             Then lifeChangeRenewalActivationStatus "true" dönmeli
              And "İşlem başarıyla gerçekleşti." popup alt başlığı olarak görünmeli

        @yenilemeTalebiVazgeçEkFaydalı
        Scenario: Yenileme Talebinden Vazgeç butonu kontrolü - ek fayda var - devam
             When "Yenileme Talebinden Vazgeç" butonuna tıklıyorum
             Then Yenileme iptal talebi header görünmeli
              And "Poliçenin yenileme tarihine 30 günden fazla süre bulunmaktadır. Yenileme iptal talebi için, ikna akışı oluşturulmalıdır. İşleme devam etmek istiyor musunuz?" mesajı görünmeli
             When Vazgeç butonuna reasons servisi ile tıklıyorum
             Then Yenileme İptal Talebi sebep sorma bilgilendirme metni reasons servisi ile uyumlu olmalı
              And Müşterinin Yenileme İptal Nedeni ile reasons servisi uyumlu olmalı
             When Random Yenileme İptal Nedeni ile devam ediyorum
             Then Yenileme İptalinden vazgeçirme ikna metini görünmeli
              And "Poliçedeki ek faydalardan bahsediniz." mesajı görünmeli
              And Ek Fayda tablosunu görmeliyim
              And Yenileme Tercihindeki ek faydalar lifeInsuranceSummaryDetail ile uyumlu olmalı
             When "Devam" butonuna tıklıyorum
             Then Yenileme İptal Talebi Müşteri Onayı görünmeli
             When Popuptaki devam butonuna lifeChangeRenewalActivationStatus servisi ile tıklıyorum
             Then lifeChangeRenewalActivationStatus "true" dönmeli
              And "İşlem başarıyla gerçekleşti." popup alt başlığı olarak görünmeli

        @default
        Scenario: Yenileme Talebini Aktive Et butonu kontrolü
            Given Popup body "Tamam" butonuna tıklıyorum
              And Popup görünmemeli
             When "Yenileme Talebini Aktive Et" butonuna tıklıyorum
             Then Yenileme aktive talebi header görünmeli
             When Devam butonuna lifeChangeRenewalActivationStatus servisi ile tıklıyorum
             Then lifeChangeRenewalActivationStatus "true" dönmeli
              And "İşlem başarıyla gerçekleşti." popup alt başlığı olarak görünmeli
             When Popup body "Tamam" butonuna tıklıyorum
             Then "Yenileme Talebinden Vazgeç" butonu aktif olmalı

        @default
        Scenario: Etkileşim Geçmişi Kontrolü
            Given "Etkileşim Geçmişi" sekmesini seçiyorum
              And "Etkileşim Geçmişi" sekmesi açılmalı
             When "ETKİLEŞİM ANA KONU" sütununu aşağıdakiler ile filtreliyorum
                  | Sigorta Yenileme ve Yenileme İptal Buton Kontrolü |
             Then Etkileşim geçmişi tablosundaki en üstteki tarih loglanan tarihle uyumlu olmalı
              And Etkileşim geçmişi tablosundaki en üstteki durum "Bitti" olmalı
              And Etkileşim geçmişi tablosundaki en üstteki etkileşim tipi "Bilgi" olmalı