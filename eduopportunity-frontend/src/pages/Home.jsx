import React from 'react';
import { Box, Container, Typography, Button, TextField, Grid, Card, CardContent, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { MdSearch, MdSchool, MdComputer, MdAccountBalance, MdScience, MdCalculate } from 'react-icons/md';

const categories = [
  { icon: <MdSchool />, name: 'Merit', color: '#3B82F6' },
  { icon: <MdComputer />, name: 'Coding', color: '#10B981' },
  { icon: <MdAccountBalance />, name: 'Government', color: '#F59E0B' },
  { icon: <MdScience />, name: 'Science', color: '#8B5CF6' },
  { icon: <MdCalculate />, name: 'Mathematics', color: '#EC4899' },
];

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, var(--color-bg) 0%, #e0e7ff 100%)',
          pt: 10,
          pb: 12,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 800, color: 'secondary.main', lineHeight: 1.2 }}>
              Find the Best <Box component="span" sx={{ color: 'primary.main' }}>Scholarship</Box> & <br />
              <Box component="span" sx={{ color: 'warning.main' }}>Olympiad</Box> Opportunities
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 6, fontWeight: 400 }}>
              Discover thousands of opportunities to fund your education and showcase your talents globally.
            </Typography>
          </motion.div>

          {/* Search Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: '#fff', 
                borderRadius: '50px',
                padding: '8px 8px 8px 24px',
                boxShadow: 'var(--shadow-lg)',
                maxWidth: '600px',
                margin: '0 auto'
              }}
            >
              <MdSearch size={24} color="var(--color-text-muted)" />
              <TextField 
                placeholder="Search for scholarships, olympiads, or skills..." 
                variant="standard" 
                fullWidth 
                InputProps={{ disableUnderline: true, sx: { ml: 1, fontSize: '1.1rem' } }} 
              />
              <Button variant="contained" color="primary" sx={{ borderRadius: '50px', px: 4, py: 1.5, ml: 2, fontWeight: 'bold' }}>
                Search
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Popular Categories */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={6}>
          Popular Categories
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {categories.map((cat, index) => (
            <Grid item key={index}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card 
                  sx={{ 
                    borderRadius: '16px', 
                    cursor: 'pointer', 
                    boxShadow: 'var(--shadow-sm)',
                    '&:hover': { boxShadow: 'var(--shadow-md)', borderColor: cat.color },
                    border: '2px solid transparent',
                    minWidth: '160px'
                  }}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 3 }}>
                    <Box sx={{ color: cat.color, fontSize: '2.5rem' }}>
                      {cat.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="600">{cat.name}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
