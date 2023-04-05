import "./FrontPage.css";
import frontKoala from "../../components/pictures/koala-logo.png";
import { Navigate, useNavigate } from "react-router-dom";
import { useFakeSignIn } from "../../utilities/signInFunctions";
import { useEffect, useState } from "react";
import { useIsAuthenticated } from "react-auth-kit";
import useAxios from "axios-hooks";
import OtpInput from "react-otp-input";
import { useSignIn } from "react-auth-kit";

export default function Frontpage() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const fakeSignIn = useFakeSignIn();
  const signIn = useSignIn();
  const [showOtp, setShowOtp] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const [email, setEmail] = useState("");

  const [
    { data: getOtpData, loading: getOtploading, error: getOtperror },
    executeGetOtp,
  ] = useAxios(
    { url: "http://localhost:3001/api/requestotp", method: "POST" },
    { manual: true }
  );

  const [
    { data: verifyOtpData, loading: verifyOtploading, error: verifyOtperror },
    executeVerifyOtp,
  ] = useAxios(
    { url: "http://localhost:3001/api/verifyotp", method: "POST" },
    { manual: true }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    await executeVerifyOtp({ data: { email: email, otp: otp } });
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    await executeGetOtp({ data: { email: email } });
  };

  const clearOtp = () => {
    setOtp("");
  };

  useEffect(() => {
    if (getOtpData) {
      alert("Email " + email + " response " + JSON.stringify(getOtpData));
    }
  }, [getOtpData]);

  useEffect(() => {
    if (verifyOtpData) {
      if (verifyOtpData.registerStatus === "REGISTERED_USER") {
        alert("Success! You are now signed in.");
        signIn({
          token: verifyOtpData.token,
          expiresIn: verifyOtpData.expiresIn,
          tokenType: "Bearer",
          authState: verifyOtpData.authState,
        });
        navigate("/timesummary");
      }
    }
  }, [verifyOtpData]);

  if (isAuthenticated()) {
    return <Navigate to="/timesummary" />;
  }

  if (!showOtp)
    return (
      <div className="front_page_container">
        <div className="title_text mt-12">
          <h1>Welcome to Koala-timereport</h1>
          <div>
            <span className="inline-block align-middle">
              <div>
                <button
                  id="signin_btn"
                  className="w-64 mb-6"
                  onClick={() => {
                    if (!isAuthenticated() &&
                       process.env.REACT_APP_INTEGRATION_TYPE !== "public"
                    ) {
                      alert("fake sign in")
                      fakeSignIn();
                      navigate("/timesummary");
                    } else {
                      if (isAuthenticated()) {
                        navigate("/timesummary");
                      }
                      setShowOtp(true);
                    }
                  }}
                >
                  Sign In
                </button>
              </div>
              <div>
                <button
                  id="signin_btn"
                  className="w-64"
                  onClick={() => navigate("/login")}
                >
                  Register
                </button>
              </div>
            </span>
            <span className="inline-block align-middle">
              <img src={frontKoala} alt="logo" />
            </span>
          </div>
        </div>
      </div>
    );
  else {
    return (
      <div className="front_page_container">
        <div className="title_text mt-12">
          <h1>Welcome to Koala-timereport</h1>
          <div>
            <div>
              <label className="text-2xl">Enter email</label>
              <input
                className="w-64"
                type="text"
                placeholder="Enter email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <button
                className="mb-8 border border-gray-300 rounded-md shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={handleSendEmail}
              >
                Send One-Time-Password
              </button>
            </div>
            <span className="inline-block align-middle">
              <form onSubmit={handleSubmit}>
                <p className="text-2xl">Enter verification code</p>
                <div className="margin-top--small">
                  <OtpInput
                    inputStyle="inputStyle"
                    inputType="tel"
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => <input {...props} />}
                  />
                </div>
                <div className="mt-4 flex justify-center gap-4">
                  <button
                    className="mb-8 border border-gray-300 rounded-md shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    type="button"
                    disabled={otp.trim() === ""}
                    onClick={clearOtp}
                  >
                    Clear
                  </button>
                  <button
                    className="mb-8 border border-gray-300 rounded-md shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    disabled={otp.length < 6}
                  >
                    Get OTP
                  </button>
                </div>
              </form>
            </span>
            <span className="inline-block align-middle">
              <img src={frontKoala} alt="logo" />
            </span>
          </div>
        </div>
      </div>
    );
  }
}
