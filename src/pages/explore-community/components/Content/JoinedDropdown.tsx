import {
  ChevronDown,
  ChevronUp,
  UsersCheck,
  UsersX,
} from '@untitled-ui/icons-react';
import { Dropdown, Typography } from 'antd';
import { useState } from 'react';

import { Button } from 'src/components/common/Button/Button.tsx';

import * as S from '../common.styled.ts';

const { Text } = Typography;

const iconSizes = {
  width: 16,
  height: 16,
};

type JoinedDropdownProps = {
  onClickUnJoin: () => void;
};

export const JoinedDropdown = ({ onClickUnJoin }: JoinedDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown
      open={isOpen}
      trigger={['click']}
      overlayStyle={{ zIndex: 999 }}
      dropdownRender={() => (
        <S.LeaveDropdown>
          <Button
            block
            type="text"
            icon={<UsersX height={16} width={16} />}
            onClick={onClickUnJoin}
          >
            <Text strong>Leave community</Text>
          </Button>
        </S.LeaveDropdown>
      )}
      onOpenChange={setIsOpen}
    >
      <Button
        type="primary"
        block
        icon={<UsersCheck />}
        rightIcon={
          isOpen ? <ChevronUp {...iconSizes} /> : <ChevronDown {...iconSizes} />
        }
      >
        Joined
      </Button>
    </Dropdown>
  );
};
