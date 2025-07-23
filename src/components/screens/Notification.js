import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import "../../style/Notification.css";

const socket = io("http://localhost:5000");

function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Initial fetch
    axios.get("http://localhost:5000/api/notifications").then((res) => {
      setNotifications(res.data);
    });

    // Socket listeners
    socket.on("notification-updated", (updatedNotifications) => {
      setNotifications(updatedNotifications);
    });

    socket.on("notification-added", (newNotification) => {
      setNotifications(prev => [newNotification, ...prev]);
    });

    socket.on("notifications", (initialNotifications) => {
      setNotifications(initialNotifications);
    });

    return () => {
      socket.off("notification-updated");
      socket.off("notification-added");
      socket.off("notifications");
      socket.disconnect();
    };
  }, []);

  const markAsRead = (id) => {
    axios.post("http://localhost:5000/api/notifications/mark-as-read", { id });
  };

  return (
    <div className="Notification-screen">
      <div className="Container-nt">
        <h2>ئاگەهداری</h2>
        {notifications.length === 0 ? (
          <p>هیچ ئاگەهدارییەک نینە.</p>
        ) : (
          <ul className="notification-list">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`notification-item${n.read ? " read" : ""}`}
                onClick={() => markAsRead(n.id)}
                style={{
                  background: n.read ? "#f0f0f0" : "#e6f7ff",
                  cursor: "pointer",
                  marginBottom: "1rem",
                  padding: "1rem",
                  borderRadius: "8px",
                }}
              >
                <div style={{ fontWeight: "bold" }}>{n.title}</div>
                <div>{n.message}</div>
                <div style={{ fontSize: "0.8rem", color: "#888" }}>{n.time}</div>
                {!n.read && <span style={{ color: "#0E8388", fontSize: "0.9rem" }}>نوێ</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Notification;