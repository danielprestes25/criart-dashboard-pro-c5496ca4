
interface PixPaymentData {
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  amount?: number;
  description?: string;
  txId?: string;
}

export function generatePixPayload(data: PixPaymentData): string {
  const pixKey = data.pixKey;
  const merchantName = data.merchantName.slice(0, 25); // Limit to 25 chars
  const merchantCity = data.merchantCity.slice(0, 15); // Limit to 15 chars
  const amount = data.amount ? data.amount.toFixed(2) : '';
  const description = data.description?.slice(0, 72) || ''; // Limit to 72 chars
  const txId = data.txId?.slice(0, 25) || ''; // Limit to 25 chars

  // Build PIX payload according to EMV standard
  let payload = '';
  
  // Payload Format Indicator
  payload += '000201';
  
  // Point of Initiation Method (dynamic QR Code)
  payload += '010212';
  
  // Merchant Account Information
  let merchantAccount = '';
  merchantAccount += '0014br.gov.bcb.pix'; // GUI
  merchantAccount += formatField('01', pixKey); // PIX key
  
  if (description) {
    merchantAccount += formatField('02', description);
  }
  
  payload += formatField('26', merchantAccount);
  
  // Merchant Category Code
  payload += '52040000';
  
  // Transaction Currency (BRL)
  payload += '5303986';
  
  // Transaction Amount
  if (amount && parseFloat(amount) > 0) {
    payload += formatField('54', amount);
  }
  
  // Country Code
  payload += '5802BR';
  
  // Merchant Name
  payload += formatField('59', merchantName);
  
  // Merchant City
  payload += formatField('60', merchantCity);
  
  // Additional Data Field Template
  if (txId) {
    const additionalData = formatField('05', txId);
    payload += formatField('62', additionalData);
  }
  
  // CRC16 (will be calculated)
  payload += '6304';
  
  // Calculate CRC16
  const crc = calculateCRC16(payload);
  payload += crc;
  
  return payload;
}

function formatField(id: string, value: string): string {
  const length = value.length.toString().padStart(2, '0');
  return id + length + value;
}

function calculateCRC16(payload: string): string {
  const polynomial = 0x1021;
  let crc = 0xFFFF;
  
  for (let i = 0; i < payload.length; i++) {
    crc ^= (payload.charCodeAt(i) << 8);
    
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc <<= 1;
      }
      crc &= 0xFFFF;
    }
  }
  
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function generatePixQRCodeURL(pixPayload: string): string {
  // Using QR Server API to generate QR Code
  const baseURL = 'https://api.qrserver.com/v1/create-qr-code/';
  const params = new URLSearchParams({
    size: '200x200',
    data: pixPayload,
    format: 'png',
    ecc: 'M'
  });
  
  return `${baseURL}?${params.toString()}`;
}

export function copyPixCode(pixPayload: string) {
  navigator.clipboard.writeText(pixPayload).then(() => {
    console.log('PIX code copied to clipboard');
  }).catch(err => {
    console.error('Failed to copy PIX code: ', err);
  });
}
