import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Gamepad2, Search, Users, Bell, Settings, User, Swords, Crosshair, Zap,
  Shield, Trophy, Crown, Send, Check, X, Moon, Clock, ChevronRight, Plus,
  LogOut, MessageSquare, Globe, Sparkles, Flame, Mic, Wifi, ArrowRight,
  Menu, Lock, Heart, Star, Sun, Sunset, Coffee, ShieldCheck, Filter, UserPlus
} from "lucide-react";

/* ============================================================================
   GAMEMATE — Gamer matchmaking social platform (interactive MVP prototype)
   Single-file React app. In-memory state only (no persistence by design).
   ========================================================================== */

const css = `
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

:root{
  --void:#08080D; --panel:#101019; --panel-2:#16161F; --panel-3:#1C1C28;
  --line:#272739; --line-soft:#1E1E2C;
  --violet:#8B5CF6; --violet-hi:#A78BFA; --violet-lo:#6D28D9;
  --cyan:#22D3EE; --cyan-hi:#67E8F9;
  --volt:#34D399; --volt-hi:#6EE7B7;
  --gold:#F5C451; --rose:#F0529C; --danger:#FB5C6B;
  --text:#ECECF4; --muted:#8585A0; --muted-2:#5C5C73;
  --notch:polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px);
  --notch-sm:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
  --ff-disp:"Chakra Petch","Rajdhani",system-ui,sans-serif;
  --ff-body:"Inter",system-ui,-apple-system,sans-serif;
  --ff-mono:"JetBrains Mono",ui-monospace,"SF Mono",monospace;
}

*{box-sizing:border-box;margin:0;padding:0}
.gm-root{--uiz:1.08;font-family:var(--ff-body);color:var(--text);background:var(--void);min-height:100vh;position:relative;overflow-x:hidden;-webkit-font-smoothing:antialiased}
.gm-root ::selection{background:rgba(139,92,246,.35);color:#fff}
button{font-family:inherit;cursor:pointer;color:inherit}
input,select,textarea{font-family:inherit;color:inherit}
a{color:inherit;text-decoration:none}

/* scrollbar */
.gm-root *::-webkit-scrollbar{width:10px;height:10px}
.gm-root *::-webkit-scrollbar-track{background:transparent}
.gm-root *::-webkit-scrollbar-thumb{background:var(--line);border-radius:0;border:2px solid var(--void)}
.gm-root *::-webkit-scrollbar-thumb:hover{background:var(--violet-lo)}

/* ---------- background atmosphere ---------- */
.bg-layer{position:fixed;inset:0;z-index:0;pointer-events:none}
.bg-grid{position:absolute;inset:-2px;
  background-image:linear-gradient(rgba(139,92,246,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,.05) 1px,transparent 1px);
  background-size:46px 46px;
  -webkit-mask-image:radial-gradient(ellipse 90% 70% at 50% 0%,#000 5%,transparent 75%);
  mask-image:radial-gradient(ellipse 90% 70% at 50% 0%,#000 5%,transparent 75%);
  animation:drift 32s linear infinite}
@keyframes drift{to{background-position:46px 46px}}
.bg-glow{position:absolute;border-radius:50%;filter:blur(80px);opacity:.5}
.bg-glow.a{width:520px;height:520px;background:radial-gradient(circle,rgba(124,58,237,.5),transparent 70%);top:-160px;left:-120px}
.bg-glow.b{width:460px;height:460px;background:radial-gradient(circle,rgba(34,211,238,.32),transparent 70%);top:5%;right:-140px}
.bg-glow.c{width:600px;height:600px;background:radial-gradient(circle,rgba(109,40,217,.28),transparent 70%);bottom:-280px;left:30%}
.bg-scan{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,0) 0,rgba(0,0,0,0) 2px,rgba(0,0,0,.16) 3px,rgba(0,0,0,0) 4px);opacity:.45;mix-blend-mode:multiply}
.bg-vig{position:absolute;inset:0;background:radial-gradient(ellipse 120% 80% at 50% 30%,transparent 50%,rgba(0,0,0,.55) 100%)}

/* ---------- HUD card ---------- */
.hud-frame{position:relative;background:var(--line);padding:1px;clip-path:var(--notch)}
.hud-frame.accent{background:linear-gradient(135deg,var(--violet) 0%,var(--cyan) 100%);box-shadow:0 10px 50px -12px rgba(124,58,237,.45)}
.hud-frame.volt{background:linear-gradient(135deg,var(--volt),var(--cyan))}
.hud-body{position:relative;background:var(--panel);clip-path:var(--notch);height:100%}
.hud-body.pad{padding:18px}
.hud-frame.hover{transition:transform .18s ease, box-shadow .25s ease, background .25s ease}
.hud-frame.hover:hover{transform:translateY(-3px);background:linear-gradient(135deg,var(--violet),var(--cyan));box-shadow:0 16px 50px -16px rgba(124,58,237,.55)}
.hud-frame.noclip,.hud-frame.noclip .hud-body{clip-path:none}
.foot-link{transition:color .15s}.foot-link:hover{color:var(--cyan)!important}
@media (max-width:920px){.hdr-ad{display:none!important}}

/* corner ticks */
.tick{position:absolute;width:7px;height:7px;border-color:var(--violet);opacity:.7;z-index:2}
.tick.tl{top:5px;left:5px;border-top:1.5px solid;border-left:1.5px solid}
.tick.br{bottom:5px;right:5px;border-bottom:1.5px solid;border-right:1.5px solid}

/* ---------- buttons ---------- */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font-weight:600;font-size:14px;
  padding:11px 18px;clip-path:var(--notch-sm);border:none;transition:all .16s ease;letter-spacing:.2px;white-space:nowrap}
.btn:focus-visible{outline:2px solid var(--cyan);outline-offset:2px}
.btn-primary{background:linear-gradient(120deg,var(--violet),#7C3AED 55%,var(--cyan));color:#fff;box-shadow:0 6px 22px -8px rgba(124,58,237,.7)}
.btn-primary:hover{filter:brightness(1.12);box-shadow:0 8px 30px -8px rgba(34,211,238,.55)}
.btn-primary:active{transform:translateY(1px)}
.btn-ghost{background:rgba(255,255,255,.02);border:1px solid var(--line);color:var(--text)}
.btn-ghost:hover{border-color:var(--violet);background:rgba(139,92,246,.08);color:#fff}
.btn-volt{background:linear-gradient(120deg,var(--volt),var(--cyan));color:#04130d;box-shadow:0 6px 22px -10px rgba(52,211,153,.6)}
.btn-volt:hover{filter:brightness(1.08)}
.btn-danger{background:rgba(251,92,107,.1);border:1px solid rgba(251,92,107,.4);color:#ff97a1}
.btn-danger:hover{background:rgba(251,92,107,.2)}
.btn-sm{padding:8px 13px;font-size:12.5px}
.btn-block{width:100%}
.btn[disabled]{opacity:.45;cursor:not-allowed;filter:grayscale(.4)}

/* ---------- type ---------- */
.eyebrow{font-family:var(--ff-mono);font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:var(--violet-hi)}
.mono{font-family:var(--ff-mono)}
.disp{font-family:var(--ff-disp)}
.h-grad{background:linear-gradient(100deg,var(--violet-hi),var(--cyan));-webkit-background-clip:text;background-clip:text;color:transparent}

/* ---------- chips / badges ---------- */
.chip{display:inline-flex;align-items:center;gap:6px;font-family:var(--ff-mono);font-size:11px;letter-spacing:.04em;
  padding:4px 9px;border:1px solid var(--line);background:var(--panel-2);clip-path:var(--notch-sm);color:var(--muted);white-space:nowrap}
.tag-pill{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:600;padding:4px 10px;clip-path:var(--notch-sm);
  border:1px solid;background:rgba(255,255,255,.02)}
.online-dot{width:8px;height:8px;border-radius:50%;background:var(--volt);box-shadow:0 0 0 0 rgba(52,211,153,.6);animation:pulse 2s infinite}
.online-dot.off{background:var(--muted-2);box-shadow:none;animation:none}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(52,211,153,.55)}70%{box-shadow:0 0 0 7px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}

/* rank badge */
.rankbadge{display:inline-flex;align-items:center;gap:7px;padding:5px 11px 5px 9px;clip-path:var(--notch-sm);
  border:1px solid;font-family:var(--ff-disp);font-weight:600;font-size:13px;letter-spacing:.02em}
.rankbadge .rk-tier{width:7px;height:18px;clip-path:polygon(0 0,100% 18%,100% 82%,0 100%)}

/* ---------- inputs ---------- */
.field{display:flex;flex-direction:column;gap:7px}
.field>label{font-family:var(--ff-mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}
.input{background:var(--panel-2);border:1px solid var(--line);color:var(--text);padding:12px 13px;font-size:14px;clip-path:var(--notch-sm);transition:border-color .15s,box-shadow .15s;width:100%}
.input::placeholder{color:var(--muted-2)}
.input:focus{outline:none;border-color:var(--violet);box-shadow:0 0 0 3px rgba(139,92,246,.14)}
select.input{appearance:none;background-image:linear-gradient(45deg,transparent 50%,var(--muted) 50%),linear-gradient(135deg,var(--muted) 50%,transparent 50%);background-position:calc(100% - 18px) 18px,calc(100% - 13px) 18px;background-size:5px 5px,5px 5px;background-repeat:no-repeat;padding-right:34px}
.checkrow{display:flex;align-items:center;gap:10px;cursor:pointer;user-select:none;font-size:13.5px;color:var(--muted)}

/* ---------- layout ---------- */
.container{max-width:1240px;margin:0 auto;padding:0 24px;position:relative;z-index:1}
.app-shell{display:grid;grid-template-columns:248px 1fr;min-height:100vh;position:relative;z-index:1;zoom:var(--uiz,1)}
.sidebar{border-right:1px solid var(--line-soft);background:linear-gradient(180deg,rgba(16,16,25,.7),rgba(8,8,13,.6));backdrop-filter:blur(8px);padding:20px 14px;display:flex;flex-direction:column;gap:6px;position:sticky;top:0;height:100vh}
.nav-item{display:flex;align-items:center;gap:12px;padding:12px 14px;font-size:14.5px;font-weight:500;color:var(--muted);clip-path:var(--notch-sm);transition:all .14s;border:1px solid transparent;position:relative}
.nav-item:hover{background:rgba(139,92,246,.06);color:var(--text)}
.nav-item.active{background:linear-gradient(90deg,rgba(139,92,246,.18),rgba(34,211,238,.04));color:#fff;border-color:rgba(139,92,246,.3)}
.nav-item.active::before{content:'';position:absolute;left:0;top:8px;bottom:8px;width:3px;background:linear-gradient(var(--violet),var(--cyan))}
.nav-badge{margin-left:auto;font-family:var(--ff-mono);font-size:10px;background:var(--violet);color:#fff;padding:2px 6px;clip-path:var(--notch-sm)}
.topbar{display:flex;align-items:center;gap:16px;padding:16px 28px;border-bottom:1px solid var(--line-soft);position:sticky;top:0;z-index:20;background:rgba(8,8,13,.72);backdrop-filter:blur(12px)}
.main-area{padding:26px 28px 60px;min-height:100vh}

/* logo */
.logo{display:flex;align-items:center;gap:11px}
.logo-mark{width:34px;height:34px;flex:0 0 auto}
.logo-txt{font-family:var(--ff-disp);font-weight:700;font-size:20px;letter-spacing:.02em}
.logo-txt b{color:var(--violet-hi)}

/* grids */
.grid-feat{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.grid-players{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
.grid-games{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}

/* player card */
.pcard-head{display:flex;gap:13px;align-items:center;padding:16px 16px 12px}
.avatar{position:relative;flex:0 0 auto;display:grid;place-items:center;font-family:var(--ff-disp);font-weight:700;color:#fff;clip-path:var(--notch-sm)}
.avatar .av-status{position:absolute;bottom:-2px;right:-2px;width:13px;height:13px;border-radius:50%;border:2.5px solid var(--panel)}
.gamechip{display:flex;align-items:center;gap:8px;padding:7px 10px;background:var(--panel-2);border:1px solid var(--line);clip-path:var(--notch-sm)}
.gamechip .gi{width:26px;height:26px;display:grid;place-items:center;clip-path:var(--notch-sm)}

.divider{height:1px;background:var(--line-soft);margin:0}
.kv{display:flex;justify-content:space-between;align-items:center;font-size:13px;padding:3px 0}
.kv .k{color:var(--muted);font-family:var(--ff-mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase}

/* hero */
.hero{position:relative;z-index:1;padding:72px 0 30px}
.hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:40px;align-items:center}
.hero h1{font-family:var(--ff-disp);font-weight:700;font-size:clamp(38px,5.4vw,68px);line-height:1.02;letter-spacing:-.01em;margin:18px 0 16px}
.hero p.sub{font-size:17px;color:var(--muted);max-width:480px;line-height:1.6;margin-bottom:26px}
.queue-row{display:flex;align-items:center;gap:11px;padding:11px 13px;border-bottom:1px solid var(--line-soft)}
.queue-row:last-child{border-bottom:none}
.statline{display:flex;gap:26px;margin-top:30px;flex-wrap:wrap}
.statline .s b{font-family:var(--ff-disp);font-size:24px;display:block;line-height:1}
.statline .s span{font-family:var(--ff-mono);font-size:11px;color:var(--muted);letter-spacing:.1em;text-transform:uppercase}

/* marquee */
.marquee{display:flex;gap:12px;overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.marquee-track{display:flex;gap:12px;animation:scrollx 28s linear infinite;flex:0 0 auto}
@keyframes scrollx{to{transform:translateX(-50%)}}

/* section */
.section{padding:54px 0}
.sec-head{text-align:center;margin-bottom:34px}
.sec-head h2{font-family:var(--ff-disp);font-weight:700;font-size:clamp(26px,3.4vw,40px);margin:10px 0 8px}
.sec-head p{color:var(--muted);max-width:520px;margin:0 auto}

/* auth */
.auth-wrap{min-height:100vh;display:grid;place-items:center;padding:40px 20px;position:relative;z-index:1}
.auth-card{width:100%;max-width:460px}
.steps-dots{display:flex;gap:8px;align-items:center}
.sdot{height:5px;flex:1;background:var(--line);clip-path:var(--notch-sm);overflow:hidden}
.sdot.on{background:linear-gradient(90deg,var(--violet),var(--cyan))}

/* game select tile */
.gtile{position:relative;cursor:pointer;border:1px solid var(--line);background:var(--panel-2);clip-path:var(--notch-sm);padding:14px;display:flex;flex-direction:column;gap:9px;transition:all .15s}
.gtile:hover{border-color:var(--violet);background:rgba(139,92,246,.06)}
.gtile.sel{border-color:transparent;background:rgba(139,92,246,.12);box-shadow:inset 0 0 0 1.5px var(--violet)}
.gtile.sel .gtile-check{opacity:1;transform:scale(1)}
.gtile-check{position:absolute;top:8px;right:8px;width:20px;height:20px;display:grid;place-items:center;background:var(--violet);clip-path:var(--notch-sm);opacity:0;transform:scale(.6);transition:all .15s}

/* toast */
.toast-stack{position:fixed;bottom:22px;right:22px;z-index:200;display:flex;flex-direction:column;gap:10px}
.toast{display:flex;align-items:center;gap:11px;padding:13px 16px;background:var(--panel-2);border:1px solid var(--line);clip-path:var(--notch-sm);min-width:260px;box-shadow:0 20px 50px -20px rgba(0,0,0,.8);animation:toastin .25s ease}
.toast .tbar{width:3px;align-self:stretch}
@keyframes toastin{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:none}}

/* modal */
.modal-bg{position:fixed;inset:0;z-index:150;background:rgba(4,4,9,.78);backdrop-filter:blur(6px);display:grid;place-items:center;padding:24px;animation:fade .2s}
@keyframes fade{from{opacity:0}to{opacity:1}}
.modal{width:100%;max-width:560px;max-height:86vh;overflow:auto;zoom:var(--uiz,1)}

/* chat */
.chat-msgs{display:flex;flex-direction:column;gap:9px;padding:16px;height:320px;overflow-y:auto}
.bubble{max-width:78%;padding:9px 13px;font-size:13.5px;line-height:1.45;clip-path:var(--notch-sm)}
.bubble.me{align-self:flex-end;background:linear-gradient(120deg,var(--violet-lo),var(--violet));color:#fff}
.bubble.them{align-self:flex-start;background:var(--panel-3);border:1px solid var(--line)}
.msg-layout{display:grid;grid-template-columns:300px 1fr;gap:14px;align-items:start}
.msg-list{display:flex;flex-direction:column;gap:6px;max-height:72vh;overflow-y:auto;padding-right:2px}
.msg-item{display:flex;align-items:center;gap:11px;padding:10px 12px;background:var(--panel-2);border:1px solid var(--line);clip-path:var(--notch-sm);cursor:pointer;color:var(--text);width:100%;text-align:left;font:inherit}
.msg-item:hover{border-color:var(--line-soft)}
.msg-item.on{border-color:var(--violet);background:rgba(124,58,237,.14)}
.msg-thread{position:sticky;top:96px}
.msg-empty{display:grid;place-items:center;min-height:320px;border:1px dashed var(--line);clip-path:var(--notch-sm);text-align:center;background:var(--panel-2)}
@media(min-width:761px){ .show-mob{display:none!important} }
@media(max-width:760px){ .msg-layout{grid-template-columns:1fr} .msg-thread{position:static} .msg-list{max-height:none} .hide-mob{display:none!important} }

.muted{color:var(--muted)} .muted2{color:var(--muted-2)}
.flex{display:flex} .ic{display:inline-grid;place-items:center}
.locked{filter:blur(5px);user-select:none;pointer-events:none}

@media (max-width:980px){
  .gm-root{--uiz:1}
  .hero-grid{grid-template-columns:1fr;gap:28px}
  .grid-feat{grid-template-columns:repeat(2,1fr)}
  .app-shell{grid-template-columns:1fr}
  .sidebar{position:fixed;left:0;top:0;z-index:120;transform:translateX(-100%);transition:transform .25s;width:248px}
  .sidebar.open{transform:none;box-shadow:30px 0 80px rgba(0,0,0,.6)}
  .mob-only{display:flex!important}
}
@media (min-width:981px){ .mob-only{display:none!important} }
@media (max-width:560px){
  .grid-feat{grid-template-columns:1fr}
  .statline{gap:18px}
  .main-area,.topbar{padding-left:16px;padding-right:16px}
}
.landing-zoom{zoom:var(--lz,1)}
@media (max-width:760px){
  .landing-zoom{zoom:1!important}
  .topbar{flex-wrap:wrap;gap:10px;padding:12px 16px}
  .tb-search{flex:1 1 100%!important;max-width:none!important}
  .hdr-nav{flex:1 1 100%;order:4;justify-content:flex-start;gap:8px;flex-wrap:wrap}
  .hero{padding:42px 0 20px}
  .modal-bg{padding:14px}
  .modal{max-height:92vh}
  .profile-grid{grid-template-columns:1fr!important}
  .main-area{padding:18px 14px 48px}
  .sidebar{width:min(86vw,300px)}
  .statline .s b{font-size:21px}
}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`;

/* ============================== DATA ============================== */

const DB = (typeof window!=="undefined" && window.__GM_DB) || null;

const GAMES = [
  { id:"valorant", name:"VALORANT", short:"VAL", cat:"competitive", color:"#FF4655", Icon:Crosshair,
    ranks:["Demir","Bronz","Gümüş","Altın","Platin","Elmas","Yükselen","Ölümsüz","Radyant"],
    roles:["Düellocu","Kontrolcü","Nöbetçi","Başlatıcı"] },
  { id:"lol", name:"League of Legends", short:"LoL", cat:"competitive", color:"#C8AA6E", Icon:Swords,
    ranks:["Demir","Bronz","Gümüş","Altın","Platin","Zümrüt","Elmas","Üstat","Baş Üstat","Şampiyon Adayı"],
    roles:["Üst Koridor","Orman","Orta Koridor","Nişancı","Destek"] },
  { id:"cs2", name:"Counter-Strike 2", short:"CS2", cat:"competitive", color:"#F0A500", Icon:Crosshair,
    ranks:["Gümüş","Altın Nova","Usta Muhafız","Efsanevi Kartal","Yüce","Küresel Elit","Premier 10K","Premier 15K","Premier 20K+"],
    roles:["Giriş","AWP'ci","Destek","Takım Lideri","Pusucu"] },
  { id:"dota2", name:"Dota 2", short:"DOTA", cat:"competitive", color:"#C23C2A", Icon:Swords,
    ranks:["Haberci","Muhafız","Haçlı","Arkon","Efsane","Kadim","İlahi","Ölümsüz"],
    roles:["Taşıyıcı","Orta Koridor","Offlane","Yumuşak Destek","Tam Destek"] },
  { id:"overwatch", name:"Overwatch 2", short:"OW2", cat:"competitive", color:"#F99E1A", Icon:Shield,
    ranks:["Bronz","Gümüş","Altın","Platin","Elmas","Üstat","Baş Üstat","Top 500"],
    roles:["Tank","Hasar","Destek"] },
  { id:"r6", name:"Rainbow Six Siege", short:"R6", cat:"competitive", color:"#5B9BD5", Icon:Shield,
    ranks:["Bakır","Bronz","Gümüş","Altın","Platin","Zümrüt","Elmas","Şampiyon"],
    roles:["Giriş","Destek","Çapa","Esnek","Takım Lideri"] },
  { id:"apex", name:"Apex Legends", short:"APEX", cat:"competitive", color:"#DA292A", Icon:Crosshair,
    ranks:["Çaylak","Bronz","Gümüş","Altın","Platin","Elmas","Üstat","Avcı"],
    roles:["Vurucu","Destek","Takım Lideri","Keşif"] },
  { id:"fortnite", name:"Fortnite", short:"FN", cat:"competitive", color:"#7B68EE", Icon:Zap,
    ranks:["Bronz","Gümüş","Altın","Platin","Elmas","Elit","Şampiyon","Gerçeküstü"],
    roles:["İnşaatçı","Vurucu","Takım Lideri"] },
  { id:"minecraft", name:"Minecraft", short:"MC", cat:"casual", color:"#6AA84F", Icon:Gamepad2,
    ranks:["Günlük","İnşaatçı","Redstone","Survival Uzmanı","Hardcore"], roles:["İnşaatçı","Redstone","Kaşif","PvP"] },
  { id:"gta", name:"GTA Online", short:"GTA", cat:"casual", color:"#79C300", Icon:Gamepad2,
    ranks:["Lv 1-50","Lv 50-100","Lv 100-300","Lv 300+"], roles:["Soyguncu","Yarışçı","Grindci","Rol Yapma"] },
  { id:"rocketleague", name:"Rocket League", short:"RL", cat:"casual", color:"#1F8FFF", Icon:Zap,
    ranks:["Bronz","Gümüş","Altın","Platin","Elmas","Şampiyon","Büyük Şampiyon","SSL"], roles:["Forvet","Orta Saha","Kaleci"] },
  { id:"pubg", name:"PUBG", short:"PUBG", cat:"casual", color:"#F2A900", Icon:Crosshair,
    ranks:["Bronz","Gümüş","Altın","Platin","Elmas","Üstat","Fatih"], roles:["Vurucu","Destek","Sürücü","Keskin Nişancı"] },
  { id:"amongus", name:"Among Us", short:"AU", cat:"casual", color:"#C51111", Icon:Gamepad2,
    ranks:["Mürettebat","Dedektif","Sahtekar Uzmanı","Galaksi Beyni"], roles:["Mürettebat","Sahtekar"] },
  { id:"terraria", name:"Terraria", short:"TER", cat:"casual", color:"#8BC34A", Icon:Gamepad2,
    ranks:["Ön-Zorlu Mod","Zorlu Mod","Uzman","Üstat"], roles:["İnşaatçı","Dövüşçü","Kaşif"] },
  { id:"marvelrivals", name:"Marvel Rivals", short:"MR", cat:"competitive", color:"#ED1D24", Icon:Crosshair,
    ranks:["Bronz","Gümüş","Altın","Platin","Elmas","Yüce","Efsane","Ebedi","Tek Üstün"], roles:["Düellocu","Öncü","Stratejist"] },
  { id:"cod", name:"Call of Duty: Warzone", short:"COD", cat:"competitive", color:"#7FB800", Icon:Crosshair,
    ranks:["Bronz","Gümüş","Altın","Platin","Elmas","Kristal","Efsane"], roles:["Saldırgan","Destek","Keskin Nişancı","Keşif"] },
  { id:"battlefield", name:"Battlefield 6", short:"BF6", cat:"competitive", color:"#5C7A29", Icon:Crosshair,
    ranks:["Er","Onbaşı","Çavuş","Subay","General"], roles:["Saldırgan","Sıhhiyeci","Destek","Keşif","Mühendis"] },
  { id:"thefinals", name:"The Finals", short:"FIN", cat:"competitive", color:"#D6001C", Icon:Zap,
    ranks:["Bronz","Gümüş","Altın","Platin","Elmas","Rubin"], roles:["Hafif","Orta","Ağır"] },
  { id:"deltaforce", name:"Delta Force", short:"DF", cat:"competitive", color:"#6B7A1E", Icon:Crosshair,
    ranks:["Er","Onbaşı","Çavuş","Subay","Komutan"], roles:["Saldırgan","Destek","Keskin Nişancı","Mühendis"] },
  { id:"tarkov", name:"Escape from Tarkov", short:"EFT", cat:"competitive", color:"#9A8866", Icon:Crosshair,
    ranks:["Seviye 1-10","11-20","21-30","31-40","40+"], roles:["Saldırgan","Keskin Nişancı","Destek","Yağmacı"] },
  { id:"arcraiders", name:"ARC Raiders", short:"ARC", cat:"competitive", color:"#2BB2E0", Icon:Crosshair,
    ranks:["Çaylak","Akıncı","Uzman","Veteran","Efsane"], roles:["Vurucu","Destek","Keşif"] },
  { id:"destiny2", name:"Destiny 2", short:"D2", cat:"competitive", color:"#4A90D9", Icon:Crosshair,
    ranks:["Çaylak","Muhafız","Efsane","Rakip","Efsanevi"], roles:["Avcı","Büyücü","Titan"] },
  { id:"tft", name:"Teamfight Tactics", short:"TFT", cat:"competitive", color:"#00C2A8", Icon:Crown,
    ranks:["Demir","Bronz","Gümüş","Altın","Platin","Zümrüt","Elmas","Üstat","Şampiyon Adayı"], roles:["Taktikçi"] },
  { id:"tekken8", name:"Tekken 8", short:"TK8", cat:"competitive", color:"#2A5CC4", Icon:Swords,
    ranks:["Acemi","Dövüşçü","Uzman","Usta","Tekken Tanrısı"], roles:["Dövüşçü"] },
  { id:"sf6", name:"Street Fighter 6", short:"SF6", cat:"competitive", color:"#E8A33D", Icon:Swords,
    ranks:["Demir","Bronz","Gümüş","Altın","Platin","Elmas","Usta"], roles:["Dövüşçü"] },
  { id:"gt7", name:"Gran Turismo 7", short:"GT7", cat:"competitive", color:"#1B59C4", Icon:Zap,
    ranks:["E","D","C","B","A","S"], roles:["Pilot"] },
  { id:"eafc", name:"EA Sports FC 26", short:"FC26", cat:"competitive", color:"#1D9BF0", Icon:Trophy,
    ranks:["Div 10","Div 7","Div 5","Div 3","Div 1","Elit"], roles:["Forvet","Orta Saha","Defans","Kaleci","Kanat"] },
  { id:"nba2k", name:"NBA 2K26", short:"2K", cat:"competitive", color:"#C8102E", Icon:Trophy,
    ranks:["Çaylak","Yıldız","All-Star","Efsane"], roles:["Oyun Kurucu","Şutör","Pivot","Forvet"] },
  { id:"fivem", name:"FiveM (GTA V Rol Yapma)", short:"FiveM", cat:"casual", color:"#F79E1B", Icon:Gamepad2,
    ranks:["Yeni","Vatandaş","Esnaf","Çete Üyesi","Veteran"], roles:["Rol Yapma","Polis","Çete","Şoför","Esnaf"] },
  { id:"helldivers", name:"Helldivers 2", short:"HD2", cat:"casual", color:"#E8C400", Icon:Shield,
    ranks:["Çaylak","Asker","Komando","Kahraman","Efsane"], roles:["Ağır Silah","Destek","Keşif","Sağlık"] },
  { id:"warframe", name:"Warframe", short:"WF", cat:"casual", color:"#4FC3F7", Icon:Sparkles,
    ranks:["Başlangıç","MR5","MR10","MR15","MR20+"], roles:["Hasar","Destek","Tank","Keşif"] },
  { id:"diablo4", name:"Diablo IV", short:"D4", cat:"casual", color:"#9B1B1B", Icon:Flame,
    ranks:["Maceracı","Kâbus","Cehennem I","Cehennem IV","Ebedi"], roles:["Barbar","Büyücü","Nekromancer","Druid","Haydut"] },
  { id:"poe2", name:"Path of Exile 2", short:"PoE2", cat:"casual", color:"#A14B2A", Icon:Flame,
    ranks:["Acemi","Maceracı","Usta","Efsane"], roles:["Savaşçı","Büyücü","Suikastçı","Korucu"] },
  { id:"eldenring", name:"Elden Ring", short:"ER", cat:"casual", color:"#C9A227", Icon:Swords,
    ranks:["Lekeli","Şövalye","Lord Adayı","Elden Lord"], roles:["Yakın Dövüş","Büyü","Co-op Yardım","İstilacı"] },
  { id:"mhwilds", name:"Monster Hunter Wilds", short:"MHW", cat:"casual", color:"#2E8B57", Icon:Swords,
    ranks:["Avcı 1-3","4-6","7-9","Usta Avcı"], roles:["Yakın Dövüş","Menzilli","Destek"] },
  { id:"bg3", name:"Baldur's Gate 3", short:"BG3", cat:"casual", color:"#7B2D26", Icon:Sparkles,
    ranks:["1. Seviye","5. Seviye","10. Seviye","Efsane"], roles:["Savaşçı","Büyücü","Haydut","Ruhban","Paladin"] },
  { id:"seaofthieves", name:"Sea of Thieves", short:"SoT", cat:"casual", color:"#1CA3DE", Icon:Gamepad2,
    ranks:["Çaylak Korsan","Denizci","Efsane","Korsan Efsanesi"], roles:["Kaptan","Topçu","Dümenci","Hazine Avcısı"] },
  { id:"dbd", name:"Dead by Daylight", short:"DBD", cat:"casual", color:"#8B1A1A", Icon:Shield,
    ranks:["Kül III","Gümüş","Altın","İris I"], roles:["Hayatta Kalan","Katil"] },
  { id:"palworld", name:"Palworld", short:"PAL", cat:"casual", color:"#3FB4C9", Icon:Gamepad2,
    ranks:["Yeni","Pal Eğitmeni","Üs Lideri","Veteran"], roles:["Avcı","İnşaatçı","Üretici","Savaşçı"] },
  { id:"valheim", name:"Valheim", short:"VLH", cat:"casual", color:"#6F8FAF", Icon:Shield,
    ranks:["Sürgün","Kâşif","Viking","Efsane"], roles:["İnşaatçı","Savaşçı","Kâşif","Çiftçi"] },
  { id:"stardew", name:"Stardew Valley", short:"SDV", cat:"casual", color:"#8FBC5A", Icon:Gamepad2,
    ranks:["Yeni Çiftçi","Çiftçi","Usta","Efsane"], roles:["Çiftçi","Madenci","Balıkçı","Toplayıcı"] },
  { id:"roblox", name:"Roblox", short:"RBLX", cat:"casual", color:"#E2231A", Icon:Gamepad2,
    ranks:["Yeni","Oyuncu","Yaratıcı","Veteran"], roles:["Oyuncu","Yaratıcı","Rol Yapma"] },
  { id:"fallguys", name:"Fall Guys", short:"FALL", cat:"casual", color:"#FF5FA2", Icon:Sparkles,
    ranks:["Fasulye","Yarışmacı","Finalist","Şampiyon"], roles:["Yarışmacı","Takım"] },
  { id:"ffxiv", name:"Final Fantasy XIV", short:"FF14", cat:"casual", color:"#2E4FA3", Icon:Crown,
    ranks:["Maceracı","Savaşçı","Veteran","Efsane"], roles:["Tank","Şifacı","Hasar"] },
  { id:"rust", name:"Rust", short:"RUST", cat:"casual", color:"#CE412B", Icon:Flame,
    ranks:["Çıplak","Hayatta Kalan","Kabile","Raider","Veteran"], roles:["Toplayıcı","Raider","İnşaatçı","Nişancı"] },
];
const gameById = id => GAMES.find(g => g.id === id);
const PC_ONLY = new Set(["lol","cs2","dota2","fivem","tarkov","tft","valheim"]);
const PS5_ONLY = new Set(["gt7"]);
const gamePlat = id => PC_ONLY.has(id) ? ["PC"] : PS5_ONLY.has(id) ? ["PS5"] : ["PC","PS5"];
const gameOnDevices = (id, devs) => (!devs || devs.length===0) ? true : gamePlat(id).some(p=>devs.includes(p));

const TAGS = [
  { id:"friendly", label:"Arkadaş Canlısı", color:"#34D399", Icon:Heart },
  { id:"competitive", label:"Rekabetçi", color:"#FB5C6B", Icon:Flame },
  { id:"chill", label:"Sakin", color:"#22D3EE", Icon:Coffee },
  { id:"tryhard", label:"İddialı", color:"#F5C451", Icon:Swords },
  { id:"night", label:"Gece Kuşu", color:"#8B5CF6", Icon:Moon },
  { id:"mic", label:"Mikrofon", color:"#A78BFA", Icon:Mic },
];
const tagById = id => TAGS.find(t => t.id === id);

const TIMES = Array.from({length:24}, (_,h)=>({ id:String(h), label:String(h).padStart(2,"0")+":00" }));

const PLATFORMS = [
  { id:"steam", label:"Steam", color:"#66c0f4", field:"Steam ID" },
  { id:"riot", label:"Riot", color:"#FF4655", field:"Riot ID" },
  { id:"epic", label:"Epic Games", color:"#9aa0a6", field:"Epic ID" },
  { id:"discord", label:"Discord", color:"#5865F2", field:"Discord" },
  { id:"psn", label:"PlayStation", color:"#2E6DB4", field:"PSN ID" },
  { id:"xbox", label:"Xbox", color:"#107C10", field:"Xbox Tag" },
  { id:"nintendo", label:"Nintendo", color:"#E60012", field:"Switch FC" },
];
/* Elle girilen iletişim alanları — yalnızca eşleşilen (arkadaş) oyuncular görür */
const CONTACT_FIELDS = [
  { id:"steamUrl", label:"STEAM PROFİL LİNKİ", color:"#66c0f4", ph:"https://steamcommunity.com/id/..." },
  { id:"discord", label:"DISCORD KULLANICI ADI", color:"#5865F2", ph:"örn. komutan veya komutan#0001" },
  { id:"psn", label:"PLAYSTATION (PSN) KULLANICI ADI", color:"#2E6DB4", ph:"örn. Komutan_TR" },
  { id:"riot", label:"RIOT ID", color:"#FF4655", ph:"örn. Komutan#TR1" },
  { id:"steam", label:"STEAM KULLANICI ADI", color:"#66c0f4", ph:"örn. komutan_tr" },
  { id:"epic", label:"EPIC GAMES KULLANICI ADI", color:"#c2c2c2", ph:"örn. KomutanTR" },
  { id:"xbox", label:"XBOX GAMERTAG", color:"#107C10", ph:"örn. KomutanTR" },
];

const PLAYERS = [
  { id:1, age:23, devices:["PC"], name:"NyxStorm", country:"🇹🇷", online:true,  bio:"Gece oyuncusu, sakin takım arkadaşı arıyorum. Mic her zaman açık.",
    tags:["night","friendly","mic"], times:["0","1","2","19","20","21","22","23"], rating:4.8,
    socials:{ discord:"nyxstorm#0021", steam:"nyx_storm", riot:"NyxStorm#TR1" },
    games:[{g:"valorant",rank:"Elmas",role:"Düellocu",ps:"Rekabetçi"},{g:"lol",rank:"Zümrüt",role:"Orta Koridor",ps:"Günlük"}] },
  { id:2, age:28, devices:["PS5"], name:"FrostByte", country:"🇩🇪", online:true,  bio:"IGL main, shotcalling yaparım. Sıralı oynamayı severim.",
    tags:["competitive","tryhard","mic"], times:["19","20","21","22"], rating:4.6,
    socials:{ discord:"frostbyte#7788", steam:"frostbyte", riot:"Frost#EUW" },
    games:[{g:"cs2",rank:"Küresel Elit",role:"Takım Lideri",ps:"Rekabetçi"},{g:"valorant",rank:"Ölümsüz",role:"Kontrolcü",ps:"Rekabetçi"}] },
  { id:3, age:33, devices:["PC","PS5"], name:"LunaPlays", country:"🇫🇷", online:false, bio:"Sakin destek oyuncusu. Toxic değilim, eğlenmeye geldim.",
    tags:["chill","friendly"], times:["8","9","10","11","19","20","21","22"], rating:4.9,
    socials:{ discord:"luna#1234", riot:"Luna#FR2" },
    games:[{g:"lol",rank:"Platin",role:"Destek",ps:"Günlük"},{g:"overwatch",rank:"Elmas",role:"Destek",ps:"Günlük"}] },
  { id:4, age:22, devices:["PC"], name:"Krähe", country:"🇦🇹", online:true,  bio:"Aim diff. AWP main. Premier grind yoldaşı arıyorum.",
    tags:["tryhard","competitive"], times:["0","1","2","23"], rating:4.4,
    socials:{ discord:"krahe#0009", steam:"krahe_awp" },
    games:[{g:"cs2",rank:"Premier 15K",role:"AWP'ci",ps:"Rekabetçi"}] },
  { id:5, age:27, devices:["PS5"], name:"PixelPanda", country:"🇹🇷", online:true,  bio:"Build & survival. Birlikte server kuralım mı?",
    tags:["chill","friendly"], times:["8","9","10","11","19","20","21","22"], rating:5.0,
    socials:{ discord:"panda#4040", steam:"pixelpanda" },
    games:[{g:"minecraft",rank:"İnşaatçı",role:"İnşaatçı",ps:"Günlük"},{g:"terraria",rank:"Zorlu Mod",role:"İnşaatçı",ps:"Günlük"}] },
  { id:6, age:32, devices:["PC","PS5"], name:"VoidRunner", country:"🇬🇧", online:false, bio:"Apex predator push. Movement demon. Mic şart.",
    tags:["competitive","tryhard","mic"], times:["0","1","2","19","20","21","22","23"], rating:4.5,
    socials:{ discord:"void#1010", steam:"voidrunner" },
    games:[{g:"apex",rank:"Üstat",role:"Vurucu",ps:"Rekabetçi"},{g:"valorant",rank:"Yükselen",role:"Düellocu",ps:"Rekabetçi"}] },
  { id:7, age:21, devices:["PC"], name:"SakuraOW", country:"🇯🇵", online:true,  bio:"Tank main, frontline tutar. Sakin ve sabırlı.",
    tags:["friendly","chill"], times:["8","9","10","11"], rating:4.7,
    socials:{ discord:"sakura#2222", riot:"Sakura#JP1" },
    games:[{g:"overwatch",rank:"Üstat",role:"Tank",ps:"Rekabetçi"},{g:"valorant",rank:"Platin",role:"Nöbetçi",ps:"Günlük"}] },
  { id:8, age:26, devices:["PS5"], name:"TurboTito", country:"🇪🇸", online:true,  bio:"Rocket League SSL push + GTA heist crew. Hep gülerim.",
    tags:["chill","friendly","mic"], times:["0","1","2","19","20","21","22","23"], rating:4.8,
    socials:{ discord:"tito#5555", steam:"turbotito", psn:"TurboTito" },
    games:[{g:"rocketleague",rank:"Şampiyon",role:"Forvet",ps:"Günlük"},{g:"gta",rank:"Lv 300+",role:"Soyguncu",ps:"Günlük"}] },
  { id:9, age:31, devices:["PC","PS5"], name:"GhostJin", country:"🇰🇷", online:false, bio:"Jungle diff. Macro odaklı oynarım. Soloq'tan bıktım.",
    tags:["competitive","tryhard"], times:["0","1","2","23"], rating:4.3,
    socials:{ discord:"jin#9090", riot:"GhostJin#KR" },
    games:[{g:"lol",rank:"Üstat",role:"Orman",ps:"Rekabetçi"},{g:"dota2",rank:"İlahi",role:"Orta Koridor",ps:"Rekabetçi"}] },
  { id:10, age:20, devices:["PC"], name:"MileyM", country:"🇹🇷", online:true,  bio:"Sıradan gece kuşu. Among Us & PUBG severim. Drama yok.",
    tags:["chill","night","friendly"], times:["0","1","2","23"], rating:4.9,
    socials:{ discord:"miley#3333", steam:"mileym" },
    games:[{g:"pubg",rank:"Elmas",role:"Keskin Nişancı",ps:"Günlük"},{g:"amongus",rank:"Sahtekar Uzmanı",role:"Sahtekar",ps:"Günlük"}] },
  { id:11, age:25, devices:["PS5"], name:"DraknΩ", country:"🇵🇱", online:true,  bio:"R6 anchor + Dota support. Sabırlı, öğretmeyi severim.",
    tags:["friendly","mic","chill"], times:["19","20","21","22"], rating:4.6,
    socials:{ discord:"drakn#7070", steam:"draknomega" },
    games:[{g:"r6",rank:"Elmas",role:"Çapa",ps:"Rekabetçi"},{g:"dota2",rank:"Kadim",role:"Tam Destek",ps:"Günlük"}] },
  { id:12, age:30, devices:["PC","PS5"], name:"AceBuilder", country:"🇨🇦", online:false, bio:"Fortnite zero-build & build. Scrim partner arıyorum.",
    tags:["competitive","tryhard"], times:["0","1","2","19","20","21","22","23"], rating:4.4,
    socials:{ discord:"ace#1212", epic:"AceBuilderYT" },
    games:[{g:"fortnite",rank:"Şampiyon",role:"İnşaatçı",ps:"Rekabetçi"}] },
];

/* current user (mutable via register/onboarding) */
const DEFAULT_USER = {
  name:"Komutan", country:"🇹🇷", email:"", age:24, online:true, admin:true, devices:["PC"], bio:"Profilini düzenle ve kendini takımlara tanıt.",
  tags:["friendly","competitive"], times:["19","20","21","22"],
  socials:{ discord:"", steam:"", steamUrl:"", riot:"", epic:"", psn:"", xbox:"" },
  games:[{g:"valorant",rank:"Altın",role:"Başlatıcı",ps:"Rekabetçi"}],
};

/* ============================== HELPERS / SMALL UI ============================== */

function rankPalette(game, rank){
  const i = game.ranks.indexOf(rank); const n = game.ranks.length - 1;
  const f = n <= 0 ? 1 : i / n;
  if (i === game.ranks.length - 1) return { c:"#F5C451", bg:"rgba(245,196,81,.1)", b:"rgba(245,196,81,.45)" };
  if (f < 0.28) return { c:"#9A9ABA", bg:"rgba(154,154,186,.08)", b:"rgba(154,154,186,.3)" };
  if (f < 0.6)  return { c:"#22D3EE", bg:"rgba(34,211,238,.08)",  b:"rgba(34,211,238,.4)" };
  return { c:"#A78BFA", bg:"rgba(139,92,246,.1)", b:"rgba(139,92,246,.45)" };
}
function RankBadge({ gameId, rank, sm }){
  const g = gameById(gameId); if (!g) return null;
  const p = rankPalette(g, rank);
  return (
    <span className="rankbadge" style={{ borderColor:p.b, background:p.bg, color:p.c, fontSize: sm?12:13 }}>
      <span className="rk-tier" style={{ background:p.c }} />
      {rank}
    </span>
  );
}

function hashCode(s){ let h=0; for(let i=0;i<s.length;i++){ h=(h<<5)-h+s.charCodeAt(i); h|=0; } return Math.abs(h); }
function Avatar({ name, size=46, online, ring }){
  const h = hashCode(name);
  const a = h % 360, b = (h*7) % 360;
  const initials = name.replace(/[^A-Za-zÀ-ÿ0-9]/g,"").slice(0,2).toUpperCase() || "GM";
  return (
    <div className="avatar" style={{
      width:size, height:size, fontSize:size*0.36,
      background:`linear-gradient(135deg,hsl(${a} 70% 32%),hsl(${b} 75% 22%))`,
      boxShadow: ring ? "0 0 0 1.5px rgba(139,92,246,.5)" : "inset 0 0 0 1px rgba(255,255,255,.08)"
    }}>
      {initials}
      {online !== undefined && (
        <span className="av-status" style={{ background: online ? "var(--volt)" : "var(--muted-2)" }} />
      )}
    </div>
  );
}

function Hud({ accent, volt, hover, className="", style, children, pad=true, ticks }){
  return (
    <div className={`hud-frame ${accent?"accent":""} ${volt?"volt":""} ${hover?"hover":""} ${className}`} style={style}>
      <div className={`hud-body ${pad?"pad":""}`}>
        {ticks && <><span className="tick tl" /><span className="tick br" /></>}
        {children}
      </div>
    </div>
  );
}

function TagPill({ id, sm }){
  const t = tagById(id); if(!t) return null; const I = t.Icon;
  return <span className="tag-pill" style={{ borderColor:t.color+"66", color:t.color, fontSize: sm?11:11.5 }}>
    <I size={12} /> {t.label}
  </span>;
}
function GameIcon({ gameId, size=26 }){
  const g = gameById(gameId); if(!g) return null; const I = g.Icon;
  return <span className="gi" style={{ width:size, height:size, background:g.color+"22", color:g.color }}><I size={size*0.55} /></span>;
}

function Logo({ size=38 }){
  return (
    <div className="logo">
      <svg className="logo-mark" style={{width:size,height:size}} viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="lgm" x1="0" y1="0" x2="48" y2="48">
            <stop stopColor="#A78BFA"/><stop offset="1" stopColor="#22D3EE"/>
          </linearGradient>
        </defs>
        <path d="M14 2 H46 V34 L34 46 H2 V14 Z" fill="url(#lgm)" opacity="0.16"/>
        <path d="M14 2 H46 V34 L34 46 H2 V14 Z" stroke="url(#lgm)" strokeWidth="1.5"/>
        <path d="M16 31 V17 L24 24 L32 17 V31" stroke="url(#lgm)" strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round" fill="none"/>
        <circle cx="24" cy="24" r="2.4" fill="#22D3EE"/>
      </svg>
      <span className="logo-txt">GAME<b>MATE</b></span>
    </div>
  );
}

function Background(){
  return (
    <div className="bg-layer">
      <div className="bg-glow a" /><div className="bg-glow b" /><div className="bg-glow c" />
      <div className="bg-grid" /><div className="bg-scan" /><div className="bg-vig" />
    </div>
  );
}

/* ============================== TOASTS ============================== */
function useToasts(){
  const [list, setList] = useState([]);
  const push = (msg, kind="ok") => {
    const id = Math.random().toString(36).slice(2);
    setList(l => [...l, { id, msg, kind }]);
    setTimeout(() => setList(l => l.filter(t => t.id !== id)), 3200);
  };
  const node = (
    <div className="toast-stack">
      {list.map(t => {
        const color = t.kind==="ok" ? "var(--volt)" : t.kind==="info" ? "var(--cyan)" : "var(--danger)";
        const I = t.kind==="bad" ? X : t.kind==="info" ? Bell : Check;
        return (
          <div className="toast" key={t.id}>
            <span className="tbar" style={{ background:color }} />
            <span className="ic" style={{ color }}><I size={16} /></span>
            <span style={{ fontSize:13.5 }}>{t.msg}</span>
          </div>
        );
      })}
    </div>
  );
  return { push, node };
}

/* ============================== LANDING ============================== */
function Landing({ onStart, onLogin, onInfo, onBlog, siteCfg={ logoSize:42 } }){
  const liveQueue = [
    { name:"NyxStorm", game:"valorant", rank:"Elmas", t:"şimdi" },
    { name:"FrostByte", game:"cs2", rank:"Küresel Elit", t:"2sn önce" },
    { name:"TurboTito", game:"rocketleague", rank:"Şampiyon", t:"5sn önce" },
    { name:"SakuraOW", game:"overwatch", rank:"Üstat", t:"11sn önce" },
  ];
  const features = [
    { Icon:Trophy, t:"Rankına göre eşleş", d:"Aynı seviyedeki oyuncuları filtrele. Smurf yok, mismatch yok — sadece sana uygun takım." },
    { Icon:UserPlus, t:"Kalıcı takım kur", d:"Rastgele soloq tanışmaları değil; ekleyip kaydedebileceğin gerçek oyun arkadaşları." },
    { Icon:Gamepad2, t:"Her oyundan keşfet", d:"Rekabetçi FPS'ten sakin survival'a — oynadığın her oyun için ayrı eşleşme." },
    { Icon:Sparkles, t:"Tarzına göre filtre", d:"İddialı mı, sakin mi, gece kuşu mu? Etiketlerle tam istediğin oyuncuyu bul." },
  ];
  return (
    <div style={{ position:"relative", zIndex:1 }}>
      {/* nav */}
      <div className="container" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"22px 24px" }}>
        <Logo size={siteCfg.logoSize} />
        <div className="flex" style={{ gap:10, alignItems:"center" }}>
          <button className="btn btn-ghost btn-sm" onClick={onInfo}>Nasıl Çalışır</button>
          <button className="btn btn-ghost btn-sm" onClick={onBlog}>Blog</button>
          <button className="btn btn-ghost btn-sm" onClick={onLogin}>Giriş Yap</button>
          <button className="btn btn-primary btn-sm" onClick={onStart}>Ücretsiz Başla</button>
        </div>
      </div>

      {/* hero */}
      <div className="container hero">
        <div className="hero-grid">
          <div>
            <span className="chip" style={{ color:"var(--cyan)", borderColor:"rgba(34,211,238,.3)" }}>
              <span className="online-dot" /> 2.847 oyuncu şu an queue&apos;da
            </span>
            <h1 className="disp">
              TEK BAŞINA<br/>OYNAMA.<br/>
              <span className="h-grad">TAKIMINI BUL.</span>
            </h1>
            <p className="sub">Seninle aynı oyunu oynayan, aynı seviyedeki oyuncularla tanış. Rankına, rolüne ve oyun tarzına göre eşleş; kabul edilince Steam ve Discord&apos;dan ekleş.</p>
            <div className="flex" style={{ gap:12, flexWrap:"wrap" }}>
              <button className="btn btn-primary" onClick={onStart} style={{ padding:"14px 26px", fontSize:15 }}>
                Ücretsiz Başla <ArrowRight size={17} />
              </button>
              <button className="btn btn-ghost" onClick={onLogin} style={{ padding:"14px 22px" }}>Hesabım Var</button>
            </div>
            <div className="statline">
              <div className="s"><b className="h-grad">{GAMES.length}</b><span>Desteklenen Oyun</span></div>
              <div className="s"><b style={{color:"var(--volt)"}}>{PLAYERS.length}</b><span>Eşleşme</span></div>
              <div className="s"><b style={{color:"var(--cyan)"}}>2</b><span>Platform Desteği</span></div>
            </div>
          </div>

          {/* live matchmaking signature card */}
          <Hud accent ticks>
            <div className="flex" style={{ justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <span className="eyebrow">// CANLI EŞLEŞME</span>
              <span className="chip" style={{ color:"var(--volt)", borderColor:"rgba(52,211,153,.3)" }}>
                <span className="online-dot" /> LIVE
              </span>
            </div>
            <div style={{ background:"var(--panel-2)", clipPath:"var(--notch-sm)", border:"1px solid var(--line)" }}>
              {liveQueue.map((q,i) => (
                <div className="queue-row" key={i}>
                  <Avatar name={q.name} size={38} online />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, fontSize:14 }}>{q.name}</div>
                    <div className="mono muted2" style={{ fontSize:11 }}>{q.t} • queue&apos;a girdi</div>
                  </div>
                  <RankBadge gameId={q.game} rank={q.rank} sm />
                </div>
              ))}
            </div>
            <button className="btn btn-volt btn-block" style={{ marginTop:13 }} onClick={onStart}>
              <Zap size={15} /> Sıraya Katıl
            </button>
          </Hud>
        </div>
      </div>

      {/* games marquee */}
      <div className="container" style={{ padding:"30px 24px" }}>
        <div className="eyebrow" style={{ textAlign:"center", marginBottom:16 }}>// DESTEKLENEN OYUNLAR</div>
        <div className="marquee">
          {[0,1].map(dup => (
            <div className="marquee-track" key={dup} aria-hidden={dup===1}>
              {GAMES.map(g => (
                <div className="chip" key={g.id+dup} style={{ padding:"9px 14px", fontSize:13, color:"var(--text)" }}>
                  <GameIcon gameId={g.id} size={20} /> {g.name}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* features */}
      <div className="container section">
        <div className="sec-head">
          <span className="eyebrow">// NEDEN GAMEMATE</span>
          <h2 className="disp">Soloq&apos;un panzehiri</h2>
          <p>Oyun içinden rastgele tanıştığın kişiler bir maç sonra kaybolur. GameMate kalıcı takım kurman için tasarlandı.</p>
        </div>
        <div className="grid-feat">
          {features.map((f,i) => {
            const I = f.Icon;
            return (
              <Hud hover key={i}>
                <span className="ic" style={{ width:42, height:42, clipPath:"var(--notch-sm)", background:"linear-gradient(135deg,rgba(139,92,246,.25),rgba(34,211,238,.12))", color:"var(--violet-hi)", marginBottom:14 }}>
                  <I size={20} />
                </span>
                <div className="disp" style={{ fontSize:18, fontWeight:600, marginBottom:7 }}>{f.t}</div>
                <p className="muted" style={{ fontSize:13.5, lineHeight:1.55 }}>{f.d}</p>
              </Hud>
            );
          })}
        </div>
      </div>

      {/* how it works */}
      <div className="container section" style={{ paddingTop:10 }}>
        <div className="sec-head">
          <span className="eyebrow">// 3 ADIM</span>
          <h2 className="disp">Nasıl çalışır</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }} className="grid-feat">
          {[
            { n:"01", t:"Profil & oyun ekle", d:"Oynadığın oyunları, rankını ve rolünü gir. Onboarding 1 dakika sürer." },
            { n:"02", t:"Filtrele & davet et", d:"Oyun ve ranka göre oyuncu bul, 'Birlikte Oyna' daveti gönder." },
            { n:"03", t:"Eşleş & ekleş", d:"Karşı taraf kabul edince iletişim bilgileri açılır, Discord/Steam'den ekle." },
          ].map((s,i) => (
            <Hud key={i}>
              <div className="disp h-grad" style={{ fontSize:38, fontWeight:700, lineHeight:1, marginBottom:10 }}>{s.n}</div>
              <div className="disp" style={{ fontSize:17, fontWeight:600, marginBottom:6 }}>{s.t}</div>
              <p className="muted" style={{ fontSize:13.5, lineHeight:1.55 }}>{s.d}</p>
            </Hud>
          ))}
        </div>
      </div>

      {/* final CTA */}
      <div className="container" style={{ paddingBottom:60 }}>
        <Hud accent style={{ marginTop:10 }}>
          <div style={{ textAlign:"center", padding:"22px 10px" }}>
            <h2 className="disp" style={{ fontSize:"clamp(24px,3.5vw,38px)", fontWeight:700, marginBottom:10 }}>Takımın seni bekliyor.</h2>
            <p className="muted" style={{ maxWidth:440, margin:"0 auto 22px" }}>Ücretsiz kayıt ol, oyunlarını ekle ve bu gece birlikte oynayacağın insanları bul.</p>
            <button className="btn btn-primary" onClick={onStart} style={{ padding:"14px 30px", fontSize:15 }}>
              Hemen Başla <ArrowRight size={17} />
            </button>
          </div>
        </Hud>
        <div className="flex" style={{ justifyContent:"space-between", alignItems:"center", marginTop:30, paddingTop:22, borderTop:"1px solid var(--line-soft)", flexWrap:"wrap", gap:16 }}>
          <Logo size={28} />
          <span className="mono muted2" style={{ fontSize:12 }}>© 2026 GameMate — Tek başına oynama.</span>
        </div>
      </div>
    </div>
  );
}

/* ============================== REGISTER ============================== */
function Register({ onDone, onBack, login }){
  const [f, setF] = useState({ name:"", email:"", pass:"", dob:"", country:"Türkiye", city:"" });
  const set = (k,v) => setF(s => ({ ...s, [k]:v }));
  const valid = login ? (f.email && f.pass) : (f.name && f.email && f.pass && f.dob);
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div style={{ textAlign:"center", marginBottom:22 }}>
          <div style={{ display:"inline-flex" }}><Logo /></div>
        </div>
        <Hud ticks>
          <div style={{ marginBottom:18 }}>
            <span className="eyebrow">{login ? "// GİRİŞ" : "// HESAP OLUŞTUR"}</span>
            <h2 className="disp" style={{ fontSize:24, fontWeight:700, marginTop:6 }}>{login ? "Tekrar hoş geldin" : "Sıraya gir"}</h2>
          </div>
          <div style={{ display:"grid", gap:14 }}>
            {!login && (
              <div className="field"><label>Kullanıcı Adı</label>
                <input className="input" placeholder="örn. NyxStorm" value={f.name} onChange={e=>set("name",e.target.value)} /></div>
            )}
            <div className="field"><label>Email</label>
              <input className="input" type="email" placeholder="sen@oyuncu.gg" value={f.email} onChange={e=>set("email",e.target.value)} /></div>
            <div className="field"><label>Şifre</label>
              <input className="input" type="password" placeholder="••••••••" value={f.pass} onChange={e=>set("pass",e.target.value)} /></div>
            {!login && (
              <>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12 }}>
                  <div className="field"><label>Doğum Tarihi</label>
                    <DobPicker value={f.dob} onChange={v=>set("dob",v)} /></div>
                  <div className="field"><label>Ülke</label>
                    <select className="input" value={f.country} onChange={e=>set("country",e.target.value)}>
                      {["Türkiye","Almanya","Fransa","İngiltere","ABD","Diğer"].map(c=><option key={c}>{c}</option>)}
                    </select></div>
                </div>
                <div className="field"><label>Şehir <span className="muted2">(opsiyonel)</span></label>
                  <input className="input" placeholder="İstanbul" value={f.city} onChange={e=>set("city",e.target.value)} /></div>
              </>
            )}
            <button className="btn btn-primary btn-block" disabled={!valid}
              onClick={() => onDone(f)} style={{ marginTop:4 }}>
              {login ? "Giriş Yap" : "Hesabı Oluştur"} <ChevronRight size={16} />
            </button>
            <button className="btn btn-ghost btn-block btn-sm" onClick={onBack}>Geri</button>
          </div>
        </Hud>
        <p className="muted2 mono" style={{ textAlign:"center", fontSize:11, marginTop:14 }}>
          Devam ederek Kullanım Koşulları&apos;nı kabul edersin.
        </p>
      </div>
    </div>
  );
}

/* ============================== ONBOARDING ============================== */
function Onboarding({ initialName, onComplete }){
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState([]); // game ids
  const [cfg, setCfg] = useState({});       // { gameId: {rank, role, ps, exp, time} }
  const [tags, setTags] = useState(["friendly"]);
  const [hours, setHours] = useState(["19","20","21","22"]);
  const [devices, setDevices] = useState([]);
  const [contact, setContact] = useState({ steam:"", steamUrl:"", discord:"", psn:"" });

  const toggleGame = id => setPicked(p => p.includes(id) ? p.filter(x=>x!==id) : [...p, id]);
  const setCfgVal = (gid, k, v) => setCfg(c => ({ ...c, [gid]: { ...(c[gid]||{}), [k]:v } }));
  const toggleTag = id => setTags(t => t.includes(id) ? t.filter(x=>x!==id) : (t.length<4?[...t,id]:t));

  const comp = GAMES.filter(g=>g.cat==="competitive" && gameOnDevices(g.id, devices));
  const casual = GAMES.filter(g=>g.cat==="casual" && gameOnDevices(g.id, devices));
  useEffect(()=>{ setPicked(p => p.filter(id => gameOnDevices(id, devices))); }, [devices]);

  const canNext0 = devices.length > 0 && picked.length > 0;
  const canFinish = picked.every(id => cfg[id]?.rank && (cfg[id]?.roles||[]).length>0);

  const finish = () => {
    const games = picked.map(id => ({
      g:id, rank:cfg[id].rank,
      role:(cfg[id].roles||[]).join(", "), roles:cfg[id].roles||[],
      ps:cfg[id].ps || "Rekabetçi",
    }));
    onComplete({ games, tags, times: hours.length?hours:["20"], devices,
      socials:{ discord:contact.discord, steam:contact.steam, steamUrl:contact.steamUrl, riot:"", epic:"", psn:contact.psn, xbox:"" } });
  };

  return (
    <div style={{ minHeight:"100vh", position:"relative", zIndex:1 }}>
      <div className="container" style={{ padding:"22px 24px" }}><Logo /></div>
      <div className="container" style={{ maxWidth:760, paddingBottom:60 }}>
        <div className="steps-dots" style={{ margin:"8px 0 26px" }}>
          {[0,1,2].map(i => <div key={i} className={`sdot ${step>=i?"on":""}`} />)}
        </div>

        {step===0 && (
          <div>
            <span className="eyebrow">// ADIM 1 / 3</span>
            <h2 className="disp" style={{ fontSize:30, fontWeight:700, margin:"8px 0 6px" }}>En çok hangi oyunları oynuyorsun?</h2>
            <p className="muted" style={{ marginBottom:20 }}>Birden fazla seçebilirsin. Seçtiğin her oyun için rank ve rol gireceksin.</p>

            <Hud accent style={{ marginBottom:22 }}>
              <h3 className="disp" style={{ fontSize:16, fontWeight:600, marginBottom:4 }}>1. Önce platformunu seç</h3>
              <p className="muted" style={{ fontSize:13, marginBottom:12 }}>Hangi platformda oynuyorsun? Birini ya da ikisini seç.</p>
              <DeviceToggle value={devices} onChange={setDevices} />
            </Hud>

            {devices.length===0 ? (
              <Hud style={{ marginBottom:22 }}>
                <p className="muted" style={{ fontSize:13.5, textAlign:"center", padding:"10px 4px" }}>Oyunları görmek için önce platformunu (PC veya PS5) seç. PC ve PS5&apos;te farklı oyunlar var.</p>
              </Hud>
            ) : (
              <>
                <div className="mono muted" style={{ fontSize:12, letterSpacing:".1em", marginBottom:10 }}>2. OYUNLARINI SEÇ — REKABETÇİ</div>
                {comp.length>0 ? (
                  <div className="grid-games" style={{ marginBottom:22 }}>
                    {comp.map(g => <GameTile key={g.id} g={g} sel={picked.includes(g.id)} onClick={()=>toggleGame(g.id)} />)}
                  </div>
                ) : <p className="muted2" style={{ fontSize:12.5, marginBottom:22 }}>Bu platformda rekabetçi oyun yok.</p>}
                {casual.length>0 && <>
                  <div className="mono muted" style={{ fontSize:12, letterSpacing:".1em", marginBottom:10 }}>SAKİN / PARTİ</div>
                  <div className="grid-games" style={{ marginBottom:26 }}>
                    {casual.map(g => <GameTile key={g.id} g={g} sel={picked.includes(g.id)} onClick={()=>toggleGame(g.id)} />)}
                  </div>
                </>}
              </>
            )}

            <div className="flex" style={{ justifyContent:"space-between", alignItems:"center" }}>
              <span className="mono muted">{picked.length} oyun seçildi</span>
              <button className="btn btn-primary" disabled={!canNext0} onClick={()=>setStep(1)}>Devam Et <ChevronRight size={16} /></button>
            </div>
          </div>
        )}

        {step===1 && (
          <div>
            <span className="eyebrow">// ADIM 2 / 3</span>
            <h2 className="disp" style={{ fontSize:30, fontWeight:700, margin:"8px 0 6px" }}>Her oyun için detaylar</h2>
            <p className="muted" style={{ marginBottom:24 }}>Rank, rol ve oyun tarzını gir — eşleşmen buna göre yapılır.</p>
            <div style={{ display:"grid", gap:16 }}>
              {picked.map(id => {
                const g = gameById(id); const c = cfg[id]||{};
                return (
                  <Hud className="noclip" key={id}>
                    <div className="flex" style={{ alignItems:"center", gap:11, marginBottom:14 }}>
                      <GameIcon gameId={id} size={32} />
                      <div className="disp" style={{ fontWeight:600, fontSize:17 }}>{g.name}</div>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12 }}>
                      <div className="field"><label>Rank</label>
                        <select className="input" value={c.rank||""} onChange={e=>setCfgVal(id,"rank",e.target.value)}>
                          <option value="" disabled>Seç</option>
                          {g.ranks.map(r=><option key={r}>{r}</option>)}
                        </select></div>
                      <div className="field"><label>Rol (birden fazla seçebilirsin)</label>
                        <MultiSelect options={g.roles} value={c.roles||[]} onChange={arr=>setCfgVal(id,"roles",arr)} placeholder="Rol seç" /></div>
                      <div className="field"><label>Oyun Modu</label>
                        <select className="input" value={c.ps||"Rekabetçi"} onChange={e=>setCfgVal(id,"ps",e.target.value)}>
                          {["Rekabetçi","Günlük","İkisi de"].map(r=><option key={r}>{r}</option>)}
                        </select></div>

                    </div>
                  </Hud>
                );
              })}
            </div>
            <Hud style={{ marginBottom:22 }}>
              <h3 className="disp" style={{ fontSize:16, fontWeight:600, marginBottom:4 }}>Aktif Saat Aralığın</h3>
              <p className="muted" style={{ fontSize:13, marginBottom:12 }}>Hangi saatlerde oyundasın? Eşleşmeler buna göre yapılır.</p>
              <HoursPicker value={hours} onChange={setHours} />
            </Hud>
            <div className="flex" style={{ justifyContent:"space-between", marginTop:22 }}>
              <button className="btn btn-ghost" onClick={()=>setStep(0)}>Geri</button>
              <button className="btn btn-primary" disabled={!canFinish} onClick={()=>setStep(2)}>Devam Et <ChevronRight size={16} /></button>
            </div>
          </div>
        )}

        {step===2 && (
          <div>
            <span className="eyebrow">// ADIM 3 / 3</span>
            <h2 className="disp" style={{ fontSize:30, fontWeight:700, margin:"8px 0 6px" }}>Oyun tarzın nasıl?</h2>
            <p className="muted" style={{ marginBottom:24 }}>Seni en iyi anlatan etiketleri seç (en fazla 4). Bunlar diğer oyuncuların seni bulmasına yardım eder.</p>
            <div className="flex" style={{ gap:10, flexWrap:"wrap", marginBottom:30 }}>
              {TAGS.map(t => {
                const on = tags.includes(t.id); const I = t.Icon;
                return (
                  <button key={t.id} onClick={()=>toggleTag(t.id)} className="tag-pill"
                    style={{ borderColor: on? t.color : "var(--line)", color: on? t.color : "var(--muted)",
                      background: on? t.color+"18":"var(--panel-2)", fontSize:13.5, padding:"9px 15px",
                      boxShadow: on? "inset 0 0 0 1px "+t.color : "none" }}>
                    <I size={14} /> {t.label}
                  </button>
                );
              })}
            </div>
            <Hud style={{ marginBottom:22 }}>
              <h3 className="disp" style={{ fontSize:16, fontWeight:600, marginBottom:4 }}>İletişim bilgilerin</h3>
              <p className="muted" style={{ fontSize:13, marginBottom:14 }}>Bunları elle gir. Yalnızca eşleştiğin (arkadaş olduğun) oyuncular görür.</p>
              <div style={{ display:"grid", gap:12 }}>
                <div className="field"><label>Steam Kullanıcı Adı</label>
                  <input className="input" placeholder="örn. nyx_storm" value={contact.steam} onChange={e=>setContact(c=>({ ...c, steam:e.target.value }))} /></div>
                <div className="field"><label>Steam Profil Linki</label>
                  <input className="input mono" placeholder="https://steamcommunity.com/id/..." value={contact.steamUrl} onChange={e=>setContact(c=>({ ...c, steamUrl:e.target.value }))} /></div>
                <div className="field"><label>Discord Kullanıcı Adı</label>
                  <input className="input" placeholder="örn. nyxstorm#0021" value={contact.discord} onChange={e=>setContact(c=>({ ...c, discord:e.target.value }))} /></div>
                <div className="field"><label>PlayStation (PSN) Kullanıcı Adı</label>
                  <input className="input" placeholder="örn. Komutan_TR" value={contact.psn} onChange={e=>setContact(c=>({ ...c, psn:e.target.value }))} /></div>
              </div>
            </Hud>
            <Hud accent style={{ marginBottom:22 }}>
              <div className="flex" style={{ alignItems:"center", gap:12 }}>
                <Avatar name={initialName||"Komutan"} size={50} online />
                <div>
                  <div className="disp" style={{ fontWeight:600, fontSize:18 }}>{initialName||"Komutan"}</div>
                  <div className="flex" style={{ gap:6, marginTop:6, flexWrap:"wrap" }}>
                    {tags.map(t=><TagPill key={t} id={t} sm />)}
                  </div>
                </div>
              </div>
            </Hud>
            <div className="flex" style={{ justifyContent:"space-between" }}>
              <button className="btn btn-ghost" onClick={()=>setStep(1)}>Geri</button>
              <button className="btn btn-volt" onClick={finish}><Check size={16} /> Kurulumu Tamamla</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function GameTile({ g, sel, onClick }){
  const I = g.Icon;
  return (
    <div className={`gtile ${sel?"sel":""}`} onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e=>{ if(e.key==="Enter"||e.key===" "){e.preventDefault();onClick();} }}>
      <span className="gtile-check"><Check size={13} /></span>
      <span className="ic" style={{ width:34, height:34, clipPath:"var(--notch-sm)", background:g.color+"22", color:g.color }}><I size={18} /></span>
      <div style={{ fontWeight:600, fontSize:13.5, lineHeight:1.2 }}>{g.name}</div>
    </div>
  );
}

/* ============================== APP SHELL ============================== */
function ageFromDob(dob){
  if(!dob) return 0;
  const d=new Date(dob); if(isNaN(d.getTime())) return 0;
  const t=new Date(); let a=t.getFullYear()-d.getFullYear();
  const m=t.getMonth()-d.getMonth();
  if(m<0||(m===0&&t.getDate()<d.getDate())) a--;
  return (a>0&&a<120)?a:0;
}
function App(){
  const { push, node: toasts } = useToasts();
  const [screen, setScreen] = useState("landing"); // landing | register | login | onboarding | app
  const [pendingName, setPendingName] = useState("");
  const [user, setUser] = useState(DEFAULT_USER);

  const [tab, setTab] = useState("discover");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // social graph state
  const [outgoing, setOutgoing] = useState(new Set());           // playerIds I invited
  const [incoming, setIncoming] = useState([7, 11]);             // playerIds who invited me
  const [friends, setFriends] = useState([5, 1, 4]);                   // matched playerIds
  const [viewPlayer, setViewPlayer] = useState(null);
  const [chatWith, setChatWith] = useState(null);
  const [conversations, setConversations] = useState(SEED_CONVOS);
  const [activeChat, setActiveChat] = useState(null);
  const [search, setSearch] = useState("");
  const [walls, setWalls] = useState(SEED_WALLS);
  const [commentReports, setCommentReports] = useState([]);
  const [banned, setBanned] = useState([]);
  const [ratings, setRatings] = useState({});
  const [ads, setAds] = useState({ enabled:false, client:"", placements:{}, slots:{} });
  const [siteCfg, setSiteCfg] = useState({ logoSize:42, landingScale:1.12, footer:"© 2026 GameMate. Tüm hakları saklıdır." });
  const [contactMsgs, setContactMsgs] = useState([]);
  const [seo, setSeo] = useState({
    title:"GameMate — Oyun Arkadaşı & Takım Bul (PC / PS5)",
    desc:"GameMate ile aynı oyunları oynayan, seninle uyumlu takım arkadaşları bul. Valorant, LoL, CS2 ve daha fazlası için PC ve PS5 duo & takım eşleşmesi.",
    keywords:"oyun arkadaşı bul, duo bul, takım arkadaşı, valorant duo, lol takım arkadaşı, ps5 oyun arkadaşı, cs2 takım, gamemate",
    ogImage:"https://gamemate.gg/og-cover.png",
    canonical:"https://gamemate.gg/",
    robots:"index, follow",
    twitter:"summary_large_image",
    siteName:"GameMate",
    locale:"tr_TR",
    twitterHandle:"@gamemate",
    themeColor:"#7C3AED",
    author:"GameMate",
  });
  const [players, setPlayers] = useState(PLAYERS);
  const [myProfileId, setMyProfileId] = useState(null);
  const settingsReady = useRef(false);
  const ratePlayer = (pid,n) => { setRatings(r=>({ ...r, [pid]:n })); DB && DB.setRating(pid,n); push("Puanın kaydedildi","ok"); };
  const addContactMsg = (m) => { setContactMsgs(list => [{ ...m, id:Date.now(), date:new Date().toLocaleString("tr-TR"), read:false }, ...list]); push("Mesajın gönderildi — en kısa sürede dönüş yapacağız","ok"); if(DB){ DB.addContactMessage(m).then(()=>DB.getContactMessages().then(r=>{ if(r) setContactMsgs(r); })); } };
  const markMsgRead = (id) => { setContactMsgs(list => list.map(m=>m.id===id?{...m,read:true}:m)); DB && DB.setMessageRead(id); };
  const deleteMsg = (id) => { setContactMsgs(list => list.filter(m=>m.id!==id)); DB && DB.deleteMessage(id); };
  useEffect(()=>{
    document.title = seo.title || "GameMate";
    try { document.documentElement.lang = (seo.locale||"tr_TR").split("_")[0]; } catch(e){}
    const setMeta = (sel, attr, key, val) => {
      let el = document.head.querySelector(sel);
      if(!el){ el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.setAttribute("content", val||"");
    };
    setMeta('meta[name="description"]','name','description', seo.desc);
    setMeta('meta[name="keywords"]','name','keywords', seo.keywords);
    setMeta('meta[name="robots"]','name','robots', seo.robots);
    setMeta('meta[name="author"]','name','author', seo.author);
    setMeta('meta[name="theme-color"]','name','theme-color', seo.themeColor);
    setMeta('meta[property="og:title"]','property','og:title', seo.title);
    setMeta('meta[property="og:description"]','property','og:description', seo.desc);
    setMeta('meta[property="og:image"]','property','og:image', seo.ogImage);
    setMeta('meta[property="og:type"]','property','og:type','website');
    setMeta('meta[property="og:url"]','property','og:url', seo.canonical);
    setMeta('meta[property="og:site_name"]','property','og:site_name', seo.siteName);
    setMeta('meta[property="og:locale"]','property','og:locale', seo.locale);
    setMeta('meta[name="twitter:card"]','name','twitter:card', seo.twitter);
    setMeta('meta[name="twitter:title"]','name','twitter:title', seo.title);
    setMeta('meta[name="twitter:description"]','name','twitter:description', seo.desc);
    setMeta('meta[name="twitter:image"]','name','twitter:image', seo.ogImage);
    setMeta('meta[name="twitter:site"]','name','twitter:site', seo.twitterHandle);
    let link = document.head.querySelector('link[rel="canonical"]');
    if(!link){ link=document.createElement("link"); link.setAttribute("rel","canonical"); document.head.appendChild(link); }
    link.setAttribute("href", seo.canonical||"");
    const ld = { "@context":"https://schema.org", "@graph":[
      { "@type":"Organization", "name":seo.siteName||"GameMate", "url":seo.canonical||"", "logo":seo.ogImage||"",
        "sameAs":[seo.twitterHandle?("https://twitter.com/"+seo.twitterHandle.replace(/^@/,"")):null,"https://discord.gg/gamemate"].filter(Boolean) },
      { "@type":"WebSite", "name":seo.title||"GameMate", "url":seo.canonical||"",
        "potentialAction":{ "@type":"SearchAction", "target":(seo.canonical||"")+"?q={search_term_string}", "query-input":"required name=search_term_string" } }
    ] };
    let ldEl = document.getElementById("gm-jsonld");
    if(!ldEl){ ldEl=document.createElement("script"); ldEl.type="application/ld+json"; ldEl.id="gm-jsonld"; document.head.appendChild(ldEl); }
    ldEl.textContent = JSON.stringify(ld);
  }, [seo]);
  useEffect(()=>{
    if(!DB) return;
    DB.getPlayers().then(r=>{ if(r && r.length) setPlayers(r); });
    DB.getSettings().then(st=>{ if(st){ if(st.siteCfg) setSiteCfg(s=>({ ...s, ...st.siteCfg })); if(st.seo) setSeo(s=>({ ...s, ...st.seo })); if(st.ads) setAds(a=>({ ...a, ...st.ads })); } });
    DB.getContactMessages().then(r=>{ if(r) setContactMsgs(r); });
    DB.getComments().then(w=>{ if(w) setWalls(w); });
    DB.getRatings().then(r=>{ if(r) setRatings(r); });
    DB.getBans().then(b=>{ if(b) setBanned(b); });
  }, []);
  useEffect(()=>{
    if(!DB) return;
    if(!settingsReady.current){ settingsReady.current = true; return; }
    const t = setTimeout(()=>{ DB.saveSettings({ siteCfg, seo, ads }); }, 800);
    return ()=>clearTimeout(t);
  }, [siteCfg, seo, ads]);
  const addComment = (pid,text,stars) => { setWalls(w=>({ ...w, [pid]:[{ id:"c"+Date.now(), author:user.name, text, stars, time:"şimdi", reported:false }, ...(w[pid]||[]) ] })); push("Yorumun yayınlandı","ok"); if(DB){ DB.addComment(pid,{author:user.name,text,stars}).then(()=>DB.getComments().then(w=>{ if(w) setWalls(w); })); } };
  const reportComment = (pid,cid) => {
    setWalls(w=>({ ...w, [pid]:(w[pid]||[]).map(c=>c.id===cid?{ ...c, reported:true }:c) }));
    const pl = players.find(x=>x.id===pid); const c = (walls[pid]||[]).find(x=>x.id===cid);
    setCommentReports(rs=>[{ id:"r"+Date.now(), pid, cid, playerName:pl?pl.name:"", author:c?c.author:"", text:c?c.text:"" }, ...rs]);
    push("Yorum şikayet edildi, admin paneline iletildi","info");
  };
  const dismissReport = (rid) => setCommentReports(rs=>rs.filter(r=>r.id!==rid));
  const removeComment = (pid,cid) => { setWalls(w=>({ ...w, [pid]:(w[pid]||[]).filter(c=>c.id!==cid) })); setCommentReports(rs=>rs.filter(r=>!(r.pid===pid&&r.cid===cid))); DB && DB.deleteComment(cid); push("Yorum silindi","info"); };
  const banUser = (pid) => { setBanned(b=>b.includes(pid)?b:[...b,pid]); DB && DB.setBan(pid,true); const pl=players.find(x=>x.id===pid); push((pl?pl.name:"Kullanıcı")+" siteden banlandı","info"); };
  const unbanUser = (pid) => { setBanned(b=>b.filter(x=>x!==pid)); DB && DB.setBan(pid,false); };
  const sendMessage = (pid, text) => { const t=(text||"").trim(); if(!t) return; setConversations(c=>({ ...c, [pid]:[...(c[pid]||[]), { me:true, t, time:"şimdi" }] })); };
  const openChat = (pid) => { setActiveChat(pid); setTab("messages"); };

  const incomingCount = incoming.length;

  const sendInvite = (pid) => {
    setOutgoing(s => new Set(s).add(pid));
    const p = players.find(x=>x.id===pid);
    push(`${p.name} oyuncusuna davet gönderildi`, "ok");
  };
  const acceptInvite = (pid) => {
    setIncoming(s => s.filter(x=>x!==pid));
    setFriends(s => s.includes(pid)?s:[...s,pid]);
    const p = players.find(x=>x.id===pid);
    push(`Eşleşme! ${p.name} ile bağlantı kuruldu — iletişim açıldı`, "ok");
  };
  const declineInvite = (pid) => {
    setIncoming(s => s.filter(x=>x!==pid));
    push("Davet reddedildi", "info");
  };
  const acceptOutgoingAsMatch = (pid) => { // simulate other side accepting
    setOutgoing(s => { const n=new Set(s); n.delete(pid); return n; });
    setFriends(s => s.includes(pid)?s:[...s,pid]);
    const pl = players.find(x=>x.id===pid); if(pl) push(pl.name+" davetini kabul etti! İletişim açıldı","ok");
  };

  if (screen==="landing")
    return <Shell><Background/>
      <div className="landing-zoom" style={{ "--lz": siteCfg.landingScale }}>
        <Landing onStart={()=>setScreen("register")} onLogin={()=>setScreen("login")} onInfo={()=>setScreen("pubinfo")} onBlog={()=>setScreen("pubblog")} siteCfg={siteCfg} />
        <div className="container" style={{ padding:"0 24px" }}><Footer text={siteCfg.footer} onNav={(p)=>setScreen("pub"+p)} /></div>
      </div>{toasts}</Shell>;
  if (screen==="register")
    return <Shell><Background/><Register onBack={()=>setScreen("landing")}
      onDone={(f)=>{ setPendingName(f.name); setUser(u=>({...u,name:f.name||u.name,email:f.email,age:ageFromDob(f.dob)||u.age})); setScreen("onboarding"); }} />{toasts}</Shell>;
  if (screen==="login")
    return <Shell><Background/><Register login onBack={()=>setScreen("landing")}
      onDone={()=>{ setScreen("app"); setTab("discover"); }} />{toasts}</Shell>;
  if (screen==="onboarding")
    return <Shell><Background/><Onboarding initialName={pendingName}
      onComplete={(data)=>{ setUser(u=>({...u, ...data})); if(DB){ DB.addProfile({ name:user.name, country:user.country, age:user.age, admin:false, devices:data.devices, bio:user.bio, tags:data.tags, socials:data.socials, games:data.games, times:data.times }).then(row=>{ if(row){ setMyProfileId(row.id); DB.getPlayers().then(r=>{ if(r&&r.length) setPlayers(r); }); } }); } setScreen("app"); push("Hoş geldin! Takım arkadaşlarını bulmaya başla","ok"); }} />{toasts}</Shell>;
  if (["pubinfo","pubblog","pubabout","pubprivacy","pubrules","pubcontact"].includes(screen))
    return <Shell><Background/>
      <div className="landing-zoom" style={{ position:"relative", zIndex:1, "--lz": siteCfg.landingScale }}>
        <div className="container" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"22px 24px", flexWrap:"wrap", gap:12 }}>
          <button onClick={()=>setScreen("landing")} style={{ background:"none", border:"none", cursor:"pointer", padding:0 }}><Logo size={siteCfg.logoSize} /></button>
          <div className="flex" style={{ gap:10, alignItems:"center" }}>
            <button className="btn btn-ghost btn-sm" onClick={()=>setScreen("pubinfo")} style={screen==="pubinfo"?{ color:"var(--cyan)" }:undefined}>Nasıl Çalışır</button>
            <button className="btn btn-ghost btn-sm" onClick={()=>setScreen("pubblog")} style={screen==="pubblog"?{ color:"var(--cyan)" }:undefined}>Blog</button>
            <button className="btn btn-ghost btn-sm" onClick={()=>setScreen("login")}>Giriş Yap</button>
            <button className="btn btn-primary btn-sm" onClick={()=>setScreen("register")}>Ücretsiz Başla</button>
          </div>
        </div>
        <div className="container" style={{ padding:"6px 24px 30px" }}>
          {screen==="pubinfo" ? <InfoView />
            : screen==="pubblog" ? <BlogView ads={ads} onCTA={()=>setScreen("register")} />
            : screen==="pubabout" ? <AboutView />
            : screen==="pubprivacy" ? <PrivacyView />
            : screen==="pubrules" ? <RulesView />
            : <ContactView onSend={addContactMsg} />}
        </div>
        <div className="container" style={{ padding:"0 24px" }}><Footer text={siteCfg.footer} onNav={(p)=>setScreen("pub"+p)} /></div>
      </div>{toasts}</Shell>;

  // ---- main app ----
  const nav = [
    { id:"discover", label:"Oyuncu Bul", Icon:Search },
    { id:"invites", label:"Davetler", Icon:Bell, badge: incomingCount||undefined },
    { id:"friends", label:"Arkadaşlar", Icon:Users },
    { id:"messages", label:"Mesajlar", Icon:MessageSquare, badge: undefined },
    { id:"profile", label:"Profil", Icon:User },
    { id:"mygames", label:"Oyunlarım", Icon:Gamepad2 },
    { id:"settings", label:"Ayarlar", Icon:Settings },
    ...(user.admin ? [{ id:"admin", label:"Admin Paneli", Icon:Shield }] : []),
  ];

  return (
    <Shell>
      <Background/>
      <div className="app-shell">
        {/* sidebar */}
        <aside className={`sidebar ${sidebarOpen?"open":""}`}>
          <div style={{ padding:"0 6px 18px" }}><Logo size={34} /></div>
          {nav.map(n => {
            const I = n.Icon;
            return (
              <button key={n.id} className={`nav-item ${tab===n.id?"active":""}`}
                onClick={()=>{ setTab(n.id); setSidebarOpen(false); }}>
                <I size={18} /> {n.label}
                {n.badge && <span className="nav-badge">{n.badge}</span>}
              </button>
            );
          })}
          <div style={{ marginTop:"auto" }}>
            <div className="divider" style={{ margin:"10px 0" }} />
            <div className="nav-item" style={{ cursor:"default" }}>
              <Avatar name={user.name} size={30} online={user.online!==false} />
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:13.5, fontWeight:600, color:"#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user.name}</div>
                <div className="mono muted2" style={{ fontSize:10 }}>{user.country} {user.online!==false?"ONLINE":"OFFLINE"}</div>
              </div>
            </div>
            <button className="nav-item" onClick={()=>{ setScreen("landing"); setUser(DEFAULT_USER); }}>
              <LogOut size={18} /> Çıkış Yap
            </button>
          </div>
        </aside>

        {/* main */}
        <main>
          <div className="topbar">
            <button className="btn btn-ghost btn-sm mob-only" style={{display:"none"}} onClick={()=>setSidebarOpen(o=>!o)}><Menu size={16} /></button>
            <div className="tb-search" style={{ flex:1, position:"relative", maxWidth:420 }}>
              <Search size={16} style={{ position:"absolute", left:13, top:13, color:"var(--muted)" }} />
              <input className="input" style={{ paddingLeft:38 }} placeholder="Oyuncu, oyun veya etiket ara..." value={search} onChange={e=>{ setSearch(e.target.value); setTab("discover"); }} />
            </div>
            <div className="flex hdr-nav" style={{ gap:8 }}>
              <button className="btn btn-ghost" onClick={()=>setTab("info")} style={tab==="info"?{ color:"var(--cyan)" }:undefined}><Globe size={17}/> Nasıl Çalışır</button>
              <button className="btn btn-ghost" onClick={()=>setTab("blog")} style={tab==="blog"?{ color:"var(--cyan)" }:undefined}><MessageSquare size={17}/> Blog</button>
            </div>
            <HeaderAd ads={ads} />
            <div className="flex" style={{ gap:10, marginLeft:"auto" }}>
              <button className="btn btn-ghost btn-sm" onClick={()=>setTab("invites")} style={{ position:"relative" }}>
                <Bell size={16} />
                {incomingCount>0 && <span style={{ position:"absolute", top:-5, right:-5, width:16, height:16, fontSize:10, background:"var(--danger)", color:"#fff", display:"grid", placeItems:"center", clipPath:"var(--notch-sm)", fontFamily:"var(--ff-mono)" }}>{incomingCount}</span>}
              </button>
              <button className="btn btn-primary btn-sm" onClick={()=>setTab("discover")}><Zap size={15}/> Eşleş</button>
            </div>
          </div>

          <div className="main-area">
            {tab==="discover" && <Discover user={user} outgoing={outgoing} friends={friends}
              onInvite={sendInvite} onView={setViewPlayer} simulateMatch={acceptOutgoingAsMatch}
              query={search} banned={banned} ads={ads} players={players} excludeId={myProfileId} />}
            {tab==="invites" && <Invites incoming={incoming} outgoing={outgoing}
              onAccept={acceptInvite} onDecline={declineInvite} onView={setViewPlayer} ads={ads} players={players} />}
            {tab==="friends" && <Friends friends={friends} onChat={openChat} onView={setViewPlayer} ads={ads} players={players} />}
            {tab==="messages" && <MessagesView conversations={conversations} friends={friends} players={players} activeId={activeChat} setActiveId={setActiveChat} onSend={sendMessage} />}
            {tab==="profile" && <Profile user={user} setUser={setUser} push={push} ads={ads} />}
            {tab==="mygames" && <MyGames user={user} setUser={setUser} push={push} ads={ads} />}
            {tab==="settings" && <SettingsView user={user} setUser={setUser} push={push} onLogout={()=>{ setScreen("landing"); setUser(DEFAULT_USER); }} />}
            {tab==="blog" && <BlogView ads={ads} onCTA={()=>setTab("discover")} />}
            {tab==="info" && <InfoView />}
            {tab==="admin" && user.admin && <AdminPanel banned={banned} onBan={banUser} onUnban={unbanUser} reports={commentReports} onDismissReport={dismissReport} onRemoveComment={removeComment} ads={ads} setAds={setAds} siteCfg={siteCfg} setSiteCfg={setSiteCfg} messages={contactMsgs} onMsgRead={markMsgRead} onMsgDelete={deleteMsg} seo={seo} setSeo={setSeo} players={players} />}
            {tab==="about" && <AboutView />}
            {tab==="privacy" && <PrivacyView />}
            {tab==="rules" && <RulesView />}
            {tab==="contact" && <ContactView onSend={addContactMsg} prefillEmail={user.email} />}
            <Footer text={siteCfg.footer} onNav={(p)=>setTab(p)} />
          </div>
        </main>
      </div>

      {viewPlayer && <PlayerProfile pid={viewPlayer} matched={friends.includes(viewPlayer)}
        invited={outgoing.has(viewPlayer)} comments={walls[viewPlayer]||[]} myRating={ratings[viewPlayer]||0} ads={ads}
        onRate={(n)=>ratePlayer(viewPlayer,n)} onAddComment={addComment} onReport={reportComment}
        onInvite={()=>sendInvite(viewPlayer)}
        onChat={()=>openChat(viewPlayer)} onClose={()=>setViewPlayer(null)} players={players} />}
      {sidebarOpen && <div onClick={()=>setSidebarOpen(false)} style={{ position:"fixed", inset:0, zIndex:110, background:"rgba(0,0,0,.5)" }} className="mob-only" />}
      {toasts}
    </Shell>
  );
}

/* ============================== EK ÖZELLİKLER ============================== */
const SEED_CONVOS = {
  5: [ { me:false, t:"selam! eşleştik 🎮 hangi oyunu oynayalım?", time:"14:02" }, { me:true, t:"valorant ranked takılalım mı? mic açık", time:"14:03" }, { me:false, t:"olur, discord'da buluşalım. 5 dk sonra hazırım", time:"14:04" } ],
  1: [ { me:false, t:"bu akşam müsait misin? cs2 premier düşünüyorum", time:"12:20" }, { me:true, t:"21'den sonra varım, 2 kişi daha ayarlayalım", time:"12:25" } ],
  4: [ { me:true, t:"apex parti kuralım mı? PS5'ten oynuyorum", time:"Dün" }, { me:false, t:"crossplay açalım, ben PC'denim 👍", time:"Dün" } ],
};
const SEED_WALLS = {
  1: [{ id:"w1", author:"Mert K.", text:"CS:GO'da çok iyi, sakin kalıyor. Oynaması keyifli biri.", stars:5, time:"2 gün önce" }],
  5: [{ id:"w2", author:"Aylin", text:"League of Legends'te takım oyununu seviyor, çok pozitif. Tavsiye ederim.", stars:5, time:"4 gün önce" },
      { id:"w3", author:"Anonim", text:"Bazen rage geçiriyor ama genelde iyi oynuyor.", stars:3, time:"1 hafta önce" }],
  8: [{ id:"w4", author:"Cem", text:"Sürekli feedliyor, çok rage geçiriyor. Pek tavsiye etmem.", stars:2, time:"3 gün önce" }],
};

function StarRate({ value=0, onRate, size=20 }){
  return (
    <span className="flex" style={{ gap:3 }}>
      {[1,2,3,4,5].map(n=>(
        <button key={n} type="button" onClick={()=>onRate&&onRate(n)} aria-label={n+" yıldız"}
          style={{ background:"none", border:"none", cursor:onRate?"pointer":"default", padding:1, lineHeight:0 }}>
          <Star size={size} fill={n<=value?"var(--gold)":"none"} style={{ color:n<=value?"var(--gold)":"var(--muted-2)" }} />
        </button>
      ))}
    </span>
  );
}

/* Saat aralığı seçici — kompakt çizgi (dropdown boyutu): başlangıç ve bitiş tutamağını kaydır */
function HoursPicker({ value=[], onChange }){
  const nums = (value||[]).map(Number).filter(n=>!isNaN(n)).sort((a,b)=>a-b);
  const [start, setStart] = useState(nums.length ? nums[0] : 19);
  const [end, setEnd] = useState(nums.length ? nums[nums.length-1] : 23);
  const trackRef = useRef(null);
  const drag = useRef(null);
  const emit = (sH,eH) => { const lo=Math.min(sH,eH), hi=Math.max(sH,eH), arr=[]; for(let i=lo;i<=hi;i++) arr.push(String(i)); onChange(arr); };
  const hourAt = (clientX) => { const r=trackRef.current.getBoundingClientRect(); let p=(clientX-r.left)/r.width; p=Math.max(0,Math.min(1,p)); return Math.round(p*23); };
  const move = (clientX) => {
    if(!drag.current) return;
    const h = hourAt(clientX);
    if(drag.current==="start"){ const ns=Math.min(h,end); setStart(ns); emit(ns,end); }
    else { const ne=Math.max(h,start); setEnd(ne); emit(start,ne); }
  };
  useEffect(() => {
    const mm = e => move(e.clientX);
    const tm = e => { if(e.touches&&e.touches[0]) move(e.touches[0].clientX); };
    const up = () => { drag.current=null; };
    window.addEventListener("mousemove",mm); window.addEventListener("mouseup",up);
    window.addEventListener("touchmove",tm); window.addEventListener("touchend",up);
    return () => { window.removeEventListener("mousemove",mm); window.removeEventListener("mouseup",up); window.removeEventListener("touchmove",tm); window.removeEventListener("touchend",up); };
  });
  const pct = h => (h/23)*100;
  const fmt = h => String(h).padStart(2,"0")+":00";
  const lo=Math.min(start,end), hi=Math.max(start,end);
  return (
    <div>
      <div className="flex" style={{ justifyContent:"space-between", marginBottom:7 }}>
        <span className="mono" style={{ fontSize:12.5, color:"var(--cyan)", fontWeight:600 }}>{fmt(lo)} – {fmt(hi)}</span>
        <span className="mono muted2" style={{ fontSize:10 }}>Türkiye Saati (TSİ)</span>
      </div>
      <div ref={trackRef} style={{ position:"relative", height:26, display:"flex", alignItems:"center", cursor:"pointer", userSelect:"none", touchAction:"none" }}
        onMouseDown={e=>{ const h=hourAt(e.clientX); if(Math.abs(h-start)<=Math.abs(h-end)){ drag.current="start"; const ns=Math.min(h,end); setStart(ns); emit(ns,end); } else { drag.current="end"; const ne=Math.max(h,start); setEnd(ne); emit(start,ne); } }}>
        <div style={{ position:"absolute", left:0, right:0, height:6, background:"var(--panel-3)", borderRadius:3 }} />
        <div style={{ position:"absolute", left:pct(lo)+"%", width:(pct(hi)-pct(lo))+"%", height:6, background:"linear-gradient(90deg,var(--violet),var(--cyan))", borderRadius:3 }} />
        {[["start",start],["end",end]].map(([w,h])=>(
          <div key={w} onMouseDown={e=>{ e.stopPropagation(); drag.current=w; }} onTouchStart={e=>{ drag.current=w; }}
            style={{ position:"absolute", left:pct(h)+"%", transform:"translateX(-50%)", width:17, height:17, borderRadius:"50%", background:"#fff", border:"3px solid var(--cyan)", boxShadow:"0 2px 7px rgba(0,0,0,.45)", cursor:"grab", zIndex:2 }} />
        ))}
      </div>
      <div className="flex" style={{ justifyContent:"space-between", marginTop:3 }}>
        {[0,6,12,18,23].map(h=><span key={h} className="mono muted2" style={{ fontSize:9 }}>{String(h).padStart(2,"0")}:00</span>)}
      </div>
    </div>
  );
}

/* AdSense reklam alanı — tüm boyutlar; yapılandırılmazsa şık yer tutucu */
function AdSlot({ ads, slot, format="horizontal", label, style }){
  const live = !!(ads && ads.enabled && ads.client && ads.slots && ads.slots[slot]);
  useEffect(()=>{ if(live){ try{ (window.adsbygoogle=window.adsbygoogle||[]).push({}); }catch(e){} } },[live]);
  if (ads && ads.placements && ads.placements[slot]===false) return null;
  const SZ={ horizontal:{h:90,t:"728×90 / Responsive"}, leaderboard:{h:90,t:"970×90 Leaderboard"},
    rectangle:{h:250,w:300,t:"300×250 Rectangle"}, largerect:{h:280,w:336,t:"336×280"},
    skyscraper:{h:600,w:160,t:"160×600 Skyscraper"}, halfpage:{h:600,w:300,t:"300×600 Half Page"},
    "in-article":{h:120,t:"In-Article"}, "in-feed":{h:110,t:"In-Feed"}, anchor:{h:60,t:"Anchor (mobil)"} };
  const sz=SZ[format]||SZ.horizontal;
  if (live) return (
    <div style={{ width:"100%", maxWidth:sz.w||"100%", margin:sz.w?"0 auto":undefined, ...style }}>
      <ins className="adsbygoogle" style={{ display:"block", ...(sz.w?{width:sz.w,height:sz.h}:{}) }}
        data-ad-client={ads.client} data-ad-slot={ads.slots[slot]}
        data-ad-format={sz.w?undefined:"auto"} data-full-width-responsive="true" />
    </div>
  );
  return <DemoAd format={format} seed={slot} style={style} />;
}

/* Oyuncunun özel profil sayfası + Facebook tarzı duvar/yorumlar */
function PlayerProfile({ pid, matched, invited, comments=[], myRating=0, ads, onRate, onAddComment, onReport, onInvite, onChat, onClose, players=[] }){
  const p = players.find(x=>x.id===pid);
  const [text, setText] = useState("");
  const [stars, setStars] = useState(0);
  if (!p) return null;
  const submit = () => { if(!text.trim()) return; onAddComment(pid, text.trim(), stars); setText(""); setStars(0); };
  return (
    <div style={{ position:"fixed", inset:0, zIndex:130, overflow:"auto", background:"var(--void)" }}>
      <Background/>
      <div className="container" style={{ position:"relative", zIndex:1, maxWidth:900, padding:"18px 22px 70px" }}>
        <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ marginBottom:14 }}>← Geri</button>

        <Hud style={{ marginBottom:16 }}>
          <div className="flex" style={{ gap:16, alignItems:"flex-start", flexWrap:"wrap" }}>
            <Avatar name={p.name} size={72} online={p.online} ring />
            <div style={{ flex:1, minWidth:200 }}>
              <div className="flex" style={{ alignItems:"center", gap:10, flexWrap:"wrap" }}>
                <h1 className="disp" style={{ fontSize:26, fontWeight:700 }}>{p.name}</h1>
                <span style={{ fontSize:18 }}>{p.country}</span>
                <span className={`online-dot ${p.online?"":"off"}`} />
                <span className="mono muted2" style={{ fontSize:11 }}>{p.online?"ONLINE":"OFFLINE"}</span>
              </div>
              <div className="flex" style={{ gap:14, marginTop:8, flexWrap:"wrap" }}>
                <span className="chip" style={{ color:"var(--gold)", borderColor:"rgba(245,196,81,.3)" }}><Star size={12}/> {p.rating.toFixed(1)} puan</span>
                {p.age && <span className="chip">{p.age} yaş</span>}
                {(p.devices||[]).map(d=><span key={d} className="chip" style={{ color:"var(--cyan)", borderColor:"rgba(34,211,238,.3)" }}>{d}</span>)}
                {p.tags.slice(0,3).map(t=><TagPill key={t} id={t} sm />)}
              </div>
              <p className="muted" style={{ marginTop:12, fontSize:14 }}>{p.bio}</p>
            </div>
          </div>
        </Hud>

        {ads && <AdSlot ads={ads} slot="profileTop" format="horizontal" style={{ marginBottom:16 }} />}

        <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:16, alignItems:"start" }} className="profile-grid">
          <div>
            {/* Oyunlar */}
            <Hud style={{ marginBottom:16 }}>
              <h3 className="disp" style={{ fontSize:16, fontWeight:600, marginBottom:12 }}>Oyunlar</h3>
              <div style={{ display:"grid", gap:10 }}>
                {p.games.map((e,i)=>{ const g=gameById(e.g); return (
                  <div key={i} className="gamechip">
                    <GameIcon gameId={g.id} size={26} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:600 }}>{g.name}</div>
                      <div className="mono muted2" style={{ fontSize:10.5 }}>{e.role} • {e.ps}</div>
                    </div>
                    <RankBadge gameId={g.id} rank={e.rank} sm />
                  </div>
                ); })}
              </div>
            </Hud>

            {/* Puan ver */}
            <Hud style={{ marginBottom:16 }}>
              <h3 className="disp" style={{ fontSize:16, fontWeight:600, marginBottom:4 }}>Bu oyuncuyu puanla</h3>
              <p className="muted" style={{ fontSize:13, marginBottom:10 }}>0–5 arası puan ver. Diğer oyuncular bunu görür.</p>
              <div className="flex" style={{ gap:10, alignItems:"center" }}>
                <StarRate value={myRating} onRate={onRate} size={26} />
                <span className="mono muted2" style={{ fontSize:12 }}>{myRating?myRating+" / 5":"Henüz puanlamadın"}</span>
              </div>
            </Hud>

            {/* DUVAR */}
            <Hud>
              <h3 className="disp" style={{ fontSize:16, fontWeight:600, marginBottom:4 }}>Duvar · Oyuncu Yorumları</h3>
              <p className="muted" style={{ fontSize:13, marginBottom:10 }}>Bu oyuncuyla ilgili deneyimini paylaş (örn. "CS:GO'da çok iyi, sakin biri").</p>
              <div style={{ background:"rgba(244,63,94,.08)", border:"1px solid rgba(244,63,94,.35)", clipPath:"var(--notch-sm)", padding:"10px 12px", marginBottom:12 }}>
                <span className="mono" style={{ fontSize:11.5, color:"#fda4b4" }}>⚠ Yorumlarda argo, küfür vb. tespit edilirse hesabın siteden <b>kalıcı olarak banlanır</b>.</span>
              </div>
              <div style={{ marginBottom:8 }}>
                <textarea className="input" rows={3} placeholder="Bu oyuncu hakkında yorumun..." value={text} onChange={e=>setText(e.target.value)} style={{ resize:"vertical", minHeight:70 }} />
              </div>
              <div className="flex" style={{ justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10, marginBottom:16 }}>
                <div className="flex" style={{ gap:8, alignItems:"center" }}>
                  <span className="muted" style={{ fontSize:12.5 }}>Puanın:</span>
                  <StarRate value={stars} onRate={setStars} size={18} />
                </div>
                <button className="btn btn-primary btn-sm" onClick={submit}><Send size={14}/> Yorumu Paylaş</button>
              </div>
              <div style={{ display:"grid", gap:10 }}>
                {comments.length===0 && <p className="muted2" style={{ fontSize:13, textAlign:"center", padding:"10px 0" }}>Henüz yorum yok — ilk yorumu sen yaz.</p>}
                {comments.map(c=>(
                  <div key={c.id} style={{ background:"var(--panel-2)", border:"1px solid var(--line)", clipPath:"var(--notch-sm)", padding:"11px 13px" }}>
                    <div className="flex" style={{ justifyContent:"space-between", alignItems:"center", gap:8 }}>
                      <div className="flex" style={{ gap:8, alignItems:"center" }}>
                        <Avatar name={c.author} size={26} />
                        <span className="disp" style={{ fontWeight:600, fontSize:13 }}>{c.author}</span>
                        {c.stars>0 && <StarRate value={c.stars} size={12} />}
                      </div>
                      <span className="mono muted2" style={{ fontSize:10 }}>{c.time}</span>
                    </div>
                    <p style={{ fontSize:13.5, margin:"8px 0 6px" }}>{c.text}</p>
                    <button className="mono" onClick={()=>onReport(pid, c.id)} disabled={c.reported}
                      style={{ background:"none", border:"none", color:c.reported?"var(--muted-2)":"#fda4b4", fontSize:11, cursor:c.reported?"default":"pointer" }}>
                      {c.reported ? "⚠ şikayet edildi" : "⚠ şikayet et"}
                    </button>
                  </div>
                ))}
              </div>
            </Hud>
          </div>

          <div>
            {/* İletişim */}
            <Hud style={{ marginBottom:16 }}>
              <h3 className="disp" style={{ fontSize:16, fontWeight:600, marginBottom:10 }}>İletişim</h3>
              {matched ? (
                <div style={{ display:"grid", gap:8 }}>
                  {CONTACT_FIELDS.filter(f=>p.socials?.[f.id]).map(f=>(
                    <div className="kv" key={f.id}><span className="k" style={{ color:f.color }}>{f.label}</span><span className="mono" style={{ fontSize:12, wordBreak:"break-all" }}>{p.socials[f.id]}</span></div>
                  ))}
                  {!CONTACT_FIELDS.some(f=>p.socials?.[f.id]) && <p className="muted" style={{ fontSize:12.5 }}>Bu oyuncu henüz iletişim bilgisi eklememiş.</p>}
                  <button className="btn btn-primary btn-sm btn-block" style={{ marginTop:6 }} onClick={onChat}><MessageSquare size={14}/> Mesaj Gönder</button>
                </div>
              ) : (
                <div style={{ textAlign:"center", padding:"6px 0" }}>
                  <Lock size={20} style={{ color:"var(--muted-2)", marginBottom:8 }} />
                  <p className="muted" style={{ fontSize:13, marginBottom:12 }}>İletişim (Steam · Discord) eşleşince açılır.</p>
                  {invited
                    ? <button className="btn btn-block btn-sm" disabled><Send size={14}/> Davet Gönderildi</button>
                    : <button className="btn btn-primary btn-block btn-sm" onClick={onInvite}><Send size={14}/> Birlikte Oyna Daveti</button>}
                </div>
              )}
            </Hud>
            {ads && <AdSlot ads={ads} slot="profileSide" format="rectangle" />}
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoAd({ format="horizontal", seed="", style }){
  const SZ={ horizontal:{h:90}, leaderboard:{h:90}, rectangle:{h:250,w:300}, largerect:{h:280,w:336}, skyscraper:{h:600,w:160}, halfpage:{h:600,w:300}, "in-feed":{h:110}, "in-article":{h:120}, anchor:{h:60} };
  const s=SZ[format]||SZ.horizontal;
  const CRE=[
    { t:"OyunDeposu — Tüm oyunlarda %70 indirim 🎮", d:"Sponsorlu · demo reklam görselidir.", cta:"İncele →", Icon:Gamepad2 },
    { t:"NitroPad Oyuncu Mouse — %40 indirim 🖱️", d:"Reklamınız tam burada görünür.", cta:"Satın Al", Icon:Zap },
    { t:"Discord Nitro · 3 Ay Hediye 🚀", d:"Reklam alanı önizlemesi · demo.", cta:"Kap", Icon:Sparkles },
    { t:"144Hz Oyuncu Monitörü — Stokta 🖥️", d:"Sponsorlu içerik · demo görsel.", cta:"Gör", Icon:Trophy },
  ];
  const idx=(String(seed).split("").reduce((a,c)=>a+c.charCodeAt(0),0)+(s.h||0))%CRE.length;
  const c=CRE[idx]; const I=c.Icon;
  const tall=(s.h||90)>=250;
  const icon=tall?64:Math.max(40, Math.min((s.h||90)-26, 56));
  return (
    <div style={{ width:"100%", maxWidth:s.w||"100%", margin:s.w?"0 auto":undefined, minHeight:s.h,
      background:"linear-gradient(120deg,#192241,#251a3c)", border:"1px solid var(--line)", clipPath:"var(--notch-sm)",
      display:"flex", flexDirection:tall?"column":"row", textAlign:tall?"center":"left", alignItems:"center", justifyContent:"center",
      gap:tall?10:12, padding:tall?"18px 16px":"10px 14px", overflow:"hidden", position:"relative", ...style }}>
      <div style={{ width:icon, height:icon, minWidth:icon, background:"linear-gradient(135deg,var(--violet),var(--cyan))", clipPath:"var(--notch-sm)", display:"grid", placeItems:"center" }}>
        <I size={Math.round(icon*0.45)} style={{ color:"#0b0d16" }} />
      </div>
      <div style={{ flex:tall?"none":1, minWidth:0 }}>
        <div style={{ fontSize:13.5, fontWeight:700 }}>{c.t}</div>
        <div className="muted" style={{ fontSize:11.5 }}>{c.d}</div>
      </div>
      <button className="btn btn-primary btn-sm" style={{ pointerEvents:"none", whiteSpace:"nowrap" }}>{c.cta}</button>
      <span className="mono" style={{ position:"absolute", top:4, right:6, fontSize:8, color:"var(--muted-2)", letterSpacing:1 }}>DEMO · REKLAM</span>
    </div>
  );
}

/* Admin paneli — kullanıcı listesi + ban, şikayet edilen yorumlar, reklam yönetimi */
function GridAd({ ads, seed="" }){
  if (ads && ads.placements && ads.placements.feed===false) return null;
  const CRE=[
    { t:"OyunDeposu — %70 İndirim 🎮", d:"Binlerce oyun tek tıkla. Demo reklamdır.", cta:"Mağazaya Git", Icon:Gamepad2 },
    { t:"NitroPad Oyuncu Mouse 🖱️", d:"16.000 DPI, RGB. Sponsorlu · demo görsel.", cta:"Satın Al", Icon:Zap },
    { t:"Discord Nitro · 3 Ay Hediye 🚀", d:"Sunucunu güçlendir. Demo reklam alanı.", cta:"Hediyeyi Al", Icon:Sparkles },
    { t:"144Hz Oyuncu Monitörü 🖥️", d:"Akıcı oyun deneyimi. Sponsorlu demo.", cta:"Keşfet", Icon:Trophy },
  ];
  const c=CRE[(String(seed).split("").reduce((a,x)=>a+x.charCodeAt(0),0))%CRE.length]; const I=c.Icon;
  return (
    <Hud pad={false} hover={false} style={{ position:"relative", overflow:"hidden" }}>
      <span className="mono" style={{ position:"absolute", top:9, right:11, fontSize:8.5, color:"rgba(11,13,22,.75)", letterSpacing:1, zIndex:2, fontWeight:700 }}>SPONSORLU</span>
      <div style={{ height:118, background:"linear-gradient(135deg,var(--violet),var(--cyan))", display:"grid", placeItems:"center" }}>
        <I size={46} style={{ color:"#0b0d16" }} />
      </div>
      <div style={{ padding:"14px 16px" }}>
        <div className="disp" style={{ fontSize:15.5, fontWeight:700 }}>{c.t}</div>
        <p className="muted" style={{ fontSize:12.5, margin:"6px 0 13px", lineHeight:1.5 }}>{c.d}</p>
        <button className="btn btn-primary btn-block btn-sm" style={{ pointerEvents:"none" }}>{c.cta} →</button>
      </div>
    </Hud>
  );
}

function HeaderAd({ ads }){
  if (!ads || (ads.placements && ads.placements.headerBanner===false)) return null;
  const live = ads.enabled && ads.client && ads.slots && ads.slots.headerBanner;
  if (live) {
    return (
      <div className="hdr-ad" style={{ flex:"0 1 360px", minWidth:0 }}>
        <ins className="adsbygoogle" style={{ display:"block", width:"100%", height:50 }}
          data-ad-client={ads.client} data-ad-slot={ads.slots.headerBanner} data-ad-format="horizontal" data-full-width-responsive="false"></ins>
      </div>
    );
  }
  return (
    <a className="hdr-ad" href="#" onClick={e=>e.preventDefault()}
      style={{ flex:"0 1 360px", minWidth:0, display:"flex", alignItems:"center", gap:10, padding:"7px 12px", background:"var(--panel-2)", border:"1px solid var(--line)", clipPath:"var(--notch-sm)", textDecoration:"none", overflow:"hidden" }}>
      <span style={{ width:26, height:26, minWidth:26, display:"grid", placeItems:"center", clipPath:"var(--notch-sm)", background:"linear-gradient(135deg,var(--violet),var(--cyan))" }}>
        <Sparkles size={14} style={{ color:"#0b0d16" }} />
      </span>
      <span style={{ flex:1, minWidth:0, overflow:"hidden" }}>
        <span style={{ display:"block", fontSize:12, fontWeight:600, color:"var(--text)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>NitroPad Oyuncu Mouse — %40 İndirim</span>
        <span className="mono" style={{ fontSize:8.5, color:"var(--muted-2)", letterSpacing:".08em" }}>DEMO · REKLAM</span>
      </span>
      <ChevronRight size={14} style={{ color:"var(--muted)", flexShrink:0 }} />
    </a>
  );
}

function AdminPanel({ banned, onBan, onUnban, reports, onDismissReport, onRemoveComment, ads, setAds, siteCfg, setSiteCfg, messages=[], onMsgRead, onMsgDelete, seo, setSeo, players=[] }){
  const [sub, setSub] = useState("users");
  const [q, setQ] = useState("");
  const unread = (messages||[]).filter(m=>!m.read).length;
  const seoChecks = [
    { ok:(seo?.title||"").length>=30 && (seo?.title||"").length<=65, label:"Başlık uzunluğu ideal (30–65 karakter)" },
    { ok:(seo?.desc||"").length>=110 && (seo?.desc||"").length<=165, label:"Açıklama uzunluğu ideal (110–165 karakter)" },
    { ok:!!(seo?.keywords||"").trim(), label:"Anahtar kelimeler tanımlı" },
    { ok:/^https?:\/\//.test(seo?.canonical||""), label:"Geçerli canonical URL" },
    { ok:/^https?:\/\//.test(seo?.ogImage||""), label:"Paylaşım görseli (og:image) tanımlı" },
    { ok:!!(seo?.siteName||"").trim(), label:"Site adı (og:site_name) tanımlı" },
    { ok:(seo?.robots||"").includes("index") && !(seo?.robots||"").includes("noindex"), label:"Arama motorlarına açık (index)" },
    { ok:!!(seo?.twitterHandle||"").trim(), label:"Twitter hesabı tanımlı" },
  ];
  const seoScore = seoChecks.filter(c=>c.ok).length;
  const jsonLdPreview = JSON.stringify({ "@context":"https://schema.org", "@type":"WebSite", name:seo?.title||"GameMate", url:seo?.canonical||"", potentialAction:{ "@type":"SearchAction", target:(seo?.canonical||"")+"?q={arama}", "query-input":"required name=arama" } }, null, 2);
  const PLACE = [
    { k:"headerBanner", l:"Üst menü — Blog & bildirim arası", f:"Slim yatay banner", fmt:"horizontal" },
    { k:"discoverTop", l:"Oyuncu Bul — üst banner", f:"970×90 Leaderboard", fmt:"leaderboard" },
    { k:"feed", l:"Oyuncu Bul — liste arası (sponsorlu kart)", f:"In-Feed kart", fmt:"rectangle" },
    { k:"profileTop", l:"Oyuncu profili — üst", f:"Responsive yatay", fmt:"horizontal" },
    { k:"profileSide", l:"Oyuncu profili — yan", f:"300×250 Rectangle", fmt:"rectangle" },
    { k:"friendsTop", l:"Arkadaşlar — üst", f:"970×90 Leaderboard", fmt:"leaderboard" },
    { k:"invitesMid", l:"Davetler — arası", f:"Responsive yatay", fmt:"horizontal" },
    { k:"profilePage", l:"Profilim — sayfa içi", f:"Responsive yatay", fmt:"horizontal" },
    { k:"gamesTop", l:"Oyunlarım — üst", f:"Responsive yatay", fmt:"horizontal" },
  ];
  const list = players.filter(p=>p.name.toLowerCase().includes(q.toLowerCase()));
  const setAd = patch => setAds(a=>({ ...a, ...patch }));
  return (
    <div style={{ maxWidth:920 }}>
      <span className="eyebrow">// ADMIN</span>
      <h1 className="disp" style={{ fontSize:28, fontWeight:700, margin:"4px 0 18px" }}>Admin Paneli</h1>
      <div className="flex" style={{ gap:8, flexWrap:"wrap", marginBottom:18 }}>
        {[["users","Kullanıcılar"],["reports","Şikayet Edilen Yorumlar"],["messages",unread?`Mesajlar (${unread})`:"Mesajlar"],["ads","Reklamlar"],["seo","SEO"],["site","Site Ayarları"]].map(([k,l])=>(
          <button key={k} className={`chip`} onClick={()=>setSub(k)}
            style={{ cursor:"pointer", padding:"8px 13px", color:sub===k?"var(--violet-hi)":"var(--muted)", borderColor:sub===k?"rgba(139,92,246,.5)":"var(--line)" }}>{l}</button>
        ))}
      </div>

      {sub==="users" && (
        <Hud>
          <div className="field" style={{ marginBottom:14, maxWidth:280 }}><label>Kullanıcı ara</label>
            <input className="input" placeholder="Kullanıcı adı" value={q} onChange={e=>setQ(e.target.value)} /></div>
          <div style={{ display:"grid", gap:8 }}>
            {list.map(p=>{ const isB=banned.includes(p.id); return (
              <div key={p.id} className="flex" style={{ alignItems:"center", gap:12, background:"var(--panel-2)", border:"1px solid var(--line)", clipPath:"var(--notch-sm)", padding:"10px 13px", opacity:isB?.6:1 }}>
                <Avatar name={p.name} size={36} online={p.online} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div className="flex" style={{ gap:8, alignItems:"center" }}>
                    <span className="disp" style={{ fontWeight:600, fontSize:14 }}>{p.name}</span>
                    {isB && <span className="chip" style={{ fontSize:10, color:"var(--danger)", borderColor:"rgba(244,63,94,.4)" }}>BANLI</span>}
                  </div>
                  <div className="mono muted2" style={{ fontSize:10.5 }}>{p.country} • {p.age||"?"} yaş • {p.rating.toFixed(1)}★</div>
                </div>
                {isB
                  ? <button className="btn btn-volt btn-sm" onClick={()=>onUnban(p.id)}><Check size={13}/> Banı Kaldır</button>
                  : <button className="btn btn-danger btn-sm" onClick={()=>onBan(p.id)}><X size={13}/> Siteden Banla</button>}
              </div>
            ); })}
          </div>
        </Hud>
      )}

      {sub==="reports" && (
        <Hud>
          {reports.length===0 ? <div style={{ textAlign:"center", padding:"30px 10px" }}><Shield size={28} style={{ color:"var(--muted-2)", marginBottom:10 }} /><div className="disp" style={{ fontSize:16, fontWeight:600 }}>Şikayet edilen yorum yok</div></div>
          : <div style={{ display:"grid", gap:10 }}>
              {reports.map(r=>(
                <div key={r.id} style={{ background:"var(--panel-2)", border:"1px solid rgba(244,63,94,.3)", clipPath:"var(--notch-sm)", padding:"12px 14px" }}>
                  <div className="mono muted2" style={{ fontSize:10.5, marginBottom:6 }}>{r.playerName} oyuncusunun duvarında · yazan: {r.author}</div>
                  <p style={{ fontSize:13.5, marginBottom:10 }}>"{r.text}"</p>
                  <div className="flex" style={{ gap:8 }}>
                    <button className="btn btn-danger btn-sm" onClick={()=>onRemoveComment(r.pid, r.cid)}><X size={13}/> Yorumu Sil</button>
                    <button className="btn btn-ghost btn-sm" onClick={()=>onDismissReport(r.id)}>Yoksay</button>
                  </div>
                </div>
              ))}
            </div>}
        </Hud>
      )}

      {sub==="ads" && (
        <div>
          <Hud style={{ marginBottom:14 }}>
            <div className="flex" style={{ justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
              <div><h3 className="disp" style={{ fontSize:16, fontWeight:600 }}>Reklamları etkinleştir</h3>
                <p className="muted2" style={{ fontSize:12 }}>AdSense betiği yalnızca açıkken ve client ID girilince yüklenir.</p></div>
              <button onClick={()=>setAd({ enabled:!ads.enabled })} style={{ width:46, height:26, padding:3, border:"1px solid var(--line)", background: ads.enabled?"linear-gradient(90deg,var(--violet),var(--cyan))":"var(--panel-2)", clipPath:"var(--notch-sm)" }}>
                <span style={{ display:"block", width:18, height:18, background:"#fff", clipPath:"var(--notch-sm)", transform: ads.enabled?"translateX(20px)":"translateX(0)", transition:"transform .15s" }} />
              </button>
            </div>
            <div className="field" style={{ marginTop:14 }}><label>AdSense Yayıncı (Client) ID</label>
              <input className="input mono" placeholder="ca-pub-XXXXXXXXXXXXXXXX" value={ads.client||""} onChange={e=>setAd({ client:e.target.value.trim() })} /></div>
          </Hud>
          <Hud>
            <h3 className="disp" style={{ fontSize:16, fontWeight:600, marginBottom:12 }}>Reklam Yerleşimleri (tüm AdSense boyutları)</h3>
            <div style={{ display:"grid", gap:10 }}>
              {PLACE.map(pl=>{ const active = !(ads.placements && ads.placements[pl.k]===false); return (
                <div key={pl.k} style={{ background:"var(--panel-2)", border:"1px solid var(--line)", clipPath:"var(--notch-sm)", padding:"11px 13px" }}>
                  <div className="flex" style={{ justifyContent:"space-between", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                    <div><div style={{ fontSize:13.5, fontWeight:600 }}>{pl.l}</div><div className="mono muted2" style={{ fontSize:10.5 }}>{pl.f}</div></div>
                    <div className="flex" style={{ gap:10, alignItems:"center" }}>
                      <span className="muted2" style={{ fontSize:11 }}>{active?"Açık":"Kapalı"}</span>
                      <button onClick={()=>setAd({ placements:{ ...(ads.placements||{}), [pl.k]: !active } })}
                        style={{ width:42, height:24, padding:3, border:"1px solid var(--line)", background: active?"linear-gradient(90deg,var(--violet),var(--cyan))":"var(--panel-2)", clipPath:"var(--notch-sm)" }}>
                        <span style={{ display:"block", width:16, height:16, background:"#fff", clipPath:"var(--notch-sm)", transform: active?"translateX(18px)":"translateX(0)" }} />
                      </button>
                    </div>
                  </div>
                  {active && <div className="field" style={{ marginTop:10, marginBottom:0 }}><label>Reklam Birimi (Slot) ID</label>
                    <input className="input mono" placeholder="1234567890" value={(ads.slots&&ads.slots[pl.k])||""} onChange={e=>setAd({ slots:{ ...(ads.slots||{}), [pl.k]:e.target.value.trim() } })} /></div>}
                  <div style={{ marginTop:10 }}>
                    <div className="mono muted2" style={{ fontSize:9.5, letterSpacing:1, marginBottom:5 }}>CANLI ÖNİZLEME (DEMO)</div>
                    <DemoAd format={pl.fmt} />
                  </div>
                </div>
              ); })}
            </div>
          </Hud>
        </div>
      )}
      {sub==="messages" && (
        <div>
          <p className="muted" style={{ marginBottom:16, fontSize:14 }}>İletişim formundan gelen mesajlar burada toplanır. Toplam {messages.length} mesaj{unread?` · ${unread} okunmamış`:""}.</p>
          {messages.length===0
            ? <Hud><p className="muted2" style={{ fontSize:13 }}>Henüz mesaj yok. İletişim sayfasındaki formdan gönderilen mesajlar buraya düşer.</p></Hud>
            : <div style={{ display:"grid", gap:12 }}>
                {messages.map(m => (
                  <Hud key={m.id}>
                    <div className="flex" style={{ justifyContent:"space-between", alignItems:"flex-start", gap:10, flexWrap:"wrap" }}>
                      <div style={{ minWidth:0 }}>
                        <div className="flex" style={{ gap:8, alignItems:"center", flexWrap:"wrap" }}>
                          <b className="disp" style={{ fontSize:15 }}>{m.name}</b>
                          {!m.read && <span className="chip" style={{ color:"var(--volt)", borderColor:"rgba(52,211,153,.35)", fontSize:9.5 }}>YENİ</span>}
                        </div>
                        <div className="mono muted2" style={{ fontSize:11.5, marginTop:3 }}>{m.email} · {m.date}</div>
                      </div>
                      <div className="flex" style={{ gap:7 }}>
                        {!m.read && <button className="btn btn-ghost btn-sm" onClick={()=>onMsgRead(m.id)}><Check size={13}/> Okundu</button>}
                        <button className="btn btn-danger btn-sm" onClick={()=>onMsgDelete(m.id)}><X size={13}/></button>
                      </div>
                    </div>
                    {m.subject && <div className="mono" style={{ fontSize:12.5, marginTop:11, color:"var(--cyan)" }}>Konu: {m.subject}</div>}
                    <p className="muted" style={{ fontSize:13.5, marginTop:8, lineHeight:1.6, whiteSpace:"pre-wrap" }}>{m.message}</p>
                  </Hud>
                ))}
              </div>}
        </div>
      )}
      {sub==="seo" && (
        <div>
          <p className="muted" style={{ marginBottom:16, fontSize:14 }}>Site geneli SEO ayarları. Değişiklikler anında sayfa başlığına ve meta etiketlerine uygulanır.</p>
          <Hud className="noclip" style={{ marginBottom:16 }}>
            <h3 className="disp" style={{ fontSize:16, fontWeight:600, marginBottom:14 }}>Site Kimliği</h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12 }}>
              <div className="field"><label>Site Adı (og:site_name)</label>
                <input className="input" value={seo.siteName} onChange={e=>setSeo(s=>({ ...s, siteName:e.target.value }))} /></div>
              <div className="field"><label>Dil / Bölge (locale)</label>
                <select className="input" value={seo.locale} onChange={e=>setSeo(s=>({ ...s, locale:e.target.value }))}>
                  {["tr_TR","en_US","de_DE","fr_FR"].map(r=><option key={r}>{r}</option>)}
                </select></div>
              <div className="field"><label>Yazar (author)</label>
                <input className="input" value={seo.author} onChange={e=>setSeo(s=>({ ...s, author:e.target.value }))} /></div>
              <div className="field"><label>Tema Rengi (theme-color)</label>
                <div className="flex" style={{ gap:8, alignItems:"center" }}>
                  <input type="color" value={seo.themeColor} onChange={e=>setSeo(s=>({ ...s, themeColor:e.target.value }))} style={{ width:42, height:38, padding:0, border:"1px solid var(--line)", background:"none", borderRadius:6, cursor:"pointer" }} />
                  <input className="input mono" value={seo.themeColor} onChange={e=>setSeo(s=>({ ...s, themeColor:e.target.value }))} style={{ flex:1 }} />
                </div></div>
            </div>
          </Hud>
          <Hud className="noclip" style={{ marginBottom:16 }}>
            <h3 className="disp" style={{ fontSize:16, fontWeight:600, marginBottom:14 }}>Temel Etiketler</h3>
            <div style={{ display:"grid", gap:14 }}>
              <div className="field"><label>Sayfa Başlığı — title ({(seo.title||"").length} karakter, ideal 50–60)</label>
                <input className="input" value={seo.title} onChange={e=>setSeo(s=>({ ...s, title:e.target.value }))} /></div>
              <div className="field"><label>Meta Açıklama — description ({(seo.desc||"").length}/160)</label>
                <textarea className="input" rows={3} value={seo.desc} onChange={e=>setSeo(s=>({ ...s, desc:e.target.value }))} /></div>
              <div className="field"><label>Anahtar Kelimeler (virgülle ayır)</label>
                <textarea className="input" rows={2} value={seo.keywords} onChange={e=>setSeo(s=>({ ...s, keywords:e.target.value }))} /></div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12 }}>
                <div className="field"><label>Canonical URL</label>
                  <input className="input mono" value={seo.canonical} onChange={e=>setSeo(s=>({ ...s, canonical:e.target.value }))} /></div>
                <div className="field"><label>Robots</label>
                  <select className="input" value={seo.robots} onChange={e=>setSeo(s=>({ ...s, robots:e.target.value }))}>
                    {["index, follow","noindex, follow","index, nofollow","noindex, nofollow"].map(r=><option key={r}>{r}</option>)}
                  </select></div>
              </div>
            </div>
          </Hud>
          <Hud className="noclip" style={{ marginBottom:16 }}>
            <h3 className="disp" style={{ fontSize:16, fontWeight:600, marginBottom:14 }}>Sosyal Paylaşım (Open Graph / Twitter)</h3>
            <div style={{ display:"grid", gap:14 }}>
              <div className="field"><label>Paylaşım Görseli — og:image (URL)</label>
                <input className="input mono" value={seo.ogImage} onChange={e=>setSeo(s=>({ ...s, ogImage:e.target.value }))} /></div>
              <div className="field"><label>Twitter Kart Tipi</label>
                <select className="input" value={seo.twitter} onChange={e=>setSeo(s=>({ ...s, twitter:e.target.value }))}>
                  {["summary_large_image","summary"].map(r=><option key={r}>{r}</option>)}
                </select></div>
              <div className="field"><label>Twitter Kullanıcı Adı</label>
                <input className="input mono" value={seo.twitterHandle} onChange={e=>setSeo(s=>({ ...s, twitterHandle:e.target.value }))} placeholder="@gamemate" /></div>
            </div>
          </Hud>
          <Hud accent>
            <div className="mono muted2" style={{ fontSize:10.5, letterSpacing:".12em", marginBottom:12 }}>// GOOGLE ARAMA ÖNİZLEMESİ</div>
            <div style={{ background:"#fff", borderRadius:8, padding:"14px 16px" }}>
              <div style={{ color:"#202124", fontSize:12.5, fontFamily:"arial,sans-serif" }}>{seo.canonical||"https://gamemate.gg/"}</div>
              <div style={{ color:"#1a0dab", fontSize:20, fontFamily:"arial,sans-serif", margin:"3px 0 4px", lineHeight:1.2 }}>{seo.title||"GameMate"}</div>
              <div style={{ color:"#4d5156", fontSize:13.5, fontFamily:"arial,sans-serif", lineHeight:1.5 }}>{(seo.desc||"").slice(0,170)}{(seo.desc||"").length>170?"…":""}</div>
            </div>
          </Hud>
          <Hud className="noclip" style={{ margin:"16px 0" }}>
            <div className="flex" style={{ justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <h3 className="disp" style={{ fontSize:16, fontWeight:600 }}>SEO Sağlık Kontrolü</h3>
              <span className="chip" style={{ color: seoScore>=7?"var(--volt)":seoScore>=4?"var(--gold)":"var(--danger)", borderColor:"var(--line)", fontWeight:700 }}>{seoScore} / {seoChecks.length}</span>
            </div>
            <div style={{ display:"grid", gap:8 }}>
              {seoChecks.map((c,i)=>(
                <div key={i} className="flex" style={{ gap:9, alignItems:"center" }}>
                  <span style={{ width:18, height:18, minWidth:18, display:"grid", placeItems:"center", borderRadius:4, background: c.ok?"rgba(52,211,153,.16)":"rgba(239,68,68,.14)" }}>
                    {c.ok ? <Check size={12} style={{ color:"var(--volt)" }} /> : <X size={12} style={{ color:"var(--danger)" }} />}
                  </span>
                  <span style={{ fontSize:13, color: c.ok?"var(--text)":"var(--muted)" }}>{c.label}</span>
                </div>
              ))}
            </div>
          </Hud>
          <Hud className="noclip" style={{ marginBottom:16 }}>
            <h3 className="disp" style={{ fontSize:16, fontWeight:600, marginBottom:6 }}>Yapısal Veri & Dosyalar</h3>
            <p className="muted2" style={{ fontSize:12, marginBottom:12 }}>Aşağıdaki JSON-LD yapısal verisi sayfaya otomatik gömülür (Organization + WebSite + arama kutusu eylemi). robots.txt ve sitemap üretimdeki Next.js sürümünde sunulmalı.</p>
            <label style={{ fontSize:12.5, color:"var(--muted)", display:"block", marginBottom:6 }}>JSON-LD (otomatik gömülür)</label>
            <div className="mono" style={{ fontSize:11, background:"var(--void)", border:"1px solid var(--line)", padding:"12px 14px", borderRadius:6, overflowX:"auto", color:"var(--muted)", whiteSpace:"pre", marginBottom:14 }}>{jsonLdPreview}</div>
            <label style={{ fontSize:12.5, color:"var(--muted)", display:"block", marginBottom:6 }}>robots.txt önerisi</label>
            <div className="mono" style={{ fontSize:11.5, background:"var(--void)", border:"1px solid var(--line)", padding:"12px 14px", borderRadius:6, color:"var(--muted)", whiteSpace:"pre" }}>{"User-agent: *\nAllow: /\nSitemap: "+(seo.canonical||"https://gamemate.gg/")+"sitemap.xml"}</div>
          </Hud>
          <p className="muted2" style={{ fontSize:12, marginTop:14, lineHeight:1.6 }}>Not: Bu prototip tek-sayfa (SPA) olduğundan tam SEO (sitemap.xml, robots.txt, sunucu tarafı render / SSR) yalnızca üretimdeki Next.js sürümünde tam çalışır. Burada başlık ve meta etiketleri tarayıcıda canlı güncellenir — geliştirici araçlarından (Elements → head) görebilirsin.</p>
        </div>
      )}
      {sub==="site" && (
        <Hud>
          <h3 className="disp" style={{ fontSize:16, fontWeight:600, marginBottom:4 }}>Site Görünümü</h3>
          <p className="muted2" style={{ fontSize:12, marginBottom:16 }}>Bu ayarlar açılış (giriş yapılmamış) ekranını etkiler. Görmek için çıkış yapıp ana sayfaya bak.</p>
          <div className="field" style={{ marginBottom:16 }}><label>Logo Boyutu — {siteCfg.logoSize}px</label>
            <input type="range" min="30" max="64" value={siteCfg.logoSize} onChange={e=>setSiteCfg(c=>({ ...c, logoSize:Number(e.target.value) }))} style={{ width:"100%", accentColor:"var(--cyan)" }} /></div>
          <div className="field" style={{ marginBottom:16 }}><label>Açılış Sayfası Büyüklüğü — x{Number(siteCfg.landingScale).toFixed(2)}</label>
            <input type="range" min="0.9" max="1.6" step="0.02" value={siteCfg.landingScale} onChange={e=>setSiteCfg(c=>({ ...c, landingScale:Number(e.target.value) }))} style={{ width:"100%", accentColor:"var(--cyan)" }} /></div>
          <div className="field"><label>Footer Metni (telif / tüm hakları saklıdır)</label>
            <input className="input" value={siteCfg.footer} onChange={e=>setSiteCfg(c=>({ ...c, footer:e.target.value }))} /></div>
        </Hud>
      )}
    </div>
  );
}

function PageHead({ eyebrow, title, sub }){
  return (
    <div style={{ marginBottom:22 }}>
      <span className="eyebrow">// {eyebrow}</span>
      <h1 className="disp" style={{ fontSize:30, fontWeight:700, margin:"6px 0 8px" }}>{title}</h1>
      {sub && <p className="muted" style={{ fontSize:14.5, lineHeight:1.6, maxWidth:640 }}>{sub}</p>}
    </div>
  );
}
function Sec({ title, children }){
  return (
    <div style={{ marginBottom:22 }}>
      <h2 className="disp" style={{ fontSize:18, fontWeight:600, marginBottom:8 }}>{title}</h2>
      <div className="muted" style={{ fontSize:14, lineHeight:1.7 }}>{children}</div>
    </div>
  );
}

function AboutView(){
  return (
    <div style={{ maxWidth:760 }}>
      <PageHead eyebrow="HAKKINDA" title="GameMate Nedir?"
        sub="GameMate, aynı oyunları oynayan oyuncuları birbirine bağlayan bir eşleşme platformudur. Tek başına oynamaktan sıkıldıysan, sana uyumlu takım arkadaşları bulman için buradayız." />
      <Sec title="Misyonumuz">Hiç kimsenin oynayacak arkadaşı olmadığı için sevdiği oyunu bırakmak zorunda kalmaması. Platform, oyun tarzına, rütbene, aktif saatlerine ve karakterine göre seni doğru kişilerle buluşturur — toksik değil, uyumlu eşleşmeler.</Sec>
      <Sec title="Nasıl Çalışır?">Önce platformunu (PC / PS5) ve oynadığın oyunları seçersin. Sonra rütbe, rol ve oyun tarzını belirtirsin. GameMate sana en uyumlu oyuncuları listeler; davet gönderir, eşleşince Steam/Discord bilgileri açılır ve oynamaya başlarsınız.</Sec>
      <Sec title="Neden GameMate?">Reklam odaklı değil, eşleşme odaklı bir deneyim sunarız. Profiller gerçek oyun verisiyle zenginleşir, puanlama sistemi sayesinde güvenilir oyuncularla oynarsın ve topluluk kuralları herkesin keyif almasını sağlar.</Sec>
      <Hud>
        <p className="muted" style={{ fontSize:13.5 }}>Bir sorun mu var ya da fikrin mi var? <b style={{ color:"var(--text)" }}>İletişim</b> sayfasından bize ulaş — her mesaj ekibimize ulaşır.</p>
      </Hud>
    </div>
  );
}

function PrivacyView(){
  return (
    <div style={{ maxWidth:760 }}>
      <PageHead eyebrow="GİZLİLİK" title="Gizlilik Politikası"
        sub="Verilerini nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklar. Son güncelleme: Haziran 2026." />
      <Sec title="1. Topladığımız Veriler">Hesap bilgilerin (kullanıcı adı, e-posta, doğum tarihi), oyun tercihlerin (oyunlar, rütbe, rol, platform), bağladığın hesaplar (Steam, Discord) ve platform içi etkinliğin (eşleşmeler, puanlar, yorumlar). Yalnızca hizmeti sunmak için gerekli olanı toplarız.</Sec>
      <Sec title="2. Verileri Nasıl Kullanırız">Seni uyumlu oyuncularla eşleştirmek, profilini diğer oyunculara göstermek, hizmet güvenliğini sağlamak ve deneyimini iyileştirmek için. Verilerini izinsiz olarak üçüncü taraflara satmayız.</Sec>
      <Sec title="3. Çerezler ve Reklamlar">Oturumunu açık tutmak ve tercihlerini hatırlamak için çerez kullanırız. Sitede reklam gösterildiğinde (ör. Google AdSense), reklam sağlayıcıları ilgi alanına dayalı reklam için çerez kullanabilir. Tarayıcı ayarlarından çerezleri yönetebilirsin.</Sec>
      <Sec title="4. Veri Paylaşımı">Eşleştiğin oyuncularla yalnızca senin paylaşmayı seçtiğin iletişim bilgilerin (Steam/Discord) paylaşılır. Yasal zorunluluklar dışında verilerin gizli tutulur.</Sec>
      <Sec title="5. Haklarınız">Hesabına ait verilere erişme, düzeltme ve silinmesini talep etme hakkın vardır. Hesabını sildiğinde profil verilerin kaldırılır.</Sec>
      <Sec title="6. İletişim">Gizlilikle ilgili sorular için İletişim sayfasından bize ulaşabilir ya da destek@gamemate.gg adresine yazabilirsin.</Sec>
    </div>
  );
}

function RulesView(){
  const RULES = [
    ["Saygılı Ol","Her oyuncuya saygıyla yaklaş. Hakaret, ayrımcılık ve nefret söylemi kesinlikle yasaktır."],
    ["Adil Oyna","Hile, bot, hesap satışı/kiralama ve sıralama manipülasyonu yasaktır. Adil oyun herkesin hakkıdır."],
    ["Taciz Yok","Rahatsız edici mesajlar, ısrarlı davetler ve taciz, anında uyarı ve yasaklama sebebidir."],
    ["Spam ve Reklam Yapma","İzinsiz reklam, bağlantı spam'i ve istenmeyen tanıtım içeriği paylaşma."],
    ["Hesabını Koru","Giriş bilgilerini kimseyle paylaşma. Hesabından yapılan tüm işlemlerden sen sorumlusun."],
    ["Yaş Sınırı","Platform 13 yaş ve üzeri içindir. Bölgendeki yasal yaş sınırına uymakla yükümlüsün."],
    ["Doğru Bilgi Ver","Profilinde gerçek oyun verilerini kullan. Yanıltıcı bilgi eşleşme kalitesini bozar."],
  ];
  return (
    <div style={{ maxWidth:760 }}>
      <PageHead eyebrow="KURALLAR" title="Topluluk Kuralları"
        sub="GameMate'i herkes için keyifli ve güvenli tutmak için bu kurallara uyulması beklenir. Kuralları ihlal etmek uyarı, geçici veya kalıcı yasaklamayla sonuçlanabilir." />
      <div style={{ display:"grid", gap:12 }}>
        {RULES.map(([t,d],i)=>(
          <Hud key={i}>
            <div className="flex" style={{ gap:13, alignItems:"flex-start" }}>
              <div style={{ width:30, height:30, minWidth:30, display:"grid", placeItems:"center", clipPath:"var(--notch-sm)", background:"linear-gradient(135deg,var(--violet),var(--cyan))", color:"#0b0d16", fontWeight:800, fontSize:14 }}>{i+1}</div>
              <div><div className="disp" style={{ fontSize:15.5, fontWeight:600, marginBottom:3 }}>{t}</div>
                <p className="muted" style={{ fontSize:13.5, lineHeight:1.6 }}>{d}</p></div>
            </div>
          </Hud>
        ))}
      </div>
      <p className="muted2" style={{ fontSize:12.5, marginTop:18, lineHeight:1.6 }}>Kuralları ihlal eden bir oyuncuyla karşılaşırsan, profilindeki yorum bölümünden şikayet edebilir ya da İletişim sayfasından bize bildirebilirsin. Bildirimler admin ekibimize ulaşır.</p>
    </div>
  );
}

function ContactView({ onSend, prefillEmail="" }){
  const [f, setF] = useState({ name:"", email:prefillEmail, subject:"", message:"" });
  const [sent, setSent] = useState(false);
  const valid = f.name.trim() && f.email.trim() && f.message.trim();
  const submit = () => { if(!valid) return; onSend({ name:f.name.trim(), email:f.email.trim(), subject:f.subject.trim(), message:f.message.trim() }); setSent(true); setF({ name:"", email:"", subject:"", message:"" }); };
  return (
    <div style={{ maxWidth:680 }}>
      <PageHead eyebrow="İLETİŞİM" title="Bize Ulaş"
        sub="Soru, öneri ya da bir sorun bildirimi — formu doldur, mesajın doğrudan ekibimize ulaşsın." />
      {sent && (
        <Hud volt style={{ marginBottom:18 }}>
          <div className="flex" style={{ gap:10, alignItems:"center" }}>
            <Check size={18} style={{ color:"var(--volt)" }} />
            <span style={{ fontSize:14 }}>Mesajın alındı! En kısa sürede dönüş yapacağız.</span>
          </div>
        </Hud>
      )}
      <Hud>
        <div style={{ display:"grid", gap:14 }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12 }}>
            <div className="field"><label>Adın</label>
              <input className="input" value={f.name} onChange={e=>setF({ ...f, name:e.target.value })} placeholder="Adın" /></div>
            <div className="field"><label>E-posta</label>
              <input className="input" type="email" value={f.email} onChange={e=>setF({ ...f, email:e.target.value })} placeholder="ornek@mail.com" /></div>
          </div>
          <div className="field"><label>Konu</label>
            <input className="input" value={f.subject} onChange={e=>setF({ ...f, subject:e.target.value })} placeholder="örn. Hesap sorunu, öneri, iş birliği" /></div>
          <div className="field"><label>Mesajın</label>
            <textarea className="input" rows={5} value={f.message} onChange={e=>setF({ ...f, message:e.target.value })} placeholder="Bize iletmek istediklerini yaz..." /></div>
          <button className="btn btn-primary" disabled={!valid} onClick={submit}><Send size={15}/> Mesajı Gönder</button>
        </div>
      </Hud>
    </div>
  );
}

function InfoView(){
  const Q=[
    { t:"GameMate ne işe yarar?", d:"Aynı oyunu oynayan, aynı seviyedeki oyuncularla tanışmanı sağlar. Rankına, rolüne ve oyun tarzına göre sana en uygun takım arkadaşını bulursun." },
    { t:"Nasıl çalışır?", d:"Profilini oluştur (oyunların, rankın, rolün, aktif saatlerin), Oyuncu Bul'dan filtrele, beğendiğin oyuncuya 'Birlikte Oyna' daveti gönder. Kabul edilince Steam ve Discord bilgileri açılır." },
    { t:"İletişim bilgilerim güvende mi?", d:"Steam profilin ve Discord ID'n yalnızca davetini kabul ettiğin (eşleştiğin) oyunculara gösterilir." },
    { t:"Oyuncu profilleri ve duvarlar nedir?", d:"Her oyuncunun bir profil sayfası ve duvarı vardır. Birlikte oynadığın oyunculara 0–5 puan verebilir, duvarına yorum yazabilirsin (ör. 'sakin, oynaması keyifli')." },
    { t:"Kurallar nedir?", d:"Argo, küfür ve hakaret yasaktır. Bu tür yorumlar şikayet edilir ve hesap kalıcı olarak banlanabilir." },
  ];
  const S=[
    { n:"01", t:"Hesap oluştur", d:"Kullanıcı adı, yaş ve oyunlarını ekle." },
    { n:"02", t:"Eşleşmeni bul", d:"Rank, rol, platform ve saat aralığına göre filtrele." },
    { n:"03", t:"Davet gönder", d:"Kabul edilince iletişim açılır, birlikte oyna." },
  ];
  return (
    <div style={{ maxWidth:820 }}>
      <span className="eyebrow">// BİLGİ</span>
      <h1 className="disp" style={{ fontSize:28, fontWeight:700, margin:"4px 0 6px" }}>GameMate Nasıl Çalışır?</h1>
      <p className="muted" style={{ marginBottom:22 }}>Siteyi nasıl kullanacağına dair her şey.</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:14, marginBottom:24 }}>
        {S.map(x=>(
          <Hud key={x.n}><div className="disp" style={{ fontSize:30, fontWeight:700, color:"var(--violet-hi)", opacity:.6 }}>{x.n}</div>
            <h3 className="disp" style={{ fontSize:16, fontWeight:600, marginTop:8 }}>{x.t}</h3>
            <p className="muted" style={{ fontSize:13, marginTop:6 }}>{x.d}</p></Hud>
        ))}
      </div>
      <div style={{ display:"grid", gap:10 }}>
        {Q.map((x,i)=>(
          <Hud key={i}><h3 className="disp" style={{ fontSize:15.5, fontWeight:600 }}>{x.t}</h3>
            <p className="muted" style={{ fontSize:13.5, marginTop:6 }}>{x.d}</p></Hud>
        ))}
      </div>
    </div>
  );
}

const BLOG_POSTS=[
  { id:"oyun-arkadasi-bulma", title:"Oyun Arkadaşı Bulma: 2026 Kapsamlı Rehberi", cat:"Rehber", date:"28 Haziran 2026", read:7, related:["valorant-duo","ps5-oyun-arkadasi","discord-oyun-grubu"],
    excerpt:"Oyun arkadaşı bulmanın en pratik yolları: platform seçimi, rank uyumu, sesli iletişim ve güvenli eşleşme ipuçları.",
    body:[
      "Tek başına oynamak bir süre sonra sıkıcı hâle gelir; doğru oyun arkadaşı ise hem kazanma oranını hem de keyfi artırır. Bu rehberde sana uygun takım arkadaşını bulmanın adımlarını topladık.",
      "## Oyun arkadaşı bulmak neden zor?",
      "Rastgele eşleşmelerde rank farkı, dil sorunu, mikrofon kullanmama ve farklı oyun tarzları en sık yaşanan sorunlardır. Çözüm, eşleşmeyi şansa bırakmamak ve filtreyle doğru kişiyi bulmaktır.",
      "## Adım adım oyun arkadaşı bulma",
      "Önce platformunu (PC veya PS5) ve oynadığın oyunları belirle. Ardından rank, rol ve aktif olduğun saat aralığını seç. GameMate bu kriterlere göre sana en uyumlu oyuncuları listeler; davet gönderir, eşleşince iletişim bilgileri açılır.",
      "## Sağlıklı topluluk ipuçları",
      "Profilini eksiksiz doldur, gerçek rankını yaz ve sesli iletişime açık ol. Toksik davranışlardan kaçın; duvar yorumları ve şikayet sistemini kullanarak temiz bir topluluğa katkı sun.",
      "Hazırsan ilk eşleşmeni hemen oluşturabilirsin: ücretsiz kaydol ve oyun arkadaşını bul."
    ] },
  { id:"valorant-duo", title:"Valorant Duo Bulma: Uyumlu Partner Nasıl Bulunur?", cat:"Valorant", date:"26 Haziran 2026", read:6, related:["lol-takim","rank-uyumu","mic-iletisim"],
    excerpt:"Valorant'ta duo bulurken rank uyumu, ajan rolleri ve iletişim neden kritik? Kalıcı bir duo için bilmen gereken her şey.",
    body:[
      "Valorant'ta solo queue zorludur; doğru duo partneri kazanma oranını ciddi şekilde yükseltir. Peki uyumlu bir Valorant duosu nasıl bulunur?",
      "## Rank yakınlığı",
      "İkinizin rankı birbirine yakın olmalı. Çok büyük rank farkı hem maç dengesini bozar hem de eşleşme sürelerini uzatır. Benzer seviye, daha dengeli ve keyifli maçlar demektir.",
      "## Ajan ve rol uyumu",
      "İyi bir duo, rolleri tamamlar: örneğin bir Düellocu ile bir Kontrolcü ya da bir Başlatıcı. Aynı rolü isteyen iki kişi yerine, birbirini dengeleyen ajan seçimleri yapın.",
      "## İletişim",
      "Mikrofon kullanımı Valorant'ta belki de en önemli faktördür. Net çağrılar (call) yapan, sakin bir partner; tek başına mekanik yetenekten daha değerlidir.",
      "GameMate'te oyun, rank, rol ve aktif saat aralığına göre filtreleyerek tam sana uygun Valorant duosunu bulabilirsin."
    ] },
  { id:"lol-takim", title:"LoL'de Uyumlu Takım Arkadaşı Bulma Rehberi", cat:"League of Legends", date:"24 Haziran 2026", read:6, related:["valorant-duo","rank-uyumu","discord-oyun-grubu"],
    excerpt:"League of Legends'ta flex ve solo/duo için uyumlu takım arkadaşı bulmanın yolları, rol dağılımı ve iletişim ipuçları.",
    body:[
      "League of Legends takım oyunudur; 5 kişilik uyumlu bir kadro, rastgele eşleşmelerden çok daha tutarlı sonuçlar verir.",
      "## Rolleri net belirleyin",
      "Üst koridor, orman, orta koridor, nişancı ve destek. Herkesin ana rolünü oynadığı bir kadro kurmak, otofill kaynaklı dengesizlikleri ortadan kaldırır.",
      "## Rank ve hedef uyumu",
      "Aynı hedefe (ör. Elmas'a çıkmak) sahip, benzer rankta oyuncular bir araya geldiğinde motivasyon ve performans artar. Hedefleri konuşarak başlamak önemlidir.",
      "## Düzenli takım",
      "Tek seferlik eşleşmeler yerine düzenli oynayabileceğin kişiler bul. GameMate'te uygun oyuncularla eşleşip Discord üzerinden kalıcı bir takım kurabilirsin."
    ] },
  { id:"cs2-premier", title:"CS2 Premier İçin 5 Kişilik Takım Nasıl Kurulur?", cat:"Counter-Strike 2", date:"22 Haziran 2026", read:6, related:["lol-takim","mic-iletisim","oyun-arkadasi-bulma"],
    excerpt:"Counter-Strike 2 Premier modunda yükselmek için ideal takım kompozisyonu, rol dağılımı ve pratik önerileri.",
    body:[
      "CS2 Premier modunda tek başına yükselmek zordur. Koordineli 5 kişilik bir takım, hem CS puanını hem de oyun keyfini artırır.",
      "## Rol dağılımı",
      "Giriş (entry), AWP'ci, destek, takım lideri (IGL) ve pusucu (lurker). Her oyuncunun belirli bir görevi olması, kaotik maçları planlı bir oyuna dönüştürür.",
      "## İletişim ve disiplin",
      "Kısa, net çağrılar yapın; gereksiz konuşmayı azaltın. Ekonomi yönetimi ve takım halinde alım kararları, bireysel nişancılıktan daha belirleyicidir.",
      "## Takım arkadaşı bul",
      "Benzer rankta, mikrofon kullanan ve düzenli oynayabilecek oyuncuları GameMate üzerinden filtreleyerek bulabilir, Premier kadronu kolayca tamamlayabilirsin."
    ] },
  { id:"ps5-oyun-arkadasi", title:"PS5'te Oyun Arkadaşı Bulmanın Yolları", cat:"PlayStation", date:"20 Haziran 2026", read:5, related:["coop-oyunlar","oyun-arkadasi-bulma","apex-duo"],
    excerpt:"PS5'te crossplay oyunlarda arkadaş bulma, PSN kullanıcı adı paylaşımı ve birlikte oynanacak en iyi oyunlar.",
    body:[
      "PS5'te birlikte oynayacak insan bulmak, özellikle crossplay oyunlarda hiç olmadığı kadar kolay. Doğru yaklaşımla kalıcı bir oyun grubu kurabilirsin.",
      "## Crossplay avantajı",
      "Fortnite, Apex Legends, Rocket League, Helldivers 2, Call of Duty ve EA Sports FC gibi birçok oyun PS5 ile PC ve Xbox arasında crossplay destekler. Bu da eşleşebileceğin oyuncu havuzunu büyütür.",
      "## PSN kullanıcı adını paylaş",
      "GameMate'te eşleştiğin oyuncularla PSN kullanıcı adını güvenle paylaşabilirsin. Bu bilgiler yalnızca arkadaş olduğun kişilere görünür.",
      "## Birlikte başla",
      "Platformunu PS5 seç, oynadığın oyunları ekle ve sana uygun konsol oyuncularıyla eşleş. Birkaç dakikada ilk takımını kurabilirsin."
    ] },
  { id:"fivem-sunucu", title:"FiveM (GTA V Rol Yapma) Nedir, Nasıl Başlanır?", cat:"FiveM", date:"18 Haziran 2026", read:7, related:["coop-oyunlar","discord-oyun-grubu","oyun-arkadasi-bulma"],
    excerpt:"FiveM nedir, GTA V rol yapma (roleplay) sunucularına nasıl katılınır ve birlikte oynayacak ekip nasıl bulunur?",
    body:[
      "FiveM, GTA V için geliştirilmiş popüler bir çok oyunculu moddur ve özellikle rol yapma (roleplay) sunucularıyla tanınır. Polis, esnaf, taksici ya da çete üyesi olarak yaşayan bir şehir simülasyonu sunar.",
      "## FiveM'e nasıl başlanır?",
      "GTA V'in lisanslı bir kopyasına sahip olman gerekir. FiveM istemcisini kurduktan sonra sunucu listesinden Türk rol yapma sunucularına katılabilirsin. Her sunucunun kendi kuralları ve karakter oluşturma sistemi vardır.",
      "## Neden ekip önemli?",
      "Rol yapma deneyimi, birlikte oynadığın kişilerle anlam kazanır. Aynı sunucuda tanıdık bir ekip, hikâyeleri çok daha akıcı ve eğlenceli hâle getirir.",
      "## Ekip bul",
      "GameMate'te FiveM'i oyunların arasına ekleyip aynı tarz rol yapmayı seven oyuncularla eşleşebilir, Discord üzerinden sunucu ekibini kolayca kurabilirsin."
    ] },
  { id:"coop-oyunlar", title:"Arkadaşınla Oynayabileceğin En İyi Co-op Oyunlar", cat:"Co-op", date:"16 Haziran 2026", read:8, related:["elden-ring-coop","ps5-oyun-arkadasi","fivem-sunucu"],
    excerpt:"Birlikte oynayıp ilerleyebileceğin, hatta zorlu bölümleri birlikte geçebileceğin en iyi co-op ve PvE oyunları.",
    body:[
      "Her oyun rekabet üzerine kurulu değildir. Bazı oyunlar tek başına da oynansa, bir arkadaşla birlikte çok daha keyifli olur ve zorlu bölümleri birlikte aşmak mümkün hâle gelir.",
      "## Squad tabanlı PvE",
      "Helldivers 2 ve Warframe gibi oyunlar, 3-4 kişilik ekiplerle göreve çıktığın kooperatif yapımlar. Koordinasyon ve rol paylaşımı, başarının anahtarıdır.",
      "## Birlikte keşif ve hayatta kalma",
      "Sea of Thieves, Valheim, Palworld ve Stardew Valley; birlikte keşfettiğin, üs kurduğun ve uzun soluklu maceralara çıktığın oyunlardır.",
      "## Zorlu bölümleri birlikte geçmek",
      "Elden Ring, Monster Hunter Wilds ve Baldur's Gate 3 gibi oyunlarda takılırsan, deneyimli bir oyuncuyla birlikte oynayarak nasıl ilerleyeceğini öğrenebilirsin.",
      "GameMate'te bu oyunları profiline ekleyip birlikte oynayacak, sana yardımcı olacak oyuncularla eşleşebilirsin."
    ] },
  { id:"elden-ring-coop", title:"Elden Ring Co-op: Birlikte Nasıl Oynanır?", cat:"Co-op", date:"14 Haziran 2026", read:6, related:["coop-oyunlar","oyun-arkadasi-bulma","ps5-oyun-arkadasi"],
    excerpt:"Elden Ring'te bir arkadaşınla birlikte oynamanın yolları ve zorlu boss'ları takım hâlinde geçme taktikleri.",
    body:[
      "Elden Ring zorlu bir oyundur; ama co-op sayesinde bir arkadaşını yardıma çağırabilir, takıldığın boss'ları birlikte geçebilirsin.",
      "## Co-op nasıl kurulur?",
      "Genel olarak çağrı işareti (summon sign) ve parola eşyaları kullanılarak başka bir oyuncu dünyana davet edilir. Aynı parolayı belirlemek, doğrudan arkadaşınla eşleşmeni kolaylaştırır.",
      "## Birlikte ilerleme taktikleri",
      "Boss savaşlarında biriniz dikkat çekerken (aggro), diğeriniz arkadan vurabilir. İyileştirme ve diriltme zamanlamasını konuşmak, zorlu anları çok daha yönetilebilir kılar.",
      "## Yardımcı oyuncu bul",
      "Bir bölümde takıldıysan, GameMate'te Elden Ring oynayan deneyimli oyuncularla eşleşip nasıl geçeceğini sorabilir ya da birlikte oynayabilirsin."
    ] },
  { id:"apex-duo", title:"Apex Legends'ta İyi Bir Üçlü (Trio) Nasıl Kurulur?", cat:"Apex Legends", date:"12 Haziran 2026", read:5, related:["marvel-rivals-takim","ps5-oyun-arkadasi","mic-iletisim"],
    excerpt:"Apex Legends'ta uyumlu bir trio kurmak için efsane (legend) seçimi, rol dağılımı ve iletişim önerileri.",
    body:[
      "Apex Legends üç kişilik takım oyunudur; uyumlu bir trio, tek başına oynamaktan kat kat daha başarılı olur.",
      "## Efsane uyumu",
      "Takımınızda bir vurucu (fragger), bir destek ve bir keşif/öncü olması dengeli bir kompozisyon sağlar. Yeteneklerin birbirini tamamladığı efsaneler seçin.",
      "## Konum ve rotasyon",
      "Erken kavgalardan çok, iyi rotasyon ve bölge kontrolü kazandırır. Birlikte hareket etmek ve düşman seslerini paylaşmak hayatta kalmanın anahtarıdır.",
      "GameMate'te crossplay açık, mikrofon kullanan ve benzer rankta Apex oyuncularıyla eşleşerek sabit bir trio kurabilirsin."
    ] },
  { id:"marvel-rivals-takim", title:"Marvel Rivals'ta Takım Dizilimi ve Rol Uyumu", cat:"Marvel Rivals", date:"10 Haziran 2026", read:5, related:["apex-duo","lol-takim","mic-iletisim"],
    excerpt:"Marvel Rivals'ta 6v6 maçlarda Düellocu, Öncü ve Stratejist dengesi nasıl kurulur, takım nasıl güçlendirilir?",
    body:[
      "Marvel Rivals, 6v6 formatıyla takım kompozisyonunun çok önemli olduğu bir kahraman nişancısıdır.",
      "## Rol dengesi",
      "İyi bir dizilim genellikle Öncü (tank), Düellocu (hasar) ve Stratejist (destek) rollerini dengeler. Yalnızca hasar seçmek, takımı kırılgan bırakır.",
      "## Takım kombinasyonları",
      "Bazı kahramanlar birlikte daha güçlüdür; takım üyeleriyle uyumlu seçimler yaparak özel beraberlik (team-up) yeteneklerinden faydalanabilirsin.",
      "GameMate'te Marvel Rivals oynayan, rol uyumuna önem veren oyuncularla eşleşip düzenli bir takım kurabilirsin."
    ] },
  { id:"discord-oyun-grubu", title:"Discord'da Oyun Grubu Bulma ve Kurma", cat:"Topluluk", date:"8 Haziran 2026", read:5, related:["oyun-arkadasi-bulma","lol-takim","mic-iletisim"],
    excerpt:"Discord oyun grupları nasıl bulunur, güvenli şekilde nasıl katılınır ve kalıcı bir topluluk nasıl kurulur?",
    body:[
      "Discord, oyun toplulukları için en çok kullanılan platformdur. Ancak doğru ve aktif bir grup bulmak her zaman kolay değildir.",
      "## Doğru grubu bulmak",
      "Aynı oyunu, benzer rankta ve aynı saatlerde oynayan kişilerden oluşan gruplar en verimlisidir. Rastgele bir sunucuya katılmak yerine, eşleştiğin oyuncularla küçük ama uyumlu bir grup kurmak daha sürdürülebilirdir.",
      "## Güvenlik",
      "Kişisel bilgilerini herkese açma; yalnızca güvendiğin, eşleştiğin oyuncularla iletişim bilgilerini paylaş. GameMate'te bu bilgiler yalnızca arkadaşlarına görünür.",
      "Önce GameMate'te uygun oyuncularla eşleş, ardından Discord'da kalıcı bir oyun grubu oluştur."
    ] },
  { id:"rank-uyumu", title:"Rank Uyumu Neden Önemli?", cat:"İpucu", date:"5 Haziran 2026", read:4, related:["valorant-duo","lol-takim","oyun-arkadasi-bulma"],
    excerpt:"Çok yüksek ya da çok düşük rankta oynamak neden eşleşme kalitesini düşürür? Dengeli eşleşmenin faydaları.",
    body:[
      "Benzer seviyedeki oyuncularla oynamak, hem maç dengesini hem de iletişimi iyileştirir.",
      "## Beklenti farkı",
      "Rank farkı açıldıkça oyuncuların beklentileri ayrışır; mekanik seviye, oyun bilgisi ve tempo uyuşmaz. Bu da hem kazanmayı zorlaştırır hem de keyfi düşürür.",
      "## Dengeli eşleşme",
      "GameMate, uyumu rank yakınlığına göre hesaplar. Böylece seninle aynı seviyede, aynı hedefe oynayan oyuncularla eşleşirsin."
    ] },
  { id:"mic-iletisim", title:"Sesli İletişim: İyi Takım Oyununun Anahtarı", cat:"İpucu", date:"2 Haziran 2026", read:4, related:["valorant-duo","cs2-premier","discord-oyun-grubu"],
    excerpt:"Mikrofon kullanımı takım oyunlarında neden bu kadar fark yaratır ve etkili iletişim nasıl yapılır?",
    body:[
      "Takım tabanlı oyunlarda iletişim, çoğu zaman bireysel yetenekten daha belirleyicidir.",
      "## Net ve kısa çağrılar",
      "Düşman konumu, can durumu ve plan; kısa ve net cümlelerle paylaşılmalı. Gereksiz konuşma, önemli bilgilerin kaybolmasına yol açar.",
      "## Pozitif ton",
      "Eleştiri yerine çözüm odaklı konuşmak, takım moralini korur. Toksik iletişim, en yetenekli takımı bile dağıtır.",
      "GameMate'te profilinde sesli iletişime açık olduğunu belirterek mikrofon kullanan oyuncularla eşleşebilirsin."
    ] },
  { id:"toksik", title:"Toksik Oyunculardan Nasıl Korunursun?", cat:"Topluluk", date:"28 Mayıs 2026", read:5, related:["mic-iletisim","discord-oyun-grubu","oyun-arkadasi-bulma"],
    excerpt:"Engelleme, şikayet ve duvar yorumlarıyla sağlıklı ve toksik olmayan bir oyun topluluğu nasıl kurulur?",
    body:[
      "Toksik davranış, oyunun en büyük keyif kaçıranıdır. Sağlıklı bir topluluk ise herkesin deneyimini iyileştirir.",
      "## Şeffaf itibar",
      "GameMate'te oyuncuların duvarına dürüst yorumlar bırakılır ve puan verilir. Böylece kiminle eşleşeceğini önceden değerlendirebilirsin.",
      "## Şikayet ve engelleme",
      "Argo veya küfür içeren yorumlar şikayet edilir; kurallara aykırı davrananların hesapları kısıtlanır. Bu da topluluğu temiz tutar.",
      "Saygılı, iletişime açık oyuncularla eşleşmek için profilini doğru doldur ve topluluk araçlarını kullan."
    ] },
];

function BlogView({ ads, onCTA }){
  const [open, setOpen] = useState(null);
  const renderBody = body => body.map((para,i)=> para.indexOf("## ")===0
    ? <h2 key={i} className="disp" style={{ fontSize:19, fontWeight:600, margin:"22px 0 8px" }}>{para.slice(3)}</h2>
    : <p key={i} className="muted" style={{ fontSize:15, lineHeight:1.7, marginBottom:14 }}>{para}</p>);
  if (open){ const post=BLOG_POSTS.find(b=>b.id===open); const rel=(post.related||[]).map(id=>BLOG_POSTS.find(b=>b.id===id)).filter(Boolean); return (
    <div style={{ maxWidth:760 }}>
      <button className="btn btn-ghost btn-sm" onClick={()=>setOpen(null)} style={{ marginBottom:14 }}>← Tüm yazılar</button>
      <span className="chip" style={{ color:"var(--cyan)", borderColor:"rgba(34,211,238,.3)" }}>{post.cat}</span>
      <h1 className="disp" style={{ fontSize:30, fontWeight:700, margin:"12px 0 8px" }}>{post.title}</h1>
      <div className="mono muted2" style={{ fontSize:11.5, marginBottom:20 }}>{post.date} · {post.read} dk okuma</div>
      {renderBody(post.body)}
      <Hud accent style={{ marginTop:24 }}>
        <div className="flex" style={{ alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
          <div><div className="disp" style={{ fontWeight:600, fontSize:15 }}>Takım arkadaşını bul</div><div className="muted" style={{ fontSize:13 }}>Aynı oyunu oynayan, sana uygun oyuncularla eşleş.</div></div>
          <button className="btn btn-primary" onClick={onCTA}><Zap size={15}/> Ücretsiz Başla</button>
        </div>
      </Hud>
      {rel.length>0 && <div style={{ marginTop:26 }}>
        <h3 className="disp" style={{ fontSize:16, fontWeight:600, marginBottom:12 }}>İlgili yazılar</h3>
        <div style={{ display:"grid", gap:8 }}>
          {rel.map(r=>(
            <button key={r.id} className="msg-item" onClick={()=>{ setOpen(r.id); if(typeof window!=="undefined") window.scrollTo(0,0); }} style={{ justifyContent:"space-between" }}>
              <span style={{ minWidth:0 }}><b className="disp" style={{ fontSize:13.5 }}>{r.title}</b><div className="muted" style={{ fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.excerpt}</div></span>
              <ChevronRight size={16} style={{ color:"var(--muted)", flexShrink:0 }} />
            </button>
          ))}
        </div>
      </div>}
    </div>
  ); }
  return (
    <div>
      <span className="eyebrow">// BLOG</span>
      <h1 className="disp" style={{ fontSize:28, fontWeight:700, margin:"4px 0 6px" }}>Oyun & Takım Rehberleri</h1>
      <p className="muted" style={{ marginBottom:22, maxWidth:680 }}>Oyun arkadaşı bulma, duo/takım kurma, co-op oyunlar ve rank atlama üzerine güncel rehberler. Daha iyi eşleşmeler ve daha güçlü takımlar için.</p>
      <div className="grid-players">
        {BLOG_POSTS.map(b=>(
          <Hud key={b.id} hover>
            <div style={{ cursor:"pointer" }} onClick={()=>{ setOpen(b.id); if(typeof window!=="undefined") window.scrollTo(0,0); }}>
              <span className="chip" style={{ fontSize:10.5, color:"var(--cyan)", borderColor:"rgba(34,211,238,.3)" }}>{b.cat}</span>
              <h3 className="disp" style={{ fontSize:17, fontWeight:600, margin:"10px 0 6px" }}>{b.title}</h3>
              <p className="muted" style={{ fontSize:13 }}>{b.excerpt}</p>
              <div className="mono muted2" style={{ fontSize:10.5, marginTop:10 }}>{b.date} · {b.read} dk</div>
            </div>
          </Hud>
        ))}
      </div>
    </div>
  );
}

/* Çoklu seçim dropdown — tikle, birden fazla seç (satır-içi, portal yok) */
function MultiSelect({ options, value=[], onChange, placeholder="Seç", labelOf, disabled }){
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const lbl = labelOf || (x=>x);
  const toggle = v => onChange(value.includes(v) ? value.filter(x=>x!==v) : [...value, v]);
  useEffect(()=>{
    if(!open) return;
    const close = e => { if(ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return ()=> document.removeEventListener("mousedown", close);
  },[open]);
  return (
    <div ref={ref} style={{ position:"relative" }}>
      <button type="button" className="input" disabled={disabled} onClick={()=>setOpen(o=>!o)}
        style={{ textAlign:"left", display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, cursor:disabled?"not-allowed":"pointer" }}>
        <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color: value.length?"var(--text)":"var(--muted-2)" }}>
          {value.length ? value.map(v=>lbl(v)).join(", ") : placeholder}
        </span>
        <ChevronRight size={14} style={{ transform: open?"rotate(-90deg)":"rotate(90deg)", color:"var(--muted)", flexShrink:0, transition:"transform .15s" }} />
      </button>
      {open && !disabled && (
        <div style={{ position:"absolute", top:"calc(100% + 5px)", left:0, right:0, zIndex:200, background:"var(--panel)", border:"1px solid var(--line)", maxHeight:240, overflowY:"auto", boxShadow:"0 16px 48px rgba(0,0,0,.6)" }}>
          {options.length===0 && <div style={{ fontSize:12.5, padding:"10px 12px", color:"var(--muted-2)" }}>Seçenek yok</div>}
          {options.map(o=>{ const on=value.includes(o); return (
            <button key={o} type="button" onClick={()=>toggle(o)}
              style={{ width:"100%", textAlign:"left", display:"flex", alignItems:"center", gap:9, padding:"9px 12px",
                background: on?"rgba(124,58,237,.18)":"var(--panel)", border:"none", borderBottom:"1px solid var(--line-soft)", cursor:"pointer", color:"var(--text)" }}>
              <span style={{ width:16, height:16, minWidth:16, border:"1px solid", borderColor:on?"var(--cyan)":"var(--muted-2)", background:on?"var(--cyan)":"transparent", display:"grid", placeItems:"center" }}>
                {on && <Check size={12} style={{ color:"#0b0d16" }} />}
              </span>
              <span style={{ fontSize:13.5 }}>{lbl(o)}</span>
            </button>
          ); })}
        </div>
      )}
    </div>
  );
}

/* Gaming doğum tarihi seçici — native takvim yerine 3 şık seçim */
function DobPicker({ value, onChange }){
  const p=(value||"").split("-");
  const [d,setD]=useState(p[2]?String(Number(p[2])):"");
  const [m,setM]=useState(p[1]?String(Number(p[1])):"");
  const [y,setY]=useState(p[0]||"");
  const MONTHS=["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
  const now=new Date().getFullYear(); const years=[]; for(let yr=now-13; yr>=now-80; yr--) years.push(yr);
  const days=[]; for(let i=1;i<=31;i++) days.push(i);
  const upd=(nd,nm,ny)=>{ setD(nd); setM(nm); setY(ny); onChange((nd&&nm&&ny)?`${ny}-${String(nm).padStart(2,"0")}-${String(nd).padStart(2,"0")}`:""); };
  return (
    <div className="flex" style={{ gap:8 }}>
      <select className="input" value={d} onChange={e=>upd(e.target.value,m,y)}><option value="" disabled>Gün</option>{days.map(x=><option key={x} value={x}>{x}</option>)}</select>
      <select className="input" value={m} onChange={e=>upd(d,e.target.value,y)}><option value="" disabled>Ay</option>{MONTHS.map((mn,i)=><option key={i} value={i+1}>{mn}</option>)}</select>
      <select className="input" value={y} onChange={e=>upd(d,m,e.target.value)}><option value="" disabled>Yıl</option>{years.map(x=><option key={x} value={x}>{x}</option>)}</select>
    </div>
  );
}

/* Platform (cihaz) seçici — PC / PS5 */
function DeviceToggle({ value=[], onChange, single }){
  const DEV=[{k:"PC",ic:"🖥️"},{k:"PS5",ic:"🎮"}];
  const toggle=k=> single ? onChange(value.includes(k)?[]:[k]) : onChange(value.includes(k)?value.filter(x=>x!==k):[...value,k]);
  return (
    <div className="flex" style={{ gap:10, flexWrap:"wrap" }}>
      {DEV.map(dv=>{ const on=value.includes(dv.k); return (
        <button key={dv.k} type="button" onClick={()=>toggle(dv.k)}
          style={{ flex:1, minWidth:130, display:"flex", alignItems:"center", justifyContent:"center", gap:9, padding:"13px 18px",
            border:"1px solid", borderColor:on?"var(--cyan)":"var(--line)", background:on?"rgba(34,211,238,.12)":"var(--panel-2)",
            color:on?"var(--cyan)":"var(--muted)", clipPath:"var(--notch-sm)", fontWeight:700, fontSize:14.5, cursor:"pointer" }}>
          <span style={{ fontSize:19 }}>{dv.ic}</span> {dv.k} {on && <Check size={15} />}
        </button>
      ); })}
    </div>
  );
}

function Footer({ text, onNav }){
  const FL = ({ p, children }) => (
    <button type="button" onClick={()=>onNav&&onNav(p)} className="mono muted2 foot-link"
      style={{ background:"none", border:"none", cursor:"pointer", padding:0, fontSize:11.5 }}>{children}</button>
  );
  return (
    <footer style={{ borderTop:"1px solid var(--line-soft)", marginTop:46, padding:"30px 0 34px", textAlign:"center" }}>
      <div className="flex" style={{ justifyContent:"center", marginBottom:12 }}><Logo size={30} /></div>
      <div className="flex" style={{ justifyContent:"center", gap:18, flexWrap:"wrap", marginBottom:14 }}>
        <FL p="about">Hakkında</FL>
        <FL p="privacy">Gizlilik</FL>
        <FL p="contact">İletişim</FL>
        <FL p="rules">Kurallar</FL>
      </div>
      <p className="mono muted2" style={{ fontSize:11.5, letterSpacing:".04em" }}>{text}</p>
    </footer>
  );
}

function Shell({ children }){ return <div className="gm-root"><style>{css}</style>{children}</div>; }

/* ============================== DISCOVER (player finder) ============================== */
function Discover({ user, outgoing, friends, onInvite, onView, simulateMatch, query="", banned=[], ads, players=[], excludeId=null }){
  const [fDevices, setFDevices] = useState([]);
  const [fGames, setFGames] = useState([]);
  const [fRoles, setFRoles] = useState([]);
  const [fTags, setFTags] = useState([]);
  const [fTimes, setFTimes] = useState([]);
  const [onlyOnline, setOnlyOnline] = useState(false);

  const roleOpts = useMemo(()=>{ const src = fGames.length ? GAMES.filter(g=>fGames.includes(g.id)) : GAMES; return [...new Set(src.flatMap(g=>g.roles))]; }, [fGames]);
  useEffect(()=>{ if(fDevices.length) setFGames(gs => gs.filter(id => gameOnDevices(id, fDevices))); }, [fDevices]);

  const results = useMemo(() => {
    return players.map(p => {
      if (banned.includes(p.id)) return null;
      if (excludeId!=null && p.id===excludeId) return null;
      const pdev = p.devices || ["PC"];
      if (fDevices.length && !fDevices.some(d=>pdev.includes(d))) return null;
      let entry;
      if (fGames.length) { entry = p.games.find(x=>fGames.includes(x.g)); if(!entry) return null; }
      else entry = p.games[0];
      if (fRoles.length && !p.games.some(x=>fRoles.includes(x.role))) return null;
      if (fTags.length && !fTags.some(t=>p.tags.includes(t))) return null;
      if (fTimes.length && !fTimes.some(h=>p.times.includes(h))) return null;
      if (onlyOnline && !p.online) return null;
      if (query) { const hay=(p.name+" "+p.games.map(x=>{const gg=gameById(x.g);return gg?gg.name:"";}).join(" ")+" "+p.tags.map(t=>{const tt=tagById(t);return tt?tt.label:"";}).join(" ")).toLowerCase(); if(!hay.includes(query.toLowerCase())) return null; }
      return { p, entry };
    }).filter(Boolean);
  }, [players,excludeId,fDevices,fGames,fRoles,fTags,fTimes,onlyOnline,query,banned]);

  return (
    <div>
      <div className="flex" style={{ justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:12, marginBottom:18 }}>
        <div>
          <span className="eyebrow">// EŞLEŞME</span>
          <h1 className="disp" style={{ fontSize:28, fontWeight:700, marginTop:4 }}>Takım arkadaşı bul</h1>
          <p className="muted" style={{ fontSize:14 }}>Senin seviyene ve oyun tarzına uygun oyuncular.</p>
        </div>
        <span className="chip" style={{ color:"var(--cyan)", borderColor:"rgba(34,211,238,.3)", padding:"7px 12px" }}>
          <Filter size={13} /> {results.length} oyuncu bulundu
        </span>
      </div>

      {/* filters */}
      <Hud className="noclip" style={{ marginBottom:20 }}>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:12.5, color:"var(--muted)", display:"block", marginBottom:8 }}>1. Önce platform seç — PC / PS5</label>
          <DeviceToggle value={fDevices} onChange={setFDevices} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12, alignItems:"end" }}>
          <div className="field"><label>Oyun (çoklu — tikle)</label>
            <MultiSelect options={GAMES.filter(g=>gameOnDevices(g.id, fDevices)).map(g=>g.id)} value={fGames} onChange={setFGames} placeholder="Tüm oyunlar" labelOf={id=>{const g=gameById(id);return g?g.name:id;}} /></div>
          <div className="field"><label>Rol (çoklu — tikle)</label>
            <MultiSelect options={roleOpts} value={fRoles} onChange={setFRoles} placeholder="Tüm roller" /></div>
          <div className="field"><label>Etiket (çoklu — tikle)</label>
            <MultiSelect options={TAGS.map(t=>t.id)} value={fTags} onChange={setFTags} placeholder="Tüm tarzlar" labelOf={id=>{const t=tagById(id);return t?t.label:id;}} /></div>
        </div>
        <div style={{ marginTop:16 }}>
          <label style={{ fontSize:12.5, color:"var(--muted)", display:"block", marginBottom:8 }}>Oyun Saati Aralığı (TSİ) — istediğin aralığı seç</label>
          <HoursPicker value={fTimes} onChange={setFTimes} />
        </div>
        <label className="checkrow" style={{ marginTop:14 }}>
          <input type="checkbox" checked={onlyOnline} onChange={e=>setOnlyOnline(e.target.checked)} />
          <span className="online-dot" /> Sadece online oyuncular
        </label>
      </Hud>

      {ads && <AdSlot ads={ads} slot="discoverTop" format="leaderboard" style={{ marginBottom:18 }} />}

      {results.length===0 ? (
        <Hud><div style={{ textAlign:"center", padding:"36px 10px" }}>
          <Search size={30} style={{ color:"var(--muted-2)", marginBottom:12 }} />
          <div className="disp" style={{ fontSize:18, fontWeight:600 }}>Bu filtrelerle oyuncu yok</div>
          <p className="muted" style={{ marginTop:6 }}>Rank veya rol filtresini gevşetmeyi dene.</p>
        </div></Hud>
      ) : (
        <div className="grid-players">
          {results.flatMap(({p,entry}, idx) => {
            const card = (
              <PlayerCard key={p.id} p={p} entry={entry}
                state={friends.includes(p.id)?"friend":outgoing.has(p.id)?"sent":"idle"}
                onInvite={()=>onInvite(p.id)}
                onView={()=>onView(p.id)} />
            );
            return (ads && (idx+1)%6===0 && idx<results.length-1)
              ? [card, <GridAd key={"ad"+idx} ads={ads} seed={"d"+idx} />]
              : [card];
          })}
        </div>
      )}
    </div>
  );
}

function PlayerCard({ p, entry, state, onInvite, onView }){
  const g = gameById(entry.g);
  return (
    <Hud hover={false} className="" pad={false}>
      <div className="pcard-head">
        <Avatar name={p.name} size={50} online={p.online} ring />
        <div style={{ flex:1, minWidth:0 }}>
          <div className="flex" style={{ alignItems:"center", gap:7 }}>
            <span className="disp" style={{ fontWeight:600, fontSize:16, cursor:"pointer" }} onClick={onView}>{p.name}</span>
            <span style={{ fontSize:14 }}>{p.country}</span>
          </div>
          <div className="flex" style={{ alignItems:"center", gap:6, marginTop:3 }}>
            <span className={`online-dot ${p.online?"":"off"}`} style={{ width:7, height:7 }} />
            <span className="mono muted2" style={{ fontSize:11 }}>{p.online?"ONLINE":"OFFLINE"}</span>
            <span className="muted2" style={{ fontSize:11 }}>•</span>
            <Star size={11} style={{ color:"var(--gold)" }} />
            <span className="mono" style={{ fontSize:11, color:"var(--gold)" }}>{p.rating.toFixed(1)}</span>
            {p.age && <><span className="muted2" style={{ fontSize:11 }}>•</span><span className="mono muted2" style={{ fontSize:11 }}>{p.age} yaş</span></>}
          </div>
        </div>
      </div>

      <div style={{ padding:"0 16px 12px" }}>
        <div className="gamechip" style={{ marginBottom:11 }}>
          <GameIcon gameId={g.id} size={26} />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:600 }}>{g.name}</div>
            <div className="mono muted2" style={{ fontSize:10.5 }}>{entry.role} • {entry.ps}</div>
          </div>
          <RankBadge gameId={g.id} rank={entry.rank} sm />
        </div>

        <div className="flex" style={{ gap:6, flexWrap:"wrap", marginBottom:10 }}>
          {p.tags.slice(0,3).map(t=><TagPill key={t} id={t} sm />)}
        </div>
        <div className="flex" style={{ gap:6, alignItems:"center", marginBottom:12 }}>
          <Clock size={12} style={{ color:"var(--muted)" }} />
          {p.times.slice(0,4).map(tid => {
            const t = TIMES.find(x=>x.id===tid);
            return <span key={tid} className="mono muted2" style={{ fontSize:10.5 }}>{t.label}</span>;
          }).reduce((acc,el,i)=> i===0?[el]:[...acc,<span key={"d"+i} className="muted2" style={{fontSize:10}}>/</span>,el],[])}
        </div>

        {state==="friend" ? (
          <button className="btn btn-block btn-sm" style={{ background:"rgba(52,211,153,.12)", color:"var(--volt)", border:"1px solid rgba(52,211,153,.35)" }} onClick={onView}>
            <Check size={15} /> Arkadaşsınız — Profili Gör
          </button>
        ) : state==="sent" ? (
          <button className="btn btn-block btn-sm" disabled><Send size={14} /> Davet Gönderildi</button>
        ) : (
          <button className="btn btn-primary btn-block btn-sm" onClick={onInvite}>
            <Send size={14} /> Birlikte Oyna Daveti
          </button>
        )}
      </div>
    </Hud>
  );
}

/* ============================== INVITES ============================== */
function Invites({ incoming, outgoing, onAccept, onDecline, onView, ads, players=[] }){
  const out = [...outgoing];
  return (
    <div>
      <span className="eyebrow">// DAVETLER</span>
      <h1 className="disp" style={{ fontSize:28, fontWeight:700, margin:"4px 0 22px" }}>Davetlerin</h1>

      <div style={{ marginBottom:14 }} className="flex">
        <span className="chip" style={{ color:"var(--violet-hi)", borderColor:"rgba(139,92,246,.3)" }}>
          GELEN • {incoming.length}
        </span>
      </div>
      {incoming.length===0 ? <EmptyBlock icon={Bell} title="Gelen davet yok" text="Profilini güçlendir, oyuncular seni davet etsin." />
      : <div style={{ display:"grid", gap:12, marginBottom:30 }}>
          {incoming.map(pid => {
            const p = players.find(x=>x.id===pid); if(!p) return null; const e = p.games[0]; const g = gameById(e.g);
            return (
              <Hud key={pid}>
                <div className="flex" style={{ alignItems:"center", gap:14, flexWrap:"wrap" }}>
                  <Avatar name={p.name} size={48} online={p.online} ring />
                  <div style={{ flex:1, minWidth:180 }}>
                    <div style={{ fontSize:14.5 }}>
                      <b className="disp" style={{ cursor:"pointer" }} onClick={()=>onView(pid)}>{p.name}</b>
                      <span className="muted"> seni </span>
                      <b style={{ color:g.color }}>{g.name}</b>
                      <span className="muted"> oynamaya davet etti.</span>
                    </div>
                    <div className="flex" style={{ gap:8, marginTop:8, alignItems:"center", flexWrap:"wrap" }}>
                      <RankBadge gameId={g.id} rank={e.rank} sm />
                      <span className="chip" style={{ fontSize:10.5 }}>{e.role}</span>
                      {p.age && <span className="chip" style={{ fontSize:10.5 }}>{p.age} yaş</span>}
                      {p.tags.slice(0,2).map(t=><TagPill key={t} id={t} sm />)}
                    </div>
                  </div>
                  <div className="flex" style={{ gap:8 }}>
                    <button className="btn btn-volt btn-sm" onClick={()=>onAccept(pid)}><Check size={15} /> Kabul</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>onDecline(pid)}><X size={15} /> Reddet</button>
                  </div>
                </div>
              </Hud>
            );
          })}
        </div>}

      {ads && <AdSlot ads={ads} slot="invitesMid" format="horizontal" style={{ marginBottom:20 }} />}
      <div style={{ marginBottom:14 }} className="flex">
        <span className="chip" style={{ color:"var(--cyan)", borderColor:"rgba(34,211,238,.3)" }}>GÖNDERİLEN • {out.length}</span>
      </div>
      {out.length===0 ? <EmptyBlock icon={Send} title="Gönderilmiş davet yok" text="Oyuncu Bul sayfasından davet gönder." />
      : <div style={{ display:"grid", gap:10 }}>
          {out.map(pid => {
            const p = players.find(x=>x.id===pid); if(!p) return null; const e = p.games[0]; const g = gameById(e.g);
            return (
              <Hud key={pid}>
                <div className="flex" style={{ alignItems:"center", gap:12 }}>
                  <Avatar name={p.name} size={40} online={p.online} />
                  <div style={{ flex:1 }}>
                    <b className="disp" style={{ fontSize:14 }}>{p.name}</b>
                    <span className="muted" style={{ fontSize:13 }}> • {g.name}</span>
                  </div>
                  <span className="chip" style={{ color:"var(--cyan)", borderColor:"rgba(34,211,238,.3)" }}>
                    <span className="ic" style={{ width:6,height:6,borderRadius:"50%",background:"var(--cyan)",animation:"pulse 2s infinite" }} /> Bekleniyor
                  </span>
                </div>
              </Hud>
            );
          })}
        </div>}
    </div>
  );
}

/* ============================== FRIENDS ============================== */
function Friends({ friends, onChat, onView, ads, players=[] }){
  return (
    <div>
      <span className="eyebrow">// AĞIN</span>
      <h1 className="disp" style={{ fontSize:28, fontWeight:700, margin:"4px 0 6px" }}>Arkadaşların</h1>
      <p className="muted" style={{ marginBottom:22, fontSize:14 }}>Eşleştiğin oyuncular. İletişim bilgileri açık — Discord/Steam&apos;den ekle.</p>
      {ads && <AdSlot ads={ads} slot="friendsTop" format="leaderboard" style={{ marginBottom:20 }} />}

      {friends.length===0 ? <EmptyBlock icon={Users} title="Henüz arkadaşın yok" text="Davet gönder, kabul edilince burada görünürler." />
      : <div className="grid-players">
          {friends.map(pid => {
            const p = players.find(x=>x.id===pid); if(!p) return null; const e = p.games[0]; const g = gameById(e.g);
            return (
              <Hud key={pid} pad={false}>
                <div className="pcard-head">
                  <Avatar name={p.name} size={48} online={p.online} ring />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div className="flex" style={{ gap:7, alignItems:"center" }}>
                      <b className="disp" style={{ fontSize:15.5, cursor:"pointer" }} onClick={()=>onView(pid)}>{p.name}</b>
                      <span>{p.country}</span>
                    </div>
                    <div className="flex" style={{ gap:6, alignItems:"center", marginTop:3 }}>
                      <span className={`online-dot ${p.online?"":"off"}`} style={{ width:7,height:7 }} />
                      <span className="mono muted2" style={{ fontSize:11 }}>{p.online?"ÇEVRİMİÇİ":"ÇEVRİMDIŞI"}</span>
                    </div>
                  </div>
                </div>
                <div style={{ padding:"0 16px 14px" }}>
                  <div style={{ display:"grid", gap:7, background:"var(--panel-2)", border:"1px solid var(--line)", clipPath:"var(--notch-sm)", padding:"11px 12px", marginBottom:11 }}>
                    <div className="mono" style={{ fontSize:10, letterSpacing:".14em", color:"var(--volt)" }}>// İLETİŞİM AÇIK</div>
                    {CONTACT_FIELDS.filter(f=>p.socials?.[f.id]).map(f=>(
                      <div className="kv" key={f.id}>
                        <span className="k" style={{ color:f.color }}>{f.label}</span>
                        <span className="mono" style={{ fontSize:12, wordBreak:"break-all" }}>{p.socials[f.id]}</span>
                      </div>
                    ))}
                    {!CONTACT_FIELDS.some(f=>p.socials?.[f.id]) && <span className="muted" style={{ fontSize:12 }}>İletişim bilgisi eklenmemiş</span>}
                  </div>
                  <button className="btn btn-primary btn-block btn-sm" onClick={()=>onChat(pid)}>
                    <MessageSquare size={14} /> Mesaj Gönder
                  </button>
                </div>
              </Hud>
            );
          })}
        </div>}
    </div>
  );
}

/* ============================== PROFILE ============================== */
function Profile({ user, setUser, push, ads }){
  const [edit, setEdit] = useState(false);
  const [bio, setBio] = useState(user.bio);
  const save = () => { setUser(u=>({...u,bio})); setEdit(false); push("Profil güncellendi","ok"); };
  return (
    <div>
      <span className="eyebrow">// PROFİLİN</span>
      <h1 className="disp" style={{ fontSize:28, fontWeight:700, margin:"4px 0 22px" }}>Profil</h1>

      <Hud accent style={{ marginBottom:18 }}>
        <div className="flex" style={{ gap:18, alignItems:"flex-start", flexWrap:"wrap" }}>
          <Avatar name={user.name} size={84} online ring />
          <div style={{ flex:1, minWidth:220 }}>
            <div className="flex" style={{ alignItems:"center", gap:10, flexWrap:"wrap" }}>
              <h2 className="disp" style={{ fontSize:26, fontWeight:700 }}>{user.name}</h2>
              <span style={{ fontSize:18 }}>{user.country}</span>
              <span className="chip" style={{ color:"var(--volt)", borderColor:"rgba(52,211,153,.3)" }}><span className="online-dot"/> ONLINE</span>
            </div>
            {edit ? (
              <div style={{ marginTop:10 }}>
                <textarea className="input" rows={2} value={bio} onChange={e=>setBio(e.target.value)} />
                <div className="flex" style={{ gap:8, marginTop:8 }}>
                  <button className="btn btn-volt btn-sm" onClick={save}><Check size={14}/> Kaydet</button>
                  <button className="btn btn-ghost btn-sm" onClick={()=>{setBio(user.bio);setEdit(false);}}>İptal</button>
                </div>
              </div>
            ) : (
              <>
                <p className="muted" style={{ marginTop:9, maxWidth:520, lineHeight:1.55 }}>{user.bio}</p>
                <div className="flex" style={{ gap:7, marginTop:12, flexWrap:"wrap" }}>
                  {user.tags.map(t=><TagPill key={t} id={t} />)}
                </div>
              </>
            )}
          </div>
          {!edit && <button className="btn btn-ghost btn-sm" onClick={()=>setEdit(true)}>Düzenle</button>}
        </div>
      </Hud>

      <div className="flex" style={{ alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <span className="eyebrow">// OYUN KARTLARI</span>
      </div>
      <div className="grid-players" style={{ marginBottom:22 }}>
        {user.games.map((e,i) => {
          const g = gameById(e.g);
          return (
            <Hud key={i}>
              <div className="flex" style={{ alignItems:"center", gap:11, marginBottom:13 }}>
                <GameIcon gameId={g.id} size={36} />
                <div style={{ flex:1 }}>
                  <div className="disp" style={{ fontWeight:600, fontSize:15 }}>{g.name}</div>
                  <div className="mono muted2" style={{ fontSize:10.5 }}>{e.ps}</div>
                </div>
              </div>
              <div style={{ display:"grid", gap:8 }}>
                <div className="kv"><span className="k">Rank</span><RankBadge gameId={g.id} rank={e.rank} sm /></div>
                <div className="divider" />
                <div className="kv"><span className="k">Main / Rol</span><span style={{ fontWeight:600 }}>{e.role}</span></div>
              </div>
            </Hud>
          );
        })}
      </div>

      {ads && <AdSlot ads={ads} slot="profilePage" format="horizontal" style={{ marginBottom:18 }} />}
      <span className="eyebrow">// İLETİŞİM BİLGİLERİM</span>
      <Hud style={{ marginTop:12 }}>
        <p className="muted" style={{ fontSize:13, marginBottom:14 }}>
          <Lock size={12} style={{ verticalAlign:"-1px" }} /> Yalnızca eşleştiğin oyuncular görür. Düzenlemek için <b style={{ color:"var(--text)" }}>Ayarlar</b> sayfasına git.
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:12 }}>
          {CONTACT_FIELDS.map(f => (
            <div key={f.id} className="kv" style={{ background:"var(--panel-2)", border:"1px solid var(--line)", clipPath:"var(--notch-sm)", padding:"10px 12px" }}>
              <span className="k" style={{ color:f.color }}>{f.label}</span>
              <span className="mono" style={{ fontSize:11.5, color: user.socials[f.id]?"var(--text)":"var(--muted-2)", wordBreak:"break-all" }}>
                {user.socials[f.id] || "— boş —"}
              </span>
            </div>
          ))}
        </div>
      </Hud>
    </div>
  );
}

/* ============================== MY GAMES ============================== */
function MyGames({ user, setUser, push, ads }){
  const [adding, setAdding] = useState(false);
  const owned = new Set(user.games.map(x=>x.g));
  const addGame = (gid) => {
    const g = gameById(gid);
    setUser(u=>({ ...u, games:[...u.games, { g:gid, rank:g.ranks[0], role:g.roles[0], roles:[g.roles[0]], ps:"Günlük" }] }));
    setAdding(false); push(`${g.name} eklendi`, "ok");
  };
  const removeGame = (gid) => { setUser(u=>({...u, games:u.games.filter(x=>x.g!==gid)})); push("Oyun kaldırıldı","info"); };
  const updateGame = (gid, k, v) => setUser(u=>({ ...u, games:u.games.map(x=>{ if(x.g!==gid) return x; const nx={...x,[k]:v}; if(k==="roles") nx.role=(v||[]).join(", "); return nx; }) }));

  return (
    <div>
      <div className="flex" style={{ justifyContent:"space-between", alignItems:"center", marginBottom:22, flexWrap:"wrap", gap:12 }}>
        <div><span className="eyebrow">// KÜTÜPHANE</span>
          <h1 className="disp" style={{ fontSize:28, fontWeight:700, marginTop:4 }}>Oyunlarım</h1></div>
        <button className="btn btn-primary btn-sm" onClick={()=>setAdding(true)}><Plus size={15} /> Oyun Ekle</button>
      </div>

      {ads && <AdSlot ads={ads} slot="gamesTop" format="horizontal" style={{ marginBottom:18 }} />}
      <div style={{ display:"grid", gap:14 }}>
        {user.games.map(e => {
          const g = gameById(e.g);
          return (
            <Hud className="noclip" key={e.g}>
              <div className="flex" style={{ alignItems:"center", gap:12, marginBottom:14, flexWrap:"wrap" }}>
                <GameIcon gameId={g.id} size={34} />
                <div className="disp" style={{ fontWeight:600, fontSize:16, flex:1 }}>{g.name}</div>
                {user.games.length>1 && <button className="btn btn-danger btn-sm" onClick={()=>removeGame(g.id)}><X size={14} /></button>}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12 }}>
                <div className="field"><label>Rank</label>
                  <select className="input" value={e.rank} onChange={ev=>updateGame(g.id,"rank",ev.target.value)}>
                    {g.ranks.map(r=><option key={r}>{r}</option>)}
                  </select></div>
                <div className="field"><label>Rol (çoklu — tikle)</label>
                  <MultiSelect options={g.roles} value={e.roles||(e.role?e.role.split(", "):[])} onChange={arr=>updateGame(g.id,"roles",arr)} placeholder="Rol seç" /></div>
                <div className="field"><label>Mod</label>
                  <select className="input" value={e.ps} onChange={ev=>updateGame(g.id,"ps",ev.target.value)}>
                    {["Rekabetçi","Günlük","İkisi de"].map(r=><option key={r}>{r}</option>)}
                  </select></div>
              </div>
            </Hud>
          );
        })}
      </div>

      {adding && (
        <div className="modal-bg" onClick={()=>setAdding(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <Hud ticks>
              <div className="flex" style={{ justifyContent:"space-between", marginBottom:16 }}>
                <h3 className="disp" style={{ fontSize:20, fontWeight:600 }}>Oyun Ekle</h3>
                <button className="btn btn-ghost btn-sm" onClick={()=>setAdding(false)}><X size={15} /></button>
              </div>
              <div className="grid-games">
                {GAMES.filter(g=>!owned.has(g.id)).map(g=>(
                  <GameTile key={g.id} g={g} sel={false} onClick={()=>addGame(g.id)} />
                ))}
              </div>
              {GAMES.filter(g=>!owned.has(g.id)).length===0 && <p className="muted" style={{ textAlign:"center", padding:20 }}>Tüm oyunlar zaten ekli.</p>}
            </Hud>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================== SETTINGS ============================== */
function SettingsView({ user, setUser, push, onLogout }){
  const [notif, setNotif] = useState(true);
  return (
    <div style={{ maxWidth:720 }}>
      <span className="eyebrow">// AYARLAR</span>
      <h1 className="disp" style={{ fontSize:28, fontWeight:700, margin:"4px 0 22px" }}>Ayarlar</h1>

      <Hud style={{ marginBottom:16 }}>
        <h3 className="disp" style={{ fontSize:17, fontWeight:600, marginBottom:14 }}>Tercihler</h3>
        <ToggleRow label="Davet bildirimleri" desc="Yeni davet geldiğinde haber ver" on={notif} onToggle={()=>setNotif(v=>!v)} />
        <div className="divider" style={{ margin:"12px 0" }} />
        <ToggleRow label="Çevrimiçi görünürlük" desc="Diğer oyuncular online olduğunu görsün" on={user.online!==false} onToggle={()=>setUser(u=>({ ...u, online: u.online===false }))} />
      </Hud>

      <Hud style={{ marginBottom:16 }}>
        <h3 className="disp" style={{ fontSize:17, fontWeight:600, marginBottom:6 }}>İletişim & Hesap Bilgileri</h3>
        <p className="muted" style={{ fontSize:13, marginBottom:14 }}>
          <Lock size={12} style={{ verticalAlign:"-1px" }} /> Bilgileri elle gir. Yalnızca <b style={{ color:"var(--text)" }}>eşleştiğin (arkadaş olduğun)</b> oyuncular görebilir — herkese açık değildir.
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:12 }}>
          {CONTACT_FIELDS.map(f=>(
            <div key={f.id} style={{ display:"grid", gap:5 }}>
              <span className="mono" style={{ fontSize:10, letterSpacing:".05em", color:f.color }}>{f.label}</span>
              <input className="input" placeholder={f.ph} value={user.socials[f.id]||""} onChange={e=>setUser(u=>({ ...u, socials:{ ...u.socials, [f.id]:e.target.value } }))} />
            </div>
          ))}
        </div>
      </Hud>

      <Hud>
        <h3 className="disp" style={{ fontSize:17, fontWeight:600, marginBottom:14 }}>Hesap</h3>
        <div className="kv" style={{ padding:"6px 0" }}><span className="k">Kullanıcı</span><span>{user.name}</span></div>
        <div className="divider" style={{ margin:"6px 0" }} />
        <div className="kv" style={{ padding:"6px 0" }}><span className="k">Email</span><span className="mono" style={{ fontSize:12 }}>{user.email||"—"}</span></div>

        <button className="btn btn-danger btn-block" style={{ marginTop:16 }} onClick={onLogout}><LogOut size={15}/> Çıkış Yap</button>
      </Hud>
    </div>
  );
}
function ToggleRow({ label, desc, on, onToggle }){
  return (
    <div className="flex" style={{ alignItems:"center", justifyContent:"space-between", gap:14 }}>
      <div><div style={{ fontSize:14, fontWeight:600 }}>{label}</div><div className="muted" style={{ fontSize:12.5 }}>{desc}</div></div>
      <button onClick={onToggle} aria-pressed={on} style={{ width:46, height:26, padding:3, border:"1px solid var(--line)", background: on?"linear-gradient(90deg,var(--violet),var(--cyan))":"var(--panel-2)", clipPath:"var(--notch-sm)", transition:"all .15s" }}>
        <span style={{ display:"block", width:18, height:18, background:"#fff", clipPath:"var(--notch-sm)", transform: on?"translateX(20px)":"translateX(0)", transition:"transform .15s" }} />
      </button>
    </div>
  );
}

function MessagesView({ conversations, friends, players, activeId, setActiveId, onSend }){
  const active = activeId!=null ? players.find(x=>x.id===activeId) : null;
  const [val,setVal]=useState("");
  const ref=useRef(null);
  useEffect(()=>{ if(ref.current) ref.current.scrollTop=ref.current.scrollHeight; },[activeId,conversations]);
  const send=()=>{ if(!val.trim()||activeId==null) return; onSend(activeId,val); setVal(""); };
  const lastOf=pid=>{ const m=conversations[pid]; return m&&m.length?m[m.length-1]:null; };
  return (
    <div>
      <span className="eyebrow">// SOHBETLER</span>
      <h1 className="disp" style={{ fontSize:28, fontWeight:700, margin:"4px 0 18px" }}>Mesajlar</h1>
      {friends.length===0 ? <EmptyBlock icon={MessageSquare} title="Henüz mesajın yok" text="Bir oyuncuyla eşleşince burada sohbet başlatabilirsin." />
      : <div className="msg-layout">
          <div className={`msg-list ${active?"hide-mob":""}`}>
            {friends.map(pid=>{ const p=players.find(x=>x.id===pid); if(!p) return null; const last=lastOf(pid); return (
              <button key={pid} className={`msg-item ${activeId===pid?"on":""}`} onClick={()=>setActiveId(pid)}>
                <Avatar name={p.name} size={42} online={p.online} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div className="flex" style={{ justifyContent:"space-between", gap:8 }}>
                    <b className="disp" style={{ fontSize:14 }}>{p.name}</b>
                    {last && <span className="mono muted2" style={{ fontSize:10 }}>{last.time}</span>}
                  </div>
                  <div className="muted" style={{ fontSize:12.5, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {last ? (last.me?"Sen: ":"")+last.t : "Sohbeti başlat"}
                  </div>
                </div>
              </button>
            ); })}
          </div>
          <div className={`msg-thread ${active?"":"hide-mob"}`}>
            {active ? (
              <Hud pad={false} className="noclip">
                <div className="flex" style={{ alignItems:"center", gap:11, padding:"12px 16px", borderBottom:"1px solid var(--line-soft)" }}>
                  <button className="btn btn-ghost btn-sm show-mob" onClick={()=>setActiveId(null)}><ChevronRight size={16} style={{ transform:"rotate(180deg)" }} /></button>
                  <Avatar name={active.name} size={38} online={active.online} />
                  <div style={{ flex:1 }}>
                    <div className="disp" style={{ fontWeight:600, fontSize:15 }}>{active.name}</div>
                    <div className="mono muted2" style={{ fontSize:10 }}>{active.online?"ÇEVRİMİÇİ":"ÇEVRİMDIŞI"}</div>
                  </div>
                </div>
                <div className="chat-msgs" ref={ref} style={{ height:"min(54vh,460px)" }}>
                  {(conversations[activeId]||[]).map((m,i)=><div key={i} className={`bubble ${m.me?"me":"them"}`}>{m.t}</div>)}
                  {(conversations[activeId]||[]).length===0 && <p className="muted" style={{ textAlign:"center", fontSize:13, marginTop:24 }}>İlk mesajı sen gönder 👋</p>}
                </div>
                <div className="flex" style={{ gap:8, padding:"12px 14px", borderTop:"1px solid var(--line-soft)" }}>
                  <input className="input" placeholder="Mesaj yaz..." value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter") send(); }} />
                  <button className="btn btn-primary" onClick={send}><Send size={15} /></button>
                </div>
              </Hud>
            ) : (
              <div className="msg-empty"><div><MessageSquare size={30} style={{ color:"var(--muted-2)" }} /><p className="muted" style={{ marginTop:10, fontSize:14 }}>Soldan bir sohbet seç</p></div></div>
            )}
          </div>
        </div>}
    </div>
  );
}

/* ============================== MODALS ============================== */
function PlayerModal({ pid, matched, invited, onInvite, onClose }){
  const p = PLAYERS.find(x=>x.id===pid);
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <Hud ticks>
          <div className="flex" style={{ justifyContent:"flex-end", marginBottom:6 }}>
            <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={15} /></button>
          </div>
          <div className="flex" style={{ gap:16, alignItems:"flex-start", flexWrap:"wrap" }}>
            <Avatar name={p.name} size={72} online={p.online} ring />
            <div style={{ flex:1, minWidth:200 }}>
              <div className="flex" style={{ gap:9, alignItems:"center", flexWrap:"wrap" }}>
                <h2 className="disp" style={{ fontSize:24, fontWeight:700 }}>{p.name}</h2>
                <span style={{ fontSize:18 }}>{p.country}</span>
                <span className="chip" style={{ color:p.online?"var(--volt)":"var(--muted)", borderColor: p.online?"rgba(52,211,153,.3)":"var(--line)" }}>
                  <span className={`online-dot ${p.online?"":"off"}`} /> {p.online?"ONLINE":"OFFLINE"}
                </span>
              </div>
              <p className="muted" style={{ marginTop:8, lineHeight:1.55 }}>{p.bio}</p>
              <div className="flex" style={{ gap:7, marginTop:11, flexWrap:"wrap" }}>{p.tags.map(t=><TagPill key={t} id={t} />)}</div>
            </div>
          </div>

          <div className="divider" style={{ margin:"18px 0" }} />
          <span className="eyebrow">// OYUNLAR</span>
          <div style={{ display:"grid", gap:10, marginTop:10, marginBottom:18 }}>
            {p.games.map((e,i)=>{
              const g = gameById(e.g);
              return (
                <div key={i} className="gamechip">
                  <GameIcon gameId={g.id} size={28} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:13.5 }}>{g.name}</div>
                    <div className="mono muted2" style={{ fontSize:10.5 }}>{e.role} • {e.ps}</div>
                  </div>
                  <RankBadge gameId={g.id} rank={e.rank} sm />
                </div>
              );
            })}
          </div>

          <span className="eyebrow">// İLETİŞİM</span>
          <div style={{ position:"relative", marginTop:10 }}>
            <div className={matched?"":"locked"} style={{ display:"grid", gap:8, background:"var(--panel-2)", border:"1px solid var(--line)", clipPath:"var(--notch-sm)", padding:"12px 14px" }}>
              {Object.entries(p.socials).map(([k,v])=>{
                const pl = PLATFORMS.find(x=>x.id===k);
                return <div className="kv" key={k}><span className="k" style={{color:pl?.color}}>{pl?.label||k}</span><span className="mono" style={{ fontSize:12 }}>{v}</span></div>;
              })}
            </div>
            {!matched && (
              <div style={{ position:"absolute", inset:0, display:"grid", placeItems:"center" }}>
                <span className="chip" style={{ background:"var(--panel-3)", color:"var(--muted)" }}><Lock size={13} /> Eşleşince açılır</span>
              </div>
            )}
          </div>

          <div style={{ marginTop:18 }}>
            {matched ? (
              <div className="btn btn-block" style={{ background:"rgba(52,211,153,.12)", color:"var(--volt)", border:"1px solid rgba(52,211,153,.35)" }}><Check size={16} /> Arkadaşsınız</div>
            ) : invited ? (
              <button className="btn btn-block" disabled><Send size={15} /> Davet Gönderildi</button>
            ) : (
              <button className="btn btn-primary btn-block" onClick={()=>{ onInvite(pid); onClose(); }}><Send size={15} /> Birlikte Oyna Daveti Gönder</button>
            )}
          </div>
        </Hud>
      </div>
    </div>
  );
}

function ChatModal({ pid, onClose, players=[] }){
  const p = players.find(x=>x.id===pid);
  const [msgs, setMsgs] = useState([
    { me:false, t:"selam! eşleştik 🎮 hangi oyunu oynayalım?" },
    { me:true,  t:"valorant takılalım mı? ranked?" },
    { me:false, t:"olur, mic açık. discord'da buluşalım" },
  ]);
  const [val, setVal] = useState("");
  const ref = useRef(null);
  useEffect(()=>{ if(ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [msgs]);
  const send = () => { if(!val.trim()) return; setMsgs(m=>[...m,{me:true,t:val.trim()}]); setVal(""); };
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" style={{ maxWidth:440 }} onClick={e=>e.stopPropagation()}>
        <Hud pad={false}>
          <div className="flex" style={{ alignItems:"center", gap:11, padding:"14px 16px", borderBottom:"1px solid var(--line-soft)" }}>
            <Avatar name={p.name} size={38} online={p.online} />
            <div style={{ flex:1 }}>
              <div className="disp" style={{ fontWeight:600, fontSize:15 }}>{p.name}</div>
              <div className="mono muted2" style={{ fontSize:10 }}>{p.online?"ÇEVRİMİÇİ":"ÇEVRİMDIŞI"}</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={15} /></button>
          </div>
          <div className="chat-msgs" ref={ref}>
            {msgs.map((m,i)=><div key={i} className={`bubble ${m.me?"me":"them"}`}>{m.t}</div>)}
          </div>
          <div className="flex" style={{ gap:8, padding:"12px 14px", borderTop:"1px solid var(--line-soft)" }}>
            <input className="input" placeholder="Mesaj yaz..." value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter") send(); }} />
            <button className="btn btn-primary" onClick={send}><Send size={15} /></button>
          </div>
        </Hud>
      </div>
    </div>
  );
}

function EmptyBlock({ icon:Icon, title, text }){
  return (
    <Hud><div style={{ textAlign:"center", padding:"36px 10px" }}>
      <Icon size={30} style={{ color:"var(--muted-2)", marginBottom:12 }} />
      <div className="disp" style={{ fontSize:18, fontWeight:600 }}>{title}</div>
      <p className="muted" style={{ marginTop:6 }}>{text}</p>
    </div></Hud>
  );
}

export default App;
