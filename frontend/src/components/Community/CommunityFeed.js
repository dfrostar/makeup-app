import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  useTheme,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Comment,
  Share,
  BookmarkBorder,
  Bookmark,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const CommunityFeed = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentDialog, setCommentDialog] = useState({
    open: false,
    postId: null,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/social/feed');
      setPosts(response.data.feed);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await api.post(`/social/posts/${postId}/like`);
      fetchPosts(); // Refresh posts to get updated like count
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = (postId) => {
    setCommentDialog({
      open: true,
      postId,
    });
  };

  const handleShare = async (postId) => {
    try {
      await api.post(`/social/posts/${postId}/share`);
      // Show success message
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const handleSave = async (postId) => {
    try {
      await api.post(`/social/posts/${postId}/save`);
      fetchPosts(); // Refresh posts to get updated save status
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const submitComment = async (postId, comment) => {
    try {
      await api.post(`/social/posts/${postId}/comments`, { content: comment });
      setCommentDialog({ open: false, postId: null });
      fetchPosts(); // Refresh posts to show new comment
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Community Feed
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Get inspired by looks from our community
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post._id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s',
                  },
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      src={post.creator.profileImage}
                      alt={post.creator.username}
                    />
                  }
                  title={post.creator.username}
                  subheader={new Date(post.createdAt).toLocaleDateString()}
                />
                <CardMedia
                  component="img"
                  height="300"
                  image={post.image.url}
                  alt={post.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    paragraph
                  >
                    {post.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {post.products.map((product) => (
                      <Chip
                        key={product._id}
                        label={product.name}
                        size="small"
                        onClick={() => window.location.href = `/products/${product._id}`}
                        sx={{
                          bgcolor: theme.palette.primary.light,
                          color: theme.palette.primary.contrastText,
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton
                    onClick={() => handleLike(post._id)}
                    color={post.likes.includes(user?._id) ? 'primary' : 'default'}
                  >
                    {post.likes.includes(user?._id) ? (
                      <Favorite />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </IconButton>
                  <IconButton onClick={() => handleComment(post._id)}>
                    <Comment />
                  </IconButton>
                  <IconButton onClick={() => handleShare(post._id)}>
                    <Share />
                  </IconButton>
                  <Box sx={{ flexGrow: 1 }} />
                  <IconButton
                    onClick={() => handleSave(post._id)}
                    color={post.saved ? 'primary' : 'default'}
                  >
                    {post.saved ? <Bookmark /> : <BookmarkBorder />}
                  </IconButton>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={commentDialog.open}
        onClose={() => setCommentDialog({ open: false, postId: null })}
      >
        <DialogTitle>Add a Comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Your comment"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={() =>
                submitComment(commentDialog.postId, 'Sample comment')
              }
              variant="contained"
            >
              Post Comment
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default CommunityFeed;
