// import "../styles/globals.css";
import "tailwindcss/tailwind.css";

import Amplify from "@aws-amplify/core";
import config from "../src/aws-exports";
Amplify.configure(config);

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
