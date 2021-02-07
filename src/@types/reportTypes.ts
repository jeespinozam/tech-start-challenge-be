import { ObjectID } from 'mongodb'

export type invoice = {
	_id: ObjectID
	customer_id: ObjectID
	customer: user
	distributor: user
	detail: Array<invoice_detail>
	distributor_id: ObjectID
	invoiceNumber: number
	owner_id: string
	purchaseDate: Date
	totalPurchases: number
}

export type invoice_detail = {
	_id: ObjectID
	product: Partial<product>
	qty: number
	unitOfMeasure: string
	unitPrice: number
	weight: number
}

export type product = {
	_id: ObjectID
	description: string
	distributor_id: ObjectID
	manufacturer_id: ObjectID
	owner_id: string
	productCode: string
}

export type user = {
	_id: ObjectID
	address: string
	name: string
	owner_id: string
	type: string
}

export type responseRow = {
	_id: string
	name: string
	invoices: invoice[]
}
