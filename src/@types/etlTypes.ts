import { Collection } from 'mongodb'

import { invoice, product, user } from './reportTypes'

export type InvoiceExcel = {
	'Invoice #': number
	'Invoice Date': string
	'Distributor Name': string
	'Distributor Address': string
	'Customer Name': string
	'Customer Address': string
	'Manufacturer Name': string
	'Manufacturer Address': string
	'Product Code': number
	'Product Description': string
	'Unit of Measure': string
	'Purchased Qty': number
	'Purchased Weight': number
	'Unit Price': number
	'Total Price': number
}

export type Unique = {
	tempId: string
}

export type RemoteCollections = {
	user: Collection<user>
	product: Collection<product>
	invoice: Collection<invoice>
}
