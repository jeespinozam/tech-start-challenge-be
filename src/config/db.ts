import { MongoClient } from 'mongodb'

import { RemoteCollections } from '../@types/etlTypes'
import { environment } from '../environment'

const uri = `mongodb+srv://${environment.DB_USER}:${environment.DB_PASS}@cluster0.zfqjv.mongodb.net/${environment.DB_NAME}?retryWrites=true&w=majority`
let client: MongoClient
export const openMongoSession = async (): Promise<RemoteCollections> => {
	try {
		client = new MongoClient(uri, { useUnifiedTopology: true })
		// Connect to the MongoDB cluster
		const conn = await client.connect()
		const db = conn.db()
		const collections = {
			user: db.collection('user'),
			product: db.collection('product'),
			invoice: db.collection('invoice')
		}
		return collections
	} catch (e) {
		console.log(e)
		throw e
	}
}

export const closeMongoSession = async () => {
	await client.close()
}
