import { ReactNode } from 'react';
import { BsBuilding, BsVectorPen } from 'react-icons/bs';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { HiOutlineDocumentText, HiCurrencyDollar } from 'react-icons/hi';
import { IoIosArrowDropup } from 'react-icons/io';
import { LiaDonateSolid } from 'react-icons/lia';
import { MdOutlineSavings, MdOutlineWorkOutline, MdFaceUnlock } from 'react-icons/md';

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
    name: '予算管理',
    icon: <HiCurrencyDollar className='mx-2 text-xl' />,
    href: '/budget_managements',
  },
  {
    name: '収支管理',
    icon: <MdOutlineSavings className='mx-2 text-xl' />,
    href: '/fund_informations',
  },
  {
    name: '購入報告一覧',
    icon: <HiOutlineDocumentText className='mx-2 text-xl' />,
    href: '/purchase_report_list',
  },
  {
    name: '予算管理',
    icon: <HiCurrencyDollar className='mx-2 text-xl' />,
    href: '/budget_managements',
  },
  {
    name: '学内募金',
    icon: <LiaDonateSolid className='mx-2 text-xl' />,
    href: '',
  },
  {
    name: '教員一覧',
    icon: <FaChalkboardTeacher className='mx-2 text-xl' />,
    href: '/teachers',
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

export const MyPageLinkItems: LinkItemProps[] = [
  {
    name: 'My Page',
    icon: <MdFaceUnlock className='mx-2 text-xl' />,
    href: '/my_page',
    isParent: false,
  },
];
