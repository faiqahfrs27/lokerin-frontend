import { useAddQuestion } from "../../hooks/useAssessmentDetail";

interface AddQuestionModalProps {
  assessmentId: string;
  onClose: () => void;
}

function AddQuestionModal({ assessmentId, onClose }: AddQuestionModalProps) {
  const { form, onSubmit, isPending } = useAddQuestion(assessmentId, onClose);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;
  const correctIndex = watch("correctIndex");

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <ModalHead />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal__body">
            <QuestionField register={register} error={errors.question?.message} />
            <OptionsFieldset
              register={register}
              correctIndex={correctIndex}
              setValue={setValue}
              errors={errors}
            />
          </div>
          <ModalFoot onCancel={onClose} isPending={isPending} />
        </form>
      </div>
    </div>
  );
}

function ModalHead() {
  return (
    <div className="modal__head">
      <p className="modal__kicker">Soal baru</p>
      <h2 className="modal__title">Tambah soal</h2>
    </div>
  );
}

function QuestionField({ register, error }: { register: any; error?: string }) {
  return (
    <div className="ff">
      <label className="ff-label">Pertanyaan</label>
      <textarea {...register("question")} className="ff-input" rows={3} placeholder="Tulis pertanyaan..." />
      {error && <p className="ff-error">{error}</p>}
    </div>
  );
}

function OptionsFieldset({ register, correctIndex, setValue, errors }: any) {
  return (
    <div className="ff">
      <label className="ff-label">Pilihan jawaban (klik radio untuk pilih jawaban benar)</label>
      <div className="add-q__options">
        {[0, 1, 2, 3].map((i) => (
          <OptionRow key={i} index={i} register={register} isCorrect={correctIndex === i} setValue={setValue} />
        ))}
      </div>
      {errors.options && <p className="ff-error">Semua opsi wajib diisi</p>}
    </div>
  );
}

function OptionRow({ index, register, isCorrect, setValue }: any) {
  const letter = String.fromCharCode(65 + index);
  return (
    <div className="add-q__option-row">
      <input
        type="radio"
        checked={isCorrect}
        onChange={() => setValue("correctIndex", index, { shouldValidate: true })}
        className="add-q__radio"
      />
      <span className="add-q__letter">{letter}.</span>
      <input {...register(`options.${index}`)} className="ff-input" placeholder={`Opsi ${letter}`} />
    </div>
  );
}

function ModalFoot({ onCancel, isPending }: { onCancel: () => void; isPending: boolean }) {
  return (
    <div className="modal__foot">
      <button type="button" className="modal__btn-cancel" onClick={onCancel}>
        Batal
      </button>
      <button type="submit" className="dev-btn-primary" disabled={isPending}>
        {isPending ? "Menyimpan..." : "Simpan soal"}
      </button>
    </div>
  );
}

export default AddQuestionModal;