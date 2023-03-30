import React, { useMemo } from 'react';

import { BUREAUS_WITH_EN } from '@constants/bureaus';

import { BureauLabelProps } from './BureauLabel.type';
import Label from '../Label';

const BureauLabel: React.FC<BureauLabelProps> = (props) => {
  const { bureauID } = props;
  const bureau = useMemo(() => {
    const bureau = BUREAUS_WITH_EN.find((bureau) => bureau.id === bureauID);
    return bureau;
  }, [bureauID]);

  return (
    <Label isOutline color={bureau?.name_en}>
      {bureau?.name}
    </Label>
  );
};

export default BureauLabel;
