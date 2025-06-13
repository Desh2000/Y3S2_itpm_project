import React, { useState } from 'react';
import { Card, Form, Button, InputGroup, Dropdown } from 'react-bootstrap';
import { FaThumbsUp, FaComment, FaShare, FaRegThumbsUp, FaPaperPlane, FaUser, FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';

const Post = ({ post, onLike, onAddComment, onEdit, onDelete }) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
      if (onLike) {
        onLike();
      }
    }
    setLiked(!liked);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim() === '') return;
    
    setLoading(true);
    try {
      if (onAddComment) {
        const addedComment = await onAddComment(newComment);
        
        if (addedComment) {
          setComments([...comments, addedComment]);
        } else {
          const comment = {
            id: comments.length + 1,
            author: 'Current User',
            text: newComment,
            formattedTimestamp: 'Just now'
          };
          setComments([...comments, comment]);
        }
      } else {
        const comment = {
          id: comments.length + 1,
          author: 'Current User',
          text: newComment,
          formattedTimestamp: 'Just now'
        };
        setComments([...comments, comment]);
      }
      
      setNewComment('');
    } finally {
      setLoading(false);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleEditCancel = () => {
    setEditMode(false);
    setEditedContent(post.content);
  };

  const handleEditSave = () => {
    if (editedContent.trim() === '') return;
    
    if (onEdit) {
      onEdit(post.id, editedContent);
    }
    
    setEditMode(false);
  };

  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      if (onDelete) {
        onDelete(post.id);
      }
    }
  };

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Button
      ref={ref}
      variant="link"
      className="text-dark p-0 d-flex align-items-center"
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <FaEllipsisV />
      {children}
    </Button>
  ));

  return (
    <Card className="post-card mb-4">
      <Card.Header className="post-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <img 
            src={post.authorAvatar || "https://cdn-icons-png.flaticon.com/128/3135/3135715.png"} 
            alt={post.authorName} 
            className="post-avatar" 
          />
          <div className="post-info">
            <h5 className="post-author">{post.authorName}</h5>
            <p className="post-time">{formatDate(post.startDate)}</p>
          </div>
        </div>
        
        <Dropdown>
          <Dropdown.Toggle as={CustomToggle} id={`dropdown-post-${post.id}`} />
          <Dropdown.Menu align="end" className="shadow-sm">
            <Dropdown.Item onClick={handleEditClick}>
              <FaEdit className="me-2" /> Edit
            </Dropdown.Item>
            <Dropdown.Item onClick={handleDeleteClick} className="text-danger">
              <FaTrash className="me-2" /> Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Card.Header>
      
      <Card.Body className="post-content p-3 p-md-4">
        {editMode ? (
          <div className="edit-mode mb-3">
            <Form.Control
              as="textarea"
              rows={4}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="mb-2"
            />
            <div className="d-flex justify-content-end">
              <Button variant="outline-secondary" size="sm" onClick={handleEditCancel} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleEditSave}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          post.mediaType === 'text' ? (
            <div 
              className="text-post p-4 rounded mb-3 d-flex align-items-center justify-content-center"
              style={{ 
                backgroundColor: post.backgroundColor || '#1877F2',
                minHeight: '150px'
              }}
            >
              <Card.Text className="post-text mb-0 text-white text-center fs-5 fw-bold">
                {post.content}
              </Card.Text>
            </div>
          ) : (
            <Card.Text className="post-text mb-3">{post.content}</Card.Text>
          )
        )}
        
        {post.image && !editMode && post.mediaType !== 'text' && (
          <div className="post-image-container">
            <img 
              src={post.image.startsWith('data:') ? post.image : `data:image/jpeg;base64,${post.image}`} 
              alt="Post attachment" 
              className="post-image img-fluid rounded mb-2" 
            />
          </div>
        )}
      </Card.Body>
      
      <Card.Footer className="p-0">
        <div className="d-flex justify-content-between px-2 py-1">
          <div>
            <span className="me-2">
              <FaThumbsUp className="text-primary" /> <span className="likes-count">{likes}</span>
            </span>
            {comments.length > 0 && (
              <span className="text-muted comments-count">{comments.length} comments</span>
            )}
          </div>
        </div>
        
        <div className="post-actions border-top border-bottom">
          <button 
            className="action-btn" 
            onClick={handleLike}
            style={{ color: liked ? '#1877f2' : '#65676b' }}
          >
            {liked ? <FaThumbsUp className="action-icon" /> : <FaRegThumbsUp className="action-icon" />}
            <span className="action-text">Like</span>
          </button>
          <button className="action-btn" onClick={toggleComments}>
            <FaComment className="action-icon" /> 
            <span className="action-text">Comment</span>
          </button>
          <button className="action-btn d-none d-sm-flex">
            <FaShare className="action-icon" /> 
            <span className="action-text">Share</span>
          </button>
        </div>
        
        {showComments && (
          <div className="comments-section p-2 p-sm-3">
            {comments.length > 0 ? (
              <div className="comments-list mb-3">
                {comments.map(comment => (
                  <div key={comment.id} className="comment mb-2">
                    <div className="d-flex">
                      <div className="comment-avatar me-2">
                        <img 
                          src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png" 
                          alt={comment.author} 
                          className="rounded-circle" 
                        />
                      </div>
                      <div className="comment-content p-2 rounded bg-light flex-grow-1">
                        <div className="comment-author fw-bold">{comment.author}</div>
                        <div className="comment-text">{comment.text}</div>
                        <div className="comment-timestamp text-muted small">{comment.formattedTimestamp}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-comments text-center text-muted mb-3">
                No comments yet. Be the first to comment!
              </div>
            )}
            
            <Form onSubmit={handleAddComment}>
              <InputGroup className="comment-form">
                <Form.Control
                  type="text"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="comment-input"
                  disabled={loading}
                />
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={newComment.trim() === '' || loading}
                  className="comment-submit-btn"
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    <FaPaperPlane />
                  )}
                </Button>
              </InputGroup>
            </Form>
          </div>
        )}
      </Card.Footer>
    </Card>
  );
};

export default Post; 