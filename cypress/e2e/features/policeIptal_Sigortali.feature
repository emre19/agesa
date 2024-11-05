# Poliçe İptal Butonu Aktif için MUSTERI_ROLU="Sigorta Ettiren",
# Poliçe İptal Butonu Pasif için MUSTERI_ROLU="Sigortalı",
# MUSTERI_ROLU="Sigorta Ettiren" terminalden --env ile yada .env dosyasından verilmeli
# CI entegrasyonu yapılınca Jenkins den verilmeli
# !!! Bu test case için MUSTERI_ROLU="Sigortalı" olarak verilmeli !!!

#Sigorta ettiren gerçek kişi
# I-201704
@sigortaEttirenGercekKisi
Feature: (BCM-) Poliçe iptal işlemi - Sigortalı
        Scenario: Yenileme Tercihi Değiştirme Pasiflik Kontrolü
            Given "Sigortalar" sekmesini seçiyorum
              And "Sigortalar" sekmesi açılmalı
             When Ürünü poliçe numarası ile seçiyorum
             Then "İptal Talebi" butonu pasif olmalı
             When "İptal Talebi" butonu ünlem işareti üzerine geliyorum
             Then "Bu poliçede iptal talebi sigortalıdan alınamamaktadır, bu işlem için hak sahibi sigorta ettiren olduğu için talep sigorta ettirenden alınmalıdır." mesajı görünmeli

  #Sigorta ettiren tüzel kişi
  # Y2876577
        @sigortaEttirenTüzelKisi
        Scenario: Yenileme Tercihi Değiştirme Pasiflik Kontrolü
            Given "Sigortalar" sekmesini seçiyorum
              And "Sigortalar" sekmesi açılmalı
             When Ürünü poliçe numarası ile seçiyorum
             Then "İptal Talebi" butonu pasif olmalı
             When "İptal Talebi" butonu ünlem işareti üzerine geliyorum
             Then "Sigorta ettirenin Tüzel Kişilik olması nedeniyle, evraklı işlem yapılabilmektedir. İşlem için şirket kaşeli talep formu, imza sirküleri, vergi levhası ve ticaret sicil gazetesinin faks/e-posta ile gönderilmesi gerekmektedir." mesajı görünmeli