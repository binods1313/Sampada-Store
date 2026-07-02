@echo off
cd /d E:\Sampada-Store

echo Stopping any running dev servers...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul

echo Cleaning up...
rmdir /s /q node_modules 2>nul
rmdir /s /q .next 2>nul
del package-lock.json 2>nul
del yarn.lock 2>nul

echo Clearing npm cache...
npm cache clean --force 2>nul

echo Installing dependencies...
npm install --legacy-peer-deps

echo.
echo Installation complete!
echo You can now run: npm run dev
pause
