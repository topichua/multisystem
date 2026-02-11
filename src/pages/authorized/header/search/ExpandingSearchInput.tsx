import { SearchSm } from '@untitled-ui/icons-react';
import { Empty, Input, Spin } from 'antd';
import { FC, useMemo } from 'react';

import * as SA from './autocomplete.styled';
import * as S from './ExpandingSearchInput.styled';
import * as H from './hooks';

export const ExpandingSearchInput: FC = () => {
  const { data, loading, handleSearch } = H.useSearch();
  const options = H.useSearchOptions(data);
  const { keyword, handleInputChange } = H.useKeywordManagement(handleSearch);
  const {
    isExpanded,
    inputRef,
    handleExpand,
    handleCollapse,
    showAutoComplete,
    isAutoCompleteOpen,
  } = H.useSearchExpansion();

  const { handleSelect } = H.useSelectManagement(
    handleInputChange,
    showAutoComplete,
    handleCollapse
  );

  const renderEmpty = useMemo(
    () => (
      <Spin spinning={loading}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No results found"
        />
      </Spin>
    ),
    [loading]
  );

  return (
    <>
      <S.Mask $isVisible={isExpanded} onClick={handleCollapse} />
      <S.SearchContainer>
        <S.SearchWrapper $isExpanded={isExpanded}>
          {isExpanded ? (
            <S.StyledAutoComplete
              value={keyword}
              style={{ width: '100%' }}
              popupMatchSelectWidth={true}
              options={options}
              onSelect={handleSelect}
              open={isAutoCompleteOpen}
              notFoundContent={renderEmpty}
            >
              <Input
                ref={inputRef}
                placeholder="Search posts, communities, tags..."
                allowClear
                onChange={handleInputChange}
                prefix={
                  <Spin size="small" spinning={loading}>
                    <SA.StyledSearchIconWrapper>
                      {!loading && <SA.StyledSearchIcon />}
                    </SA.StyledSearchIconWrapper>
                  </Spin>
                }
              />
            </S.StyledAutoComplete>
          ) : (
            <S.SearchButton onClick={handleExpand}>
              <SearchSm />
            </S.SearchButton>
          )}
        </S.SearchWrapper>
      </S.SearchContainer>
    </>
  );
};
