"use client";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  console.error(error);
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
      </body>
    </html>
  );
}
