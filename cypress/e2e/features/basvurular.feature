# Note: olmayan sigorta türlerinin yokluğunu ekle

@default
Feature: Başvurular
        Scenario: Başvuruların kontrolü
            Given Başvurular sekmesini açıyorum
              And "Başvurular" sekmesi açılmalı
             When Başvuruyu açıyorum
             Then stepDetails ile başvuru aşamaları aynı olmalı
              And stepDetails ile başvuru tarihleri aynı olmalı