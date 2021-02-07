import * as Realm from 'realm'

import { realmAppId } from './config'

// import { productSchema, userSchema } from './schemas'

export const openSession = async () => {
	const app = new Realm.App({ id: realmAppId })

	const credentials = Realm.Credentials.anonymous()
	try {
		const user = await app.logIn(credentials)
		console.log(`Logged in with the user id: ${user.id}`)

		const realm = await Realm.open({
			// schema: [productSchema, userSchema],
			sync: {
				user,
				partitionValue: 'owner_id'
			}
		})
		return realm
	} catch (err) {
		console.error('Failed to log in', err)
		throw new Error(err)
	}
}
