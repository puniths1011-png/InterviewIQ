import React, { useState, useEffect } from 'react';
import { leaderboardAPI } from '../services/api';

export default function LeaderboardPage() {
  const [data, setData] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leaderboardAPI.get({ limit: 20 })
      .then(r => { setData(r.data || []); setMyRank({ rank: r.myRank, points: r.myPoints }); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const top3 = data.slice(0, 3);
  const rest = data.slice(3);
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean); // silver, gold, bronze

  return (
    <div className="fade-in">
      <div style={{ textAlign:'center', marginBottom:32 }}>
        <div style={{ fontSize:36, marginBottom:8 }}>🏆</div>
        <h2 style={{ fontSize:22, fontWeight:800, marginBottom:6 }}>Leaderboard</h2>
        <p style={{ fontSize:13, color:'var(--text2)' }}>Top performers ranked by total points</p>
        {myRank && (
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(108,99,255,0.1)', border:'1px solid rgba(108,99,255,0.25)', borderRadius:20, padding:'6px 16px', marginTop:12, fontSize:13 }}>
            <span style={{ color:'var(--accent)' }}>Your rank:</span>
            <span style={{ fontWeight:800, color:'var(--text)' }}>#{myRank.rank}</span>
            <span style={{ color:'var(--text2)' }}>·</span>
            <span style={{ color:'var(--accent4)', fontFamily:'DM Mono,monospace' }}>{myRank.points} pts</span>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:60 }}><div className="loader-ring" /></div>
      ) : (
        <>
          {/* Podium */}
          {top3.length > 0 && (
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'center', gap:12, marginBottom:32 }}>
              {podiumOrder.map((user, idx) => {
                const isGold = user?.rank === 1;
                const heights = podiumOrder.map(u => u?.rank === 1 ? 140 : 110);
                return user ? (
                  <div key={user._id} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                    <div style={{ fontSize:28 }}>{user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}</div>
                    <div style={{
                      width:44, height:44, borderRadius:'50%',
                      background:`linear-gradient(135deg, var(--accent), var(--accent2))`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:17, fontWeight:800, color:'#fff',
                      border: isGold ? '2px solid var(--accent4)' : 'none',
                      boxShadow: isGold ? '0 0 16px rgba(247,151,30,0.3)' : 'none'
                    }}>
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ fontSize:13, fontWeight:700 }}>{user.name}</div>
                    <div style={{ fontSize:12, color:'var(--accent4)', fontFamily:'DM Mono,monospace', fontWeight:700 }}>{user.points} pts</div>
                    <div style={{
                      width:80, height:heights[idx],
                      background: isGold ? 'linear-gradient(180deg,rgba(247,151,30,0.2),rgba(247,151,30,0.05))' : 'var(--bg3)',
                      border:`1px solid ${isGold?'rgba(247,151,30,0.3)':'var(--border)'}`,
                      borderRadius:'var(--radius-sm) var(--radius-sm) 0 0',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:18, fontWeight:800,
                      color: isGold ? 'var(--accent4)' : 'var(--text2)'
                    }}>
                      #{user.rank}
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          )}

          {/* Full table */}
          <div className="card">
            <div className="section-title">Full Rankings</div>
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              {data.map(user => (
                <div key={user._id} style={{
                  display:'flex', alignItems:'center', gap:14, padding:'10px 12px',
                  borderRadius:'var(--radius-sm)',
                  background: user.isMe ? 'rgba(108,99,255,0.08)' : 'transparent',
                  border: user.isMe ? '1px solid rgba(108,99,255,0.2)' : '1px solid transparent',
                  transition:'var(--transition)'
                }}>
                  <div style={{
                    width:28, textAlign:'center', fontFamily:'DM Mono,monospace',
                    fontSize:13, color: user.rank<=3 ? 'var(--accent4)' : 'var(--text3)',
                    fontWeight: user.rank<=3 ? 700 : 400
                  }}>
                    {user.rank <= 3 ? ['🥇','🥈','🥉'][user.rank-1] : `#${user.rank}`}
                  </div>
                  <div style={{ width:34, height:34, borderRadius:'50%', background:'var(--bg3)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14, color:'var(--text2)', flexShrink:0 }}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight: user.isMe ? 700 : 500, color: user.isMe ? 'var(--accent)' : 'var(--text)' }}>
                      {user.name} {user.isMe && <span className="tag tag-purple" style={{ fontSize:9, marginLeft:4 }}>You</span>}
                    </div>
                    <div style={{ fontSize:10, color:'var(--text3)', fontFamily:'DM Mono,monospace' }}>
                      {user.totalInterviews} interviews · {user.accuracy}% accuracy
                    </div>
                  </div>
                  <div style={{ fontSize:14, fontWeight:700, color:'var(--accent4)', fontFamily:'DM Mono,monospace' }}>{user.points}</div>
                  <div style={{ fontSize:10, color:'var(--text3)', width:20 }}>pts</div>
                  {user.streak > 0 && (
                    <div style={{ fontSize:11, color:'var(--accent4)' }}>🔥{user.streak}</div>
                  )}
                </div>
              ))}
              {data.length === 0 && (
                <div style={{ textAlign:'center', padding:32, color:'var(--text2)', fontSize:13 }}>
                  No data yet. Complete interviews to earn points and appear on the leaderboard!
                </div>
              )}
            </div>
          </div>

          {/* Points guide */}
          <div className="card" style={{ marginTop:16 }}>
            <div className="section-title">How to Earn Points</div>
            <div className="grid-3">
              {[['✅','MCQ Correct Answer','10 pts each'],['🤖','Complete AI Interview','50 pts'],['📄','Resume Interview','50 pts'],['🔥','Daily Streak','5 pts / day'],['⭐','Score 80%+','Bonus 20 pts'],['🏅','First Interview','25 pts']].map(([icon,label,pts]) => (
                <div key={label} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0' }}>
                  <span style={{ fontSize:18 }}>{icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:600 }}>{label}</div>
                    <div style={{ fontSize:11, color:'var(--accent4)', fontFamily:'DM Mono,monospace' }}>{pts}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
