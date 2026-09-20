import { createClient } from "@supabase/supabase-js";
import { FadeIn } from "@/components/FadeIn";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Server component
export default async function GalleryPage() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
  
  const { data: galleryFiles } = await supabase.storage.from("gallery").list();
  
  let galleryImages: string[] = [];
  if (galleryFiles) {
    const files = galleryFiles.filter(f => f.name !== '.emptyFolderPlaceholder');
    files.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    galleryImages = files.map(f => supabase.storage.from("gallery").getPublicUrl(f.name).data.publicUrl);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-[#111111] font-sans">
      <header className="fixed w-full top-0 z-50 transition-all duration-300 bg-white/90 backdrop-blur-md shadow-sm py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold hover:text-[#C5A059] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            HOME
          </Link>
          <a href="/" className="relative w-40 h-12 block">
            <Image src="/logo.png" alt="GRAND MAISON HOSOYA" fill sizes="160px" priority className="object-contain object-right" />
          </a>
        </div>
      </header>

      <main className="pt-32 pb-24 flex-grow">
        <div className="container mx-auto px-6 max-w-6xl">
          <FadeIn className="mb-16">
            <h1 className="font-en text-4xl tracking-[0.3em] text-[#111111] font-bold">GALLERY</h1>
            <div className="w-12 h-px bg-[#C5A059] mt-4"></div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px]">
            {galleryImages.length > 0 ? galleryImages.map((url, i) => {
              // Create a varied masonry pattern: some items are wide (col-span-2)
              const isWide = i === 1 || i === 3 || i === 6 || i === 8;
              const spanClass = isWide ? "md:col-span-2" : "md:col-span-1";
              
              return (
                <FadeIn key={i} delay={0.05 * (i % 10)} className={`relative overflow-hidden bg-gray-100 group ${spanClass}`}>
                  <img src={url} alt={`Gallery photo ${i+1}`} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
                </FadeIn>
              );
            }) : (
              <div className="col-span-full py-24 text-center text-gray-400 font-en tracking-widest">
                NO PHOTOS YET
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="border-t border-gray-300 py-8 text-center bg-white">
        <p className="text-xs tracking-[0.2em] text-gray-400">
          &copy; 2026 GRAND MAISON HOSOYA. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}
