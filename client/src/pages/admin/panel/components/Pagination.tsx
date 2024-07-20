import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalTrains: number;
  trainsPerPage: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalTrains, trainsPerPage, setCurrentPage }) => {
  if (totalTrains === 0) return null;

  const totalPages = Math.ceil(totalTrains / trainsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getPaginationNumbers = () => {
    const paginationRange: (number | string)[] = [];
    const delta = 2; // Number of pages to show around the current page

    const range = {
      start: Math.max(2, currentPage - delta),
      end: Math.min(totalPages - 1, currentPage + delta),
    };

    // Add first page
    if (range.start > 2) {
      paginationRange.push(1);
      if (range.start > 3) paginationRange.push('...');
    } else {
      for (let i = 1; i < range.start; i++) {
        paginationRange.push(i);
      }
    }

    // Add pages in range
    for (let i = range.start; i <= range.end; i++) {
      paginationRange.push(i);
    }

    // Add last page
    if (range.end < totalPages - 1) {
      if (range.end < totalPages - 2) paginationRange.push('...');
      paginationRange.push(totalPages);
    } else {
      for (let i = range.end + 1; i <= totalPages; i++) {
        paginationRange.push(i);
      }
    }

    return paginationRange;
  };

  return (
    <div className='pagination'>
      {getPaginationNumbers().map((page, index) =>
        page === '...' ? (
          <span key={index}>...</span>
        ) : (
          <button
            key={index}
            onClick={() => handlePageChange(Number(page))}
            className={currentPage === page ? 'active' : ''}
          >
            {page}
          </button>
        )
      )}
    </div>
  );
};

export default Pagination;
