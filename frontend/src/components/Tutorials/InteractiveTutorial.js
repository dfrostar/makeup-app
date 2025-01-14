import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Card,
  CardMedia,
  useTheme,
} from '@mui/material';
import {
  PlayCircleOutline,
  PauseCircleOutline,
  NavigateNext,
  NavigateBefore,
} from '@mui/icons-material';

const InteractiveTutorial = ({ tutorial }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 600,
          textAlign: 'center',
          mb: 4,
        }}
      >
        {tutorial.title}
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card sx={{ position: 'relative' }}>
            <CardMedia
              component="video"
              height="500"
              src={tutorial.videoUrl}
              controls={isPlaying}
              sx={{ objectFit: 'cover' }}
            />
            {!isPlaying && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0,0,0,0.3)',
                }}
              >
                <IconButton
                  onClick={togglePlay}
                  sx={{
                    color: 'white',
                    '& svg': { fontSize: 64 },
                  }}
                >
                  <PlayCircleOutline />
                </IconButton>
              </Box>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {tutorial.steps.map((step, index) => (
                <Step key={index}>
                  <StepLabel>{step.title}</StepLabel>
                  <StepContent>
                    <Typography>{step.description}</Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Products Used:
                      </Typography>
                      <List>
                        {step.products.map((product, idx) => (
                          <ListItem key={idx} alignItems="flex-start">
                            <ListItemAvatar>
                              <Avatar
                                alt={product.name}
                                src={product.image}
                                variant="rounded"
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={product.name}
                              secondary={product.usage}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                    <Box sx={{ mb: 2, mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mr: 1 }}
                        disabled={index === tutorial.steps.length - 1}
                        endIcon={<NavigateNext />}
                      >
                        Next Step
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                        startIcon={<NavigateBefore />}
                      >
                        Back
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Tips & Notes
        </Typography>
        <List>
          {tutorial.tips.map((tip, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={tip.title}
                secondary={tip.description}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default InteractiveTutorial;
