const API_URL = 'http://localhost:3000/api';

async function createPost() {
    const content = document.getElementById('postContent').value;
    const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content,
            userId: 1 // In a real app, this would come from authentication
        })
    });
    document.getElementById('postContent').value = '';
    loadPosts();
}

async function likePost(postId) {
    await fetch(`${API_URL}/posts/${postId}/like`, {
        method: 'POST'
    });
    loadPosts();
}

async function loadPosts() {
    const response = await fetch(`${API_URL}/posts`);
    const posts = await response.json();
    
    const container = document.getElementById('postsContainer');
    container.innerHTML = '';
    
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <p>${post.content}</p>
            <small>By: ${post.User.username}</small>
            <div>
                <button onclick="likePost(${post.id})">Like (${post.likes})</button>
            </div>
        `;
        container.appendChild(postElement);
    });
}

// Initial load
loadPosts();