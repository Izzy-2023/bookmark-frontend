// index.js

import React, { useState, useEffect } from 'react';

const URL = process.env.REACT_APP_URL;

const Landing = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [newBookmarkTitle, setNewBookmarkTitle] = useState('');
    const [newBookmarkUrl, setNewBookmarkUrl] = useState('');
    const [editingBookmarkId, setEditingBookmarkId] = useState(null);
    const [updatedBookmarkTitle, setUpdatedBookmarkTitle] = useState('');
    const [updatedBookmarkUrl, setUpdatedBookmarkUrl] = useState('');

    useEffect(() => {
        const fetchBookmarks = async () => {
            const response = await fetch(`${URL}/bookmark`);
            const data = await response.json();
            setBookmarks(data);
        };
        fetchBookmarks();
    }, []);

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

    const handleEdit = (id) => {
        const bookmarkToEdit = bookmarks.find(bookmark => bookmark._id === id);
        setEditingBookmarkId(id);
        setUpdatedBookmarkTitle(bookmarkToEdit.title);
        setUpdatedBookmarkUrl(bookmarkToEdit.url);
    };

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

    return (
        <div className="form-container">
            <h1 style={{ fontFamily: 'Arial', fontSize: '2rem', fontWeight: 'bold', color: '#333', textShadow: '6px 6px 6px rgba(0, 0, 0, 0.6)' }}>Bookmark'd</h1>

            <form onSubmit={handleAddBookmark}>
                <input type='text' name='title' value={newBookmarkTitle} onChange={(e) => setNewBookmarkTitle(e.target.value)} placeholder="Bookmark title"/>
                <input type='text' name='url' value={newBookmarkUrl} onChange={(e) => setNewBookmarkUrl(e.target.value)} placeholder="Bookmark URL" />
                <input type='submit' value={'Add Bookmark'} />
            </form>

            <h3>Your Bookmarks</h3>
            <div className="bookmark-card-list">
                {bookmarks.slice(0).reverse().map(bookmark => (
                    <div key={bookmark._id} className="bookmark-card">
                        {editingBookmarkId === bookmark._id ? (
                            <>
                                <input type='text' value={updatedBookmarkTitle} onChange={(e) => setUpdatedBookmarkTitle(e.target.value)} />
                                <input type='text' value={updatedBookmarkUrl} onChange={(e) => setUpdatedBookmarkUrl(e.target.value)} />
                                <button onClick={() => handleUpdate(bookmark._id)}>Save</button>
                            </>
                        ) : (
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

export default Landing;

