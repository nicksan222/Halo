export default function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="text-muted-foreground mt-2">The page you are looking for does not exist.</p>
      </div>
    </div>
  );
}
