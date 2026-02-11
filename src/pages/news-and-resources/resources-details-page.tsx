import { Flex, Image } from 'antd';
import { observer } from 'mobx-react';
import { useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Markdown from 'react-markdown';

import { Page } from 'src/components/common/page/page';
import { EngagementAction } from 'src/hooks/useEngagementTracker/types.ts';
import { useEngagementTracker } from 'src/hooks/useEngagementTracker/useEngagementTracker.ts';
import { GetItemsParams } from 'src/transport/news/news.dto';
import { formatDate } from 'src/utils/date-time';
import { useReactToPrint } from 'react-to-print';
import {
  CategoryTag,
  DefaultTag,
} from 'src/components/common/ArticleCard/components/CategoryTag';
import { Stack } from 'src/components/common/Stack/Stack';
import { DIRECTUS_ASSETS_URL } from 'src/transport/directus.utils';
import { pagesMap } from '../authorized/routes';
import * as C from './components';
import { useResourceDetailsStore } from './store/resources.store';
import { ResourceDeepDTO } from './types/resources.types';
import { Button } from 'src/components/common/Button/Button';
import { Printer, Share01 } from '@untitled-ui/icons-react';
import { ShareModal } from './components/share-modal';
import { useBoolean } from 'ahooks';

const DEFAULT_PARAMS: GetItemsParams = {
  meta: '*',
  fields:
    'id, date_created, date_updated, name, shortDescription, content, user_created.*, image.*, categories.category_id.*, tags.*.*, assets.*.*.*',
};

export const ResourceDetailsPage = observer(() => {
  const newsId = useParams()?.id as string;
  const { track } = useEngagementTracker();
  const location = useLocation();

  const navigate = useNavigate();
  const { getResourceDetails, selectedResource, isLoading } =
    useResourceDetailsStore();

  useEffect(() => {
    getResourceDetails(newsId, { id: newsId, ...DEFAULT_PARAMS });
  }, []);

  const _selectedResource = useMemo(
    () => selectedResource as ResourceDeepDTO,
    [selectedResource]
  );

  useEffect(() => {
    if (selectedResource) {
      track({
        action: EngagementAction.ViewNews,
        entityId: selectedResource.id,
        entityName: selectedResource.name || '',
        entityUrl: window.location.href,
      });
    }
  }, [location.pathname, selectedResource, track]);

  const fullName = useMemo(
    () =>
      `${_selectedResource?.userCreated?.firstName} ${_selectedResource?.userCreated?.lastName}`,
    [
      _selectedResource?.userCreated?.firstName,
      _selectedResource?.userCreated?.lastName,
    ]
  );

  const lastUpdated = useMemo(
    () =>
      _selectedResource?.dateUpdated
        ? formatDate(_selectedResource?.dateUpdated)
        : undefined,
    [_selectedResource?.dateUpdated]
  );

  const [
    isOpenShareModal,
    { setTrue: openShareModal, setFalse: closeShareModal },
  ] = useBoolean(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    pageStyle: `
      @media print {
        @page {
          size: auto;
          margin: 0mm;
        }
        
        body {padding: 20px;}
      }
      `,
  });

  return (
    <Page.Content>
      <Flex align="center" justify="center" style={{ width: '100%' }}>
        <Flex justify="center" style={{ maxWidth: 900 }}>
          <Flex vertical style={{ maxWidth: 1216, width: '100%' }}>
            <C.BackButton isNews={false} />
            <C.NewsTitle isLoading={isLoading}>
              {_selectedResource?.name}
            </C.NewsTitle>
            <C.AuthorInfoComponent
              isLoading={isLoading}
              fullName={fullName}
              lastUpdated={lastUpdated}
            />

            <Stack
              spacing={'extraTight'}
              distribution={
                _selectedResource?.categories?.length
                  ? 'equalSpacing'
                  : 'trailing'
              }
              style={{ marginBottom: 24 }}
            >
              {_selectedResource?.categories?.length ? (
                <Stack vertical spacing={'none'}>
                  <C.AuthorLabel level={5}>Type</C.AuthorLabel>
                  <C.AuthorValue type="secondary" $isDate>
                    <Stack spacing={'extraTight'}>
                      {_selectedResource?.categories?.map(({ categoryId }) => {
                        return (
                          <CategoryTag
                            key={categoryId?.id}
                            name={categoryId?.label}
                            onClick={() => {
                              navigate(
                                `${pagesMap.resources}/${categoryId?.id}`
                              );
                            }}
                          />
                        );
                      })}
                    </Stack>
                  </C.AuthorValue>
                </Stack>
              ) : null}
              <Stack>
                <Button
                  icon={<Printer width={14} height={14} />}
                  onClick={() => reactToPrintFn()}
                >
                  Print
                </Button>

                <Button
                  type="primary"
                  icon={<Share01 width={14} height={14} />}
                  onClick={openShareModal}
                >
                  Share
                </Button>
              </Stack>
            </Stack>

            <div ref={contentRef}>
              {_selectedResource?.image?.id && (
                <C.StyledImages>
                  <Image
                    src={`${DIRECTUS_ASSETS_URL}${_selectedResource?.image?.id}`}
                    style={{ maxHeight: 500, width: '100%' }}
                    loading="eager"
                  />
                </C.StyledImages>
              )}
              <C.NewsBody isLoading={isLoading}>
                <Markdown>{_selectedResource?.content}</Markdown>
              </C.NewsBody>
            </div>
            <Stack spacing={'extraTight'} style={{ marginBottom: 24 }}>
              {_selectedResource?.tags?.length ? (
                <Stack vertical spacing={'extraTight'}>
                  <C.AuthorLabel level={5}>Tags</C.AuthorLabel>
                  <C.AuthorValue type="secondary" $isDate>
                    <Stack spacing="tight">
                      {_selectedResource?.tags?.map(({ tagId }) => {
                        return (
                          <DefaultTag key={tagId?.id}>
                            {tagId?.label || ''}
                          </DefaultTag>
                        );
                      })}
                    </Stack>
                  </C.AuthorValue>
                </Stack>
              ) : null}
            </Stack>
            <C.AttachmentsList
              isLoading={isLoading}
              attachments={_selectedResource?.assets}
            />
          </Flex>
        </Flex>
      </Flex>
      <ShareModal
        link={window.location.href}
        open={isOpenShareModal}
        onCancel={closeShareModal}
      />
    </Page.Content>
  );
});
