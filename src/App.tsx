import { useEffect } from "react";
import { login } from "./services/authService";

function App() {
  useEffect(() => {
    const testLogin = async () => {
      try {
        const res = await login({
          username: "admin",
          password: "4nandam1D!",
        });

        console.log("LOGIN SUCCESS:", res);
      } catch (err) {
        console.error("LOGIN ERROR:", err);
      }
    };

    testLogin();
  }, []);

  return <div>Testing login...</div>;
}

export default App;
