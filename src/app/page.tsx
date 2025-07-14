"use client";

import { useState } from "react";
import StockSearch from "./components/StockSearch";
import FinancialStatement from "./components/FinancialStatement";
import { Container, CssBaseline } from "@mui/material";

interface Stock {
  stock_id: string;
  stock_name: string;
}

export default function Home() {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  const handleStockSelect = (stock: Stock | null) => {
    setSelectedStock(stock);
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        <h1>Financial Statements</h1>
        <StockSearch onStockSelect={handleStockSelect} />
        <FinancialStatement stock={selectedStock} />
      </Container>
    </>
  );
}