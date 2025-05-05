import { useState, useEffect, useMemo } from 'react';
import { MainBg, Navbar, StatusBar, Footer } from './components';
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
      const promises = siteInfos.map((siteInfo, index) => {
        return axios
          .get(`${URL_ROOT}${siteInfo.endpoint}`)
          .then((response) => {
            const { status, message, responseTime } = response.data;
            let color = '#f0ad4e'; // default yellow
            if (status === 'ok') color = '#5cb85c'; // green
            else if (status === 'timeout' || status === 'error') color = '#d9534f'; // red

            setStatusData((prevData) => {
              const newData = [...prevData];
              newData[index] = { statusMsg: message, statusColor: color, responseTime: responseTime === 'N/A' ? `${responseTime}` : `${responseTime}ms` };
              return newData;
            });
          })
          .catch((error) => {
            let statusMsg = '상태 점검 실패';
            let statusColor = '#d9534f'; // red
            let responseTime = '점검 실패';

            if (error.response && error.response.status === 429) {
              statusMsg = '잠시 후 시도';
              responseTime = 'N/A';
            } else if (error.code === 'ECONNABORTED') {
              statusMsg = '매우 느림(비정상)';
              responseTime = 'N/A';
            }

            setStatusData((prevData) => {
              const newData = [...prevData];
              newData[index] = { statusMsg, statusColor, responseTime };
              return newData;
            });
          });
      });

      await Promise.all(promises);
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
            href={siteInfo.url}
            statusMsg={statusData[index]?.statusMsg || '서버 확인 중...'}
            statusColor={statusData[index]?.statusColor || '#f0ad4e'}
            responseTime={statusData[index]?.responseTime || '응답 확인 중...'}
          />
        ))}
      </MainBg>
      <Footer/>
    </>
  );
}

export default App;
