import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSearch, clearSearch, type SearchType } from '../store/slices/searchSlice';
import { selectIsSearching, selectSearchQuery, selectSearchType, selectIsFallbackSearch, } from '../store/selectors/experienceSelectors';
import { fetchExperiencesBySearch } from '../store/slices/experiencesSlice';

export const useSearch = () => {
  const dispatch = useAppDispatch();

  const isSearching   = useAppSelector(selectIsSearching);
  const query         = useAppSelector(selectSearchQuery);
  const searchType    = useAppSelector(selectSearchType);
  const isFallbackSearch = useAppSelector(selectIsFallbackSearch);

  const handleSearch = (q: string, type: SearchType) => {
    dispatch(setSearch({ query: q, searchType: type }));
  };

  const handleClear = () => dispatch(clearSearch());

  const triggerFallbackIfEmpty = (clientResultCount: number) => {
    if (clientResultCount > 0 || isFallbackSearch) return;
    if (searchType === 'guide') {
      dispatch(fetchExperiencesBySearch({ guide_username: query }));
    } else {
      dispatch(fetchExperiencesBySearch({ title: query }));
    }
  };

  return { isSearching, query, searchType, isFallbackSearch, handleSearch, handleClear, triggerFallbackIfEmpty };
};