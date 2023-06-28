import { app } from './app.firebase'
import { FirebaseStorage,getStorage } from 'firebase/storage'

export const storage:FirebaseStorage = getStorage(app)