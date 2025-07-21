<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prompt Stack - Content Inbox</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0a0a0a;
            color: #ffffff;
            min-height: 100vh;
        }
        
        /* Header */
        .header {
            background: rgba(20, 20, 20, 0.8);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 0 24px;
            height: 60px;
            display: flex;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        .logo {
            font-size: 20px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .nav {
            display: flex;
            gap: 32px;
            margin-left: 48px;
        }
        
        .nav a {
            text-decoration: none;
            color: rgba(255, 255, 255, 0.7);
            font-weight: 500;
            transition: color 0.2s;
            position: relative;
        }
        
        .nav a.active {
            color: #ffffff;
        }
        
        .nav a.active::after {
            content: '';
            position: absolute;
            bottom: -20px;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        }
        
        /* Main Layout */
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 40px 24px;
        }
        
        /* Inbox Header */
        .inbox-header {
            margin-bottom: 40px;
        }
        
        .inbox-title {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 16px;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .inbox-actions {
            display: flex;
            gap: 16px;
            align-items: center;
        }
        
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
        }
        
        .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.15);
        }
        
        /* Input Methods Grid */
        .input-methods {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .input-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 24px;
            cursor: pointer;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
        }
        
        .input-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #3b82f6, transparent);
            transform: translateX(-100%);
            transition: transform 0.5s;
        }
        
        .input-card:hover::before {
            transform: translateX(100%);
        }
        
        .input-card:hover {
            background: rgba(255, 255, 255, 0.08);
            transform: translateY(-4px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .input-icon {
            font-size: 32px;
            margin-bottom: 12px;
        }
        
        .input-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .input-desc {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.6);
            line-height: 1.4;
        }
        
        /* Inbox Queue */
        .inbox-section {
            margin-bottom: 40px;
        }
        
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: 600;
        }
        
        .queue-count {
            background: rgba(59, 130, 246, 0.2);
            color: #3b82f6;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 13px;
        }
        
        .queue-items {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .queue-item {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 16px 20px;
            display: flex;
            align-items: center;
            gap: 16px;
            transition: all 0.2s;
            cursor: pointer;
        }
        
        .queue-item:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.2);
        }
        
        .queue-item.processing {
            border-color: #3b82f6;
            background: rgba(59, 130, 246, 0.1);
        }
        
        .file-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            flex-shrink: 0;
        }
        
        .file-icon.article { background: rgba(59, 130, 246, 0.2); }
        .file-icon.image { background: rgba(236, 72, 153, 0.2); }
        .file-icon.data { background: rgba(34, 197, 94, 0.2); }
        .file-icon.voice { background: rgba(251, 146, 60, 0.2); }
        
        .queue-content {
            flex: 1;
        }
        
        .queue-filename {
            font-weight: 500;
            margin-bottom: 4px;
        }
        
        .queue-meta {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.5);
            display: flex;
            gap: 16px;
        }
        
        .queue-actions {
            display: flex;
            gap: 8px;
        }
        
        .action-btn {
            padding: 6px 12px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            color: white;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .action-btn:hover {
            background: rgba(255, 255, 255, 0.15);
        }
        
        .action-btn.primary {
            background: rgba(59, 130, 246, 0.2);
            border-color: #3b82f6;
            color: #3b82f6;
        }
        
        /* Processing Animation */
        .processing-indicator {
            display: flex;
            gap: 4px;
            align-items: center;
        }
        
        .processing-dot {
            width: 6px;
            height: 6px;
            background: #3b82f6;
            border-radius: 50%;
            animation: processingPulse 1.4s infinite;
        }
        
        .processing-dot:nth-child(2) { animation-delay: 0.2s; }
        .processing-dot:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes processingPulse {
            0%, 80%, 100% {
                transform: scale(0.8);
                opacity: 0.5;
            }
            40% {
                transform: scale(1.2);
                opacity: 1;
            }
        }
        
        /* Command Input */
        .command-input {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .command-input:focus-within {
            border-color: #3b82f6;
            background: rgba(59, 130, 246, 0.05);
        }
        
        .command-field {
            flex: 1;
            background: transparent;
            border: none;
            color: white;
            font-size: 14px;
            outline: none;
        }
        
        .command-field::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }
        
        /* Stats */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-top: 40px;
        }
        
        .stat-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 20px;
            text-align: center;
        }
        
        .stat-value {
            font-size: 32px;
            font-weight: 700;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 4px;
        }
        
        .stat-label {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.6);
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="logo">
            <span style="font-size: 24px;">📚</span>
            <span>Prompt Stack</span>
        </div>
        
        <nav class="nav">
            <a href="#" class="active">Inbox</a>
            <a href="#">Content</a>
            <a href="#">Calendar</a>
            <a href="#">Analytics</a>
            <a href="#">Settings</a>
        </nav>
    </header>
    
    <div class="container">
        <div class="inbox-header">
            <h1 class="inbox-title">Content Inbox</h1>
            <div class="inbox-actions">
                <div class="command-input" style="width: 500px; margin: 0;">
                    <span>🚀</span>
                    <input type="text" class="command-field" placeholder="add PS article.md → tweet thread + blog post">
                    <button class="btn btn-primary" style="padding: 6px 16px;">Execute</button>
                </div>
                <button class="btn btn-secondary">
                    <span>⚙️</span>
                    Batch Process
                </button>
            </div>
        </div>
        
        <div class="input-methods">
            <div class="input-card">
                <div class="input-icon">🌐</div>
                <div class="input-title">Web Clipper</div>
                <div class="input-desc">Save articles, threads, and web content directly to your inbox</div>
            </div>
            
            <div class="input-card">
                <div class="input-icon">📧</div>
                <div class="input-title">Email Gateway</div>
                <div class="input-desc">Forward emails to inbox@promptstack.io with transformation commands</div>
            </div>
            
            <div class="input-card">
                <div class="input-icon">🎙️</div>
                <div class="input-title">Voice Notes</div>
                <div class="input-desc">Record ideas on the go, auto-transcribed and ready to process</div>
            </div>
            
            <div class="input-card">
                <div class="input-icon">📸</div>
                <div class="input-title">Screenshot OCR</div>
                <div class="input-desc">Capture any text from images and screenshots automatically</div>
            </div>
            
            <div class="input-card">
                <div class="input-icon">🔗</div>
                <div class="input-title">API Webhook</div>
                <div class="input-desc">Connect any service via webhooks for automated ingestion</div>
            </div>
            
            <div class="input-card">
                <div class="input-icon">📁</div>
                <div class="input-title">File Upload</div>
                <div class="input-desc">Drag and drop documents, CSVs, images, and more</div>
            </div>
        </div>
        
        <div class="inbox-section">
            <div class="section-header">
                <h2 class="section-title">Queue</h2>
                <span class="queue-count">5 items pending</span>
            </div>
            
            <div class="queue-items">
                <div class="queue-item processing">
                    <div class="file-icon article">📄</div>
                    <div class="queue-content">
                        <div class="queue-filename">ai-content-revolution.md</div>
                        <div class="queue-meta">
                            <span>2.3k words</span>
                            <span>Added 2 min ago</span>
                            <span class="processing-indicator">
                                Processing
                                <span class="processing-dot"></span>
                                <span class="processing-dot"></span>
                                <span class="processing-dot"></span>
                            </span>
                        </div>
                    </div>
                    <div class="queue-actions">
                        <button class="action-btn">View</button>
                    </div>
                </div>
                
                <div class="queue-item">
                    <div class="file-icon image">🖼️</div>
                    <div class="queue-content">
                        <div class="queue-filename">product-screenshot.png</div>
                        <div class="queue-meta">
                            <span>1.2 MB</span>
                            <span>Added 15 min ago</span>
                            <span>Ready to process</span>
                        </div>
                    </div>
                    <div class="queue-actions">
                        <button class="action-btn primary">Transform</button>
                        <button class="action-btn">Configure</button>
                    </div>
                </div>
                
                <div class="queue-item">
                    <div class="file-icon data">📊</div>
                    <div class="queue-content">
                        <div class="queue-filename">q4-earnings-data.csv</div>
                        <div class="queue-meta">
                            <span>156 KB</span>
                            <span>Added 1 hour ago</span>
                            <span>Tagged: #finance #quarterly</span>
                        </div>
                    </div>
                    <div class="queue-actions">
                        <button class="action-btn primary">Transform</button>
                        <button class="action-btn">Configure</button>
                    </div>
                </div>
                
                <div class="queue-item">
                    <div class="file-icon voice">🎙️</div>
                    <div class="queue-content">
                        <div class="queue-filename">voice-note-20240120.mp3</div>
                        <div class="queue-meta">
                            <span>3:45 duration</span>
                            <span>Added 2 hours ago</span>
                            <span>Transcribed</span>
                        </div>
                    </div>
                    <div class="queue-actions">
                        <button class="action-btn primary">Transform</button>
                        <button class="action-btn">View Transcript</button>
                    </div>
                </div>
                
                <div class="queue-item">
                    <div class="file-icon article">🔗</div>
                    <div class="queue-content">
                        <div class="queue-filename">https://techcrunch.com/2024/ai-trends...</div>
                        <div class="queue-meta">
                            <span>Web article</span>
                            <span>Added 3 hours ago</span>
                            <span>Scraped & ready</span>
                        </div>
                    </div>
                    <div class="queue-actions">
                        <button class="action-btn primary">Transform</button>
                        <button class="action-btn">Preview</button>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="inbox-section">
            <div class="section-header">
                <h2 class="section-title">Recently Processed</h2>
            </div>
            
            <div class="queue-items">
                <div class="queue-item" style="opacity: 0.7;">
                    <div class="file-icon article">✅</div>
                    <div class="queue-content">
                        <div class="queue-filename">weekly-newsletter.md</div>
                        <div class="queue-meta">
                            <span>Transformed to: Email + Blog + Twitter Thread</span>
                            <span>Completed 30 min ago</span>
                        </div>
                    </div>
                    <div class="queue-actions">
                        <button class="action-btn">View Results</button>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">247</div>
                <div class="stat-label">Items Processed Today</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">1.2k</div>
                <div class="stat-label">Content Pieces Created</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">89%</div>
                <div class="stat-label">Automation Rate</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">5.3h</div>
                <div class="stat-label">Time Saved</div>
            </div>
        </div>
    </div>
</body>
</html>