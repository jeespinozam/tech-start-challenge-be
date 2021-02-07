import { APIGatewayProxyResult } from 'aws-lambda'

export const buildReponse = (statusCode: number, data: any, message: string = 'Ok'): APIGatewayProxyResult => {
	return {
		statusCode,
		body: JSON.stringify(
			{
				message,
				data
			},
			null,
			2
		),
		headers: {
			'Access-Control-Allow-Headers': 'Content-Type',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
		}
	}
}
