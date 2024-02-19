// index.js

import React, { useState } from 'react';

import { Link, useLoaderData, Form } from "react-router-dom";



const Landing = () => {
    const [bookmarks, setBookmarks] = useState(useLoaderData());
    const [editingBookmarkId, setEditingBookmarkId] = useState(null);
    const [updatedBookmarkTitle, setUpdatedBookmarkTitle] = useState('');
    const [updatedBookmarkUrl, setUpdatedBookmarkUrl] = useState('');

    const handleUpdate = async (id) => {
        try {
            // Update the bookmark with the new title and URL
            await fetch(`/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: updatedBookmarkTitle,
                    url: updatedBookmarkUrl,
                }),
            });
            // Update the state with the updated bookmark
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
            // Clear the editing state
            setEditingBookmarkId(null);
            setUpdatedBookmarkTitle('');
            setUpdatedBookmarkUrl('');
        } catch (error) {
            console.error('Error updating bookmark:', error);
        }
    };
    
    const handleDelete = async (id) => {
        try {
            await fetch(`/${id}`, {
                method: 'DELETE', // Use DELETE method
            });
    
            // Update the state with the deleted bookmark removed
            setBookmarks(bookmarks.filter(bookmark => bookmark._id !== id));
        } catch (error) {
            console.error('Error deleting bookmark:', error);
        }
    };
    
    
    

    return (
        <div>
            <h3>Create a bookmark</h3>
            <Form action='/create' method='post'>
                <input type='input' name='title' placeholder="Bookmark title"/>
                <input type='input' name='url' placeholder="Bookmark URL" />
                <input type='submit' value={'Create Bookmark'} />
            </Form>

            <h3>Bookmarks</h3>
            <div className="bookmark-card-list">
                {bookmarks.map(bookmark => (
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
                                    <p>{bookmark.description}</p>
                                </button>
                                <div className="bookmark-actions">
                                    <button onClick={() => {setEditingBookmarkId(bookmark._id); setUpdatedBookmarkTitle(bookmark.title); setUpdatedBookmarkUrl(bookmark.url);}}><i className="fas fa-pencil-alt"></i></button>
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

