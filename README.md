# n8n-nodes-audius-music

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for integrating with Audius, the decentralized music streaming platform. This node provides access to 6 core resources including tracks, users, playlists, tips, challenges, and metrics, enabling automated workflows for music discovery, artist engagement, and platform analytics.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Music](https://img.shields.io/badge/Audius-Music%20Platform-purple)
![Decentralized](https://img.shields.io/badge/Web3-Decentralized-green)
![Streaming](https://img.shields.io/badge/Audio-Streaming-orange)

## Features

- **Track Management** - Search, retrieve, and analyze music tracks with metadata and streaming stats
- **User Operations** - Access artist profiles, follower data, and user-generated content
- **Playlist Handling** - Create, update, and manage playlists with comprehensive track listings
- **Tipping System** - Integrate with Audius's $AUDIO token tipping functionality for artist support
- **Challenge Participation** - Access platform challenges and community engagement features
- **Analytics & Metrics** - Retrieve detailed streaming metrics, trending data, and platform statistics
- **Decentralized Integration** - Connect to the distributed Audius protocol for censorship-resistant music access
- **Real-time Data** - Access live streaming data and real-time platform updates

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-audius-music`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-audius-music
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-audius-music.git
cd n8n-nodes-audius-music
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-audius-music
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Audius API key for authenticated requests | Yes |
| App Name | Application identifier for rate limiting and analytics | Yes |
| Host Override | Custom Audius host endpoint (optional) | No |

## Resources & Operations

### 1. Tracks

| Operation | Description |
|-----------|-------------|
| Get Track | Retrieve detailed track information by ID |
| Search Tracks | Search for tracks by title, artist, or genre |
| Get Trending | Fetch trending tracks by time period |
| Get Track Stems | Retrieve available stems for remixing |
| Get Track Comments | Fetch comments and reactions for a track |

### 2. Users

| Operation | Description |
|-----------|-------------|
| Get User | Retrieve user profile information by ID |
| Search Users | Search for users by name or handle |
| Get User Tracks | Fetch all tracks by a specific user |
| Get User Followers | Retrieve user's follower list |
| Get User Following | Get list of users being followed |
| Get User Favorites | Fetch user's favorited tracks |

### 3. Playlists

| Operation | Description |
|-----------|-------------|
| Get Playlist | Retrieve playlist details and track listing |
| Search Playlists | Search for playlists by name or description |
| Get Trending Playlists | Fetch trending playlists |
| Get User Playlists | Retrieve all playlists created by a user |
| Get Playlist Tracks | Get detailed track information from a playlist |

### 4. Tips

| Operation | Description |
|-----------|-------------|
| Get User Tips | Retrieve tips sent by a user |
| Get Received Tips | Fetch tips received by a user |
| Get Tip History | Get complete tipping history between users |
| Send Tip | Send $AUDIO tokens as a tip to an artist |

### 5. Challenges

| Operation | Description |
|-----------|-------------|
| Get Challenges | Retrieve available platform challenges |
| Get User Challenges | Fetch challenges completed by a user |
| Submit Challenge | Submit completion data for a challenge |
| Get Challenge Leaderboard | Retrieve rankings for specific challenges |

### 6. Metrics

| Operation | Description |
|-----------|-------------|
| Get Track Metrics | Retrieve play counts, favorites, and engagement stats |
| Get User Metrics | Fetch follower growth and engagement metrics |
| Get Platform Stats | Get overall platform statistics and trends |
| Get Genre Analytics | Retrieve performance metrics by genre |
| Get Time Series Data | Fetch historical metrics over time periods |

## Usage Examples

```javascript
// Search for trending electronic tracks
{
  "resource": "tracks",
  "operation": "getTrending",
  "genre": "Electronic",
  "timeRange": "week",
  "limit": 50
}
```

```javascript
// Get detailed user profile with track count
{
  "resource": "users",
  "operation": "getUser",
  "userId": "eAZl3",
  "includeTrackCount": true,
  "includeFollowerCount": true
}
```

```javascript
// Retrieve playlist with full track metadata
{
  "resource": "playlists",
  "operation": "getPlaylist",
  "playlistId": "AxRP0",
  "includeTrackMetadata": true,
  "resolveUserData": true
}
```

```javascript
// Get comprehensive track metrics for analytics
{
  "resource": "metrics",
  "operation": "getTrackMetrics",
  "trackId": "D7KyD",
  "timeRange": "month",
  "includeGeographicData": true
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key is correct and active |
| Rate Limit Exceeded | Too many requests sent in time window | Implement request throttling or upgrade plan |
| Track Not Found | Requested track ID does not exist | Verify track ID is correct and track is public |
| Network Timeout | Request to Audius nodes timed out | Retry request or check network connectivity |
| Invalid Parameters | Required parameters missing or malformed | Review API documentation for required fields |
| Insufficient Permissions | API key lacks required permissions | Check API key scope and permissions |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-audius-music/issues)
- **Audius API Documentation**: [docs.audius.org](https://docs.audius.org)
- **Audius Discord Community**: [discord.gg/audius](https://discord.gg/audius)