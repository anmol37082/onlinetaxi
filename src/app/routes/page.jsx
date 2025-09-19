"use client";

import React from "react";
import TopRoutes from "../components/TopRoutes";

const RoutesPage = () => {
  return (
    <main>
      <h1
        style={{
          textAlign: "center",
          margin: "40px 0",
          fontSize: "2.5rem",
          fontWeight: "bold",
          color: "#2c3e50"
        }}
      >
        All Available Routes
      </h1>

      {/* showViewAll = false taaki "View All Routes" button All Routes page pe na dikhe */}
      <TopRoutes showViewAll={false} />
    </main>
  );
};

export default RoutesPage;
