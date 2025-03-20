export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-4 text-center sm:px-20">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-destructive">
              Authentication Error
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              There was an error with your authentication code. This can happen
              if:
            </p>
            <ul className="mt-4 list-disc text-left text-sm text-muted-foreground">
              <li className="ml-4">The code has expired</li>
              <li className="ml-4">The code has already been used</li>
              <li className="ml-4">The code is invalid</li>
            </ul>
            <div className="mt-8">
              <a
                href="/login"
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                Return to login
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
