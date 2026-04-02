/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { AudiusMusic } from '../nodes/Audius Music/Audius Music.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('AudiusMusic Node', () => {
  let node: AudiusMusic;

  beforeAll(() => {
    node = new AudiusMusic();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Audius Music');
      expect(node.description.name).toBe('audiusmusic');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Tracks Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.audius.co/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getTrendingTracks operation', () => {
    it('should get trending tracks successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTrendingTracks')
        .mockReturnValueOnce('week')
        .mockReturnValueOnce('electronic')
        .mockReturnValueOnce(10)
        .mockReturnValueOnce(0);

      const mockResponse = { data: [{ id: '1', title: 'Test Track' }] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTracksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.audius.co/v1/tracks/trending?time=week&limit=10&offset=0&genre=electronic',
        headers: { 'X-API-Key': 'test-key' },
        json: true,
      });
    });

    it('should handle errors in getTrendingTracks', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getTrendingTracks');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(executeTracksOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects.toThrow('API Error');
    });
  });

  describe('getTrack operation', () => {
    it('should get track details successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTrack')
        .mockReturnValueOnce('track123');

      const mockResponse = { data: { id: 'track123', title: 'Test Track' } };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTracksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.audius.co/v1/tracks/track123',
        headers: { 'X-API-Key': 'test-key' },
        json: true,
      });
    });
  });

  describe('searchTracks operation', () => {
    it('should search tracks successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('searchTracks')
        .mockReturnValueOnce('electronic music')
        .mockReturnValueOnce(20)
        .mockReturnValueOnce(10);

      const mockResponse = { data: [{ id: '1', title: 'Electronic Track' }] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTracksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.audius.co/v1/tracks/search?query=electronic+music&limit=20&offset=10',
        headers: { 'X-API-Key': 'test-key' },
        json: true,
      });
    });
  });

  describe('streamTrack operation', () => {
    it('should get stream URL successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('streamTrack')
        .mockReturnValueOnce('track123');

      const mockResponse = { data: { streamUrl: 'https://stream.audius.co/track123' } };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTracksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.audius.co/v1/tracks/track123/stream',
        headers: { 'X-API-Key': 'test-key' },
        json: true,
      });
    });
  });
});

describe('Users Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({ apiKey: 'test-key', baseUrl: 'https://api.audius.co/v1' }),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: { httpRequest: jest.fn() },
		};
	});

	it('should get user successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getUser')
			.mockReturnValueOnce('123');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: '123', name: 'Test User' });

		const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result[0].json).toEqual({ id: '123', name: 'Test User' });
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.audius.co/v1/users/123',
			headers: { 'X-API-Key': 'test-key' },
			json: true,
		});
	});

	it('should search users successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('searchUsers')
			.mockReturnValueOnce('artist')
			.mockReturnValueOnce(20)
			.mockReturnValueOnce(0);
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ data: [] });

		const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result[0].json).toEqual({ data: [] });
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.audius.co/v1/users/search',
			qs: { query: 'artist', limit: 20, offset: 0 },
			headers: { 'X-API-Key': 'test-key' },
			json: true,
		});
	});

	it('should get user tracks successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getUserTracks')
			.mockReturnValueOnce('123')
			.mockReturnValueOnce(10)
			.mockReturnValueOnce(0)
			.mockReturnValueOnce('date');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ data: [] });

		const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result[0].json).toEqual({ data: [] });
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.audius.co/v1/users/123/tracks',
			qs: { limit: 10, offset: 0, sort: 'date' },
			headers: { 'X-API-Key': 'test-key' },
			json: true,
		});
	});

	it('should handle errors gracefully when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getUser').mockReturnValueOnce('123');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result[0].json).toEqual({ error: 'API Error' });
	});

	it('should throw error when continueOnFail is false', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getUser').mockReturnValueOnce('123');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);

		await expect(executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
	});
});

describe('Playlists Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.audius.co/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getTrendingPlaylists operation', () => {
    it('should get trending playlists successfully', async () => {
      const mockResponse = { data: [{ id: '1', name: 'Trending Playlist' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTrendingPlaylists')
        .mockReturnValueOnce('week')
        .mockReturnValueOnce(10)
        .mockReturnValueOnce(0);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePlaylistsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.audius.co/v1/playlists/trending',
        headers: { 'X-API-Key': 'test-key' },
        qs: { time: 'week', limit: 10, offset: 0 },
        json: true,
      });
    });

    it('should handle errors when getting trending playlists', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTrendingPlaylists');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executePlaylistsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getPlaylist operation', () => {
    it('should get playlist details successfully', async () => {
      const mockResponse = { data: { id: '123', name: 'Test Playlist' } };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPlaylist')
        .mockReturnValueOnce('123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePlaylistsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.audius.co/v1/playlists/123',
        headers: { 'X-API-Key': 'test-key' },
        json: true,
      });
    });
  });

  describe('searchPlaylists operation', () => {
    it('should search playlists successfully', async () => {
      const mockResponse = { data: [{ id: '1', name: 'Found Playlist' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('searchPlaylists')
        .mockReturnValueOnce('test query')
        .mockReturnValueOnce(10)
        .mockReturnValueOnce(0);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePlaylistsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.audius.co/v1/playlists/search',
        headers: { 'X-API-Key': 'test-key' },
        qs: { query: 'test query', limit: 10, offset: 0 },
        json: true,
      });
    });
  });

  describe('getPlaylistTracks operation', () => {
    it('should get playlist tracks successfully', async () => {
      const mockResponse = { data: [{ id: '1', title: 'Track 1' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPlaylistTracks')
        .mockReturnValueOnce('123')
        .mockReturnValueOnce(10)
        .mockReturnValueOnce(0);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePlaylistsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.audius.co/v1/playlists/123/tracks',
        headers: { 'X-API-Key': 'test-key' },
        qs: { limit: 10, offset: 0 },
        json: true,
      });
    });
  });

  describe('getUserPlaylists operation', () => {
    it('should get user playlists successfully', async () => {
      const mockResponse = { data: [{ id: '1', name: 'User Playlist' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getUserPlaylists')
        .mockReturnValueOnce('user123')
        .mockReturnValueOnce(10)
        .mockReturnValueOnce(0);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePlaylistsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.audius.co/v1/users/user123/playlists',
        headers: { 'X-API-Key': 'test-key' },
        qs: { limit: 10, offset: 0 },
        json: true,
      });
    });
  });
});

describe('Tips Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.audius.co/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	it('should get user tips successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getUserTips')
			.mockReturnValueOnce('user123')
			.mockReturnValueOnce(10)
			.mockReturnValueOnce(0);

		const mockResponse = {
			data: [
				{ id: 1, amount: 100, sender_user_id: 'sender123' },
				{ id: 2, amount: 250, sender_user_id: 'sender456' },
			],
		};

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeTipsOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.audius.co/v1/users/user123/tips',
			headers: {
				'X-API-Key': 'test-key',
			},
			qs: {
				limit: 10,
				offset: 0,
			},
			json: true,
		});

		expect(result).toEqual([
			{
				json: mockResponse,
				pairedItem: { item: 0 },
			},
		]);
	});

	it('should send tip successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('sendTip')
			.mockReturnValueOnce('user123')
			.mockReturnValueOnce(500)
			.mockReturnValueOnce('recipient456');

		const mockResponse = {
			success: true,
			tip_id: 'tip123',
			amount: 500,
		};

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeTipsOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.audius.co/v1/users/user123/tips',
			headers: {
				'X-API-Key': 'test-key',
				'Content-Type': 'application/json',
			},
			body: {
				amount: 500,
				recipient_user_id: 'recipient456',
			},
			json: true,
		});

		expect(result).toEqual([
			{
				json: mockResponse,
				pairedItem: { item: 0 },
			},
		]);
	});

	it('should handle errors when continue on fail is enabled', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getUserTips')
			.mockReturnValueOnce('user123')
			.mockReturnValueOnce(10)
			.mockReturnValueOnce(0);

		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeTipsOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([
			{
				json: { error: 'API Error' },
				pairedItem: { item: 0 },
			},
		]);
	});

	it('should throw error when continue on fail is disabled', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('sendTip')
			.mockReturnValueOnce('user123')
			.mockReturnValueOnce(500)
			.mockReturnValueOnce('recipient456');

		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		const error = new Error('API Error');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

		await expect(
			executeTipsOperations.call(mockExecuteFunctions, [{ json: {} }]),
		).rejects.toThrow('API Error');
	});
});

describe('Challenges Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.audius.co/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getChallenges', () => {
		it('should get challenges successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getChallenges')
				.mockReturnValueOnce(10)
				.mockReturnValueOnce(0);

			const mockResponse = {
				data: [
					{ id: 'challenge1', name: 'Test Challenge 1' },
					{ id: 'challenge2', name: 'Test Challenge 2' },
				],
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeChallengesOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.audius.co/v1/challenges',
				headers: {
					'X-API-Key': 'test-key',
				},
				qs: {
					limit: 10,
					offset: 0,
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle getChallenges error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getChallenges');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			await expect(
				executeChallengesOperations.call(mockExecuteFunctions, [{ json: {} }])
			).rejects.toThrow('API Error');
		});
	});

	describe('getUserChallenges', () => {
		it('should get user challenges successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getUserChallenges')
				.mockReturnValueOnce('user123')
				.mockReturnValueOnce(5)
				.mockReturnValueOnce(0);

			const mockResponse = {
				data: [
					{ id: 'challenge1', status: 'completed' },
					{ id: 'challenge2', status: 'in_progress' },
				],
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeChallengesOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.audius.co/v1/users/user123/challenges',
				headers: {
					'X-API-Key': 'test-key',
				},
				qs: {
					limit: 5,
					offset: 0,
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle getUserChallenges error with continueOnFail', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getUserChallenges');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('User not found'));

			const result = await executeChallengesOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: { error: 'User not found' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});
});

describe('Metrics Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.audius.co/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Audius Music Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getAppMetrics', () => {
    it('should get app metrics successfully', async () => {
      const mockResponse = { data: { totalUsers: 1000, totalTracks: 5000 } };
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getAppMetrics');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMetricsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.audius.co/v1/metrics/app',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle getAppMetrics error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getAppMetrics');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeMetricsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getTrackMetrics', () => {
    it('should get track metrics successfully', async () => {
      const mockResponse = { data: { playCount: 1500, likeCount: 200 } };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTrackMetrics')
        .mockReturnValueOnce('track123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMetricsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.audius.co/v1/tracks/track123/metrics',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle getTrackMetrics error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTrackMetrics')
        .mockReturnValueOnce('track123');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Track not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeMetricsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Track not found' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getUserMetrics', () => {
    it('should get user metrics successfully', async () => {
      const mockResponse = { data: { followerCount: 500, trackCount: 25 } };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getUserMetrics')
        .mockReturnValueOnce('user456');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMetricsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.audius.co/v1/users/user456/metrics',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle getUserMetrics error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getUserMetrics')
        .mockReturnValueOnce('user456');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('User not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeMetricsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'User not found' }, pairedItem: { item: 0 } }]);
    });
  });
});
});
