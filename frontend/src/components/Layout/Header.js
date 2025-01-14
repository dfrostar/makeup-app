import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Badge,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart,
  Person,
  Favorite,
  Search,
  Close,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import SearchBar from '../Search/SearchBar';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
  };

  const menuItems = [
    { text: 'Products', link: '/products' },
    { text: 'Looks', link: '/looks' },
    { text: 'Virtual Try-On', link: '/virtual-try-on' },
    { text: 'Community', link: '/community' },
    { text: 'Sustainability', link: '/sustainability' },
  ];

  return (
    <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'background.paper' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMobileMenuToggle}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
          MakeupDirectory
        </Typography>

        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                href={item.link}
                sx={{ textTransform: 'none' }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" onClick={handleSearchToggle}>
            <Search />
          </IconButton>
          <IconButton color="inherit" href="/favorites">
            <Badge badgeContent={3} color="secondary">
              <Favorite />
            </Badge>
          </IconButton>
          <IconButton color="inherit" href="/cart">
            <Badge badgeContent={2} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>
          {user ? (
            <IconButton color="inherit" onClick={handleProfileMenuOpen}>
              <Person />
            </IconButton>
          ) : (
            <Button color="inherit" href="/auth/login">
              Login
            </Button>
          )}
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
        >
          <MenuItem onClick={() => window.location.href = '/profile'}>Profile</MenuItem>
          <MenuItem onClick={() => window.location.href = '/orders'}>Orders</MenuItem>
          <MenuItem onClick={() => window.location.href = '/settings'}>Settings</MenuItem>
          <MenuItem onClick={logout}>Logout</MenuItem>
        </Menu>

        <Drawer
          anchor="left"
          open={mobileMenuOpen}
          onClose={handleMobileMenuToggle}
        >
          <Box sx={{ width: 250 }} role="presentation">
            <List>
              {menuItems.map((item) => (
                <ListItem button key={item.text} component="a" href={item.link}>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        <Drawer
          anchor="top"
          open={searchOpen}
          onClose={handleSearchToggle}
          PaperProps={{
            sx: { height: 'auto', padding: 2 }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SearchBar onSearch={handleSearchToggle} />
            <IconButton onClick={handleSearchToggle}>
              <Close />
            </IconButton>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
