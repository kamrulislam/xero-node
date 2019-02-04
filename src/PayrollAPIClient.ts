import * as fs from 'fs';
import { BaseAPIClient, XeroClientConfiguration } from './internals/BaseAPIClient';
import { AccessToken, IOAuth1HttpClient } from './internals/OAuth1HttpClient';
import { AttachmentsEndpoint, HeaderArgs, QueryArgs, PagingArgs } from './AccountingAPIClient';
import { AttachmentsResponse, EmployeesResponse } from './AccountingAPI-responses';
import { escapeString, generateQueryString } from './internals/utils';
import { LeaveApplicationsResponse } from './PayrollAPI-responses';

export class PayrollAPIClient extends BaseAPIClient {
	public constructor(options: XeroClientConfiguration, authState?: AccessToken, _oAuth1HttpClient?: IOAuth1HttpClient) {
		super(options, authState, { apiBasePath: '/payroll.xro/1.0/' }, _oAuth1HttpClient);
	}

	private generateAttachmentsEndpoint(path: string): AttachmentsEndpoint {
		return {
			get: async (args: { entityId: string }): Promise<AttachmentsResponse> => {
				const endpoint = `${path}/${args.entityId}/attachments`;
				return this.oauth1Client.get<AttachmentsResponse>(endpoint);
			},
			downloadAttachment: async (args: { entityId: string, mimeType: string, fileName: string, pathToSave: string }) => {
				const endpoint = `${path}/${args.entityId}/attachments/${escapeString(args.fileName)}`;
				const writeStream = fs.createWriteStream(args.pathToSave);

				await this.oauth1Client.writeBinaryResponseToStream(endpoint, args.mimeType, writeStream);
			},
			uploadAttachment: async (args: { entityId: string, mimeType: string, fileName: string, pathToUpload: string, includeOnline?: boolean }) => {
				const endpoint = `${path}/${args.entityId}/attachments/${escapeString(args.fileName)}` + generateQueryString({ IncludeOnline: args.includeOnline });
				const readStream = fs.createReadStream(args.pathToUpload);

				const fileSize = fs.statSync(args.pathToUpload).size;

				return this.oauth1Client.readStreamToRequest(endpoint, args.mimeType, fileSize, readStream);
			},
		};
	}

	private generateHeader(args: HeaderArgs) {
		if (args && args['If-Modified-Since']) {
			const toReturn = {
				'If-Modified-Since': args['If-Modified-Since']
			};

			delete args['If-Modified-Since'];
			return toReturn;
		}
	}

	public employees = {
		get: async (args?: { AccountID?: string } & QueryArgs & HeaderArgs): Promise<EmployeesResponse> => {
			let endpoint = 'employees';
			if (args && args.AccountID) {
				endpoint = endpoint + '/' + args.AccountID;
				delete args.AccountID; // remove from query string
			}
			const header = this.generateHeader(args);
			endpoint += generateQueryString(args);

			return this.oauth1Client.get<EmployeesResponse>(endpoint, header);
		},
		create: async (account: any): Promise<EmployeesResponse> => {
			// from docs: You can only add accounts one at a time (i.e. you'll need to do multiple API calls to add many accounts)
			const endpoint = 'employees';
			return this.oauth1Client.put<EmployeesResponse>(endpoint, account);
		},
		update: async (account: any, args?: { AccountID?: string }): Promise<EmployeesResponse> => {
			// from docs: You can only update accounts one at a time (i.e. you’ll need to do multiple API calls to update many accounts)
			let endpoint = 'employees';
			if (args && args.AccountID) {
				endpoint = endpoint + '/' + args.AccountID;
				delete args.AccountID; // remove from query string
			}
			endpoint += generateQueryString(args);

			return this.oauth1Client.post<EmployeesResponse>(endpoint, account);
		},
		delete: async (args: { AccountID: string }): Promise<EmployeesResponse> => {
			// from docs: If an account is not able to be deleted (e.g. ssystem accounts and accounts used on transactions) you can update the status to ARCHIVED.
			const endpoint = 'employees/' + args.AccountID;
			return this.oauth1Client.delete<EmployeesResponse>(endpoint);
		},
		attachments: this.generateAttachmentsEndpoint('employees')
	};

	public leaveApplications = {
		get: async (args?: { StartDate?: string } & PagingArgs & QueryArgs & HeaderArgs): Promise<LeaveApplicationsResponse> => {
			let endpoint = 'LeaveApplications';
			// if (args && args.AccountID) {
			// 	endpoint = endpoint + '/' + args.AccountID;
			// 	delete args.AccountID; // remove from query string
			// }
			const header = this.generateHeader(args);
			endpoint += generateQueryString(args);

			return this.oauth1Client.get<LeaveApplicationsResponse>(endpoint, header);
		},
		create: async (account: any): Promise<LeaveApplicationsResponse> => {
			// from docs: You can only add accounts one at a time (i.e. you'll need to do multiple API calls to add many accounts)
			const endpoint = 'LeaveApplications';
			return this.oauth1Client.put<LeaveApplicationsResponse>(endpoint, account);
		},
		update: async (account: any, args?: { AccountID?: string }): Promise<LeaveApplicationsResponse> => {
			// from docs: You can only update accounts one at a time (i.e. you’ll need to do multiple API calls to update many accounts)
			let endpoint = 'LeaveApplications';
			if (args && args.AccountID) {
				endpoint = endpoint + '/' + args.AccountID;
				delete args.AccountID; // remove from query string
			}
			endpoint += generateQueryString(args);

			return this.oauth1Client.post<LeaveApplicationsResponse>(endpoint, account);
		},
		delete: async (args: { AccountID: string }): Promise<LeaveApplicationsResponse> => {
			// from docs: If an account is not able to be deleted (e.g. ssystem accounts and accounts used on transactions) you can update the status to ARCHIVED.
			const endpoint = 'LeaveApplications/' + args.AccountID;
			return this.oauth1Client.delete<LeaveApplicationsResponse>(endpoint);
		},
		attachments: this.generateAttachmentsEndpoint('LeaveApplications')
	};
}
