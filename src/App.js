import { MainBg, Navbar, StatusBar } from './components';

function App() {

  const testProps = {
    title: '상명대학교 홈페이지',
    url: 'https://www.smu.ac.kr/kor/index.do',
    statusMsg: '정상 작동 중',
    statusColor: '#12ae41'
  }

  return (
    <>
      <Navbar/>
      <MainBg>
        <StatusBar
          title={ testProps.title }
          url={ testProps.url }
          statusMsg={ testProps.statusMsg }
          statusColor={ testProps.statusColor }
        ></StatusBar>
        <StatusBar
          title={ testProps.title }
          url={ testProps.url }
          statusMsg={ testProps.statusMsg }
          statusColor={ testProps.statusColor }
        ></StatusBar>
      </MainBg>
    </>
  );
}

export default App;
