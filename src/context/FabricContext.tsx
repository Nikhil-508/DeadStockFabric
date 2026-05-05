"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export type FabricItem = {
  id: number;
  name: string;
  fabricType: string;
  color: string;
  colorHex: string;
  yardage: number;
  price: number;
  image: string;
  mill: string;
};

type FabricContextType = {
  fabrics: FabricItem[];
  claimedFabrics: FabricItem[];
  addFabric: (fabric: Omit<FabricItem, "id">) => void;
  removeFabric: (id: number) => void;
  claimFabric: (id: number) => void;
};

const initialFabrics: FabricItem[] = [
  {
    id: 1,
    name: "DEMO: Premium Organic Twill",
    fabricType: "Organic Cotton",
    color: "Sage",
    colorHex: "#a3b5a0",
    yardage: 120,
    price: 14,
    image: "linear-gradient(135deg, #c8d6c5 0%, #a3b5a0 50%, #b5c8b2 100%)",
    mill: "Chetna Organic",
  },
];

const FabricContext = createContext<FabricContextType | undefined>(undefined);

export function FabricProvider({ children }: { children: ReactNode }) {
  const [fabrics, setFabrics] = useState<FabricItem[]>([]);
  const [claimedFabrics, setClaimedFabrics] = useState<FabricItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const savedFabrics = localStorage.getItem("dex_fabrics");
    const savedClaimed = localStorage.getItem("dex_claimed");

    if (savedFabrics) {
      setFabrics(JSON.parse(savedFabrics));
    } else {
      setFabrics(initialFabrics);
    }

    if (savedClaimed) {
      setClaimedFabrics(JSON.parse(savedClaimed));
    }
    
    setIsInitialized(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("dex_fabrics", JSON.stringify(fabrics));
      localStorage.setItem("dex_claimed", JSON.stringify(claimedFabrics));
    }
  }, [fabrics, claimedFabrics, isInitialized]);

  const addFabric = useCallback((newFabric: Omit<FabricItem, "id">) => {
    setFabrics((prev) => [
      { ...newFabric, id: Date.now() },
      ...prev
    ]);
  }, []);

  const removeFabric = useCallback((id: number) => {
    setFabrics((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const claimFabric = useCallback((id: number) => {
    setFabrics((prev) => {
      const item = prev.find(f => f.id === id);
      if (item) {
        setClaimedFabrics(claimed => [item, ...claimed]);
      }
      return prev.filter(f => f.id !== id);
    });
  }, []);

  return (
    <FabricContext.Provider value={{ fabrics, claimedFabrics, addFabric, removeFabric, claimFabric }}>
      {children}
    </FabricContext.Provider>
  );
}

export function useFabrics() {
  const context = useContext(FabricContext);
  if (context === undefined) {
    throw new Error("useFabrics must be used within a FabricProvider");
  }
  return context;
}
