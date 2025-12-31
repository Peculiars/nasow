import { X, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface BulkActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  selectedCount: number;
  action: 'suspend' | 'ban' | 'activate' | 'delete';
}

const actionConfig = {
  suspend: {
    title: 'Suspend Students',
    description: 'The selected students will not be able to access the platform until reactivated.',
    confirmText: 'Suspend Students',
    confirmColor: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    requireReason: true
  },
  ban: {
    title: 'Ban Students',
    description: 'The selected students will be permanently banned. This action is severe and should only be used for serious violations.',
    confirmText: 'Ban Students',
    confirmColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    requireReason: true
  },
  activate: {
    title: 'Activate Students',
    description: 'The selected students will be reactivated and regain full access to the platform.',
    confirmText: 'Activate Students',
    confirmColor: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    requireReason: false
  },
  delete: {
    title: 'Delete Students',
    description: 'The selected students will be permanently deleted from the system. This action cannot be undone and will remove all their data.',
    confirmText: 'Delete Students',
    confirmColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    requireReason: false
  }
};

export default function BulkActionModal({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  action
}: BulkActionModalProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const config = actionConfig[action];

  const handleConfirm = async () => {
    if (config.requireReason && !reason.trim()) return;
    
    setIsSubmitting(true);
    await onConfirm(reason);
    setIsSubmitting(false);
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleClose} />
        
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 border-2 border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{config.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedCount} student{selectedCount !== 1 ? 's' : ''} selected
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
            <p className="text-sm text-gray-700">{config.description}</p>
          </div>
          
          {config.requireReason && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Enter reason for this bulk action..."
              />
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting || (config.requireReason && !reason.trim())}
              className={`flex-1 px-4 py-2 text-white font-medium rounded-lg transition-colors disabled:opacity-50 ${config.confirmColor}`}
            >
              {isSubmitting ? 'Processing...' : config.confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}