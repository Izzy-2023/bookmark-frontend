// index.js

// Import dependencies
import React, { useState, useEffect } from 'react';

// Define the URL for the backend API
const URL = process.env.REACT_APP_URL;

// Define the Landing component
const Landing = () => {
    // State variables for storing bookmarks, new bookmark title and URL,
    // editing bookmark ID, and updated bookmark title and URL
    const [bookmarks, setBookmarks] = useState([]);
    const [newBookmarkTitle, setNewBookmarkTitle] = useState('');
    const [newBookmarkUrl, setNewBookmarkUrl] = useState('');
    const [editingBookmarkId, setEditingBookmarkId] = useState(null);
    const [updatedBookmarkTitle, setUpdatedBookmarkTitle] = useState('');
    const [updatedBookmarkUrl, setUpdatedBookmarkUrl] = useState('');

    // Use useEffect to fetch bookmarks from the server 
    useEffect(() => {
        const fetchBookmarks = async () => {
            const response = await fetch(`${URL}/bookmark`);
            const data = await response.json();
            setBookmarks(data);
        };
        fetchBookmarks();
    }, []);

    // Function to add a new bookmark
    const handleAddBookmark = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${URL}/bookmark`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: newBookmarkTitle,
                    url: newBookmarkUrl,
                }),
            });
            const data = await response.json();
            setBookmarks([...bookmarks, data]);
            setNewBookmarkTitle('');
            setNewBookmarkUrl('');
        } catch (error) {
            console.error('Error adding bookmark:', error);
        }
    };

    // Function to delete a bookmark
    const handleDelete = async (id) => {
        try {
            await fetch(`${URL}/bookmark/${id}`, {
                method: 'DELETE',
            });
            setBookmarks(bookmarks.filter(bookmark => bookmark._id !== id));
        } catch (error) {
            console.error('Error deleting bookmark:', error);
        }
    };

    // Function to set up editing of a bookmark
    const handleEdit = (id) => {
        const bookmarkToEdit = bookmarks.find(bookmark => bookmark._id === id);
        setEditingBookmarkId(id);
        setUpdatedBookmarkTitle(bookmarkToEdit.title);
        setUpdatedBookmarkUrl(bookmarkToEdit.url);
    };

    // Function to update a bookmark
    const handleUpdate = async (id) => {
        try {
            await fetch(`${URL}/bookmark/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: updatedBookmarkTitle,
                    url: updatedBookmarkUrl,
                }),
            });
            setBookmarks(bookmarks.map(bookmark => {
                if (bookmark._id === id) {
                    return {
                        ...bookmark,
                        title: updatedBookmarkTitle,
                        url: updatedBookmarkUrl,
                    };
                }
                return bookmark;
            }));
            setEditingBookmarkId(null);
            setUpdatedBookmarkTitle('');
            setUpdatedBookmarkUrl('');
        } catch (error) {
            console.error('Error updating bookmark:', error);
        }
    };

    // Render the component
    return (
        <div className="form-container">
            {/* Display the heading */}
            <h1 style={{ fontFamily: 'Arial', fontSize: '2rem', fontWeight: 'bold', color: '#333', textShadow: '6px 6px 6px rgba(0, 0, 0, 0.6)' }}>Bookmark'd</h1>

            {/* Form for adding a new bookmark */}
            <form onSubmit={handleAddBookmark}>
                <input type='text' name='title' value={newBookmarkTitle} onChange={(e) => setNewBookmarkTitle(e.target.value)} placeholder="Bookmark title"/>
                <input type='text' name='url' value={newBookmarkUrl} onChange={(e) => setNewBookmarkUrl(e.target.value)} placeholder="Bookmark URL" />
                <input type='submit' value={'Add Bookmark'} />
            </form>

            {/* Display the list of bookmarks */}
            <h3>Your Bookmarks</h3>
            <div className="bookmark-card-list">
                {bookmarks.slice(0).reverse().map(bookmark => (
                    <div key={bookmark._id} className="bookmark-card">
                        {/* Check if bookmark is being edited */}
                        {editingBookmarkId === bookmark._id ? (
                            // If editing, display input fields for title and URL, and save button
                            <>
                                <input type='text' value={updatedBookmarkTitle} onChange={(e) => setUpdatedBookmarkTitle(e.target.value)} />
                                <input type='text' value={updatedBookmarkUrl} onChange={(e) => setUpdatedBookmarkUrl(e.target.value)} />
                                <button onClick={() => handleUpdate(bookmark._id)}>Save</button>
                            </>
                        ) : (
                            // If not editing, display bookmark title as button, and edit and delete buttons
                            <>
                                <button className="bookmark-button" onClick={() => window.open(bookmark.url, '_blank')}>
                                    <h2>{bookmark.title}</h2>
                                </button>
                                <div className="bookmark-actions">
                                    <button onClick={() => handleEdit(bookmark._id)}><i className="fas fa-pencil-alt"></i></button>
                                    <button onClick={() => handleDelete(bookmark._id)}><i className="fas fa-trash-alt"></i></button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// Export the Landing component
export default Landing;
