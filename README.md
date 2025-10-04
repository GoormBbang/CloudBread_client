# Frontend (React Native + Expo Web)

## 📁 파일 구조

```
CloudBread_client/
├── src/                # 소스 코드
├── Dockerfile          # 웹 배포용 컨테이너
├── deployment.yaml     # Deployment + Service
├── ingress.yaml        # Frontend 전용 Ingress
└── README.md           # 이 파일
```

## 🚀 로컬 개발

```bash
# 의존성 설치
npm install

# 웹 개발 서버
npm run web

# iOS/Android
npm run ios
npm run android
```

## 🐳 빌드 & 배포

```bash
# 1. 웹 빌드
npm run build:web

# 2. 멀티 아키텍처 이미지 빌드 & 푸시
docker buildx build --platform linux/amd64,linux/arm64 \
  -t yunseocloud/cloudbread-frontend:latest \
  --push .

# 3. K8s 배포
kubectl apply -f deployment.yaml
kubectl apply -f ingress.yaml

# 4. 강제 재배포 (latest 태그 사용 시)
kubectl rollout restart deployment cloudbread-frontend -n frontend
```

## 🌐 접속 URL

- **Production**: `http://cloudbread.133.186.213.185.nip.io/`

## 📋 Ingress 설정

- **경로**: `/` (루트)
- **네임스페이스**: `frontend`
- **우선순위**: 가장 낮음 (마지막에 매칭되는 catch-all)
