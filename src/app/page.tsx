import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { FadeIn } from "@/components/FadeIn";
import { HeroVideoBackground } from "@/components/HeroVideoBackground";

// キャッシュを無効にして常に最新のニュースを取得する
export const revalidate = 0;

export default async function Home() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const { data: newsList } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="bg-[#F5F5F5] text-[#111111] font-sans font-light selection:bg-[#C5A059] selection:text-white transition-colors duration-500">
      <header className="fixed w-full top-0 z-50 transition-all duration-300 bg-white/90 backdrop-blur-md shadow-sm py-4" id="header">
        <div className="container mx-auto px-6 flex justify-center md:grid md:grid-cols-3 items-center">
          <nav className="hidden md:flex gap-10 justify-end pr-8">
            <a href="#concept" className="text-base font-en font-semibold tracking-widest text-[#111111] hover:text-[#C5A059] uppercase transition-colors">Concept</a>
            <a href="#news" className="text-base font-en font-semibold tracking-widest text-[#111111] hover:text-[#C5A059] uppercase transition-colors">News</a>
          </nav>
          <div className="flex justify-center">
            <a href="#" className="relative w-56 h-16 md:w-72 md:h-20 block">
              <Image src="/logo.png" alt="GRAND MAISON HOSOYA" fill sizes="(max-width: 768px) 224px, 288px" priority className="object-contain object-center" />
            </a>
          </div>
          <nav className="hidden md:flex gap-10 justify-start pl-8">
            <a href="#menu" className="text-base font-en font-semibold tracking-widest text-[#111111] hover:text-[#C5A059] uppercase transition-colors">Menu</a>
            <a href="https://www.nichidai3.ed.jp/sankousai2026/access/" target="_blank" rel="noopener noreferrer" className="text-base font-en font-semibold tracking-widest text-[#111111] hover:text-[#C5A059] uppercase transition-colors">Access</a>
          </nav>
        </div>
      </header>

      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#F8F9FA]">
        <HeroVideoBackground />

        <div className="relative z-10 container mx-auto px-6 h-full flex flex-col md:flex-row justify-center md:justify-between items-center pt-20">
          <div className="order-2 md:order-1 mt-12 md:mt-0 w-full md:w-1/2 flex justify-center md:justify-start lg:pl-12">
            <FadeIn delay={0.8} className="border-l border-[#C5A059] pl-6 py-2 text-left">
              <p className="font-en font-semibold text-[#C5A059] tracking-[0.2em] text-sm mb-2">LIMITED OPEN</p>
              <p className="text-white text-lg tracking-wider font-en font-semibold">2026.09.26 <span className="text-sm mx-1">SAT</span> - 09.27 <span className="text-sm mx-1">SUN</span></p>
              <p className="text-white/80 text-sm mt-1">09:00 - 15:00</p>
            </FadeIn>
          </div>
          <div className="order-1 md:order-2 w-full md:w-1/2 flex justify-center md:justify-end md:pr-12 lg:pr-24">
            <div className="flex h-auto gap-4 lg:gap-8 justify-end">
              <FadeIn delay={0.6}><p className="font-serif text-xl lg:text-2xl text-[#C5A059] leading-loose mt-12 drop-shadow-md" style={{ writingMode: 'vertical-rl', letterSpacing: '0.2em' }}>
                賞味期限、わずか１分。
              </p></FadeIn>
              <FadeIn delay={0.3}><h2 className="font-serif text-4xl lg:text-6xl text-white leading-[2.5] drop-shadow-lg" style={{ writingMode: 'vertical-rl', letterSpacing: '0.2em' }}>
                至高の粉もん、<br/>ここに開店。
              </h2></FadeIn>
            </div>
          </div>
        </div>
      </section>

      <section id="concept" className="py-24 relative">
        <div className="container mx-auto px-6 max-w-4xl">
          <FadeIn className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/3">
              <h3 className="text-[#C5A059] text-4xl lg:text-5xl tracking-widest opacity-30 font-en font-semibold">CONCEPT</h3>
              <h2 className="text-2xl lg:text-3xl mt-[-1.5rem] ml-4 lg:ml-8 text-[#111111] font-serif font-bold">洗練と、<br/>情熱のひとくち。</h2>
            </div>
            <div className="md:w-2/3">
              <p className="leading-loose text-gray-700 text-sm lg:text-base text-justify">
                文化祭という非日常の空間に、最高の一皿を。<br/>
                「グランメゾン細谷」は、お祭りの定番であるたこ焼きと明石焼きに、<br className="hidden md:block"/>
                フレンチの精神のような繊細なこだわりを込めました。<br/><br/>
                厳選した粉、計算し尽くされた火入れ。<br/>
                外はカリッと、中はとろけるような極上の食感。<br/>
                たかが粉もん、されど粉もん。<br/>
                私たちの本気を、ぜひご賞味ください。
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="news" className="py-24 bg-white relative">
        <div className="container mx-auto px-6 max-w-4xl">
          <FadeIn className="text-center mb-16">
            <h2 className="font-en text-3xl tracking-[0.3em] text-[#111111] font-bold">NEWS</h2>
            <div className="w-12 h-px bg-[#C5A059] mx-auto mt-4"></div>
          </FadeIn>
          <div className="flex flex-col gap-6">
            {newsList && newsList.length > 0 ? (
              newsList.map((news, idx) => {
                const dateObj = new Date(news.created_at);
                const dateStr = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;
                return (
                <FadeIn key={news.id} delay={0.1 * idx} className="border-b border-gray-200 pb-6 flex flex-col md:flex-row gap-4 md:gap-8">
                  <div className="text-[#C5A059] font-en font-bold shrink-0 w-32">
                    {dateStr}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#111111] mb-2">{news.title}</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{news.content}</p>
                  </div>
                </FadeIn>
                );
              })
            ) : (
              <p className="text-center text-gray-500">お知らせはありません。</p>
            )}
          </div>
        </div>
      </section>

      <section id="menu" className="py-24 bg-white relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <FadeIn className="text-center mb-16 lg:mb-24">
            <h2 className="font-en text-3xl tracking-[0.3em] text-[#111111] font-bold">MENU</h2>
            <div className="w-12 h-px bg-[#C5A059] mx-auto mt-4 mb-8"></div>
            <div className="inline-block border border-[#C5A059]/30 bg-white px-8 py-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-2 tracking-widest">全品共通価格</p>
              <div className="flex justify-center gap-8 font-en">
                <div><span className="text-sm text-gray-500 tracking-widest mr-2">4個入</span><span className="text-2xl text-[#C5A059] font-bold">¥200</span></div>
                <div><span className="text-sm text-gray-500 tracking-widest mr-2">6個入</span><span className="text-2xl text-[#C5A059] font-bold">¥300</span></div>
              </div>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
            <FadeIn delay={0.1}><div className="group cursor-pointer">
              <div className="relative aspect-[4/3] bg-gray-100 mb-6 overflow-hidden">
                <img src="/sauce_takoyaki.jpg" alt="ソースたこ焼き" className="object-cover w-full h-full grayscale-[50%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/40 backdrop-blur-md text-white/90 text-[10px] tracking-widest rounded shadow-sm">
                  ※写真はイメージです。実際の商品とは完全に異なります。
                </div>
              </div>
              <div className="flex justify-between items-baseline mb-3">
                <h3 className="font-serif text-2xl text-[#111111] font-bold">ソースたこ焼き</h3>
                
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                外はカリッと香ばしく、中はトロッと熱々。<br/>
                王道の旨味を極限まで追求した、当店の看板メニュー。濃厚な特製ソースが後を引く一品です。
              </p>
            </div></FadeIn>
            <FadeIn delay={0.3}><div className="group cursor-pointer">
              <div className="relative aspect-[4/3] bg-gray-100 mb-6 overflow-hidden">
                <img src="/akashiyaki.jpg" alt="明石焼き" className="object-cover w-full h-full grayscale-[50%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/40 backdrop-blur-md text-white/90 text-[10px] tracking-widest rounded shadow-sm">
                  ※写真はイメージです。実際の商品とは完全に異なります。
                </div>
              </div>
              <div className="flex justify-between items-baseline mb-3">
                <h3 className="font-serif text-2xl text-[#111111] font-bold">明石焼き</h3>
                
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                ふわふわの生地に、出汁の香りが上品に広がります。<br/>
                温かい特製のお出汁にくぐらせてお召し上がりください。優しく奥深い味わいです。
              </p>
            </div></FadeIn>
          </div>
        </div>
      </section>

      <section id="access" className="py-24 relative">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="font-en text-3xl tracking-[0.3em] text-[#111111] font-bold">INFORMATION</h2>
            <div className="w-12 h-px bg-[#C5A059] mx-auto mt-4"></div>
          </div>
          <FadeIn delay={0.2} className="border border-gray-300 p-8 lg:p-12 relative bg-white/60 backdrop-blur-sm">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-[#C5A059] text-sm tracking-widest mb-4 font-bold">OPENING HOURS</h3>
                <ul className="text-gray-800 space-y-3 text-sm lg:text-base">
                  <li className="flex items-center gap-4">
                    <span className="tracking-wider w-24">2026.09.26</span>
                    <span>[ 土 ]</span>
                    <span>09:00 - 15:00</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="tracking-wider w-24">2026.09.27</span>
                    <span>[ 日 ]</span>
                    <span>09:00 - 15:00</span>
                  </li>
                </ul>
                <p className="mt-6 text-xs text-gray-500">* 材料がなくなり次第、終了となる場合がございます。</p>
              </div>
              <div>
                <h3 className="text-[#C5A059] text-sm tracking-widest mb-4 font-bold">LOCATION</h3>
                <p className="font-serif text-lg text-[#111111] mb-2 font-bold">日本大学第三高等学校 三黌祭</p>
                <div className="flex items-end gap-3 mb-6">
                  <span className="text-2xl text-[#C5A059] font-bold">音楽室</span><span className="text-gray-800 font-bold">前</span>
                </div>
                <div className="text-sm text-gray-600 leading-relaxed mb-6">
                  受付から階段を上がって屋台一番奥です。
                </div>

              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <footer className="border-t border-gray-300 py-8 text-center">
        <p className="text-xs tracking-[0.2em] text-gray-400">
          &copy; 2026 GRAND MAISON HOSOYA. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}
