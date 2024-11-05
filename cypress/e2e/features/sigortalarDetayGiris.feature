Feature: Sigortalar Detay Giriş Sayfası kontrolü

        @default
        Scenario: Seçilen ürün isminin kontrolü kontrolü
            Given "Sigortalar" sekmesini seçiyorum
              And "Sigortalar" sekmesi açılmalı
             When Sigorta detay ekranı için poliçe numarası ile ürün seçip ilgili servislerden dönen response kaydediyorum
             Then Poliçe tablosundan seçilen ürünün adı sigorta detay sayfasında görünmeli

        @BHSolanUrunSigortaDetayEkran
        Scenario: Dönemsel Birikim Prim Değişikliği buton ve info mesaj kontrolleri
             Then "Dönemsel Birikim Prim Değişikliği" butonu pasif olmalı
              And Dönemsel Birikim Prim Değişikliği butonunun info icon mesajı servisten gelen response ile uyumlu olmalı

        @BHSolmayanUrunSigortaDetayEkran
        Scenario: Dönemsel Prim Tutarı Değişikliği buton ve info mesaj kontrolleri
             Then "Dönemsel Prim Tutarı Değişikliği" butonu pasif olmalı
              And Dönemsel Prim Tutarı Değişikliği butonunun info icon mesajı servisten gelen response ile uyumlu olmalı
        
        #// Poliçe tablosundaki dataların kontrolü //
        @default
        Scenario: Seçilen ürünün poliçe tablosunda yazan dataların servisten gelen response ile kontrolü
             Then Poliçe tablosundaki Poliçe Numarası kontrolü
              And Poliçe tablosundaki Poliçe Süresi kontrolü
              And Poliçe tablosundaki Poliçe Başlangıç Tarihi kontrolü
              And Poliçe tablosundaki Poliçe Yenileme Tarihi kontrolü
              And Poliçe tablosundaki Poliçe Bitiş Tarihi kontrolü
              

        #// Poliçe tablosundaki BHSli olamayan ürünün Düzenli Ödeme alanının kontrolü //
        @BHSolmayanUrunSigortaDetayEkran
        Scenario: Seçilen BHSli olmayan ürünün poliçe tablosundaki Düzenli Ödeme alanının servisten gelen response ile kontrolü
              And Poliçe tablosundaki BHS olmayan ürün için Düzenli Ödeme kontrolü

        #// Poliçe tablosundaki BHSli olan ürünün Düzenli Ödeme alanının kontrolü //
        @BHSolanUrunSigortaDetayEkran
        Scenario: Seçilen BHSli olan ürünün poliçe tablosundaki Düzenli Ödeme alanının servisten gelen response ile kontrolü
              And Poliçe tablosundaki BHS olan ürün için Düzenli Ödeme kontrolü

        #// Toplam Ödenen Prim, Kalan Prim Borcu ve Vergi İndirimi kontrolleri //
        @default
        Scenario: Toplam Ödenen Prim Kalan Prim Borcu Vergi İndirimi miktarının servisten gelen response ile kontrolü
             Then Toplam Ödenen Prim miktarının kontrolü
              And Kalan Prim Borcu miktarının kontrolü
              And Vergi İndirimi miktarının kontrolü
              And Vergi İndirimi info icon mesajının kontrolü

        #// Tanımlı Ödeme Yöntemi kartı kontrolü //
        @default
        Scenario: Tanımlı Ödeme Yöntemi kartını görmeliyim ve servisten gelen response ile kontrol etmeliyim
             Then Tanımlı Ödeme Yöntemi kartını görmeliyim
              And Tanımlı Ödeme Yöntemi kartındaki Değiştir butonu "exist" kontrolü

        @tanimliOdemeYontemiYok
        Scenario: Tanımlı Ödeme Yöntemi kartını görmemeliyim
             Then Tanımlı Ödeme Yöntemi kartını görmemeliyim

        #// Müşteri Rolü kartı kontrolü //
        @default
        Scenario: Müşteri Rolü kartının servisten gelen response kontrolü
             Then Müşteri Rolü kartının kontrolü
              And Müşteri Rolü kartındaki sabit textler kontrolü
                  | Ad Soyad         |
                  | Müşteri Numarası |
                  | Cep Telefonu     |
                  | Email            |

        #// Lehtar Bilgisi kartı kontrolü //
        @default
        Scenario: Lehtar Bilgisi kartının servisten gelen response kontrolü
             Then Lehtar Bilgisi kartının kontrolü
              And Lehtar Bilgisi kartındaki sabit textler kontrolü
                  | AD SOYAD     |
                  | ORAN         |
                  | DOĞUM TARİHİ |
              And Lehtar Bilgisindeki info icon mesajının kontrolü

        #// Finansal Danışman Bilgileri kartı kontrolü //
        @finansalDanismanBilgileriVar
        Scenario: Finansal Danışman Bilgileri kart kontrolleri
             Then "Detay" butonu kart içerisinde aktif olarak görünmelidir
              And Aşağıdaki sabit textler Finansal Danışman Bilgileri kartında gözükmeli
                  | Finansal Danışman Bilgileri         |
                  | Satan Finansal Danışman Bilgileri   |
                  | SATIŞ KANALI                        |
                  | SATAN KİŞİ                          |
                  | Sorumlu Finansal Danışman Bilgileri |
                  | SORUMLU KANALI                      |
                  | SORUMLU KİŞİ                        |
              And Satan Finansal Danışman Bilgileri kontrolü
              And Sorumlu Finansal Danışman Bilgileri kontrolü
              And Finansal Danışman Bilgileri info icon kontrolü
             
        @finansalDanismanBilgileriVar
        Scenario: Finansal Danışman Bilgileri kartında detay okları altındaki datalar servisle uyumlu olmalı
             Then Satan Finansal Danışman Bilgileri detay oku altındaki datalar gözükmelidir
              And Sorumlu Finansal Danışman Bilgileri detay oku altındaki datalar gözükmelidir

        @birikimDetaylariVar
        Scenario: Birikim detayları kartındaki datalar servisle uyumlu olmalı
             Then Birikim Detayları kartındaki içeriklerin kontrolü
              And Birikim Detayları kartındaki info icon mesajlarının kontrolü




