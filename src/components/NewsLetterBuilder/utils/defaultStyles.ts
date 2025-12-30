// Default styling constants

export const DEFAULT_STYLES = {
  text: {
    fontSize: 14,
    fontFamily: 'Arial, sans-serif',
    color: '#333333',
    alignment: 'left' as const,
    lineHeight: 1.5,
  },
  heading: {
    h1: { fontSize: 32, fontWeight: 700 },
    h2: { fontSize: 24, fontWeight: 600 },
    h3: { fontSize: 18, fontWeight: 600 },
    fontFamily: 'Arial, sans-serif',
    color: '#333333',
    alignment: 'left' as const,
  },
  image: {
    width: '100%',
    height: 'auto',
    alignment: 'center' as const,
    borderRadius: 0,
    alt: 'Image',
  },
  button: {
    backgroundColor: '#007bff',
    textColor: '#ffffff',
    borderRadius: 4,
    padding: '12px 24px',
    fontSize: 16,
    alignment: 'center' as const,
    width: 'auto',
  },
  divider: {
    style: 'solid' as const,
    color: '#e0e0e0',
    thickness: 1,
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
  },
  spacer: {
    height: 20,
  },
  layout: {
    columnWidths: ['50%', '50%'],
    gap: 16,
    backgroundColor: 'transparent',
    padding: '0',
    direction: 'horizontal' as const,
    stackOnMobile: true,
  },
  socialLinks: {
    iconSize: 32,
    spacing: 12,
    alignment: 'center' as const,
    iconStyle: 'circular' as const,
  },
  paragraph: {
    fontSize: 16,
    fontFamily: 'Arial, sans-serif',
    color: '#333333',
    alignment: 'left' as const,
    lineHeight: 1.6,
    backgroundColor: 'transparent',
  },
};

export const FONT_FAMILIES = [
  'Arial, sans-serif',
  'Helvetica, sans-serif',
  'Georgia, serif',
  'Times New Roman, serif',
  'Courier New, monospace',
  'Verdana, sans-serif',
  'Trebuchet MS, sans-serif',
];

export const COLORS = {
  primary: '#007bff',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#343a40',
  white: '#ffffff',
  black: '#000000',
};

