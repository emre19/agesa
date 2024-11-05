Feature: Sigortalar Sekmesi Giriş Sayfası kontrolü

        @default
        Scenario: Tüm sigortalar başlığındaki kartların içeriklerinin servisten gelen response ile uyum kontrolü
            Given "Sigortalar" sekmesini seçiyorum
             Then "Sigortalar" sekmesi açılmalı
             When Sigorta listeleme ekranı için lifeInsuranceSummary servisinin response kaydediyorum
              And lifeInsuranceSummary servisinden gelen policyType ve policyCount değerlerini kaydediyorum

        @tumPolicelerdenCikisYapilmis #Y-2877073
        Scenario: Tüm Sigortalar başlığı altındaki Hayat-Ferdi Kaza-Sağlık kartlarında ürün bulunmaması kontrolü
             Then "Hayat" için ürün olmadıgına dair uyarı mesajını görmeliyim
              And "Ferdi Kaza" için ürün olmadıgına dair uyarı mesajını görmeliyim
              And "Sağlık" için ürün olmadıgına dair uyarı mesajını görmeliyim
              And Sigortalar sayfasında aşağıdaki poliçe başlıklarını görmeliyim
                  | Tüm Sigortalar          |
                  | Geçmiş Dönem Poliçeleri |

        @tumPolicelerdenCikisYapilmis #@GecmisDonemPoliceVar #Y-2877073
        Scenario: Geçmiş Dönem Poliçeleri poliçe tablosu datalarının servisten dönen response ile kontrolü
             Then "Geçmiş Dönem Poliçeleri" poliçe tablosunun sağ üst köşesinde yazan adet sayısı servisten gelen response ile aynı olmalı
              And "Geçmiş Dönem Poliçeleri" poliçe tablosundaki satır sayısı servisten dönen policyCount degeri ile eşit olmalı
              And "Geçmiş Dönem Poliçeleri" poliçe tablosunun satırlarındaki datalar servisten gelen response ile uyumlu olmalı
              And "Geçmiş Dönem Poliçeleri" poliçe tablosunda aşağıdaki sütun isimlerini görmeliyim
                  | POLİÇE NUMARASI  |
                  | ÜRÜN ADI         |
                  | BAŞLANGIÇ TARİHİ |
                  | STATÜS TARİHİ    |
                  | MÜŞTERİ ROLÜ     |
                  | STATÜSÜ          |
                  | TEMİNAT TUTARI   |

        @hayatUrunVar #I201704
        Scenario: Hayat kartı ve Hayat-Aktif Sigortalar poliçe tablosundaki dataların kontrolü
             Then "Hayat" kartında "Hayat - Aktif Sigortalar" poliçe tablosu için kaç adet aktif poliçe sayısı yazıyorsa servisten gelen policyCount ile eşit olmalı
              And "Hayat" kartında "Hayat - Aktif Sigortalar" poliçe tablosu için Toplam Teminat miktarı servisten gelen response ile uyumlu olmalı
              And "Hayat - Aktif Sigortalar" poliçe tablosunun sağ üst köşesinde yazan adet sayısı servisten gelen response ile aynı olmalı
              And "Hayat - Aktif Sigortalar" poliçe tablosundaki satır sayısı servisten dönen policyCount degeri ile eşit olmalı
              And "Hayat - Aktif Sigortalar" poliçe tablosunun satırlarındaki datalar servisten gelen response ile uyumlu olmalı
              And "Hayat - Aktif Sigortalar" poliçe tablosunda aşağıdaki sütun isimlerini görmeliyim
                  | POLİÇE NUMARASI  |
                  | ÜRÜN ADI         |
                  | BAŞLANGIÇ TARİHİ |
                  | BİTİŞ TARİHİ     |
                  | MÜŞTERİ ROLÜ     |
                  | STATÜSÜ          |
                  | TEMİNAT TUTARI   |
              And Sigortalar sayfasında aşağıdaki poliçe başlıklarını görmeliyim
                  | Tüm Sigortalar           |
                  | Hayat - Aktif Sigortalar |
                  | Geçmiş Dönem Poliçeleri  |
              And "Hayat" kartında aşagıdaki değerleri görmeliyim
                  | Hayat          |
                  | Aktif Poliçe   |
                  | Toplam Teminat |

        @BHShayatUrunVar #I201704
        Scenario: BHS ürünlerindeki Hayat kartı ve Hayat-Aktif Sigortalar poliçe tablosuna eklenen ekstra dataların kontrolü
             Then "Hayat - Aktif Sigortalar" poliçe tablosunda Süre Sonunda Ulaşılacak Birikim Tutarı sütunundaki datalar servisten gelen response ile uyumlu olmalı
              And Süre Sonunda Ulaşılacak Birikim Tutarı info iconundaki mesaj servisten gelen response ile uyumlu olmali
              And Toplam Birikim Tutarı info icon mesajı servisten gelen response ile uyumlu olmalı
              And "Hayat" kartında aşagıdaki değerleri görmeliyim
                  | Toplam Birikim Tutarı |


        @ferdiKazaUrunVar #I201704
        Scenario: Ferdi Kaza kartı ve Ferdi Kaza - Aktif Sigortalar poliçe tablosundaki dataların kontrolü
             Then "Ferdi Kaza" kartında "Ferdi Kaza - Aktif Sigortalar" poliçe tablosu için kaç adet aktif poliçe sayısı yazıyorsa servisten gelen policyCount ile eşit olmalı
              And "Ferdi Kaza" kartında "Ferdi Kaza - Aktif Sigortalar" poliçe tablosu için Toplam Teminat miktarı servisten gelen response ile uyumlu olmalı
              And "Ferdi Kaza - Aktif Sigortalar" poliçe tablosunun sağ üst köşesinde yazan adet sayısı servisten gelen response ile aynı olmalı
              And "Ferdi Kaza - Aktif Sigortalar" poliçe tablosundaki satır sayısı servisten dönen policyCount degeri ile eşit olmalı
              And "Ferdi Kaza - Aktif Sigortalar" poliçe tablosunun satırlarındaki datalar servisten gelen response ile uyumlu olmalı
              And "Ferdi Kaza - Aktif Sigortalar" poliçe tablosunda aşağıdaki sütun isimlerini görmeliyim
                  | POLİÇE NUMARASI  |
                  | ÜRÜN ADI         |
                  | BAŞLANGIÇ TARİHİ |
                  | BİTİŞ TARİHİ     |
                  | MÜŞTERİ ROLÜ     |
                  | STATÜSÜ          |
                  | TEMİNAT TUTARI   |
              And Sigortalar sayfasında aşağıdaki poliçe başlıklarını görmeliyim
                  | Tüm Sigortalar                |
                  | Ferdi Kaza - Aktif Sigortalar |
                  | Geçmiş Dönem Poliçeleri       |
              And "Ferdi Kaza" kartında aşagıdaki değerleri görmeliyim
                  | Ferdi Kaza     |
                  | Aktif Poliçe   |
                  | Toplam Teminat |
  

