import SkeletonCard from "@/components/Loading/SkeletonCard";

export const generateSkeletons = (count) =>
  Array.from({ length: count }, (_, index) => <SkeletonCard key={index} />);
