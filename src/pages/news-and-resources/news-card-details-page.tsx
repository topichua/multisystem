import { Flex, Image } from 'antd';
import { observer } from 'mobx-react';
import { useEffect, useMemo, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  CategoryTag,
  DefaultTag,
} from 'src/components/common/ArticleCard/components/CategoryTag';
import Markdown from 'react-markdown';

import { Page } from 'src/components/common/page/page';
import { Stack } from 'src/components/common/Stack/Stack';
import { EngagementAction } from 'src/hooks/useEngagementTracker/types.ts';
import { useEngagementTracker } from 'src/hooks/useEngagementTracker/useEngagementTracker.ts';

import { DIRECTUS_ASSETS_URL } from 'src/transport/directus.utils';
import { GetItemsParams } from 'src/transport/news/news.dto';
import { formatDate } from 'src/utils/date-time';
import { pagesMap } from '../authorized/routes';
import * as C from './components';

import { useNewsDetailsStore } from './store/news.store';
import { NewsDeepDTO } from './types/news.types';
import { Button } from 'src/components/common/Button/Button';
import { Printer, Share01 } from '@untitled-ui/icons-react';
import { useBoolean } from 'ahooks';
import { ShareModal } from './components/share-modal';

const DEFAULT_PARAMS: GetItemsParams = {
  meta: '*',
  fields:
    'id, date_created, date_updated, name, shortDescription, content, user_created.*, image.*, categories.category_id.*, tags.tag_id.*, assets.*.*.*',
};

export const NewsCardDetailsPage = observer(() => {
  const navigate = useNavigate();
  const newsId = useParams()?.id as string;
  const { track } = useEngagementTracker();
  const location = useLocation();

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

  const [
    isOpenShareModal,
    { setTrue: openShareModal, setFalse: closeShareModal },
  ] = useBoolean(false);

  // const reactToPrintFn = () => {
  //   if (contentRef.current) {
  //     const printContent = contentRef.current.innerHTML;
  //     const newWindow = window.open('', '', 'width=800,height=600');
  //     if (newWindow) {
  //       newWindow.document.write(`
  //         <html>
  //           <head>
  //             <title></title>
  //             <style>
  //               /* Add any custom styles here */
  //               body {
  //                 font-family: Arial, sans-serif;
  //                 margin: 20px;
  //               }
  //             </style>
  //           </head>
  //           <body>${printContent}</body>
  //         </html>
  //       `);
  //       newWindow.document.close();
  //       newWindow.focus();
  //       newWindow.print();
  //       newWindow.close();
  //     }
  //   }
  // };

  const { getNewsDetails, selectedNewsItem, isNewsLoading } =
    useNewsDetailsStore();

  useEffect(() => {
    getNewsDetails(newsId, { id: newsId, ...DEFAULT_PARAMS });
  }, []);

  useEffect(() => {
    if (selectedNewsItem) {
      track({
        action: EngagementAction.ViewNews,
        entityId: selectedNewsItem.id,
        entityName: selectedNewsItem.name || '',
        entityUrl: window.location.href,
      });
    }
  }, [location.pathname, selectedNewsItem, track]);

  const _selectedNewsItem = useMemo(
    () => selectedNewsItem as NewsDeepDTO,
    [selectedNewsItem]
  );

  const fullName = useMemo(
    () =>
      `${_selectedNewsItem?.userCreated?.firstName} ${_selectedNewsItem?.userCreated?.lastName}`,
    [
      _selectedNewsItem?.userCreated?.firstName,
      _selectedNewsItem?.userCreated?.lastName,
    ]
  );

  const lastUpdated = useMemo(
    () =>
      _selectedNewsItem?.dateUpdated
        ? formatDate(_selectedNewsItem?.dateUpdated)
        : undefined,
    [_selectedNewsItem?.dateUpdated]
  );

  return (
    <Page.Content>
      <Flex align="center" justify="center">
        <Flex justify="center" style={{ maxWidth: 900, width: '100%' }}>
          <Flex vertical style={{ maxWidth: 1216, width: '100%' }}>
            <C.BackButton />
            <C.NewsTitle isLoading={isNewsLoading}>
              {selectedNewsItem?.name}
            </C.NewsTitle>
            <C.AuthorInfoComponent
              isLoading={isNewsLoading}
              fullName={fullName}
              lastUpdated={lastUpdated}
            />

            <Stack
              spacing={'extraTight'}
              distribution="equalSpacing"
              style={{ marginBottom: 24 }}
            >
              {_selectedNewsItem?.categories?.length ? (
                <Stack vertical spacing={'none'}>
                  <C.AuthorLabel level={5}>Type</C.AuthorLabel>
                  <C.AuthorValue type="secondary" $isDate>
                    <Stack spacing={'extraTight'}>
                      {_selectedNewsItem?.categories?.map(({ categoryId }) => {
                        return (
                          <CategoryTag
                            key={categoryId?.id}
                            name={categoryId?.label}
                            onClick={() => {
                              navigate(`${pagesMap.news}/${categoryId?.id}`);
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
              <C.StyledImages>
                <Image
                  src={`${DIRECTUS_ASSETS_URL}${_selectedNewsItem?.image?.id}`}
                  style={{ maxHeight: 500, width: '100%' }}
                  loading="eager"
                />
              </C.StyledImages>

              <C.NewsBody isLoading={isNewsLoading}>
                <Markdown>{_selectedNewsItem?.content}</Markdown>
              </C.NewsBody>
            </div>
            <Stack spacing={'extraTight'} style={{ marginBottom: 24 }}>
              {_selectedNewsItem?.tags?.length ? (
                <Stack vertical spacing={'extraTight'}>
                  <C.AuthorLabel level={5}>Tags</C.AuthorLabel>
                  <C.AuthorValue type="secondary" $isDate>
                    <Stack spacing="tight">
                      {_selectedNewsItem?.tags?.map(({ tagId }) => {
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
              isLoading={isNewsLoading}
              attachments={_selectedNewsItem?.assets}
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
