import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { HiOutlineShoppingCart, HiOutlineDocumentText } from 'react-icons/hi';
import { MdOutlineSavings } from 'react-icons/md';

interface LinkItemProps {
  name: string;
  icon: ReactNode;
  href: string;
}

interface NavItemProps {
  icon: ReactNode;
  children?: React.ReactNode;
  href: string;
  currentPath: string;
}

const LinkItems: LinkItemProps[] = [
  // { name: 'ダッシュボード', icon: MdOutlineDashboard, href: '/' },
  // { name: '予算', icon: HiCurrencyDollar, href: '/budgets' },
  // { name: '企業協賛', icon: BiBuildings, href: '/sponseractivity' },
  {
    name: '学内募金',
    icon: <MdOutlineSavings className={clsx('mr-4 text-xl')} />,
    href: '/fund_informations',
  },
  {
    name: '購入申請',
    icon: <HiOutlineShoppingCart className={clsx('mr-4 text-xl')} />,
    href: '/purchaseorders',
  },
  {
    name: '購入報告',
    icon: <HiOutlineDocumentText className={clsx('mr-4 text-xl')} />,
    href: '/purchasereports',
  },
];

export default function SimpleSidebar() {
  const router = useRouter();
  return (
    <div className={clsx('h-full w-full bg-primary-4')}>
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
