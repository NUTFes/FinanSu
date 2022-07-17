import React, { ReactNode } from 'react';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
} from '@chakra-ui/react';
import { MdOutlineDashboard, MdOutlineSavings } from 'react-icons/md';
import { BiBuildings } from 'react-icons/bi';
import { HiCurrencyDollar, HiOutlineShoppingCart, HiOutlineDocumentText } from 'react-icons/hi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';

interface LinkItemProps {
  name: string;
  icon: IconType;
  href: string;
}
const LinkItems: Array<LinkItemProps> = [
  // { name: 'ダッシュボード', icon: MdOutlineDashboard, href: '/' },
  // { name: '予算', icon: HiCurrencyDollar, href: '/budgets' },
  // { name: '企業協賛', icon: BiBuildings, href: '/sponseractivity' },
  { name: '学内募金', icon: MdOutlineSavings, href: '/fund_informations' },
  { name: '購入申請', icon: HiOutlineShoppingCart, href: '/purchaseorders' },
  { name: '購入報告', icon: HiOutlineDocumentText, href: '/purchasereports' },
];

export default function SimpleSidebar({}: { children?: ReactNode }) {
  const { isOpen, onClose } = useDisclosure();
  return (
    <Box height='full' bg='base.2'>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
        position='fixed'
        mt='2px'
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size='full'
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      bg='#1F2428'
      borderRight='1px'
      borderRightColor='gray.200'
      w='200.5px'
      pos='fixed'
      h='full'
      textColor='white'
      {...rest}
    >
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} href={link.href}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children?: ReactText;
  href: string;
}
const NavItem = ({ href, icon, children, ...rest }: NavItemProps) => {
  return (
    <Link href={href} _focus={{ boxShadow: 'none' }}>
      <Flex
        bg='#2E373F'
        align='center'
        p='4'
        role='group'
        cursor='pointer'
        _hover={{
          bg: 'white',
          color: '#2E373F',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            color='white'
            mr='4'
            fontSize='16'
            _groupHover={{
              color: '#2E373F',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};
