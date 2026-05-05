"use client";

import PageWrapper from "@/components/PageWrapper";
import { Button, Input, Toast } from "@/components/ui";
import { useState } from "react";
import { useFabrics } from "@/context/FabricContext";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const { addFabric } = useFabrics();
  const router = useRouter();

  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    fabricType: "",
    color: "",
    colorHex: "#e8e4dd", // default beige
    previewImage: "",
    yardage: "",
    price: "",
    mill: "Local Deadstock",
  });

  // Real AI Analysis Integration (Gemini)
  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    setToast({ visible: true, message: "AI analyzing fabric details..." });

    try {
      // 1. Convert file to base64 for API and Preview
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

      setFormData(prev => ({ ...prev, previewImage: base64 }));

      // 2. Call our API route
      const response = await fetch("/api/analyze-fabric", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64 }),
      });


      if (!response.ok) throw new Error("AI Analysis failed");

      const analysis = await response.json();

      // 3. Update form with real results
      setFormData((prev) => ({
        ...prev,
        fabricType: analysis.fabricType,
        color: analysis.color,
        colorHex: analysis.colorHex,
        name: analysis.suggestedName,
      }));

      setToast({ visible: true, message: "Real AI Analysis complete! ✨" });
    } catch (error) {
      console.error("AI Error:", error);
      setToast({ visible: true, message: "AI failed to analyze. Using manual entry. ⚠️" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) analyzeImage(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) analyzeImage(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    setLoading(true);

    // Simulate upload delay
    await new Promise((r) => setTimeout(r, 1000));

    addFabric({
      name: formData.name,
      fabricType: formData.fabricType || "Textile",
      color: formData.color || "Multi",
      colorHex: formData.colorHex,
      yardage: Number(formData.yardage) || 0,
      price: Number(formData.price) || 0,
      image: formData.previewImage || "linear-gradient(135deg, #f0e6d3 0%, #e8e4dd 100%)",
      mill: formData.mill,
    });

    setToast({ visible: true, message: "Fabric listed successfully! Redirecting..." });

    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  return (
    <PageWrapper className="flex items-start justify-center py-12">
      <div className="w-full max-w-lg">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
          Upload Listing
        </h1>
        <p className="mb-8 text-sm text-muted">
          Add your deadstock items to the marketplace.
        </p>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Image upload area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={onDrop}
            onClick={() => document.getElementById("fileInput")?.click()}
            className={`relative flex h-56 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[2rem] border-2 border-dashed transition-all duration-300 ${dragActive
              ? "border-primary-dark bg-primary-muted/40"
              : "border-border bg-card hover:border-primary hover:bg-primary-muted/10"
              } ${isAnalyzing ? "animate-pulse border-primary" : ""}`}
          >
            {formData.previewImage ? (
              <img
                src={formData.previewImage}
                alt="Fabric Preview"
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />
            ) : null}

            <div className="relative z-10 flex flex-col items-center">
              <input
                id="fileInput"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              {isAnalyzing ? (
                <>
                  <div className="mb-2 h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span className="text-sm font-black uppercase tracking-widest text-primary">AI Analyzing...</span>
                </>
              ) : (
                <>
                  <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl ${formData.previewImage ? 'bg-white/90 shadow-xl' : 'bg-primary-muted/30'} text-primary-dark transition-all`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <span className={`text-sm font-black uppercase tracking-widest ${formData.previewImage ? 'text-foreground' : 'text-muted-light'}`}>
                    {formData.previewImage ? "Change Image" : "Drop Fabric Image"}
                  </span>
                </>
              )}
            </div>
          </div>

          <Input
            id="name"
            label="Listing Name"
            placeholder="e.g. Vintage Indigo Denim"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="fabricType"
              label="Fabric Type"
              placeholder="e.g. Denim, Silk"
              value={formData.fabricType}
              onChange={handleChange}
            />
            <Input
              id="color"
              label="Color"
              placeholder="e.g. Indigo, Cream"
              value={formData.color}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="price"
              label="Price ($)"
              type="number"
              placeholder="0.00"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <Input
              id="yardage"
              label="Yardage"
              type="number"
              placeholder="0"
              value={formData.yardage}
              onChange={handleChange}
            />
          </div>

          <Input
            id="mill"
            label="Mill / Source"
            placeholder="e.g. Local Mill, Deadstock Source"
            value={formData.mill}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            className="mt-2"
            disabled={loading}
          >
            {loading ? "Listing..." : "Publish Listing"}
          </Button>
        </form>
      </div>

      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </PageWrapper>
  );
}
