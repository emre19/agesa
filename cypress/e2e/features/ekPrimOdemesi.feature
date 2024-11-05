# B502892
Feature: Ek prim ödemesi
        @default
        Scenario: Ek Prim Ödemesi buton kontrolü
            Given "Sigortalar" sekmesini seçiyorum
              And "Sigortalar" sekmesi açılmalı
             When Ürünü poliçe numarası ile seçiyorum
             Then Sayfada daire şeklinde loader kalmamalı
              And "Ek Prim Ödemesi" butonu görünmeli
              And "Ek Prim Ödemesi" butonu aktif olmalı
        @default
        Scenario: Ek Prim Ödemesi ekran kontrolü
             When Ek Prim Ödemesi butonuna permanentLifeInsurance ve customerPaymentMethods ile tıklıyorum
             Then Bilgilendirme metni ile permanentLifeInsurance uyumlu olmalı
              And Tanımlı ödeme yöntemi ile customerPaymentMethods uyumlu olmalı
              And Poliçe bilgileri ile permanentLifeInsurance uyumlu olmalı
        @default
        Scenario: Ek Prim Ödeme akış kontrolü - iptal
            Given Toplam birikim tutarının yarısı kadar ek prim miktarı ile öde butonuna tıklıyorum
             When Popup body "Hayır" butonuna tıklıyorum
             Then Popup görünmemeli

        @ekPrimBaşarısız
        Scenario: Ek Prim Ödeme akış kontrolü - devam - başarısız
            Given "Öde" butonuna tıklıyorum
             When Popup body Evet butonuna additionalPremiumPayment ile tıklıyorum
             Then additionalPremiumPayment "false" dönmeli
              And Popup body "Bilgilendirme Metni" mesajı içermeli
              And additionalPremiumPayment ile başarısız işlem mesajı uyumlu olmalı

        @ekPrimBaşarılı
        Scenario: Ek Prim Ödeme akış kontrolü - devam - başarılı
            Given "Öde" butonuna tıklıyorum
             When Popup body Evet butonuna additionalPremiumPayment ile tıklıyorum
             Then additionalPremiumPayment "true" dönmeli
              And additionalPremiumPayment ile başarılı işlem mesajı uyumlu olmalı