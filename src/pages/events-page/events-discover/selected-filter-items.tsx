import { observer } from 'mobx-react';
import {
  File06,
  Grid01,
  MarkerPin01,
  Star04,
  Tag01,
} from '@untitled-ui/icons-react';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Stack } from 'src/components/common/Stack/Stack';
import { useEventsStore } from '../events.page.provider';
import { Tag } from 'src/components/common/Tag/Tag';
import { SeeAllButton } from 'src/pages/news-and-resources/components/Menu/menu.styles';

const ICON_HEIGHT: { width: number; height: number } = {
  width: 16,
  height: 16,
};

export const SelectedFilterItems = observer(() => {
  const rootStore = useEventsStore();

  const {
    eventCategories,
    eventTypes,
    eventListingOptions,
    eventTags,
    eventLocations,
    isLoadingEventFilters,
  } = rootStore.eventsStore;

  const {
    eventsQueryString,
    isEmptyFilterItemChips,
    typeId,
    listingId,
    tagSet,
    locationSet,
    categorySet,
    setFilterStringValue,
    toggleFilterArrayValue,
    resetSelectedFilters,
  } = rootStore.eventsFilterStore;

  const arrSelectedFilters = [
    ...(listingId
      ? [
          {
            id: listingId,
            label: eventListingOptions.find((item) => item.id === listingId)
              ?.label,
            icon: <File06 {...ICON_HEIGHT} />,
            onClose: () => setFilterStringValue('listingId', null),
          },
        ]
      : []),

    ...(typeId
      ? [
          {
            id: typeId,
            label: eventTypes.find((item) => item.id === typeId)?.label,
            icon: <Grid01 {...ICON_HEIGHT} />,
            onClose: () => {
              setFilterStringValue('typeId', null);
            },
          },
        ]
      : []),

    ...Array.from(categorySet).map((categoryId) => ({
      id: categoryId,
      label: eventCategories.find((item) => item.id === categoryId)?.label,
      icon: <Star04 {...ICON_HEIGHT} />,
      onClose: () => {
        toggleFilterArrayValue('categoryId', categoryId);
      },
    })),

    ...Array.from(tagSet).map((tagId) => ({
      id: tagId,
      label: eventTags.find((item) => item.id === tagId)?.label,
      icon: <Tag01 {...ICON_HEIGHT} />,
      onClose: () => {
        toggleFilterArrayValue('tagId', tagId);
      },
    })),

    ...Array.from(locationSet).map((locationId) => ({
      id: locationId,
      label: eventLocations.find((item) => item.value === locationId)?.label,
      icon: <MarkerPin01 {...ICON_HEIGHT} />,
      onClose: () => {
        toggleFilterArrayValue('locationId', locationId);
      },
    })),
  ].filter(Boolean);

  if (
    isLoadingEventFilters ||
    eventsQueryString === '' ||
    isEmptyFilterItemChips
  )
    return null;

  return (
    <InnerPageHeader>
      <Stack>
        {arrSelectedFilters.length > 0 && (
          <SeeAllButton
            type="link"
            onClick={resetSelectedFilters}
            style={{ margin: '0', marginRight: '8px', fontSize: '13px' }}
          >
            Clear all filters
          </SeeAllButton>
        )}

        {arrSelectedFilters.map((filterItem) => (
          <Tag
            closable
            isTextBold
            key={filterItem.id}
            icon={filterItem.icon}
            onClose={filterItem.onClose}
          >
            {filterItem.label}
          </Tag>
        ))}
      </Stack>
    </InnerPageHeader>
  );
});
