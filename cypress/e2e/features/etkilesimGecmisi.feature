Feature: Etkileşim geçmişi işlemleri
        Scenario: Etkileşim Geçmişi Kontrolü
             When "Etkileşim Geçmişi" sekmesini seçiyorum
             Then "Etkileşim Geçmişi" sekmesi açılmalı
              And Etkileşim geçmişi navigasyonunda 4 sekme olmalı
              And "Etkileşim Geçmişi" etkileşim geçmişi alt sekmesi olarak seçili olmalı
              And "Manuel Aktivite Girişi" butonu görünmeli
              And Etkileşim geçmişi alt sekmesinde aşağıdaki sütunlar bulunmalı
                  | ÇAĞRI YÖNÜ               |
                  | ŞİKAYET / TALEP NUMARASI |
                  | TARİH / SAAT             |
                  | KANAL                    |
                  | POLİÇE/                  |
                  | SÖZLEŞME NO              |
                  | ETKİLEŞİM TİPİ           |
                  | ETKİLEŞİM ANA KONU       |
                  | ETKİLEŞİM DETAY KONU     |
                  | KULLANICI                |
                  | DURUM                    |
                  | CALL ID                  |

       
        Scenario: Etkileşim Geçmişi Filtreleme
             When "ETKİLEŞİM TİPİ" sütununu "Bilgi" ile filtreliyorum
             Then Her satırda "Bilgi" filtresi görülmeli

       
        Scenario: Gönderi Geçmişi manuel tarih seçici kontrolü
            Given "Gönderi Geçmişi" etkileşim geçmişi alt sekmesi olarak seçiyorum
              And "Başlangıç Tarihi" olarak "19.05.2024" giriyorum
              And "Bitiş Tarihi" olarak "19.05.2024" giriyorum
              And Kanal olarak "MOBİL BİLDİRİM" seçiyorum
             When "SORGULA" butonuna tıklıyorum
             Then Gönderi geçmişi tablosunda aşağıdaki sütunlar bulunmalı
                  | CMP Kayıt Id    |
                  | Müşteri No      |
                  | TCKN            |
                  | Sözleşme No     |
                  | Başvuru No      |
                  | Ad Soyad        |
                  | Gönderim Tarihi |
                  | Telefon Tipi    |
                  | Statü           |
                  | Detay           |
             When "TEMİZLE" butonuna tıklıyorum
             Then Gönderi geçmişi tablosu kaybolmalı

       
        Scenario Outline: Gönderi Geçmişi hazır tarih seçme butonları kontrolü
            Given "<buton_adı>" butonuna tıklıyorum
              And Kanal olarak "MOBİL BİLDİRİM" seçiyorum
             When "SORGULA" butonuna tıklıyorum
             Then Gönderi geçmişi tablosunda aşağıdaki sütunlar bulunmalı
                  | CMP Kayıt Id    |
                  | Müşteri No      |
                  | TCKN            |
                  | Sözleşme No     |
                  | Başvuru No      |
                  | Ad Soyad        |
                  | Gönderim Tarihi |
                  | Telefon Tipi    |
                  | Statü           |
                  | Detay           |
             When "TEMİZLE" butonuna tıklıyorum
             Then Gönderi geçmişi tablosu kaybolmalı
        Examples:
                  | buton_adı   |
                  | BUGÜN       |
                  | SON 1 HAFTA |
                  | SON 1 AY    |

        Scenario: Doküman Görüntüleme kontrolü
             When "Doküman Görüntüleme" etkileşim geçmişi alt sekmesi olarak seçiyorum
             Then "Doküman Görüntüleme" etkileşim geçmişi alt sekmesi olarak seçili olmalı
              And Doküman Görüntüleme tablosunda aşağıdaki sütunlar bulunmalı
                  | Belge No            |
                  | Gönderim Tarihi     |
                  | Evrak Tipi          |
                  | Kanal               |
                  | Referans - Açıklama |
                  | Doküman             |
              And Doküman Görüntüleme tablosundaki her satırda görüntüle butonu görülmeli

        Scenario: Doküman Görüntüleme - Gönderim Tarihi filtre kontrolü - Dönem seç
             When "Son 1 Ay" dönem seçerek filtreliyorum
             Then Gönderim Tarihi filtresini kapatma ikonu görülmeli
             When Gönderim Tarihi filtresini kapatma ikonunu tıklıyorum
             Then Doküman Görüntüleme tablosundaki her satırda görüntüle butonu görülmeli

        Scenario: Doküman Görüntüleme - Gönderim Tarihi filtre kontrolü - Tarih Aralığı Gir
            Given Tarih aralığı gir tabına tıklıyorum
              And Başlangıç tarihi gün-ay-yıl olarak "10"-"10"-"2023" giriyorum
              And Bitiş tarihi gün-ay-yıl olarak "15"-"10"-"2023" giriyorum
             When "Uygula" butonuna tıklıyorum
             Then Gönderim Tarihi filtresini kapatma ikonu görülmeli
             When Gönderim Tarihi filtresini kapatma ikonunu tıklıyorum
             Then Doküman Görüntüleme tablosundaki her satırda görüntüle butonu görülmeli
