import { useEffect } from "react";

const LoadAsset = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const WebFont = require("webfontloader");

    WebFont.load({
      google: {
        families: [
          "Inter:400,500,600,700", // Specify the weights here
          "sans-serif",
        ],
      },
    });
  }, []);

  return <div style={{ display: "none" }} />;
};

export default LoadAsset;
