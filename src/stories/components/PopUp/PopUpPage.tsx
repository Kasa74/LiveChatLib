import React from 'react';

import { PopUp } from '../../../components';

type User = {
  name: string;
};

export const PopUpPage: React.FC = () => {

  return (
    <div>
        <PopUp/>
    </div>
  );
};
