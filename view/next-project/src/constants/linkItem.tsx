import { ReactNode } from 'react';
import { BsBuilding, BsVectorPen } from 'react-icons/bs';
import { HiOutlineShoppingCart, HiOutlineDocumentText, HiCurrencyDollar } from 'react-icons/hi';
import { IoIosArrowDropup } from 'react-icons/io';
import { MdOutlineSavings, MdOutlineWorkOutline } from 'react-icons/md';

interface LinkItemProps {
  name: string;
  icon: ReactNode;
  href: string;
  isParent?: boolean;
}

export const FinanceLinkItems: LinkItemProps[] = [
  {
    name: '財務局',
    icon: <IoIosArrowDropup className='mx-2 text-xl' />,
    href: '',
    isParent: true,
  },
  {
    name: '予算',
    icon: <HiCurrencyDollar className='mx-2 text-xl' />,
    href: '/budgets',
  },
  {
    name: '学内募金',
    icon: <MdOutlineSavings className='mx-2 text-xl' />,
    href: '/fund_informations',
  },
  {
    name: '購入申請',
    icon: <HiOutlineShoppingCart className='mx-2 text-xl' />,
    href: '/purchaseorders',
  },
  {
    name: '購入報告',
    icon: <HiOutlineDocumentText className='mx-2 text-xl' />,
    href: '/purchasereports',
  },
];

export const RelationLinkItems: LinkItemProps[] = [
  {
    name: '渉外局',
    icon: <IoIosArrowDropup className='mx-2 text-xl' />,
    href: '',
    isParent: true,
  },
  {
    name: '協賛活動',
    icon: <MdOutlineWorkOutline className='mx-2 text-xl' />,
    href: '/sponsoractivities',
  },
  {
    name: '協賛スタイル',
    icon: <BsVectorPen className='mx-2 text-xl' />,
    href: '/sponsorstyles',
  },
  {
    name: '協賛企業',
    icon: <BsBuilding className='mx-2 text-xl' />,
    href: '/sponsors',
  },
];
