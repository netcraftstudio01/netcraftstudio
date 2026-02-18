import { motion } from "framer-motion";
import { Database, Loader2, Zap, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DataLoadingProps {
  /** Custom message to display */
  message?: string;
  /** Show database status */
  showDatabaseStatus?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Loading type */
  type?: "spinner" | "skeleton" | "pulse";
}

/**
 * Enhanced loading component specifically for dynamic data
 */
export const DataLoading = ({
  message = "Loading dynamic content...",
  showDatabaseStatus = true,
  size = "md",
  type = "spinner"
}: DataLoadingProps) => {
  const sizeClasses = {
    sm: "text-sm gap-3",
    md: "text-base gap-4",
    lg: "text-lg gap-6"
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  if (type === "skeleton") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </div>
    );
  }

  if (type === "pulse") {
    return (
      <motion.div
        animate={{ 
          opacity: [0.3, 1, 0.3],
          scale: [0.98, 1, 0.98]
        }}
        transition={{ 
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity
        }}
        className={`flex flex-col items-center justify-center ${sizeClasses[size]} text-primary/60`}
      >
        <Database className={iconSizes[size]} />
        <span className="font-medium">{message}</span>
      </motion.div>
    );
  }

  // Spinner type (default)
  return (
    <div className={`flex flex-col items-center justify-center ${sizeClasses[size]}`}>
      {/* Animated Icons */}
      <div className="relative">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, ease: "linear", repeat: Infinity },
            scale: { duration: 1, ease: "easeInOut", repeat: Infinity }
          }}
          className={`${iconSizes[size]} text-primary`}
        >
          <Loader2 className="w-full h-full" />
        </motion.div>
        
        {showDatabaseStatus && (
          <>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5, 
                ease: "easeInOut", 
                repeat: Infinity,
                delay: 0.3
              }}
              className={`absolute -top-2 -right-2 w-4 h-4 text-secondary`}
            >
              <Database className="w-full h-full" />
            </motion.div>
            
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{ 
                duration: 1.2, 
                ease: "easeInOut", 
                repeat: Infinity,
                delay: 0.6
              }}
              className={`absolute -bottom-2 -left-2 w-3 h-3 text-accent`}
            >
              <Zap className="w-full h-full" />
            </motion.div>
          </>
        )}
      </div>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-muted-foreground font-medium text-center max-w-xs"
      >
        {message}
      </motion.p>

      {/* Status Indicators */}
      {showDatabaseStatus && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 text-xs text-muted-foreground"
        >
          <motion.div
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
            className="w-2 h-2 bg-green-500 rounded-full"
          />
          <span>Database connected</span>
          <Activity className="w-3 h-3" />
        </motion.div>
      )}

      {/* Progress Dots */}
      <div className="flex gap-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              repeat: Infinity,
              delay: index * 0.2
            }}
            className="w-1.5 h-1.5 bg-primary/50 rounded-full"
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Card skeleton for project/client loading states
 */
export const CardSkeleton = ({ type = "project" }: { type?: "project" | "client" }) => {
  if (type === "client") {
    return (
      <div className="p-6 bg-card rounded-lg border">
        <Skeleton className="h-12 w-24 mx-auto mb-3" />
        <Skeleton className="h-4 w-20 mx-auto" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="flex flex-wrap gap-2 mb-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-6 w-16" />
          ))}
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
};

/**
 * Grid skeleton for multiple items
 */
export const GridSkeleton = ({ 
  count = 6,
  type = "project",
  columns = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
}: {
  count?: number;
  type?: "project" | "client";
  columns?: string;
}) => (
  <div className={`grid ${columns} gap-6`}>
    {Array.from({ length: count }, (_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.1 }}
      >
        <CardSkeleton type={type} />
      </motion.div>
    ))}
  </div>
);

export default DataLoading;