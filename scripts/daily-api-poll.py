import firebase_admin
from ossapi import Ossapi, UserLookupKey, GameMode, RankingType
from dotenv import load_dotenv
from firebase_admin import credentials, firestore
import os
from datetime import datetime

load_dotenv()


def getUsers():
  client_id, client_secret = os.getenv("osuapi_client_id"), os.getenv("osuapi_client_secret")
  api = Ossapi(client_id, client_secret)

  users = []
  cursor = None
  for i in range(20):
      test1 = api.ranking(GameMode.OSU, RankingType.PERFORMANCE, country='SG', cursor=cursor)
      cursor = test1.cursor
      for usr in test1.ranking:
          if not usr.user.is_restricted:
            users.append((usr.pp, 
                          usr.user.username, 
                          usr.global_rank, 
                          usr.user.id,
                          ))
  return users

def postToDB(users):
    # Firebase
    cred = credentials.Certificate("./firebase_cert.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()

    users.sort(key=lambda x: x[2])
    
    date_str = datetime.now().strftime("%d%m%y")
    for idx, (pp, username, global_rank, userid) in enumerate(users, start=1):
        doc_ref = db.collection("users").document(date_str).collection("users").document(str(userid))
        doc_ref.set({
            "pp": pp,
            "username": username,
            "global_rank": global_rank,
            "id": userid,
            "country_rank": idx  # Add serial number
        })
    print(f"Inserted {len(users)} users into users/{date_str}/users/")

users = getUsers()
postToDB(users)

