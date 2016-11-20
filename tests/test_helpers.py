import uuid

class TestData:
    def __init__(self):
        # Link
        self.link_url = 'http://example.com/?' + str(uuid.uuid4())
        self.link_title = 'test title ' + str(uuid.uuid4())

        # User
        self.username = str(uuid.uuid4())[:8].lower()
        # title() doesn't work with numbers 
        # so we have to implement it manually
        self.username = self.username[0].upper() + self.username[1:].lower()