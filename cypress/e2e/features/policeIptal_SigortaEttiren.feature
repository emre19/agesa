# NOT:
# 1- "Müşterinin İptal Nedeni" ürün bazında config filedan okunsun + ekstra
# 2- "İkna/Tutundurma Metni" ürün bazında config filedan okunsun + ekstra
#DONE=> 3- "Lehtar bilgisi Daini Mürtein" lifeRecallMessage => @talepSayfaPoliceIptal tagine
#DONE=> 4- Tanımlı Ödeme yöntemi haricinde bir yöntemle devam etme => Emre Dikerin yaptıkları ile check et.

# Poliçe İptal Butonu Aktif için MUSTERI_ROLU="Sigorta Ettiren",
# Poliçe İptal Butonu Pasif için MUSTERI_ROLU="Sigortalı",
# MUSTERI_ROLU="Sigorta Ettiren" terminalden --env ile yada .env dosyasından verilmeli
# CI entegrasyonu yapılınca Jenkins den verilmeli
# !!! Bu test case için MUSTERI_ROLU="Sigortalı" olarak verilmeli !!!

#I_18_1 ürününde @direktPoliceIptal @poliçeIptalAçıkVade => I-204063
#I_18_2 ürünü @talepSayfaPoliceIptal @poliçeIptalAçıkVade=> I-201704
#I_18_2_Direkt_Iptal @poliçeIptalAçıkVadeİadeYapılacakYeniHesap => I-289021
#K_63_3 ürünü @poliçeIptalAçıkVadeYokTanımlıÖdeme => K3556972 (yeni data iste)
#K_63_6 ürünü K3556969 @poliçeIptalAçıkVade

Feature: (BCM-) Poliçe iptal işlemi - Sigorta ettiren
        @default
        Scenario: Poliçe iptal işlemi buton kontrolü
            Given "Sigortalar" sekmesini seçiyorum
              And "Sigortalar" sekmesi açılmalı
             When Ürünü poliçe numarası ile seçiyorum
             Then "İptal Talebi" butonu aktif olmalı

        @default
        Scenario: Poliçe iptal işlemi akış kontrolü
            Given Şuanki tarihi logluyorum
             When İptal Talebi butonuna lifePolicyDeductionsAndPaidAmount ve reasons servisi ile tıklıyorum
             Then Poliçe iptal talebi header görünmeli
              And Poliçe iptal talebi bilgilendirme metni lifePolicyDeductionsAndPaidAmount servisi ile uyumlu olmalı
              And Poliçe iptal hesap tablosu lifePolicyDeductionsAndPaidAmount servisi ile uyumlu olmalı
             When "Devam" butonuna tıklıyorum
             Then Poliçe iptal talebi header görünmeli
              And Poliçe İptal Nedeni ile reasons servisi uyumlu olmalı
              And Poliçe iptal talebi bilgilendirme metni reasons servisi ile uyumlu olmalı
             When Random Poliçe İptal Nedeni ile devam ederken saveProductOperationReason ve persuasionMessage servis dönütlerini alıyorum
             Then Poliçe iptal talebi header görünmeli
              And Poliçe iptal talebi Tutundurma metni persuasionMessage servisi ile uyumlu olmalı

        @poliçeIptalAçıkVade @talepSayfaPoliceIptal
        Scenario: Poliçe iptal işlem kontrolüa - açık vade yok - talep sayfası
             When Devam butonuna lifeRecallMessage, policy-detail, contact-detail, subjects, combinations,create-flow ve find-potential-workgroup servisleri ile tıklıyorum
             Then "Talepler" sekmesi açılmalı
              And lifeRecallMessage servisinde redirectToDemand "true" dönmeli
              And create-flow servisi "false" dönmeli
              And create-flow servisi error mesajı görünmeli
              And Poliçe iptal talebi sayfasında Aktivite Tipi, Talebin Konusu, Talebin Detay Konusu configdeki gibi görünmeli
              And Poliçe iptal talebi sayfasındaki iletişim bilgileri contact-detail servisi ile uyumlu olmalı
             When Poliçe iptal talebi sayfasındaki açıklama kısmını doldurmadan Kaydet butonuna tıklıyorum
             Then "Bu alan boş geçilemez." mesajı görünmeli
             When Poliçe iptal talebi için random açıklama yazarak Kaydet butonuna tıklıyorum
             Then Poliçe iptal talebi için hata uyarı popup görünmeli

        @poliçeIptalAçıkVade @direktPoliceIptal
        Scenario: Poliçe iptal işlem kontrolü - açık vade var - direkt iptal
             When Devam butonuna lifeRecallMessage, bankInfo ve lifePaymentTypeInfo servisleri ile tıklıyorum
             Then Poliçe iptal talebi header görünmeli
              And lifeRecallMessage servisinde redirectToDemand "false" dönmeli
              And Poliçe iptal talebi bilgilendirme metni lifePaymentTypeInfo servisi ile uyumlu olmalı
              And Poliçe iptal hesap tablosundaki çıkış tarihi lifePaymentTypeInfo servisi ile uyumlu olmalı
             When "Devam" butonuna tıklıyorum
             Then "Poliçe İptal Onayı" popup açılmalı
     #    When Popup body Evet butonuna lifeSaveExitAddendum ile tıklıyorum
     #    Then lifeSaveExitAddendum servisi "false" dönmeli

        @poliçeIptalAçıkVadeİadeYapılacakYeniHesap
        Scenario: Poliçe iptal işlem kontrolü - açık vade var - direkt iptal - iade yapılacak yeni hesap
             When Devam butonuna lifeRecallMessage, bankInfo ve lifePaymentTypeInfo servisleri ile tıklıyorum
             Then Poliçe iptal talebi header görünmeli
              And lifeRecallMessage servisinde redirectToDemand "false" dönmeli
              And Poliçe iptal talebi bilgilendirme metni lifePaymentTypeInfo servisi ile uyumlu olmalı
              And Poliçe iptal hesap tablosundaki çıkış tarihi lifePaymentTypeInfo servisi ile uyumlu olmalı
              And "Devam" butonu pasif olmalı
              And Poliçe iptali için tanımlı ödeme yöntemi lifePaymentTypeInfo servisi ile uyumlu olmalı
             When Radio buton olarak "İade Yapılacak Yeni Hesap" seçeneğine tıklıyorum
              And Banka bilgisi dropdown butonuna tıklıyorum
              And Açılan dropdowndan "AKBANK" bir hesap seçiyorum
              And Radio buton olarak "Kendi hesabım" seçeneğine tıklıyorum
             Then Hesap numarası alanı görünmeli
             When Iban input kutusuna "TR336534673765375757575757" değerini giriyorum
             Then "Devam" butonu aktif olmalı
             When "Devam" butonuna tıklıyorum
             Then "Poliçe İptal Talebi" popup açılmalı
              And "İşlem gerçekleştirilirken bir hata oluştu." popup alt başlığı olarak görünmeli
              And "Tamam" butonuna tıklıyorum


        @poliçeIptalAçıkVadeYokTanımlıÖdeme
        Scenario: Poliçe iptal işlem kontrolü - açık vade yok - direkt iptal - tanımlı ödeme yöntemi
             When Devam butonuna lifeRecallMessage, bankInfo ve lifePaymentTypeInfo servisleri ile tıklıyorum
             Then Poliçe iptal talebi header görünmeli
              And lifeRecallMessage servisinde redirectToDemand "false" dönmeli
              And Poliçe iptal talebi bilgilendirme metni lifePaymentTypeInfo servisi ile uyumlu olmalı
              And Poliçe iptal hesap tablosundaki çıkış tarihi lifePaymentTypeInfo servisi ile uyumlu olmalı
              And "Devam" butonu pasif olmalı
              And Poliçe iptali için tanımlı ödeme yöntemi lifePaymentTypeInfo servisi ile uyumlu olmalı
             When Radio buton olarak "Başkasının hesabı" seçeneğine tıklıyorum
             Then "Başkasına ait bir hesaba iade talep ederseniz e-postanıza bir örneği gönderilen vekaletnameyi imzalayıp AgeSA'ya göndermeniz gerekmektedir." mesajı görünmeli
              And "Devam" butonu pasif olmalı
             When Radio buton olarak "Kendi hesabım" seçeneğine tıklıyorum
             Then "Devam" butonu aktif olmalı
             When "Devam" butonuna tıklıyorum
             Then "Poliçe İptal Onayı" popup açılmalı
              And Poliçe İptal Onayı bilgilendirme metni lifePaymentTypeInfo servisi ile uyumlu olmalı
     #    When Popup body Evet butonuna lifeSaveExitAddendum ile tıklıyorum
     #    Then lifeSaveExitAddendum servisi "false" dönmeli

        @default
        Scenario: Etkileşim Geçmişi Kontrolü
            Given "Etkileşim Geçmişi" sekmesini seçiyorum
              And "Etkileşim Geçmişi" sekmesi açılmalı
             When "ETKİLEŞİM ANA KONU" sütununu aşağıdakiler ile filtreliyorum
                  | BES/Sigorta müşterinin çıkış nedeni alanların getirilmesi |
              And Etkileşim geçmişi tablosundaki en üstteki tarih loglanan tarihle uyumlu olmalı
              And Her satırda "Bilgi" filtresi görülmeli