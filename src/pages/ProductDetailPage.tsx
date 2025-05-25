import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import { Box, Grid, Typography, Button, IconButton, MenuItem, Select } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<{
    id: string;
    name: string;
    description: string;
    attributes: { label: string; value: string }[];
    price: number;
    currency?: string;
    images: string[];
    colors: string[];
    sizes: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, description, price, type, image_1_url, image_2_url, sizes')
        .eq('id', id)
        .single();
      if (data) {
        setProduct({
          id: data.id,
          name: data.title,
          description: data.description || '',
          attributes: [],
          price: data.price,
          currency: undefined,
          images: [data.image_1_url, data.image_2_url].filter(Boolean),
          colors: [],
          sizes: data.sizes || [],
        });
      }
      setLoading(false);
    })();
  }, [id]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0] || '');
      setSelectedSize(product.sizes[0] || '');
      setCurrentImageIndex(0);
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | FAYNA Team Shop`;
      let meta = document.querySelector("meta[name='description']");
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', product.description);
    }
  }, [product]);

  if (loading) {
    return (
      <Layout>
        <Box sx={{ p: { xs: 2, md: 8 }, display: 'flex', justifyContent: 'center', px: { xs: 2, md: 0 } }}>
          <Box sx={{ maxWidth: 1300, width: '100%' }}>
            <Box sx={{ width: '100%', minHeight: '100vh' }} />
          </Box>
        </Box>
      </Layout>
    );
  }
  if (!product) return <Typography>Товар не знайдено</Typography>;

  const prevImage = () => {
    setSlideDirection('left');
    setTimeout(() => {
      setCurrentImageIndex((idx) => (idx > 0 ? idx - 1 : product.images.length - 1));
      setSlideDirection(null);
    }, 100);
  };
  const nextImage = () => {
    setSlideDirection('right');
    setTimeout(() => {
      setCurrentImageIndex((idx) => (idx < product.images.length - 1 ? idx + 1 : 0));
      setSlideDirection(null);
    }, 100);
  };

  return (
    <Layout>
    <Box sx={{ p: { xs: 2, md: 8 }, display: 'flex', justifyContent: 'center', px: { xs: 2, md: 0 } }}>
      <Box sx={{ maxWidth: 1300, width: '100%' }}>
        <Grid container spacing={2} alignItems="flex-start">
        {/* Image Gallery */}
        <Grid item xs={12} md={6}>
          {/* MOBILE MAIN PHOTO — Edge-to-edge */}
          <Box
            component="img"
            src={`/${product.images[currentImageIndex]}`}
            alt={product.name}
            sx={{
              display: { xs: 'block', md: 'none' },
              width: '100vw',
              maxWidth: '100vw',
              ml: '-16px',
              mr: '-16px',
              mt: 0,
              borderRadius: 0,
              objectFit: 'contain',
              aspectRatio: '4/5',
              maxHeight: 400,
              transition: 'transform 0.32s cubic-bezier(.4,0,.2,1), opacity 0.32s cubic-bezier(.4,0,.2,1)',
              transform: slideDirection === 'left' ? 'translateX(-32px)' : slideDirection === 'right' ? 'translateX(32px)' : 'translateX(0)',
              opacity: slideDirection ? 0.6 : 1,
            }}
          />
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'row', justifyContent: 'flex-start', gap: 1, mt: 2, ml: 0, mr: 0 }}>
            {product.images.map((img, idx) => (
              <Box
                key={idx}
                component="img"
                src={`/${img}`}
                alt={`${product.name} ${idx}`}
                onClick={() => setCurrentImageIndex(idx)}
                sx={{
                  width: 67,
                  height: 67,
                  borderRadius: 1,
                  border: idx === currentImageIndex
                    ? '2px solid'
                    : '1.5px solid',
                  borderColor: idx === currentImageIndex ? 'grey.200' : 'grey.100',
                  cursor: 'pointer',
                  objectFit: 'cover',
                }}
              />
            ))}
          </Box>
          {/* DESKTOP IMAGE GALLERY */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', width: '100%', alignItems: 'center' }}>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', borderRadius: 4, /*boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)',*/ height: 640, position: 'relative', width: '100%' }}>
              <Box
                component="img"
                src={`/${product.images[currentImageIndex]}`}
                alt={product.name}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
            {/* Desktop thumbnails row under main image */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                justifyContent: 'flex-start',
                width: 'auto',
                ml: 0,
                mt: 3,
              }}
            >
              {product.images.map((img, idx) => (
                <Box
                  key={idx}
                  component="img"
                  src={`/${img}`}
                  alt={`${product.name} ${idx}`}
                  onClick={() => setCurrentImageIndex(idx)}
                  sx={{
                    width: 92,
                    height: 92,
                    borderRadius: 1,
                    border: idx === currentImageIndex ? '2px solid' : '1.5px solid',
                    borderColor: idx === currentImageIndex ? 'grey.200' : 'grey.100',
                    cursor: 'pointer',
                    objectFit: 'cover',
                  }}
                />
              ))}
            </Box>
          </Box>
        </Grid>
        {/* Product Info */}
        <Grid item xs={12} md={6} sx={{ minWidth: 320 }}>
          <Box sx={{ maxWidth: 480, mx: { xs: 0, md: 'auto' }, px: { xs: 0, md: 2 }, py: { xs: 2, md: 4 } }}>
            {/* BIG TITLE */}
            <Typography
              variant="h4"
              sx={{
                mb: 1.2,
                fontSize: { xs: 17, sm: 19 },
                fontWeight: 500,
                textAlign: 'left',
              }}
            >
              {product.name}
            </Typography>
            {/* BIG GREEN PRICE */}
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: 19, sm: 22 },
                fontWeight: 700,
                color: 'grey.900',
                mb: 2,
                textAlign: 'left',
              }}
            >
              {product.price} грн
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: 15, sm: 16 },
                lineHeight: 1.25,
                mb: 1.5,
                color: 'text.secondary',
                textAlign: 'left',
                // display: '-webkit-box',
                // WebkitLineClamp: 3,
                // WebkitBoxOrient: 'vertical',
                // overflow: 'hidden',
              }}
            >
              {product.description || " "}
            </Typography>
            <Box component="ul" sx={{ pl: 0, mb: 1.5, listStyle: 'none' }}>
              {product.attributes.map((attr) => (
                <Typography component="li" variant="body2" key={attr.label} sx={{ mb: 1.2, fontWeight: 600 }}>
                  <strong>{attr.label}:</strong> {attr.value}
                </Typography>
              ))}
            </Box>
            {product.colors.length > 0 && (
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'left' }}>Колір</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {product.colors.map((color) => {
                    const selected = selectedColor === color;
                    return (
                      <Box
                        key={color}
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          border: selected ? '3px solid #34C759' : '2px solid #eee',
                          background: color,
                          cursor: 'pointer',
                          boxShadow: selected ? '0 2px 8px 0 rgba(46,204,113,0.15)' : undefined,
                          mr: 2,
                          mb: 1,
                        }}
                        onClick={() => setSelectedColor(color)}
                      />
                    );
                  })}
                </Box>
              </Box>
            )}
            {product.sizes.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
          <Typography
            variant="subtitle2"
            sx={{
              textAlign: 'left',
              fontWeight: 500,
              fontSize: 15,
            }}
          >
            Розмір
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {product.sizes.map((size) => (
              <Button
                key={size}
                variant="text"
                onClick={() => setSelectedSize(size)}
                sx={{
                  minWidth: 44,
                  height: 44,
                  borderRadius: 1,
                  px: 0,
                  fontWeight: 600,
                  fontSize: 15,
                  border: selectedSize === size ? '2px solid #222' : '1.5px solid #e3e3e3',
                  background: '#fff',
                  color: '#222',
                  mr: 0,
                  mb: 0,
                  textTransform: 'none',
                  '&:hover': {
                    border: selectedSize === size ? '2px solid #222' : '1.5px solid #e3e3e3',
                    background: '#fff',
                  },
                }}
              >
                {size}
              </Button>
            ))}
          </Box>
        </Box>
      )}
            <Button
              variant="contained"
              fullWidth
              sx={{
                fontSize: 18,
                borderRadius: 1,
                minHeight: 56,
                fontWeight: 700,
                py: 0,
                mt: 0,
                mb: 2,
                backgroundColor: '#229ED9',
                color: '#fff',
                boxShadow: '0 3px 12px 0 rgba(34,158,217,0.15)',
                textTransform: 'none',
              }}
              startIcon={
                <svg viewBox="0 0 240 240" width="24" height="24" fill="none"><circle cx="120" cy="120" r="120" fill="#229ED9"/><path d="M62.6 123.7c44.3-18.6 73.8-30.8 88.6-36.7 42.2-16.6 51.1-19.5 56.7-19.6 1.3 0 4.1.3 6 1.8 1.6 1.3 2 3 2.2 4.2.2 1.2.5 3.9.3 6-2.6 27-13.9 92.8-19.6 123.1-2.4 12.5-7.1 16.7-11.7 17.1-9.9.9-17.4-6.6-27-13-15-10.2-23.5-16.6-38.1-26.5-16.8-11-5.9-17.1 3.7-27.1 2.6-2.6 46.8-42.9 47.7-46.5.1-.5.2-2.5-.9-3.5s-2.4-.7-3.5-.5c-1.5.4-24.9 15.8-70.2 46-6.6 4.5-12.7 6.7-18.2 6.6-6-.1-17.5-3.4-26.1-6.2-10.6-3.4-19.1-5.2-18.4-11 .3-2.3 3.1-4.6 8.5-6.8z" fill="#fff"/></svg>
              }
            >
              ЗАМОВИТИ
            </Button>
          </Box>
        </Grid>
        </Grid>
      </Box>
    </Box>
    </Layout>
  );
};

export default ProductDetailPage;
