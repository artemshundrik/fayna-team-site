
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import BlockIcon from '@mui/icons-material/Block';
import StarIcon from '@mui/icons-material/Star';
import type { Database } from '../types/supabase';
import { supabase } from '../supabase';
import { useTournament } from '../context/TournamentContext';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

import { styled } from '@mui/material/styles';
// Example Card styled component, adjust as per actual usage
const Card = styled(Box, { shouldForwardProp: (prop) => prop !== 'full' })<{ full?: boolean }>`
  /* card styles here */
`;




const NextMatch = () => {
  const [data, setData] = useState<Database['public']['Tables']['matches']['Row'] & {
    team1: Database['public']['Tables']['teams']['Row'] | null;
    team2: Database['public']['Tables']['teams']['Row'] | null;
  } | null>(null);
  const [matchDate, setMatchDate] = useState<Date | null>(null);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [score, setScore] = useState<{
    home: number;
    away: number;
    url?: string;
    homeTeam?: string;
    awayTeam?: string;
    finishedManually?: boolean;
  } | null>(null);
  const [form1, setForm1] = useState<string[]>([]);
  const [form2, setForm2] = useState<string[]>([]);
  // --- Match events (for finished matches) -----------------------------------
  type EventRow = {
    match_id: string;
    player?: string | null;
    player_id?: string | null;
    assist_player_id?: string | null;
    type?: string | null; // goal | yellow | red | mvp
    minute?: number | null;
    time?: string | null;
  };
  const [events, setEvents] = useState<EventRow[]>([]);
  const [nameToNumber, setNameToNumber] = useState<Record<string, number>>({});
  const navigate = useNavigate();
  // --- Use form values that already exist in the "teams" table -----------------
  useEffect(() => {
    if (!data) return;

    const parseForm = (formStr?: string | null): string[] => {
      if (!formStr) return [];
      return formStr
        .split(',')
        .map(s => s.trim().toLowerCase())        // keep only first letter and trim spaces
        .filter(ch => ['w', 'd', 'l'].includes(ch)); // ensure only valid markers
    };

    setForm1(parseForm((data.team1 as any)?.form));
    setForm2(parseForm((data.team2 as any)?.form));
  }, [data]);
  // ---------------------------------------------------------------------------
  const [matchIsOver, setMatchIsOver] = useState(false);

  const { effectiveTournamentId } = useTournament();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!(matchDate instanceof Date) || isNaN(matchDate.getTime())) return;

      const now = new Date();
      const distance = matchDate.getTime() - now.getTime();

      if (distance <= 0) {
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        clearInterval(interval);
        return;
      }

      const daysCount = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hoursCount = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutesCount = Math.floor((distance / (1000 * 60)) % 60);
      const secondsCount = Math.floor((distance / 1000) % 60);

      setDays(daysCount);
      setHours(hoursCount);
      setMinutes(minutesCount);
      setSeconds(secondsCount);
    }, 1000);

    return () => clearInterval(interval);
  }, [matchDate]);

  useEffect(() => {
    const fetchMatch = async () => {
      const { data: matches, error } = await supabase
        .from('matches')
        .select('*, team1:team1_ref(name, logo), team2:team2_ref(name, logo), tournament:tournament_id(logo_url, stadium, league_name, url, address)')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      // Apply tournament filter if selected
      let list = matches || [];
      if (!error && effectiveTournamentId) {
        const { data: filtered, error: err2 } = await supabase
          .from('matches')
          .select('*, team1:team1_ref(name, logo), team2:team2_ref(name, logo), tournament:tournament_id(logo_url, stadium, league_name, url, address)')
          .eq('tournament_id', effectiveTournamentId)
          .order('date', { ascending: true })
          .order('time', { ascending: true });
        if (!err2 && filtered) list = filtered;
      }

      if (error || !list || list.length === 0) {
        console.error('Match fetch error:', error);
        return;
      }

      const now = new Date();

      // знайти всі майбутні матчі
      const upcomingMatches = list.filter(m => m.date && m.time && new Date(`${m.date}T${m.time}+03:00`) > now);
      let upcoming = upcomingMatches[0];

      // знайти останній завершений матч
      const finishedMatches = list.filter(m => m.date && m.time && new Date(`${m.date}T${m.time}+03:00`) <= now);
      let lastFinished = finishedMatches.length > 0 ? finishedMatches[finishedMatches.length - 1] : null;

      // Якщо є завершений матч < 48 годин тому — показуємо його
      if (lastFinished) {
        const finishedTime = new Date(`${lastFinished.date}T${lastFinished.time}+03:00`);
        const timeSinceFinish = now.getTime() - finishedTime.getTime();
        if (timeSinceFinish < 2 * 24 * 60 * 60 * 1000) {
          setData(lastFinished);
          setMatchDate(finishedTime);
          return;
        }
      }

      // Інакше показуємо наступний матч
      if (upcoming) {
        setData(upcoming);
        const dateTimeString = `${upcoming.date}T${upcoming.time}+03:00`;
        const parsedDate = new Date(dateTimeString);
        if (!isNaN(parsedDate.getTime())) {
          setMatchDate(parsedDate);
        }
      }
    };

    fetchMatch();
  }, [effectiveTournamentId]);

  // Load events when a specific match is selected
  useEffect(() => {
    const run = async () => {
      if (!data?.id) { setEvents([]); return; }
      const { data: rows } = await supabase
        .from('match_events')
        .select('*')
        .eq('match_id', data.id)
        .order('minute', { ascending: true })
        .order('date_created', { ascending: true });
      setEvents((rows as any[]) || []);
    };
    run();
  }, [data?.id]);

  // Build a map from player full name to jersey number for navigation
  useEffect(() => {
    const loadPlayers = async () => {
      const { data, error } = await supabase
        .from('players')
        .select('first_name, last_name, number');
      if (error || !data) return;
      const map: Record<string, number> = {};
      const lnCount: Record<string, number> = {};
      data.forEach((p: any) => {
        const fn = String(p.first_name || '').trim();
        const ln = String(p.last_name || '').trim();
        const num = Number(p.number);
        if (!Number.isFinite(num)) return;
        const lnKey = ln.toLowerCase();
        if (lnKey) lnCount[lnKey] = (lnCount[lnKey] || 0) + 1;
        const variants = [
          `${fn} ${ln}`,
          `${ln} ${fn}`,
          `${fn} ${ln}`.toUpperCase(),
          `${ln} ${fn}`.toUpperCase(),
        ];
        variants.forEach(v => {
          const key = v.trim().toLowerCase();
          if (key) map[key] = num;
        });
      });
      // Add last-name-only mapping if unique
      data.forEach((p: any) => {
        const ln = String(p.last_name || '').trim();
        const num = Number(p.number);
        const key = ln.toLowerCase();
        if (key && Number.isFinite(num) && lnCount[key] === 1) {
          map[key] = num;
        }
      });
      setNameToNumber(map);
    };
    loadPlayers();
  }, []);

  useEffect(() => {
    if (!matchDate) return;
  
    const now = new Date();
    const twoHoursLater = new Date(matchDate.getTime() + 2 * 60 * 60 * 1000);
    if (now > twoHoursLater) {
      setMatchIsOver(true);
    }
  }, [matchDate]);

const isLive = !!score?.url && !score?.finishedManually;
const isNowLive = matchDate && new Date() >= matchDate && new Date() < new Date(matchDate.getTime() + 2 * 60 * 60 * 1000);
  const isFinished = score !== null;
  
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };
  
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <>
      <Box
        component="section"
        sx={{
          backgroundImage: "url('/images/matches/next-match-bg.png')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          position: 'relative',
          px: { xs: '0.5rem', sm: '1rem' },
          py: { xs: '2rem', sm: '2.5rem', md: '4rem' },
          textAlign: 'center',
          color: 'white',
          fontFamily: 'FixelDisplay, sans-serif',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 0,
          },
          '& > *': {
            position: 'relative',
            zIndex: 1,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: '1.5rem',
          }}
        >
          <Link
            href={data?.tournament?.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Box
              component="img"
              src={data?.tournament?.logo_url || '/images/matches/logo-rejo.png'}
              alt={data?.tournament?.title || 'Турнір'}
              sx={{ height: { xs: 60, sm: 80 }, mb: { xs: 0.2, sm: 0.3 } }}
            />
          </Link>
          <Box
            sx={{
              textAlign: 'center',
              fontSize: '0.95rem',
              color: '#ccc',
            }}
          >
            <Typography
              sx={{
                fontSize: '1rem',
                color: 'white',
                fontWeight: 600,
              }}
              className="meta"
            >
              {data?.tournament?.league_name}
              {data?.round_number ? ` • ТУР ${data.round_number}` : ''}
            </Typography>
          </Box>
        </Box>
        {!score && !matchIsOver ? (
          isLive || isNowLive ? (
            <Box
              sx={{
                display: 'inline-block',
                backgroundColor: 'rgba(255, 0, 0, 0.15)',
                border: '1px solid rgba(255, 0, 0, 0.5)',
                color: 'white',
                px: '1rem',
                py: '0.5rem',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                mb: '1.5rem',
                backdropFilter: 'blur(6px)',
              }}
            >
              🔴 Пряма трансляція
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                mb: { xs: '1rem', sm: '2rem' },
              }}
            >
              {[{ value: days, label: 'дні' }, { value: hours, label: 'год' }, { value: minutes, label: 'хв' }, { value: seconds, label: 'сек' }].map((item, idx) => (
                <Box
                  key={item.label}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography sx={{ fontSize: { xs: '2rem', sm: '2.88rem' }, fontWeight: 'bold' }}>
                    {String(item.value).padStart(2, '0')}
                  </Typography>
                  <Typography
                    sx={{
                      mt: '-0.5rem',
                      fontSize: { xs: '0.6rem', sm: '0.75rem' },
                      color: '#aaa',
                      fontWeight: 1000,
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          )
        ) : (
          matchIsOver ? (
            <Box
              sx={{
                display: 'inline-block',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                px: '1rem',
                py: '0.5rem',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                mb: '1.5rem',
                backdropFilter: 'blur(6px)',
              }}
            >
              🏁 Матч завершено
            </Box>
          ) : (
            <Box
              sx={{
                display: 'inline-block',
                backgroundColor: 'rgba(255, 0, 0, 0.15)',
                border: '1px solid rgba(255, 0, 0, 0.5)',
                color: 'white',
                px: '1rem',
                py: '0.5rem',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                mb: '1.5rem',
                backdropFilter: 'blur(6px)',
              }}
            >
              🔴 Пряма трансляція
            </Box>
          )
        )}
        {matchDate instanceof Date && !isNaN(matchDate.getTime()) && (
          <Typography
            sx={{
              fontSize: { xs: '1rem', sm: '1.4rem' },
              fontWeight: { xs: 300, sm: 'bold' },
              mb: { xs: '0.5rem', sm: '0.25rem' },
            }}
          >
            {format(matchDate, 'EEEE, d MMMM', { locale: uk })}
          </Typography>
        )}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 1, sm: 2 },
            mb: 2,
            flexDirection: { xs: 'row', md: 'row' },
            position: 'relative',
          }}
        >
          <Box
            sx={{
              flex: 1,
              maxWidth: 300,
              display: 'flex',
              justifyContent: { xs: 'center', sm: 'space-between' },
              alignItems: 'center',
            }}
          >
            <Box
              className="team"
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column-reverse', sm: 'row' },
                alignItems: { xs: 'center', sm: 'center' },
                gap: { xs: '0.5rem', sm: '2rem' },
                fontSize: { xs: '1.4rem', sm: '2rem' },
                fontWeight: 'bold',
                color: 'white',
                flex: 1,
                maxWidth: 300,
              }}
            >
              {data?.team1 && (
                <>
                  <Box
                    sx={{
                      minWidth: 0,
                      flexShrink: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: { xs: 'center', sm: 'flex-end' },
                      textAlign: { xs: 'center', sm: 'right' },
                      flex: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: '1rem', sm: '2rem' },
                        fontWeight: 'bold',
                        color: 'white',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                        textAlign: { xs: 'center', sm: 'inherit' },
                      }}
                      className="name"
                    >
                      {data.team1.name}
                    </Typography>
                    <Box
                      className="team-info"
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: { xs: 'center', sm: 'flex-end' },
                        textAlign: { xs: 'center', sm: 'right' },
                      }}
                    >
                      {form1.length > 0 && (
                        <Box sx={{
                          display: 'flex',
                          justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                          gap: '0.5rem',
                          mt: '0.5rem',
                          width: '100%',
                        }}>
                          {form1.map((ch, i) => {
                            const label = ch === 'w' ? 'В' : ch === 'l' ? 'П' : 'Н';
                            const bg = ch === 'w' ? '#4caf50' : ch === 'l' ? '#f44336' : '#9e9e9e';
                            return (
                              <Box key={i} sx={{
                                width: { xs: 16, sm: 20 },
                                height: { xs: 16, sm: 20 },
                                fontSize: { xs: '0.6rem', sm: '0.7rem' },
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                borderRadius: '4px',
                                backgroundColor: bg,
                              }}>
                                {label}
                              </Box>
                            );
                          })}
                        </Box>
                      )}
                      {false && data.team1.name?.toLowerCase().includes('fayna') && matchIsOver && events.length > 0 && (
                        <Box
                          className="team-extra"
                          sx={{
                            mt: '0.3rem',
                            fontSize: '1rem',
                            fontWeight: 400,
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem',
                            alignItems: { xs: 'center', sm: 'flex-end' },
                            textAlign: { xs: 'center', sm: 'right' },
                          }}
                        >
                          {events.map((ev, i) => {
                            const t = (ev.type || '').toLowerCase();
                            const minute = ev.minute != null ? `${ev.minute}'` : (ev.time ? ev.time.slice(0,5) : '');
                            const name = (ev.player && String(ev.player).trim()) || (ev.player_id && String(ev.player_id).trim()) || '';
                            return (
                              <Box key={i} sx={{ display:'grid', gridTemplateColumns:'44px 20px 1fr', alignItems:'center', gap: 1 }}>
                                <Typography sx={{ color:'#ddd', fontWeight:700, textAlign:'right' }}>{minute}</Typography>
                                <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center' }}>
                                  {t==='goal' && <SportsSoccerIcon sx={{ fontSize: 18, color: '#fff' }} />}
                                  {t==='yellow' && <Box sx={{ width:12, height:16, borderRadius:'2px', backgroundColor:'#fbc02d' }} />}
                                  {t==='red' && <Box sx={{ width:12, height:16, borderRadius:'2px', backgroundColor:'#f44336' }} />}
                                  {t==='mvp' && <StarIcon sx={{ fontSize: 18, color: '#ffb300' }} />}
                                </Box>
                                <Typography sx={{ fontWeight: 600 }}>
                                  {name}{t==='goal' && ev.assist_player_id ? ` (${ev.assist_player_id})` : ''}
                                </Typography>
                              </Box>
                            );
                          })}
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <Box
                    component="img"
                    src={data.team1.logo || '/images/placeholder.svg'}
                    alt={data.team1.name}
                    sx={{
                      width: { xs: 50, sm: 80 },
                      height: { xs: 50, sm: 80 },
                      borderRadius: '50%',
                      objectFit: 'contain',
                      mb: { xs: 0.5, sm: 1 },
                    }}
                  />
                  {false && data.team1.name?.toLowerCase().includes('fayna') && matchIsOver && events.length > 0 && (
                    <Box
                      className="team-extra"
                      sx={{
                        mt: '0.3rem',
                        fontSize: '1rem',
                        fontWeight: 400,
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem',
                        alignItems: { xs: 'center', sm: 'flex-end' },
                        textAlign: { xs: 'center', sm: 'right' },
                        width: '100%',
                      }}
                    >
                      {events.map((ev, i) => {
                        const t = (ev.type || '').toLowerCase();
                        const minute = ev.minute != null ? `${ev.minute}'` : (ev.time ? ev.time.slice(0,5) : '');
                        const name = (ev.player && String(ev.player).trim()) || (ev.player_id && String(ev.player_id).trim()) || '';
                        const assist = ev.assist_player_id ? String(ev.assist_player_id).trim() : '';
                        const toNumber = (n: string) => nameToNumber[n.trim().toLowerCase()];
                        return (
                          <Box key={i} sx={{ display:'grid', gridTemplateColumns:'28px 10px 1fr', alignItems:'center', gap: 0.25 }}>
                            <Typography sx={{ color:'#ddd', fontWeight:700, textAlign:'right' }}>{minute}</Typography>
                            <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', width: 10 }}>
                              {t==='goal' && <SportsSoccerIcon sx={{ fontSize: 15, color: '#fff' }} />}
                              {t==='yellow' && <Box sx={{ width:7, height:10, borderRadius:'2px', backgroundColor:'#fbc02d' }} />}
                              {t==='red' && <Box sx={{ width:7, height:10, borderRadius:'2px', backgroundColor:'#f44336' }} />}
                              {t==='mvp' && <StarIcon sx={{ fontSize: 18, color: '#ffb300' }} />}
                            </Box>
                            <Box sx={{ display:'inline-flex', gap: 0.5, justifyContent:'flex-end', alignItems:'center' }}>
                              <Typography
                                onClick={() => { const n = toNumber(name); if (n) navigate(`/player/${n}`); }}
                                sx={{ fontWeight: 600, textAlign:'right', cursor: toNumber(name) ? 'pointer' : 'default', '&:hover': toNumber(name) ? { color: 'primary.main' } : undefined }}
                              >
                                {name}
                              </Typography>
                              {t==='goal' && assist && (
                                <Typography
                                  variant="body2"
                                  onClick={() => { const n = toNumber(assist); if (n) navigate(`/player/${n}`); }}
                                  sx={{ color:'#ccc', cursor: toNumber(assist) ? 'pointer' : 'default', '&:hover': toNumber(assist) ? { color: 'primary.main' } : undefined }}
                                >
                                  ({assist})
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Box>
          {/* Score */}
          <Box
            sx={{
              position: 'relative',
              m: { xs: '0.5rem 0', md: '0 1rem' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: { xs: '1.54rem', sm: '1.6rem', md: '1.89rem' },
              fontWeight: 900,
              minWidth: { xs: 66, sm: 70 },
              px: { xs: 1.75, sm: 2.45 },
              py: { xs: 0.5, sm: 0.84 },
              background: 'rgba(0, 0, 0, 0.68)',
              backdropFilter: 'blur(8px)',
              borderRadius: { xs: 1, sm: 2 },
              color: 'white',
              textAlign: 'center',
              boxShadow: '0 2px 12px 0 rgba(0,0,0,0.12)',
              letterSpacing: '0.03em',
              // border: '2.5px solid rgba(255,255,255,0.18)', // removed as per instructions
              transition: 'font-size 0.3s',
            }}
          >
            {matchIsOver && data?.score_team1 != null && data?.score_team2 != null
              ? `${data.score_team1} - ${data.score_team2}`
              : matchDate && new Date() < matchDate
              ? matchDate.toLocaleTimeString('uk-UA', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : isNowLive ? 'vs' : '--:--'}
          </Box>
          {/* Right team */}
          <Box
            sx={{
              flex: 1,
              maxWidth: 300,
              display: 'flex',
              justifyContent: { xs: 'flex-start', sm: 'space-between' },
              alignItems: 'center',
            }}
          >
            <Box
              className="team reverse"
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column-reverse', sm: 'row-reverse' },
                alignItems: { xs: 'center', sm: 'center' },
                gap: { xs: '0.5rem', sm: '2rem' },
                fontSize: { xs: '1.4rem', sm: '2rem' },
                fontWeight: 'bold',
                color: 'white',
                flex: 1,
                maxWidth: 300,
                textAlign: 'right',
                '& .team-info': {
                  alignItems: { xs: 'center', sm: 'flex-end' },
                },
              }}
            >
              {data?.team2 && (
                <>
                  <Box
                    sx={{
                      minWidth: 0,
                      flexShrink: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: { xs: 'center', sm: 'flex-start' },
                      textAlign: { xs: 'center', sm: 'left' },
                      flex: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: '1rem', sm: '2rem' },
                        fontWeight: 'bold',
                        color: 'white',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                        textAlign: { xs: 'center', sm: 'inherit' },
                      }}
                      className="name"
                    >
                      {data.team2.name}
                    </Typography>
                    <Box
                      className="team-info"
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: { xs: 'center', sm: 'flex-start' },
                        textAlign: { xs: 'center', sm: 'left' },
                      }}
                    >
                      {form2.length > 0 && (
                        <Box sx={{
                          display: 'flex',
                          justifyContent: { xs: 'flex-start', sm: 'flex-start' },
                          gap: '0.5rem',
                          mt: '0.5rem',
                          width: '100%',
                        }}>
                          {form2.map((ch, i) => {
                            const label = ch === 'w' ? 'В' : ch === 'l' ? 'П' : 'Н';
                            const bg = ch === 'w' ? '#4caf50' : ch === 'l' ? '#f44336' : '#9e9e9e';
                            return (
                              <Box key={i} sx={{
                                width: { xs: 16, sm: 20 },
                                height: { xs: 16, sm: 20 },
                                fontSize: { xs: '0.6rem', sm: '0.7rem' },
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                borderRadius: '4px',
                                backgroundColor: bg,
                              }}>
                                {label}
                              </Box>
                            );
                          })}
                        </Box>
                      )}
                      {false && data.team2.name?.toLowerCase().includes('fayna') && matchIsOver && events.length > 0 && (
                        <Box
                          className="team-extra"
                          sx={{
                            mt: '0.3rem',
                            fontSize: '1rem',
                            fontWeight: 400,
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem',
                            alignItems: { xs: 'center', sm: 'flex-start' },
                            textAlign: { xs: 'center', sm: 'left' },
                          }}
                        >
                          {events.map((ev, i) => {
                            const t = (ev.type || '').toLowerCase();
                            const minute = ev.minute != null ? `${ev.minute}'` : (ev.time ? ev.time.slice(0,5) : '');
                            const name = (ev.player && String(ev.player).trim()) || (ev.player_id && String(ev.player_id).trim()) || '';
                            return (
                          <Box key={i} sx={{ display:'grid', gridTemplateColumns:'28px 10px 1fr', alignItems:'center', gap: 0.25 }}>
                            <Typography sx={{ color:'#ddd', fontWeight:700, textAlign:'right' }}>{minute}</Typography>
                            <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', width: 10 }}>
                              {t==='goal' && <SportsSoccerIcon sx={{ fontSize: 15, color: '#fff' }} />}
                              {t==='yellow' && <Box sx={{ width:7, height:10, borderRadius:'2px', backgroundColor:'#fbc02d' }} />}
                              {t==='red' && <Box sx={{ width:7, height:10, borderRadius:'2px', backgroundColor:'#f44336' }} />}
                              {t==='mvp' && <StarIcon sx={{ fontSize: 18, color: '#ffb300' }} />}
                            </Box>
                                <Typography sx={{ fontWeight: 600 }}>
                                  {name}{t==='goal' && ev.assist_player_id ? ` (${ev.assist_player_id})` : ''}
                                </Typography>
                              </Box>
                            );
                          })}
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <Box
                    component="img"
                    src={data.team2.logo || '/images/placeholder.svg'}
                    alt={data.team2.name}
                    sx={{
                      width: { xs: 50, sm: 80 },
                      height:{ xs: 50, sm: 80 },
                      borderRadius: '50%',
                      objectFit: 'contain',
                      mb: { xs: 0.5, sm: 1 },
                    }}
                  />
                  {data.team2.name?.toLowerCase().includes('fayna') && matchIsOver && events.length > 0 && (
                    <Box
                      className="team-extra"
                      sx={{
                        mt: '0.3rem',
                        fontSize: '1rem',
                        fontWeight: 400,
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem',
                        alignItems: { xs: 'center', sm: 'flex-start' },
                        textAlign: { xs: 'center', sm: 'left' },
                        width: '100%',
                      }}
                    >
                      {events.map((ev, i) => {
                        const t = (ev.type || '').toLowerCase();
                        const minute = ev.minute != null ? `${ev.minute}'` : (ev.time ? ev.time.slice(0,5) : '');
                        const name = (ev.player && String(ev.player).trim()) || (ev.player_id && String(ev.player_id).trim()) || '';
                        return (
                          <Box key={i} sx={{ display:'grid', gridTemplateColumns:'28px 10px 1fr', alignItems:'center', gap: 0.25 }}>
                            <Typography sx={{ color:'#ddd', fontWeight:700, textAlign:'left' }}>{minute}</Typography>
                            <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', width: 10 }}>
                              {t==='goal' && <SportsSoccerIcon sx={{ fontSize: 15, color: '#fff' }} />}
                              {t==='yellow' && <Box sx={{ width:7, height:10, borderRadius:'2px', backgroundColor:'#fbc02d' }} />}
                              {t==='red' && <Box sx={{ width:7, height:10, borderRadius:'2px', backgroundColor:'#f44336' }} />}
                              {t==='mvp' && <StarIcon sx={{ fontSize: 18, color: '#ffb300' }} />}
                            </Box>
                            <Typography sx={{ fontWeight: 600, textAlign:'left' }}>
                              {name}{t==='goal' && ev.assist_player_id ? ` (${ev.assist_player_id})` : ''}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Box>
        </Box>
        <Box sx={{ position: 'relative', mt: '2.5rem' }}>
          <Box
            sx={{
              fontSize: '1rem',
              color: '#ddd',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mt: '-1.5rem',
            }}
          >
            <Typography
              className="venue"
              sx={{
                fontWeight: 'bold',
                fontSize: '1.1rem',
                textTransform: 'uppercase',
                mb: '0.25rem',
                color: 'inherit',
              }}
            >
              🏟 {data?.tournament?.stadium}
            </Typography>
            {data?.tournament?.address && (
              <Box
                className="address"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: '#aaa',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                }}
              >
                <span style={{ color: 'red' }}>📍</span>
                <span>{data.tournament.address}</span>
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={{ mt: '2rem' }}>
          {matchIsOver && data?.highlight_link ? (
            // 1. Матч завершено і є огляд
            <Box sx={{ mt: '2rem' }}>
              <Link
                href={data.highlight_link}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  px: '1.6rem',
                  py: '0.75rem',
                  background: 'linear-gradient(90deg, rgba(255, 0, 0, 0.3), rgba(255, 0, 0, 0.1))',
                  border: '1px solid rgba(255, 0, 0, 0.6)',
                  borderRadius: 0,
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(90deg, rgba(255, 0, 0, 0.5), rgba(255, 0, 0, 0.2))',
                    borderColor: 'rgba(255, 0, 0, 0.8)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                ДИВИТИСЬ ОГЛЯД МАТЧУ
                <img src="/images/icons/youtube.svg" style={{ width: 20, height: 20 }} />
              </Link>
            </Box>
          ) : matchIsOver && !data?.highlight_link ? (
            // 2. Матч завершено, але огляду ще нема
            <Typography
              sx={{
                mt: '2rem',
                color: '#aaa',
                fontSize: '0.95rem',
                fontStyle: 'italic',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              Огляд буде доступний пізніше
              <img
                src="/images/icons/youtube.svg"
                alt="Очікуємо на огляд"
                style={{ width: 20, height: 20, opacity: 0.5 }}
              />
            </Typography>
          ) : !matchIsOver && data?.youtube_link ? (
            // 3. Матч ще не завершено, але є трансляція
            <Box sx={{ mt: '2rem' }}>
              <Link
                href={data.youtube_link}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  px: '1.6rem',
                  py: '0.75rem',
                  background: 'linear-gradient(90deg, rgba(255, 0, 0, 0.3), rgba(255, 0, 0, 0.1))',
                  border: '1px solid rgba(255, 0, 0, 0.6)',
                  borderRadius: 0,
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(90deg, rgba(255, 0, 0, 0.5), rgba(255, 0, 0, 0.2))',
                    borderColor: 'rgba(255, 0, 0, 0.8)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                ДИВИТИСЬ ТРАНСЛЯЦІЮ НА YOUTUBE
                <img src="/images/icons/youtube.svg" style={{ width: 20, height: 20 }} />
              </Link>
            </Box>
          ) : (
            <Box sx={{ mt: '2rem', textAlign: 'center' }}>
              <Typography
                sx={{
                  color: '#aaa',
                  fontSize: '0.95rem',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontWeight: 500,
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                Очікуємо на трансляцію
                <img
                  src="/images/icons/youtube.svg"
                  alt="Очікуємо на трансляцію"
                  style={{ width: 20, height: 20, opacity: 0.5 }}
                />
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default NextMatch;
