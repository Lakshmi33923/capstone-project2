from fastapi import FastAPI
from database import SessionLocal
from sqlalchemy import text

app = FastAPI()

@app.get("/")
def home():
    return {"message": "API working 🚀"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/fastapi/employee")
def get_employee(name: str):
    db = SessionLocal()

    try:
        result = db.execute(
            text("""
                SELECT id, name, role, department, salary, email, location
                FROM employees
                WHERE name = :name
            """),
            {"name": name}
        ).fetchone()

        if result:
            return {
                "status": "success",
                "message": "Employee found",
                "data": {
                    "id": result[0],
                    "name": result[1],
                    "role": result[2],
                    "department": result[3],
                    "salary": result[4],
                    "email": result[5],
                    "location": result[6]
                }
            }

        return {
            "status": "failed",
            "message": "Employee not found",
            "data": None
        }

    finally:
        db.close()
