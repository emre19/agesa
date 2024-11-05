@api
Feature: Api tests

        Scenario: Api test denemesi (tüm mesajları alma)
             When Sistem mesajları apisine tüm mesajları almak için istek yolluyorum
             Then Success durumu "true" dönmeli
              And "EPAZARLAMA ONAY METNİ" response içinde görünmeli

        Scenario: Api test denemesi (mesaj kaydetme)
             When Sistem mesajları apisine mesaj kaydetmek için istek yolluyorum
             Then Success durumu "false" dönmeli
