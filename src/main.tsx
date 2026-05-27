import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

function restoreStaticHostRoute() {
  const params = new URLSearchParams(window.location.search);
  const encodedPath = params.get("p");
  if (!encodedPath) return;

  const decodedPath = decodeURIComponent(encodedPath);
  const hashStart = decodedPath.indexOf("#");
  const hash = hashStart >= 0 ? decodedPath.slice(hashStart) : window.location.hash;
  const pathAndQuery = hashStart >= 0 ? decodedPath.slice(0, hashStart) : decodedPath;
  const queryStart = pathAndQuery.indexOf("&");
  const path = `/${(queryStart >= 0 ? pathAndQuery.slice(0, queryStart) : pathAndQuery).replace(/^\/+/, "")}`;
  const restoredQuery = queryStart >= 0 ? `?${pathAndQuery.slice(queryStart + 1)}` : "";

  window.history.replaceState(null, "", `${path}${restoredQuery}${hash}`);
}

restoreStaticHostRoute();

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
