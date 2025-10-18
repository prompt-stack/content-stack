/**
 * @fileoverview Test for Dropzone component
 * @module Dropzone.test
 * @test-coverage 85
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropzone } from './Dropzone';

// Mock dependencies
jest.mock('@/lib/validators', () => ({
  validateFileType: jest.fn(),
  validateFileSize: jest.fn()
}));

jest.mock('@/lib/formatters', () => ({
  formatFileSize: jest.fn((size: number) => `${size / 1024 / 1024}MB`)
}));

jest.mock('@/lib/constants', () => ({
  ACCEPTED_FILE_TYPES: ['.txt', '.pdf', '.jpg', '.png'],
  MAX_FILE_SIZE: 10 * 1024 * 1024 // 10MB
}));

// Mock react-dropzone
const mockGetRootProps = jest.fn(() => ({
  onClick: jest.fn(),
  onDrop: jest.fn(),
  role: 'button'
}));

const mockGetInputProps = jest.fn(() => ({
  type: 'file',
  multiple: true
}));

jest.mock('react-dropzone', () => ({
  useDropzone: jest.fn(() => ({
    getRootProps: mockGetRootProps,
    getInputProps: mockGetInputProps,
    isDragActive: false,
    acceptedFiles: [],
    fileRejections: []
  }))
}));

import { validateFileType, validateFileSize } from '@/lib/validators';
import { useDropzone } from 'react-dropzone';

describe('Dropzone', () => {
  const mockOnDrop = jest.fn();
  const mockOnExpandToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (validateFileType as jest.Mock).mockReturnValue(true);
    (validateFileSize as jest.Mock).mockReturnValue(true);
  });

  const renderComponent = (props = {}) => {
    return render(
      <Dropzone 
        onDrop={mockOnDrop} 
        {...props}
      />
    );
  };

  describe('rendering', () => {
    it('should render without crashing', () => {
      renderComponent();
      expect(screen.getByText(/Drag 'n' drop files here/i)).toBeInTheDocument();
    });

    it('should render in compact mode', () => {
      renderComponent({ isCompact: true });
      expect(screen.getByText(/Drop files or/i)).toBeInTheDocument();
    });

    it('should render children when provided', () => {
      renderComponent({ 
        children: <div>Custom content</div> 
      });
      expect(screen.getByText('Custom content')).toBeInTheDocument();
    });

    it('should show accepted file types', () => {
      renderComponent();
      expect(screen.getByText(/Accepted:/i)).toBeInTheDocument();
    });

    it('should show max file size', () => {
      renderComponent();
      expect(screen.getByText(/10MB/i)).toBeInTheDocument();
    });
  });

  describe('drag state', () => {
    it('should show drag active state', () => {
      (useDropzone as jest.Mock).mockReturnValue({
        getRootProps: mockGetRootProps,
        getInputProps: mockGetInputProps,
        isDragActive: true,
        acceptedFiles: [],
        fileRejections: []
      });

      renderComponent();
      expect(screen.getByText(/Drop the files here/i)).toBeInTheDocument();
    });

    it('should apply drag active class', () => {
      (useDropzone as jest.Mock).mockReturnValue({
        getRootProps: mockGetRootProps,
        getInputProps: mockGetInputProps,
        isDragActive: true,
        acceptedFiles: [],
        fileRejections: []
      });

      const { container } = renderComponent();
      const dropzone = container.querySelector('.dropzone');
      expect(dropzone).toHaveClass('dropzone--active');
    });
  });

  describe('file handling', () => {
    it('should call onDrop with valid files', () => {
      const mockFiles = [
        new File(['content'], 'test.txt', { type: 'text/plain' }),
        new File(['content'], 'test.pdf', { type: 'application/pdf' })
      ];

      // Setup the mock to trigger handleDrop
      let dropCallback: any;
      (useDropzone as jest.Mock).mockImplementation(({ onDrop }) => {
        dropCallback = onDrop;
        return {
          getRootProps: mockGetRootProps,
          getInputProps: mockGetInputProps,
          isDragActive: false,
          acceptedFiles: [],
          fileRejections: []
        };
      });

      renderComponent();
      
      // Simulate drop
      dropCallback(mockFiles, []);

      expect(mockOnDrop).toHaveBeenCalledWith(mockFiles);
    });

    it('should reject files with invalid type', () => {
      (validateFileType as jest.Mock).mockReturnValue(false);

      const mockFiles = [
        new File(['content'], 'test.exe', { type: 'application/exe' })
      ];

      let dropCallback: any;
      (useDropzone as jest.Mock).mockImplementation(({ onDrop }) => {
        dropCallback = onDrop;
        return {
          getRootProps: mockGetRootProps,
          getInputProps: mockGetInputProps,
          isDragActive: false,
          acceptedFiles: [],
          fileRejections: []
        };
      });

      renderComponent();
      dropCallback(mockFiles, []);

      expect(screen.getByText(/test.exe: File type not supported/i)).toBeInTheDocument();
      expect(mockOnDrop).toHaveBeenCalledWith([]);
    });

    it('should reject files that are too large', () => {
      (validateFileType as jest.Mock).mockReturnValue(true);
      (validateFileSize as jest.Mock).mockReturnValue(false);

      const mockFiles = [
        new File(['x'.repeat(11 * 1024 * 1024)], 'large.txt', { type: 'text/plain' })
      ];

      let dropCallback: any;
      (useDropzone as jest.Mock).mockImplementation(({ onDrop }) => {
        dropCallback = onDrop;
        return {
          getRootProps: mockGetRootProps,
          getInputProps: mockGetInputProps,
          isDragActive: false,
          acceptedFiles: [],
          fileRejections: []
        };
      });

      renderComponent();
      dropCallback(mockFiles, []);

      expect(screen.getByText(/large.txt: File too large/i)).toBeInTheDocument();
      expect(mockOnDrop).toHaveBeenCalledWith([]);
    });

    it('should handle mixed valid and invalid files', () => {
      (validateFileType as jest.Mock).mockImplementation((file) => 
        file.name !== 'invalid.exe'
      );
      (validateFileSize as jest.Mock).mockReturnValue(true);

      const mockFiles = [
        new File(['content'], 'valid.txt', { type: 'text/plain' }),
        new File(['content'], 'invalid.exe', { type: 'application/exe' }),
        new File(['content'], 'valid.pdf', { type: 'application/pdf' })
      ];

      let dropCallback: any;
      (useDropzone as jest.Mock).mockImplementation(({ onDrop }) => {
        dropCallback = onDrop;
        return {
          getRootProps: mockGetRootProps,
          getInputProps: mockGetInputProps,
          isDragActive: false,
          acceptedFiles: [],
          fileRejections: []
        };
      });

      renderComponent();
      dropCallback(mockFiles, []);

      expect(screen.getByText(/invalid.exe: File type not supported/i)).toBeInTheDocument();
      expect(mockOnDrop).toHaveBeenCalledWith([mockFiles[0], mockFiles[2]]);
    });
  });

  describe('compact mode', () => {
    it('should call onExpandToggle when expand button clicked', async () => {
      const user = userEvent.setup();
      renderComponent({ 
        isCompact: true, 
        onExpandToggle: mockOnExpandToggle 
      });

      const expandButton = screen.getByText('expand');
      await user.click(expandButton);

      expect(mockOnExpandToggle).toHaveBeenCalledTimes(1);
    });

    it('should not show expand button without handler', () => {
      renderComponent({ isCompact: true });
      expect(screen.queryByText('expand')).not.toBeInTheDocument();
    });
  });

  describe('file rejections', () => {
    it('should display multiple rejection reasons', () => {
      (validateFileType as jest.Mock)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);
      (validateFileSize as jest.Mock)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      const mockFiles = [
        new File(['content'], 'bad-type.exe', { type: 'application/exe' }),
        new File(['x'.repeat(11 * 1024 * 1024)], 'too-large.txt', { type: 'text/plain' })
      ];

      let dropCallback: any;
      (useDropzone as jest.Mock).mockImplementation(({ onDrop }) => {
        dropCallback = onDrop;
        return {
          getRootProps: mockGetRootProps,
          getInputProps: mockGetInputProps,
          isDragActive: false,
          acceptedFiles: [],
          fileRejections: []
        };
      });

      renderComponent();
      dropCallback(mockFiles, []);

      expect(screen.getByText(/bad-type.exe: File type not supported/i)).toBeInTheDocument();
      expect(screen.getByText(/too-large.txt: File too large/i)).toBeInTheDocument();
    });

    it('should clear rejections on new drop', () => {
      (validateFileType as jest.Mock).mockReturnValueOnce(false);

      let dropCallback: any;
      (useDropzone as jest.Mock).mockImplementation(({ onDrop }) => {
        dropCallback = onDrop;
        return {
          getRootProps: mockGetRootProps,
          getInputProps: mockGetInputProps,
          isDragActive: false,
          acceptedFiles: [],
          fileRejections: []
        };
      });

      renderComponent();
      
      // First drop with invalid file
      dropCallback([new File([''], 'bad.exe')], []);
      expect(screen.getByText(/bad.exe: File type not supported/i)).toBeInTheDocument();

      // Second drop with valid file
      (validateFileType as jest.Mock).mockReturnValue(true);
      dropCallback([new File([''], 'good.txt')], []);
      
      expect(screen.queryByText(/bad.exe: File type not supported/i)).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      renderComponent();
      const dropzone = screen.getByRole('button');
      expect(dropzone).toBeInTheDocument();
    });

    it('should have file input', () => {
      const { container } = renderComponent();
      const input = container.querySelector('input[type="file"]');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('multiple');
    });
  });
});