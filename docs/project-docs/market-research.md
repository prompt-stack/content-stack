Skip to content
Peter Steinberger
Posts
About
Search

Claude Code is My Computer
Published:
3 Jun, 2025
•
6 min read
| Edit on GitHub

TL;DR: I run Claude Code in no-prompt mode; it saves me an hour a day and hasn’t broken my Mac in two months. The $200/month Max plan pays for itself.

For the past two months, I’ve been living dangerously. I launch Claude Code (released in late February) with --dangerously-skip-permissions, the flag that bypasses all permission prompts. According to Anthropic’s docs, this is meant “only for Docker containers with no internet”, yet it runs perfectly on regular macOS.

Yes, a rogue prompt could theoretically nuke my system. That’s why I keep hourly Arq snapshots (plus a SuperDuper! clone), but after two months I’ve had zero incidents.

From ‘AI assistant’ to everything terminal#
When I first installed Claude Code, I thought I was getting a smarter command line for coding tasks. What I actually got was a universal computer interface that happens to run in text. The mental shift took a few weeks, but once it clicked, I realized Claude can literally do anything I ask on my computer.

The breakthrough moment came when I was migrating to a new Mac. Instead of doing the usual restore dance, I pointed Claude at my backup disk and said: “Restore this Mac from my backup disk—start with dotfiles, then system preferences, CLI tools, and restore Homebrew formulae and global npm packages.” Claude drafts a migration plan, executes it step by step, and has my new machine ready in under an hour.1

What I actually use it for#
My daily Claude Code usage falls into several main outcomes:

Ship Content: “Convert ~40 posts from Jekyll to MDX format here. Make sure to copy over the images and preserve the redirects.” Twenty minutes later, Claude had processed every single post, set up proper redirects, validated all image paths, and pushed a merge-ready branch.

Extract Features: “Extract this feature into a Swift project” (that’s how I released Demark) where Claude creates the package structure, writes tests, documentation, and handles the entire open-source release process.

Automate Content: Like this very post. I use Wispr Flow to talk with Claude, explain the topic and tell it to read my past blog posts to write in my style. Instead of wrestling with Markdown formatting, Claude creates the document, helps formulate thoughts, and tests that everything displays correctly.

Generate Test Data: “Create seed data for a project” turns into Claude analyzing my codebase, understanding the data models, and generating realistic test data with proper relationships.

Ship Code: I haven’t typed git commit -m in weeks. Instead, I say “commit everything in logical chunks” and Claude handles the entire flow—staging changes, writing meaningful commit messages, pushing, opening PRs, watching CI, and fixing any CI failures. When builds break, it analyzes the errors and patches them automatically. It’s also extremely good at resolving merge conflicts.

Clean the OS: “Hide recent apps in the Dock” becomes a single natural language command instead of Googling for the right defaults write incantation. Claude knows macOS internals and happily calls killall Dock to restart the Dock after modifying the plist.

Spin Up New Machines: Recently when setting up CodeLooper’s code signing and notarization, Claude handled installing Homebrew packages, creating private keys, adding them to the keychain, creating backups, building the project, uploading to GitHub, running tests, and monitoring the process. The only manual part was clicking through the update UI, but with my macOS Automator MCP Server, I could probably teach it that too.

I use an alias in my shell config2 so just typing cc runs Claude with the permission flag.

Why this works (and when it doesn’t)#
Claude Code shines because it was built command-line-first, not bolted onto an IDE as an afterthought. The agent has full access to my filesystem (if you are bold enough…), can execute commands, read output, and iterate based on results.

Anthropic’s best practices guide recommends keeping a CLAUDE.md file at your repo root with project-specific context. I’ve adopted this pattern and noticed Claude asks fewer clarifying questions and writes more accurate code. You can check out my Claude Code rules for examples of how I structure these files. Little optimizations like this compound quickly.

The main limitation is response time. Claude’s thinking process takes a few seconds, and for rapid-fire debugging sessions, I sometimes reach for traditional tools. However, you can prefix commands with ! to run them directly without waiting for token evaluation—Claude will execute your command either way, but this is faster when you know exactly what you’re calling. For exploratory work where I’m not sure what I need, Claude’s reasoning ability more than compensates for the brief pause.

Why Warp lacks#
Warp’s mission is to “reinvent the command line with AI”. They’ve built beautiful GPU-accelerated panels and smart autocomplete.

The fundamental difference comes down to trust and execution flow. Claude operates purely through text and is remarkably intelligent about understanding context and intent. With this setup, I can pre-authorize Claude to execute commands without constant confirmation prompts. Warp, while excellent, requires individual approval for each command—there’s no equivalent to Claude’s “dangerous mode” where you can grant blanket execution trust. This means Claude maintains conversational flow while Warp still interrupts with permission requests.

I signed up for Warp because I like their mission and I hope they eventually go where Claude is. But it seems they have a fundamentally different idea about safety. Also, Ghostty is just the better command line, native, not Electron-based and faster.

Where this is heading#
We’re in the very early days of AI-native development tools. Claude Code represents a paradigm shift: from tools that help you run commands to tools that understand intent and take action. I’m not just typing commands faster—I’m operating at a fundamentally higher level of abstraction. Instead of thinking “I need to write a bash script to process these files, chmod it, test it, debug it,” I think “organize these files by date and compress anything older than 30 days.”

This isn’t about AI replacing developers—it’s about developers becoming orchestrators of incredibly powerful systems. The skill ceiling rises: syntax fades, system thinking shines.

Should you try this?#
If you’re comfortable with calculated risks and have solid backups, absolutely. The learning curve is essentially zero—you just start talking to your computer like it’s a competent colleague. Within days, you’ll wonder how you ever worked without it.

Your computer isn’t just a computer anymore. It’s Claude. And Claude is absurdly capable.

Got a crazier Claude workflow? Ping me @steipete.

Essential Reading: How I Use Claude Code is a must-read by my friend and ex-employee Philipp for everyone using Claude Code.

Footnotes#
Note that full backup migrations can sometimes cause various system issues with newer macOS versions. ↩

alias cc="claude --dangerously-skip-permissions" ↩

New posts, shipping stories, and nerdy links straight to your inbox.

Your Name
Your Email
Subscribe
2× per month, pure signal, zero fluff.

  AI  Claude  Computing  Development  Productivity  Claude-Code  DevOps  Automation
Share this post on:
Share this post on X
Share this post on BlueSky
Share this post on LinkedIn
Share this post via WhatsApp
Share this post on Facebook
Share this post via Telegram
Share this post on Pinterest
Share this post via email
 Back to Top
Previous Post
Vibe Meter: Monitor Your AI Costs
Next Post
Stop Over-thinking AI Subscriptions
Peter Steinberger on Github
Peter Steinberger on X
Peter Steinberger on BlueSky
Peter Steinberger on LinkedIn
Send an email to Peter Steinberger
Steal this post ➜ CC BY 4.0 · Code MIT
