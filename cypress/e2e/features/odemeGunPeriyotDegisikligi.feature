Feature: Ödeme gün ve periyot değişikliği
        @ÖdemeİşlemleriButonPasif
        Scenario: Ödeme günü değiştirme buton kontrolü
            Given "Sigortalar" sekmesini seçiyorum
              And "Sigortalar" sekmesi açılmalı
              And Ödeme gün ve periyot değişikliği için ürünü seçiyorum
              And Sayfada daire şeklinde loader kalmamalı
              And "Ödeme İşlemleri" butonu görünmeli
              And "Ödeme İşlemleri" butonu aktif olmalı

        @ÖdemeİşlemleriButonAktif
        Scenario: Ödeme günü değiştirme buton kontrolü
            Given "Sigortalar" sekmesini seçiyorum
              And "Sigortalar" sekmesi açılmalı
              And Ödeme İşlemleri için ürünü lifeInsuranceSummaryDetail ve insurancePaymentInfo servisleri ile seçiyorum
              And Sayfada daire şeklinde loader kalmamalı
              And "Ödeme İşlemleri" butonu görünmeli
              And "Ödeme İşlemleri" butonu aktif olmalı
             When "Ödeme İşlemleri" butonuna tıklıyorum
             Then "Ödeme İşlemleri" popup açılmalı
              And Popup body aşağıdaki başlıkları içermeli
                  | Ödeme Periyodu Seçenekleri |
                  | Ödeme Günü Seçenekleri     |
              And Popup body aşağıdaki butonları içermeli
                  | İptal    |
                  | Güncelle |
              And Ödeme Günü Seçenekleri altında gün selektörü bulunmalı
              And Ödeme Periyodu Seçenekleri aşağıdaki opsiyonları içermeli
                  | Aylık   |
                  | 3 Aylık |
                  | 6 Aylık |
                  | Yıllık  |

        @odemePeriotAktif
        Scenario: Ödeme Periyodu Seçenekleri - aktif
             Then paymentPeriodChangeable "true" dönmeli
              And Ürünün ödeme periyodu haricindeki seçenekler aktif olmalı

        @odemePeriotPasif
        Scenario: Ödeme Periyodu Seçenekleri - pasif
             When Ödeme Periyodu Seçenekleri info ikonu üzerine geliyorum
             Then paymentPeriodChangeable "false" dönmeli
              And Popup body "Bu police için ödeme periyodu değişikliği yapılamamaktadır." mesajı içermeli
              And Ödeme Periyodu Seçenekleri pasif olmalı

        @ÖdemeİşlemleriButonAktif
        Scenario: Ödeme günü değiştirme selektör kontrolü - değişiklik yok
            Given Seçili ödeme gününü odemeGunu değişkenine atıyorum
             When Popup body "Güncelle" butonuna tıklıyorum
             Then Popup body "Hiçbir değişiklik yapılmadı." mesajı içermeli

        @ÖdemeİşlemleriButonAktif
        Scenario: Ödeme günü değiştirme selektör kontrolü - değişiklik iptal
             When odemeGunu haricide random bir gün seçiyorum
             Then Ödeme günü random gün olarak görülmeli
              And Ödeme günü opsiyonları config dosyası ile uyumlu olmalı
             When Popup body "İptal" butonuna tıklıyorum
             Then Popup görünmemeli
