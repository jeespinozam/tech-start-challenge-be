import 'source-map-support/register'

import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { Unique } from './src/@types/etlTypes'
import { invoice, product, user } from './src/@types/reportTypes'
import { closeMongoSession, openMongoSession } from './src/config/db'
import { extractTransform } from './src/etl/extractTransform'
import { getOptions } from './src/report/getFilters'
import { ReportQueryParam } from './src/utils/enums'
import { buildReponse } from './src/utils/handleResponse'

export const report: APIGatewayProxyHandler = async (event, _context) => {
	let response: APIGatewayProxyResult
	try {
		const { queryStringParameters } = event
		const groupedBy = queryStringParameters.groupedBy as ReportQueryParam

		// get the mongo pipelines
		const options = getOptions(groupedBy)

		// run the query
		const db = await openMongoSession()
		const invoices = await db.invoice.aggregate(options).toArray()

		response = buildReponse(200, invoices, 'Invoices from db')
	} catch (error) {
		console.error(error)
		response = buildReponse(400, error, error?.message)
	} finally {
		await closeMongoSession()
	}
	return response
}

export const etl: APIGatewayProxyHandler = async (_, _context) => {
	let response: APIGatewayProxyResult
	try {
		const users: (user & Unique)[] = []
		const products: (product & Unique)[] = []
		const invoices: (invoice & Unique)[] = []

		// Extract && Transform
		extractTransform(users, products, invoices)

		// Load
		const db = await openMongoSession()
		await Promise.all([
			db.user.deleteMany({ _id: { $ne: null } }),
			db.product.deleteMany({ _id: { $ne: null } }),
			db.invoice.deleteMany({ _id: { $ne: null } })
		])

		await Promise.all([
			db.user.insertMany(users),
			db.product.insertMany(products),
			db.invoice.insertMany(invoices)
		])

		response = buildReponse(200, { users, products, invoices }, 'Migration successfully')
	} catch (error) {
		console.error(error)
		response = buildReponse(400, error, error?.message)
	} finally {
		await closeMongoSession()
	}
	return response
}
