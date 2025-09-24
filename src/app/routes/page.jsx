"use client";

import React from "react";
import TopRoutes from "../components/TopRoutes";
import EnhancedFooter from "../components/footer";

const RoutesPage = () => {
  return (
    <main>
      {/* showViewAll = false taaki "View All Routes" button All Routes page pe na dikhe */}
      <TopRoutes showViewAll={false} />
      <EnhancedFooter />
      
    </main>
  );
};

export default RoutesPage;
