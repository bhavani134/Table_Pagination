import React, { useState, useEffect } from "react";
import './comments.css'

const CommentsTable = () => {
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage] = useState(10);
  const [displayedPages, setDisplayedPages] = useState([]);

  useEffect(() => {
        fetchComments();
  }, []);
   
  const fetchComments = ()=>{
    fetch('https://jsonplaceholder.typicode.com/comments')
      .then(response => response.json())
      .then(data => setComments(data) )
  }

  useEffect(() => {
    const calculateDisplayedPages = () => {
      const totalPages = Math.ceil(comments.length / commentsPerPage);
      const maxDisplayedPages = 5; // Adjust the number of displayed pages as desired
      const halfDisplayedPages = Math.floor(maxDisplayedPages / 2);
      let startPage = currentPage - halfDisplayedPages;
      let endPage = currentPage + halfDisplayedPages;

      if (startPage <= 0) {
        startPage = 1;
        endPage = Math.min(maxDisplayedPages, totalPages);
      }

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxDisplayedPages + 1);
      }

      const pages = Array.from(
        { length: endPage - startPage + 1 },
        (_, index) => startPage + index
      );

      setDisplayedPages(pages);
    };

    calculateDisplayedPages();
  }, [currentPage, comments, commentsPerPage]);

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div>
      <table className="comments-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {currentComments.map((comment) => (
            <tr key={comment.id}>
              <td>{comment.id}</td>
              <td>{comment.name}</td>
              <td>{comment.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>
        {displayedPages.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageClick(pageNumber)}
            className={`pagination-button ${
              currentPage === pageNumber ? "active" : ""
            }`}
          >
            {pageNumber}
          </button>
        ))}
        <button
          onClick={goToNextPage}
          disabled={currentPage === Math.ceil(comments.length / commentsPerPage)}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CommentsTable;
