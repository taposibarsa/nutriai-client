"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { apiFetch, ApiError } from "@/lib/api";
import {
  CONTACT_SUBJECTS,
  contactSchema,
  type ContactFormValues,
} from "@/lib/validations";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "General",
      message: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    try {
      await apiFetch<{ success: boolean }>("/api/contact", {
        method: "POST",
        body: JSON.stringify(values),
      });
      toast.success("Message sent! We'll reply within 24 hours.");
      reset({ name: "", email: "", subject: "General", message: "" });
    } catch (error) {
      const msg =
        error instanceof ApiError
          ? error.message
          : "Could not send your message. Please try again.";
      toast.error(msg);
    }
  }

  const fieldClass =
    "mt-1 w-full rounded-xl border border-forest/15 bg-white px-4 py-2.5 text-sm text-foreground outline-none focus:border-forest/40";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="contact-name" className="text-sm font-semibold text-foreground">
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          className={fieldClass}
          {...register("name")}
        />
        {errors.name ? (
          <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-email" className="text-sm font-semibold text-foreground">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          className={fieldClass}
          {...register("email")}
        />
        {errors.email ? (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-subject" className="text-sm font-semibold text-foreground">
          Subject
        </label>
        <select
          id="contact-subject"
          className={fieldClass}
          {...register("subject")}
        >
          {CONTACT_SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.subject ? (
          <p className="mt-1 text-xs text-red-600">{errors.subject.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-message" className="text-sm font-semibold text-foreground">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          className={`${fieldClass} resize-y`}
          {...register("message")}
        />
        {errors.message ? (
          <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
        ) : null}
      </div>

      <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto">
        Send Message
      </Button>
    </form>
  );
}
