// src/views/Home/HomeMain/HomeMain.js
import React from 'react';
import Banner from '../../../components/Banner/Banner';
import MovieRow from '../../../components/MovieRow/MovieRow';
import URLService from '../../../services/URLService';
import { useQuery } from '@tanstack/react-query';

function HomeMain() {
  const urlService = new URLService();

  // 인기 영화 데이터를 패칭하고 첫 번째 영화를 featuredMovie로 설정
  const { data: featuredMovie, isLoading, isError, error } = useQuery({
    queryKey: ['featuredMovies'],
    queryFn: () => urlService.fetchPopularMovies(1),
    select: (data) => data[0], // 첫 번째 영화를 선택
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터 신선하게 유지
    cacheTime: 1000 * 60 * 30, // 30분 동안 캐시 유지
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>영화를 불러오는 중 오류가 발생했습니다: {error.message}</p>;

  return (
    <div>
      <Banner movie={featuredMovie} />
      <MovieRow title="대세 콘텐츠" fetchUrl={urlService.getURL4PopularMovies()} />
      <MovieRow title="최신 콘텐츠" fetchUrl={urlService.getURL4ReleaseMovies()} />
      {/* 필요한 만큼 MovieRow 추가 */}
    </div>
  );
}

export default HomeMain;
