from sqlalchemy import exists
from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.mysql import VARCHAR
from app.database import Base, db_session

class User(Base):
    __tablename__ = 'users'

    id      = Column(Integer, primary_key=True)
    name    = Column(VARCHAR(20))

    def __init__(self,name=None):
        self.name = name

    def __repr__(self):
        return "<User(name='%s')>" % (self.name)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def create(self):
        db_session.add(self)
        db_session.commit()

    def delete(self):
        User.query.filter_by(name=self.name).delete()
        db_session.commit()

    def exists(self):
        return db_session.query(exists().where(User.name==self.name)).scalar()

