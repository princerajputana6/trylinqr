import QRCode from 'qrcode';

export async function generateQR(payload) {
  const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return QRCode.toDataURL(data, {
    width: 480,
    margin: 2,
    color: { dark: '#0f0f14', light: '#ffffff' },
  });
}
