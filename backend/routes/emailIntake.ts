import { Router, Request, Response } from 'express';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const router = Router();

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to intake-tools
const INTAKE_TOOLS_PATH = path.join(__dirname, '../../intake-tools/email-intake');

/**
 * Fetch emails for a specific date range
 * POST /api/email-intake/fetch
 * Body: {
 *   startDate: "2025-07-01",
 *   endDate: "2025-07-07",
 *   account: "bzhoff-heritage-hill" | "promptstackdev-gmail"
 * }
 */
router.post('/fetch', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, account } = req.body;

    // Validate inputs
    if (!startDate || !endDate || !account) {
      return res.status(400).json({ 
        error: 'Missing required fields: startDate, endDate, account' 
      });
    }

    // Validate account
    const validAccounts = ['bzhoff-heritage-hill', 'promptstackdev-gmail'];
    if (!validAccounts.includes(account)) {
      return res.status(400).json({ 
        error: 'Invalid account. Must be one of: ' + validAccounts.join(', ') 
      });
    }

    // Check if config exists
    const configPath = path.join(INTAKE_TOOLS_PATH, `config/${account}-config.json`);
    try {
      await fs.access(configPath);
    } catch {
      return res.status(404).json({ 
        error: `Config not found for account: ${account}` 
      });
    }

    // Execute Python script
    const pythonScript = path.join(INTAKE_TOOLS_PATH, 'python/src/fetch_date_range.py');
    const outputDir = path.join(INTAKE_TOOLS_PATH, 'inbox');

    const process = spawn('python3', [
      pythonScript,
      '--config', configPath,
      '--start-date', startDate,
      '--end-date', endDate,
      '--output', outputDir
    ]);

    let output = '';
    let error = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      error += data.toString();
    });

    process.on('close', (code) => {
      if (code !== 0) {
        console.error('Python script error:', error);
        return res.status(500).json({ 
          error: 'Failed to fetch emails', 
          details: error 
        });
      }

      // Count fetched files
      fs.readdir(outputDir)
        .then(files => {
          const fetchedFiles = files.filter(f => 
            f.includes(startDate.replace(/-/g, '-')) || 
            f.includes(endDate.replace(/-/g, '-'))
          );

          res.json({
            success: true,
            message: 'Emails fetched successfully',
            startDate,
            endDate,
            account,
            filesCount: fetchedFiles.length,
            output: output.split('\n').filter(line => line.trim())
          });
        })
        .catch(err => {
          res.json({
            success: true,
            message: 'Emails fetched',
            output: output.split('\n').filter(line => line.trim())
          });
        });
    });

  } catch (error) {
    console.error('Email intake error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

/**
 * Process fetched emails
 * POST /api/email-intake/process
 */
router.post('/process', async (req: Request, res: Response) => {
  try {
    const processScript = path.join(INTAKE_TOOLS_PATH, 'process_all.py');
    
    const process = spawn('python3', [processScript], {
      cwd: INTAKE_TOOLS_PATH
    });

    let output = '';
    let error = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      error += data.toString();
    });

    process.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({ 
          error: 'Failed to process emails', 
          details: error 
        });
      }

      res.json({
        success: true,
        message: 'Emails processed successfully',
        output: output.split('\n').filter(line => line.trim())
      });
    });

  } catch (error) {
    console.error('Process error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

/**
 * Get processed emails
 * GET /api/email-intake/processed?date=2025-07-14&type=articles|full_content
 */
router.get('/processed', async (req: Request, res: Response) => {
  try {
    const { date, type = 'articles' } = req.query;
    const processedDir = path.join(INTAKE_TOOLS_PATH, 'processed');
    
    const files = await fs.readdir(processedDir);
    
    // Filter by date and type
    const jsonFiles = files.filter(f => {
      if (date && !f.includes(date as string)) return false;
      if (type === 'full_content') {
        return f.endsWith('_full_content.json');
      }
      return f.endsWith('_articles.json');
    });

    // Read and parse files
    const results = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await fs.readFile(
          path.join(processedDir, file), 
          'utf-8'
        );
        return {
          filename: file,
          ...JSON.parse(content)
        };
      })
    );

    res.json({
      success: true,
      count: results.length,
      emails: results
    });

  } catch (error) {
    console.error('Get processed error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

/**
 * Get specific processed file content
 * GET /api/email-intake/processed/:filename
 */
router.get('/processed/:filename', async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const processedDir = path.join(INTAKE_TOOLS_PATH, 'processed');
    const filePath = path.join(processedDir, filename);
    
    // Security check to prevent directory traversal
    if (!filePath.startsWith(processedDir) || filename.includes('..')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: 'File not found' });
    }
    
    const content = await fs.readFile(filePath, 'utf-8');
    res.json(JSON.parse(content));
  } catch (error) {
    console.error('Error reading processed file:', error);
    res.status(500).json({ 
      error: 'Failed to read processed file',
      details: error.message 
    });
  }
});

export default router;