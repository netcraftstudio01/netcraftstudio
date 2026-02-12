import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ForceHomeOnRefresh = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if this is a page load (not navigation)
    if (
      performance.navigation.type === 1 &&
      location.pathname !== "/" &&
      !location.pathname.startsWith("/admin")
    ) {
      navigate("/", { replace: true });
    }
  }, []);

  return null;
};

export default ForceHomeOnRefresh;
