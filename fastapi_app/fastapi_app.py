from fastapi import FastAPI

app = FastAPI()

# Root check
@app.get("/")
def home():
    return {"message": "FastAPI working 🚀"}

# Health check (used by nginx / monitoring)
@app.get("/health")
def health():
    return {"status": "ok"}

# Employee API (simple version - NO DB for now)
@app.get("/fastapi/employee")
def get_employee(name: str):
    return {
        "message": "Employee API working",
        "name": name
    }
