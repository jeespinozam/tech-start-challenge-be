import { ObjectID } from 'mongodb'

import { invoice_detail } from '../../../tech-start-challenge-be/src/@types/reportTypes'
import { UnitOfMeasure } from '../../../tech-start-challenge-be/src/utils/enums'
import { Unique } from '../@types/etlTypes'

export const addIfNotExists = <T extends Unique & { _id?: ObjectID }>(
	arr: T[],
	element: Partial<T>
): [number, ObjectID] => {
	const index = arr.findIndex((el) => el.tempId === element.tempId)
	let _id = new ObjectID()
	// if the element doesn't exists in the array, we push it
	if (index < 0) {
		arr.push(({
			_id,
			...element
		} as any) as T)
	} else _id = arr[index]._id
	return [index, _id]
}

export const getDateFromString = (year: number, dateStr: string) => {
	const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

	const [day, month] = dateStr.split('-')
	return new Date(
		year,
		monthNames.findIndex((m) => m === month),
		+day
	)
}

export const getLocalPath = (filename: string) => {
	return `${process.cwd()}/src/etl/data/${filename}`
}

export const calculateSubtotal = (invoiceDetail: invoice_detail) => {
	return (
		invoiceDetail.unitPrice *
		(invoiceDetail.unitOfMeasure === UnitOfMeasure.CASE ? invoiceDetail.qty : invoiceDetail.weight)
	)
}
