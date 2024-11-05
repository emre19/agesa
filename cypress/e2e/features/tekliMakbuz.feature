@default #B502659
Feature: Tekli makbuz kontrolü

        Scenario: Makbuzlar buton kontrolü
            Given "Sigortalar" sekmesini seçiyorum
              And "Sigortalar" sekmesi açılmalı
        #Sadece istediğim poliçe numaralı ürünü herhangi bir servise intercept etmeden seçme
             When Ürünü poliçe numarası ile seçiyorum
             Then "Ödeme Bilgileri" butonu görünmeli
              And "Ödeme Bilgileri" butonu aktif olmalı


        Scenario: Tekli makbuzlar servis ve ui da sütun başlığı ile uyarı mesajı kontrolü
             When lifePaymentHistory servisinden response alarak "Ödeme Bilgileri" butonuna tıklıyorum
             Then "E-posta ile Gönder" butonu görünmeli
              And "E-posta ile Gönder" butonu pasif olmalı
              And Maksimum 10 Adet makbuz gönderilebilir uyarı mesajı kırmızı renkte görülmeli
              And Tekli makbuzlar tablosunda aşağıdaki sütunlar bulunmalı
                  | Vade Tarihi       |
                  | Ödeme Tarihi      |
                  | Ödenen Tutar      |
                  | Ödeme Şekli       |
                  | Ödeme Tipi        |
                  | Ödeme Döviz Cinsi |

        Scenario: Tekli Makbuz tablosu satırlarının servisten gelen response ile kontrolü ve açılan pdf de makbuz adı kontrolü
             Then Tekli Makbuz tablosundaki satırların iceriklerinin servisten gelen response ile kontrolü
             When 1. sıradaki makbuzu açıyorum
             Then Açılan pdfte makbuz adı görünmeli

        Scenario: Tekli Makbuz 10 adetten fazla gönderim yapılamaması kontrolü
             When "Kapat" butonuna tıklıyorum
              And Tekli makbuz tablosundaki ilk 10 makbuzu seçiyorum
              And "öğenin tamamını seç" yazısına tıklıyorum
             Then "E-posta ile Gönder" butonu pasif olmalı
             When "Seçimi Temizle" yazısına tıklıyorum

        Scenario: Tekli Makbuz gönderim kontrolü
             When Tekli makbuz tablosundaki ilk 10 makbuzu seçiyorum
              And "E-posta ile Gönder" butonuna tıklıyorum
             Then "Makbuz Gönderme" popup açılmalı
             When Popup body email input kutusunu temizleme
             Then Popup body aşağıdaki başlıkları içermeli
                  | Tercih Sorusu                    |
                  | Sadece bu işlem için kullan      |
                  | İletişim adresim olarak güncelle |
             When Şuanki tarihi logluyorum
              And Tekli makbuz gönderme popup bodye email ekliyorum
             Then sendMailCreateReceiptDocumentRes "true" dönmeli

        Scenario: Tekli Makbuz için filtre tarih Kontrolü
             When "Tamam" butonuna tıklıyorum
              And 1. tarih aralığını gün-ay-yıl olarak "01"-"01"-"2022" giriyorum
              And 2. tarih aralığını gün-ay-yıl olarak "01"-"01"-"2023" giriyorum
             Then paymentInformationList eleman içerikleri ile filtrelenen tablodaki satırların içerikleri aynı olmalı

        Scenario: Tekli Makbuz için Hızlı Tarih Aralığı Seçiminde Data Var Kontrolü
             When lifePaymentHistory servisinden response alarak hızlı tarih aralığı olarak "Son 1 Yıl" seçeneğini seçiyorum
             Then Seçim yapıldıktan sonra filtrelenen data içerigi servis ile uyumlu olmalı

        Scenario: Tekli Makbuz için Hızlı Tarih Aralığı Seçiminde Data Yok Kontrolü
            Given lifePaymentHistory servisinden response alarak hızlı tarih aralığı olarak "Son 1 Ay" seçeneğini seçiyorum
             Then Seçim yapıldıktan sonra filtreye uygun data olmadıgı için uyarı mesajı görüntülenmelidir

        Scenario: Tekli Makbuz için Etkileşim Geçmişi Kontrolü
             When "Etkileşim Geçmişi" sekmesini seçiyorum
             Then "Etkileşim Geçmişi" sekmesi açılmalı
             When "ETKİLEŞİM ANA KONU" sütununu aşağıdakiler ile filtreliyorum
                  | Sigortalar Tekli Makbuzların Gösterilmesi |
                  | Sigortalar Tekli Makbuzların Gönderimi    |
             Then Etkileşim geçmişi tablosundaki en üstteki tarih loglanan tarihle uyumlu olmalı


