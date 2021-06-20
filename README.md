##  프로젝트 소개
node.js ws(websocket)를 이용한 실시간 퀴즈 프로그램 실시간으로 영상에 송출되는 문제로 Admin이 직접 컨트롤하며 퀴즈가 진행되는 프로그램

- 프로젝트 기간: 2021년 05월 10일 ~ 2021년 06월 04일
  - FrontEnd: 김효진, 박성은
  - BackEnd : 안정현, 정재유(PM)

## 🔧 구현한 기능
User
- 퀴즈 입장시 JWT를 이용해 발행된 Token 으로 User의 언어정보 확인 하여 언어의 맞는 영상 출력
- Admin이 퀴즈를 컨트롤 시 User의 퀴즈 플로우 작동할 수 있게 구현
- 퀴즈의 정보 API를 줄 때 정답여부와 같이 발송 하여 실시간 정답/오답 여부 확인 할 수 있도록 구현
- 퀴즈의 대한 보상내역 기능 구현

Admin
- Admin이 퀴즈 플로우를 컨트롤 할 수 있게 구현
- Admin이 실시간 으로 유저의 퀴즈 정답/오답/언어/플랫폼 통계 확인 할수 있는 기능 구현

## 구현 화면

![](https://images.velog.io/images/deonii/post/b6e30556-689b-438b-9040-08544db29ccf/login2.gif)

![](https://images.velog.io/images/deonii/post/03eb6027-db12-4e7a-91b1-f3bc424fa0e2/quizflow2.gif)

![](https://images.velog.io/images/deonii/post/5a16cad6-c0ca-4294-9977-96cf02120e13/chart2.gif)

## 🔧 기술 스택
- ![Node.js](https://img.shields.io/badge/Node.js-14354C?style=for-the-badge&logo=node.js&logoColor=white)
- ![express](https://img.shields.io/badge/express-092E20?style=for-the-badge&logo=express&logoColor=white)
- ![Postgresql](https://img.shields.io/badge/Postgresql-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

## 🔧 협업 도구
- <img alt="Notion" src="https://img.shields.io/badge/Notion-000000?&style=for-the-badge&logo=Notion&logoColor=white"/>
- <img alt="Git" src="https://img.shields.io/badge/git-%23F05033.svg?&style=for-the-badge&logo=git&logoColor=white"/>
- <img alt="GitHub" src="https://img.shields.io/badge/github-%23121011.svg?&style=for-the-badge&logo=github&logoColor=white"/>
- <img alt="Slack" src="https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white" />


## ❗️ 레퍼런스
이 프로젝트는 학습목적으로 만들었습니다. 실무수준의 프로젝트이지만 학습용으로 만들었기 때문에 이 코드를 활용하여 이득을 취하거나 무단 배포할 경우 법적으로 문제될 수 있습니다.
