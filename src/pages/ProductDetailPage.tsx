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
        .select('id, title, description, price, type, image_1_url, image_2_url')
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
          sizes: [],
        });
      }
      setLoading(false);
    })();
  }, [id]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

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

  if (loading) return <Typography>Завантаження...</Typography>;
  if (!product) return <Typography>Товар не знайдено</Typography>;

  const prevImage = () => {
    setCurrentImageIndex((idx) => (idx > 0 ? idx - 1 : product.images.length - 1));
  };
  const nextImage = () => {
    setCurrentImageIndex((idx) => (idx < product.images.length - 1 ? idx + 1 : 0));
  };

  return (
    <Layout>
    <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ maxWidth: 1300, width: '100%' }}>
        <Grid container spacing={4} alignItems="flex-start">
        {/* Image Gallery */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mr: 2 }}>
              {product.images.map((img, idx) => (
                <Box
                  key={idx}
                  component="img"
                  src={`/${img}`}
                  alt={`${product.name} ${idx}`}
                  onClick={() => setCurrentImageIndex(idx)}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: idx === currentImageIndex
                      ? (theme) => `2px solid ${theme.palette.primary.main}`
                      : 'none',
                  }}
                />
              ))}
            </Box>
            <Box sx={{ position: 'relative', flexGrow: 1 }}>
              <Box
                component="img"
                src={`/${product.images[currentImageIndex]}`}
                alt={product.name}
                sx={{ width: '100%', borderRadius: 2, maxWidth: 700 }}
              />
              <IconButton
                onClick={prevImage}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: 8,
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255,255,255,0.7)',
                }}
              >
                <ArrowBackIos />
              </IconButton>
              <IconButton
                onClick={nextImage}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: 8,
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255,255,255,0.7)',
                }}
              >
                <ArrowForwardIos />
              </IconButton>
            </Box>
          </Box>
        </Grid>
        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
            {product.name}
          </Typography>
          <Box sx={{ maxWidth: 500 }}>
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
              {product.description}
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {product.currency || 'USD'} {product.price.toFixed(2)}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <IconButton
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              −
            </IconButton>
            <Typography>{quantity}</Typography>
            <IconButton onClick={() => setQuantity((q) => q + 1)}>+</IconButton>
            <Button variant="contained" sx={{ flexGrow: 1 }} onClick={() => {/* add to cart */}}>
              Add to Cart
            </Button>
          </Box>
          <Button variant="contained" color="secondary" fullWidth onClick={() => {/* buy logic */}}>
            Buy with shop&nbsp;Pay
          </Button>
          <Box component="ul" sx={{ pl: 2, mb: 3 }}>
            {product.attributes.map((attr) => (
              <Typography component="li" variant="body2" key={attr.label} sx={{ mb: 0.5 }}>
                <strong>{attr.label}:</strong> {attr.value}
              </Typography>
            ))}
          </Box>
          {product.colors.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Color</Typography>
              <Select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                size="small"
              >
                {product.colors.map((color) => (
                  <MenuItem value={color} key={color}>
                    {color}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}
          {product.sizes.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Size</Typography>
              <Select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                size="small"
              >
                {product.sizes.map((size) => (
                  <MenuItem value={size} key={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}
        </Grid>
        </Grid>
      </Box>
    </Box>
    </Layout>
  );
};

export default ProductDetailPage;
