import React from 'react';
import '../components.css';

export default function PostDetail({ post, loading, onBack }) {
  if (loading) {
    return (
      <div className="post-detail-container">
        <div className="glass-card">
          <div className="skeleton" style={{ height: '30px', width: '100px', marginBottom: '2rem' }} />
          <div className="skeleton" style={{ height: '40px', marginBottom: '1rem' }} />
          <div className="skeleton" style={{ height: '20px', width: '60%', marginBottom: '2rem' }} />
          <div className="skeleton" style={{ height: '200px' }} />
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="post-detail-container fade-in">
      <button className="btn btn-secondary back-btn" onClick={onBack}>
        ← Back to Posts
      </button>

      <article className="glass-card post-detail">
        <div className="post-meta">
          <span className="post-id">Post #{post.id}</span>
          <span className="post-user-badge">User {post.userId}</span>
        </div>

        <h1 className="post-title">{post.title}</h1>

        {post.author && (
          <div className="author-info">
            <div className="author-avatar">
              {post.author.name.charAt(0).toUpperCase()}
            </div>
            <div className="author-details">
              <div className="author-name">{post.author.name}</div>
              <div className="author-email">{post.author.email}</div>
              {post.author.username && (
                <div className="author-username">@{post.author.username}</div>
              )}
            </div>
          </div>
        )}

        <div className="post-content">
          <p>{post.body}</p>
        </div>
      </article>
    </div>
  );
}
