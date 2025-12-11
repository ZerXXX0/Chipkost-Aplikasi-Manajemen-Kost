import React from 'react';

const PageButton = ({ active, disabled, children, onClick, rounded }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={[
      'h-9 w-9 inline-flex items-center justify-center border rounded-md text-sm transition-colors',
      active ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
      disabled ? 'opacity-50 cursor-not-allowed' : '',
      rounded || ''
    ].join(' ')}
  >
    {children}
  </button>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-2 justify-center">
      <PageButton
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        rounded="rounded-md"
      >
        ‹
      </PageButton>
      {pages.map((p) => (
        <PageButton key={p} active={p === currentPage} onClick={() => onPageChange(p)}>
          {p}
        </PageButton>
      ))}
      <PageButton
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        rounded="rounded-md"
      >
        ›
      </PageButton>
    </div>
  );
};

export default Pagination;
