import { MdAttachMoney, MdInventory2 } from 'react-icons/md';

import { SponsorshipActivity } from '@/generated/model';

interface SponsorStyleListProps {
  styles: SponsorshipActivity['sponsorStyles'];
}

export default function SponsorStyleList({ styles }: SponsorStyleListProps) {
  if (!styles || styles.length === 0) {
    return <p className='text-sm text-black-600'>未定</p>;
  }

  return (
    <div className='flex flex-col gap-1'>
      {styles.map((styleLink, index) => {
        const key = `${styleLink.sponsorStyleId || index}-${
          styleLink.category || 'money'
        }-${index}`;
        const styleName = styleLink.style?.style || '';
        const styleFeature = styleLink.style?.feature || '';
        const label = [styleName, styleFeature].filter(Boolean).join(' ');

        return (
          <div key={key} className='flex items-center justify-center gap-1'>
            {styleLink.category === 'goods' ? (
              <MdInventory2 className='text-black-600' size={16} />
            ) : (
              <MdAttachMoney className='text-black-600' size={16} />
            )}
            <span className='text-sm text-black-600'>{label || '-'}</span>
          </div>
        );
      })}
    </div>
  );
}
