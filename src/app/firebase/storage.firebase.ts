import { app } from './app.firebase'
import { getStorage } from 'firebase/storage'

export const storage = getStorage(app)