import QRScanner from "../components/QRScanner";

export default function Login() {
  const handleScan = async (data) => {
    console.log("Scanned QR Code:", data);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber: data }),
      });

      const responseData = await res.json();
      console.log("Backend response:", responseData);
    } catch (err) {
      console.error("Error sending data to backend:", err);
    }
  };

  return (
    <div className="page">
      <h1>Scan your QR Code</h1>
      <QRScanner onScan={handleScan} />
    </div>
  );
}
