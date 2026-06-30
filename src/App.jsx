/**
 * IRIS — App.jsx v2.0
 * Architecture SOLID — voir README.md pour le détail des principes appliqués.
 */
import { useState } from "react";
import { useDocuments }        from "./hooks/useDocuments";
import { useCopyToClipboard }  from "./hooks/useCopyToClipboard";
import { useLogoSlot }         from "./hooks/useLogoSlot";
import { PdfParserService }    from "./services/PdfParserService";
import divisionsData           from "./data/divisions.json";

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --g-dk:#1A6B3C;--g-md:#2E9E5B;--g-lt:#E8F5EE;--g-xlt:#F0FAF4;
  --red:#CE1126;--yel:#F4A300;--yel-lt:#FFF8E7;
  --bg:#F7F9F8;--white:#FFFFFF;
  --txt:#1C2B22;--txt-md:#3A5445;--txt-lt:#6B8C7A;
  --bdr:#C8DDD2;--shd:0 2px 12px rgba(26,107,60,.10);--shd-lg:0 8px 32px rgba(26,107,60,.14);
  --r:10px;--r-lg:16px;--font:'Inter',-apple-system,sans-serif;--font-doc:'Times New Roman',Times,serif;
}
body{font-family:var(--font);background:var(--bg);color:var(--txt);}
.iris-app{min-height:100vh;display:flex;flex-direction:column;}
.hdr{background:var(--g-dk);color:#fff;position:sticky;top:0;z-index:100;box-shadow:0 2px 16px rgba(0,0,0,.18);}
.hdr-in{display:flex;align-items:center;padding:0 24px;height:64px;gap:16px;}
.logo-mk{width:40px;height:40px;background:linear-gradient(135deg,var(--yel),#FF9000);border-radius:10px;
  display:flex;align-items:center;justify-content:center;font-weight:800;font-size:17px;
  color:var(--g-dk);cursor:pointer;flex-shrink:0;letter-spacing:-1px;user-select:none;}
.hdr-titles{flex:1;}
.hdr-t{font-size:19px;font-weight:700;letter-spacing:.4px;}
.hdr-s{font-size:11px;opacity:.72;letter-spacing:.8px;text-transform:uppercase;}
.flag{display:flex;gap:3px;align-items:center;}
.flag span{width:7px;height:26px;border-radius:3px;}
.sg{background:var(--g-md)}.sr{background:var(--red)}.sy{background:var(--yel)}
.hero{background:linear-gradient(160deg,var(--g-dk) 0%,#0E4A28 100%);color:#fff;
  padding:48px 24px 56px;text-align:center;position:relative;overflow:hidden;}
.hero-badge{display:inline-flex;align-items:center;gap:8px;
  background:rgba(244,163,0,.18);border:1px solid rgba(244,163,0,.4);
  border-radius:20px;padding:5px 16px;font-size:12px;color:var(--yel);font-weight:600;margin-bottom:20px;}
.hero h1{font-size:clamp(26px,5vw,40px);font-weight:800;margin-bottom:12px;}
.hero h1 span{color:var(--yel);}
.hero p{font-size:15px;opacity:.82;max-width:520px;margin:0 auto;line-height:1.6;}
.hero-deco{position:absolute;right:-20px;top:-20px;width:200px;height:200px;
  border:40px solid rgba(255,255,255,.04);border-radius:50%;}
.home-body{padding:36px 20px;max-width:1100px;margin:0 auto;width:100%;}
.home-body h2{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;
  color:var(--txt-lt);margin-bottom:18px;}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:16px;}
.div-card{background:var(--white);border-radius:var(--r-lg);border:1.5px solid var(--bdr);
  padding:22px 18px;cursor:pointer;transition:all .2s;display:flex;flex-direction:column;
  gap:10px;position:relative;overflow:hidden;}
.div-card:hover{border-color:var(--g-md);box-shadow:var(--shd-lg);transform:translateY(-2px);}
.div-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--bdr);transition:background .2s;}
.div-card:hover::before{background:var(--g-md);}
.div-card.avail::before{background:var(--g-dk);}
.div-icon{width:42px;height:42px;border-radius:11px;background:var(--g-lt);
  display:flex;align-items:center;justify-content:center;font-size:19px;}
.div-code{font-size:10px;font-weight:700;color:var(--txt-lt);text-transform:uppercase;letter-spacing:1px;}
.div-nm{font-size:14px;font-weight:700;color:var(--txt);line-height:1.3;}
.div-desc{font-size:12.5px;color:var(--txt-lt);line-height:1.5;}
.div-action{margin-top:auto;font-size:12px;font-weight:600;color:var(--g-dk);}
.redac{display:grid;grid-template-columns:290px 1fr;flex:1;min-height:calc(100vh - 64px);}
@media(max-width:768px){.redac{grid-template-columns:1fr;}}
.sdb{background:var(--white);border-right:1.5px solid var(--bdr);
  display:flex;flex-direction:column;overflow-y:auto;max-height:calc(100vh - 64px);position:sticky;top:64px;}
.sdb-hdr{padding:16px 14px 10px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;gap:10px;}
.sdb-hdr button{background:none;border:none;cursor:pointer;color:var(--txt-lt);
  font-size:16px;padding:4px 6px;border-radius:6px;transition:background .15s;}
.sdb-hdr button:hover{background:var(--g-lt);color:var(--g-dk);}
.sdb-title{font-size:13px;font-weight:700;color:var(--txt);}
.sdb-sub{font-size:11px;color:var(--txt-lt);margin-top:1px;}
.type-list{padding:10px 6px;}
.type-btn{width:100%;padding:9px 10px;border:none;background:none;cursor:pointer;
  display:flex;align-items:center;gap:9px;border-radius:8px;font-size:13.5px;
  font-weight:500;color:var(--txt-md);transition:all .15s;text-align:left;}
.type-btn:hover{background:var(--g-lt);color:var(--g-dk);}
.type-btn.sel{background:var(--g-dk);color:#fff;}
.type-icon{font-size:17px;width:26px;text-align:center;}
.type-ct{margin-left:auto;font-size:11px;background:rgba(0,0,0,.08);border-radius:10px;padding:1px 7px;}
.type-btn.sel .type-ct{background:rgba(255,255,255,.2);}
.sub-list{padding:6px 6px 10px;border-top:1px solid var(--bdr);}
.sub-hdr{font-size:10px;font-weight:700;color:var(--txt-lt);text-transform:uppercase;letter-spacing:1.2px;padding:8px 10px 4px;}
.sub-btn{width:100%;padding:7px 10px;border:none;background:none;cursor:pointer;
  border-radius:7px;font-size:12.5px;font-weight:500;color:var(--txt-md);
  transition:all .15s;text-align:left;display:flex;align-items:center;gap:7px;}
.sub-btn::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--bdr);flex-shrink:0;transition:background .15s;}
.sub-btn:hover{background:var(--g-lt);color:var(--g-dk);}
.sub-btn:hover::before{background:var(--g-md);}
.sub-btn.sel{background:var(--g-xlt);color:var(--g-dk);font-weight:600;}
.sub-btn.sel::before{background:var(--g-dk);}
.sub-btn.upl{color:var(--g-dk);font-style:italic;}
.up-zone{margin:8px 8px 14px;border:2px dashed var(--bdr);border-radius:var(--r);
  padding:14px;text-align:center;cursor:pointer;transition:all .2s;background:var(--bg);}
.up-zone:hover{border-color:var(--g-md);background:var(--g-xlt);}
.up-ztxt{font-size:11.5px;color:var(--txt-lt);line-height:1.4;}
.up-ztxt strong{color:var(--g-dk);display:block;font-size:12.5px;margin-bottom:2px;}
.add-cat-btn{margin:0 8px 6px;width:calc(100% - 16px);padding:8px;border:1.5px dashed var(--bdr);
  border-radius:8px;background:none;cursor:pointer;font-size:12px;font-weight:600;
  color:var(--txt-lt);transition:all .15s;}
.add-cat-btn:hover{border-color:var(--yel);color:var(--g-dk);background:var(--yel-lt);}
.viewer{background:var(--bg);padding:20px;overflow-y:auto;display:flex;flex-direction:column;gap:14px;}
.toolbar{display:flex;align-items:center;gap:10px;background:var(--white);
  border-radius:var(--r);border:1.5px solid var(--bdr);padding:12px 14px;flex-wrap:wrap;}
.tb-info{flex:1;min-width:0;}
.tb-docname{font-size:14px;font-weight:700;color:var(--txt);}
.tb-meta{font-size:11px;color:var(--txt-lt);margin-top:2px;}
.tb-badge{padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background:var(--g-lt);color:var(--g-dk);}
.tb-badge.upl{background:var(--yel-lt);color:#7A5500;}
.copy-btn{display:flex;align-items:center;gap:6px;padding:8px 16px;border:none;
  border-radius:8px;font-size:12.5px;font-weight:600;cursor:pointer;
  background:var(--g-dk);color:#fff;transition:all .2s;}
.copy-btn:hover{background:var(--g-md);}
.copy-btn.ok{background:#0A7C44;}
.del-btn{padding:8px 12px;border:1.5px solid #FCA5A5;border-radius:8px;
  background:none;cursor:pointer;font-size:12px;font-weight:600;color:#DC2626;transition:all .15s;}
.del-btn:hover{background:#FEF2F2;}
.logo-slot{background:var(--white);border:1.5px solid var(--bdr);
  border-radius:var(--r);padding:14px 16px;display:flex;align-items:flex-start;gap:14px;}
.logo-slot-left{display:flex;flex-direction:column;align-items:center;gap:8px;min-width:100px;}
.logo-preview{width:96px;height:72px;border:1.5px dashed var(--bdr);border-radius:8px;
  display:flex;align-items:center;justify-content:center;overflow:hidden;
  background:var(--bg);cursor:pointer;transition:border-color .2s;}
.logo-preview:hover{border-color:var(--g-md);}
.logo-preview img{max-width:100%;max-height:100%;object-fit:contain;}
.logo-slot-info{flex:1;}
.logo-slot-title{font-size:13px;font-weight:700;color:var(--txt);margin-bottom:4px;}
.logo-slot-desc{font-size:12px;color:var(--txt-lt);line-height:1.5;margin-bottom:10px;}
.logo-btns{display:flex;gap:8px;flex-wrap:wrap;}
.lpick{padding:6px 14px;border:1.5px solid var(--g-md);border-radius:7px;
  background:none;cursor:pointer;font-size:12px;font-weight:600;color:var(--g-dk);transition:all .15s;}
.lpick:hover{background:var(--g-lt);}
.lclear{padding:6px 14px;border:1.5px solid var(--bdr);border-radius:7px;
  background:none;cursor:pointer;font-size:12px;font-weight:600;color:var(--txt-lt);}
.notes{background:var(--yel-lt);border:1.5px solid #F4C842;border-radius:var(--r);
  padding:11px 14px;display:flex;gap:9px;align-items:flex-start;}
.notes p{font-size:12.5px;color:#7A5500;line-height:1.5;}
.notes strong{color:#5A3D00;}
.prev-wrap{background:var(--white);border-radius:var(--r);border:1.5px solid var(--bdr);
  overflow:hidden;box-shadow:var(--shd);}
.prev-lbl{background:var(--g-xlt);border-bottom:1px solid var(--bdr);
  padding:7px 14px;font-size:10.5px;font-weight:600;color:var(--txt-lt);
  text-transform:uppercase;letter-spacing:1px;display:flex;align-items:center;gap:7px;}
.prev-lbl span{width:7px;height:7px;border-radius:50%;background:var(--g-md);}
.prev-body{display:flex;gap:0;}
.prev-logo-col{width:110px;flex-shrink:0;padding:20px 0 0 20px;}
.prev-logo-box{width:90px;height:70px;border:1.5px dashed var(--bdr);border-radius:6px;
  display:flex;align-items:center;justify-content:center;overflow:hidden;background:var(--bg);}
.prev-logo-box img{max-width:100%;max-height:100%;object-fit:contain;}
.prev-logo-empty{font-size:10.5px;color:var(--txt-lt);text-align:center;padding:5px;line-height:1.3;}
.prev-text{padding:28px 36px;font-family:var(--font-doc);font-size:13px;
  line-height:1.75;color:#1a1a1a;white-space:pre-wrap;flex:1;min-width:0;}
.prev-logo-top{display:flex;justify-content:center;padding:20px 0 4px;}
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:80px 20px;text-align:center;gap:12px;flex:1;}
.empty-icon{font-size:52px;opacity:.28;}
.empty h3{font-size:17px;font-weight:700;color:var(--txt-md);}
.empty p{font-size:13.5px;color:var(--txt-lt);max-width:320px;line-height:1.6;}
.empty-cats{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:10px;}
.cat-chip{padding:5px 14px;border-radius:20px;border:1.5px solid var(--bdr);
  background:var(--white);cursor:pointer;font-size:12.5px;font-weight:600;
  color:var(--txt-md);display:flex;align-items:center;gap:5px;transition:all .15s;}
.cat-chip:hover{border-color:var(--g-md);color:var(--g-dk);}
.wip{flex:1;display:flex;flex-direction:column;align-items:center;
  justify-content:center;padding:48px 24px;text-align:center;gap:14px;background:var(--bg);}
.wip-t{font-size:22px;font-weight:800;color:var(--txt);}
.wip-s{font-size:14px;color:var(--txt-lt);max-width:380px;line-height:1.6;}
.wip-badge{padding:5px 18px;background:var(--yel-lt);border:1.5px solid var(--yel);
  border-radius:20px;font-size:11.5px;font-weight:700;color:#7A5500;}
.back-btn{display:flex;align-items:center;gap:6px;padding:8px 16px;
  border:1.5px solid var(--bdr);border-radius:8px;background:var(--white);
  cursor:pointer;font-size:13px;font-weight:600;color:var(--txt-md);transition:all .15s;margin-top:6px;}
.back-btn:hover{border-color:var(--g-md);color:var(--g-dk);}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:200;
  display:flex;align-items:center;justify-content:center;padding:20px;}
.modal{background:var(--white);border-radius:var(--r-lg);padding:26px;
  max-width:440px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.25);max-height:90vh;overflow-y:auto;}
.modal h3{font-size:16px;font-weight:700;margin-bottom:5px;}
.modal > p{font-size:12.5px;color:var(--txt-lt);margin-bottom:14px;line-height:1.5;}
.modal label{display:block;font-size:11.5px;font-weight:600;color:var(--txt-md);margin-bottom:3px;margin-top:10px;}
.modal select,.modal input[type=text]{width:100%;padding:8px 10px;border-radius:6px;
  border:1.5px solid var(--bdr);font-size:12.5px;font-family:var(--font);color:var(--txt);outline:none;}
.modal select:focus,.modal input[type=text]:focus{border-color:var(--g-md);}
.modal-drop{border:2px dashed var(--bdr);border-radius:var(--r);padding:24px 16px;
  text-align:center;margin-bottom:4px;background:var(--bg);font-size:12.5px;
  color:var(--txt-lt);cursor:pointer;transition:all .2s;}
.modal-drop.drag{border-color:var(--g-dk);background:var(--g-xlt);}
.modal-actions{display:flex;gap:10px;margin-top:18px;}
.m-cancel{flex:1;padding:9px;border:1.5px solid var(--bdr);border-radius:8px;
  background:none;cursor:pointer;font-size:12.5px;font-weight:600;color:var(--txt-md);}
.m-confirm{flex:2;padding:9px;border:none;border-radius:8px;background:var(--g-dk);
  color:#fff;cursor:pointer;font-size:12.5px;font-weight:700;}
.m-confirm:disabled{opacity:.45;cursor:not-allowed;}
.toast{position:fixed;bottom:22px;right:22px;z-index:300;background:var(--g-dk);
  color:#fff;padding:11px 18px;border-radius:10px;font-size:13.5px;font-weight:600;
  box-shadow:0 4px 20px rgba(0,0,0,.2);display:flex;align-items:center;gap:8px;
  animation:slideUp .28s ease;}
.toast.err{background:#DC2626;}
@keyframes slideUp{from{transform:translateY(18px);opacity:0}to{transform:translateY(0);opacity:1}}
`;

function Toast({ message, type="success", onDone }) {
  setTimeout(onDone, 2800);
  return <div className={`toast${type==="error"?" err":""}`}>{type==="error"?"⚠️":"✅"} {message}</div>;
}

function LogoSlot({ doc, logoDataUrl, onOpen, onClear }) {
  if (!doc?.hasLogo) return null;
  return (
    <div className="logo-slot">
      <div className="logo-slot-left">
        <div className="logo-preview" onClick={onOpen}>
          {logoDataUrl ? <img src={logoDataUrl} alt="Logo"/> : <span style={{fontSize:28,opacity:.3}}>🏛️</span>}
        </div>
        <div className="logo-btns">
          <button className="lpick" onClick={onOpen}>{logoDataUrl?"Changer":"Ajouter"}</button>
          {logoDataUrl && <button className="lclear" onClick={onClear}>Retirer</button>}
        </div>
      </div>
      <div className="logo-slot-info">
        <div className="logo-slot-title">📌 Zone Logo — {doc.logoLabel}</div>
        <div className="logo-slot-desc">
          Ce modèle prévoit un emplacement logo à la position <strong>{doc.logoPosition}</strong>.<br/>
          Le logo apparaîtra dans l'aperçu tel qu'il sera sur le document imprimé.
          Formats acceptés : PNG, JPG, SVG.
        </div>
      </div>
    </div>
  );
}

function DocPreview({ doc, logoDataUrl }) {
  if (!doc) return null;
  if (doc.uploadedFile) {
    return (
      <div className="prev-wrap">
        <div className="prev-lbl"><span/> Document scanné — PDF original</div>
        <iframe src={doc.uploadedFile} style={{width:"100%",minHeight:600,border:"none"}} title={doc.label}/>
      </div>
    );
  }
  const logoBox = logoDataUrl
    ? <img src={logoDataUrl} alt="Logo"/>
    : <div className="prev-logo-empty">{doc.logoLabel||"Logo"}</div>;

  return (
    <div className="prev-wrap">
      <div className="prev-lbl"><span/> Aperçu — Format A4 officiel</div>
      {doc.hasLogo && doc.logoPosition==="top-center" && (
        <div className="prev-logo-top"><div className="prev-logo-box" style={{width:110,height:88}}>{logoBox}</div></div>
      )}
      <div className="prev-body">
        {doc.hasLogo && doc.logoPosition==="top-left" && (
          <div className="prev-logo-col"><div className="prev-logo-box">{logoBox}</div></div>
        )}
        <div className="prev-text">{doc.template}</div>
        {doc.hasLogo && doc.logoPosition==="top-right" && (
          <div className="prev-logo-col" style={{paddingLeft:0,paddingRight:20}}><div className="prev-logo-box">{logoBox}</div></div>
        )}
      </div>
    </div>
  );
}

function UploadModal({ categories, onClose, onSave }) {
  const [drag,setDrag]=useState(false);
  const [file,setFile]=useState(null);
  const [name,setName]=useState("");
  const [catId,setCatId]=useState(categories[0]?.id||"lettre");
  const [hasLogo,setHasLogo]=useState(false);
  const [logoPos,setLogoPos]=useState("top-left");
  const [logoLbl,setLogoLbl]=useState("Logo du service");
  const ref=useState(()=>({current:null}))[0];

  const drop=(e)=>{e.preventDefault();setDrag(false);const f=e.dataTransfer.files[0];if(f?.type==="application/pdf"){setFile(f);setName(f.name.replace(".pdf","").replace(/_/g," "));}};
  const save=async()=>{
    if(!file||!name.trim())return;
    const url=await PdfParserService.toDataUrl(file);
    const id=PdfParserService.generateId(catId,name);
    onSave({id,categoryId:catId,label:name,description:`Modèle importé — ${name}`,
      font:"Times New Roman",fontSize:"12pt",margins:"Selon document original",
      hasLogo,logoPosition:hasLogo?logoPos:null,logoLabel:hasLogo?logoLbl:null,
      notes:"Document scanné importé dans IRIS.",builtIn:false,uploadedFile:url,template:"(Voir aperçu PDF)"});
  };

  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <h3>📁 Importer un modèle PDF</h3>
        <p>Déposez un document officiel scanné. Il sera disponible pour toute l'équipe dans la catégorie choisie.</p>
        <div className={`modal-drop${drag?" drag":""}`}
          onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)}
          onDrop={drop} onClick={()=>ref.current?.click()}>
          {file?<><span style={{fontSize:24}}>📄</span><br/><strong>{file.name}</strong><br/><span style={{fontSize:11}}>{(file.size/1024).toFixed(0)} Ko</span></>
               :<><span style={{fontSize:24}}>☁️</span><br/>Glissez un PDF ou cliquez pour choisir</>}
          <input ref={el=>ref.current=el} type="file" accept=".pdf" style={{display:"none"}}
            onChange={e=>{const f=e.target.files[0];if(f){setFile(f);setName(f.name.replace(".pdf","").replace(/_/g," "));}}}/>
        </div>
        <label>Nom du modèle</label>
        <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Ex: Note de service DG"/>
        <label>Catégorie</label>
        <select value={catId} onChange={e=>setCatId(e.target.value)}>
          {categories.map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
        </select>
        <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",marginTop:12}}>
          <input type="checkbox" checked={hasLogo} onChange={e=>setHasLogo(e.target.checked)} style={{width:14,height:14}}/>
          Ce document contient un emplacement logo / cachet
        </label>
        {hasLogo&&(<>
          <label>Position du logo</label>
          <select value={logoPos} onChange={e=>setLogoPos(e.target.value)}>
            <option value="top-left">Haut gauche (timbre)</option>
            <option value="top-center">Haut centre (page de garde)</option>
            <option value="top-right">Haut droite</option>
          </select>
          <label>Libellé de la zone logo</label>
          <input type="text" value={logoLbl} onChange={e=>setLogoLbl(e.target.value)} placeholder="Ex: Logo / Cachet du service"/>
        </>)}
        <div className="modal-actions">
          <button className="m-cancel" onClick={onClose}>Annuler</button>
          <button className="m-confirm" onClick={save} disabled={!file||!name.trim()}>Ajouter le modèle ✓</button>
        </div>
      </div>
    </div>
  );
}

function CategoryModal({ onClose, onSave }) {
  const ICONS=["📂","📑","🗂️","📌","🔖","📎","🗃️","🗄️","🏷️","📃","⚖️","🏛️","📜","🖊️"];
  const [label,setLabel]=useState("");
  const [icon,setIcon]=useState("📂");
  const [desc,setDesc]=useState("");
  const save=()=>{
    if(!label.trim())return;
    const id=label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")
      .replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+"-"+Date.now();
    onSave({id,label:label.trim(),icon,description:desc.trim(),order:99,builtIn:false});
  };
  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <h3>➕ Nouvelle catégorie de documents</h3>
        <p>Créez un nouveau type de document qui sera disponible dans toute la plateforme.</p>
        <label>Nom *</label>
        <input type="text" value={label} onChange={e=>setLabel(e.target.value)} placeholder="Ex: Décision, Arrêté, Circulaire…"/>
        <label>Icône</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:6,marginBottom:4}}>
          {ICONS.map(ic=>(
            <button key={ic} onClick={()=>setIcon(ic)} style={{fontSize:20,padding:"4px 8px",
              border:`2px solid ${icon===ic?"var(--g-dk)":"var(--bdr)"}`,
              borderRadius:8,background:icon===ic?"var(--g-lt)":"none",cursor:"pointer"}}>{ic}</button>
          ))}
        </div>
        <label>Description</label>
        <input type="text" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description courte (optionnel)"/>
        <div className="modal-actions">
          <button className="m-cancel" onClick={onClose}>Annuler</button>
          <button className="m-confirm" onClick={save} disabled={!label.trim()}>Créer ✓</button>
        </div>
      </div>
    </div>
  );
}

function DirectionGenerale({ onBack }) {
  const { categories, loading, getDocsByCategory, addDocument, deleteDocument, addCategory, deleteCategory } = useDocuments();
  const { copied, copy } = useCopyToClipboard();
  const logoSlot = useLogoSlot();
  const [selCat,setSelCat]=useState(null);
  const [selDocId,setSelDocId]=useState(null);
  const [showUp,setShowUp]=useState(false);
  const [showCat,setShowCat]=useState(false);
  const [toast,setToast]=useState(null);
  const showToast=(msg,type="success")=>setToast({message:msg,type});
  const docsForCat=selCat?getDocsByCategory(selCat):[];
  const currentDoc=selDocId?docsForCat.find(d=>d.id===selDocId):null;

  if(loading) return <div className="empty"><div className="empty-icon">⏳</div><h3>Chargement…</h3></div>;

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <div className="redac">
        <div className="sdb">
          <div className="sdb-hdr">
            <button onClick={onBack}>←</button>
            <div><div className="sdb-title">🏛️ Direction Générale</div><div className="sdb-sub">Rédaction Administrative</div></div>
          </div>
          <div className="type-list">
            {categories.map(cat=>{
              const n=getDocsByCategory(cat.id).length;
              return (
                <button key={cat.id} className={`type-btn${selCat===cat.id?" sel":""}`}
                  onClick={()=>{setSelCat(cat.id);setSelDocId(null);}}>
                  <span className="type-icon">{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className="type-ct">{n}</span>
                </button>
              );
            })}
          </div>
          {selCat&&(
            <div className="sub-list">
              <div className="sub-hdr">{categories.find(c=>c.id===selCat)?.label}s disponibles</div>
              {docsForCat.map(doc=>(
                <button key={doc.id} className={`sub-btn${selDocId===doc.id?" sel":""}${!doc.builtIn?" upl":""}`}
                  onClick={()=>setSelDocId(doc.id)}>
                  {!doc.builtIn&&"📎 "}{doc.label}
                </button>
              ))}
              {docsForCat.length===0&&<div style={{padding:"8px 10px",fontSize:12,color:"var(--txt-lt)"}}>Aucun modèle — importez un PDF.</div>}
              {!categories.find(c=>c.id===selCat)?.builtIn&&(
                <button style={{width:"100%",padding:"6px 10px",margin:"8px 0 0",
                  border:"1.5px solid #FCA5A5",borderRadius:7,background:"none",cursor:"pointer",fontSize:11,color:"#DC2626"}}
                  onClick={async()=>{if(!window.confirm("Supprimer cette catégorie et tous ses modèles ?"))return;
                    await deleteCategory(selCat);setSelCat(null);setSelDocId(null);showToast("Catégorie supprimée");}}>
                  🗑 Supprimer cette catégorie
                </button>
              )}
            </div>
          )}
          <div style={{marginTop:"auto"}}>
            <button className="add-cat-btn" onClick={()=>setShowCat(true)}>➕ Nouvelle catégorie</button>
            <div className="up-zone" onClick={()=>setShowUp(true)}>
              <div style={{fontSize:26,marginBottom:5}}>📥</div>
              <div className="up-ztxt"><strong>Ajouter un modèle PDF</strong>Importez un document officiel scanné</div>
            </div>
          </div>
        </div>

        <div className="viewer">
          {currentDoc?(<>
            <div className="toolbar">
              <div className="tb-info">
                <div className="tb-docname">{categories.find(c=>c.id===currentDoc.categoryId)?.icon} {currentDoc.label}</div>
                <div className="tb-meta">Police : {currentDoc.font} {currentDoc.fontSize} · Marges : {currentDoc.margins}</div>
              </div>
              <span className={`tb-badge${!currentDoc.builtIn?" upl":""}`}>{currentDoc.builtIn?"Officiel ISMP":"Importé"}</span>
              {!currentDoc.uploadedFile&&(
                <button className={`copy-btn${copied?" ok":""}`} onClick={async()=>{
                  const ok=await copy(currentDoc.template);
                  if(ok)showToast("Modèle copié — collez dans Word avec Ctrl+V");
                  else showToast("Copie échouée","error");
                }}>{copied?"✓ Copié !":"📋 Copier le modèle"}</button>
              )}
              {!currentDoc.builtIn&&(
                <button className="del-btn" onClick={async()=>{
                  if(!window.confirm(`Supprimer « ${currentDoc.label} » ?`))return;
                  await deleteDocument(currentDoc.id);setSelDocId(null);showToast(`« ${currentDoc.label} » supprimé`);
                }}>🗑</button>
              )}
            </div>
            <LogoSlot doc={currentDoc} logoDataUrl={logoSlot.logoDataUrl} onOpen={logoSlot.openPicker} onClear={logoSlot.clearLogo}/>
            <input type="file" accept="image/*" style={{display:"none"}} ref={logoSlot.fileInputRef} onChange={logoSlot.handleFileChange}/>
            {currentDoc.notes&&(
              <div className="notes">
                <span style={{fontSize:15,flexShrink:0}}>💡</span>
                <p>{!currentDoc.uploadedFile&&<><strong>Utilisation : </strong>Copiez le modèle, collez dans Word (Ctrl+V).
                  Police <strong>{currentDoc.font} {currentDoc.fontSize}</strong> requise.<br/><br/></>}
                  ⚠️ <strong>Note : </strong>{currentDoc.notes}</p>
              </div>
            )}
            <DocPreview doc={currentDoc} logoDataUrl={logoSlot.logoDataUrl}/>
          </>):(
            <div className="empty">
              <div className="empty-icon">📂</div>
              <h3>Sélectionnez un modèle</h3>
              <p>Choisissez un type de document dans le menu gauche, puis sélectionnez le modèle souhaité.</p>
              {!selCat&&(
                <div className="empty-cats">
                  {categories.map(c=>(
                    <button key={c.id} className="cat-chip" onClick={()=>setSelCat(c.id)}>{c.icon} {c.label}</button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {showUp&&<UploadModal categories={categories} onClose={()=>setShowUp(false)} onSave={async doc=>{await addDocument(doc);setShowUp(false);setSelCat(doc.categoryId);setSelDocId(doc.id);showToast(`« ${doc.label} » ajouté`);}}/>}
      {showCat&&<CategoryModal onClose={()=>setShowCat(false)} onSave={async cat=>{await addCategory(cat);setShowCat(false);setSelCat(cat.id);showToast(`Catégorie « ${cat.label} » créée`);}}/>}
      {toast&&<Toast message={toast.message} type={toast.type} onDone={()=>setToast(null)}/>}
    </div>
  );
}

function HomePage({ onNavigate }) {
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <div className="hero">
        <div className="hero-deco"/>
        <div className="hero-badge">🌿 Portail Numérique ISMP</div>
        <h1>Bienvenue sur <span>IRIS</span></h1>
        <p>Plateforme intégrée de rédaction et de gestion documentaire de l'Institut Supérieur de Management Public — Yaoundé</p>
      </div>
      <div className="home-body">
        <h2>Structures de l'ISMP</h2>
        <div className="grid">
          {divisionsData.map(div=>(
            <div key={div.id} className={`div-card${div.available?" avail":""}`} onClick={()=>onNavigate(div.id)}>
              <div className="div-icon">{div.icon}</div>
              <div><div className="div-code">{div.code}</div><div className="div-nm">{div.label}</div></div>
              <div className="div-desc">{div.desc}</div>
              <div className="div-action">{div.available?"Accéder →":<span style={{color:"#A0AEC0",fontSize:11}}>🔒 Bientôt disponible</span>}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WipPage({ division, onBack }) {
  return (
    <div className="wip">
      <div style={{fontSize:60}}>{division.icon}</div>
      <div className="wip-t">{division.label}</div>
      <div className="wip-s">{division.desc}</div>
      <div className="wip-badge">🔧 Module en cours de développement</div>
      <button className="back-btn" onClick={onBack}>← Retour à l'accueil</button>
    </div>
  );
}

export default function App() {
  const [page,setPage]=useState("home");
  const division=divisionsData.find(d=>d.id===page);
  return (
    <>
      <style>{STYLE}</style>
      <div className="iris-app">
        <header className="hdr">
          <div className="hdr-in">
            <div className="logo-mk" onClick={()=>setPage("home")}>IR</div>
            <div className="hdr-titles">
              <div className="hdr-t">IRIS — ISMP</div>
              <div className="hdr-s">Plateforme documentaire · Institut Supérieur de Management Public</div>
            </div>
            <div className="flag"><span className="sg"/><span className="sr"/><span className="sy"/></div>
          </div>
        </header>
        {page==="home"&&<HomePage onNavigate={setPage}/>}
        {page==="dg"&&<DirectionGenerale onBack={()=>setPage("home")}/>}
        {division&&!division.available&&page!=="home"&&<WipPage division={division} onBack={()=>setPage("home")}/>}
      </div>
    </>
  );
}
