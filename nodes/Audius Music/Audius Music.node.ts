/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-audiusmusic/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class AudiusMusic implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Audius Music',
    name: 'audiusmusic',
    icon: 'file:audiusmusic.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Audius Music API',
    defaults: {
      name: 'Audius Music',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'audiusmusicApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Tracks',
            value: 'tracks',
          },
          {
            name: 'Users',
            value: 'users',
          },
          {
            name: 'Playlists',
            value: 'playlists',
          },
          {
            name: 'Tips',
            value: 'tips',
          },
          {
            name: 'Challenges',
            value: 'challenges',
          },
          {
            name: 'Metrics',
            value: 'metrics',
          }
        ],
        default: 'tracks',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['tracks'] } },
  options: [
    { name: 'Get Trending Tracks', value: 'getTrendingTracks', description: 'Get trending tracks with various time periods and genres', action: 'Get trending tracks' },
    { name: 'Get Track', value: 'getTrack', description: 'Get track details by ID', action: 'Get track details' },
    { name: 'Search Tracks', value: 'searchTracks', description: 'Search for tracks by query', action: 'Search tracks' },
    { name: 'Stream Track', value: 'streamTrack', description: 'Get streamable URL for a track', action: 'Get streamable URL' }
  ],
  default: 'getTrendingTracks',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['users'] } },
	options: [
		{ name: 'Get User', value: 'getUser', description: 'Get user profile by ID', action: 'Get user' },
		{ name: 'Search Users', value: 'searchUsers', description: 'Search for users by query', action: 'Search users' },
		{ name: 'Get User Tracks', value: 'getUserTracks', description: 'Get tracks uploaded by a user', action: 'Get user tracks' },
		{ name: 'Get User Followers', value: 'getUserFollowers', description: 'Get user\'s followers', action: 'Get user followers' },
		{ name: 'Get User Following', value: 'getUserFollowing', description: 'Get users that this user follows', action: 'Get user following' },
		{ name: 'Get User Reposts', value: 'getUserReposts', description: 'Get tracks reposted by user', action: 'Get user reposts' },
	],
	default: 'getUser',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['playlists'] } },
  options: [
    { name: 'Get Trending Playlists', value: 'getTrendingPlaylists', description: 'Get trending playlists', action: 'Get trending playlists' },
    { name: 'Get Playlist', value: 'getPlaylist', description: 'Get playlist details by ID', action: 'Get playlist details by ID' },
    { name: 'Search Playlists', value: 'searchPlaylists', description: 'Search for playlists by query', action: 'Search for playlists by query' },
    { name: 'Get Playlist Tracks', value: 'getPlaylistTracks', description: 'Get tracks in a playlist', action: 'Get tracks in a playlist' },
    { name: 'Get User Playlists', value: 'getUserPlaylists', description: 'Get playlists created by a user', action: 'Get playlists created by a user' },
  ],
  default: 'getTrendingPlaylists',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['tips'],
		},
	},
	options: [
		{
			name: 'Get User Tips',
			value: 'getUserTips',
			description: 'Get tips sent or received by a user',
			action: 'Get user tips',
		},
		{
			name: 'Send Tip',
			value: 'sendTip',
			description: 'Send AUDIO tokens as a tip to a user',
			action: 'Send tip',
		},
	],
	default: 'getUserTips',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['challenges'],
		},
	},
	options: [
		{
			name: 'Get Challenges',
			value: 'getChallenges',
			description: 'Get available platform challenges',
			action: 'Get challenges',
		},
		{
			name: 'Get User Challenges',
			value: 'getUserChallenges',
			description: 'Get challenges for a specific user',
			action: 'Get user challenges',
		},
	],
	default: 'getChallenges',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['metrics'],
    },
  },
  options: [
    {
      name: 'Get App Metrics',
      value: 'getAppMetrics',
      description: 'Get overall platform metrics',
      action: 'Get app metrics',
    },
    {
      name: 'Get Track Metrics',
      value: 'getTrackMetrics',
      description: 'Get metrics for a specific track',
      action: 'Get track metrics',
    },
    {
      name: 'Get User Metrics',
      value: 'getUserMetrics',
      description: 'Get metrics for a specific user',
      action: 'Get user metrics',
    },
  ],
  default: 'getAppMetrics',
},
{
  displayName: 'Time Period',
  name: 'time',
  type: 'options',
  displayOptions: { show: { resource: ['tracks'], operation: ['getTrendingTracks'] } },
  options: [
    { name: 'Week', value: 'week' },
    { name: 'Month', value: 'month' },
    { name: 'All Time', value: 'allTime' }
  ],
  default: 'week',
  description: 'Time period for trending tracks',
},
{
  displayName: 'Genre',
  name: 'genre',
  type: 'string',
  displayOptions: { show: { resource: ['tracks'], operation: ['getTrendingTracks'] } },
  default: '',
  description: 'Genre filter for trending tracks (optional)',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['tracks'], operation: ['getTrendingTracks', 'searchTracks'] } },
  typeOptions: { minValue: 1, maxValue: 100 },
  default: 10,
  description: 'Number of tracks to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['tracks'], operation: ['getTrendingTracks', 'searchTracks'] } },
  typeOptions: { minValue: 0 },
  default: 0,
  description: 'Number of tracks to skip',
},
{
  displayName: 'Track ID',
  name: 'trackId',
  type: 'string',
  displayOptions: { show: { resource: ['tracks'], operation: ['getTrack', 'streamTrack'] } },
  default: '',
  required: true,
  description: 'The ID of the track',
},
{
  displayName: 'Query',
  name: 'query',
  type: 'string',
  displayOptions: { show: { resource: ['tracks'], operation: ['searchTracks'] } },
  default: '',
  required: true,
  description: 'Search query for tracks',
},
{
	displayName: 'User ID',
	name: 'userId',
	type: 'string',
	required: true,
	default: '',
	description: 'The ID of the user',
	displayOptions: {
		show: {
			resource: ['users'],
			operation: ['getUser', 'getUserTracks', 'getUserFollowers', 'getUserFollowing', 'getUserReposts'],
		},
	},
},
{
	displayName: 'Query',
	name: 'query',
	type: 'string',
	required: true,
	default: '',
	description: 'Search query for users',
	displayOptions: {
		show: {
			resource: ['users'],
			operation: ['searchUsers'],
		},
	},
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	default: 20,
	description: 'Maximum number of results to return',
	displayOptions: {
		show: {
			resource: ['users'],
			operation: ['searchUsers', 'getUserTracks', 'getUserFollowers', 'getUserFollowing', 'getUserReposts'],
		},
	},
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	default: 0,
	description: 'Number of results to skip',
	displayOptions: {
		show: {
			resource: ['users'],
			operation: ['searchUsers', 'getUserTracks', 'getUserFollowers', 'getUserFollowing', 'getUserReposts'],
		},
	},
},
{
	displayName: 'Sort',
	name: 'sort',
	type: 'options',
	options: [
		{ name: 'Date', value: 'date' },
		{ name: 'Plays', value: 'plays' },
	],
	default: 'date',
	description: 'Sort order for tracks',
	displayOptions: {
		show: {
			resource: ['users'],
			operation: ['getUserTracks'],
		},
	},
},
{
  displayName: 'Time Period',
  name: 'time',
  type: 'options',
  displayOptions: { show: { resource: ['playlists'], operation: ['getTrendingPlaylists'] } },
  options: [
    { name: 'Week', value: 'week' },
    { name: 'Month', value: 'month' },
    { name: 'All Time', value: 'allTime' },
  ],
  default: 'week',
  description: 'Time period for trending playlists',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['playlists'], operation: ['getTrendingPlaylists', 'searchPlaylists', 'getPlaylistTracks', 'getUserPlaylists'] } },
  default: 10,
  description: 'Number of items to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['playlists'], operation: ['getTrendingPlaylists', 'searchPlaylists', 'getPlaylistTracks', 'getUserPlaylists'] } },
  default: 0,
  description: 'Number of items to skip',
},
{
  displayName: 'Playlist ID',
  name: 'playlistId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['playlists'], operation: ['getPlaylist', 'getPlaylistTracks'] } },
  default: '',
  description: 'The ID of the playlist',
},
{
  displayName: 'Search Query',
  name: 'query',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['playlists'], operation: ['searchPlaylists'] } },
  default: '',
  description: 'Search query for playlists',
},
{
  displayName: 'User ID',
  name: 'userId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['playlists'], operation: ['getUserPlaylists'] } },
  default: '',
  description: 'The ID of the user',
},
{
	displayName: 'User ID',
	name: 'userId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['tips'],
			operation: ['getUserTips', 'sendTip'],
		},
	},
	default: '',
	description: 'The ID of the user',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['tips'],
			operation: ['getUserTips'],
		},
	},
	default: 10,
	description: 'Number of tips to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['tips'],
			operation: ['getUserTips'],
		},
	},
	default: 0,
	description: 'Number of tips to skip',
},
{
	displayName: 'Amount',
	name: 'amount',
	type: 'number',
	required: true,
	displayOptions: {
		show: {
			resource: ['tips'],
			operation: ['sendTip'],
		},
	},
	default: 0,
	description: 'Amount of AUDIO tokens to send as a tip',
},
{
	displayName: 'Recipient User ID',
	name: 'recipientUserId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['tips'],
			operation: ['sendTip'],
		},
	},
	default: '',
	description: 'The ID of the user to receive the tip',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['challenges'],
			operation: ['getChallenges'],
		},
	},
	default: 10,
	description: 'Maximum number of challenges to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['challenges'],
			operation: ['getChallenges'],
		},
	},
	default: 0,
	description: 'Number of challenges to skip',
},
{
	displayName: 'User ID',
	name: 'userId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['challenges'],
			operation: ['getUserChallenges'],
		},
	},
	default: '',
	description: 'The ID of the user to get challenges for',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['challenges'],
			operation: ['getUserChallenges'],
		},
	},
	default: 10,
	description: 'Maximum number of challenges to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['challenges'],
			operation: ['getUserChallenges'],
		},
	},
	default: 0,
	description: 'Number of challenges to skip',
},
{
  displayName: 'Track ID',
  name: 'trackId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['metrics'],
      operation: ['getTrackMetrics'],
    },
  },
  default: '',
  description: 'The ID of the track to get metrics for',
},
{
  displayName: 'User ID',
  name: 'userId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['metrics'],
      operation: ['getUserMetrics'],
    },
  },
  default: '',
  description: 'The ID of the user to get metrics for',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'tracks':
        return [await executeTracksOperations.call(this, items)];
      case 'users':
        return [await executeUsersOperations.call(this, items)];
      case 'playlists':
        return [await executePlaylistsOperations.call(this, items)];
      case 'tips':
        return [await executeTipsOperations.call(this, items)];
      case 'challenges':
        return [await executeChallengesOperations.call(this, items)];
      case 'metrics':
        return [await executeMetricsOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeTracksOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('audiusmusicApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getTrendingTracks': {
          const time = this.getNodeParameter('time', i) as string;
          const genre = this.getNodeParameter('genre', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const params = new URLSearchParams({
            time,
            limit: limit.toString(),
            offset: offset.toString(),
          });

          if (genre) {
            params.append('genre', genre);
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/tracks/trending?${params.toString()}`,
            headers: {
              'X-API-Key': credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTrack': {
          const trackId = this.getNodeParameter('trackId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/tracks/${trackId}`,
            headers: {
              'X-API-Key': credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'searchTracks': {
          const query = this.getNodeParameter('query', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const params = new URLSearchParams({
            query,
            limit: limit.toString(),
            offset: offset.toString(),
          });

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/tracks/search?${params.toString()}`,
            headers: {
              'X-API-Key': credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'streamTrack': {
          const trackId = this.getNodeParameter('trackId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/tracks/${trackId}/stream`,
            headers: {
              'X-API-Key': credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeUsersOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('audiusmusicApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getUser': {
					const userId = this.getNodeParameter('userId', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/users/${userId}`,
						headers: {
							'X-API-Key': credentials.apiKey,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'searchUsers': {
					const query = this.getNodeParameter('query', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/users/search`,
						qs: {
							query,
							limit,
							offset,
						},
						headers: {
							'X-API-Key': credentials.apiKey,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getUserTracks': {
					const userId = this.getNodeParameter('userId', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;
					const sort = this.getNodeParameter('sort', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/users/${userId}/tracks`,
						qs: {
							limit,
							offset,
							sort,
						},
						headers: {
							'X-API-Key': credentials.apiKey,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getUserFollowers': {
					const userId = this.getNodeParameter('userId', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/users/${userId}/followers`,
						qs: {
							limit,
							offset,
						},
						headers: {
							'X-API-Key': credentials.apiKey,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getUserFollowing': {
					const userId = this.getNodeParameter('userId', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/users/${userId}/following`,
						qs: {
							limit,
							offset,
						},
						headers: {
							'X-API-Key': credentials.apiKey,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getUserReposts': {
					const userId = this.getNodeParameter('userId', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/users/${userId}/reposts`,
						qs: {
							limit,
							offset,
						},
						headers: {
							'X-API-Key': credentials.apiKey,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({ json: result, pairedItem: { item: i } });
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executePlaylistsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('audiusmusicApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getTrendingPlaylists': {
          const time = this.getNodeParameter('time', i) as string;
          const limit = this.getNodeParameter('limit', i, 10) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.audius.co/v1'}/playlists/trending`,
            headers: {
              'X-API-Key': credentials.apiKey,
            },
            qs: {
              time,
              limit,
              offset,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPlaylist': {
          const playlistId = this.getNodeParameter('playlistId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.audius.co/v1'}/playlists/${playlistId}`,
            headers: {
              'X-API-Key': credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'searchPlaylists': {
          const query = this.getNodeParameter('query', i) as string;
          const limit = this.getNodeParameter('limit', i, 10) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.audius.co/v1'}/playlists/search`,
            headers: {
              'X-API-Key': credentials.apiKey,
            },
            qs: {
              query,
              limit,
              offset,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPlaylistTracks': {
          const playlistId = this.getNodeParameter('playlistId', i) as string;
          const limit = this.getNodeParameter('limit', i, 10) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.audius.co/v1'}/playlists/${playlistId}/tracks`,
            headers: {
              'X-API-Key': credentials.apiKey,
            },
            qs: {
              limit,
              offset,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getUserPlaylists': {
          const userId = this.getNodeParameter('userId', i) as string;
          const limit = this.getNodeParameter('limit', i, 10) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.audius.co/v1'}/users/${userId}/playlists`,
            headers: {
              'X-API-Key': credentials.apiKey,
            },
            qs: {
              limit,
              offset,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeTipsOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('audiusmusicApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getUserTips': {
					const userId = this.getNodeParameter('userId', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/users/${userId}/tips`,
						headers: {
							'X-API-Key': credentials.apiKey,
						},
						qs: {
							limit,
							offset,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'sendTip': {
					const userId = this.getNodeParameter('userId', i) as string;
					const amount = this.getNodeParameter('amount', i) as number;
					const recipientUserId = this.getNodeParameter('recipientUserId', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/users/${userId}/tips`,
						headers: {
							'X-API-Key': credentials.apiKey,
							'Content-Type': 'application/json',
						},
						body: {
							amount,
							recipient_user_id: recipientUserId,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeChallengesOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('audiusmusicApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getChallenges': {
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;

					const qs: any = {
						limit,
						offset,
					};

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/challenges`,
						headers: {
							'X-API-Key': credentials.apiKey,
						},
						qs,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getUserChallenges': {
					const userId = this.getNodeParameter('userId', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;

					const qs: any = {
						limit,
						offset,
					};

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/users/${userId}/challenges`,
						headers: {
							'X-API-Key': credentials.apiKey,
						},
						qs,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeMetricsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('audiusmusicApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getAppMetrics': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/metrics/app`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getTrackMetrics': {
          const trackId = this.getNodeParameter('trackId', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/tracks/${trackId}/metrics`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getUserMetrics': {
          const userId = this.getNodeParameter('userId', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/users/${userId}/metrics`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
