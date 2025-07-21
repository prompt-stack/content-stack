<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prompt Stack Cloud</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f7fa;
            color: #1a1a1a;
        }
        
        /* Header */
        .header {
            background: white;
            border-bottom: 1px solid #e1e8ed;
            padding: 0 20px;
            height: 60px;
            display: flex;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .logo {
            font-size: 20px;
            font-weight: 600;
            color: #1a1a1a;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .nav {
            display: flex;
            gap: 30px;
            margin-left: 50px;
        }
        
        .nav a {
            text-decoration: none;
            color: #657786;
            font-weight: 500;
            padding: 5px 10px;
            border-radius: 6px;
            transition: all 0.2s;
        }
        
        .nav a.active {
            color: #1a1a1a;
            background: #f0f3f5;
        }
        
        .header-actions {
            margin-left: auto;
            display: flex;
            gap: 15px;
            align-items: center;
        }
        
        .sync-status {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 5px 12px;
            background: #e8f5e9;
            border-radius: 20px;
            font-size: 13px;
            color: #2e7d32;
        }
        
        .sync-dot {
            width: 8px;
            height: 8px;
            background: #4caf50;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        
        /* Main Layout */
        .main-container {
            display: flex;
            height: calc(100vh - 60px);
        }
        
        /* Sidebar */
        .sidebar {
            width: 280px;
            background: white;
            border-right: 1px solid #e1e8ed;
            padding: 20px;
            overflow-y: auto;
        }
        
        .sidebar-section {
            margin-bottom: 30px;
        }
        
        .sidebar-title {
            font-size: 12px;
            font-weight: 600;
            color: #657786;
            text-transform: uppercase;
            margin-bottom: 12px;
            letter-spacing: 0.5px;
        }
        
        .content-item {
            padding: 12px;
            margin-bottom: 8px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .content-item:hover {
            background: #f8f9fa;
        }
        
        .content-item.active {
            background: #e3f2fd;
            color: #1976d2;
        }
        
        .content-icon {
            width: 32px;
            height: 32px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }
        
        .twitter-icon { background: #e8f5fd; }
        .instagram-icon { background: #fce4ec; }
        .tiktok-icon { background: #f3e5f5; }
        .blog-icon { background: #e8f5e9; }
        
        .content-info {
            flex: 1;
        }
        
        .content-title {
            font-weight: 500;
            font-size: 14px;
            margin-bottom: 2px;
        }
        
        .content-meta {
            font-size: 12px;
            color: #657786;
        }
        
        /* Main Content Area */
        .content-area {
            flex: 1;
            display: flex;
            background: #f5f7fa;
        }
        
        /* Preview Panel */
        .preview-panel {
            flex: 1;
            padding: 30px;
            overflow-y: auto;
        }
        
        .preview-container {
            max-width: 600px;
            margin: 0 auto;
        }
        
        /* Platform Previews */
        .platform-header {
            background: white;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        
        .platform-title {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .platform-status {
            display: flex;
            gap: 20px;
            font-size: 14px;
            color: #657786;
        }
        
        /* Twitter Preview */
        .twitter-thread {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        
        .tweet-box {
            padding: 16px;
            border: 1px solid #e1e8ed;
            border-radius: 12px;
            margin-bottom: 12px;
        }
        
        .tweet-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
        }
        
        .tweet-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #1da1f2;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
        }
        
        .tweet-author {
            flex: 1;
        }
        
        .tweet-name {
            font-weight: 600;
        }
        
        .tweet-handle {
            color: #657786;
            font-size: 14px;
        }
        
        .tweet-text {
            line-height: 1.5;
            margin-bottom: 12px;
        }
        
        .tweet-actions {
            display: flex;
            gap: 30px;
            color: #657786;
            font-size: 14px;
        }
        
        /* Action Panel */
        .action-panel {
            width: 320px;
            background: white;
            border-left: 1px solid #e1e8ed;
            padding: 30px;
        }
        
        .action-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
        }
        
        .action-section {
            margin-bottom: 30px;
        }
        
        .action-label {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 8px;
            color: #1a1a1a;
        }
        
        .schedule-input {
            width: 100%;
            padding: 10px;
            border: 1px solid #e1e8ed;
            border-radius: 8px;
            font-size: 14px;
            margin-bottom: 8px;
        }
        
        .platform-toggles {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .platform-toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px;
            border: 1px solid #e1e8ed;
            border-radius: 8px;
        }
        
        .toggle-switch {
            width: 44px;
            height: 24px;
            background: #e1e8ed;
            border-radius: 12px;
            position: relative;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .toggle-switch.active {
            background: #4caf50;
        }
        
        .toggle-knob {
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 50%;
            position: absolute;
            top: 2px;
            left: 2px;
            transition: transform 0.3s;
        }
        
        .toggle-switch.active .toggle-knob {
            transform: translateX(20px);
        }
        
        .action-buttons {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .btn {
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            text-align: center;
        }
        
        .btn-primary {
            background: #1da1f2;
            color: white;
        }
        
        .btn-primary:hover {
            background: #1a91da;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(29, 161, 242, 0.3);
        }
        
        .btn-secondary {
            background: white;
            color: #1a1a1a;
            border: 1px solid #e1e8ed;
        }
        
        .btn-secondary:hover {
            background: #f8f9fa;
        }
        
        /* Instagram Preview */
        .instagram-preview {
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            overflow: hidden;
        }
        
        .ig-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid #efefef;
        }
        
        .ig-image {
            width: 100%;
            height: 400px;
            background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 100px;
        }
        
        .ig-content {
            padding: 16px;
        }
        
        .ig-actions {
            display: flex;
            gap: 16px;
            margin-bottom: 12px;
            font-size: 24px;
        }
        
        .ig-caption {
            line-height: 1.4;
        }
        
        /* Hide inactive content */
        .content-preview {
            display: none;
        }
        
        .content-preview.active {
            display: block;
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="logo">
            <span style="font-size: 24px;">📚</span>
            <span>Prompt Stack Cloud</span>
        </div>
        
        <nav class="nav">
            <a href="#" class="active">Content</a>
            <a href="#">Calendar</a>
            <a href="#">Analytics</a>
            <a href="#">Settings</a>
        </nav>
        
        <div class="header-actions">
            <div class="sync-status">
                <span class="sync-dot"></span>
                <span>Synced with VS Code</span>
            </div>
            <button class="btn btn-primary" style="padding: 8px 16px;">
                Create in IDE
            </button>
        </div>
    </header>
    
    <div class="main-container">
        <aside class="sidebar">
            <div class="sidebar-section">
                <div class="sidebar-title">Ready to Deploy</div>
                
                <div class="content-item active" data-content="twitter-thread">
                    <div class="content-icon twitter-icon">🐦</div>
                    <div class="content-info">
                        <div class="content-title">AI Revolution Thread</div>
                        <div class="content-meta">3 tweets • Just now</div>
                    </div>
                </div>
                
                <div class="content-item" data-content="instagram-post">
                    <div class="content-icon instagram-icon">📷</div>
                    <div class="content-info">
                        <div class="content-title">Sunset Photo</div>
                        <div class="content-meta">1 post • 5 min ago</div>
                    </div>
                </div>
                
                <div class="content-item" data-content="tiktok-video">
                    <div class="content-icon tiktok-icon">🎵</div>
                    <div class="content-info">
                        <div class="content-title">Content Tips</div>
                        <div class="content-meta">Script ready • 1 hour ago</div>
                    </div>
                </div>
                
                <div class="content-item" data-content="blog-article">
                    <div class="content-icon blog-icon">📝</div>
                    <div class="content-info">
                        <div class="content-title">AI Content Revolution</div>
                        <div class="content-meta">2.5k words • 2 hours ago</div>
                    </div>
                </div>
            </div>
            
            <div class="sidebar-section">
                <div class="sidebar-title">Scheduled</div>
                <div style="padding: 20px; text-align: center; color: #657786; font-size: 14px;">
                    No scheduled posts
                </div>
            </div>
            
            <div class="sidebar-section">
                <div class="sidebar-title">Published Today</div>
                <div style="padding: 20px; text-align: center; color: #657786; font-size: 14px;">
                    Nothing published yet
                </div>
            </div>
        </aside>
        
        <main class="content-area">
            <div class="preview-panel">
                <!-- Twitter Thread Preview -->
                <div class="content-preview active" id="twitter-thread">
                    <div class="preview-container">
                        <div class="platform-header">
                            <h2 class="platform-title">Twitter Thread Preview</h2>
                            <div class="platform-status">
                                <span>📊 Est. reach: 5.2k</span>
                                <span>⏱️ Best time: 2:00 PM</span>
                                <span>🔥 Trending: #AI</span>
                            </div>
                        </div>
                        
                        <div class="twitter-thread">
                            <div class="tweet-box">
                                <div class="tweet-header">
                                    <div class="tweet-avatar">PS</div>
                                    <div class="tweet-author">
                                        <div class="tweet-name">Prompt Stack</div>
                                        <div class="tweet-handle">@promptstack</div>
                                    </div>
                                </div>
                                <div class="tweet-text">
                                    🚀 AI is transforming content creation! We're moving from manual workflows to intelligent automation that understands context and intent.<br><br>
                                    Thread 👇 (1/3)
                                </div>
                                <div class="tweet-actions">
                                    <span>💬 Reply</span>
                                    <span>🔁 Retweet</span>
                                    <span>❤️ Like</span>
                                    <span>📊 Analytics</span>
                                </div>
                            </div>
                            
                            <div style="text-align: center; margin: 10px 0; color: #657786;">
                                <div style="width: 2px; height: 20px; background: #e1e8ed; margin: 0 auto;"></div>
                            </div>
                            
                            <div class="tweet-box">
                                <div class="tweet-header">
                                    <div class="tweet-avatar">PS</div>
                                    <div class="tweet-author">
                                        <div class="tweet-name">Prompt Stack</div>
                                        <div class="tweet-handle">@promptstack</div>
                                    </div>
                                </div>
                                <div class="tweet-text">
                                    IDEs aren't just for code anymore. Imagine using the same powerful environment for:<br><br>
                                    ✅ Writing scripts<br>
                                    ✅ Creating social content<br>
                                    ✅ Managing campaigns<br>
                                    ✅ Automating distribution<br><br>
                                    All with simple commands! (2/3)
                                </div>
                                <div class="tweet-actions">
                                    <span>💬 Reply</span>
                                    <span>🔁 Retweet</span>
                                    <span>❤️ Like</span>
                                    <span>📊 Analytics</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Instagram Post Preview -->
                <div class="content-preview" id="instagram-post">
                    <div class="preview-container">
                        <div class="platform-header">
                            <h2 class="platform-title">Instagram Post Preview</h2>
                            <div class="platform-status">
                                <span>📊 Avg engagement: 8.5%</span>
                                <span>⏱️ Best time: 6:00 PM</span>
                                <span>📍 Location ready</span>
                            </div>
                        </div>
                        
                        <div class="instagram-preview">
                            <div class="ig-header">
                                <div class="tweet-avatar">PS</div>
                                <div style="flex: 1;">
                                    <div style="font-weight: 600;">promptstack</div>
                                    <div style="font-size: 13px; color: #8e8e8e;">San Francisco, CA</div>
                                </div>
                                <div style="font-size: 20px;">•••</div>
                            </div>
                            
                            <div class="ig-image">
                                🌅
                            </div>
                            
                            <div class="ig-content">
                                <div class="ig-actions">
                                    <span>❤️</span>
                                    <span>💬</span>
                                    <span>📤</span>
                                    <span style="margin-left: auto;">🔖</span>
                                </div>
                                
                                <div class="ig-caption">
                                    <strong>promptstack</strong> Capturing the magic of golden hour 🌅✨<br><br>
                                    There's something special about watching the day transform into night...<br><br>
                                    #sunset #goldenhour #nature #photography
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <aside class="action-panel">
                <h3 class="action-title">Deployment Options</h3>
                
                <div class="action-section">
                    <label class="action-label">Schedule</label>
                    <input type="datetime-local" class="schedule-input">
                    <label style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
                        <input type="checkbox" checked>
                        <span style="font-size: 14px;">Post at optimal time</span>
                    </label>
                </div>
                
                <div class="action-section">
                    <label class="action-label">Cross-post to</label>
                    <div class="platform-toggles">
                        <div class="platform-toggle">
                            <span>🐦 Twitter</span>
                            <div class="toggle-switch active" onclick="toggleSwitch(this)">
                                <div class="toggle-knob"></div>
                            </div>
                        </div>
                        <div class="platform-toggle">
                            <span>📷 Instagram</span>
                            <div class="toggle-switch" onclick="toggleSwitch(this)">
                                <div class="toggle-knob"></div>
                            </div>
                        </div>
                        <div class="platform-toggle">
                            <span>🎵 TikTok</span>
                            <div class="toggle-switch" onclick="toggleSwitch(this)">
                                <div class="toggle-knob"></div>
                            </div>
                        </div>
                        <div class="platform-toggle">
                            <span>💼 LinkedIn</span>
                            <div class="toggle-switch" onclick="toggleSwitch(this)">
                                <div class="toggle-knob"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="action-section">
                    <div class="action-buttons">
                        <button class="btn btn-primary">
                            🚀 Deploy Now
                        </button>
                        <button class="btn btn-secondary">
                            📅 Schedule Post
                        </button>
                        <button class="btn btn-secondary">
                            ✏️ Edit in VS Code
                        </button>
                    </div>
                </div>
                
                <div class="action-section" style="margin-top: 40px;">
                    <label class="action-label">Source File</label>
                    <div style="background: #f8f9fa; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 13px; color: #657786;">
                        ~/content/scripts/ai-revolution.md<br>
                        Last synced: Just now
                    </div>
                </div>
            </aside>
        </main>
    </div>
    
    <script>
        // Handle sidebar clicks
        document.querySelectorAll('.content-item').forEach(item => {
            item.addEventListener('click', function() {
                // Update active states
                document.querySelectorAll('.content-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                // Show corresponding preview
                const contentId = this.getAttribute('data-content');
                document.querySelectorAll('.content-preview').forEach(preview => {
                    preview.classList.remove('active');
                });
                const preview = document.getElementById(contentId);
                if (preview) {
                    preview.classList.add('active');
                }
            });
        });
        
        // Toggle switches
        function toggleSwitch(element) {
            element.classList.toggle('active');
        }
    </script>
</body>
</html>