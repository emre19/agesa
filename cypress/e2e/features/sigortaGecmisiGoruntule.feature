Feature: Sigorta Gecmisini Görüntüle kontrolü

        @default #I201704
        Scenario: Sigorta Gecmisini Görüntüle sayfasında sabit değerler kontrolü
            Given "Sigortalar" sekmesini seçiyorum
              And "Sigortalar" sekmesi açılmalı
             When Ürünü poliçe numarası ile seçiyorum
              And "Sigorta Geçmişini Görüntüle" butonuna tıklayıp ilgili servislerinden gelen response kaydediyorum
             Then Aşağıdaki sabit değerler Sigorta Geçmişini Görüntüle sayfasında görüntülenmelidir
                  | Sigorta Geçmişi            |
                  | Tarih Aralığı Seçimi       |
                  | Hızlı Tarih Aralığı Seçimi |
                  | HESAP HAREKETLERİ          |
                  | İŞLEMLER                   |

        @default #I201704
        Scenario: Default olarak gelen tarih, hızlı tarih ve Hesap Hareketleri sekmesinin kontrolü
             Then Sayfa açıldığında hızlı tarih seçimi "Son 1 Ay" olarak seçilmiş gözükmelidir
              And İkinci tarih aralığı bugünün tarihini ve birinci tarih aralığı ise bugünden 1 ay öncesini göstermelidir
              And "HESAP HAREKETLERİ" sekmesi açılmalı

        @default #I201704
        Scenario: Soldaki tabloyu servisten gelen data ile kontrol etme
             Then Sigorta geçmişini görüntüle sayfasında soldaki tablo servisten gelen data ile uyumlu olmalı

        @SigortaGecmisi-prefix-B #B502659
        Scenario: Sağdaki tabloyu servisten gelen data ile kontrol etme
             Then Sigorta geçmişini görüntüle sayfasında sagdaki tablo servisten gelen data ile uyumlu olmalı

        @SigortaGecmisi-prefix-B #B502659
        Scenario: Hesap Hareketleri için Tarih Aralığı Seçimi yaparak filtreleme kontrolü
             When Hesap Hareketleri tablosunu filtrelemek için 1. tarih aralığını gün-ay-yıl olarak "19"-"07"-"2021" giriyorum
              And Hesap Hareketleri tablosunu filtrelemek için 2. tarih aralığını gün-ay-yıl olarak "01"-"08"-"2024" giriyorum
             Then Hesap Hareketleri tablosunda aşağıdaki sütun isimlerini görmeliyim
                  | İşlem Tarihi |
                  | İşlem Türü   |
                  | Birim Tarihi |
                  | Birim Fiyatı |
                  | Birim Adedi  |
                  | İşlem Tutarı |
              And Hesap Hareketleri tablosunun satırlarındaki datalar servisten gelen data ile uyumlu olmalı

        @default #I201704
        Scenario: İŞLEMLER tablosu için Tarih Aralığı Seçimi yaparak filtreleme kontrolü
             When "İŞLEMLER" sekmesini seçiyorum
              And İşlemler tablosunu filtrelemek için 1. tarih aralığını gün-ay-yıl olarak "19"-"07"-"2021" giriyorum
              And İşlemler tablosunu filtrelemek için 2. tarih aralığını gün-ay-yıl olarak "12"-"08"-"2024" giriyorum
             Then İşlemler tablosunda aşağıdaki sütun isimlerini görmeliyim
                  | Zeyil Sıra No     |
                  | Açıklama          |
                  | Başlangıç Tarihi  |
                  | Tamamlanma Tarihi |
                  | Kanal             |
              And İşlemler tablosunun satırlarındaki datalar servisten gelen data ile uyumlu olmalı

        @default #I201704
        Scenario: Hesap hareketleri tablosunda seçilen tarihte data olmadığı için hesap hareketleri bulunamamıştır uyarı mesajının kontrolü
             When "HESAP HAREKETLERİ" sekmesini seçiyorum
              And Hesap Hareketleri tablosunu filtrelemek için 1. tarih aralığını gün-ay-yıl olarak "19"-"07"-"2024" giriyorum
              And Hesap Hareketleri tablosunu filtrelemek için 2. tarih aralığını gün-ay-yıl olarak "01"-"08"-"2024" giriyorum
             Then "Tarihleri arasında hesap hareketleri bulunamamıştır." mesajı görünmeli
              And Çarpı işareti iconu görünmeli

        @default #I201704
        Scenario: İşlemler tablosunda seçilen tarihte data olmadığı için hesap hareketleri bulunamamıştır uyarı mesajının kontrolü
             When "İŞLEMLER" sekmesini seçiyorum
              And İşlemler tablosunu filtrelemek için 1. tarih aralığını gün-ay-yıl olarak "31"-"07"-"2024" giriyorum
              And İşlemler tablosunu filtrelemek için 2. tarih aralığını gün-ay-yıl olarak "01"-"08"-"2024" giriyorum
             Then "Tarihleri arasında zeyil hareketleri bulunamamıştır." mesajı görünmeli
              And Çarpı işareti iconu görünmeli

        @default #I201704
        Scenario: İşlemler tablosu baz alınarak Hızlı Tarih Aralığı seçilerek datanın kontrolü
             When lifeInsuranceAppendixActivities servisinden response alarak hızlı tarih aralığı olarak "Son 1 Yıl" seçeneğini seçiyorum
             Then İşlemler tablosunun satırlarındaki datalar servisten gelen data ile uyumlu olmalı

        @SigortaGecmisi-prefix-B #B502659
        Scenario: Hesap hareketlerindeki E-MAİL ADRESİNE YOLLA buton kontrolü
             When "HESAP HAREKETLERİ" sekmesini seçiyorum
              And İşlemler tablosunu filtrelemek için 1. tarih aralığını gün-ay-yıl olarak "22"-"09"-"2021" giriyorum
              And İşlemler tablosunu filtrelemek için 2. tarih aralığını gün-ay-yıl olarak "01"-"08"-"2024" giriyorum
             Then "E-MAİL ADRESİNE YOLLA" butonu görünmeli
              And "E-MAİL ADRESİNE YOLLA" butonu aktif olmalı

        @SigortaGecmisi-prefix-B #B502659
        Scenario: Hesap hareketlerindeki E-MAİL ADRESİNE YOLLA butonuna tıkladıktan sonra açılan pdf kontrolü
             When "E-MAİL ADRESİNE YOLLA" butonuna tıklayıp lifeInsuranceAccountHistoryFile servisinin response kaydediyorum
             Then Sayfada daire şeklinde loader kalmamalı
              And "Kapat" butonu aktif olmalı
              And "Doküman Gönder" butonu aktif olmalı
              And Açılan pdf ile lifeInsuranceAccountHistory servisi uyumlu olmalı

        @SigortaGecmisi-prefix-B #B502659
        Scenario: Hesap hareketlerindeki Doküman Gönder butonuna tıkladıktan sonra açılan popup daki içeriklerin kontrolü
             When "Doküman Gönder" butonuna tıklıyorum
             Then "Hesap Hareketleri Dokümanı Gönderme" popup açılmalı
              And Hesap Hareketleri Dökumanı Gönderme ile ilgili bilgilendirme metni görüntülenmeli
             When Popup body email input kutusunu temizleme
             Then Popup body aşağıdaki başlıkları içermeli
                  | Tercih Sorusu                    |
                  | Sadece bu işlem için kullan      |
                  | İletişim adresim olarak güncelle |

        @SigortaGecmisi-prefix-B #B502659
        Scenario: Sigorta hesap hareketleri dokümanının e-mail yoluyla başarıyla şekilde gönderilmesi kontrolü
             When Popup body iletişim eposta alanına email ekliyorum
              And "Dokümanı Gönder" butonuna tıklayıp sendLifeInsuranceAccountHistoryFileEmail servisinin response kaydediyorum
             Then sendLifeInsuranceAccountHistoryFileEmailRes "true" dönmeli
              And "Sigorta hesap hareketleri dokümanınız başarıyla gönderilmiştir." popup alt başlığı olarak görünmeli
             Then Sigorta hesap hareketleri dokümanını başarıyla gönderme ile ilgili bilgilendirme metni görüntülenmeli
             When Popup body "Tamam" butonuna tıklıyorum
             Then Popup görünmemeli


