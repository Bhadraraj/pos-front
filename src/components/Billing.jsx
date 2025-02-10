import React, { useState } from 'react';
import QrScanner from 'react-qr-barcode-scanner';

function QRScannerComponent() {
  const [data, setData] = useState('No result');
  const [scanning, setScanning] = useState(false);

  const handleScan = (result) => {
    if (result) {
      setData(result);
      setScanning(false); // Stop scanning once a QR code is detected
    }
  };

  const handleError = (err) => {
    console.error('QR Scanner Error:', err);
    alert('Error accessing camera. Please check camera permissions and try again.');
    setScanning(false);
  };

  const handleStartScan = () => {
    setScanning(true);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Camera not supported or permission denied.');
      setScanning(false);
    }
  };

  return (
    <div>
      <input type="text" value={data} readOnly />
      <button onClick={handleStartScan}>Scan QR Code</button>
      {scanning && (
        <QrScanner
          onUpdate={(err, result) => {
            if (result) {
              handleScan(result.text);
            } else if (err) {
              handleError(err);
            }
          }}
          style={{ width: '300px' }}
        />
      )}
    </div>
  );
}

export default QRScannerComponent;
