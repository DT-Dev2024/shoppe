import { useContext, useEffect } from "react";
import { AuthContext } from "./contexts/auth.context";
import useRoutesElement from "./routes/useRouteElements";
import { LocalStorageEventTarget } from "./utils/auth";
// eslint-disable-next-line import/no-unresolved
function App() {
  console.log("App", import.meta.env.VITE_SERVER_URL);
  const routeElements = useRoutesElement();
  const { clearAuthenFromProvider } = useContext(AuthContext);
  useEffect(() => {
    LocalStorageEventTarget.addEventListener("clearAuthen", clearAuthenFromProvider);
    return () => {
      LocalStorageEventTarget.removeEventListener("clearAuthen", clearAuthenFromProvider);
    };
  }, [clearAuthenFromProvider]);
  return <>{routeElements}</>;
}

export default App;
