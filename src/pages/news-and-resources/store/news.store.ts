import { useContext } from 'react';

import { NewsDetailsStoreContext } from '../providers/news-details.provider';
import { NewsStoreContext } from '../providers/news.provider';

export const useNewsStore = () => useContext(NewsStoreContext);

export const useNewsDetailsStore = () => useContext(NewsDetailsStoreContext);
