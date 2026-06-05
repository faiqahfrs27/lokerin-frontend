import { useEffect } from "react";
import { useForm, useFieldArray, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import {
  planFormSchema,
  type PlanFormValues,
  type SubscriptionPlan,
} from "../../schemas/subscriptionPlanSchema";

interface Props {
  open: boolean;
  plan?: SubscriptionPlan | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: PlanFormValues) => void;
}

const DEFAULT_VALUES: PlanFormValues = {
  name: "",
  price: 0,
  features: [{ value: "" }],
};

function PlanFormModal({ open, plan, isSubmitting, onClose, onSubmit }: Props) {
  const isEdit = !!plan;

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  useEffect(() => {
    if (!open) return;
    form.reset(
      plan
        ? {
            name: plan.name,
            price: plan.price,
            features: plan.features.map((f) => ({ value: f })),
          }
        : DEFAULT_VALUES,
    );
  }, [open, plan, form]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal__head">
          <p className="modal__kicker">{isEdit ? "Edit plan" : "New plan"}</p>
          <h2 className="modal__title">
            {isEdit ? "Update subscription plan" : "Create subscription plan"}
          </h2>
        </header>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormBody
            form={form}
            fields={fields}
            append={() => append({ value: "" })}
            remove={remove}
          />
          <FormFoot
            isEdit={isEdit}
            isSubmitting={isSubmitting}
            onClose={onClose}
          />
        </form>
      </div>
    </div>
  );
}

function FormBody({
  form,
  fields,
  append,
  remove,
}: {
  form: UseFormReturn<PlanFormValues>;
  fields: { id: string }[];
  append: () => void;
  remove: (index: number) => void;
}) {
  const { register, formState } = form;
  const errors = formState.errors;

  return (
    <div className="modal__body">
      <div className="ff">
        <label className="ff-label">Plan name</label>
        <div className={`ff-input ${errors.name ? "is-error" : ""}`}>
          <input
            type="text"
            placeholder="e.g. Standard"
            {...register("name")}
          />
        </div>
        {errors.name && <span className="ff-err">{errors.name.message}</span>}
      </div>

      <div className="ff">
        <label className="ff-label">Price (IDR)</label>
        <div className={`ff-input ${errors.price ? "is-error" : ""}`}>
          <input
            type="number"
            placeholder="25000"
            {...register("price", { valueAsNumber: true })}
          />
        </div>
        {errors.price && <span className="ff-err">{errors.price.message}</span>}
      </div>

      <FeaturesField
        fields={fields}
        register={form.register}
        errors={errors}
        append={append}
        remove={remove}
      />
    </div>
  );
}

function FeaturesField({
  fields,
  register,
  errors,
  append,
  remove,
}: {
  fields: { id: string }[];
  register: UseFormReturn<PlanFormValues>["register"];
  errors: UseFormReturn<PlanFormValues>["formState"]["errors"];
  append: () => void;
  remove: (index: number) => void;
}) {
  return (
    <div className="ff">
      <label className="ff-label">Features</label>
      {fields.map((field, idx) => (
        <div key={field.id} className="ff-input" style={{ marginBottom: 6 }}>
          <input
            type="text"
            placeholder={`Feature ${idx + 1}`}
            {...register(`features.${idx}.value` as const)}
          />
          {fields.length > 1 && (
            <button
              type="button"
              className="ff-toggle"
              onClick={() => remove(idx)}
              aria-label="Remove feature"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ))}
      {errors.features && (
        <span className="ff-err">
          {errors.features.message || "Check feature fields"}
        </span>
      )}
      <button
        type="button"
        className="btn btn-ghost"
        style={{ alignSelf: "flex-start", fontSize: 12, padding: "6px 10px" }}
        onClick={append}
      >
        <Plus size={14} /> Add feature
      </button>
    </div>
  );
}

function FormFoot({
  isEdit,
  isSubmitting,
  onClose,
}: {
  isEdit: boolean;
  isSubmitting: boolean;
  onClose: () => void;
}) {
  return (
    <div className="modal__foot">
      <button
        type="button"
        className="modal__btn-cancel"
        onClick={onClose}
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : isEdit ? "Save changes" : "Create plan"}
      </button>
    </div>
  );
}

export default PlanFormModal;