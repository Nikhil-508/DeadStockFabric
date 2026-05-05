"use client";

import PageWrapper from "@/components/PageWrapper";
import FabricCard from "@/components/FabricCard";
import { Toast, Skeleton, Card } from "@/components/ui";
import { useState, useCallback, useEffect } from "react";
import { useFabrics, FabricItem } from "@/context/FabricContext";

export default function HomePage() {
  const { fabrics, claimFabric } = useFabrics();
  const [localFabrics, setLocalFabrics] = useState<FabricItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: "" });

  // Simulate initial load for premium feel / skeletons
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setLocalFabrics(fabrics);
    }, 1200);
    return () => clearTimeout(timer);
  }, [fabrics]);

  const displayFabrics = localFabrics;

  const handleClaim = useCallback(async (id: number) => {
    const itemToClaim = displayFabrics.find((f) => f.id === id);
    if (!itemToClaim) return;

    // 1. Optimistic UI: Remove from local display immediately
    setLocalFabrics((prev) => prev.filter((f) => f.id !== id));
    
    try {
      // 2. Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.15) reject(new Error("Network error"));
          else resolve(true);
        }, 1200);
      });

      claimFabric(id);
      setToast({ visible: true, message: "Fabric claimed successfully! 🎉" });
    } catch (error) {
      setLocalFabrics((prev) => {
        if (prev.find(f => f.id === id)) return prev;
        return [...prev, itemToClaim];
      });
      setToast({ visible: true, message: "Failed to claim. Please try again. ⚠️" });
    }
  }, [displayFabrics, claimFabric]);

  const closeToast = useCallback(() => {
    setToast({ visible: false, message: "" });
  }, []);

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="mb-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-primary-muted/50 px-5 py-2 backdrop-blur-sm border border-primary-muted">
          <span className="h-2 w-2 rounded-full bg-primary-dark animate-pulse" />
          <span className="text-[11px] uppercase tracking-[0.2em] font-black text-primary-dark">
            Sustainable Marketplace <span className="opacity-40 ml-1">| Demo Mode</span>
          </span>
        </div>
        <h1 className="mb-6 text-5xl font-black tracking-tighter text-foreground sm:text-8xl">
          Fabric <span className="text-primary-dark">Feed</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted leading-relaxed opacity-80 lg:text-xl">
          Source deadstock textiles from the world&apos;s finest mills. 
          Claim surplus rolls before they are discarded.
        </p>

        {/* Search bar */}
        <div className="mx-auto mt-12 flex max-w-2xl items-center gap-4 rounded-[2rem] border border-border bg-white p-3 pr-5 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-300 focus-within:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12)] focus-within:border-primary-light">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-muted/30 text-primary-dark">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <input
            type="text"
            placeholder="Search fabrics, mills, materials..."
            className="flex-1 bg-transparent py-3 text-base font-medium text-foreground placeholder:text-muted-light outline-none"
          />
          <kbd className="hidden rounded-lg bg-cream px-2 py-1 text-[11px] font-black text-muted-light sm:block border border-border">⌘K</kbd>
        </div>
      </section>

      {/* Fabric grid */}
      <section className="animate-in fade-in duration-1000 delay-300">
        <div className="mb-10 flex items-baseline justify-between border-b border-border-light pb-6">
          <h2 className="text-2xl font-black tracking-tighter text-foreground">
            Latest Arrivals
          </h2>
          <span className="text-xs font-bold text-muted-light uppercase tracking-widest">
            {loading ? "Loading..." : `${displayFabrics.length} Items`}
          </span>
        </div>

        {loading ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} padding="sm">
                <Skeleton className="mb-4 h-48 w-full rounded-xl" />
                <Skeleton className="mb-2 h-5 w-3/4" />
                <div className="mb-4 flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </Card>
            ))}
          </div>
        ) : displayFabrics.length > 0 ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {displayFabrics.map((fabric) => (
              <FabricCard
                key={fabric.id}
                fabric={fabric}
                onClaim={handleClaim}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-border bg-white py-24 shadow-inner">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-muted/20 text-primary-dark shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23Z"/></svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-foreground">All items claimed</h3>
            <p className="max-w-xs text-center text-sm text-muted">
              You&apos;ve cleared the feed! Check back soon for new deadstock drops from our partner mills.
            </p>
          </div>
        )}
      </section>

      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={closeToast}
      />
    </PageWrapper>
  );
}
