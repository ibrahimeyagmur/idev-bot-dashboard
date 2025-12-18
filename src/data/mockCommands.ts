export interface Command {
  name: string;
  description: string;
  category: string;
  usage: string;
  examples: string[];
}

export const categories = [
  'Tümü',
  'Moderasyon',
  'Eğlence',
  'Seviye',
  'Karşılama',
  'Araçlar',
  'Müzik',
  'Ekonomi',
];

export const mockCommands: Command[] = [
  {
    name: 'ban',
    description: 'Belirtilen kullanıcıyı sunucudan yasaklar.',
    category: 'Moderasyon',
    usage: '/ban <kullanıcı> [sebep]',
    examples: ['/ban @user Spam yapma', '/ban @user'],
  },
  {
    name: 'kick',
    description: 'Belirtilen kullanıcıyı sunucudan atar.',
    category: 'Moderasyon',
    usage: '/kick <kullanıcı> [sebep]',
    examples: ['/kick @user Kural ihlali'],
  },
  {
    name: 'mute',
    description: 'Kullanıcıyı belirli bir süre susturur.',
    category: 'Moderasyon',
    usage: '/mute <kullanıcı> <süre> [sebep]',
    examples: ['/mute @user 10m Spam'],
  },
  {
    name: 'warn',
    description: 'Kullanıcıya uyarı verir.',
    category: 'Moderasyon',
    usage: '/warn <kullanıcı> <sebep>',
    examples: ['/warn @user Reklam yasak'],
  },
  {
    name: 'clear',
    description: 'Belirtilen sayıda mesajı siler.',
    category: 'Moderasyon',
    usage: '/clear <miktar>',
    examples: ['/clear 50', '/clear 100'],
  },
  {
    name: 'rank',
    description: 'Seviye kartınızı gösterir.',
    category: 'Seviye',
    usage: '/rank [kullanıcı]',
    examples: ['/rank', '/rank @user'],
  },
  {
    name: 'leaderboard',
    description: 'Sunucunun seviye sıralamasını gösterir.',
    category: 'Seviye',
    usage: '/leaderboard',
    examples: ['/leaderboard'],
  },
  {
    name: 'setlevel',
    description: 'Kullanıcının seviyesini ayarlar.',
    category: 'Seviye',
    usage: '/setlevel <kullanıcı> <seviye>',
    examples: ['/setlevel @user 10'],
  },
  {
    name: 'setwelcome',
    description: 'Karşılama mesajı kanalını ayarlar.',
    category: 'Karşılama',
    usage: '/setwelcome <kanal>',
    examples: ['/setwelcome #hoşgeldin'],
  },
  {
    name: 'testwelcome',
    description: 'Karşılama mesajını test eder.',
    category: 'Karşılama',
    usage: '/testwelcome',
    examples: ['/testwelcome'],
  },
  {
    name: 'setgoodbye',
    description: 'Veda mesajı kanalını ayarlar.',
    category: 'Karşılama',
    usage: '/setgoodbye <kanal>',
    examples: ['/setgoodbye #veda'],
  },
  {
    name: '8ball',
    description: 'Sihirli 8 top ile sorunuza yanıt alın.',
    category: 'Eğlence',
    usage: '/8ball <soru>',
    examples: ['/8ball Bugün şanslı mıyım?'],
  },
  {
    name: 'roll',
    description: 'Zar atar.',
    category: 'Eğlence',
    usage: '/roll [max]',
    examples: ['/roll', '/roll 100'],
  },
  {
    name: 'coinflip',
    description: 'Yazı tura atar.',
    category: 'Eğlence',
    usage: '/coinflip',
    examples: ['/coinflip'],
  },
  {
    name: 'meme',
    description: 'Rastgele bir meme gösterir.',
    category: 'Eğlence',
    usage: '/meme',
    examples: ['/meme'],
  },
  {
    name: 'avatar',
    description: 'Kullanıcının avatarını gösterir.',
    category: 'Araçlar',
    usage: '/avatar [kullanıcı]',
    examples: ['/avatar', '/avatar @user'],
  },
  {
    name: 'serverinfo',
    description: 'Sunucu bilgilerini gösterir.',
    category: 'Araçlar',
    usage: '/serverinfo',
    examples: ['/serverinfo'],
  },
  {
    name: 'userinfo',
    description: 'Kullanıcı bilgilerini gösterir.',
    category: 'Araçlar',
    usage: '/userinfo [kullanıcı]',
    examples: ['/userinfo', '/userinfo @user'],
  },
  {
    name: 'ping',
    description: 'Bot gecikmesini gösterir.',
    category: 'Araçlar',
    usage: '/ping',
    examples: ['/ping'],
  },
  {
    name: 'help',
    description: 'Yardım menüsünü gösterir.',
    category: 'Araçlar',
    usage: '/help [komut]',
    examples: ['/help', '/help ban'],
  },
  {
    name: 'play',
    description: 'Müzik çalar.',
    category: 'Müzik',
    usage: '/play <şarkı>',
    examples: ['/play Never Gonna Give You Up'],
  },
  {
    name: 'skip',
    description: 'Şarkıyı atlar.',
    category: 'Müzik',
    usage: '/skip',
    examples: ['/skip'],
  },
  {
    name: 'balance',
    description: 'Bakiyenizi gösterir.',
    category: 'Ekonomi',
    usage: '/balance',
    examples: ['/balance'],
  },
  {
    name: 'daily',
    description: 'Günlük ödülünüzü alın.',
    category: 'Ekonomi',
    usage: '/daily',
    examples: ['/daily'],
  },
];
