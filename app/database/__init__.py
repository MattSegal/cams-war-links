from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from app import Config


connection_string = 'mysql+pymysql://{user}:{password}@{host}/{database}'.format(
    user=Config.DB_USER,
    password=Config.DB_PASSWORD,
    host=Config.DB_HOST,
    database=Config.DB_NAME)

engine = create_engine(connection_string,echo=Config.DEBUG, convert_unicode=True)
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()

def init_db():
    import app.api.models.user_model
    import app.api.models.link_model
    Base.metadata.create_all(bind=engine)

