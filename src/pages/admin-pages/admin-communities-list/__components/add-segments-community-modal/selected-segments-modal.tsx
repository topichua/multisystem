import { useBoolean } from 'ahooks';
import { Skeleton, Spin, Typography } from 'antd';
import { useEffect } from 'react';
import { Button } from 'src/components/common/Button/Button.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { useSegments } from './useSegments.tsx';

import * as S from './selected-segments-modal.styled.tsx';

const { Text } = Typography;

export const SelectedSegmentsModal = ({
  segmentIds,
}: {
  segmentIds: string[];
}) => {
  const [isOpen, { setFalse: closeModal, setTrue: openModal }] =
    useBoolean(false);

  const { isSegmentsLoading, selectedSegments, setSelectedSegmentsIds } =
    useSegments(segmentIds, isOpen);

  useEffect(() => {
    setSelectedSegmentsIds(segmentIds);
  }, [segmentIds]);

  return (
    <>
      <Button
        onClick={openModal}
        type="link"
        disabled={segmentIds.length === 0}
      >
        Segments selected: {segmentIds.length}
      </Button>
      <S.StyledModal
        title="Selected segments"
        open={isOpen}
        centered
        cancelButtonProps={{ hidden: true }}
        onCancel={closeModal}
        footer={null}
      >
        <Spin spinning={isSegmentsLoading}>
          {!isSegmentsLoading && selectedSegments.length > 0 ? (
            <Stack vertical spacing={'tight'}>
              <S.StyledDivider />
              {selectedSegments.map((segment) => (
                <Text strong key={segment.segmentId}>
                  {segment.segmentName}
                </Text>
              ))}
            </Stack>
          ) : (
            <Skeleton active />
          )}
        </Spin>
      </S.StyledModal>
    </>
  );
};
