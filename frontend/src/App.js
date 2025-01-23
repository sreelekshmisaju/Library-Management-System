import React from "react";
import AddBook from "./components/AddBook";
import AddMember from "./components/AddMember";
import BorrowBook from "./components/BorrowBook";
import ReturnBook from "./components/ReturnBook";
import "./App.css";


function App() {
    return (
        <div className="app-container">
            <header>
                <h1>Library Management System</h1>
            </header>
            <main>
                <section className="section">
                    <AddBook />
                </section>
                <section className="section">
                    <AddMember />
                </section>
                <section className="section">
                    <BorrowBook />
                </section>
                <section className="section">
                    <ReturnBook />
                </section>
            </main>
            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} Library Management System</p>
            </footer>
        </div>
    );
}

export default App;
