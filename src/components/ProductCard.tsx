import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CardActions,
  Box,
  Typography,
  Button
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

/* ---------- Types ---------- */
interface Product {
  id: string;
  type: 'simple' | 'variant';
  title: string;
  price: number;
  image_1_url: string;
  image_2_url?: string;
  sizes?: string[];
  active?: boolean;
}

interface ProductCardProps {
  product: Product;
}

/* ---------- Styled Components ---------- */
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: 'none',
  backgroundColor: 'transparent'
}));

const ImageWrapper = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  paddingTop: '100%',
  overflow: 'hidden',
}));

interface FadeImageProps {
  visible: boolean;
  zoom?: boolean;
}

const FadeImage = styled(CardMedia, {
  shouldForwardProp: (prop) => prop !== 'visible' && prop !== 'zoom'
})<FadeImageProps>(({ visible, zoom }) => ({
  position: 'absolute',
  inset: 0,
  objectFit: 'contain',
  width: '100%',
  height: '100%',
  opacity: visible ? 1 : 0,
  transform: zoom && visible ? 'scale(1.05)' : 'scale(1)',
  zIndex: visible ? 2 : 1,
  willChange: 'opacity, transform',
  transition: 'opacity 0.2s ease, transform 0.2s ease',
}));

/* ---------- Component ---------- */
const ProductCard: React.FC<ProductCardProps> = ({
  product
}) => {
  const [hover, setHover] = useState(false);
  const [loadedSecondary, setLoadedSecondary] = useState(false);

  useEffect(() => {
    if (product.image_2_url) {
      const img = new window.Image();
      img.src = product.image_2_url;
      img.onload = () => setLoadedSecondary(true);
    }
  }, [product.image_2_url]);

  // Format price once for performance
  const formattedPrice = new Intl.NumberFormat('uk-UA').format(product.price);

  return (
    <Box sx={{ width: '100%', p: 0 }}>
      <StyledCard
        role="group"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* ======== IMAGE & ACTION AREA ======== */}
        <CardActionArea
          disableRipple
          disableTouchRipple
          component={RouterLink}
          to={`/product/${product.id}`}
          aria-label={`Переглянути ${product.title}`}
          sx={{
            flexGrow: 1,
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'transparent'
            },
            '.MuiTouchRipple-root': {
              display: 'none'
            },
            '& .MuiCardActionArea-focusHighlight': {
              display: 'none'
            }
          }}
        >
          <ImageWrapper>
            {/* --- Primary image --- */}
            <FadeImage
              component="img"
              loading="eager"
              src={product.image_1_url}
              alt={product.title}
              visible={!hover}
              zoom={hover}
            />

            {/* --- Secondary image (hover) --- */}
            {product.image_2_url && loadedSecondary && (
              <FadeImage
                component="img"
                loading="eager"
                src={product.image_2_url}
                alt={product.title}
                visible={hover}
                zoom={hover}
              />
            )}
          </ImageWrapper>
        </CardActionArea>

        {/* ======== TEXT AREA ======== */}
        <CardContent sx={{ py: 2, textAlign: 'left' }}>
          <Typography variant="h6" fontWeight={700}>
            {formattedPrice} грн
          </Typography>
          <Typography variant="body2" color="text.primary" noWrap title={product.title}>
            {product.title}
          </Typography>
          <Button
            component={RouterLink}
            to={`/product/${product.id}`}
            variant="text"
            sx={{
              mt: 1,
              p: 0,
              textTransform: 'none',
              transition: 'none',
              '&:hover': {
                backgroundColor: 'transparent'
              },
              '& .MuiSvgIcon-root': {
                ml: 0.5,
                transition: 'margin 0.2s ease'
              },
              '&:hover .MuiSvgIcon-root': {
                ml: 1
              }
            }}
          >
            Придбати
            <ChevronRightIcon fontSize="small" />
          </Button>
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default ProductCard;