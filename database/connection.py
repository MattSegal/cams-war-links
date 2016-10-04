from flask import g
from mysql import connector as sql

class Connection:
    def __init__(self,app_config):
        self.config = {
            'user': app_config["DB_USER"],
            'host': app_config["DB_HOST"],
            'database': app_config["DB_NAME"]
        }
        if app_config["DB_PASSWORD"]:
            self.config['password'] = app_config["DB_PASSWORD"]

    def get_cursor(self):
        """ Opens a new database connection if there is none yet
            for the current application context
        """ 
        con = getattr(g, '_database', None)

        if con is None:
            g._database = sql.connect(**self.config)

        cur = g._database.cursor(dictionary=True)
        return cur

    def disconnect(self):
        """ Close the database connection at the end of a request
        """
        if hasattr(g,'_database') and g._database:
            g._database.commit()
            g._database.close()
