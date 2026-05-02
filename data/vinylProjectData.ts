

// 🔒 LOCKED DATA: USER CONFIGURATION
// Please do not overwrite this file with placeholder data in future updates.

// 自定义长图链接 (Updated to generic placeholders)
export const MY_CUSTOM_LONG_IMAGE = 'https://picsum.photos/seed/long/1920/1080';

// 资源链接 (Updated to generic placeholders)
export const ASSETS = {
    P1_IMG_1: 'https://picsum.photos/seed/p1_1/1920/1080',
    P1_IMG_2: 'https://picsum.photos/seed/p1_2/1920/1080',
    P1_IMG_3: 'https://picsum.photos/seed/p1_3/1920/1080',
    P1_VID_1: "https://www.w3schools.com/html/mov_bbb.mp4",
    P1_VID_2: "https://www.w3schools.com/html/movie.mp4",
    PROJECT_2_LONG: 'https://picsum.photos/seed/p2_long/1920/1080',
    PROJECT_2_VIDEO: "https://www.w3schools.com/html/mov_bbb.mp4" 
};

export interface WaveItemConfig {
    url: string;
    x: number;
    y: number;
    width: number;
    rotate?: number;
    zIndex?: number;
    delay?: number;
}

// 自由布局配置 (Fox and Rabbit)
export const CUSTOM_FOX_RABBIT_CONFIG: WaveItemConfig[] = [
    {
        url: MY_CUSTOM_LONG_IMAGE,
        x: 375,
        y: 8710,
        width: 750,
        rotate: 0,
        zIndex: 30
    }
];

// 自由布局配置 (Wave Images)
export const WAVE_IMAGES_CONFIG: WaveItemConfig[] = [
    { url: 'https://picsum.photos/seed/wave1/750/300', x: -390, y: 9000, width: 750, rotate: 0, zIndex: 3, delay: 0.1 },
    { url: 'https://picsum.photos/seed/wave2/750/300', x: -390, y: 8840, width: 750, rotate: 0, zIndex: 2, delay: 0.2 },
    { url: 'https://picsum.photos/seed/wave3/750/300', x: -390, y: 8740, width: 750, rotate: 0, zIndex: 1, delay: 0.3 }
];

// Group 1 Cards Data
export const GROUP_1_CARDS_DATA = [
    { id: 1, xOffset: -400, yOffset: 8320, width: 188.52, height: 109.18, rotate: 0, borderRadius: '32px', img: 'https://picsum.photos/seed/card1/400/300' },
    { id: 2, xOffset: -201.5, yOffset: 8320, width: 188.52, height: 68.61, rotate: 0, borderRadius: '32px', img: 'https://picsum.photos/seed/card2/400/300' },
    { id: 3, xOffset: -3, yOffset: 8320, width: 188.52, height: 90.28, rotate: 0, borderRadius: '32px', img: 'https://picsum.photos/seed/card3/400/300' },
    { id: 4, xOffset: 195.52, yOffset: 8320, width: 188.52, height: 109.18, rotate: 0, borderRadius: '32px', img: 'https://picsum.photos/seed/card4/400/300' }
];

// New Scattered Images
export const CUSTOM_NEW_IMAGES = [
    { id: 'd1', img: 'https://picsum.photos/seed/d1/400/600', x: 350, y: 9900, w: 220.8, h: 307.2, r: -7.76 },
    { id: 'd2', img: 'https://picsum.photos/seed/d2/400/600', x: 515, y: 10120, w: 220.8, h: 307.2, r: 10.12 },
    { id: 'd3', img: 'https://picsum.photos/seed/d3/400/600', x: 635, y: 9750, w: 220.8, h: 307.2, r: 2.15 },
    { id: 'd4', img: 'https://picsum.photos/seed/d4/400/600', x: 920, y: 9980, w: 220.8, h: 307.2, r: -5.54 }
];

// 🇨🇳 CHINA OPTIMIZATION: Tool Icons
export const TOOL_ICONS: Record<string, string> = {
    'PS': 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/rj/ps.webp',
    'AI': 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/rj/ai.webp',
    'AE': 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/rj/ae.webp',
    'Pr': 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/rj/pr.webp',
    'C4D': 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/rj/c4d.webp',
    'Blender': 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/rj/blander.webp',
    'Sketch': 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/rj/sketch.webp',
    'Word': 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/rj/word.webp',
    'Excel': 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/rj/excel.webp',
    'PPT': 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/rj/ppt.webp',
    'FCPX': 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/rj/fcpx.webp',
    'Capture One': 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/rj/capture%20one.webp'
};

// Project Data
export const PROJECTS_DATA = [
  { 
      id: 1, 
      title: '杭州天目里', 
      label: 'VI 系统设计', 
      year: '2019', 
      client: '杭州天目里', 
      color: '#E33333', 
      img: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpj/tml/tml-fm.webp', 
      desc: '主导天目里品牌全案设计，包括标志提案、网站设计、品牌策略、导视设计、及60余项线下物料。',
      tools: ['PS', 'AI', 'AE'],
      previewTextColor: {
        year: '#E6E6E6', label: '#E6E6E6', title: '#FFFFFF', description: '#D9D9D9', tools: '#E6E6E6', arrow: '#000000', cardBorder: 'rgba(0,0,0,0.1)'
      },
      layout: 'gallery', 
      detailImages: [
        'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpj/tml/tml-01.webp'
      ],
  },
  { 
      id: 2, 
      title: '乐亦思', 
      label: '品牌视觉设计', 
      year: '2019', 
      color: '#005C4B', 
      img: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpj/roys/roys-fm.webp', 
      desc: '主导乐亦思品牌全案设计，包括标志提案、网站设计、品牌策略、导视设计、及70余项线下物料。',
      tools: ['PS', 'AI', 'AE'],
      previewTextColor: {
        year: '#404040', label: '#404040', title: '#000000', description: '#404040', tools: '#000000', arrow: '#000000', cardBorder: 'rgba(0,0,0,0.1)'
      },
      layout: 'gallery',
      detailImages: [
        'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpj/roys/roys-01.webp',
        'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpj/roys/roys-02.webp',
        'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpj/roys/roys-03.webp'
      ], 
  },
  { 
      id: 3, 
      title: '安居乐寓', 
      label: '品牌视觉设计', 
      year: '2025', 
      color: '#4DA6FF', 
      img: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpj/ajly/ajly-fm.webp', 
      desc: '主导安居乐寓品牌全案设计，包括标志提案、网站设计、品牌策略、导视设计、及70余项线下物料。',
      tools: ['PS', 'AI', 'AE'],
      previewTextColor: {
        year: '#404040', label: '#404040', title: '#000000', description: '#404040', tools: '#000000', arrow: '#000000', cardBorder: 'rgba(0,0,0,0.1)'
      },
      layout: 'gallery',
      detailImages: [
        'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpj/ajly/ajly-01.webp',
        'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpj/ajly/ajly-02.webp'
      ], 
  },
  { 
      id: 4, 
      title: '京东VIS品牌视觉识别系统', 
      label: '品牌视觉设计', 
      year: '2019', 
      color: '#EA2F2F', 
      img: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpj/jd/jdjr-fm.webp', 
      desc: '主导京东VIS品牌视觉识别系统，包括标志提案、网站设计、品牌策略、导视设计、及100+余项线下物料',
      tools: ['PS', 'AI', 'AE'],
      previewTextColor: {
        year: '#404040', label: '#404040', title: '#000000', description: '#404040', tools: '#000000', arrow: '#000000', cardBorder: 'rgba(0,0,0,0.1)'
      },
      layout: 'gallery',
      detailImages: [
        'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpj/jd/jdjr-01.webp',
        'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpj/jd/jdjr-02.webp',
        'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpj/jd/jdjr-03.webp'
      ], 
  },
  { 
      id: 5, 
      title: 'Farmacy', 
      label: '产品摄影', 
      year: '2025', 
      color: '#FF7F27', 
      img: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpj/farmacy/farmacy-fm.webp', 
      desc: '商业产品拍摄，针对电商与品牌传播，持续探索前沿视觉语言，结合 AIGC 工具提升创作效率与视觉张力。',
      tools: ['Jimeng', 'PS', 'AI'],
      previewTextColor: {
        year: '#E6E6E6', label: '#E6E6E6', title: '#FFFFFF', description: '#E6E6E6', tools: '#000000', arrow: '#000000', cardBorder: 'rgba(0,0,0,0.1)'
      },
      layout: 'gallery',
      detailImages: [],
      extraContent: [
        { type: 'video', url: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpj/farmacy/farmacy.mp4', y: 100, scale: 1.0 },
        { type: 'video', url: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpj/farmacy/farmacy.mp4', y: 900, scale: 1.0 }
      ]
  },
  { 
      id: 6, 
      title: '待上传', 
      label: '产品摄影', 
      year: '2022', 
      color: '#AA88EE', 
      img: 'https://picsum.photos/seed/p6/800/600', 
      desc: '商业产品拍摄，针对电商与品牌传播，持续探索前沿视觉语言，结合 AIGC 工具提升创作效率与视觉张力。',
      tools: ['AE', 'C4D'],
      previewTextColor: {
        year: '#000000', label: '#999999', title: '#000000', description: '#444444', tools: '#000000', arrow: '#000000', cardBorder: 'rgba(0,0,0,0.1)'
      },
      layout: 'gallery',
      detailImages: ['https://picsum.photos/seed/p6d1/1200/800']
  },
  { 
      id: 7, 
      title: '待上传', 
      label: '产品摄影', 
      year: '2024', 
      color: '#4ECDC4', 
      img: 'https://picsum.photos/seed/p7/800/600', 
      desc: '商业产品拍摄，针对电商与品牌传播，持续探索前沿视觉语言，结合 AIGC 工具提升创作效率与视觉张力。', 
      tools: ['PS', 'LibLib'], 
      previewTextColor: {
        year: '#E6E6E6', label: '#E6E6E6', title: '#FFFFFF', description: '#E6E6E6', tools: '#000000', arrow: '#000000', cardBorder: 'rgba(0,0,0,0.1)'
      },
      layout: 'gallery',
      detailImages: ['https://picsum.photos/seed/p7d1/800/600']
  },
  { 
      id: 8, 
      title: '待上传', 
      label: '产品摄影', 
      year: '2025', 
      color: '#7BC5FF', 
      img: 'https://picsum.photos/seed/p8/800/600', 
      desc: '商业产品拍摄，针对电商与品牌传播，持续探索前沿视觉语言，结合 AIGC 工具提升创作效率与视觉张力。',
      tools: ['Figma', 'React'], 
      previewTextColor: {
        year: '#000000', label: '#999999', title: '#000000', description: '#444444', tools: '#000000', arrow: '#000000', cardBorder: 'rgba(0,0,0,0.1)'
      },
      layout: 'gallery',
      detailImages: ['https://picsum.photos/seed/p8d1/1200/800']
  }
];
