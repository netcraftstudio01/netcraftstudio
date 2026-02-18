import { motion } from "framer-motion";

/**
 * Skeleton loading card for portfolio items
 * Displays animated placeholder while data is loading
 */
export const SkeletonCard = () => (
  <motion.div 
    className="gta-card overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    {/* Image skeleton */}
    <div className="relative aspect-video bg-muted animate-pulse" />
    
    {/* Content skeleton */}
    <div className="p-4 sm:p-5 md:p-6 space-y-3">
      {/* Category */}
      <div className="h-3 w-20 bg-muted rounded animate-pulse" />
      
      {/* Title */}
      <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
      
      {/* Description */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-muted rounded animate-pulse" />
        <div className="h-3 w-5/6 bg-muted rounded animate-pulse" />
      </div>
      
      {/* Tags */}
      <div className="flex gap-2 pt-2">
        <div className="h-6 w-16 bg-muted rounded animate-pulse" />
        <div className="h-6 w-20 bg-muted rounded animate-pulse" />
        <div className="h-6 w-14 bg-muted rounded animate-pulse" />
      </div>
    </div>
  </motion.div>
);

/**
 * Skeleton for team member cards
 */
export const TeamMemberSkeleton = () => (
  <motion.div 
    className="gta-card overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    {/* Avatar skeleton */}
    <div className="relative aspect-square bg-muted animate-pulse" />
    
    {/* Content skeleton */}
    <div className="p-3 sm:p-4 md:p-6 text-center space-y-2">
      <div className="h-4 w-3/4 mx-auto bg-muted rounded animate-pulse" />
      <div className="h-3 w-1/2 mx-auto bg-muted rounded animate-pulse" />
    </div>
  </motion.div>
);

/**
 * Skeleton for client logo carousel
 */
export const ClientLogoSkeleton = () => (
  <div className="flex-shrink-0">
    <div className="h-16 sm:h-20 w-24 sm:w-32 bg-muted rounded animate-pulse" />
  </div>
);

/**
 * Grid of skeleton cards for loading state
 */
export const SkeletonGrid = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

/**
 * Team members skeleton grid
 */
export const TeamSkeletonGrid = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <TeamMemberSkeleton key={i} />
    ))}
  </div>
);
