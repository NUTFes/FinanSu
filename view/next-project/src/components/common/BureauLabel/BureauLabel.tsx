import React, { useMemo } from 'react';

import { BUREAUS_WITH_EN } from '@constants/bureaus';
import { Color } from '@type/color.type';

import Label from '../Label';
import { BureauLabelProps } from './BureauLabel.type';

const BureauLabel: React.FC<BureauLabelProps> = (props) => {
  const { bureauID } = props;
  const bureau = useMemo(() => {
    const bureau = BUREAUS_WITH_EN.find(
      (bureau): bureau is { id: number; name: string; name_en: Color } => bureau.id === bureauID,
    );
    return bureau;
  }, [bureauID]);

  return <Label color={bureau?.name_en}>{bureau?.name}</Label>;
};

export default BureauLabel;
