import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import {
  Eco,
  RecyclingRounded,
  Science,
  LocalFlorist,
  WaterDrop,
  EnergySavingsLeaf,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const SustainabilitySection = () => {
  const theme = useTheme();

  const initiatives = [
    {
      title: 'Eco-Friendly Packaging',
      description: 'All our packaging is made from recycled materials and is 100% recyclable.',
      icon: <RecyclingRounded />,
      image: '/images/eco-packaging.jpg',
    },
    {
      title: 'Cruelty-Free Testing',
      description: 'We never test on animals and work only with cruelty-free suppliers.',
      icon: <Science />,
      image: '/images/cruelty-free.jpg',
    },
    {
      title: 'Natural Ingredients',
      description: 'We use responsibly sourced, natural ingredients in our products.',
      icon: <LocalFlorist />,
      image: '/images/natural-ingredients.jpg',
    },
    {
      title: 'Water Conservation',
      description: 'Our manufacturing process is designed to minimize water usage.',
      icon: <WaterDrop />,
      image: '/images/water-conservation.jpg',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            component="h1"
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 600,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Our Commitment to Sustainability
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: 'auto' }}
          >
            We believe in creating beautiful products that are good for you and
            kind to our planet. Discover our sustainable practices and
            eco-friendly initiatives.
          </Typography>
        </Box>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={4}>
            {initiatives.map((initiative, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2,
                      overflow: 'hidden',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="240"
                      image={initiative.image}
                      alt={initiative.title}
                    />
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            bgcolor: theme.palette.primary.light,
                            borderRadius: '50%',
                            p: 1,
                            color: theme.palette.primary.contrastText,
                          }}
                        >
                          {initiative.icon}
                        </Box>
                        <Typography variant="h5" component="h2">
                          {initiative.title}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        paragraph
                      >
                        {initiative.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Our Environmental Impact
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  2023 Achievements
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <EnergySavingsLeaf color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="50% Reduction in Carbon Footprint"
                      secondary="Compared to 2022"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <RecyclingRounded color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="100% Recyclable Packaging"
                      secondary="Implemented across all product lines"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <WaterDrop color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="30% Water Usage Reduction"
                      secondary="In our manufacturing process"
                    />
                  </ListItem>
                </List>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  2024 Goals
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Eco color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="75% Renewable Energy"
                      secondary="In all our facilities"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocalFlorist color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="90% Natural Ingredients"
                      secondary="Across our product range"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Science color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Zero Waste Production"
                      secondary="Implementation in progress"
                    />
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Eco />}
            sx={{
              borderRadius: 30,
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
            }}
          >
            Learn More About Our Initiatives
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default SustainabilitySection;
