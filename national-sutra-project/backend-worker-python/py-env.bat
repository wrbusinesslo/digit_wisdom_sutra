@echo off
chcp 65001 >nul
echo ===================================================
echo   全民大寫經 - Python Worker 環境自動安裝與啟動腳本
echo ===================================================
echo.

echo [步驟 1] 檢查 Python 環境是否已安裝...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [提示] 系統找不到 Python，準備為您自動下載並安裝！
    echo 正在從官方網站下載 Python 3.11 安裝檔 (這需要一點時間，請耐心等候)...
    curl -o python_installer.exe https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe
    
    echo 下載完成！正在背景執行靜默安裝...
    echo (安裝期間不會有任何畫面，請勿關閉視窗)
    :: /quiet=靜默安裝, PrependPath=1=自動將Python加入環境變數PATH
    start /wait python_installer.exe /quiet InstallAllUsers=0 PrependPath=1 Include_test=0
    
    echo 清理安裝檔...
    del python_installer.exe
    
    echo.
    echo ===================================================
    echo [成功] Python 已全自動安裝完成！
    echo ⚠️ 由於 Windows 系統限制，您必須「關閉這個黑色視窗」，
    echo ⚠️ 然後再次「點擊執行 setup.bat」，才能讓系統載入新環境。
    echo ===================================================
    pause
    exit /b 0
)
python --version

echo.
echo [步驟 2] 更新系統的 pip 套件管理工具...
python -m pip install --upgrade pip

echo.
echo [步驟 3] 安裝現代 Python 套件管理工具 Poetry...
python -m pip install poetry

echo.
echo [步驟 4] 讀取 pyproject.toml，自動建立虛擬環境並安裝專案套件...
python -m poetry install

echo.
echo ===================================================
echo   環境安裝已全部完成！
echo   請確認上方步驟無紅字報錯。按任意鍵將啟動伺服器...
echo ===================================================
pause >nul

echo.
echo [步驟 5] 啟動 FastAPI 伺服器 (按下 Ctrl+C 可強制終止)...
python -m poetry run uvicorn app.main:app --reload --port 8000