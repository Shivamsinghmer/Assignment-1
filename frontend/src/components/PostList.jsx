import React from 'react';
import '../components.css';

export default function PostList({ posts, onSelectPost, loading }) {
  if (loading) {
    return (
      <div className="post-grid">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="post-card skeleton" style={{ height: '200px' }} />
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="empty-state">
        <div className="glass-card">
          <div className="empty-icon">📭</div>
          <h3>No posts found</h3>
          <p>Try adjusting your filters or clear the cache to refresh</p>
        </div>
      </div>
    );
  }

  return (
    <div className="post-grid fade-in">
      {posts.map((post) => (
        <article
          key={post.id}
          className="post-card glass-card"
          onClick={() => onSelectPost(post.id)}
          role="button"
          tabIndex={0}
        >
          <div className="post-header">
            <span className="post-id">#{post.id}</span>
            <span className="post-user">User {post.userId}</span>
          </div>
          <h3 className="post-title">{post.title}</h3>
          <p className="post-body">{post.body.substring(0, 120)}...</p>
          <div className="post-footer">
            <span className="read-more">Read more →</span>
          </div>
        </article>
      ))}
    </div>
  );
}
