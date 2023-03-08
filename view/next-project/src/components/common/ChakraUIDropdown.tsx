import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import React from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';

interface Props {
  title: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const Dropdown = (props: Props) => {
  return (
    <Menu>
      <MenuButton
        variant='outline'
        as={Button}
        rightIcon={<RiArrowDropDownLine />}
        _hover={{ color: '#023859', bgColor: '#fff' }}
        _active={{ color: '#023859', bgColor: '#fff' }}
      >
        <div className='flex flex-row gap-3'>
          {props.children}
          <span suppressHydrationWarning className='hidden md:block'>
            {props.title}
          </span>
        </div>
      </MenuButton>
      <MenuList>
        <MenuItem
          style={{ color: '#023859' }}
          onClick={() => {
            props.onClick && props.onClick();
          }}
        >
          <p>ログアウト</p>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default Dropdown;
