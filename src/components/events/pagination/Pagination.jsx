const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination">
      <button onClick={() => onPageChange(Math.max(currentPage - 1, 0))} disabled={currentPage === 0}>
        Назад
      </button>
      <span>{currentPage + 1} из {totalPages}</span>
      <button onClick={() => onPageChange(Math.min(currentPage + 1, totalPages - 1))} disabled={currentPage === totalPages - 1}>
        Вперед
      </button>
    </div>
  );
};

export default Pagination;