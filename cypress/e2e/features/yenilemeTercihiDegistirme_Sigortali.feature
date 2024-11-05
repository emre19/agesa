# Y-2876577
# Yenileme Tercihi Değiştirme Aktif için MUSTERI_ROLU="Sigorta Ettiren",
# Yenileme Tercihi Değiştirme Pasif için MUSTERI_ROLU="Sigortalı",
# MUSTERI_ROLU="Sigorta Ettiren" terminalden --env ile yada .env dosyasından verilmeli
# CI entegrasyonu yapılınca Jenkins den verilmeli
# !!! Bu test case için MUSTERI_ROLU="Sigortalı" olarak verilmeli !!!
@default
Feature: (BCM-10668) Yenileme Tercihi Değiştirme
        Scenario: Yenileme Tercihi Değiştirme Pasiflik Kontrolü
            Given "Sigortalar" sekmesini seçiyorum
              And "Sigortalar" sekmesi açılmalı
             When Yenileme Tercihi değiştirme olan ürünü lifeInsuranceSummaryDetail ile seçiyorum
             Then "Yenileme Talebinden Vazgeç" butonu pasif olmalı
             And Yenilemeye kalan gün sayısı 30'dan fazla olmalı
             When "Yenileme Talebinden Vazgeç" butonu ünlem işareti üzerine geliyorum
             Then "Poliçe yenileme/yenilenmeme talebi sigortalıdan alınamamaktadır, sigorta ettiren ile işlem yapılmalıdır." mesajı görünmeli