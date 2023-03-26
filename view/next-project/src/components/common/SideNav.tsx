import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { ReactNode, useReducer } from 'react';

import { FinanceLinkItems, RelationLinkItems } from '@/constants/linkItem';

interface NavItemProps {
  icon: ReactNode;
  children?: React.ReactNode;
  href: string;
  currentPath: string;
  isParent?: boolean;
  isShow?: boolean;
  onClick?: () => void;
}

export default function SimpleSidebar() {
  const router = useRouter();
  const [isFinanceItemsShow, setisFinanceItemsShow] = useReducer((state) => !state, false);
  const [isRelationItemsShow, setisRelationItemsShow] = useReducer((state) => !state, false);

  return (
    <div className='fixed right-0 z-50 h-full w-52 bg-primary-4 md:left-0'>
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
