import type { NextPage } from "next";
import QRCode from "react-qr-code";

const Qr: NextPage = () => {
  //how tf do you get the current full url in nextjs?
  //const pathname = window?.location.href;

  const pathname = "https://event-wallet-austintgriffith.vercel.app/";

  return (
    <>
      <div className="m-9 p-9">
        <div className="flex flex-col items-center justify-center m-9 p-9">
          {" "}
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={pathname}
            viewBox={`0 0 256 256`}
          />
          <div>{pathname}</div>
        </div>
      </div>
    </>
  );
};

export default Qr;
