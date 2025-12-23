import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({ onScan }) {
  const scannerRef = useRef(null);
  const hasScannedRef = useRef(false);
  const isRunningRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          if (hasScannedRef.current) return;

          hasScannedRef.current = true;
          console.log("QR Code Data (scanner):", decodedText);

          // Send to parent
          await onScan(decodedText);

          // Stop scanner after first scan
          if (isRunningRef.current) {
            scanner.stop().catch(() => {});
            isRunningRef.current = false;
          }
        }
      )
      .then(() => {
        isRunningRef.current = true;
      })
      .catch((err) => {
        console.error("Failed to start scanner:", err);
      });

    return () => {
      if (isRunningRef.current) {
        scanner.stop().catch(() => {});
        isRunningRef.current = false;
      }
    };
  }, [onScan]);

  return <div id="qr-reader" style={{ width: "320px" }} />;
}
