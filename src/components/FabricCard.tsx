"use client";

import { Card, Badge, Button, Modal } from "@/components/ui";
import { useState } from "react";

export type FabricItem = {
  id: number;
  name: string;
  fabricType: string;
  color: string;
  colorHex: string;
  yardage: number;
  price: number;
  image: string; // gradient/pattern CSS for placeholder
  mill: string;
};

type FabricCardProps = {
  fabric: FabricItem;
  onClaim: (id: number) => void;
};

const fabricBadgeVariant = (type: string) => {
  const map: Record<string, "green" | "cream" | "sky" | "mint" | "lavender" | "sage"> = {
    "Organic Cotton": "green",
    "Silk": "lavender",
    "Linen": "cream",
    "Denim": "sky",
    "Wool": "sage",
    "Hemp": "mint",
    "Tencel": "green",
    "Velvet": "lavender",
  };
  return map[type] || "cream";
};

export default function FabricCard({ fabric, onClaim }: FabricCardProps) {
  const [claiming, setClaiming] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleClaimClick = () => {
    setShowModal(true);
  };

  const confirmClaim = () => {
    if (claiming) return;
    setClaiming(true);
    setShowModal(false);
    onClaim(fabric.id);
  };

  return (
    <Card
      as="article"
      padding="sm"
      className={`
        group overflow-hidden transition-all duration-500
        ${claiming ? "scale-95 opacity-0" : "scale-100 opacity-100"}
      `}
    >
      {/* Image / Fabric swatch area */}
      <div
        className="relative mb-5 flex h-48 items-end overflow-hidden rounded-xl p-3"
      >
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
          style={{ 
            background: fabric.image.startsWith('data:') || fabric.image.startsWith('http') 
              ? `url(${fabric.image}) center/cover no-repeat` 
              : fabric.image 
          }}
        />
        {/* Fabric texture overlay */}
        <div className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 20h40M20 0v40' stroke='%23000' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "14px 14px",
          }}
        />
        {/* Mill tag */}
        <span className="relative z-10 rounded-lg bg-white/90 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-foreground/80 shadow-sm backdrop-blur-md">
          {fabric.mill}
        </span>
        {/* Hover glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="px-1">
        <h3 className="mb-2 text-[16px] font-bold tracking-tight leading-tight text-foreground">
          {fabric.name}
        </h3>

        {/* Badges row */}
        <div className="mb-4 flex flex-wrap items-center gap-1.5">
          <Badge variant={fabricBadgeVariant(fabric.fabricType)} className="text-[10px]">
            {fabric.fabricType}
          </Badge>
          <Badge variant="cream" className="text-[10px]">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full border border-border/50"
              style={{ backgroundColor: fabric.colorHex }}
            />
            {fabric.color}
          </Badge>
        </div>

        {/* Stats row */}
        <div className="mb-5 flex items-baseline justify-between border-t border-border-light pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tighter text-primary-dark">
              ${fabric.price}
            </span>
            <span className="text-[11px] font-bold text-muted-light">
              / {fabric.yardage} yds
            </span>
          </div>
        </div>

        {/* Claim button */}
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={handleClaimClick}
          disabled={claiming}
          className="group-hover:shadow-md"
        >
          {claiming ? (
            <span className="flex items-center gap-2">
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Claiming...
            </span>
          ) : (
            "Claim Fabric"
          )}
        </Button>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmClaim}
        title="Claim Fabric"
        confirmText="Confirm Claim"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to claim <span className="font-bold text-gray-900">{fabric.name}</span>?
          </p>
          
          <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Price:</span>
              <span className="font-bold text-gray-900">${fabric.price}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-gray-500">Yardage:</span>
              <span className="font-bold text-gray-900">{fabric.yardage} yds</span>
            </div>
          </div>

          <p className="text-xs text-gray-400 italic">
            This action will move the fabric to your collection.
          </p>
        </div>
      </Modal>
    </Card>
  );
}
