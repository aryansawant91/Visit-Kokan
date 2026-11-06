"use client";

import ReviewList from "@/components/reviews/ReviewList";

interface Props {
  listingId: string;
  rating?: number;
  reviewCount?: number;
}

export default function ListingReviews({ listingId }: Props) {
  return (
    <div className="pt-2">
      <ReviewList
        targetType="listing"
        targetId={listingId}
        targetName="This Stay"
      />
    </div>
  );
}
