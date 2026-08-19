import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import PhotoBook from './PhotoBook.jsx'
import { workCollections } from './workCollections.js'
import ClickSpark from './ClickSpark.jsx'
import ScrollStack, { ScrollStackItem } from './components/reactbits/ScrollStack.jsx'
import OrbitImages from './components/reactbits/OrbitImages.jsx'
import BallpitFallback from './components/reactbits/BallpitFallback.jsx'
const A=(n)=>`${import.meta.env.BASE_URL}assets/${n}`
const folders=[
 ['01','账号运营','ACCOUNT OPERATIONS','blue','account-ai.jpg','把热点变成可读、可传播、也有网感的内容。',[['小鸡咯咯哒','抖音 · 小红书','account-chicken.jpg','娱乐热点账号，用平台语境重组话题、制作轻量表达。'],['喜鹊叫喳喳','快手 · 小红书','account-magpie.jpg','泛娱乐内容运营，用高频选题与情绪钩子建立内容节奏。'],['AI资讯','小红书','account-ai.jpg','把复杂 AI 动态翻译成普通人听得懂的热点点评。']]],
 ['02','视频制作','VIDEO CREATION','lime','video-ae.jpg','从视觉节奏到内容表达，让不同媒介都有记忆点。',[['AE 动效视频','MOTION GRAPHICS','video-ae.jpg','用动效、节奏和镜头语言建立内容识别。'],['实景拍摄视频','LIVE ACTION','video-live.jpg','从画面组织到后期剪辑，完成产品的场景化表达。'],['AI 视频创作','AI VIDEO','video-ai.jpg','尝试数字人、演唱、节日与大字视频等多种 AI 内容形式。']]],
 ['03','海报制作','POSTER LIBRARY','lavender','poster-commercial.jpg','让信息有层级，也让每一张图有被记住的理由。',[['公众号海报','EDITORIAL','poster-long.jpg','为内容长图建立清晰的信息层级与阅读节奏。'],['文创海报','CULTURAL CREATIVE','poster-culture.jpg','以插画、版式和细节营造可收藏的文化表达。'],['商业海报','COMMERCIAL','poster-commercial.jpg','面向活动与品牌宣传，兼顾传播目标和视觉吸引力。']]],
 ['04','摄影作品','PHOTO ARCHIVE','coral','photo-city.jpg','在街道、光影与日常里，收藏那些有情绪的瞬间。',[['横幅影像','LANDSCAPE','photo-city.jpg','更开阔的场景与空间叙事。'],['竖幅影像','PORTRAIT','photo-girl.jpg','更靠近人物、色彩与细节的观察。']]]
]
const experiences=[['2026.05 — 2026.08','网易','内容编导 / 运营','参与 AI 热点账号从选题抓取、信息筛选、内容拆解到图文生成的全链路搭建；用自动化思路沉淀可复用 SOP。'],['2026.01 — 2026.04','芒果 TV','新媒体运营推广','围绕联通、移动、广电 IPTV 用户，参与影视会员活动的内容策划、视频制作与多平台推广。'],['2025.10 — 2025.12','枣庄市川页传媒公司','新媒体运营','负责本地生活短视频全流程，通过热点追踪与内容优化，建立稳定更新与复盘机制。'],['2025.06 — 2025.09','青岛市洁恩特名奢科技有限公司','新媒体运营','负责产品内容的策划、拍摄、剪辑和发布，以内容矩阵支持产品展示与用户转化。']]
const photoBooks={
 wide:[
  ['landscape-01.jpg','GOLDEN HOUR','枯花仍在发光','午后的暖光落在花瓣上，把凋零也照成一段安静的风景。'],
  ['landscape-02.jpg','OLD ROOF','屋檐下的四藏','光线穿过老建筑的梁柱，留下克制而有分量的黑与白。'],
  ['landscape-03.jpg','STILL AIR','停在风里的片刻','把目光交给不急着发生的事，时间就在画面外慢慢经过。'],
  ['landscape-04.jpg','WINDOW LIGHT','窗边的留白','日常的光影有自己的秩序，只要停下来就能看见。'],
  ['landscape-05.jpg','QUIET SIGN','旧字与夜色','一块牌匾、一段屋檐，把城市的记忆留在暗处。'],
  ['landscape-06.jpg','WALKING','沿路收集','把脚步和视线放慢，街道也会有新的表情。'],
  ['landscape-07.jpg','BLUE NOTE','蓝色时分','天空转暗以前，城市的轮廓正变得柔和。'],
  ['landscape-08.jpg','STRUCTURE','线条正在延伸','从建筑的节奏里，找到画面里最安静的方向。'],
  ['landscape-09.jpg','OPEN SPACE','风经过这里','留下一点空白，让风景自己说话。'],
  ['landscape-10.jpg','AFTER RAIN','雨后微光','潮湿的空气让颜色更低，也让情绪更近。'],
  ['landscape-11.jpg','DISTANCE','远处的答案','镜头拉开以后，细节会慢慢连成故事。'],
  ['landscape-12.jpg','DAYLIGHT','白日速写','把被忽略的日常，重新放进画面中央。'],
  ['landscape-13.jpg','LAST FRAME','最后一页','留给光线，也留给下一次出发。'],
 ],
 tall:[
  ['portrait-01.jpg','WORKDAY GLOW','橙色工作服','傍晚的阳光落在清洁工的工作服上，路边的日常因此有了温度。'],
  ['portrait-02.jpg','ALLEY LIGHT','巷子尽头的光','狭长的旧巷把植物、摩托与住家的生活痕迹，一起收进午后的光里。'],
  ['portrait-03.jpg','OLD TREE','树枝与旧楼','枝桠在蓝天前展开，身后的旧楼把时间留在每一扇窗边。'],
  ['portrait-04.jpg','OPEN GATE','门后的小路','穿过石墙与铁门，光线把一条安静的小路慢慢打开。'],
  ['portrait-05.jpg','LOOKING UP','抬头的蓝天','仰拍的树枝、电线与楼宇，在一片蓝天里交织成向上的线条。'],
  ['portrait-06.jpg','STREET DETAIL','街角细节','把路过时看见的细节留在画面里，作为城市生活的轻小注脚。'],
  ['portrait-07.jpg','SUNSET SLANTS','夕阳斜下','金色的光线洒下'],
  ['portrait-08.jpg','UPWARD VIEW','向上看去','从竖直的视角收集建筑、树影与天空的关系。'],
  ['portrait-09.jpg','SLOW WALK','慢一点走','在熟悉的街道上放慢脚步，重新看见日常的构图。'],
  ['portrait-10.jpg','LIGHT TRACE','光影留下的痕迹','光线经过墙面与街角，为画面留下短暂而清晰的层次。'],
  ['portrait-11.jpg','CLOSING NOTE','收进这一页','把这次散步最后看见的一帧，安静地留在书页之间。'],
 ],
}
const desktopFolders=[
 ['ABOUT_ME','个人档案','about','profile'],
 ['AI_LAB','账号运营','work','ai'],
 ['MOTION','视频制作','work','motion'],
 ['POSTER_BOX','海报制作','work','poster'],
 ['PHOTO_BOOK','摄影图集','photos','photo'],
 ['LETTERS','联系我','contact','mail'],
]
const dropImages=['follow-01.png','follow-02.png','follow-03.png','follow-04.png','follow-05.png','follow-06.png','follow-07.png','follow-08.png','follow-09.png','follow-10.png','follow-11.png','follow-12.png','follow-13.png']
const experienceOrbitImages=['experience-01.svg','experience-02.svg','experience-03.svg','experience-04.svg'].map(n=>A(`experience-orbit/${n}`))
const go=(id)=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'})
function App(){const [open,setOpen]=useState(null),[selectedCollection,setSelectedCollection]=useState(null),[tab,setTab]=useState('wide'),[toast,setToast]=useState(''),[workProgress,setWorkProgress]=useState(0),[bookPage,setBookPage]=useState(0),[bookOpen,setBookOpen]=useState(false),[turn,setTurn]=useState(null),[contactProgress,setContactProgress]=useState(0),[heroReady,setHeroReady]=useState(false),[drops,setDrops]=useState([]),[mouseFollower,setMouseFollower]=useState(null);const workRef=useRef(null),contactRef=useRef(null),heroRef=useRef(null),dropLastRef=useRef(0),dropTimerRef=useRef(null),followerRef=useRef(null),followerImageRef=useRef(null),pointerRafRef=useRef(0),pendingPointerRef=useRef(null);useEffect(()=>{let o=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('show')),{threshold:.12});document.querySelectorAll('.reveal').forEach(e=>o.observe(e));return()=>o.disconnect()},[]);useEffect(()=>{const update=()=>{const section=workRef.current;if(!section)return;const rect=section.getBoundingClientRect();const range=Math.max(section.offsetHeight-window.innerHeight,1);setWorkProgress(Math.min(1,Math.max(0,-rect.top/range)))};update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update)}},[]);
useEffect(()=>{const update=()=>{const section=contactRef.current;if(!section)return;const rect=section.getBoundingClientRect();const range=Math.max(section.offsetHeight-window.innerHeight,1);setContactProgress(Math.min(1,Math.max(0,-rect.top/range)))};update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update)}},[]);useEffect(()=>{const frame=requestAnimationFrame(()=>setHeroReady(true));return()=>cancelAnimationFrame(frame)},[]);const copy=(name,val)=>navigator.clipboard.writeText(val).then(()=>{setToast(`${name} 已复制`);setTimeout(()=>setToast(''),1800)});const tiltCard=(event)=>{const card=event.currentTarget;const rect=card.getBoundingClientRect();card.style.setProperty('--tilt-x',`${((event.clientY-rect.top)/rect.height-.5)*-10}deg`);card.style.setProperty('--tilt-y',`${((event.clientX-rect.left)/rect.width-.5)*10}deg`)};const resetTilt=(event)=>{event.currentTarget.style.setProperty('--tilt-x','0deg');event.currentTarget.style.setProperty('--tilt-y','0deg')};const tiltStrength=(event)=>{const card=event.currentTarget;const rect=card.getBoundingClientRect();card.style.setProperty('--strength-x',`${((event.clientY-rect.top)/rect.height-.5)*-9}deg`);card.style.setProperty('--strength-y',`${((event.clientX-rect.left)/rect.width-.5)*9}deg`)};const resetStrength=(event)=>{event.currentTarget.style.setProperty('--strength-x','0deg');event.currentTarget.style.setProperty('--strength-y','0deg')};const paintFollower=(item)=>{const image=followerImageRef.current;if(!image||!item)return;image.style.setProperty('--follow-x',`${item.x}px`);image.style.setProperty('--follow-y',`${item.y}px`);image.style.setProperty('--follow-size',`${item.size}px`);image.style.setProperty('--follow-angle',`${item.angle}deg`)};const dropFromPointer=(event)=>{const rect=event.currentTarget.getBoundingClientRect();const x=event.clientX-rect.left;const y=event.clientY-rect.top;if(x<0||y<0||x>rect.width||y>rect.height)return;const current=followerRef.current;if(current){pendingPointerRef.current={x,y};if(!pointerRafRef.current){pointerRafRef.current=requestAnimationFrame(()=>{pointerRafRef.current=0;const point=pendingPointerRef.current;if(!point||!followerRef.current)return;followerRef.current={...followerRef.current,...point};paintFollower(followerRef.current)})}return}const next={id:Date.now()+Math.random(),x,y,image:dropImages[Math.floor(Math.random()*dropImages.length)],size:92+Math.random()*18,angle:(Math.random()-.5)*12};followerRef.current=next;setMouseFollower(next);requestAnimationFrame(()=>paintFollower(next));clearTimeout(dropTimerRef.current);dropTimerRef.current=setTimeout(()=>{const falling=followerRef.current;if(!falling)return;const fall=Math.min(215+Math.random()*115,rect.height-falling.y-38);setDrops(items=>[...items.slice(-3),{...falling,drift:(Math.random()-.5)*92,fall,angle:falling.angle+(Math.random()-.5)*16}]);setMouseFollower(null);followerRef.current=null;dropTimerRef.current=null;setTimeout(()=>setDrops(items=>items.filter(drop=>drop.id!==falling.id)),1950)},560)};return <ClickSpark sparkColor="#397ee8" sparkSize={13} sparkRadius={28} sparkCount={10} duration={420} extraScale={1.15}><main>
<nav className="nav"><button className="brand" onClick={()=>go('home')}><b>XY</b>辛悦的档案库</button><div className="navlinks"><button onClick={()=>go('about')}>个人简介</button><button onClick={()=>go('work')}>作品展示</button><button onClick={()=>go('photos')}>摄影作品</button></div><button className="contactBtn" onClick={()=>go('contact')}>CONTACT ↗</button></nav>
<section id="home" className={`hero desktopHero ${heroReady?'heroReady':''}`} ref={heroRef} onPointerMove={dropFromPointer}><div className="desktopGrid"/><div className="desktopGlow one"/><div className="desktopGlow two"/><div className="shell heroInner"><div className="desktopTopline"><span>XY / OS 2026</span><i>CREATIVE DESKTOP</i><b>READY</b></div><div className="heroCopy heroCopyCentered"><p className="heroKicker">你好，我是</p><p className="heroScript">creative workspace</p><h1 className="heroName" aria-label="辛悦"><span className="heroNameMask"><span className="heroNameChar">辛</span></span><span className="heroNameMask"><span className="heroNameChar">悦</span></span><em className="heroNameDot">。</em></h1><div className="heroRole"><span>AI 内容运营</span><span>新媒体运营</span></div><p className="heroIntro">把复杂信息翻译成容易被理解、被分享的内容；<br/>也用视频、设计和影像，为想法找到更有趣的表达。</p><button className="openBtn" onClick={()=>go('work')}>打开我的作品夹 <b>↘</b></button></div><div className="desktopFiles">{desktopFolders.map(([name,label,target,kind],index)=><button key={name} className={`desktopFile file${index} ${kind}`} onClick={()=>go(target)}><span className="folderObject"><i className="folderTab"/><i className="folderPocket"/><i className="folderPayload"><b>{kind==='ai'?'AI':kind==='motion'?'▶':kind==='poster'?'▤':kind==='photo'?'◉':kind==='mail'?'✉':'XY'}</b></i></span><strong>{name}</strong><small>{label}</small></button>)}</div><div className="deskDrops" aria-hidden="true"><img ref={followerImageRef} className={`deskFollower ${mouseFollower?'isFollowing':''}`} src={mouseFollower?A(`drops/${mouseFollower.image}`):''} alt=""/>{drops.map(drop=><img key={drop.id} className="deskDrop" src={A(`drops/${drop.image}`)} alt="" style={{'--drop-x':`${drop.x}px`,'--drop-y':`${drop.y}px`,'--drop-drift':`${drop.drift}px`,'--drop-fall':`${drop.fall}px`,'--drop-size':`${drop.size}px`,'--drop-angle':`${drop.angle}deg`}}/>)}</div><div className="desktopBadge">XIN YUE'S<br/>DESKTOP <i>2026</i></div><p className="heroScroll">SCROLL TO EXPLORE <b>↓</b></p></div></section>
<section id="about" className="shell section about"><Kicker n="01" e="ABOUT ME" c="个人档案"/><div className="aboutGrid"><div className="idWrap reveal"><i className="strap"/><i className="clip"/><div className="backcard">CONTENT<br/>MAKER <b>✳</b></div><div className="idcard"><header><span>XY ARCHIVE</span><b>ACTIVE</b></header><img src={A('portrait-id.jpg')} alt="辛悦"/><h2>辛悦</h2><p>XIN YUE</p><strong>AI CONTENT OPERATOR<br/>NEW MEDIA OPERATOR</strong><footer><small>ISSUED 2026</small><b>XY-07</b></footer></div></div><div className="aboutText reveal"><i>Nice to meet you!</i><h2>把热点做成内容，<br/><em>把内容做出感觉。</em></h2><p>我是辛悦，一名专注于 AI 内容与新媒体运营的内容创作者。目前就读于枣庄学院，主修网络与新媒体（影视编导方向）。</p><p>我擅长从热点中捕捉传播机会，再通过选题、文案、视觉与视频，把信息变成有温度、有网感的内容。对我来说，运营不只是发布，而是持续理解用户、验证表达的过程。</p><div className="tags">{['内容策划','热点洞察','账号运营','视频剪辑','AI 工具','视觉设计'].map(x=><span key={x}>{x}</span>)}</div></div></div><section className="experienceStage reveal"><header className="experienceStageHead"><span>INTERNSHIP ARCHIVE / 04 RECORDS</span><h2>实习经历 <i>Experience</i></h2><p>从内容生产到账号增长，在不同的行业场景中练习运营。</p></header><div className="experienceOrbit"><OrbitImages images={experienceOrbitImages} altPrefix="实习经历" shape="ellipse" baseWidth={1200} radiusX={438} radiusY={218} rotation={-10} duration={22} itemSize={226} direction="normal" fill={true} responsive={true} showPath={true} pathColor="rgba(82, 145, 214, 0.42)" pathWidth={1}/></div></section></section>
<section id="work" className="work workScrollStack"><div className="shell workStackShell"><div className="workStackIntro"><Kicker n="02" e="SELECTED WORKS" c="精选作品"/><div className="heading"><h2>打开四个<br/><em>内容项目</em></h2><p>向下滚动，让每一个项目<br/>依次在你的眼前堆叠。</p></div></div><div className="workStackFrame"><ScrollStack itemDistance={128} itemScale={0.045} itemStackDistance={34} stackPosition="18%" scaleEndPosition="8%" baseScale={0.89} rotationAmount={0} blurAmount={0}>{folders.map((folder,index)=><ScrollStackItem key={folder[1]} itemClassName={`projectStackCard tone${index}`}><button className="projectStackButton" onClick={()=>{setOpen(folder);setSelectedCollection(null)}}><span className="projectStackIndex">{folder[0]}</span><span className="projectStackMeta">{folder[2]}</span><div><small>PROJECT / {folder[0]}</small><h3>{folder[1]}</h3><p>{folder[5]}</p></div><b>OPEN ↗</b></button></ScrollStackItem>)}</ScrollStack></div></div></section><section className="shell section strengths"><Kicker n="03" e="MY TOOLKIT" c="个人优势"/><div className="heading reveal"><h2>一半是洞察，<br/><em>一半是执行。</em></h2><p>用多元的内容能力，完成从想法到传播的闭环。</p></div><div className="strengthGrid">{[['01','热点捕捉','快速拆解平台热点，在变化中找到值得讲的故事。','✦'],['02','内容转译','把复杂信息翻成普通用户愿意停下来看的表达。','⌁'],['03','视觉表达','熟悉 PS / PR / AE / Canva，让内容更有记忆点。','◌'],['04','AI 协作','将 AI 工具融入选题、创作与优化的日常工作流。','↗']].map((x,i)=><article key={x[1]} className={`strength strengthTilt s${i} reveal`} style={{'--deal-delay':`${i*.16}s`,'--card-rotate':`${[-4,3,-2,5][i]}deg`}} onMouseMove={tiltStrength} onMouseLeave={resetStrength}><div className="strengthLayer"/><small>{x[0]}</small><h3>{x[1]}</h3><p>{x[2]}</p><b>{x[3]}</b><i>MOVE / EXPLORE</i></article>)}</div></section>
<section id="photos" className="photos photoJournal section"><div className="shell"><Kicker n="04" e="PHOTO JOURNAL" c="摄影图集"/><div className="heading photohead reveal"><div><h2>光影收集<br/><em>计划。</em></h2><p>点击书页，翻阅我的摄影档案。</p></div><div className="tabs"><button className={tab==='wide'?'on':''} onClick={()=>{setTab('wide');setBookPage(0);setBookOpen(false);setTurn(null)}}>横幅影像<small>LANDSCAPE</small></button><button className={tab==='tall'?'on':''} onClick={()=>{setTab('tall');setBookPage(0);setBookOpen(false);setTurn(null)}}>竖幅影像<small>PORTRAIT</small></button></div></div><PhotoBook mode={tab} entries={photoBooks[tab]} page={bookPage} open={bookOpen} turn={turn} onOpen={()=>setBookOpen(true)} onFlip={(direction)=>{if(turn)return;const total=photoBooks[tab].length;const next=direction==='next'?bookPage+1:bookPage-1;if(next<0||next>=total)return;setTurn({direction,from:bookPage,to:next})}} onFlipEnd={()=>{if(turn){setBookPage(turn.to);setTurn(null)}}}/></div></section>
<section id="contact" ref={contactRef} className="contact contactArchive"><div className="contactSticky"><div className="contactStage shell"><div className="archiveCaption"><span>05</span> CONTACT ARCHIVE <i>向下滚动，打开档案袋</i></div><div className="contactEnvelope" style={{'--open':contactProgress}}><div className="envelopeBack"/><div className="contactSheet"><div className="sheetTop"><span>XY CONTACT FILE / 2026</span><b>OPEN FOR COLLABORATION</b></div><div className="sheetLayout"><div className="contactBadge"><div className="badgeClip"/><img src={A('portrait-main.jpg')} alt="辛悦"/><h3>辛悦</h3><p>XIN YUE</p><small>AI CONTENT<br/>NEW MEDIA</small></div><div className="sheetCopy"><p className="mono">LET'S CREATE SOMETHING NICE TOGETHER</p><h2>下一份好内容，<br/><em>等你来打开。</em></h2><p>期待和你一起把有趣的想法，变成被看见、被喜欢的内容。</p><div className="sheetDetails"><button onClick={()=>copy('邮箱','2690087779@qq.com')}><small>EMAIL · CLICK TO COPY</small><b>2690087779@qq.com</b><i>↗</i></button><button onClick={()=>copy('电话','15898853696')}><small>PHONE · CLICK TO COPY</small><b>158 9885 3696</b><i>↗</i></button></div></div></div><footer>© 2026 XIN YUE · PERSONAL CONTACT ARCHIVE</footer></div><div className="envelopeFront"><div className="flap"/><div className="envelopeLabel"><small>TO</small><b>辛悦 / XIN YUE</b><span>AI CONTENT & NEW MEDIA</span></div><div className="envelopeSeal">XY</div><p>CONTACT<br/>ARCHIVE</p></div></div><p className="contactScroll">SCROLL TO UNSEAL <b>↓</b></p></div></div></section>
<section className="contactBallpitSection"><div className="contactBallpitCopy"><small>06 / PLAYGROUND</small><h2>把灵感 <em>抛进来。</em></h2><p>移动鼠标，和这些颜色一起玩一会。</p></div><div className="contactBallpit"><BallpitFallback count={100} gravity={0.01} friction={0.9975} wallBounce={0.95} followCursor colors={["#4e9dff", "#004dff", "#d7d7d7", "#ede8b5"]} /></div></section>{open&&<div className="modalShade" onMouseDown={()=>{setOpen(null);setSelectedCollection(null)}}><div className={`modal ${open[3]} ${selectedCollection?'collectionOpen':''}`} onMouseDown={event=>event.stopPropagation()}><button className="close" onClick={()=>{setOpen(null);setSelectedCollection(null)}}>CLOSE ×</button>{!selectedCollection?<><small>{open[0]} / {open[2]}</small><h2>{open[1]}</h2><p>{open[5]}</p><div className="categoryCards">{open[6].map(category=>{const collection=workCollections[category[0]];return <button key={category[0]} className={collection?'categoryCard hasCollection':'categoryCard'} onClick={()=>collection&&setSelectedCollection({title:category[0],meta:category[1],description:category[3],items:collection})}><img src={A(category[2])} alt={category[0]}/><section><small>{category[1]}</small><h3>{category[0]}</h3><p>{category[3]}</p>{collection&&<b>VIEW ALL ↗</b>}</section></button>})}</div></>:<><button className="modalBack" onClick={()=>setSelectedCollection(null)}>← BACK TO CATEGORIES</button><small>{open[0]} / {selectedCollection.meta}</small><h2>{selectedCollection.title}</h2><p>{selectedCollection.description}</p><div className="chromaGrid">{selectedCollection.items.map((item,index)=><article className="chromaCard" key={item[0]} onMouseMove={tiltCard} onMouseLeave={resetTilt}><div className="chromaImage"><img src={A(`collections/${item[0]}`)} alt={item[1]}/>{!item[4]&&<span>0{index+1}</span>}</div></article>)}</div></>}</div></div>}{toast&&<aside className="toast">✦ {toast}</aside>}</main></ClickSpark>}
function Kicker({n,e,c}){return <div className="kicker reveal"><span>{n}</span>{e}<i>{c}</i></div>}
export default App































