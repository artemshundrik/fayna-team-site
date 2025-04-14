import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';
import 'dotenv/config';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;
console.log('✅ API KEY used:', YOUTUBE_API_KEY);

const CHANNEL_ID = 'UC2GEAQobT_BSe2bFZFJVOAg'; // REJO UA

const cache: {
  timestamp: number;
  data: any;
} = {
  timestamp: 0,
  data: null,
};

const CACHE_TTL = 10 * 60 * 1000; // 10 хвилин

const handler: Handler = async () => {
  if (Date.now() - cache.timestamp < CACHE_TTL && cache.data) {
    console.log('⚡ Using cached result');
    return {
      statusCode: 200,
      body: JSON.stringify(cache.data),
    };
  }

  try {
    // 1. Знайти live трансляцію
    const liveRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${YOUTUBE_API_KEY}`
    );
    const liveData = await liveRes.json();
    console.log('🔴 Live Data:', JSON.stringify(liveData, null, 2));

    if (liveData.items && liveData.items.length > 0) {
      const live = liveData.items[0];
      cache.timestamp = Date.now();
      cache.data = {
        status: 'live',
        title: live.snippet.title,
        url: `https://www.youtube.com/watch?v=${live.id.videoId}`,
      };
      return {
        statusCode: 200,
        body: JSON.stringify(cache.data),
      };
    }

    // 2. Якщо немає live, шукаємо завершене відео з рахунком у назві
    const finishedRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=10&order=date&type=video&key=${YOUTUBE_API_KEY}`
    );
    const finishedData = await finishedRes.json();
    console.log('📼 Finished Videos:', JSON.stringify(finishedData, null, 2));

    const matchWithScore = finishedData.items.find((item: any) => {
      return /\b\d+\s*[-:]\s*\d+\b/.test(item.snippet.title) && 
      ['FAYNA TEAM', 'ФАЙНА', 'Файна', 'Fayna'].some(alias =>
        item.snippet.title.toLowerCase().includes(alias.toLowerCase())
      );
    });

    if (matchWithScore) {
      console.log('✅ Match with score found:', matchWithScore.snippet.title);
      const scoreMatch = matchWithScore.snippet.title.match(/\b(\d+)\s*[-:]\s*(\d+)\b/);
      const homeScore = scoreMatch ? parseInt(scoreMatch[1]) : null;
      const awayScore = scoreMatch ? parseInt(scoreMatch[2]) : null;

      cache.timestamp = Date.now();
      cache.data = {
        status: 'finished',
        title: matchWithScore.snippet.title,
        homeScore,
        awayScore,
        url: `https://www.youtube.com/watch?v=${matchWithScore.id.videoId}`,
      };
      return {
        statusCode: 200,
        body: JSON.stringify(cache.data),
      };
    }

    cache.timestamp = Date.now();
    cache.data = { status: 'no-match' };
    console.log('📦 Cache set:', JSON.stringify(cache.data, null, 2));
    return {
      statusCode: 200,
      body: JSON.stringify(cache.data),
    };
  } catch (error) {
    if (cache.data && cache.data.status !== 'no-match') {
      console.warn('⚠️ API quota exceeded, returning cached data');
      return {
        statusCode: 200,
        body: JSON.stringify(cache.data),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', detail: error }),
    };
  }
};

export { handler };