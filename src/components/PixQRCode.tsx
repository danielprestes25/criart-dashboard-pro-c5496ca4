
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generatePixPayload, generatePixQRCodeURL, copyPixCode } from '@/utils/pixQRCode';
import { Copy, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PixQRCodeProps {
  amount: number;
  clientName: string;
  description?: string;
}

export function PixQRCode({ amount, clientName, description }: PixQRCodeProps) {
  const [showQR, setShowQR] = useState(false);
  const { toast } = useToast();

  const pixData = {
    pixKey: 'dsprestes7@gmail.com',
    merchantName: 'Criart',
    merchantCity: 'Sao Paulo',
    amount: amount,
    description: description || `Pagamento - ${clientName}`,
    txId: `CRIART${Date.now().toString().slice(-8)}`
  };

  const pixPayload = generatePixPayload(pixData);
  const qrCodeURL = generatePixQRCodeURL(pixPayload);

  const handleCopyCode = () => {
    copyPixCode(pixPayload);
    toast({
      title: 'Código PIX copiado!',
      description: 'O código PIX foi copiado para a área de transferência',
      type: 'success'
    });
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <QrCode className="h-5 w-5 text-primary" />
          Pagamento via PIX
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-gray-300 mb-2">Valor a pagar:</p>
          <p className="text-2xl font-bold text-green-400">
            R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setShowQR(!showQR)}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <QrCode className="h-4 w-4 mr-2" />
            {showQR ? 'Ocultar QR Code' : 'Mostrar QR Code'}
          </Button>
          
          <Button
            onClick={handleCopyCode}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copiar Código
          </Button>
        </div>

        {showQR && (
          <div className="text-center space-y-4">
            <div className="bg-white p-4 rounded-lg inline-block">
              <img 
                src={qrCodeURL} 
                alt="QR Code PIX" 
                className="w-48 h-48 mx-auto"
              />
            </div>
            
            <div className="bg-dark-300/50 p-3 rounded-lg">
              <p className="text-xs text-gray-400 mb-2">Código PIX:</p>
              <p className="text-xs text-gray-300 break-all font-mono">
                {pixPayload}
              </p>
            </div>

            <div className="text-xs text-gray-400 space-y-1">
              <p>• Aponte a câmera do seu banco para o QR Code</p>
              <p>• Ou copie e cole o código PIX no seu app</p>
              <p>• Chave PIX: dsprestes7@gmail.com</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
