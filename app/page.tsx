"use client"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const AGENTS = [
  { name:"STEVE", role:"Sales Closer AI", emoji:"🤖", desc:"Converts leads, assists live calls, and auto-generates proposals. Steve closes deals 24/7 — even while you sleep." },
  { name:"ZARA", role:"HR + Compliance AI", emoji:"👩‍💼", desc:"Manages contractor onboarding, contracts, and workforce operations across all 10 phases of the STARZ-OS flow." },
  { name:"RICO", role:"Fulfillment + Dev AI", emoji:"⚙️", desc:"Executes SEO campaigns, ad management, and automation builds the moment payment confirms." },
  { name:"VOX", role:"Conversational AI", emoji:"💬", desc:"Captures and nurtures leads instantly. Qualifies prospects and routes hot leads to Steve." },
  { name:"SENTINEL", role:"Security AI", emoji:"🛡️", desc:"Protects data, prevents abuse, and monitors risk 24/7. Zero breaches. Full compliance." },
]
const SVCS: Record<string,{icon:string;name:string;desc:string}[]> = {
  "AI + Automation":[
    {icon:"🤖",name:"AI Lead Generation Systems",desc:"Fully automated prospecting pipelines powered by STARZ-OS."},
    {icon:"⚡",name:"Smart CRM Automation",desc:"Zero manual lead handling — AI routes every prospect instantly."},
    {icon:"📞",name:"AI Sales Assist",desc:"Real-time call coaching and instant proposal generation."},
    {icon:"🎯",name:"Predictive Lead Scoring",desc:"AI ranks every prospect by close probability before you dial."},
    {icon:"💬",name:"AI Chatbots (Vox)",desc:"24/7 lead capture on every page of your site."},
    {icon:"📄",name:"Auto-Proposal Engine",desc:"Branded proposals with payment links generated in seconds."},
  ],
  "Paid Media":[
    {icon:"🔍",name:"Google Ads",desc:"Search, Display, YouTube — AI-optimized bidding for max ROI."},
    {icon:"📱",name:"Meta Ads",desc:"Facebook + Instagram with advanced audience targeting."},
    {icon:"🎵",name:"TikTok Ads",desc:"Fastest-growing ad channel — high reach at low CPM."},
    {icon:"💼",name:"LinkedIn Ads",desc:"B2B precision targeting to reach decision-makers."},
  ],
  "SEO Engine":[
    {icon:"🏆",name:"Keyword Domination System",desc:"Own the search results that drive revenue."},
    {icon:"✍️",name:"Content Clusters + AI Blogs",desc:"Topical authority built at scale with AI content."},
    {icon:"🔗",name:"Authority Backlink Engine",desc:"High-DA placements that move rankings fast."},
    {icon:"📍",name:"Local SEO + Maps",desc:"Google Business optimization — rank #1 in your market."},
  ],
  "Traditional":[
    {icon:"💻",name:"Website Design + Dev",desc:"High-converting sites built to rank and sell."},
    {icon:"🎨",name:"Branding + Identity",desc:"Logos and brand systems that command attention."},
    {icon:"📧",name:"Email Marketing",desc:"Automated sequences that nurture and reactivate leads."},
    {icon:"⭐",name:"Reputation Management",desc:"Review generation and crisis response."},
  ],
}
const schema = z.object({
  name:z.string().min(2,"Name required"),
  business:z.string().min(2,"Business required"),
  phone:z.string().min(10,"Phone required"),
  email:z.string().email("Valid email required"),
  revenue:z.string().min(1,"Select revenue"),
  service:z.string().min(1,"Select service"),
})
type F = z.infer<typeof schema>

const VOX_REPLIES = [
  "Great! Based on that, I'd recommend our AI Lead Gen + SEO package. Want Steve to build your custom forecast?",
  "That's exactly what we solve. Our system would have leads hitting your phone within 48 hours. Ready?",
  "Most businesses in your space see 3–8x ROI in 90 days. Let me connect you with Steve now.",
  "Drop your number and Steve will reach out within 2 minutes with a custom strategy. No obligation.",
]
const TICKER = ["Leads Generated Today:247+","Active AI Campaigns:94","Revenue (30d):$184K","Deals Closed:38","Keywords Ranked:1,204","Response Time:< 2min","Satisfaction:98.2%","Proposals Today:12"]

export default function Home() {
  const [svcTab, setSvcTab] = useState("AI + Automation")
  const [scanUrl, setScanUrl] = useState("")
  const [scanLoading, setScanLoading] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const [formDone, setFormDone] = useState(false)
  const [voxOpen, setVoxOpen] = useState(false)
  const [voxMsgs, setVoxMsgs] = useState([{role:"ai",text:"Hey! I'm Vox 👋 — Traffik Boosters AI. What type of business do you run?"}])
  const [voxInput, setVoxInput] = useState("")
  const voxIdx = useRef(0)
  const voxMsgsRef = useRef<HTMLDivElement>(null)
  const { register, handleSubmit, formState:{errors,isSubmitting} } = useForm<F>({resolver:zodResolver(schema)})

  useEffect(()=>{
    const t = setTimeout(()=>{ if(!sessionStorage.getItem("vox"))setVoxOpen(true) },30000)
    return ()=>clearTimeout(t)
  },[])
  useEffect(()=>{ if(voxMsgsRef.current)voxMsgsRef.current.scrollTop=voxMsgsRef.current.scrollHeight },[voxMsgs])

  const runScan = async()=>{
    if(!scanUrl.trim())return
    setScanLoading(true);setScanResult(null)
    try{const r=await fetch("/api/scan",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:scanUrl})});setScanResult(await r.json())}catch{}
    setScanLoading(false)
  }
  const onSubmit = async(data:F)=>{
    await fetch("/api/lead",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)}).catch(()=>{})
    setFormDone(true)
  }
  const sendVox = ()=>{
    const msg=voxInput.trim();if(!msg)return
    setVoxMsgs(m=>[...m,{role:"user",text:msg}]);setVoxInput("")
    setTimeout(()=>setVoxMsgs(m=>[...m,{role:"ai",text:VOX_REPLIES[voxIdx.current++%VOX_REPLIES.length]}]),900)
  }

  const btn = (label:string,href:string,primary=true)=>(
    <a href={href} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"14px 32px",background:primary?"var(--green)":"transparent",color:primary?"#000":"var(--white)",border:primary?"none":"1px solid rgba(255,255,255,.2)",fontSize:14,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase" as const,textDecoration:"none",transition:"all .2s"}}>
      {label}
    </a>
  )

  return (
    <div style={{fontFamily:"'Space Grotesk',sans-serif"}}>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 48px",background:"rgba(8,9,26,.92)",borderBottom:"1px solid var(--border-green)",backdropFilter:"blur(12px)"}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:"0.1em",color:"var(--white)"}}>
          TRAFFIK<span style={{color:"var(--green)"}}>BOOSTERS</span><span style={{color:"var(--green)",fontSize:14}}>.AI</span>
        </div>
        <div style={{display:"flex",gap:32}}>
          {[["AI Team","#agents"],["Services","#services"],["Process","#process"],["Scanner","#scanner"]].map(([l,h])=>(
            <a key={h} href={h} style={{fontSize:13,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:"var(--text-dim)",textDecoration:"none"}}>{l}</a>
          ))}
        </div>
        <a href="#capture" style={{background:"var(--green)",color:"#000",fontSize:13,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",padding:"10px 22px",textDecoration:"none"}}>Free Growth Plan</a>
      </nav>

      {/* HERO */}
      <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",padding:"120px 48px 80px",position:"relative",overflow:"hidden",background:"var(--navy)"}} className="hero-grid">
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 60% 50% at 50% 40%,rgba(0,255,135,.07) 0%,transparent 70%)",pointerEvents:"none"}} />
        <div style={{position:"relative",zIndex:1,maxWidth:900}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,marginBottom:24,border:"1px solid var(--border-green)",background:"rgba(0,255,135,.06)",padding:"6px 14px"}}>
            <div className="pulse-dot" /><span style={{fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"var(--green)"}}>AI Revenue Engine — Active</span>
          </div>
          <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(72px,12vw,160px)",lineHeight:.93,letterSpacing:".02em",marginBottom:24}}>
            MORE <span style={{color:"var(--green)"}}>TRAFFIK.</span><br/>
            MORE <span style={{color:"var(--orange)"}}>SALES.</span><br/>
            FULLY <span style={{color:"var(--green)"}}>AUTOMATED.</span>
          </h1>
          <p style={{fontSize:18,color:"var(--text-dim)",maxWidth:540,lineHeight:1.7,marginBottom:32}}>AI-Powered Growth Infrastructure for businesses ready to scale fast. Not a marketing agency — an <em>autonomous revenue machine.</em></p>
          <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:28}}>
            {btn("🔥 Get More Leads Now","#capture")}
            {btn("⚡ Talk to Steve AI","#capture",false)}
          </div>
          <div style={{display:"inline-flex",alignItems:"center",gap:12,border:"1px solid rgba(255,77,28,.2)",background:"rgba(255,77,28,.06)",padding:"10px 18px",fontSize:13}}>
            <span style={{color:"var(--orange)",fontWeight:700,fontSize:11,letterSpacing:2,textTransform:"uppercase"}}>AI Recommendation</span>
            <span style={{color:"var(--text-dim)"}}>Based on your industry, we recommend</span>
            <strong style={{color:"var(--white)"}}>SEO + Paid Ads + AI Automation</strong>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div style={{background:"var(--surface)",borderTop:"1px solid var(--border-green)",borderBottom:"1px solid var(--border-green)",overflow:"hidden",padding:"12px 0"}}>
        <div className="marquee-track" style={{display:"flex",gap:56,whiteSpace:"nowrap",width:"max-content"}}>
          {[...TICKER,...TICKER,...TICKER].map((s,i)=>{const[l,v]=s.split(":");return(
            <span key={i} style={{display:"inline-flex",alignItems:"center",gap:10,flexShrink:0}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:"var(--green)",display:"inline-block"}} />
              <span style={{fontSize:11,fontWeight:600,letterSpacing:2,textTransform:"uppercase",color:"var(--text-muted)"}}>{l}:</span>
              <span style={{fontSize:13,fontWeight:700,color:"var(--green)"}}>{v}</span>
            </span>
          )})}
        </div>
      </div>

      {/* AGENTS */}
      <section id="agents" style={{padding:"80px 48px",background:"var(--navy)"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><div className="pulse-dot"/><span style={{fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"var(--green)",marginLeft:8}}>Your 24/7 AI Team</span></div>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(48px,6vw,88px)",lineHeight:.93,marginBottom:12}}>MEET YOUR GROWTH TEAM</h2>
          <p style={{fontSize:17,color:"var(--text-dim)",maxWidth:560,marginBottom:48,lineHeight:1.7}}>Five specialized AI agents working around the clock to capture, close, fulfill, and protect your business.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:"rgba(0,255,135,.05)"}}>
            {AGENTS.map(a=>(
              <div key={a.name} style={{background:"var(--navy)",padding:"32px 28px",transition:"background .2s"}}
                   onMouseOver={e=>(e.currentTarget.style.background="var(--surface)")}
                   onMouseOut={e=>(e.currentTarget.style.background="var(--navy)")}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:18}}>
                  <div style={{width:50,height:50,borderRadius:"50%",background:"rgba(0,255,135,.08)",border:"1px solid var(--border-green)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{a.emoji}</div>
                  <div style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:5,height:5,borderRadius:"50%",background:"var(--green)",display:"inline-block"}} /><span style={{fontSize:10,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:"var(--green)"}}>Online</span></div>
                </div>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:".05em",color:"var(--white)",marginBottom:4}}>{a.name}</div>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"var(--green)",marginBottom:12}}>{a.role}</div>
                <p style={{fontSize:13,color:"var(--text-dim)",lineHeight:1.6}}>{a.desc}</p>
              </div>
            ))}
            <div style={{background:"rgba(0,255,135,.03)",border:"1px solid var(--border-green)",padding:"32px 28px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",textAlign:"center"}}>
              <div style={{fontSize:36,marginBottom:12}}>🚀</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,color:"var(--white)",marginBottom:10}}>YOUR TEAM IS READY</div>
              <p style={{fontSize:13,color:"var(--text-dim)",marginBottom:20,lineHeight:1.6}}>Let our AI team grow your business around the clock.</p>
              <a href="#capture" style={{background:"var(--green)",color:"#000",fontSize:12,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",padding:"12px 24px",textDecoration:"none"}}>Activate AI Team →</a>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{padding:"80px 48px",background:"#0a0a0a"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><div className="pulse-dot"/><span style={{fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"var(--green)",marginLeft:8}}>Full-Stack Growth</span></div>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(48px,6vw,88px)",lineHeight:.93,marginBottom:32}}>WHAT WE DEPLOY FOR YOU</h2>
          <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,.06)",marginBottom:0,overflowX:"auto"}}>
            {Object.keys(SVCS).map(t=>(
              <button key={t} onClick={()=>setSvcTab(t)} style={{padding:"12px 24px",fontSize:12,fontWeight:700,letterSpacing:2,textTransform:"uppercase",border:"none",background:"none",cursor:"pointer",borderBottom:`2px solid ${svcTab===t?"var(--green)":"transparent"}`,marginBottom:-1,color:svcTab===t?"var(--green)":"var(--text-muted)",transition:"all .2s",whiteSpace:"nowrap"}}>{t}</button>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:"rgba(255,255,255,.04)",marginTop:1}}>
            {SVCS[svcTab].map(s=>(
              <div key={s.name} style={{background:"#0a0a0a",padding:"24px 20px",transition:"background .2s"}}
                   onMouseOver={e=>(e.currentTarget.style.background="var(--surface)")}
                   onMouseOut={e=>(e.currentTarget.style.background="#0a0a0a")}>
                <div style={{fontSize:22,marginBottom:12}}>{s.icon}</div>
                <div style={{fontSize:15,fontWeight:600,color:"var(--white)",marginBottom:6}}>{s.name}</div>
                <p style={{fontSize:13,color:"var(--text-muted)",lineHeight:1.5}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" style={{padding:"80px 48px",background:"var(--navy)"}}>
        <div style={{maxWidth:800,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><div className="pulse-dot"/><span style={{fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"var(--green)",marginLeft:8}}>The System</span></div>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(48px,6vw,88px)",lineHeight:.93,marginBottom:48}}>HOW YOUR REVENUE MACHINE WORKS</h2>
          <div style={{display:"flex",flexDirection:"column",gap:0}}>
            {[{n:"01",t:"Capture",a:"Vox AI",d:"Vox captures leads the moment they land — chat, form, or scanner."},{n:"02",t:"Qualify",a:"STARZ-OS",d:"AI scoring instantly ranks every lead by close probability."},{n:"03",t:"Close",a:"Steve AI",d:"Steve assists reps or auto-generates proposals with payment links."},{n:"04",t:"Fulfill",a:"Rico AI",d:"Rico executes campaigns the moment Stripe payment confirms."},{n:"05",t:"Optimize",a:"AI Loop",d:"Continuous monitoring, testing, and budget reallocation."}].map((s,i)=>(
              <div key={i} style={{display:"flex",gap:32,paddingBottom:i<4?56:0}}>
                <div style={{position:"relative",zIndex:1,flexShrink:0,width:56,height:56,borderRadius:"50%",border:"1px solid var(--border-green)",background:"var(--navy)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:"var(--green)"}}>{s.n}</div>
                <div style={{paddingTop:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                    <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,letterSpacing:".05em",color:"var(--white)"}}>{s.t}</span>
                    <span style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",border:"1px solid var(--border-green)",padding:"2px 8px",color:"var(--green)"}}>{s.a}</span>
                  </div>
                  <p style={{fontSize:15,color:"var(--text-dim)",lineHeight:1.6}}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCANNER */}
      <section id="scanner" style={{padding:"80px 48px",background:"#0a0a0a"}}>
        <div style={{maxWidth:800,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><div className="pulse-dot"/><span style={{fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"var(--green)",marginLeft:8}}>Free Instant Analysis</span></div>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(48px,6vw,88px)",lineHeight:.93,marginBottom:48}}>AI GROWTH SCANNER</h2>
          <div style={{border:"1px solid var(--border-green)",background:"rgba(0,255,135,.02)",padding:40}}>
            <p style={{color:"var(--text-dim)",fontSize:15,marginBottom:28}}>Your competitors are capturing leads you're missing. Find out exactly how much.</p>
            <div style={{display:"flex",marginBottom:20}}>
              <input value={scanUrl} onChange={e=>setScanUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&runScan()} placeholder="https://yourbusiness.com"
                     style={{flex:1,background:"var(--surface)",border:"1px solid rgba(255,255,255,.08)",borderRight:"none",padding:"14px 18px",color:"var(--white)",fontSize:14,outline:"none"}} />
              <button onClick={runScan} disabled={scanLoading} style={{background:"var(--orange)",color:"#fff",border:"none",padding:"14px 28px",fontSize:13,fontWeight:700,letterSpacing:1,textTransform:"uppercase",cursor:"pointer"}}>
                {scanLoading?"Scanning...":"Scan My Site →"}
              </button>
            </div>
            {scanLoading&&<div style={{textAlign:"center",padding:32}}><div style={{width:32,height:32,border:"2px solid var(--border-green)",borderTopColor:"var(--green)",borderRadius:"50%",animation:"spin .8s linear infinite",margin:"0 auto 12px"}} /><p style={{color:"var(--text-dim)",fontSize:14}}>Analyzing your digital footprint...</p></div>}
            {scanResult&&(
              <div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:"rgba(0,255,135,.06)"}}>
                  {[{l:"SEO Score",v:scanResult.seoScore,c:"#ff4d1c"},{l:"Ads Opportunity",v:scanResult.adsOpportunity,c:"var(--green)"},{l:"Revenue Gap",v:scanResult.revenueGap,c:"#ff4d1c"}].map(m=>(
                    <div key={m.l} style={{background:"#0a0a0a",padding:24}}>
                      <div style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#4b5563",marginBottom:8}}>{m.l}</div>
                      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:52,lineHeight:1,color:m.c}}>{m.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{padding:20,background:"#0e0e0e",border:"1px solid var(--border-green)",marginTop:1,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
                  <p style={{color:"var(--text-dim)",fontSize:14}}>Want the full report + a custom growth plan?</p>
                  <a href="#capture" style={{background:"var(--green)",color:"#000",fontSize:13,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",padding:"12px 24px",textDecoration:"none"}}>Get Full Report Free →</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* LEAD CAPTURE */}
      <section id="capture" style={{padding:"80px 48px",background:"var(--navy)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"start"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><div className="pulse-dot"/><span style={{fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"var(--green)",marginLeft:8}}>Start Now</span></div>
            <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(48px,5vw,72px)",lineHeight:.93,marginBottom:20}}>HOW MANY LEADS ARE YOU <span style={{color:"var(--orange)"}}>LOSING</span> RIGHT NOW?</h2>
            <p style={{fontSize:16,color:"var(--text-dim)",marginBottom:28,lineHeight:1.7}}>Most businesses lose 60–80% of potential leads. We fix that — immediately.</p>
            {["Free Growth Plan — customized for your business","Steve contacts you within 2 minutes","No contracts until you see the strategy","Full AI Growth Audit included — zero cost"].map(b=>(
              <div key={b} style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,fontSize:14,color:"#9ca3af"}}>
                <div style={{width:20,height:20,borderRadius:"50%",background:"rgba(0,255,135,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"var(--green)",flexShrink:0}}>✓</div>{b}
              </div>
            ))}
          </div>
          <div>
            {!formDone?(
              <form onSubmit={handleSubmit(onSubmit)} style={{border:"1px solid var(--border-green)"}} noValidate>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",borderBottom:"1px solid var(--border-green)"}}>
                  <div style={{borderRight:"1px solid var(--border-green)"}}><input {...register("name")} placeholder="Your Name" style={{width:"100%",background:"transparent",border:"none",outline:"none",padding:"16px 18px",fontSize:14,color:"var(--white)"}} />{errors.name&&<p style={{padding:"0 18px 8px",fontSize:11,color:"var(--orange)"}}>{errors.name.message}</p>}</div>
                  <div><input {...register("business")} placeholder="Business Name" style={{width:"100%",background:"transparent",border:"none",outline:"none",padding:"16px 18px",fontSize:14,color:"var(--white)"}} /></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",borderBottom:"1px solid var(--border-green)"}}>
                  <div style={{borderRight:"1px solid var(--border-green)"}}><input {...register("phone")} type="tel" placeholder="Phone Number" style={{width:"100%",background:"transparent",border:"none",outline:"none",padding:"16px 18px",fontSize:14,color:"var(--white)"}} /></div>
                  <div><input {...register("email")} type="email" placeholder="Email Address" style={{width:"100%",background:"transparent",border:"none",outline:"none",padding:"16px 18px",fontSize:14,color:"var(--white)"}} /></div>
                </div>
                <div style={{borderBottom:"1px solid var(--border-green)"}}><select {...register("revenue")} style={{width:"100%",background:"transparent",border:"none",outline:"none",padding:"16px 18px",fontSize:14,color:"#4b5563",cursor:"pointer"}}><option value="" disabled>Monthly Revenue</option><option value="0-5k">Under $5,000/mo</option><option value="5k-20k">$5K–$20K/mo</option><option value="20k-50k">$20K–$50K/mo</option><option value="50k+">$50K+/mo</option></select></div>
                <div style={{borderBottom:"1px solid var(--border-green)"}}><select {...register("service")} style={{width:"100%",background:"transparent",border:"none",outline:"none",padding:"16px 18px",fontSize:14,color:"#4b5563",cursor:"pointer"}}><option value="" disabled>What do you need most?</option><option value="ai">AI + Automation</option><option value="leads">Lead Generation</option><option value="seo">SEO + Content</option><option value="ads">Paid Ads</option><option value="all">All of the above</option></select></div>
                <button type="submit" disabled={isSubmitting} style={{width:"100%",background:"var(--green)",color:"#000",border:"none",padding:18,fontSize:14,fontWeight:700,letterSpacing:2,textTransform:"uppercase",cursor:"pointer"}}>
                  {isSubmitting?"Sending to Steve...":"🔥 Get My Free Growth Plan →"}
                </button>
                <div style={{textAlign:"center",padding:"10px",fontSize:11,color:"#4b5563"}}>🔒 Sentinel Protected · Steve contacts you within 2 minutes</div>
              </form>
            ):(
              <div style={{border:"1px solid var(--border-green)",background:"rgba(0,255,135,.03)",padding:48,textAlign:"center"}}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:72,lineHeight:1,color:"var(--green)",marginBottom:12}}>LOCKED IN.</div>
                <p style={{color:"var(--text-dim)",fontSize:16,lineHeight:1.8}}>Steve is analyzing your business right now.<br/>Expect contact within 2 minutes.<br/><br/><strong style={{color:"var(--green)"}}>Check your phone.</strong></p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{padding:"80px 48px",background:"#0a0a0a"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><div className="pulse-dot"/><span style={{fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"var(--green)",marginLeft:8}}>Proof</span></div>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(48px,6vw,88px)",lineHeight:.93,marginBottom:48}}>RESULTS THAT SPEAK FOR THEMSELVES</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:"rgba(255,255,255,.04)"}}>
            {[{q:"We went from 3 inbound leads per week to over 40. The AI system literally runs itself — Steve follows up before we even see the lead come in.",name:"Marcus T.",co:"HVAC Company · Fort Lauderdale, FL"},{q:"Our Google Ads ROI went from 2x to over 8x in 60 days. The AI optimization loop caught budget waste we didn't even know existed.",name:"Jennifer R.",co:"E-Commerce Brand · Miami, FL"},{q:"Rico rebuilt our entire SEO foundation in 30 days. We're now ranking #1 for our top 12 keywords. Revenue doubled in one quarter.",name:"David K.",co:"Law Firm · Boca Raton, FL"}].map((t,i)=>(
              <div key={i} style={{background:"#0a0a0a",padding:"32px 28px",transition:"background .2s"}}
                   onMouseOver={e=>(e.currentTarget.style.background="var(--surface)")}
                   onMouseOut={e=>(e.currentTarget.style.background="#0a0a0a")}>
                <div style={{color:"var(--green)",fontSize:14,marginBottom:14}}>★★★★★</div>
                <p style={{fontSize:15,color:"#d1d5db",lineHeight:1.7,marginBottom:20,fontStyle:"italic"}}>"{t.q}"</p>
                <div style={{fontSize:13,fontWeight:700,color:"var(--white)"}}>{t.name}</div>
                <div style={{fontSize:12,color:"var(--green)",marginTop:3}}>{t.co}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:"80px 48px",background:"var(--navy)"}}>
        <div style={{maxWidth:700,margin:"0 auto",textAlign:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:24,justifyContent:"center"}}><div className="pulse-dot"/><span style={{fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",border:"1px solid var(--border-green)",padding:"6px 14px",color:"var(--green)",marginLeft:8}}>Revenue Engine — Ready</span></div>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(56px,9vw,120px)",lineHeight:.93,marginBottom:24}}>STOP LOSING<br/><span style={{color:"var(--green)"}}>LEADS</span><br/>TO COMPETITORS</h2>
          <p style={{fontSize:18,color:"var(--text-dim)",marginBottom:40,lineHeight:1.7}}>Every day without AI-powered lead generation is revenue walking out the door.</p>
          <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
            {btn("🔥 Start Growing Now","#capture")}
            <a href="tel:9546373041" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"14px 32px",background:"transparent",color:"var(--white)",border:"1px solid rgba(255,255,255,.2)",fontSize:14,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",textDecoration:"none"}}>📞 Call 954-637-3041</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:"#0e0e0e",borderTop:"1px solid var(--border-green)",padding:"48px 48px 32px"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:48,marginBottom:48}}>
            <div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:".1em",marginBottom:12}}>TRAFFIK<span style={{color:"var(--green)"}}>BOOSTERS</span><span style={{color:"var(--green)",fontSize:14}}>.AI</span></div>
              <p style={{fontSize:13,color:"#4b5563",lineHeight:1.7,maxWidth:280,marginBottom:20}}>AI-Powered Growth Infrastructure for businesses ready to scale fast.</p>
              <div style={{fontSize:13,color:"#6b7280",marginBottom:6}}>📞 954-637-3041</div>
              <div style={{fontSize:13,color:"#6b7280",marginBottom:6}}>✉ admin@traffikboosters.com</div>
              <div style={{fontSize:12,color:"#374151"}}>📍 899 W Cypress Creek Rd, Fort Lauderdale, FL 33309</div>
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"#374151",marginBottom:14}}>Services</div>
              {["AI Automation","Lead Generation","SEO Engine","Paid Media","Web Design"].map(s=><div key={s} style={{fontSize:13,color:"#4b5563",marginBottom:8}}>{s}</div>)}
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"#374151",marginBottom:14}}>AI Team</div>
              {["Steve — Sales","Zara — HR","Rico — Fulfillment","Vox — Chat","Sentinel — Security"].map(s=><div key={s} style={{fontSize:13,color:"#4b5563",marginBottom:8}}>{s}</div>)}
            </div>
          </div>
          <div style={{borderTop:"1px solid rgba(255,255,255,.05)",paddingTop:20,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <p style={{fontSize:12,color:"#374151"}}>© 2026 Traffik Boosters Corp. All Rights Reserved. · Traffikboosters.AI</p>
            <span style={{fontSize:11,color:"#374151",display:"flex",alignItems:"center",gap:6}}><span style={{color:"var(--green)"}}>🛡️</span> SENTINEL PROTECTED · STARZ-OS POWERED</span>
          </div>
        </div>
      </footer>

      {/* VOX CHAT */}
      {voxOpen&&(
        <div style={{position:"fixed",bottom:90,right:24,zIndex:500,width:320,display:"flex",flexDirection:"column",overflow:"hidden",background:"var(--surface)",border:"1px solid var(--border-green)",maxHeight:480}}>
          <div style={{background:"var(--green)",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div><div style={{fontWeight:700,fontSize:13,color:"#000",letterSpacing:1}}>VOX AI — GROWTH EXPERT</div><div style={{fontSize:10,color:"rgba(0,0,0,.6)"}}>Online · 2min response</div></div>
            <button onClick={()=>setVoxOpen(false)} style={{background:"none",border:"none",fontSize:18,color:"#000",cursor:"pointer",lineHeight:1}}>✕</button>
          </div>
          <div ref={voxMsgsRef} style={{flex:1,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:8,minHeight:200,maxHeight:280}}>
            {voxMsgs.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                <div style={{padding:"10px 12px",fontSize:13,lineHeight:1.5,maxWidth:"85%",borderRadius:m.role==="user"?"8px 8px 0 8px":"8px 8px 8px 0",background:m.role==="user"?"rgba(0,255,135,.12)":"#1a1b26",color:m.role==="user"?"var(--green)":"var(--white)",textAlign:m.role==="user"?"right":"left"}}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",borderTop:"1px solid rgba(255,255,255,.06)"}}>
            <input value={voxInput} onChange={e=>setVoxInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendVox()} placeholder="Tell me about your business..."
                   style={{flex:1,background:"transparent",border:"none",outline:"none",padding:"12px 14px",color:"var(--white)",fontSize:13}} />
            <button onClick={sendVox} style={{background:"var(--green)",color:"#000",border:"none",padding:"0 16px",fontWeight:700,fontSize:14,cursor:"pointer"}}>→</button>
          </div>
        </div>
      )}
      <button onClick={()=>{setVoxOpen(v=>!v);sessionStorage.setItem("vox","1")}}
              style={{position:"fixed",bottom:24,right:24,zIndex:500,width:56,height:56,borderRadius:"50%",background:"var(--green)",border:"none",fontSize:24,cursor:"pointer",boxShadow:"0 4px 24px rgba(0,255,135,.35)",display:"flex",alignItems:"center",justifyContent:"center"}}>
        💬
      </button>

    </div>
  )
}