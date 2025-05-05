import { useState, useEffect } from 'react';
import { MainBg, Navbar, StatusBar } from './components';
import axios from 'axios';

function App() {
  const [statusData, setStatusData] = useState([
    { statusMsg: null, statusColor: '#f0ad4e', responseTime: null },
    { statusMsg: null, statusColor: '#f0ad4e', responseTime: null },
    { statusMsg: null, statusColor: '#f0ad4e', responseTime: null }
  ]);

  const URL_ROOT = 'https://smu-server-status-viewer-be.onrender.com';

  const siteInfos = [
    { title: '상명대학교 홈페이지', url: 'https://www.smu.ac.kr/kor/index.do', endpoint: '/status/home'},
    { title: '상명대학교 이캠퍼스', url: 'https://ecampus.smu.ac.kr/', endpoint: '/status/ecampus'},
    { title: '상명대학교 통합공지', url: 'https://www.smu.ac.kr/kor/life/notice.do', endpoint: '/status/notice'},
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          siteInfos.map(siteInfo =>
            axios.get(`${URL_ROOT}${siteInfo.endpoint}`, {
              headers: {
                'x-api-key': process.env.REACT_APP_API_KEY
              },
              withCredentials: true,
              maxRedirects: 0,
            })
          )
        );

        const newStatusData = responses.map(response => {
          const { status, message, responseTime } = response.data;

          let color = '#f0ad4e';  // default yellow
          if (status === 'ok') color = '#5cb85c';  // green
          else if (status === 'timeout') color = '#d9534f';  // red

          return {
            statusMsg: message,
            statusColor: color,
            responseTime: `${responseTime}ms`
          };
        });

        setStatusData(newStatusData);
      } catch (error) {
        console.error('서버 상태 요청 중 오류 발생:', error);
      }
    };

    fetchData();

  }, []);

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
