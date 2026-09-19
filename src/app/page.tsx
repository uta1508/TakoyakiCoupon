import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

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
              <Image src="/logo.png" alt="GRAND MAISON HOSOYA" fill className="object-contain object-center" />
            </a>
          </div>
          <nav className="hidden md:flex gap-10 justify-start pl-8">
            <a href="#menu" className="text-base font-en font-semibold tracking-widest text-[#111111] hover:text-[#C5A059] uppercase transition-colors">Menu</a>
            <a href="#access" className="text-base font-en font-semibold tracking-widest text-[#111111] hover:text-[#C5A059] uppercase transition-colors">Access</a>
          </nav>
        </div>
      </header>

      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080/111/222?text=Atmospheric+Texture')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/70 to-[#F5F5F5]"></div>

        <div className="relative z-10 container mx-auto px-6 h-full flex flex-col md:flex-row justify-center md:justify-between items-center pt-20">
          <div className="order-2 md:order-1 mt-12 md:mt-0 w-full md:w-1/2 flex justify-center md:justify-start lg:pl-12">
            <div className="border-l border-[#C5A059] pl-6 py-2 text-left">
              <p className="font-en font-semibold text-[#C5A059] tracking-[0.2em] text-sm mb-2">LIMITED OPEN</p>
              <p className="text-[#111111] text-lg tracking-wider font-en font-semibold">2026.09.26 <span className="text-sm mx-1">SAT</span> - 09.27 <span className="text-sm mx-1">SUN</span></p>
              <p className="text-gray-600 text-sm mt-1">09:00 - 15:00</p>
            </div>
          </div>
          <div className="order-1 md:order-2 w-full md:w-1/2 flex justify-center md:justify-end md:pr-12 lg:pr-24">
            <div className="flex h-64 gap-8 lg:gap-12">
              <h2 className="font-serif text-3xl lg:text-5xl text-[#111111] leading-loose" style={{ writingMode: 'vertical-rl', letterSpacing: '0.2em' }}>
                至高の粉もん、
              </h2>
              <h2 className="font-serif text-3xl lg:text-5xl text-[#111111] leading-loose mt-12" style={{ writingMode: 'vertical-rl', letterSpacing: '0.2em' }}>
                ここに開店。
              </h2>
            </div>
          </div>
        </div>
      </section>

      <section id="concept" className="py-24 relative">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex flex-col md:flex-row gap-12 items-center">
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
          </div>
        </div>
      </section>

      <section id="news" className="py-24 bg-white relative">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="font-en text-3xl tracking-[0.3em] text-[#111111] font-bold">NEWS</h2>
            <div className="w-12 h-px bg-[#C5A059] mx-auto mt-4"></div>
          </div>
          <div className="flex flex-col gap-6">
            {newsList && newsList.length > 0 ? (
              newsList.map((news) => {
                const dateObj = new Date(news.created_at);
                const dateStr = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;
                return (
                <div key={news.id} className="border-b border-gray-200 pb-6 flex flex-col md:flex-row gap-4 md:gap-8">
                  <div className="text-[#C5A059] font-en font-bold shrink-0 w-32">
                    {dateStr}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#111111] mb-2">{news.title}</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{news.content}</p>
                  </div>
                </div>
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
          <div className="text-center mb-16 lg:mb-24">
            <h2 className="font-en text-3xl tracking-[0.3em] text-[#111111] font-bold">MENU</h2>
            <div className="w-12 h-px bg-[#C5A059] mx-auto mt-4"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
            <div className="group cursor-pointer">
              <div className="relative aspect-[4/3] bg-gray-100 mb-6 overflow-hidden">
                <img src="https://placehold.co/800x600/cccccc/333333?text=Takoyaki+Art" alt="ソースたこ焼き" className="object-cover w-full h-full grayscale-[50%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
              </div>
              <div className="flex justify-between items-baseline mb-3">
                <h3 className="font-serif text-2xl text-[#111111] font-bold">ソースたこ焼き</h3>
                <span className="text-xl text-[#C5A059] font-en tracking-widest font-bold">¥500</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                外はカリッと香ばしく、中はトロッと熱々。<br/>
                王道の旨味を極限まで追求した、当店の看板メニュー。濃厚な特製ソースが後を引く一品です。
              </p>
            </div>
            <div className="group cursor-pointer lg:mt-24">
              <div className="relative aspect-[4/3] bg-gray-100 mb-6 overflow-hidden">
                <img src="https://placehold.co/800x600/cccccc/333333?text=Akashiyaki+Art" alt="明石焼き" className="object-cover w-full h-full grayscale-[50%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
              </div>
              <div className="flex justify-between items-baseline mb-3">
                <h3 className="font-serif text-2xl text-[#111111] font-bold">明石焼き</h3>
                <span className="text-xl text-[#C5A059] font-en tracking-widest font-bold">¥600</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                ふわふわの生地に、出汁の香りが上品に広がります。<br/>
                温かい特製のお出汁にくぐらせてお召し上がりください。優しく奥深い味わいです。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="access" className="py-24 relative">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="font-en text-3xl tracking-[0.3em] text-[#111111] font-bold">INFORMATION</h2>
            <div className="w-12 h-px bg-[#C5A059] mx-auto mt-4"></div>
          </div>
          <div className="border border-gray-300 p-8 lg:p-12 relative bg-white/60 backdrop-blur-sm">
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
                <p className="font-serif text-lg text-[#111111] mb-2 font-bold">令和8年度 〇〇高校 文化祭</p>
                <div className="flex items-end gap-3 mb-6">
                  <span className="text-3xl text-[#C5A059] font-bold">3</span><span className="text-gray-800">階</span>
                  <span className="text-3xl text-[#C5A059] font-bold">3-A</span><span className="text-gray-800">教室</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  西階段を上がって右奥の教室です。<br/>
                  黒と金の装飾を目印にお越しください。
                </p>
              </div>
            </div>
          </div>
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
