import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { Checkbox, Typography } from 'antd';
import { SegmentProps } from 'src/transport/communities/communities.dto.ts';
import { useState } from 'react';
import delay from 'lodash/delay';
import styled from 'styled-components';

const { Text } = Typography;
interface ModalSegmentItemProps {
  segment: SegmentProps;
  selectedSegmentsIds: string[];
  toggleSegmentIds: (id: string) => void;
}

export const ModalSegmentItem = ({
  segment,
  selectedSegmentsIds,
  toggleSegmentIds,
}: ModalSegmentItemProps) => {
  const [isChecked, setIsChecked] = useState(
    selectedSegmentsIds.includes(segment.segmentId)
  );

  const handleToggle = () => {
    setIsChecked((prev) => !prev);

    delay(() => {
      toggleSegmentIds(segment.segmentId);
    }, 300);
  };

  return (
    <Stack wrap={false} alignment="center" distribution="equalSpacing">
      <StyledText strong onClick={handleToggle} style={{ cursor: 'pointer' }}>
        {segment.segmentName}
      </StyledText>
      <Checkbox checked={isChecked} onChange={handleToggle} />
    </Stack>
  );
};

const StyledText = styled(Text)`
  &:hover {
    color: ${(props) => props.theme.colors.components.colors.brandColor};
  }
`;
