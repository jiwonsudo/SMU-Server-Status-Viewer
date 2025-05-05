import { useState, useEffect, useMemo } from 'react';
import { MainBg, Navbar, StatusBar } from './components';
import axios from 'axios';

function App() {
  const [statusData, setStatusData] = useState([
    { statusMsg: null, statusColor: '#f0ad4e', responseTime: null },
    { statusMsg: null, statusColor: '#f0ad4e', responseTime: null },
    { statusMsg: null, statusColor: '#f0ad4e', responseTime: null }
  ]);

  const URL_ROOT = 'https://smu-server-status-viewer-be.onrender.com';

  const siteInfos = useMemo (() => {
    return [
    { title: '상명대학교 홈페이지', url: 'https://www.smu.ac.kr/kor/index.do', endpoint: '/status/home'},
    { title: '상명대학교 이캠퍼스', url: 'https://ecampus.smu.ac.kr/', endpoint: '/status/ecampus'},
    { title: '상명대학교 통합공지', url: 'https://www.smu.ac.kr/kor/life/notice.do', endpoint: '/status/notice'},
    ];
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = siteInfos.map((siteInfo, index) => {
          return axios
            .get(`${URL_ROOT}${siteInfo.endpoint}`)
            .then((response) => {
              const { status, message, responseTime } = response.data;
              let color = '#f0ad4e'; // default yellow
              if (status === 'ok') color = '#5cb85c'; // green
              else if (status === 'timeout' || status === 'error') color = '#d9534f'; // red

              return {
                index,
                statusMsg: message,
                statusColor: color,
                responseTime: responseTime === 'N/A' ? `${responseTime}ms` : `${responseTime}`,
              };
            })
            .catch((error) => {
              // error 처리
              let statusMsg = '서버 상태 점검 실패';
              let statusColor = '#d9534f'; // red
              let responseTime = '알 수 없음';

              if (error.response && error.response.status === 429) {
                statusMsg = '조금 후에 시도해 주세요.';
                responseTime = '너무 자주 새로고침 하면 서버가 힘들어요.';
              } else if (error.code === 'ECONNABORTED') {
                statusMsg = '요청 시간이 초과되었습니다.';
                responseTime = 'N/A';
              }

              return { index, statusMsg, statusColor, responseTime };
            });
        });

        // 결과를 기다리고 상태 업데이트
        const results = await Promise.all(promises);
        const newStatusData = new Array(3).fill({
          statusMsg: '서버 상태 확인 중...',
          statusColor: '#f0ad4e',
          responseTime: '응답 시간 계산 중...',
        });
        results.forEach(({ index, statusMsg, statusColor, responseTime }) => {
          newStatusData[index] = { statusMsg, statusColor, responseTime };
        });

        setStatusData(newStatusData);
      } catch (error) {
        console.error('서버 상태 요청 중 오류 발생:', error);
      }
    };

    fetchData();
  }, [siteInfos]);

  return (
    <>
      <Navbar/>
      <MainBg>
        {siteInfos.map((siteInfo, index) => (
          <StatusBar
            key={siteInfo.title}
            title={siteInfo.title}
            url={siteInfo.url}
            statusMsg={statusData[index]?.statusMsg || '서버 상태 확인 중...'}
            statusColor={statusData[index]?.statusColor || '#f0ad4e'}
            responseTime={statusData[index]?.responseTime || '응답 시간 계산 중...'}
          />
        ))}
      </MainBg>
    </>
  );
}

export default App;
