import React, { useState, useEffect } from "react";
import "./AddBook.css";



function AddBook() {
    const [book, setBook] = useState({
        title: "",
        author: "",
        total_count: "",
    });
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5002/books");
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            console.error("Failed to fetch books:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBook = async () => {
        if (!book.title || !book.author || !book.total_count) {
            alert("All fields are required!");
            return;
        }
        try {
            const response = await fetch("http://localhost:5002/books", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: book.title,
                    author: book.author,
                    total_count: parseInt(book.total_count),
                    available_count: parseInt(book.total_count),
                }),
            });
            if (response.ok) {
                alert("Book added successfully!");
                setBook({ title: "", author: "", total_count: "" });
                fetchBooks();
            } else {
                const error = await response.json();
                alert(`Error: ${error.detail}`);
            }
        } catch (error) {
            alert("Failed to add book: " + error.message);
        }
    };

    const handleDeleteBook = async (bookId) => {
        try {
            const response = await fetch(`http://localhost:5002/delete-book/${bookId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                alert("Book deleted successfully!");
                fetchBooks();
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            alert("Failed to delete book: " + error.message);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    return (
        <div className="add-book-container">
            <h2>Add Book</h2>
            <input
                type="text"
                placeholder="Title"
                value={book.title}
                onChange={(e) => setBook({ ...book, title: e.target.value })}
            />
            <input
                type="text"
                placeholder="Author"
                value={book.author}
                onChange={(e) => setBook({ ...book, author: e.target.value })}
            />
            <input
                type="number"
                placeholder="Total Count"
                value={book.total_count}
                onChange={(e) => setBook({ ...book, total_count: e.target.value })}
            />
            <button onClick={handleAddBook}>Add Book</button>

            <h3>Books List</h3>
            {loading ? (
                <p>Loading books...</p>
            ) : (
                <table className="books-list">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Total Count</th>
                            <th>Available Count</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book._id}>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.total_count}</td>
                                <td>{book.available_count}</td>
                                <td>
                                    {!book.deleted ? (
                                        <button onClick={() => handleDeleteBook(book._id)}>
                                            Delete
                                        </button>
                                    ) : (
                                        <span> (Deleted)</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AddBook;



