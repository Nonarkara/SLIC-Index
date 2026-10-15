import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

function restoreStaticHostRoute() {
  // Decode the raw value once; URLSearchParams followed by decoding did it twice.
  const encodedPath = window.location.search.match(/(?:^\?|&)p=([^&]*)/)?.[1];
  if (!encodedPath) return;

  try {
    const decodedPath = decodeURIComponent(encodedPath.replace(/\+/g, " "));
    const hashStart = decodedPath.indexOf("#");
    const hash = hashStart >= 0 ? decodedPath.slice(hashStart) : window.location.hash;
    const pathAndQuery = hashStart >= 0 ? decodedPath.slice(0, hashStart) : decodedPath;
    const queryStart = pathAndQuery.indexOf("&");
    const path = `/${(queryStart >= 0 ? pathAndQuery.slice(0, queryStart) : pathAndQuery).replace(/^\/+/, "")}`;
    const restoredQuery = queryStart >= 0 ? `?${pathAndQuery.slice(queryStart + 1)}` : "";

    window.history.replaceState(null, "", `${path}${restoredQuery}${hash}`);
  } catch {
    // Malformed links or denied history access must not prevent React mounting.
  }
}

restoreStaticHostRoute();

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
