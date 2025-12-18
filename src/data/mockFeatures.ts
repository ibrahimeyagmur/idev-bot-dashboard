import { MessageSquare, TrendingUp, FileText, Shield } from 'lucide-react';

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: typeof MessageSquare;
  path: string;
  details: string[];
}

// Static feature data for homepage display
export const features: Feature[] = [
  {
    id: 'karsilama',
    title: 'Karşılama Mesajları',
    description: 'Yeni üyeleri özel mesajlarla karşılayın ve onları topluluğunuza dahil edin.',
    icon: MessageSquare,
    path: '/ozellikler/karsilama-mesajlari',
    details: [
      'Özelleştirilebilir karşılama mesajları',
      'Görsel karşılama kartları',
      'DM ile hoş geldin mesajı',
      'Otomatik rol atama',
      'Veda mesajları',
    ],
  },
  {
    id: 'seviye',
    title: 'Seviye Sistemi',
    description: 'Üyelerinizin aktivitesini ödüllendirin ve rekabeti artırın.',
    icon: TrendingUp,
    path: '/ozellikler/seviye-sistemi',
    details: [
      'XP tabanlı seviye sistemi',
      'Özelleştirilebilir seviye kartları',
      'Seviye rolleri',
      'Sıralama tablosu',
      'XP çarpanları',
    ],
  },
  {
    id: 'embed',
    title: 'Gömülü Mesajlar',
    description: 'Profesyonel görünümlü embed mesajlar oluşturun.',
    icon: FileText,
    path: '/ozellikler/gomulu-mesajlar',
    details: [
      'Görsel embed oluşturucu',
      'Renk özelleştirme',
      'Resim ve thumbnail desteği',
      'Otomatik embed gönderimi',
      'Şablon kaydetme',
    ],
  },
  {
    id: 'otomasyon',
    title: 'Otomatik Moderasyon',
    description: 'Reklam ve küfür engelleme ile sunucunuzu 7/24 koruyun.',
    icon: Shield,
    path: '/ozellikler/otomasyon',
    details: [
      'Reklam engelleme',
      'Küfür filtresi',
      'Link engelleme',
      'Özelleştirilebilir kurallar',
      'Kanal ve rol istisnaları',
    ],
  },
];

export const mockFAQ = [
  {
    question: 'IDev nasıl eklenir?',
    answer: 'Discord\'a Ekle butonuna tıklayarak botu sunucunuza ekleyebilirsiniz. Her şey ücretsiz!',
  },
  {
    question: 'Bot ücretsiz mi?',
    answer: 'Evet! Şu an her şey ücretsiz.',
  },
  {
    question: 'Destek nasıl alabilirim?',
    answer: 'Discord destek sunucumuza katılarak 7/24 destek alabilirsiniz. Her şey ücretsiz.',
  },
  {
    question: 'Verilerim güvende mi?',
    answer: 'Evet, verileriniz şifreli olarak saklanır ve üçüncü taraflarla paylaşılmaz. Her şey ücretsiz.',
  },
];
