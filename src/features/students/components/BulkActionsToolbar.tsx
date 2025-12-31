import { X, UserX, Ban, CheckCircle, Trash2, Download } from 'lucide-react';

interface BulkActionsToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onSuspend: () => void;
  onBan: () => void;
  onActivate: () => void;
  onDelete: () => void;
  onExport: () => void;
}

export default function BulkActionsToolbar({
  selectedCount,
  onClearSelection,
  onSuspend,
  onBan,
  onActivate,
  onDelete,
  onExport
}: BulkActionsToolbarProps) {
  return (
    <div className="bg-purple-600 text-white rounded-xl border-2 border-purple-700 p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">
              {selectedCount} student{selectedCount !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={onClearSelection}
              className="p-1 hover:bg-purple-700 rounded transition-colors"
              title="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-white text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          
          <button
            onClick={onActivate}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 font-medium rounded-lg transition-colors"
          >
            <CheckCircle className="h-4 w-4" />
            Activate
          </button>
          
          <button
            onClick={onSuspend}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 font-medium rounded-lg transition-colors"
          >
            <UserX className="h-4 w-4" />
            Suspend
          </button>
          
          <button
            onClick={onBan}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 font-medium rounded-lg transition-colors"
          >
            <Ban className="h-4 w-4" />
            Ban
          </button>
          
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 font-medium rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}