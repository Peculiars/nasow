import { X } from 'lucide-react';
import { useState } from 'react';
import { ActionModalProps } from '../schema';

const colorClasses = {
  red: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  yellow: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
  green: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
};

export default function ActionModal({ isOpen, onClose, onConfirm, title, description, confirmText, confirmColor, requireReason = false }: ActionModalProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (requireReason && !reason.trim()) return;
    
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
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          
          {requireReason && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Enter reason for this action..."
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
              disabled={isSubmitting || (requireReason && !reason.trim())}
              className={`flex-1 px-4 py-2 text-white font-medium rounded-lg transition-colors disabled:opacity-50 ${colorClasses[confirmColor]}`}
            >
              {isSubmitting ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}