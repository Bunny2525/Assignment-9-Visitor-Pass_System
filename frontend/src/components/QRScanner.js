import React, { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

function QRScanner({ onScan, onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    
    codeReader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
      if (result) {
        onScan(result.text);
        codeReader.reset();
      }
    });

    return () => codeReader.reset();
  }, [onScan]);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      backgroundColor: 'rgba(0,0,0,0.8)', 
      zIndex: 999,
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justify: 'center' 
    }}>
      <video ref={videoRef} style={{ width: '80%', maxWidth: '500px', borderRadius: '8px' }} />
      <button onClick={onClose} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>
        Close Scanner
      </button>
    </div>
  );
}

export default QRScanner;