Feature: Ödeme Şekli Değişikliği kontrolü

        @default #B-272504
        Scenario: Ödeme şeklini değiştirmek için değiştir butonu ve servisten dönen isAvailable response kontrolü
            Given "Sigortalar" sekmesini seçiyorum
              And "Sigortalar" sekmesi açılmalı
             When Ödeme şeklini değiştirmek için poliçe numarası seçip ilgili servislerden dönen response kaydediyorum
              And Şuanki tarihi logluyorum
             Then checkLifePaymentChangeAvailability servisindeki isAvailable parametresi true dönmeli
              And Tanımlı Ödeme Yöntemi kartındaki Değiştir butonu "aktif" kontrolü

        @default #B-272504
        Scenario: Mavi renkte işaretlenmiş ödeme bilgisi kartı Değiştir butonuna tıklamadan önceki kart bilgileri ile uyum kontrolü
             When Değiştir butonuna tıklamadan önce tanımlı ödeme yöntemindeki bilgileri kaydediyorum
              And Tanımlı ödeme yöntemi kartındaki Değiştir butonuna tıklıyorum
             Then Değiştir butonuna tıklamadan önceki kart bilgisi ile tıkladıktan sonraki işaretlenmiş kart bilgisi uyumlu olmalı
              And Tanımlı ödeme yöntemlerinden birini seçme ile ilgili Bilgilendirme Metni servisten gelen response ile uyumlu olmalı
              And Ödeme Tutar tablosundaki datalar servisten gelen response ile uyumlu olmalı
              And Tanımlı Ödeme Yöntemi alanındaki kartlar servisten dönen response ile uyumlu olmalı
              And Servis kontrol edilerek Tanımlı Ödeme Yöntemi alanındaki banka hesap ve kredi kartı bilgileri ürüne ait ptp-for bilgisine göre olmalı

        @default #var ise B-272504 , yok ise
        Scenario: Yeni kredi kartı ekle alanının ptp-for'a göre kontrolü
             Then Yeni kredi kartı ekle alanının kontrolü

        @default #var ise B-272504 , yok ise
        Scenario: Yeni banka hesabı ekle alanının ptp-for'a göre kontrolü
             Then Yeni banka hesabı ekle alanının kontrolü

     ##########################################################

        @isBankasiKartiVar #B-272504
        Scenario: Tanımlı Ödeme Yöntemi alanından İş Bankası olan bir ödeme kartı seçilmesi kontrolü
             When Tanımlı Ödeme Yöntemi alanından İş Bankası olan bir ödeme kartı seçilir
             Then Kayıt oluşturma ile ilgili ekranda gözüken bilgilendirme metni servisten gelen response ile uyumlu olmalı
             When Devam butonuna tıklayıp create-flow servisinden response kaydediyorum
             Then create-flow servisinden dönen success parametresi true olmalı
              And Talebin Konusu ve Talebin Detay Konusu servisten gelen data ile uyumlu olmalı
             When Talepler tabından ödeme şeklini değiştirme sayfasına dönüş

     ##########################################################

        @AkbankVeIsBankHesapHaric #B-272504
        Scenario: Tanımlı Ödeme Yöntemi alanında Akbank ve iş bankası dışında hesap seçip kendi kredi kartım/hesabım seçim kontrolü
             When Akbank ve iş bankası dışında hesap seçiyorum
              And Kendi Kredi Kartım Hesabım secenegini seciyorum
              And ATS Formu mesajı görünmeli

        @AkbankVeIsBankHesapHaric #B-272504
        Scenario: Tanımlı Ödeme Yöntemi alanından hesap seçtikten sonra Form Gönderim kontrolü
             When "Formu Gönder" butonuna tıkayıp notifyPaymentChangeDocuments servisinden response kaydediyorum
             Then "Form Gönderimi" popup açılmalı
              And "İşlem başarıyla gerçekleşti." popup alt başlığı olarak görünmeli
              And Popup içinde Bilgilendirme Metni görünmelidir
              And notifyPaymentChangeDocuments servisindeki success parametresi true dönmeli
             When Form Gönderiimi popup daki "Devam" butonuna tıklayıp create-flow servisinden response kaydediyorum
             Then create-flow servisinden dönen success parametresi true olmalı
              And Talebin Konusu ve Talebin Detay Konusu servisten gelen data ile uyumlu olmalı
             When Talepler tabından ödeme şeklini değiştirme sayfasına dönüş

     # ##########################################################

        @AkbankVeIsBankHesapHaric #B-272504
        Scenario: Tanımlı Ödeme Yöntemi alanında Akbank ve iş bankası dışında hesap seçip Başkasının Kredi Kartı/Hesabı seçim kontrolü
             When Akbank ve iş bankası dışında hesap seçiyorum
              And Başkasının hesabı kartı secenegini seciyorum
             Then ATS ve Sigorta Ettiren Formları mesajı görünmeli

        @AkbankVeIsBankHesapHaric #B-272504
        Scenario: Tanımlı Ödeme Yöntemi alanından hesap seçtikten sonra Form Gönderim kontrolü
             When "Formu Gönder" butonuna tıkayıp notifyPaymentChangeDocuments servisinden response kaydediyorum
             Then "Form Gönderimi" popup açılmalı
              And "İşlem başarıyla gerçekleşti." popup alt başlığı olarak görünmeli
              And Popup içinde Bilgilendirme Metni görünmelidir
              And notifyPaymentChangeDocuments servisindeki success parametresi true dönmeli
             When Form Gönderiimi popup daki "Devam" butonuna tıklayıp create-flow servisinden response kaydediyorum
             Then create-flow servisinden dönen success parametresi true olmalı
              And Talebin Konusu ve Talebin Detay Konusu servisten gelen data ile uyumlu olmalı
             When Talepler tabından ödeme şeklini değiştirme sayfasına dönüş

     # # ##########################################################

        @KrediKartiVar #B-272504
        Scenario: Tanımlı Ödeme Yöntemi alanında Kredi kartı seçip sonrasında başkasının kartı/hesabı seçim kontrolü
             When Herhangi bir kredi kartı seçiyorum
              And Başkasının hesabı kartı secenegini seciyorum
             Then "kart" için Sigorta Ettiren Değişikliği mesajı görünmeli

        @KrediKartiVar #B-272504
        Scenario: Tanımlı Ödeme Yöntemi alanından hesap seçtikten sonra Form Gönderim kontrolü
             When "Formu Gönder" butonuna tıkayıp notifyPaymentChangeDocuments servisinden response kaydediyorum
             Then "Form Gönderimi" popup açılmalı
              And "İşlem başarıyla gerçekleşti." popup alt başlığı olarak görünmeli
              And Popup içinde Bilgilendirme Metni görünmelidir
              And notifyPaymentChangeDocuments servisindeki success parametresi true dönmeli
             When Form Gönderiimi popup daki "Devam" butonuna tıklayıp create-flow servisinden response kaydediyorum
             Then create-flow servisinden dönen success parametresi true olmalı
              And Talebin Konusu ve Talebin Detay Konusu servisten gelen data ile uyumlu olmalı
             When Talepler tabından ödeme şeklini değiştirme sayfasına dönüş

     # ##########################################################

        @AkbankHesapVar #B-502892
        Scenario: Tanımlı Ödeme Yöntemi alanında Akbank hesabı ve başkasının kartı/hesabı seçimini yaparsa seçim kontrolü
             When Akbank hesabı seçiyorum
              And Başkasının hesabı kartı secenegini seciyorum
             Then "hesap" için Sigorta Ettiren Değişikliği mesajı görünmeli

        @AkbankHesapVar #B-502892
        Scenario: Tanımlı Ödeme Yöntemi alanından hesap seçtikten sonra Form Gönderim kontrolü
             When "Formu Gönder" butonuna tıkayıp notifyPaymentChangeDocuments servisinden response kaydediyorum
             Then "Form Gönderimi" popup açılmalı
              And "İşlem başarıyla gerçekleşti." popup alt başlığı olarak görünmeli
              And Popup içinde Bilgilendirme Metni görünmelidir
              And notifyPaymentChangeDocuments servisindeki success parametresi true dönmeli
             When Form Gönderiimi popup daki "Devam" butonuna tıklayıp create-flow servisinden response kaydediyorum
             Then create-flow servisinden dönen success parametresi true olmalı
              And Talebin Konusu ve Talebin Detay Konusu servisten gelen data ile uyumlu olmalı
             When Talepler tabından ödeme şeklini değiştirme sayfasına dönüş

     # # ##########################################################

        @KrediKartiVar #B-272504
        Scenario: Tanımlı Ödeme Yöntemi alanında herhangi bir kredi kartı seçip sonrasında kendi kartı/hesabı seçim kontrolü
             When Herhangi bir kredi kartı seçiyorum
              And Kendi Kredi Kartım Hesabım secenegini seciyorum
              And Tanımlı ödeme yöntemi ekranında "Kaydet" butonuna tıklıyorum
             Then Popup body aşağıdaki başlıkları içermeli
                  | Tercih Sorusu |
                  | Onay Metni    |
              And Popup body aşağıdaki butonları içermeli
                  | Evet  |
                  | Hayır |

        @KrediKartiVar #B-272504
        Scenario: Tanımlı Ödeme Yöntemi alanında herhangi bir kredi kartı ve kendi kartı/hesabı seçiminde onay metni ve tercih sorusu kontrolü
             When Kredi kartı numarasının son 4 hanesini bir değişkene atıyorum onay metninde kullanabilmek için
             Then "KREDİ KARTI" için Popup body içindeki onay metni görünmeli
              And "KREDİ KARTI" için Popup body içindeki tercih sorusu görünmeli

        @KrediKartiVar #B-272504
        Scenario: Ödeme değişikliğinin Tüm Poliçeler için kullan seçeneğinin kontrolü
             When "Tüm poliçeler için kullan" seçeneğini tıklıyorum
              And Popup body "Evet" butonuna tıklayıp lifeChangePaymentMethod servisinden gelen response kaydediyorum
             Then Popup bilgilendirme metni servisten gelen response ile uyumlu olmalı
             When Ödeme yöntemi değiştirilen poliçe numaraları bir değişkene atıyorum
              And Popup body "Tamam" butonuna tıklıyorum
             Then "Sigortalar" sekmesi açılmalı

        @KrediKartiVar #B-272504
        Scenario: Tüm Poliçeler için ödeme yönteminin değiştiğinin sigorta detay ekranındaki Tanımlı Ödeme Yöntemi Alanından kontrolü
             Then Ödeme yöntemi değiştirilen poliçelerden birini seçip ödeme yönteminin değiştiği sigorta detay ekranında gözükmeli
             When "Sigortalar" sekmesini seçiyorum
              And "Sigortalar" sekmesi açılmalı
             When Ödeme şeklini değiştirmek için poliçe numarası seçip ilgili servislerden dönen response kaydediyorum
              And Tanımlı ödeme yöntemi kartındaki Değiştir butonuna tıklıyorum

     # # ##########################################################

        @KrediKartiVar #B-272504
        Scenario: Tanımlı Ödeme Yöntemi alanında herhangi bir kredi kartı seçip sonrasında kendi kartı/hesabı seçim kontrolü
             When Herhangi bir kredi kartı seçiyorum
              And Kendi Kredi Kartım Hesabım secenegini seciyorum
              And Tanımlı ödeme yöntemi ekranında "Kaydet" butonuna tıklıyorum
             Then Popup body aşağıdaki başlıkları içermeli
                  | Tercih Sorusu |
                  | Onay Metni    |
              And Popup body aşağıdaki butonları içermeli
                  | Evet  |
                  | Hayır |

        @KrediKartiVar #B-272504
        Scenario: Tanımlı Ödeme Yöntemi alanında herhangi bir kredi kartı ve kendi kartı/hesabı seçiminde onay metni ve tercih sorusu kontrolü
             When Kredi kartı numarasının son 4 hanesini bir değişkene atıyorum onay metninde kullanabilmek için
             Then "KREDİ KARTI" için Popup body içindeki onay metni görünmeli
              And "KREDİ KARTI" için Popup body içindeki tercih sorusu görünmeli

        @KrediKartiVar #B-272504
        Scenario: Ödeme değişikliğinin Bu poliçe için kullan seçeneğinin kontrolü
             When "Bu poliçe için kullan" seçeneğini tıklıyorum
              And Popup body "Evet" butonuna tıklayıp lifeChangePaymentMethod servisinden gelen response kaydediyorum
             Then Popup bilgilendirme metni servisten gelen response ile uyumlu olmalı
             When Ödeme yöntemi değiştirilen poliçe numaraları bir değişkene atıyorum
              And Popup body "Tamam" butonuna tıklıyorum
             Then "Sigortalar" sekmesi açılmalı
              And Bu poliçe için ödeme yönteminin değiştiği sigorta detay ekranında gözükmeli
             When Tanımlı ödeme yöntemi kartındaki Değiştir butonuna tıklıyorum
          

     # # ##########################################################

        @AkbankHesapVar #B-502892
        Scenario: Akbank banka hesabı seçip sonrasında kendi kartı/hesabı seçim kontrolü
             When Akbank hesabı seçiyorum
              And Kendi Kredi Kartım Hesabım secenegini seciyorum
              And Tanımlı ödeme yöntemi ekranında "Kaydet" butonuna tıklıyorum
             Then Popup body aşağıdaki başlıkları içermeli
                  | Tercih Sorusu |
                  | Onay Metni    |
              And Popup body aşağıdaki butonları içermeli
                  | Evet  |
                  | Hayır |

        @AkbankHesapVar #B-502892
        Scenario: Akbank banka hesabı ve kendi kartı/hesabı seçiminde onay metni ve tercih sorusu kontrolü
             When Akbank hesap numarasının son 2 hanesini bir değişkene atıyorum onay metninde kullanabilmek için
             Then "BANKA HESABI" için Popup body içindeki onay metni görünmeli
              And "BANKA HESABI" için Popup body içindeki tercih sorusu görünmeli

        @AkbankHesapVar #B-502892
        Scenario: Ödeme değişikliğinin Bu Poliçe için kullan seçeneğinin kontrolü
             When "Bu poliçe için kullan" seçeneğini tıklıyorum
              And Popup body "Evet" butonuna tıklayıp lifeChangePaymentMethod servisinden gelen response kaydediyorum
             Then Popup bilgilendirme metni servisten gelen response ile uyumlu olmalı
             When Ödeme yöntemi değiştirilen poliçe numaraları bir değişkene atıyorum
              And Popup body "Tamam" butonuna tıklıyorum
             Then "Sigortalar" sekmesi açılmalı
              And Bu poliçe için ödeme yönteminin değiştiği sigorta detay ekranında gözükmeli
             When Tanımlı ödeme yöntemi kartındaki Değiştir butonuna tıklıyorum

     # ##########################################################

        @AkbankHesapVar #B-502892
        Scenario: Akbank banka hesabı seçip sonrasında kendi kartı/hesabı seçim kontrolü
             When Akbank hesabı seçiyorum
              And Kendi Kredi Kartım Hesabım secenegini seciyorum
              And Tanımlı ödeme yöntemi ekranında "Kaydet" butonuna tıklıyorum
             Then Popup body aşağıdaki başlıkları içermeli
                  | Tercih Sorusu |
                  | Onay Metni    |
              And Popup body aşağıdaki butonları içermeli
                  | Evet  |
                  | Hayır |

        @AkbankHesapVar #B-502892
        Scenario: Akbank banka hesabı ve kendi kartı/hesabı seçiminde onay metni ve tercih sorusu kontrolü
             When Akbank hesap numarasının son 2 hanesini bir değişkene atıyorum onay metninde kullanabilmek için
             Then "BANKA HESABI" için Popup body içindeki onay metni görünmeli
              And "BANKA HESABI" için Popup body içindeki tercih sorusu görünmeli

        @AkbankHesapVar #B-502892
        Scenario: Ödeme değişikliğinin Tüm Poliçeler için kullan seçeneğinin kontrolü
             When "Tüm poliçeler için kullan" seçeneğini tıklıyorum
              And Popup body "Evet" butonuna tıklayıp lifeChangePaymentMethod servisinden gelen response kaydediyorum
             Then Popup bilgilendirme metni servisten gelen response ile uyumlu olmalı
             When Ödeme yöntemi değiştirilen poliçe numaraları bir değişkene atıyorum
              And Popup body "Tamam" butonuna tıklıyorum
             Then "Sigortalar" sekmesi açılmalı

        @AkbankHesapVar #B-502892
        Scenario: Tüm Poliçeler için ödeme yönteminin değiştiğinin sigorta detay ekranındaki Tanımlı Ödeme Yöntemi Alanından kontrolü
             Then Ödeme yöntemi değiştirilen poliçelerden birini seçip ödeme yönteminin değiştiği sigorta detay ekranında gözükmeli
             When "Sigortalar" sekmesini seçiyorum
             Then "Sigortalar" sekmesi açılmalı
             When Ödeme şeklini değiştirmek için poliçe numarası seçip ilgili servislerden dönen response kaydediyorum
              And Tanımlı ödeme yöntemi kartındaki Değiştir butonuna tıklıyorum

     # # ##########################################################

        @default #B-272504
        Scenario: Tanımlanacak hesap dropdown'ındaki banka isimlerinin ptp-for'a göre servis response ile kontrolü
             When Yeni banka hesabı ekle alanından tanımlanacak hesap dropdown açıyorum
             Then Tanımlanacak hesap checkboxda banka isimleri servis response ile uyumlu olmalı

     # ##########################################################

        @TanimlanacakHesapTumBankalar #B-272504
        Scenario: Tanımlanacak hesap dropdowndan Akbank ve iş bankası dışında hesap seçip Kendi hesabım kontrolü
             When Yeni banka hesabı ekle alanından tanımlanacak hesap dropdown açıyorum
              And Açılan dropdowndan "Akbank dışında" bir hesap seçiyorum
              And "Kendi Hesabım" secenegini seçiyorum
             Then ATS Formu mesajı görünmeli

        @TanimlanacakHesapTumBankalar #B-272504
        Scenario: Tanımlanacak hesap dropdowndan hesap seçtikten sonra Form Gönderim kontrolü
             When "Formu Gönder" butonuna tıkayıp notifyPaymentChangeDocuments servisinden response kaydediyorum
             Then "Form Gönderimi" popup açılmalı
              And "İşlem başarıyla gerçekleşti." popup alt başlığı olarak görünmeli
              And Popup içinde Bilgilendirme Metni görünmelidir
              And notifyPaymentChangeDocuments servisindeki success parametresi true dönmeli
             When Form Gönderiimi popup daki "Devam" butonuna tıklayıp create-flow servisinden response kaydediyorum
             Then create-flow servisinden dönen success parametresi true olmalı
              And Talebin Konusu ve Talebin Detay Konusu servisten gelen data ile uyumlu olmalı
             When Talepler tabından ödeme şeklini değiştirme sayfasına dönüş

     # # ##########################################################

        @TanimlanacakHesapTumBankalar #B-272504
        Scenario: Tanımlanacak hesap dropdowndan Akbank ve iş bankası dışında hesap seçip Başkasının Hesabı kontrolü
             When Yeni banka hesabı ekle alanından tanımlanacak hesap dropdown açıyorum
              And Açılan dropdowndan "Akbank dışında" bir hesap seçiyorum
              And "Başkasının Hesabı" secenegini seçiyorum
             Then ATS ve Sigorta Ettiren Formları mesajı görünmeli

        @TanimlanacakHesapTumBankalar #B-272504
        Scenario: Tanımlanacak hesap dropdowndan hesap seçtikten sonra Form Gönderim kontrolü
             When "Formu Gönder" butonuna tıkayıp notifyPaymentChangeDocuments servisinden response kaydediyorum
             Then "Form Gönderimi" popup açılmalı
              And "İşlem başarıyla gerçekleşti." popup alt başlığı olarak görünmeli
              And Popup içinde Bilgilendirme Metni görünmelidir
              And notifyPaymentChangeDocuments servisindeki success parametresi true dönmeli
             When Form Gönderiimi popup daki "Devam" butonuna tıklayıp create-flow servisinden response kaydediyorum
             Then create-flow servisinden dönen success parametresi true olmalı
              And Talebin Konusu ve Talebin Detay Konusu servisten gelen data ile uyumlu olmalı
             When Talepler tabından ödeme şeklini değiştirme sayfasına dönüş

     # # ##########################################################

        @TanimlanacakHesapAkbank #B-272504
        Scenario: Tanımlanacak hesap dropdowndan Akbank hesap seçip Başkasının Hesabı kontrolü
             When Yeni banka hesabı ekle alanından tanımlanacak hesap dropdown açıyorum
              And Açılan dropdowndan "AKBANK" bir hesap seçiyorum
              And "Başkasının Hesabı" secenegini seçiyorum
             Then "hesap" için Sigorta Ettiren Değişikliği mesajı görünmeli

        @TanimlanacakHesapAkbank #B-272504
        Scenario: Tanımlanacak hesap dropdowndan Akbank hesap seçtikten sonra Form Gönderim kontrolü
             When "Formu Gönder" butonuna tıkayıp notifyPaymentChangeDocuments servisinden response kaydediyorum
             Then "Form Gönderimi" popup açılmalı
              And "İşlem başarıyla gerçekleşti." popup alt başlığı olarak görünmeli
              And Popup içinde Bilgilendirme Metni görünmelidir
              And notifyPaymentChangeDocuments servisindeki success parametresi true dönmeli
             When Form Gönderiimi popup daki "Devam" butonuna tıklayıp create-flow servisinden response kaydediyorum
             Then create-flow servisinden dönen success parametresi true olmalı
              And Talebin Konusu ve Talebin Detay Konusu servisten gelen data ile uyumlu olmalı
             When Talepler tabından ödeme şeklini değiştirme sayfasına dönüş

     # # ##########################################################
     
        @TanimlanacakHesapTumBankalar #B-272504
        Scenario: Tanımlanacak hesap dropdowndan T.IŞ BANKASI hesap seçim kontrolü
             When Yeni banka hesabı ekle alanından tanımlanacak hesap dropdown açıyorum
              And Açılan dropdowndan "T.IŞ BANKASI" bir hesap seçiyorum
             Then Kayıt oluşturma ile ilgili ekranda gözüken bilgilendirme metni servisten gelen response ile uyumlu olmalı
             When Devam butonuna tıklayıp create-flow servisinden response kaydediyorum
             Then create-flow servisinden dönen success parametresi true olmalı
              And Talebin Konusu ve Talebin Detay Konusu servisten gelen data ile uyumlu olmalı
             When Talepler tabından ödeme şeklini değiştirme sayfasına dönüş

     # ##########################################################
             
        @TanimlanacakHesapAkbank #B-272504
        Scenario: Tanımlanacak hesap dropdowndan Akbank hesap seçip Kendi hesabım kontrolü
             When Yeni banka hesabı ekle alanından tanımlanacak hesap dropdown açıyorum
              And Açılan dropdowndan "AKBANK" bir hesap seçiyorum
              And "Kendi Hesabım" secenegini seçiyorum
             Then Hesap numarası alanı görünmeli

        @TanimlanacakHesapAkbank #B-272504
        Scenario: Tanımlanacak hesap alanında hesap numarası girildikten sonra iban alanının pasif olma kontrolü
             When Hesap numarası alanına "1234" değerini giriyorum
             Then Iban alanı pasif olmalı

        @TanimlanacakHesapAkbank #B-272504
        Scenario: Tanımlanacak hesap alanında hesap numarası ve şube girildikten sonra popup içerik kontrolü
             When Hesap numarası alanındaki datayı siliyorum
              And Hesap numarası alanına "7800000000034" değerini giriyorum
              And Şube "ADANA" seçiyorum
              And Tanımlı ödeme yöntemi ekranında "Kaydet" butonuna tıklıyorum
             Then Popup body aşağıdaki başlıkları içermeli
                  | Tercih Sorusu |
                  | Onay Metni    |
              And Popup body aşağıdaki butonları içermeli
                  | Evet  |
                  | Hayır |
              And "TANIMLANACAK HESAP" için Popup body içindeki onay metni görünmeli
              And "BANKA HESABI" için Popup body içindeki tercih sorusu görünmeli

        @TanimlanacakHesapAkbank #B-272504
        Scenario: Tanımlanacak hesap alanında Bu Poliçe için kullan seçeneğinin kontrolü
             When "Bu poliçe için kullan" seçeneğini tıklıyorum
              And Popup body "Evet" butonuna tıklayıp lifeChangePaymentMethod servisinden gelen response kaydediyorum
             Then Popup bilgilendirme metni servisten gelen response ile uyumlu olmalı
             When Ödeme yöntemi değiştirilen poliçe numaraları bir değişkene atıyorum
              And Popup body "Tamam" butonuna tıklıyorum
             Then "Sigortalar" sekmesi açılmalı

        @TanimlanacakHesapAkbank #B-272504
        Scenario: Bu poliçe için ödeme yönteminin değiştiğinin sigorta detay ekranındaki Tanımlı Ödeme Yöntemi Alanından kontrolü
             Then Bu poliçe için ödeme yönteminin değiştiği sigorta detay ekranında gözükmeli
             When Tanımlı ödeme yöntemi kartındaki Değiştir butonuna tıklıyorum

     ##########################################################
             
        @TanimlanacakHesapAkbank #B-272504
        Scenario: Tanımlanacak hesap dropdowndan Akbank hesap seçip Kendi hesabım kontrolü
             When Yeni banka hesabı ekle alanından tanımlanacak hesap dropdown açıyorum
              And Açılan dropdowndan "AKBANK" bir hesap seçiyorum
              And "Kendi Hesabım" secenegini seçiyorum
             Then Hesap numarası alanı görünmeli

        @TanimlanacakHesapAkbank #B-272504
        Scenario: Tanımlanacak hesap alanında hesap numarası girildikten sonra iban alanının pasif olma kontrolü
             When Hesap numarası alanına "1234" değerini giriyorum
             Then Iban alanı pasif olmalı

        @TanimlanacakHesapAkbank #B-272504
        Scenario: Tanımlanacak hesap alanında hesap numarası ve şube girildikten sonra popup içerik kontrolü
             When Hesap numarası alanındaki datayı siliyorum
              And Hesap numarası alanına "7800000000034" değerini giriyorum
              And Şube "ADANA" seçiyorum
              And Tanımlı ödeme yöntemi ekranında "Kaydet" butonuna tıklıyorum
             Then Popup body aşağıdaki başlıkları içermeli
                  | Tercih Sorusu |
                  | Onay Metni    |
              And Popup body aşağıdaki butonları içermeli
                  | Evet  |
                  | Hayır |
              And "TANIMLANACAK HESAP" için Popup body içindeki onay metni görünmeli
              And "BANKA HESABI" için Popup body içindeki tercih sorusu görünmeli

        @TanimlanacakHesapAkbank #B-272504
        Scenario: Tanımlanacak hesap alanında Tüm poliçeler için kullan seçeneğinin kontrolü
             When "Tüm poliçeler için kullan" seçeneğini tıklıyorum
              And Popup body "Evet" butonuna tıklayıp lifeChangePaymentMethod servisinden gelen response kaydediyorum
             Then Popup bilgilendirme metni servisten gelen response ile uyumlu olmalı
             When Ödeme yöntemi değiştirilen poliçe numaraları bir değişkene atıyorum
              And Popup body "Tamam" butonuna tıklıyorum
             Then "Sigortalar" sekmesi açılmalı

        @TanimlanacakHesapAkbank #B-272504
        Scenario: Tüm Poliçeler için ödeme yönteminin değiştiğinin sigorta detay ekranındaki Tanımlı Ödeme Yöntemi Alanından kontrolü
             Then Ödeme yöntemi değiştirilen poliçelerden birini seçip ödeme yönteminin değiştiği sigorta detay ekranında gözükmeli
             When "Sigortalar" sekmesini seçiyorum
             Then "Sigortalar" sekmesi açılmalı
             When Ödeme şeklini değiştirmek için poliçe numarası seçip ilgili servislerden dönen response kaydediyorum
              And Tanımlı ödeme yöntemi kartındaki Değiştir butonuna tıklıyorum

     ##########################################################

        @TanimlanacakHesapAkbank #B-272504
        Scenario: Tanımlanacak hesap dropdowndan Akbank hesap seçip Kendi hesabım kontrolü
             When Yeni banka hesabı ekle alanından tanımlanacak hesap dropdown açıyorum
              And Açılan dropdowndan "AKBANK" bir hesap seçiyorum
              And "Kendi Hesabım" secenegini seçiyorum
             Then Hesap numarası alanı görünmeli

        @TanimlanacakHesapAkbank #B-272504
        Scenario: Tanımlanacak hesap alanında iban girildikten sonra hesap numarası ve şube alanlarının pasif olma kontrolü
             When Hesap numarası alanındaki datayı siliyorum
              And Iban alanına "TR336534673765375757575757" değerini giriyorum
             Then Hesap numarası ve şube alanlarının pasif olmalı

        @TanimlanacakHesapAkbank #B-272504
        Scenario: Tanımlanacak hesap alanında iban numarası girildikten sonra popup içerik kontrolü
             When Tanımlı ödeme yöntemi ekranında "Kaydet" butonuna tıklıyorum
             Then Popup body aşağıdaki başlıkları içermeli
                  | Tercih Sorusu |
                  | Onay Metni    |
              And Popup body aşağıdaki butonları içermeli
                  | Evet  |
                  | Hayır |
              And "TANIMLANACAK HESAP" için Popup body içindeki onay metni görünmeli
              And "BANKA HESABI" için Popup body içindeki tercih sorusu görünmeli

        @TanimlanacakHesapAkbank #B-272504
        Scenario: Tanımlanacak hesap alanında Bu Poliçe için kullan seçeneğinin kontrolü
             When "Bu poliçe için kullan" seçeneğini tıklıyorum
              And Popup body "Evet" butonuna tıklayıp lifeChangePaymentMethod servisinden gelen response kaydediyorum
             Then Popup bilgilendirme metni servisten gelen response ile uyumlu olmalı
             When Ödeme yöntemi değiştirilen poliçe numaraları bir değişkene atıyorum
              And Popup body "Tamam" butonuna tıklıyorum
             Then "Sigortalar" sekmesi açılmalı
              And Bu poliçe için ödeme yönteminin değiştiği sigorta detay ekranında gözükmeli
             When Tanımlı ödeme yöntemi kartındaki Değiştir butonuna tıklıyorum

     ##########################################################

        @TanimlanacakHesapAkbank #B-272504
        Scenario: Tanımlanacak hesap dropdowndan Akbank hesap seçip Kendi hesabım kontrolü
             When Yeni banka hesabı ekle alanından tanımlanacak hesap dropdown açıyorum
              And Açılan dropdowndan "AKBANK" bir hesap seçiyorum
              And "Kendi Hesabım" secenegini seçiyorum
             Then Hesap numarası alanı görünmeli

        @TanimlanacakHesapAkbank #B-272504
        Scenario: Tanımlanacak hesap alanında iban girildikten sonra hesap numarası ve şube alanlarının pasif olma kontrolü
             When Hesap numarası alanındaki datayı siliyorum
              And Iban alanına "TR336534673765375757575757" değerini giriyorum
             Then Hesap numarası ve şube alanlarının pasif olmalı

        @TanimlanacakHesapAkbank #B-272504
        Scenario: Tanımlanacak hesap alanında iban numarası girildikten sonra popup içerik kontrolü
             When Tanımlı ödeme yöntemi ekranında "Kaydet" butonuna tıklıyorum
             Then Popup body aşağıdaki başlıkları içermeli
                  | Tercih Sorusu |
                  | Onay Metni    |
              And Popup body aşağıdaki butonları içermeli
                  | Evet  |
                  | Hayır |
              And "TANIMLANACAK HESAP" için Popup body içindeki onay metni görünmeli
              And "BANKA HESABI" için Popup body içindeki tercih sorusu görünmeli

        @TanimlanacakHesapAkbank #B-272504
        Scenario: Tanımlanacak hesap alanında Tüm poliçeler için kullan seçeneğinin kontrolü
             When "Tüm poliçeler için kullan" seçeneğini tıklıyorum
              And Popup body "Evet" butonuna tıklayıp lifeChangePaymentMethod servisinden gelen response kaydediyorum
             Then Popup bilgilendirme metni servisten gelen response ile uyumlu olmalı
             When Ödeme yöntemi değiştirilen poliçe numaraları bir değişkene atıyorum
              And Popup body "Tamam" butonuna tıklıyorum
             Then "Sigortalar" sekmesi açılmalı

        @TanimlanacakHesapAkbank #B-272504
        Scenario: Tüm Poliçeler için ödeme yönteminin değiştiğinin sigorta detay ekranındaki Tanımlı Ödeme Yöntemi Alanından kontrolü
             Then Ödeme yöntemi değiştirilen poliçelerden birini seçip ödeme yönteminin değiştiği sigorta detay ekranında gözükmeli
             When "Sigortalar" sekmesini seçiyorum
             Then "Sigortalar" sekmesi açılmalı
             When Ödeme şeklini değiştirmek için poliçe numarası seçip ilgili servislerden dönen response kaydediyorum
              And Tanımlı ödeme yöntemi kartındaki Değiştir butonuna tıklıyorum
             
     ##########################################################

        @default #B-272504
        Scenario: Yeni kredi kartı ekle radio butonuna tıklandıktan sonra bilgilendirme mesajı ve IVR buton kontrolu
             When Yeni kredi kartı ekle radio butonuna tıklıyorum
             Then Yeni kredi kartı ekle Bilgilendirme Metni UI da gözüken mesaj ile uyumlu olmalı
              And "IVR'a Aktar" butonu görünmeli

     ##########################################################

        @default #B-272504
        Scenario: Ödeme şekli değişikliği loglarının Etkileşim Geçmişinde görüntülenmesi kontrolü
             When "Etkileşim Geçmişi" sekmesini seçiyorum
             Then "Etkileşim Geçmişi" sekmesi açılmalı
             When "Gönderi Geçmişi" etkileşim geçmişi alt sekmesi olarak seçiyorum
              And "Etkileşim Geçmişi" etkileşim geçmişi alt sekmesi olarak seçiyorum
              And "ETKİLEŞİM ANA KONU" sütununu aşağıdakiler ile filtreliyorum
                  | Tanımlı Ödeme Yöntemi Değiştir Butonunun Kontrolü |
             Then Etkileşim geçmişi tablosundaki en üstteki tarih loglanan tarihle uyumlu olmalı
              And Etkileşim geçmişi tablosundaki en üstteki etkileşim tipi "Bilgi" olmalı

             When Seçili filtreyi siliyorum
              And "ETKİLEŞİM ANA KONU" sütununu aşağıdakiler ile filtreliyorum
                  | ATS ve/veya Sigorta Ettiren Değişikliği Talebi Formunun Gönderimi |
             Then Etkileşim geçmişi tablosundaki en üstteki tarih loglanan tarihle uyumlu olmalı
              And Etkileşim geçmişi tablosundaki en üstteki etkileşim tipi "Bilgi" olmalı

             When Seçili filtreyi siliyorum
              And "ETKİLEŞİM ANA KONU" sütununu aşağıdakiler ile filtreliyorum
                  | Kayıtlı Ödeme Yöntemi Görüntüleme |
             Then Etkileşim geçmişi tablosundaki en üstteki tarih loglanan tarihle uyumlu olmalı
              And Etkileşim geçmişi tablosundaki en üstteki etkileşim tipi "Bilgi" olmalı

             When Seçili filtreyi siliyorum
              And "ETKİLEŞİM ANA KONU" sütununu aşağıdakiler ile filtreliyorum
                  | Hayat Ödeme Yöntemi Değiştirme |
             Then Etkileşim geçmişi tablosundaki en üstteki tarih loglanan tarihle uyumlu olmalı
              And Etkileşim geçmişi tablosundaki en üstteki etkileşim tipi "İşlem" olmalı
          
     
