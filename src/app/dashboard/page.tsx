"use client";

import PageWrapper from "@/components/PageWrapper";
import { Card, Badge, Button, Skeleton } from "@/components/ui";
import { useFabrics } from "@/context/FabricContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { fabrics, claimedFabrics } = useFabrics();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: "My Listings", value: fabrics.length, icon: "📦" },
    { label: "Claimed", value: claimedFabrics.length, icon: "🏷️" },
    { label: "Value", value: `$${fabrics.reduce((acc, f) => acc + f.price, 0)}`, icon: "💰" },
    { label: "Eco Score", value: "A+", icon: "🌿" },
  ];

  return (
    <PageWrapper>
      <div className="mb-10 animate-in fade-in slide-in-from-left-4 duration-700">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <div className="flex items-center gap-2 text-sm text-muted">
          <span>Welcome back,</span>
          <span className="font-bold text-primary-dark underline underline-offset-4 decoration-primary-muted">
            {user?.email}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mb-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
        {stats.map((stat, i) => (
          <Card key={stat.label} className="border-none bg-white shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-card-hover)]">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-8 rounded-xl" />
                <Skeleton className="h-7 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ) : (
              <>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-muted/20 text-xl shadow-sm">
                  {stat.icon}
                </div>
                <p className="text-2xl font-black text-foreground tracking-tight">{stat.value}</p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-muted-light">{stat.label}</p>
              </>
            )}
          </Card>
        ))}
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Section: My Listings */}
        <section className="animate-in fade-in duration-1000 delay-300">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-foreground">My Listings</h2>
            <Link href="/upload">
              <Button variant="secondary" size="sm" className="bg-white border-primary-muted text-primary-dark hover:bg-primary-muted/10">
                + Add Roll
              </Button>
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {loading ? (
              [1, 2].map(i => (
                <Card key={i} padding="sm" className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 shrink-0 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </Card>
              ))
            ) : fabrics.length > 0 ? (
              fabrics.map((fabric) => (
                <Card key={fabric.id} padding="sm" className="group flex flex-col sm:flex-row sm:items-center gap-4 transition-all hover:bg-cream/30 hover:border-primary-muted">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div 
                      className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl shadow-inner transition-transform group-hover:scale-105" 
                      style={{ 
                        background: fabric.image.startsWith('data:') || fabric.image.startsWith('http') 
                          ? `url(${fabric.image}) center/cover no-repeat` 
                          : fabric.image 
                      }} 
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate text-sm sm:text-[15px] font-bold text-foreground">{fabric.name}</h3>
                      <div className="mt-0.5 flex items-center gap-2">
                        <Badge variant="sage" className="text-[9px] sm:text-[10px]">{fabric.fabricType}</Badge>
                        <span className="text-xs font-medium text-muted-light">${fabric.price}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end border-t border-border-light pt-3 sm:border-0 sm:pt-0">
                    <Badge variant="green" dot className="bg-primary-muted/20 text-primary-dark">Active</Badge>
                    <span className="text-[10px] font-bold text-muted-light uppercase tracking-widest sm:hidden">Listing Status</span>
                  </div>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-border py-16 text-center">
                <div className="mb-4 text-3xl">📦</div>
                <p className="text-sm font-bold text-foreground">No active listings</p>
                <p className="mt-1 text-xs text-muted-light">Share your deadstock with the world.</p>
              </div>
            )}
          </div>
        </section>

        {/* Section: Claimed Fabrics */}
        <section className="animate-in fade-in duration-1000 delay-500">
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Claimed Collection</h2>
          </div>
          <div className="flex flex-col gap-4">
            {loading ? (
              [1, 2].map(i => (
                <Card key={i} padding="sm" className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 shrink-0 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </Card>
              ))
            ) : claimedFabrics.length > 0 ? (
              claimedFabrics.map((fabric) => (
                <Card key={fabric.id} padding="sm" className="group flex flex-col sm:flex-row sm:items-center gap-4 border-dashed border-primary-muted/50 bg-primary-muted/5">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div 
                      className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl opacity-80 shadow-sm transition-transform group-hover:scale-105" 
                      style={{ 
                        background: fabric.image.startsWith('data:') || fabric.image.startsWith('http') 
                          ? `url(${fabric.image}) center/cover no-repeat` 
                          : fabric.image 
                      }} 
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate text-sm sm:text-[15px] font-bold text-foreground">{fabric.name}</h3>
                      <div className="mt-0.5 flex items-center gap-2">
                        <Badge variant="sky" className="text-[9px] sm:text-[10px]">{fabric.mill}</Badge>
                        <span className="text-xs font-medium text-muted-light">{fabric.yardage} yds</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end border-t border-border-light pt-3 sm:border-0 sm:pt-0">
                    <Badge variant="cream" className="bg-white border border-border text-[10px]">Owned</Badge>
                    <span className="text-[10px] font-bold text-muted-light uppercase tracking-widest sm:hidden">Collection Status</span>
                  </div>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-border py-16 text-center">
                <div className="mb-4 text-3xl">🏷️</div>
                <p className="text-sm font-bold text-foreground">Nothing claimed yet</p>
                <p className="mt-1 text-xs text-muted-light">Find unique textiles in the fabric feed.</p>
                <Link href="/">
                  <Button variant="ghost" size="sm" className="mt-3 text-primary-dark underline">Browse Feed</Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
