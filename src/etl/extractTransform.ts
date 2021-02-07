import { ObjectID } from 'mongodb'
import * as XLSX from 'xlsx'

import { InvoiceExcel, Unique } from '../@types/etlTypes'
import { invoice, invoice_detail, product, user } from '../@types/reportTypes'
import { UnitOfMeasure, UserType } from '../utils/enums'
import { addIfNotExists, calculateSubtotal, getLocalPath } from '../utils/utils'

export const extractTransform = (
	users: (user & Unique)[],
	products: (product & Unique)[],
	invoices: (invoice & Unique)[]
) => {
	// ETL CODE
	const targetPath = getLocalPath('Data Sample.xlsx')
	const wb = XLSX.read(targetPath, {
		type: 'file',
		cellDates: true
	})
	if (!wb) throw new Error('File not readable')

	// Extract
	const sheetName = wb.SheetNames[0]
	const sheet = wb.Sheets[sheetName]
	const JSONObj: InvoiceExcel[] = XLSX.utils.sheet_to_json(sheet)

	// Transform
	JSONObj.forEach((row) => {
		const temp_customer_id = row['Customer Name'] + row['Customer Address']
		const temp_distributor_id = row['Distributor Name'] + row['Distributor Address']
		const temp_manufacturer_id = row['Manufacturer Name'] + row['Manufacturer Address']
		const temp_product_id = row['Product Code'] + row['Product Description']
		const temp_invoice_id = row['Invoice #'].toString()
		// const temp_invoice_detail_id = row['Invoice #'].toString() + row['Product Code']

		const [, customer_id] = addIfNotExists(users, {
			tempId: temp_customer_id,
			name: row['Customer Name'],
			address: row['Customer Address'],
			type: UserType.CONSUMER
		})

		const [, distributor_id] = addIfNotExists(users, {
			tempId: temp_distributor_id,
			name: row['Distributor Name'],
			address: row['Distributor Address'],
			type: UserType.DISTRIBUTOR
		})

		const [, manufacturer_id] = addIfNotExists(users, {
			tempId: temp_manufacturer_id,
			name: row['Manufacturer Name'],
			address: row['Manufacturer Address'],
			type: UserType.MANUFACTURER
		})

		const [, product_id] = addIfNotExists(products, {
			tempId: temp_product_id,
			description: row['Product Description'],
			productCode: row['Product Code'].toString(),
			distributor_id,
			manufacturer_id
		})

		// Adding invoices
		const invoiceDetail: invoice_detail = {
			_id: new ObjectID(),
			product: {
				_id: product_id,
				description: row['Product Description'],
				productCode: row['Product Code'].toString()
			},
			qty: row['Purchased Qty'] || 0,
			unitOfMeasure: row['Unit of Measure'] as UnitOfMeasure,
			unitPrice: row['Unit Price'],
			weight: row['Purchased Weight'] || 0
		}

		const [index] = addIfNotExists(invoices, {
			tempId: temp_invoice_id,
			customer_id,
			distributor_id,
			invoiceNumber: row['Invoice #'],
			purchaseDate: new Date(row['Invoice Date']),
			totalPurchases: row['Total Price'],
			detail: [invoiceDetail]
		})
		if (index >= 0) {
			// invoice already exists and we need to add the detail
			// missing to check if the invoice detail already exists to sum additional columns
			const existingInv = invoices[index]
			existingInv.detail.push(invoiceDetail)
			existingInv.totalPurchases += calculateSubtotal(invoiceDetail)
		}
	})

	const cleanData = (el: (product | invoice | user) & Unique) => {
		delete el.tempId
		el.owner_id = 'PUBLIC'
	}
	// removing tempId and adding partition
	products.forEach(cleanData)
	users.forEach(cleanData)
	invoices.forEach(cleanData)

	// console.log({ invoices, products, users })
}
