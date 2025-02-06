import { useState } from 'react';

// src/hooks/usePagination.js
const usePagination = (items, pageLimit, currentPage) => {
  const pageCount = Math.ceil(items.length / pageLimit);

  const pageData = () => {
    const start = currentPage * pageLimit;
    const end = start + pageLimit;
    return items.slice(start, end); // Возвращаем массив
  };

  return { 
    pageData: pageData(), // Возвращаем результат вызова функции
    pageCount 
  };
};

export default usePagination;