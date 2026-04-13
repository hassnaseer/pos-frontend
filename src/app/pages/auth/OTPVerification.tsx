import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { ArrowLeft, Mail, Shield } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function OTPVerification() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyOTP, resendOTP } = useAuth();

  const flow = searchParams.get("flow") || "login"; // login, signup, forgot-password
  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (!email) {
      navigate("/login");
      return;
    }

    // Start countdown for resend button
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await verifyOTP(email, otp, flow);

      if (result.success) {
        // Redirect based on flow
        switch (flow) {
          case "login":
          case "signup":
            // Redirect to appropriate dashboard based on user role
            const userRole = result.user?.role;
            if (userRole === "super-admin") {
              navigate("/super-admin");
            } else if (userRole === "admin") {
              navigate("/admin");
            } else {
              navigate("/staff");
            }
            break;
          case "forgot-password":
            navigate(`/reset-password?email=${encodeURIComponent(email)}&token=${otp}`);
            break;
          default:
            navigate("/");
        }
      } else {
        setError(result.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendDisabled(true);
    setCountdown(60);
    setError("");

    try {
      await resendOTP(email, flow);
      // Start countdown again
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setTimeout(() => clearInterval(timer), 60000);
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
      setResendDisabled(false);
    }
  };

  const getFlowTitle = () => {
    switch (flow) {
      case "signup":
        return "Verify Your Email";
      case "forgot-password":
        return "Reset Password";
      default:
        return "Verify Login";
    }
  };

  const getFlowDescription = () => {
    switch (flow) {
      case "signup":
        return "We've sent a 6-digit verification code to your email address.";
      case "forgot-password":
        return "Enter the 6-digit code sent to your email to reset your password.";
      default:
        return "Enter the 6-digit verification code sent to your email.";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">{getFlowTitle()}</CardTitle>
          <CardDescription className="text-center">
            {getFlowDescription()}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Mail className="h-4 w-4" />
              <span>Code sent to: {email}</span>
            </div>
          </div>

          {error && (
            <Alert className="mb-4" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Enter 6-digit code
              </label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtp(value);
                }}
                placeholder="000000"
                className="text-center text-lg tracking-widest"
                maxLength={6}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <Button
              variant="outline"
              onClick={handleResendOTP}
              disabled={resendDisabled}
              className="w-full"
            >
              {resendDisabled ? `Resend in ${countdown}s` : "Resend Code"}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/login")}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}