import { Empty, Spin, Typography } from 'antd';
import { useBoolean } from 'ahooks';
import { ChevronDown } from '@untitled-ui/icons-react';

import { Divider } from 'src/components/common/Divider/Divider.tsx';
import { SearchBar } from 'src/components/common/Searchbar/Searchbar.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { Button } from 'src/components/common/Button/Button.tsx';
import { Title } from 'src/components/common/Typography/Title.tsx';

import { useSegments } from './useSegments.tsx';
import { ModalSegmentItem } from './modal-segment-item.tsx';
import { SelectedSegmentsModal } from './selected-segments-modal.tsx';

import * as S from './add-segments-modal.styled.ts';

const { Text } = Typography;

type AddSegmentsModalProps = {
  segmentIds: string[];
  onSetSegmentIds: (segmentIds: string[]) => void;
};

export const AddSegmentsModal = ({
  segmentIds,
  onSetSegmentIds,
}: AddSegmentsModalProps) => {
  const [isOpen, { setFalse: closeModal, setTrue: openModal }] =
    useBoolean(false);

  const {
    isSegmentsLoading,
    selectedSegmentsIds,
    selectedSegments,
    searchSegments,
    keyword,
    isKeywordShort,
    filteredSegments,
    collapsedActiveKeys,
    setCollapsedActiveKeys,
    setKeyword,
    setSelectedSegmentsIds,
    toggleSegmentIds,
  } = useSegments(segmentIds, isOpen);

  const cleanAndCloseModal = () => {
    closeModal();
    setKeyword('');
  };

  return (
    <>
      <Stack distribution="equalSpacing" alignment="center">
        <SelectedSegmentsModal segmentIds={segmentIds} />
        <Button type="dashed" onClick={openModal}>
          {segmentIds.length ? 'Edit' : 'Add'} segments
        </Button>
      </Stack>
      <S.Modal
        open={isOpen}
        title={
          <Stack vertical>
            <Title level={5}>Add segments</Title>
            <SearchBar
              value={keyword}
              placeholder="Search by name"
              onChange={(e) => setKeyword(e.target.value)}
            />
          </Stack>
        }
        footer={
          <Stack alignment="center" distribution="equalSpacing">
            <Text strong>Segments selected: {selectedSegmentsIds.length}</Text>
            <Stack alignment="center">
              <Button
                onClick={() => {
                  setSelectedSegmentsIds(segmentIds);
                  cleanAndCloseModal();
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  onSetSegmentIds(selectedSegmentsIds);
                  cleanAndCloseModal();
                }}
              >
                Apply
              </Button>
            </Stack>
          </Stack>
        }
        onCancel={() => {
          setSelectedSegmentsIds(segmentIds);
          cleanAndCloseModal();
        }}
      >
        <Spin spinning={isSegmentsLoading}>
          <Stack vertical>
            <S.ListWrapper>
              {selectedSegments.length ? (
                <Stack vertical>
                  {selectedSegments.map((segment) => (
                    <ModalSegmentItem
                      key={segment.segmentId}
                      segment={segment}
                      selectedSegmentsIds={selectedSegmentsIds}
                      toggleSegmentIds={toggleSegmentIds}
                    />
                  ))}
                  <Divider />
                </Stack>
              ) : null}

              <Stack vertical>
                {filteredSegments.length > 0 && (
                  <S.StyledCollapse
                    activeKey={collapsedActiveKeys}
                    size="small"
                    expandIcon={({ isActive }) => (
                      <S.StyledCollapsedIcon isActive={isActive}>
                        <ChevronDown height={20} width={20} />
                      </S.StyledCollapsedIcon>
                    )}
                    items={filteredSegments.map((s) => ({
                      key: s.category,
                      label: s.category,
                      children: (
                        <Stack vertical>
                          {s.segments.map((segment) => (
                            <ModalSegmentItem
                              key={segment.segmentId}
                              segment={segment}
                              selectedSegmentsIds={selectedSegmentsIds}
                              toggleSegmentIds={toggleSegmentIds}
                            />
                          ))}
                        </Stack>
                      ),
                    }))}
                    defaultActiveKey={['1']}
                    onChange={setCollapsedActiveKeys}
                  />
                )}
              </Stack>

              {!isSegmentsLoading &&
                !isKeywordShort &&
                searchSegments.length === 0 && (
                  <Empty description="No segments found" />
                )}
            </S.ListWrapper>
          </Stack>
        </Spin>
      </S.Modal>
    </>
  );
};
