# Poliçe cayma Butonu Aktif için MUSTERI_ROLU="Sigorta Ettiren",
# Poliçe cayma Butonu Pasif için MUSTERI_ROLU="Sigortalı",
# MUSTERI_ROLU="Sigorta Ettiren" terminalden --env ile yada .env dosyasından verilmeli
# CI entegrasyonu yapılınca Jenkins den verilmeli
# !!! Bu test case için MUSTERI_ROLU="Sigortalı" olarak verilmeli !!!

#I_18_3 => I-400130  @caymaTalebi
#Z_3_17 => Z-6681125  @direktCayma easyToExit

Feature: (BCM-10820) Poliçe cayma işlemi - Sigorta ettiren
        @default
        Scenario: Poliçe cayma işlemi buton kontrolü
            Given "Sigortalar" sekmesini seçiyorum
              And "Sigortalar" sekmesi açılmalı
             When Poliçe cayma ürününü checkLifeCancellationAvailability servisi ile seçiyorum
             Then "Cayma Talebi" butonu aktif olmalı
             When "Cayma Talebi" butonu ünlem işareti üzerine geliyorum
             Then checkLifeCancellationAvailability servisindeki son cayma tarihi sayfada görünmeli

        @caymaTalebi
        Scenario: Poliçe cayma işlemi akış kontrolü - caymaTalebi
             When Cayma Talebi butonuna lifePolicyDeductionsAndPaidAmount ve reasons servisi ile tıklıyorum
             Then Poliçe cayma talebi header görünmeli
              And Poliçe cayma talebi bilgilendirme metni lifePolicyDeductionsAndPaidAmount servisi ile uyumlu olmalı
              And Poliçe cayma hesap tablosu lifePolicyDeductionsAndPaidAmount servisi ile uyumlu olmalı
             When "Devam" butonuna tıklıyorum
             Then Poliçe cayma talebi header görünmeli
              And Poliçe cayma Nedeni ile reasons servisi uyumlu olmalı
              And Poliçe cayma talebi bilgilendirme metni reasons servisi ile uyumlu olmalı
             When Random Poliçe cayma Nedeni ile devam ederken saveProductOperationReason ve persuasionMessage servis dönütlerini alıyorum
             Then Poliçe cayma talebi header görünmeli
              And Poliçe cayma talebi Tutundurma metni persuasionMessage servisi ile uyumlu olmalı

        @caymaTalebi
        Scenario: Poliçe cayma işlemi için talepler sekmesi kontrolü - caymaTalebi
             When Poliçe cayma için devam butonuna contact-detail, create-flow, persuasion-status ve find-potential-workgroup servisleri ile tıklıyorum
             Then "Talepler" sekmesi açılmalı
              And Poliçe cayma talebi sayfasında Aktivite Tipi, Talebin Konusu, Talebin Detay Konusu configdeki gibi görünmeli
              And Poliçe cayma talebi sayfasındaki iletişim bilgileri contact-detail servisi ile uyumlu olmalı

        @direktCayma
        Scenario: Poliçe cayma işlemi akış kontrolü - direktCayma
             When Cayma Talebi butonuna lifePolicyDeductionsAndPaidAmount ve reasons servisi ile tıklıyorum
             Then Poliçe cayma talebi header görünmeli
              And Poliçe cayma talebi bilgilendirme metni lifePolicyDeductionsAndPaidAmount servisi ile uyumlu olmalı
              And Poliçe cayma hesap tablosu lifePolicyDeductionsAndPaidAmount servisi ile uyumlu olmalı
             When "Devam" butonuna tıklıyorum
             Then Poliçe cayma talebi header görünmeli
              And Poliçe cayma Nedeni ile reasons servisi uyumlu olmalı
              And Poliçe cayma talebi bilgilendirme metni reasons servisi ile uyumlu olmalı
             When Random Poliçe cayma Nedeni ile devam ederken saveProductOperationReason servis dönütünü alıyorum
             Then Poliçe cayma talebi header görünmeli
              And Poliçe cayma talebi Tutundurma metni saveProductOperationReason servisi ile uyumlu olmalı

        @direktCayma
        Scenario: Poliçe cayma işlem kontrolü -direktCayma
             When Poliçe cayma için devam butonuna lifeRecallMessage, bankInfo ve lifePaymentTypeInfo servisleri ile tıklıyorum
             Then Poliçe cayma talebi header görünmeli
              And Poliçe cayma talebi bilgilendirme metni lifePaymentTypeInfo servisi ile uyumlu olmalı
              And Poliçe cayma hesap tablosundaki çıkış tarihi lifePaymentTypeInfo servisi ile uyumlu olmalı
              And Poliçe cayma için tanımlı ödeme yöntemi lifePaymentTypeInfo servisi ile uyumlu olmalı
              And "Devam" butonu pasif olmalı
             When Radio buton olarak "Kendi hesabım" seçeneğine tıklıyorum
             Then "Devam" butonu aktif olmalı
             When "Devam" butonuna tıklıyorum
             Then "Poliçe Cayma Onayı" popup açılmalı
# When Poliçe cayma için popup body Evet butonuna lifeSaveExitAddendum ile tıklıyorum
# Then Poliçe cayma için lifeSaveExitAddendum servisi "false" dönmeli
