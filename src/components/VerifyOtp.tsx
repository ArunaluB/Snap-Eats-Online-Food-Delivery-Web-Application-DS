import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    const email = localStorage.getItem("pendingEmail");

    if (!email) {
      setMessage("No email found. Please register again.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8091/api/notification/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error verifying OTP:", errorData);
        setMessage("Failed to verify OTP.");
        return;
      }

      setMessage("OTP Verified Successfully!");
      setSuccess(true);
      localStorage.removeItem("pendingEmail");

      const username = localStorage.getItem("pendingUsername"); 
      if (username) {
        localStorage.setItem("user", JSON.stringify({ name: username })); 
      }
    } catch (error) {
      console.error("Network error:", error);
      setMessage("Something went wrong. Try again later.");
    }
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [success, navigate]);

  return (
    <div className="flex flex-col items-center space-y-4 py-10">
      <h2 className="text-2xl font-bold">Enter OTP</h2>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="px-4 py-2 border rounded-lg w-60 text-center"
      />
      <button
        onClick={handleVerify}
        className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition"
      >
        Verify
      </button>
      {message && (
        <p className={`text-sm text-center ${success ? "text-green-600" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
