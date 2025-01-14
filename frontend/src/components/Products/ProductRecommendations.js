import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Chip,
  Rating,
  Skeleton,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const ProductRecommendations = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, [user]);

  const fetchRecommendations = async () => {
    try {
      const response = await api.get('/recommendations/products');
      setRecommendations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{
          fontWeight: 600,
          textAlign: 'center',
          mb: 4,
        }}
      >
        Personalized for You
      </Typography>

      <Grid container spacing={3}>
        {loading
          ? Array.from(new Array(4)).map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card>
                  <Skeleton
                    variant="rectangular"
                    height={200}
                    animation="wave"
                  />
                  <CardContent>
                    <Skeleton height={24} width="80%" />
                    <Skeleton height={20} width="60%" />
                    <Skeleton height={20} width="40%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : recommendations.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product._id}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[4],
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.images[0]?.url}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        noWrap
                      >
                        {product.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {product.brand}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Rating
                          value={product.rating}
                          precision={0.5}
                          size="small"
                          readOnly
                        />
                        <Typography variant="body2" color="text.secondary">
                          ({product.reviews?.length || 0})
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 0.5,
                          flexWrap: 'wrap',
                          mt: 1,
                        }}
                      >
                        {product.features.slice(0, 2).map((feature, index) => (
                          <Chip
                            key={index}
                            label={feature}
                            size="small"
                            sx={{
                              bgcolor: theme.palette.primary.light,
                              color: theme.palette.primary.contrastText,
                            }}
                          />
                        ))}
                      </Box>
                      <Typography
                        variant="h6"
                        color="primary"
                        sx={{ mt: 2 }}
                      >
                        ${product.price.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
      </Grid>
    </Container>
  );
};

export default ProductRecommendations;
