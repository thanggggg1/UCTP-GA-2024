"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GAConfig } from "@/config/setting.config";
import { Switch } from "@/components/ui/switch";
import { TrashIcon } from "lucide-react";
import { useCallback, useEffect } from "react";
import {
  useCreateSettingMutation,
  useGetSettingByIdQuery,
  useUpdateSettingMutation,
} from "@/store/APIs/settings";
import { useGetCurrentUserQuery } from "@/store/APIs/user";
import { useCreateStatusMessages } from "@/hooks/useStatusMessage";

const formSchema = z.object({
  maximum_generations: z.number().nonnegative().int(),
  minimum_population: z.number().nonnegative().int(),
  elite_percent: z.number().nonnegative(),
  ending_time: z.number().nonnegative().int(),
  generation_tolerance: z.number().nonnegative().int(),
  deviation_tolerance: z.number().nonnegative().int(),
  lunchbreak: z.boolean(),
  starting_time: z.number().nonnegative().int(),
  idle_time: z.number().nonnegative(),
  subject_placement: z.number().nonnegative(),
  mutation_rate_adjustment_trigger: z.number().nonnegative(),
  mutation_rate_base: z.number().nonnegative(),
  mutation_rate_step: z.number().nonnegative(),
  maximum_population: z.number().nonnegative().int(),
  maximum_fitness: z.number().nonnegative(),
  timeslots: z.array(z.string()),
});

const defaultValues: Partial<ISetting> = GAConfig;

export function ScheduleForm() {
  const form = useForm<ISetting>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });
  const { data: currentUser } = useGetCurrentUserQuery();

  const [
    create,
    {
      isError: isCreateError,
      isLoading: isLoadingCreate,
      isSuccess: isSuccessCreate,
      error: createError,
    },
  ] = useCreateSettingMutation();

  const [
    update,
    {
      isError: isUpdateError,
      isLoading: isLoadingUpdate,
      isSuccess: isSuccessUpdate,
      error: updateError,
    },
  ] = useUpdateSettingMutation();

  const { data: currentSetting } = useGetSettingByIdQuery({
    university_id: currentUser?.UniversityID || "",
  });

  const { fields, append, remove } = useFieldArray({
    //@ts-ignore
    name: "timeslots",
    control: form.control,
  });

  useCreateStatusMessages({
    isLoading: isLoadingCreate,
    isError: isCreateError,
    isSuccess: isSuccessCreate,
    error: createError,
    title: "Settings",
    action: "Create",
  });

  useCreateStatusMessages({
    isLoading: isLoadingUpdate,
    isError: isUpdateError,
    isSuccess: isSuccessUpdate,
    error: updateError,
    title: "Settings",
    action: "Update",
  });

  useEffect(() => {
    if (currentSetting) {
      form.reset(currentSetting);
    }
  }, [currentSetting]);

  const onSubmit = useCallback(
    async (data: ISetting) => {
      if (currentSetting?.id) {
        await update({
          ...data,
          university_id: Number(currentUser?.UniversityID) || 0,
          id: currentSetting.id,
        });
      } else {
        await create({
          ...data,
          university_id: Number(currentUser?.UniversityID) || 0,
        });
      }
    },
    [currentSetting, currentUser]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4">
            <FormField
              control={form.control}
              name="maximum_generations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum generation</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Maximum generation"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    The limit of how many generations the algorithm can produce.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minimum_population"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum population</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Minimum population"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    The minimum and starting number of chromosomes in a
                    generation. Fifty (50) is the suggested value{" "}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="elite_percent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Elite percent</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Elite percent"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    The percent of how much of the current population’s best
                    performing
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ending_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ending time</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ending time"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="generation_tolerance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Generation Tolerance</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Generation Tolerance"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deviation_tolerance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Devitaion tolerance</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Devitaion tolerance"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Measures the richness of the population’s solution set
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lunchbreak"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lunch break</FormLabel>
                  <FormControl>
                    <Switch
                      className="ml-2 mt-4"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="p-4">
            <FormField
              control={form.control}
              name="starting_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Starting time</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Starting time"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="idle_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Idle time</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Idle time"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject_placement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject placement</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Subject placement"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mutation_rate_adjustment_trigger"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mutation rate adjustment trigger</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Mutation rate adjustment trigger"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mutation_rate_base"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mutation rate base</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Mutation rate base"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mutation_rate_step"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mutation rate step</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Mutation rate step"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maximum_population"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum population</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Maximum population"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maximum_fitness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum fitness</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Maximum fitness"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="p-4">
            <div>
              {fields.map((field, index) => (
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`timeslots.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && "sr-only")}>
                        Time slots
                      </FormLabel>
                      <FormDescription className={cn(index !== 0 && "sr-only")}>
                        Add time slots for each day
                      </FormDescription>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <Button
                          type="button"
                          size={"sm"}
                          onClick={() => remove(index)}
                          className="button bg-red-300 text-white hover:bg-red-500"
                        >
                          <TrashIcon size={12} />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ value: "" })}
              >
                Add Time slots
              </Button>
            </div>
          </div>
        </div>
        <Button type="submit">Update setting</Button>
      </form>
    </Form>
  );
}
