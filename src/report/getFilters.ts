import { ReportQueryParam } from '../../../tech-start-challenge-fe/src/utils/enums'

const addGroupByOpts = (options: object[], selectedId: string, selectedName: string = '') => {
	options.push(
		...[
			{
				$lookup: {
					from: 'user',
					localField: 'distributor_id',
					foreignField: '_id',
					as: 'distributor'
				}
			},
			{
				$unwind: {
					path: '$distributor'
				}
			},
			{
				$lookup: {
					from: 'user',
					localField: 'customer_id',
					foreignField: '_id',
					as: 'customer'
				}
			},
			{
				$unwind: {
					path: '$customer'
				}
			},
			{
				$group: {
					_id: selectedId,
					...(selectedName && {
						name: {
							$max: selectedName
						}
					}),
					invoices: {
						$push: '$$ROOT'
					}
				}
			}
		]
	)
}
export const getOptions = (groupedBy: ReportQueryParam) => {
	const options: object[] = []
	switch (groupedBy) {
		case ReportQueryParam.distributor:
			addGroupByOpts(options, '$distributor_id', '$distributor.name')
			break
		case ReportQueryParam.customer:
			addGroupByOpts(options, '$customer_id', '$customer.address')
			break
		case ReportQueryParam.product:
			addGroupByOpts(options, '$detail.product._id', null)
			options.push(
				...[
					{
						$unwind: {
							path: '$_id'
						}
					},
					{
						$group: {
							_id: '$_id',
							invoices: {
								$push: '$invoices'
							}
						}
					},
					{
						$project: {
							invoices: {
								$reduce: {
									input: '$invoices',
									initialValue: [],
									in: {
										$concatArrays: ['$$value', '$$this']
									}
								}
							}
						}
					},
					{
						$lookup: {
							from: 'product',
							localField: '_id',
							foreignField: '_id',
							as: 'product'
						}
					},
					{
						$set: {
							name: '$product.description'
						}
					},
					{
						$unwind: {
							path: '$name'
						}
					}
				]
			)
			break
		case ReportQueryParam.invoice:
		default:
			addGroupByOpts(options, '$_id', '$invoiceNumber')
			break
	}
	// sorting the result by name
	options.push({
		$sort: {
			name: 1
		}
	})
	return options
}
