import "./FrontPage.css";
import frontKoala from "../../components/pictures/koala-logo.png";
import { useNavigate } from "react-router-dom";

export default function Frontpage() {
  const navigate = useNavigate();

  return (
    <div className="front_page_container">
      <div className="title_text mt-12">
        <h1>Welcome to Koala-timereport</h1>
        <div>
          <span className="inline-block align-middle">
            <button
              id="signin_btn"
              className="w-64"
              onClick={() => navigate("/timesummary")}
            >
              Sign In
            </button>
          </span>
          <span className="inline-block align-middle">
            <img src={frontKoala} alt="logo" />
          </span>
        </div>
      </div>
    </div>
  );
}
