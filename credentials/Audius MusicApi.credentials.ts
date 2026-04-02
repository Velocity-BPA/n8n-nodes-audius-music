import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class AudiusMusicApi implements ICredentialType {
	name = 'audiusMusicApi';

	displayName = 'Audius Music API';

	documentationUrl = 'https://api.audius.co/';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'API key for Audius Music API. Can be obtained from the Audius developer portal.',
		},
		{
			displayName: 'API Base URL',
			name: 'apiBaseUrl',
			type: 'string',
			default: 'https://api.audius.co/v1',
			description: 'Base URL for the Audius Music API',
		},
	];
}