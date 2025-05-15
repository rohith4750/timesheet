import React, { useEffect } from "react";
import "./toast.scss";
import AlertIcon from "../../assets/images/orange_alert.svg";
import GreenAlert from "../../assets/images/green_alert.svg";

export interface Alert {
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

interface AlertsProps {
  alerts: Alert[];
  setAlerts: (alerts: Alert[]) => void;
}

const Alerts: React.FC<AlertsProps> = ({ alerts, setAlerts }) => {
  const getAlertIcon = (type: Alert["type"]) =>
    type === "success" ? GreenAlert : AlertIcon;

  useEffect(() => {
    if (alerts.length > 0 && alerts[0].type !== "error") {
      const timer = setTimeout(() => {
        setAlerts(alerts.slice(1));
      }, alerts[0].duration || 3000);

      return () => clearTimeout(timer);
    }
  }, [alerts, setAlerts]);

  const handleClose = () => {
    setAlerts(alerts.slice(1));
  };

  return (
    <div className="alerts-overlay">
      {alerts.length > 0 && (
        <div className={`alert-box ${alerts[0].type}`}>
          <div className="alert-left-bar"></div>
          <div className="alert-icon-container">
            <img
              src={getAlertIcon(alerts[0].type)}
              alt={`${alerts[0].type} icon`}
              width={20}
              height={20}
            />
          </div>
          <div className="alert-content">
            <strong className="alert-title">
              {alerts[0].type === "success"
                ? "Success!"
                : alerts[0].type === "error"
                ? "Error!"
                : alerts[0].type === "warning"
                ? "Warning!"
                : "Info!"}
            </strong>
            <span className="alert-message">{alerts[0].message}</span>
          </div>

          {alerts[0].type === "error" && (
            <div className="alert-close-btn">
              <button onClick={handleClose}>close</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Alerts;
