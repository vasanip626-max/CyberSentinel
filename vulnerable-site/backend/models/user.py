from database.db import users


def create_user(user):

    return users.insert_one(user)


def get_user(email):

    return users.find_one({

        "email": email

    })