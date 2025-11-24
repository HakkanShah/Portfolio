'use client';

import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X, FileText } from 'lucide-react';

interface ResumePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeUrl: string;
}

const ResumePreviewModal = ({ isOpen, onClose, resumeUrl }: ResumePreviewModalProps) => {
  
  // Auto-download when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        handleDownload();
      }, 1500); // Start download after 1.5s
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'Hakkan_Parbej_Shah_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl w-[95vw] h-[90vh] p-0 border-4 border-foreground bg-background flex flex-col"
        hideClose={true}
      >
        {/* Header */}
        <div className="relative p-4 border-b-4 border-foreground bg-muted/30 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg border-2 border-primary/20">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="font-headline text-xl sm:text-2xl text-primary tracking-wide">
                Resume Preview
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Downloading automatically...
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleDownload}
              size="sm"
              className="hidden sm:flex gap-2 font-bold border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all"
            >
              <Download className="h-4 w-4" />
              Download Again
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="border-2 border-foreground hover:bg-destructive/10 hover:border-destructive transition-colors"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* PDF Preview */}
        <div className="flex-1 bg-gray-100 w-full h-full overflow-hidden relative">
          <iframe 
            src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full border-none"
            title="Resume Preview"
          />
          
          {/* Mobile Download Button (Floating) */}
          <div className="absolute bottom-6 right-6 sm:hidden">
            <Button 
              onClick={handleDownload}
              size="lg"
              className="rounded-full h-14 w-14 p-0 border-2 border-foreground shadow-lg"
            >
              <Download className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumePreviewModal;
