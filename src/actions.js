// actions.js

import { redirect } from "react-router-dom";

const URL = process.env.REACT_APP_URL;

export const updateAction = async ({ request, params }) => {
    const formData = await request.formData();
    const updatedBookmark = {
        title: formData.get('title'),
        url: formData.get('url'),
    };

    const url = new URL(`${URL}/bookmark/${params.id}`);
    await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedBookmark)
    });

    return redirect('/');
};


export const createAction = async ({ request }) => {
    const formData = await request.formData();
    const createdBookmark = {
        title: formData.get('title'),
        url: formData.get('url'),
    };

    await fetch(`${URL}/bookmark`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(createdBookmark)
    });

    return redirect('/');
};

export const deleteAction = async ({ params }) => {
    await fetch(`${URL}/bookmark/${params.id}`, {
        method: 'delete'
    });

    return redirect('/');
};

