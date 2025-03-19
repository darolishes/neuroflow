@echo off
setlocal enabledelayedexpansion

:: Configuration
set ORIGINAL_PROJECT_NAME=my-nextjs-template  :: Update this to match your template's name

:: Get user input
set /p PROJECT_NAME="Enter new project name: "
set /p DEST_DIR="Enter destination path (relative to current directory): "

:: Resolve full destination path
set "FULL_DEST_PATH=%cd%\%DEST_DIR%"

:: Check if directory exists
if exist "%FULL_DEST_PATH%" (
    set /p OVERWRITE="Directory already exists. Overwrite? (y/n): "
    if /i not "!OVERWRITE!"=="y" (
        echo Operation cancelled.
        exit /b 1
    )
    rmdir /s /q "%FULL_DEST_PATH%"
)

:: Copy project files
echo Creating directory structure...
mkdir "%FULL_DEST_PATH%"
echo Copying project files (excluding node_modules and Git files)...
robocopy . "%FULL_DEST_PATH%" /E /H /XD node_modules .git /XF .env* /NFL /NDL /NJH /NJS /nc /ns /np
copy .env.template "%FULL_DEST_PATH%"

:: Replace project name in files
echo Updating project name in files...
powershell -Command "Get-ChildItem -Path '%FULL_DEST_PATH%' -Include *.json,*.md,*.ts,*.tsx -Recurse | ForEach-Object { (Get-Content $_ -Raw).Replace('%ORIGINAL_PROJECT_NAME%', '%PROJECT_NAME%') | Set-Content $_ }"

echo ✅ Project cloned successfully to %FULL_DEST_PATH%
echo.
echo 🚀 Next steps:
echo 1. Create environment file:
echo    copy .env.template .env.local
echo 2. Install dependencies:
echo    cd %DEST_DIR% ^&^& npm install
echo 3. Configure Supabase:
echo    - Create project at https://supabase.com
echo    - Update .env.local with your credentials
echo 4. Start development server:
echo    npm run dev
echo.
echo 💡 After setup, visit http://localhost:3000 to see the login screen! 