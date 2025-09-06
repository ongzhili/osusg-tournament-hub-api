import firebase_admin
from dotenv import load_dotenv
from firebase_admin import credentials, firestore
import os
from datetime import datetime

load_dotenv()
cred = credentials.Certificate("./firebase_test_server.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def copyDay(frm, to):
  # date_str = datetime.now().strftime("%d%m%y")
  src_ref = db.collection("users").document(frm)
  dst_ref = db.collection("users").document(to)
  copy_document_recursive(src_ref, dst_ref)
  print(f"✅ Document '{frm}' copied to '{to}' (with all subcollections).")

def copy_document_recursive(src_ref, dest_ref):
  # 1. Copy the main document data
  src_doc = src_ref.get()
  if src_doc.exists:
      dest_ref.set(src_doc.to_dict())

  # 2. Copy all subcollections recursively
  collections = src_ref.collections()
  for collection in collections:
      for doc in collection.stream():
          new_dest_doc = dest_ref.collection(collection.id).document(doc.id)
          copy_document_recursive(collection.document(doc.id), new_dest_doc)


copyDay("060925", "010925")

