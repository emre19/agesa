@default
Feature: OzetSafyasiPageya işlemleri
        Scenario: Bes sözleşmeleri kartı kontrolü
             Then Bes sözleşmeleri kartı aşağıdakileri içermeli
                  | Daha Fazlası   |
                  | Aktif Sözleşme |
                  | Toplam Birikim |

        Scenario: Sigortalar kartı kontrolü
             Then Sigortalar kartı aşağıdakileri içermeli
                  | Daha Fazlası   |
                  | Ferdi Kaza     |
                  | Hayat          |
                  | Sağlık         |
                  | Toplam Teminat |

        Scenario: Başvuru geçmişi kartı kontrolü
             Then Başvuru geçmişi aşağıdakileri içermeli
                  | Başvuru Geçmişi bulunmamaktadır. |

        Scenario:  Müşteri temsilcisi notu kartı kontrolü
             Then Müşteri temsilcisi notu aşağıdakileri içermeli
                  | Daha Fazlası |
                  | tst          |

        Scenario: Bekleyen Talepler kartı kontrolü
             Then Bekleyen Talepler kartı aşağıdakileri içermeli
                  | Müşteri talebi bulunmamaktadır. |

        Scenario: Son Etkileşim kartı kontrolü
             Then Son Etkileşim kartında aşağıdaki sütunlar bulunmalı
                  | ÇAĞRI YÖNÜ               |
                  | ŞİKAYET / TALEP NUMARASI |
                  | TARİH / SAAT             |
                  | KANAL                    |
                  | POLİÇE / SÖZLEŞME NO     |
                  | ETKİLEŞİM TİPİ           |
                  | ETKİLEŞİM ANA KONU       |
                  | ETKİLEŞİM DETAY KONU     |
                  | KULLANICI                |
                  | DURUM                    |
                  | CALL ID                  |

#    Scenario: Olmayan müşteri ile giriş denemesi
#       When Çağrı merkezi uylamasına giriyorum
#       Then "Sunucu Seçimi" mesajı görünmeli
#       When Sunucu seçimi ekranındaki tamam butonuna tıklıyorum
#       And Müşteriyi "TCKN/VKN/Mavi Kart No" alanında "12245678900" ile sorguluyorum
#       Then "Müşteri bulunamadı" mesajı görünmeli
