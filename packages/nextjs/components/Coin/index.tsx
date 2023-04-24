import { useEffect, useState } from "react";
import classes from "./Coin.module.css";

type TCoinProps = {
  image?: string;
};

export const Coin = ({ image }: TCoinProps) => {
  const [scroll, setScroll] = useState(28);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(
        window.pageYOffset !== undefined
          ? window.pageYOffset
          : (document.documentElement || document.body.parentNode || document.body).scrollTop,
      );
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const angle = (scroll * 2) % 360;

  return (
    <div className={classes.coin__container}>
      <div
        className={classes.coin}
        style={{
          transform: "rotateX(" + angle + "deg)",
        }}
      >
        <div
          className={classes.coin__front}
          style={{
            backgroundImage: `url("${image}")`,
          }}
        ></div>

        <div className={classes.coin__back}></div>

        <div className={classes.coin__side}>
          <div className={classes.coin__c}></div>
          <div className={classes.coin__c}></div>
          <div className={classes.coin__c}></div>
          <div className={classes.coin__c}></div>
          <div className={classes.coin__c}></div>
          <div className={classes.coin__c}></div>
          <div className={classes.coin__c}></div>
          <div className={classes.coin__c}></div>
          <div className={classes.coin__c}></div>
          <div className={classes.coin__c}></div>
          <div className={classes.coin__c}></div>
          <div className={classes.coin__c}></div>
          <div className={classes.coin__c}></div>
          <div className={classes.coin__c}></div>
          <div className={classes.coin__c}></div>
          <div className={classes.coin__c}></div>
        </div>
      </div>
    </div>
  );
};
