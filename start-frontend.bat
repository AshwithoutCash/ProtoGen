@echo off
echo Starting Proto-Gen Frontend...
echo.

cd frontend

if not exist node_modules (
    echo Installing dependencies...
    echo This may take a few minutes...
    call npm install
)

echo.
echo Starting Vite development server...
echo Frontend will be available at http://localhost:5173
echo.

call npm run dev
