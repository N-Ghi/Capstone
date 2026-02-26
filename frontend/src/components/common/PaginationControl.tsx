import React from 'react';
import styles from './PaginationControl.module.css';

interface PaginationControlProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export const PaginationControl: React.FC<PaginationControlProps> = ({
  currentPage, totalItems, itemsPerPage, onPageChange, itemLabel = 'items',
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const getPaginationItems = (): (number | string)[] => {
    const items: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else if (currentPage <= 3) {
      items.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      items.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      items.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }

    return items;
  };

  const from = (currentPage - 1) * itemsPerPage + 1;
  const to = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.paginationInfo}>
        Showing {from}–{to} of {totalItems} {itemLabel}
      </div>

      <nav className={styles.paginationNav}>
        <button
          className={styles.paginationButton}
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          First
        </button>
        <button
          className={styles.paginationButton}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {getPaginationItems().map((item, idx) =>
          item === '...' ? (
            <span key={`ellipsis-${idx}`} className={styles.ellipsis}>…</span>
          ) : (
            <button
              key={item}
              className={`${styles.paginationItem}${item === currentPage ? ` ${styles.paginationItemActive}` : ''}`}
              onClick={() => onPageChange(item as number)}
              disabled={item === currentPage}
            >
              {item}
            </button>
          )
        )}

        <button
          className={styles.paginationButton}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <button
          className={styles.paginationButton}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </nav>
    </div>
  );
};

export default PaginationControl;