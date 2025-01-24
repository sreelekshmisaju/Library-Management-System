from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://mongo:27017/library_management"
mongo = PyMongo(app)
CORS(app)  # Enable CORS for all routes


# Helper function to convert ObjectId to string
def convert_objectid(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, dict):
        return {key: convert_objectid(value) for key, value in obj.items()}
    if isinstance(obj, list):
        return [convert_objectid(item) for item in obj]
    return obj


# Route to add a new book
@app.route("/books", methods=["POST"])
def add_book():
    data = request.json
    if "title" not in data or "author" not in data or "total_count" not in data:
        return jsonify({"error": "Missing required fields."}), 400
    
    if data.get("total_count", 0) < 1:
        return jsonify({"error": "Total count must be greater than zero."}), 400

    book = {
        "title": data["title"],
        "author": data["author"],
        "total_count": data["total_count"],
        "available_count": data.get("available_count", data["total_count"]),
        "deleted": False  # New field to track deleted books
    }
    book_id = mongo.db.books.insert_one(book).inserted_id
    return jsonify({"_id": str(book_id), **convert_objectid(book)})

# Route to add a new member
@app.route("/members", methods=["POST"])
def add_member():
    data = request.json
    if "name" not in data or "membership_id" not in data:
        return jsonify({"error": "Missing required fields."}), 400
    
    member = {
        "name": data["name"],
        "membership_id": data["membership_id"],
        "deleted": False  # New field to track deleted members
    }
    membership_id = mongo.db.members.insert_one(member).inserted_id
    return jsonify({"_id": str(membership_id), **convert_objectid(member)})

# Route to borrow a book
@app.route("/borrow-book", methods=["POST"])
def borrow_book():
    data = request.json
    title = data.get("title")
    membership_id = data.get("membership_id")

    # Check if the required fields are present
    if not title or not membership_id:
        return jsonify({"error": "Missing book title or membership ID."}), 400

    print(f"Attempting to borrow book with title: {title} and membership_id: {membership_id}")

    # Find the book that matches the title and is not deleted
    book = mongo.db.books.find_one({"title": title, "deleted": False})
    if not book:
        return jsonify({"error": "Book not found or deleted."}), 404
    if book["available_count"] <= 0:
        return jsonify({"error": "Book is out of stock."}), 400

    # Find the member by matching the membership_id and ensuring the member is not deleted
    member = mongo.db.members.find_one({"membership_id": membership_id, "deleted": False})
    if not member:
        return jsonify({"error": "Member not found or deleted."}), 404

    # Update the available count of the book
    mongo.db.books.update_one(
        {"_id": book["_id"]}, {"$inc": {"available_count": -1}}
    )

    # Return the updated book data
    updated_book = mongo.db.books.find_one({"_id": book["_id"]})
    return jsonify({
        "message": "Book borrowed successfully.",
        "available_count": updated_book["available_count"]
    })

# Route to return a book
@app.route("/return-book", methods=["POST"])
def return_book():
    data = request.json
    title = data.get("title")
    membership_id = data.get("membership_id")

    # Check if the required fields are present
    if not title or not membership_id:
        return jsonify({"error": "Missing book title or membership ID."}), 400

    print(f"Attempting to return book with title: {title} and membership_id: {membership_id}")

    # Find the book that matches the title and is not deleted
    book = mongo.db.books.find_one({"title": title, "deleted": False})
    if not book:
        return jsonify({"error": "Book not found or deleted."}), 404

    # Find the member by matching the membership_id and ensuring the member is not deleted
    member = mongo.db.members.find_one({"membership_id": membership_id, "deleted": False})
    if not member:
        return jsonify({"error": "Member not found or deleted."}), 404

    # Update the available count of the book
    mongo.db.books.update_one(
        {"_id": book["_id"]}, {"$inc": {"available_count": 1}}
    )
    return jsonify({"message": "Book returned successfully."})

# Route to get all books
@app.route("/books", methods=["GET"])
def get_books():
    books = mongo.db.books.find({"deleted": False})
    return jsonify([convert_objectid(book) for book in books])

# Route to get all members
@app.route("/members", methods=["GET"])
def get_members():
    members = mongo.db.members.find({"deleted": False})
    return jsonify([convert_objectid(member) for member in members])

# Route to delete a book
@app.route("/delete-book/<book_id>", methods=["DELETE"])
def delete_book(book_id):
    book = mongo.db.books.find_one({"_id": ObjectId(book_id), "deleted": False})
    if not book:
        return jsonify({"error": "Book not found or already deleted."}), 404
    
    mongo.db.books.update_one(
        {"_id": ObjectId(book_id)}, {"$set": {"deleted": True}}
    )
    return jsonify({"message": "Book deleted successfully."})

# Route to delete a member
@app.route("/delete-member/<membership_id>", methods=["DELETE"])
def delete_member(membership_id):
    member = mongo.db.members.find_one({"membership_id": membership_id, "deleted": False})
    if not member:
        return jsonify({"error": "Member not found or already deleted."}), 404
    
    mongo.db.members.update_one(
        {"membership_id": membership_id}, {"$set": {"deleted": True}}
    )
    return jsonify({"message": "Member deleted successfully."})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)
