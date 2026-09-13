"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCompanion } from "@/lib/companion.action";

const formSchema = z.object({
  name: z.string().min(1, "Name is required."),
  subject: z.string().min(1, "Subject is required."),
  topic: z.string().min(1, "Topic is required."),
  voice: z.string().min(1, "Voice is required."),
  style: z.string().min(1, "Style is required."),
  duration: z.coerce.number().min(1, "Duration is required."),
});

type FormInput = z.input<typeof formSchema>;
type FormValues = z.output<typeof formSchema>;

const CompanionForm = () => {
  const router = useRouter();

  const form = useForm<FormInput, any, FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subject: "",
      topic: "",
      voice: "",
      style: "",
      duration: 15,
    },
  });

  const onSubmit = async (data: FormValues) => {
    const companion = await createCompanion(data);

    if (companion) {
      router.push(`/companions/${companion.id}`);
    } else {
      console.log("Failed to create companion");
      router.push("/companions/new");
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Companion Name */}
      <div>
        <label htmlFor="name">Companion Name</label>

        <Input
          id="name"
          placeholder="Enter the companion name"
          {...form.register("name")}
        />

        {form.formState.errors.name && (
          <p className="text-sm text-red-500">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject">Subject</label>

        <Input
          id="subject"
          placeholder="Enter the subject"
          {...form.register("subject")}
        />

        {form.formState.errors.subject && (
          <p className="text-sm text-red-500">
            {form.formState.errors.subject.message}
          </p>
        )}
      </div>

      {/* Topic */}
      <div>
        <label htmlFor="topic">
          What should the companion help with?
        </label>

        <Input
          id="topic"
          placeholder="Ex. Derivatives & Integrals"
          {...form.register("topic")}
        />

        {form.formState.errors.topic && (
          <p className="text-sm text-red-500">
            {form.formState.errors.topic.message}
          </p>
        )}
      </div>

      {/* Voice */}
      <div>
        <label htmlFor="voice">Voice</label>

        <select
          id="voice"
          {...form.register("voice")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Select the voice</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        {form.formState.errors.voice && (
          <p className="text-sm text-red-500">
            {form.formState.errors.voice.message}
          </p>
        )}
      </div>

      {/* Style */}
      <div>
        <label htmlFor="style">Style</label>

        <select
          id="style"
          {...form.register("style")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Select the style</option>
          <option value="formal">Formal</option>
          <option value="casual">Casual</option>
        </select>

        {form.formState.errors.style && (
          <p className="text-sm text-red-500">
            {form.formState.errors.style.message}
          </p>
        )}
      </div>

      {/* Duration */}
      <div>
        <label htmlFor="duration">
          Estimated session duration in minutes
        </label>

        <Input
          id="duration"
          type="number"
          placeholder="15"
          {...form.register("duration")}
        />

        {form.formState.errors.duration && (
          <p className="text-sm text-red-500">
            {form.formState.errors.duration.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full cursor-pointer"
      >
        Build your companion
      </Button>
    </form>
  );
};

export default CompanionForm;