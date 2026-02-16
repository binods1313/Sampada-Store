// components/VisualSearch/config.js
// Static configuration - extracted to prevent recreation on every render

export const VISUAL_SEARCH_CONFIG = {
  // Modal dimensions
  modalWidth: '400px',
  modalMaxHeight: '80vh',
  
  // Image preview
  previewSize: {
    width: '100px',
    height: '100px'
  },
  
  // Product card
  productImageSize: {
    width: '60px',
    height: '60px'
  },
  
  // API endpoint
  apiEndpoint: '/api/search/visual',
  
  // Display limits
  maxStyleTags: 5,
  
  // File input
  acceptedFormats: 'image/*',
  inputId: 'visual-search-input'
};

// Inline styles - extracted to prevent recreation
export const STYLES = {
  container: {
    position: 'relative',
    zIndex: 10
  },
  
  toggleButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '10px'
  },
  
  modal: {
    position: 'absolute',
    top: '100%',
    right: '0',
    width: '400px',
    maxHeight: '80vh',
    overflowY: 'auto',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '20px',
    borderRadius: '8px',
    zIndex: 1000
  },
  
  header: {
    marginBottom: '15px'
  },
  
  title: {
    fontSize: '1.2rem',
    margin: '0 0 5px 0'
  },
  
  subtitle: {
    fontSize: '0.9rem',
    color: '#666'
  },
  
  uploadArea: {
    marginBottom: '20px'
  },
  
  uploadLabel: {
    display: 'block',
    width: '100%',
    padding: '10px',
    backgroundColor: '#f1f1f1',
    border: '2px dashed #ddd',
    textAlign: 'center',
    cursor: 'pointer',
    borderRadius: '4px'
  },
  
  fileInput: {
    display: 'none'
  },
  
  previewImage: {
    width: '100px',
    height: '100px',
    objectFit: 'contain',
    marginBottom: '15px'
  },
  
  errorMessage: {
    color: 'red',
    padding: '10px'
  },
  
  errorDetails: {
    fontSize: '0.8rem',
    marginTop: '5px',
    color: '#666'
  },
  
  detectedInfo: {
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px'
  },
  
  detectedTitle: {
    fontSize: '0.9rem',
    marginBottom: '5px'
  },
  
  colorsContainer: {
    display: 'flex',
    gap: '5px',
    marginBottom: '5px'
  },
  
  colorSwatch: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '1px solid #ccc'
  },
  
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5px'
  },
  
  tag: {
    fontSize: '11px',
    backgroundColor: '#eef',
    padding: '2px 6px',
    borderRadius: '4px'
  },
  
  productsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  
  productsTitle: {
    fontSize: '1rem',
    margin: '0'
  },
  
  productCard: {
    display: 'flex',
    gap: '10px',
    border: '1px solid #eee',
    padding: '10px',
    borderRadius: '4px'
  },
  
  productImage: {
    width: '60px',
    height: '60px',
    objectFit: 'cover'
  },
  
  productName: {
    margin: '0 0 5px 0',
    fontSize: '0.9rem'
  },
  
  productPrice: {
    margin: '0 0 5px 0',
    fontSize: '0.9rem',
    fontWeight: 'bold'
  },
  
  matchScore: {
    margin: '0',
    fontSize: '0.8rem',
    color: 'green'
  },
  
  productLink: {
    textDecoration: 'none',
    color: 'inherit'
  }
};
