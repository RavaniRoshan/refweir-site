import React, { useEffect, useRef } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
}

function CloseIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ShieldCheckIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LockIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function EyeOffIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FileTextIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="10 9 9 9 8 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckCircleIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export const PrivacyModal: React.FC<ModalProps> = ({ open, onClose }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      ref={ref}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
    >
      <div className="w-full max-w-2xl bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheckIcon className="size-5" />
            </div>
            <div>
              <h2 id="privacy-modal-title" className="text-base font-semibold text-white">
                Zero-Telemetry & Privacy Guarantee
              </h2>
              <p className="text-xs text-neutral-400">
                100% On-Premise Self-Hosted Source Control & Agent Sovereignty
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-neutral-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-emerald-400 text-xs uppercase tracking-wider">
              <CheckCircleIcon className="size-4" />
              Air-Gap & Sovereign Data Commitment
            </div>
            <p className="text-xs text-neutral-300">
              Refweir is built from the ground up for strict air-gapped and sovereign environments.
              It operates with zero external network dependencies, emits zero outbound telemetry, and runs no analytics beacons.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <EyeOffIcon className="size-4 text-sky-400" />
              1. Zero Phone-Home Telemetry
            </h3>
            <p className="text-xs text-neutral-400">
              Unlike cloud-hosted SaaS developer platforms, Refweir does not collect user behavior,
              file metrics, repository contents, or agent prompts. Every query, commit, diff, and audit log
              remains strictly confined to your on-premise SQLite WAL and local bare Git repositories.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <LockIcon className="size-4 text-amber-400" />
              2. Agent Capability Lease Boundaries
            </h3>
            <p className="text-xs text-neutral-400">
              Autonomous AI coding agents operate under short-lived, cryptographically signed capability leases
              (Ed25519 or HMAC-SHA256). All lease verifications, branch constraints, and revocation checks are
              evaluated in-process with zero third-party cloud validation calls.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <FileTextIcon className="size-4 text-purple-400" />
              3. Complete Customer Data Ownership
            </h3>
            <p className="text-xs text-neutral-400">
              Your organization maintains 100% intellectual property ownership of all source code, commit DAGs,
              PR comments, and webhook configurations. You retain the unrestricted right to inspect, export, or
              backup the SQLite metadata database and Git object directories at any time.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-neutral-400">
          <span>Compliant with SOC 2 CC6.1 & ISO/IEC 27001 A.8.15</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  )
}

export const TermsModal: React.FC<ModalProps> = ({ open, onClose }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-modal-title"
      ref={ref}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
    >
      <div className="w-full max-w-2xl bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <FileTextIcon className="size-5" />
            </div>
            <div>
              <h2 id="terms-modal-title" className="text-base font-semibold text-white">
                Software Terms & Licensing
              </h2>
              <p className="text-xs text-neutral-400">
                Self-Hosted Enterprise & Open Source Usage Terms
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-neutral-300 leading-relaxed">
          <div className="space-y-3">
            <h3 className="font-semibold text-white text-sm">1. Open Source License (Apache 2.0)</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Refweir is licensed under the Apache License, Version 2.0. You may freely run, inspect,
              modify, and distribute the binary and source artifacts within on-premise, hybrid, or sovereign
              infrastructures, subject to standard license attribution.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-white text-sm">2. Autonomous AI Agent Operations</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Operators are responsible for defining repository capability lease parameters, permissions,
              and branch protection rulesets. Refweir provides cryptographic lease containment boundaries, but
              does not warrant the correctness or security of source code synthesized by connected AI models.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-white text-sm">3. High Availability & Data Persistence</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Refweir uses pure-Go SQLite with WAL mode and bare Git repositories. Operators are advised to
              configure periodic snapshots (`VACUUM INTO`) and volume replication for production disaster recovery.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-neutral-400">
          <span>Version 2026.11 • Apache License 2.0</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
