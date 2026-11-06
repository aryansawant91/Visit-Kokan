import { z } from "zod";

export const reviewSchema = z.object({
  targetType: z.enum(["destination", "trek", "listing", "product"]),
  targetId: z.string().min(1, "Target ID is required"),
  targetName: z.string().optional(),
  userId: z.string().nullable().optional(),
  userName: z.string().min(2, "Name must be at least 2 characters"),
  userAvatar: z.string().optional(),
  rating: z.number().min(1).max(5),
  title: z.string().max(120).optional(),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
  travelerType: z.enum(["Solo", "Couple", "Family", "Friends Group", "Backpacker"]).optional(),
  visitMonth: z.string().optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
