export interface TaskItem {
  id: string;
  title: string;
  category: 'is' | 'kisisel';
  priority: 'high' | 'medium' | 'low';
  time: string;
  date: string; // e.g. "2023-10-24"
  completed: boolean;
  notes?: string;
  subtasks?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  attachments?: {
    id: string;
    name: string;
    size: string;
    type: string;
  }[];
  reminder: boolean;
}

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Q3 Finansal Rapor Sunumu Hazırlığı',
    category: 'is',
    priority: 'high',
    time: '14:00 - 15:30',
    date: '2023-10-24',
    completed: false,
    notes:
      'Yönetim kurulu için finansal metrikler ve büyüme analizi. Q3 dönemi gelir-gider dengesi ve departman bazlı bütçe dağılımı incelenecek. Özellikle Ar-Ge harcamalarının dönüş oranları üzerine odaklanılmalı.',
    subtasks: [
      { id: 'sub-1', title: 'Finansal verileri topla', completed: true },
      { id: 'sub-2', title: 'Yatırımcı metriklerini hesapla', completed: true },
      { id: 'sub-3', title: 'Grafikleri hazırla', completed: true },
      { id: 'sub-4', title: 'Yönetici özeti yaz', completed: false },
      { id: 'sub-5', title: 'Sunum provası', completed: false },
    ],
    attachments: [
      {
        id: 'att-1',
        name: 'Q3_Financials_Draft.pdf',
        size: '2.4 MB',
        type: 'PDF Belgesi',
      },
    ],
    reminder: true,
  },
  {
    id: 'task-2',
    title: 'Tasarım Ekibi Haftalık Senkronizasyon Toplantısı',
    category: 'kisisel',
    priority: 'medium',
    time: '16:30 - 17:15',
    date: '2023-10-24',
    completed: false,
    notes: 'iOS human interface guidelines uyumluluk testi ve bileşen kontrolü.',
    subtasks: [
      { id: 'sub-2-1', title: 'Figma komponent kütüphanesini güncelle', completed: true },
      { id: 'sub-2-2', title: 'Geri bildirimleri topla', completed: false },
    ],
    attachments: [],
    reminder: true,
  },
  {
    id: 'task-3',
    title: 'Bütçe Planlama & Fatura Kontrolleri',
    category: 'kisisel',
    priority: 'high',
    time: '17:00 - 18:00',
    date: '2023-10-24',
    completed: false,
    notes: 'Aylık kurumsal SaaS abonelikleri ve sunucu faturalarının mutabakatı.',
    subtasks: [],
    attachments: [],
    reminder: false,
  },
  {
    id: 'task-4',
    title: 'Sabah koşusu ve meditasyon seansı',
    category: 'kisisel',
    priority: 'low',
    time: '07:30 - 08:30',
    date: '2023-10-24',
    completed: true,
    notes: '5km sahil koşusu ve 15 dk mindfulness meditasyonu.',
    subtasks: [],
    attachments: [],
    reminder: false,
  },
];

export interface CalendarEvent {
  id: string;
  timeSlot: string;
  timeRange: string;
  category: 'Toplantı' | 'Tasarım' | 'Sunum' | 'Kişisel';
  categoryColor: 'primary' | 'secondary' | 'tertiary';
  title: string;
  description: string;
  reminder: boolean;
  attendees?: string[];
}

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    timeSlot: '09:00',
    timeRange: '09:00 - 10:00',
    category: 'Toplantı',
    categoryColor: 'primary',
    title: 'Sabah Ekip Senkronizasyonu',
    description: 'Haftalık sprint planlaması ve önceliklerin gözden geçirilmesi.',
    reminder: false,
  },
  {
    id: 'ev-2',
    timeSlot: '10:00',
    timeRange: '10:00 - 12:00',
    category: 'Tasarım',
    categoryColor: 'tertiary',
    title: 'Tasarım İncelemesi',
    description: 'iOS human interface guidelines uyumluluk testi ve bileşen kontrolü.',
    reminder: true,
    attendees: ['AK', 'BE'],
  },
  {
    id: 'ev-3',
    timeSlot: '14:00',
    timeRange: '14:00 - 15:30',
    category: 'Sunum',
    categoryColor: 'secondary',
    title: 'Q3 Rapor Sunumu',
    description: 'Yönetim kurulu için finansal metrikler ve büyüme analizi.',
    reminder: false,
  },
  {
    id: 'ev-4',
    timeSlot: '17:00',
    timeRange: '17:00 - 18:00',
    category: 'Kişisel',
    categoryColor: 'tertiary',
    title: 'Spor',
    description: 'Fitness salonu ve kardiyo antrenmanı.',
    reminder: false,
  },
];

export interface ConnectedDevice {
  id: string;
  name: string;
  type: 'phone' | 'tablet' | 'desktop';
  status: string;
  battery?: string;
  lastSync: string;
  isCurrent?: boolean;
}

export const INITIAL_DEVICES: ConnectedDevice[] = [
  {
    id: 'dev-1',
    name: 'iPhone 15 Pro',
    type: 'phone',
    status: 'online',
    battery: '%92',
    lastSync: 'Şimdi',
    isCurrent: true,
  },
  {
    id: 'dev-2',
    name: 'iPad Pro 11"',
    type: 'tablet',
    status: 'online',
    lastSync: '5 dk önce',
  },
  {
    id: 'dev-3',
    name: 'Mac Studio',
    type: 'desktop',
    status: 'online',
    lastSync: '12 dk önce',
  },
];
