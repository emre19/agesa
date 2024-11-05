#B272504
@default
Feature: Finansal Danışman Kontrolü
        Scenario: Finansal Danışman detay sayfası
            Given "Sigortalar" sekmesini seçiyorum
              And "Sigortalar" sekmesi açılmalı
              And Ürünü poliçe numarası ile seçiyorum
             When Finansal danışman detay butonuna financialAdvisorInfoDetail ile tıklıyorum
             Then financialAdvisorInfoDetail içeriği ile finansal danışman içerikleri aynı olmalı
              And Finansal danışman header görünmeli