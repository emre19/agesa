Feature: Login page
        Scenario: Başarılı login denemesi
            Given Login sayfasına gittim
             When "fatihdemir" kullanıcı adı ve "Fatihd2204" şifresi ile giriş yapıyorum
             Then "Hangi işlemi yaparsan yap, Bi’Tıkla portal ile her işlem bir tık uzağında." mesajı görünmeli
              And Uygulamadan çıkış yapıyorum

        Scenario: Başarısız login denemesi
            Given Login sayfasına gittim
             When "fatihdemi" kullanıcı adı ve "Fatihd2204" şifresi ile giriş yapıyorum
             Then "Kullanıcı Bilgileri Hatası!" uyarısı görünmeli