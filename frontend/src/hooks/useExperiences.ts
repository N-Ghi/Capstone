import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchExperiences, setPage } from '../store/slices/experiencesSlice';
import { selectAllExperiences, selectExperiencesLoading, selectExperiencesError,
  selectCurrentPage, selectAvailableLanguages, } from '../store/selectors/experienceSelectors';

export const useExperiences = () => {
  const dispatch = useAppDispatch();

  const experiences = useAppSelector(selectAllExperiences);
  const loading = useAppSelector(selectExperiencesLoading);
  const error = useAppSelector(selectExperiencesError);
  const currentPage = useAppSelector(selectCurrentPage);
  const availableLanguages = useAppSelector(selectAvailableLanguages);

  // Fetch once on mount — subsequent filters are client-side
  useEffect(() => {
    if (experiences.length === 0) {
      dispatch(fetchExperiences({ ordering: '-created_at' }));
    }
  }, [dispatch, experiences.length]);

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    experiences,
    loading,
    error,
    currentPage,
    availableLanguages,
    handlePageChange,
  };
};