import { MdAttachMoney, MdInventory2 } from 'react-icons/md';

import { SponsorshipActivity } from '@/generated/model';

interface SponsorStyleListProps {
  styles: SponsorshipActivity['sponsorStyles'];
  textMaxWidthClassName?: string;
  alignClassName?: string;
}

export default function SponsorStyleList({
  styles,
  textMaxWidthClassName = 'max-w-[12rem]',
  alignClassName = 'justify-center',
}: SponsorStyleListProps) {
  if (!styles || styles.length === 0) {
    return <p className='text-sm text-black-600'>未定</p>;
  }

  const orderedStyles = styles
    .map((styleLink, index) => ({ styleLink, index }))
    .sort((a, b) => {
      const aPriority = a.styleLink.category === 'goods' ? 1 : 0;
      const bPriority = b.styleLink.category === 'goods' ? 1 : 0;
      if (aPriority !== bPriority) return aPriority - bPriority;
      return a.index - b.index;
    })
    .map(({ styleLink }) => styleLink);

  return (
    <div className='flex min-w-0 flex-col gap-1'>
      {orderedStyles.map((styleLink, index) => {
        const key = `${styleLink.sponsorStyleId || index}-${
          styleLink.category || 'money'
        }-${index}`;
        const styleName = styleLink.style?.style || '';
        const styleFeature = styleLink.style?.feature || '';
        const label = [styleName, styleFeature].filter(Boolean).join(' ');

        return (
          <div
            key={key}
            className={`
              flex min-w-0 items-center gap-1
              ${alignClassName}
            `}
          >
            {styleLink.category === 'goods' ? (
              <MdInventory2 className='shrink-0 text-black-600' size={16} />
            ) : (
              <MdAttachMoney className='shrink-0 text-black-600' size={16} />
            )}
            <span
              className={`
                block min-w-0 truncate text-sm text-black-600
                ${textMaxWidthClassName}
              `}
              title={label || '-'}
            >
              {label || '-'}
            </span>
          </div>
        );
      })}
    </div>
  );
}
