
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import type { Database } from '../types/supabase';
import { supabase } from '../supabase';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

import { styled } from '@mui/material/styles';
// Example Card styled component, adjust as per actual usage
const Card = styled(Box, { shouldForwardProp: (prop) => prop !== 'full' })<{ full?: boolean }>`
  /* card styles here */
`;


const fadeSlide = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};


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
        .select('*, team1:team1_id(*), team2:team2_id(*), tournament:tournament_id(*), mvp:mvp_player_id(*)')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error || !matches || matches.length === 0) {
        console.error('Match fetch error:', error);
        return;
      }

      const now = new Date();

      // знайти перший матч у майбутньому
      const upcomingMatches = matches.filter(m => m.date && m.time);
      let upcoming = upcomingMatches.find(m => new Date(`${m.date}T${m.time}+03:00`) > now);

      // якщо нема — взяти останній зіграний
      if (!upcoming) {
        upcoming = matches[matches.length - 1];
      }

      setData(upcoming);
      if (upcoming?.date && upcoming?.time) {
        const dateTimeString = `${upcoming.date}T${upcoming.time}+03:00`;
        const parsedDate = new Date(dateTimeString);
        if (!isNaN(parsedDate.getTime())) {
          setMatchDate(parsedDate);
        }
      }
    };

    fetchMatch();
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
        component={motion.section}
        initial="hidden"
        whileInView="visible"
        variants={fadeSlide}
        viewport={{ once: true, amount: 0.3 }}
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
            // Remove flexWrap so items stay on one line
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
                      {data.team1.name?.toLowerCase().includes('fayna') && matchIsOver && (
                        <Box
                          className="team-extra"
                          sx={{
                            mt: '0.3rem',
                            fontSize: '1.1rem',
                            fontWeight: 300,
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem',
                            alignItems: { xs: 'center', sm: 'flex-end' },
                            textAlign: { xs: 'center', sm: 'right' },
                          }}
                        >
                          {data?.mvp && <div>⭐ MVP {data.mvp.last_name}</div>}
                          {data?.scorers_fayna && data.scorers_fayna.split(',').map((name, i) => (
                            <div key={i}>⚽ {name.trim()}</div>
                          ))}
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
                </>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              position: 'relative',
              m: { xs: '0.5rem 0', md: '0 1rem' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: { xs: '1.2rem', sm: '2rem' },
              fontWeight: 'bold',
              minWidth: { xs: 60, sm: 80 },
              px: { xs: 1, sm: 2 },
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              color: 'white',
              textAlign: 'center',
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
                      {data.team2.name?.toLowerCase().includes('fayna') && matchIsOver && (
                        <Box
                          className="team-extra"
                          sx={{
                            mt: '0.3rem',
                            fontSize: '1.1rem',
                            fontWeight: 300,
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem',
                            alignItems: { xs: 'center', sm: 'flex-start' },
                            textAlign: { xs: 'center', sm: 'left' },
                          }}
                        >
                          {data?.mvp && <div>⭐ MVP {data.mvp.last_name}</div>}
                          {data?.scorers_fayna && data.scorers_fayna.split(',').map((name, i) => (
                            <div key={i}>⚽ {name.trim()}</div>
                          ))}
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
              <span>{data?.tournament?.address}</span>
            </Box>
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