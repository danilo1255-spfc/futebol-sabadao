import { useState } from 'react'
import Pagamentos from './Pagamentos'
import Presenca from './Presenca'

export default function App() {
  const [tab, setTab] = useState('presenca')

  return (
    <div>
      {/* NAV */}
      <div style={{position:'sticky',top:0,zIndex:100,background:'#080f1a',borderBottom:'2px solid rgba(255,255,255,0.08)',display:'flex',justifyContent:'center',gap:0}}>
        {[
          {k:'presenca', icon:'🗓️', label:'Presença'},
          {k:'pagamentos', icon:'💸', label:'Pagamentos'},
        ].map(t => (
          <button key={t.k} onClick={()=>setTab(t.k)} style={{flex:1,maxWidth:200,padding:'13px 8px',border:'none',background:'transparent',color: tab===t.k ? '#fff' : '#7a9ab0',fontFamily:"'DM Sans',sans-serif",fontSize:'0.85rem',fontWeight:700,cursor:'pointer',borderBottom: tab===t.k ? `3px solid ${t.k==='presenca'?'#4fc3f7':'#00c853'}` : '3px solid transparent',transition:'all 0.15s',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {tab === 'presenca' ? <Presenca /> : <Pagamentos />}
    </div>
  )
}
