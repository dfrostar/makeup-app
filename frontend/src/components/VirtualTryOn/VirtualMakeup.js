import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Slider,
  IconButton,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  CameraAlt,
  FileUpload,
  Undo,
  Save,
  Share,
} from '@mui/icons-material';
import * as faceapi from 'face-api.js';

const VirtualMakeup = () => {
  const theme = useTheme();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [intensity, setIntensity] = useState(50);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      ]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsCameraActive(true);
      detectFace();
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopVideo = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const detectFace = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      if (!isCameraActive) return;

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      
      if (selectedProduct && resizedDetections.length > 0) {
        applyVirtualMakeup(canvas, resizedDetections[0].landmarks);
      }
    }, 100);
  };

  const applyVirtualMakeup = (canvas, landmarks) => {
    const ctx = canvas.getContext('2d');
    const opacity = intensity / 100;

    switch (selectedProduct.type) {
      case 'lipstick':
        applyLipstick(ctx, landmarks.getMouth(), opacity);
        break;
      case 'eyeshadow':
        applyEyeshadow(ctx, landmarks.getLeftEye(), landmarks.getRightEye(), opacity);
        break;
      case 'blush':
        applyBlush(ctx, landmarks.getJawOutline(), opacity);
        break;
      default:
        break;
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          canvas.width = img.width;
          canvas.height = img.height;
          canvas.getContext('2d').drawImage(img, 0, 0);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'virtual-makeup.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={3}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 2,
              bgcolor: 'background.default',
            }}
          >
            {isLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 400,
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: isCameraActive ? 'block' : 'none',
                  }}
                />
                <canvas
                  ref={canvasRef}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                />
              </>
            )}
          </Paper>
          <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<CameraAlt />}
              onClick={isCameraActive ? stopVideo : startVideo}
            >
              {isCameraActive ? 'Stop Camera' : 'Start Camera'}
            </Button>
            <Button
              variant="outlined"
              component="label"
              startIcon={<FileUpload />}
            >
              Upload Photo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileUpload}
              />
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Makeup Controls
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Intensity</Typography>
              <Slider
                value={intensity}
                onChange={(e, newValue) => setIntensity(newValue)}
                valueLabelDisplay="auto"
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <IconButton onClick={() => setIntensity(50)}>
                <Undo />
              </IconButton>
              <IconButton onClick={saveImage}>
                <Save />
              </IconButton>
              <IconButton>
                <Share />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VirtualMakeup;
