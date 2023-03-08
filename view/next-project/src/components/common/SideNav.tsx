import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { ReactNode, useReducer } from 'react';
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

interface NavItemProps {
  icon: ReactNode;
  children?: React.ReactNode;
  href: string;
  currentPath: string;
  isParent?: boolean;
  isShow?: boolean;
  onClick?: () => void;
}

const FinanceLinkItems: LinkItemProps[] = [
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

const RelationLinkItems: LinkItemProps[] = [
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
    name: '協賛企業一覧',
    icon: <BsBuilding className='mx-2 text-xl' />,
    href: '/sponsors',
  },
];

const otherLinkItems: LinkItemProps[] = [
  // { name: 'ダッシュボード', icon: MdOutlineDashboard, href: '/' },
];

export default function SimpleSidebar() {
  const router = useRouter();
  const [isFinanceItemsShow, setisFinanceItemsShow] = useReducer((state) => !state, false);
  const [isRelationItemsShow, setisRelationItemsShow] = useReducer((state) => !state, false);

  return (
    <div className='fixed z-50 h-full w-52 bg-primary-4 md:left-0 right-0'>
      <div className='border-b-2 border-primary-1'>
        {FinanceLinkItems.map((link) => (
          <NavItem
            key={link.name}
            icon={link.icon}
            href={link.href}
            currentPath={router.pathname}
            isParent={link.isParent}
            isShow={isFinanceItemsShow}
            onClick={link.isParent ? setisFinanceItemsShow : undefined}
          >
            {link.name}
          </NavItem>
        ))}
      </div>
      <div className='border-b-2 border-primary-1'>
        {RelationLinkItems.map((link) => (
          <NavItem
            key={link.name}
            icon={link.icon}
            href={link.href}
            currentPath={router.pathname}
            isParent={link.isParent}
            isShow={isRelationItemsShow}
            onClick={link.isParent ? setisRelationItemsShow : undefined}
          >
            {link.name}
          </NavItem>
        ))}
      </div>
    </div>
  );
}

const NavItem = (props: NavItemProps) => {
  let className = '';

  if (props.currentPath === props.href) {
    className = 'flex items-center w-full text-primary-5 bg-white-0 px-2 py-4';
  } else {
    className =
      'flex items-center w-full text-white-0 bg-primary-5 px-2 py-4 hover:bg-primary-4 transition-all';
  }

  if (props.isShow && !props.isParent) {
    className += ' hidden';
  }

  return (
    <>
      {props.isParent ? (
        <div
          className={clsx(
            className +
              ` cursor-pointer ${!props.isShow && 'border-b-2 border-dashed border-primary-1'}`,
          )}
          onClick={props.onClick}
        >
          <span
            className={clsx(
              props.isShow ? 'rotate-180 transition-transform' : 'rotate-0 transition-transform',
            )}
          >
            {props.icon}
          </span>
          {props.children}
        </div>
      ) : (
        <a href={props.href}>
          <div className={clsx(className)}>
            {props.icon}
            {props.children}
          </div>
        </a>
      )}
    </>
  );
};
