import React from 'react';
import { useRouter } from 'next/router';
import { MdOutlineDashboard, MdOutlineSavings } from 'react-icons/md';
import { BiBuildings } from 'react-icons/bi';
import { HiCurrencyDollar, HiOutlineShoppingCart, HiOutlineDocumentText } from 'react-icons/hi';
import clsx from 'clsx';

interface LinkItemProps {
  name: string;
  icon: any;
  href: string;
}

interface NavItemProps {
  icon: any;
  children?: React.ReactNode;
  href: string;
  currentPath: string;
}

const LinkItems: LinkItemProps[] = [
  // { name: 'ダッシュボード', icon: MdOutlineDashboard, href: '/' },
  // { name: '予算', icon: HiCurrencyDollar, href: '/budgets' },
  // { name: '企業協賛', icon: BiBuildings, href: '/sponseractivity' },
  { name: '学内募金', icon: <MdOutlineSavings className={clsx("text-xl mr-4")} />, href: '/fund_informations' },
  { name: '購入申請', icon: <HiOutlineShoppingCart className={clsx("text-xl mr-4")} />, href: '/purchaseorders' },
  { name: '購入報告', icon: <HiOutlineDocumentText className={clsx("text-xl mr-4")} />, href: '/purchasereports' },
];

export default function SimpleSidebar() {
  const router = useRouter();
  return (
    <div className={clsx('w-full h-full bg-primary-4')}>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} href={link.href} currentPath={router.pathname}>
          {link.name}
        </NavItem>
      ))}
    </div>
  );
}

const NavItem = (props: NavItemProps) => {
  let className = '';
  if (props.currentPath === props.href) {
    className = 'flex items-center w-full text-primary-5 bg-white-0 p-4';
  } else {
    className = 'flex items-center w-full text-white-0 bg-primary-5 p-4';
  }
  return (
    <a href={props.href}>
      <div className={clsx(className)}>
        {props.icon}
        {props.children}
      </div>
    </a>
  );
};
