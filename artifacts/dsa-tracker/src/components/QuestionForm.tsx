import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Question, PLATFORMS, CONFIDENCE_LABELS } from "@/lib/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  platform: z.enum(["LeetCode", "GFG", "Codeforces", "NeetCode", "Other"]),
  tags: z.string(),
  approach: z.string(),
  timeComplexity: z.string().min(1, "Time complexity is required"),
  confidence: z.coerce.number().min(1).max(5),
  lastRevised: z.date(),
  mistakeNotes: z.string()
});

type FormValues = z.infer<typeof formSchema>;

interface QuestionFormProps {
  initialData?: Question;
  onSubmit: (data: Omit<Question, "id">) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function QuestionForm({ initialData, onSubmit, onCancel, isSubmitting }: QuestionFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      platform: initialData?.platform || "LeetCode",
      tags: initialData?.tags?.join(", ") || "",
      approach: initialData?.approach || "",
      timeComplexity: initialData?.timeComplexity || "O(n)",
      confidence: initialData?.confidence || 3,
      lastRevised: initialData ? new Date(initialData.lastRevised) : new Date(),
      mistakeNotes: initialData?.mistakeNotes || ""
    }
  });

  const handleSubmit = (values: FormValues) => {
    const tagsArray = values.tags
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onSubmit({
      name: values.name,
      platform: values.platform,
      tags: tagsArray,
      approach: values.approach,
      timeComplexity: values.timeComplexity,
      confidence: values.confidence as 1|2|3|4|5,
      lastRevised: values.lastRevised.toISOString(),
      mistakeNotes: values.mistakeNotes
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Two Sum" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Platform</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PLATFORMS.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (comma separated)</FormLabel>
                <FormControl>
                  <Input placeholder="Array, Hash Table, DP" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timeComplexity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time Complexity</FormLabel>
                <FormControl>
                  <Input placeholder="O(n)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confidence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confidence Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select confidence" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(v => (
                      <SelectItem key={v} value={v.toString()}>
                        {v} - {CONFIDENCE_LABELS[v as keyof typeof CONFIDENCE_LABELS]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastRevised"
            render={({ field }) => (
              <FormItem className="flex flex-col pt-2">
                <FormLabel>Last Revised</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="approach"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Approach</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your algorithm..." 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mistakeNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mistakes & Edge Cases</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="What did you forget? What edge cases failed?" 
                  className="min-h-[100px] border-destructive/50 focus-visible:ring-destructive/50"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Add Question"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
