# 全民大寫經：專案資料夾結構規劃
![alt text](prototype_infrastructure.png)
在專案根目錄下，我們將前端、Go 核心 API、Python AI 背景服務與基礎設施 (DevOps) 明確拆分。

### 根目錄結構 (Root)

```text
national-sutra-project/
├── frontend/                 # 網站前端 (React.js + TailwindCSS)
├── backend-api-go/           # 核心後端 API (Go / Gin) - 處理高併發與資料庫讀寫
├── backend-worker-python/    # AI 與影音背景微服務 (Python / FastAPI)
├── infra/                    # 基礎設施與部署設定 (Docker, K8s, Nginx)
├── docs/                     # 專案文件 (PRD, Proposal, API 規格)
├── .gitignore
└── docker-compose.yml        # 本地端一鍵啟動所有服務的設定檔
```

### 展開目錄結構
```
frontend/
├── public/                   # 靜態資源 (如 favicon, 全域通用圖檔)
├── src/
│   ├── assets/               # 樣式、字體、需編譯的圖檔
│   ├── components/           # 共用 UI 元件 (如 Button, Modal, 經文格子)
│   ├── features/             # 依功能模組劃分 (如 auth, sutra-scroll, upload)
│   ├── hooks/                # 自訂 React Hooks (如 useAuth, useAudioPlayer)
│   ├── layouts/              # 頁面佈局 (如 Header, Footer, 卷軸容器)
│   ├── pages/                # 路由頁面 (如 Home, SutraViewer, Profile)
│   ├── services/             # 封裝 API 呼叫 (Axios 或 Fetch 設定)
│   ├── store/                # 全域狀態管理 (Zustand 或 Redux)
│   ├── types/                # TypeScript 型別定義檔
│   ├── utils/                # 共用工具函式 (如時間格式化、防呆檢查)
│   ├── App.tsx               # 前端主程式進入點
│   └── main.tsx
├── package.json
├── tailwind.config.js        # TailwindCSS 設定檔
└── tsconfig.json

backend-api-go/
├── cmd/
│   └── api/                  # 程式進入點 (main.go 所在位置)
├── internal/                 # 核心業務邏輯 (不對外暴露)
│   ├── config/               # 環境變數與設定載入 (資料庫、Redis 連線)
│   ├── handlers/             # HTTP 請求接收與回應 (Controller)
│   ├── middlewares/          # 中介軟體 (如 JWT 驗證, CORS, Rate Limiting)
│   ├── models/               # 資料庫結構與 GORM/SQLc 定義
│   ├── repositories/         # 封裝資料庫操作 (CRUD)
│   └── services/             # 核心商業邏輯 (如判斷字元是否被鎖定)
├── pkg/                      # 可供外部專案共用的自訂函式庫
├── go.mod
└── go.sum

backend-worker-python/
├── app/
│   ├── api/                  # FastAPI 路由與端點
│   ├── core/                 # 設定檔 (如 GCP 憑證、密鑰配置)
│   ├── models/               # Pydantic 資料驗證與資料庫模型
│   ├── services/
│   │   ├── vision_ai.py      # GCP Cloud Vision API 整合 (圖片審核)
│   │   ├── nlp_ai.py         # GCP Natural Language API 整合 (文字審核)
│   │   ├── speech_ai.py      # GCP Speech-to-Text 整合 (聲音審核)
│   │   └── audio_merger.py   # FFmpeg 音檔無縫合併邏輯
│   ├── worker/               # 背景任務處理者 (接收 Go 傳來的任務)
│   │   └── celery_app.py     
│   └── main.py               # FastAPI 主程式進入點
├── requirements.txt          # Python 套件依賴清單
└── Dockerfile

infra/
├── docker/                   # 各服務的 Dockerfile (若不放在各專案根目錄)
├── k8s/                      # Kubernetes 部署設定 (Deployment, Service)
├── nginx/                    # 反向代理與 CDN 本地模擬設定
│   └── nginx.conf
└── db/                       # 資料庫初始化腳本 (建表 SQL、預設 500 萬字元資料)
    ├── init_schema.sql
    └── seed_data.sql
```

# Git Flow
## 分支命名規範 (Branch Naming Convention)

採用「功能導向 + 影響範圍 (Scope)」的命名方式，以利團隊快速識別分支負責的模組。

### 命名格式
`<type>/<scope>-<description>`  
提示：分支命名與 Commit 訊息的格式不同  
分支 (Branch / Push 使用): feat/worker-audio-hls-pipeline (無空白)  
提交 (Commit Message 使用): feat(worker): add audio hls pipeline 

### Type 定義
- `feat`: 新增功能  
- `fix`: 修復錯誤  
- `refactor`: 程式碼重構 (不改變既有業務邏輯)  
- `chore`: 建置過程、輔助工具或環境設定更新  
- `docs`: 文件修改或更新  

### Scope 定義（嚴格對應專案資料夾結構）
- `web`: 對應 `frontend/`  
- `api`: 對應 `backend-api-go/`  
- `worker`: 對應 `backend-worker-python/`  
- `infra`: 對應 `infra/`  

---
## 提交訊息規範 (Commit Message Convention)

嚴格遵循 Conventional Commits 規範，以利後續自動生成 Changelog 並追蹤歷史。

提交格式:
`<type>(<scope>): <subject>`

提交範例:
```
feat(worker): integrate GCP Vision API for image moderation

fix(api): resolve race condition in character lock mechanism

refactor(web): extract sutra grid component for reusability

chore(infra): update docker-compose with minio storage configuration
```

## push 命名範例
```
feat/worker-audio-hls-pipeline
feat/api-redis-distributed-lock
fix/web-scroll-memory-leak
chore/infra-rabbitmq-cluster
```
---

## 專案分支架構與開發流程 (Git Flow)

針對本微服務架構，採用「簡化版 Git Flow (GitHub Flow 變體)」，兼顧整合測試穩定性與發布效率。

### 核心分支
- `main`: 正式環境 (Production)，隨時處於可部署且穩定的狀態  
- `develop`: 整合測試環境 (Staging)，所有功能分支開發完畢後，先合併至此進行跨模組聯調  

---

### 標準開發流程

### 1️⃣ 同步最新整合分支
```bash
git checkout develop
git pull origin develop
```
### 2️⃣ 建立功能分支
`git checkout -b feat/worker-vision-moderation`

### 3️⃣ 進行開發並提交（遵循 Commit 規範）

### 4️⃣ 推送
`git push origin feat/worker-vision-moderation`

### 5️⃣ 發起 Pull Request (PR)
`目標分支：develop`

### 6️⃣ Code Review 通過後合併至 develop

### 7️⃣ 發布流程
`測試無誤後，由管理者將 develop 合併至 main`