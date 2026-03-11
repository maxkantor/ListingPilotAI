#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

echo "🚀 ListingPilot AI - Quick Start"
echo "=================================="
echo ""

# Check prerequisites
echo "✓ Checking prerequisites..."

if ! command -v dotnet &> /dev/null; then
    echo "✗ .NET SDK not found. Install from https://dotnet.microsoft.com/download"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "✗ Node.js not found. Install from https://nodejs.org"
    exit 1
fi

echo "✓ .NET and Node.js detected"
echo ""

# Start backend
echo "📦 Starting backend (port 5000)..."
cd "$BACKEND_DIR"

# Check if packages need restoring
if [ ! -d "src/ListingPilot.Api/bin" ]; then
    echo "  Installing .NET packages..."
    dotnet restore
fi

echo ""
echo "Starting backend server..."
dotnet run --project src/ListingPilot.Api &
BACKEND_PID=$!

# Wait for backend to start
echo "  Waiting for backend to start..."
sleep 5

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "✗ Backend failed to start"
    exit 1
fi

echo "✓ Backend running (PID: $BACKEND_PID)"
echo ""

# Start frontend
echo "⚛️  Starting frontend (port 3000)..."
cd "$FRONTEND_DIR"

if [ ! -d "node_modules" ]; then
    echo "  Installing npm packages..."
    npm install --legacy-peer-deps
fi

echo ""
echo "Starting dev server..."
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 5

if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "✗ Frontend failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "✓ Frontend running (PID: $FRONTEND_PID)"
echo ""

# Display info
echo "=================================="
echo "✓ ListingPilot AI is running!"
echo "=================================="
echo ""
echo "📱 Frontend:  http://localhost:3000"
echo "🔌 Backend:   http://localhost:5000"
echo "📚 API Docs:  http://localhost:5000/swagger"
echo ""
echo "Press CTRL+C to stop both services"
echo ""

# Handle cleanup
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Stopped'" EXIT

# Wait indefinitely
wait
