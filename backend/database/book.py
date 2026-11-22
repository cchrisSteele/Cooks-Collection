

schema_book = """
book_id TEXT PRIMARY KEY NOT NULL,
title TEXT NOT NULL,
author TEXT NOT NULL,
description TEXT,
image_url TEXT,
"""



class Book:
    def __init__(self, book_id, title, author, description=None, image_url=None):
        self.book_id = book_id
        self.title = title
        self.author = author
        self.description = description
        self.image_url = image_url

    @staticmethod
    def getRow(book_id):
        pass
    