

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
    'Figma': 'https://cdn.jsdmirror.com/gh/devicons/devicon/icons/figma/figma-original.svg',
    'PS': 'https://cdn.jsdmirror.com/gh/devicons/devicon/icons/photoshop/photoshop-original.svg',
    'AI': 'https://cdn.jsdmirror.com/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg',
    'AE': 'https://cdn.jsdmirror.com/gh/devicons/devicon/icons/aftereffects/aftereffects-original.svg',
    'Blender': 'https://cdn.jsdmirror.com/gh/devicons/devicon/icons/blender/blender-original.svg',
    'C4D': 'https://cdn.jsdmirror.com/gh/jayneysil520-dev/jayneysil@main/1197px-C4D_Logo.png',
    'React': 'https://cdn.jsdmirror.com/gh/devicons/devicon/icons/react/react-original.svg',
    'ThreeJS': 'https://cdn.jsdmirror.com/gh/devicons/devicon/icons/threejs/threejs-original.svg', 
    'Jimeng': 'https://cdn.jsdmirror.com/gh/jayneysil520-dev/jayneysil@main/%E5%8D%B3%E6%A2%A6icon.png',
    'Pinterest': 'https://cdn.jsdmirror.com/gh/devicons/devicon/icons/pinterest/pinterest-original.svg',
    'LibLib': 'https://cdn.jsdmirror.com/gh/jayneysil520-dev/jayneysil@main/liblib.png'
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
      img: 'https://github.com/hfseakeen/hf.wang-material/blob/main/images/tml-fm.jpg?raw=true', 
      desc: '主导天目里品牌全案设计，包括标志提案、网站设计、品牌策略、导视设计、及60余项线下物料。',
      tools: ['PS', 'AI', 'AE'],
      previewTextColor: {
        year: '#E6E6E6', label: '#E6E6E6', title: '#FFFFFF', description: '#D9D9D9', tools: '#E6E6E6', arrow: '#000000', cardBorder: 'rgba(0,0,0,0.1)'
      },
      layout: 'gallery', 
      detailImages: ['https://github.com/hfseakeen/hf.wang-material/blob/main/images/tml.jpg?raw=true'],
  },
  { 
      id: 2, 
      title: '乐亦思', 
      label: '品牌视觉设计', 
      year: '2019', 
      color: '#005C4B', 
      img: 'https://github.com/hfseakeen/hf.wang-material/blob/main/images/roys-fm.png?raw=true', 
      desc: '主导乐亦思品牌全案设计，包括标志提案、网站设计、品牌策略、导视设计、及70余项线下物料。',
      tools: ['PS', 'AI', 'AE'],
      previewTextColor: {
        year: '#404040', label: '#404040', title: '#000000', description: '#404040', tools: '#000000', arrow: '#000000', cardBorder: 'rgba(0,0,0,0.1)'
      },
      layout: 'gallery',
      detailImages: ['https://github.com/hfseakeen/hf.wang-material/blob/main/images/roys.jpg?raw=true'], 
  },
  { 
      id: 3, 
      title: '安居乐寓', 
      label: '品牌视觉设计', 
      year: '2025', 
      color: '#4DA6FF', 
      img: 'https://github.com/hfseakeen/hf.wang-material/blob/main/images/ajly-fm.png?raw=true', 
      desc: '主导安居乐寓品牌全案设计，包括标志提案、网站设计、品牌策略、导视设计、及70余项线下物料。',
      tools: ['PS', 'AI', 'AE'],
      previewTextColor: {
        year: '#404040', label: '#404040', title: '#000000', description: '#404040', tools: '#000000', arrow: '#000000', cardBorder: 'rgba(0,0,0,0.1)'
      },
      layout: 'gallery',
      detailImages: ['https://github.com/hfseakeen/hf.wang-material/blob/main/images/ajly.png?raw=true'],
  },
  { 
      id: 4, 
      title: 'GOA 大象设计官网', 
      label: '网站视觉设计', 
      year: '2019', 
      color: '#EA2F2F', 
      img: 'https://picsum.photos/seed/goa_project/800/600', 
      desc: '与原研哉设计研究所深度合作，负责大象设计官网视觉体系构建，助力品牌提升国际知名度与专业影响力。',
      tools: ['Figma', 'PS', 'AI'],
      previewTextColor: {
        year: '#404040', label: '#404040', title: '#000000', description: '#404040', tools: '#000000', arrow: '#000000', cardBorder: 'rgba(0,0,0,0.1)'
      },
      layout: 'gallery',
      detailImages: ['https://picsum.photos/seed/goa_d1/1200/800'],
  },
  { 
      id: 5, 
      title: '视觉策略研究', 
      label: '设计探索', 
      year: '2023', 
      color: '#FF7F27', 
      img: 'https://picsum.photos/seed/p5/800/600', 
      desc: '针对电商与品牌传播，持续探索前沿视觉语言，结合 AIGC 工具提升创作效率与视觉张力。',
      tools: ['Jimeng', 'PS', 'AI'],
      previewTextColor: {
        year: '#E6E6E6', label: '#E6E6E6', title: '#FFFFFF', description: '#E6E6E6', tools: '#000000', arrow: '#000000', cardBorder: 'rgba(0,0,0,0.1)'
      },
      layout: 'gallery',
      detailImages: ['https://picsum.photos/seed/p5d1/1200/800']
  },
  { 
      id: 6, 
      title: '动态品牌设计', 
      label: '动态艺术', 
      year: '2022', 
      color: '#AA88EE', 
      img: 'https://picsum.photos/seed/p6/800/600', 
      desc: '将动态图形融入品牌系统，创造更具活力的数字体验。',
      tools: ['AE', 'C4D'],
      previewTextColor: {
        year: '#000000', label: '#999999', title: '#000000', description: '#444444', tools: '#000000', arrow: '#000000', cardBorder: 'rgba(0,0,0,0.1)'
      },
      layout: 'gallery',
      detailImages: ['https://picsum.photos/seed/p6d1/1200/800']
  },
  { 
      id: 7, 
      title: '个人摄影集萃', 
      label: '作品画廊', 
      year: '2024', 
      color: '#4ECDC4', 
      img: 'https://picsum.photos/seed/p7/800/600', 
      desc: '精选商业摄影与个人生活记录，聚焦光影质感与叙事表达。', 
      tools: ['PS', 'LibLib'], 
      previewTextColor: {
        year: '#E6E6E6', label: '#E6E6E6', title: '#FFFFFF', description: '#E6E6E6', tools: '#000000', arrow: '#000000', cardBorder: 'rgba(0,0,0,0.1)'
      },
      layout: 'gallery',
      detailImages: ['https://picsum.photos/seed/p7d1/800/600']
  },
  { 
      id: 8, 
      title: 'UI 组件系统研究', 
      label: '界面设计', 
      year: '2025', 
      color: '#7BC5FF', 
      img: 'https://picsum.photos/seed/p8/800/600', 
      desc: '研究现代 Web 应用的流畅交互与模块化设计系统，提升用户端体验一致性。',
      tools: ['Figma', 'React'], 
      previewTextColor: {
        year: '#000000', label: '#999999', title: '#000000', description: '#444444', tools: '#000000', arrow: '#000000', cardBorder: 'rgba(0,0,0,0.1)'
      },
      layout: 'gallery',
      detailImages: ['https://picsum.photos/seed/p8d1/1200/800']
  }
];
