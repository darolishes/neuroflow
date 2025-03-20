/**
 * @module Loading
 * @fileoverview Reusable loading spinner component
 * @since 1.0.0
 */

export function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <div className="text-xl font-medium text-muted-foreground">
          Loading...
        </div>
      </div>
    </div>
  );
}
