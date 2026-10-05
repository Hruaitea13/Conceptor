import React,{useEffect,useState} from 'react';
import {api} from '../api';

export default function Dashboard({ state: localState }){
  const [d,setD]=useState(null);
  const [err,setErr]=useState('');

  useEffect(()=>{
    api('/progress/dashboard').then(setD).catch(e=>setErr(e.message));
  },[]);

  if(err) return <div className="page-pad"><div className="panel">{err}<br/><small>Backend not running - showing local progress</small></div></div>;
  if(!d) return <div className="page-pad"><div className="panel">Loading dashboard...</div></div>;

  const u=d.user||{};
  
  // FIX: Backend mastery 0% a nih chuan localState atangin chhut rawh
  let m = u.mastery || {};
  const hasMasteryData = Object.values(m).some(v => v > 0);

  // A 0% vek chuan local atangin siam
  if(!hasMasteryData && localState){
    const successRuns = (localState.history || []).filter(h=>h.exitCode===0).length;
    const totalRuns = localState.runs || 0;
    const hasLoop = localState.logs?.join('').includes('loop');
    
    m = {
      variables: Math.min(100, successRuns * 20),
      loops: localState.history?.some(h=> h.lang==='python') ? Math.min(80, totalRuns * 10) : 0,
      functions: Math.min(100, (localState.level || 0) * 25),
      pointers: Math.min(100, Math.floor((localState.mastery || 22) / 2)),
      recursion: totalRuns > 5 ? 20 : 0
    };
    // Level, XP, Streak pawh local atangin
    u.level = u.level || (localState.level + 1) || 1;
    u.xp = u.xp || (localState.runs * 145) || 725;
    u.streak = u.streak || localState.runs || 0;
    u.name = u.name || 'hruaia';
  }

  // Level 1 awmzia: hruaia = i email atanga hming, Level 1 = beginner, 725 XP = run 5 vel atanga hmuh
  return (
    <div className="page-pad">
      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-h">Learning Dashboard</div>
          <h2>{u.name || 'hruaia'}</h2>
          <p>Level {u.level || 1} · {u.xp || 725} XP · Streak {u.streak || 0}</p>
          <small style={{opacity:0.6}}>
            Level = i thiamna stage, XP = i code run apiang a i hmuh, Streak = nitin i zir zawn
          </small>
        </div>
        <div className="panel">
          <div className="panel-h">Mastery - Concept-wise thiamna</div>
          {Object.keys(m).length > 0 ? Object.entries(m).map(([k,v])=>(
            <div className="mastery-row" key={k} style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #222'}}>
              <span>{k}</span>
              <b style={{color: v>0 ? '#0f0' : '#888'}}>{v}%</b>
              <div style={{width:'100px', height:'6px', background:'#333', borderRadius:'3px', marginLeft:'10px'}}>
                <div style={{width:`${v}%`, height:'100%', background:'#0f0', borderRadius:'3px'}}></div>
              </div>
            </div>
          )) : <p>Run code in Sandbox to build mastery!</p>}
        </div>
        <div className="panel">
          <div className="panel-h">Recent Activity</div>
          {(d.submissions||[]).slice(0,8).map(s=>(
            <div className="history-row" key={s._id} style={{display:'flex', justifyContent:'space-between', padding:'6px 0'}}>
              <span>{s.language} · {s.status}</span>
              <small>{new Date(s.createdAt).toLocaleString()}</small>
            </div>
          ))}
          {(!d.submissions || d.submissions.length===0) && localState?.history?.map((h,i)=>(
            <div className="history-row" key={i} style={{display:'flex', justifyContent:'space-between'}}>
              <span>{h.lang} · {h.exitCode===0?'success':'error'}</span>
              <small>Run #{h.run}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}