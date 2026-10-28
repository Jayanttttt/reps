import React, { useState, ReactNode } from 'react';
import { useTheme } from '../theme';

// ============================================================
// Modal Component
// ============================================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-3xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 transition-opacity ${
          isLight ? 'bg-slate-900/35 backdrop-blur-sm' : 'bg-black/60 backdrop-blur-sm'
        }`}
        onClick={onClose}
      />
      <div
        className={`relative w-full ${sizeClasses[size]} rounded-2xl shadow-2xl max-h-[85vh] flex flex-col border ${
          isLight
            ? 'bg-white/90 backdrop-blur-2xl border-white/80 text-[#1A2238] shadow-[0_20px_50px_rgba(24,39,75,0.12)]'
            : 'bg-black/75 backdrop-blur-2xl border-white/20 text-white'
        }`}
      >
        <div className={`flex items-center justify-between p-5 border-b ${isLight ? 'border-[#EEF2F6]' : 'border-white/10'}`}>
          <h2 className={`text-lg font-bold ${isLight ? 'text-[#1A2238]' : 'text-white drop-shadow'}`}>{title}</h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isLight
                ? 'text-[#64748B] hover:text-[#1A2238] hover:bg-[#F1F4F9]'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

// ============================================================
// Card Component - Glassmorphic / Transparent
// ============================================================
interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`glass-card rounded-2xl p-4.5 ${onClick ? 'cursor-pointer glass-card-interactive' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// ============================================================
// Button Component
// ============================================================
interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  title?: string;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  title,
}: ButtonProps) {
  const variants = {
    primary: 'glass-btn-primary',
    secondary: 'glass-btn-secondary',
    danger: 'bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-500/40 border-t-white/30 backdrop-blur-xl shadow-lg shadow-black/40',
    ghost: 'bg-transparent hover:bg-white/10 text-neutral-200',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

// ============================================================
// EditableField Component
// ============================================================
interface EditableFieldProps {
  value: string | number;
  onSave: (value: string) => void;
  type?: 'text' | 'number';
  label?: string;
  className?: string;
  min?: number;
  step?: number;
}

export function EditableField({
  value,
  onSave,
  type = 'text',
  label,
  className = '',
  min,
  step,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditValue(String(value));
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {label && <span className="text-xs text-slate-300">{label}:</span>}
        <input
          type={type}
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          min={min}
          step={step}
          autoFocus
          className="bg-black/50 border border-red-500 rounded-lg px-2 py-1 text-white text-sm w-20 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1 cursor-pointer group ${className}`}
      onClick={() => {
        setEditValue(String(value));
        setIsEditing(true);
      }}
    >
      {label && <span className="text-xs text-neutral-300">{label}:</span>}
      <span className="text-white font-medium">{value}</span>
      <svg
        className="w-3 h-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    </div>
  );
}

// ============================================================
// Badge Component
// ============================================================
interface BadgeProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

export function Badge({ children, color, className = '' }: BadgeProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const defaultColor = isLight
    ? 'bg-[#FFF0ED] text-[#FF5B45] border-[#FF5B45]/30'
    : 'bg-red-500/20 text-red-300 border-red-500/30';

  // If light mode and a dark background class was passed from dark constants, normalize it to warm light tint
  let badgeColor = color || defaultColor;
  if (isLight && color && (color.includes('950') || color.includes('neutral-900') || color.includes('bg-black') || color.includes('bg-neutral-800'))) {
    badgeColor = 'bg-[#FFF0ED] text-[#FF5B45] border-[#FF5B45]/35 font-bold';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${badgeColor} ${className}`}>
      {children}
    </span>
  );
}

// ============================================================
// EmptyState Component
// ============================================================
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className={`mb-4 ${isLight ? 'text-[#FF5B45]' : 'text-red-400 drop-shadow'}`}>{icon}</div>}
      <h3 className={`text-lg font-bold mb-2 ${isLight ? 'text-[#1A2238]' : 'text-white drop-shadow'}`}>{title}</h3>
      <p className={`text-sm mb-6 max-w-sm ${isLight ? 'text-[#5F6D7E]' : 'text-neutral-300'}`}>{description}</p>
      {action}
    </div>
  );
}

// ============================================================
// ProgressBar Component
// ============================================================
interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({ value, max, color, showLabel = true, className = '' }: ProgressBarProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const percentage = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;
  const barColor = color || (isLight ? 'bg-gradient-to-r from-[#FF5B45] to-[#FF7854]' : 'bg-red-600');

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className={`flex justify-between text-xs mb-1 font-medium ${isLight ? 'text-[#5F6D7E]' : 'text-neutral-300'}`}>
          <span>{value} / {max}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={`w-full rounded-full h-2.5 overflow-hidden ${isLight ? 'bg-[#EEF2F6]' : 'bg-white/10 backdrop-blur-sm'}`}>
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ============================================================
// StatCard Component
// ============================================================
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  change?: number;
  unit?: string;
}

export function StatCard({ label, value, icon, change, unit }: StatCardProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <Card
      className={`flex flex-col gap-1 transition-all ${
        isLight
          ? 'hover:border-[#FF5B45]/40'
          : 'border-white/10 hover:border-red-500/30'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-[#334155]' : 'text-neutral-400'}`}>
          {label}
        </span>
        {icon && <div className={isLight ? 'text-[#FF5B45]' : 'text-rose-300'}>{icon}</div>}
      </div>
      <div className="flex items-baseline gap-1 mt-1">
        <span className={`text-2xl font-black ${isLight ? 'text-[#1A2238]' : 'text-white drop-shadow'}`}>
          {value}
        </span>
        {unit && <span className={`text-xs font-semibold ${isLight ? 'text-[#475569]' : 'text-neutral-400'}`}>{unit}</span>}
      </div>
      {change !== undefined && (
        <span
          className={`text-[11px] font-semibold mt-0.5 ${
            change >= 0
              ? isLight ? 'text-[#FF5B45]' : 'text-rose-300'
              : isLight ? 'text-[#475569]' : 'text-neutral-400'
          }`}
        >
          {change >= 0 ? '+' : ''}{change}% from last month
        </span>
      )}
    </Card>
  );
}

// ============================================================
// Tabs Component
// ============================================================
interface TabsProps {
  tabs: { id: string; label: string; icon?: ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex gap-1.5 glass-container rounded-2xl p-1.5 overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold tracking-wide whitespace-nowrap transition-all ${
            activeTab === tab.id
              ? 'glass-tab-active'
              : 'glass-tab-inactive'
          }`}
        >
          {tab.icon && <span>{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================
// ConfirmDialog Component
// ============================================================
interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: 'danger' | 'primary';
}

export function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmLabel = 'Confirm',
  variant = 'danger',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      <p className="text-neutral-200 mb-6 text-sm">{message}</p>
      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant={variant} onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}

export { ErrorBoundary } from './ErrorBoundary';
export * from './Icons';

