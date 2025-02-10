import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import QrReader from "react-qr-reader";

export default function Scanner({ setResult }) {
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Handle the scanning result
  const handleScan = (data) => {
    if (data) {
      setResult(data); // Set the result with the scanned data
      setIsScanning(false); // Turn off scanning after successful scan
      setShowModal(false); // Close modal after scan
    }
  };

  // Handle any errors in the scanning process (with a more graceful approach)
  const handleError = (err) => {
    setError(err);
    if (err.name === "NotAllowedError") {
      setPermissionDenied(true); // Handle permission denial error
    }
    console.error("QR Reader Error: ", err);
  };

  // Trigger the scanner to open when the "Start Scan" button is clicked
  const startScan = () => {
    setIsScanning(true);
    setPermissionDenied(false);
    setShowModal(true); // Open the modal when scanning starts
    setIsModalVisible(true); // Delay rendering QR reader until the modal is visible
  };

  // Handle when the camera preview is successfully initialized
  const handlePreview = (preview) => {
    if (preview) {
      setIsCameraReady(true); // Set camera as ready once the preview is available
    }
  };

  // Close modal when the user clicks close
  const closeModal = () => {
    setShowModal(false);
    setIsModalVisible(false); // Stop rendering the QR Reader when modal is closed
  };

  useEffect(() => {
    if (showModal) {
      setIsModalVisible(true);
      // Delay QR reader initialization to ensure the modal is rendered first
      setTimeout(() => {
        setIsScanning(true);
      }, 500); // Delay of 500ms to give the modal time to render
    }
  }, [showModal]);

  return (
    <div>
      <Button className="btn btn-sm btn-primary" onClick={startScan}>
        Start Scan
      </Button>

      {/* Modal for QR scanner */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>QR Scanner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && !permissionDenied && (
            <p style={{ color: "red" }}>Error: {error.message}</p>
          )}
          {permissionDenied && (
            <p style={{ color: "red" }}>
              Camera permission was denied. Please allow camera access to scan the QR code.
            </p>
          )}

          {/* Only render QR Reader when modal is visible */}
          {isModalVisible && isScanning && (
            <QrReader
              delay={300}
              width="100%"
              onError={handleError}
              onScan={handleScan}
              style={{ width: "100%" }}
              facingMode="user" // Use front camera by default
              onPreview={handlePreview} // This callback will be triggered when the preview is initialized
            />
          )}

          {/* Optionally, show a message if camera is initializing */}
          {!isCameraReady && !permissionDenied && !isScanning && (
            <p>Initializing camera...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
