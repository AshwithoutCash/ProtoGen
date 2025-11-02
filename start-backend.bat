@echo off
echo Starting Proto-Gen Backend...
echo.

cd backend

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate

if not exist .env (
    echo WARNING: .env file not found!
    echo Please copy .env.example to .env and add your API keys.
    pause
    exit /b 1
)

echo Installing/updating dependencies...
pip install -r requirements.txt --quiet

echo.
echo Starting FastAPI server...
echo Backend will be available at http://localhost:8000
echo API documentation at http://localhost:8000/docs
echo.

python main.py
