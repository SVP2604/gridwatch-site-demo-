# gridwatch-site

그리드워치의 **정적 공개 사본**입니다. GitHub Pages로 제공하기 위한 빌드 결과물만
담고 있습니다.

| 파일 | 내용 |
|---|---|
| `index.html` | 사내망 접속 진단 페이지 |
| `demo.html` | AI 기능 예시 화면 (서버·API 불필요) |

소스코드는 이 저장소에 없습니다. 비공개 저장소에서 `scripts/build-static.mjs`로
생성해 여기에 복사합니다. API 키·데이터베이스 접속정보 등 비밀값은 어느 저장소에도
포함되지 않으며 Vercel 환경변수에만 보관합니다.

실제 서비스: https://gridwatch-nine.vercel.app/
