import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

// Base selectors
const selectItems = (state: RootState) => state.experiences?.items ?? [];
const selectFilterState = (state: RootState) => state.experiences?.filterState;
const selectSearchState = (state: RootState) => state.search;

export const selectAllExperiences = selectItems;
export const selectExperiencesLoading = (state: RootState) => state.experiences.loading;
export const selectExperiencesError = (state: RootState) => state.experiences.error;
export const selectLanguageFilter = (state: RootState) => state.experiences.filterState.languages;
export const selectCurrentPage = (state: RootState) => state.experiences.filterState.currentPage;
export const selectIsFallbackSearch = (state: RootState) => state.experiences.isFallbackSearch;
export const selectIsSearching = (state: RootState) => state.search.isSearching;
export const selectSearchQuery = (state: RootState) => state.search.query;
export const selectSearchType = (state: RootState) => state.search.searchType;

export const selectAvailableLanguages = createSelector(selectItems, (items) => {
  const seen = new Set<string>();
  items.forEach((exp) => (exp.languages ?? []).forEach((l) => seen.add(l)));
  return Array.from(seen).sort();
});

export const selectFilteredExperiences = createSelector(
  selectItems,
  selectFilterState,
  selectSearchState,
  (items, filterState, search) => {
    const { query, searchType, isSearching } = search ?? {
      query: '', searchType: 'experience', isSearching: false,
    };
    const languages = filterState?.languages ?? [];

    let result = [...items];

    if (isSearching && query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((exp) => {
        if (searchType === 'guide') {
          return exp.guide_name?.toLowerCase().includes(q) ?? false;
        }
        return (
          exp.title.toLowerCase().includes(q) ||
          exp.description.toLowerCase().includes(q)
        );
      });
    }

    if (languages.length > 0) {
      result = result.filter((exp) =>
        languages.some((lang) => (exp.languages ?? []).includes(lang))
      );
    }

    return result;
  }
);