import { useEffect } from "react";

export default function AuthCallbackPage() {
  useEffect(() => {
    console.log("CALLBACK DEBUG V99 CARREGOU");
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f3f4f6",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: "red",
          fontSize: "40px",
          fontWeight: "bold",
          marginBottom: "16px",
        }}
      >
        CALLBACK DEBUG V99
      </div>

      <div
        style={{
          color: "#111827",
          fontSize: "18px",
          marginBottom: "8px",
        }}
      >
        Se você está vendo isso, o arquivo novo chegou em produção.
      </div>

      <div
        style={{
          color: "#6b7280",
          fontSize: "14px",
          wordBreak: "break-all",
          maxWidth: "900px",
        }}
      >
        URL atual: {window.location.href}
      </div>
    </div>
  );
}