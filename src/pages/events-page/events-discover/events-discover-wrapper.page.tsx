/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, ChangeEvent } from 'react';
import { observer } from 'mobx-react';
import { Layout, Radio, Checkbox, Tooltip, InputProps } from 'antd';
import { Page } from 'src/components/common/page/page';
import { Outlet } from 'react-router-dom';
import { SiderBackNav } from 'src/components/common/SiderBackNav/SiderBackNav';
import { pagesMap } from 'src/pages/authorized/routes';
import { useEventsStore } from '../events.page.provider';
import { MenuItem } from 'src/pages/news-and-resources/news';
import { Title } from 'src/components/common/Typography/Title';
import {
  File06,
  Grid01,
  SearchMd,
  Star05,
  Tag01,
} from '@untitled-ui/icons-react';
import { Menu } from 'src/components/common/menu/menu';
import { Divider } from 'src/components/common/Divider/Divider.tsx';
import { MenuItemsSkeleton } from 'src/components/common/menu/menu-items-skeleton';
import { StyledSearch } from 'src/pages/news-and-resources/news-card-list.styled';
import { useDebounce } from 'ahooks';
import {
  MenuStyled,
  SeeAllButton,
  StyledCheckbox,
} from 'src/pages/news-and-resources/components/Menu/menu.styles';

const keyEventListingRootMenu = 'event-listing-root-menu';
const keyCpdAndEventRootMenu = 'cpd-and-event-library';
const keyEventCategoryRootMenu = 'event-category-root-menu';
const keyTagRootMenu = 'tag-root-menu';

const commonStyledSearchProps: InputProps = {
  allowClear: true,
  prefix: <SearchMd width={20} height={20} />,
};

export const EventsDiscoverWrapperPage = observer(() => {
  const [showAllTags, setShowAllTags] = useState(false);
  const [tagSearchKeyword, setTagSearchKeyword] = useState('');
  const [eventSearchKeyword, setEventSearchKeyword] = useState('');

  const rootStore = useEventsStore();
  const {
    typeId,
    tagSet,
    categorySet,
    setFilterStringValue,
    toggleFilterArrayValue,
    listingId,
  } = rootStore.eventsFilterStore;

  const {
    isLoadingEventFilters,
    fetchAllEventsFilter,
    eventListingOptions,
    eventTypes,
    eventCategories,
    eventTags,
  } = rootStore.eventsStore;

  const debouncedTagSearchKeyword = useDebounce(
    tagSearchKeyword.toLocaleLowerCase(),
    {
      wait: 300,
    }
  );

  const debouncedEventSearchKeyword = useDebounce(eventSearchKeyword, {
    wait: 300,
  });

  const filteredEventTags = eventTags.filter((item) =>
    (item.label || '').toLocaleLowerCase().includes(debouncedTagSearchKeyword)
  );

  const shownTags = showAllTags
    ? filteredEventTags
    : filteredEventTags.slice(0, 5);

  const handleEventTypeRadioSelect = (selectedTypeId: string) => {
    setFilterStringValue(
      'typeId',
      typeId === selectedTypeId ? null : selectedTypeId
    );
  };

  const handleEventListingRadioSelect = (selectedListingId: string) => {
    setFilterStringValue(
      'listingId',
      listingId === selectedListingId ? null : selectedListingId
    );
  };

  const handleEventCategoryToggle = (categoryId: string) => {
    toggleFilterArrayValue('categoryId', categoryId);
  };

  const handleEventTagsToggle = (tagId: string) => {
    toggleFilterArrayValue('tagId', tagId);
  };

  const handleTagItemSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setTagSearchKeyword(event.target?.value);
  };

  const handleEventSearchByText = (event: ChangeEvent<HTMLInputElement>) => {
    setEventSearchKeyword(event?.target?.value);
  };

  const eventListingFilterItems: MenuItem[] = [
    {
      key: keyEventListingRootMenu,
      label: <Title level={5}>Event Listing</Title>,
      icon: <File06 />,
      children: eventListingOptions.map(({ id: eventListingId, label }) => ({
        label,
        key: eventListingId,
        icon: (
          <Radio
            key={eventListingId}
            value={eventListingId}
            checked={listingId === eventListingId}
          />
        ),
      })),
    },
  ];

  const eventTypeFilterItems: MenuItem[] = [
    {
      key: keyCpdAndEventRootMenu,
      label: <Title level={5}>Event Type</Title>,
      icon: <Grid01 />,
      children: eventTypes.map(({ id: eventTypeId, label }) => ({
        label: <Tooltip title={label}>{label}</Tooltip>,
        key: eventTypeId,
        icon: (
          <Radio
            key={eventTypeId}
            value={eventTypeId}
            checked={typeId === eventTypeId}
          />
        ),
      })),
    },
  ];

  const eventCategoryFilterItems: MenuItem[] = [
    {
      key: keyEventCategoryRootMenu,
      label: <Title level={5}>CPD Categories</Title>,
      icon: <Star05 />,
      children: eventCategories.map(({ id: eventCategoryId, label }) => ({
        label: <Tooltip title={label}>{label}</Tooltip>,
        key: eventCategoryId,
        icon: (
          <Checkbox
            key={eventCategoryId}
            value={eventCategoryId}
            checked={categorySet.has(eventCategoryId)}
            onClick={(e) => {
              e.stopPropagation();
              handleEventCategoryToggle(eventCategoryId);
            }}
          />
        ),
      })),
    },
  ];

  const eventTagFilterItems: MenuItem[] = [
    {
      key: keyTagRootMenu,
      label: <Title level={5}>Tags</Title>,
      icon: <Tag01 />,
      children: [
        {
          key: 'event-tags-search',
          icon: (
            <StyledSearch
              {...commonStyledSearchProps}
              onChange={handleTagItemSearch}
              placeholder="Search tags"
              marginTop={24}
            />
          ),
        },
        ...shownTags.map(({ id: eventTagId, label }) => ({
          key: eventTagId,
          label: <Tooltip title={label}>{label}</Tooltip>,
          icon: (
            <StyledCheckbox
              key={eventTagId}
              value={eventTagId}
              checked={tagSet.has(eventTagId)}
              onClick={(e) => {
                e.stopPropagation();
                handleEventTagsToggle(eventTagId);
              }}
            />
          ),
          onClick: () => handleEventTagsToggle(eventTagId),
        })),
      ],
    },
  ];

  useEffect(() => {
    fetchAllEventsFilter();
  }, []);

  useEffect(() => {
    setFilterStringValue('keyword', eventSearchKeyword);
  }, [debouncedEventSearchKeyword]);

  return (
    <Layout>
      <Page.Sider
        fixed
        title={
          <SiderBackNav
            textLabel="Discover CPD & Events"
            pathToNavigateBackTo={pagesMap.events}
          />
        }
      >
        {isLoadingEventFilters ? (
          <MenuItemsSkeleton />
        ) : (
          <>
            <StyledSearch
              {...commonStyledSearchProps}
              placeholder="Search events"
              marginTop={20}
              onChange={handleEventSearchByText}
              value={eventSearchKeyword}
            />

            {/* Event Listing */}
            <Menu
              mode="inline"
              defaultOpenKeys={[keyEventListingRootMenu]}
              selectedKeys={[]}
              items={eventListingFilterItems}
              onClick={(e) => handleEventListingRadioSelect(e?.key)}
            />
            <Divider spacing="extraTight" />

            {/* Event Type */}
            <Menu
              mode="inline"
              defaultOpenKeys={[keyCpdAndEventRootMenu]}
              selectedKeys={[]}
              items={eventTypeFilterItems}
              onClick={(e) => handleEventTypeRadioSelect(e?.key)}
            />
            <Divider spacing="extraTight" />

            {/* CPD Categories */}
            {listingId !== 'events' && (
              <>
                <Menu
                  mode="inline"
                  defaultOpenKeys={[]}
                  selectedKeys={[]}
                  items={eventCategoryFilterItems}
                  onClick={(e) => handleEventCategoryToggle(e?.key)}
                />
                <Divider spacing="extraTight" />
              </>
            )}

            {/* Tags */}
            <MenuStyled
              mode="inline"
              defaultOpenKeys={[keyTagRootMenu]}
              selectedKeys={[]}
              items={eventTagFilterItems}
            />
            <SeeAllButton
              type="text"
              onClick={() => setShowAllTags((prevState) => !prevState)}
            >
              {!filteredEventTags.length || debouncedTagSearchKeyword
                ? ''
                : showAllTags
                  ? 'Show less tags'
                  : 'See all tags'}
            </SeeAllButton>
          </>
        )}
      </Page.Sider>
      <Page.Content noPadding>
        <Outlet />
      </Page.Content>
    </Layout>
  );
});
