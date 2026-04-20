import React, { useState, useEffect, useRef } from 'react';
import { Play, Upload, X, User, FileText, Mic, Camera, Globe, Check, ArrowRight, PenTool, BookOpen, ChevronLeft, Map, Plus, Minus } from 'lucide-react';

// ==========================================
// 1. 共創卷軸資料區 (Sutra App Data)
// ==========================================
// 第 1 頁
const PAGE_1 = 
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

// 第 2 頁 (新增)
const PAGE_2 = 
  "斯迦皆已見諦復有無量無數菩薩摩訶薩眾一切" + 
  "皆得諸陀羅尼及三摩地常居空住行無相境無分" + 
  "別願恆現在前於諸法性具平等忍得無礙辯不退" + 
  "神通言行清高翹勤匪懈演揚正法無所希求應理" + 
  "稱機離諸矯誑於深法忍到究竟趣斷諸怖畏降伏" + 
  "眾魔滅一切惑摧諸業障智慧辯才善巧具足已無" + 
  "數劫大誓莊嚴含笑先言舒顏和視讚頌美妙辯說" + 
  "無窮威德尊嚴處眾無畏氣調閑雅進趣合儀巧演" + 
  "如流多劫無盡善觀諸法皆同幻事陽燄夢境水月" + 
  "響聲亦如空華鏡像光影又等變化及尋香城知皆";

// 第 3 頁 (新增)
const PAGE_3 = 
  "無實唯現似有心不下劣無畏泰然一切法門皆能" + 
  "悟入有情勝解心行所趣通達無礙而拔濟之成就" + 
  "上忍善知實性攝受大願無邊佛土普於十方無數" + 
  "諸佛等持正念常能現前為度有情歷事諸佛勸請" + 
  "久住轉正法輪滅諸隨眠見趣纏垢遊戲無量百千" + 
  "等持引發無邊殊勝善法是諸菩薩摩訶薩眾具如" + 
  "是等無量功德其名曰賢護菩薩寶性菩薩導師菩" + 
  "薩仁授菩薩星授菩薩常授菩薩德藏菩薩上慧菩" + 
  "薩寶藏菩薩勝慧菩薩增長慧菩薩不虛見菩薩善" + 
  "發趣菩薩善勇猛菩薩常精進菩薩常加行菩薩不";

// 將三頁文字串接合併，總計 600 字
const RAW_SUTRA = PAGE_1 + PAGE_2 + PAGE_3;

const CLAIMED_SAMPLES = {
  // 第 1 頁的認領資料
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
  88: { char: '羅', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFk209d7RrSyNaVSZOIDbYfsLBB0brYe1ZQQ&s', author: '筆華居士', authorImageUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', authorIntro: '修習書法與佛學十餘年，期望能將這份安定的力量透過筆墨傳遞給更多有緣人。', artworkIntro: '此「羅」字採用傳統狼毫筆與徽墨。筆劃中刻意保留飛白與墨暈，象徵世間萬法如網，雖錯綜複雜卻又條理分明。' },
  // 第 2 頁的認領資料 (展示跨頁捲動)
  212: { char: '菩', imageUrl: 'https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?q=80&w=400&auto=format&fit=crop', author: '淨空', authorImageUrl: 'https://i.pravatar.cc/150?u=pu', authorIntro: '每日晨起抄經，願以筆墨供養三寶。', artworkIntro: '以端莊楷書書寫，祈願天下無災。' },
  213: { char: '薩', imageUrl: 'https://images.unsplash.com/photo-1563804447971-6e113ab80713?q=80&w=400&auto=format&fit=crop', author: '無名氏', authorImageUrl: 'https://i.pravatar.cc/150?u=sa', authorIntro: '修行在人間，字字皆菩提。', artworkIntro: '行書帶有草意，象徵菩薩自在無礙之精神。' },
  // 第 3 頁的認領資料
  450: { char: '佛', imageUrl: 'https://images.unsplash.com/photo-1549230263-d183023e9a7e?q=80&w=400&auto=format&fit=crop', author: '安心', authorImageUrl: 'https://i.pravatar.cc/150?u=fo', authorIntro: '相信心中有佛，所見皆佛。', artworkIntro: '一筆完成，隨心所欲，願見者皆得平靜。' }
};

// ==========================================
// 2. 獨立元件：共創卷軸互動區 (Sutra App)
// ==========================================
function SutraApp({ onBack }) {
  const [sutraData, setSutraData] = useState([]);
  const [selectedChar, setSelectedChar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOriginalText, setShowOriginalText] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // --- 新增/修改：畫布縮放與拖曳的相關狀態 ---
  const [scale, setScale] = useState(1); // 縮放比例 (1 = 100%)
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
  const hasDragged = useRef(false); 

  // (已移除滑鼠滾輪縮放事件的 useEffect)

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      setIsDragging(true);
      hasDragged.current = false; 
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        scrollLeft: scrollContainerRef.current.scrollLeft,
        scrollTop: scrollContainerRef.current.scrollTop,
      };
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault(); 
    
    const walkX = (e.clientX - dragStart.current.x) * 1.5; 
    const walkY = (e.clientY - dragStart.current.y) * 1.5;
    
    if (Math.abs(walkX) > 5 || Math.abs(walkY) > 5) {
      hasDragged.current = true;
    }
    
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = dragStart.current.scrollLeft - walkX;
      scrollContainerRef.current.scrollTop = dragStart.current.scrollTop - walkY;
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };
  // ------------------------------------------

  useEffect(() => {
    const initialData = RAW_SUTRA.split('').map((char, index) => {
      if (char === '　') return { id: `char_${index}`, char: char, status: 'empty' };
      const sampleData = CLAIMED_SAMPLES[index];
      const isClaimed = !!sampleData && sampleData.char === char;
      return {
        id: `char_${index}`, char: char,
        status: isClaimed ? 'published' : 'available',
        imageUrl: isClaimed ? sampleData.imageUrl : null,
        author: isClaimed ? sampleData.author : null,
        authorImageUrl: isClaimed ? sampleData.authorImageUrl : null,
        authorIntro: isClaimed ? sampleData.authorIntro : null,
        artworkIntro: isClaimed ? sampleData.artworkIntro : null,
      };
    });
    setSutraData(initialData);
  }, []);

  const totalClaimed = sutraData.filter(d => d.status === 'published').length;
  const mockCurrentTotal = 125430 + totalClaimed; 

  const handleCharClick = (charData) => { 
    // 智慧防誤觸：如果剛剛有拖曳行為，就不觸發點擊事件
    if (hasDragged.current) return; 
    
    setSelectedChar(charData); 
    setIsModalOpen(true); 
  };
  
  const closeModal = () => { setIsModalOpen(false); setSelectedChar(null); };

  // 將資料依「頁 (每200字)」分組
  const pages = [];
  for (let i = 0; i < sutraData.length; i += 200) {
    pages.push(sutraData.slice(i, i + 200));
  }

  return (
    <div className="min-h-screen bg-[#f4f1ec] text-[#2c2825] font-serif overflow-hidden flex flex-col fade-in">
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
          <button onClick={onBack} className="p-2 text-[#8a7f72] hover:text-[#5c4a3d] hover:bg-[#d3cabc] rounded transition-colors mr-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <img src="https://www.amrtf.tw/wp-content/uploads/2025/05/cropped-Group-2.png" alt="大慈恩" className="h-10 md:h-12 object-contain" />
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
            <div className="h-full bg-[#8c6f52] transition-all duration-1000" style={{ width: `${(mockCurrentTotal / 5000000) * 100}%` }}></div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <button onClick={() => setIsLoggedIn(true)} className="bg-[#8c6f52] text-[#f4f1ec] px-4 py-2 rounded-md text-sm hover:bg-[#6e563f] transition-colors">
              登入參與
            </button>
          ) : (
            <div className="flex items-center text-[#5c4a3d]"><User className="w-5 h-5 mr-1" /><span className="text-sm">善知識</span></div>
          )}
        </div>
      </header>

      {/* 經文長卷軸展示區 */}
      <main 
        ref={scrollContainerRef}
        className={`flex-1 overflow-auto relative scrollbar-hide bg-[#e8e3d9] select-none ${isDragging ? 'cursor-grabbing' : 'cursor-auto'}`} 
        dir="rtl"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        
        {/* 右上角浮動控制列：縮放控制與原文切換 */}
        <div className="fixed top-24 right-8 z-20 flex items-center bg-[#fdfbf7] p-1.5 rounded shadow-md border border-[#d3cabc]" dir="ltr">
          {/* 縮放控制區 */}
          <div className="flex items-center space-x-1 border-r border-[#d3cabc] pr-3 mr-3">
            <button 
              onClick={() => setScale(s => Math.max(0.2, s - 0.2))} 
              className="p-1 hover:bg-[#e8e3d9] rounded text-[#5c4a3d] transition-colors"
              title="縮小"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-[#5c4a3d] font-mono text-sm w-12 text-center font-bold">
              {Math.round(scale * 100)}%
            </span>
            <button 
              onClick={() => setScale(s => Math.min(5, s + 0.2))} 
              className="p-1 hover:bg-[#e8e3d9] rounded text-[#5c4a3d] transition-colors"
              title="放大"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {/* 原文/作品切換按鈕 */}
          <button 
            onClick={() => setShowOriginalText(!showOriginalText)} 
            className="flex items-center text-[#5c4a3d] px-3 py-1 rounded hover:bg-[#e8e3d9] transition-colors font-bold tracking-widest text-sm"
          >
            {showOriginalText ? <><Camera className="w-4 h-4 mr-2" /> 顯示作品</> : <><FileText className="w-4 h-4 mr-2" /> 顯示原文</>}
          </button>
        </div>

        {/* 卷軸本體容器 
            【關鍵修正】：加入極大的 padding (py-[30vh] px-[20vw]) 撐出隱形的畫布空間，
            確保在任何縮放比例下，上下左右都有足夠的空間可以被拖曳！ */}
        <div className="w-max mx-auto py-[30vh] px-[20vw]" dir="ltr">
          <div className="border-[6px] border-[#2c2825] p-1 bg-[#fdfbf7] inline-block shadow-2xl transition-transform duration-75">
            {/* 整部卷軸 */}
            <div className="border-[2px] border-[#2c2825] flex flex-row-reverse divide-x divide-x-reverse divide-[#2c2825]">
              
              {/* 渲染每一頁 */}
              {pages.map((pageData, pageIndex) => {
                
                const pageColumns = [];
                for (let i = 0; i < pageData.length; i += 20) {
                  pageColumns.push(pageData.slice(i, i + 20));
                }

                return (
                  <div key={pageIndex} className="relative flex flex-row-reverse divide-x divide-x-reverse divide-[#2c2825] shrink-0 border-l border-dashed border-[#8c6f52]/40 last:border-l-0">
                    
                    {pageColumns.map((col, colIndex) => (
                      <div key={colIndex} className="flex flex-col shrink-0">
                        {col.map((data) => (
                          <div 
                            key={data.id} onClick={() => data.status !== 'empty' && handleCharClick(data)}
                            className={`flex items-center justify-center transition-colors ${data.status === 'empty' ? 'cursor-default' : 'cursor-pointer'} ${data.status === 'available' ? 'hover:bg-[#d3cabc]/40' : ''}`}
                            // 動態套用縮放尺寸 (預設為 48px)
                            style={{ width: `${48 * scale}px`, height: `${48 * scale}px` }}
                          >
                            {data.status === 'published' && !showOriginalText ? (
                              <div className="relative w-full h-full p-0.5 hover:scale-110 hover:z-10 transition-transform cursor-pointer">
                                <img src={data.imageUrl} alt={data.char} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <span 
                                className="tracking-tighter text-[#1a1714] opacity-90 transition-all" 
                                // 動態套用縮放字體大小 (預設為 30px)
                                style={{ 
                                  fontSize: `${30 * scale}px`,
                                  fontFamily: '"LiSu", "隸書", "BiauKai", serif', 
                                  filter: 'url(#stamp-edge)' 
                                }}
                              >
                                {data.char === '　' ? '' : data.char}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                    
                    {/* 分頁標籤：固定在該頁的底部中央 (同樣隨著縮放微調位置) */}
                    <div className="absolute left-0 w-full flex justify-center pointer-events-none" style={{ bottom: `-${50 * scale}px` }}>
                      <span 
                        className="text-[#8a7f72] font-mono tracking-widest border border-[#d3cabc] px-4 py-1.5 rounded-sm bg-[#fdfbf7] shadow-sm"
                        style={{ fontSize: `${Math.max(12, 12 * scale)}px` }}
                      >
                        第 {pageIndex + 1} 頁
                      </span>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        </div>
      </main>

      {/* Modal 程式碼 */}
      {isModalOpen && selectedChar && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 py-8">
           <div className="bg-[#f4f1ec] w-full max-w-4xl max-h-full rounded-lg shadow-2xl flex flex-col overflow-hidden border border-[#d3cabc]">
             <div className="flex justify-between items-center p-4 border-b border-[#d3cabc] bg-[#e8e3d9] shrink-0">
               <h2 className="text-xl text-[#5c4a3d] font-bold">{selectedChar.status === 'published' ? '數位眾生相：作品賞析' : '認領共創字元'}</h2>
               <button onClick={closeModal} className="text-[#8a7f72] hover:text-[#2c2825]"><X className="w-6 h-6" /></button>
             </div>
             <div className="p-6 flex flex-col md:flex-row gap-8 overflow-y-auto">
               <div className="flex-1 flex flex-col items-center shrink-0">
                  <div className="bg-white p-4 border border-[#e8e3d9] rounded shadow-inner w-full flex flex-col items-center justify-center sticky top-0">
                    {selectedChar.status === 'published' ? (
                      <img src={selectedChar.imageUrl} alt="User Creation" className="w-64 h-64 object-cover border-2 border-[#8c6f52] p-1" />
                    ) : (
                      <div className="w-64 h-64 border-2 border-dashed border-[#d3cabc] flex items-center justify-center text-8xl text-[#d3cabc] font-serif">{selectedChar.char}</div>
                    )}
                  </div>
               </div>
               <div className="flex-1 flex flex-col">
                  {selectedChar.status === 'published' ? (
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4 bg-[#e8e3d9] p-4 rounded border border-[#d3cabc]">
                        <img src={selectedChar.authorImageUrl} className="w-16 h-16 rounded-full object-cover border-2 border-[#8c6f52]" />
                        <div><h3 className="font-bold text-[#5c4a3d]">{selectedChar.author}</h3><p className="text-sm mt-2">{selectedChar.authorIntro}</p></div>
                      </div>
                      <div className="bg-white p-4 rounded border border-[#d3cabc] text-sm text-[#5c4a3d]">{selectedChar.artworkIntro}</div>
                    </div>
                  ) : (
                    <>
                      {!isLoggedIn ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-8">
                          <div className="bg-[#e8e3d9] p-4 rounded-full">
                            <User className="w-10 h-10 text-[#8c6f52]" />
                          </div>
                          <div>
                            <h3 className="text-[#5c4a3d] text-xl font-bold mb-2">綁定帳號以認領字元</h3>
                            <p className="text-[#8a7f72] text-sm">請選擇您習慣的授權方式，一鍵快速登入</p>
                          </div>
                          
                          <div className="w-full max-w-xs flex flex-col space-y-3">
                            <button onClick={() => setIsLoggedIn(true)} className="w-full flex items-center justify-center space-x-2 bg-white border border-[#d3cabc] text-[#5c4a3d] px-4 py-2.5 rounded shadow-sm hover:bg-[#f4f1ec] transition-colors">
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z" />
                              </svg>
                              <span className="font-bold tracking-wider">Google 登入</span>
                            </button>
                            <button onClick={() => setIsLoggedIn(true)} className="w-full flex items-center justify-center space-x-2 bg-[#1877F2] text-white px-4 py-2.5 rounded shadow-sm hover:bg-[#1865f2] transition-colors">
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                              </svg>
                              <span className="font-bold tracking-wider">Facebook 登入</span>
                            </button>
                            <button onClick={() => setIsLoggedIn(true)} className="w-full flex items-center justify-center space-x-2 bg-[#06C755] text-white px-4 py-2.5 rounded shadow-sm hover:bg-[#05b34c] transition-colors">
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 3.54 8.846 8.361 9.581.328.071.77.218.883.504.1.258.032.656.015.811-.023.21-.144.851-.176 1.026-.051.277-.247 1.22.862.753 1.11-.468 5.992-3.53 8.2-6.046C22.682 15.111 24 12.835 24 10.304zM7.555 13.084H4.591V7.073h1.036v5.045h1.928v.966zM10.19 13.084H9.155V7.073h1.036v6.011zm5.176 0h-1.018l-2.071-3.326v3.326h-1.036V7.073h1.012l2.077 3.326V7.073h1.036v6.011zm3.882-2.311h-1.936v1.345h2.083v.966h-3.119V7.073h3.119v.965h-2.083v1.314h1.936v.965z"/>
                              </svg>
                              <span className="font-bold tracking-wider">LINE 登入</span>
                            </button>
                            <button onClick={() => setIsLoggedIn(true)} className="w-full flex items-center justify-center space-x-2 bg-black text-white px-4 py-2.5 rounded shadow-sm hover:bg-gray-800 transition-colors">
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.702z"/>
                              </svg>
                              <span className="font-bold tracking-wider">Apple 登入</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <form className="flex flex-col space-y-5" onSubmit={(e) => { e.preventDefault(); closeModal(); }}>
                          <div>
                            <label className="block text-sm text-[#5c4a3d] mb-1 font-bold">1. 作者照片上傳</label>
                            <button type="button" className="w-full border-2 border-dashed border-[#d3cabc] p-3 text-[#8a7f72] hover:bg-[#e8e3d9] transition-colors flex justify-center items-center rounded bg-white">
                              <User className="w-5 h-5 mr-2" /> 選擇頭像圖片...
                            </button>
                          </div>
                          <div>
                            <label className="block text-sm text-[#5c4a3d] mb-1 font-bold flex justify-between">
                              <span>2. 作者自介</span>
                              <span className="text-[#8a7f72] font-normal">限 500 字</span>
                            </label>
                            <textarea className="w-full border border-[#d3cabc] bg-white p-3 rounded h-24 text-sm focus:outline-none focus:border-[#8c6f52]" placeholder="請簡單介紹您的背景或學佛經歷..."></textarea>
                          </div>
                          <div>
                            <label className="block text-sm text-[#5c4a3d] mb-1 font-bold">3. 作品上傳 (強制 1:1 正方形)</label>
                            <button type="button" className="w-full border-2 border-dashed border-[#d3cabc] p-3 text-[#8a7f72] hover:bg-[#e8e3d9] transition-colors flex justify-center items-center rounded bg-white">
                              <Camera className="w-5 h-5 mr-2" /> 選擇實體創作或描字圖檔...
                            </button>
                          </div>
                          <div>
                            <label className="block text-sm text-[#5c4a3d] mb-1 font-bold flex justify-between">
                              <span>4. 作品介紹與創作心得</span>
                              <span className="text-[#8a7f72] font-normal">限 1000 字</span>
                            </label>
                            <textarea className="w-full border border-[#d3cabc] bg-white p-3 rounded h-32 text-sm focus:outline-none focus:border-[#8c6f52]" placeholder="分享您創作這個字元的理念、使用的媒材，或是寫下您的發願..."></textarea>
                          </div>
                          <div>
                            <label className="block text-sm text-[#5c4a3d] mb-1 font-bold">5. 錄製音軌 (3秒)</label>
                            <button type="button" className="w-full bg-[#e8e3d9] p-3 text-[#5c4a3d] hover:bg-[#d3cabc] transition-colors flex justify-center items-center rounded shadow-sm">
                              <Mic className="w-5 h-5 mr-2" /> 點擊開始網頁錄音
                            </button>
                          </div>
                          <div>
                            <label className="block text-sm text-[#5c4a3d] mb-1 font-bold">6. 上傳音軌 (若不使用網頁錄音)</label>
                            <button type="button" className="w-full border-2 border-dashed border-[#d3cabc] p-3 text-[#8a7f72] hover:bg-[#e8e3d9] transition-colors flex justify-center items-center rounded bg-white">
                              <Upload className="w-5 h-5 mr-2" /> 選擇音訊檔案 (最大 2MB)...
                            </button>
                          </div>
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

// ==========================================
// 3. 獨立元件：活動宣傳首頁 (Landing Page)
// ==========================================

const PulseDot = ({ top, left, label }) => (
  <div className="absolute flex flex-col items-center z-20" style={{ top, left, transform: 'translate(-50%, -50%)' }}>
    <div className="relative flex justify-center items-center">
      <span className="animate-ping absolute inline-flex h-4 w-4 md:h-6 md:w-6 rounded-full bg-[#d3cabc] opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 bg-[#fdfbf7] shadow-[0_0_10px_rgba(255,255,255,0.8)]"></span>
    </div>
    <span className="mt-2 text-[10px] md:text-xs text-[#d3cabc] tracking-widest font-bold drop-shadow-md whitespace-nowrap">{label}</span>
  </div>
);

const StatCard = ({ region, count, percent }) => (
  <div className="bg-[#2c2825]/80 backdrop-blur-sm p-4 md:p-6 rounded border border-[#8c6f52]/40 hover:border-[#d3cabc] transition-colors relative overflow-hidden group">
    <div className="absolute top-0 left-0 w-1 h-full bg-[#8c6f52] group-hover:bg-[#d3cabc] transition-colors"></div>
    <h4 className="text-[#8a7f72] text-xs md:text-sm tracking-widest mb-1 md:mb-2">{region}</h4>
    <div className="flex items-end justify-between">
      <span className="text-xl md:text-3xl font-mono text-[#f4f1ec] tracking-wider">{count}</span>
      <span className="text-[#8c6f52] text-xs md:text-sm font-bold bg-[#8c6f52]/10 px-2 py-1 rounded">{percent}</span>
    </div>
  </div>
);

function LandingPage({ onEnter }) {
  return (
    <div className="min-h-screen bg-[#f4f1ec] text-[#2c2825] font-serif overflow-x-hidden">
      
      {/* 頂部導覽列 (Sticky) */}
      <nav className="fixed w-full z-50 bg-[#f4f1ec]/90 backdrop-blur-md border-b border-[#d3cabc]/50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <img src="https://www.amrtf.tw/wp-content/uploads/2025/05/cropped-Group-2.png" alt="大慈恩" className="h-10 object-contain" />
          <div className="hidden md:flex space-x-8 text-[#5c4a3d] font-bold tracking-widest text-sm">
            <a href="#about" className="hover:text-[#8c6f52] transition-colors">計畫緣起</a>
            <a href="#guide" className="hover:text-[#8c6f52] transition-colors">參與指南</a>
            <a href="#map" className="hover:text-[#8c6f52] transition-colors">全球響應</a>
            <a href="#organizer" className="hover:text-[#8c6f52] transition-colors">主辦單位</a>
          </div>
          <button onClick={onEnter} className="bg-[#8c6f52] text-white px-6 py-2 rounded hover:bg-[#6e563f] transition-all shadow-md font-bold tracking-wider flex items-center">
            前往共創 <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </nav>

      {/* 第一區：主視覺 Banner */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1580226835266-7e3f8ec4e1f7?q=80&w=2000&auto=format&fit=crop)' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1714]/80 via-[#1a1714]/50 to-[#f4f1ec]"></div>
        
        <div className="relative z-10 text-center px-4 flex flex-col items-center transform translate-y-8">
          <span className="text-[#d3cabc] tracking-[0.5em] text-sm md:text-base mb-6 border border-[#d3cabc] px-4 py-1">
            大慈恩譯經基金會
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-widest mb-4" style={{ textShadow: '2px 4px 12px rgba(0,0,0,0.5)' }}>
            聚沙成塔 墨結善緣
          </h1>
          <h2 className="text-xl md:text-2xl text-[#e8e3d9] tracking-[0.2em] font-light mb-12">
            五百萬字《大般若經》全球數位共創計畫
          </h2>
          <p className="text-[#d3cabc] max-w-2xl mx-auto leading-relaxed text-sm md:text-base mb-12 opacity-90">
            這不僅是一場跨越國界的藝術共創，更是將您的筆跡、聲音與祈願，永恆留存在經典之中的歷史盛事。
          </p>
          <button onClick={onEnter} className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-[#8c6f52] rounded-sm overflow-hidden transition-all hover:scale-105 shadow-2xl hover:shadow-[#8c6f52]/50">
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
            <span className="relative flex items-center tracking-widest">立即開啟經文卷軸 <BookOpen className="w-5 h-5 ml-3" /></span>
          </button>
        </div>
      </section>

      {/* 第二區：計畫緣起 */}
      <section id="about" className="py-24 bg-[#f4f1ec] relative">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <div className="w-16 h-1 bg-[#8c6f52] mb-6"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#5c4a3d] tracking-widest mb-6">憶起共創史詩經典</h2>
            <p className="text-[#5c4a3d] leading-loose text-lg mb-6 opacity-90 text-justify">
              傳統抄經，是沈澱心靈的修持；數位共創，是匯聚眾生的願力。我們邀請全球善知識，以「一人一字、一願一心」的方式，打破地域與時間的限制，共同完成這部人類文明瑰寶。
            </p>
            <p className="text-[#5c4a3d] leading-loose text-lg opacity-90 text-justify">
              您的每一筆，都將成為佛法傳承中不可或缺的光芒。五百萬字，五百萬個心願，將在此匯聚成壯闊的數位眾生相。
            </p>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-[#8c6f52] translate-x-4 translate-y-4 rounded-sm"></div>
            <img src="https://media.gettyimages.com/id/157328845/zh/%E7%85%A7%E7%89%87/the-torah.jpg?s=612x612&w=0&k=20&c=R6Sx96UMMyot-Apwn5wcqPmEEX-2XmaezAibpavg66M=" alt="Sutra Scroll" className="relative z-10 w-full h-[400px] object-cover grayscale sepia-[0.3] shadow-xl rounded-sm" />
          </div>
        </div>
      </section>

      {/* 第三區：參與指南 */}
      <section id="guide" className="py-24 bg-[#e8e3d9] border-t border-[#d3cabc]/50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#5c4a3d] tracking-widest mb-16">參與指南</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-[#fdfbf7] p-10 rounded-sm shadow-md border border-[#d3cabc] flex flex-col items-center transition-transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-[#8c6f52]/10 rounded-full flex items-center justify-center mb-6"><User className="w-10 h-10 text-[#8c6f52]" /></div>
              <h3 className="text-xl font-bold text-[#5c4a3d] tracking-widest mb-4">一、登入結緣</h3>
              <p className="text-[#8a7f72] leading-relaxed">透過社群帳號一鍵登入，在五百萬字庫中，尋找與您有緣的專屬字元並進行認領。</p>
            </div>
            <div className="bg-[#fdfbf7] p-10 rounded-sm shadow-md border border-[#d3cabc] flex flex-col items-center transition-transform hover:-translate-y-2 relative">
              <div className="w-20 h-20 bg-[#8c6f52]/10 rounded-full flex items-center justify-center mb-6"><PenTool className="w-10 h-10 text-[#8c6f52]" /></div>
              <h3 className="text-xl font-bold text-[#5c4a3d] tracking-widest mb-4">二、揮毫共創</h3>
              <p className="text-[#8a7f72] leading-relaxed">支援實體宣紙拍攝上傳或線上數位描字，寫下您獨一無二的筆跡，展現眾生相。</p>
            </div>
            <div className="bg-[#fdfbf7] p-10 rounded-sm shadow-md border border-[#d3cabc] flex flex-col items-center transition-transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-[#8c6f52]/10 rounded-full flex items-center justify-center mb-6"><Mic className="w-10 h-10 text-[#8c6f52]" /></div>
              <h3 className="text-xl font-bold text-[#5c4a3d] tracking-widest mb-4">三、語音祈願</h3>
              <p className="text-[#8a7f72] leading-relaxed">錄製3秒專屬誦讀音檔，並留下您的創作心得與祈福願力，讓聲音與經文永恆共鳴。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 第四區：全球響應地圖 */}
      <section id="map" className="py-24 bg-[#1a1714] text-[#d3cabc] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1714] to-[#2c2825] z-0"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <Map className="w-12 h-12 text-[#8c6f52] mx-auto mb-4 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold text-[#f4f1ec] tracking-widest mb-4">全球善念 點亮經典</h2>
            <p className="text-[#8a7f72] tracking-widest max-w-2xl mx-auto leading-relaxed">跨越海洋與時區，來自世界各地的善念正源源不絕地匯聚於此。每一顆閃爍的光點，都是一位共同書寫歷史的發心者。</p>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/3 grid grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
              <StatCard region="台灣地區" count="85,210" percent="68%" />
              <StatCard region="北美地區" count="15,340" percent="12%" />
              <StatCard region="東南亞" count="12,150" percent="10%" />
              <StatCard region="歐洲地區" count="8,420" percent="7%" />
            </div>
            
            {/* 右側：高科技數位世界地圖 */}
            <div className="w-full lg:w-2/3 relative aspect-[4/3] md:aspect-video bg-[#0a0908] rounded-xl border border-[#8c6f52]/30 flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(140,111,82,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(140,111,82,0.15)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
              <div className="absolute inset-4 md:inset-8 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-no-repeat bg-center bg-contain opacity-40 invert drop-shadow-[0_0_8px_rgba(211,202,188,0.4)]"></div>
              
              <PulseDot top="46%" left="82%" label="台灣" />
              <PulseDot top="35%" left="22%" label="北美洲" />
              <PulseDot top="55%" left="78%" label="東南亞" />
              <PulseDot top="32%" left="52%" label="歐洲" />
              <PulseDot top="72%" left="85%" label="大洋洲" />
              <PulseDot top="48%" left="68%" label="印度" />
              <PulseDot top="65%" left="32%" label="南美洲" />
            </div>
          </div>
        </div>
      </section>

      {/* 第五區：主辦單位專欄 (About Us Column) */}
      <section id="organizer" className="py-24 bg-[#0d0c0a] text-[#d3cabc] border-t border-[#8c6f52]/20 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            
            {/* 左側：品牌精神與 LOGO */}
            <div className="flex-1">
              <img src="https://www.amrtf.tw/wp-content/uploads/2025/05/cropped-Group-2.png" alt="大慈恩" className="h-16 object-contain mb-8 filter brightness-0 invert opacity-90" />
              <h3 className="text-2xl md:text-3xl font-bold text-[#f4f1ec] tracking-widest mb-6 border-l-4 border-[#8c6f52] pl-4">
                不死甘露，普潤群生
              </h3>
              <div className="space-y-4 text-[#8a7f72] leading-loose text-justify text-sm md:text-base">
                <p>
                  大慈恩譯經基金會（AMRITA TRANSLATION FOUNDATION）之英文名稱「AMRITA」，意為<strong className="text-[#d3cabc] font-medium">不死甘露</strong>。我們深信，佛語釋論等經典是療癒一切眾生生死重病的甘露妙藥。
                </p>
                <p>
                  本會成立於 2019 年，為一獨立非營利組織。我們致力於傳持佛陀教法，為留下人類文明的珍貴遺產而奉獻熱忱。本會一切僧俗，將以種種轉譯的方式令諸眾生同沾甘露，並以此作為永恆的使命。
                </p>
                <p>
                  就是現在，您與我們因緣際會。我們相信，您將與我們把臂共行，一同走向這段美妙的譯師之旅！
                </p>
              </div>
              
              <a href="https://www.amrtf.org/zh-hant/" target="_blank" rel="noreferrer" className="inline-flex items-center mt-8 text-[#8c6f52] hover:text-[#d3cabc] transition-colors font-bold tracking-widest group">
                前往大慈恩官方網站 
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* 右側：五大核心使命 */}
            <div className="flex-1 lg:border-l border-[#8c6f52]/20 lg:pl-16">
              <h4 className="text-xl font-bold text-[#f4f1ec] tracking-widest mb-8 pb-4 border-b border-[#8c6f52]/20 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-[#8c6f52]" /> 本會五大核心使命
              </h4>
              
              <ul className="space-y-6">
                {[
                  "收藏、保存佛教文獻、文物及圖像。",
                  "翻譯、傳播佛教經典及相關著作。",
                  "培育各種語言的佛經翻譯人才。",
                  "護持佛教僧團的僧伽養成、心靈教育、建設寺院等資金。",
                  "傳遞普世共享的佛陀智慧，推廣心靈提升及正向發展的活動與展演。"
                ].map((mission, idx) => (
                  <li key={idx} className="flex items-start group">
                    <span className="text-[#8c6f52] font-mono text-lg font-bold mr-4 mt-0.5 group-hover:text-[#d3cabc] transition-colors">
                      0{idx + 1}.
                    </span>
                    <p className="text-[#8a7f72] leading-relaxed text-sm md:text-base group-hover:text-[#d3cabc] transition-colors">
                      {mission}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            
          </div>

          {/* Footer Bottom */}
          <div className="mt-24 pt-8 border-t border-[#8c6f52]/20 flex flex-col md:flex-row justify-between items-center text-xs text-[#8a7f72] tracking-widest">
            <p>© 2026 大慈恩譯經基金會 AMRITA TRANSLATION FOUNDATION. All rights reserved.</p>
            <p className="mt-2 md:mt-0">全民大寫經：數位共創平台 Phase 1</p>
          </div>
        </div>
      </section>

    </div>
  );
}

// ==========================================
// 4. 主程式 (狀態切換器)
// ==========================================
export default function App() {
  const [view, setView] = useState('landing'); 

  return (
    <>
      <style>{`
        .fade-in { animation: fadeIn 0.8s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
      
      {view === 'landing' ? (
        <LandingPage onEnter={() => setView('app')} />
      ) : (
        <SutraApp onBack={() => setView('landing')} />
      )}
    </>
  );
}