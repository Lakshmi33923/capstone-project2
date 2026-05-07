from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DB_USER = "admin"
DB_PASSWORD = "lakshmi123"
DB_HOST = "database-3.c7mqa0oysclm.ap-south-1.rds.amazonaws.com"
DB_PORT = "3306"
DB_NAME = "employee_db"

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
