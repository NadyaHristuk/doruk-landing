import aboutLeftBg from '../assets/jpg/about/about-bg-1.jpg';
import aboutCenterBg from '../assets/jpg/about/about-bg-2.jpg';
import aboutRightBg from '../assets/jpg/about/about-bg-3.jpg';
import aboutLeftBgWebp from '../assets/webp/about/about-bg-1.webp';
import aboutCenterBgWebp from '../assets/webp/about/about-bg-2.webp';
import aboutRightBgWebp from '../assets/webp/about/about-bg-3.webp';

export const aboutContent = [
  {
    id: 'slide-1',
    layout: 'default',
    bg: aboutLeftBg,
    bgWebp: aboutLeftBgWebp,
    text: 'about.blocks.left.text',
    titleStart: 'about.blocks.left.titleStart',
    title: 'about.blocks.left.title',
    titleEnd: 'about.blocks.left.titleEnd'
  },
  {
    id: 'slide-2',
    layout: 'mirrored',
    bg: aboutCenterBg,
    bgWebp: aboutCenterBgWebp,
    text: 'about.blocks.center.text',
    titleStart: 'about.blocks.center.titleStart',
    title: 'about.blocks.center.title',
    titleEnd: 'about.blocks.center.titleEnd'
  },
  {
    id: 'slide-3',
    layout: 'default',
    bg: aboutRightBg,
    bgWebp: aboutRightBgWebp,
    text: 'about.blocks.right.text',
    titleStart: 'about.blocks.right.titleStart',
    title: 'about.blocks.right.title',
    titleEnd: 'about.blocks.right.titleEnd'
  }
];
