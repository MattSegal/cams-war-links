from sqlalchemy import exists
from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.mysql import VARCHAR
from app.database import Base, db_session

class Link(Base):
    __tablename__ = 'links'

    id      = Column(Integer, primary_key=True)
    url     = Column(VARCHAR(500))
    title   = Column(VARCHAR(500))
    user    = Column(VARCHAR(20))

    def __init__(self,id=None,url=None,title=None,user=None):
        self.id     = id
        self.url    = url
        self.title  = title
        self.user   = user

    def __repr__(self):
        return "<Link(id = '%s', title='%s', user='%s', url='%s')>" % (self.id,self.title,self.user,self.url)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def create(self):
        db_session.add(self)
        db_session.commit()

    def delete(self):
        Link.query.filter_by(id=self.id).delete()
        db_session.commit()

    def update(self):
        assert self.id
        Link.__table__\
            .update()\
            .where(Link.id==self.id)\
            .values(title=self.title,url=self.url)
        db_session.commit()

    def exists(self):
        return db_session.query(exists().where(Link.id==self.id)).scalar()

    def is_valid(self):
        return self.url and self.title

