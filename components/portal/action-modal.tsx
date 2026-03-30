import type { ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import { SearchApproveIcon } from "@/components/portal/icons";
import { getTrainingInfo } from "@/lib/portal-data";
import type { ModalStage, PortalApplication } from "@/types/portal";

interface ActionModalProps {
  applications: PortalApplication[];
  batchTitle: string | null;
  disapprovalReason: string;
  modalStage: ModalStage;
  onApprove: () => void;
  onClose: () => void;
  onDisapprovalReasonChange: (value: string) => void;
  onDrop: (event: DragEvent<HTMLLabelElement>) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onOpenDisapprove: () => void;
  onOpenSignatureUpload: () => void;
  onShowNomination: (application: PortalApplication) => void;
  signaturePreview: string | null;
}

export function ActionModal({
  applications,
  batchTitle,
  disapprovalReason,
  modalStage,
  onApprove,
  onClose,
  onDisapprovalReasonChange,
  onDrop,
  onFileChange,
  onOpenDisapprove,
  onOpenSignatureUpload,
  onShowNomination,
  signaturePreview,
}: ActionModalProps) {
  if (!batchTitle) {
    return null;
  }

  const training = getTrainingInfo(batchTitle);
  const isApprove = modalStage === "approve";
  const isDisapprove = modalStage === "disapprove";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="portal-fade-up flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl dark:bg-slate-950">
        <div className="flex items-center justify-between bg-slate-900 px-6 py-5 text-white">
          <div>
            <h2 className="font-display text-xl font-bold">Review & Sign Batch</h2>
            <p className="text-sm text-slate-400">{batchTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"
            aria-label="Close modal"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M6 18 18 6" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="portal-scrollbar flex flex-1 flex-col overflow-y-auto md:flex-row">
          <div className="w-full border-r border-slate-200 p-8 md:w-1/2 dark:border-slate-800">
            <div className="mb-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
              <h4 className="mb-4 border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-500 dark:border-slate-800 dark:text-slate-400">
                Batch Nominees
              </h4>
              <div className="portal-scrollbar max-h-56 space-y-2 overflow-y-auto pr-2">
                {applications.map((application, index) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="min-w-0">
                      <span className="block truncate font-bold text-slate-800 dark:text-slate-100">
                        {index + 1}. {application.name}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {application.position} | {application.office}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onShowNomination(application)}
                      className="rounded-full border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 dark:border-blue-900/60 dark:text-blue-400 dark:hover:bg-blue-950/40"
                    >
                      View Form
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {!isApprove && !isDisapprove ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={onOpenDisapprove}
                  className="rounded-2xl border border-red-200 bg-red-50 py-4 font-bold text-red-600 transition hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  Disapprove Batch
                </button>
                <button
                  type="button"
                  onClick={onOpenSignatureUpload}
                  className="rounded-2xl border border-slate-900 bg-slate-900 py-4 font-bold text-white shadow-lg shadow-slate-200 transition hover:bg-slate-800 dark:border-slate-700 dark:shadow-none"
                >
                  Attach Signature
                </button>
              </div>
            ) : null}

            {isApprove ? (
              <div className="portal-fade-up">
                <label
                  className="mb-4 flex cursor-pointer flex-col items-center rounded-[1.5rem] border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:hover:bg-slate-900"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={onDrop}
                >
                  <p className="mb-2 font-bold text-slate-800 dark:text-slate-100">
                    Attach Authorized E-Signature
                  </p>
                  <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                    Signature will be applied to all memos in this batch.
                  </p>
                  <input
                    className="sr-only"
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                  />
                  {signaturePreview ? (
                    <Image
                      src={signaturePreview}
                      alt="Uploaded signature preview"
                      width={220}
                      height={64}
                      unoptimized
                      className="mb-4 h-16 w-auto object-contain mix-blend-multiply"
                    />
                  ) : null}
                  <span className="text-xs font-semibold text-blue-600 underline dark:text-blue-400">
                    Click to upload image
                  </span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 font-semibold text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onApprove}
                    disabled={!signaturePreview}
                    className="flex-[2] rounded-2xl bg-slate-900 py-3 font-bold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
                  >
                    Sign & Blast Memos
                  </button>
                </div>
              </div>
            ) : null}

            {isDisapprove ? (
              <div className="portal-fade-up rounded-[1.5rem] border border-red-100 bg-red-50 p-5 shadow-inner dark:border-red-900/60 dark:bg-red-950/20">
                <h4 className="mb-3 text-sm font-bold text-red-800 dark:text-red-300">
                  Reason for Batch Disapproval
                </h4>
                <textarea
                  rows={4}
                  value={disapprovalReason}
                  onChange={(event) => onDisapprovalReasonChange(event.target.value)}
                  placeholder="Specify reason... (Will be sent to all users in batch)"
                  className="mb-3 w-full rounded-2xl border border-red-200 bg-white p-3 text-sm text-slate-700 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:border-red-900/60 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-red-950"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-xl border border-slate-200 bg-white py-2 font-semibold text-slate-500 transition hover:text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onApprove}
                    className="flex-1 rounded-xl bg-red-600 py-2 font-bold text-white transition hover:bg-red-700"
                  >
                    Confirm Disapproval
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="w-full bg-slate-50/70 p-8 md:w-1/2 dark:bg-slate-900/40">
            <h3 className="mb-4 border-b border-slate-200 pb-2 text-lg font-bold uppercase tracking-[0.22em] text-slate-800 dark:border-slate-800 dark:text-slate-100">
              Training Information
            </h3>

            <div className="space-y-6">
              <div>
                <h4 className="mb-1 text-sm font-semibold text-blue-600 dark:text-blue-400">
                  Description/Objectives
                </h4>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {training.description}
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400">
                  Key Details
                </h4>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex gap-2">
                    <span className="min-w-24 font-bold text-slate-900 dark:text-slate-100">
                      Duration:
                    </span>
                    <span>{training.duration}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="min-w-24 font-bold text-slate-900 dark:text-slate-100">
                      Level:
                    </span>
                    <span>{training.level}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="min-w-24 font-bold text-slate-900 dark:text-slate-100">
                      Competency:
                    </span>
                    <span>{training.details.competencies}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="min-w-24 font-bold text-slate-900 dark:text-slate-100">
                      Target:
                    </span>
                    <span>{training.details.target}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="min-w-24 font-bold text-slate-900 dark:text-slate-100">
                      Cost:
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {training.details.cost}
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="min-w-24 font-bold text-slate-900 dark:text-slate-100">
                      Mode:
                    </span>
                    <span>{training.details.mode}</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-[1.5rem] border border-blue-100 bg-blue-50/70 p-5 dark:border-blue-900/60 dark:bg-blue-950/20">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-white/80 p-2 text-blue-600 shadow-sm dark:bg-slate-950/80 dark:text-blue-400">
                    <SearchApproveIcon className="h-5 w-5" />
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    The approval flow signs every memo in this batch and posts an admin message to each
                    nominee record in local storage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
