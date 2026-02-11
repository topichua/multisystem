import {
  Button,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  ModalProps,
  Typography,
} from 'antd';
import { isEmpty, isNil } from 'lodash';
import { FC, useCallback, useMemo } from 'react';
import {
  CommunityAssetsItem,
  AssetsTypeEnum,
} from 'src/transport/communities/communities.dto';
import * as S from './rename-folder-modal.styled';
import * as T from './rename-folder-modal.types';
import * as U from './assets-table.utils';
import { Stack } from 'src/components/common/Stack/Stack';

type RenameFolderModalProps = {
  folderParams?: Pick<
    CommunityAssetsItem,
    'id' | 'name' | 'description'
  > | null;
  assetsItems?: CommunityAssetsItem[] | null;
  onFilesSubmit: (files: T.TFormFiles) => void;
  isEditFilesInFolderLoading: boolean;
  onEditFolder: (name: string, description?: string) => void;
  isEditFolderLoading: boolean;
} & ModalProps;

export const RenameFolderModal: FC<RenameFolderModalProps> = ({
  onEditFolder,
  folderParams,
  onFilesSubmit,
  assetsItems,
  isEditFolderLoading,
  isEditFilesInFolderLoading,
  ...modalProps
}) => {
  const [folderForm] = Form.useForm();

  const [filesForm] = Form.useForm();
  const folderFormInitialValues = useMemo(() => {
    return { name: folderParams?.name, description: folderParams?.description };
  }, [folderParams?.description, folderParams?.name]);

  const filesFormInitialValues = useMemo(() => {
    return assetsItems?.reduce((prev, current) => {
      return {
        ...prev,
        [current.id]: {
          name: current.name,
          description: current?.description,
        },
      };
    }, {});
  }, [assetsItems]);

  const handleEditFolder = useCallback(
    (values: T.TAssetShared) => {
      onEditFolder(values.name, values?.description);
    },
    [onEditFolder]
  );

  const hasFiles = useMemo(
    () => !isNil(assetsItems) && !isEmpty(assetsItems),
    [assetsItems]
  );

  const getExtension = useCallback((record: CommunityAssetsItem): string => {
    if (record.type === AssetsTypeEnum.Link) {
      return 'link';
    } else if (record.path) {
      const parts = record.path.split('.').pop()?.split('?');
      return parts ? parts[0] : '';
    }
    return '';
  }, []);

  return (
    <Modal
      title="Edit Folder and Files"
      open={!!folderParams}
      centered
      {...modalProps}
      footer={null}
      transitionName="ant-fade"
      destroyOnClose
    >
      <Stack vertical spacing="none" split={<Divider />}>
        {folderParams && (
          <Form<T.TAssetShared>
            form={folderForm}
            initialValues={folderFormInitialValues}
            onFinish={handleEditFolder}
            disabled={isEditFolderLoading}
            layout="vertical"
          >
            <Form.Item
              label="Folder Name"
              rules={[
                {
                  required: true,
                  message: 'Please input the folder name',
                },
              ]}
              name="name"
            >
              <Input placeholder="Enter folder name" />
            </Form.Item>

            <Form.Item label="Folder Description" name="description">
              <Input placeholder="Briefly describe the folder contents" />
            </Form.Item>

            <Stack distribution="trailing">
              <Button
                type="primary"
                onClick={folderForm.submit}
                loading={isEditFolderLoading}
              >
                Save Folder
              </Button>
            </Stack>
          </Form>
        )}

        {hasFiles && (
          <Form<T.TFormFiles>
            form={filesForm}
            initialValues={filesFormInitialValues}
            layout="vertical"
            onFinish={onFilesSubmit}
            disabled={isEditFilesInFolderLoading}
          >
            <Typography.Title level={5} style={{ marginTop: 0 }}>
              Files Details
            </Typography.Title>
            {assetsItems?.map((record) => {
              const { id } = record;
              const extension = getExtension(record);
              return (
                <>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: 'Please input the file name',
                      },
                    ]}
                    label={
                      <Flex gap={20}>
                        <Typography.Text>File Name</Typography.Text>

                        <S.IconTagWrapper
                          icon={
                            U.fileTypeIcons[extension] ||
                            U.fileTypeIcons.default
                          }
                          color="purple"
                        >
                          {record.type === AssetsTypeEnum.Link
                            ? 'link'
                            : `*.${extension} `}
                        </S.IconTagWrapper>
                      </Flex>
                    }
                    key={`${id}-name`}
                    name={[id, 'name']}
                  >
                    <Input placeholder="Enter file name" name={id} />
                  </Form.Item>
                  <Form.Item
                    label="File Description"
                    key={`${id}-description`}
                    name={[id, 'description']}
                  >
                    <Input placeholder="Briefly describe the file" name={id} />
                  </Form.Item>
                </>
              );
            })}

            <Stack key="fis" distribution="trailing">
              <Button
                loading={isEditFilesInFolderLoading}
                onClick={filesForm.submit}
                type="primary"
              >
                Save Files
              </Button>
            </Stack>
          </Form>
        )}
      </Stack>
    </Modal>
  );
};
