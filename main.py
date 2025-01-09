from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS設定
origins = [
    "*",  # 必要に応じて特定のオリジンを指定
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # 許可するオリジン
    allow_credentials=True,
    allow_methods=["*"],          # 許可するHTTPメソッド
    allow_headers=["*"],          # 許可するHTTPヘッダー
)

@app.post("/echo")
async def echo(request: Request):
    data = await request.json()
    print("Received data:", data)
    return JSONResponse(content={
        "status": "OK",
        "receivedData": data
    })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
