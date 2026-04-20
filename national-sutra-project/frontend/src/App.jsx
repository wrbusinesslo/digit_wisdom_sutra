import React, { useState, useEffect } from 'react';
import { Play, Upload, X, User, FileText, Mic, Camera, Globe, Check } from 'lucide-react';

// 替換為圖片中的真實經文與排版 (包含標題、譯者與內文)
const RAW_SUTRA = 
  "大般若波羅蜜多經卷第四百一　　　　　　　" + 
  "　　唐三藏法師玄奘奉　詔譯　　　　　　　" + 
  "　　第二分緣起品第一　　　　　　　　　　" + 
  "如是我聞一時薄伽梵住王舍城鷲峯山中與大苾" + 
  "芻眾五千人俱皆阿羅漢諸漏已盡無復煩惱得真" + 
  "自在心善解脫慧善解脫如調慧馬亦如大龍已作" + 
  "所作已辦所辦棄諸重擔逮得己利盡諸有結正知" + 
  "解脫至心自在第一究竟除阿難陀獨居學地得預" + 
  "流果具壽善現而為上首復有五百苾芻尼眾皆阿" + 
  "羅漢尊者持譽而為上首復有無量鄔波索迦鄔波";

// 預先設定的 Sample 認領資料 (包含圖片、作者、介紹等)
const CLAIMED_SAMPLES = {
  22: { char: '唐', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7gQkmsLz_lgi2qpnixbfLe2bnR7Ap7djAyw&s', author: '大慈恩書會', authorImageUrl: 'https://i.pravatar.cc/150?u=tang', authorIntro: '專注於唐代楷書研究，致力於重現大唐盛世的文化氣象。', artworkIntro: '此「唐」字以歐體為基調，法度嚴謹，筆力險峻，展現大唐帝國的宏大與威儀。' },
  23: { char: '三', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/TWHW3.svg/3840px-TWHW3.svg.png', author: '一念法師', authorImageUrl: 'https://i.pravatar.cc/150?u=san', authorIntro: '出家三十載，雲遊四方，以字為課，以墨為禪。', artworkIntro: '「三」字筆劃最簡，卻含萬物之理。書寫時心無旁騖，以極簡之筆墨，祈願三寶長存世間。' },
  24: { char: '藏', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTar4x_hNtDhJAYPry4qvFr67s0J28dd8HAA&s', author: '無盡意', authorImageUrl: 'https://i.pravatar.cc/150?u=zang', authorIntro: '佛學愛好者，深信經典中蘊含無盡的寶藏與智慧。', artworkIntro: '「藏」如寶庫。字體結構緊密，墨色厚重，象徵大藏經中深廣無涯的佛法智慧，等待眾生發掘。' },
  25: { char: '法', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6PkcgYX0-dsaCmeuFfGMYA5xkQLcwLAEEBA&s', author: '明心書苑', authorImageUrl: 'https://i.pravatar.cc/150?u=fa', authorIntro: '一群愛好書法的同修，定期聚會抄經，以書寫淨化心靈。', artworkIntro: '法如流水，能洗滌塵垢。字體採用行楷，帶有些許流動感，表現佛法活潑潑的生命力。' },
  26: { char: '師', imageUrl: 'https://lh6.googleusercontent.com/proxy/LeLwWFq4WPj8Glv8bb4LPmAhlIelBF6jzxddOVSE-znp5Du8WL0XoH6UfH5vPxdrB0tWasgDGBuG9HR_ID17dvlBSCQ1e9pl7cD1QpTsGlGIyaf6N_W09T8', author: '玄墨', authorImageUrl: 'https://i.pravatar.cc/150?u=shi', authorIntro: '書法教育工作者，期盼將傳統文化向下扎根。', artworkIntro: '「師」者，傳道授業解惑。筆觸穩健有力，象徵歷代祖師大德堅忍不拔、傳承法脈的宏大願力。' },
  27: { char: '玄', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCkB340LiPgDMiVLob_mC2o6zbAmJivPwsdA&s', author: '靜水', authorImageUrl: 'https://i.pravatar.cc/150?u=xuan', authorIntro: '愛好禪修與靜坐，在黑白筆墨間尋找生命的本源。', artworkIntro: '「玄」字深奧微妙。用墨偏淡，帶有空靈之感，寓意佛法幽微深邃，需靜心體會方能契入。' },
  28: { char: '奘', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX70lpveR26PTbx7EmAg1FIlizk3ZfIzY3gQ&s', author: '求法者', authorImageUrl: 'https://i.pravatar.cc/150?u=zang2', authorIntro: '景仰玄奘大師西行求法的精神，發願以一生護持佛法。', artworkIntro: '「奘」字壯大。字形開闊，筆劃雄強，藉此致敬玄奘大師當年孤身穿越沙漠，堅定不移的求法壯志。' },
  29: { char: '奉', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgAvbMcJD_gu0nfl4keJU6A23Dz01DkwVFAw&s', author: '合十', authorImageUrl: 'https://i.pravatar.cc/150?u=feng', authorIntro: '在家居士，常年參與寺院義工，以服務大眾為修行。', artworkIntro: '「奉」有恭敬供養之意。書寫時心存恭敬，字體端莊嚴謹，宛如雙手捧著珍貴的經典，供養十方。' },
  31: { char: '詔', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWwmNNfnNMqLWfsgF-JLCa7KCByNGrY39vDw&s', author: '翰林', authorImageUrl: 'https://i.pravatar.cc/150?u=zhao', authorIntro: '古代文學與書法研究者，對歷代碑帖有深入研究。', artworkIntro: '「詔」字帶有皇家敕令的權威感。筆法融合瘦金體之骨力與顏體之厚重，展現國家支持譯經的莊嚴宣告。' },
  32: { char: '譯', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg8eC4Y4xnq8TIwTYkCDTVP4zf8mBIxnlxcQ&s', author: '譯經小組', authorImageUrl: 'https://i.pravatar.cc/150?u=yi', authorIntro: '大慈恩譯經基金會義工，致力於佛典翻譯與數位化工作。', artworkIntro: '「譯」是溝通的橋樑。字體結構左右呼應，象徵梵漢語言的轉換與融合，感恩無數譯師的辛勤付出。' },
  88: { char: '羅', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFk209d7RrSyNaVSZOIDbYfsLBB0brYe1ZQQ&s', author: '筆華居士', authorImageUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', authorIntro: '修習書法與佛學十餘年，平日喜愛透過臨摹經文尋找內心的寧靜。此次參與全民大寫經，期望能將這份安定的力量透過筆墨傳遞給更多有緣人。', artworkIntro: '此「羅」字採用傳統狼毫筆與徽墨，書寫於帶有草木纖維的手工古法宣紙上。結體參考魏碑的剛健與隸書的古樸，筆劃中刻意保留飛白與墨暈，象徵世間萬法如網，雖錯綜複雜卻又條理分明，展現佛法包容萬物的慈悲與智慧。' }
};

export default function App() {
  const [sutraData, setSutraData] = useState([]);
  const [selectedChar, setSelectedChar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 新增：控制是否顯示純文字原文的狀態
  const [showOriginalText, setShowOriginalText] = useState(false);
  
  // 模擬登入狀態
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 初始化資料庫狀態 (套用 Sample 資料)
  useEffect(() => {
    const initialData = RAW_SUTRA.split('').map((char, index) => {
      if (char === '　') {
        return {
          id: `char_${index}`,
          char: char,
          status: 'empty',
        };
      }
      
      // 檢查此字元是否有對應的 Sample 資料
      const sampleData = CLAIMED_SAMPLES[index];
      const isClaimed = !!sampleData && sampleData.char === char;
      
      return {
        id: `char_${index}`,
        char: char,
        status: isClaimed ? 'published' : 'available',
        imageUrl: isClaimed ? sampleData.imageUrl : null,
        audioUrl: isClaimed ? '#' : null,
        author: isClaimed ? sampleData.author : null,
        authorImageUrl: isClaimed ? sampleData.authorImageUrl : null,
        authorIntro: isClaimed ? sampleData.authorIntro : null,
        artworkIntro: isClaimed ? sampleData.artworkIntro : null,
      };
    });
    setSutraData(initialData);
  }, []);

  const totalClaimed = sutraData.filter(d => d.status === 'published').length;
  const totalCharacters = 5000000; 
  const mockCurrentTotal = 125430 + totalClaimed; 

  const handleCharClick = (charData) => {
    setSelectedChar(charData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedChar(null);
  };

  // 將經文資料分組，每組 20 個字 (代表一行)
  const columns = [];
  for (let i = 0; i < sutraData.length; i += 20) {
    columns.push(sutraData.slice(i, i + 20));
  }

  return (
    <div className="min-h-screen bg-[#f4f1ec] text-[#2c2825] font-serif overflow-hidden flex flex-col">
      
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <filter id="stamp-edge">
            <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <header className="bg-[#e8e3d9] border-b-2 border-[#d3cabc] p-4 flex items-center justify-between shadow-sm z-10 relative">
        <div className="flex items-center space-x-4">
          {/* 大慈恩 LOGO */}
          <img 
            src="https://www.amrtf.tw/wp-content/uploads/2025/05/cropped-Group-2.png" 
            alt="大慈恩" 
            className="h-10 md:h-12 object-contain drop-shadow-sm"
          />
          {/* 專案名稱與副標題 (加上垂直分隔線增加層次感) */}
          <div className="hidden md:flex flex-col border-l-2 border-[#d3cabc] pl-4">
            <h1 className="text-lg font-bold tracking-widest text-[#5c4a3d]">全民大寫經</h1>
            <span className="text-xs text-[#8a7f72] tracking-widest mt-0.5 font-medium">數位共創平台</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-xs text-[#8a7f72] mb-1 tracking-widest">全球共創進度</div>
          <div className="text-xl font-mono font-bold tracking-wider">
            {mockCurrentTotal.toLocaleString()} <span className="text-sm font-serif font-normal">/ 5,000,000 字</span>
          </div>
          <div className="w-64 h-1 bg-[#d3cabc] mt-1 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#8c6f52] transition-all duration-1000"
              style={{ width: `${(mockCurrentTotal / totalCharacters) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="flex items-center text-[#5c4a3d] hover:text-[#2c2825] transition-colors">
            <Globe className="w-5 h-5 mr-1" />
            <span className="text-sm">參與地圖</span>
          </button>
          {!isLoggedIn ? (
            <button 
              onClick={() => setIsLoggedIn(true)}
              className="bg-[#8c6f52] text-[#f4f1ec] px-4 py-2 rounded-md text-sm hover:bg-[#6e563f] transition-colors"
            >
              登入參與
            </button>
          ) : (
            <div className="flex items-center text-[#5c4a3d]">
              <User className="w-5 h-5 mr-1" />
              <span className="text-sm">善知識</span>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-x-auto overflow-y-auto p-8 relative scrollbar-hide flex justify-center bg-[#e8e3d9]">
        
        {/* 切換顯示原文/作品的懸浮按鈕 */}
        <div className="fixed top-24 right-8 z-20">
          <button 
            onClick={() => setShowOriginalText(!showOriginalText)}
            className="flex items-center bg-[#fdfbf7] text-[#5c4a3d] px-4 py-2 rounded shadow-md hover:bg-[#f4f1ec] transition-colors border border-[#d3cabc] font-bold tracking-widest text-sm"
          >
            {showOriginalText ? (
              <><Camera className="w-4 h-4 mr-2" /> 顯示作品</>
            ) : (
              <><FileText className="w-4 h-4 mr-2" /> 顯示原文</>
            )}
          </button>
        </div>

        <div className="mx-auto pb-12 pt-4">
          <div className="border-[6px] border-[#2c2825] p-1 bg-[#fdfbf7] inline-block shadow-2xl">
            <div className="border-[2px] border-[#2c2825] flex flex-row-reverse divide-x divide-x-reverse divide-[#2c2825]">
              {columns.map((col, colIndex) => (
                <div key={colIndex} className="flex flex-col">
                  {col.map((data) => (
                    <div 
                      key={data.id}
                      onClick={() => data.status !== 'empty' && handleCharClick(data)}
                      className={`
                        w-[48px] h-[48px] flex items-center justify-center transition-all duration-300
                        ${data.status === 'empty' ? 'cursor-default' : 'cursor-pointer'}
                        ${data.status === 'available' ? 'hover:bg-[#d3cabc]/40 text-[#2c2825]' : ''}
                      `}
                      title={data.status === 'published' ? `點擊聆聽 ${data.author} 的創作` : data.status === 'available' ? `點擊認領「${data.char}」` : ''}
                    >
                      {data.status === 'published' && !showOriginalText ? (
                        <div className="relative w-full h-full p-0.5 hover:scale-110 hover:z-10 transition-transform cursor-pointer">
                          <img src={data.imageUrl} alt={data.char} className="w-full h-full object-cover" />
                          <div className="absolute bottom-1 right-1 bg-black/60 rounded-sm p-0.5">
                            <Play className="w-2 h-2 text-white" />
                          </div>
                        </div>
                      ) : (
                        <span 
                          className="text-3xl tracking-tighter text-[#1a1714] opacity-90" 
                          style={{ 
                            fontFamily: '"LiSu", "隸書", "BiauKai", "DFKai-SB", "Kaiti", "STKaiti", "Noto Serif TC", serif',
                            fontWeight: 400, 
                            filter: 'url(#stamp-edge)', 
                            textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.15)' 
                          }}
                        >
                          {data.char === '　' ? '' : data.char}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* 互動視窗 (Modal) */}
      {isModalOpen && selectedChar && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 py-8">
          <div className="bg-[#f4f1ec] w-full max-w-4xl max-h-full rounded-lg shadow-2xl flex flex-col overflow-hidden border border-[#d3cabc]">
            
            <div className="flex justify-between items-center p-4 border-b border-[#d3cabc] bg-[#e8e3d9] shrink-0">
              <h2 className="text-xl text-[#5c4a3d] font-bold">
                {selectedChar.status === 'published' ? '數位眾生相：作品賞析' : '認領共創字元'}
              </h2>
              <button onClick={closeModal} className="text-[#8a7f72] hover:text-[#2c2825]">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col md:flex-row gap-8 overflow-y-auto">
              
              {/* 左側：字元/作品展示區 */}
              <div className="flex-1 flex flex-col items-center shrink-0">
                <div className="bg-white p-4 border border-[#e8e3d9] rounded shadow-inner w-full flex flex-col items-center justify-center sticky top-0">
                  {selectedChar.status === 'published' ? (
                    <img src={selectedChar.imageUrl} alt="User Creation" className="w-64 h-64 object-cover border-2 border-[#8c6f52] p-1" />
                  ) : (
                    <div className="w-64 h-64 border-2 border-dashed border-[#d3cabc] flex items-center justify-center text-8xl text-[#d3cabc] font-serif">
                      {selectedChar.char}
                    </div>
                  )}
                  <div className="mt-4 text-center">
                    <p className="text-sm text-[#8a7f72] uppercase tracking-widest">Pinyin</p>
                    <p className="font-mono text-xl">{selectedChar.char === '羅' ? 'luó' : selectedChar.char === '佛' ? 'fó' : '...'}</p>
                  </div>
                </div>
              </div>

              {/* 右側：動態表單與資訊區 */}
              <div className="flex-1 flex flex-col">
                
                {selectedChar.status === 'published' ? (
                  // 【狀態：已出版】展示作者自介與作品介紹
                  <div className="space-y-6">
                    {/* 作者資訊區 */}
                    <div className="flex items-start space-x-4 bg-[#e8e3d9] p-4 rounded border border-[#d3cabc]">
                      <img src={selectedChar.authorImageUrl} alt={selectedChar.author} className="w-16 h-16 rounded-full object-cover border-2 border-[#8c6f52] shadow-sm shrink-0" />
                      <div>
                        <h3 className="font-bold text-lg text-[#5c4a3d] flex items-center">
                          {selectedChar.author}
                          <span className="ml-2 text-xs bg-[#8c6f52] text-white px-2 py-0.5 rounded-full font-normal">創作者</span>
                        </h3>
                        <p className="text-sm text-[#5c4a3d] mt-2 leading-relaxed">
                          {selectedChar.authorIntro}
                        </p>
                      </div>
                    </div>

                    {/* 作品介紹區 */}
                    <div>
                      <h4 className="text-[#8c6f52] font-bold mb-2 flex items-center">
                        <FileText className="w-5 h-5 mr-1" /> 創作心得與介紹
                      </h4>
                      <div className="bg-white p-4 rounded border border-[#d3cabc] text-[#5c4a3d] leading-relaxed text-sm">
                        {selectedChar.artworkIntro}
                      </div>
                    </div>

                    {/* 語音播放區 */}
                    <button className="w-full flex items-center justify-center space-x-2 bg-[#8c6f52] text-white py-4 rounded hover:bg-[#6e563f] transition-colors shadow-sm">
                      <Play className="w-5 h-5" />
                      <span className="font-bold tracking-wider">聆聽創作者誦讀 (3秒)</span>
                    </button>
                  </div>
                ) : (
                  // 【狀態：未認領】上傳表單
                  <>
                    {!isLoggedIn ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-12">
                        <User className="w-16 h-16 text-[#d3cabc]" />
                        <p className="text-[#5c4a3d] text-lg">請先綁定帳號以認領此字元</p>
                        <button onClick={() => setIsLoggedIn(true)} className="bg-[#8c6f52] text-white px-8 py-3 rounded shadow hover:bg-[#6e563f] transition-colors">
                          Google 授權登入
                        </button>
                      </div>
                    ) : (
                      <form className="flex flex-col space-y-5" onSubmit={(e) => { e.preventDefault(); closeModal(); }}>
                        
                        {/* 1. 作者照片上傳 */}
                        <div>
                          <label className="block text-sm text-[#5c4a3d] mb-1 font-bold">1. 作者照片上傳</label>
                          <button type="button" className="w-full border-2 border-dashed border-[#d3cabc] p-3 text-[#8a7f72] hover:bg-[#e8e3d9] transition-colors flex justify-center items-center rounded bg-white">
                            <User className="w-5 h-5 mr-2" /> 選擇頭像圖片...
                          </button>
                        </div>

                        {/* 2. 作者自介(限500字) */}
                        <div>
                          <label className="block text-sm text-[#5c4a3d] mb-1 font-bold flex justify-between">
                            <span>2. 作者自介</span>
                            <span className="text-[#8a7f72] font-normal">限 500 字</span>
                          </label>
                          <textarea className="w-full border border-[#d3cabc] bg-white p-3 rounded h-24 text-sm focus:outline-none focus:border-[#8c6f52]" placeholder="請簡單介紹您的背景或學佛經歷..."></textarea>
                        </div>

                        {/* 3. 作品上傳 */}
                        <div>
                          <label className="block text-sm text-[#5c4a3d] mb-1 font-bold">3. 作品上傳 (強制 1:1 正方形)</label>
                          <button type="button" className="w-full border-2 border-dashed border-[#d3cabc] p-3 text-[#8a7f72] hover:bg-[#e8e3d9] transition-colors flex justify-center items-center rounded bg-white">
                            <Camera className="w-5 h-5 mr-2" /> 選擇實體創作或描字圖檔...
                          </button>
                        </div>

                        {/* 4. 作品介紹(限1000字) */}
                        <div>
                          <label className="block text-sm text-[#5c4a3d] mb-1 font-bold flex justify-between">
                            <span>4. 作品介紹與創作心得</span>
                            <span className="text-[#8a7f72] font-normal">限 1000 字</span>
                          </label>
                          <textarea className="w-full border border-[#d3cabc] bg-white p-3 rounded h-32 text-sm focus:outline-none focus:border-[#8c6f52]" placeholder="分享您創作這個字元的理念、使用的媒材，或是寫下您的發願..."></textarea>
                        </div>

                        {/* 5. 錄製音軌(3秒) */}
                        <div>
                          <label className="block text-sm text-[#5c4a3d] mb-1 font-bold">5. 錄製音軌 (3秒)</label>
                          <button type="button" className="w-full bg-[#e8e3d9] p-3 text-[#5c4a3d] hover:bg-[#d3cabc] transition-colors flex justify-center items-center rounded shadow-sm">
                            <Mic className="w-5 h-5 mr-2" /> 點擊開始網頁錄音
                          </button>
                        </div>

                        {/* 6. 上傳音軌 */}
                        <div>
                          <label className="block text-sm text-[#5c4a3d] mb-1 font-bold">6. 上傳音軌 (若不使用網頁錄音)</label>
                          <button type="button" className="w-full border-2 border-dashed border-[#d3cabc] p-3 text-[#8a7f72] hover:bg-[#e8e3d9] transition-colors flex justify-center items-center rounded bg-white">
                            <Upload className="w-5 h-5 mr-2" /> 選擇音訊檔案 (最大 2MB)...
                          </button>
                        </div>

                        {/* 7. 交件 */}
                        <div className="pt-4 border-t border-[#d3cabc]">
                          <button type="submit" className="w-full bg-[#8c6f52] text-white py-4 rounded hover:bg-[#6e563f] transition-colors flex justify-center items-center font-bold tracking-widest text-lg shadow-md">
                            <Check className="w-6 h-6 mr-2" /> 正式交件
                          </button>
                          <p className="text-xs text-center text-[#8a7f72] mt-3">
                            交件即代表您同意大慈恩基金會之隱私權與數位著作授權條款
                          </p>
                        </div>

                      </form>
                    )}
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}